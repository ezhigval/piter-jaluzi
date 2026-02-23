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
                <span className="font-medium">Телефон:</span> +7 (___) ___-__-__
              </p>
              <p>
                <span className="font-medium">WhatsApp / Telegram:</span> по
                основному номеру
              </p>
              <p>
                <span className="font-medium">E-mail:</span> info@jaluxi.ru
              </p>
              <p>
                <span className="font-medium">Город:</span> Москва и область
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
              <li>Пн–Пт: 10:00–19:00</li>
              <li>Сб: 11:00–17:00</li>
              <li>Вс: по предварительной записи</li>
            </ul>
          </div>
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
            <form className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Имя
                </label>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  placeholder="Как к вам обращаться"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Телефон
                </label>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Комментарий
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  placeholder="Например: жалюзи на кухню, 2 окна, горизонтальные, район метро ..."
                />
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
              >
                Отправить заявку (пока без отправки)
              </button>
              <p className="mt-2 text-[11px] text-zinc-500">
                Здесь позже можно подключить отправку заявок на почту или в CRM,
                а также добавить защиту от спама.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

