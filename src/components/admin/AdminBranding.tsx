import React, { useState } from 'react';
import { AdminSidebar } from './AdminOverview';

/* ─── Color Swatch Interface ──────────────────────── */
interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  usage: string;
  textColor: string;
}

const COLOR_SWATCHES: ColorSwatch[] = [
  { name: 'Void Background', hex: '#050508', role: '--color-void', usage: 'Deep obsidian main page background', textColor: '#E5E1E7' },
  { name: 'Surface Container', hex: '#131317', role: '--color-surface', usage: 'Cards, panels, modal dialogs, sidebars', textColor: '#E5E1E7' },
  { name: 'Surface Raised', hex: '#1B1B1F', role: '--color-raised', usage: 'Hover states, active card fills, inputs', textColor: '#E5E1E7' },
  { name: 'Electric Lime (Primary)', hex: '#C0F500', role: '--color-accent', usage: 'Primary buttons, active indicators, brand logo', textColor: '#050508' },
  { name: 'Cyber Cyan (Secondary)', hex: '#00DAF3', role: '--color-accent-2', usage: 'Live online indicators, protocol badges, verification', textColor: '#050508' },
  { name: 'Deep Violet (Ada Brain)', hex: '#6C63FF', role: '--color-accent-3', usage: 'Ada AI brain widget, prompt highlights, special tags', textColor: '#FFFFFF' },
  { name: 'Text Primary', hex: '#E5E1E7', role: '--color-text-1', usage: 'Headlines, title text, primary body text', textColor: '#050508' },
  { name: 'Text Muted', hex: '#8B8FA3', role: '--color-text-2', usage: 'Subtitles, captions, table metadata', textColor: '#050508' },
  { name: 'Text Dim', hex: '#5A5A68', role: '--color-text-3', usage: 'Monospace labels, disabled inputs, timestamp ticks', textColor: '#E5E1E7' },
  { name: 'Border Subdued', hex: '#232329', role: '--color-border', usage: '1px clean structural dividers and card borders', textColor: '#E5E1E7' },
  { name: 'Status Warning', hex: '#F5A623', role: '--color-warn', usage: 'Pending reviews, warning alerts, gold rank accents', textColor: '#050508' },
  { name: 'Status Danger', hex: '#FF6B6B', role: '--color-danger', usage: 'Errors, destructive actions, unpublish warnings', textColor: '#FFFFFF' },
];

/* ─── Media Spec Interface ───────────────────────── */
interface MediaSpec {
  category: string;
  dimensions: string;
  aspectRatio: string;
  maxSize: string;
  formats: string;
  notes: string;
  recommended: string;
}

const MEDIA_SPECS: MediaSpec[] = [
  { category: 'News & Blog Hero', dimensions: '1200 × 630 px', aspectRatio: '1.91:1 (16:9 approx)', maxSize: '2.0 MB', formats: 'WEBP, PNG, JPG', notes: 'Displayed on news index, homepage hero strip, and OpenGraph social shares.', recommended: 'Use 72 DPI WEBP at 85% compression' },
  { category: 'Wiki Article Diagram', dimensions: '1600 × 900 px', aspectRatio: '16:9', maxSize: '3.0 MB', formats: 'SVG, WEBP, PNG', notes: 'Workflow architecture diagrams, flowcharts, & sequence maps.', recommended: 'Vector SVG preferred; dark background #0E0E12' },
  { category: 'Marketplace Thumbnail', dimensions: '800 × 600 px', aspectRatio: '4:3', maxSize: '1.0 MB', formats: 'WEBP, PNG', notes: 'Tool cards on marketplace search & category pages.', recommended: 'High contrast preview with logo & key feature badge' },
  { category: 'Marketplace Tool Cover', dimensions: '1400 × 400 px', aspectRatio: '3.5:1', maxSize: '1.5 MB', formats: 'WEBP, PNG', notes: 'Header cover banner on individual marketplace detail pages.', recommended: 'Dark gradient overlay for text readability' },
  { category: 'User & Creator Avatar', dimensions: '400 × 400 px', aspectRatio: '1:1 (Square)', maxSize: '500 KB', formats: 'PNG, WEBP, JPG', notes: 'Displayed inside rounded avatar circles (40px/80px).', recommended: 'Centered face or logo mark on dark background' },
  { category: 'OG Social Share Banner', dimensions: '1200 × 630 px', aspectRatio: '1.91:1', maxSize: '1.0 MB', formats: 'PNG, JPG', notes: 'Default preview image when sharing WOA links on Twitter/LinkedIn/Discord.', recommended: 'Includes WOA logo, tagline, and Electric Lime accent' },
  { category: 'Favicon & App Icon Pack', dimensions: '512 × 512 px (Master)', aspectRatio: '1:1', maxSize: '200 KB', formats: 'SVG, PNG, ICO', notes: 'Generates favicon-16, favicon-32, apple-touch-icon 180×180, & webmanifest.', recommended: 'Vector SVG logo mark only' },
  { category: 'Code / Terminal Screenshot', dimensions: 'Retina 2x (Min 1400px wide)', aspectRatio: 'Custom (16:10 / 16:9)', maxSize: '1.5 MB', formats: 'PNG', notes: 'CLI tools, n8n canvas node captures, & terminal sessions.', recommended: 'Dark theme (#0E0E12), JetBrains Mono font, 2x scale' },
];

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

