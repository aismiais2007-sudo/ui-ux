import { useState } from 'react';
import {
  CheckCircle2,
  Heart,
  MapPin,
  Plus,
  QrCode,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { COLLECTOR_AVATAR_URL } from '../lib/supabaseClient';
import { formatKgsPrice, type Listing } from '../utils/listings';
import { ListingImage } from './ListingImage';

interface ProfileScreenProps {
  listings: Listing[];
  wishlistIds: Set<string>;
  onSelectListing: (listing: Listing) => void;
  onOpenPostForm: () => void;
}

export function ProfileScreen({
  listings,
  wishlistIds,
  onSelectListing,
  onOpenPostForm,
}: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'vault' | 'wishlist'>('vault');
  const [showQrModal, setShowQrModal] = useState(false);

  const wishlistedItems = listings.filter((item) => wishlistIds.has(item.id));
  const vaultItems = listings.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display italic text-xl sm:text-2xl font-semibold text-[#241D18]">
          Паспорт коллекционера Find&amp;Swap KG
        </h1>
        <button
          type="button"
          onClick={() => setShowQrModal((prev) => !prev)}
          aria-label="Показать QR-код паспорта"
          className="min-w-[44px] min-h-[44px] px-3 rounded-xl bg-white border border-[#E6DDD0] text-[#241D18] hover:border-[#C9BBA8] inline-flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-[#B04623]" />
          <span className="hidden sm:inline">QR-паспорт</span>
        </button>
      </div>

      {showQrModal && (
        <div className="bg-[#FAF7F2] border border-[#E6DDD0] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E6DDD0] flex items-center justify-center">
              <QrCode className="w-7 h-7 text-[#241D18]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#241D18]">
                Ex Libris № 1849 · Тилек Асанов
              </p>
              <p className="text-xs text-[#6C5E52]">
                Предъявите код партнеру в Sierra Coffee для разблокировки эскроу MBank.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowQrModal(false)}
            className="text-xs font-semibold text-[#B04623] cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      )}

      {/* Collector Identity Card */}
      <div className="bg-white border border-[#E6DDD0] rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#E6DDD0] bg-[#EFE8DC] shrink-0">
            <ListingImage
              src={COLLECTOR_AVATAR_URL}
              alt="Тилек Асанов"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-[#241D18]">Тилек Асанов</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAF1EC] text-[#2C5A43] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Верификация Түндүк
              </span>
            </div>
            <p className="text-xs italic text-[#6C5E52]">
              В сообществе с окт. 2023 · Ex Libris № 1849
            </p>
            <p className="text-xs text-[#241D18] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B04623]" />
              <span>Бишкек, Восток-5 (район пл. Победы)</span>
            </p>
          </div>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E6DDD0] rounded-xl p-3.5">
          <p className="text-sm font-semibold text-[#241D18]">
            Мастер-коллекционер и эксперт обмена (Ур. 4)
          </p>
          <p className="text-xs text-[#6C5E52] mt-0.5">
            Топ 5% проверенных участников Бишкека
          </p>
        </div>
      </div>

      {/* Trust Matrix */}
      <div className="bg-white border border-[#E6DDD0] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-[#241D18]">
            Матрица доверия коллекционера
          </h2>
          <span className="px-2.5 py-1 rounded-lg bg-[#EAF1EC] text-[#2C5A43] text-xs font-semibold">
            Эскроу 1-го уровня
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center border border-[#EFE8DC] rounded-xl p-3 bg-[#FAF7F2]">
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold text-[#B04623] tabular-nums inline-flex items-center gap-1">
              <span>4.9</span>
              <Star className="w-4 h-4 fill-[#B04623]" />
            </div>
            <div className="text-[11px] text-[#6C5E52]">54 отзыва</div>
          </div>
          <div className="border-x border-[#E6DDD0]">
            <div className="font-display text-xl sm:text-2xl font-bold text-[#2C5A43] tabular-nums">
              100%
            </div>
            <div className="text-[11px] text-[#6C5E52]">Пунктуальность</div>
          </div>
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold text-[#241D18] tabular-nums">
              0
            </div>
            <div className="text-[11px] text-[#6C5E52]">Споров (Чисто)</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            'Телефон +996 подтвержден',
            'Telegram привязан',
            'Паспорт КР верифицирован',
          ].map((check) => (
            <span
              key={check}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E6DDD0] text-xs font-medium text-[#241D18]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2C5A43]" />
              <span>{check}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Vault vs Wishlist Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-xl bg-[#EFE8DC] border border-[#E6DDD0]">
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-white text-[#B04623] shadow-sm'
                  : 'text-[#6C5E52] hover:text-[#241D18]'
              }`}
            >
              Хранилище обмена ({vaultItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wishlist')}
              className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === 'wishlist'
                  ? 'bg-white text-[#B04623] shadow-sm'
                  : 'text-[#6C5E52] hover:text-[#241D18]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Вишлист ({wishlistedItems.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenPostForm}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-[#B04623] hover:bg-[#96391A] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Разместить новый лот</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {(activeTab === 'vault' ? vaultItems : wishlistedItems).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E6DDD0] rounded-2xl p-3.5 flex gap-3 items-start"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EFE8DC] shrink-0">
                <ListingImage
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectListing(item)}
                  className="text-left font-display text-sm font-semibold text-[#241D18] hover:text-[#B04623] line-clamp-2 cursor-pointer"
                >
                  {item.title}
                </button>
                <p className="text-xs text-[#6C5E52] truncate">
                  Ищет: <span className="font-semibold text-[#B04623]">{item.swap_for}</span>
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-[#241D18] tabular-nums">
                    {formatKgsPrice(item.price_kgs)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectListing(item)}
                    className="text-xs font-semibold text-[#B04623] hover:underline cursor-pointer"
                  >
                    Открыть →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'wishlist' && wishlistedItems.length === 0 && (
          <div className="bg-white border border-[#E6DDD0] rounded-2xl p-6 text-center text-sm text-[#6C5E52]">
            Вы пока не добавили лоты в вишлист. Нажмите на сердечко в ленте, чтобы сохранить интересные обмены.
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#241D18]">
            Последние отзывы по обменам в Бишкеке
          </h2>
          <span className="text-xs font-semibold text-[#B04623] whitespace-nowrap">Все 54</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <blockquote className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold text-[#241D18]">
                <Star className="w-3.5 h-3.5 fill-[#B04623] text-[#B04623]" />
                <span>5.0</span>
              </div>
              <span className="text-[11px] font-semibold text-[#2C5A43]">Проверенный обмен</span>
            </div>
            <p className="font-display italic text-sm text-[#241D18] leading-relaxed">
              «Встретились в Sierra Coffee на Манаса. Настолки у Тилека в идеальном состоянии! Даже положил комплект премиум-протекторов.»
            </p>
            <footer className="text-xs text-[#6C5E52] flex justify-between">
              <span className="font-semibold text-[#241D18]">Бермет К.</span>
              <span>2 дня назад · Обмен настолками</span>
            </footer>
          </blockquote>

          <blockquote className="bg-white border border-[#E6DDD0] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold text-[#241D18]">
                <Star className="w-3.5 h-3.5 fill-[#B04623] text-[#B04623]" />
                <span>5.0</span>
              </div>
              <span className="text-[11px] font-semibold text-[#2C5A43]">Проверенный обмен</span>
            </div>
            <p className="font-display italic text-sm text-[#241D18] leading-relaxed">
              «Отличный и быстрый обмен редкими историческими книгами. Пунктуальный, вежливый и аккуратный. Рекомендую в Бишкеке.»
            </p>
            <footer className="text-xs text-[#6C5E52] flex justify-between">
              <span className="font-semibold text-[#241D18]">Александр П.</span>
              <span>1 неделю назад · Книжный обмен</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
