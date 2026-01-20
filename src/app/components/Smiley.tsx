import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { easeInOut } from "framer-motion";

interface SmileyProps {
  balance: number;
  tongueRef: React.RefObject<HTMLDivElement>;
  onTongueSwipe: () => void;
  onFaceSwipe: () => void;
  tongueAnimationTrigger: number;
}

export function Smiley({
  balance,
  tongueRef,
  onTongueSwipe,
  onFaceSwipe,
  tongueAnimationTrigger,
}: SmileyProps) {
  const tongueControls = useAnimation();
  const [isTongueVisible, setIsTongueVisible] = useState(false);

  const idleBreathing = {
    scaleY: [1, 1.08, 1],
    transition: {
      duration: 1.7,
      ease: easeInOut,
      repeat: Infinity,
    },
  };

  // Первое появление языка
  useEffect(() => {
    tongueControls
      .start({
        scaleY: 1,
        opacity: 1,
        transition: {
          delay: 1,
          type: "spring",
          stiffness: 150,
          damping: 12,
        },
      })
      .then(() => {
        setIsTongueVisible(true); // ← язык появился → разрешаем показывать баланс
        tongueControls.start(idleBreathing);
      });
  }, [tongueControls]);

  // Перезапуск анимации при tongueAnimationTrigger
  useEffect(() => {
    if (tongueAnimationTrigger > 0) {
      setIsTongueVisible(false); // скрываем баланс перед анимацией исчезновения

      tongueControls
        .start({
          scaleY: [1, 0],
          opacity: [1, 0],
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        })
        .then(() => {
          tongueControls
            .start({
              scaleY: [0, 1],
              opacity: [0, 1],
              transition: {
                duration: 0.3,
                ease: "easeInOut",
              },
            })
            .then(() => {
              setIsTongueVisible(true); // язык снова появился → показываем баланс
              tongueControls.start(idleBreathing);
            });
        });
    }
  }, [tongueAnimationTrigger, tongueControls]);

  return (
    <div className="relative flex items-center justify-center">
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
          className="relative w-70 h-70 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full shadow-2xl touch-none overscroll-contain select-none"
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
            className="absolute top-16 left-14 w-11 h-14 bg-gray-800 rounded-full"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.65, type: "spring", stiffness: 200 }}
            className="absolute top-16 right-14 w-11 h-14 bg-gray-800 rounded-full"
          />

          {/* Eye shine */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute top-[4.5rem] left-[4.5rem] w-4 h-5 bg-white rounded-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute top-[4.5rem] right-[4.5rem] w-4 h-5 bg-white rounded-full"
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
            className="absolute -bottom-18 left-1/2 -translate-x-1/2 w-30 h-38 bg-gradient-to-b from-pink-400 to-pink-500 rounded-b-full shadow-xl cursor-pointer select-none touch-none z-20"
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
            {/* Tongue texture */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/3 w-2 h-1 bg-pink-600 rounded-full" />
              <div className="absolute top-1/3 right-1/3 w-2 h-1 bg-pink-600 rounded-full" />
              <div className="absolute bottom-1/3 left-1/4 w-2 h-1 bg-pink-600 rounded-full" />
            </div>
          </motion.div>

          {/* Balance display — появляется только после языка */}
          {isTongueVisible && (
            <motion.div
              className="absolute -bottom-18 left-1/2 -translate-x-1/2 w-30 z-30 pointer-events-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            >
              <div className="relative h-38 flex flex-col items-center justify-center text-center">
                <div className="text-4xl font-black text-white drop-shadow-lg">
                  {balance}
                </div>
                <div className="text-lg font-bold text-pink-100">KK</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Cheeks */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: 0.75, type: "spring" }}
          className="absolute top-33 left-2 w-20 h-12 bg-pink-300 rounded-full blur-md"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: 0.75, type: "spring" }}
          className="absolute top-33 right-2 w-20 h-12 bg-pink-300 rounded-full blur-md"
        />
      </motion.div>
    </div>
  );
}