/* ─── Main Component ─────────────────────────────── */
export const AdminBranding: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tokens' | 'images' | 'checker' | 'guidelines'>('tokens');

  /* Interactive Asset Checker State */
  const [analyzedImage, setAnalyzedImage] = useState<{
    name: string;
    width: number;
    height: number;
    aspectRatio: string;
    sizeKB: number;
    type: string;
    targetCategory: string;
    isValid: boolean;
    issues: string[];
  } | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target?.result as string;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatioNum = (width / height).toFixed(2);
        const sizeKB = Math.round(file.size / 1024);
        const issues: string[] = [];

        // Auto detect category target based on aspect ratio
        let targetCategory = 'News & Blog Hero';
        let reqWidth = 1200;
        let reqHeight = 630;
        let reqMaxKB = 2048;

        if (Math.abs(width / height - 1) < 0.1) {
          targetCategory = 'User Avatar / Favicon';
          reqWidth = 400;
          reqHeight = 400;
          reqMaxKB = 500;
        } else if (Math.abs(width / height - 1.33) < 0.15) {
          targetCategory = 'Marketplace Thumbnail';
          reqWidth = 800;
          reqHeight = 600;
          reqMaxKB = 1024;
        } else if (width / height > 3) {
          targetCategory = 'Marketplace Cover Banner';
          reqWidth = 1400;
          reqHeight = 400;
          reqMaxKB = 1536;
        }

        if (width < reqWidth) issues.push(`Resolution under recommended minimum (${width}px < ${reqWidth}px width)`);
        if (sizeKB > reqMaxKB) issues.push(`File size exceeds limit (${sizeKB}KB > ${reqMaxKB}KB limit)`);
        if (!['image/webp', 'image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
          issues.push(`Unsupported file format (${file.type}). Use WEBP, PNG, or SVG.`);
        }

        setAnalyzedImage({
          name: file.name,
          width,
          height,
          aspectRatio: `${aspectRatioNum}:1 (${width}×${height})`,
          sizeKB,
          type: file.type.replace('image/', '').toUpperCase(),
          targetCategory,
          isValid: issues.length === 0,
          issues,
        });
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-[#E5E1E7]">
      <AdminSidebar activeId="branding" />
      <TopBar breadcrumbs={['Admin', 'Platform', 'Branding & Guidelines']} />

      <main className="ml-[240px] pt-14">
        <div className="p-6 space-y-6 max-w-[1400px]">

          {/* Header & Description */}
          <div className="flex items-start justify-between border-b border-[#232329] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#E5E1E7]">Brand Identity & Asset Guidelines</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#C0F500]/15 text-[#C0F500] border border-[#C0F500]/30 font-medium">
                  STITCH SYSTEM v2.4
                </span>
              </div>
              <p className="text-[13px] text-[#8B8FA3] mt-1">
                Official design tokens, image dimensions, typography rules, and interactive compatibility checkers for <span className="text-[#C0F500]">WikiOfAutomation.com</span>.
              </p>
            </div>
            <button className="px-3.5 py-2 rounded-lg bg-[#C0F500] text-[#050508] text-[12px] font-semibold hover:bg-[#D4FF33] transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              Download Brand Kit (.zip)
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#232329] pb-3">
            {[
              { id: 'tokens', label: 'Color Tokens', icon: 'palette' },
              { id: 'images', label: 'Image & Media Specs', icon: 'aspect_ratio' },
              { id: 'checker', label: 'Asset Checker', icon: 'fact_check' },
              { id: 'guidelines', label: 'Brand Do\'s & Don\'ts', icon: 'rule' },
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

          {/* TAB 1: Color Tokens */}
          {activeTab === 'tokens' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Color Tokens & Swatches</h3>
                {copiedHex && (
                  <span className="text-[11px] font-mono text-[#C0F500] bg-[#C0F500]/10 px-2 py-0.5 rounded border border-[#C0F500]/30 animate-fade-in">
                    Copied {copiedHex} to clipboard!
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {COLOR_SWATCHES.map(swatch => (
                  <div key={swatch.hex + swatch.name} className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden group hover:border-[#353439] transition-all">
                    <div className="h-20 p-3 flex flex-col justify-between relative" style={{ backgroundColor: swatch.hex, color: swatch.textColor }}>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold opacity-80">{swatch.role}</span>
                      <button
                        onClick={() => handleCopyHex(swatch.hex)}
                        className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>content_copy</span>
                        Copy
                      </button>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#E5E1E7]">{swatch.name}</span>
                        <span className="text-[11px] font-mono text-[#C0F500]">{swatch.hex}</span>
                      </div>
                      <p className="text-[11px] text-[#8B8FA3] leading-relaxed">{swatch.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Image & Media Specs */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#E5E1E7]">Media & Image Dimensions Reference Table</h3>
                  <p className="text-[11px] text-[#8B8FA3] mt-0.5">Strict platform specifications to maintain fast page load times and crisp display quality.</p>
                </div>
                <span className="text-[11px] font-mono text-[#5A5A68]">{MEDIA_SPECS.length} asset types defined</span>
              </div>

              <div className="bg-[#131317] border border-[#232329] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#232329] text-[11px] uppercase tracking-wider text-[#5A5A68]">
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Dimensions</th>
                      <th className="py-3 px-4 text-left">Aspect Ratio</th>
                      <th className="py-3 px-4 text-left">Max Size</th>
                      <th className="py-3 px-4 text-left">Formats</th>
                      <th className="py-3 px-4 text-left">Usage Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E24]">
                    {MEDIA_SPECS.map((spec, idx) => (
                      <tr key={spec.category} className={`hover:bg-[#0E0E12] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#0A0A0E]'}`}>
                        <td className="py-3 px-4 text-[13px] font-medium text-[#E5E1E7]">{spec.category}</td>
                        <td className="py-3 px-4 text-[12px] font-mono text-[#C0F500] font-semibold">{spec.dimensions}</td>
                        <td className="py-3 px-4 text-[12px] font-mono text-[#00DAF3]">{spec.aspectRatio}</td>
                        <td className="py-3 px-4 text-[12px] font-mono text-[#FF6B6B]">{spec.maxSize}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-[#1E1E24] text-[10px] font-mono text-[#8B8FA3]">{spec.formats}</span>
                        </td>
                        <td className="py-3 px-4 text-[12px] text-[#8B8FA3]">
                          <p>{spec.notes}</p>
                          <p className="text-[10px] font-mono text-[#5A5A68] mt-0.5">💡 {spec.recommended}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Asset Checker */}
          {activeTab === 'checker' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#E5E1E7]">Asset Pre-Upload Validator</h3>
                <p className="text-[11px] text-[#8B8FA3] mt-0.5">Drop or select any image to verify its resolution, aspect ratio, and file size before uploading to the platform.</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* File Dropzone */}
                <div className="col-span-1 bg-[#131317] border border-[#232329] rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[260px] relative hover:border-[#C0F500]/40 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="w-12 h-12 rounded-full bg-[#1E1E24] border border-[#232329] flex items-center justify-center text-[#C0F500] mb-3">
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>cloud_upload</span>
                  </div>
                  <p className="text-[13px] font-medium text-[#E5E1E7]">Click or drag image to validate</p>
                  <p className="text-[11px] text-[#5A5A68] mt-1">Supports WEBP, PNG, JPG, SVG</p>
                </div>

                {/* Validation Results */}
                <div className="col-span-2 bg-[#131317] border border-[#232329] rounded-xl p-5">
                  {analyzedImage ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#232329] pb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#5A5A68]">Analysis Result</span>
                          <h4 className="text-[15px] font-semibold text-[#E5E1E7]">{analyzedImage.name}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                          analyzedImage.isValid ? 'bg-[#C0F500]/15 text-[#C0F500] border border-[#C0F500]/30' : 'bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30'
                        }`}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                            {analyzedImage.isValid ? 'check_circle' : 'error'}
                          </span>
                          {analyzedImage.isValid ? 'PASSED — Fully Compatible' : 'WARNING — Action Needed'}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3 font-mono text-[12px]">
                        <div className="bg-[#0E0E12] p-2.5 rounded-lg border border-[#1E1E24]">
                          <span className="text-[10px] text-[#5A5A68] block">Resolution</span>
                          <span className="text-[#C0F500] font-bold">{analyzedImage.width} × {analyzedImage.height}</span>
                        </div>
                        <div className="bg-[#0E0E12] p-2.5 rounded-lg border border-[#1E1E24]">
                          <span className="text-[10px] text-[#5A5A68] block">Aspect Ratio</span>
                          <span className="text-[#00DAF3] font-bold">{analyzedImage.aspectRatio}</span>
                        </div>
                        <div className="bg-[#0E0E12] p-2.5 rounded-lg border border-[#1E1E24]">
                          <span className="text-[10px] text-[#5A5A68] block">File Size</span>
                          <span className="text-[#E5E1E7] font-bold">{analyzedImage.sizeKB} KB</span>
                        </div>
                        <div className="bg-[#0E0E12] p-2.5 rounded-lg border border-[#1E1E24]">
                          <span className="text-[10px] text-[#5A5A68] block">Detected Target</span>
                          <span className="text-[#8B8FA3] font-bold truncate block">{analyzedImage.targetCategory}</span>
                        </div>
                      </div>

                      {analyzedImage.issues.length > 0 ? (
                        <div className="bg-[#FF6B6B]/8 border border-[#FF6B6B]/20 rounded-lg p-3 space-y-1">
                          <p className="text-[11px] font-semibold text-[#FF6B6B] flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                            Optimization Recommendations:
                          </p>
                          <ul className="list-disc list-inside text-[11px] text-[#FF9B9B] space-y-0.5">
                            {analyzedImage.issues.map((issue, idx) => <li key={idx}>{issue}</li>)}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-[#C0F500]/8 border border-[#C0F500]/20 rounded-lg p-3">
                          <p className="text-[11px] text-[#C0F500] font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>task_alt</span>
                            Perfect! This image meets all WikiOfAutomation specifications and can be uploaded immediately.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5A5A68]">
                      <span className="material-symbols-outlined mb-2" style={{ fontSize: 36 }}>analytics</span>
                      <p className="text-[13px] font-medium">No image selected for testing</p>
                      <p className="text-[11px] max-w-sm mt-1">Upload a file on the left to see instant resolution, file size, and ratio analysis against platform rules.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Brand Do's & Don'ts */}
          {activeTab === 'guidelines' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Do's */}
              <div className="bg-[#131317] border border-[#C0F500]/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#C0F500]">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Brand Do's</h3>
                </div>
                <ul className="space-y-2.5 text-[12px] text-[#8B8FA3]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C0F500] font-bold">✓</span>
                    <span>Always use <strong className="text-[#E5E1E7]">JetBrains Mono</strong> for numbers, stats, prices, code snippets, and timestamps.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C0F500] font-bold">✓</span>
                    <span>Maintain the obsidian dark void background (<code className="text-[#C0F500]">#050508</code>) with 1px subdued borders (<code className="text-[#C0F500]">#232329</code>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C0F500] font-bold">✓</span>
                    <span>Use <strong className="text-[#E5E1E7]">WEBP format</strong> for all uploaded content illustrations to preserve bandwidth and load speed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C0F500] font-bold">✓</span>
                    <span>Reserve <strong className="text-[#C0F500]">Electric Lime (#C0F500)</strong> exclusively for high-priority call-to-actions and active states.</span>
                  </li>
                </ul>
              </div>

              {/* Don'ts */}
              <div className="bg-[#131317] border border-[#FF6B6B]/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#FF6B6B]">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>cancel</span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Brand Don'ts</h3>
                </div>
                <ul className="space-y-2.5 text-[12px] text-[#8B8FA3]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B6B] font-bold">✕</span>
                    <span>Do NOT use generic saturated primary colors (pure red `#FF0000`, blue `#0000FF`) outside approved HSL swatches.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B6B] font-bold">✕</span>
                    <span>Do NOT upload uncompressed images over 2MB into news articles or marketplace entries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B6B] font-bold">✕</span>
                    <span>Do NOT stretch or distort logos; always maintain 1:1 aspect ratio for avatars and icons.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B6B] font-bold">✕</span>
                    <span>Do NOT place bright white cards or light-mode container blocks inside the dark UI interface.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
