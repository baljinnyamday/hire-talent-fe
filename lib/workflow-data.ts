import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type { WorkflowNodeData } from "@/app/workflow/types";
import pipelineData from "./workflow-data.json";

export interface CandidateWorkflow {
  id: string;
  candidateName: string;
  position: string;
  appliedDate: string;
  status: "recommended" | "rejected" | "pending" | "interview_scheduled";
  overallScore: number;
  resumeScore: number;
  githubScore: number;
  projectScore: number;
  decision: string;
  avatar?: string;
}

export interface ColorTheme {
  primary: string;
  primaryLight: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  edgePrimary: string;
  edgeParallel: string;
  edgeSuccess: string;
  edgeError: string;
}

// JSON Pipeline Data Interfaces
interface PipelineStep {
  id: string;
  type: string;
  name: string;
  status: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reason: string;
  decisionPoint: string | null;
  toolUsed: string | null;
  error: string | null;
  metrics: {
    tokens: number | null;
    cost: number | null;
    filesProcessed: number | null;
  };
}

interface Pipeline {
  executionId: string;
  pipeline: string;
  repository: {
    type: string;
    path: string;
  };
  config: {
    jobTitle: string;
    salaryRange: string | null;
    additionalRequirements: string[];
  };
  timeline: PipelineStep[];
  summary: {
    status: string;
    success: boolean;
    startTime: string;
    endTime: string;
    totalDurationMs: number;
    totalTokens: number;
    totalCostUsd: number;
    filesAnalyzed: number;
  };
}

interface PipelineData {
  metadata: {
    combined_at: string;
    source_files: Record<string, string>;
  };
  pipelines: {
    jd_generation: Pipeline;
    candidate_evaluation: Pipeline;
    resume_jd_match: Pipeline;
  };
}

function getColorTheme(score: number): ColorTheme {
  if (score >= 90) {
    // Exceptional - Green theme
    return {
      primary: "#10b981",
      primaryLight: "#d1fae5",
      secondary: "#059669",
      success: "#22c55e",
      error: "#ef4444",
      warning: "#f59e0b",
      edgePrimary: "#10b981",
      edgeParallel: "#34d399",
      edgeSuccess: "#22c55e",
      edgeError: "#ef4444",
    };
  } else if (score >= 80) {
    // Strong - Blue theme
    return {
      primary: "#3b82f6",
      primaryLight: "#dbeafe",
      secondary: "#2563eb",
      success: "#22c55e",
      error: "#ef4444",
      warning: "#f59e0b",
      edgePrimary: "#3b82f6",
      edgeParallel: "#60a5fa",
      edgeSuccess: "#22c55e",
      edgeError: "#ef4444",
    };
  } else if (score >= 70) {
    // Moderate - Purple theme
    return {
      primary: "#8b5cf6",
      primaryLight: "#ede9fe",
      secondary: "#7c3aed",
      success: "#a78bfa",
      error: "#ef4444",
      warning: "#f59e0b",
      edgePrimary: "#8b5cf6",
      edgeParallel: "#a78bfa",
      edgeSuccess: "#c4b5fd",
      edgeError: "#ef4444",
    };
  } else {
    // Below threshold - Orange/Red theme
    return {
      primary: "#f97316",
      primaryLight: "#ffedd5",
      secondary: "#ea580c",
      success: "#fbbf24",
      error: "#dc2626",
      warning: "#f59e0b",
      edgePrimary: "#f97316",
      edgeParallel: "#fb923c",
      edgeSuccess: "#fbbf24",
      edgeError: "#dc2626",
    };
  }
}

function getPositionVariation(candidateId: string): {
  baseX: number;
  ySpacing: number;
  xVariation: number;
  branchOffset: number;
} {
  // Generate consistent but varied positions based on candidate ID
  const hash = candidateId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Wide horizontal separation - columns are 600px apart to prevent overlap
  // Nodes are 250px wide, so 600px spacing gives plenty of room
  const columns = [100, 700, 1300, 1900, 2500];
  const baseX = columns[hash % columns.length];

  // Consistent vertical spacing with slight variation
  const ySpacing = 180 + (hash % 4) * 15; // 180, 195, 210, or 225

  // Small horizontal jitter for visual interest (but keep it neat)
  const xVariation = ((hash % 7) - 3) * 20; // -60 to +60 in steps of 20

  // Branch offset for parallel paths
  const branchOffset = 300 + (hash % 5) * 30; // 300, 330, 360, 390, or 420

  return { baseX, ySpacing, xVariation, branchOffset };
}

// Helper function to map pipeline step types to node types
function mapStepTypeToNodeType(stepType: string): WorkflowNodeData["type"] {
  switch (stepType) {
    case "detection":
      return "input";
    case "initialization":
      return "input";
    case "agent_reasoning":
      return "analysis";
    case "output_generation":
      return "decision";
    default:
      return "analysis";
  }
}

// Helper function to extract key points from step data
function extractKeyPoints(step: PipelineStep): string[] {
  const points: string[] = [];

  // Add input info
  if (step.input) {
    Object.entries(step.input).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        points.push(`Input ${key}: ${value}`);
      } else if (value && typeof value === 'object') {
        points.push(`Input ${key}: ${JSON.stringify(value).substring(0, 50)}...`);
      }
    });
  }

  // Add output info
  if (step.output) {
    Object.entries(step.output).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        points.push(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
      }
    });
  }

  // Add decision point if exists
  if (step.decisionPoint) {
    points.push(`Decision: ${step.decisionPoint}`);
  }

  return points.length > 0 ? points : ["No additional details"];
}

