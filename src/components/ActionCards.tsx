import React from 'react';
import { PastAppointment, ClientCoupon, LimitedEditionItem, AvailableSlot } from '../types';

interface ActionCardsProps {
  actionData: any;
  onSelectAction: (voicePrompt: string) => void;
  onBookSlot?: (slot: AvailableSlot, couponCode?: string) => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  actionData,
  onSelectAction,
  onBookSlot,
}) => {
  if (!actionData) return null;

  const type = actionData.type || '';

  // 1. Past Appointment Details Card
  if (type === 'past_set') {
    const data: PastAppointment = actionData.data;
    const sparkleCash = actionData.sparkleCash ?? 34.5;

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fbf1f5] to-[#f3daff]/40 border border-[#e10080]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#b40065] text-sm">✦</span>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-[#b40065]">
              Previous Set Receipt
            </span>
          </div>
          <span className="bg-[#ffd9e3] text-[#8d004e] font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            {data.date}
          </span>
        </div>

        <div className="bg-white/85 rounded-xl p-3 border border-[#ffd9e3]">
          <div className="flex gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPpo0nZBSrVqJvJUksDhgJeKIoJ0yapeaNHB-pTTKWHILDCJ0ILDWNVutSwt-cFiYpVHLI_wSIMJt8NCAjnKToklM3luHnbrQXpk9Ws3ePyGu7I4jnBwFDjUwRVh_QSiAQN6_GdpIPXA9SuqRVsbGNZclSbsdA8YchO1yeujCUEahoXHrA-EF7-L_Hf-IFJy3iQKeObh2GAoDX3D7dC4AvmCLQx0llggzuXfGaHkNeA02roDXve_m1"
              alt={data.set}
              className="w-20 h-20 rounded-lg object-cover border border-pink-300 shadow-xs shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-syne font-bold text-xs sm:text-sm text-[#1f1a1d] leading-snug">
                {data.set}
              </h4>
              <div className="grid grid-cols-2 gap-1.5 mt-1.5 font-space text-[11px] text-[#5b3f48]">
                <div>
                  <span className="text-[#8f6e78]">Tech:</span>{' '}
                  <strong className="text-[#1f1a1d]">{data.technician}</strong>
                </div>
                <div>
                  <span className="text-[#8f6e78]">Shape:</span>{' '}
                  <strong className="text-[#1f1a1d]">{data.shape}</strong>
                </div>
                <div>
                  <span className="text-[#8f6e78]">Paid:</span>{' '}
                  <strong className="text-[#b40065] font-bold">${data.amountPaid.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-[#8f6e78]">Tip:</span>{' '}
                  <strong className="text-[#1f1a1d]">${data.tip.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>

          {data.addOns && data.addOns.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[#ffd9e3]/60 flex flex-wrap gap-1">
              {data.addOns.map((add, idx) => (
                <span
                  key={idx}
                  className="bg-[#f5ebef] text-[#764d93] text-[10px] px-2 py-0.5 rounded-md font-space font-medium"
                >
                  ✦ {add}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs bg-[#f3daff]/50 px-3 py-1.5 rounded-xl border border-[#dcacfb]/40">
          <span className="font-space text-[#764d93] font-semibold">
            ✨ Sparkle Cash Balance:
          </span>
          <span className="font-syne font-extrabold text-[#764d93]">
            ${sparkleCash.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => onSelectAction(`Re-book my last set (${data.set})`)}
            className="flex-1 bg-gradient-to-r from-[#b40065] to-[#e10080] text-white py-2 px-3 rounded-full font-space text-xs font-bold shadow-sm active:scale-95 transition-transform cursor-pointer text-center"
          >
            ✦ Re-book This Set
          </button>
          <button
            onClick={() => onSelectAction('Book a refill for my last set')}
            className="bg-white border border-[#b40065]/40 text-[#b40065] py-2 px-3 rounded-full font-space text-xs font-semibold hover:bg-[#ffd9e3]/30 active:scale-95 transition-transform cursor-pointer"
          >
            Refill ($95)
          </button>
        </div>
      </div>
    );
  }

  // 2. Coupons & Discounts Card
  if (type === 'coupons') {
    const coupons: ClientCoupon[] = actionData.coupons || [];
    const sparkleCash = actionData.sparkleCash ?? 34.5;

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fff7f9] to-[#ffd9e3]/30 border border-[#e10080]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#b40065] text-sm">🎟️</span>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-[#b40065]">
              VIP Discounts & Sparkle Cash
            </span>
          </div>
          <span className="bg-[#dcacfb] text-[#2e014b] font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            ${sparkleCash.toFixed(2)} Available
          </span>
        </div>

        <div className="space-y-2">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-white rounded-xl p-3 border border-[#e3bdc7] flex items-center justify-between hover:border-[#b40065] transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-space font-extrabold text-sm text-[#b40065] tracking-wider bg-[#ffd9e3] px-2 py-0.5 rounded-md">
                    {c.code}
                  </span>
                  <span className="font-syne font-bold text-xs text-[#1f1a1d]">
                    {c.title}
                  </span>
                </div>
                <p className="font-jakarta text-[11px] text-[#5b3f48] mt-1">
                  {c.description}
                </p>
                <span className="font-space text-[10px] text-[#8f6e78]">
                  Expires: {c.expires}
                </span>
              </div>
              <button
                onClick={() => onSelectAction(`Book an appointment with coupon ${c.code}`)}
                className="ml-2 bg-gradient-to-r from-[#b40065] to-[#764d93] text-white px-3 py-1.5 rounded-full font-space text-[11px] font-bold active:scale-95 transition-transform cursor-pointer shrink-0"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Availability & Slot Picker Card
  if (type === 'availability') {
    const slots: AvailableSlot[] = actionData.slots || [];

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fbf1f5] to-[#e2b5ff]/20 border border-[#b40065]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#b40065] text-sm">📅</span>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-[#b40065]">
              Real-Time Available Slots
            </span>
          </div>
          <span className="bg-[#79f5fb] text-[#002021] font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            Live Booking
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
          {slots.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl p-2.5 border border-[#ffd9e3] flex items-center justify-between hover:border-[#b40065] transition-all"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-syne font-extrabold text-xs text-[#b40065]">
                    {s.time}
                  </span>
                  <span className="font-space text-[11px] text-[#1f1a1d] font-semibold">
                    {s.date}
                  </span>
                </div>
                <div className="font-jakarta text-[11px] text-[#5b3f48] flex items-center space-x-2 mt-0.5">
                  <span>Artist: <strong>{s.artist}</strong></span>
                  <span>•</span>
                  <span className="text-[#764d93]">{s.serviceAvailable}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onBookSlot) {
                    onBookSlot(s, 'BARBIE20');
                  } else {
                    onSelectAction(`Book ${s.date} at ${s.time} with ${s.artist}`);
                  }
                }}
                className="bg-[#b40065] text-white px-3 py-1.5 rounded-full font-space text-[11px] font-bold hover:bg-[#e10080] active:scale-95 transition-transform cursor-pointer"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Limited Edition Drops Card
  if (type === 'limited_editions') {
    const items: LimitedEditionItem[] = actionData.items || [];

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fbf1f5] to-[#f3daff]/30 border border-[#b40065]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#b40065] text-sm">👑</span>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-[#b40065]">
              Limited Edition Atelier Drops
            </span>
          </div>
          <span className="bg-[#b40065] text-white font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            Rare Drops
          </span>
        </div>

        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const dropImages = [
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBeMKwLYnZQ4ko4cVpgrfTs1Dk_vfOsFd3M3q8XZCNqYQZl4FAtYXAecxq7HQJWpnpPKPi848tPmEzVxoLWgu1iNzeyQPsjBowXBAZ7qk6Uby5v6HkPL6roqUYKCFbn1PjwHn4-drMrxDWYPg3XupBgV5amzoEzxpdd0E7hDAFL4bqqO6S5SwSUGGJ7BzLfKQv7OhHHbetDr8Y0GOFdHJcDz3Ci-nz8AjSX_6Hr4WBDRnfK2J0xL_fz',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuB2qosbMNCJJKZAt04Ehfm7tu6nkjOQ9FPQilS7MIhGpXSDJJaG0qrgD4m_bmp18ykbLtgQ4bIKdyxjwTHaM9i0YEzMdltJOYIyDYX7F5bjp2596--DUbEaFnAzS_HRqj2C80MsNsS5I7H7PS-x9P49ApoQZIpdnYmzUKb6oIB7BFyZrbAH_S1nIETF_OEuKj0LQtEOaIp0CM2DGG50cAl31qEpXK6ejqlJysVrP0o2_w9kCzktYLNM',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAyZd3y_ADFhya5GWxpo6npRpKC6Dk5YFhMOBfQuKV-4vmlrthnxeuPUtHTwfU6SwrNFF72ryHy4Nci6mQqqEdBPmptSyiCPbIidBoq7GmQl-oK6YIOFdabBTUcW-8-BWozagixhyU619QtgQhifPEpTS-r_O577-HYBuK0_EoTKqwiwGUPaAMAEOpP-xIF1LHDINJIlYpHjsCU0lD8h-JDI2qq_dK97k75PInq_0tfjzQCbRp4f3In',
            ];
            const imgUrl = dropImages[idx % dropImages.length];

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 border border-[#dcacfb] hover:border-[#b40065] transition-all space-y-2 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={imgUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover border border-pink-200 shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-syne font-extrabold text-xs text-[#1f1a1d] truncate">
                        {item.title}
                      </h5>
                      <span className="bg-[#ffd9e3] text-[#b40065] font-space text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="font-jakarta text-[11px] text-[#5b3f48] mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-syne font-extrabold text-sm text-[#b40065]">
                      ${item.price}
                    </span>
                    <div className="font-space text-[9px] text-[#764d93] font-bold">
                      {item.remainingSlots} SLOTS
                    </div>
                  </div>
                </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#f5ebef]">
                <div className="flex items-center space-x-1">
                  <span className="font-space text-[10px] text-[#8f6e78]">Palette:</span>
                  {item.palette.map((p, i) => (
                    <span
                      key={i}
                      className="bg-[#f5ebef] text-[#1f1a1d] text-[9px] px-1.5 py-0.5 rounded font-space"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onSelectAction(`Book the ${item.title} limited edition set`)}
                  className="bg-gradient-to-r from-[#b40065] to-[#764d93] text-white px-3 py-1 rounded-full font-space text-[10px] font-bold active:scale-95 transition-transform cursor-pointer"
                >
                  Claim Slot
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    );
  }

  // 5. Nail Art Styling Inspiration Card
  if (type === 'inspiration') {
    const shapes = actionData.shapes || [];
    const finishes = actionData.finishes || [];
    const palettes = actionData.palettes || [];

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fff7f9] to-[#dcacfb]/20 border border-[#b40065]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#b40065] text-sm">💅</span>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-[#b40065]">
              Y2K Trending Inspiration Board
            </span>
          </div>
          <span className="bg-[#dcacfb] text-[#2e014b] font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            Studio Moodboard
          </span>
        </div>

        {/* Trending Shapes */}
        <div>
          <span className="font-space text-[10px] uppercase font-bold text-[#8f6e78] tracking-wider">
            Trending Shapes
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {shapes.map((s: any, idx: number) => (
              <button
                key={idx}
                onClick={() => onSelectAction(`Tell me more about ${s.name} nail ideas`)}
                className="bg-white border border-[#ffd9e3] hover:border-[#b40065] px-2.5 py-1 rounded-full font-space text-xs text-[#1f1a1d] active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>✦</span>
                <span className="font-bold">{s.name}</span>
                <span className="text-[10px] text-[#8f6e78]">({s.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Combos Swatch Palette */}
        <div>
          <span className="font-space text-[10px] uppercase font-bold text-[#8f6e78] tracking-wider">
            Curated Color Swatches
          </span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {palettes.map((p: any, idx: number) => (
              <div
                key={idx}
                onClick={() => onSelectAction(`Can I get the ${p.name} color palette on my next set?`)}
                className="bg-white p-2 rounded-xl border border-[#e3bdc7] hover:border-[#b40065] cursor-pointer transition-all"
              >
                <div className="flex space-x-1 mb-1">
                  {p.colors?.map((col: string, cIdx: number) => (
                    <span
                      key={cIdx}
                      className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <div className="font-syne font-bold text-[11px] text-[#1f1a1d]">
                  {p.name}
                </div>
                <div className="font-jakarta text-[10px] text-[#8f6e78] line-clamp-1">
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finishes */}
        <div>
          <span className="font-space text-[10px] uppercase font-bold text-[#8f6e78] tracking-wider">
            Trending Finishes
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {finishes.slice(0, 4).map((f: string, idx: number) => (
              <span
                key={idx}
                className="bg-[#f5ebef] text-[#764d93] font-space text-[10px] px-2 py-0.5 rounded-full"
              >
                ✨ {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
