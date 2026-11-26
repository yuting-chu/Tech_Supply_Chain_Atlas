import React, { useState } from 'react';
import { AtlasNode, ShockSimulationResponse } from '../../types/atlas';
import {
  Zap,
  X,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  RotateCcw,
} from 'lucide-react';

interface ShockModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: AtlasNode[];
  initialNodeId?: string;
  onRunSimulation: (nodeId: string, shockPct: number) => Promise<ShockSimulationResponse | null>;
  activeSimulation: ShockSimulationResponse | null;
  onResetSimulation: () => void;
}

export const ShockModal: React.FC<ShockModalProps> = ({
  isOpen,
  onClose,
  nodes,
  initialNodeId,
  onRunSimulation,
  activeSimulation,
  onResetSimulation,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    initialNodeId || 'COMP_TSMC'
  );
  const [shockPct, setShockPct] = useState<number>(40);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onRunSimulation(selectedNodeId, shockPct);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Leontief 斷鏈衝擊傳導模擬器
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 font-mono">
                  Input-Output Shock
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                評估關鍵節點產能中斷時，沿有向加權網絡向下游放大的連鎖價值損失
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 參數設定 Form */}
        <form onSubmit={handleSubmit} className="p-5 border-b border-slate-800 space-y-4 bg-slate-900/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 選擇衝擊源 */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                1. 選擇外生衝擊源 (Trigger Node)
              </label>
              <select
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    [L{n.layer_id}] {n.name_zh}
                  </option>
                ))}
              </select>
            </div>

            {/* 衝擊幅度拉桿 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  2. 產能中斷幅度 (Shock Magnitude)
                </label>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
                  -{shockPct}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={shockPct}
                onChange={(e) => setShockPct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>輕微中斷 (-5%)</span>
                <span>全面停擺 (-100%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {activeSimulation && (
              <button
                type="button"
                onClick={onResetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重置模擬
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md shadow-rose-900/30 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {loading ? '模擬計算中...' : '啟動連鎖衝擊傳導'}
            </button>
          </div>
        </form>

        {/* 模擬報告結果展示 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeSimulation ? (
            <>
              {/* 核心指標統計 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">波及下游實體</span>
                  <span className="text-xl font-bold font-mono text-rose-400">
                    {activeSimulation.affected_count - 1} 家
                  </span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">預估全鏈市值損失</span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    ${activeSimulation.total_estimated_value_loss_bil} B
                  </span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg text-center">
                  <span className="text-[11px] text-slate-400 block mb-0.5">最大傳導深度</span>
                  <span className="text-xl font-bold font-mono text-indigo-400">
                    Tier {activeSimulation.max_propagation_depth}
                  </span>
                </div>
              </div>

              {/* 受害節點排名 */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  各階下游受損企業明細 (依受損幅度排序)
                </h3>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {activeSimulation.affected_nodes.map((node) => (
                    <div
                      key={node.node_id}
                      className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            node.is_trigger
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {node.is_trigger ? '衝擊源' : `Tier ${node.depth}`}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-200">
                            {node.name_zh}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-2">
                            L{node.layer_id} · 交期落後 {node.cumulative_lead_time_days} 天
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-rose-400 font-bold">
                          -{node.severity_pct}%
                        </span>
                        {node.est_value_loss_bil !== undefined && node.est_value_loss_bil > 0 && (
                          <span className="text-amber-400 text-[11px]">
                            ~${node.est_value_loss_bil}B
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              請選擇衝擊源與中斷幅度，點擊「啟動連鎖衝擊傳導」觀察全供應鏈動態傳導路徑。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
