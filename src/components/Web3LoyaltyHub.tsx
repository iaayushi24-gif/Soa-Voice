import React, { useState } from 'react';
import { ClientProfile } from '../types';

interface Web3LoyaltyHubProps {
  isOpen: boolean;
  onClose: () => void;
  clientProfile?: ClientProfile | null;
  language?: 'en' | 'fr';
  onSelectAction?: (prompt: string) => void;
}

export const Web3LoyaltyHub: React.FC<Web3LoyaltyHubProps> = ({
  isOpen,
  onClose,
  clientProfile,
  language = 'en',
  onSelectAction,
}) => {
  const [activeTab, setActiveTab] = useState<'pass' | 'collectibles' | 'vote' | 'onboarding'>('pass');
  const [isWalletSaved, setIsWalletSaved] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(true);
  const [selectedVote, setSelectedVote] = useState<string | null>('option-1');
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  if (!isOpen) return null;

  const isFr = language === 'fr';

  const badges = [
    {
      id: 'badge-01',
      title: isFr ? 'January Drop : Collectible 01 • Cyber Star' : 'January Drop: Collectible 01 • Cyber Star',
      edition: isFr ? 'Drop de Janvier • Collectible 01' : 'January Drop • Collectible 01',
      status: 'collected',
      dateCollected: isFr ? 'Janvier 2026 (Collecté)' : 'January 2026 (Collected)',
      image: '/soa_drop_badge.jpg',
      set: 'Gel-X Mix&Match Stiletto Chrome',
      rarity: 'Soulbound #0842',
      description: isFr
        ? 'Reçu lors du rendez-vous THE SOA DROP de Janvier. Badge officiel non-transférable prouvant votre présence.'
        : 'Received at the January THE SOA DROP appointment. Official non-transferable badge proving attendance.',
    },
    {
      id: 'badge-02',
      title: isFr ? 'February Drop : Collectible 02 • Cyber Butterfly' : 'February Drop: Collectible 02 • Cyber Butterfly',
      edition: isFr ? 'Drop de Février • Collectible 02' : 'February Drop • Collectible 02',
      status: 'active',
      dateCollected: isFr ? 'Février 2026 (Drop Actif)' : 'February 2026 (Active Drop)',
      image: '/soa_drop_badge_02.jpg',
      set: 'Liquid Chrome & Pierced Star Charms',
      rarity: 'Soulbound Rare',
      description: isFr
        ? 'Badge officiel du drop de Février. Attribué automatiquement dès que vous assistez à votre rendez-vous !'
        : 'Official February drop badge. Awarded automatically when you attend your THE SOA DROP appointment!',
    },
    {
      id: 'badge-03',
      title: isFr ? 'March Drop : Collectible 03 • Poison Jelly Aura' : 'March Drop: Collectible 03 • Poison Jelly Aura',
      edition: isFr ? 'Drop de Mars • Collectible 03' : 'March Drop • Collectible 03',
      status: 'locked',
      dateCollected: isFr ? 'Mars 2026 (À venir)' : 'March 2026 (Coming Soon)',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyZd3y_ADFhya5GWxpo6npRpKC6Dk5YFhMOBfQuKV-4vmlrthnxeuPUtHTwfU6SwrNFF72ryHy4Nci6mQqqEdBPmptSyiCPbIidBoq7GmQl-oK6YIOFdabBTUcW-8-BWozagixhyU619QtgQhifPEpTS-r_O577-HYBuK0_EoTKqwiwGUPaAMAEOpP-xIF1LHDINJIlYpHjsCU0lD8h-JDI2qq_dK97k75PInq_0tfjzQCbRp4f3In',
      set: 'Neon Acid Lime & Magenta Aura',
      rarity: 'Upcoming Drop',
      description: isFr
        ? 'Badge du drop de Mars. Débloquera le palier VIP ultime (Masterclass privée & set offert).'
        : 'March drop badge. Unlocks the final VIP milestone (private masterclass & complimentary set).',
    },
  ];

  const votingOptions = [
    {
      id: 'option-1',
      title: 'Gothic Cyber Lolita',
      desc: isFr ? 'Chrome noir miroir, croix argentées 3D & gouttes liquides obsidienne.' : 'Mirror black chrome, 3D silver crosses & obsidian molten drips.',
      votes: 142,
      percent: '48%',
    },
    {
      id: 'option-2',
      title: 'Barbiecore Hot Pink Starburst',
      desc: isFr ? 'French miroir rose vif, piercings d\'étoiles & micro-perles nacrées.' : 'Hot magenta chrome tips, starburst piercings & micro-pearls.',
      votes: 106,
      percent: '36%',
    },
    {
      id: 'option-3',
      title: 'Velvet Toxic Lime Cat-Eye',
      desc: isFr ? 'Vert acide magnétique avec reflets holographiques intenses.' : 'Magnetic toxic lime shimmer with deep holographic depth.',
      votes: 48,
      percent: '16%',
    },
  ];

  const handleVoteSubmit = () => {
    setHasVoted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-gradient-to-b from-white via-[#fff2f7] to-[#fde8f2] border-2 border-[#b40065] rounded-3xl shadow-2xl overflow-hidden font-jakarta select-none">
        
        {/* Holographic top accent banner */}
        <div className="h-2 w-full bg-gradient-to-r from-[#ff1493] via-[#dcacfb] to-[#79f5fb] animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#ffd9e3] bg-white/80">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">💎</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-syne font-black text-sm sm:text-base text-[#1f1a1d] tracking-wide">
                  THE SOA DROP // WEB3 LOYALTY HUB
                </h2>
                <span className="bg-[#ffd9e3] text-[#b40065] font-space text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  VIP EXCLUSIVITY
                </span>
              </div>
              <p className="font-space text-[10px] text-[#764d93] font-medium">
                {isFr
                  ? 'Fidélité Web3, Pass Digital & Badges Non-Transférables'
                  : 'Web3 Loyalty, Digital Pass & Non-Transferable Collectibles'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ffd9e3] text-[#b40065] hover:bg-[#b40065] hover:text-white transition-colors flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ffd9e3] bg-white/60 p-1 sm:p-1.5 gap-1 overflow-x-auto no-scrollbar font-space text-xs">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pass'
                ? 'bg-gradient-to-r from-[#b40065] to-[#e10080] text-white shadow-xs'
                : 'text-[#8f6e78] hover:bg-[#ffd9e3]/40'
            }`}
          >
            <span>💳</span>
            <span>{isFr ? 'SOA VIP Pass' : 'VIP Pass'}</span>
          </button>

          <button
            onClick={() => setActiveTab('collectibles')}
            className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'collectibles'
                ? 'bg-gradient-to-r from-[#b40065] to-[#e10080] text-white shadow-xs'
                : 'text-[#8f6e78] hover:bg-[#ffd9e3]/40'
            }`}
          >
            <span>✨</span>
            <span>{isFr ? 'Badges & Vault' : 'Collectibles'}</span>
          </button>

          <button
            onClick={() => setActiveTab('vote')}
            className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'vote'
                ? 'bg-gradient-to-r from-[#b40065] to-[#e10080] text-white shadow-xs'
                : 'text-[#8f6e78] hover:bg-[#ffd9e3]/40'
            }`}
          >
            <span>🗳️</span>
            <span>{isFr ? 'Vote Communautaire' : 'Community Vote'}</span>
          </button>

          <button
            onClick={() => setActiveTab('onboarding')}
            className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'onboarding'
                ? 'bg-gradient-to-r from-[#b40065] to-[#e10080] text-white shadow-xs'
                : 'text-[#8f6e78] hover:bg-[#ffd9e3]/40'
            }`}
          >
            <span>🚀</span>
            <span>{isFr ? 'Parcours & RGPD' : 'How it Works'}</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: SOA VIP MEMBERSHIP PASS */}
          {activeTab === 'pass' && (
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-space font-extrabold uppercase tracking-wider text-[#b40065] bg-[#ffd9e3] px-2.5 py-0.5 rounded-full">
                  {isFr ? 'MÉCANIQUE 1 // CARTE DE MEMBRE DIGITALE' : 'MECHANIC 1 // DIGITAL MEMBERSHIP PASS'}
                </span>
                <h3 className="font-syne font-black text-base sm:text-lg text-[#1f1a1d] mt-1">
                  SOA VIP Membership Pass
                </h3>
                <p className="font-jakarta text-xs text-[#5b3f48] mt-0.5 font-medium">
                  {isFr
                    ? 'Il s\'agit d\'une carte de membre digitale, stockée dans le digital wallet de la cliente.'
                    : 'This is a digital membership card, stored in the customer\'s digital wallet.'}
                </p>
              </div>

              {/* Strategic Purpose Callout */}
              <div className="bg-[#ffd9e3]/60 border border-[#b40065]/30 rounded-2xl p-3 flex items-start gap-2.5">
                <span className="text-base shrink-0">💎</span>
                <div className="font-space text-[11px] text-[#5b3f48] leading-snug">
                  <strong className="text-[#b40065] font-bold block uppercase tracking-wider text-[10px]">
                    {isFr ? 'OBJECTIF STRATÉGIQUE (PURPOSE) :' : 'STRATEGIC PURPOSE:'}
                  </strong>
                  {isFr
                    ? 'Récompenser les clientes fidèles et créer un sentiment d\'exclusivité réel et durable.'
                    : 'Reward loyal customers and create a feeling of exclusivity.'}
                </div>
              </div>

              {/* 3D Holographic Membership Card */}
              <div className="relative mx-auto w-full max-w-md h-56 sm:h-64 rounded-3xl p-5 sm:p-6 text-white shadow-2xl overflow-hidden border-2 border-white/60 bg-gradient-to-tr from-[#99004f] via-[#e10080] to-[#764d93] transition-all hover:scale-[1.02]">
                {/* Iridescent shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#79f5fb]/30 blur-2xl pointer-events-none" />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-syne font-black tracking-widest text-lg sm:text-xl drop-shadow-md">
                        NAILSBYSOA
                      </span>
                      <span className="block font-space text-[10px] text-pink-200 tracking-wider">
                        VIP MEMBERSHIP PASS • WEB3
                      </span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md border border-white/40 px-2.5 py-1 rounded-full text-right font-space text-[10px] font-bold">
                      ✦ SOULBOUND #0842
                    </div>
                  </div>

                  {/* Card Center Chip & Holographic Star */}
                  <div className="flex items-center justify-between my-2">
                    <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 border border-amber-100/60 shadow-xs flex items-center justify-center">
                      <div className="w-6 h-4 border border-black/30 rounded-xs" />
                    </div>
                    <div className="font-space text-xs text-white/90 bg-black/25 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                      ⚡ 48H EARLY ACCESS
                    </div>
                  </div>

                  {/* Card Bottom Info */}
                  <div className="flex items-end justify-between border-t border-white/30 pt-3">
                    <div>
                      <span className="font-space text-[9px] uppercase tracking-wider text-pink-200 block">
                        {isFr ? 'TITULAIRE VIP' : 'PASS HOLDER'}
                      </span>
                      <span className="font-syne font-bold text-sm tracking-wide">
                        {clientProfile?.name || 'Mia Vance'}
                      </span>
                      <span className="block font-space text-[10px] text-[#ffd9e3]">
                        {clientProfile?.tier || 'Diamond Starlet'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-space text-[9px] uppercase tracking-wider text-pink-200 block">
                        SPARKLE CASH
                      </span>
                      <span className="font-syne font-extrabold text-base text-[#79f5fb]">
                        {clientProfile?.sparkleCash ? clientProfile.sparkleCash.toFixed(2) : '15.00'} €
                      </span>
                      <span className="block font-space text-[9px] text-emerald-300 font-bold">
                        ● VERIFIED ON-CHAIN
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What it gives members: Exact 4 pillars */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#ffd9e3] space-y-2 shadow-xs">
                <span className="font-space text-[10px] font-extrabold uppercase text-[#b40065] block">
                  {isFr ? 'AVANTAGES DONNÉS AUX MEMBRES :' : 'WHAT IT GIVES MEMBERS:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-jakarta text-xs text-[#5b3f48]">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fff5f8] border border-pink-100">
                    <span className="text-[#b40065] text-sm">⚡</span>
                    <span className="font-medium">
                      {isFr ? 'Accès anticipé aux drops mensuels (Early access)' : 'Early access to monthly nail drops.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fff5f8] border border-pink-100">
                    <span className="text-[#b40065] text-sm">👑</span>
                    <span className="font-medium">
                      {isFr ? 'Réservation prioritaire (Priority booking)' : 'Priority booking.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fff5f8] border border-pink-100">
                    <span className="text-[#b40065] text-sm">💅</span>
                    <span className="font-medium">
                      {isFr ? 'Accès aux designs d\'ongles exclusifs' : 'Access to exclusive nail designs.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fff5f8] border border-pink-100">
                    <span className="text-[#b40065] text-sm">🎁</span>
                    <span className="font-medium">
                      {isFr ? 'Avantages VIP et récompenses de fidélité' : 'VIP benefits and loyalty rewards.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  onClick={() => setIsWalletSaved(true)}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-full font-space text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    isWalletSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  <span></span>
                  <span>
                    {isWalletSaved
                      ? (isFr ? '✓ Pass Enregistré dans Apple Wallet' : '✓ Added to Apple Wallet')
                      : (isFr ? 'Ajouter à mon Apple Wallet / Digital Wallet' : 'Add to Apple Wallet / Digital Wallet')}
                  </span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onSelectAction) onSelectAction(isFr ? 'Je veux utiliser mon pass VIP pour réserver THE SOA DROP' : 'I want to use my VIP pass to book THE SOA DROP');
                  }}
                  className="w-full sm:w-auto py-3 px-5 rounded-full bg-gradient-to-r from-[#b40065] to-[#e10080] text-white font-space text-xs font-bold hover:shadow-md cursor-pointer active:scale-95 transition-all text-center"
                >
                  {isFr ? '✦ Réserver avec mon Pass' : '✦ Book with Pass'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SOA DIGITAL COLLECTIBLES (HOLOGRAPHIC BADGES VAULT) */}
          {activeTab === 'collectibles' && (
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-space font-extrabold uppercase tracking-wider text-[#764d93] bg-[#f3daff] px-2.5 py-0.5 rounded-full">
                  {isFr ? 'MÉCANIQUE 2 // BADGES DIGITAUX DE PRÉSENCE' : 'MECHANIC 2 // DIGITAL COLLECTIBLES'}
                </span>
                <h3 className="font-syne font-black text-base sm:text-lg text-[#1f1a1d] mt-1">
                  SOA Digital Collectibles
                </h3>
                <p className="font-jakarta text-xs text-[#5b3f48] mt-0.5 font-medium">
                  {isFr
                    ? 'Chaque fois qu\'une cliente assiste à un rendez-vous THE SOA DROP, elle reçoit un badge digital collectible lié à cette collection.'
                    : 'Every time a customer attends a THE SOA DROP appointment, they receive a digital collectible badge linked to that collection.'}
                </p>
              </div>

              {/* Purpose & Multi-Badge Unlocks Callout */}
              <div className="bg-[#f3daff]/70 border border-[#764d93]/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0">✨</span>
                  <div className="font-space text-[11px] text-[#572e73] leading-snug">
                    <strong className="text-[#764d93] font-bold block uppercase tracking-wider text-[10px]">
                      {isFr ? 'OBJECTIF STRATÉGIQUE (PURPOSE) :' : 'STRATEGIC PURPOSE:'}
                    </strong>
                    {isFr
                      ? 'Encourager les visites répétées et faire en sorte que les clientes se sentent impliquées dans l\'aventure de la marque.'
                      : 'Encourage repeat visits and make customers feel involved in the brand\'s journey.'}
                  </div>
                </div>

                <div className="border-t border-[#764d93]/20 pt-2 flex items-center gap-2 font-space text-[11px] text-[#572e73]">
                  <span>🎁</span>
                  <span>
                    <strong>{isFr ? 'Récompenses débloquées :' : 'Rewards Unlocked:'}</strong>{' '}
                    {isFr
                      ? 'Collectionner plusieurs badges débloque des récompenses additionnelles ou des expériences exclusives !'
                      : 'Collecting several badges can unlock additional rewards or exclusive experiences.'}
                  </span>
                </div>
              </div>

              {/* Crucial Non-Transferable (Soulbound) Notice */}
              <div className="bg-[#ffd9e3]/60 border border-[#b40065]/40 rounded-2xl p-3 flex items-start gap-2.5">
                <span className="text-base shrink-0">🔒</span>
                <div className="font-space text-[11px] text-[#5b3f48] leading-snug">
                  <strong className="text-[#b40065] font-bold block">
                    {isFr ? 'Badges non-transférables (Non-transferable) :' : 'Non-Transferable Collectibles:'}
                  </strong>
                  {isFr
                    ? 'Les clientes ne peuvent ni les revendre ni les échanger. Cela évite toute revente spéculative et maintient l\'accent sur la fidélité client authentique plutôt que sur le profit.'
                    : 'Customers cannot resell or trade them. This avoids speculative resale and keeps the focus on genuine customer loyalty rather than making money from NFTs.'}
                </div>
              </div>

              {/* Milestones Rewards Progress Bar */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#ffd9e3] shadow-xs space-y-2">
                <div className="flex items-center justify-between font-space text-xs">
                  <span className="font-bold text-[#b40065] flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>{isFr ? 'Palier de Fidélité Badges' : 'Badge Loyalty Milestone'}</span>
                  </span>
                  <span className="font-bold text-[#764d93]">
                    1 / 3 {isFr ? 'Collectés' : 'Collected'}
                  </span>
                </div>

                <div className="w-full bg-[#f5ebef] h-2.5 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-[#b40065] to-[#dcacfb] h-full rounded-full transition-all duration-500 w-1/3" />
                </div>

                <div className="flex justify-between font-space text-[10px] text-[#8f6e78] pt-1">
                  <span>Badge 01: Débloqué ✨</span>
                  <span>Badge 02: Charme Chrome 3D offert 🎁</span>
                  <span>Badge 03: Masterclass & Set VIP Privé 👑</span>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBadge(b)}
                    className={`bg-white rounded-2xl p-3 border transition-all cursor-pointer shadow-xs hover:shadow-md hover:border-[#b40065] relative flex flex-col justify-between ${
                      b.status === 'collected'
                        ? 'border-[#b40065]'
                        : b.status === 'active'
                        ? 'border-[#dcacfb] bg-gradient-to-b from-white to-[#fff0f5]'
                        : 'border-neutral-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#fbebf1] border border-pink-100 flex items-center justify-center">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {b.status === 'collected' && (
                          <span className="absolute top-2 right-2 bg-[#b40065] text-white text-[9px] font-space font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                            COLLECTÉ ✓
                          </span>
                        )}
                        {b.status === 'active' && (
                          <span className="absolute top-2 right-2 bg-gradient-to-r from-[#ff1493] to-[#764d93] text-white text-[9px] font-space font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                            DROP EN COURS 🔥
                          </span>
                        )}
                        {b.status === 'locked' && (
                          <span className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-space font-bold text-xs">
                            🔒 BIENTÔT
                          </span>
                        )}
                      </div>

                      <span className="font-space text-[9px] text-[#764d93] font-bold block">
                        {b.edition}
                      </span>
                      <h4 className="font-syne font-bold text-xs text-[#1f1a1d] leading-snug mt-0.5">
                        {b.title}
                      </h4>
                      <p className="font-jakarta text-[10px] text-[#8f6e78] line-clamp-2 mt-1">
                        {b.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#ffd9e3]/60 flex items-center justify-between font-space text-[10px]">
                      <span className="text-[#b40065] font-semibold">{b.rarity}</span>
                      <span className="text-[#8f6e78]">{b.dateCollected}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY DESIGN VOTING */}
          {activeTab === 'vote' && (
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-space font-extrabold uppercase tracking-wider text-[#b40065] bg-[#ffd9e3] px-2.5 py-0.5 rounded-full">
                  {isFr ? 'GOUVERNANCE & PARTICIPATION' : 'COMMUNITY CO-CREATION'}
                </span>
                <h3 className="font-syne font-black text-base sm:text-lg text-[#1f1a1d] mt-1">
                  {isFr ? 'Votez pour le Prochain Drop SOA !' : 'Vote on the Next SOA Drop!'}
                </h3>
                <p className="font-jakarta text-xs text-[#5b3f48]">
                  {isFr
                    ? 'En tant que titulaire du SOA VIP Pass, votre voix décide des collections limitées de l\'Atelier. 1 Pass = 1 Vote garanti.'
                    : 'As a SOA VIP Pass holder, your vote decides upcoming limited collections. 1 Pass = 1 Guaranteed Vote.'}
                </p>
              </div>

              {/* Voting Options */}
              <div className="space-y-2.5">
                {votingOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => !hasVoted && setSelectedVote(opt.id)}
                    className={`bg-white rounded-2xl p-3.5 border-2 transition-all cursor-pointer relative shadow-xs ${
                      selectedVote === opt.id
                        ? 'border-[#b40065] bg-gradient-to-r from-white via-[#fff7f9] to-[#ffd9e3]/30'
                        : 'border-[#e3bdc7] hover:border-[#b40065]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedVote === opt.id
                              ? 'border-[#b40065] bg-[#b40065]'
                              : 'border-[#8f6e78]'
                          }`}
                        >
                          {selectedVote === opt.id && <span className="text-white text-xs">✓</span>}
                        </div>
                        <div>
                          <h4 className="font-syne font-bold text-xs sm:text-sm text-[#1f1a1d]">
                            {opt.title}
                          </h4>
                          <p className="font-jakarta text-xs text-[#5b3f48] mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-syne font-extrabold text-sm text-[#b40065]">
                          {opt.percent}
                        </span>
                        <div className="font-space text-[10px] text-[#8f6e78]">
                          {opt.votes} {isFr ? 'votes' : 'votes'}
                        </div>
                      </div>
                    </div>

                    {/* Vote progress line */}
                    <div className="w-full bg-[#f5ebef] h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="bg-[#b40065] h-full rounded-full transition-all duration-700"
                        style={{ width: opt.percent }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Vote Button */}
              <div className="text-center pt-1">
                {hasVoted ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl p-3 font-space text-xs font-semibold flex items-center justify-center gap-2">
                    <span>✨</span>
                    <span>
                      {isFr
                        ? 'Vote VIP validé et enregistré sur la blockchain ! Merci babe pour ta participation.'
                        : 'VIP Vote confirmed & recorded on-chain! Thank you babe for your vote.'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleVoteSubmit}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#b40065] via-[#e10080] to-[#764d93] text-white font-space text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    {isFr ? '✦ Valider mon Vote VIP avec mon Pass' : '✦ Submit VIP Vote with Pass'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HOW IT WORKS & GDPR PRIVACY FLOW */}
          {activeTab === 'onboarding' && (
            <div className="space-y-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-space font-extrabold uppercase tracking-wider text-[#b40065] bg-[#ffd9e3] px-2.5 py-0.5 rounded-full">
                  {isFr ? 'PARCOURS CLIENT SIMPLIFIÉ' : 'SEAMLESS ONBOARDING FLOW'}
                </span>
                <h3 className="font-syne font-black text-base sm:text-lg text-[#1f1a1d] mt-1">
                  {isFr ? 'Comment fonctionne la campagne THE SOA DROP ?' : 'How does THE SOA DROP campaign work?'}
                </h3>
                <p className="font-jakarta text-xs text-[#5b3f48]">
                  {isFr
                    ? 'Aucune connaissance technique requise : une expérience simple, inclusive et 100% conforme RGPD.'
                    : 'No crypto knowledge needed: a simple, inclusive, and 100% GDPR-compliant luxury experience.'}
                </p>
              </div>

              {/* 6-Step Journey */}
              <div className="space-y-2">
                {[
                  {
                    step: '01',
                    icon: '📸',
                    title: isFr ? 'Découvrir le Drop' : 'Discover the Drop',
                    desc: isFr
                      ? 'Découverte de la nouvelle collection capsule sur Instagram (@nailsbysoa) ou via l\'Atelier.'
                      : 'Discover the new limited-edition capsule on Instagram (@nailsbysoa) or in the Atelier.',
                  },
                  {
                    step: '02',
                    icon: '✍️',
                    title: isFr ? 'Inscription Communauté' : 'Sign up for Community',
                    desc: isFr
                      ? 'Visitez l\'application et rejoignez la communauté exclusive NailsbySoa en quelques clics.'
                      : 'Visit the web app and register for the exclusive NailsbySoa community.',
                  },
                  {
                    step: '03',
                    icon: '🛡️',
                    title: isFr ? 'Consentement RGPD Transparent' : 'Clear GDPR Consent',
                    desc: isFr
                      ? 'Accord explicite sur la protection et l\'utilisation de vos données personnelles sous les règles RGPD.'
                      : 'Explicit agreement on personal data protection and privacy under GDPR rules.',
                  },
                  {
                    step: '04',
                    icon: '💳',
                    title: isFr ? 'Déblocage du Pass VIP' : 'Unlock VIP Pass',
                    desc: isFr
                      ? 'Réception instantanée de votre SOA VIP Membership Pass dans votre digital wallet.'
                      : 'Instant receipt of your digital SOA VIP Membership Pass in your digital wallet.',
                  },
                  {
                    step: '05',
                    icon: '⚡',
                    title: isFr ? 'Profiter des Avantages & Voter' : 'Enjoy Benefits & Vote',
                    desc: isFr
                      ? 'Réservation prioritaire 48h en avance, tarifs exclusifs et participation aux votes de collections.'
                      : '48h early priority booking, exclusive rates, and voting on community collections.',
                  },
                  {
                    step: '06',
                    icon: '💎',
                    title: isFr ? 'Recevoir son Collectible Badge' : 'Receive Digital Collectible',
                    desc: isFr
                      ? 'Après votre pose THE SOA DROP, votre badge souvenir non-transférable est minté sur votre profil !'
                      : 'After your appointment, your unique non-transferable memory badge is unlocked!',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white rounded-xl p-3 border border-[#ffd9e3] flex items-center space-x-3 shadow-xs hover:border-[#b40065] transition-colors"
                  >
                    <span className="font-space font-black text-xs text-[#b40065] bg-[#ffd9e3] px-2 py-1 rounded-lg shrink-0">
                      {item.step}
                    </span>
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-syne font-bold text-xs text-[#1f1a1d]">
                        {item.title}
                      </h4>
                      <p className="font-jakarta text-[11px] text-[#5b3f48] leading-tight mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* GDPR Privacy Box */}
              <div className="bg-white rounded-2xl p-4 border-2 border-[#b40065]/40 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🛡️</span>
                    <h4 className="font-syne font-bold text-xs text-[#1f1a1d]">
                      {isFr ? 'Protection des Données & Conformité RGPD' : 'Data Protection & GDPR Compliance'}
                    </h4>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-space font-bold px-2 py-0.5 rounded-full">
                    RGPD CONFORME ✓
                  </span>
                </div>

                <p className="font-jakarta text-[11px] text-[#5b3f48] leading-relaxed">
                  {isFr
                    ? 'Conformément au Règlement Général sur la Protection des Données (RGPD), vos données ne sont jamais vendues ni cédées à des tiers. Elles servent exclusivement à l\'émission de votre Pass VIP, à vos réductions Sparkle Cash et à l\'attribution de vos badges digitaux de fidélité.'
                    : 'In compliance with the General Data Protection Regulation (GDPR), your data is never sold or transferred to third parties. It is strictly used to issue your VIP Pass, manage your Sparkle Cash rewards, and award your loyalty badges.'}
                </p>

                <label className="flex items-center space-x-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-[#b40065] focus:ring-[#b40065] cursor-pointer"
                  />
                  <span className="font-space text-[10px] text-[#1f1a1d] font-semibold">
                    {isFr
                      ? 'J\'accepte la politique de confidentialité pour mon SOA VIP Pass.'
                      : 'I accept the privacy policy for my SOA VIP Pass.'}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#ffd9e3] bg-white/90 font-space text-xs">
          <div className="flex items-center gap-1.5 text-[#8f6e78] text-[10px]">
            <span>✦</span>
            <span>NAILSBYSOA WEB3 LOYALTY ARCHITECTURE</span>
          </div>
          <button
            onClick={onClose}
            className="bg-[#ffd9e3] text-[#b40065] hover:bg-[#b40065] hover:text-white px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer"
          >
            {isFr ? 'Fermer' : 'Close'}
          </button>
        </div>

      </div>

      {/* Detail Modal for Selected Badge */}
      {selectedBadge && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full border-2 border-[#b40065] text-center space-y-3 relative shadow-2xl font-jakarta">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#ffd9e3] text-[#b40065] flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#b40065] hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-2 border-[#b40065] shadow-lg">
              <img
                src={selectedBadge.image}
                alt={selectedBadge.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="font-space text-[10px] font-bold text-[#b40065] uppercase bg-[#ffd9e3] px-2.5 py-0.5 rounded-full">
                {selectedBadge.edition}
              </span>
              <h3 className="font-syne font-black text-sm text-[#1f1a1d] mt-1.5">
                {selectedBadge.title}
              </h3>
              <p className="font-jakarta text-xs text-[#5b3f48] mt-1 leading-snug">
                {selectedBadge.description}
              </p>
            </div>

            <div className="bg-[#fcf3f7] rounded-xl p-2.5 font-space text-[11px] text-[#5b3f48] text-left space-y-1 border border-[#ffd9e3]">
              <div><strong>Prestation :</strong> {selectedBadge.set}</div>
              <div><strong>Statut :</strong> <span className="text-[#b40065] font-bold">{selectedBadge.rarity}</span></div>
              <div><strong>Date :</strong> {selectedBadge.dateCollected}</div>
              <div className="text-[10px] text-[#764d93] italic pt-1 border-t border-[#ffd9e3]">
                {isFr ? '🔒 Non transférable • Preuve de présence infalsifiable' : '🔒 Soulbound • Tamper-proof salon attendance record'}
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-full bg-[#b40065] text-white font-space text-xs font-bold hover:bg-[#e10080] transition-colors cursor-pointer"
            >
              {isFr ? 'Compris !' : 'Got it!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
