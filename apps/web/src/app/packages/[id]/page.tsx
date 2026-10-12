"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowLeft, Download, Sparkles } from "lucide-react";
import packagesData from "@/contents/packages/packages.json";
import { fetchApi } from "@/lib/api";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export const runtime = 'edge';

export default function PackageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [contactSettings, setContactSettings] = useState<{
    office_address?: string;
    office_city?: string;
    whatsapp_number?: string;
    whatsapp_counter?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    fetchApi('/settings/contact')
      .then((res) => {
        if (res && res.success) {
          setContactSettings(res);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch contact settings:", err);
      });
  }, []);

  const fullAddress = useMemo(() => {
    if (contactSettings?.office_address) {
      if (
        contactSettings.office_city &&
        !contactSettings.office_address.toLowerCase().includes(contactSettings.office_city.toLowerCase())
      ) {
        return `${contactSettings.office_address}, ${contactSettings.office_city}`;
      }
      return contactSettings.office_address;
    }
    if (contactSettings?.office_city) {
      return contactSettings.office_city;
    }
    return "Gedung Office 8, SCBD, Jakarta Selatan";
  }, [contactSettings]);

  const phoneDisplay = contactSettings?.whatsapp_number || contactSettings?.whatsapp_counter || "+62 811 1234 5678";
  const emailDisplay = contactSettings?.email || "info@farha.id";
  const waLinkNumber = (contactSettings?.whatsapp_number || contactSettings?.whatsapp_counter || "6281234567890").replace(/\D/g, "");

  const allPackages = useMemo(() => [
    ...(packagesData.readyPackages || []),
    ...(packagesData.draftPackages || [])
  ], []);

  const pkg = allPackages.find((p: any) => p.id === id);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
        <h1 className="text-2xl font-bold mb-4">Paket Tidak Ditemukan</h1>
        <button onClick={() => router.back()} className="text-emerald-600 hover:underline">Kembali</button>
      </div>
    );
  }

  const leftItems = (pkg.includes || []).map((item: string) => ({ name: item, isIncluded: true }));
  const rightItems = (pkg.excludes || []).map((item: string) => ({ name: item, isIncluded: false }));

  const handleDownloadPdf = async () => {
    const elementId = "package-pdf-card";
    const safeName = (pkg.name || "Paket Umrah").replace(/[/\\?%*|"<>]/g, "");
    const filename = `${safeName}.pdf`;

    setIsDownloadingPdf(true);
    // Beri jeda sejenak agar UI bisa update menjadi loading
    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = document.getElementById(elementId);
    if (!element) {
      setIsDownloadingPdf(false);
      return;
    }

    // Cari tahu lebar asli tabel untuk menghindari kepotong di HP
    let targetWidth = element.scrollWidth;
    const innerTables = element.querySelectorAll('table');
    innerTables.forEach((t) => {
      if (t.scrollWidth + 100 > targetWidth) {
        targetWidth = t.scrollWidth + 100;
      }
    });
    // Paksa minimal lebar seperti desktop (1200px) agar layout tidak terhimpit
    targetWidth = Math.max(targetWidth, 1200);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: targetWidth,
        onclone: (clonedDoc) => {
          // Pastikan clone menggunakan light theme agar hasil cetak PDF bersih
          clonedDoc.documentElement.classList.remove('dark');

          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'max-content';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.width = targetWidth + 'px';
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.color = '#0f172a';

            // Allow horizontal tables & scroll containers to expand fully
            const scrollables = clonedElement.querySelectorAll('.overflow-x-auto, .overflow-auto, .overflow-y-auto');
            scrollables.forEach((el) => {
              (el as HTMLElement).style.overflow = 'visible';
              (el as HTMLElement).style.maxHeight = 'none';
              (el as HTMLElement).style.height = 'auto';
              (el as HTMLElement).style.width = '100%';
            });

            // Pastikan grid 2-kolom tetap side-by-side (Include & Exclude berdampingan)
            const gridSections = clonedElement.querySelectorAll('.pdf-grid-layout');
            gridSections.forEach((el) => {
              (el as HTMLElement).style.display = 'grid';
              (el as HTMLElement).style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
              (el as HTMLElement).style.gap = '1.5rem';
            });

            // Show logo & header on PDF
            const logoEl = clonedElement.querySelector('.pdf-logo');
            if (logoEl) {
              logoEl.classList.remove('hidden');
              logoEl.classList.add('flex');
            }

            // Show elements specific to PDF (like PDF footer note)
            const pdfOnlyEls = clonedElement.querySelectorAll('.pdf-only');
            pdfOnlyEls.forEach((el) => {
              (el as HTMLElement).classList.remove('hidden');
              (el as HTMLElement).classList.add('block');
            });

            // Hide UI elements not meant for PDF (such as download button, WhatsApp CTA card)
            const hideInPdf = clonedElement.querySelectorAll('.pdf-hide');
            hideInPdf.forEach((el) => {
              (el as HTMLElement).style.display = 'none';
            });
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Hitung tinggi proporsional terhadap lebar A4
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Pastikan muat dalam 1 halaman persis sesuai instruksi: "dalam 1 pages, file harus PDF"
      if (pdfHeight > pageHeight) {
        const scaleFactor = pageHeight / pdfHeight;
        const finalWidth = pdfWidth * scaleFactor;
        const finalHeight = pageHeight;
        const xOffset = (pdfWidth - finalWidth) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(filename);
    } catch (error: any) {
      console.error('Failed to generate PDF', error);
      alert("Gagal memproses PDF: " + (error?.message || error));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white">
      <Header />
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 xl:px-8 py-12">
        <Link href="/packages" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Daftar Paket
        </Link>

        <div
          id="package-pdf-card"
          className="bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl"
        >
          {/* PDF Header - Hidden in UI, visible in PDF */}
          <div className="pdf-logo hidden flex-col border-b border-slate-300 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <img src="/farha-logo-full.svg" alt="Farha Logo" className="h-12 w-auto object-contain object-left mb-3" />
                <p className="text-emerald-800 font-bold text-[15px] tracking-wide">Platform Land Arrangement Umrah</p>
              </div>
              <div className="text-right text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 text-sm">LA FARHA</p>
                <p>{fullAddress}</p>
                <p>Telp: {phoneDisplay}</p>
                <p>Email: {emailDisplay} | Web: lafarha.id</p>
              </div>
            </div>
          </div>

          {/* Package Details Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" /> Detail Paket Umrah
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">{pkg.name}</h1>
              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400">{pkg.desc}</p>
            </div>
            <div className="flex flex-col md:items-end gap-3 shrink-0">
              <div className="text-left md:text-right">
                <p className="text-xs md:text-sm text-slate-500 mb-1">Harga mulai dari</p>
                <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400">{pkg.priceString}</div>
                <p className="text-xs md:text-sm text-slate-500 mt-1">/ pax</p>
              </div>
              <div className="pdf-hide pt-1">
                <Button
                  disabled={isDownloadingPdf}
                  onClick={handleDownloadPdf}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl shadow-md hover:shadow-lg transition-all min-w-[170px]"
                >
                  {isDownloadingPdf ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Memproses PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF Paket</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Tables Include & Exclude (Side-by-side in 1 page) */}
          <div className="pdf-grid-layout mb-8 grid md:grid-cols-2 gap-6">

            {/* Table Include */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative bg-white dark:bg-[#111] h-fit overflow-hidden">
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 px-5 py-3 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm md:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Fasilitas Termasuk (Include)
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300">
                  {leftItems.length} Item
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {leftItems.map((item, i) => (
                      <tr key={`left-${i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="py-2.5 px-4 lg:px-5 text-slate-700 dark:text-slate-300 text-xs md:text-sm font-medium">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 lg:px-4 text-right whitespace-nowrap w-[1%]">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-bold tracking-wide">
                            <CheckCircle2 className="w-3.5 h-3.5" /> INCLUDE
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Exclude */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative bg-white dark:bg-[#111] h-fit overflow-hidden">
              <div className="bg-red-50/80 dark:bg-red-950/40 px-5 py-3 border-b border-red-100 dark:border-red-900/50 flex items-center justify-between">
                <span className="font-bold text-red-800 dark:text-red-300 text-sm md:text-base flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" /> Fasilitas Belum Termasuk (Exclude)
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-200/60 dark:bg-red-800/40 text-red-800 dark:text-red-300">
                  {rightItems.length} Item
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {rightItems.length > 0 ? (
                      rightItems.map((item, i) => (
                        <tr key={`right-${i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                          <td className="py-2.5 px-4 lg:px-5 text-slate-700 dark:text-slate-300 text-xs md:text-sm font-medium">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 lg:px-4 text-right whitespace-nowrap w-[1%]">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] md:text-xs font-bold tracking-wide">
                              <XCircle className="w-3.5 h-3.5" /> EXCLUDE
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-6 text-center text-slate-400 text-sm italic">
                          Tidak ada fasilitas yang dikecualikan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* PDF Footer Note - Hidden in UI, visible in PDF */}
          <div className="pdf-only hidden border-t border-slate-200 pt-4 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>* Syarat & ketentuan berlaku. Harga dan fasilitas dapat berubah sewaktu-waktu sesuai kebijakan maskapai dan hotel.</p>
              <p className="font-semibold text-emerald-800">LA FARHA</p>
            </div>
          </div>

          {/* Web WhatsApp CTA - Hidden in PDF */}
          <div className="pdf-hide bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-2xl flex flex-col items-center text-center border border-emerald-100 dark:border-emerald-800/50 mt-4">
            <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">Tertarik dengan paket ini?</h4>
            <p className="text-emerald-600 dark:text-emerald-500 mb-6">Hubungi admin kami untuk informasi lebih lanjut atau segera lakukan pemesanan.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <a
                href={`https://wa.me/${waLinkNumber}?text=Halo%20FARHA%2C%20saya%20tertarik%20dengan%20${encodeURIComponent(pkg.name)}%20seharga%20${encodeURIComponent(pkg.priceString)}.`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-base text-center"
              >
                Hubungi via WhatsApp
              </a>
              <Button
                variant="outline"
                disabled={isDownloadingPdf}
                onClick={handleDownloadPdf}
                className="px-8 py-3.5 h-auto border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50 font-bold rounded-xl shadow-md w-full sm:w-auto text-base"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Brosur PDF
              </Button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
