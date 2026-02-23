import OpenRequestModalButton from '@/components/OpenRequestModalButton'
import { siteConfig } from '@/lib/site-config'

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">Контакты</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Свяжитесь с нами для расчета стоимости, вызова замерщика или оформления
        заявки на ремонт жалюзи.
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <section className="space-y-4 text-sm text-zinc-700">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">
              Основная информация
            </h2>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="font-medium">Телефон:</span>{' '}
                <a
                  className="hover:underline"
                  href={`tel:${siteConfig.contacts.phoneTel}`}
                >
                  {siteConfig.contacts.phoneDisplay}
                </a>
              </p>
              <p>
                <span className="font-medium">WhatsApp / Telegram:</span>{' '}
                {siteConfig.contacts.whatsappUrl || siteConfig.contacts.telegramUrl ? (
                  <span>
                    {siteConfig.contacts.whatsappUrl ? (
                      <a
                        className="hover:underline"
                        href={siteConfig.contacts.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                    ) : null}
                    {siteConfig.contacts.whatsappUrl && siteConfig.contacts.telegramUrl ? (
                      <span> / </span>
                    ) : null}
                    {siteConfig.contacts.telegramUrl ? (
                      <a
                        className="hover:underline"
                        href={siteConfig.contacts.telegramUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Telegram
                      </a>
                    ) : null}
                  </span>
                ) : (
                  <span>по основному номеру</span>
                )}
              </p>
              <p>
                <span className="font-medium">E-mail:</span>{' '}
                <a
                  className="hover:underline"
                  href={`mailto:${siteConfig.contacts.email}`}
                >
                  {siteConfig.contacts.email}
                </a>
              </p>
              <p>
                <span className="font-medium">Город:</span> {siteConfig.contacts.city}
              </p>
              <p>
                <span className="font-medium">Адрес:</span> {siteConfig.contacts.address}
              </p>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              Точный адрес и график работы можно добавить здесь, когда вы
              определитесь с режимом и форматом встреч с клиентами.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">
              Режим работы
            </h2>
            <ul className="mt-2 text-sm">
              <li>{siteConfig.contacts.workHoursWeekdays}</li>
              <li>{siteConfig.contacts.workHoursSaturday}</li>
              <li>{siteConfig.contacts.workHoursSunday}</li>
            </ul>
          </div>

          {siteConfig.contacts.yandexMapEmbedUrl ? (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <iframe
                src={siteConfig.contacts.yandexMapEmbedUrl}
                className="h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}
        </section>

        <section>
          <div className="rounded-2xl bg-white p-4 shadow-sm text-sm">
            <h2 className="text-sm font-semibold text-zinc-900">
              Оставить заявку
            </h2>
            <p className="mt-1 text-xs text-zinc-600">
              Кратко опишите задачу: изготовление жалюзи или ремонт, количество
              окон и район. Мы перезвоним, чтобы уточнить детали.
            </p>
            <div className="mt-4 space-y-3">
              <OpenRequestModalButton
                kind="request"
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
              >
                Оставить заявку
              </OpenRequestModalButton>
              <p className="text-[11px] text-zinc-500">
                Здесь позже можно подключить отправку заявок на почту или в CRM,
                а также добавить защиту от спама.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

