"use client";

import { useEffect, useState } from "react";
import { api, Review } from "@/lib/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ name: string; type: string; url: string }[]>([]);

  useEffect(() => {
    let revoked: string[] = []
    const previews = files.map((f) => {
      const url = URL.createObjectURL(f)
      revoked.push(url)
      return { name: f.name, type: f.type, url }
    })
    setFilePreviews(previews)
    return () => {
      for (const u of revoked) URL.revokeObjectURL(u)
    }
  }, [files])

  useEffect(() => {
    let mounted = true;
    api
      .getReviews()
      .then((data) => {
        if (mounted) setReviews(data);
      })
      .catch(() => {
        if (mounted) setError("Не удалось загрузить отзывы.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !comment.trim()) {
      setError("Пожалуйста, заполните имя и текст отзыва.");
      return;
    }

    try {
      setSubmitting(true);
      const created =
        files.length > 0
          ? await api.createReviewWithMedia({ name, rating, comment, files })
          : await api.createReview({ name, rating, comment });
      setReviews((prev) => [created, ...prev]);
      setName("");
      setRating(5);
      setComment("");
      setFiles([]);
    } catch {
      setError("Не удалось отправить отзыв. Попробуйте позже.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900">Отзывы клиентов</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Здесь вы можете прочитать мнения наших клиентов и оставить свой отзыв
        после установки или ремонта жалюзи.
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="space-y-3">
          {loading && <p className="text-sm text-zinc-600">Загрузка отзывов...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-sm text-zinc-600">
              Отзывов пока нет. Будьте первым, кто поделится впечатлениями.
            </p>
          )}
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl bg-white p-4 shadow-sm text-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-zinc-900">{r.name}</p>
                <p className="text-xs text-amber-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
              </div>
              <p className="mt-2 text-zinc-700">{r.comment}</p>

              {(r.attachments?.length ?? 0) > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {r.attachments!.map((a, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden bg-zinc-100">
                      {a.type === 'video' ? (
                        <video controls className="w-full h-44 object-cover" src={a.dataUrl} />
                      ) : (
                        <img className="w-full h-44 object-cover" src={a.dataUrl} alt={a.name} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-2 text-[11px] text-zinc-400">
                {new Date(r.createdAt).toLocaleDateString("ru-RU")}
              </p>
            </article>
          ))}
        </section>

        <section>
          <div className="rounded-2xl bg-white p-4 shadow-sm text-sm">
            <h2 className="text-sm font-semibold text-zinc-900">
              Оставить отзыв
            </h2>
            <p className="mt-1 text-xs text-zinc-600">
              После установки или ремонта жалюзи вы можете поделиться своим
              впечатлением. Мы заранее благодарим за честный отзыв.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Имя
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  placeholder="Как к вам обращаться"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Фото или видео (необязательно)</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                  className="w-full text-sm"
                />
                {filePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {filePreviews.map((p) => (
                      <div key={p.url} className="rounded-lg overflow-hidden bg-zinc-100">
                        {p.type.startsWith('video/') ? (
                          <video controls className="w-full h-28 object-cover" src={p.url} />
                        ) : (
                          <img className="w-full h-28 object-cover" src={p.url} alt={p.name} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {files.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFiles([])}
                    className="mt-2 text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    Очистить вложения
                  </button>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Оценка
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v} из 5
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Отзыв
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                  placeholder="Расскажите, как прошел монтаж или ремонт, что понравилось и что можно улучшить."
                />
              </div>
              {error && (
                <p className="text-xs text-red-600" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {submitting ? "Отправка..." : "Отправить отзыв"}
              </button>
              <p className="mt-2 text-[11px] text-zinc-500">
                Отзыв может пройти быструю модерацию на предмет спама и
                оскорблений.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

