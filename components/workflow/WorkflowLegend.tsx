"use client";

export function WorkflowLegend() {
  return (
    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-lg p-4 shadow-xl z-10 font-mono text-xs">
      <h3 className="font-bold text-sm mb-3 text-gray-900">Legend</h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-green-500 bg-green-50 rounded"></div>
          <span className="text-gray-700">Analysis Node</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-green-500 bg-green-50 rounded rotate-45"></div>
          <span className="text-gray-700">Decision Point</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-blue-500"></div>
          <span className="text-gray-700">Primary Flow</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-purple-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #8b5cf6 0, #8b5cf6 5px, transparent 5px, transparent 10px)' }}></div>
          <span className="text-gray-700">Parallel Analysis</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-red-500"></div>
          <span className="text-gray-700">Conditional Branch</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-green-500"></div>
          <span className="text-gray-700">Success Path</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-300">
        <p className="text-gray-600 text-[10px] leading-relaxed">
          Click any node to view detailed AI reasoning and decision metrics
        </p>
      </div>
    </div>
  );
}
