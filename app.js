import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Filler);

// --- Data ---
const engineData = {
  sales: {
    title: "Mötes-AI",
    description: "Transkriberar, sammanfattar och agerar på varje säljsamtal – så ert team kan fokusera på att stänga affärer, inte på administration.",
    chartData: {
      labels: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'],
      values: [12, 19, 15, 25, 22, 30]
    },
    chartType: 'line'
  },
  marketing: {
    title: "Innehålls-AI",
    description: "Omvandlar ett enda blogginlägg eller en podcast till en hel månads innehåll för sociala medier. Sluta skapa från grunden, börja skala smart.",
    chartData: {
      labels: ['Annons 1', 'Annons 2', 'Annons 3', 'Annons 4'],
      values: [4, 7, 5, 9]
    },
    chartType: 'bar'
  },
    leadership: {
    title: "Briefing-AI",
    description: "Skannar era interna kanaler varje morgon och levererar en knivskarp 3-punkts sammanfattning av dagens viktigaste händelser, risker och möjligheter.",
    chartData: {
      labels: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'],
      values: [8, 6, 9, 7, 10]
    },
    chartType: 'line'
  }
};

// --- Three.js Background Component ---
function Starfield(props) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5001), { radius: 1.5 }));
  
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 30;
  });
  
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#D5FF00"
          size={0.004}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// --- Chart Component ---
const EngineChart = ({ type, data }) => {
    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { display: false, beginAtZero: true },
            x: { display: false }
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    }), []);

    const chartData = {
        labels: data.labels,
        datasets: [{
            data: data.values,
            backgroundColor: type === 'bar' ? '#D5FF00' : 'rgba(213, 255, 0, 0.2)',
            borderColor: '#D5FF00',
            fill: type === 'line',
            tension: 0.4,
            borderWidth: 1.5,
            borderRadius: 4
        }]
    };
    
    if (type === 'line') return <Line options={chartOptions} data={chartData} />;
    return <Bar options={chartOptions} data={chartData} />;
};

// --- Main App Component ---
export default function App() {
  const mainRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const horizontalSection = horizontalRef.current;
    const panels = gsap.utils.toArray(".panel", horizontalSection);

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalSection,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + horizontalSection.offsetWidth,
      },
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

  }, []);

  return (
    <div className="bg-[#0A0A0A] text-[#EAEAEA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <canvas id="webgl" className="fixed top-0 left-0 -z-10"></canvas>
       <Canvas camera={{ position: [0, 0, 1] }} className="fixed top-0 left-0 -z-10">
          <Starfield />
      </Canvas>
      
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white tracking-tighter" style={{fontFamily: "'Manrope', sans-serif"}}>aimotorer.se</h2>
          <a href="#boka" className="border-2 border-white text-white font-bold py-2 px-6 rounded-full text-sm sm:text-base transition-all duration-300 hover:bg-white hover:text-black">
            Boka Samtal
          </a>
        </div>
      </header>
      
      <main ref={mainRef}>
        <section className="h-screen flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-5xl md:text-8xl font-extrabold text-white leading-tight tracking-tighter" style={{fontFamily: "'Manrope', sans-serif"}}>
            Bygg system.<br />Inte bara <span className="text-[#D5FF00]">program</span>.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300 mt-8">
            Vi installerar skräddarsydda AI-motorer som frigör ert företags fulla potential.
          </p>
        </section>

        <section className="py-20 md:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter" style={{fontFamily: "'Manrope', sans-serif"}}>
              Standardverktyg har nått sin gräns.
            </h2>
            <p className="text-lg text-gray-400 mt-6">
              Manuella processer, gissningsbaserad marknadsföring och rigida system är inte längre hållbart. Framtiden tillhör företag som äger sin egen intelligens.
            </p>
          </div>
        </section>
        
        <section ref={horizontalRef} className="h-screen overflow-hidden">
            <div className="horizontal-scroll-section flex w-[300vw]">
                <div className="panel flex justify-center items-center flex-col text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter" style={{fontFamily: "'Manrope', sans-serif"}}>Lösningen: En AI-Motor.</h2>
                    <p className="text-gray-400 mt-4 text-lg">Scrolla för att utforska →</p>
                </div>
                
                {Object.entries(engineData).map(([key, engine]) => (
                    <div key={key} className="panel">
                        <div className="w-full max-w-4xl mx-auto p-8 flex flex-col md:flex-row gap-8 items-center">
                           <div className="md:w-1/2">
                              <h3 className="text-4xl font-bold text-white" style={{fontFamily: "'Manrope', sans-serif"}}>{engine.title}</h3>
                              <p className="text-gray-300 mt-4">{engine.description}</p>
                           </div>
                           <div className="md:w-1/2 h-64 w-full">
                              <EngineChart type={engine.chartType} data={engine.chartData} />
                           </div>
                        </div>
                    </div>
                ))}

            </div>
        </section>
        
        <section className="py-20 md:py-40 px-6">
             <div className="text-center mb-20">
                <p className="font-semibold text-gray-400">PROCESSEN</p>
                <h2 className="text-4xl md:text-6xl font-bold text-white mt-2 tracking-tighter" style={{fontFamily: "'Manrope', sans-serif"}}>Från idé till autonomi på 14 dagar.</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-16">
                 <div className="process-step text-center">
                    <h3 className="text-3xl font-bold text-[#D5FF00]">1. Diagnos</h3>
                    <p className="text-gray-300 mt-2">Ett 15-minuters samtal där vi identifierar er största operativa flaskhals.</p>
                </div>
                <div className="process-step text-center">
                    <h3 className="text-3xl font-bold text-[#D5FF00]">2. Bygge</h3>
                    <p className="text-gray-300 mt-2">Vårt team bygger, tränar och integrerar er skräddarsydda AI-Motor.</p>
                </div>
                <div className="process-step text-center">
                    <h3 className="text-3xl font-bold text-[#D5FF00]">3. Resultat</h3>
                    <p className="text-gray-300 mt-2">Vi levererar ett autonomt system som omedelbart börjar spara tid och öka er effektivitet.</p>
                </div>
            </div>
        </section>

         <section id="boka" className="py-20 md:py-32 text-center px-6">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter" style={{fontFamily: "'Manrope', sans-serif"}}>Redo att installera er framtid?</h2>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">Boka ett kostnadsfritt strategisamtal. Inga säljpitchar. Bara en konkret plan för hur AI kan transformera er verksamhet.</p>
            <a href="mailto:mehdi.fortas@playpace.info?subject=Intresserad av en AI-Motor" className="cta-button mt-10 inline-block border-2 border-[#D5FF00] text-[#D5FF00] font-bold py-4 px-10 rounded-full text-lg">
                Boka ditt samtal
            </a>
        </section>

        <footer className="border-t border-gray-800/50 mt-20">
            <div className="container mx-auto px-6 py-8 text-center text-gray-400">
                <p>&copy; 2025 aimotorer.se | En del av PlayPace Brand & Business Services AB.</p>
                <p className="text-sm mt-2">Vi bygger autonoma system som ger er kontrollen tillbaka.</p>
            </div>
        </footer>
      </main>
    </div>
  );
}
