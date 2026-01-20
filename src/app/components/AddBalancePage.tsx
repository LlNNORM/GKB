import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface AddBalanceItem {
  id: number;
  text: string;
  baseCost: number;
  emoji: string;
  isVariable?: boolean;
}

const ADD_BALANCE_ITEMS: AddBalanceItem[] = [
  { id: 1, text: "Хотела просто приготовить, но опять шедевр", baseCost: 1, emoji: "👨‍🍳" },
  { id: 2, text: "Это не посуда - это зеркала", baseCost: 0.5, emoji: "✨" },
  { id: 3, text: "Загружаю барабан", baseCost: 0.5, emoji: "👕" },
  { id: 4, text: "Мистер Пропер снова звонил получить совет", baseCost: 1, emoji: "🧹" },
  { id: 5, text: "Откровение красоты момента", baseCost: 2, emoji: "📷" },
  { id: 6, text: "Восстанавливающие прикосновения нежных рук", baseCost: 2, emoji: "💆‍♂️" },
  { id: 7, text: "Кормлю демонов с рук", baseCost: 2, emoji: "😈" },
  { id: 8, text: "Я от тебя балдею,ты такой щедрый дядька", baseCost: 1, emoji: "😎", isVariable: true },
  { id: 9, text: "Mystery gift", baseCost: 3, emoji: "🎁" },
];

interface AddBalancePageProps {
  onClose: (totalGain: number, descriptions: string[]) => void;
  onCancel: () => void;
}

export function AddBalancePage({ onClose, onCancel }: AddBalancePageProps) {
  const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [variableAmount, setVariableAmount] = useState(1);

  const totalGain = Array.from(selectedItems.entries()).reduce((sum, [id, amount]) => {
    return sum + amount;
  }, 0);

  const onlyVariableSelected = selectedItems.size === 1 && selectedItems.has(8);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHolding && selectedItems.size > 0) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            setIsHolding(false);
            setTimeout(() => {
              onClose(totalGain, Array.from(selectedItems.keys()).map(key => ADD_BALANCE_ITEMS.find(item => item.id === key)?.text || ''));
            }, 200);
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
  }, [isHolding, selectedItems.size, onClose, totalGain]);

  const toggleItem = (id: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(id)) {
        newMap.delete(id);
      } else {
        const item = ADD_BALANCE_ITEMS.find((i) => i.id === id);
        if (item) {
          if (item.isVariable) {
            newMap.set(id, variableAmount);
          } else {
            newMap.set(id, item.baseCost);
          }
        }
      }
      return newMap;
    });
  };

  const updateVariableAmount = (delta: number) => {
    setVariableAmount((prev) => {
      const newAmount = Math.max(1, prev + delta);
      // Update selected if already selected, or auto-select if changed
      setSelectedItems((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(8, newAmount);
        return newMap;
      });
      return newAmount;
    });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 50, stiffness: 300 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black text-white drop-shadow-lg leading-tight flex-1"
            >
              За что пред богиней склоню колени я на этот раз?
            </motion.h1>
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="space-y-3">
            {ADD_BALANCE_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`w-full p-4 rounded-2xl backdrop-blur-md transition-all cursor-pointer ${
                    selectedItems.has(item.id)
                      ? "bg-white/40 border-2 border-white shadow-xl scale-[1.02]"
                      : "bg-white/20 border-2 border-white/30 shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-white font-semibold text-left">
                        {item.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isVariable ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateVariableAmount(-1);
                            }}
                            className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white font-bold transition-all"
                          >
                            −
                          </button>
                          <span className="text-white font-black text-lg min-w-[3rem] text-center">
                            {variableAmount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateVariableAmount(1);
                            }}
                            className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white font-bold transition-all"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="text-white font-black text-lg">
                          {item.baseCost}
                        </span>
                      )}
                      <span className="text-white/80 text-sm font-bold">KK</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Command button */}
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)]"
          >
            <div
              className="relative cursor-pointer select-none"
              onTouchStart={() => setIsHolding(true)}
              onTouchEnd={() => setIsHolding(false)}
              onMouseDown={() => setIsHolding(true)}
              onMouseUp={() => setIsHolding(false)}
              onMouseLeave={() => setIsHolding(false)}
            >
              {/* Base button */}
              <div className="relative h-16 rounded-full bg-white/30 backdrop-blur-lg border-2 border-white/50 shadow-2xl overflow-hidden">
                {/* Fill progress from center */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/80 to-green-500/80"
                  style={{
                    clipPath: `inset(0 ${50 - holdProgress / 2}% 0 ${
                      50 - holdProgress / 2
                    }%)`,
                  }}
                />

                {/* Button content */}
                <div className="relative h-full flex items-center justify-center gap-2">
                  <span className="text-2xl">😈</span>
                  <span className="text-xl font-black text-white drop-shadow-lg">
                    {onlyVariableSelected ? "Каааааайф" : "На колени"}
                  </span>
                  <span className="text-lg font-bold text-white/90">
                    (+{totalGain} KK)
                  </span>
                </div>
              </div>

              {/* Pulse effect */}
              {isHolding && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.1, opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-green-400"
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}