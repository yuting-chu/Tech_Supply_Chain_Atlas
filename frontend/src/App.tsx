import React, { useState, useEffect } from 'react';
import { LayerNav } from './components/LayerNav/LayerNav';
import { AtlasGraph } from './components/GraphView/AtlasGraph';
import { DetailPanel } from './components/DetailPanel/DetailPanel';
import { ShockModal } from './components/ShockModal/ShockModal';
import { BeginnerTour } from './components/BeginnerTour/BeginnerTour';
import { CareerBar } from './components/CareerNav/CareerBar';
import { BEGINNER_STEPS } from './data/beginnerSteps';
import { MajorCategory, MAJOR_CATEGORIES } from './data/careerData';
import { Layer, AtlasNode, AtlasEdge, AffectedNode, ShockSimulationResponse, ViewMode } from './types/atlas';
import {
  Activity,
  Database,
  GitBranch,
  Sparkles,
  Zap,
  RotateCcw,
  GraduationCap,
  Briefcase,
  Compass,
} from 'lucide-react';

export default function App() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [nodes, setNodes] = useState<AtlasNode[]>([]);
  const [edges, setEdges] = useState<AtlasEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
  const [loading, setLoading] = useState(true);

  // 視角模式 (Explore / Beginner / Career)
  const [viewMode, setViewMode] = useState<ViewMode>('EXPLORE');

  // 衝擊模擬狀態
  const [isShockModalOpen, setIsShockModalOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState<ShockSimulationResponse | null>(null);
  const [shockMap, setShockMap] = useState<Record<string, AffectedNode>>({});
  const [shockInitialNodeId, setShockInitialNodeId] = useState<string>('COMP_TSMC');

  // 初學者導覽狀態
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // 求職者模式狀態
  const [selectedMajor, setSelectedMajor] = useState<MajorCategory | 'ALL'>('ALL');

  // 載入資料
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

  // 初學者導覽控制
  const handleStartTour = () => {
    setViewMode('BEGINNER_TOUR');
    setTourStepIndex(0);
    const step = BEGINNER_STEPS[0];
    setSelectedLayers([step.layerId]);
    const firstNode = nodes.find((n) => n.id === step.featuredNodeIds[0]);
    if (firstNode) setSelectedNode(firstNode);
  };

  const handleTourStepChange = (newIndex: number) => {
    setTourStepIndex(newIndex);
    const step = BEGINNER_STEPS[newIndex];
    setSelectedLayers([step.layerId]);
    const firstNode = nodes.find((n) => n.id === step.featuredNodeIds[0]);
    if (firstNode) setSelectedNode(firstNode);
  };

  const handleCloseTour = () => {
    setViewMode('EXPLORE');
    setSelectedLayers([1, 2, 3, 4, 5, 6, 7, 8]);
  };

  // 求職者模式控制
  const handleStartCareerMode = () => {
    if (viewMode === 'CAREER_NAVIGATOR') {
      setViewMode('EXPLORE');
      setSelectedMajor('ALL');
      setSelectedLayers([1, 2, 3, 4, 5, 6, 7, 8]);
    } else {
      setViewMode('CAREER_NAVIGATOR');
      setSelectedMajor('ALL');
    }
  };

  const handleSelectMajor = (major: MajorCategory | 'ALL') => {
    setSelectedMajor(major);
    if (major === 'ALL') {
      setSelectedLayers([1, 2, 3, 4, 5, 6, 7, 8]);
    } else {
      const info = MAJOR_CATEGORIES[major];
      setSelectedLayers(info.primaryLayers);
    }
  };

  // 衝擊模擬控制
  const handleRunSimulation = async (nodeId: string, shockPct: number): Promise<ShockSimulationResponse | null> => {
    try {
      const res = await fetch('/api/v1/simulate/shock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node_id: nodeId, shock_pct: shockPct }),
      });
      const json = await res.json();
      if (json?.data) {
        const data: ShockSimulationResponse = json.data;
        setSimulationResult(data);
        const map: Record<string, AffectedNode> = {};
        data.affected_nodes.forEach((n) => {
          map[n.node_id] = n;
        });
        setShockMap(map);
        return data;
      }
    } catch (err) {
      console.error('Shock simulation failed', err);
    }
    return null;
  };

  const handleResetSimulation = () => {
    setSimulationResult(null);
    setShockMap({});
  };

  const handleOpenShockWithNode = (nodeId: string) => {
    setShockInitialNodeId(nodeId);
    setIsShockModalOpen(true);
  };

  const currentLayer = layers.find((l) => l.layer_id === selectedNode?.layer_id);
  const currentShockImpact = selectedNode ? shockMap[selectedNode.id] : undefined;

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
                v0.4.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">全球半導體與科技硬體 8 大層級全景圖譜</p>
          </div>
        </div>

        {/* 模式切換器與工具列 */}
        <div className="flex items-center gap-3">
          {/* 初學者模式按鈕 */}
          <button
            onClick={viewMode === 'BEGINNER_TOUR' ? handleCloseTour : handleStartTour}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              viewMode === 'BEGINNER_TOUR'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/40 ring-2 ring-indigo-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-indigo-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            {viewMode === 'BEGINNER_TOUR' ? '退出導覽 (自由探索)' : '🎓 晶片誕生之旅 (初學者)'}
          </button>

          {/* 求職者模式按鈕 */}
          <button
            onClick={handleStartCareerMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              viewMode === 'CAREER_NAVIGATOR'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/40 ring-2 ring-emerald-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-800/60'
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-300" />
            {viewMode === 'CAREER_NAVIGATOR' ? '退出求職 (自由探索)' : '💼 半導體求職導航'}
          </button>

          {/* 衝擊模擬器狀態 */}
          {simulationResult && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              <span className="flex items-center gap-1 font-semibold">
                <Zap className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                模擬中斷: {simulationResult.trigger_node.name_zh} (-{simulationResult.shock_magnitude_pct}%)
              </span>
              <button
                onClick={handleResetSimulation}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline ml-1"
              >
                清除
              </button>
            </div>
          )}

          <button
            onClick={() => setIsShockModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-900/30 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            斷鏈衝擊模擬
          </button>

          <div className="h-4 w-px bg-slate-800" />

          {/* 統計指標 */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>節點: <strong className="text-slate-200 font-mono">{nodes.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>關係: <strong className="text-slate-200 font-mono">{edges.length}</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* 核心三欄內容主體 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 求職導航浮動頂條 (若啟用求職者模式) */}
        {viewMode === 'CAREER_NAVIGATOR' && (
          <CareerBar
            selectedMajor={selectedMajor}
            onSelectMajor={handleSelectMajor}
            onClose={() => setViewMode('EXPLORE')}
          />
        )}

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
          shockMap={shockMap}
          isCareerMode={viewMode === 'CAREER_NAVIGATOR'}
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
            onTriggerShock={handleOpenShockWithNode}
            shockImpact={currentShockImpact}
            isCareerMode={viewMode === 'CAREER_NAVIGATOR'}
          />
        )}

        {/* 初學者導覽浮動控制面板 (若啟用初學者模式) */}
        {viewMode === 'BEGINNER_TOUR' && (
          <BeginnerTour
            currentStepIndex={tourStepIndex}
            onStepChange={handleTourStepChange}
            onClose={handleCloseTour}
            allNodes={nodes}
            onSelectNode={setSelectedNode}
          />
        )}
      </div>

      {/* 斷鏈衝擊傳導模擬彈窗 */}
      <ShockModal
        isOpen={isShockModalOpen}
        onClose={() => setIsShockModalOpen(false)}
        nodes={nodes}
        initialNodeId={shockInitialNodeId}
        onRunSimulation={handleRunSimulation}
        activeSimulation={simulationResult}
        onResetSimulation={handleResetSimulation}
      />
    </div>
  );
}
