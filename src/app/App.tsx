import { useState, useRef, useEffect } from "react";
import { Smiley } from "./components/Smiley";
import { AddBalancePage } from "./components/AddBalancePage";
import { WishlistPage } from "./components/WishlistPage";
import { TransactionHistory } from "./components/TransactionHistory";
import { RulesPage } from "./components/RulesPage";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Menu, X } from "lucide-react";

export interface Transaction {
  id: string;
  type: "add" | "deduct";
  amount: number;
  description: string;
  timestamp: number;
}

function App() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("gkb_balance");
    return saved ? Number(saved) : 1000;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("gkb_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [faceSwipeCount, setFaceSwipeCount] = useState(0);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [tongueAnimationTrigger, setTongueAnimationTrigger] = useState(0);

  const tongueRef = useRef<HTMLDivElement>(null);
  const faceSwipeTimerRef = useRef<NodeJS.Timeout>();

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem("gkb_balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("gkb_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Конфетти
  const triggerConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Вибрация
  const vibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleTongueSwipe = () => {
    setShowWishlist(true);
    vibrate(10);
  };

  const handleFaceSwipe = () => {
    setFaceSwipeCount((prev) => {
      const newCount = prev + 1;

      if (newCount >= 3) {
        setShowAddBalance(true);
        vibrate([50, 50, 50]);
        return 0;
      } else {
        vibrate(10);

        if (faceSwipeTimerRef.current) {
          clearTimeout(faceSwipeTimerRef.current);
        }
        faceSwipeTimerRef.current = setTimeout(() => {
          setFaceSwipeCount(0);
        }, 2000);

        return newCount;
      }
    });
  };

  const handleAddBalanceClose = (totalGain: number, descriptions: string[]) => {
    if (totalGain > 0) {
      setBalance((prev) => prev + totalGain);

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "add",
        amount: totalGain,
        description: descriptions.join(", "),
        timestamp: Date.now(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      triggerConfetti();
      vibrate([50, 50, 50]);
      setTongueAnimationTrigger((prev) => prev + 1);
    }
    setShowAddBalance(false);
  };

  const handleAddBalanceCancel = () => {
    setShowAddBalance(false);
  };

  const handleWishlistClose = (totalCost: number, descriptions: string[]) => {
    if (totalCost > 0) {
      if (balance < totalCost) {
        alert(`Недостаточно средств! Требуется: ${totalCost} KK, доступно: ${balance} KK`);
        return;
      }

      setBalance((prev) => prev - totalCost);

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "deduct",
        amount: totalCost,
        description: descriptions.join(", "),
        timestamp: Date.now(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      vibrate([50, 50, 50]);
      setTongueAnimationTrigger((prev) => prev + 1);
    }
    setShowWishlist(false);
  };

  const handleWishlistCancel = () => {
    setShowWishlist(false);
  };

  useEffect(() => {
    return () => {
      if (faceSwipeTimerRef.current) {
        clearTimeout(faceSwipeTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Фоновые пятна */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full blur-3xl" />
      </div>

      {/* Шапка */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-12 left-0 right-0 z-10"
      >
        <div className="flex items-center justify-between px-6">
          {/* Пустое место слева для баланса */}
          <div className="w-13 h-13" />

          <div className="text-center flex-1">
            <h1 className="text-5xl font-black text-white drop-shadow-lg tracking-tight">GKB</h1>
            <p className="text-xl text-white/80 font-medium mt-1">Grand Kuni Bank</p>
          </div>

          {/* Бургер-меню справа */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => setShowMenu(!showMenu)}
            className="relative z-50 w-13 h-13 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/35 transition-colors"
          >
            <motion.div
              animate={showMenu ? "open" : "closed"}
              variants={{
                closed: { rotate: 0, scale: 1 },
                open: { rotate: 90, scale: 1.1 },
              }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {showMenu ? (
                <X className="w-7 h-7 text-white" />
              ) : (
                <Menu className="w-7 h-7 text-white" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Основной контент */}
      <div className="relative z-10 flex items-center justify-center -mt-20">
        <Smiley
          balance={balance}
          tongueRef={tongueRef}
          onTongueSwipe={handleTongueSwipe}
          onFaceSwipe={handleFaceSwipe}
          tongueAnimationTrigger={tongueAnimationTrigger}
        />
      </div>

      {/* Подсказки */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute top-[75%] left-0 right-0 text-center z-0 px-4"
      >
        <p className="text-white/60 text-md font-medium drop-shadow-lg">
          Предъявите киску для списания Kuni-Coins
        </p>
        <p className="text-white/60 text-md font-medium drop-shadow-lg mt-2">
          Предъявите ножки для начисления Kuni-Coins
        </p>
        {faceSwipeCount > 0 && (
          <p className="text-white/50 text-xs font-medium drop-shadow-lg mt-2">
            {faceSwipeCount}/3 свайпа
          </p>
        )}
      </motion.div>

      {/* Футер */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-white/40 text-sm font-medium">Private Banking Experience</p>
      </motion.div>

      {/* Модальные окна */}
      <AnimatePresence>
        {showAddBalance && (
          <AddBalancePage onClose={handleAddBalanceClose} onCancel={handleAddBalanceCancel} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWishlist && (
          <WishlistPage
            currentBalance={balance}
            onClose={handleWishlistClose}
            onCancel={handleWishlistCancel}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && <TransactionHistory transactions={transactions} onClose={() => setShowHistory(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showRules && <RulesPage onClose={() => setShowRules(false)} />}
      </AnimatePresence>

      {/* Боковое меню справа */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50"
          >
            <div className="h-full flex flex-col p-6">
              <div className="flex items-center justify-between mb-8 pt-6">
                <h2 className="text-3xl font-black text-white drop-shadow-lg">Меню</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMenu(false)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowMenu(false);
                    setShowHistory(true);
                  }}
                  className="w-full p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg hover:bg-white/30 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">📜</span>
                    <span className="text-xl font-bold text-white">История транзакций</span>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowMenu(false);
                    setShowRules(true);
                  }}
                  className="w-full p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg hover:bg-white/30 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">📋</span>
                    <span className="text-xl font-bold text-white">Свод правил</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;