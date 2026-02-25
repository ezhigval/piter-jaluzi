'use client'

import { Block } from '@/lib/site-builder-types'
import OpenRequestModalButton from '@/components/OpenRequestModalButton'
import OptimizedImage, { OptimizedGallery, OptimizedBackground } from '@/components/OptimizedImage'

interface BlockRendererProps {
  block: Block
  className?: string
}

export default function BlockRenderer({ block, className = '' }: BlockRendererProps) {
  const { type, content, styles } = block

  // Применяем стили блока
  const blockStyles = {
    backgroundColor: styles?.backgroundColor || 'transparent',
    color: styles?.textColor || 'inherit',
    padding: styles?.padding || '3rem 0',
    margin: styles?.margin || '0',
    borderRadius: styles?.borderRadius || '0',
    border: styles?.border || 'none',
    textAlign: styles?.textAlign || 'left',
    fontSize: styles?.fontSize || 'inherit',
    fontWeight: styles?.fontWeight || 'inherit',
  }

  const blockClassName = `${className} ${!styles?.backgroundColor ? '' : 'bg-opacity-100'}`

  // Рендерим разные типы блоков
  switch (type) {
    case 'hero':
      return <HeroBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'text':
      return <TextBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'image':
      return <ImageBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'button':
      return <ButtonBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'gallery':
      return <GalleryBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'features':
      return <FeaturesBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'testimonials':
      return <TestimonialsBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'cta':
      return <CTABlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'contact':
      return <ContactBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'form':
      return <FormBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'video':
      return <VideoBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'pricing':
      return <PricingBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'team':
      return <TeamBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'faq':
      return <FAQBlock content={content} styles={blockStyles} className={blockClassName} />
    
    case 'stats':
      return <StatsBlock content={content} styles={blockStyles} className={blockClassName} />
    
    default:
      return <div style={blockStyles} className={blockClassName}>
        <p className="text-gray-500">Неизвестный тип блока: {type}</p>
      </div>
  }
}

// Hero блок
function HeroBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  const hasBackgroundImage = content.backgroundImage?.src
  
  return (
    <section style={styles} className={className}>
      {hasBackgroundImage ? (
        <OptimizedBackground
          src={content.backgroundImage.src}
          alt={content.backgroundImage.alt || ''}
          className="min-h-screen"
          overlay={content.backgroundOverlay || false}
          overlayOpacity={content.backgroundOverlayOpacity || 0.5}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {content.subtitle && (
                <span className="block text-base sm:text-lg text-gray-600 font-medium mb-2">
                  {content.subtitle}
                </span>
              )}
              {content.title && (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 leading-tight mb-6">
                  {content.title}
                </h1>
              )}
              {content.description && (
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
                  {content.description}
                </p>
              )}
              {content.buttons && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  {content.buttons.map((button: any, index: number) => (
                    <Button key={index} button={button} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </OptimizedBackground>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {content.subtitle && (
              <span className="block text-base sm:text-lg text-gray-600 font-medium mb-2">
                {content.subtitle}
              </span>
            )}
            {content.title && (
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 leading-tight mb-6">
                {content.title}
              </h1>
            )}
            {content.description && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
                {content.description}
              </p>
            )}
            {content.buttons && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                {content.buttons.map((button: any, index: number) => (
                  <Button key={index} button={button} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

// Текстовый блок
function TextBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          {content.title && (
            <h2 className="text-2xl sm:text-3xl font-light mb-4">{content.title}</h2>
          )}
          {content.subtitle && (
            <h3 className="text-xl font-medium mb-2">{content.subtitle}</h3>
          )}
          {content.html ? (
            <div dangerouslySetInnerHTML={{ __html: content.html }} />
          ) : (
            <p>{content.text}</p>
          )}
        </div>
      </div>
    </section>
  )
}

// Изображение
function ImageBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-6 text-center">{content.title}</h2>
        )}
        {content.image && (
          <div className="relative">
            <OptimizedImage
              src={content.image.src}
              alt={content.image.alt}
              width={content.image.width}
              height={content.image.height}
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  )
}

// Кнопка
function ButtonBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {content.button && <Button button={content.button} />}
      </div>
    </section>
  )
}

// Галерея
function GalleryBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-6 text-center">{content.title}</h2>
        )}
        <OptimizedGallery
          images={content.images || []}
          className="mt-8"
          itemClassName="group"
          lazy={true}
          columns={3}
        />
      </div>
    </section>
  )
}

// Особенности
function FeaturesBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features?.map((feature: any, index: number) => (
            <div key={index} className="text-center">
              {feature.icon && (
                <div className="text-4xl mb-4">{feature.icon}</div>
              )}
              {feature.title && (
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              )}
              {feature.description && (
                <p className="text-gray-600">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Отзывы
function TestimonialsBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.testimonials?.map((testimonial: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="font-medium">{testimonial.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA блок
function CTABlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {content.title && (
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">{content.title}</h2>
        )}
        {content.subtitle && (
          <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8">{content.subtitle}</p>
        )}
        {content.buttons && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {content.buttons.map((button: any, index: number) => (
              <Button key={index} button={button} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Контакты
function ContactBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Контактная информация</h3>
            {content.contact?.map((item: any, index: number) => (
              <div key={index} className="mb-4">
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
          <div>
            {content.form && <ContactForm form={content.form} />}
          </div>
        </div>
      </div>
    </section>
  )
}

// Форма
function FormBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <ContactForm form={content.form} />
      </div>
    </section>
  )
}

// Видео
function VideoBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-6 text-center">{content.title}</h2>
        )}
        <div className="relative aspect-w-16 aspect-h-9">
          <video
            src={content.video?.src}
            poster={content.video?.thumbnail}
            controls={content.video?.controls !== false}
            autoPlay={content.video?.autoplay}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}

// Цены
function PricingBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.plans?.map((plan: any, index: number) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-4">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">{plan.price}</div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <Button button={plan.button} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Команда
function TeamBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.members?.map((member: any, index: number) => (
            <div key={index} className="text-center">
              {member.photo && (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
              )}
              <h3 className="text-xl font-medium mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-2">{member.position}</p>
              <p className="text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ
function FAQBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <div className="space-y-4">
          {content.faqs?.map((faq: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Статистика
function StatsBlock({ content, styles, className }: { content: any; styles: any; className: string }) {
  return (
    <section style={styles} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">{content.title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.stats?.map((stat: any, index: number) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Вспомогательные компоненты
function Button({ button }: { button: any }) {
  const baseClasses = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200"
  
  const styleClasses: Record<string, string> = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    outline: "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
  }

  const classes = `${baseClasses} ${styleClasses[button.style || 'primary']}`

  if (button.action === 'measure') {
    return (
      <OpenRequestModalButton kind="measure" className={classes}>
        {button.text}
      </OpenRequestModalButton>
    )
  }

  if (button.action === 'request') {
    return (
      <OpenRequestModalButton kind="request" className={classes}>
        {button.text}
      </OpenRequestModalButton>
    )
  }

  return (
    <a
      href={button.link}
      target={button.target}
      className={classes}
    >
      {button.text}
    </a>
  )
}

function ContactForm({ form }: { form: any }) {
  return (
    <form className="space-y-4">
      {form.fields?.map((field: any, index: number) => (
        <div key={index}>
          <label className="block text-sm font-medium mb-2">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              rows={4}
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              required={field.required}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {field.options?.map((option: string, optIndex: number) => (
                <option key={optIndex} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
      >
        {form.submitText || 'Отправить'}
      </button>
    </form>
  )
}
