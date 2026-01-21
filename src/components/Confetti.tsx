import { motion } from 'framer-motion';

export default function Confetti() {
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const pieces = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: '50vw',
            y: '50vh',
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: [0, 1, 1, 0],
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: 'easeOut',
            delay: Math.random() * 0.5,
          }}
          style={{
            position: 'absolute',
            width: 10 + Math.random() * 10,
            height: 10 + Math.random() * 10,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
}
