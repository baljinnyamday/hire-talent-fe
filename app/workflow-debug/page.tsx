"use client";

import { getAllCandidates } from '@/lib/workflow-data';
import Link from 'next/link';

export default function WorkflowDebugPage() {
  const candidates = getAllCandidates();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Workflow Debug Info</h1>

      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded">
        <h2 className="text-xl font-bold mb-2">✓ Data Loaded Successfully</h2>
        <p>Found {candidates.length} workflow(s) from JSON data</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Workflows:</h2>

        {candidates.map((candidate, index) => (
          <div key={candidate.id} className="mb-4 p-4 border rounded bg-white">
            <h3 className="font-bold text-lg mb-2">
              {index + 1}. {candidate.candidateName}
            </h3>
            <div className="text-sm space-y-1 mb-3">
              <p><strong>ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{candidate.id}</code></p>
              <p><strong>Position:</strong> {candidate.position}</p>
              <p><strong>Overall Score:</strong> {candidate.overallScore}/100</p>
              <p><strong>Status:</strong> {candidate.status}</p>
              <p><strong>Decision:</strong> {candidate.decision}</p>
            </div>
            <Link
              href={`/workflow/${candidate.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Workflow Graph →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-xl font-bold mb-2">Quick Links:</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/workflows" className="text-blue-600 hover:underline">
              → View all workflows (card view)
            </Link>
          </li>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <Link
                href={`/workflow/${candidate.id}`}
                className="text-blue-600 hover:underline"
              >
                → {candidate.candidateName} - Workflow Graph
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
