# 全球半導體與科技硬體供應鏈全景圖譜 (Tech Supply Chain Atlas)

## 1. 專案願景與客群定位
專案旨在為**初學者**、**求職者**與**投資人**建立一個具備計量經濟學深度與嚴格產業邏輯的「全球科技硬體與半導體供應鏈全景互動圖譜」。

- **初學者**：透過視覺化力導向圖（Force-directed Graph）與 8 大層級橫切面，直觀理解一顆晶片如何從沙子（SiO2）演變為終端 AI 伺服器與智慧手機。
- **求職者**：掌握全球半導體分工拓撲圖、各環節代表性企業（Tier 1/2）、關鍵技術壁壘與核心職缺分布。
- **投資人**：透視供應鏈上下游營收曝險（Revenue Exposure）、單一供貨脆弱度（Single-source Bottlenecks）、地緣政治管制衝擊（Export Controls & Sanctions）與替代彈性指標。

---

## 2. 系統架構設計

```
+-----------------------------------------------------------+
|               前端互動層 (Frontend - React + Vite)         |
|  - 3D/2D 力導向圖形視圖 (GraphView: @antv/g6 或 React Flow)|
|  - 八大層級導航過濾器 (LayerNav: L1 到 L8)                  |
|  - 節點深度洞察側邊欄 (DetailPanel: 財務/計量/依賴指標)   |
|  - 斷鏈衝擊模擬器 (Shock Propagation Simulator)           |
+-----------------------------------------------------------+
                             |
                    REST / JSON-RPC
                             v
+-----------------------------------------------------------+
|              後端分析引擎 (Backend - FastAPI / Python)     |
|  - 圖形拓撲分析 (NetworkX / Centrality / PageRank)        |
|  - 投入產出衝擊傳導 (Leontief Inverse Shock Model)        |
|  - 地緣政治篩選引擎 (Sanctions & Export Control Filter)   |
|  - 資料快取與面板資料彙總                                 |
+-----------------------------------------------------------+
                             |
                    SQLAlchemy / asyncpg
                             v
+-----------------------------------------------------------+
|           資料持久層 (Database - PostgreSQL / SQLite)     |
|  - Layers / Subsectors: 產業分類學主檔                    |
|  - Companies: 財務與基本面數據                             |
|  - Nodes: 圖譜實體節點 (公司/產品/原料/技術)             |
|  - Edges: 有向加權依賴邊 (權重/交期/替代彈性/營收曝險)    |
|  - Geopolitical_Restrictions: 制裁與技術清單標籤          |
+-----------------------------------------------------------+
```

---

## 3. 目錄結構綱要

- `backend/`
  - `app/api/v1/`: API 路由與端點
  - `app/core/`: 系統設定與資料庫連線
  - `app/models/`: SQLAlchemy ORM 模型
  - `app/schemas/`: Pydantic 輸入輸出資料校驗
  - `migrations/`: 資料庫 DDL 與升級遷移腳本 (`schema.sql`)
- `frontend/`
  - `src/components/GraphView/`: 圖譜視覺化畫布
  - `src/components/LayerNav/`: 8 大層級階梯式導航器
  - `src/components/DetailPanel/`: 節點詳細資訊、上游依賴者與下游客戶名單
  - `src/types/`: TypeScript 型別定義
- `data/`
  - `taxonomy/8_layers_definition.json`: 八大層級與次產業標準規範（正交無遺漏 MECE 原則）
  - `seed/`: 初始節點與依賴關係種子資料集
- `docs/`
  - `ARCHITECTURE.md`: 技術與系統設計架構
  - `ECONOMETRIC_FRAMEWORK.md`: 計量分析與衝擊傳導數學模型規範
