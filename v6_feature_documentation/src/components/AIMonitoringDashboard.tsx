import { useState } from 'react';
import { X } from 'lucide-react';

interface LLMStatus {
  name: string;
  discovered: boolean;
  accuracy: number;
  citesOurDocs: boolean;
  lastChecked: string;
  status: 'success' | 'pending' | 'error';
}

export function AIMonitoringDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [llmStatuses] = useState<LLMStatus[]>([
    { name: 'ChatGPT', discovered: false, accuracy: 0, citesOurDocs: false, lastChecked: 'Never', status: 'pending' },
    { name: 'Claude', discovered: false, accuracy: 0, citesOurDocs: false, lastChecked: 'Never', status: 'pending' },
    { name: 'Gemini', discovered: false, accuracy: 0, citesOurDocs: false, lastChecked: 'Never', status: 'pending' },
    { name: 'Cursor', discovered: false, accuracy: 0, citesOurDocs: false, lastChecked: 'Never', status: 'pending' },
    { name: 'Grok', discovered: false, accuracy: 0, citesOurDocs: false, lastChecked: 'Never', status: 'pending' }
  ]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Temporarily hidden - keeping background code active */}
      {false && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg transition-all"
          title="AI Discovery Monitor"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      )}

      {/* Dashboard Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI Discovery Monitor</h2>
                <p className="text-sm text-slate-600 mt-1">Track LLM indexing and citation status</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="text-sm text-emerald-600 font-medium">Discovery Rate</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    {Math.round((llmStatuses.filter(s => s.discovered).length / llmStatuses.length) * 100)}%
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium">Avg Accuracy</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {Math.round(llmStatuses.reduce((acc, s) => acc + s.accuracy, 0) / llmStatuses.length)}%
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-600 font-medium">Citations</div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {llmStatuses.filter(s => s.citesOurDocs).length}/{llmStatuses.length}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-sm text-orange-600 font-medium">Status</div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">
                    {llmStatuses.filter(s => s.status === 'success').length > 3 ? 'Good' : 'Working'}
                  </div>
                </div>
              </div>

              {/* LLM Status Table */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        LLM
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Discovered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Citations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Last Checked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {llmStatuses.map((llm) => (
                      <tr key={llm.name} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              llm.status === 'success' ? 'bg-emerald-500' :
                              llm.status === 'pending' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="text-sm font-medium text-slate-900">{llm.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            llm.discovered 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {llm.discovered ? 'Yes' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {llm.accuracy}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            llm.citesOurDocs 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {llm.citesOurDocs ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {llm.lastChecked}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SEO Metrics */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Indexing Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Sitemap Submitted</span>
                      <span className="text-emerald-600 font-medium">✓ Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">IndexNow Enabled</span>
                      <span className="text-emerald-600 font-medium">✓ Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">PubSubHubbub</span>
                      <span className="text-emerald-600 font-medium">✓ Active</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">AI Training Data</span>
                      <span className="text-emerald-600 font-medium">✓ Available</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Content Optimization</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Structured Data</span>
                      <span className="text-emerald-600 font-medium">✓ Optimized</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Embeddings</span>
                      <span className="text-emerald-600 font-medium">✓ Generated</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">FAQ Data</span>
                      <span className="text-emerald-600 font-medium">✓ Published</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">AI Markers</span>
                      <span className="text-emerald-600 font-medium">✓ Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Links */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">📚 AI Discovery Resources</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• <a href="/ai-training.json" className="hover:underline" target="_blank">/ai-training.json</a> - AI Training Data</li>
                  <li>• <a href="/ai-faq.jsonl" className="hover:underline" target="_blank">/ai-faq.jsonl</a> - FAQ Data (JSONL)</li>
                  <li>• <a href="/embeddings.json" className="hover:underline" target="_blank">/embeddings.json</a> - Vector Embeddings</li>
                  <li>• <a href="/sitemap-ai.xml" className="hover:underline" target="_blank">/sitemap-ai.xml</a> - AI-Optimized Sitemap</li>
                  <li>• <a href="/feed.xml" className="hover:underline" target="_blank">/feed.xml</a> - Real-time RSS Feed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}