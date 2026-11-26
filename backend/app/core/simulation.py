"""
供應鏈衝擊傳導與系統性風險分析引擎 (Leontief Supply Chain Shock Engine)
基於投入產出矩陣、替代彈性 (CES) 與網絡拓撲級數展開
"""

import sqlite3
import json
from pathlib import Path
from typing import Dict, List, Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "atlas.db"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def simulate_supply_shock(
    trigger_node_id: str,
    shock_magnitude_pct: float,
    max_depth: int = 5
) -> Dict[str, Any]:
    """
    執行單點或多點外生斷鏈衝擊模擬
    :param trigger_node_id: 外生衝擊源節點 ID (e.g. 'COMP_TSMC')
    :param shock_magnitude_pct: 產能中斷幅度 (1.0 ~ 100.0)
    :param max_depth: 最大傳導階數 (預設 5 階)
    :return: 傳導報告與受衝擊節點清單
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. 取得所有節點與其替代彈性、市值與層級
    cursor.execute("""
        SELECT n.node_id, n.name_zh, n.name_en, n.layer_id, n.elasticity_score, n.metadata
        FROM nodes n
    """)
    nodes_data = {row["node_id"]: dict(row) for row in cursor.fetchall()}

    if trigger_node_id not in nodes_data:
        conn.close()
        raise ValueError(f"節點不存在: {trigger_node_id}")

    # 解析 metadata
    for nid, nd in nodes_data.items():
        if nd.get("metadata") and isinstance(nd["metadata"], str):
            try:
                nd["metadata"] = json.loads(nd["metadata"])
            except Exception:
                nd["metadata"] = {}

    # 2. 取得所有有向邊
    cursor.execute("""
        SELECT source_node_id, target_node_id, relation_type, dependency_weight, 
               lead_time_days, is_single_source
        FROM edges
    """)
    edges = [dict(row) for row in cursor.fetchall()]
    conn.close()

    # 建立下游相鄰表: 誰依賴 source? (source 供給 target，若 source 中斷，target 受損)
    # downstream[source] = list of (target, weight, lead_time, is_single_source)
    downstream: Dict[str, List[Dict[str, Any]]] = {}
    for e in edges:
        src = e["source_node_id"]
        tgt = e["target_node_id"]
        if src not in downstream:
            downstream[src] = []
        downstream[src].append(e)

    # 3. 網絡波前廣度優先傳導 (Wavefront Propagation with Attenuation)
    # impact_map[node_id] = { severity_pct, depth, cumulative_lead_time, bottleneck_trace }
    impact_map: Dict[str, Dict[str, Any]] = {
        trigger_node_id: {
            "node_id": trigger_node_id,
            "name_zh": nodes_data[trigger_node_id]["name_zh"],
            "layer_id": nodes_data[trigger_node_id]["layer_id"],
            "severity_pct": round(shock_magnitude_pct, 2),
            "depth": 0,
            "cumulative_lead_time_days": 0,
            "is_trigger": True,
            "path": [trigger_node_id],
        }
    }

    queue = [(trigger_node_id, shock_magnitude_pct, 0, 0, [trigger_node_id])]

    while queue:
        curr_id, curr_severity, depth, lead_time, path = queue.pop(0)

        if depth >= max_depth:
            continue

        # 取得當前節點對下游的供給連線
        outgoing = downstream.get(curr_id, [])
        for edge in outgoing:
            target_id = edge["target_node_id"]
            if target_id not in nodes_data:
                continue

            target_node = nodes_data[target_id]
            curr_node = nodes_data[curr_id]

            # 依賴度 a_ij
            dep_weight = float(edge["dependency_weight"] or 0.5)

            # 剛性修正因子: 若供應商 curr_node 的替代彈性極低 (接近 0)，懲罰放大
            elasticity = float(curr_node.get("elasticity_score") or 0.3)
            rigidity_factor = 1.0 - (0.6 * elasticity)  # 0.4 ~ 1.0

            # 單一獨家供應商加權
            single_source_boost = 1.25 if edge.get("is_single_source") else 1.0

            # 計算傳導至下游的受損比例
            propagated_severity = curr_severity * dep_weight * rigidity_factor * single_source_boost
            propagated_severity = min(propagated_severity, 100.0)

            # 若衝擊小於 2% 則視為邊緣雜訊，截斷傳導
            if propagated_severity < 2.0:
                continue

            total_edge_lead_time = lead_time + (edge.get("lead_time_days") or 30)
            new_path = path + [target_id]

            # 若該下游節點尚未受衝擊，或新路徑造成更嚴重的受損
            if target_id not in impact_map or propagated_severity > impact_map[target_id]["severity_pct"]:
                impact_map[target_id] = {
                    "node_id": target_id,
                    "name_zh": target_node["name_zh"],
                    "layer_id": target_node["layer_id"],
                    "severity_pct": round(propagated_severity, 2),
                    "depth": depth + 1,
                    "cumulative_lead_time_days": total_edge_lead_time,
                    "is_trigger": False,
                    "path": new_path,
                }
                queue.append((target_id, propagated_severity, depth + 1, total_edge_lead_time, new_path))

    # 4. 統計整體供應鏈市值曝險損失
    total_market_cap_loss_bil = 0.0
    affected_nodes = sorted(impact_map.values(), key=lambda x: x["severity_pct"], reverse=True)

    for item in affected_nodes:
        nid = item["node_id"]
        mcap = nodes_data[nid].get("metadata", {}).get("market_cap_bil", 0.0) or 0.0
        est_loss = mcap * (item["severity_pct"] / 100.0) * 0.15  # 依營收受損預估價值衝擊
        item["market_cap_bil"] = mcap
        item["est_value_loss_bil"] = round(est_loss, 2)
        total_market_cap_loss_bil += est_loss

    # 5. 彙整各層級受衝擊統計
    layer_summary: Dict[int, Dict[str, Any]] = {}
    for item in affected_nodes:
        lid = item["layer_id"]
        if lid not in layer_summary:
            layer_summary[lid] = {"layer_id": lid, "count": 0, "avg_severity_pct": 0.0, "total_severity": 0.0}
        layer_summary[lid]["count"] += 1
        layer_summary[lid]["total_severity"] += item["severity_pct"]

    for lid, s in layer_summary.items():
        s["avg_severity_pct"] = round(s["total_severity"] / s["count"], 2)

    return {
        "trigger_node": nodes_data[trigger_node_id],
        "shock_magnitude_pct": shock_magnitude_pct,
        "affected_count": len(affected_nodes),
        "total_estimated_value_loss_bil": round(total_market_cap_loss_bil, 2),
        "max_propagation_depth": max(x["depth"] for x in affected_nodes),
        "layer_summary": list(layer_summary.values()),
        "affected_nodes": affected_nodes,
    }


def calculate_systemic_risk_index() -> List[Dict[str, Any]]:
    """
    計算全網所有節點的「系統性風險脆弱度指數」(Systemic Risk Ranking)
    模擬若每檔企業遭受 50% 產能中斷，全網波及的下游深度與估計產值損失
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT node_id, name_zh, layer_id FROM nodes")
    all_nodes = [dict(row) for row in cursor.fetchall()]
    conn.close()

    risk_rankings = []
    for n in all_nodes:
        try:
            res = simulate_supply_shock(n["node_id"], 50.0, max_depth=4)
            risk_rankings.append({
                "node_id": n["node_id"],
                "name_zh": n["name_zh"],
                "layer_id": n["layer_id"],
                "downstream_affected_count": res["affected_count"] - 1,
                "systemic_value_loss_bil": res["total_estimated_value_loss_bil"],
                "max_depth": res["max_propagation_depth"],
            })
        except Exception:
            continue

    # 依波及總損失排序
    risk_rankings.sort(key=lambda x: x["systemic_value_loss_bil"], reverse=True)
    return risk_rankings
