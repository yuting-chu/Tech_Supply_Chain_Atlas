import React from 'react';
import { MajorCategory, MAJOR_CATEGORIES } from '../../data/careerData';
import { Briefcase, Check, Sparkles, GraduationCap } from 'lucide-react';

interface CareerBarProps {
  selectedMajor: MajorCategory | 'ALL';
  onSelectMajor: (major: MajorCategory | 'ALL') => void;
  onClose: () => void;
}

export const CareerBar: React.FC<CareerBarProps> = ({
  selectedMajor,
  onSelectMajor,
  onClose,
}) => {
  const currentMajorInfo = selectedMajor !== 'ALL' ? MAJOR_CATEGORIES[selectedMajor] : null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-4xl bg-slate-900/95 border border-emerald-600/60 rounded-xl shadow-2xl backdrop-blur-md p-3 select-none">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* 左側標題 */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              半導體求職天梯 · 科系專長對照
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                Career Navigator
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              點擊您的科系背景，自動高亮專屬核心戰場與代表性職位
            </p>
          </div>
        </div>

        {/* 科系按鈕組 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onSelectMajor('ALL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              selectedMajor === 'ALL'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            全部科系
          </button>

          {(Object.keys(MAJOR_CATEGORIES) as MajorCategory[]).map((key) => {
            const m = MAJOR_CATEGORIES[key];
            const isSelected = selectedMajor === key;
            return (
              <button
                key={key}
                onClick={() => onSelectMajor(key)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-900'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
                {m.name_zh.split('/')[0]}
              </button>
            );
          })}

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 ml-2 rounded hover:bg-slate-800"
          >
            關閉
          </button>
        </div>
      </div>

      {/* 當前科系說明引導條 */}
      {currentMajorInfo && (
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>【{currentMajorInfo.name_zh}】主戰場：</span>
            <span className="text-slate-200">
              {currentMajorInfo.primaryLayers.map((l) => `L${l}`).join(', ')} 層級
            </span>
            <span className="text-slate-400 ml-1 font-normal">
              —— {currentMajorInfo.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