// Helper function to format metrics
function formatMetrics(step: PipelineStep): Record<string, string | number> {
  const metrics: Record<string, string | number> = {};

  if (step.durationMs) {
    metrics["Duration"] = `${(step.durationMs / 1000).toFixed(2)}s`;
  }

  if (step.metrics.tokens) {
    metrics["Tokens Used"] = step.metrics.tokens.toLocaleString();
  }

  if (step.metrics.cost) {
    metrics["Cost"] = `$${step.metrics.cost.toFixed(4)}`;
  }

  if (step.metrics.filesProcessed) {
    metrics["Files Processed"] = step.metrics.filesProcessed;
  }

  metrics["Status"] = step.status.toUpperCase();

  return metrics;
}

// Convert all pipelines to candidate workflows for listing
export function getPipelineCandidates(): CandidateWorkflow[] {
  const data = pipelineData as PipelineData;
  const candidates: CandidateWorkflow[] = [];

  // Helper to map recommendation to status
  const mapRecommendationToStatus = (recommendation: string, score: number): CandidateWorkflow["status"] => {
    if (recommendation === "no-hire") return "rejected";
    if (recommendation === "partial-match") return "pending";
    if (score >= 80) return "recommended";
    return "pending";
  };

  // 1. JD Generation Pipeline Candidate
  const jdPipeline = data.pipelines.jd_generation;
  if (jdPipeline) {
    const reasoningStep = jdPipeline.timeline.find(s => s.type === "agent_reasoning");
    candidates.push({
      id: jdPipeline.executionId,
      candidateName: `JD Generation - ${jdPipeline.repository.path}`,
      position: jdPipeline.config.jobTitle || "Position from Repository Analysis",
      appliedDate: new Date(jdPipeline.summary.startTime).toISOString().split('T')[0],
      status: "interview_scheduled",
      overallScore: 85,
      resumeScore: 8.5,
      githubScore: 8.5,
      projectScore: 8.5,
      decision: "JD Generated Successfully",
    });
  }

  // 2. Candidate Evaluation Pipeline
  const evalPipeline = data.pipelines.candidate_evaluation;
  if (evalPipeline) {
    const reasoningStep = evalPipeline.timeline.find(s => s.type === "agent_reasoning");
    const overallScore = typeof reasoningStep?.output?.overall_score === 'number'
      ? reasoningStep.output.overall_score
      : 50;
    const recommendation = typeof reasoningStep?.output?.recommendation === 'string'
      ? reasoningStep.output.recommendation
      : "pending";

    // Extract candidate name from file path
    const fileName = evalPipeline.repository.path.split('/').pop()?.replace('.pdf', '') || "Candidate";

    candidates.push({
      id: evalPipeline.executionId,
      candidateName: `Candidate - ${fileName}`,
      position: evalPipeline.config.jobTitle || "Evaluated Position",
      appliedDate: new Date(evalPipeline.summary.startTime).toISOString().split('T')[0],
      status: mapRecommendationToStatus(recommendation, overallScore),
      overallScore: overallScore,
      resumeScore: overallScore / 10,
      githubScore: overallScore / 10,
      projectScore: overallScore / 10,
      decision: recommendation.toUpperCase().replace(/-/g, ' '),
    });
  }

  // 3. Resume-JD Match Pipeline
  const matchPipeline = data.pipelines.resume_jd_match;
  if (matchPipeline) {
    const reasoningStep = matchPipeline.timeline.find(s => s.type === "agent_reasoning");
    const overallScore = typeof reasoningStep?.output?.overall_score === 'number'
      ? reasoningStep.output.overall_score
      : 50;
    const recommendation = typeof reasoningStep?.output?.recommendation === 'string'
      ? reasoningStep.output.recommendation
      : "pending";

    const fileName = matchPipeline.repository.path.split('/').pop()?.replace('.pdf', '') || "Resume";

    candidates.push({
      id: matchPipeline.executionId,
      candidateName: `Resume Match - ${fileName}`,
      position: matchPipeline.config.jobTitle || "Matched Position",
      appliedDate: new Date(matchPipeline.summary.startTime).toISOString().split('T')[0],
      status: mapRecommendationToStatus(recommendation, overallScore),
      overallScore: overallScore,
      resumeScore: overallScore / 10,
      githubScore: overallScore / 10,
      projectScore: overallScore / 10,
      decision: recommendation.toUpperCase().replace(/-/g, ' '),
    });
  }

  return candidates;
}

