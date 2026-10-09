"use client";

import React from "react";

import images from "../../../contents/gallery/gallery.json";

export default function GallerySection() {
  return (
    <section id="galeri" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-left">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
          Momen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8C96C]">Perjalanan</span>
        </h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
          Setiap langkah di Tanah Suci adalah cerita. Berikut adalah beberapa momen indah bersama para jamaah.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .expandable-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 12px;
          height: 80vh;
          min-height: 600px;
          transition: grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                      grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .expandable-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(6, 1fr);
            height: 120vh;
          }
          .expandable-grid:has(.m-col-1:hover) { grid-template-columns: 2.5fr 1fr; }
          .expandable-grid:has(.m-col-2:hover) { grid-template-columns: 1fr 2.5fr; }
          
          .expandable-grid:has(.m-row-1:hover) { grid-template-rows: 2.5fr 1fr 1fr 1fr 1fr 1fr; }
          .expandable-grid:has(.m-row-2:hover) { grid-template-rows: 1fr 2.5fr 1fr 1fr 1fr 1fr; }
          .expandable-grid:has(.m-row-3:hover) { grid-template-rows: 1fr 1fr 2.5fr 1fr 1fr 1fr; }
          .expandable-grid:has(.m-row-4:hover) { grid-template-rows: 1fr 1fr 1fr 2.5fr 1fr 1fr; }
          .expandable-grid:has(.m-row-5:hover) { grid-template-rows: 1fr 1fr 1fr 1fr 2.5fr 1fr; }
          .expandable-grid:has(.m-row-6:hover) { grid-template-rows: 1fr 1fr 1fr 1fr 1fr 2.5fr; }
        }

        @media (min-width: 769px) {
          .expandable-grid:has(.col-1:hover) { grid-template-columns: 2.5fr 1fr 1fr 1fr; }
          .expandable-grid:has(.col-2:hover) { grid-template-columns: 1fr 2.5fr 1fr 1fr; }
          .expandable-grid:has(.col-3:hover) { grid-template-columns: 1fr 1fr 2.5fr 1fr; }
          .expandable-grid:has(.col-4:hover) { grid-template-columns: 1fr 1fr 1fr 2.5fr; }

          .expandable-grid:has(.row-1:hover) { grid-template-rows: 2.5fr 1fr 1fr; }
          .expandable-grid:has(.row-2:hover) { grid-template-rows: 1fr 2.5fr 1fr; }
          .expandable-grid:has(.row-3:hover) { grid-template-rows: 1fr 1fr 2.5fr; }
        }

        .grid-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .grid-item:hover img {
          transform: scale(1.05);
        }

        /* Overlay */
        .grid-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .grid-item:hover::after {
          opacity: 1;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="expandable-grid">
          {images.map((src, index) => {
            // Calculate column and row for desktop (4 cols, 3 rows)
            const col = (index % 4) + 1;
            const row = Math.floor(index / 4) + 1;
            
            // Calculate column and row for mobile (2 cols, 6 rows)
            const mCol = (index % 2) + 1;
            const mRow = Math.floor(index / 2) + 1;
            
            return (
              <div 
                key={index} 
                className={`grid-item col-${col} row-${row} m-col-${mCol} m-row-${mRow}`}
              >
                <img src={src} alt={`Momen ${index + 1}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
