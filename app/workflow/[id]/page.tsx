"use client";

import { useCallback, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type Node,
  type NodeTypes,
  type NodeChange,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { WorkflowNode } from "@/components/workflow/WorkflowNode";
import { DecisionNode } from "@/components/workflow/DecisionNode";
import { NodeDetailPanel } from "@/components/workflow/NodeDetailPanel";
import { WorkflowLegend } from "@/components/workflow/WorkflowLegend";
import type { WorkflowNodeData } from "@/app/workflow/types";
import { getWorkflowById, getWorkflowNodes, getWorkflowEdges, getNodeChildren } from "@/lib/workflow-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;

  const candidate = getWorkflowById(candidateId);
  const allNodes = getWorkflowNodes(candidateId);
  const allEdges = getWorkflowEdges(candidateId);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1"]));
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeData | null>(null);
  const [internalNodes, setInternalNodes] = useState<Node<WorkflowNodeData>[]>(allNodes);

  // Filter visible nodes based on expanded state
  const nodes = useMemo(() => {
    const visible = new Set<string>(["1"]); // Always show root

    expandedNodes.forEach((nodeId) => {
      const children = getNodeChildren(nodeId);
      children.forEach((childId) => visible.add(childId));
    });

    return internalNodes
      .filter((node) => visible.has(node.id))
      .map((node) => ({
        ...node,
        data: {
          ...node.data,
          hasChildren: getNodeChildren(node.id).length > 0,
          isExpanded: expandedNodes.has(node.id),
        },
      }));
  }, [internalNodes, expandedNodes]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setInternalNodes((nds) => applyNodeChanges(changes, nds) as Node<WorkflowNodeData>[]);
  }, []);

  // Filter visible edges based on visible nodes
  const edges = useMemo(() => {
    const visibleNodeIds = new Set(nodes.map((n) => n.id));
    return allEdges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target));
  }, [allEdges, nodes]);

  // @ts-ignore
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      workflowNode: WorkflowNode,
      decisionNode: DecisionNode,
    }),
    []
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
    setSelectedNode(node.data);

    // Toggle expansion
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  if (!candidate) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <Link href="/workflows" className="text-blue-600 hover:text-blue-800 font-mono">
            ← Back to Workflows
          </Link>
        </div>
      </div>
    );
  }

  const scoreColor =
    candidate.overallScore >= 90
      ? "text-green-600"
      : candidate.overallScore >= 80
      ? "text-blue-600"
      : candidate.overallScore >= 70
      ? "text-purple-600"
      : "text-orange-600";

  const themeBadge =
    candidate.overallScore >= 90
      ? "Exceptional"
      : candidate.overallScore >= 80
      ? "Strong Fit"
      : candidate.overallScore >= 70
      ? "Moderate"
      : "Below Threshold";

  const themeBadgeColor =
    candidate.overallScore >= 90
      ? "bg-green-100 text-green-800 border-green-300"
      : candidate.overallScore >= 80
      ? "bg-blue-100 text-blue-800 border-blue-300"
      : candidate.overallScore >= 70
      ? "bg-purple-100 text-purple-800 border-purple-300"
      : "bg-orange-100 text-orange-800 border-orange-300";

  return (
    <div className="h-screen w-full relative">
      <div className="p-4 bg-background border-b">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/workflows" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono">{candidate.candidateName} - AI Evaluation Workflow</h1>
              <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase border-2", themeBadgeColor)}>
                {themeBadge}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {candidate.position} • Overall Score:{" "}
              <span className={cn("font-bold", scoreColor)}>{candidate.overallScore}/100</span>
            </p>
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-5rem)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          {/* @ts-ignore */}
          <Background variant="dots" gap={16} size={1} />
          <WorkflowLegend />
        </ReactFlow>
      </div>
      <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
