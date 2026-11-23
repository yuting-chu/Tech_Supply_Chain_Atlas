# 全球科技硬體與半導體供應鏈全景圖譜 (Tech Supply Chain Atlas)

針對初學者、科技求職者與二級市場投資人設計的 **8 大層級全球科技硬體與半導體供應鏈全景互動圖譜**。

## 🎯 核心功能亮點

1. **8 大層級正交產業鏈架構 (MECE Classification)**：
   - **L1**: 上游基礎材料與特種化學品 (Silicon Wafer, Photoresist, Gases)
   - **L2**: 製造設備、次系統與關鍵零組件 (EUV/DUV, Etch, Deposition, Metrology)
   - **L3**: 電子設計自動化 (EDA) 與矽智財 (IP) (Synopsys, Cadence, ARM)
   - **L4**: 晶片設計 (IC Design / Fabless) (NVIDIA, AMD, Qualcomm, MediaTek)
   - **L5**: 晶圓代工與製造 (Foundry & IDM) (TSMC, Samsung, Intel, UMC)
   - **L6**: 封裝與測試 (OSAT & Advanced Packaging) (CoWoS, ASE, Amkor, ABF Substrate)
   - **L7**: 關鍵零組件、被動元件與次系統 (HBM Memory, MLCC, Liquid Cooling)
   - **L8**: 系統整合、EMS 代工與終端雲端客戶 (Foxconn, Quanta, Microsoft Azure, AWS)

2. **計量經濟學與網絡分析賦能**：
   - 投入產出矩陣 (Leontief Input-Output Analysis) 評估多階 (Multi-tier) 衝擊傳導。
   - 赫芬達爾-赫希曼指數 (HHI Index) 量化環節集中度與卡脖子風險 (Chokepoints)。
   - 替代彈性指數 (Elasticity of Substitution) 區分大宗物料與剛性壟斷環節。
   - 地緣政治出口管制與制裁穿透分析 (Entity List / Export Controls)。

## 🚀 快速開始

### 後端啟動 (FastAPI + SQLite / PostgreSQL)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 初始化資料庫與匯入種子資料
python init_db.py

# 啟動 API 伺服器
python main.py
```
API 預設運行於 `http://127.0.0.1:8000/docs`。

### 前端啟動 (React + Vite + AntV G6)

```bash
cd frontend
npm install
npm run dev
```

## 📚 文件目錄
- [架構設計文件 (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)
- [計量分析與網絡傳導數學模型 (docs/ECONOMETRIC_FRAMEWORK.md)](docs/ECONOMETRIC_FRAMEWORK.md)
- [8 大層級定義規範 (data/taxonomy/8_layers_definition.json)](data/taxonomy/8_layers_definition.json)
