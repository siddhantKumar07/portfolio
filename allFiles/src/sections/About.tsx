import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Briefcase, Award } from 'lucide-react';

const stats = [
  { icon: Calendar, value: '1', label: 'Years Experience', suffix: '+' },
  { icon: Briefcase, value: '3', label: 'Projects Completed', suffix: '+' },
  { icon: Award, value: '100', label: 'Client Satisfaction', suffix: '%' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      className="relative min-h-screen py-20 bg-white dark:bg-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-400/8 dark:bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/8 dark:bg-cyan-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-indigo-950 dark:text-white">About </span>
            <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, #a855f7, transparent, #06b6d4, transparent)',
                  padding: '4px',
                }}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-black" />
              </motion.div>

              {/* Inner glowing ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-4 rounded-full"
                style={{
                  background: 'conic-gradient(from 180deg, #06b6d4, transparent, #ec4899, transparent, #06b6d4)',
                  padding: '3px',
                }}
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-black" />
              </motion.div>

              {/* Profile image container */}
              <div className="absolute inset-8 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 dark:from-gray-800 to-gray-100 dark:to-black">
                <motion.div
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.3), transparent)',
                      'radial-gradient(circle at 70% 70%, rgba(6, 182, 212, 0.3), transparent)',
                      'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.3), transparent)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0"
                />

                {/* Profile SVG */}
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  <defs>
                    <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1f2937" />
                      <stop offset="100%" stopColor="#111827" />
                    </linearGradient>
                    <linearGradient id="hoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#374151" />
                      <stop offset="100%" stopColor="#1f2937" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="150" cy="150" rx="100" ry="110" fill="url(#hoodGrad)" />
                  <ellipse cx="150" cy="160" rx="60" ry="70" fill="#000" opacity="0.5" />
                  <ellipse cx="125" cy="145" rx="12" ry="8" fill="#06b6d4" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="175" cy="145" rx="12" ry="8" fill="#06b6d4" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="150" cy="150" rx="100" ry="110" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.5" />
                </svg>
              </div>

              {/* Floating dots */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#a855f7' : '#06b6d4',
                    top: `${10 + i * 25}%`,
                    left: i < 2 ? '-10px' : 'auto',
                    right: i >= 2 ? '-10px' : 'auto',
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                I'm a Full-Stack Developer with 1 year of hands-on experience
                building fast, scalable, and responsive web applications using
                React.js, Node.js, Express, MongoDB, and PostgreSQL/MySQL.
                I specialize in creating secure RESTful APIs, implementing
                modern frontend interfaces, and managing full deployment
                pipelines using tools like Docker and Git.
              </p>
              <p>
                My skill set spans both frontend and backend development, with
                a strong focus on clean code, smooth user experiences, and
                animation-driven UI using libraries like Framer Motion. I'm
                passionate about solving real-world problems with practical,
                efficient, and user-centered solutions.
              </p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 dark:bg-white/5 border border-purple-100 dark:border-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3 group cursor-default shadow-sm dark:shadow-none"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <stat.icon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-indigo-950 dark:text-white">
                      {stat.value}
                      <span className="text-purple-500 dark:text-purple-400">{stat.suffix}</span>
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
