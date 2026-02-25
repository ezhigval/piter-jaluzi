import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<div>Каталог</div>} />
        <Route path="/about" element={<div>О нас</div>} />
        <Route path="/reviews" element={<div>Отзывы</div>} />
        <Route path="/gallery" element={<div>Галерея</div>} />
        <Route path="/contacts" element={<div>Контакты</div>} />
      </Routes>
    </Router>
  )
}

export default App
