import React, { useState } from 'react';

/* ─── Types ──────────────────────────────────────── */
export type PublishType = 'agent' | 'workflow' | 'skill' | 'prompt' | 'seo_tool' | 'ai_os';
export type PricingModel = 'free' | 'onetime' | 'subscription' | 'freemium';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

export const PublisherOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  /* Form Data State */
  const [publishType, setPublishType] = useState<PublishType>('workflow');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('workflows');
  const [platformTags, setPlatformTags] = useState<string[]>(['claude', 'n8n']);
  const [newPlatformTag, setNewPlatformTag] = useState('');
  const [skillTags, setSkillTags] = useState<string[]>(['#email', '#agents']);
  const [newSkillTag, setNewSkillTag] = useState('');

  /* Files State */
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: 'f-1', name: 'n8n_stripe_drip_workflow.json', size: '240 KB', type: 'JSON' },
    { id: 'f-2', name: 'setup_guide_readme.md', size: '12 KB', type: 'MARKDOWN' },
  ]);
  const [isDragOver, setIsDragOver] = useState(false);

  /* Pricing State */
  const [pricingModel, setPricingModel] = useState<PricingModel>('onetime');
  const [oneTimePrice, setOneTimePrice] = useState('49');
  const [subPrice, setSubPrice] = useState('19');
  const [subInterval, setSubInterval] = useState('month');
  const [freemiumDesc, setFreemiumDesc] = useState('Free tier includes basic workflow execution. Pro includes priority API keys.');
  const [proPrice, setProPrice] = useState('29');

  /* Step Titles & Progress */
  const steps = [
    { num: 1, title: 'Type' },
    { num: 2, title: 'Details' },
    { num: 3, title: 'Files' },
    { num: 4, title: 'Pricing' },
    { num: 5, title: 'Publish' },
  ];

  /* Handlers */
  const handleTypeSelect = (type: PublishType) => {
    setPublishType(type);
    const catMap: Record<PublishType, string> = {
      agent: 'agents',
      workflow: 'workflows',
      skill: 'skills',
      prompt: 'prompts',
      seo_tool: 'apps',
      ai_os: 'ai-os',
    };
    setCategory(catMap[type]);
  };

  const addPlatformTag = () => {
    if (newPlatformTag.trim() && !platformTags.includes(newPlatformTag.trim())) {
      setPlatformTags([...platformTags, newPlatformTag.trim().toLowerCase()]);
      setNewPlatformTag('');
    }
  };

  const removePlatformTag = (tag: string) => {
    setPlatformTags(platformTags.filter(t => t !== tag));
  };

  const addSkillTag = () => {
    if (newSkillTag.trim()) {
      const formatted = newSkillTag.trim().startsWith('#') ? newSkillTag.trim() : `#${newSkillTag.trim()}`;
      if (!skillTags.includes(formatted)) {
        setSkillTags([...skillTags, formatted]);
        setNewSkillTag('');
      }
    }
  };

  const removeSkillTag = (tag: string) => {
    setSkillTags(skillTags.filter(t => t !== tag));
  };

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploaded = Array.from(e.target.files).map((f, i) => ({
        id: `f-new-${Date.now()}-${i}`,
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      }));
      setFiles([...files, ...uploaded]);
    }
  };

  const handleDropSimulated = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploaded = Array.from(e.dataTransfer.files).map((f, i) => ({
        id: `f-drop-${Date.now()}-${i}`,
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      }));
      setFiles([...files, ...uploaded]);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0F500]/15 text-[#C0F500] font-mono text-[11px] font-bold">
          🚀 CREATOR PUBLISHING HUB
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E5E1E7]">
          Publish New Listing
        </h1>
        <p className="text-[13px] font-mono text-[#8B8FA3]">
          Share your workflows, AI agents, prompts, or tools with over 40,000 automation builders.
        </p>
      </div>

      {/* Progress Bar Header */}
      {!isSubmitted && (
        <div className="bg-[#131317] border border-[#232329] rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-[#232329] -translate-y-1/2 z-0" />

            {steps.map(step => {
              const isCompleted = step.num < currentStep;
              const isCurrent = step.num === currentStep;

              return (
                <div
                  key={step.num}
                  onClick={() => step.num <= currentStep && setCurrentStep(step.num)}
                  className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-[13px] font-bold transition-all shadow-md ${
                      isCompleted
                        ? 'bg-[#00DAF3] text-[#050508]'
                        : isCurrent
                        ? 'bg-[#C0F500] text-[#050508] scale-110 ring-4 ring-[#C0F500]/20'
                        : 'bg-[#1B1B1F] text-[#5A5A68] border border-[#232329]'
                    }`}
                  >
                    {isCompleted ? '✓' : step.num}
                  </div>
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      isCompleted
                        ? 'text-[#00DAF3]'
                        : isCurrent
                        ? 'text-[#C0F500] font-bold'
                        : 'text-[#5A5A68]'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBMITTED SUCCESS SCREEN */}
      {isSubmitted ? (
        <div className="bg-[#131317] border border-[#C0F500]/40 rounded-3xl p-10 text-center space-y-6 shadow-2xl animate-in fade-in">
          <div className="w-20 h-20 rounded-full bg-[#C0F500]/20 border border-[#C0F500]/40 flex items-center justify-center mx-auto text-[#C0F500]">
            <span className="material-symbols-outlined" style={{ fontSize: 44 }}>check_circle</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#E5E1E7]">Submitted for Review!</h2>
            <p className="text-[14px] text-[#8B8FA3] max-w-md mx-auto leading-relaxed">
              Your listing <strong className="text-[#C0F500]">"{title || 'Untitled Tool'}"</strong> has been queued for automated security scan & moderator approval. Review takes under 2 hours.
            </p>
          </div>

          <div className="bg-[#0E0E12] border border-[#1E1E24] p-4 rounded-xl max-w-sm mx-auto font-mono text-[12px] text-left space-y-1">
            <div className="flex justify-between"><span className="text-[#5A5A68]">Listing Type:</span><span className="text-[#00DAF3] capitalize">{publishType}</span></div>
            <div className="flex justify-between"><span className="text-[#5A5A68]">Pricing:</span><span className="text-[#C0F500] capitalize">{pricingModel}</span></div>
            <div className="flex justify-between"><span className="text-[#5A5A68]">Files Uploaded:</span><span className="text-[#E5E1E7]">{files.length} Files</span></div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <a href="/dashboard" className="px-6 py-2.5 rounded-lg bg-[#C0F500] text-[#050508] text-[13px] font-bold hover:bg-[#D4FF33]">
              Go to Creator Dashboard
            </a>
            <button onClick={() => { setIsSubmitted(false); setCurrentStep(1); }} className="px-6 py-2.5 rounded-lg bg-[#1E1E24] text-[#E5E1E7] text-[13px] font-semibold border border-[#232329]">
              Publish Another Item
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#131317] border border-[#232329] rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">

          {/* STEP 1: SELECT TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#E5E1E7]">Step 1: What are you publishing?</h2>
                <p className="text-[12px] text-[#5A5A68] font-mono mt-0.5">Select the primary format of your automation asset.</p>
              </div>

              {/* 3x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'agent', name: '🛰 AI Agent', desc: 'Autonomous swarms, Hermes browser, Claude engineers', frameworks: 'Claude, Hermes, OpenClaw' },
                  { id: 'workflow', name: '⚡ Workflow', desc: 'JSON nodes, trigger flows, webhook pipelines', frameworks: 'n8n, Make, Zapier' },
                  { id: 'skill', name: '🧠 Skill Pack', desc: 'Agent capabilities, CLI tool extensions', frameworks: 'Claude, Hermes, OpenClaw' },
                  { id: 'prompt', name: '📝 Prompt Pack', desc: 'System prompts, reasoning chains, templates', frameworks: 'ChatGPT, Claude, Gemini' },
                  { id: 'seo_tool', name: '🔍 SEO Tool', desc: 'Audit scripts, schema generators, keyword bots', frameworks: 'Node, Python, Astro' },
                  { id: 'ai_os', name: '📦 AI OS Stack', desc: 'Dockerized execution environments & sandboxes', frameworks: 'Docker, OpenInterpreter' },
                ].map(item => {
                  const isSelected = publishType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleTypeSelect(item.id as PublishType)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#C0F500]/10 border-[#C0F500] ring-1 ring-[#C0F500]/50 shadow-lg'
                          : 'bg-[#131317] border-[#232329] hover:border-[#C0F500]/50 hover:bg-[#1B1B1F]'
                      }`}
                    >
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#E5E1E7]">{item.name}</h3>
                        <p className="text-[12px] text-[#8B8FA3] leading-relaxed">{item.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#00DAF3] block pt-2 border-t border-[#1E1E24]">
                        {item.frameworks}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#C0F500] text-[#050508] text-[13px] font-bold hover:bg-[#D4FF33] transition-all"
                >
                  Continue to Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LISTING DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#E5E1E7]">Step 2: Listing Details</h2>
                <p className="text-[12px] text-[#5A5A68] font-mono mt-0.5">Title, tagline, rich description, and search discovery tags.</p>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5A5A68] font-medium block mb-1">Listing Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. n8n Autonomous Customer Support & Refund Agent"
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-xl px-4 py-2.5 text-[14px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]"
                  />
                </div>

                {/* Tagline */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-mono uppercase text-[#5A5A68] font-medium">Tagline (140 chars max) *</label>
                    <span className="text-[10px] font-mono text-[#5A5A68]">{140 - tagline.length} chars left</span>
                  </div>
                  <input
                    type="text"
                    maxLength={140}
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="One-line summary for cards and search results..."
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-xl px-4 py-2.5 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5A5A68] font-medium block mb-1">Primary Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-xl px-4 py-2.5 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]"
                  >
                    <option value="workflows">Workflows</option>
                    <option value="agents">AI Agents</option>
                    <option value="skills">Skills</option>
                    <option value="prompts">Prompts</option>
                    <option value="apps">SEO Tools & Apps</option>
                    <option value="ai-os">AI OS Stacks</option>
                  </select>
                </div>

                {/* Rich Description Editor */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5A5A68] font-medium block mb-1">Rich Description (Markdown Supported) *</label>
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-[#1B1B1F] border border-b-0 border-[#232329] rounded-t-xl text-[12px] font-mono text-[#8B8FA3]">
                    <button type="button" onClick={() => setDescription(d => `${d} **Bold**`)} className="px-2 py-1 hover:bg-[#232329] rounded">Bold</button>
                    <button type="button" onClick={() => setDescription(d => `${d} *Italic*`)} className="px-2 py-1 hover:bg-[#232329] rounded">Italic</button>
                    <button type="button" onClick={() => setDescription(d => `${d}\n\`\`\`json\n// code block\n\`\`\``)} className="px-2 py-1 hover:bg-[#232329] rounded">Code</button>
                    <button type="button" onClick={() => setDescription(d => `${d} [Link](url)`)} className="px-2 py-1 hover:bg-[#232329] rounded">Link</button>
                  </div>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={12}
                    placeholder="Describe how to install, set up environment variables, and run this automation..."
                    className="w-full bg-[#0E0E12] border border-[#232329] rounded-b-xl p-4 text-[13px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500] resize-none min-h-[300px]"
                  />
                </div>

                {/* Platform Tags */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5A5A68] font-medium block mb-1">Platform Tags</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {platformTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00DAF3]/15 text-[#00DAF3] font-mono text-[12px]">
                        {tag}
                        <button type="button" onClick={() => removePlatformTag(tag)} className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPlatformTag}
                      onChange={e => setNewPlatformTag(e.target.value)}
                      placeholder="e.g. docker, langgraph..."
                      className="bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-1.5 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#00DAF3]"
                    />
                    <button type="button" onClick={addPlatformTag} className="px-3 py-1.5 rounded-lg bg-[#1E1E24] text-[#00DAF3] text-[12px] font-mono">
                      + Add Tag
                    </button>
                  </div>
                </div>

                {/* Skill Tags */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#5A5A68] font-medium block mb-1">Skill Tags</label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {skillTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C0F500]/15 text-[#C0F500] font-mono text-[12px]">
                        {tag}
                        <button type="button" onClick={() => removeSkillTag(tag)} className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkillTag}
                      onChange={e => setNewSkillTag(e.target.value)}
                      placeholder="e.g. #customer-support, #scraping..."
                      className="bg-[#0E0E12] border border-[#232329] rounded-lg px-3 py-1.5 text-[12px] text-[#E5E1E7] focus:outline-none focus:border-[#C0F500]"
                    />
                    <button type="button" onClick={addSkillTag} className="px-3 py-1.5 rounded-lg bg-[#1E1E24] text-[#C0F500] text-[12px] font-mono">
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setCurrentStep(1)} className="px-5 py-2.5 rounded-xl bg-[#1E1E24] text-[#E5E1E7] text-[13px] font-semibold border border-[#232329]">
                  ← Back
                </button>
                <button onClick={() => setCurrentStep(3)} className="px-6 py-2.5 rounded-xl bg-[#C0F500] text-[#050508] text-[13px] font-bold hover:bg-[#D4FF33]">
                  Continue to Files →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD FILES */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#E5E1E7]">Step 3: Upload Asset Files</h2>
                <p className="text-[12px] text-[#5A5A68] font-mono mt-0.5">Upload JSON workflows, code archives, manuals, or demo videos.</p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDropSimulated}
                className={`border-2 border-dashed rounded-2xl p-10 text-center space-y-3 transition-all ${
                  isDragOver ? 'border-[#C0F500] bg-[#C0F500]/10 border-solid' : 'border-[#2E2E38] bg-[#0E0E12] hover:border-[#C0F500]/50'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#131317] border border-[#232329] flex items-center justify-center mx-auto text-[#C0F500]">
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#E5E1E7]">
                    Drag & drop files here, or <label className="text-[#C0F500] underline cursor-pointer">browse<input type="file" multiple onChange={handleFileUploadSimulated} className="hidden" /></label>
                  </p>
                  <p className="text-[11px] text-[#5A5A68] font-mono">
                    Accepted: .json · .yaml · .zip · .md · .pdf · .mp4 (Max 100MB per file)
                  </p>
                </div>
                <span className="inline-block px-3 py-1 rounded bg-[#00DAF3]/15 text-[#00DAF3] font-mono text-[10px]">
                  ⚡ Videos automatically hosted & streamed via Cloudflare R2
                </span>
              </div>

              {/* Uploaded File List */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-[#5A5A68] font-semibold">Uploaded Files ({files.length})</h3>
                <div className="space-y-2">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0E0E12] border border-[#1E1E24]">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-[#1E1E24] text-[#C0F500] font-mono text-[10px] font-bold">
                          {f.type}
                        </span>
                        <span className="text-[13px] font-medium text-[#E5E1E7]">{f.name}</span>
                        <span className="text-[11px] font-mono text-[#5A5A68]">({f.size})</span>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter(item => item.id !== f.id))}
                        className="text-[#FF6B6B] hover:text-white p-1"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setCurrentStep(2)} className="px-5 py-2.5 rounded-xl bg-[#1E1E24] text-[#E5E1E7] text-[13px] font-semibold border border-[#232329]">
                  ← Back
                </button>
                <button onClick={() => setCurrentStep(4)} className="px-6 py-2.5 rounded-xl bg-[#C0F500] text-[#050508] text-[13px] font-bold hover:bg-[#D4FF33]">
                  Continue to Pricing →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PRICING */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#E5E1E7]">Step 4: Pricing Model</h2>
                <p className="text-[12px] text-[#5A5A68] font-mono mt-0.5">Select how buyers will acquire access to your listing.</p>
              </div>

              <div className="space-y-3 font-sans">
                {/* 1. Free */}
                <label
                  onClick={() => setPricingModel('free')}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    pricingModel === 'free' ? 'bg-[#C0F500]/10 border-[#C0F500]' : 'bg-[#0E0E12] border-[#232329]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={pricingModel === 'free'} onChange={() => {}} className="accent-[#C0F500]" />
                    <div>
                      <span className="text-[14px] font-bold text-[#E5E1E7] block">Free Community Tool</span>
                      <span className="text-[12px] text-[#8B8FA3]">100% open access for all platform builders.</span>
                    </div>
                  </div>
                  <span className="text-[#C0F500] font-mono font-bold text-sm">$0.00</span>
                </label>

                {/* 2. One-time purchase */}
                <div
                  onClick={() => setPricingModel('onetime')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    pricingModel === 'onetime' ? 'bg-[#C0F500]/10 border-[#C0F500]' : 'bg-[#0E0E12] border-[#232329]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={pricingModel === 'onetime'} onChange={() => {}} className="accent-[#C0F500]" />
                      <div>
                        <span className="text-[14px] font-bold text-[#E5E1E7] block">One-Time Lifetime Purchase</span>
                        <span className="text-[12px] text-[#8B8FA3]">Buyers pay once for lifetime access & downloads.</span>
                      </div>
                    </div>
                  </div>
                  {pricingModel === 'onetime' && (
                    <div className="pl-7 pt-2 flex items-center gap-2">
                      <span className="text-[13px] font-mono text-[#5A5A68]">$</span>
                      <input
                        type="number"
                        value={oneTimePrice}
                        onChange={e => setOneTimePrice(e.target.value)}
                        className="w-28 bg-[#131317] border border-[#232329] rounded-lg px-3 py-1.5 text-[14px] text-[#C0F500] font-mono focus:outline-none"
                      />
                      <span className="text-[11px] font-mono text-[#5A5A68]">USD (90% creator payout)</span>
                    </div>
                  )}
                </div>

                {/* 3. Subscription */}
                <div
                  onClick={() => setPricingModel('subscription')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    pricingModel === 'subscription' ? 'bg-[#C0F500]/10 border-[#C0F500]' : 'bg-[#0E0E12] border-[#232329]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={pricingModel === 'subscription'} onChange={() => {}} className="accent-[#C0F500]" />
                      <div>
                        <span className="text-[14px] font-bold text-[#E5E1E7] block">Recurring Subscription</span>
                        <span className="text-[12px] text-[#8B8FA3]">Recurring access for managed agents & hosted API nodes.</span>
                      </div>
                    </div>
                  </div>
                  {pricingModel === 'subscription' && (
                    <div className="pl-7 pt-2 flex items-center gap-2">
                      <span className="text-[13px] font-mono text-[#5A5A68]">$</span>
                      <input
                        type="number"
                        value={subPrice}
                        onChange={e => setSubPrice(e.target.value)}
                        className="w-28 bg-[#131317] border border-[#232329] rounded-lg px-3 py-1.5 text-[14px] text-[#00DAF3] font-mono focus:outline-none"
                      />
                      <span className="text-[12px] text-[#5A5A68]">/</span>
                      <select
                        value={subInterval}
                        onChange={e => setSubInterval(e.target.value)}
                        className="bg-[#131317] border border-[#232329] rounded-lg px-3 py-1.5 text-[12px] text-[#E5E1E7]"
                      >
                        <option value="month">month</option>
                        <option value="year">year</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 4. Freemium */}
                <div
                  onClick={() => setPricingModel('freemium')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    pricingModel === 'freemium' ? 'bg-[#C0F500]/10 border-[#C0F500]' : 'bg-[#0E0E12] border-[#232329]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={pricingModel === 'freemium'} onChange={() => {}} className="accent-[#C0F500]" />
                      <div>
                        <span className="text-[14px] font-bold text-[#E5E1E7] block">Free Tier + Pro Upgrade</span>
                        <span className="text-[12px] text-[#8B8FA3]">Offer a free basic tier with a paid Pro upgrade.</span>
                      </div>
                    </div>
                  </div>
                  {pricingModel === 'freemium' && (
                    <div className="pl-7 pt-2 space-y-3">
                      <textarea
                        value={freemiumDesc}
                        onChange={e => setFreemiumDesc(e.target.value)}
                        placeholder="Free tier features description..."
                        rows={2}
                        className="w-full bg-[#131317] border border-[#232329] rounded-lg p-2.5 text-[12px] text-[#8B8FA3] resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#8B8FA3]">Pro Tier Price: $</span>
                        <input
                          type="number"
                          value={proPrice}
                          onChange={e => setProPrice(e.target.value)}
                          className="w-24 bg-[#131317] border border-[#232329] rounded-lg px-3 py-1 text-[13px] text-[#C0F500] font-mono"
                        />
                        <span className="text-[11px] font-mono text-[#5A5A68]">/ month</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setCurrentStep(3)} className="px-5 py-2.5 rounded-xl bg-[#1E1E24] text-[#E5E1E7] text-[13px] font-semibold border border-[#232329]">
                  ← Back
                </button>
                <button onClick={() => setCurrentStep(5)} className="px-6 py-2.5 rounded-xl bg-[#C0F500] text-[#050508] text-[13px] font-bold hover:bg-[#D4FF33]">
                  Review Listing →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PUBLISH */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#E5E1E7]">Step 5: Review & Submit</h2>
                <p className="text-[12px] text-[#5A5A68] font-mono mt-0.5">Preview your listing card as it will appear in the marketplace.</p>
              </div>

              {/* Preview Card */}
              <div className="bg-[#0E0E12] border border-[#C0F500]/40 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C0F500]/20 text-[#C0F500]">
                      PREVIEW
                    </span>
                    <span className="text-[12px] font-mono text-[#00DAF3] capitalize">{category}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#C0F500]">
                    {pricingModel === 'free' ? 'FREE' : `$${oneTimePrice || subPrice}`}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#E5E1E7]">{title || 'Untitled Automation Listing'}</h3>
                  <p className="text-[13px] text-[#8B8FA3] leading-relaxed">{tagline || 'No tagline provided.'}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] pt-2 border-t border-[#1E1E24]">
                  {platformTags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#1E1E24] text-[#00DAF3]">{t}</span>
                  ))}
                  {skillTags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#1E1E24] text-[#C0F500]">{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setCurrentStep(4)} className="px-5 py-2.5 rounded-xl bg-[#1E1E24] text-[#E5E1E7] text-[13px] font-semibold border border-[#232329]">
                  ← Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 rounded-xl bg-[#C0F500] text-[#050508] text-[14px] font-bold hover:bg-[#D4FF33] transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                  🚀 Submit for Review
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
