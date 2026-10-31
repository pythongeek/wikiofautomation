import React, { useState } from 'react';

export interface UserLicense {
  id: string;
  productName: string;
  type: string;
  icon: string;
  purchasedDate: string;
  expiresDate: string;
  licenseKey: string;
  status: 'Active' | 'Expired' | 'Suspended';
  downloadUrl: string;
}

export const LicenseManagement: React.FC = () => {
  const [licenses, setLicenses] = useState<UserLicense[]>([
    {
      id: 'lic-1',
      productName: 'Autonomous Dev OS (Docker + Open Interpreter)',
      type: 'Single Developer License',
      icon: '⚙️',
      purchasedDate: 'Aug 04, 2026',
      expiresDate: 'Lifetime Access',
      licenseKey: 'WOA-DEV-OS-8942-X109-7721',
      status: 'Active',
      downloadUrl: '/marketplace/ai-os/autonomous-dev-os',
    },
    {
      id: 'lic-2',
      productName: 'n8n Stripe Drip & Webhook Engine',
      type: 'Team License (5 Seats)',
      icon: '💳',
      purchasedDate: 'Jul 28, 2026',
      expiresDate: 'Renews Jul 28, 2027',
      licenseKey: 'WOA-N8N-STRIPE-4412-9901-B330',
      status: 'Active',
      downloadUrl: '/marketplace/workflows/n8n-stripe-drip-workflow',
    },
    {
      id: 'lic-3',
      productName: 'Inbox Triage Agent (LangGraph + n8n)',
      type: 'Open-Source Community License',
      icon: '⚡',
      purchasedDate: 'Jul 15, 2026',
      expiresDate: 'Never',
      licenseKey: 'WOA-FREE-AGENT-0012-7718-FF00',
      status: 'Active',
      downloadUrl: '/marketplace/agents/inbox-triage-agent',
    },
    {
      id: 'lic-4',
      productName: 'Claude 3.7 Sonnet Prompt Suite',
      type: 'Developer License',
      icon: '🧠',
      purchasedDate: 'Jun 10, 2026',
      expiresDate: 'Lifetime Access',
      licenseKey: 'WOA-CLAUDE-PROMPT-1102-4419-AA12',
      status: 'Active',
      downloadUrl: '/marketplace/prompts/claude-prompt-engineer',
    },
  ]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTransfer = (productName: string) => {
    const recipient = prompt(`Transfer license for "${productName}" to another developer email:`);
    if (recipient) {
      alert(`License transfer request initiated for ${recipient}. Confirmation email dispatched.`);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-16 font-sans text-white">
      {/* Header */}
      <div className="space-y-4 mb-10 pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase bg-[#00e3fd]/10 text-[#00e3fd] border border-[#00e3fd]/30">
          🔑 Active Software Entitlements
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">
          License & Keys Management
        </h1>

        <p className="text-sm text-[#9ca3af] font-mono max-w-2xl">
          View purchased workflow licenses, download deployment packages (.zip/.json), manage team seats, and transfer keys.
        </p>
      </div>

      {/* Licenses Table Container */}
      <div className="bg-[#131317] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
            <span>📦</span> Purchased Entitlements ({licenses.length})
          </h2>
          <span className="font-mono text-xs text-[#00e3fd]">● All Licenses Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-white/10 bg-[#0e0e12] text-[#9ca3af] uppercase font-mono text-xs">
                <th className="py-4 px-4">Product Name</th>
                <th className="py-4 px-4">License Type</th>
                <th className="py-4 px-4">License Key</th>
                <th className="py-4 px-4">Expires</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {licenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-[#1f1f23] transition-colors">
                  {/* Product */}
                  <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1f1f23] border border-white/10 flex items-center justify-center text-xl shrink-0">
                      {lic.icon}
                    </div>
                    <div>
                      <div className="text-white font-bold">{lic.productName}</div>
                      <div className="text-[10px] font-mono text-[#9ca3af]">Purchased {lic.purchasedDate}</div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 font-mono text-xs text-[#9ca3af]">{lic.type}</td>

                  {/* Key */}
                  <td className="py-4 px-4 font-mono text-xs">
                    <button
                      onClick={() => handleCopyKey(lic.licenseKey)}
                      className="px-2.5 py-1 bg-[#0e0e12] hover:bg-white/10 border border-white/10 rounded font-mono text-[11px] text-[#00e3fd] transition-colors flex items-center gap-1.5"
                      title="Click to copy license key"
                    >
                      <span>{lic.licenseKey}</span>
                      <span>{copiedKey === lic.licenseKey ? '✓ Copied' : '📋'}</span>
                    </button>
                  </td>

                  {/* Expires */}
                  <td className="py-4 px-4 font-mono text-xs text-white">{lic.expiresDate}</td>

                  {/* Status */}
                  <td className="py-4 px-4 font-mono text-xs text-[#00e3fd] font-bold">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00e3fd]/10 border border-[#00e3fd]/30">
                      <span className="w-2 h-2 rounded-full bg-[#00e3fd]"></span>
                      Active
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right font-mono space-x-2">
                    <a
                      href={lic.downloadUrl}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-lg text-xs transition-all shadow-sm"
                    >
                      <span>Download</span>
                    </a>
                    <button
                      onClick={() => handleTransfer(lic.productName)}
                      className="px-3 py-1.5 bg-[#1f1f23] hover:bg-white/10 text-white rounded-lg text-xs border border-white/10 transition-colors"
                    >
                      Transfer
                    </button>
                    <button
                      onClick={() => alert(`Managing settings for ${lic.productName}`)}
                      className="px-3 py-1.5 bg-[#1f1f23] hover:bg-white/10 text-[#9ca3af] hover:text-white rounded-lg text-xs border border-white/10 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
