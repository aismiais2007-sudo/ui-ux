import { useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  BadgeCheck,
  Check,
  Clock,
  Heart,
  Share2,
  ShieldCheck,
  Star,
  Store,
  Zap,
} from 'lucide-react';
import { COLLECTOR_AVATAR_URL } from '../lib/supabaseClient';
import { formatCompactKgsPrice, formatKgsPrice, type Listing } from '../utils/listings';
import { ListingImage } from './ListingImage';

interface ListingDetailScreenProps {
  listing: Listing;
  isWishlisted: boolean;
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  onProposeSwap: (listing: Listing, mode: 'swap' | 'buy') => void;
}

export function ListingDetailScreen({
  listing,
  isWishlisted,
  onBack,
  onToggleWishlist,
  onProposeSwap,
}: ListingDetailScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${listing.title} — ${formatKgsPrice(listing.price_kgs)} (${listing.campus_zone})`
        );
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Detail Sub-Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6DDD0] text-xs font-semibold text-[#241D18] hover:border-[#C9BBA8] transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <div className="font-display italic text-base text-[#241D18] truncate">
          Архивная карточка
        </div>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Поделиться ссылкой на лот"
          className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl bg-white border border-[#E6DDD0] text-xs font-semibold text-[#241D18] hover:border-[#C9BBA8] inline-flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-[#2C5A43]" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main stacked 390px editorial layout */}
      <div className="grid grid-cols-1 gap-4 items-start">
        {/* Photo & Seller */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-2.5">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DC]">
              <ListingImage
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#241D18]/80 text-white text-xs font-mono tabular-nums">
                1 / 4
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/95 border border-[#E6DDD0] text-xs font-semibold text-[#2C5A43]">
                {listing.condition}
              </div>
              <button
                type="button"
                onClick={() => onToggleWishlist(listing.id)}
                aria-label={isWishlisted ? 'Убрать из вишлиста' : 'Добавить в вишлист'}
                aria-pressed={isWishlisted}
                className="absolute bottom-3 right-3 min-w-[44px] min-h-[44px] rounded-xl bg-white/95 border border-[#E6DDD0] flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-[#B04623] text-[#B04623]' : 'text-[#6C5E52]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Urgency Notice */}
          <div className="bg-[#FDF4F0] border border-[#EED3C7] rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#B04623] text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#96391A]">
                3 коллекционера предложили обмен за последние 2 часа
              </p>
              <p className="text-[11px] text-[#8C5846] mt-0.5">
                Редкий экземпляр в Бишкеке · Категория: {listing.category}
              </p>
            </div>
          </div>

          {/* Primary Item Info */}
          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-3.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h1 className="font-display text-2xl font-semibold text-[#241D18] leading-snug [text-wrap:balance]">
                {listing.title}
              </h1>
              {listing.urgency_badge && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FDF4F0] border border-[#EED3C7] text-[10px] font-semibold uppercase tracking-wider text-[#B04623] shrink-0">
                  {listing.urgency_badge}
                </span>
              )}
            </div>

            <div className="border-t border-[#EFE8DC] pt-3 space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-[#B04623] tabular-nums">
                  {formatKgsPrice(listing.price_kgs)}
                </span>
                <span className="text-xs text-[#6C5E52]">оценочная стоимость для обмена</span>
              </div>
              <p className="flex items-center gap-2 text-xs text-[#2C5A43] font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Приоритет прямому обмену или мгновенный выкуп за наличные</span>
              </p>
            </div>
          </div>

          {/* Seller verification card */}
          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#EFE8DC] border border-[#E6DDD0] shrink-0">
                  <ListingImage
                    src={COLLECTOR_AVATAR_URL}
                    alt={listing.seller_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-base font-semibold text-[#241D18] truncate">
                      {listing.seller_name}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-[#B04623] shrink-0" />
                  </div>
                  <p className="text-xs text-[#6C5E52]">
                    Ранг: <span className="font-semibold text-[#241D18]">Мастер обмена (Ур. 4)</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DDD0] text-xs font-bold text-[#241D18] tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-[#B04623] text-[#B04623]" />
                  <span>{listing.seller_rating.toFixed(2).replace(/\.00$/, '.0')}</span>
                </div>
                <div className="text-[11px] text-[#6C5E52] mt-1 tabular-nums">34 сделки</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#6C5E52] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-[#241D18] truncate">Отвечает ~10 мин</div>
                  <div className="text-[10px] text-[#6C5E52]">Высокая скорость</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2C5A43] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-[#241D18] truncate">Проверен</div>
                  <div className="text-[10px] text-[#6C5E52]">e-KYC Түндүк</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desired Swap Card */}
          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-[#B04623]" />
              <h2 className="font-display text-base font-semibold text-[#241D18]">
                Желаемый обмен от владельца
              </h2>
            </div>
            <p className="text-xs text-[#6C5E52]">
              {listing.seller_name} принимает предложения строго по этим позициям:
            </p>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] text-xs font-semibold text-[#241D18]">
                {listing.swap_for}
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] text-xs font-semibold text-[#241D18] tabular-nums">
                Выкуп за {formatKgsPrice(listing.price_kgs)}
              </div>
            </div>
          </div>

          {/* Recommended Meetup Zone */}
          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDF4F0] border border-[#EED3C7] text-[#B04623] flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-sm font-semibold text-[#241D18]">
                  Рекомендованное место встречи
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#EAF1EC] text-[#2C5A43] text-[10px] font-bold tracking-wider uppercase">
                  CCTV
                </span>
              </div>
              <p className="text-xs font-semibold text-[#241D18]">{listing.campus_zone}</p>
              <p className="text-[11px] text-[#6C5E52] leading-relaxed">
                Оснащенная точка безопасного обмена со столом для осмотра и видеонаблюдением.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onProposeSwap(listing, 'buy')}
                className="min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#D8CCB9] bg-[#FAF7F2] hover:border-[#241D18] text-xs font-semibold text-[#241D18] transition-colors cursor-pointer tabular-nums whitespace-nowrap"
              >
                Купить за {formatCompactKgsPrice(listing.price_kgs)}
              </button>
              <button
                type="button"
                onClick={() => onProposeSwap(listing, 'swap')}
                className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#B04623] hover:bg-[#96391A] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4 shrink-0" />
                <span>Предложить обмен</span>
              </button>
            </div>
            <p className="text-center text-[10px] text-[#6C5E52]">
              Комиссия 0 сом · 500 сом гарантия эскроу через MBank · 100% безопасная сделка
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
