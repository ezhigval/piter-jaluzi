export type SiteContactConfig = {
  phoneDisplay: string
  phoneTel: string
  whatsappUrl: string
  telegramUrl: string
  email: string
  city: string
  address: string
  workHoursWeekdays: string
  workHoursSaturday: string
  workHoursSunday: string
  yandexMapEmbedUrl: string
}

export const siteConfig: { contacts: SiteContactConfig } = {
  contacts: {
    phoneDisplay:
      process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY ?? '+7 (495) 123-45-67',
    phoneTel: process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL ?? '+74951234567',
    whatsappUrl: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_URL ?? '',
    telegramUrl: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM_URL ?? '',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'info@jaluxi.ru',
    city: process.env.NEXT_PUBLIC_CONTACT_CITY ?? 'Москва и область',
    address:
      process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? 'Москва, ул. Примерная, д. 123',
    workHoursWeekdays:
      process.env.NEXT_PUBLIC_CONTACT_WORK_HOURS_WEEKDAYS ?? 'Пн–Пт: 10:00–19:00',
    workHoursSaturday:
      process.env.NEXT_PUBLIC_CONTACT_WORK_HOURS_SATURDAY ?? 'Сб: 11:00–17:00',
    workHoursSunday:
      process.env.NEXT_PUBLIC_CONTACT_WORK_HOURS_SUNDAY ?? 'Вс: по предварительной записи',
    yandexMapEmbedUrl: process.env.NEXT_PUBLIC_YANDEX_MAP_EMBED_URL ?? '',
  },
}
