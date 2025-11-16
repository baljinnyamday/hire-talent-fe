"use client";

import Link from 'next/link';
import { candidateWorkflows } from '@/lib/workflow-data';
import { ArrowRight, CheckCircle2, Clock, XCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  recommended: {
    label: 'Recommended',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle2,
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Calendar,
  },
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Clock,
  },
  rejected: {
    label: 'Not Recommended',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle,
  },
};

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-mono mb-2">AI Evaluation Workflows</h1>
          <p className="text-muted-foreground font-mono">
            View detailed AI analysis for each candidate evaluation
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {candidateWorkflows.map((workflow) => {
            const StatusIcon = statusConfig[workflow.status].icon;

            return (
              <Link
                key={workflow.id}
                href={`/workflow/${workflow.id}`}
                className="group"
              >
                <div className="border-2 border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:shadow-xl transition-all bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold font-mono">
                          {workflow.candidateName}
                        </h2>
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-bold uppercase border-2',
                            statusConfig[workflow.status].color
                          )}
                        >
                          <StatusIcon className="inline w-3 h-3 mr-1" />
                          {statusConfig[workflow.status].label}
                        </span>
                      </div>
                      <p className="text-gray-600 font-mono text-sm mb-1">
                        {workflow.position}
                      </p>
                      <p className="text-gray-500 font-mono text-xs">
                        Applied: {new Date(workflow.appliedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-4xl font-bold font-mono mb-1">
                        <span
                          className={cn(
                            workflow.overallScore >= 90 ? 'text-green-600' :
                            workflow.overallScore >= 80 ? 'text-blue-600' :
                            workflow.overallScore >= 70 ? 'text-yellow-600' :
                            'text-red-600'
                          )}
                        >
                          {workflow.overallScore}
                        </span>
                        <span className="text-gray-400 text-2xl">/100</span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono uppercase">
                        Overall Score
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-xl font-bold text-blue-900 font-mono">
                        {workflow.resumeScore}
                        <span className="text-sm text-blue-600">/10</span>
                      </div>
                      <div className="text-xs text-blue-700 uppercase font-mono font-semibold">
                        Resume
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <div className="text-xl font-bold text-purple-900 font-mono">
                        {workflow.githubScore}
                        <span className="text-sm text-purple-600">/10</span>
                      </div>
                      <div className="text-xs text-purple-700 uppercase font-mono font-semibold">
                        GitHub
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-xl font-bold text-green-900 font-mono">
                        {workflow.projectScore}
                        <span className="text-sm text-green-600">/10</span>
                      </div>
                      <div className="text-xs text-green-700 uppercase font-mono font-semibold">
                        Projects
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-mono text-gray-900 font-semibold">
                      AI Decision: <span className="text-gray-700">{workflow.decision}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-end text-blue-600 font-mono text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    View Detailed Workflow
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {candidateWorkflows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 font-mono">No candidate evaluations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
