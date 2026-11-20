import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Coffee,
  Lock,
  MapPin,
  QrCode,
  Send,
  Shield,
  Star,
} from 'lucide-react';
import { COLLECTOR_AVATAR_URL } from '../lib/supabaseClient';
import { formatKgsPrice, type Listing } from '../utils/listings';
import { ListingImage } from './ListingImage';

interface ChatMessage {
  id: string;
  sender: 'them' | 'me';
  text: string;
  time: string;
  photoUrl?: string;
  photoCaption?: string;
}

interface ChatScreenProps {
  activeListing: Listing | null;
  dealMode?: 'swap' | 'buy';
  onBack: () => void;
}

const TIME_SLOTS = [
  'Завтра, 17:30 (Время Бишкека)',
  'Завтра, 19:00 (Время Бишкека)',
  'Суббота, 14:00 (Время Бишкека)',
];

export function ChatScreen({ activeListing, dealMode = 'swap', onBack }: ChatScreenProps) {
  const sellerName = activeListing?.seller_name || 'Улан М.';
  const sellerRating = activeListing?.seller_rating || 4.9;
  const targetTitle = activeListing?.title || 'Scythe (Русское издание)';
  const targetZone = activeListing?.campus_zone || 'Sierra Coffee · пр. Манаса 57/1';
  const targetImage =
    activeListing?.image_url || '/src/assets/images/bishkek_scythe_boardgame_1795166953118.jpg';

  const [placeConfirmed, setPlaceConfirmed] = useState(false);
  const [slotIndex, setSlotIndex] = useState(0);
  const [showEscrowInfo, setShowEscrowInfo] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'them',
      text: 'Салам! Миниатюры свежепокрашены аэрографом, все карты запечатаны в протекторы Dragon Shield. Готов встретиться в Sierra завтра!',
      time: '14:13',
    },
    {
      id: 'm2',
      sender: 'them',
      text: '',
      time: '14:14',
      photoUrl: '/src/assets/images/bishkek_scythe_boardgame_1795166953118.jpg',
      photoCaption: 'Живое фото: Сегодня 14:12 · Парк Панфилова',
    },
    {
      id: 'm3',
      sender: 'me',
      text: 'Выглядит безупречно! С нетерпением жду обмена. Терраса Sierra Coffee в 17:30 отлично подходит. QR-код будет готов.',
      time: '14:18',
    },
  ]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'me',
        text: trimmed,
        time: `${hh}:${mm}`,
      },
    ]);
    setDraft('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-10">
      {/* Chat Header */}
      <div className="bg-white border border-[#E6DDD0] rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Вернуться к ленте"
            className="min-w-[40px] min-h-[40px] rounded-xl border border-[#E6DDD0] flex items-center justify-center text-[#241D18] hover:border-[#C9BBA8] cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E6DDD0] shrink-0">
            <ListingImage
              src={COLLECTOR_AVATAR_URL}
              alt={sellerName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-semibold text-[#241D18] truncate">
                {sellerName}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#B04623] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#B04623]" />
                {sellerRating.toFixed(1)}
              </span>
            </div>
            <div className="text-xs text-[#2C5A43] font-medium">В сети · Бишкек</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowEscrowInfo((prev) => !prev)}
          aria-label="Показать статус безопасной сделки"
          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#EAF1EC] text-[#2C5A43] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Эскроу MBank</span>
        </button>
      </div>

      {/* Escrow Protocol Banner */}
      <div className="bg-[#F4EFE6] border border-[#E6DDD0] rounded-2xl p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2C5A43]">
            <Shield className="w-4 h-4" />
            <span>Безопасная сделка в Бишкеке активна</span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-[#2C5A43] text-white text-[11px] font-bold tracking-wider uppercase tabular-nums">
            500 сом MBank
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#6C5E52] leading-relaxed">
          Депозит надежно заблокирован в эскроу. Разблокировка происходит по обоюдному QR-коду при встрече.
          {showEscrowInfo &&
            ' Если одна из сторон не придет в выбранную точку в Бишкеке, залог автоматически компенсирует дорогу.'}
        </p>
      </div>

      {/* Proposed Deal Card */}
      <div className="bg-white border border-[#E6DDD0] rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-base font-semibold text-[#241D18]">
            {dealMode === 'buy' ? 'Заявка на выкуп с эскроу' : 'Предложенная сделка'}
          </h2>
          <span
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${
              placeConfirmed
                ? 'bg-[#EAF1EC] text-[#2C5A43]'
                : 'bg-[#FDF4F0] text-[#B04623] border border-[#EED3C7]'
            }`}
          >
            {placeConfirmed ? 'Встреча подтверждена' : 'Ожидает подтверждения'}
          </span>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E6DDD0] rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#EFE8DC] shrink-0">
              <ListingImage
                src="/src/assets/images/bishkek_catan_boardgame_1795166953752.jpg"
                alt="Ваше предложение"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6C5E52]">
                {dealMode === 'buy' ? 'Выкупаете за' : 'Вы предлагаете'}
              </div>
              <div className="text-xs font-semibold text-[#241D18] truncate">
                {dealMode === 'buy' && activeListing
                  ? formatKgsPrice(activeListing.price_kgs)
                  : activeListing?.swap_for || 'Покорение Марса'}
              </div>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white border border-[#E6DDD0] flex items-center justify-center text-[#B04623] shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-end text-right">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6C5E52]">
                {sellerName} предлагает
              </div>
              <div className="text-xs font-semibold text-[#241D18] truncate">{targetTitle}</div>
            </div>
            <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#EFE8DC] shrink-0">
              <ListingImage
                src={targetImage}
                alt={targetTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-[#241D18]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#B04623] shrink-0" />
            <span className="font-semibold">{targetZone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6C5E52] shrink-0" />
            <span>{TIME_SLOTS[slotIndex]}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPlaceConfirmed((prev) => !prev)}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              placeConfirmed
                ? 'bg-[#2C5A43] text-white'
                : 'bg-[#B04623] hover:bg-[#96391A] text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{placeConfirmed ? 'Место подтверждено' : 'Подтвердить место'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSlotIndex((prev) => (prev + 1) % TIME_SLOTS.length)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#D8CCB9] bg-[#FAF7F2] hover:border-[#241D18] text-xs font-semibold text-[#241D18] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Перенести время</span>
          </button>
        </div>
      </div>

      {/* Verification Milestone Pill */}
      <div className="text-center space-y-2">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-[#6C5E52]">
          Сегодня · Безопасный чат гильдии
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EFE6] border border-[#E6DDD0] text-[11px] font-medium text-[#241D18]">
          <Lock className="w-3 h-3 text-[#2C5A43]" />
          <span>MBank код #KG-88392 проверен и заблокирован</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                msg.sender === 'me'
                  ? 'bg-[#B04623] text-white'
                  : 'bg-white border border-[#E6DDD0] text-[#241D18]'
              }`}
            >
              {msg.text && <p>{msg.text}</p>}
              {msg.photoUrl && (
                <div className="space-y-2">
                  <div className="relative aspect-[4/3] w-64 sm:w-72 rounded-xl overflow-hidden bg-[#EFE8DC]">
                    <ListingImage
                      src={msg.photoUrl}
                      alt={msg.photoCaption || 'Живое фото лота'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {msg.photoCaption && (
                    <div className="text-[11px] text-[#2C5A43] font-medium">
                      {msg.photoCaption}
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-[10px] text-[#6C5E52] mt-1 px-1 tabular-nums">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => sendMessage('Я уже на месте в Sierra Coffee, столик у окна!')}
          className="min-h-[40px] px-3 py-2 rounded-xl bg-white border border-[#E6DDD0] hover:border-[#B04623] text-xs font-medium text-[#241D18] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Coffee className="w-3.5 h-3.5 text-[#B04623]" />
          <span>Я в Sierra Coffee</span>
        </button>
        <button
          type="button"
          onClick={() => sendMessage('Отправляю актуальное фото комплектности.')}
          className="min-h-[40px] px-3 py-2 rounded-xl bg-white border border-[#E6DDD0] hover:border-[#B04623] text-xs font-medium text-[#241D18] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-[#6C5E52]" />
          <span>Живое фото</span>
        </button>
        <button
          type="button"
          onClick={() => sendMessage('Готов отсканировать QR-рукопожатие MBank при встрече.')}
          className="min-h-[40px] px-3 py-2 rounded-xl bg-white border border-[#E6DDD0] hover:border-[#B04623] text-xs font-medium text-[#241D18] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-[#2C5A43]" />
          <span>QR-рукопожатие</span>
        </button>
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E6DDD0] rounded-2xl p-2 flex items-center gap-2"
      >
        <input
          type="text"
          aria-label="Сообщение собеседнику"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Сообщение для ${sellerName}...`}
          className="flex-1 min-h-[44px] px-3 py-2 bg-transparent text-sm text-[#241D18] placeholder:text-[#9A8B7C] focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Отправить сообщение"
          className="min-w-[44px] min-h-[44px] px-4 rounded-xl bg-[#B04623] hover:bg-[#96391A] text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
