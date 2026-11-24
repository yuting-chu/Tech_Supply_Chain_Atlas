import React, { useState, useMemo } from 'react';
import { AtlasNode, AtlasEdge } from '../../types/atlas';

interface AtlasGraphProps {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  selectedLayers: number[];
  selectedNode: AtlasNode | null;
  onSelectNode: (node: AtlasNode | null) => void;
}

const LAYER_X_MAP: Record<number, number> = {
  1: 120,  // L1 材料
  2: 330,  // L2 設備
  3: 540,  // L3 EDA/IP
  4: 750,  // L4 IC 設計
  5: 960,  // L5 晶圓製造
  6: 1170, // L6 封測
  7: 1380, // L7 零組件/HBM
  8: 1590, // L8 終端/CSP
};

const LAYER_COLORS: Record<number, string> = {
  1: '#3B82F6',
  2: '#06B6D4',
  3: '#10B981',
  4: '#F59E0B',
  5: '#EF4444',
  6: '#8B5CF6',
  7: '#EC4899',
  8: '#6366F1',
};

export const AtlasGraph: React.FC<AtlasGraphProps> = ({
  nodes,
  edges,
  selectedLayers,
  selectedNode,
  onSelectNode,
}) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 過濾當前選中層級的節點
  const visibleNodes = useMemo(() => {
    return nodes.filter((n) => selectedLayers.includes(n.layer_id));
  }, [nodes, selectedLayers]);

  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((n) => n.id)),
    [visibleNodes]
  );

  // 過濾可見的邊
  const visibleEdges = useMemo(() => {
    return edges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );
  }, [edges, visibleNodeIds]);

  // 為每個層級的節點分配 Y 軸坐標
  const nodePositions = useMemo(() => {
    const layerGroups: Record<number, AtlasNode[]> = {};
    visibleNodes.forEach((n) => {
      if (!layerGroups[n.layer_id]) layerGroups[n.layer_id] = [];
      layerGroups[n.layer_id].push(n);
    });

    const posMap: Record<string, { x: number; y: number }> = {};
    Object.keys(layerGroups).forEach((layerKey) => {
      const lid = Number(layerKey);
      const list = layerGroups[lid];
      const startY = 90;
      const gapY = 82;
      list.forEach((node, idx) => {
        posMap[node.id] = {
          x: LAYER_X_MAP[lid] || 500,
          y: startY + idx * gapY,
        };
      });
    });
    return posMap;
  }, [visibleNodes]);

  // 計算與當前選中節點有連線的相關節點 ID
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return null;
    const ids = new Set<string>([selectedNode.id]);
    edges.forEach((e) => {
      if (e.source === selectedNode.id) ids.add(e.target);
      if (e.target === selectedNode.id) ids.add(e.source);
    });
    return ids;
  }, [selectedNode, edges]);

  // 畫布拖曳處理
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.35), 2.5));
  };

  return (
    <div
      className="relative flex-1 h-full bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 畫布控制按鈕 */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1.5 backdrop-blur shadow-lg text-xs text-slate-300">
        <button
          onClick={() => setScale((s) => Math.min(s + 0.15, 2.0))}
          className="px-2 py-1 hover:bg-slate-800 rounded font-bold"
        >
          +
        </button>
        <span className="font-mono">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.15, 0.4))}
          className="px-2 py-1 hover:bg-slate-800 rounded font-bold"
        >
          -
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPan({ x: 40, y: 50 });
          }}
          className="px-2 py-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
        >
          重置
        </button>
      </div>

      {/* 層級標籤提示頂條 */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          紅色邊：單一來源獨家供貨 (Single Source)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-indigo-400" />
          粗細：依賴度係數 (Dependency Weight)
        </span>
      </div>

      {/* SVG 向量拓撲圖 */}
      <svg
        id="graph-bg"
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748B" />
          </marker>
          <marker
            id="arrow-single"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
          </marker>
        </defs>

        {/* 層級垂直引導背景線 */}
        {selectedLayers.map((lid) => {
          const x = LAYER_X_MAP[lid];
          return (
            <g key={`col-${lid}`}>
              <line
                x1={x}
                y1={40}
                x2={x}
                y2={900}
                stroke="#1E293B"
                strokeDasharray="4 4"
              />
              <text
                x={x}
                y={60}
                textAnchor="middle"
                fill="#475569"
                fontSize="12"
                fontWeight="bold"
                className="select-none"
              >
                L{lid}
              </text>
            </g>
          );
        })}

        {/* 依賴關係連線 (Edges) */}
        {visibleEdges.map((edge) => {
          const src = nodePositions[edge.source];
          const tgt = nodePositions[edge.target];
          if (!src || !tgt) return null;

          const isRelatedToSelected =
            selectedNode &&
            (edge.source === selectedNode.id || edge.target === selectedNode.id);

          const isDimmed = selectedNode && !isRelatedToSelected;

          // 貝茲曲線控制點
          const dx = tgt.x - src.x;
          const curvePath = `M ${src.x} ${src.y} C ${src.x + dx * 0.5} ${
            src.y
          }, ${src.x + dx * 0.5} ${tgt.y}, ${tgt.x} ${tgt.y}`;

          const strokeWidth = Math.max(edge.dependency_weight * 3.5, 1.2);
          const strokeColor = edge.is_single_source
            ? '#EF4444'
            : isRelatedToSelected
            ? '#38BDF8'
            : '#475569';

          return (
            <g key={edge.id || `${edge.source}-${edge.target}`}>
              <path
                d={curvePath}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isRelatedToSelected ? strokeWidth + 1.5 : strokeWidth}
                strokeDasharray={edge.is_single_source ? '4 3' : undefined}
                markerEnd={
                  edge.is_single_source
                    ? 'url(#arrow-single)'
                    : isRelatedToSelected
                    ? 'url(#arrow-active)'
                    : 'url(#arrow)'
                }
                opacity={isDimmed ? 0.15 : isRelatedToSelected ? 1 : 0.6}
                className="transition-all duration-200"
              />
            </g>
          );
        })}

        {/* 節點 (Nodes) */}
        {visibleNodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;

          const isSelected = selectedNode?.id === node.id;
          const isConnected = connectedNodeIds?.has(node.id);
          const isDimmed = selectedNode && !isConnected;

          const color = LAYER_COLORS[node.layer_id] || '#94A3B8';

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(isSelected ? null : node);
              }}
              className="cursor-pointer"
              opacity={isDimmed ? 0.25 : 1}
            >
              {/* 外圈光暈 */}
              {isSelected && (
                <circle
                  r="32"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="animate-spin"
                  style={{ animationDuration: '8s' }}
                />
              )}

              {/* 節點主圓圈 */}
              <circle
                r={isSelected ? "24" : "20"}
                fill="#0F172A"
                stroke={color}
                strokeWidth={isSelected ? "3" : "2"}
                className="transition-all hover:scale-110"
              />

              {/* 替代彈性小圓標 (0~1) */}
              <circle
                cx="14"
                cy="-14"
                r="6"
                fill={node.elasticity_score < 0.2 ? '#EF4444' : '#10B981'}
              />

              {/* 節點文字標籤 */}
              <text
                y="34"
                textAnchor="middle"
                fill={isSelected ? '#F8FAFC' : '#CBD5E1'}
                fontSize="11"
                fontWeight={isSelected ? 'bold' : 'normal'}
                className="select-none pointer-events-none"
              >
                {node.name_zh.split(' ')[0]}
              </text>
              <text
                y="46"
                textAnchor="middle"
                fill="#64748B"
                fontSize="9"
                className="select-none pointer-events-none font-mono"
              >
                市佔 {node.global_market_share_pct}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
