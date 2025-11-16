import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type { WorkflowNodeData } from "@/app/workflow/types";

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

export const candidateWorkflows: CandidateWorkflow[] = [
  {
    id: "1",
    candidateName: "Sarah Chen",
    position: "Senior Full-Stack Developer",
    appliedDate: "2024-11-10",
    status: "recommended",
    overallScore: 92,
    resumeScore: 8.5,
    githubScore: 9.2,
    projectScore: 9.1,
    decision: "STRONG FIT - Schedule Interview",
  },
  {
    id: "2",
    candidateName: "Marcus Johnson",
    position: "Frontend Engineer",
    appliedDate: "2024-11-12",
    status: "interview_scheduled",
    overallScore: 88,
    resumeScore: 8.2,
    githubScore: 8.8,
    projectScore: 8.9,
    decision: "GOOD FIT - Interview Scheduled",
  },
  {
    id: "3",
    candidateName: "Priya Patel",
    position: "DevOps Engineer",
    appliedDate: "2024-11-13",
    status: "pending",
    overallScore: 75,
    resumeScore: 7.5,
    githubScore: 7.8,
    projectScore: 7.2,
    decision: "MODERATE FIT - Pending Review",
  },
  {
    id: "4",
    candidateName: "Alex Rivera",
    position: "Backend Developer",
    appliedDate: "2024-11-14",
    status: "rejected",
    overallScore: 58,
    resumeScore: 6.2,
    githubScore: 5.5,
    projectScore: 5.7,
    decision: "INSUFFICIENT MATCH - Below Threshold",
  },
  {
    id: "5",
    candidateName: "Emily Zhang",
    position: "Senior Full-Stack Developer",
    appliedDate: "2024-11-15",
    status: "recommended",
    overallScore: 95,
    resumeScore: 9.1,
    githubScore: 9.5,
    projectScore: 9.6,
    decision: "EXCEPTIONAL FIT - Priority Interview",
  },
];

export function getWorkflowById(id: string): CandidateWorkflow | undefined {
  return candidateWorkflows.find((w) => w.id === id);
}

// Define parent-child relationships for expandable workflow
const nodeChildrenMap: Record<string, string[]> = {
  "1": ["2"], // Job Description → Resume Analysis
  "2": ["3", "6"], // Resume Analysis → Decision + GitHub Activity (parallel)
  "3": ["4"], // Decision → GitHub Scan
  "4": ["5"], // GitHub Scan → Auto-Select
  "5": ["7"], // Auto-Select → Portfolio Analysis
  "6": ["7"], // GitHub Activity → Portfolio Analysis (merge point)
  "7": ["8"], // Portfolio Analysis → Skills Match Decision
  "8": ["9"], // Skills Match → Final Recommendation
  "9": [], // Final node
};

