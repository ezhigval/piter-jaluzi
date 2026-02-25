import React, { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    windowWidth: 100,
    windowHeight: 120,
    message: '',
  })

  const [categories, setCategories] = useState([])
  const [materials, setMaterials] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    // Загрузка данных с API
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/categories')
        const data = await response.json()
        setCategories(data.data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const fetchMaterials = async (categorySlug) => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/categories/${categorySlug}/materials`)
        const data = await response.json()
        setMaterials(data.data || [])
      } catch (error) {
        console.error('Error fetching materials:', error)
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/reviews')
        const data = await response.json()
        setReviews(data.data || [])
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchCategories()
    fetchMaterials('horizontal')
    fetchReviews()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      alert('Заявка успешно отправлена! ID: ' + data.lead_id)
      setFormData({ name: '', phone: '', email: '', windowWidth: 100, windowHeight: 120, message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Ошибка при отправке заявки')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Северный Контур</h1>
              <p className="text-gray-600 mt-2">Профессиональные жалюзи</p>
            </div>
            <div className="flex items-center space-x-4">
              <a href="tel:+7 (812) 123-45-67" className="text-blue-600 hover:text-blue-800">
                📞 +7 (812) 123-45-67
              </a>
              <a href="mailto:info@severnyj-kontur.ru" className="text-blue-600 hover:text-blue-800">
                ✉️ info@severnyj-kontur.ru
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Создайте уют в вашем доме</h2>
            <p className="text-xl mb-8">Профессиональные жалюзи на заказ в Санкт-Петербурге</p>
            <Button onClick={() => setFormData({ ...formData, message: 'Хочу заказать жалюзи' })}>
              Рассчитать стоимость
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Каталог продукции</h2>
          <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <Button 
                  onClick={() => fetchMaterials(category.slug)}
                  className="w-full"
                >
                  Посмотреть материалы
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      {materials.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Материалы</h2>
            <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div key={material.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="text-lg font-semibold mb-2">{material.name}</h4>
                  <p className="text-gray-600 mb-4">{material.description}</p>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{material.pricePerM2} ₽/м²</p>
                  <Button 
                    onClick={() => setFormData({ ...formData, materialId: material.id })}
                    className="w-full"
                  >
                    Заказать
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Отзывы клиентов</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-500">
                      {'★'.repeat(review.rating)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.author}</h4>
                      <p className="text-gray-600 text-sm">{review.text}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{review.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Оставить заявку</h2>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Ваше имя"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  required
                />
              </div>
              <div>
                <Input
                  label="Телефон"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  required
                />
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  required
                />
              </div>
              <div>
                <Input
                  label="Ширина окна (см)"
                  type="number"
                  value={formData.windowWidth}
                  onChange={(value) => setFormData({ ...formData, windowWidth: value })}
                  required
                />
              </div>
              <div>
                <Input
                  label="Высота окна (см)"
                  type="number"
                  value={formData.windowHeight}
                  onChange={(value) => setFormData({ ...formData, windowHeight: value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Сообщение"
                  value={formData.message}
                  onChange={(value) => setFormData({ ...formData, message: value })}
                  required
                  className="md:col-span-2"
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:col-span-2">
              Отправить заявку
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold">Контакты</h3>
              <p className="text-gray-300">+7 (812) 123-45-67</p>
              <p>info@severnyj-kontur.ru</p>
            </div>
            <div>
              <h3 className="font-semibold">Время работы</h3>
              <p className="text-gray-300">Пн-Пт: 9:00-18:00, Сб: 10:00-16:00</p>
            </div>
            <div>
              <h3 className="font-semibold">Адрес</h3>
              <p className="text-gray-300">Санкт-Петербург, ул. Примерная, д. 1</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400">© 2024 Северный Контур. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
