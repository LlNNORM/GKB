import { motion } from "motion/react";
import { useState } from "react";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const translateError = (errorMessage: string): string => {
    const errorMap: Record<string, string> = {
      "Invalid login credentials": "Неверный email или пароль",
      "User already registered": "Пользователь с таким email уже зарегистрирован",
      "Email not confirmed": "Email не подтвержден. Проверьте почту или отключите подтверждение в настройках Supabase",
      "Password should be at least 6 characters": "Пароль должен содержать минимум 6 символов",
      "Unable to validate email address: invalid format": "Неверный формат email",
      "Signup requires a valid password": "Введите корректный пароль",
      "User not found": "Пользователь не найден",
      "Email rate limit exceeded": "Превышен лимит отправки писем. Попробуйте позже",
      "Failed to fetch": "Ошибка соединения. Проверьте интернет-подключение",
      "Network request failed": "Ошибка сети. Проверьте подключение к интернету",
      "Invalid email": "Неверный формат email",
      "Weak password": "Слишком простой пароль. Используйте минимум 6 символов",
      "Database error": "Ошибка базы данных. Попробуйте позже",
      "Invalid password": "Неверный пароль",
    };

    // Проверяем точное совпадение
    if (errorMap[errorMessage]) {
      return errorMap[errorMessage];
    }

    // Проверяем частичное совпадение
    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return `Ошибка: ${errorMessage}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { signUp, signIn } = await import("../../lib/api");

      if (isSignUp) {
        if (!name.trim()) {
          setError("Пожалуйста, введите имя");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Пароль должен содержать минимум 6 символов");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Пароли не совпадают");
          setLoading(false);
          return;
        }

        const signUpResult = await signUp(email, password, name);

        // Check if email confirmation is required
        if (
          signUpResult.user &&
          !signUpResult.user.email_confirmed_at &&
          signUpResult.user.identities?.length === 0
        ) {
          setSuccessMessage(
            "Проверьте вашу почту! Мы отправили письмо для подтверждения email. После подтверждения войдите в приложение."
          );
          setLoading(false);
          return;
        }

        // Try to sign in
        try {
          await signIn(email, password);
          onLogin();
        } catch (signInError: any) {
          if (signInError.message.includes("Email not confirmed")) {
            setSuccessMessage(
              "Регистрация успешна! Проверьте почту для подтверждения email, затем войдите в приложение."
            );
          } else {
            throw signInError;
          }
        }
      } else {
        await signIn(email, password);
        onLogin();
      }
    } catch (err: any) {
      const translatedError = translateError(
        err.message || "Ошибка авторизации"
      );
      setError(translatedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-5xl font-black text-white drop-shadow-lg mb-2"
          >
            GKB
          </motion.h1>
          <p className="text-white/80 text-sm font-medium">
            Grand Kuni Bank
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/30 shadow-2xl"
        >
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError("");
                setSuccessMessage("");
                setPassword("");
                setConfirmPassword("");
              }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isSignUp
                  ? "bg-white text-purple-600 shadow-lg"
                  : "bg-white/10 text-white"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError("");
                setSuccessMessage("");
                setPassword("");
                setConfirmPassword("");
              }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isSignUp
                  ? "bg-white text-purple-600 shadow-lg"
                  : "bg-white/10 text-white"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isSignUp && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 backdrop-blur-md border border-red-300 text-white px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 backdrop-blur-md border border-green-300 text-white px-4 py-3 rounded-xl text-sm leading-relaxed"
              >
                {successMessage}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isSignUp ? "Зарегистрироваться" : "Войти"}
                </>
              )}
            </button>
          </form>

          {isSignUp && !successMessage && (
            <div className="mt-4 text-center">
              <p className="text-white/60 text-xs leading-relaxed">
                После регистрации проверьте почту для подтверждения email
              </p>
              <p className="text-white/40 text-xs mt-2 leading-relaxed">
                💡 Чтобы отключить подтверждение email, см. файл SUPABASE_SETUP.md
              </p>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/40 text-xs text-center mt-6"
        >
          Private Banking Experience
        </motion.p>
      </motion.div>
    </div>
  );
}
