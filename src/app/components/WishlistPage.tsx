import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface WishItem {
  id: number;
  text: string;
  baseCost: number;
  emoji: string;
  isVariable?: boolean;
  isAllIn?: boolean;
  isFiatConversion?: boolean;
}

const WISH_ITEMS: WishItem[] = [
  { id: 1, text: "Дорогая, на завтрак блинчики", baseCost: 1, emoji: "🥞" },
  { id: 2, text: "Милый, посуда за тобой", baseCost: 0.5, emoji: "🧼" },
  { id: 3, text: "Дорогой, реши проблему", baseCost: 1, emoji: "🔧", isVariable: true },
  { id: 4, text: "Курьееееер, мамочка хочет есть", baseCost: 2, emoji: "🍕" },
  { id: 5, text: "Стирка на тебе, ма бой", baseCost: 0.5, emoji: "👕" },
  { id: 6, text: "Помни мои ножки", baseCost: 1, emoji: "👣" },
  { id: 7, text: "Спинка устала, нужно помять", baseCost: 2, emoji: "💆" },
  { id: 8, text: "Стань моим шеф-поваром", baseCost: 2, emoji: "👨‍🍳" },
  { id: 9, text: "Оу май, хочу нюдсов", baseCost: 2, emoji: "📸" },
  { id: 10, text: "Mystery gift", baseCost: 3, emoji: "🎁" },
  { id: 11, text: "What a gentleman you are", baseCost: 5, emoji: "🎩" },
  { id: 12, text: "Время собирать малый чемодан", baseCost: 100, emoji: "🧳" },
  { id: 13, text: "Время вырваться за границы", baseCost: 200, emoji: "✈️" },
  { id: 14, text: "I'm going all in", baseCost: 0, emoji: "🎰", isAllIn: true },
  { id: 15, text: "Fiat conversion time", baseCost: 1, emoji: "💰", isVariable: true, isFiatConversion: true },
];

interface WishlistPageProps {
  currentBalance: number;
  onClose: (totalCost: number, descriptions: string[]) => void;
  onCancel: () => void;
}

export function WishlistPage({ currentBalance, onClose, onCancel }: WishlistPageProps) {
  const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [variableAmounts, setVariableAmounts] = useState<Map<number, number>>(
    new Map([[3, 1], [15, 1]])
  );

  const totalCost = Array.from(selectedItems.entries()).reduce((sum, [id, amount]) => {
    return sum + amount;
  }, 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHolding && selectedItems.size > 0) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            setIsHolding(false);
            setTimeout(() => {
              onClose(totalCost, Array.from(selectedItems.keys()).map(id => WISH_ITEMS.find(i => i.id === id)?.text || ''));
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
  }, [isHolding, selectedItems.size, onClose, totalCost]);

  const toggleItem = (id: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(id)) {
        newMap.delete(id);
      } else {
        const item = WISH_ITEMS.find((i) => i.id === id);
        if (item) {
          if (item.isAllIn) {
            newMap.set(id, currentBalance);
          } else if (item.isVariable) {
            newMap.set(id, variableAmounts.get(id) || item.baseCost);
          } else {
            newMap.set(id, item.baseCost);
          }
        }
      }
      return newMap;
    });
  };

  const updateVariableAmount = (id: number, delta: number) => {
    setVariableAmounts((prev) => {
      const newMap = new Map(prev);
      const currentValue = newMap.get(id) || 1;
      const newValue = Math.max(1, currentValue + delta);
      newMap.set(id, newValue);
      
      // Auto-select item when changing value
      setSelectedItems((prevMap) => {
        const updatedMap = new Map(prevMap);
        updatedMap.set(id, newValue);
        return updatedMap;
      });
      
      return newMap;
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
              className="text-3xl font-black text-white drop-shadow-lg flex-1"
            >
              Чего желает мамочка?
            </motion.h1>
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="space-y-3">
            {WISH_ITEMS.map((item, index) => (
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-3xl">{item.emoji}</span>
                      <div className="flex-1 text-left">
                        <span className="text-white font-semibold">
                          {item.text}
                        </span>
                        {item.isFiatConversion && (
                          <div className="text-white/70 text-sm mt-1">
                            {(variableAmounts.get(item.id) || 1) * 500} ₽
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isVariable ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateVariableAmount(item.id, -1);
                            }}
                            className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white font-bold transition-all"
                          >
                            −
                          </button>
                          <span className="text-white font-black text-lg min-w-[3rem] text-center">
                            {variableAmounts.get(item.id) || item.baseCost}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateVariableAmount(item.id, 1);
                            }}
                            className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white font-bold transition-all"
                          >
                            +
                          </button>
                        </div>
                      ) : item.isAllIn ? (
                        <span className="text-white font-black text-lg">
                          {currentBalance}
                        </span>
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
                    Повелевать
                  </span>
                  <span className="text-lg font-bold text-white/90">
                    (−{totalCost} KK)
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