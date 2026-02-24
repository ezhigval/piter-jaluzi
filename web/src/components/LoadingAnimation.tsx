'use client'

import { useEffect, useState } from 'react'

export default function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3500) // Анимация длится 3.5 секунды

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Фон сайта (затемнен) */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Контейнер с жалюзи */}
      <div className="relative w-full h-full">
        {/* Заголовок поверх жалюзи */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Северный Контур</h1>
          <p className="text-slate-200 drop-shadow-md">Жалюзи для вашего интерьера</p>
        </div>

        {/* Жалюзи закрывают весь экран */}
        <div className="absolute inset-0 flex flex-col-reverse">
          {[...Array(40)].map((_, index) => (
            <div
              key={index}
              className="lamella"
              style={{
                '--delay': `${index * 0.03}s`,
                '--duration': '0.8s',
                '--initial-height': `${100 / 40}%`,
              } as React.CSSProperties}
            >
              <div className="lamella-inner">
                {/* Текстура ламели */}
                <div className="lamella-texture"></div>
                {/* Блик на ламели */}
                <div className="lamella-shine"></div>
                {/* Тень для объема */}
                <div className="lamella-shadow"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Направляющие шины по бокам */}
        <div className="absolute left-8 top-0 bottom-0 w-4 bg-gradient-to-b from-slate-700 to-slate-800 z-20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-30"></div>
        </div>
        <div className="absolute right-8 top-0 bottom-0 w-4 bg-gradient-to-b from-slate-700 to-slate-800 z-20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-30"></div>
        </div>

        {/* Верхняя и нижняя направляющие */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 z-20 shadow-lg"></div>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 z-20 shadow-lg"></div>

        {/* Шнуры управления */}
        <div className="absolute right-12 top-12 bottom-12 w-2 bg-slate-500 z-25 opacity-80">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-md"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-md"></div>
        </div>
        <div className="absolute right-20 top-12 bottom-12 w-2 bg-slate-500 z-25 opacity-80">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-md"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-md"></div>
        </div>

        {/* Стек сложенных ламелей (появляются вверху в конце) */}
        <div className="lamella-stack">
          {[...Array(40)].map((_, index) => (
            <div
              key={index}
              className="stacked-lamella"
              style={{
                '--delay': `${2.8 + index * 0.01}s`,
              } as React.CSSProperties}
            >
              <div className="stacked-lamella-inner"></div>
            </div>
          ))}
        </div>

        {/* Индикатор загрузки */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-white text-sm drop-shadow-md">Открываем сайт...</p>
        </div>
      </div>

      {/* Стили анимации */}
      <style jsx>{`
        .lamella {
          height: var(--initial-height);
          min-height: 12px;
          background: linear-gradient(90deg, 
            #374151 0%, 
            #4b5563 20%, 
            #6b7280 40%, 
            #4b5563 60%, 
            #374151 80%, 
            #1f2937 100%
          );
          border: 1px solid #1f2937;
          border-radius: 1px;
          position: relative;
          overflow: hidden;
          transform: translateY(0) rotateX(0deg);
          animation: lamellaOpen var(--duration) cubic-bezier(0.4, 0, 0.2, 1) var(--delay) forwards;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          z-index: 10;
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
            transparent 3px,
            rgba(255, 255, 255, 0.03) 3px,
            rgba(255, 255, 255, 0.03) 6px
          );
        }

        .lamella-shine {
          position: absolute;
          top: 0;
          left: -150%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
          animation: shine 3s infinite;
        }

        .lamella-shadow {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 0, 0, 0.3), 
            transparent
          );
        }

        @keyframes lamellaOpen {
          0% {
            transform: translateY(0) rotateX(0deg) scaleY(1);
            opacity: 1;
            height: var(--initial-height);
          }
          30% {
            transform: translateY(-20px) rotateX(-5deg) scaleY(0.95);
            opacity: 1;
            height: var(--initial-height);
          }
          60% {
            transform: translateY(-60px) rotateX(-15deg) scaleY(0.8);
            opacity: 0.8;
            height: calc(var(--initial-height) * 0.8);
          }
          85% {
            transform: translateY(-120px) rotateX(-25deg) scaleY(0.6);
            opacity: 0.4;
            height: calc(var(--initial-height) * 0.6);
          }
          100% {
            transform: translateY(-200px) rotateX(-35deg) scaleY(0.4);
            opacity: 0;
            height: calc(var(--initial-height) * 0.4);
          }
        }

        @keyframes shine {
          0% {
            left: -150%;
          }
          50% {
            left: -150%;
          }
          100% {
            left: 200%;
          }
        }

        .lamella-stack {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          max-width: 200px;
        }

        .stacked-lamella {
          height: 8px;
          width: 100%;
          background: linear-gradient(90deg, 
            #374151 0%, 
            #4b5563 50%, 
            #374151 100%
          );
          border: 1px solid #1f2937;
          border-radius: 1px;
          position: absolute;
          opacity: 0;
          transform: scale(0.9) translateY(-5px) rotateX(-30deg);
          animation: stackAppear 0.4s ease-out var(--delay) forwards;
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .stacked-lamella:nth-child(odd) {
          transform: scale(0.9) translateY(-5px) translateX(-1px) rotateX(-30deg);
        }

        .stacked-lamella:nth-child(even) {
          transform: scale(0.9) translateY(-5px) translateX(1px) rotateX(-30deg);
        }

        .stacked-lamella-inner {
          position: relative;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.02) 2px,
            rgba(255, 255, 255, 0.02) 4px
          );
          border-radius: 1px;
        }

        @keyframes stackAppear {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-5px) rotateX(-30deg);
          }
          100% {
            opacity: 1;
            transform: scale(0.7) translateY(0) rotateX(-35deg);
          }
        }

        /* Эффект волны при открытии */
        .lamella:nth-child(3n) {
          animation-delay: calc(var(--delay) + 0.05s);
        }

        .lamella:nth-child(3n+1) {
          animation-delay: calc(var(--delay) + 0.02s);
        }

        .lamella:nth-child(3n+2) {
          animation-delay: calc(var(--delay) + 0.08s);
        }

        /* Пульсация направляющих */
        @keyframes guidePulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .bg-slate-700 {
          animation: guidePulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
