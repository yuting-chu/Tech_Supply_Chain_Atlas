export type MajorCategory = 'EE_CS' | 'MATERIALS_PHYSICS' | 'MECHANICAL_THERMAL' | 'CHEMISTRY' | 'INDUSTRIAL_BIZ';

export interface MajorInfo {
  code: MajorCategory;
  name_zh: string;
  icon: string;
  description: string;
  primaryLayers: number[]; // 主要對應層級
}

export const MAJOR_CATEGORIES: Record<MajorCategory, MajorInfo> = {
  EE_CS: {
    code: 'EE_CS',
    name_zh: '電機 / 電子 / 資工',
    icon: 'Cpu',
    description: '掌控演算法、數位/類比電路設計、EDA 工具研發與軟韌體生態系統。',
    primaryLayers: [3, 4, 8],
  },
  MATERIALS_PHYSICS: {
    code: 'MATERIALS_PHYSICS',
    name_zh: '材料 / 物理 / 奈米',
    icon: 'Atom',
    description: '深入晶格結構、缺陷物理、原子級沉積與微影量子效應，晶圓廠與材料商之核心。',
    primaryLayers: [1, 2, 5, 6],
  },
  MECHANICAL_THERMAL: {
    code: 'MECHANICAL_THERMAL',
    name_zh: '機械 / 機電 / 熱流',
    icon: 'Cog',
    description: '精通伺服器液冷散熱、重載結構導軌、高精密曝光機真空機構與自動化設備。',
    primaryLayers: [2, 7, 8],
  },
  CHEMISTRY: {
    code: 'CHEMISTRY',
    name_zh: '化學 / 化工 / 高分子',
    icon: 'FlaskConical',
    description: '專精於 EUV 光阻分子合成、超高純度特氣精餾、CMP 研磨液與先進絕緣膜 (ABF)。',
    primaryLayers: [1, 5, 6],
  },
  INDUSTRIAL_BIZ: {
    code: 'INDUSTRIAL_BIZ',
    name_zh: '工工 / 供應鏈 / 商管',
    icon: 'Briefcase',
    description: '專注全求採購運籌 (GSM)、晶圓廠產能調度、良率統計製程管制 (SPC) 與客戶技術業務。',
    primaryLayers: [5, 8],
  },
};

export interface LayerCareerProfile {
  layerId: number;
  layerName: string;
  salaryTier: string;
  workLifeBalance: string;
  targetMajors: MajorCategory[];
  representativeRoles: Array<{
    title: string;
    description: string;
    requiredSkills: string[];
  }>;
  growthMoat: string; // 職業技能護城河
}

