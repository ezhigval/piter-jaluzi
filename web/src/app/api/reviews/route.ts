import { NextRequest, NextResponse } from 'next/server'
import { Buffer } from 'buffer'

type ReviewAttachment = {
  type: 'image' | 'video'
  mimeType: string
  name: string
  dataUrl: string
}

// Реалистичные отзывы для Jaluxi
const defaultReviewsData = [
  {
    id: 1,
    author: 'Елена Петрова',
    rating: 5,
    text: 'Отличные жалюзи! Заказала белые тканевые жалюзи в гостиную. Качество на высоте, монтаж выполнен профессионально. Мастер учел все мои пожелания по расположению креплений. Рекомендую!',
    date: '2024-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1586087912743-4b4c5a1c7ca0?w=400&h=300&fit=crop',
    response: 'Спасибо за ваш отзыв, Елена! Нам очень приятно, что вы остались довольны нашим сервисом. Ждем вас снова!',
    verified: true,
    service: 'монтаж'
  },
  {
    id: 2,
    author: 'Михаил Иванов',
    rating: 4,
    text: 'Хорошая работа, установили алюминиевые жалюзи на кухню. Качество материалов хорошее, но немного задержали с доставкой на 2 дня. В целом результат превзошел ожидания.',
    date: '2024-01-10',
    response: 'Михаил, приносим извинения за задержку с доставкой. Стараемся всегда доставлять вовремя, но иногда возникают объективные трудности. Благодарим за понимание!',
    verified: true,
    service: 'монтаж'
  },
  {
    id: 3,
    author: 'Анна Смирнова',
    rating: 5,
    text: 'Заказала деревянные жалюзи в спальню. Получила настоящий восторг! Натуральное дерево выглядит очень благородно, запах приятный. Мастера работали аккуратно и быстро. Цена вполне адекватная.',
    date: '2024-01-08',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-6e9cb14d65d0?w=400&h=300&fit=crop',
    response: 'Анна, спасибо за такие теплые слова! Мы гордимся качеством нашей продукции и рады, что вы оценили работу наших мастеров.',
    verified: true,
    service: 'монтаж'
  },
  {
    id: 4,
    author: 'Дмитрий Козлов',
    rating: 5,
    text: 'Покупал пластиковые ламели для офиса. Отличный вариант - не выгорают на солнце, легко моются. Установка заняла всего 2 часа. Коллеги тоже остались довольны.',
    date: '2024-01-05',
    response: 'Дмитрий, благодарим за выбор нашего решения для офиса! Рады, что пластиковые ламели оправдали ваши ожидания.',
    verified: false,
    service: 'монтаж'
  },
  {
    id: 5,
    author: 'Ольга Новикова',
    rating: 3,
    text: 'Жалюзи хорошие, но есть нюанс. При сильном ветре немного шумят. Возможно, нужно было выбрать более плотную ткань. В остальном все нормально.',
    date: '2024-01-03',
    response: 'Ольга, спасибо за обратную связь! Для ветреных районов действительно рекомендуем ткани с большей плотностью. При следующем заказе наши менеджеры обязательно учтут этот момент.',
    verified: true,
    service: 'продажа'
  },
  {
    id: 6,
    author: 'Александр Волков',
    rating: 5,
    text: 'Замерщик приехал вовремя, все измерил аккуратно. Помогли с выбором цвета и типа жалюзи. Установка прошла без проблем. Все четко и по делу.',
    date: '2023-12-28',
    response: 'Александр, благодарим за доверие к нашей компании! Наш замерщик всегда старается предоставить максимум информации для правильного выбора.',
    verified: true,
    service: 'замер'
  },
  {
    id: 7,
    author: 'Татьяна Белова',
    rating: 4,
    text: 'Качество хорошее, но цена оказалась немного выше, чем у конкурентов. В итоге все равно заказали, т.к. понравился подход менеджера.',
    date: '2023-12-25',
    response: 'Татьяна, мы стараемся держать конкурентоспособные цены при сохранении качества. Спасибо, что оценили нашу работу!',
    verified: false,
    service: 'консультация'
  },
  {
    id: 8,
    author: 'Сергей Морозов',
    rating: 5,
    text: 'Заказывал жалюзи для всей квартиры. Сделали скидку на большой объем. Все выполнено в срок, качество отличное. Буду рекомендовать друзьям.',
    date: '2023-12-20',
    response: 'Сергей, спасибо за заказ и рекомендации! Всегда рады постоянным клиентам и предоставляем скидки на объемные заказы.',
    verified: true,
    service: 'монтаж'
  },
  {
    id: 9,
    author: 'Мария Лебедева',
    rating: 5,
    text: 'Дизайн жалюзи просто прекрасен! Сочетание цвета и фактуры идеально вписалось в мой интерьер. Получила много комплиментов от гостей. Спасибо!',
    date: '2023-12-15',
    imageUrl: 'https://images.unsplash.com/photo-1519681033-06d2889d0f4b?w=400&h=300&fit=crop',
    response: 'Мария, нам очень приятно, что вам понравился дизайн! Наши специалисты всегда помогают с подбором идеального решения.',
    verified: true,
    service: 'монтаж'
  },
  {
    id: 10,
    author: 'Игорь Соколов',
    rating: 2,
    text: 'Неприятный опыт. Долго ждали установки, потом выяснилось, что не привезли нужный цвет. Пришлось перенести на другую неделю.',
    date: '2023-12-10',
    response: 'Игорь, приносим искренние извинения за доставленные неудобства. Произошла накладка на складе, мы уже приняли меры для предотвращения подобных ситуаций.',
    verified: true,
    service: 'монтаж'
  }
]

function getReviewsStore() {
  const g = globalThis as any
  if (!g.__jaluxi_reviews_store) {
    g.__jaluxi_reviews_store = [...defaultReviewsData]
  }
  return g.__jaluxi_reviews_store as any[]
}

async function fileToDataUrl(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  return `data:${file.type};base64,${base64}`
}

export async function GET() {
  try {
    const reviewsData = getReviewsStore()
    return NextResponse.json({
      success: true,
      data: reviewsData,
      total: reviewsData.length,
      averageRating: (reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length).toFixed(1)
    })
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении отзывов' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let reviewData: any = {}
    let attachments: ReviewAttachment[] = []

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      reviewData = {
        author: String(form.get('author') ?? ''),
        text: String(form.get('text') ?? ''),
        rating: Number(form.get('rating') ?? 5),
      }

      const files = form.getAll('media').filter((v): v is File => v instanceof File)
      attachments = await Promise.all(
        files
          .filter((f) => Boolean(f.type))
          .map(async (f) => {
            const dataUrl = await fileToDataUrl(f)
            return {
              type: f.type.startsWith('video/') ? 'video' : 'image',
              mimeType: f.type,
              name: f.name,
              dataUrl,
            }
          })
      )
    } else {
      reviewData = await request.json()
    }
    
    // Валидация
    if (!reviewData.author || !reviewData.text) {
      return NextResponse.json(
        { error: 'Автор и текст отзыва обязательны' },
        { status: 400 }
      )
    }

    const reviewsData = getReviewsStore()

    // Создание нового отзыва
    const newReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      verified: false,
      response: null,
      attachments
    }

    reviewsData.push(newReview)
    
    console.log('Review created:', newReview)
    
    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Отзыв успешно добавлен'
    })

  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании отзыва' },
      { status: 500 }
    )
  }
}
