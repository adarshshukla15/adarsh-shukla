import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiAward, FiUsers, FiLinkedin, FiGithub, FiTwitter } from 'react-icons/fi';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import { getTeam } from '../api';

const timeline = [
  { 
    year: '2026', 
    title: 'Company Founded', 
    desc: 'A3 Web & Software Services was founded by Adarsh Shukla and Aditya Kumar to engineer high-performance custom software systems and premium websites.',
    isGlow: false
  },
  { 
    year: 'Next', 
    title: 'Future Milestones', 
    desc: 'Updated Soon',
    isGlow: true
  }
];

export default function About() {
  const [team, setTeam] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    getTeam().then((data) => {
      if (data) setTeam(data);
      setLoadingTeam(false);
    });
  }, []);

  return (
    <div className="py-12 bg-black">
      
      {/* Intro Hero */}
      <section className="relative px-6 md:px-12 py-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
        >
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            About A3 Agency
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl uppercase">
            WE ARE CREATORS OF
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              DIGITAL SYSTEMATICS.
            </span>
          </h1>
          <p className="mt-8 text-neutral-400 leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
            A3 Web & Software Services is a high-performance developer agency. We assemble custom systems, database pipelines, and visual interfaces built for absolute scalability.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 md:px-12 py-16 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-8 rounded-2xl flex gap-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FiTarget size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                To bridge the gap between creative visual designs and high-fidelity mathematical architectures. We build software that performs cleanly, scales automatically, and remains secure.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-8 rounded-2xl flex gap-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FiEye size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                To define the standard of next-generation digital products. We operate as technical co-pilots for our clients, structuring code bases that eliminate manual tasks and optimize customer growth.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-6 md:px-12 py-20 mx-auto max-w-7xl border-t border-white/5 relative">
        <div className="glow-cyan absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] opacity-10 pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-20 relative z-10">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Company Milestone
          </span>
          <h2 className="mt-3 text-3xl font-black text-white uppercase tracking-tight">
            OUR TIMELINE ROADMAP
          </h2>
        </div>

        {/* Timeline Grid */}
        <div className="relative border-l border-white/10 ml-4 md:ml-0 md:border-l-0 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:left-1/2 md:before:w-px md:before:bg-white/10">
          <div className="space-y-12">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  
                  {/* Timeline point */}
                  <div className="absolute left-[-25px] md:left-1/2 md:ml-[-8px] h-4 w-4 rounded-full bg-cyan-500 border-4 border-black z-10" />

                  {/* Left Side (Even) or Right Side (Odd) */}
                  <div className={`w-full md:w-[45%] pl-6 md:pl-0 ${isEven ? 'md:text-right' : 'md:order-2'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="glass-panel p-6 rounded-2xl text-left"
                    >
                      <span className="font-mono text-cyan-400 font-bold text-lg">{item.year}</span>
                      <h4 className="text-md font-bold text-white mt-1 uppercase tracking-wide">{item.title}</h4>
                      {item.isGlow ? (
                        <p 
                          className="text-xs font-black tracking-widest uppercase mt-3 text-cyan-400 animate-pulse select-none"
                          style={{
                            textShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)'
                          }}
                        >
                          {item.desc}
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-400 leading-relaxed font-light mt-3">{item.desc}</p>
                      )}
                    </motion.div>
                  </div>

                  {/* Dummy spacer for grid desktop styling */}
                  <div className="hidden md:block md:w-[45%]" />

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="px-6 md:px-12 py-20 mx-auto max-w-7xl border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
            Our Engineers & Designers
          </span>
          <h2 className="mt-3 text-3xl font-black text-white uppercase tracking-tight">
            MEET THE TEAM
          </h2>
          <p className="mt-4 text-xs md:text-sm text-neutral-400 font-light">
            The mathematical minds, creative architects, and system analysts engineering our high-performance CMS agency products.
          </p>
        </div>

        {loadingTeam ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[280px] rounded-2xl bg-white/[0.01] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                key={member.id || member._id || idx}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-300"
              >
                <div>
                  <div className="relative overflow-hidden h-[200px] rounded-xl border border-white/5 mb-5 bg-neutral-900 flex items-center justify-center">
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <FiUsers size={48} className="text-neutral-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{member.name}</h3>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mt-1">
                    {member.role}
                  </span>
                  <p className="text-xs text-neutral-400 mt-4 leading-relaxed font-light">
                    {member.bio}
                  </p>
                </div>

                {member.socialLinks && (
                  <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
                    {member.socialLinks.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                        <FiLinkedin size={15} />
                      </a>
                    )}
                    {member.socialLinks.github && (
                      <a href={member.socialLinks.github} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                        <FiGithub size={15} />
                      </a>
                    )}
                    {member.socialLinks.twitter && (
                      <a href={member.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                        <FiTwitter size={15} />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

    </div>
  );
}
