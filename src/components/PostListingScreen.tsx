import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { CURATED_LISTING_IMAGES } from '../lib/supabaseClient';
import {
  CAMPUS_ZONE_OPTIONS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  formatKgsPrice,
  validateNewListingForm,
  type NewListingInput,
} from '../utils/listings';
import { ListingImage } from './ListingImage';

interface PostListingScreenProps {
  onBack: () => void;
  onSubmitListing: (input: NewListingInput) => Promise<{ ok: boolean; error?: string }>;
}

export function PostListingScreen({ onBack, onSubmitListing }: PostListingScreenProps) {
  const [title, setTitle] = useState('');
  const [priceKgs, setPriceKgs] = useState('2500');
  const [swapFor, setSwapFor] = useState('');
  const [category, setCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [condition, setCondition] = useState<string>(CONDITION_OPTIONS[0]);
  const [sellerName, setSellerName] = useState('Тилек А.');
  const [campusZone, setCampusZone] = useState<string>(CAMPUS_ZONE_OPTIONS[0]);
  const [urgencyBadge, setUrgencyBadge] = useState('');
  const [imageUrl, setImageUrl] = useState(CURATED_LISTING_IMAGES[0].url);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const input: NewListingInput = {
      title,
      price_kgs: priceKgs,
      swap_for: swapFor,
      category,
      condition,
      seller_name: sellerName,
      seller_rating: 4.9,
      campus_zone: campusZone,
      urgency_badge: urgencyBadge,
      image_url: imageUrl,
    };

    const validation = validateNewListingForm(input);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const result = await onSubmitListing(input);
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(
        result.error || 'Не удалось сохранить объявление в Supabase. Попробуйте еще раз.'
      );
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6DDD0] text-xs font-semibold text-[#241D18] hover:border-[#C9BBA8] transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <h1 className="font-display text-base font-semibold text-[#241D18] truncate">
          Новый лот или обмен
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-5 items-start">
        {/* Form Column */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-4"
        >
          <div className="border-b border-[#EFE8DC] pb-3">
            <h2 className="font-display text-lg font-semibold text-[#241D18]">
              Разместить предмет в гильдии
            </h2>
            <p className="text-xs text-[#6C5E52] mt-1">
              Запись сразу появится в общей ленте Бишкека и сохранится в Supabase.
            </p>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="post-title" className="block text-xs font-semibold text-[#241D18]">
              Название лота *
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: '' }));
              }}
              placeholder="Например: Покорение Марса + дополнение Пролог"
              className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] placeholder:text-[#9A8B7C] focus:outline-none focus:border-[#B04623] focus:ring-2 focus:ring-[#B04623]/15"
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-700 font-medium">{fieldErrors.title}</p>
            )}
          </div>

          {/* Category + Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="post-category" className="block text-xs font-semibold text-[#241D18]">
                Категория *
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] focus:outline-none focus:border-[#B04623]"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="post-condition" className="block text-xs font-semibold text-[#241D18]">
                Состояние *
              </label>
              <select
                id="post-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] focus:outline-none focus:border-[#B04623]"
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap For + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7 space-y-1.5">
              <label htmlFor="post-swap-for" className="block text-xs font-semibold text-[#241D18]">
                Что ищете для обмена *
              </label>
              <input
                id="post-swap-for"
                type="text"
                value={swapFor}
                onChange={(e) => {
                  setSwapFor(e.target.value);
                  if (fieldErrors.swap_for) setFieldErrors((p) => ({ ...p, swap_for: '' }));
                }}
                placeholder="Например: Scythe, Дюна или 35мм камера"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] placeholder:text-[#9A8B7C] focus:outline-none focus:border-[#B04623] focus:ring-2 focus:ring-[#B04623]/15"
              />
              {fieldErrors.swap_for && (
                <p className="text-xs text-red-700 font-medium">{fieldErrors.swap_for}</p>
              )}
            </div>

            <div className="sm:col-span-5 space-y-1.5">
              <label htmlFor="post-price" className="block text-xs font-semibold text-[#241D18]">
                Оценка / выкуп (сом) *
              </label>
              <input
                id="post-price"
                type="number"
                min={100}
                step={50}
                value={priceKgs}
                onChange={(e) => {
                  setPriceKgs(e.target.value);
                  if (fieldErrors.price_kgs) setFieldErrors((p) => ({ ...p, price_kgs: '' }));
                }}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] tabular-nums focus:outline-none focus:border-[#B04623] focus:ring-2 focus:ring-[#B04623]/15"
              />
              {fieldErrors.price_kgs && (
                <p className="text-xs text-red-700 font-medium">{fieldErrors.price_kgs}</p>
              )}
            </div>
          </div>

          {/* Seller Name + Campus Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="post-seller" className="block text-xs font-semibold text-[#241D18]">
                Имя продавца *
              </label>
              <input
                id="post-seller"
                type="text"
                value={sellerName}
                onChange={(e) => {
                  setSellerName(e.target.value);
                  if (fieldErrors.seller_name) setFieldErrors((p) => ({ ...p, seller_name: '' }));
                }}
                placeholder="Тилек А."
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] focus:outline-none focus:border-[#B04623]"
              />
              {fieldErrors.seller_name && (
                <p className="text-xs text-red-700 font-medium">{fieldErrors.seller_name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="post-zone" className="block text-xs font-semibold text-[#241D18]">
                Точка встречи в Бишкеке *
              </label>
              <select
                id="post-zone"
                value={campusZone}
                onChange={(e) => setCampusZone(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] focus:outline-none focus:border-[#B04623]"
              >
                {CAMPUS_ZONE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Urgency Badge */}
          <div className="space-y-1.5">
            <label htmlFor="post-urgency" className="block text-xs font-semibold text-[#241D18]">
              Метка актуальности (необязательно)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {['Горячий обмен', 'Редкое издание', 'Олимпиада-80', 'Срочный обмен'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setUrgencyBadge(urgencyBadge === tag ? '' : tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    urgencyBadge === tag
                      ? 'bg-[#B04623] text-white border-[#B04623]'
                      : 'bg-[#FAF7F2] text-[#6C5E52] border-[#E6DDD0] hover:border-[#C9BBA8]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              id="post-urgency"
              type="text"
              value={urgencyBadge}
              onChange={(e) => setUrgencyBadge(e.target.value)}
              placeholder="Или введите свою метку"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-sm text-[#241D18] placeholder:text-[#9A8B7C] focus:outline-none focus:border-[#B04623]"
            />
          </div>

          {/* Image Preset Picker + Custom URL */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#241D18] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#B04623]" />
                <span>Фотография предмета</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {CURATED_LISTING_IMAGES.map((preset) => {
                const selected = imageUrl === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`rounded-xl border p-1.5 text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-[#B04623] ring-2 ring-[#B04623]/20 bg-[#FDF4F0]'
                        : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9BBA8]'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden mb-1">
                      <ListingImage
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="block text-[11px] font-medium text-[#241D18] truncate">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <label htmlFor="post-image-url" className="block text-[11px] text-[#6C5E52] mb-1">
                Или вставьте прямую ссылку на изображение
              </label>
              <input
                id="post-image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/src/assets/images/..."
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D8CCB9] text-xs text-[#241D18] font-mono focus:outline-none focus:border-[#B04623]"
              />
            </div>
          </div>

          {submitError && (
            <div
              role="alert"
              className="bg-[#FDF2EE] border border-[#E8B8A7] rounded-xl p-3.5 flex items-start gap-3 text-xs sm:text-sm text-[#96391A]"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Не удалось опубликовать лот</p>
                <p className="mt-0.5">{submitError}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#B04623] hover:bg-[#96391A] disabled:opacity-65 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Сохраняем в Supabase...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Опубликовать в ленте Бишкека</span>
              </>
            )}
          </button>
        </form>

        {/* Live Card Preview Column */}
        <aside className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#6C5E52]">
            Предпросмотр карточки в ленте
          </div>

          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-3.5">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DC]">
              <ListingImage
                src={imageUrl}
                alt={title || 'Предпросмотр лота'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#2C5A43] text-[11px] font-semibold">
                  {condition}
                </span>
                {urgencyBadge.trim() && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#B04623] text-white text-[11px] font-semibold">
                    {urgencyBadge}
                  </span>
                )}
              </div>
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#241D18]/85 text-white text-[11px] font-medium flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#E8B8A7]" />
                <span>{campusZone}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-[#241D18]">
                {title.trim() || 'Название вашего коллекционного лота'}
              </h3>
              <p className="text-xs text-[#6C5E52] flex items-center gap-1.5">
                <span className="font-semibold text-[#241D18]">{sellerName || 'Тилек А.'}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#2C5A43]" />
                <span>·</span>
                <span>{category}</span>
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E6DDD0] rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <ArrowLeftRight className="w-4 h-4 text-[#B04623] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-[#6C5E52]">Ищет для обмена</div>
                  <div className="text-xs font-semibold text-[#241D18] truncate">
                    {swapFor.trim() || 'Укажите желаемый предмет'}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-[#6C5E52]">Или выкуп</div>
                <div className="font-display text-base font-bold text-[#B04623] tabular-nums">
                  {formatKgsPrice(Number(priceKgs || 0))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
