import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Compass,
  Heart,
  MessageSquare,
  Plus,
  User,
  X,
} from 'lucide-react';
import { ChatScreen } from './components/ChatScreen';
import { HomeFeedScreen } from './components/HomeFeedScreen';
import { ListingDetailScreen } from './components/ListingDetailScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { PhoneFrame } from './components/PhoneFrame';
import { PostListingScreen } from './components/PostListingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import {
  createListingInSupabase,
  FALLBACK_BISHKEK_LISTINGS,
  fetchListingsFromSupabase,
} from './lib/supabaseClient';
import type { Listing, NewListingInput } from './utils/listings';

type Screen = 'onboarding' | 'feed' | 'detail' | 'post' | 'chat' | 'profile';

function getInitialScreen(): Screen {
  if (typeof window === 'undefined') return 'onboarding';
  const params = new URLSearchParams(window.location.search);
  if (params.get('autostart') === '1') return 'feed';
  try {
    if (window.localStorage.getItem('findswap_onboarded') === '1') {
      return 'feed';
    }
  } catch {
    // Ignore storage access restrictions
  }
  return 'onboarding';
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(getInitialScreen);
  const [listings, setListings] = useState<Listing[]>(FALLBACK_BISHKEK_LISTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<
    'supabase' | 'fallback-empty' | 'fallback-error'
  >('fallback-empty');
  const [loadError, setLoadError] = useState<string | undefined>(undefined);

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [chatListing, setChatListing] = useState<Listing | null>(null);
  const [chatDealMode, setChatDealMode] = useState<'swap' | 'buy'>('swap');
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = window.localStorage.getItem('findswap_wishlist');
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch {
      // Ignore storage error
    }
    return new Set(['bishkek-fallback-1']);
  });
  const [statusToast, setStatusToast] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const loadListings = useCallback(async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
    }
    const res = await fetchListingsFromSupabase();
    setListings(res.listings);
    setDataSource(res.source);
    setLoadError(res.errorMessage);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const handleCompleteOnboarding = () => {
    try {
      window.localStorage.setItem('findswap_onboarded', '1');
    } catch {
      // Ignore storage error
    }
    setScreen('feed');
    scrollToTop();
  };

  const handleToggleWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        window.localStorage.setItem('findswap_wishlist', JSON.stringify(Array.from(next)));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setScreen('detail');
    scrollToTop();
  };

  const handleOpenChatForListing = (listing: Listing, mode: 'swap' | 'buy' = 'swap') => {
    setChatListing(listing);
    setChatDealMode(mode);
    setScreen('chat');
    scrollToTop();
  };

  const handleCreateListing = async (
    input: NewListingInput
  ): Promise<{ ok: boolean; error?: string }> => {
    const result = await createListingInSupabase(input);
    if (!result.listing) {
      return {
        ok: false,
        error: result.errorMessage || 'Не удалось сохранить лот в базе данных.',
      };
    }

    const created = result.listing;
    setListings((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
    setDataSource('supabase');
    setLoadError(undefined);
    setWishlistOnly(false);
    setScreen('feed');
    setStatusToast(`Лот «${created.title}» опубликован в ленте Бишкека!`);
    scrollToTop();

    void loadListings(true);

    return { ok: true };
  };

  useEffect(() => {
    if (!statusToast) return;
    const timer = setTimeout(() => setStatusToast(null), 5000);
    return () => clearTimeout(timer);
  }, [statusToast]);

  const navigateTo = useCallback(
    (nextScreen: Screen, options?: { wishlist?: boolean }) => {
      if (options?.wishlist !== undefined) {
        setWishlistOnly(options.wishlist);
      }
      setScreen(nextScreen);
      scrollToTop();
    },
    [scrollToTop]
  );

  if (screen === 'onboarding') {
    return (
      <PhoneFrame bottomIndicatorBg="bg-[#FAF7F2]">
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar">
          <OnboardingScreen onComplete={handleCompleteOnboarding} />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame bottomIndicatorBg="bg-white/95">
      {/* Compact 390px Top App Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DDD0] shrink-0">
        <div className="px-4 h-14 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateTo('feed', { wishlist: false })}
            className="font-display text-lg font-bold tracking-tight text-[#241D18] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Find&amp;Swap KG
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('onboarding')}
              className="min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#6C5E52] hover:text-[#241D18] whitespace-nowrap shrink-0 cursor-pointer"
            >
              О гильдии
            </button>
            <button
              type="button"
              onClick={() => navigateTo('post')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#B04623] hover:bg-[#96391A] text-white text-xs font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Разместить лот</span>
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Screen Viewport */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-20 sm:pb-6"
      >
        {statusToast && (
          <div
            role="status"
            className="mb-4 bg-[#EAF1EC] border border-[#BFD6C7] rounded-2xl px-3.5 py-3 flex items-center justify-between gap-2 text-xs text-[#2C5A43]"
          >
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusToast(null)}
              aria-label="Скрыть уведомление"
              className="p-1 text-[#2C5A43] hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {screen === 'feed' && (
          <HomeFeedScreen
            listings={listings}
            isLoading={isLoading}
            dataSource={dataSource}
            loadError={loadError}
            wishlistIds={wishlistIds}
            wishlistOnly={wishlistOnly}
            onRefresh={() => void loadListings()}
            onToggleWishlist={handleToggleWishlist}
            onSelectListing={handleSelectListing}
            onOpenChatForListing={(item) => handleOpenChatForListing(item, 'swap')}
            onOpenPostForm={() => navigateTo('post')}
            onClearWishlistFilter={() => setWishlistOnly(false)}
          />
        )}

        {screen === 'detail' && selectedListing && (
          <ListingDetailScreen
            listing={selectedListing}
            isWishlisted={wishlistIds.has(selectedListing.id)}
            onBack={() => navigateTo('feed')}
            onToggleWishlist={handleToggleWishlist}
            onProposeSwap={(item, mode) => handleOpenChatForListing(item, mode)}
          />
        )}

        {screen === 'post' && (
          <PostListingScreen
            onBack={() => navigateTo('feed')}
            onSubmitListing={handleCreateListing}
          />
        )}

        {screen === 'chat' && (
          <ChatScreen
            activeListing={chatListing || listings[0] || null}
            dealMode={chatDealMode}
            onBack={() => navigateTo('feed')}
          />
        )}

        {screen === 'profile' && (
          <ProfileScreen
            listings={listings}
            wishlistIds={wishlistIds}
            onSelectListing={handleSelectListing}
            onOpenPostForm={() => navigateTo('post')}
          />
        )}
      </main>

      {/* Bottom Tab Navigation Bar pinned inside PhoneFrame (fixed bottom on real mobile <640px) */}
      <nav
        aria-label="Мобильное меню"
        className="fixed bottom-0 left-0 right-0 sm:static z-30 bg-white/95 backdrop-blur-md border-t border-[#E6DDD0] h-16 px-2 grid grid-cols-5 items-center shrink-0"
      >
        <button
          type="button"
          onClick={() => navigateTo('feed', { wishlist: false })}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-semibold cursor-pointer ${
            screen === 'feed' && !wishlistOnly ? 'text-[#B04623]' : 'text-[#6C5E52]'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Обзор</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('feed', { wishlist: true })}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-semibold cursor-pointer ${
            screen === 'feed' && wishlistOnly ? 'text-[#B04623]' : 'text-[#6C5E52]'
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>Вишлист</span>
        </button>

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigateTo('post')}
            aria-label="Разместить новый лот"
            className="-mt-5 w-12 h-12 rounded-full bg-[#B04623] hover:bg-[#96391A] text-white shadow-md flex items-center justify-center border-2 border-[#FAF7F2] cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('chat')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-semibold cursor-pointer ${
            screen === 'chat' ? 'text-[#B04623]' : 'text-[#6C5E52]'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>Чаты</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-semibold cursor-pointer ${
            screen === 'profile' ? 'text-[#B04623]' : 'text-[#6C5E52]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Профиль</span>
        </button>
      </nav>
    </PhoneFrame>
  );
}
