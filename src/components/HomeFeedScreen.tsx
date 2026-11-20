import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  Heart,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import {
  CAMPUS_ZONE_OPTIONS,
  CATEGORY_OPTIONS,
  filterListings,
  formatKgsPrice,
  type Listing,
} from '../utils/listings';
import { ListingImage } from './ListingImage';

interface HomeFeedScreenProps {
  listings: Listing[];
  isLoading: boolean;
  dataSource: 'supabase' | 'fallback-empty' | 'fallback-error';
  loadError?: string;
  wishlistIds: Set<string>;
  wishlistOnly: boolean;
  onRefresh: () => void;
  onToggleWishlist: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
  onOpenChatForListing: (listing: Listing) => void;
  onOpenPostForm: () => void;
  onClearWishlistFilter: () => void;
}

export function HomeFeedScreen({
  listings,
  isLoading,
  dataSource,
  loadError,
  wishlistIds,
  wishlistOnly,
  onRefresh,
  onToggleWishlist,
  onSelectListing,
  onOpenChatForListing,
  onOpenPostForm,
  onClearWishlistFilter,
}: HomeFeedScreenProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все обмены');
  const [selectedZone, setSelectedZone] = useState('Все зоны');
  const [showZoneDrawer, setShowZoneDrawer] = useState(false);
  const [showMapOverview, setShowMapOverview] = useState(false);

  const filtered = filterListings(listings, {
    query,
    category: selectedCategory,
    zone: selectedZone,
    wishlistOnly,
    wishlistIds,
  });

  const categories = ['Все обмены', ...CATEGORY_OPTIONS];

  return (
    <div className="space-y-5">
      {/* Location & filter controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowZoneDrawer((prev) => !prev)}
            className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E6DDD0] text-sm font-medium text-[#241D18] hover:border-[#C9BBA8] transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#B04623] shrink-0" />
            <span className="truncate max-w-[230px]">
              {selectedZone === 'Все зоны' ? 'Бишкек: Эркиндик и центр' : selectedZone}
            </span>
          </button>

          {showZoneDrawer && (
            <div className="absolute left-0 mt-2 w-72 bg-white border border-[#E6DDD0] rounded-2xl shadow-lg p-2 z-30">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#6C5E52]">
                Безопасные зоны Бишкека
              </div>
              {['Все зоны', ...CAMPUS_ZONE_OPTIONS].map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => {
                    setSelectedZone(zone);
                    setShowZoneDrawer(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                    selectedZone === zone
                      ? 'bg-[#B04623] text-white font-semibold'
                      : 'text-[#241D18] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {zone === 'Все зоны' ? 'Все районы Бишкека' : zone}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Обновить ленту из Supabase"
            className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E6DDD0] text-xs font-semibold text-[#241D18] hover:border-[#C9BBA8] disabled:opacity-60 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Обновить</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMapOverview((prev) => !prev)}
            className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showMapOverview
                ? 'bg-[#241D18] text-white border-[#241D18]'
                : 'bg-white text-[#241D18] border-[#E6DDD0] hover:border-[#C9BBA8]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>На карте</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8C7B6B] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          aria-label="Поиск настольных игр, редких книг и винтажа"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск настольных игр, редких книг, винтажа..."
          className="w-full min-h-[48px] pl-11 pr-11 py-3 rounded-2xl bg-white border border-[#E6DDD0] text-sm text-[#241D18] placeholder:text-[#9A8B7C] focus:outline-none focus:border-[#B04623] focus:ring-2 focus:ring-[#B04623]/15"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Очистить поиск"
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#6C5E52] hover:text-[#241D18] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category filter buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                active
                  ? 'bg-[#B04623] text-white border-[#B04623]'
                  : 'bg-white text-[#241D18] border-[#E6DDD0] hover:border-[#C9BBA8]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Live ticker banner */}
      <div className="bg-[#F4EFE6] border border-[#E6DDD0] rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="text-[11px] font-semibold tracking-wider uppercase text-[#2C5A43]">
            Живые обмены в Бишкеке
          </div>
          <p className="text-xs sm:text-sm text-[#241D18] truncate">
            <span className="font-semibold">Арсен</span> обменял{' '}
            <span className="font-semibold text-[#B04623]">Catan</span> на{' '}
            <span className="font-semibold">Wingspan</span> в Sierra Coffee
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#241D18] bg-white border border-[#E6DDD0] rounded-lg px-2.5 py-1.5 tabular-nums shrink-0">
          <Star className="w-3.5 h-3.5 fill-[#B04623] text-[#B04623]" />
          <span>4.9 (1.2k)</span>
        </div>
      </div>

      {/* Map overview drawer when toggled */}
      {showMapOverview && (
        <section
          aria-label="Безопасные зоны встреч в Бишкеке"
          className="bg-white border border-[#E6DDD0] rounded-2xl p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#241D18]">
              Точки безопасного обмена в Бишкеке
            </h2>
            <button
              type="button"
              onClick={() => setShowMapOverview(false)}
              className="text-xs font-semibold text-[#B04623] cursor-pointer"
            >
              Скрыть
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {CAMPUS_ZONE_OPTIONS.map((zone) => {
              const count = listings.filter((l) => l.campus_zone === zone).length;
              const isSelected = selectedZone === zone;
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(isSelected ? 'Все зоны' : zone)}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'border-[#B04623] bg-[#F8EAE3]'
                      : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9BBA8]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[#241D18] truncate">{zone}</span>
                  <span className="text-xs font-mono text-[#6C5E52] tabular-nums shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Supabase status / error feedback */}
      {dataSource === 'fallback-error' && loadError && (
        <div
          role="alert"
          className="bg-[#FDF2EE] border border-[#E8B8A7] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#B04623] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-[#241D18]">
              <p className="font-semibold">Ошибка синхронизации с базой данных</p>
              <p className="text-[#6C5E52] mt-0.5">
                {loadError}. Показаны локальные объявления Бишкека.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#B04623] text-white text-xs font-semibold cursor-pointer"
          >
            Повторить
          </button>
        </div>
      )}

      {dataSource === 'fallback-empty' && (
        <div className="bg-white border border-[#E6DDD0] rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#6C5E52]">
            Показана витрина Бишкека (в таблице <span className="font-mono">listings</span> пока 0 записей — опубликуйте первый лот через «+»).
          </p>
          <button
            type="button"
            onClick={onOpenPostForm}
            className="text-xs font-semibold text-[#B04623] hover:underline cursor-pointer shrink-0"
          >
            Добавить первый лот →
          </button>
        </div>
      )}

      {/* Section Heading */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-baseline gap-3 min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#241D18]">
            {wishlistOnly ? 'Ваш вишлист' : 'Проверенные обмены сообщества'}
          </h1>
          <span className="text-xs font-medium text-[#6C5E52] tabular-nums whitespace-nowrap shrink-0">
            {filtered.length} рядом
          </span>
        </div>
        {wishlistOnly && (
          <button
            type="button"
            onClick={onClearWishlistFilter}
            className="text-xs font-semibold text-[#B04623] hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            Показать все
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] rounded-xl bg-[#EFE8DC]" />
              <div className="h-5 w-3/4 rounded bg-[#EFE8DC]" />
              <div className="h-4 w-1/2 rounded bg-[#EFE8DC]" />
              <div className="h-12 rounded-xl bg-[#EFE8DC]" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E6DDD0] rounded-2xl p-6 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#241D18]">
            {wishlistOnly
              ? 'В вашем вишлисте пока пусто'
              : 'По вашему запросу ничего не найдено'}
          </p>
          <p className="text-sm text-[#6C5E52] max-w-md mx-auto">
            {wishlistOnly
              ? 'Отмечайте понравившиеся настольные игры, редкие книги и камеры сердечком, чтобы вернуться к ним позже.'
              : 'Попробуйте сбросить фильтры или разместите свой запрос на обмен в Бишкеке.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('Все обмены');
                setSelectedZone('Все зоны');
                if (wishlistOnly) onClearWishlistFilter();
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] text-xs font-semibold text-[#241D18] cursor-pointer"
            >
              Сбросить фильтры
            </button>
            <button
              type="button"
              onClick={onOpenPostForm}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#B04623] text-white text-xs font-semibold cursor-pointer"
            >
              Разместить лот
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="listings-grid"
          className="grid grid-cols-1 gap-4"
        >
          {filtered.map((item) => {
            const isSaved = wishlistIds.has(item.id);
            return (
              <article
                key={item.id}
                className="bg-white border border-[#E6DDD0] rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-[#C9BBA8] transition-colors"
              >
                <div className="space-y-3.5">
                  {/* Photo block */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DC]">
                    <button
                      type="button"
                      onClick={() => onSelectListing(item)}
                      aria-label={`Открыть карточку: ${item.title}`}
                      className="block w-full h-full cursor-pointer text-left"
                    >
                      <ListingImage
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />
                    </button>

                    {/* Top compact labels */}
                    <div className="absolute top-2.5 left-2.5 right-14 flex items-center gap-1.5 pointer-events-none overflow-hidden">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#2C5A43] text-[11px] font-semibold shadow-sm truncate">
                        {item.condition}
                      </span>
                      {item.urgency_badge && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#B04623] text-white text-[11px] font-semibold shadow-sm whitespace-nowrap shrink-0">
                          {item.urgency_badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist button */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(item.id)}
                      aria-label={
                        isSaved
                          ? `Убрать "${item.title}" из вишлиста`
                          : `Добавить "${item.title}" в вишлист`
                      }
                      aria-pressed={isSaved}
                      className="absolute top-2 right-2 min-w-[38px] min-h-[38px] rounded-full bg-white/95 border border-[#E6DDD0] flex items-center justify-center text-[#241D18] hover:scale-105 transition-transform cursor-pointer shadow-sm"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isSaved ? 'fill-[#B04623] text-[#B04623]' : 'text-[#6C5E52]'
                        }`}
                      />
                    </button>

                    {/* Bottom zone caption */}
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-[#241D18]/85 text-white text-[11px] font-medium flex items-center gap-1.5 pointer-events-none max-w-[calc(100%-20px)]">
                      <MapPin className="w-3 h-3 shrink-0 text-[#E8B8A7]" />
                      <span className="truncate">{item.campus_zone}</span>
                    </div>
                  </div>

                  {/* Title & seller metadata */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectListing(item)}
                      className="text-left w-full cursor-pointer group"
                    >
                      <h2 className="font-display text-lg font-semibold text-[#241D18] group-hover:text-[#B04623] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h2>
                    </button>

                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#6C5E52]">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#241D18]">
                        {item.seller_name}
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2C5A43]" />
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#241D18] tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#B04623] text-[#B04623]" />
                        {item.seller_rating.toFixed(2).replace(/\.00$/, '.0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* Swap target & Price + CTAs */}
                <div className="space-y-3 pt-1">
                  <div className="bg-[#FAF7F2] border border-[#E6DDD0] rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#F8EAE3] text-[#B04623] flex items-center justify-center shrink-0">
                        <ArrowLeftRight className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] text-[#6C5E52]">Ищет для обмена</div>
                        <div className="text-xs font-semibold text-[#241D18] truncate">
                          {item.swap_for}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-[#6C5E52]">Или выкуп</div>
                      <div className="font-display text-base font-bold text-[#B04623] tabular-nums whitespace-nowrap">
                        {formatKgsPrice(item.price_kgs)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectListing(item)}
                      className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#B04623] hover:bg-[#96391A] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ArrowLeftRight className="w-4 h-4 shrink-0" />
                      <span>Предложить обмен</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenChatForListing(item)}
                      aria-label={`Написать продавцу ${item.seller_name}`}
                      className="min-w-[44px] min-h-[44px] rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9BBA8] text-[#241D18] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
