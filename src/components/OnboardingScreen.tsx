import { useState, type FormEvent } from 'react';
import { ArrowRight, Coffee, Handshake, Lock, ShieldCheck, X } from 'lucide-react';
import { ListingImage } from './ListingImage';

interface OnboardingScreenProps {
  onComplete: (phone?: string) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [phone, setPhone] = useState('700 123-456');
  const [phoneError, setPhoneError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) {
      setPhoneError('Введите корректный 9-значный номер Кыргызстана.');
      return;
    }
    setPhoneError('');
    onComplete(`+996 ${phone.trim()}`);
  };

  return (
    <div className="bg-[#FAF7F2] text-[#241D18] flex flex-col">
      <header className="w-full px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#6C5E52]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B04623]" aria-hidden="true" />
          <span>Знакомство</span>
        </div>
        <button
          type="button"
          onClick={() => onComplete()}
          aria-label="Пропустить знакомство"
          className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#6C5E52] hover:text-[#241D18] hover:border-[#C9BBA8] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      <div className="w-full px-4 mb-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-1 rounded-full bg-[#B04623]" />
          <div className="h-1 rounded-full bg-[#E6DDD0]" />
          <div className="h-1 rounded-full bg-[#E6DDD0]" />
        </div>
      </div>

      <main className="flex-1 w-full px-4 pb-8">
        <div className="grid grid-cols-1 gap-6 items-start">
          {/* Editorial showcase */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E6DDD0] rounded-2xl p-2 shadow-sm">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#EFE8DC]">
                <ListingImage
                  src="/src/assets/images/bishkek_zenit_camera_1795166953888.jpg"
                  alt="Винтажная камера Зенит и редкие книги в Бишкеке"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border border-[#E6DDD0] rounded-lg px-3 py-1.5 text-xs font-medium text-[#241D18] shadow-sm">
                  Активно в Бишкеке
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-center">
              <p className="text-[11px] font-semibold tracking-wider uppercase text-[#6C5E52]">
                KG · Гильдия коллекционеров Бишкека
              </p>
              <h1 className="font-display text-2xl font-semibold leading-tight text-[#241D18] [text-wrap:balance]">
                Обменивайте редкие находки с проверенными соседями.
              </h1>
              <p className="font-display italic text-sm text-[#6C5E52] leading-relaxed">
                Присоединяйтесь к 4 200+ надежным коллекционерам, любителям настолок и книг в Бишкеке.
              </p>
            </div>
          </div>

          {/* Trust cards & phone onboarding */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E6DDD0] rounded-2xl divide-y divide-[#EFE8DC]">
              <div className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EAF1EC] text-[#2C5A43] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-[#241D18]">
                    100% верификация по номеру и ID
                  </h2>
                  <p className="text-sm text-[#6C5E52] mt-1 leading-relaxed">
                    Только настоящие энтузиасты. Защита от мошенников через паспорт КР и eKYC (Түндүк).
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8EAE3] text-[#B04623] flex items-center justify-center shrink-0">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-[#241D18]">
                    0 сом комиссии за прямой обмен
                  </h2>
                  <p className="text-sm text-[#6C5E52] mt-1 leading-relaxed">
                    Обменивайтесь винтажными камерами, винилом и настольными играми без комиссий платформы.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#5B4D41] flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-[#241D18]">
                    Безопасные общественные зоны
                  </h2>
                  <p className="text-sm text-[#6C5E52] mt-1 leading-relaxed">
                    Рекомендуемые места встреч: Sierra Coffee, бульвар Эркиндик, Asia Mall и Bellagio.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-[#E6DDD0] rounded-2xl p-4 sm:p-5 space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="onboarding-phone"
                  className="font-display text-sm font-semibold text-[#241D18]"
                >
                  Номер телефона
                </label>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B04623]">
                  Быстрый SMS-код
                </span>
              </div>

              <div className="flex items-stretch rounded-xl border border-[#D8CCB9] bg-[#FAF7F2] focus-within:border-[#B04623] focus-within:ring-2 focus-within:ring-[#B04623]/15 overflow-hidden">
                <span className="px-3.5 flex items-center text-sm font-semibold text-[#241D18] border-r border-[#E6DDD0] bg-[#F4EFE6] tabular-nums">
                  KG +996
                </span>
                <input
                  id="onboarding-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="700 123-456"
                  className="flex-1 px-3.5 py-3 bg-transparent text-sm font-medium text-[#241D18] placeholder:text-[#9A8B7C] focus:outline-none tabular-nums"
                />
              </div>

              {phoneError && (
                <p className="text-xs font-medium text-red-700" role="alert">
                  {phoneError}
                </p>
              )}

              <p className="flex items-center gap-2 text-xs text-[#6C5E52]">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Верификация занимает 45 секунд · Номер не публикуется в профиле.</span>
              </p>

              <button
                type="submit"
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#B04623] hover:bg-[#96391A] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Вступить в гильдию коллекционеров</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => onComplete()}
                  className="text-xs text-[#6C5E52] hover:text-[#241D18] cursor-pointer py-1 px-2"
                >
                  Уже есть аккаунт?{' '}
                  <span className="font-semibold text-[#B04623] underline underline-offset-4">
                    Войти в ленту
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
