import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ConfirmationCircleProps {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationCircle({
  amount,
  onConfirm,
  onCancel,
}: ConfirmationCircleProps) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            setIsHolding(false);
            setIsPopping(true);
            setTimeout(() => {
              onConfirm();
            }, 300);
            return 100;
          }
          return next;
        });
      }, 20);
    } else {
      setHoldProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHolding, onConfirm]);

  const handleTouchStart = () => {
    setIsHolding(true);
  };

  const handleTouchEnd = () => {
    if (holdProgress < 100) {
      setIsHolding(false);
      setHoldProgress(0);
    }
  };

  if (isPopping) {
    return (
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2"
      >
        <div className="w-24 h-24 rounded-full bg-green-400/30 backdrop-blur-sm" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="relative w-24 h-24 cursor-pointer select-none">
        {/* Base circle */}
        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-lg shadow-xl border-2 border-white/40" />

        {/* Fill progress */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-green-300/90 to-green-400/90"
            style={{
              clipPath: `inset(${100 - holdProgress}% 0 0 0)`,
            }}
            animate={{
              clipPath: `inset(${100 - holdProgress}% 0 0 0)`,
            }}
            transition={{ duration: 0.02 }}
          />
        </div>

        {/* Amount text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: isHolding ? 1.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-center"
          >
            <div className="text-2xl font-black text-white drop-shadow-lg">
              −{amount}
            </div>
            <div className="text-xs font-bold text-white/90 mt-0.5">KK</div>
          </motion.div>
        </div>

        {/* Outer ring pulse */}
        {isHolding && (
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-green-300"
          />
        )}

        {/* Instruction hint */}
        {!isHolding && holdProgress === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white/70 font-medium drop-shadow-lg"
          >
            Hold to confirm
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}