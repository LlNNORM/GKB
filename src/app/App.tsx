import { useState, useRef, useEffect } from "react";
import { Smiley } from "./components/Smiley";
import { AddBalancePage } from "./components/AddBalancePage";
import { WishlistPage } from "./components/WishlistPage";
import { TransactionHistory } from "./components/TransactionHistory";
import { RulesPage } from "./components/RulesPage";
import { LoginPage } from "./components/LoginPage";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import confetti from "canvas-confetti";
import { Menu, X } from "lucide-react";
import { getBalance, updateBalance, addTransaction, getTransactions, subscribeToBalanceChanges, getCurrentUser, signOut } from "../lib/api";
import { supabase } from "../lib/api";

export interface Transaction {
  id: string;
  type: "add" | "deduct";
  amount: number;
  description: string;
  timestamp: number;
  created_at?: string; // Supabase поле
}

function App() {
  console.log('🔍 Проверка переменных:');
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('KEY exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  // Состояния
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(14);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [faceSwipeCount, setFaceSwipeCount] = useState(0);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openedFromMenu, setOpenedFromMenu] = useState(false);
  const [tongueAnimationTrigger, setTongueAnimationTrigger] = useState(0);
  const tongueRef = useRef<HTMLDivElement>(null);
  const faceSwipeTimerRef = useRef<NodeJS.Timeout>();

  // Drag controls
  const addBalanceDragControls = useDragControls();
  const wishlistDragControls = useDragControls();
  const historyDragControls = useDragControls();
  const rulesDragControls = useDragControls();
  const menuDragControls = useDragControls();
  const edgeThreshold = 80;

  // ==================== ЗАГРУЗКА ДАННЫХ ====================
  
const loadData = async () => {
    console.log("🔵 loadData: НАЧАЛО");
    console.log("🔵🔵🔵 loadData: ФУНКЦИЯ ВЫЗВАНА 🔵🔵🔵");
    console.log("🔵 loadData: проверка getBalance функции", typeof getBalance);
    try {
        console.log("🔵 loadData: вызываю getBalance...");
        const balanceData = await getBalance();
        console.log("🔵 loadData: баланс =", balanceData);
        setBalance(balanceData);
        
        console.log("🔵 loadData: вызываю getTransactions...");
        const transactionsData = await getTransactions();
        console.log("🔵 loadData: транзакции =", transactionsData.length);
        setTransactions(transactionsData);
    } catch (error) {
        console.error("🔴 loadData: ОШИБКА", error);
    }
};

useEffect(() => {
    let isMounted = true;  // ← Добавьте этот флаг
    
    const checkAuth = async () => {
        console.log("1. Starting auth check...");
        try {
            const user = await getCurrentUser();
            console.log("2. User from Supabase:", user);
            
            if (user && isMounted) {
                console.log("3. User found, setting authenticated...");
                setIsAuthenticated(true);
                console.log("4. Loading data...");
                await loadData();
                console.log("5. Data loaded successfully");
            } else if (isMounted) {
                console.log("3. No user found");
            }
        } catch (error) {
            console.error("Auth check error:", error);
        } finally {
            if (isMounted) {
                console.log("6. Setting isLoading to false");
                setIsLoading(false);
            }
        }
    };
    
    checkAuth();
    
    // Подписка на изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
            if (!isMounted) return;  // ← Добавьте эту проверку
            
            console.log("Auth event:", event, session?.user?.email);
            
            if (event === 'SIGNED_IN' && session?.user) {
                console.log("User signed in, loading data...");
                console.log("🧪 ПРЯМОЙ ТЕСТ Supabase...");
                try {
                    const testUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/global_balance?select=balance`;
                    console.log("🧪 URL запроса:", testUrl);
                    
                    const response = await fetch(testUrl, {
                        headers: {
                            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
                            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!}`
                        }
                    });
                    
                    console.log("🧪 Статус ответа:", response.status);
                    const data = await response.json();
                    console.log("🧪 Данные от Supabase:", data);
                } catch (err) {
                    console.error("🧪 Ошибка прямого теста:", err);
                }
                setIsAuthenticated(true);
                await loadData();
                setIsLoading(false);
            } else if (event === 'SIGNED_OUT' && isMounted) {
                console.log("User signed out");
                setIsAuthenticated(false);
                setBalance(1000);
                setTransactions([]);
                setIsLoading(false);
            }
        }
    );
    setTimeout(() => {
    if (isMounted && isLoading) {
        console.log("⚠️ FORCE: принудительно отключаем загрузку");
        setIsLoading(false);
    }
}, 5000);
    return () => {
        isMounted = false;  // ← Добавьте очистку флага
        subscription.unsubscribe();
    };
    
}, []);

  // ==================== ХЭЛПЕРЫ ====================

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

  const vibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  };

  // ==================== ОБРАБОТЧИКИ ====================

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
        if (faceSwipeTimerRef.current) clearTimeout(faceSwipeTimerRef.current);
        faceSwipeTimerRef.current = setTimeout(() => setFaceSwipeCount(0), 2000);
        return newCount;
      }
    });
  };

  const handleAddBalanceClose = async (totalGain: number, descriptions: string[]) => {
    if (totalGain > 0) {
      const newBalance = balance + totalGain;
      
      // Обновляем баланс в Supabase
      await updateBalance(newBalance);
      
      // Добавляем транзакцию
      await addTransaction("add", totalGain, descriptions.join(", "));
      
      // Обновляем локальное состояние
      setBalance(newBalance);
      
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

  const handleAddBalanceCancel = () => setShowAddBalance(false);

  const handleWishlistClose = async (totalCost: number, descriptions: string[]) => {
    if (totalCost > 0) {
      if (balance >= totalCost) {
        const newBalance = balance - totalCost;
        
        // Обновляем баланс в Supabase
        await updateBalance(newBalance);
        
        // Добавляем транзакцию
        await addTransaction("deduct", totalCost, descriptions.join(", "));
        
        // Обновляем локальное состояние
        setBalance(newBalance);
        
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
      } else {
        alert(`Недостаточно средств! Требуется: ${totalCost} KK, доступно: ${balance} KK`);
      }
    }
    setShowWishlist(false);
  };

  const handleWishlistCancel = () => setShowWishlist(false);

  const handleHistoryClose = () => {
    if (openedFromMenu) {
      setShowMenu(true);
      setOpenedFromMenu(false);
    }
    setShowHistory(false);
  };

  const handleRulesClose = () => {
    if (openedFromMenu) {
      setShowMenu(true);
      setOpenedFromMenu(false);
    }
    setShowRules(false);
  };

  const handleLogout = async () => {
    await signOut();
    setShowMenu(false);
  };

  useEffect(() => {
    return () => {
      if (faceSwipeTimerRef.current) clearTimeout(faceSwipeTimerRef.current);
    };
  }, []);

  const handleSwipeBack = (info: any, closeFn: () => void) => {
    const { offset, velocity } = info;
    if (offset.x > 120 && velocity.x > 0.4 || offset.x > 220) {
      closeFn();
    }
  };

  // ==================== ЗАГРУЗОЧНЫЙ ЭКРАН ====================
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-black text-white drop-shadow-lg mb-4">GKB</h1>
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  // ==================== ЭКРАН ВХОДА ====================
  
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => window.location.reload()} />;
  }

  // ==================== ОСНОВНОЙ ИНТЕРФЕЙС ====================
  
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
          <div className="w-13 h-13" />
          <div className="text-center flex-1">
            <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight">GKB</h1>
            <p className="text-xl text-white/80 font-medium mt-1">Grand Kuni Bank</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => setShowMenu(!showMenu)}
            className="relative z-50 w-15 h-15 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/35 transition-colors"
          >
            <motion.div
              animate={showMenu ? "open" : "closed"}
              variants={{ closed: { rotate: 0, scale: 1 }, open: { rotate: 90, scale: 1.1 } }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <Menu className="w-9 h-9 text-white" />
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
        className="absolute top-[72%] left-0 right-0 text-center z-0 px-4"
      >
        <p className="text-white/60 text-md font-medium drop-shadow-lg">
          ✨ Предъявите вашу киску 😼 для списания Kuni-Coins✨
        </p>
        <p className="text-white/60 text-md font-medium drop-shadow-lg mt-2">
          ✨ Предъявите ваши ножки 🐾 для начисления Kuni-Coins✨
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

      {/* Остальные модальные окна (без изменений) */}
      <AnimatePresence>
        {showAddBalance && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50"
            drag="x"
            dragControls={addBalanceDragControls}
            dragListener={false}
            dragConstraints={{ left: 0 }}
            dragElastic={{ left: 0.1, right: 0.4 }}
            onDragEnd={(_, info) => handleSwipeBack(info, handleAddBalanceCancel)}
            onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
              if (e.clientX <= edgeThreshold) addBalanceDragControls.start(e);
            }}
          >
            <AddBalancePage onClose={handleAddBalanceClose} onCancel={handleAddBalanceCancel} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWishlist && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50 flex flex-col"
            drag="x"
            dragControls={wishlistDragControls}
            dragListener={false}
            dragConstraints={{ left: 0 }}
            dragElastic={{ left: 0.1, right: 0.4 }}
            onDragEnd={(_, info) => handleSwipeBack(info, handleWishlistCancel)}
            onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
              if (e.clientX <= edgeThreshold) wishlistDragControls.start(e);
            }}
          >
            <WishlistPage currentBalance={balance} onClose={handleWishlistClose} onCancel={handleWishlistCancel} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50"
            drag="x"
            dragControls={historyDragControls}
            dragListener={false}
            dragConstraints={{ left: 0 }}
            dragElastic={{ left: 0.1, right: 0.4 }}
            onDragEnd={(_, info) => handleSwipeBack(info, handleHistoryClose)}
            onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
              if (e.clientX <= edgeThreshold) historyDragControls.start(e);
            }}
          >
            <TransactionHistory transactions={transactions} onClose={handleHistoryClose} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50"
            drag="x"
            dragControls={rulesDragControls}
            dragListener={false}
            dragConstraints={{ left: 0 }}
            dragElastic={{ left: 0.1, right: 0.4 }}
            onDragEnd={(_, info) => handleSwipeBack(info, handleRulesClose)}
            onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
              if (e.clientX <= edgeThreshold) rulesDragControls.start(e);
            }}
          >
            <RulesPage onClose={handleRulesClose} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Меню с кнопкой выхода */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 40, stiffness: 300 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50"
            drag="x"
            dragControls={menuDragControls}
            dragListener={false}
            dragConstraints={{ left: 0 }}
            dragElastic={{ left: 0.1, right: 0.4 }}
            onDragEnd={(_, info) => handleSwipeBack(info, () => setShowMenu(false))}
            onPointerDown={(e: React.PointerEvent<HTMLDivElement>) => {
              if (e.clientX <= edgeThreshold) menuDragControls.start(e);
            }}
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
                    setOpenedFromMenu(true);
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
                    setOpenedFromMenu(true);
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
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full p-5 rounded-2xl bg-red-500/50 backdrop-blur-md border-2 border-red-300/50 shadow-lg hover:bg-red-500/70 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🚪</span>
                    <span className="text-xl font-bold text-white">Выйти</span>
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