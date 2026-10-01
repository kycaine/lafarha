const fs = require('fs');
const file = 'src/app/components/home/ProductSection.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace state and logic for infinite loop
const oldLogicStart = 'export default function ProductSection() {';
const oldLogicEnd = 'const displayProducts = [...PRODUCTS, ...PRODUCTS];';

const newLogic = `export default function ProductSection() {
  const [currentIndex, setCurrentIndex] = useState(PRODUCTS.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };
  
  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(PRODUCTS.length);
    } else if (currentIndex >= PRODUCTS.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(PRODUCTS.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const displayProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS];`;

content = content.replace(
  content.substring(content.indexOf(oldLogicStart), content.indexOf(oldLogicEnd) + oldLogicEnd.length),
  newLogic
);

// 2. Replace CSS for slider track
const oldCss = `.slider-track {
            display: flex;
            transition: transform 0.5s ease-in-out;
            transform: translateX(calc(var(--current-index) * -100%));
          }`;

const newCss = `.slider-track {
            display: flex;
            transition: var(--transition, transform 0.5s ease-in-out);
            transform: translateX(calc(var(--current-index) * -100%));
          }`;
content = content.replace(oldCss, newCss);

// 3. Update track div to use onTransitionEnd and CSS var
const oldTrack = `<div className="overflow-hidden relative w-full" style={{ '--current-index': currentIndex } as any}>
            <div className="slider-track">`;
const newTrack = `<div className="overflow-hidden relative w-full" style={{ 
            '--current-index': currentIndex,
            '--transition': isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
          } as any}>
            <div className="slider-track" onTransitionEnd={handleTransitionEnd}>`;
content = content.replace(oldTrack, newTrack);

// 4. Update Arrows
const oldArrows = `{/* Controls */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white rounded-full shadow-lg text-slate-800 hover:scale-110 transition-transform border border-slate-100 hidden sm:flex">
             <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white rounded-full shadow-lg text-slate-800 hover:scale-110 transition-transform border border-slate-100 hidden sm:flex">
             <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>`;

const newArrows = `{/* Controls */}
          <button onClick={prevSlide} className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-2xl hover:bg-[#C9A84C] hover:scale-110 transition-all hidden sm:flex">
             <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <button onClick={nextSlide} className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-2xl hover:bg-[#C9A84C] hover:scale-110 transition-all hidden sm:flex">
             <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>`;
content = content.replace(oldArrows, newArrows);

// 5. Update Card styles (remove shadow, add border)
const oldCard = `className="group relative rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden cursor-default h-full"`;
const newCard = `className="group relative rounded-2xl border-2 border-slate-200 bg-white overflow-hidden cursor-default h-full hover:border-[#C9A84C] transition-colors"`;
content = content.replace(oldCard, newCard);

fs.writeFileSync(file, content);
console.log('done');
