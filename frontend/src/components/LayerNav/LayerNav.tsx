import React from 'react';
import { Layer } from '../../types/atlas';
import { Layers, ShieldAlert, Check } from 'lucide-react';

interface LayerNavProps {
  layers: Layer[];
  selectedLayers: number[];
  onToggleLayer: (layerId: number) => void;
  onSelectAll: () => void;
}

const LAYER_COLORS: Record<string, string> = {
  L1: '#3B82F6',
  L2: '#06B6D4',
  L3: '#10B981',
  L4: '#F59E0B',
  L5: '#EF4444',
  L6: '#8B5CF6',
  L7: '#EC4899',
  L8: '#6366F1',
};

export const LayerNav: React.FC<LayerNavProps> = ({
  layers,
  selectedLayers,
  onToggleLayer,
  onSelectAll,
}) => {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none">
      {/* 標題與全部切換 */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-slate-100 text-sm tracking-wide">
            8 大正交層級導航 (L1 - L8)
          </h2>
        </div>
        <button
          onClick={onSelectAll}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-950/50 border border-indigo-800/50"
        >
          {selectedLayers.length === layers.length ? '取消全選' : '全選'}
        </button>
      </div>

      {/* 層級列表 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {layers.map((layer) => {
          const isSelected = selectedLayers.includes(layer.layer_id);
          const color = LAYER_COLORS[layer.code] || '#94A3B8';

          return (
            <div
              key={layer.layer_id}
              onClick={() => onToggleLayer(layer.layer_id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-800/80 border-slate-700 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                    }}
                  >
                    {layer.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {layer.name_zh}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
              </div>

              <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {layer.description}
              </div>

              {/* 卡脖子風險指標 */}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px]">
                <span className="text-slate-500">瓶頸風險 (Chokepoint):</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < layer.bottleneck_risk_level
                          ? 'bg-rose-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-rose-400 font-mono font-medium">
                    Lv.{layer.bottleneck_risk_level}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部計量說明註腳記號 */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          層級劃分遵循 MECE 原則。高風險層級（Lv.5）具備極高替代剛性與資本壁壘。
        </span>
      </div>
    </aside>
  );
};