export function getNodeChildren(nodeId: string): string[] {
  return nodeChildrenMap[nodeId] || [];
}
// @ts-ignore
export function getWorkflowNodes(candidateId: string): Node<WorkflowNodeData>[] {
  const candidate = getWorkflowById(candidateId);
  if (!candidate) return [];

  const theme = getColorTheme(candidate.overallScore);
  const { baseX, ySpacing, xVariation, branchOffset } = getPositionVariation(candidateId);

  const performanceLevel: "exceptional" | "strong" | "moderate" | "weak" =
    candidate.overallScore >= 90
      ? "exceptional"
      : candidate.overallScore >= 80
      ? "strong"
      : candidate.overallScore >= 70
      ? "moderate"
      : "weak";

  // Helper function to create random but neat horizontal offset for each node
  // Combines candidateId and nodeId to ensure different workflows have different positions
  const getNodeOffset = (nodeId: string) => {
    const combinedHash = (candidateId + nodeId).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsets = [-50, -30, -10, 0, 10, 30, 50];
    return offsets[combinedHash % offsets.length];
  };

  let currentY = 0;

  return [
    {
      id: "1",
      type: "workflowNode",
      position: { x: baseX + xVariation + getNodeOffset("1"), y: currentY },
      data: {
        label: "Job Description Input",
        type: "input",
        status: "completed",
        performanceLevel,
        decision: candidate.position,
        reasoning:
          "Parsing job requirements to extract key technical skills, experience level, and team culture expectations.",
        details: {
          summary:
            "Job posting requires 5+ years with React, Node.js, cloud infrastructure. Emphasis on leadership and mentoring.",
          keyPoints: [
            "Technical Stack: React, Node.js, TypeScript, AWS",
            "Experience: 5+ years full-stack",
            "Leadership: Team lead experience preferred",
            "Location: Remote with quarterly travel",
          ],
          metrics: {
            "Required Skills": "8",
            "Nice-to-Have Skills": "5",
            Priority: "High",
          },
        },
      },
    },
    {
      id: "2",
      type: "workflowNode",
      position: { x: baseX + xVariation + getNodeOffset("2"), y: (currentY += ySpacing) },
      data: {
        label: "Resume Analysis",
        type: "analysis",
        status: "completed",
        performanceLevel,
        decision: `Strong Match - 85% Alignment`,
        reasoning: `${candidate.candidateName}'s resume shows relevant experience with matching tech stack. Progressive responsibility and technical leadership evident.`,
        details: {
          summary: `${candidate.candidateName} has strong background with increasing responsibility. Technical skills align well with requirements.`,
          keyPoints: [
            "Current: Senior Dev at TechCorp (2021-Present)",
            "Previous: Full-Stack at StartupXYZ (2019-2021)",
            "Stack: React, Node.js, TypeScript, AWS, Docker",
            "Leadership: Led team of 4, mentored juniors",
          ],
          metrics: {
            Experience: "6 years",
            "Stack Match": "85%",
            Leadership: "Yes",
            Score: `${candidate.resumeScore}/10`,
          },
          evidence: [
            "Led microservices migration (60% faster deploys)",
            "Built CI/CD for 2M+ MAU application",
            "Mentored 3 juniors → all promoted within 12mo",
          ],
        },
      },
    },
    {
      id: "3",
      type: "decisionNode",
      position: { x: baseX + xVariation + getNodeOffset("3"), y: (currentY += ySpacing + 50) },
      data: {
        label: "Project Links Provided?",
        type: "conditional",
        status: "completed",
        performanceLevel,
        decision: "NO",
        reasoning:
          "Candidate did not include project portfolio links in resume. Will scan GitHub profile to identify relevant projects.",
        details: {
          summary: "Resume lacks direct project links. Agent will automatically discover projects via GitHub profile.",
          keyPoints: [
            "No portfolio website found",
            "No project links in resume",
            "GitHub profile URL available",
            "Will auto-discover relevant repos",
          ],
          metrics: {
            "Portfolio Links": "0",
            "GitHub Found": "Yes",
          },
        },
      },
    },
    {
      id: "4",
      type: "workflowNode",
      position: { x: baseX + branchOffset + getNodeOffset("4"), y: (currentY += ySpacing + 80) },
      data: {
        label: "GitHub Profile Scan",
        type: "analysis",
        status: "completed",
        performanceLevel,
        decision: "Active Profile Discovered",
        reasoning: "Found active GitHub with 47 repositories. Scanning for projects matching job requirements.",
        details: {
          summary: "Profile shows consistent activity. Identifying repos by tech stack, recency, and complexity.",
          keyPoints: [
            "Total Repos: 47 (23 public)",
            "Activity: 342 contributions (YTD)",
            "Filtering by: React, Node.js, TypeScript",
            "Sorting by: Stars, commits, recency",
          ],
          metrics: {
            "Total Repos": "47",
            "Relevant Repos": "12",
            "Analysis Time": "2.3s",
          },
        },
      },
    },
    {
      id: "5",
      type: "workflowNode",
      position: { x: baseX + branchOffset + getNodeOffset("5"), y: (currentY += ySpacing) },
      data: {
        label: "Auto-Select Top Projects",
        type: "analysis",
        status: "completed",
        performanceLevel,
        decision: "3 Projects Selected for Deep Analysis",
        reasoning:
          "Ranked repositories by relevance score. Selected top 3 projects that best demonstrate required skills.",
        details: {
          summary: "ML-based ranking considering stars, commits, tech stack match, code quality indicators.",
          keyPoints: [
            "1. E-commerce Platform (React+Node) - 400★",
            "2. Real-time Chat (WebSocket+Redis) - 156★",
            "3. DevOps Dashboard (K8s monitoring) - 89★",
          ],
          metrics: {
            "Projects Analyzed": "12",
            "Projects Selected": "3",
            "Avg Relevance": "89%",
          },
          evidence: [
            "E-commerce: Full-stack, 50k users, production-ready",
            "Chat: Real-time systems expertise",
            "Dashboard: DevOps/cloud infrastructure skills",
          ],
        },
      },
    },
    {
      id: "6",
      type: "workflowNode",
      position: { x: baseX + 500, y: currentY - ySpacing * 2 },
      data: {
        label: "GitHub Activity Analysis",
        type: "parallel",
        status: "completed",
        performanceLevel,
        decision: "High Quality Contributor",
        reasoning: "Analyzing contribution patterns, code quality, collaboration, and open-source engagement.",
        details: {
          summary: "Consistent contributions with high-quality code. Active in community, follows best practices.",
          keyPoints: [
            "Contribution Streak: 18 months active",
            `Code Quality: ${candidate.githubScore}/10 average`,
            "Open Source: 12 contributions to major projects",
            "Test Coverage: 85%+ on personal repos",
          ],
          metrics: {
            Contributions: "342",
            "Code Quality": `${candidate.githubScore}/10`,
            Community: "High",
          },
          evidence: [
            "Maintains React component library (400★)",
            "Regular Next.js ecosystem contributor",
            "Detailed docs on all major projects",
          ],
        },
      },
    },
    {
      id: "7",
      type: "workflowNode",
      position: { x: baseX + xVariation + getNodeOffset("7"), y: (currentY += ySpacing + 50) },
      data: {
        label: "Project Portfolio Analysis",
        type: "analysis",
        status: "completed",
        performanceLevel,
        decision: "Exceptional Technical Depth",
        reasoning:
          "Selected projects demonstrate full-stack mastery, scalability considerations, and production-grade quality.",
        details: {
          summary:
            "Projects showcase end-to-end capabilities from architecture to deployment. Strong focus on performance and UX.",
          keyPoints: [
            "E-commerce: 95+ Lighthouse score, handles 50k DAU",
            "Chat: 1000+ concurrent connections, Redis pub/sub",
            "Dashboard: K8s integration, real-time metrics",
            "All: Comprehensive tests, CI/CD, live deployments",
          ],
          metrics: {
            Projects: "3",
            "Live Deployments": "3",
            "Combined Users": "60k+",
            "Avg Quality": `${candidate.projectScore}/10`,
          },
          evidence: [
            "Production deployments with real users",
            "Performance optimization evident",
            "Modern architecture patterns used",
            "Industry-standard documentation",
          ],
        },
      },
    },
    {
      id: "8",
      type: "decisionNode",
      position: { x: baseX + xVariation - 50 + getNodeOffset("8"), y: (currentY += ySpacing + 80) },
      data: {
        label: "Skills Match >= 80%?",
        type: "conditional",
        status: "completed",
        performanceLevel,
        decision:
          candidate.overallScore >= 80
            ? `YES - ${candidate.overallScore}% Match`
            : `NO - ${candidate.overallScore}% Match`,
        reasoning: `Combined analysis shows ${candidate.overallScore}% alignment with job requirements. ${
          candidate.overallScore >= 80 ? "Exceeds" : "Below"
        } minimum threshold.`,
        details: {
          summary: `Aggregate scoring across resume, GitHub activity, and projects shows ${
            candidate.overallScore >= 80 ? "strong" : "insufficient"
          } fit.`,
          keyPoints: [
            `Technical Skills: ${candidate.overallScore}% match`,
            "Experience Level: 120% (6yr vs 5yr required)",
            "Leadership: Verified",
            `Code Quality: ${candidate.githubScore}/10`,
          ],
          metrics: {
            "Overall Match": `${candidate.overallScore}%`,
            Threshold: "80%",
            Status: candidate.overallScore >= 80 ? "PASS" : "FAIL",
          },
        },
      },
    },
    {
      id: "9",
      type: "workflowNode",
      position: { x: baseX + xVariation + 100 + getNodeOffset("9"), y: (currentY += ySpacing + 80) },
      data: {
        label: "Final Recommendation",
        type: "decision",
        status: "completed",
        performanceLevel,
        decision: candidate.decision,
        reasoning:
          candidate.overallScore >= 80
            ? `${candidate.candidateName} exceeds requirements. Technical skills verified through code, experience validated, leadership proven. High confidence recommendation.`
            : `${candidate.candidateName} does not meet minimum requirements. Skills gap identified in critical areas.`,
        details: {
          summary: `Comprehensive AI analysis indicates ${
            candidate.overallScore >= 80 ? "excellent" : "insufficient"
          } match. ${
            candidate.overallScore >= 80 ? "All criteria met or exceeded" : "Key requirements not satisfied"
          }.`,
          keyPoints: [
            `Technical: ${candidate.overallScore}% match (threshold: 80%)`,
            "Experience: 6yr (requirement: 5yr+)",
            `Quality: ${
              candidate.overallScore >= 90
                ? "Top 10%"
                : candidate.overallScore >= 80
                ? "Above average"
                : "Below threshold"
            }`,
            `Risk: ${candidate.overallScore >= 90 ? "Low" : candidate.overallScore >= 80 ? "Medium" : "High"}`,
          ],
          metrics: {
            "Final Score": `${candidate.overallScore}/100`,
            Confidence: candidate.overallScore >= 90 ? "High" : candidate.overallScore >= 80 ? "Medium" : "Low",
            Recommendation:
              candidate.status === "recommended"
                ? "Interview"
                : candidate.status === "interview_scheduled"
                ? "Scheduled"
                : candidate.status === "rejected"
                ? "Reject"
                : "Review",
            Priority: candidate.overallScore >= 90 ? "P0" : candidate.overallScore >= 80 ? "P1" : "P2",
          },
          evidence: [
            `Resume: ${candidate.resumeScore}/10`,
            `GitHub: ${candidate.githubScore}/10`,
            `Projects: ${candidate.projectScore}/10`,
            candidate.overallScore >= 80 ? "Recommend scheduling interview" : "Does not meet hiring bar",
          ],
        },
      },
    },
  ];
}

