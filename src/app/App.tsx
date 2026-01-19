import { useState, useRef, useEffect } from "react";
import { Smiley } from "./components/Smiley";
import { AddBalancePage } from "./components/AddBalancePage";
import { WishlistPage } from "./components/WishlistPage";
import { TransactionHistory } from "./components/TransactionHistory";
import { RulesPage } from "./components/RulesPage";
import { motion, AnimatePresence } from "motion/react";
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
    // Load balance from localStorage
    const saved = localStorage.getItem("gkb_balance");
    return saved ? Number(saved) : 1000;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load transactions from localStorage
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

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gkb_balance", balance.toString());
  }, [balance]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gkb_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Trigger confetti animation
  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // Haptic feedback simulation (will work on supported devices)
  const vibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleTongueSwipe = () => {
    // Open wishlist page (deduction)
    setShowWishlist(true);
    vibrate(10);
  };

  const handleFaceSwipe = () => {
    // Count swipes on face (excluding tongue)
    setFaceSwipeCount((prev) => {
      const newCount = prev + 1;
      
      if (newCount >= 3) {
        // Open add balance page after 3 swipes
        setShowAddBalance(true);
        vibrate([50, 50, 50]); // Success pattern
        return 0; // Reset counter
      } else {
        vibrate(10);
        
        // Reset counter after 2 seconds of inactivity
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
      // Add total gain to balance
      setBalance((prev) => prev + totalGain);
      
      // Add transaction to history
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "add",
        amount: totalGain,
        description: descriptions.join(", "),
        timestamp: Date.now()
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      
      // Trigger confetti animation
      triggerConfetti();
      
      vibrate([50, 50, 50]); // Success haptic pattern
      
      // Trigger tongue animation
      setTongueAnimationTrigger((prev) => prev + 1);
    }
    
    setShowAddBalance(false);
  };

  const handleAddBalanceCancel = () => {
    setShowAddBalance(false);
  };

  const handleWishlistClose = (totalCost: number, descriptions: string[]) => {
    if (totalCost > 0) {
      // Check if balance is sufficient
      if (balance < totalCost) {
        alert(`Недостаточно средств! Требуется: ${totalCost} KK, доступно: ${balance} KK`);
        return;
      }
      
      // Deduct total cost from balance
      setBalance((prev) => prev - totalCost);
      
      // Add transaction to history
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "deduct",
        amount: totalCost,
        description: descriptions.join(", "),
        timestamp: Date.now()
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      
      vibrate([50, 50, 50]); // Success haptic pattern
      
      // Trigger tongue animation
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
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-12 left-0 right-0 z-10"
      >
        <div className="flex items-center justify-between px-6">
          <button
            onClick={() => setShowMenu(true)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight">
              GKB
            </h1>
            <p className="text-sm text-white/80 font-medium mt-1">
              Grand Kuni Bank
            </p>
          </div>
          <div className="w-10" />
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center -mt-20">
        <Smiley
          balance={balance}
          tongueRef={tongueRef}
          onTongueSwipe={handleTongueSwipe}
          onFaceSwipe={handleFaceSwipe}
          tongueAnimationTrigger={tongueAnimationTrigger}
        />
      </div>

      {/* Swipe instruction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute top-[70%] left-0 right-0 text-center z-0 px-4"
      >
        <p className="text-white/60 text-sm font-medium drop-shadow-lg">
          Предъявите киску для списания Kuni-Coins
        </p>
        <p className="text-white/60 text-sm font-medium drop-shadow-lg mt-2">
          Предъявите ножки для начисления Kuni-Coins
        </p>
        {faceSwipeCount > 0 && (
          <p className="text-white/50 text-xs font-medium drop-shadow-lg mt-2">
            {faceSwipeCount}/3 свайпа
          </p>
        )}
      </motion.div>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-white/40 text-xs font-medium">
          Private Banking Experience
        </p>
      </motion.div>

      {/* Add Balance Page */}
      <AnimatePresence>
        {showAddBalance && (
          <AddBalancePage
            onClose={handleAddBalanceClose}
            onCancel={handleAddBalanceCancel}
          />
        )}
      </AnimatePresence>

      {/* Wishlist Page */}
      <AnimatePresence>
        {showWishlist && (
          <WishlistPage
            currentBalance={balance}
            onClose={handleWishlistClose}
            onCancel={handleWishlistCancel}
          />
        )}
      </AnimatePresence>

      {/* Transaction History Page */}
      <AnimatePresence>
        {showHistory && (
          <TransactionHistory
            transactions={transactions}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Rules Page */}
      <AnimatePresence>
        {showRules && (
          <RulesPage
            onClose={() => setShowRules(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50"
          >
            <div className="h-full flex flex-col p-6">
              {/* Menu header */}
              <div className="flex items-center justify-between mb-8 pt-6">
                <h2 className="text-3xl font-black text-white drop-shadow-lg">
                  Меню
                </h2>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Menu items */}
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
                    <span className="text-xl font-bold text-white">
                      История транзакций
                    </span>
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
                    <span className="text-xl font-bold text-white">
                      Свод правил
                    </span>
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