import React, { useState } from "react";
import { CalendarDays } from "lucide-react";

export interface CatalogModuleProps {
  srvId: string;
  mod: any;
  i: number;
  moduleSpecs: Record<string, any>;
  updateModuleSpec: (srvId: string, field: string, value: any) => void;
  genericData?: Record<string, any>;
  updateGenericData?: (srvId: string, field: string, value: any) => void;
}

export function SearchableSelect({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: any[], placeholder: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = options.flatMap((group: any) =>
    group.options.filter((opt: any) => opt.label.toLowerCase().includes(query.toLowerCase()))
  );

  const selectedOpt = options.flatMap((g: any) => g.options).find((o: any) => o.value === value);

  return (
    <div className="relative">
      <input
        type="text"
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10"
        value={value}
        onChange={() => { }}
        required
        onFocus={() => setIsOpen(true)}
      />
      <div
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white dark:border-slate-800 dark:bg-slate-950 cursor-pointer focus:ring-2 focus:ring-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOpt ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <span className="text-slate-400 text-xs">▼</span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1a1a1a] shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100">
            <input
              type="text"
              className="w-full rounded-md bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm outline-none mb-2 focus:ring-2 focus:ring-emerald-500 transition-shadow"
              placeholder="Cari Paket Layanan..."
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filtered.map((opt: any) => (
                <div
                  key={opt.value}
                  className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${value === opt.value
                    ? "bg-emerald-500 text-white font-semibold"
                    : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  {opt.label}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-slate-500">Tidak ditemukan.</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function DatePickerNative({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const formatDate = (d: string) => {
    if (!d) return "Pilih Tanggal...";
    const date = new Date(d);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if ("showPicker" in e.currentTarget) {
      (e.currentTarget as HTMLInputElement).showPicker();
    }
  };

  return (
    <div className="relative h-10 w-full group">
      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors pointer-events-none z-10" />

      <div className="absolute inset-0 pl-10 pr-3 flex items-center text-sm border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 pointer-events-none group-focus-within:ring-2 group-focus-within:ring-emerald-500">
        <span className={value ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-500"}>
          {formatDate(value)}
        </span>
      </div>

      <input
        type="date"
        onClick={handleDateClick}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
        required
      />
    </div>
  );
}
