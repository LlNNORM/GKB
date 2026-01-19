import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";

interface SmileyProps {
  balance: number;
  tongueRef: React.RefObject<HTMLDivElement>;
  onTongueSwipe: () => void;
  onFaceSwipe: () => void;
  tongueAnimationTrigger: number;
}

export function Smiley({ balance, tongueRef, onTongueSwipe, onFaceSwipe, tongueAnimationTrigger }: SmileyProps) {
  const tongueControls = useAnimation();

  useEffect(() => {
    // Initial animation
    tongueControls.start({
      scaleY: 1,
      opacity: 1,
      transition: {
        delay: 1,
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    });
  }, [tongueControls]);

  useEffect(() => {
    if (tongueAnimationTrigger > 0) {
      // Disappear and reappear animation with updated balance
      tongueControls.start({
        scaleY: [1, 0],
        opacity: [1, 0],
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }).then(() => {
        tongueControls.start({
          scaleY: [0, 1],
          opacity: [0, 1],
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        });
      });
    }
  }, [tongueAnimationTrigger, tongueControls]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Smiley face container */}
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 120,
          duration: 0.8,
        }}
        className="relative"
      >
        {/* Face */}
        <div 
          className="relative w-64 h-64 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-2xl"
          onTouchStart={(e) => {
            e.currentTarget.dataset.startY = String(e.touches[0].clientY);
            e.currentTarget.dataset.swiped = "false";
          }}
          onTouchMove={(e) => {
            const startY = parseFloat(e.currentTarget.dataset.startY || "0");
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            const alreadySwiped = e.currentTarget.dataset.swiped === "true";

            if (deltaY > 50 && !alreadySwiped) {
              onFaceSwipe();
              e.currentTarget.dataset.swiped = "true";
            }
          }}
          onTouchEnd={(e) => {
            e.currentTarget.dataset.startY = "0";
            e.currentTarget.dataset.swiped = "false";
          }}
        >
          {/* Eyes */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="absolute top-16 left-12 w-8 h-12 bg-gray-800 rounded-full"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.65, type: "spring", stiffness: 200 }}
            className="absolute top-16 right-12 w-8 h-12 bg-gray-800 rounded-full"
          />

          {/* Eye shine */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute top-[4.5rem] left-[3.5rem] w-2 h-3 bg-white rounded-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute top-[4.5rem] right-[3.5rem] w-2 h-3 bg-white rounded-full"
          />

          {/* Mouth smile */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-8 border-b-8 border-gray-800 rounded-full"
          />

          {/* Tongue */}
          <motion.div
            ref={tongueRef}
            initial={{ scaleY: 0, originY: 0 }}
            animate={tongueControls}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-28 h-36 bg-gradient-to-b from-pink-400 to-pink-500 rounded-b-full shadow-xl cursor-pointer select-none touch-none z-20"
            style={{
              clipPath: "ellipse(50% 60% at 50% 40%)",
              originY: 0,
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.currentTarget.dataset.startY = String(e.touches[0].clientY);
              e.currentTarget.dataset.swiped = "false";
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
              const startY = parseFloat(e.currentTarget.dataset.startY || "0");
              const currentY = e.touches[0].clientY;
              const deltaY = currentY - startY;
              const alreadySwiped = e.currentTarget.dataset.swiped === "true";

              if (deltaY > 50 && !alreadySwiped) {
                onTongueSwipe();
                e.currentTarget.dataset.swiped = "true";
              }
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.currentTarget.dataset.startY = "0";
              e.currentTarget.dataset.swiped = "false";
            }}
          >
            {/* Balance display on tongue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <div className="text-4xl font-black text-white drop-shadow-lg">
                {balance}
              </div>
              <div className="text-sm font-bold text-pink-100 mt-1">KK</div>
            </motion.div>

            {/* Tongue texture */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/3 w-2 h-1 bg-pink-600 rounded-full" />
              <div className="absolute top-1/3 right-1/3 w-2 h-1 bg-pink-600 rounded-full" />
              <div className="absolute bottom-1/3 left-1/4 w-2 h-1 bg-pink-600 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Cheeks */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: 0.75, type: "spring" }}
          className="absolute top-28 -left-6 w-12 h-10 bg-pink-300 rounded-full blur-sm"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: 0.75, type: "spring" }}
          className="absolute top-28 -right-6 w-12 h-10 bg-pink-300 rounded-full blur-sm"
        />
      </motion.div>
    </div>
  );
}