import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildListingInsertPayload,
  filterListings,
  formatCompactKgsPrice,
  formatKgsPrice,
  normalizeListing,
  validateNewListingForm,
  type Listing,
} from './listings';

const sampleListings: Listing[] = [
  {
    id: '1',
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
    created_at: '2026-11-20T08:00:00Z',
  },
  {
    id: '2',
    title: 'Чингиз Айтматов «Белый пароход» (Издание 1974 г.)',
    price_kgs: 1500,
    swap_for: 'Советская фантастика братьев Стругацких',
    category: 'Редкие книги',
    condition: 'Коллекционное состояние',
    seller_name: 'Елена В.',
    seller_rating: 5.0,
    campus_zone: 'Бульвар Эркиндик',
    urgency_badge: 'Издание СССР 1974 г.',
    image_url: '/src/assets/images/bishkek_aitmatov_book_1795166953551.jpg',
    created_at: '2026-11-19T12:00:00Z',
  },
];

test('formatKgsPrice formats Bishkek som amounts with space separators', () => {
  assert.equal(formatKgsPrice(3500), '3 500 сом');
  assert.equal(formatKgsPrice(900), '900 сом');
  assert.equal(formatCompactKgsPrice(3500), '3.5k сом');
  assert.equal(formatCompactKgsPrice(2000), '2k сом');
});

test('filterListings filters by category, search query, and wishlist', () => {
  const byCategory = filterListings(sampleListings, {
    query: '',
    category: 'Редкие книги',
    zone: 'Все зоны',
  });
  assert.equal(byCategory.length, 1);
  assert.equal(byCategory[0].id, '2');

  const byQuery = filterListings(sampleListings, {
    query: 'catan',
    category: 'Все обмены',
    zone: 'Все зоны',
  });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].seller_name, 'Айбек К.');

  const byWishlist = filterListings(sampleListings, {
    query: '',
    category: 'Все обмены',
    zone: 'Все зоны',
    wishlistOnly: true,
    wishlistIds: new Set(['2']),
  });
  assert.equal(byWishlist.length, 1);
  assert.equal(byWishlist[0].id, '2');
});

test('validateNewListingForm rejects empty required fields and accepts valid input', () => {
  const invalid = validateNewListingForm({
    title: 'ab',
    price_kgs: '50',
    swap_for: '',
    category: '',
    condition: '',
    seller_name: 'А',
    campus_zone: '',
    image_url: '',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.price_kgs);
  assert.ok(invalid.errors.swap_for);
  assert.ok(invalid.errors.category);
  assert.ok(invalid.errors.seller_name);

  const valid = validateNewListingForm({
    title: 'Покорение Марса + Пролог',
    price_kgs: '2800',
    swap_for: 'Scythe или Дюна: Империя',
    category: 'Настольные игры',
    condition: 'В идеале (в коробке)',
    seller_name: 'Тилек А.',
    campus_zone: 'Sierra Coffee (пр. Манаса)',
    urgency_badge: 'Срочный обмен',
    image_url: '/src/assets/images/bishkek_scythe_boardgame_1795166953118.jpg',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('buildListingInsertPayload and normalizeListing produce exact schema fields', () => {
  const payload = buildListingInsertPayload({
    title: '  Зенит-TTL 35мм  ',
    price_kgs: '3500',
    swap_for: 'Walkman или Warhammer 40k',
    category: 'Винтаж и камеры',
    condition: 'Отличное · Проверен',
    seller_name: 'Данияр С.',
    campus_zone: 'Киоск в парке Панфилова',
    urgency_badge: '',
    image_url: '',
  });
  assert.equal(payload.title, 'Зенит-TTL 35мм');
  assert.equal(payload.price_kgs, 3500);
  assert.equal(payload.urgency_badge, null);
  assert.ok(payload.image_url.startsWith('/src/assets/images/'));

  const normalized = normalizeListing({ id: 42, title: 'Тест', price_kgs: '1200' });
  assert.equal(normalized.id, '42');
  assert.equal(normalized.price_kgs, 1200);
  assert.equal(normalized.seller_rating, 4.9);
});
