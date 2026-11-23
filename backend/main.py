"""
FastAPI 主應用程式入口 (Backend Main Entrypoint)
全球科技硬體與半導體供應鏈全景圖譜分析 API
"""

import sqlite3
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "atlas.db"

app = FastAPI(
    title="Tech Supply Chain Atlas API",
    description="全球科技硬體與半導體 8 大層級供應鏈圖譜分析引擎",
    version="0.1.0",
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
