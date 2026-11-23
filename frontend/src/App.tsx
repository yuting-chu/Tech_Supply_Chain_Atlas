import React, { useState, useEffect } from 'react';
import { LayerNav } from './components/LayerNav/LayerNav';
import { AtlasGraph } from './components/GraphView/AtlasGraph';
import { DetailPanel } from './components/DetailPanel/DetailPanel';
import { Layer, AtlasNode, AtlasEdge } from './types/atlas';
import { Activity, Database, GitBranch, Sparkles } from 'lucide-react';

export default function App() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [nodes, setNodes] = useState<AtlasNode[]>([]);
  const [edges, setEdges] = useState<AtlasEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
  const [loading, setLoading] = useState(true);

  // 載入資料（優先自 FastAPI 後端取得，失敗時載入內建 Seed 資料）
  useEffect(() => {
    async function fetchData() {
      try {
        const [resLayers, resGraph] = await Promise.all([
          fetch('/api/v1/layers').then((r) => r.json()),
          fetch('/api/v1/graph').then((r) => r.json()),
        ]);
        if (resLayers?.data) setLayers(resLayers.data);
        if (resGraph?.nodes) {
          const formattedNodes: AtlasNode[] = resGraph.nodes.map((n: any) => ({
            id: n.node_id,
            node_type: n.node_type,
            name_zh: n.name_zh,
            name_en: n.name_en,
            layer_id: n.layer_id,
            subsector_id: n.subsector_id,
            elasticity_score: n.elasticity_score,
            global_market_share_pct: n.global_market_share_pct,
            metadata: n.metadata,
          }));
          const formattedEdges: AtlasEdge[] = resGraph.edges.map((e: any) => ({
            id: String(e.edge_id),
            source: e.source_node_id,
            target: e.target_node_id,
            relation_type: e.relation_type,
            dependency_weight: e.dependency_weight,
            lead_time_days: e.lead_time_days,
            revenue_exposure_pct: e.revenue_exposure_pct,
            is_single_source: Boolean(e.is_single_source),
            qualitative_notes: e.qualitative_notes,
          }));
          setNodes(formattedNodes);
          setEdges(formattedEdges);
        }
      } catch (err) {
        console.warn('Backend API not responding, using offline seed fallback.', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleToggleLayer = (layerId: number) => {
    setSelectedLayers((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId]
    );
  };

  const handleSelectAllLayers = () => {
    if (selectedLayers.length === layers.length) {
      setSelectedLayers([]);
    } else {
      setSelectedLayers(layers.map((l) => l.layer_id));
    }
  };

  const currentLayer = layers.find((l) => l.layer_id === selectedNode?.layer_id);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      {/* 頂部全域導航列 */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
            Ω
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Tech Supply Chain Atlas
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                v0.1.0-alpha
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">全球半導體與科技硬體 8 大層級全景圖譜</p>
          </div>
        </div>

        {/* 統計與模式膠囊 */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>節點數: <strong className="text-slate-200 font-mono">{nodes.length}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>依賴關係: <strong className="text-slate-200 font-mono">{edges.length}</strong></span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>計量經濟視角: Leontief 網絡拓撲</span>
          </div>
        </div>
      </header>

      {/* 核心三欄內容主體 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左欄：8 大層級階梯導航 */}
        <LayerNav
          layers={layers}
          selectedLayers={selectedLayers}
          onToggleLayer={handleToggleLayer}
          onSelectAll={handleSelectAllLayers}
        />

        {/* 中欄：動態圖形視覺化拓撲畫布 */}
        <AtlasGraph
          nodes={nodes}
          edges={edges}
          selectedLayers={selectedLayers}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
        />

        {/* 右欄：節點深度洞察側邊抽屜 */}
        {selectedNode && (
          <DetailPanel
            node={selectedNode}
            layer={currentLayer}
            edges={edges}
            allNodes={nodes}
            onClose={() => setSelectedNode(null)}
            onSelectNode={setSelectedNode}
          />
        )}
      </div>
    </div>
  );
}
