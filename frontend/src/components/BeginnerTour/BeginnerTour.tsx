import React, { useState, useEffect } from 'react';
import { BEGINNER_STEPS, BeginnerStep } from '../../data/beginnerSteps';
import { AtlasNode } from '../../types/atlas';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  Lightbulb,
  Compass,
  ArrowRight,
  Building2,
} from 'lucide-react';

interface BeginnerTourProps {
  currentStepIndex: number;
  onStepChange: (newStepIndex: number) => void;
  onClose: () => void;
  allNodes: AtlasNode[];
  onSelectNode: (node: AtlasNode) => void;
}

export const BeginnerTour: React.FC<BeginnerTourProps> = ({
  currentStepIndex,
  onStepChange,
  onClose,
  allNodes,
  onSelectNode,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const step: BeginnerStep = BEGINNER_STEPS[currentStepIndex];

  const nodeMap = new Map(allNodes.map((n) => [n.id, n]));

  // 自動播放計時器 (每 8 秒前進一步)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        onStepChange((currentStepIndex + 1) % BEGINNER_STEPS.length);
      }, 8000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, onStepChange]);

  const handlePrev = () => {
    onStepChange(Math.max(0, currentStepIndex - 1));
  };

  const handleNext = () => {
    onStepChange(Math.min(BEGINNER_STEPS.length - 1, currentStepIndex + 1));
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl bg-slate-900/95 border border-indigo-700/60 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
      {/* 頂部步進進度條 */}
      <div className="flex h-1.5 bg-slate-800">
        {BEGINNER_STEPS.map((s, idx) => (
          <div
            key={s.step}
            onClick={() => onStepChange(idx)}
            className={`flex-1 cursor-pointer transition-all ${
              idx === currentStepIndex
                ? 'bg-indigo-500 shadow-sm shadow-indigo-400'
                : idx < currentStepIndex
                ? 'bg-emerald-500/70'
                : 'bg-transparent hover:bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="p-5">
        {/* 標題列與控制 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold font-mono">
              <Compass className="w-3.5 h-3.5" />
              第 {step.step} / {BEGINNER_STEPS.length} 站 · L{step.layerId}
            </div>
            <h2 className="text-base font-bold text-slate-100">{step.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {isPlaying ? '暫停播放' : '自動播放'}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 核心內容區 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 左欄：生活化通俗比喻 */}
          <div className="md:col-span-1 bg-gradient-to-br from-indigo-950/40 to-purple-950/20 border border-indigo-800/40 p-3.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
              生活化通俗比喻
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {step.analogy}
            </p>
          </div>

          {/* 中欄：產業製程解讀與為何關鍵 */}
          <div className="md:col-span-2 space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              {step.description}
            </p>
            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              <strong className="text-emerald-400">💡 為什麼這個環節卡脖子：</strong>{' '}
              {step.whyItMatters}
            </div>
          </div>
        </div>

        {/* 底部：代表性企業按鈕與導航前後鍵 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* 聚光燈企業捷徑 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              本站代表企業:
            </span>
            {step.featuredNodeIds.map((nid) => {
              const node = nodeMap.get(nid);
              if (!node) return null;
              return (
                <button
                  key={nid}
                  onClick={() => onSelectNode(node)}
                  className="px-2.5 py-1 bg-slate-800/90 hover:bg-indigo-900/60 hover:border-indigo-700 border border-slate-700 rounded-md text-slate-200 text-xs font-medium transition-all flex items-center gap-1"
                >
                  {node.name_zh.split(' ')[0]}
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              );
            })}
          </div>

          {/* 前進後退按鈕 */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              上一站
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === BEGINNER_STEPS.length - 1}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-900/30"
            >
              下一站
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
