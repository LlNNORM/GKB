import { motion } from "framer-motion"; // было "motion/react" — исправил на правильный импорт
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
  { id: 14, text: "I'm going all in", baseCost: 100, emoji: "🎰", isAllIn: true },
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

  const totalCost = Array.from(selectedItems.entries()).reduce((sum, [_, amount]) => sum + amount, 0);

  const canAfford = totalCost <= currentBalance && totalCost > 0;
  const shortage = Math.max(0, totalCost - currentBalance);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isHolding && canAfford) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            setIsHolding(false);
            setTimeout(() => {
              const descriptions = Array.from(selectedItems.keys())
                .map(id => WISH_ITEMS.find(i => i.id === id)?.text || '')
                .filter(Boolean);
              onClose(totalCost, descriptions);
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
  }, [isHolding, canAfford, totalCost, selectedItems, onClose]);

  const toggleItem = (id: number) => {
    const item = WISH_ITEMS.find(i => i.id === id);
    if (!item) return;

    // Нельзя выбрать, если даже базовая стоимость превышает баланс
    if (!item.isAllIn && item.baseCost > currentBalance) {
      return;
    }

    setSelectedItems(prev => {
      const newMap = new Map(prev);
      if (newMap.has(id)) {
        newMap.delete(id);
      } else {
        let amount = item.baseCost;

        if (item.isAllIn) {
          amount = currentBalance;
        } else if (item.isVariable) {
          amount = variableAmounts.get(id) || item.baseCost;
        }

        if (amount > 0) {
          newMap.set(id, amount);
        }
      }
      return newMap;
    });
  };

  const updateVariableAmount = (id: number, delta: number) => {
    setVariableAmounts(prev => {
      const newMap = new Map(prev);
      const currentValue = newMap.get(id) || 1;
      const newValue = Math.max(1, currentValue + delta);
      newMap.set(id, newValue);

      // Автоматически выбираем позицию при изменении значения
      setSelectedItems(prevMap => {
        const updated = new Map(prevMap);
        if (newValue > 0) {
          updated.set(id, newValue);
        } else {
          updated.delete(id);
        }
        return updated;
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

        {/* Список желаний */}
        <div className="flex-1 overflow-y-auto px-6 pb-40">
          <div className="space-y-3">
            {WISH_ITEMS.map((item, index) => {
              const isUnaffordable = item.baseCost > currentBalance && !item.isAllIn;
              const isSelected = selectedItems.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    onClick={() => !isUnaffordable && toggleItem(item.id)}
                    className={`w-full p-4 rounded-2xl backdrop-blur-md transition-all ${
                      isUnaffordable
                        ? "opacity-50 cursor-not-allowed bg-white/10 border-white/20"
                        : isSelected
                        ? "bg-white/40 border-2 border-white shadow-xl scale-[1.02] cursor-pointer"
                        : "bg-white/20 border-2 border-white/30 shadow-lg hover:bg-white/25 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="flex-1 text-left">
                          <span className="text-white font-semibold">{item.text}</span>
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
                              onClick={e => {
                                e.stopPropagation();
                                if (!isUnaffordable) updateVariableAmount(item.id, -1);
                              }}
                              className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white font-bold transition-all disabled:opacity-40"
                              disabled={isUnaffordable}
                            >
                              −
                            </button>
                            <span className="text-white font-black text-lg min-w-[3rem] text-center">
                              {variableAmounts.get(item.id) || item.baseCost}
                            </span>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                if (!isUnaffordable) updateVariableAmount(item.id, 1);
                              }}
                              className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white font-bold transition-all disabled:opacity-40"
                              disabled={isUnaffordable}
                            >
                              +
                            </button>
                          </div>
                        ) : item.isAllIn ? (
                          <span className="text-white font-black text-lg">{currentBalance}</span>
                        ) : (
                          <span className="text-white font-black text-lg">{item.baseCost}</span>
                        )}
                        <span className="text-white/80 text-sm font-bold">KK</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Нижняя панель с кнопкой и сообщением */}
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black/40 to-transparent"
          >
            <div className="flex flex-col gap-3">
              {/* Сообщение о недостатке средств */}
              {!canAfford && totalCost > 0 && (
                <div className="bg-red-600/40 backdrop-blur-md rounded-xl p-3 text-center text-red-100 border border-red-400/30">
                  Не хватает <strong>{shortage.toFixed(1)} KK</strong> • Пополни баланс
                </div>
              )}

              {/* Кнопка "Повелевать" */}
              <div
                className={`relative h-16 rounded-full border-2 shadow-2xl overflow-hidden select-none ${
                  canAfford
                    ? "cursor-pointer bg-white/30 backdrop-blur-lg border-white/50"
                    : "cursor-not-allowed bg-gray-700/40 backdrop-blur-lg border-gray-500/40 opacity-70"
                }`}
                onTouchStart={() => canAfford && setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                onMouseDown={() => canAfford && setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
              >
                {canAfford && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400/80 to-green-600/80"
                    style={{
                      clipPath: `inset(0 ${50 - holdProgress / 2}% 0 ${50 - holdProgress / 2}%)`,
                    }}
                  />
                )}

                <div className="relative h-full flex items-center justify-center gap-2">
                  <span className="text-2xl">{canAfford ? "😈" : "😔"}</span>
                  <span className="text-xl font-black text-white drop-shadow-lg">
                    {canAfford ? "Повелевать" : "Недостаточно средств"}
                  </span>
                  {canAfford && (
                    <span className="text-lg font-bold text-white/90">
                      (−{totalCost.toFixed(1)} KK)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}