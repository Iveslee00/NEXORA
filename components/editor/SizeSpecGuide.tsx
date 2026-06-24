'use client';

import { SIZE_SPEC_SECTIONS } from '@/lib/assets/sizeSpecTable';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function SizeSpecGuide({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">圖片尺寸規格</h2>
            <p className="mt-1 text-xs text-slate-500">商品模組圖片尺寸規格 v1.4</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-100"
            aria-label="關閉尺寸規格"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-7">
            {SIZE_SPEC_SECTIONS.map((section) => (
              <section key={section.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-100">{section.title}</h3>

                {section.description && section.description.length > 0 && (
                  <div className="space-y-1 text-xs leading-relaxed text-slate-400">
                    {section.description.map((text) => (
                      <p key={text}>{text}</p>
                    ))}
                  </div>
                )}

                {section.tables.map((table, tableIndex) => (
                  <div key={`${section.title}-${tableIndex}`} className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="min-w-full border-collapse text-left text-xs">
                      <thead className="bg-slate-900 text-slate-300">
                        <tr>
                          {table.headers.map((header) => (
                            <th key={header} className="whitespace-nowrap border-b border-slate-800 px-3 py-2 font-semibold">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {table.rows.map((row, rowIndex) => (
                          <tr key={`${section.title}-${tableIndex}-${rowIndex}`} className="odd:bg-slate-950 even:bg-slate-900/45">
                            {row.cells.map((cell, cellIndex) => (
                              <td key={`${cell}-${cellIndex}`} className="whitespace-nowrap px-3 py-2 leading-relaxed">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

                {section.notes.length > 0 && (
                  <ol className="space-y-1 pl-5 text-xs leading-relaxed text-slate-400">
                    {section.notes.map((note) => (
                      <li key={note} className="list-decimal">{note}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
