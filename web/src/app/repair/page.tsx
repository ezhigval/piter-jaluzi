import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ремонт жалюзи - Jaluxi',
  description: 'Профессиональный ремонт всех видов жалюзи в Москве. Быстрое восстановление механизмов, замена ламелей и комплектующих.',
}

export default function RepairPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Ремонт жалюзи
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-slate-300">
              Восстановим любые повреждения: от замены ламелей до ремонта механизма управления
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Виды ремонта
          </h2>
          <p className="text-xl text-gray-600">
            Выполняем все виды работ по восстановлению жалюзи
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="text-xl font-light mb-4 text-gray-900">Механизм управления</h3>
            <p className="text-gray-600 leading-relaxed">
              Ремонт шнурового управления, замена трещотки, восстановление цепочного механизма
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📏</span>
            </div>
            <h3 className="text-xl font-light mb-4 text-gray-900">Замена ламелей</h3>
            <p className="text-gray-600 leading-relaxed">
              Замена поврежденных ламелей на аналогичные, подбор по цвету и фактуре
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-light mb-4 text-gray-900">Карниз и крепления</h3>
            <p className="text-gray-600 leading-relaxed">
              Ремонт или замена карниза, установка новых креплений, выравнивание конструкции
            </p>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Как мы работаем
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                1
              </div>
              <h3 className="font-light mb-2 text-gray-900">Заявка</h3>
              <p className="text-sm text-gray-600">
                Оставляете заявку на ремонт
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                2
              </div>
              <h3 className="font-light mb-2 text-gray-900">Диагностика</h3>
              <p className="text-sm text-gray-600">
                Бесплатно оцениваем повреждения
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                3
              </div>
              <h3 className="font-light mb-2 text-gray-900">Ремонт</h3>
              <p className="text-sm text-gray-600">
                Выполняем все необходимые работы
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                4
              </div>
              <h3 className="font-light mb-2 text-gray-900">Проверка</h3>
              <p className="text-sm text-gray-600">
                Проверяем работу и передаем вам
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-white mb-4">
            Нужен ремонт жалюзи?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Оставьте заявку и мы свяжемся с вами в течение 15 минут
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacts"
              className="bg-white text-slate-900 px-8 py-4 rounded-full font-medium hover:bg-slate-100 transition-colors duration-200"
            >
              Оставить заявку
            </a>
            <a
              href="tel:+74951234567"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-slate-900 transition-colors duration-200"
            >
              +7 (495) 123-45-67
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
