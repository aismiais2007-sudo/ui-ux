export interface Listing {
  id: string;
  title: string;
  price_kgs: number;
  swap_for: string;
  category: string;
  condition: string;
  seller_name: string;
  seller_rating: number;
  campus_zone: string;
  urgency_badge: string | null;
  image_url: string;
  created_at: string;
}

export interface NewListingInput {
  title: string;
  price_kgs: string | number;
  swap_for: string;
  category: string;
  condition: string;
  seller_name: string;
  seller_rating?: number;
  campus_zone: string;
  urgency_badge?: string;
  image_url: string;
}

export interface ListingFilterOptions {
  query: string;
  category: string;
  zone: string;
  wishlistOnly?: boolean;
  wishlistIds?: Set<string>;
}

export const CATEGORY_OPTIONS = [
  'Настольные игры',
  'Редкие книги',
  'Винтаж и камеры',
  'Винил и аудио',
] as const;

export const CONDITION_OPTIONS = [
  'В идеале (в коробке)',
  'Коллекционное состояние',
  'Отличное · Проверен',
  'Хорошее рабочее',
] as const;

export const CAMPUS_ZONE_OPTIONS = [
  'Sierra Coffee (пр. Манаса)',
  'Бульвар Эркиндик',
  'Киоск в парке Панфилова',
  'Фудкорт Asia Mall',
  'Кофейня Bellagio (пр. Чуй)',
] as const;

export const DEFAULT_FALLBACK_IMAGE =
  '/src/assets/images/bishkek_zenit_camera_1795166953888.jpg';

export function formatKgsPrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return '0 сом';
  }
  const rounded = Math.max(0, Math.round(Number(amount)));
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} сом`;
}

export function formatCompactKgsPrice(amount: number | null | undefined): string {
  const num = Number(amount ?? 0);
  if (num >= 1000 && num % 100 === 0) {
    const k = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1);
    return `${k}k сом`;
  }
  return formatKgsPrice(num);
}

export function normalizeListing(raw: Record<string, unknown>): Listing {
  const price = Number(raw.price_kgs);
  const rating = Number(raw.seller_rating);
  return {
    id: String(raw.id ?? `tmp-${Date.now()}`),
    title: String(raw.title ?? '').trim() || 'Коллекционный лот',
    price_kgs: Number.isFinite(price) && price >= 0 ? Math.round(price) : 0,
    swap_for: String(raw.swap_for ?? '').trim() || 'Открыт к предложениям обмена',
    category: String(raw.category ?? '').trim() || 'Настольные игры',
    condition: String(raw.condition ?? '').trim() || 'Хорошее рабочее',
    seller_name: String(raw.seller_name ?? '').trim() || 'Коллекционер Бишкека',
    seller_rating:
      Number.isFinite(rating) && rating > 0 && rating <= 5 ? Number(rating.toFixed(2)) : 4.9,
    campus_zone: String(raw.campus_zone ?? '').trim() || 'Sierra Coffee (пр. Манаса)',
    urgency_badge: raw.urgency_badge ? String(raw.urgency_badge).trim() : null,
    image_url: String(raw.image_url ?? '').trim() || DEFAULT_FALLBACK_IMAGE,
    created_at: String(raw.created_at ?? new Date().toISOString()),
  };
}

export function filterListings(
  listings: Listing[],
  options: ListingFilterOptions
): Listing[] {
  const q = options.query.trim().toLowerCase();
  const cat = options.category;
  const zone = options.zone;

  return listings.filter((item) => {
    if (options.wishlistOnly && options.wishlistIds && !options.wishlistIds.has(item.id)) {
      return false;
    }
    if (cat && cat !== 'Все обмены' && item.category !== cat) {
      return false;
    }
    if (zone && zone !== 'Все зоны' && item.campus_zone !== zone) {
      return false;
    }
    if (q) {
      const haystack = [
        item.title,
        item.swap_for,
        item.category,
        item.condition,
        item.seller_name,
        item.campus_zone,
        item.urgency_badge ?? '',
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateNewListingForm(input: NewListingInput): ValidationResult {
  const errors: Record<string, string> = {};

  const title = input.title.trim();
  if (title.length < 3) {
    errors.title = 'Укажите название лота (минимум 3 символа).';
  }

  const priceNum = Number(input.price_kgs);
  if (input.price_kgs === '' || !Number.isFinite(priceNum) || priceNum < 100) {
    errors.price_kgs = 'Укажите оценочную стоимость от 100 сом.';
  } else if (priceNum > 500000) {
    errors.price_kgs = 'Максимальная оценка лота — 500 000 сом.';
  }

  const swapFor = input.swap_for.trim();
  if (swapFor.length < 2) {
    errors.swap_for = 'Укажите, на что вы готовы обменять предмет.';
  }

  if (!input.category.trim()) {
    errors.category = 'Выберите категорию.';
  }

  if (!input.condition.trim()) {
    errors.condition = 'Укажите состояние предмета.';
  }

  const sellerName = input.seller_name.trim();
  if (sellerName.length < 2) {
    errors.seller_name = 'Укажите имя продавца или ник в гильдии.';
  }

  if (!input.campus_zone.trim()) {
    errors.campus_zone = 'Выберите безопасную точку встречи в Бишкеке.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildListingInsertPayload(input: NewListingInput) {
  return {
    title: input.title.trim(),
    price_kgs: Math.round(Number(input.price_kgs)),
    swap_for: input.swap_for.trim(),
    category: input.category.trim(),
    condition: input.condition.trim(),
    seller_name: input.seller_name.trim(),
    seller_rating:
      input.seller_rating && Number.isFinite(input.seller_rating)
        ? Number(input.seller_rating)
        : 4.95,
    campus_zone: input.campus_zone.trim(),
    urgency_badge: input.urgency_badge?.trim() ? input.urgency_badge.trim() : null,
    image_url: input.image_url.trim() || DEFAULT_FALLBACK_IMAGE,
  };
}
