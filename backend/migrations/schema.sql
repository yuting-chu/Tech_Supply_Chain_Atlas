-- ==============================================================================
-- 全球科技硬體與半導體供應鏈全景圖譜 (Tech Supply Chain Atlas)
-- 資料庫結構定義 (DDL: PostgreSQL / SQLite 相容設計)
-- 具備圖論網絡分析、投入產出矩陣 (Input-Output) 與計量衝擊傳導分析能力
-- ==============================================================================

-- 1. 八大層級主檔 (Layer Taxonomy)
CREATE TABLE IF NOT EXISTS layers (
    layer_id INTEGER PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,       -- e.g. 'L1', 'L2' ... 'L8'
    name_zh VARCHAR(100) NOT NULL,          -- 中文名稱
    name_en VARCHAR(100) NOT NULL,          -- 英文名稱
    description TEXT,                       -- 層級範疇定義
    bottleneck_risk_level INTEGER CHECK(bottleneck_risk_level BETWEEN 1 AND 5), -- 卡脖子風險指數 (1-5)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 次產業/細分環節檔 (Subsectors)
CREATE TABLE IF NOT EXISTS subsectors (
    subsector_id SERIAL PRIMARY KEY,
    layer_id INTEGER NOT NULL REFERENCES layers(layer_id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,       -- e.g. 'L2_METROLOGY', 'L5_ADVANCED_FOUNDRY'
    name_zh VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    hhi_index NUMERIC(6, 2),                -- 赫芬達爾-赫希曼指數 (Herfindahl-Hirschman Index, 評估市場集中度)
    avg_margin_pct NUMERIC(5, 2),           -- 產業平均營業利益率 (%)
    description TEXT
);

-- 3. 企業/主體基本檔 (Companies)
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    ticker VARCHAR(20),                     -- 股票代號 (e.g. '2330.TW', 'NVDA', 'ASML.AS')
    exchange VARCHAR(20),                   -- 交易所 (e.g. 'TWSE', 'NASDAQ', 'AMS')
    name_zh VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    headquarters_country VARCHAR(10) NOT NULL, -- 總部國別 ISO 代碼 (e.g. 'TW', 'US', 'NL', 'JP')
    market_cap_usd_bil NUMERIC(12, 2),      -- 市值 (十億美元)
    annual_revenue_usd_bil NUMERIC(12, 2),  -- 年營收 (十億美元)
    rd_intensity_pct NUMERIC(5, 2),         -- 研發費用佔營收比 (R&D / Revenue %)
    primary_subsector_id INTEGER REFERENCES subsectors(subsector_id),
    is_idm BOOLEAN DEFAULT FALSE,           -- 是否為整合元件製造廠 (IDM)
    sanction_status VARCHAR(50) DEFAULT 'NONE', -- 制裁或實體清單狀態 (e.g. 'ENTITY_LIST', 'CLEAN')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 圖譜節點表 (Nodes)
-- 節點可以是「實體企業」、「核心產品/零組件」、「關鍵原料」或「專利技術」
CREATE TABLE IF NOT EXISTS nodes (
    node_id VARCHAR(50) PRIMARY KEY,        -- 唯一節點識別碼 (e.g. 'COMP_TSMC', 'PROD_EUV_SCANNER')
    node_type VARCHAR(20) NOT NULL CHECK(node_type IN ('COMPANY', 'PRODUCT', 'MATERIAL', 'EQUIPMENT', 'IP')),
    name_zh VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    layer_id INTEGER REFERENCES layers(layer_id),
    subsector_id INTEGER REFERENCES subsectors(subsector_id),
    company_id INTEGER REFERENCES companies(company_id) ON DELETE SET NULL,
    elasticity_score NUMERIC(3, 2),         -- 替代彈性指標 (0=完全無法替代/極度剛性, 1=可輕易替換)
    global_market_share_pct NUMERIC(5, 2),  -- 全球市佔率 (%)
    metadata JSONB DEFAULT '{}'             -- 擴充彈性欄位
);

-- 5. 圖譜有向加權邊表 (Edges - 供應鏈依賴關係)
CREATE TABLE IF NOT EXISTS edges (
    edge_id SERIAL PRIMARY KEY,
    source_node_id VARCHAR(50) NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    target_node_id VARCHAR(50) NOT NULL REFERENCES nodes(node_id) ON DELETE CASCADE,
    relation_type VARCHAR(30) NOT NULL CHECK(
        relation_type IN ('SUPPLIES_TO', 'DEPENDS_ON', 'LICENSES_TO', 'CO_DEVELOPS', 'SUBSTITUTES')
    ),
    dependency_weight NUMERIC(4, 3) CHECK(dependency_weight BETWEEN 0 AND 1), -- 依賴度係數 a_ij (0.000 ~ 1.000)
    lead_time_days INTEGER,                 -- 交期/前置時間 (衡量衝擊傳導時滯)
    revenue_exposure_pct NUMERIC(5, 2),     -- 營收曝險程度 (%)
    is_single_source BOOLEAN DEFAULT FALSE, -- 是否為單一供應商獨家供貨 (Single Source)
    qualitative_notes TEXT,                 -- 產業脈絡註記
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_edge_pair UNIQUE (source_node_id, target_node_id, relation_type)
);

-- 6. 地緣政治與出口管制限制表 (Geopolitical Restrictions)
CREATE TABLE IF NOT EXISTS geopolitical_restrictions (
    restriction_id SERIAL PRIMARY KEY,
    regulating_country VARCHAR(10) NOT NULL, -- 管制發起國 (e.g. 'US')
    target_country VARCHAR(10) NOT NULL,     -- 受限制國家 (e.g. 'CN')
    node_id VARCHAR(50) REFERENCES nodes(node_id),
    rule_name VARCHAR(100) NOT NULL,         -- e.g. 'FDPR', 'BIS Export Restriction'
    threshold_description TEXT,              -- 管制門檻 (例如: 14nm以下邏輯晶片或算力門檻)
    effective_date DATE NOT NULL
);

-- 7. 網絡衝擊傳導模擬日誌 (Network Shock Simulation Logs)
CREATE TABLE IF NOT EXISTS shock_simulation_logs (
    simulation_id SERIAL PRIMARY KEY,
    shock_trigger_node VARCHAR(50) REFERENCES nodes(node_id),
    shock_magnitude_pct NUMERIC(5, 2),       -- 衝擊幅度 (e.g. 產能中斷 50%)
    propagation_depth INTEGER,               -- 傳導階數 (波及至 Tier-N)
    total_estimated_impact_usd_bil NUMERIC(12, 2), -- 預估全供應鏈價值損失
    result_breakdown JSONB,                  -- 受衝擊節點的損失明細
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引優化：圖論邊查詢加速
CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_nodes_layer ON nodes(layer_id);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(headquarters_country);