// Convert pipeline timeline to workflow nodes
export function getPipelineWorkflowNodes(pipelineType: "jd_generation" | "candidate_evaluation" | "resume_jd_match") {
  const data = pipelineData as PipelineData;
  const pipeline = data.pipelines[pipelineType];

  if (!pipeline) return [];

  const theme = getColorTheme(75); // Use moderate theme for now
  // @ts-ignore
  const nodes: Node<WorkflowNodeData>[] = [];

  const baseX = 100;
  const ySpacing = 200;
  let currentY = 0;

  pipeline.timeline.forEach((step, index) => {
    const nodeType = mapStepTypeToNodeType(step.type);
    const keyPoints = extractKeyPoints(step);
    const metrics = formatMetrics(step);

    nodes.push({
      id: step.id,
      type: "workflowNode",
      position: {
        x: baseX + (index % 2) * 100, // Slight zigzag pattern
        y: currentY
      },
      data: {
        label: step.name,
        type: nodeType,
        status: step.status === "success" ? "completed" : (step.status as "pending" | "processing" | "completed" | "failed"),
        performanceLevel: "moderate",
        decision: step.decisionPoint || step.output?.jd_generated ? "Success" : undefined,
        reasoning: step.reason,
        details: {
          summary: `${step.name} - ${step.type}`,
          keyPoints: keyPoints,
          metrics: metrics,
          evidence: step.toolUsed ? [`Tool used: ${step.toolUsed}`] : undefined,
        },
      },
    });

    currentY += ySpacing;
  });

  return nodes;
}

// Convert pipeline to workflow edges
export function getPipelineWorkflowEdges(pipelineType: "jd_generation" | "candidate_evaluation" | "resume_jd_match"): Edge[] {
  const data = pipelineData as PipelineData;
  const pipeline = data.pipelines[pipelineType];

  if (!pipeline) return [];

  const theme = getColorTheme(75);
  const edges: Edge[] = [];

  // Connect steps sequentially
  for (let i = 0; i < pipeline.timeline.length - 1; i++) {
    const currentStep = pipeline.timeline[i];
    const nextStep = pipeline.timeline[i + 1];

    edges.push({
      id: `e${currentStep.id}-${nextStep.id}`,
      source: currentStep.id,
      target: nextStep.id,
      animated: true,
      label: `→ ${nextStep.type}`,
      style: { stroke: theme.edgePrimary, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    });
  }

  return edges;
}

// Combined workflow showing all three pipelines
export function getCombinedWorkflowNodes() {
  const data = pipelineData as PipelineData;
  // @ts-ignore
  const nodes: Node<WorkflowNodeData>[] = [];
  const theme = getColorTheme(75);

  const currentY = 0;
  const columnSpacing = 600;
  const ySpacing = 200;

  // JD Generation Pipeline (Column 1)
  const jdPipeline = data.pipelines.jd_generation;
  jdPipeline.timeline.forEach((step, index) => {
    nodes.push({
      id: `jd_${step.id}`,
      type: "workflowNode",
      position: { x: 100, y: currentY + index * ySpacing },
      data: {
        label: `[JD] ${step.name}`,
        type: mapStepTypeToNodeType(step.type),
        status: step.status === "success" ? "completed" : (step.status as "pending" | "processing" | "completed" | "failed"),
        performanceLevel: "strong",
        decision: step.decisionPoint || undefined,
        reasoning: step.reason,
        details: {
          summary: step.reason,
          keyPoints: extractKeyPoints(step),
          metrics: formatMetrics(step),
        },
      },
    });
  });

  // Candidate Evaluation Pipeline (Column 2)
  const evalPipeline = data.pipelines.candidate_evaluation;
  evalPipeline.timeline.forEach((step, index) => {
    nodes.push({
      id: `eval_${step.id}`,
      type: "workflowNode",
      position: { x: columnSpacing, y: currentY + index * ySpacing },
      data: {
        label: `[Eval] ${step.name}`,
        type: mapStepTypeToNodeType(step.type),
        status: step.status === "success" ? "completed" : (step.status as "pending" | "processing" | "completed" | "failed"),
        performanceLevel: "moderate",
        decision: step.decisionPoint || undefined,
        reasoning: step.reason,
        details: {
          summary: step.reason,
          keyPoints: extractKeyPoints(step),
          metrics: formatMetrics(step),
        },
      },
    });
  });

  // Resume-JD Match Pipeline (Column 3)
  const matchPipeline = data.pipelines.resume_jd_match;
  matchPipeline.timeline.forEach((step, index) => {
    nodes.push({
      id: `match_${step.id}`,
      type: "workflowNode",
      position: { x: columnSpacing * 2, y: currentY + index * ySpacing },
      data: {
        label: `[Match] ${step.name}`,
        type: mapStepTypeToNodeType(step.type),
        status: step.status === "success" ? "completed" : (step.status as "pending" | "processing" | "completed" | "failed"),
        performanceLevel: "moderate",
        decision: step.decisionPoint || undefined,
        reasoning: step.reason,
        details: {
          summary: step.reason,
          keyPoints: extractKeyPoints(step),
          metrics: formatMetrics(step),
        },
      },
    });
  });

  return nodes;
}

export function getCombinedWorkflowEdges(): Edge[] {
  const data = pipelineData as PipelineData;
  const edges: Edge[] = [];
  const theme = getColorTheme(75);

  // JD Generation edges
  const jdPipeline = data.pipelines.jd_generation;
  for (let i = 0; i < jdPipeline.timeline.length - 1; i++) {
    edges.push({
      id: `e_jd_${i}`,
      source: `jd_${jdPipeline.timeline[i].id}`,
      target: `jd_${jdPipeline.timeline[i + 1].id}`,
      animated: true,
      style: { stroke: "#3b82f6", strokeWidth: 2 },
    });
  }

  // Candidate Evaluation edges
  const evalPipeline = data.pipelines.candidate_evaluation;
  for (let i = 0; i < evalPipeline.timeline.length - 1; i++) {
    edges.push({
      id: `e_eval_${i}`,
      source: `eval_${evalPipeline.timeline[i].id}`,
      target: `eval_${evalPipeline.timeline[i + 1].id}`,
      animated: true,
      style: { stroke: "#8b5cf6", strokeWidth: 2 },
    });
  }

  // Resume-JD Match edges
  const matchPipeline = data.pipelines.resume_jd_match;
  for (let i = 0; i < matchPipeline.timeline.length - 1; i++) {
    edges.push({
      id: `e_match_${i}`,
      source: `match_${matchPipeline.timeline[i].id}`,
      target: `match_${matchPipeline.timeline[i + 1].id}`,
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 2 },
    });
  }

  // Cross-pipeline connections
  // Connect JD output to Eval input (JD feeds into candidate evaluation)
  edges.push({
    id: "cross_jd_to_eval",
    source: `jd_${jdPipeline.timeline[jdPipeline.timeline.length - 1].id}`,
    target: `eval_${evalPipeline.timeline[0].id}`,
    animated: true,
    label: "JD → Evaluation",
    style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
    labelStyle: { fontSize: 11, fontWeight: 600, fill: "#f59e0b" },
  });

  // Connect JD and Eval to Match (both feed into matching)
  edges.push({
    id: "cross_jd_to_match",
    source: `jd_${jdPipeline.timeline[jdPipeline.timeline.length - 1].id}`,
    target: `match_${matchPipeline.timeline[0].id}`,
    animated: true,
    label: "JD → Match",
    style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
    labelStyle: { fontSize: 11, fontWeight: 600, fill: "#f59e0b" },
  });

  return edges;
}

