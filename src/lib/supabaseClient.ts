import { createClient } from '@supabase/supabase-js';
import {
  buildListingInsertPayload,
  normalizeListing,
  type Listing,
  type NewListingInput,
} from '../utils/listings';

const SUPABASE_URL = 'https://xwyugmnjtydsxbsmrunf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SLR6cviEW6TD2aiNd_loqA_MH44qJhM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const CURATED_LISTING_IMAGES = [
  {
    label: 'Зенит-TTL и винтажная техника',
    url: '/src/assets/images/bishkek_zenit_camera_1795166953888.jpg',
  },
  {
    label: 'Настольная игра Catan',
    url: '/src/assets/images/bishkek_catan_boardgame_1795166953752.jpg',
  },
  {
    label: 'Редкое книжное издание',
    url: '/src/assets/images/bishkek_aitmatov_book_1795166953551.jpg',
  },
  {
    label: 'Миниатюры и настолки Scythe',
    url: '/src/assets/images/bishkek_scythe_boardgame_1795166953118.jpg',
  },
];

export const COLLECTOR_AVATAR_URL =
  '/src/assets/images/bishkek_collector_avatar_1795166953963.jpg';

export const FALLBACK_BISHKEK_LISTINGS: Listing[] = [
  {
    id: 'bishkek-fallback-1',
    title: 'Catan: Города и Рыцари (Русское издание)',
    price_kgs: 2200,
    swap_for: 'Книга игрока D&D 5e',
    category: 'Настольные игры',
    condition: 'В идеале (в коробке)',
    seller_name: 'Айбек К.',
    seller_rating: 4.9,
    campus_zone: 'Sierra Coffee (пр. Манаса)',
    urgency_badge: 'Горячий обмен',
    image_url: '/src/assets/images/bishkek_catan_boardgame_1795166953752.jpg',
    created_at: '2026-11-20T08:30:00Z',
  },
  {
    id: 'bishkek-fallback-2',
    title: 'Чингиз Айтматов «Белый пароход» (Редкое издание 1974 г.)',
    price_kgs: 1500,
    swap_for: 'Советская фантастика братьев Стругацких',
    category: 'Редкие книги',
    condition: 'Коллекционное состояние',
    seller_name: 'Елена В.',
    seller_rating: 5.0,
    campus_zone: 'Бульвар Эркиндик',
    urgency_badge: 'Издание СССР 1974 г.',
    image_url: '/src/assets/images/bishkek_aitmatov_book_1795166953551.jpg',
    created_at: '2026-11-20T07:15:00Z',
  },
  {
    id: 'bishkek-fallback-3',
    title: 'Зенит-TTL 35мм зеркальный фотоаппарат + Гелиос-44М',
    price_kgs: 3500,
    swap_for: 'Стартовый набор Warhammer 40k или Walkman',
    category: 'Винтаж и камеры',
    condition: 'Отличное · Проверен',
    seller_name: 'Данияр С.',
    seller_rating: 4.98,
    campus_zone: 'Киоск в парке Панфилова',
    urgency_badge: 'Олимпиада-80',
    image_url: '/src/assets/images/bishkek_zenit_camera_1795166953888.jpg',
    created_at: '2026-11-19T18:40:00Z',
  },
  {
    id: 'bishkek-fallback-4',
    title: 'Scythe + металлические монеты и протекторы',
    price_kgs: 3400,
    swap_for: 'Blood Rage или Покорение Марса',
    category: 'Настольные игры',
    condition: 'В идеале (в коробке)',
    seller_name: 'Улан М.',
    seller_rating: 4.9,
    campus_zone: 'Sierra Coffee (пр. Манаса)',
    urgency_badge: '3 предложения обмена',
    image_url: '/src/assets/images/bishkek_scythe_boardgame_1795166953118.jpg',
    created_at: '2026-11-19T14:20:00Z',
  },
];

export interface FetchListingsResult {
  listings: Listing[];
  source: 'supabase' | 'fallback-empty' | 'fallback-error';
  errorMessage?: string;
}

export async function fetchListingsFromSupabase(): Promise<FetchListingsResult> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(
        'id, title, price_kgs, swap_for, category, condition, seller_name, seller_rating, campus_zone, urgency_badge, image_url, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      return {
        listings: FALLBACK_BISHKEK_LISTINGS,
        source: 'fallback-error',
        errorMessage: `Не удалось загрузить объявления из Supabase: ${error.message}`,
      };
    }

    if (!data || data.length === 0) {
      return {
        listings: FALLBACK_BISHKEK_LISTINGS,
        source: 'fallback-empty',
      };
    }

    return {
      listings: data.map((row) => normalizeListing(row as Record<string, unknown>)),
      source: 'supabase',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Сетевая ошибка при подключении к базе';
    return {
      listings: FALLBACK_BISHKEK_LISTINGS,
      source: 'fallback-error',
      errorMessage: `Не удалось подключиться к Supabase: ${message}`,
    };
  }
}

export interface CreateListingResult {
  listing: Listing | null;
  errorMessage?: string;
}

export async function createListingInSupabase(
  input: NewListingInput
): Promise<CreateListingResult> {
  try {
    const payload = buildListingInsertPayload(input);
    const { data, error } = await supabase
      .from('listings')
      .insert([payload])
      .select(
        'id, title, price_kgs, swap_for, category, condition, seller_name, seller_rating, campus_zone, urgency_badge, image_url, created_at'
      )
      .single();

    if (error) {
      return {
        listing: null,
        errorMessage: `Ошибка сохранения в Supabase: ${error.message}`,
      };
    }

    return {
      listing: normalizeListing(data as Record<string, unknown>),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Неизвестная ошибка сети';
    return {
      listing: null,
      errorMessage: `Не удалось сохранить объявление: ${message}`,
    };
  }
}
