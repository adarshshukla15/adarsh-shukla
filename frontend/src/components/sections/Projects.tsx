import { useProjects } from '../../hooks/useProjects';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiArrowRight } from 'react-icons/fi';

export default function ProjectsSection() {
  const { projects, loading: isLoading, error, refetch } = useProjects();

  return (
    <section className="relative py-24 px-6 md:px-12 bg-black">
      {/* Soft overlay grids */}
      <div className="animated-grid absolute inset-0 z-0 opacity-[0.01] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
              Selected Creations
            </span>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              FEATURED PROJECTS.
            </h2>
            <p className="mt-4 text-neutral-400 leading-relaxed text-sm md:text-base">
              Explore custom systems, full-stack hubs, and real-time dashboards designed and engineered by our team.
            </p>
          </div>
          <Link to="/projects" className="group text-sm font-semibold tracking-wide text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 self-start md:self-auto">
            View All Projects <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Projects Layout */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center w-full">
            <div className="rounded-full bg-red-500/10 border border-red-500/20 p-4 text-red-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
            <p className="text-sm text-neutral-400 max-w-sm mb-6">
              There was a problem loading the featured projects. Please check your internet or retry below.
            </p>
            <button
              onClick={refetch}
              className="rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10"
            >
              Retry Connection
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="h-[400px] rounded-3xl bg-white/[0.01] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center w-full relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-indigo-500/5 opacity-30 animate-pulse pointer-events-none" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 animate-bounce">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Updated Soon
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight md:text-3xl uppercase">
                New Creations In Progress
              </h3>
              <p className="mt-3 text-neutral-400 max-w-md mx-auto text-sm leading-relaxed">
                We are currently building advanced digital products and refreshing our portfolio. Check back shortly to see our latest engineering work.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-24">
            {projects.slice(0, 3).map((project, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1.0, ease: 'easeOut' }}
                  key={project.id || project._id || idx}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}
                >
                  
                  {/* Text details */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                      {project.category}
                    </span>
                    <h3 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                      {project.title}
                    </h3>
                    
                    <p className="mt-6 text-sm text-neutral-400 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Metadata Grid */}
                    <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-500">Client</span>
                        <p className="text-sm font-semibold text-neutral-300 mt-1">{project.client}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-500">Timeline</span>
                        <p className="text-sm font-semibold text-neutral-300 mt-1">{project.timeline}</p>
                      </div>
                    </div>

                    {/* Technology tags */}
                    <div className="mt-8 flex flex-wrap gap-2">
                      {project.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="rounded-md bg-white/5 border border-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Project Links */}
                    <div className="mt-8 flex items-center gap-6">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          Live Demo <FiExternalLink />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
                        >
                          Source Code <FiGithub />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Browser Mockup */}
                  <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl transition-all duration-500 hover:border-cyan-500/20">
                      
                      {/* Browser top-bar */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/5 bg-black/40 rounded-t-xl mb-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <div className="mx-auto w-[60%] rounded-md bg-white/5 py-0.5 text-center text-[9px] text-neutral-500 font-mono select-none truncate">
                          {project.liveUrl || 'https://a3.agency'}
                        </div>
                      </div>

                      {/* Browser Screen */}
                      <div className="relative h-[250px] sm:h-[350px] w-full overflow-hidden rounded-b-lg">
                        <img 
                          src={project.thumbnail || (project as any).images?.[0]} 
                          alt={project.title} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