export const LAYER_CAREER_PROFILES: Record<number, LayerCareerProfile> = {
  1: {
    layerId: 1,
    layerName: '上游基礎材料與特種化學品',
    salaryTier: 'Tier 2 (優渥分紅/高年薪)',
    workLifeBalance: '責任制/彈性外商',
    targetMajors: ['CHEMISTRY', 'MATERIALS_PHYSICS'],
    representativeRoles: [
      {
        title: '高分子光阻合成研發工程師 (R&D Chemist)',
        description: '開發 EUV/ArF 極紫外光感光聚合物，控制光酸產生劑 (PAG) 分子純度。',
        requiredSkills: ['高分子化學', '有機合成', 'NMR/GPC 分析儀器', '無塵室操作'],
      },
      {
        title: '晶體生長與缺陷物理工程師 (Crystal Growth Engineer)',
        description: '控制 12 吋單晶矽錠提拉過程中的熱場與氧含量，抑制微小晶格缺陷。',
        requiredSkills: ['固態物理', '熱傳導模擬', '長晶爐操作', 'X射線繞射 (XRD)'],
      },
    ],
    growthMoat: '材料配方屬於「隱形知識 (Tacit Knowledge)」，具備極高經驗壁壘與化學專利護城河。',
  },
  2: {
    layerId: 2,
    layerName: '製造設備、次系統與關鍵零組件',
    salaryTier: 'Tier 1 (頂級薪資/外商福利)',
    workLifeBalance: '責任制/彈性外商',
    targetMajors: ['MECHANICAL_THERMAL', 'MATERIALS_PHYSICS', 'EE_CS'],
    representativeRoles: [
      {
        title: '微影/蝕刻客戶支援應用工程師 (Customer Support / FAE)',
        description: '常駐晶圓廠（如台積電），負責 ASML EUV 或 AMAT 設備安裝、調校與故障排除。',
        requiredSkills: ['真空系統', '光學校正', '電漿物理', '英文溝通表達', '客訴問題定位'],
      },
      {
        title: '極紫外光學設計工程師 (Optical Systems Engineer)',
        description: '設計 EUV 反射鏡片塗層與超精密表面形貌測量系統。',
        requiredSkills: ['波動光學', 'Zemax', '光學薄膜鍍膜', '精密機械控制'],
      },
    ],
    growthMoat: '全球外商寡占，受訓成本極高，具備極強的國際流動性與外商高薪資溢價。',
  },
  3: {
    layerId: 3,
    layerName: '電子設計自動化 (EDA) 與矽智財 (IP)',
    salaryTier: 'Tier 1 (頂級薪資/外商福利)',
    workLifeBalance: '責任制/彈性外商',
    targetMajors: ['EE_CS'],
    representativeRoles: [
      {
        title: 'EDA 核心演算法工程師 (EDA Software R&D)',
        description: '研發數十億電晶體的自動佈局佈線 (Place & Route) 與靜態時序分析 (STA) 引擎。',
        requiredSkills: ['C++17/20', '圖論與最佳化演算法', '計算幾何', '平行運算 (OpenMP)'],
      },
      {
        title: '高速介面 IP 設計驗證工程師 (Digital IP Verification)',
        description: '開發符合 PCIe 6.0/7.0 或 UCIe Chiplet 標準的數位實體層驗證模型。',
        requiredSkills: ['SystemVerilog', 'UVM 驗證方法論', 'Python腳本', '協定解碼'],
      },
    ],
    growthMoat: '演算法難度極端深厚，既懂晶片底層物理又懂高階演算法的跨領域人才極其罕見。',
  },
  4: {
    layerId: 4,
    layerName: '晶片設計 (IC Design / Fabless)',
    salaryTier: 'Tier 1 (頂級薪資/外商福利)',
    workLifeBalance: '專案時程導向',
    targetMajors: ['EE_CS'],
    representativeRoles: [
      {
        title: '數位 IC 設計工程師 (Digital RTL Architect)',
        description: '將 AI 演算法或通訊演算法轉化為高效能硬體電路描述語言 (Verilog)。',
        requiredSkills: ['Verilog/SystemVerilog', '電腦架構學', '時序收斂 (Timing Closure)', '低功耗設計'],
      },
      {
        title: 'AI 算力編譯器與 CUDA 核心工程師 (Deep Learning Kernel Engineer)',
        description: '針對 Blackwell/Hopper GPU 撰寫底層 Tensor Core 組合語言與算子最佳化。',
        requiredSkills: ['CUDA C++', 'PyTorch 算子開發', '分散式通訊 (NCCL)', 'GPU 記憶體拓撲'],
      },
      {
        title: '類比/電源晶片設計工程師 (Analog/PMIC Designer)',
        description: '設計資料中心大電流降壓轉換器 (VRM) 與高速射頻接收電路。',
        requiredSkills: ['SPICE 模擬', 'Cadence Virtuoso', '反饋控制理論', '晶片佈局對稱性'],
      },
    ],
    growthMoat: '半導體最高價值節點，擁有設計頂級晶片架構經驗的工程師是全球搶奪的頂尖資產。',
  },
  5: {
    layerId: 5,
    layerName: '晶圓代工與製造 (Foundry & IDM)',
    salaryTier: 'Tier 2 (優渥分紅/高年薪)',
    workLifeBalance: '高壓輪班',
    targetMajors: ['MATERIALS_PHYSICS', 'CHEMISTRY', 'EE_CS', 'MECHANICAL_THERMAL'],
    representativeRoles: [
      {
        title: '製程整合工程師 (Process Integration Engineer / PIE)',
        description: '晶圓廠各模組的火車頭，貫穿數千道工序，統籌電性參數與整體良率。',
        requiredSkills: ['半導體元件物理', 'WAT 電性分析', '橫向跨部門協調', '失效分析 (FA)'],
      },
      {
        title: '微影黃光 / 薄膜蝕刻製程工程師 (Process Engineer / PE)',
        description: '負責特定生產線機台的製程參數調整、配方 (Recipe) 開發與異常改善。',
        requiredSkills: ['DOE 實驗設計法', '統計製程管制 (SPC)', '機台故障診斷', '抗壓能力'],
      },
      {
        title: '良率工程師 (Yield Enhancement Engineer / YED)',
        description: '運用大數據與缺陷掃描資料分析晶圓瑕疵模式，提升先進製程產量。',
        requiredSkills: ['Python/SQL 數據分析', 'KLA 缺陷圖譜分析', '機器學習分類器', '良率模型'],
      },
    ],
    growthMoat: '實戰「良率學習曲線」經驗無法從書本獲得，全靠大規模量產實戰累積，不可替代性高。',
  },
  6: {
    layerId: 6,
    layerName: '封裝與測試 (OSAT & Advanced Packaging)',
    salaryTier: 'Tier 2 (優渥分紅/高年薪)',
    workLifeBalance: '專案時程導向',
    targetMajors: ['MATERIALS_PHYSICS', 'MECHANICAL_THERMAL', 'CHEMISTRY'],
    representativeRoles: [
      {
        title: '2.5D/3D 先進封裝架構工程師 (Advanced Packaging R&D)',
        description: '研發 CoWoS 中介層 (Interposer)、晶片堆疊 (TSV) 與微凸塊 (Micro-bump) 製程。',
        requiredSkills: ['熱應力結構分析', 'ANSYS Mechanical', '異質整合介面', '可靠度測試'],
      },
      {
        title: '高階 IC 載板製程工程師 (ABF Substrate Engineer)',
        description: '開發大尺寸高層數載板之極細線寬線距 (L/S) 與層間盲孔雷射成孔。',
        requiredSkills: ['電鍍化學', '雷射微加工', '載板翹曲 (Warpage) 控制', '阻抗匹配'],
      },
    ],
    growthMoat: '後摩爾時代晶片效能提升的核心支柱，先進封裝人才需求呈指數級爆發。',
  },
  7: {
    layerId: 7,
    layerName: '關鍵零組件、被動元件與散熱次系統',
    salaryTier: 'Tier 2 (優渥分紅/高年薪)',
    workLifeBalance: '專案時程導向',
    targetMajors: ['MECHANICAL_THERMAL', 'EE_CS'],
    representativeRoles: [
      {
        title: 'AI 伺服器水冷散熱工程師 (Thermal/Liquid Cooling Engineer)',
        description: '設計 100kW+ 機櫃水冷板、分歧管 (Manifold) 流道與散熱液流阻壓降計算。',
        requiredSkills: ['計算流體力學 (CFD)', 'Flotherm / 6SigmaET', '熱管/均溫板 (VC)', '漏液防護設計'],
      },
      {
        title: '伺服器大功率電源研發工程師 (Power Electronics Engineer)',
        description: '研發 5.5kW / 10kW 鈦金級高密度電源轉換拓撲與碳化矽 (SiC) 驅動電路。',
        requiredSkills: ['LLC 諧振轉換', '磁性元件設計', '數位電源控制 (DSP)', 'EMI/EMC 防制'],
      },
    ],
    growthMoat: 'AI 算力爆發直接受限於散熱與電力物理極限，熱流與電力工程師成為各大巨頭瘋搶人才。',
  },
  8: {
    layerId: 8,
    layerName: '系統整合、EMS代工與終端雲端客戶',
    salaryTier: 'Tier 3 (穩定高薪/系統代工) ~ Tier 1 (雲端外商)',
    workLifeBalance: '專案時程導向',
    targetMajors: ['EE_CS', 'MECHANICAL_THERMAL', 'INDUSTRIAL_BIZ'],
    representativeRoles: [
      {
        title: 'AI 伺服器系統架構師 (System Hardware Architect)',
        description: '負責 NVL72 整櫃式運算主機板、高速背板互聯與電源散熱整體機電整合。',
        requiredSkills: ['PCIe 6.0 / InfiniBand 高速匯流排', '訊號完整性 (SI/PI)', '伺服器架構', '系統整合驗證'],
      },
      {
        title: '伺服器韌體工程師 (Server BIOS/BMC Firmware)',
        description: '開發遠端伺服器基板管理控制器 (BMC) 韌體與 OpenBMC 系統監控。',
        requiredSkills: ['C/C++', '嵌入式 Linux', 'IPMI/Redfish 協定', '硬體底層暫存器操作'],
      },
      {
        title: '全球供應鏈運籌經理 (Global Supply Manager / GSM)',
        description: '掌管數百億美元採購配額，調度全球晶片、散熱件與組裝產能排產。',
        requiredSkills: ['供應鏈風險建模', '商務談判', '物料清單 (BOM) 成本分析', '跨國運籌'],
      },
    ],
    growthMoat: '擁有將全世界零組件落地組裝為可運作商業系統的「超大型工程組織運作能力」。',
  },
};
