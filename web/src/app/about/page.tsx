import { Metadata } from 'next'
import OpenRequestModalButton from '@/components/OpenRequestModalButton'
import { findBlock, getPublicPageBySlug } from '@/lib/pages-store'

export const metadata: Metadata = {
  title: 'О компании Jaluxi - Производство жалюзи на заказ',
  description: 'Jaluxi - профессиональное производство и установка жалюзи в Москве. Более 10 лет опыта, гарантия качества, индивидуальный подход.',
}

export default function AboutPage() {
  const page = getPublicPageBySlug('/about')
  const cta = findBlock(page, 'cta')?.content
  const ctaTitle = cta?.title ?? 'Готовы преобразить ваш интерьер?'
  const ctaSubtitle = cta?.subtitle ?? 'Получите бесплатную консультацию и расчет стоимости'
  const primaryText = cta?.primary?.text ?? 'Заказать замер'
  const secondaryText = cta?.secondary?.text ?? 'Рассчитать стоимость'
  const secondaryLink = cta?.secondary?.link ?? '/catalog'

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              О компании Jaluxi
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-slate-300">
              Профессиональное производство и установка жалюзи с 2013 года
            </p>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-light text-gray-900">
              Наша миссия
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Мы создаем не просто жалюзи, а комфорт и уют в ваших домах и офисах. 
              Наша миссия — предложить качественные и стильные решения для защиты от солнца, 
              которые гармонично впишутся в любой интерьер.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Каждый заказ мы рассматриваем как индивидуальный проект, учитывая все 
              пожелания клиента и особенности помещения.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-100 to-slate-50 h-96 rounded-2xl flex items-center justify-center">
            <span className="text-slate-400 font-medium">Фото производства</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-light text-slate-900 mb-2">10+</div>
            <div className="text-gray-600">Лет на рынке</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-light text-slate-900 mb-2">5000+</div>
            <div className="text-gray-600">Довольных клиентов</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-light text-slate-900 mb-2">100+</div>
            <div className="text-gray-600">Типов жалюзи</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-light text-slate-900 mb-2">12 мес</div>
            <div className="text-gray-600">Гарантия</div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">
            Наши ценности
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-200 transition-colors duration-200">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-light mb-3 text-gray-900">Точность</h3>
              <p className="text-gray-600 leading-relaxed">
                Все замеры выполняются с точностью до миллиметра, 
                что гарантирует идеальную посадку жалюзи
              </p>
            </div>
            <div className="text-center p-8 group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-200 transition-colors duration-200">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-light mb-3 text-gray-900">Качество</h3>
              <p className="text-gray-600 leading-relaxed">
                Используем только проверенные материалы и фурнитуру 
                от ведущих производителей
              </p>
            </div>
            <div className="text-center p-8 group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-slate-200 transition-colors duration-200">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-light mb-3 text-gray-900">Надежность</h3>
              <p className="text-gray-600 leading-relaxed">
                Даем гарантию на все работы и всегда на связи 
                для решения любых вопросов
              </p>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="mb-20">
          <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">
            Как мы работаем
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                1
              </div>
              <h3 className="font-light mb-2 text-gray-900">Заявка</h3>
              <p className="text-sm text-gray-600">
                Оставляете заявку на сайте или звоните нам
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                2
              </div>
              <h3 className="font-light mb-2 text-gray-900">Замер</h3>
              <p className="text-sm text-gray-600">
                Бесплатно выезжаем на замер в удобное время
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                3
              </div>
              <h3 className="font-light mb-2 text-gray-900">Производство</h3>
              <p className="text-sm text-gray-600">
                Изготавливаем жалюзи по индивидуальным размерам
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-light">
                4
              </div>
              <h3 className="font-light mb-2 text-gray-900">Монтаж</h3>
              <p className="text-sm text-gray-600">
                Профессиональная установка и приемка работ
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-light mb-4">
            {ctaTitle}
          </h2>
          <p className="text-xl mb-8 text-slate-300">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OpenRequestModalButton
              kind="measure"
              className="bg-white text-slate-900 px-8 py-4 rounded-full font-medium hover:bg-slate-100 transition-colors duration-200"
            >
              {primaryText}
            </OpenRequestModalButton>
            <a
              href={secondaryLink}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-slate-900 transition-colors duration-200"
            >
              {secondaryText}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
