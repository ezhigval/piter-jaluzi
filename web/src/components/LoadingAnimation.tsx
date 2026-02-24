'use client'

import { useEffect, useState } from 'react'

export default function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000) // Анимация длится 3 секунды

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-700 z-50 flex items-center justify-center">
      <div className="relative">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Северный Контур</h1>
          <p className="text-slate-200">Жалюзи для вашего интерьера</p>
        </div>

        {/* Жалюзи контейнер */}
        <div className="relative w-80 h-96 mx-auto">
          {/* Каркас окна */}
          <div className="absolute inset-0 border-4 border-slate-600 rounded-lg overflow-hidden bg-slate-800">
            
            {/* Ламели жалюзи */}
            <div className="absolute inset-0 flex flex-col-reverse">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className="lamella"
                  style={{
                    '--delay': `${index * 0.05}s`,
                    '--duration': '0.6s',
                    '--transform': 'translateY(-400px)',
                  } as React.CSSProperties}
                >
                  <div className="lamella-inner">
                    {/* Текстура ламели */}
                    <div className="lamella-texture"></div>
                    {/* Блик на ламели */}
                    <div className="lamella-shine"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Направляющая шина */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-slate-700 z-10"></div>
            
            {/* Шнур управления */}
            <div className="absolute right-4 top-4 bottom-4 w-1 bg-slate-500 z-10">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-400 rounded-full"></div>
            </div>
          </div>

          {/* Стек сложенных ламелей (появляются в конце анимации) */}
          <div className="lamella-stack">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className="stacked-lamella"
                style={{
                  '--delay': `${2 + index * 0.02}s`,
                } as React.CSSProperties}
              >
                <div className="stacked-lamella-inner"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Индикатор загрузки */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-slate-200 text-sm mt-2">Загрузка...</p>
        </div>
      </div>

      {/* Стили анимации */}
      <style jsx>{`
        .lamella {
          height: 18px;
          background: linear-gradient(90deg, #475569 0%, #64748b 50%, #475569 100%);
          border: 1px solid #334155;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          animation: lamellaLift var(--duration) ease-in-out var(--delay) forwards;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .lamella-inner {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .lamella-texture {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.05) 2px,
            rgba(255, 255, 255, 0.05) 4px
          );
        }

        .lamella-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shine 2s infinite;
        }

        @keyframes lamellaLift {
          0% {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-200px) rotateX(-15deg);
            opacity: 0.8;
          }
          80% {
            transform: translateY(-380px) rotateX(-25deg) scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-400px) rotateX(-30deg) scale(0.7);
            opacity: 0;
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        .lamella-stack {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-20;
        }

        .stacked-lamella {
          height: 12px;
          width: 60px;
          background: linear-gradient(90deg, #475569 0%, #64748b 50%, #475569 100%);
          border: 1px solid #334155;
          border-radius: 1px;
          position: absolute;
          opacity: 0;
          transform: scale(0.8) translateY(-10px);
          animation: stackAppear 0.3s ease-out var(--delay) forwards;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        }

        .stacked-lamella:nth-child(odd) {
          transform: scale(0.8) translateY(-10px) translateX(-2px);
        }

        .stacked-lamella:nth-child(even) {
          transform: scale(0.8) translateY(-10px) translateX(2px);
        }

        .stacked-lamella-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(255, 255, 255, 0.03) 1px,
            rgba(255, 255, 255, 0.03) 2px
          );
          border-radius: 1px;
        }

        @keyframes stackAppear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(0.7) translateY(0);
          }
        }

        /* Дополнительные эффекты */
        .lamella:nth-child(odd) {
          animation-delay: calc(var(--delay) + 0.02s);
        }

        .lamella:nth-child(even) {
          animation-delay: calc(var(--delay) + 0.04s);
        }

        /* Пульсация для каркаса */
        @keyframes framePulse {
          0%, 100% {
            border-color: #475569;
          }
          50% {
            border-color: #64748b;
          }
        }

        .border-slate-600 {
          animation: framePulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
