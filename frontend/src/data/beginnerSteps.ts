export interface BeginnerStep {
  step: number;
  layerId: number;
  title: string;
  subtitle: string;
  analogy: string; // 生活化通俗比喻
  description: string;
  whyItMatters: string; // 為什麼關鍵
  featuredNodeIds: string[]; // 聚光燈聚焦節點
  iconName: string;
}

export const BEGINNER_STEPS: BeginnerStep[] = [
  {
    step: 1,
    layerId: 1,
    title: "第一步：材料篇 —— 沙子到極致純淨的畫布",
    subtitle: "L1 上游基礎材料與特種化學品",
    analogy: "如果晶片是一幅精密油畫，矽晶圓就是世界最頂級的空白畫布；光阻劑則是對光極端敏感的神奇感光底片。",
    description: "半導體的起點是隨處可見的石英砂（二氧化矽），但要將其精煉到 99.999999999% (11個9) 的純度，拉製成單晶矽晶棒並切磨拋光成 12 吋晶圓。稍有幾奈米的雜質或翹曲，整張畫布就宣告報廢。",
    whyItMatters: "日本少數企業（如信越、勝高、JSR、Stella）控制了全球絕大部分的高純矽晶圓與高階光阻劑，是整個數位世界最源頭的物理基石。",
    featuredNodeIds: ["COMP_SHIN_ETSU", "COMP_SUMCO", "COMP_JSR", "COMP_STELLA_CHEMIFA"],
    iconName: "Mountain"
  },
  {
    step: 2,
    layerId: 2,
    title: "第二步：設備篇 —— 人類製造極限的微觀雕刻刀",
    subtitle: "L2 製造設備、光學次系統與量測",
    analogy: "如同在月球上用高能量雷射筆瞄準地球上一枚硬幣，以光速在數公分見方的矽晶圓上刻出數百億條只有頭髮萬分之一細的電路。",
    description: "為了在晶圓上畫出只有幾奈米寬的電路，必須仰賴 EUV（極紫外線微影機）。全球只有荷蘭 ASML 能造出這種機器，每台重達 180 噸、由數十萬個零件組成，內部搭載德國蔡司（Zeiss）最極致的反射鏡片與日本 Lasertec 的光罩缺陷檢查機。",
    whyItMatters: "這是物理學與工程學的極致，沒有這把「物理母機」，全世界任何頂尖晶圓廠都無法推進摩爾定律。",
    featuredNodeIds: ["COMP_ASML", "COMP_CARL_ZEISS", "COMP_LASERTEC", "COMP_APPLIED_MATERIALS"],
    iconName: "Wrench"
  },
  {
    step: 3,
    layerId: 3,
    title: "第三步：EDA/IP篇 —— 幾百億電晶體的數位建築藍圖",
    subtitle: "L3 電子設計自動化 (EDA) 與矽智財 (IP)",
    analogy: "要在指甲蓋大小的空間規劃數百億棟摩天大樓、交通路線與水電網，人腦完全不可能手繪，必須依靠超級城市規劃軟體 (EDA) 與公版現成房間模組 (IP)。",
    description: "晶片設計師不用從零發明每個開關，而是使用 ARM 等公司授權的指令集架構與標準元件庫（IP），並在 Synopsys、Cadence 的專用軟體中進行佈局、佈線與物理模擬，確保電路不會短路或發熱熔毀。",
    whyItMatters: "全球先進晶片的軟體命脈掌握在美英三四大巨頭手中，是輕資產但極深軟體護城河的卡脖子環節。",
    featuredNodeIds: ["COMP_ARM", "COMP_SYNOPSYS", "COMP_CADENCE", "COMP_EMEMORY"],
    iconName: "FileCode"
  },
  {
    step: 4,
    layerId: 4,
    title: "第四步：設計篇 —— AI 與智慧運算的大腦架構師",
    subtitle: "L4 晶片設計 (IC Design / Fabless)",
    analogy: "他們不擁有實體工廠，只憑頂尖數學家與架構師的智慧，設計出全世界最強大的思維大腦。",
    description: "設計公司（無晶圓廠 Fabless）專注於架構創新與軟體生態。例如輝達（NVIDIA）專精於平行運算的 GPU 與 CUDA 生態系統；蘋果專注極致能耗比的 A/M 系列處理器；聯發科與高通則掌控通訊基頻與手機大腦。",
    whyItMatters: "這是科技競爭中價值暴發力最強的環節，誰定義了演算法與軟硬整合架構，誰就引領了整個 AI 時代。",
    featuredNodeIds: ["COMP_NVIDIA", "COMP_APPLE_SILICON", "COMP_AMD", "COMP_QUALCOMM"],
    iconName: "Cpu"
  },
  {
    step: 5,
    layerId: 5,
    title: "第五步：製造篇 —— 世界最昂貴的奈米摩天樓建造廠",
    subtitle: "L5 晶圓代工與製造 (Foundry & IDM)",
    analogy: "把前一步的數位藍圖轉化為矽基實體，在比手術室乾淨百萬倍的無塵室中，數千道繁複工序日夜不停層層堆疊微觀奇蹟。",
    description: "以台積電（TSMC）為首的代工巨頭，投入數百億美元資本支出建造超大型晶圓廠（GigaFab），將第一步的晶圓、第二步的設備與第四步的設計結合，在 12 吋矽片上進行數千道光刻、蝕刻、離子植入與拋光，良率高達 80%~90%。",
    whyItMatters: "台積電在全球先進製程市佔高達 85%~90%，是全球科技產業鏈最核心的樞紐單點。",
    featuredNodeIds: ["COMP_TSMC", "COMP_SAMSUNG_FOUNDRY", "COMP_INTEL", "COMP_UMC"],
    iconName: "Factory"
  },
  {
    step: 6,
    layerId: 6,
    title: "第六步：封裝篇 —— 後摩爾時代的樂高積木拼裝術",
    subtitle: "L6 封裝與測試 (OSAT & Advanced Packaging)",
    analogy: "過去只是給晶片穿塑膠外衣、接幾根金線；現在則是把 CPU、GPU 與記憶體像樂高積木一樣，在微米級別立體拼接成超級晶片堆疊。",
    description: "單顆晶片微縮已接近物理極限，如今透過台積電 CoWoS 或日月光先進封裝技術，將多顆晶片（Chiplet）和高階 ABF 載板（如欣興、揖斐電）立體拼接在一起，並由京元電等測試廠進行嚴格功能與溫度測試。",
    whyItMatters: "NVIDIA 的 Blackwell 與 Hopper 之所以能運算如飛，關鍵瓶頸正是先進封裝與 ABF 載板產能。",
    featuredNodeIds: ["COMP_ASE_GROUP", "COMP_KYEC", "COMP_UNIMICRON", "COMP_IBIDEN"],
    iconName: "Boxes"
  },
  {
    step: 7,
    layerId: 7,
    title: "第七步：次系統篇 —— 讓巨獸呼吸的記憶體、散熱與電源",
    subtitle: "L7 關鍵零組件、被動元件與散熱次系統",
    analogy: "晶片大腦再強，也需要超高帶寬的記憶體做「即時記憶庫」、超大功率電源做「心臟」，以及精密液冷系統給它「退燒散熱」。",
    description: "AI 伺服器運算時發熱量極大，單櫃功耗高達 100kW 以上，需要 SK海力士的 HBM 高頻寬記憶體、台達電的鈦金級大功率電源、奇鋐與雙鴻的水冷板，以及川湖製造的專利重載滑軌將伺服器抽屜精準滑入機櫃中。",
    whyItMatters: "這些隱形冠軍掌控了讓 AI 晶片能真正通電運行的物理子系統，缺任何一個零件整台機器都無法開機。",
    featuredNodeIds: ["COMP_SK_HYNIX", "COMP_DELTA_ELEC", "COMP_CCI", "COMP_KING_SLIDE"],
    iconName: "Thermometer"
  },
  {
    step: 8,
    layerId: 8,
    title: "第八步：終端篇 —— 點亮全球資料中心與你我的口袋",
    subtitle: "L8 系統整合、EMS 代工與終端雲端客戶",
    analogy: "萬川匯海，前七大層級的無數智慧與結晶，在此整合成數百公斤重的 AI 機櫃或輕巧的智慧手機，送達終端用戶手中。",
    description: "鴻海、廣達、緯創等頂尖系統代工廠，將所有晶片、主機板、散熱水管與機殼整合為龐大的 NVL72 液冷伺服器機櫃，直接送往微軟 Azure、亞馬遜 AWS、Google 與 Meta 的全球資料中心；或是組裝成全球數億人每天使用的 iPhone 與智慧設備。",
    whyItMatters: "這是整個半導體萬億美元價值的最終兌現者，也是驅動全球數位文明、AI 大模型運行的終端落地之處。",
    featuredNodeIds: ["COMP_FOXCONN", "COMP_QUANTA", "COMP_MICROSOFT", "COMP_APPLE"],
    iconName: "Globe"
  }
];
