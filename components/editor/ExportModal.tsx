'use client';

import { useState } from 'react';
import { ExportedCode } from '@/types/modules';
import { copyToClipboard } from '@/lib/utils';
import { X, Copy, Check, Code2, Palette, FileCode2, Mail } from 'lucide-react';

type TopTab = 'campaign' | 'email';
type CampaignTab = 'html' | 'css';

interface Props {
  code: ExportedCode;
  emailHTML: string;
  initialTab: TopTab;
  onClose: () => void;
}

export function ExportModal({ code, emailHTML, initialTab, onClose }: Props) {
  const [topTab, setTopTab] = useState<TopTab>(initialTab);
  const [campaignTab, setCampaignTab] = useState<CampaignTab>('html');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const campaignCode = campaignTab === 'html' ? code.html : code.css;
  const campaignLineCount = campaignCode.split('\n').length;
  const emailLineCount = emailHTML.split('\n').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
              <FileCode2 size={16} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-slate-100 font-semibold text-base">Export Code</h2>
              <p className="text-slate-500 text-xs mt-0.5">Copy and paste into your CMS or project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Top-level tabs: 活動頁面 / 電子報 */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setTopTab('campaign')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 transition-colors ${
              topTab === 'campaign'
                ? 'bg-slate-800 border-slate-700 text-slate-100'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Code2 size={12} />
            活動頁面
          </button>
          <button
            onClick={() => setTopTab('email')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 transition-colors ${
              topTab === 'email'
                ? 'bg-slate-800 border-slate-700 text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Mail size={12} />
            電子報
          </button>
        </div>

        {topTab === 'campaign' ? (
          <>
            {/* Usage note */}
            <div className="px-6 py-3 bg-indigo-950/40 border-b border-slate-800">
              <p className="text-xs text-indigo-300/80 leading-relaxed">
                <strong className="text-indigo-300">How to use:</strong> Paste the <code className="bg-indigo-900/50 px-1 rounded">HTML</code> where your content goes, and add the <code className="bg-indigo-900/50 px-1 rounded">CSS</code> to your stylesheet or a <code className="bg-indigo-900/50 px-1 rounded">&lt;style&gt;</code> tag in <code className="bg-indigo-900/50 px-1 rounded">&lt;head&gt;</code>. All classes are prefixed with <code className="bg-indigo-900/50 px-1 rounded">cb-</code> to avoid conflicts.
              </p>
            </div>

            {/* Sub-tabs HTML / CSS + copy */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
              <div className="flex gap-1 bg-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setCampaignTab('html')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    campaignTab === 'html' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 size={14} />
                  HTML
                </button>
                <button
                  onClick={() => setCampaignTab('css')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    campaignTab === 'css' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Palette size={14} />
                  CSS
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{campaignLineCount} lines</span>
                <button
                  onClick={() => handleCopy(campaignTab, campaignCode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied === campaignTab ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {copied === campaignTab ? <><Check size={13} />Copied!</> : <><Copy size={13} />Copy {campaignTab.toUpperCase()}</>}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950 rounded-b-2xl">
              <pre className="p-5 text-xs leading-relaxed text-slate-300 font-mono whitespace-pre overflow-x-auto">
                <code>{campaignCode}</code>
              </pre>
            </div>
          </>
        ) : (
          <>
            {/* Email usage note */}
            <div className="px-6 py-3 bg-amber-950/30 border-b border-slate-800">
              <p className="text-xs text-amber-300/80 leading-relaxed">
                <strong className="text-amber-300">電子報 HTML：</strong>完整的 email 原始碼，可直接貼入 ESP（Mailchimp、SendGrid 等）的 HTML 編輯器或直接寄送。
              </p>
            </div>

            {/* Copy bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400" />
                <span className="text-sm font-medium text-slate-300">email.html</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{emailLineCount} lines</span>
                <button
                  onClick={() => handleCopy('email', emailHTML)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied === 'email' ? 'bg-emerald-600 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {copied === 'email' ? <><Check size={13} />Copied!</> : <><Copy size={13} />Copy HTML</>}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950 rounded-b-2xl">
              <pre className="p-5 text-xs leading-relaxed text-slate-300 font-mono whitespace-pre overflow-x-auto">
                <code>{emailHTML}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