export function getWorkflowEdges(candidateId: string): Edge[] {
  const candidate = getWorkflowById(candidateId);
  if (!candidate) return [];

  const theme = getColorTheme(candidate.overallScore);

  return [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      label: "Parse Requirements",
      style: { stroke: theme.edgePrimary, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
      label: "Check Portfolio",
      style: { stroke: theme.edgePrimary, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    },
    {
      id: "e3-4",
      source: "3",
      sourceHandle: "no",
      target: "4",
      animated: true,
      label: "✗ No Links - Auto Discover",
      style: { stroke: theme.error, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 700, fill: theme.error },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: theme.error },
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      animated: true,
      label: "Rank Projects",
      style: { stroke: theme.edgePrimary, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    },
    {
      id: "e5-7",
      source: "5",
      target: "7",
      animated: true,
      label: "Deep Analysis",
      style: { stroke: theme.edgePrimary, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    },
    {
      id: "e2-6",
      source: "2",
      target: "6",
      animated: true,
      label: "Parallel: Code Quality",
      style: { stroke: theme.edgeParallel, strokeWidth: 2, strokeDasharray: "5,5" },
      labelStyle: { fontSize: 11, fontWeight: 600, fill: theme.edgeParallel },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.95 },
    },
    {
      id: "e6-7",
      source: "6",
      target: "7",
      animated: true,
      label: "Merge Analysis",
      style: { stroke: theme.edgeParallel, strokeWidth: 2, strokeDasharray: "5,5" },
      labelStyle: { fontSize: 11, fontWeight: 600, fill: theme.edgeParallel },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.95 },
    },
    {
      id: "e7-8",
      source: "7",
      target: "8",
      animated: true,
      label: "Evaluate Match",
      style: { stroke: theme.edgePrimary, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.9 },
    },
    {
      id: "e8-9",
      source: "8",
      sourceHandle: "yes",
      target: "9",
      animated: true,
      label: `✓ ${candidate.overallScore}% Match`,
      style: { stroke: theme.edgeSuccess, strokeWidth: 2 },
      labelStyle: { fontSize: 11, fontWeight: 700, fill: theme.edgeSuccess },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.95 },
      markerEnd: { type: MarkerType.ArrowClosed, color: theme.edgeSuccess },
    },
  ];
}
