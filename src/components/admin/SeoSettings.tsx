import React, { useState } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Top Bar ────────────────────────────────────── */
function TopBar({ breadcrumbs }: { breadcrumbs: string[] }) {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-14 bg-[#131317]/95 backdrop-blur-md border-b border-[#232329] z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-[13px]">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[#5A5A68]">/</span>}
            <span className={i === breadcrumbs.length - 1 ? 'text-[#E5E1E7]' : 'text-[#5A5A68]'}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-2 border-l border-[#232329]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C0F500] to-[#00DAF3] flex items-center justify-center text-[#050508] text-xs font-bold">A</div>
          <span className="text-[12px] text-[#8B8FA3] font-mono">@admin</span>
        </div>
      </div>
    </header>
  );
}

export const SeoSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'schema' | 'sitemap' | 'hreflang'>('global');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  /* Form States */
  const [titleTemplate, setTitleTemplate] = useState('%title% — wiki of automation');
  const [metaDesc, setMetaDesc] = useState('The encyclopedia of automation — understand it, find it, ship it. AI agents, n8n workflows, MCP, and every protocol making automation real.');
  const [robotsTxt, setRobotsTxt] = useState(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://wikiofautomation.com/sitemap-index.xml`);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="seo" />
      <TopBar breadcrumbs={['Admin', 'Platform', 'SEO Settings & Schema Audit']} />

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C0F500] text-[#050508] font-semibold text-[13px] px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
          {toastMsg}
        </div>
      )}

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-6 max-w-[1400px]">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#E5E1E7]">SEO Master Settings & Schema Gap Audit</h1>
              <p className="text-[12px] text-[#5A5A68] mt-0.5 font-mono">
                Manage global meta templates, automated XML sitemaps, robots.txt, and JSON-LD schemas
              </p>
            </div>
            <button onClick={() => showToast('SEO Configuration saved!')} className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33]">
              Save SEO Settings
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#232329] pb-3">
            {[
              { id: 'global', label: 'Global Meta & Robots', icon: 'travel_explore' },
              { id: 'schema', label: 'Schema Gap Audit', icon: 'code_blocks' },
              { id: 'sitemap', label: 'XML Sitemap', icon: 'account_tree' },
              { id: 'hreflang', label: 'Multilingual hreflang', icon: 'language' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1E1E24] text-[#C0F500] border-l-2 border-[#C0F500]'
                    : 'text-[#8B8FA3] hover:text-[#E5E1E7] hover:bg-[#131317]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Global Meta */}
          {activeTab === 'global' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Global Meta & Organization Schema</h3>
                <div>
                  <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Meta Title Template</label>
                  <input
                    type="text" value={titleTemplate} onChange={e => setTitleTemplate(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[13px] text-[#E5E1E7] font-mono focus:outline-none focus:border-[#C0F500]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Default Meta Description</label>
                  <textarea
                    value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={3}
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500] resize-none"
                  />
                </div>
                <div className="pt-2 border-t border-[#1E1E24] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#E5E1E7]">WebSite SearchBox Sitelinks Schema</span>
                    <button onClick={() => showToast('Sitelinks searchbox schema updated')} className="w-9 h-5 rounded-full relative bg-[#C0F500]">
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase text-[#5A5A68] font-medium block mb-1">Organization Name</label>
                    <input
                      type="text" defaultValue="Wiki of Automation Inc."
                      className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-1.5 text-[12px] text-[#E5E1E7]"
                    />
                  </div>
                </div>
              </div>

              {/* Robots.txt Editor */}
              <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Robots.txt Editor</h3>
                <textarea
                  value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} rows={9}
                  className="w-full bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-2 text-[12px] font-mono text-[#C0F500] focus:outline-none focus:border-[#C0F500] resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Schema Audit */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[#232329] text-[11px] uppercase text-[#5A5A68]">
                      <th className="py-3 px-4 text-left">Page Type</th>
                      <th className="py-3 px-4 text-left">Required Schema</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-right">Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E24]">
                    {[
                      { type: 'Wiki Detail Pages', schema: 'SoftwareApplication / TechArticle', status: 'Passed', coverage: '100% (2,847 pages)' },
                      { type: 'Marketplace Listings', schema: 'Product / SoftwareApplication', status: 'Passed', coverage: '100% (142 listings)' },
                      { type: 'News Articles', schema: 'NewsArticle / Author', status: 'Passed', coverage: '100% (6 articles)' },
                      { type: 'Academy Courses', schema: 'Course / EducationalOccupationalProgram', status: 'Passed', coverage: '100% (5 courses)' },
                      { type: 'Compare Pages', schema: 'Table / ItemList', status: 'Passed', coverage: '100% (4 comparisons)' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#0E0E12]">
                        <td className="py-3 px-4 font-semibold text-[#E5E1E7]">{row.type}</td>
                        <td className="py-3 px-4 font-mono text-[#00DAF3]">{row.schema}</td>
                        <td className="py-3 px-4"><span className="text-[#C0F500] font-mono text-[11px]">✓ {row.status}</span></td>
                        <td className="py-3 px-4 text-right font-mono text-[#8B8FA3]">{row.coverage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#131317] border border-[#232329] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-semibold text-[#E5E1E7]">Missing Schema Audit Pages</h4>
                  <p className="text-[11px] text-[#5A5A68]">0 critical missing schemas detected across 100 statically generated routes.</p>
                </div>
                <button onClick={() => showToast('All 100 routes have valid JSON-LD schemas')} className="px-3 py-1.5 rounded bg-[#1E1E24] text-[12px] text-[#8B8FA3] hover:text-[#E5E1E7]">
                  View List (0)
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: XML Sitemap */}
          {activeTab === 'sitemap' && (
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 space-y-4 font-mono text-[12px]">
              <div className="flex items-center justify-between border-b border-[#232329] pb-3">
                <div>
                  <span className="text-[10px] text-[#5A5A68] uppercase">Auto-Generated Sitemap</span>
                  <p className="text-[14px] font-bold text-[#C0F500]">sitemap-index.xml (90 URLs Indexed)</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => showToast('Re-generated XML sitemap!')} className="px-3 py-1.5 rounded bg-[#1E1E24] text-[#E5E1E7]">Regenerate</button>
                  <button onClick={() => showToast('Downloading sitemap-index.xml')} className="px-3 py-1.5 rounded bg-[#C0F500] text-[#050508] font-bold">Download XML</button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { engine: 'Google Search Console', status: 'Submitted', time: 'Today 04:12 UTC' },
                  { engine: 'Bing Webmaster Tools', status: 'Submitted', time: 'Today 04:12 UTC' },
                  { engine: 'Yandex Webmaster', status: 'Submitted', time: 'Today 04:12 UTC' },
                ].map((se, idx) => (
                  <div key={idx} className="bg-[#0E0E12] border border-[#1E1E24] p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[#E5E1E7] block font-sans font-medium">{se.engine}</span>
                      <span className="text-[10px] text-[#5A5A68]">{se.time}</span>
                    </div>
                    <button onClick={() => showToast(`Resubmitted to ${se.engine}!`)} className="px-2 py-1 bg-[#00DAF3]/15 text-[#00DAF3] rounded text-[10px]">Resubmit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: hreflang */}
          {activeTab === 'hreflang' && (
            <div className="bg-[#131317] border border-[#232329] rounded-xl p-5 text-[12px] space-y-3 font-mono">
              <h3 className="text-sm font-semibold text-[#E5E1E7] font-sans">Multilingual hreflang Mappings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-[#0E0E12] p-2.5 rounded border border-[#1E1E24]">
                  <span>en-US (Default) → https://wikiofautomation.com/</span>
                  <span className="text-[#C0F500]">Active</span>
                </div>
                <div className="flex items-center justify-between bg-[#0E0E12] p-2.5 rounded border border-[#1E1E24]">
                  <span>es-ES (Spanish) → https://wikiofautomation.com/es/</span>
                  <span className="text-[#C0F500]">Active</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
