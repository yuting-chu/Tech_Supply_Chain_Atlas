import React from 'react';
import { AtlasNode, AtlasEdge, Layer, AffectedNode } from '../../types/atlas';
import { LAYER_CAREER_PROFILES } from '../../data/careerData';
import {
  X,
  ExternalLink,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Cpu,
  Zap,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface DetailPanelProps {
  node: AtlasNode | null;
  layer: Layer | undefined;
  edges: AtlasEdge[];
  allNodes: AtlasNode[];
  onClose: () => void;
  onSelectNode: (node: AtlasNode) => void;
  onTriggerShock?: (nodeId: string) => void;
  shockImpact?: AffectedNode;
  isCareerMode?: boolean;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  node,
  layer,
  edges,
  allNodes,
  onClose,
  onSelectNode,
  onTriggerShock,
  shockImpact,
  isCareerMode = false,
}) => {
  if (!node) return null;

  const nodeMap = new Map(allNodes.map((n) => [n.id, n]));

  // 直接供應商 (誰供應給當前節點)
  const directSuppliers = edges
    .filter(
      (e) =>
        e.target === node.id &&
        (e.relation_type === 'SUPPLIES_TO' || e.relation_type === 'DEPENDS_ON')
    )
    .map((e) => {
      const srcId = e.source;
      return {
        supplier: nodeMap.get(srcId),
        edge: e,
      };
    })
    .filter((item) => item.supplier !== undefined);

  // 直接客戶 (當前節點供應給誰)
  const directCustomers = edges
    .filter(
      (e) =>
        e.source === node.id &&
        e.relation_type === 'SUPPLIES_TO'
    )
    .map((e) => {
      const tgtId = e.target;
      return {
        customer: nodeMap.get(tgtId),
        edge: e,
      };
    })
    .filter((item) => item.customer !== undefined);

  const meta = node.metadata || {};

  return (
    <aside className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-20">
      {/* 頂部 Header */}
      <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              L{node.layer_id} · {layer?.name_zh}
            </span>
            {meta.ticker && (
              <span className="text-xs font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                {meta.ticker}
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-100">{node.name_zh}</h2>
          <p className="text-xs text-slate-400 font-medium">{node.name_en}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 當前衝擊受損資訊 (若有模擬) */}
        {shockImpact && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-xs space-y-1">
            <div className="flex items-center justify-between text-rose-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
                {shockImpact.is_trigger ? '外生斷鏈衝擊源' : `連鎖受損 (${shockImpact.depth} 階下游)`}
              </span>
              <span className="font-mono text-sm text-rose-400">
                -{shockImpact.severity_pct}% 產能
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              累積前置時間延遲: <strong className="text-slate-200">{shockImpact.cumulative_lead_time_days} 天</strong>
            </div>
            {shockImpact.est_value_loss_bil !== undefined && shockImpact.est_value_loss_bil > 0 && (
              <div className="text-[11px] text-amber-400">
                預估價值蒸發: ~${shockImpact.est_value_loss_bil} B
              </div>
            )}
          </div>
        )}

        {/* 觸發衝擊按鈕 */}
        {onTriggerShock && (
          <button
            onClick={() => onTriggerShock(node.id)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg text-rose-300 font-semibold text-xs transition-all shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            以此節點模擬斷鏈衝擊 (Simulate Shock)
          </button>
        )}

        {/* 計量與財務關鍵指標卡片 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 block mb-1">全球市佔率</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-indigo-400 font-mono">
                {node.global_market_share_pct}%
              </span>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-[11px] text-slate-400 block mb-1">替代彈性指標 (CES)</span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl font-bold font-mono ${
                  node.elasticity_score < 0.2
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                {node.elasticity_score}
              </span>
              <span className="text-[10px] text-slate-500">
                {node.elasticity_score < 0.2 ? '(極度剛性)' : '(可替換)'}
              </span>
            </div>
          </div>
          {meta.market_cap_bil && (
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <span className="text-[11px] text-slate-400 block mb-1">市值 (Market Cap)</span>
              <span className="text-sm font-bold text-slate-200 font-mono">
                ${meta.market_cap_bil} B
              </span>
            </div>
          )}
          {meta.country && (
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
              <span className="text-[11px] text-slate-400 block mb-1">總部管轄國</span>
              <span className="text-sm font-bold text-slate-200 font-mono">
                {meta.country}
              </span>
            </div>
          )}
        </div>

        {/* 瓶頸預警 Alert */}
        {node.elasticity_score < 0.2 && (
          <div className="bg-rose-950/30 border border-rose-800/60 rounded-lg p-3 flex items-start gap-2 text-rose-300 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>
              <strong>系統性單點瓶頸：</strong> 該節點替代彈性極低（
              {node.elasticity_score}），一旦受到地緣政治制裁或天災，其衝擊將藉由
              Leontief 傳導矩陣沿供應鏈向後放大。
            </span>
          </div>
        )}

        {/* 直接上游依賴供應商 (Upstream Suppliers) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
              直接關鍵供應商 ({directSuppliers.length})
            </span>
          </div>

          {directSuppliers.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-2 bg-slate-950/30 rounded">
              暫無已收錄直接一階供應商
            </div>
          ) : (
            <div className="space-y-1.5">
              {directSuppliers.map(({ supplier, edge }) => (
                <div
                  key={supplier!.id}
                  onClick={() => onSelectNode(supplier!)}
                  className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-lg cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-indigo-300">
                      {supplier!.name_zh}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      交期 {edge.lead_time_days} 天 · 營收曝險 {edge.revenue_exposure_pct}%
                    </div>
                  </div>
                  {edge.is_single_source && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                      獨家供貨
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 直接下游客戶 (Downstream Customers) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-indigo-400" />
              直接下游客戶 ({directCustomers.length})
            </span>
          </div>

          {directCustomers.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-2 bg-slate-950/30 rounded">
              暫無已收錄直接客戶
            </div>
          ) : (
            <div className="space-y-1.5">
              {directCustomers.map(({ customer, edge }) => (
                <div
                  key={customer!.id}
                  onClick={() => onSelectNode(customer!)}
                  className="p-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-lg cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-indigo-300">
                      {customer!.name_zh}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      依賴度 {Math.round(edge.dependency_weight * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 💼 求職者導航：本層級關鍵職缺與技能樹 */}
        {node && (
          <div className={`mt-4 p-3.5 rounded-xl border ${
            isCareerMode 
              ? 'bg-emerald-950/30 border-emerald-600/80 shadow-lg shadow-emerald-950/50' 
              : 'bg-slate-950/70 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Briefcase className="w-4 h-4" />
                L{node.layer_id} 核心求職天梯與技能樹
              </span>
              {LAYER_CAREER_PROFILES[node.layer_id] && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {LAYER_CAREER_PROFILES[node.layer_id].salaryTier.split(' ')[0]}
                </span>
              )}
            </div>

            {LAYER_CAREER_PROFILES[node.layer_id] && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <div className="text-slate-400 mb-1">
                    工時節奏: <strong className="text-slate-200">{LAYER_CAREER_PROFILES[node.layer_id].workLifeBalance}</strong>
                  </div>
                  <div className="text-emerald-300 text-[10px] leading-relaxed">
                    🛡️ <strong>職業護城河:</strong> {LAYER_CAREER_PROFILES[node.layer_id].growthMoat}
                  </div>
                </div>

                {/* 代表性核心職缺 */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-300 block">
                    🎯 代表性招募職缺:
                  </span>
                  {LAYER_CAREER_PROFILES[node.layer_id].representativeRoles.map((role, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
                      <div className="font-semibold text-slate-200 text-xs mb-1">
                        {role.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                        {role.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {role.requiredSkills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 bg-slate-800 text-emerald-300 text-[10px] rounded border border-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
