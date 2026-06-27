import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { getProjects, Project } from '../api';

const categories = ['All', 'Web App', 'Three.js / WebGL', 'AI & Automation'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setFilteredProjects(data);
      setIsLoading(false);
    });
  }, []);

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === category));
    }
  };

  return (
    <div className="py-12 bg-black">
      
      {/* Intro Header */}
      <section className="relative px-6 md:px-12 py-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
        >
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Selected Work
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl uppercase">
            OUR PORTFOLIO OF
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              CREATIVE BUILDS.
            </span>
          </h1>
          <p className="mt-8 text-neutral-400 leading-relaxed text-sm md:text-base max-w-2xl mx-auto font-light">
            We develop premium interfaces, high performance WebGL coordinates, and custom automated database applications.
          </p>
        </motion.div>
      </section>

      {/* Filter Tabs */}
      <section className="px-6 md:px-12 mb-12 flex justify-center">
        <div className="flex flex-wrap gap-2.5 rounded-2xl bg-white/[0.02] border border-white/5 p-1.5 backdrop-blur-md">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive 
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-12 py-6 mx-auto max-w-7xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[380px] rounded-2xl bg-white/[0.01] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  key={project.id || project._id}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group min-h-[460px]"
                >
                  
                  {/* Visual Screen */}
                  <div className="relative overflow-hidden h-[200px] border-b border-white/5 bg-slate-950">
                    <img 
                      src={project.thumbnail || (project as any).images?.[0]} 
                      alt={project.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
                    <span className="absolute top-4 left-4 rounded bg-cyan-500/90 text-black font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-1">
                      {project.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* Project Specs */}
                      <div className="grid grid-cols-2 gap-2 border-t border-white/5 py-3 mb-4 text-[10px]">
                        <div>
                          <span className="text-neutral-500 font-bold uppercase block">Budget</span>
                          <span className="text-neutral-300 font-medium">{project.budget}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-bold uppercase block">Timeline</span>
                          <span className="text-neutral-300 font-medium">{project.timeline}</span>
                        </div>
                      </div>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] font-semibold text-neutral-400">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[9px] text-neutral-500 font-semibold self-center ml-1">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Live Demo <FiExternalLink />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
                          >
                            Source <FiGithub />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

    </div>
  );
}
