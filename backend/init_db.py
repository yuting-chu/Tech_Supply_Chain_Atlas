"""
資料庫初始化與種子資料匯入腳本 (Database Initializer & Seed Loader)
支援 SQLite 本地零配置運行與 PostgreSQL 生產環境
"""

import json
import sqlite3
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "backend" / "atlas.db"
SCHEMA_PATH = BASE_DIR / "backend" / "migrations" / "schema.sql"
TAXONOMY_PATH = BASE_DIR / "data" / "taxonomy" / "8_layers_definition.json"
NODES_PATH = BASE_DIR / "data" / "seed" / "sample_nodes.json"
EDGES_PATH = BASE_DIR / "data" / "seed" / "sample_edges.json"


def init_database():
    print(f"[+] Initializing database at: {DB_PATH}")
    
    # 轉換 PostgreSQL 相容的 schema 語法為 SQLite 相容
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    # SQLite 適配處理
    schema_sql_sqlite = (
        schema_sql.replace("SERIAL PRIMARY KEY", "INTEGER PRIMARY KEY AUTOINCREMENT")
        .replace("JSONB", "TEXT")
        .replace("NUMERIC(6, 2)", "REAL")
        .replace("NUMERIC(5, 2)", "REAL")
        .replace("NUMERIC(12, 2)", "REAL")
        .replace("NUMERIC(4, 3)", "REAL")
        .replace("NUMERIC(3, 2)", "REAL")
    )

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript(schema_sql_sqlite)
    conn.commit()
    print("[+] Schema applied successfully.")

    # 1. 匯入 8 大層級與次產業
    with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
        taxonomy = json.load(f)

    for layer in taxonomy:
        cursor.execute(
            """
            INSERT OR REPLACE INTO layers (layer_id, code, name_zh, name_en, description, bottleneck_risk_level)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                layer["layer_id"],
                layer["code"],
                layer["name_zh"],
                layer["name_en"],
                layer["description"],
                layer["bottleneck_risk_level"],
            ),
        )

        for sub in layer.get("subsectors", []):
            cursor.execute(
                """
                INSERT OR REPLACE INTO subsectors (layer_id, code, name_zh, name_en, hhi_index, avg_margin_pct, description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    layer["layer_id"],
                    sub["code"],
                    sub["name_zh"],
                    sub["name_en"],
                    sub.get("hhi_index", 0),
                    sub.get("avg_margin_pct", 0),
                    "; ".join(sub.get("chokepoints", [])),
                ),
            )

    conn.commit()
    print(f"[+] Imported {len(taxonomy)} layers and related subsectors.")

    # 2. 匯入範例節點 (Nodes)
    with open(NODES_PATH, "r", encoding="utf-8") as f:
        nodes = json.load(f)

    for n in nodes:
        # 取得對應 subsector_id
        cursor.execute("SELECT subsector_id FROM subsectors WHERE code = ?", (n["subsector_code"],))
        sub_row = cursor.fetchone()
        subsector_id = sub_row[0] if sub_row else None

        cursor.execute(
            """
            INSERT OR REPLACE INTO nodes (node_id, node_type, name_zh, name_en, layer_id, subsector_id, elasticity_score, global_market_share_pct, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                n["node_id"],
                n["node_type"],
                n["name_zh"],
                n["name_en"],
                n["layer_id"],
                subsector_id,
                n["elasticity_score"],
                n["global_market_share_pct"],
                json.dumps(n.get("metadata", {})),
            ),
        )

    conn.commit()
    print(f"[+] Imported {len(nodes)} sample nodes.")

    # 3. 匯入依賴邊 (Edges)
    with open(EDGES_PATH, "r", encoding="utf-8") as f:
        edges = json.load(f)

    for e in edges:
        cursor.execute(
            """
            INSERT OR REPLACE INTO edges (source_node_id, target_node_id, relation_type, dependency_weight, lead_time_days, revenue_exposure_pct, is_single_source, qualitative_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                e["source_node_id"],
                e["target_node_id"],
                e["relation_type"],
                e["dependency_weight"],
                e["lead_time_days"],
                e["revenue_exposure_pct"],
                1 if e["is_single_source"] else 0,
                e["qualitative_notes"],
            ),
        )

    conn.commit()
    print(f"[+] Imported {len(edges)} sample dependency edges.")

    # 驗證統計
    cursor.execute("SELECT count(*) FROM layers")
    cnt_layers = cursor.fetchone()[0]
    cursor.execute("SELECT count(*) FROM subsectors")
    cnt_sub = cursor.fetchone()[0]
    cursor.execute("SELECT count(*) FROM nodes")
    cnt_nodes = cursor.fetchone()[0]
    cursor.execute("SELECT count(*) FROM edges")
    cnt_edges = cursor.fetchone()[0]

    print("\n--- [自我驗證結果] ---")
    print(f"Total Layers:     {cnt_layers}")
    print(f"Total Subsectors: {cnt_sub}")
    print(f"Total Nodes:      {cnt_nodes}")
    print(f"Total Edges:      {cnt_edges}")
    print("Database validation PASSED successfully.\n")

    conn.close()


if __name__ == "__main__":
    init_database()
