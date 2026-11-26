"""
FastAPI 主應用程式入口 (Backend Main Entrypoint)
全球科技硬體與半導體供應鏈全景圖譜分析 API
"""

import sqlite3
import json
from pathlib import Path
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.simulation import simulate_supply_shock, calculate_systemic_risk_index

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "atlas.db"

app = FastAPI(
    title="Tech Supply Chain Atlas API",
    description="全球科技硬體與半導體 8 大層級供應鏈圖譜與 Leontief 衝擊分析引擎",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "Tech Supply Chain Atlas API"}


@app.get("/api/v1/layers")
def get_layers():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM layers ORDER BY layer_id ASC")
    layers = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"data": layers}


@app.get("/api/v1/graph")
def get_full_graph():
    """取得圖譜全貌 (節點與加權依賴邊)"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM nodes")
    raw_nodes = cursor.fetchall()
    nodes = []
    for row in raw_nodes:
        d = dict(row)
        if d.get("metadata"):
            try:
                d["metadata"] = json.loads(d["metadata"])
            except Exception:
                pass
        nodes.append(d)

    cursor.execute("SELECT * FROM edges")
    edges = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
        },
    }


class ShockRequest(BaseModel):
    node_id: str = Field(..., description="外生衝擊源節點 ID, 如 'COMP_TSMC'")
    shock_pct: float = Field(30.0, ge=1.0, le=100.0, description="產能受損百分比 (1.0 ~ 100.0)")
    max_depth: int = Field(5, ge=1, le=10, description="最大傳導階數")


@app.post("/api/v1/simulate/shock")
def run_shock_simulation(req: ShockRequest):
    """
    執行單點斷鏈衝擊模擬 (Leontief Wavefront 衝擊傳導)
    """
    try:
        result = simulate_supply_shock(
            trigger_node_id=req.node_id,
            shock_magnitude_pct=req.shock_pct,
            max_depth=req.max_depth
        )
        return {"status": "success", "data": result}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"衝擊模擬運算失敗: {str(e)}")


@app.get("/api/v1/simulate/systemic-risk")
def get_systemic_risk_rankings():
    """
    取得全供應鏈節點之系統性風險脆弱度排行 (Systemic Risk Ranking)
    """
    try:
        rankings = calculate_systemic_risk_index()
        return {"status": "success", "data": rankings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"系統性風險評估失敗: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
