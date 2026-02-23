export type MaterialRecord = {
  id: number
  name: string
  category: string
  color?: string
  lightTransmission: number
  pricePerM2: number
  supplierCode: string
  imageURL?: string
  imageUrl?: string
  description?: string
  composition?: string
  density?: string
  width?: string
  thickness?: string
  features?: string[]
  inStock?: boolean
  minOrder?: number
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
  active?: boolean
}

const defaultMaterialsData: MaterialRecord[] = [
  {
    id: 1,
    name: 'Ткань Premium Белая',
    category: 'ткани',
    color: 'белый',
    lightTransmission: 70,
    pricePerM2: 1200,
    supplierCode: 'FAB001',
    imageURL: 'https://images.unsplash.com/photo-1526087912743-4b4c5a1c7ca0?w=400&h=300&fit=crop',
    description: 'Премиальная белая ткань для жалюзи с высокой светопропускаемостью',
    composition: '100% полиэстер',
    density: '280 г/м²',
    width: '280 см',
    features: ['антистатическая', 'не выгорает', 'легкая чистка'],
    inStock: true,
    minOrder: 5,
  },
  {
    id: 2,
    name: 'Ткань Бежевая Классика',
    category: 'ткани',
    color: 'бежевый',
    lightTransmission: 65,
    pricePerM2: 1100,
    supplierCode: 'FAB002',
    imageURL: 'https://images.unsplash.com/photo-1620799148408-edc6dcb6bb6f?w=400&h=300&fit=crop',
    description: 'Классическая бежевая ткань, универсальный вариант для любого интерьера',
    composition: '100% полиэстер',
    density: '260 г/м²',
    width: '280 см',
    features: ['антистатическая', 'UV защита', 'гипоаллергенная'],
    inStock: true,
    minOrder: 5,
  },
  {
    id: 3,
    name: 'Ткань Серый Меланж',
    category: 'ткани',
    color: 'серый',
    lightTransmission: 45,
    pricePerM2: 1350,
    supplierCode: 'FAB003',
    imageURL: 'https://images.unsplash.com/photo-1586953208448-b95a79798c07?w=400&h=300&fit=crop',
    description: 'Стильная серая ткань с меланжевым эффектом для современного дизайна',
    composition: '100% полиэстер',
    density: '300 г/м²',
    width: '280 см',
    features: ['антистатическая', 'не выгорает', 'повышенная плотность'],
    inStock: true,
    minOrder: 5,
  },
  {
    id: 4,
    name: 'Алюминиевый профиль Серебристый',
    category: 'профили',
    color: 'серебристый',
    lightTransmission: 0,
    pricePerM2: 2500,
    supplierCode: 'PRO001',
    imageURL: 'https://images.unsplash.com/photo-1586953208448-b95a79798c07?w=400&h=300&fit=crop',
    description: 'Прочный алюминиевый профиль с серебристым анодированием',
    composition: 'Алюминий 6063',
    thickness: '1.2 мм',
    width: '25 мм',
    features: ['антикоррозийное покрытие', 'легкий вес', 'прочная конструкция'],
    inStock: true,
    minOrder: 10,
  },
  {
    id: 5,
    name: 'Алюминиевый профиль Коричневый',
    category: 'профили',
    color: 'коричневый',
    lightTransmission: 0,
    pricePerM2: 2700,
    supplierCode: 'PRO002',
    imageURL: 'https://images.unsplash.com/photo-1558624734-db5eed19b27e?w=400&h=300&fit=crop',
    description: 'Алюминиевый профиль в классическом коричневом цвете',
    composition: 'Алюминий 6063',
    thickness: '1.2 мм',
    width: '25 мм',
    features: ['антикоррозийное покрытие', 'порошковая окраска', 'долговечность'],
    inStock: true,
    minOrder: 10,
  },
  {
    id: 6,
    name: 'Алюминиевый профиль Белый',
    category: 'профили',
    color: 'белый',
    lightTransmission: 0,
    pricePerM2: 2600,
    supplierCode: 'PRO003',
    imageURL: 'https://images.unsplash.com/photo-1586953208448-b95a79798c07?w=400&h=300&fit=crop',
    description: 'Белый алюминиевый профиль для светлых интерьеров',
    composition: 'Алюминий 6063',
    thickness: '1.2 мм',
    width: '25 мм',
    features: ['антикоррозийное покрытие', 'белая эмаль', 'современный дизайн'],
    inStock: true,
    minOrder: 10,
  },
  {
    id: 7,
    name: 'Деревянный брус Натуральный',
    category: 'брус',
    color: 'натуральный',
    lightTransmission: 0,
    pricePerM2: 3200,
    supplierCode: 'WD001',
    imageURL: 'https://images.unsplash.com/photo-1549490349-6e9cb14d65d0?w=400&h=300&fit=crop',
    description: 'Натуральный деревянный брус из массива сосны',
    composition: 'Сосна массив',
    thickness: '40 мм',
    width: '60 мм',
    features: ['экологически чистый', 'натуральная текстура', 'высокая прочность'],
    inStock: true,
    minOrder: 8,
  },
  {
    id: 8,
    name: 'Деревянный брус Темный орех',
    category: 'брус',
    color: 'темный орех',
    lightTransmission: 0,
    pricePerM2: 3800,
    supplierCode: 'WD002',
    imageURL: 'https://images.unsplash.com/photo-1586953208448-b95a79798c07?w=400&h=300&fit=crop',
    description: 'Деревянный брус с тонировкой под темный орех',
    composition: 'Сосна массив + тонировка',
    thickness: '40 мм',
    width: '60 мм',
    features: ['экологически чистый', 'премиальная тонировка', 'защита от влаги'],
    inStock: true,
    minOrder: 8,
  },
  {
    id: 9,
    name: 'Пластиковый ламель Прозрачный',
    category: 'ламели',
    color: 'прозрачный',
    lightTransmission: 85,
    pricePerM2: 900,
    supplierCode: 'LAM001',
    imageURL: 'https://images.unsplash.com/photo-1519681033-06d2889d0f4b?w=400&h=300&fit=crop',
    description: 'Прозрачный ПВХ ламель для максимального светопропускания',
    composition: 'ПВХ',
    thickness: '3 мм',
    width: '89 мм',
    features: ['100% влагостойкость', 'не желтеет', 'легкий монтаж'],
    inStock: true,
    minOrder: 20,
  },
  {
    id: 10,
    name: 'Пластиковый ламель Матовый',
    category: 'ламели',
    color: 'матовый',
    lightTransmission: 60,
    pricePerM2: 950,
    supplierCode: 'LAM002',
    imageURL: 'https://images.unsplash.com/photo-1519681033-06d2889d0f4b?w=400&h=300&fit=crop',
    description: 'Матовый ПВХ ламель для рассеянного света',
    composition: 'ПВХ',
    thickness: '3 мм',
    width: '89 мм',
    features: ['100% влагостойкость', 'защита от УФ', 'современный внешний вид'],
    inStock: true,
    minOrder: 20,
  },
]

export function getMaterialsStore(): MaterialRecord[] {
  const g = globalThis as any
  if (!g.__jaluxi_materials_store) {
    g.__jaluxi_materials_store = [...defaultMaterialsData]
  }
  return g.__jaluxi_materials_store as MaterialRecord[]
}