// Export function to get all candidates (from JSON pipelines only)
export function getAllCandidates(): CandidateWorkflow[] {
  return getPipelineCandidates();
}

export function getWorkflowById(id: string): CandidateWorkflow | undefined {
  const allWorkflows = getPipelineCandidates();
  return allWorkflows.find((w) => w.id === id);
}

// Generate branching workflow visualization from single pipeline
function generateBranchingWorkflowFromPipeline(executionId: string): { nodes: Node<WorkflowNodeData>[], edges: Edge[] } {
  const data = pipelineData as PipelineData;

  // Find which pipeline this execution ID belongs to
  let pipeline: Pipeline | null = null;
  let pipelineName = "";

  if (data.pipelines.jd_generation.executionId === executionId) {
    pipeline = data.pipelines.jd_generation;
    pipelineName = "JD Generation";
  } else if (data.pipelines.candidate_evaluation.executionId === executionId) {
    pipeline = data.pipelines.candidate_evaluation;
    pipelineName = "Candidate Evaluation";
  } else if (data.pipelines.resume_jd_match.executionId === executionId) {
    pipeline = data.pipelines.resume_jd_match;
    pipelineName = "Resume-JD Match";
  }

  if (!pipeline) return { nodes: [], edges: [] };

  const candidate = getWorkflowById(executionId);
  if (!candidate) return { nodes: [], edges: [] };

  const theme = getColorTheme(candidate.overallScore);
  const { baseX, ySpacing, xVariation, branchOffset } = getPositionVariation(executionId);

  const performanceLevel: "exceptional" | "strong" | "moderate" | "weak" =
    candidate.overallScore >= 90 ? "exceptional" :
    candidate.overallScore >= 80 ? "strong" :
    candidate.overallScore >= 70 ? "moderate" : "weak";

  // @ts-ignore
  const nodes: Node<WorkflowNodeData>[] = [];
  const edges: Edge[] = [];

  let currentY = 0;

  // Create nodes with branching logic
  const timeline = pipeline.timeline;

  // Node 1: Initial step (detection or initialization)
  const firstStep = timeline[0];
  nodes.push({
    id: "node_1",
    type: "workflowNode",
    position: { x: baseX + xVariation, y: currentY },
    data: {
      label: firstStep.name,
      type: mapStepTypeToNodeType(firstStep.type),
      status: firstStep.status === "success" ? "completed" : (firstStep.status as any),
      performanceLevel,
      decision: firstStep.decisionPoint || firstStep.output?.repository_type as string || undefined,
      reasoning: firstStep.reason,
      details: {
        summary: firstStep.reason,
        keyPoints: extractKeyPoints(firstStep),
        metrics: formatMetrics(firstStep),
      },
    },
  });

  // Node 2: Initialization/Setup
  if (timeline.length > 1) {
    const step = timeline[1];
    currentY += ySpacing;
    nodes.push({
      id: "node_2",
      type: "workflowNode",
      position: { x: baseX + xVariation, y: currentY },
      data: {
        label: step.name,
        type: mapStepTypeToNodeType(step.type),
        status: step.status === "success" ? "completed" : (step.status as any),
        performanceLevel,
        decision: `${step.output?.tool_count || 0} Tools Loaded`,
        reasoning: step.reason,
        details: {
          summary: step.reason,
          keyPoints: extractKeyPoints(step),
          metrics: formatMetrics(step),
        },
      },
    });

    edges.push({
      id: "e1-2",
      source: "node_1",
      target: "node_2",
      animated: true,
      label: "Initialize",
      style: { stroke: theme.edgePrimary, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 600 },
    });
  }

  // Node 3: Decision point - "Data Quality Check?"
  currentY += ySpacing + 50;
  nodes.push({
    id: "node_3",
    type: "decisionNode",
    position: { x: baseX + xVariation, y: currentY },
    data: {
      label: "Data Quality Sufficient?",
      type: "conditional",
      status: "completed",
      performanceLevel,
      decision: "YES",
      reasoning: "Checking if input data meets quality requirements for analysis",
      details: {
        summary: "AI validates input data quality before proceeding to analysis",
        keyPoints: [
          "Input validation passed",
          "Data structure verified",
          "All required fields present",
        ],
        metrics: { "Quality Score": "Pass" },
      },
    },
  });

  edges.push({
    id: "e2-3",
    source: "node_2",
    target: "node_3",
    animated: true,
    label: "Validate",
    style: { stroke: theme.edgePrimary, strokeWidth: 2 },
    labelStyle: { fontSize: 11, fontWeight: 600 },
  });

  // Node 4: Main Analysis (agent_reasoning step)
  const reasoningStep = timeline.find(s => s.type === "agent_reasoning");
  if (reasoningStep) {
    currentY += ySpacing + 80;
    nodes.push({
      id: "node_4",
      type: "workflowNode",
      position: { x: baseX + xVariation, y: currentY },
      data: {
        label: reasoningStep.name,
        type: "analysis",
        status: reasoningStep.status === "success" ? "completed" : (reasoningStep.status as any),
        performanceLevel,
        decision: `Analysis Complete - Score: ${candidate.overallScore}`,
        reasoning: reasoningStep.reason,
        details: {
          summary: reasoningStep.reason,
          keyPoints: extractKeyPoints(reasoningStep),
          metrics: formatMetrics(reasoningStep),
        },
      },
    });

    edges.push({
      id: "e3-4",
      source: "node_3",
      sourceHandle: "yes",
      target: "node_4",
      animated: true,
      label: "✓ Proceed",
      style: { stroke: theme.edgeSuccess, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 700, fill: theme.edgeSuccess },
      markerEnd: { type: MarkerType.ArrowClosed, color: theme.edgeSuccess },
    });
  }

  // Node 5: Parallel - Performance Metrics Analysis
  nodes.push({
    id: "node_5",
    type: "workflowNode",
    position: { x: baseX + branchOffset, y: currentY - ySpacing },
    data: {
      label: "Performance Metrics Analysis",
      type: "parallel",
      status: "completed",
      performanceLevel,
      decision: `$${pipeline.summary.totalCostUsd.toFixed(4)} / ${(pipeline.summary.totalDurationMs / 1000).toFixed(1)}s`,
      reasoning: "Parallel analysis of execution performance, token usage, and cost efficiency",
      details: {
        summary: "Real-time monitoring of pipeline execution metrics",
        keyPoints: [
          `Total Tokens: ${pipeline.summary.totalTokens.toLocaleString()}`,
          `Total Cost: $${pipeline.summary.totalCostUsd.toFixed(4)}`,
          `Duration: ${(pipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
          `Files Analyzed: ${pipeline.summary.filesAnalyzed}`,
        ],
        metrics: {
          "Tokens": pipeline.summary.totalTokens.toLocaleString(),
          "Cost": `$${pipeline.summary.totalCostUsd.toFixed(4)}`,
          "Duration": `${(pipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
        },
      },
    },
  });

  edges.push({
    id: "e2-5",
    source: "node_2",
    target: "node_5",
    animated: true,
    label: "Parallel: Monitor",
    style: { stroke: theme.edgeParallel, strokeWidth: 2, strokeDasharray: "5,5" },
    labelStyle: { fontSize: 11, fontWeight: 600, fill: theme.edgeParallel },
  });

  // Node 6: Skills/Quality Assessment Decision
  currentY += ySpacing + 80;
  nodes.push({
    id: "node_6",
    type: "decisionNode",
    position: { x: baseX + xVariation, y: currentY },
    data: {
      label: `Score >= 70% Threshold?`,
      type: "conditional",
      status: "completed",
      performanceLevel,
      decision: candidate.overallScore >= 70 ? `YES - ${candidate.overallScore}%` : `NO - ${candidate.overallScore}%`,
      reasoning: `Evaluating if candidate meets minimum threshold. Current score: ${candidate.overallScore}%`,
      details: {
        summary: `Score ${candidate.overallScore >= 70 ? 'exceeds' : 'below'} minimum requirement`,
        keyPoints: [
          `Overall Score: ${candidate.overallScore}%`,
          `Threshold: 70%`,
          `Status: ${candidate.overallScore >= 70 ? 'PASS' : 'FAIL'}`,
        ],
        metrics: {
          "Score": `${candidate.overallScore}%`,
          "Threshold": "70%",
          "Result": candidate.overallScore >= 70 ? "PASS" : "FAIL",
        },
      },
    },
  });

  edges.push({
    id: "e4-6",
    source: "node_4",
    target: "node_6",
    animated: true,
    label: "Evaluate Threshold",
    style: { stroke: theme.edgePrimary, strokeWidth: 2 },
    labelStyle: { fontSize: 11, fontWeight: 600 },
  });

  edges.push({
    id: "e5-6",
    source: "node_5",
    target: "node_6",
    animated: true,
    label: "Merge Results",
    style: { stroke: theme.edgeParallel, strokeWidth: 2, strokeDasharray: "5,5" },
    labelStyle: { fontSize: 11, fontWeight: 600, fill: theme.edgeParallel },
  });

  // Node 7: Final Recommendation
  const outputStep = timeline.find(s => s.type === "output_generation");
  if (outputStep) {
    currentY += ySpacing + 80;
    nodes.push({
      id: "node_7",
      type: "workflowNode",
      position: { x: baseX + xVariation + 100, y: currentY },
      data: {
        label: "Final Recommendation",
        type: "decision",
        status: outputStep.status === "success" ? "completed" : (outputStep.status as any),
        performanceLevel,
        decision: candidate.decision,
        reasoning: `${pipelineName} completed successfully. ${candidate.overallScore >= 70 ? 'Candidate meets requirements.' : 'Candidate does not meet minimum threshold.'}`,
        details: {
          summary: outputStep.reason,
          keyPoints: [
            ...extractKeyPoints(outputStep),
            `Final Decision: ${candidate.decision}`,
            `Recommendation: ${candidate.status}`,
          ],
          metrics: {
            ...formatMetrics(outputStep),
            "Final Score": `${candidate.overallScore}/100`,
            "Status": candidate.status.toUpperCase(),
          },
        },
      },
    });

    edges.push({
      id: "e6-7",
      source: "node_6",
      sourceHandle: candidate.overallScore >= 70 ? "yes" : "no",
      target: "node_7",
      animated: true,
      label: candidate.overallScore >= 70 ? `✓ ${candidate.overallScore}%` : `✗ ${candidate.overallScore}%`,
      style: {
        stroke: candidate.overallScore >= 70 ? theme.edgeSuccess : theme.error,
        strokeWidth: 2
      },
      labelStyle: {
        fontSize: 11,
        fontWeight: 700,
        fill: candidate.overallScore >= 70 ? theme.edgeSuccess : theme.error
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: candidate.overallScore >= 70 ? theme.edgeSuccess : theme.error
      },
    });
  }

  return { nodes, edges };
}

export function getNodeChildren(nodeId: string): string[] {
  // For pipeline nodes, dynamically determine children
  if (nodeId.startsWith('jd_') || nodeId.startsWith('eval_') || nodeId.startsWith('match_')) {
    const data = pipelineData as PipelineData;
    const prefix = nodeId.split('_')[0];
    const stepId = nodeId.substring(prefix.length + 1);

    let pipeline: Pipeline | null = null;
    if (prefix === 'jd') pipeline = data.pipelines.jd_generation;
    else if (prefix === 'eval') pipeline = data.pipelines.candidate_evaluation;
    else if (prefix === 'match') pipeline = data.pipelines.resume_jd_match;

    if (pipeline) {
      const currentIndex = pipeline.timeline.findIndex(s => s.id === stepId);
      if (currentIndex >= 0 && currentIndex < pipeline.timeline.length - 1) {
        const nextStep = pipeline.timeline[currentIndex + 1];
        return [`${prefix}_${nextStep.id}`];
      }
    }
    return [];
  }

  // For branching workflow nodes
  const nodeChildrenMap: Record<string, string[]> = {
    "node_1": ["node_2"],
    "node_2": ["node_3", "node_5"], // Parallel split
    "node_3": ["node_4"],
    "node_4": ["node_6"],
    "node_5": ["node_6"], // Merge point
    "node_6": ["node_7"],
    "node_7": [],
  };

  return nodeChildrenMap[nodeId] || [];
}
// @ts-ignore
export function getWorkflowNodes(candidateId: string): Node<WorkflowNodeData>[] {
  // Special cases: Combined view or specific pipeline type names
  if (candidateId === "combined") {
    return getCombinedWorkflowNodes();
  }

  if (candidateId === "jd_generation") {
    return getPipelineWorkflowNodes("jd_generation");
  }
  if (candidateId === "candidate_evaluation") {
    return getPipelineWorkflowNodes("candidate_evaluation");
  }
  if (candidateId === "resume_jd_match") {
    return getPipelineWorkflowNodes("resume_jd_match");
  }

  // Check if this is a pipeline execution ID (UUID format)
  const candidate = getWorkflowById(candidateId);
  if (candidate) {
    // Use branching workflow generation for all real pipeline candidates
    const { nodes } = generateBranchingWorkflowFromPipeline(candidateId);
    return nodes;
  }

  return [];
}

export function getWorkflowEdges(candidateId: string): Edge[] {
  // Special cases: Combined view or specific pipeline type names
  if (candidateId === "combined") {
    return getCombinedWorkflowEdges();
  }

  if (candidateId === "jd_generation") {
    return getPipelineWorkflowEdges("jd_generation");
  }
  if (candidateId === "candidate_evaluation") {
    return getPipelineWorkflowEdges("candidate_evaluation");
  }
  if (candidateId === "resume_jd_match") {
    return getPipelineWorkflowEdges("resume_jd_match");
  }

  // Check if this is a pipeline execution ID (UUID format)
  const candidate = getWorkflowById(candidateId);
  if (candidate) {
    // Use branching workflow generation for all real pipeline candidates
    const { edges } = generateBranchingWorkflowFromPipeline(candidateId);
    return edges;
  }

  return [];
}

// New function to get all 3 timeline graphs
export interface TimelineGraph {
  id: string;
  title: string;
  description: string;
  color: string;
  steps: number;
  status: string;
  duration: string;
  tokens: string;
  cost: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export function getAllTimelineGraphs(): TimelineGraph[] {
  const data = pipelineData as PipelineData;
  const graphs: TimelineGraph[] = [];

  // Graph 1: JD Generation Pipeline
  const jdPipeline = data.pipelines.jd_generation;
  const jdNodes: Node<WorkflowNodeData>[] = [];
  const jdEdges: Edge[] = [];

  // Add START node
  jdNodes.push({
    id: "jd_start",
    type: "workflowNode",
    position: { x: 0, y: 0 },
    data: {
      label: "START",
      type: "input",
      status: "completed",
      performanceLevel: "strong",
      reasoning: "Beginning of JD Generation Pipeline",
      details: {
        summary: "Pipeline initiated",
        keyPoints: ["Repository: " + jdPipeline.repository.path],
        metrics: { "Pipeline": jdPipeline.pipeline },
      },
    },
  });

  // Add timeline nodes
  jdPipeline.timeline.forEach((step, index) => {
    jdNodes.push({
      id: `jd_${step.id}`,
      type: "workflowNode",
      position: { x: (index + 1) * 300, y: 0 },
      data: {
        label: step.name,
        type: mapStepTypeToNodeType(step.type),
        status: step.status === "success" ? "completed" : (step.status as any),
        performanceLevel: "strong",
        decision: step.decisionPoint || undefined,
        reasoning: step.reason,
        details: {
          summary: step.reason,
          keyPoints: extractKeyPoints(step),
          metrics: formatMetrics(step),
        },
      },
    });
  });

  // Add END node
  jdNodes.push({
    id: "jd_end",
    type: "workflowNode",
    position: { x: (jdPipeline.timeline.length + 1) * 300, y: 0 },
    data: {
      label: "END",
      type: "decision",
      status: "completed",
      performanceLevel: "strong",
      decision: "JD Generated Successfully",
      reasoning: "Pipeline completed successfully",
      details: {
        summary: "Job description generated and saved",
        keyPoints: [
          `Total Duration: ${(jdPipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
          `Total Cost: $${jdPipeline.summary.totalCostUsd.toFixed(4)}`,
        ],
        metrics: {
          "Status": jdPipeline.summary.status.toUpperCase(),
          "Files Analyzed": jdPipeline.summary.filesAnalyzed,
        },
      },
    },
  });

  // Create edges for JD pipeline
  jdEdges.push({
    id: "e_jd_start_0",
    source: "jd_start",
    target: `jd_${jdPipeline.timeline[0].id}`,
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
  });

  for (let i = 0; i < jdPipeline.timeline.length - 1; i++) {
    jdEdges.push({
      id: `e_jd_${i}`,
      source: `jd_${jdPipeline.timeline[i].id}`,
      target: `jd_${jdPipeline.timeline[i + 1].id}`,
      animated: true,
      style: { stroke: "#3b82f6", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
    });
  }

  jdEdges.push({
    id: "e_jd_end",
    source: `jd_${jdPipeline.timeline[jdPipeline.timeline.length - 1].id}`,
    target: "jd_end",
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
  });

  graphs.push({
    id: "jd_generation",
    title: "Pipeline 1: JD Generation",
    description: "Analyzes repository and generates job description",
    color: "#3b82f6",
    steps: jdPipeline.timeline.length,
    status: jdPipeline.summary.status.toUpperCase(),
    duration: `${(jdPipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
    tokens: jdPipeline.summary.totalTokens.toLocaleString(),
    cost: `$${jdPipeline.summary.totalCostUsd.toFixed(4)}`,
    nodes: jdNodes,
    edges: jdEdges,
  });

  // Graph 2: Candidate Evaluation Pipeline
  const evalPipeline = data.pipelines.candidate_evaluation;
  const evalNodes: Node<WorkflowNodeData>[] = [];
  const evalEdges: Edge[] = [];

  // Add START node
  evalNodes.push({
    id: "eval_start",
    type: "workflowNode",
    position: { x: 0, y: 0 },
    data: {
      label: "START",
      type: "input",
      status: "completed",
      performanceLevel: "moderate",
      reasoning: "Beginning of Candidate Evaluation Pipeline",
      details: {
        summary: "Pipeline initiated",
        keyPoints: ["Resume: " + evalPipeline.repository.path.split('/').pop()],
        metrics: { "Pipeline": evalPipeline.pipeline },
      },
    },
  });

  // Add timeline nodes
  evalPipeline.timeline.forEach((step, index) => {
    evalNodes.push({
      id: `eval_${step.id}`,
      type: "workflowNode",
      position: { x: (index + 1) * 300, y: 0 },
      data: {
        label: step.name,
        type: mapStepTypeToNodeType(step.type),
        status: step.status === "success" ? "completed" : (step.status as any),
        performanceLevel: "moderate",
        decision: step.decisionPoint || undefined,
        reasoning: step.reason,
        details: {
          summary: step.reason,
          keyPoints: extractKeyPoints(step),
          metrics: formatMetrics(step),
        },
      },
    });
  });

  // Add END node
  evalNodes.push({
    id: "eval_end",
    type: "workflowNode",
    position: { x: (evalPipeline.timeline.length + 1) * 300, y: 0 },
    data: {
      label: "END",
      type: "decision",
      status: "completed",
      performanceLevel: "moderate",
      decision: "Evaluation Complete",
      reasoning: "Candidate evaluation completed",
      details: {
        summary: "Candidate evaluated against job requirements",
        keyPoints: [
          `Total Duration: ${(evalPipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
          `Total Cost: $${evalPipeline.summary.totalCostUsd.toFixed(4)}`,
        ],
        metrics: {
          "Status": evalPipeline.summary.status.toUpperCase(),
        },
      },
    },
  });

  // Create edges for Eval pipeline
  evalEdges.push({
    id: "e_eval_start_0",
    source: "eval_start",
    target: `eval_${evalPipeline.timeline[0].id}`,
    animated: true,
    style: { stroke: "#8b5cf6", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
  });

  for (let i = 0; i < evalPipeline.timeline.length - 1; i++) {
    evalEdges.push({
      id: `e_eval_${i}`,
      source: `eval_${evalPipeline.timeline[i].id}`,
      target: `eval_${evalPipeline.timeline[i + 1].id}`,
      animated: true,
      style: { stroke: "#8b5cf6", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
    });
  }

  evalEdges.push({
    id: "e_eval_end",
    source: `eval_${evalPipeline.timeline[evalPipeline.timeline.length - 1].id}`,
    target: "eval_end",
    animated: true,
    style: { stroke: "#8b5cf6", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
  });

  graphs.push({
    id: "candidate_evaluation",
    title: "Pipeline 2: Candidate Evaluation",
    description: "Evaluates candidate resume and GitHub profile",
    color: "#8b5cf6",
    steps: evalPipeline.timeline.length,
    status: evalPipeline.summary.status.toUpperCase(),
    duration: `${(evalPipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
    tokens: evalPipeline.summary.totalTokens.toLocaleString(),
    cost: `$${evalPipeline.summary.totalCostUsd.toFixed(4)}`,
    nodes: evalNodes,
    edges: evalEdges,
  });

  // Graph 3: Resume-JD Match Pipeline
  const matchPipeline = data.pipelines.resume_jd_match;
  const matchNodes: Node<WorkflowNodeData>[] = [];
  const matchEdges: Edge[] = [];

  // Add START node
  matchNodes.push({
    id: "match_start",
    type: "workflowNode",
    position: { x: 0, y: 0 },
    data: {
      label: "START",
      type: "input",
      status: "completed",
      performanceLevel: "moderate",
      reasoning: "Beginning of Resume-JD Matching Pipeline",
      details: {
        summary: "Pipeline initiated",
        keyPoints: ["Resume: " + matchPipeline.repository.path.split('/').pop()],
        metrics: { "Pipeline": matchPipeline.pipeline },
      },
    },
  });

  // Add timeline nodes
  matchPipeline.timeline.forEach((step, index) => {
    matchNodes.push({
      id: `match_${step.id}`,
      type: "workflowNode",
      position: { x: (index + 1) * 300, y: 0 },
      data: {
        label: step.name,
        type: mapStepTypeToNodeType(step.type),
        status: step.status === "success" ? "completed" : (step.status as any),
        performanceLevel: "moderate",
        decision: step.decisionPoint || undefined,
        reasoning: step.reason,
        details: {
          summary: step.reason,
          keyPoints: extractKeyPoints(step),
          metrics: formatMetrics(step),
        },
      },
    });
  });

  // Add END node
  matchNodes.push({
    id: "match_end",
    type: "workflowNode",
    position: { x: (matchPipeline.timeline.length + 1) * 300, y: 0 },
    data: {
      label: "END",
      type: "decision",
      status: "completed",
      performanceLevel: "moderate",
      decision: "Matching Complete",
      reasoning: "Resume-JD matching completed",
      details: {
        summary: "Resume matched against job description",
        keyPoints: [
          `Total Duration: ${(matchPipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
          `Total Cost: $${matchPipeline.summary.totalCostUsd.toFixed(4)}`,
        ],
        metrics: {
          "Status": matchPipeline.summary.status.toUpperCase(),
        },
      },
    },
  });

  // Create edges for Match pipeline
  matchEdges.push({
    id: "e_match_start_0",
    source: "match_start",
    target: `match_${matchPipeline.timeline[0].id}`,
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
  });

  for (let i = 0; i < matchPipeline.timeline.length - 1; i++) {
    matchEdges.push({
      id: `e_match_${i}`,
      source: `match_${matchPipeline.timeline[i].id}`,
      target: `match_${matchPipeline.timeline[i + 1].id}`,
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
    });
  }

  matchEdges.push({
    id: "e_match_end",
    source: `match_${matchPipeline.timeline[matchPipeline.timeline.length - 1].id}`,
    target: "match_end",
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
  });

  graphs.push({
    id: "resume_jd_match",
    title: "Pipeline 3: Resume-JD Match",
    description: "Matches resume against job description requirements",
    color: "#10b981",
    steps: matchPipeline.timeline.length,
    status: matchPipeline.summary.status.toUpperCase(),
    duration: `${(matchPipeline.summary.totalDurationMs / 1000).toFixed(2)}s`,
    tokens: matchPipeline.summary.totalTokens.toLocaleString(),
    cost: `$${matchPipeline.summary.totalCostUsd.toFixed(4)}`,
    nodes: matchNodes,
    edges: matchEdges,
  });

  return graphs;
}
