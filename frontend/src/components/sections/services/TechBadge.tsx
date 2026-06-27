import { motion } from 'framer-motion';

interface TechBadgeProps {
  name: string;
}

export default function TechBadge({ name }: TechBadgeProps) {
  return (
    <motion.span
      whileHover={{
        y: -1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        color: '#ffffff'
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 12 }}
      className="inline-flex items-center px-3 py-1 text-[10px] font-medium text-neutral-400 bg-white/[0.02] border border-white/5 rounded-md cursor-default select-none tracking-wider transition-all duration-350"
    >
      {name}
    </motion.span>
  );
}
