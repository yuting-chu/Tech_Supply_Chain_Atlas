import React from 'react';
import { InvestorFilter } from '../../types/atlas';
import { TrendingUp, AlertTriangle, ShieldAlert, DollarSign, Check, Info } from 'lucide-react';

interface InvestorBarProps {
  selectedFilter: InvestorFilter;
  onSelectFilter: (filter: InvestorFilter) => void;
  onClose: () => void;
}

export const InvestorBar: React.FC<InvestorBarProps> = ({
  selectedFilter,
  onSelectFilter,
  onClose,
}) => {
  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-4xl bg-slate-900/95 border border-amber-600/60 rounded-xl shadow-2xl backdrop-blur-md p-3 select-none">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* 左側標題 */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              投資人護城河與曝險透視 · 定價權矩陣
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-mono border border-amber-800">
                Investor Radar
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              篩選全球半導體定價權（超額利潤池）、單一客戶集中度與地緣政治出口管制
            </p>
          </div>
        </div>

        {/* 投資維度按鈕組 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onSelectFilter('ALL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            全部節點
          </button>

          <button
            onClick={() => onSelectFilter('HIGH_MARGIN')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-all border ${
              selectedFilter === 'HIGH_MARGIN'
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm shadow-amber-900'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {selectedFilter === 'HIGH_MARGIN' && <Check className="w-3 h-3 text-white" />}
            💎 頂級護城河 (毛利 &gt; 50%)
          </button>

          <button
            onClick={() => onSelectFilter('CUSTOMER_CONCENTRATION')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-all border ${
              selectedFilter === 'CUSTOMER_CONCENTRATION'
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm shadow-rose-900'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {selectedFilter === 'CUSTOMER_CONCENTRATION' && <Check className="w-3 h-3 text-white" />}
            ⚠️ 客戶高曝險 (單一客戶 &gt; 25%)
          </button>

          <button
            onClick={() => onSelectFilter('GEOPOLITICAL_RISK')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-all border ${
              selectedFilter === 'GEOPOLITICAL_RISK'
                ? 'bg-purple-600 text-white border-purple-500 shadow-sm shadow-purple-900'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {selectedFilter === 'GEOPOLITICAL_RISK' && <Check className="w-3 h-3 text-white" />}
            🛡️ 地緣政治管制 (BIS/Entity List)
          </button>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 ml-2 rounded hover:bg-slate-800"
          >
            關閉
          </button>
        </div>
      </div>

      {/* 計量經濟學投資人引導說明 */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
        {selectedFilter === 'HIGH_MARGIN' && (
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>【定價權利潤池】毛利率逾 50% 核心企業（NVIDIA、ASML、ARM、台積電、川湖），佔據產業鏈最肥沃的超額利潤，抗通膨能力極強。</span>
          </div>
        )}
        {selectedFilter === 'CUSTOMER_CONCENTRATION' && (
          <div className="flex items-center gap-1.5 text-rose-300 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>【長鞭效應脆弱點】緯穎 (Meta &gt;50%)、鴻海 (Apple &gt;50%)、SK海力士 (NVIDIA &gt;45%)，上游大客戶一旦微調 CapEx，下游營收面臨非線性放大斷崖。</span>
          </div>
        )}
        {selectedFilter === 'GEOPOLITICAL_RISK' && (
          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>【地緣脫鉤雷達】涵蓋美國商務部實體清單（如中芯 SMIC）與瓦聖納/FDPR 出口管制設備（如 ASML 先進微影機、高算力 AI 晶片）。</span>
          </div>
        )}
        {selectedFilter === 'ALL' && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>點選上方維度切換篩選。點擊任意企業節點，右側抽屜將展示真實毛利率、研發費用率與護城河來源。</span>
          </div>
        )}
      </div>
    </div>
  );
};
