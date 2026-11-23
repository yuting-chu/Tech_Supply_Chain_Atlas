# 供應鏈圖譜之計量經濟學與網絡分析架構規範
(Econometric & Network Analysis Framework)

> **核心學理準則**：本專案嚴格拒絕「無關聯假說之黑箱連線」。所有供應鏈依賴邊（Edges）與衝擊傳導，均須遵循計量經濟學、產業組織理論（Industrial Organization）與網絡拓撲學之嚴密推導。

---

## 1. 供應鏈依賴矩陣與 Leontief 投入產出模型

在總體計量經濟學中，投入產出分析（Input-Output Analysis）由 Wassily Leontief 奠定。我們將此架構微觀化至企業與節點層級：

設共有 $n$ 個關鍵半導體節點（技術/產品/企業）。令**技術係數矩陣**為 $A = [a_{ij}]_{n \times n}$：
$$a_{ij} = \frac{\text{節點 } i \text{ 對節點 } j \text{ 產出之直接依賴價值}}{\text{節點 } j \text{ 之總產值}}$$

- $a_{ij}$ 即為 `edges.dependency_weight`。
- 若外生衝擊 $\Delta D$（例如：特定關鍵設備斷供、地震導致特定晶圓廠產能歸零）發生在節點群，則通過 Leontief 逆矩陣可計算出整體供應鏈的連鎖產能損失：
$$\Delta X = (I - A)^{-1} \Delta D$$
其中 $(I - A)^{-1}$ 為 Leontief 逆矩陣（Leontief Inverse），精確捕捉了「一階 (Direct)」、「二階 (Tier 2)」乃至「第 $k$ 階 (Multi-tier)」的連鎖外溢效應（Spillover Externalities）。

---

## 2. 替代彈性與卡脖子權重 (Elasticity of Substitution & Chokepoints)

傳統供應鏈圖譜常犯的謬誤是：**「將採購金額大等同於重要性高」**。
事實上，在半導體產業中，極少金額的關鍵化學品（如特種光阻劑、高純度氣體）若中斷，可致數百億美元的晶圓產線全線停擺。

本系統引進 **CES (Constant Elasticity of Substitution) 概念**：
$$\sigma_{ij} = \text{節點 } i \text{ 被其他供應商替代的難易程度}$$
- 當 $\sigma_{ij} \to 0$（完全互補，無替代品，極端剛性）：此節點為**絕對瓶頸（Chokepoint）**。
- 當 $\sigma_{ij} \to \infty$（完全替代）：若該供應商中斷，客戶可於數日內無縫轉單，系統性風險趨近於 0。

在資料庫設計中，`nodes.elasticity_score` 介於 0 與 1 之間：
- 0.0 ~ 0.2：極難替代（如 ASML EUV、TSMC 先進製程、信越/勝高特定等級晶圓）
- 0.8 ~ 1.0：高度同質化大宗商品（如通用型被動元件、成熟封測打線）

---

## 3. 市場集中度衡量：赫芬達爾-赫希曼指數 (HHI)

為客觀量化各層級與次產業的壟斷/脆弱性程度，我們計算各次產業的 HHI：
$$\text{HHI} = \sum_{k=1}^{M} s_k^2$$
其中 $s_k$ 為廠商 $k$ 的市場份額百分比（$0 \le s_k \le 100$）。
- $\text{HHI} < 1,500$：競爭型市場
- $1,500 \le \text{HHI} \le 2,500$：中度集中市場
- $\text{HHI} > 2,500$：高度寡占市場（極易形成供應鏈單點故障 Single Point of Failure）

例如：微影設備（L2）的 EUV 環節 HHI 高達 $100^2 = 10,000$（完全獨占），此即為系統之最大脆弱點。

---

## 4. 避免三大常見資料與計量陷阱

1. **雙重計數謬誤 (Double-Counting Trap)**：
   不可將 L1 材料營收 + L5 晶圓代工營收 + L8 組裝營收直接相加宣稱為市場總產值。系統在呈現投資視圖時，必須區分**總營收 (Gross Output)** 與 **增加值 (Value Added)**。
2. **長鞭效應 (Bullwhip Effect) 的非線性衝擊**：
   終端雲端客戶（L8）下調 5% 資本支出，經由庫存調整與前置期傳導，將對 L2 設備商產生 20%~30% 的訂單斷崖。傳導分析模型不可採用純線性假設。
3. **內生性結盟 (Endogenous Supply Link Formation)**：
   公司結成供應夥伴具有選擇偏誤（例如美系雲端業者傾向採用美系設計晶片）。分析地緣政治脫鉤（Decoupling）時，不可忽視轉換成本與技術標準鎖定（Path Dependency）。
