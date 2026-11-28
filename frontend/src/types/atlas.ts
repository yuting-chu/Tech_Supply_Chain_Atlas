export type LayerCode = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';

export type ViewMode = 'EXPLORE' | 'BEGINNER_TOUR' | 'CAREER_NAVIGATOR' | 'INVESTOR';

export type InvestorFilter = 'ALL' | 'HIGH_MARGIN' | 'CUSTOMER_CONCENTRATION' | 'GEOPOLITICAL_RISK';

export interface Layer {
  layer_id: number;
  code: LayerCode;
  name_zh: string;
  name_en: string;
  description: string;
  bottleneck_risk_level: number; // 1 ~ 5
}

export interface Subsector {
  subsector_id: number;
  layer_id: number;
  code: string;
  name_zh: string;
  name_en: string;
  hhi_index: number;
  avg_margin_pct: number;
}

export type NodeType = 'COMPANY' | 'PRODUCT' | 'MATERIAL' | 'EQUIPMENT' | 'IP';

export interface AtlasNode {
  id: string;
  node_type: NodeType;
  name_zh: string;
  name_en: string;
  layer_id: number;
  subsector_id?: number;
  elasticity_score: number; // 0 (不可替代) ~ 1 (高度可替代)
  global_market_share_pct: number;
  metadata?: Record<string, any>;
}

export type RelationType = 'SUPPLIES_TO' | 'DEPENDS_ON' | 'LICENSES_TO' | 'CO_DEVELOPS' | 'SUBSTITUTES';

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  relation_type: RelationType;
  dependency_weight: number; // 0.0 ~ 1.0 (技術依賴矩陣係數 a_ij)
  lead_time_days: number;
  revenue_exposure_pct: number;
  is_single_source: boolean;
  qualitative_notes?: string;
}

export interface AffectedNode {
  node_id: string;
  name_zh: string;
  layer_id: number;
  severity_pct: number;
  depth: number;
  cumulative_lead_time_days: number;
  is_trigger: boolean;
  path: string[];
  market_cap_bil?: number;
  est_value_loss_bil?: number;
}

export interface ShockSimulationResponse {
  trigger_node: Record<string, any>;
  shock_magnitude_pct: number;
  affected_count: number;
  total_estimated_value_loss_bil: number;
  max_propagation_depth: number;
  layer_summary: Array<{
    layer_id: number;
    count: number;
    avg_severity_pct: number;
  }>;
  affected_nodes: AffectedNode[];
}
