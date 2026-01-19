import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

interface RulesPageProps {
  onClose: () => void;
}

export function RulesPage({ onClose }: RulesPageProps) {
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
              className="text-2xl font-black text-white drop-shadow-lg flex-1 leading-tight"
            >
              Официальный свод правил системы «KUNI-COINS»
            </motion.h1>
          </div>
        </div>

        {/* Rules content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <div className="space-y-6 text-white/90">
            {/* Преамбула */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-3">Преамбула</h2>
              <p className="text-sm leading-relaxed">
                KUNI-COINS (КК) — приватная валюта взаимного внимания и заботы,
                действующая на территории отношений между Иваном и Алиной. Цель
                системы — создать игровую, тёплую экономику маленьких жестов,
                которая добавляет игривости и изюминки в их отношения.
              </p>
            </motion.section>

            {/* Общие правила */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-3">
                Общие правила и финансовая политика
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-white">1. Эмиссия:</p>
                  <p className="leading-relaxed">
                    Только Иван-Банк имеет право начислять КК. Но
                    Алина-Держатель коинсов может вносить предложения, требовать
                    выплаты и вести отчет. Банк оставляет право на бонусные
                    начисления.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    2. «Сгораемые» КК в Банке:
                  </p>
                  <p className="leading-relaxed">
                    Да, копим до 20. Это «резервный фонд» Банка, которым он может
                    оперировать для спонтанных бонусов или покрытия кризисных
                    ситуаций. Раз в 111 дней фонд обнуляется или превращается в
                    особый приз.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    3. Инфляция/дефляция:
                  </p>
                  <p className="leading-relaxed">
                    Курс и стоимость активностей могут гибко меняться по взаимному
                    согласию в зависимости от настроения и сложности выполнения.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Обеспечение валюты */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-3">
                4. Обеспечение и базовая ценность валюты
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-white">4.1.</p>
                  <p className="leading-relaxed">
                    1КК (KUNI-COIN) обеспечен одним качественно исполненным актом
                    кунилингуса. Данное соотношение является незыблемым,
                    фундаментальным и обеспечивает устойчивую внутреннюю ценность
                    валюты KUNI-COINS.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">4.2.</p>
                  <p className="leading-relaxed">
                    Держатель КК имеет право в любой момент потребовать обмен КК на
                    основной гарант ценности валюты. Эмитент (Иван-Банк) не имеет
                    права отказать в этом, сославшись на занятость, усталость,
                    погоду, ретроградный Меркурий или иных метафизических явлений,
                    за исключением случаев, прямо указанных в секции 7 настоящего
                    Свода правил.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Начисление КК */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-3">
                5. Начисление КК
              </h2>
              <div className="space-y-2 text-sm">
                <p>«Хотела просто приготовить, но опять шедевр» — 1 КК</p>
                <p>«Это не посуда - это зеркала» — 0,5 КК</p>
                <p>«Загружаю барабан» — 0,5 КК</p>
                <p>«Мистер Пропер снова звонил получить совет» — 1 КК</p>
                <p>«Откровение красоты момента» — 2 КК</p>
                <p>«Восстанавливающие прикосновения нежных рук» — 2 КК</p>
                <p>«Кормлю демонов с рук» — 2 КК</p>
                <p>«Я от тебя балдею,ты такой щедрый дядька» — X КК*</p>
                <p>✨Mystery gift✨ — 3 КК</p>
              </div>
            </motion.section>

            {/* Конвертация */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-3">
                6. Конвертация и альтернативные курсы
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-white mb-2">
                    6.1. Фиатная конвертация:
                  </p>
                  <p className="leading-relaxed">
                    KUNI-COINS могут быть переконвертированы в российские рубли по
                    фиксированному курсу:
                  </p>
                  <p className="text-center text-lg font-bold text-white my-2">
                    1 КК = 500 ₽
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">
                    6.2. Нематериальные бенефиты:
                  </p>
                  <p className="mb-2">
                    Для обмена на бытовые и сервисные услуги устанавливаются
                    следующие курсы:
                  </p>
                  <div className="space-y-1">
                    <p>«Дорогая, на завтрак блинчики» — 1 КК</p>
                    <p>«Милый, посуда за тобой» — 0.5 КК</p>
                    <p>«Дорогой, реши проблему» — X КК*</p>
                    <p>«Курьееееер, мамочка хочет есть» — 2 КК</p>
                    <p>«Стирка на тебе, ма бой» — 0.5 КК**</p>
                    <p>«Требуется влажная уборка» — 1 КК***</p>
                    <p>«Помни мои ножки» — 1 КК</p>
                    <p>«Спинка устала, нужно помять» — 2 КК</p>
                    <p>«Стань моим шеф-поваром» — 2 КК</p>
                    <p>«Оу май, хочу нюдсов» — 2 КК</p>
                    <p>«What a gentleman you are» — 5 KK****</p>
                    <p>«Время собирать малый чемодан» — 100 КК</p>
                    <p>«Время вырваться за границы» — 200 КК</p>
                    <p>
                      «I'm going all in» - вес данной позиции равен текущему балансу
                      КК
                    </p>
                    <p>✨Mystery gift✨ — 3 КК</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Примечания */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
            >
              <h3 className="font-bold text-white mb-2">Примечания:</h3>
              <div className="space-y-2 text-xs">
                <p>
                  *X — Стоимость данной позиции устанавливается Иван-банком в
                  зависимости от текущей сложности
                </p>
                <p>
                  **Фраза: «Постой, закинь ещё и эти трусики» *снимает* —
                  аннулирует стоимость операции и переводит стирку в категорию
                  бесплатной, без списания КК и без права последующих претензий.
                </p>
                <p>
                  *** Если влажная уборка делегируется роботу, то исполнитель
                  обязуется заняться другой влажной работой
                </p>
                <p>
                  **** Списание коинсов по данной позиции происходит постфактум.
                  Случаи попадающие в данную категорию: цветы, походы в рестораны и
                  кафе.
                </p>
              </div>
            </motion.section>

            {/* Форс-мажоры */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-3">
                7. Форс-мажоры и чрезвычайные положения
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">К форс-мажорам относятся:</span>{" "}
                  не предусмотрено.
                </p>
                <p>
                  <span className="font-semibold">Чрезвычайные положения:</span>{" "}
                  ссора не может являться поводом к отказу в обмене.
                </p>
              </div>
            </motion.section>

            {/* Эпилог */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 backdrop-blur-md border-2 border-white/50 shadow-lg"
            >
              <h2 className="text-xl font-bold text-white mb-3">Эпилог</h2>
              <div className="space-y-3 text-sm leading-relaxed">
                <p>
                  И помни, мой любимый банкир и булочка, — всё это, конечно,
                  увлекательная игра, но её главный и нерушимый закон звучит так:
                  эти коинсы — всего лишь весёлые блёстки на поверхности огромного
                  и глубокого океана.
                </p>
                <p>
                  Мы не хотим, чтобы когда-нибудь в будущем поддержка, нежность
                  или простая бытовая забота превратились в «товар», который можно
                  купить за виртуальные монетки.
                </p>
                <p>
                  Потому что мы любим друг друга и просто хотим заботиться друг о
                  друге всеми возможными способами. Эта игра лишь символ, а не
                  валюта.
                </p>
                <p>
                  Пусть коины будут просто ещё одним способом сказать: «Я тебя
                  вижу. Я ценю этот твой жест. Спасибо». А всё остальное — и всегда
                  будет от всего сердца. Без условий и без счёта.
                </p>
                <p className="text-center font-bold text-white mt-4">
                  Создано при поддержке любви - беспрецедентной, безусловной и
                  настоящей♥♥♥
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
