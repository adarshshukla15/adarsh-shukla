import { motion } from 'framer-motion';
import { 
  SiReact, SiNextdotjs, SiTypescript, SiThreedotjs, 
  SiTailwindcss, SiNodedotjs, SiMongodb, SiCloudflare, 
  SiDocker, SiFramer, SiGreensock, SiVite 
} from 'react-icons/si';

const techs = [
  { name: 'React 19', icon: SiReact, color: 'text-cyan-400' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'text-white' },
  { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-400' },
  { name: 'Three.js', icon: SiThreedotjs, color: 'text-neutral-300' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-500' },
  { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500' },
  { name: 'MongoDB', icon: SiMongodb, color: 'text-emerald-500' },
  { name: 'Cloudflare', icon: SiCloudflare, color: 'text-orange-500' },
  { name: 'Docker', icon: SiDocker, color: 'text-blue-500' },
  { name: 'Framer Motion', icon: SiFramer, color: 'text-pink-500' },
  { name: 'GSAP', icon: SiGreensock, color: 'text-green-400' },
  { name: 'Vite', icon: SiVite, color: 'text-purple-400' }
];

export default function TrustedTechnologies() {
  // Duplicate list to achieve continuous seamless loop
  const list = [...techs, ...techs, ...techs];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-black/60 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 md:px-12 mb-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
          Integrated Toolchains & Stacks
        </span>
      </div>
      
      {/* Moving tape */}
      <div className="flex w-[200%] md:w-[150%] overflow-hidden relative">
        <div className="flex animate-marquee gap-8 items-center whitespace-nowrap">
          {list.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3 hover:border-cyan-500/20 transition-all duration-300 group"
              >
                <Icon className={`text-xl transition-transform duration-300 group-hover:scale-110 ${tech.color}`} />
                <span className="text-sm font-semibold tracking-wide text-neutral-300 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
