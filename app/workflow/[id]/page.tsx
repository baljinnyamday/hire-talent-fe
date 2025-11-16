"use client";

import { useCallback, useState, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { WorkflowNode } from "@/components/workflow/WorkflowNode";
import { NodeDetailPanel } from "@/components/workflow/NodeDetailPanel";
import type { WorkflowNodeData } from "@/app/workflow/types";
import { getAllTimelineGraphs } from "@/lib/workflow-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorkflowDetailPage() {
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeData | null>(null);

  // Get all 3 pipeline graphs
  const timelineGraphs = getAllTimelineGraphs();

  // @ts-ignore
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      workflowNode: WorkflowNode,
    }),
    []
  );

  // @ts-ignore
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
    setSelectedNode(node.data);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white border-b shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/workflows" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-mono">AI Pipeline Workflows</h1>
            <p className="text-sm text-gray-600 font-mono mt-1">
              Timeline visualization of all 3 pipeline executions
            </p>
          </div>
        </div>
      </div>

      {/* Three Graphs Stacked Vertically */}
      <div className="p-6 space-y-6">
        {timelineGraphs.map((graph, index) => (
          <div key={graph.id} className="bg-white rounded-lg shadow-lg border-2 border-gray-200">
            {/* Graph Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-mono text-gray-800">
                    {graph.title}
                  </h2>
                  <p className="text-sm text-gray-600 font-mono mt-1">
                    {graph.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: graph.color }}>
                    {graph.steps} Steps
                  </div>
                  <p className="text-xs text-gray-500 uppercase font-mono">
                    {graph.status}
                  </p>
                </div>
              </div>
            </div>

            {/* ReactFlow Graph */}
            <div className="h-[400px]">
              <ReactFlow
                nodes={graph.nodes}
                edges={graph.edges}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.5}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                proOptions={{ hideAttribution: true }}
              >
                <Controls />
                <MiniMap
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                  style={{
                    backgroundColor: graph.color,
                    opacity: 0.1,
                  }}
                />
                {/* @ts-ignore */}
                <Background variant="dots" gap={16} size={1} color={graph.color} />
              </ReactFlow>
            </div>

            {/* Graph Footer - Timeline Info */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm font-mono">
                <div className="flex gap-6">
                  <div>
                    <span className="text-gray-500">Duration:</span>{" "}
                    <span className="font-bold">{graph.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tokens:</span>{" "}
                    <span className="font-bold">{graph.tokens}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cost:</span>{" "}
                    <span className="font-bold">{graph.cost}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  START → {graph.steps} steps → END
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Node Detail Panel */}
      <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
