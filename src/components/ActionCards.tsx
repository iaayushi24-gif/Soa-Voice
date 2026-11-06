import React from 'react';
import { PastAppointment, ClientCoupon, LimitedEditionItem, AvailableSlot } from '../types';

interface ActionCardsProps {
  actionData: any;
  onSelectAction: (voicePrompt: string) => void;
  onBookSlot?: (slot: AvailableSlot, couponCode?: string) => void;
  language?: 'en' | 'fr';
  onOpenWeb3Hub?: () => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  actionData,
  onSelectAction,
  onBookSlot,
  language = 'en',
  onOpenWeb3Hub,
}) => {
  if (!actionData) return null;

  const type = actionData.type || '';

  // 0. Official NailsbySoa Pricing Menu Card (Gel-X & Gainage)
  if (type === 'pricing') {
    const gelXServices = [
      { name: language === 'fr' ? 'Vernis simple' : 'Vernis simple', price: '30 €', desc: language === 'fr' ? 'Couleur unie sur extensions' : 'Solid color on full gel extensions' },
      { name: language === 'fr' ? 'French' : 'French', price: '35 €', desc: language === 'fr' ? 'French manucure classique ou stylée' : 'Classic or custom french tip' },
      { name: language === 'fr' ? 'French + 2 nail art' : 'French + 2 nail art', price: '37 €', desc: language === 'fr' ? 'French + 2 ongles décorés' : 'French with 2 accent nails' },
      { name: language === 'fr' ? 'Nail art complet' : 'Nail art complet', price: '40 €', desc: language === 'fr' ? 'Tous les ongles sont travaillés' : 'All nails fully sculpted & designed' },
      { name: language === 'fr' ? 'Mix&Match Set' : 'Mix&Match Set', price: '45-50 €', desc: language === 'fr' ? 'Chaque ongle est différent' : 'Every single nail is unique' },
    ];

    const gainageServices = [
      { name: language === 'fr' ? 'Vernis simple' : 'Vernis simple', price: '25 €', desc: language === 'fr' ? 'Renforcement gel sur ongles naturels' : 'Builder gel on natural nails' },
      { name: language === 'fr' ? 'French' : 'French', price: '30 €', desc: language === 'fr' ? 'French manucure sur ongles naturels' : 'French on natural nails' },
      { name: language === 'fr' ? 'French + 2 nail art' : 'French + 2 nail art', price: '30 €', desc: language === 'fr' ? 'French + 2 ongles décorés' : 'French with 2 accent nails' },
      { name: language === 'fr' ? 'Nail art complet' : 'Nail art complet', price: '35 €', desc: language === 'fr' ? 'Tous les ongles sont travaillés' : 'All natural nails fully worked' },
      { name: language === 'fr' ? 'Mix&Match Set' : 'Mix&Match Set', price: '40 €', desc: language === 'fr' ? 'Chaque ongle est différent' : 'Every single nail is unique' },
    ];

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fff5f9] to-[#ffd9e3]/40 border-2 border-[#b40065]/40 rounded-2xl p-4 shadow-md space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#ffd9e3] pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-[#b40065] text-base animate-pulse">💅</span>
            <div>
              <span className="font-syne font-black text-xs uppercase tracking-wider text-[#b40065] block">
                {language === 'fr' ? 'TARIFS OFFICIELS NAILSBYSOA' : 'OFFICIAL NAILSBYSOA MENU'}
              </span>
              <span className="font-space text-[10px] text-[#764d93] font-semibold">
                {language === 'fr' ? '✦ Tous les prix sont en Euros (€)' : '✦ All official rates in Euros (€)'}
              </span>
            </div>
          </div>
          <span className="bg-[#b40065] text-white font-space text-[10px] px-2.5 py-1 rounded-full font-bold shadow-xs">
            100% OFFICIEL
          </span>
        </div>

        {/* 1. GEL-X Section */}
        <div className="bg-white/90 rounded-xl p-3 border border-[#ffd9e3] shadow-xs">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#ffd9e3]">
            <span className="font-syne font-extrabold text-xs text-[#b40065] tracking-wide flex items-center gap-1.5">
              <span>✦</span>
              <span>GEL-X</span>
              <span className="text-[10px] font-normal text-[#8f6e78]">
                ({language === 'fr' ? 'Extensions complètes' : 'Full Extensions'})
              </span>
            </span>
            <span className="text-[10px] font-space font-bold text-[#764d93] bg-[#f3daff] px-2 py-0.5 rounded-full">
              30 € - 50 €
            </span>
          </div>
          <div className="space-y-1.5 font-space">
            {gelXServices.map((srv, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-[#fff0f5] transition-colors cursor-pointer group"
                onClick={() => onSelectAction(language === 'fr' ? `Je veux réserver un Gel-X ${srv.name} (${srv.price})` : `I want to book a Gel-X ${srv.name} (${srv.price})`)}
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-xs text-[#1f1a1d] group-hover:text-[#b40065] transition-colors flex items-center gap-1">
                    <span>• {srv.name}</span>
                  </div>
                  <div className="text-[10px] text-[#8f6e78] italic truncate">
                    {srv.desc}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-syne font-extrabold text-xs text-[#b40065] bg-[#ffd9e3] px-2 py-0.5 rounded-md">
                    {srv.price}
                  </span>
                  <span className="text-[10px] text-[#764d93] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. GAINAGE Section */}
        <div className="bg-white/90 rounded-xl p-3 border border-[#dcacfb]/50 shadow-xs">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#ffd9e3]">
            <span className="font-syne font-extrabold text-xs text-[#764d93] tracking-wide flex items-center gap-1.5">
              <span>✦</span>
              <span>GAINAGE</span>
              <span className="text-[10px] font-normal text-[#8f6e78]">
                ({language === 'fr' ? 'Renforcement sur ongles naturels' : 'Builder Gel on Natural Nails'})
              </span>
            </span>
            <span className="text-[10px] font-space font-bold text-[#b40065] bg-[#ffd9e3] px-2 py-0.5 rounded-full">
              25 € - 40 €
            </span>
          </div>
          <div className="space-y-1.5 font-space">
            {gainageServices.map((srv, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-[#faf0ff] transition-colors cursor-pointer group"
                onClick={() => onSelectAction(language === 'fr' ? `Je veux réserver un Gainage ${srv.name} (${srv.price})` : `I want to book a Gainage ${srv.name} (${srv.price})`)}
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-xs text-[#1f1a1d] group-hover:text-[#764d93] transition-colors flex items-center gap-1">
                    <span>• {srv.name}</span>
                  </div>
                  <div className="text-[10px] text-[#8f6e78] italic truncate">
                    {srv.desc}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-syne font-extrabold text-xs text-[#764d93] bg-[#f3daff] px-2 py-0.5 rounded-md">
                    {srv.price}
                  </span>
                  <span className="text-[10px] text-[#b40065] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => onSelectAction(language === 'fr' ? 'Quels sont les créneaux disponibles pour Gel-X ?' : 'What slots are available for Gel-X?')}
            className="flex-1 bg-gradient-to-r from-[#b40065] to-[#e10080] text-white py-2 px-3 rounded-full font-space text-xs font-bold shadow-sm active:scale-95 transition-transform cursor-pointer text-center"
          >
            {language === 'fr' ? '✦ Réserver un Gel-X' : '✦ Book Gel-X'}
          </button>
          <button
            onClick={() => onSelectAction(language === 'fr' ? 'Quels sont les créneaux disponibles pour Gainage ?' : 'What slots are available for Gainage?')}
            className="flex-1 bg-white border border-[#764d93]/40 text-[#764d93] py-2 px-3 rounded-full font-space text-xs font-semibold hover:bg-[#f3daff]/30 active:scale-95 transition-transform cursor-pointer text-center"
          >
            {language === 'fr' ? '✦ Réserver un Gainage' : '✦ Book Gainage'}
          </button>
        </div>
      </div>
    );
  }

  // 1. Past Appointment Details Card
  if (type === 'past_set') {
    const data: PastAppointment = actionData.data;
    const sparkleCash = actionData.sparkleCash ?? 15.0;

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fbf1f5] to-[#f3daff]/40 border border-[#e10080]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#b40065] text-sm">✦</span>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-[#b40065]">
              {language === 'fr' ? 'Reçu du dernier set' : 'Previous Set Receipt'}
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
                  <span className="text-[#8f6e78]">{language === 'fr' ? 'Forme :' : 'Shape:'}</span>{' '}
                  <strong className="text-[#1f1a1d]">{data.shape}</strong>
                </div>
                <div>
                  <span className="text-[#8f6e78]">{language === 'fr' ? 'Studio :' : 'Studio:'}</span>{' '}
                  <strong className="text-[#b40065] font-bold">NailsbySoa</strong>
                </div>
                <div>
                  <span className="text-[#8f6e78]">{language === 'fr' ? 'Payé :' : 'Paid:'}</span>{' '}
                  <strong className="text-[#b40065] font-bold">{data.amountPaid.toFixed(2)} €</strong>
                </div>
                <div>
                  <span className="text-[#8f6e78]">{language === 'fr' ? 'Pourboire :' : 'Tip:'}</span>{' '}
                  <strong className="text-[#1f1a1d]">{data.tip.toFixed(2)} €</strong>
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
            {language === 'fr' ? '✨ Solde Sparkle Cash :' : '✨ Sparkle Cash Balance:'}
          </span>
          <span className="font-syne font-extrabold text-[#764d93]">
            {sparkleCash.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => onSelectAction(language === 'fr' ? `Reprendre mon dernier set (${data.set})` : `Re-book my last set (${data.set})`)}
            className="flex-1 bg-gradient-to-r from-[#b40065] to-[#e10080] text-white py-2 px-3 rounded-full font-space text-xs font-bold shadow-sm active:scale-95 transition-transform cursor-pointer text-center"
          >
            {language === 'fr' ? '✦ Reprendre ce set (45€)' : '✦ Re-book This Set (45€)'}
          </button>
          <button
            onClick={() => onSelectAction(language === 'fr' ? 'Quels sont les tarifs du Gel-X et du Gainage ?' : 'What are the pricing rates for Gel-X & Gainage?')}
            className="bg-white border border-[#b40065]/40 text-[#b40065] py-2 px-3 rounded-full font-space text-xs font-semibold hover:bg-[#ffd9e3]/30 active:scale-95 transition-transform cursor-pointer"
          >
            {language === 'fr' ? 'Tarifs Menu (€)' : 'Menu Rates (€)'}
          </button>
        </div>
      </div>
    );
  }

  // 2. Coupons & Discounts Card
  if (type === 'coupons') {
    const coupons: ClientCoupon[] = actionData.coupons || [];
    const sparkleCash = actionData.sparkleCash ?? 15.0;

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fff7f9] to-[#ffd9e3]/30 border border-[#e10080]/30 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#b40065] text-sm">🎟️</span>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-[#b40065]">
              {language === 'fr' ? 'Coupons VIP & Sparkle Cash' : 'VIP Discounts & Sparkle Cash'}
            </span>
          </div>
          <span className="bg-[#dcacfb] text-[#2e014b] font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            {sparkleCash.toFixed(2)} € {language === 'fr' ? 'Disponibles' : 'Available'}
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
                  {language === 'fr' ? 'Expire le :' : 'Expires:'} {c.expires}
                </span>
              </div>
              <button
                onClick={() => onSelectAction(language === 'fr' ? `Réserver avec le coupon ${c.code}` : `Book an appointment with coupon ${c.code}`)}
                className="ml-2 bg-gradient-to-r from-[#b40065] to-[#764d93] text-white px-3 py-1.5 rounded-full font-space text-[11px] font-bold active:scale-95 transition-transform cursor-pointer shrink-0"
              >
                {language === 'fr' ? 'Appliquer' : 'Apply'}
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
              {language === 'fr' ? 'Créneaux en temps réel' : 'Real-Time Available Slots'}
            </span>
          </div>
          <span className="bg-[#79f5fb] text-[#002021] font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            {language === 'fr' ? 'Réservation Directe' : 'Live Booking'}
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
                  <span className="text-[#764d93] font-medium">{s.serviceAvailable}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onBookSlot) {
                    onBookSlot(s, 'BARBIE20');
                  } else {
                    onSelectAction(language === 'fr' ? `Réserver le ${s.date} à ${s.time}` : `Book ${s.date} at ${s.time}`);
                  }
                }}
                className="bg-[#b40065] text-white px-3 py-1.5 rounded-full font-space text-[11px] font-bold hover:bg-[#e10080] active:scale-95 transition-transform cursor-pointer"
              >
                {language === 'fr' ? 'Réserver' : 'Book'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3.5 Dedicated Campaign Card: THE SOA DROP
  // 3.5 Dedicated Campaign Card: THE SOA DROP
  if (type === 'soa_drop') {
    const drop = actionData.drop || actionData.items?.[0] || {
      title: 'THE SOA DROP',
      priceDisplay: '45€ - 50€',
      remainingSlots: 3,
      badge: '🔥 OFFICIAL CAMPAIGN',
      image: '/the_soa_drop.jpg',
      palette: ['Chrome Miroir Argent', 'Hot Pink Magenta', 'Gouttes Métal 3D', 'Étoiles Strass'],
      description: 'La création signature ultime par Soa : extensions Gel-X stiletto chrome liquide, pendentifs étoilés percés et finitions haute-couture Y2K.',
    };

    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fff0f5] to-[#ffd9e3]/50 border-2 border-[#b40065] rounded-3xl p-4 sm:p-5 shadow-lg space-y-4 relative overflow-hidden">
        {/* Holographic background sheen */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#ff1493]/20 via-[#dcacfb]/25 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Campaign Header */}
        <div className="flex items-center justify-between border-b border-[#ffd9e3] pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-[#b40065] text-lg animate-pulse">🔥</span>
            <div>
              <span className="font-syne font-black text-xs sm:text-sm uppercase tracking-wider text-[#b40065] block">
                {language === 'fr' ? 'DÉTAILS DE LA CAMPAGNE // THE SOA DROP' : 'CAMPAIGN DETAILS // THE SOA DROP'}
              </span>
              <span className="font-space text-[10px] text-[#764d93] font-semibold">
                {language === 'fr' ? '✦ Création Haute-Couture & Fidélité Web3 par Soa' : '✦ Signature Couture & Web3 Loyalty by Soa'}
              </span>
            </div>
          </div>
          <span className="bg-[#b40065] text-white font-space text-[10px] px-2.5 py-1 rounded-full font-bold shadow-xs animate-bounce">
            {language === 'fr' ? '3 PLACES RESTANTES' : '3 SLOTS LEFT'}
          </span>
        </div>

        {/* Hero Visual of THE SOA DROP */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#b40065]/40 shadow-md group">
          <img
            src="/the_soa_drop.jpg"
            alt="THE SOA DROP Campaign Visual"
            className="w-full h-48 sm:h-56 object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="bg-[#ffd9e3] text-[#b40065] font-space text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                  Y2K BARBIECORE EDITORIAL
                </span>
                <h3 className="font-syne font-black text-white text-base sm:text-lg drop-shadow-md mt-0.5">
                  THE SOA DROP
                </h3>
              </div>
              <div className="text-right">
                <span className="font-syne font-black text-xl text-[#ff66b2] drop-shadow-md">
                  {drop.priceDisplay || '45€ - 50€'}
                </span>
                <div className="font-space text-[10px] text-white/90">
                  Gel-X Mix&Match
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Set Specifications & Artistry */}
        <div className="bg-white/95 rounded-2xl p-3.5 border border-[#ffd9e3] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between font-space text-xs">
            <span className="font-bold text-[#b40065] flex items-center gap-1.5">
              <span>💅</span>
              <span>{language === 'fr' ? 'Spécifications du Set Couture' : 'Couture Set Specifications'}</span>
            </span>
            <span className="text-[#764d93] font-semibold text-[11px]">
              {language === 'fr' ? 'Durée : 75-90 min' : 'Duration: 75-90 min'}
            </span>
          </div>

          <p className="font-jakarta text-xs text-[#5b3f48] leading-relaxed">
            {language === 'fr'
              ? 'Extensions Gel-X stiletto sculptées avec chrome liquide miroir, pendentifs étoilés percés et gouttes de métal 3D. Chaque ongle est travaillé comme une pièce unique haute couture par Soa.'
              : 'Sculpted Gel-X stiletto extensions featuring molten liquid mirror chrome, pierced star charms, and 3D metal drips. Each nail is handcrafted as an editorial one-of-a-kind art piece by Soa.'}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#f5ebef]">
            {['Chrome Miroir Argent', 'Hot Pink Magenta', 'Gouttes Métal 3D', 'Pendentifs Étoilés Percés', 'Finition Wet-Look'].map((trait, i) => (
              <span
                key={i}
                className="bg-[#fff0f5] border border-[#ffd9e3] text-[#764d93] text-[10px] px-2 py-0.5 rounded-full font-space font-semibold"
              >
                ✦ {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Campaign Mechanics Summary: Mechanic 1 & Mechanic 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-space text-xs">
          <div className="bg-white p-3 rounded-2xl border border-[#ffd9e3] space-y-1.5 shadow-xs">
            <div className="flex items-center space-x-1.5 text-[#b40065] font-bold">
              <span>💳</span>
              <span>{language === 'fr' ? 'Mécanique 1 : Pass VIP SOA' : 'Mechanic 1: SOA VIP Pass'}</span>
            </div>
            <p className="text-[11px] text-[#5b3f48] leading-tight">
              {language === 'fr'
                ? 'Carte digitale dans votre wallet. Accès anticipé 48h aux drops, créneaux prioritaires et vote communautaire.'
                : 'Digital membership card in your wallet. 48h early access to drops, priority booking and voting.'}
            </p>
            <div className="text-[10px] text-[#b40065] font-bold bg-[#ffd9e3]/60 px-2 py-0.5 rounded-md">
              {language === 'fr' ? 'Objectif : Exclusivité & Récompense' : 'Purpose: Exclusivity & Reward'}
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#ffd9e3] space-y-1.5 shadow-xs">
            <div className="flex items-center space-x-1.5 text-[#764d93] font-bold">
              <span>✨</span>
              <span>{language === 'fr' ? 'Mécanique 2 : Badges Collectibles' : 'Mechanic 2: Collectibles'}</span>
            </div>
            <div className="text-[10px] text-[#5b3f48] space-y-0.5">
              <div>• {language === 'fr' ? 'Janvier : Collectible 01 (Cyber Star)' : 'January: Collectible 01 (Cyber Star)'}</div>
              <div>• {language === 'fr' ? 'Février : Collectible 02 (Cyber Butterfly)' : 'February: Collectible 02 (Cyber Butterfly)'}</div>
              <div>• {language === 'fr' ? 'Mars : Collectible 03 (Poison Jelly)' : 'March: Collectible 03 (Poison Jelly)'}</div>
            </div>
            <div className="text-[10px] text-[#764d93] font-bold bg-[#f3daff]/70 px-2 py-0.5 rounded-md">
              {language === 'fr' ? 'Objectif : Visites répétées (Soulbound)' : 'Purpose: Repeat Visits (Soulbound)'}
            </div>
          </div>
        </div>

        {/* Pricing, Promo & Slots summary */}
        <div className="bg-gradient-to-r from-[#ffd9e3]/70 via-white to-[#f3daff]/70 p-3 rounded-2xl border border-[#b40065]/30 flex flex-wrap items-center justify-between gap-2 font-space text-xs">
          <div>
            <span className="text-[#8f6e78] block text-[10px]">
              {language === 'fr' ? 'Tarif Officiel Gel-X :' : 'Official Gel-X Rate:'}
            </span>
            <span className="font-syne font-black text-sm text-[#b40065]">
              45 € - 50 € <span className="text-[10px] font-normal text-[#5b3f48]">(-20% avec BARBIE20)</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#8f6e78] block text-[10px]">
              {language === 'fr' ? 'Créneaux restants :' : 'Available Slots:'}
            </span>
            <span className="font-syne font-bold text-xs text-[#764d93]">
              {language === 'fr' ? 'Plus que 3 places avec Soa' : 'Only 3 slots with Soa'}
            </span>
          </div>
        </div>

        {/* Booking & Web3 Pass Buttons */}
        <div className="space-y-2 pt-0.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectAction(language === 'fr' ? 'Je veux réserver THE SOA DROP à 45€' : 'I want to book THE SOA DROP for 45€')}
              className="flex-1 bg-gradient-to-r from-[#b40065] via-[#e10080] to-[#764d93] text-white py-2.5 px-3 rounded-full font-space text-xs font-black shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer text-center"
            >
              {language === 'fr' ? '✦ Réserver THE SOA DROP (45€)' : '✦ Book THE SOA DROP (45€)'}
            </button>
            <button
              onClick={() => onSelectAction(language === 'fr' ? 'Quels sont les créneaux disponibles pour THE SOA DROP ?' : 'What slots are available for THE SOA DROP?')}
              className="bg-white border border-[#b40065] text-[#b40065] py-2.5 px-3 rounded-full font-space text-xs font-bold hover:bg-[#ffd9e3]/30 active:scale-95 transition-transform cursor-pointer"
            >
              {language === 'fr' ? 'Créneaux' : 'Slots'}
            </button>
          </div>

          {onOpenWeb3Hub && (
            <button
              onClick={onOpenWeb3Hub}
              className="w-full py-2.5 px-3 rounded-full bg-gradient-to-r from-[#764d93] via-[#b40065] to-[#dcacfb] text-white font-space text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>💎</span>
              <span>
                {language === 'fr'
                  ? 'Voir les 2 Mécaniques Web3 & Badges'
                  : 'View the 2 Web3 Mechanics & Badges'}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3.6 Dedicated Web3 Campaign Info Card: The Two Web3 Mechanics
  if (type === 'web3_campaign') {
    return (
      <div className="mt-3 bg-gradient-to-br from-white via-[#fff0f5] to-[#f3daff]/40 border-2 border-[#b40065] rounded-3xl p-4 sm:p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#ffd9e3] pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xl">💎</span>
            <div>
              <h3 className="font-syne font-black text-xs sm:text-sm text-[#b40065] uppercase tracking-wider">
                {language === 'fr' ? 'LES DEUX MÉCANIQUES WEB3' : 'THE TWO WEB3 MECHANICS'}
              </h3>
              <p className="font-space text-[10px] text-[#764d93] font-semibold">
                {language === 'fr'
                  ? 'Deux mécanismes complémentaires conçus pour NailsbySoa'
                  : 'Two complementary mechanisms designed for NailsbySoa'}
              </p>
            </div>
          </div>
          <span className="bg-[#b40065] text-white font-space text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            WEB3 STRATEGY
          </span>
        </div>

        {/* The Two Mechanics Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-space text-xs">
          
          {/* Mechanic 1: SOA VIP Membership Pass */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#ffd9e3] hover:border-[#b40065] transition-all space-y-2 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#b40065] bg-[#ffd9e3] px-2 py-0.5 rounded-full uppercase">
                  {language === 'fr' ? 'Mécanique 1' : 'Mechanic 1'}
                </span>
                <span className="text-sm">💳</span>
              </div>
              <h4 className="font-syne font-black text-xs sm:text-sm text-[#1f1a1d] mt-1.5">
                SOA VIP Membership Pass
              </h4>
              <p className="text-[10px] text-[#764d93] font-medium italic mt-0.5">
                {language === 'fr'
                  ? 'Carte de membre digitale stockée dans votre digital wallet.'
                  : 'Digital membership card, stored in the customer\'s digital wallet.'}
              </p>

              <div className="mt-2 space-y-1 font-jakarta text-[11px] text-[#5b3f48]">
                <div className="flex items-start gap-1.5">
                  <span className="text-[#b40065] font-bold text-xs">✓</span>
                  <span>{language === 'fr' ? 'Accès anticipé aux drops mensuels' : 'Early access to monthly nail drops'}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#b40065] font-bold text-xs">✓</span>
                  <span>{language === 'fr' ? 'Réservation prioritaire' : 'Priority booking'}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#b40065] font-bold text-xs">✓</span>
                  <span>{language === 'fr' ? 'Accès à des designs d\'ongles exclusifs' : 'Access to exclusive nail designs'}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#b40065] font-bold text-xs">✓</span>
                  <span>{language === 'fr' ? 'Avantages VIP & récompenses fidélité' : 'VIP benefits and loyalty rewards'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#ffd9e3]/50 rounded-xl p-2 mt-2 border border-[#b40065]/20 font-space text-[10px] text-[#8d004e]">
              <strong>{language === 'fr' ? 'Objectif :' : 'Purpose:'}</strong>{' '}
              {language === 'fr'
                ? 'Récompenser les clientes fidèles et créer un sentiment d\'exclusivité.'
                : 'Reward loyal customers and create a feeling of exclusivity.'}
            </div>
          </div>

          {/* Mechanic 2: SOA Digital Collectibles */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#ffd9e3] hover:border-[#764d93] transition-all space-y-2 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#764d93] bg-[#f3daff] px-2 py-0.5 rounded-full uppercase">
                  {language === 'fr' ? 'Mécanique 2' : 'Mechanic 2'}
                </span>
                <span className="text-sm">✨</span>
              </div>
              <h4 className="font-syne font-black text-xs sm:text-sm text-[#1f1a1d] mt-1.5">
                SOA Digital Collectibles
              </h4>
              <p className="text-[10px] text-[#764d93] font-medium italic mt-0.5">
                {language === 'fr'
                  ? 'Reçu à chaque rendez-vous THE SOA DROP assisté.'
                  : 'Received every time a customer attends a THE SOA DROP appointment.'}
              </p>

              {/* Monthly Drop Badges Examples */}
              <div className="mt-2 bg-[#fdf5f8] p-2 rounded-xl border border-pink-200/60 font-space text-[10px] space-y-1">
                <div className="flex justify-between items-center text-[#b40065] font-bold">
                  <span>{language === 'fr' ? '• Drop de Janvier :' : '• January Drop:'}</span>
                  <span className="bg-[#ffd9e3] px-1.5 py-0.5 rounded text-[9px]">Collectible 01</span>
                </div>
                <div className="flex justify-between items-center text-[#764d93] font-bold">
                  <span>{language === 'fr' ? '• Drop de Février :' : '• February Drop:'}</span>
                  <span className="bg-[#f3daff] px-1.5 py-0.5 rounded text-[9px]">Collectible 02</span>
                </div>
                <div className="flex justify-between items-center text-[#5b3f48] font-bold">
                  <span>{language === 'fr' ? '• Drop de Mars :' : '• March Drop:'}</span>
                  <span className="bg-neutral-200 px-1.5 py-0.5 rounded text-[9px]">Collectible 03</span>
                </div>
              </div>

              <p className="font-jakarta text-[11px] text-[#5b3f48] mt-2">
                {language === 'fr'
                  ? 'Collectionner plusieurs badges débloque des récompenses additionnelles et des expériences exclusives (non-transférables / soulbound).'
                  : 'Collecting several badges unlocks additional rewards or exclusive experiences (non-transferable / soulbound).'}
              </p>
            </div>

            <div className="bg-[#f3daff]/60 rounded-xl p-2 mt-2 border border-[#764d93]/20 font-space text-[10px] text-[#572e73]">
              <strong>{language === 'fr' ? 'Objectif :' : 'Purpose:'}</strong>{' '}
              {language === 'fr'
                ? 'Encourager les visites répétées et impliquer les clientes dans l\'aventure de la marque.'
                : 'Encourage repeat visits and make customers feel involved in the brand\'s journey.'}
            </div>
          </div>

        </div>

        {/* Action Button to Open Web3 Hub */}
        {onOpenWeb3Hub && (
          <button
            onClick={onOpenWeb3Hub}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#b40065] via-[#e10080] to-[#764d93] text-white font-space text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>💎</span>
            <span>
              {language === 'fr'
                ? 'Explorer le Web3 Hub (Pass, Collectibles & Vote)'
                : 'Explore Web3 Hub (Pass, Collectibles & Vote)'}
            </span>
          </button>
        )}
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
              {language === 'fr' ? 'Drops Atelier en Édition Limitée' : 'Limited Edition Atelier Drops'}
            </span>
          </div>
          <span className="bg-[#b40065] text-white font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            {language === 'fr' ? 'Éditions Rares' : 'Rare Drops'}
          </span>
        </div>

        <div className="space-y-2.5">
          {items.map((item, idx) => {
            const dropImages = [
              '/the_soa_drop.jpg',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBeMKwLYnZQ4ko4cVpgrfTs1Dk_vfOsFd3M3q8XZCNqYQZl4FAtYXAecxq7HQJWpnpPKPi848tPmEzVxoLWgu1iNzeyQPsjBowXBAZ7qk6Uby5v6HkPL6roqUYKCFbn1PjwHn4-drMrxDWYPg3XupBgV5amzoEzxpdd0E7hDAFL4bqqO6S5SwSUGGJ7BzLfKQv7OhHHbetDr8Y0GOFdHJcDz3Ci-nz8AjSX_6Hr4WBDRnfK2J0xL_fz',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuB2qosbMNCJJKZAt04Ehfm7tu6nkjOQ9FPQilS7MIhGpXSDJJaG0qrgD4m_bmp18ykbLtgQ4bIKdyxjwTHaM9i0YEzMdltJOYIyDYX7F5bjp2596--DUbEaFnAzS_HRqj2C80MsNsS5I7H7PS-x9P49ApoQZIpdnYmzUKb6oIB7BFyZrbAH_S1nIETF_OEuKj0LQtEOaIp0CM2DGG50cAl31qEpXK6ejqlJysVrP0o2_w9kCzktYLNM',
            ];
            const imgUrl = item.image || dropImages[idx % dropImages.length];

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
                      {item.priceDisplay || `${item.price} €`}
                    </span>
                    <div className="font-space text-[9px] text-[#764d93] font-bold">
                      {item.remainingSlots} {language === 'fr' ? 'RESTANTS' : 'SLOTS'}
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
                  onClick={() => onSelectAction(language === 'fr' ? `Réserver le drop édition limitée ${item.title}` : `Book the ${item.title} limited edition set`)}
                  className="bg-gradient-to-r from-[#b40065] to-[#764d93] text-white px-3 py-1 rounded-full font-space text-[10px] font-bold active:scale-95 transition-transform cursor-pointer"
                >
                  {language === 'fr' ? 'Réserver' : 'Claim Slot'}
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
              {language === 'fr' ? 'Moodboard des Tendances Y2K' : 'Y2K Trending Inspiration Board'}
            </span>
          </div>
          <span className="bg-[#dcacfb] text-[#2e014b] font-space text-[10px] px-2 py-0.5 rounded-full font-bold">
            {language === 'fr' ? 'Inspirations Studio' : 'Studio Moodboard'}
          </span>
        </div>

        {/* Trending Shapes */}
        <div>
          <span className="font-space text-[10px] uppercase font-bold text-[#8f6e78] tracking-wider">
            {language === 'fr' ? 'Formes tendances' : 'Trending Shapes'}
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {shapes.map((s: any, idx: number) => (
              <button
                key={idx}
                onClick={() => onSelectAction(language === 'fr' ? `Dis-m'en plus sur les ongles de forme ${s.name}` : `Tell me more about ${s.name} nail ideas`)}
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
            {language === 'fr' ? 'Palettes de couleurs tendances' : 'Curated Color Swatches'}
          </span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {palettes.map((p: any, idx: number) => (
              <div
                key={idx}
                onClick={() => onSelectAction(language === 'fr' ? `Est-ce que je peux avoir la palette ${p.name} sur mon prochain set ?` : `Can I get the ${p.name} color palette on my next set?`)}
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
            {language === 'fr' ? 'Finitions & Breloques' : 'Trending Finishes'}
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
