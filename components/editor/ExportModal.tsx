'use client';

import { useState } from 'react';
import { ExportedCode } from '@/types/modules';
import { copyToClipboard } from '@/lib/utils';
import { generateCampaignPackage } from '@/lib/export/packageGenerator';
import { X, Copy, Check, Code2, Palette, FileCode2, Mail, Package, Download } from 'lucide-react';

type TopTab = 'campaign' | 'package' | 'email';
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
  const [packageInfo, setPackageInfo] = useState<{ fileCount: number; remoteImages: string[] } | null>(null);

  const handleCopy = async (key: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleDownloadPackage = () => {
    const result = generateCampaignPackage(code.html, code.css);
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'campaign-page.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setPackageInfo({ fileCount: result.fileCount, remoteImages: result.remoteImages });
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
              <h2 className="text-slate-100 font-semibold text-base">匯出</h2>
              <p className="text-slate-500 text-xs mt-0.5">以貼碼使用為主，ZIP 為整包交付備用</p>
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
            貼碼使用
          </button>
          <button
            onClick={() => setTopTab('package')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 transition-colors ${
              topTab === 'package'
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Package size={12} />
            ZIP
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
                <strong className="text-indigo-300">貼碼使用：</strong>複製 HTML 到內容區，再把 CSS 加到樣式表或頁面 head 的 style 標籤。所有 class 都使用 <code className="bg-indigo-900/50 px-1 rounded">cb-</code> 前綴，降低和既有網站衝突的機率。
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
                <span className="text-xs text-slate-500">{campaignLineCount} 行</span>
                <button
                  onClick={() => handleCopy(campaignTab, campaignCode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied === campaignTab ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {copied === campaignTab ? <><Check size={13} />已複製</> : <><Copy size={13} />複製 {campaignTab.toUpperCase()}</>}
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950 rounded-b-2xl">
              <pre className="p-5 text-xs leading-relaxed text-slate-300 font-mono whitespace-pre overflow-x-auto">
                <code>{campaignCode}</code>
              </pre>
            </div>
          </>
        ) : topTab === 'package' ? (
          <>
            <div className="px-6 py-3 bg-emerald-950/30 border-b border-slate-800">
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                <strong className="text-emerald-300">ZIP 大包：</strong>下載後可上傳到支援 ZIP 匯入的 CMS 或後台系統。內含 <code className="bg-emerald-900/50 px-1 rounded">index.html</code>、<code className="bg-emerald-900/50 px-1 rounded">css/style.css</code>、<code className="bg-emerald-900/50 px-1 rounded">js/campaign.js</code>，以及上傳圖片用的 <code className="bg-emerald-900/50 px-1 rounded">images/</code>。
              </p>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-slate-950 rounded-b-2xl">
              <div className="p-6 space-y-5">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">campaign-page.zip</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        適合需要整包上傳的頁面交付流程。只要在各模組圖片欄位按「上傳」，圖片就會在匯出時自動放入 ZIP 的 images 資料夾。
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadPackage}
                      className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                    >
                      <Download size={14} />
                      下載 ZIP
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 text-xs text-slate-400 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                    <p className="font-semibold text-slate-300">包內結構</p>
                    <pre className="mt-3 whitespace-pre text-slate-500">{`index.html
css/style.css
js/campaign.js
images/`}</pre>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                    <p className="font-semibold text-slate-300">圖片處理</p>
                    <p className="mt-3 leading-relaxed">
                      上傳圖片會打包進 images。外部圖片網址會保留原網址，因為瀏覽器通常不能直接抓取其他網站圖片檔。
                    </p>
                  </div>
                </div>

                {packageInfo && (
                  <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-4 text-xs">
                    <p className="font-semibold text-emerald-300">ZIP 已建立，內含 {packageInfo.fileCount} 個檔案。</p>
                    {packageInfo.remoteImages.length > 0 && (
                      <div className="mt-3">
                        <p className="text-amber-300">以下外部圖片網址未放入 images，請確認目標系統可讀取：</p>
                        <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto text-slate-400">
                          {packageInfo.remoteImages.map((url) => (
                            <li key={url} className="truncate">{url}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                <span className="text-xs text-slate-500">{emailLineCount} 行</span>
                <button
                  onClick={() => handleCopy('email', emailHTML)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied === 'email' ? 'bg-emerald-600 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {copied === 'email' ? <><Check size={13} />已複製</> : <><Copy size={13} />複製 HTML</>}
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
