export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  type: "input" | "analysis" | "decision" | "conditional" | "parallel";
  status: "pending" | "processing" | "completed" | "failed";
  decision?: string;
  reasoning?: string;
  details?: {
    summary: string;
    keyPoints: string[];
    metrics?: Record<string, string | number>;
    evidence?: string[];
  };
  performanceLevel?: "exceptional" | "strong" | "moderate" | "weak";
  hasChildren?: boolean;
  isExpanded?: boolean;
}

export interface AnalysisResult {
  nodeId: string;
  decision: string;
  reasoning: string;
  details: WorkflowNodeData["details"];
}
