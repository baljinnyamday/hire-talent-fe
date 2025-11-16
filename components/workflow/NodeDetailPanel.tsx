"use client";

import { X } from 'lucide-react';
import type { WorkflowNodeData } from '@/app/workflow/types';
import { cn } from '@/lib/utils';

interface NodeDetailPanelProps {
  node: WorkflowNodeData | null;
  onClose: () => void;
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto border-l">
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{node.label}</h2>
          <span
            className={cn(
              'inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium uppercase',
              statusColors[node.status]
            )}
          >
            {node.status}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {node.decision && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
              Decision
            </h3>
            <p className="text-lg font-medium text-gray-900">{node.decision}</p>
          </section>
        )}

        {node.reasoning && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
              Reasoning
            </h3>
            <p className="text-gray-700 leading-relaxed">{node.reasoning}</p>
          </section>
        )}

        {node.details && (
          <>
            {node.details.summary && (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
                  Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {node.details.summary}
                </p>
              </section>
            )}

            {node.details.keyPoints && node.details.keyPoints.length > 0 && (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {node.details.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {node.details.metrics && Object.keys(node.details.metrics).length > 0 && (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
                  Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(node.details.metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {key}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {node.details.evidence && node.details.evidence.length > 0 && (
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
                  Evidence
                </h3>
                <div className="space-y-2">
                  {node.details.evidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-blue-50 border-l-4 border-blue-500 text-sm text-gray-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
