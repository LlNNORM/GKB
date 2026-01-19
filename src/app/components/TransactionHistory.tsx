import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { Transaction } from "../App";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClose: () => void;
}

export function TransactionHistory({ transactions, onClose }: TransactionHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-50 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="pt-12 pb-6 px-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black text-white drop-shadow-lg flex-1"
            >
              Все ходы записаны:
            </motion.h1>
          </div>
        </div>

        {/* Transactions list */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-white/60 text-lg text-center">
                История транзакций пуста
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">
                          {transaction.type === "add" ? "📈" : "📉"}
                        </span>
                        <span
                          className={`text-lg font-black ${
                            transaction.type === "add"
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {transaction.type === "add" ? "+" : "−"}
                          {transaction.amount} KK
                        </span>
                      </div>
                      <p className="text-white/90 text-sm font-medium mb-2">
                        {transaction.description}
                      </p>
                      <p className="text-white/60 text-xs">
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
