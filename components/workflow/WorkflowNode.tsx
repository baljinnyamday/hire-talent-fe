"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { WorkflowNodeData } from "@/app/workflow/types";

const getNodeColors = (performanceLevel?: string, status?: string) => {
  if (status === "pending") return "border-gray-400 bg-gray-50";
  if (status === "processing") return "border-blue-500 bg-blue-50 animate-pulse";
  if (status === "failed") return "border-red-500 bg-red-50";

  // Completed status - color based on performance
  switch (performanceLevel) {
    case "exceptional":
      return "border-green-600 bg-green-50";
    case "strong":
      return "border-blue-600 bg-blue-50";
    case "moderate":
      return "border-purple-600 bg-purple-50";
    case "weak":
      return "border-orange-600 bg-orange-50";
    default:
      return "border-green-500 bg-green-50";
  }
};

const statusIcons = {
  pending: "⏳",
  processing: "⚡",
  completed: "✓",
  failed: "✗",
};
// @ts-ignore
export const WorkflowNode = memo(({ data, selected }: NodeProps<{ data: WorkflowNodeData }>) => {
  const nodeColors = getNodeColors(data.performanceLevel, data.status);
  const ringColor =
    data.performanceLevel === "exceptional"
      ? "ring-green-300"
      : data.performanceLevel === "strong"
      ? "ring-blue-300"
      : data.performanceLevel === "moderate"
      ? "ring-purple-300"
      : data.performanceLevel === "weak"
      ? "ring-orange-300"
      : "ring-blue-300";

  return (
    <div
      className={cn(
        "px-6 py-4 rounded-lg border-2 shadow-lg min-w-[250px] transition-all cursor-pointer",
        nodeColors,
        // @ts-ignore
        selected && `ring-4 ${ringColor} scale-105`
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex items-start gap-3">
        <span className="text-2xl">{statusIcons[data.status]}</span>
        <div className="flex-1">
          <div className="font-bold text-sm uppercase tracking-wide text-gray-700">{data.label}</div>

          {data.decision && <div className="mt-2 text-sm font-medium text-gray-900">{data.decision}</div>}

          {data.reasoning && <div className="mt-2 text-xs text-gray-600 line-clamp-2">{data.reasoning}</div>}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-blue-600 font-medium">Click for details →</div>
            {data.hasChildren && (
              <div className="text-xs font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded">
                {data.isExpanded ? "▼ Collapse" : "▶ Expand"}
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

WorkflowNode.displayName = "WorkflowNode";
