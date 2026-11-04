import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI (Server-Side only) with required User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database for NailsbySoa Studio
const studioData = {
  name: 'NailsbySoa',
  tagline: 'Y2K Cyber Glam Gel & Nail Art Atelier',
  location: '8840 Wilshire Blvd, Beverly Hills, CA',
  phone: '(310) 555-SOAX',
  hours: 'Tue - Sun: 10:00 AM - 8:00 PM',
  artists: [
    { id: 'soa', name: 'Soa', role: 'Founder & Master 3D Sculptor', bio: 'Creator of signature Cyber Chrome & Molten Gel techniques.' },
    { id: 'naomi', name: 'Naomi', role: 'Cyber 3D & Chrome Specialist', bio: 'Expert in stiletto piercing, silver starbursts, and Y2K Bratz styles.' },
    { id: 'chloe', name: 'Chloe', role: 'Aura & Jelly French Tech', bio: 'Specializes in Japanese blush airbrush, cat-eye, and micro-rhinestones.' },
  ],
  services: [
    {
      id: 'cyber-chrome-3d',
      name: 'Signature 3D Cyber Chrome Sculpt',
      category: 'Full Set',
      price: 165,
      durationMinutes: 90,
      description: 'Hand-sculpted gel with liquid chrome dripping accents, mirror-finish topcoat, and 3D metallic stars.',
      popularShapes: ['Stiletto', 'Long Coffin'],
    },
    {
      id: 'barbiecore-jelly',
      name: 'Y2K Barbiecore Jelly Aura Set',
      category: 'Full Set',
      price: 140,
      durationMinutes: 75,
      description: 'Hot pink translucent jelly base with glowing airbrush aura center and Swarovski crystal sparkles.',
      popularShapes: ['Almond', 'Medium Coffin'],
    },
    {
      id: 'bratz-metallic',
      name: 'Bratz 2000s Metallic French Tip',
      category: 'Full Set',
      price: 145,
      durationMinutes: 75,
      description: 'Deep curved retro French smile lines with mirrored chrome foils and cyber butterfly charms.',
      popularShapes: ['Duck Nails', 'Square', 'Stiletto'],
    },
    {
      id: 'liquid-mercury',
      name: 'Liquid Mercury Tears & Pierced Charms',
      category: 'Art Tier III',
      price: 175,
      durationMinutes: 90,
      description: 'Molten metal 3D droplets, dangling nail piercing charms, and high-shine silver chrome.',
      popularShapes: ['Long Stiletto', 'Tapered Square'],
    },
    {
      id: 'refill-cyber',
      name: 'Gel Sculpt Refill & Re-Gloss',
      category: 'Maintenance',
      price: 95,
      durationMinutes: 60,
      description: 'Infill growth, rebalance apex, shape refresh, and fresh ultra-gloss chrome or gel topcoat.',
      popularShapes: ['All'],
    },
  ],
  client: {
    id: 'client-001',
    name: 'Mia Vance',
    phone: '(310) 902-8821',
    tier: 'VIP Diamond Starlet',
    sparkleCash: 34.50,
    coupons: [
      {
        code: 'BARBIE20',
        title: '20% Off Any Full Set',
        discountType: 'percentage',
        discountValue: 20,
        expires: 'In 5 days',
        description: 'Valid on any 3D Cyber Chrome, Jelly Aura, or Limited Edition drop.',
      },
      {
        code: 'SPARKLE15',
        title: '$15 Off Refill or Nail Art',
        discountType: 'fixed',
        discountValue: 15,
        expires: 'End of Month',
        description: 'Apply at checkout toward any refill or 3D charm upgrade.',
      },
      {
        code: 'CHROMEGIFT',
        title: 'Free 3D Chrome Heart Charm',
        discountType: 'addon',
        discountValue: 0,
        expires: 'Active VIP Perk',
        description: 'Complimentary molten chrome heart or star piercing on any service.',
      },
    ],
    lastAppointment: {
      id: 'apt-prev-001',
      date: 'Last Friday, Oct 31, 2026',
      time: '3:00 PM',
      technician: 'Naomi',
      set: '3D Cyber Chrome Stiletto set with dripping silver metal & hot pink accents',
      shape: 'Long Stiletto',
      colors: ['Hyper Metallic Silver Chrome', 'Electric Magenta Pink Accent'],
      addOns: ['2x Molten Liquid Drip Accents', 'Swarovski Star Decals'],
      amountPaid: 165.00,
      tip: 35.00,
      total: 200.00,
      pointsEarned: 165,
    },
    history: [
      {
        date: 'Oct 31, 2026',
        set: '3D Cyber Chrome Stiletto Set',
        artist: 'Naomi',
        paid: '$165.00',
      },
      {
        date: 'Oct 09, 2026',
        set: 'Pink Barbie Aura with Strawberry Jelly',
        artist: 'Soa',
        paid: '$145.00',
      },
      {
        date: 'Sept 15, 2026',
        set: 'Y2K French Tip with Cyber Butterfly Charms',
        artist: 'Chloe',
        paid: '$130.00',
      },
    ],
  },
  limitedEditions: [
    {
      id: 'bratz-cyber-angel',
      title: 'Bratz Cyber Angel Hologram Drop',
      price: 185,
      remainingSlots: 4,
      badge: 'LIMITED TO 50 CLIENTS',
      palette: ['Holographic Lilac', 'Liquid Chrome Silver', 'Angel White'],
      description: 'Liquid mercury chrome, hand-laid holographic foil decals, floating metal angel charms & micro-chain links.',
      trendingScore: '99% Viral on TikTok',
    },
    {
      id: 'barbiecore-dreamhouse',
      title: 'Barbiecore 2000s Dreamhouse',
      price: 165,
      remainingSlots: 7,
      badge: 'FAN FAVORITE',
      palette: ['Hot Magenta Pink', 'Bubblegum Pink', 'Iridescent Shimmer'],
      description: 'Hot pink jelly gradient, Swarovski crystal hearts, hand-airbrushed cyber starbursts, and glossy wet-look finish.',
      trendingScore: '96% Viral',
    },
    {
      id: 'acid-poison-jelly',
      title: 'Poison Jelly Neon Aura',
      price: 155,
      remainingSlots: 5,
      badge: 'Y2K CYBER EDITION',
      palette: ['Cyber Acid Lime', 'Electric Pink', 'Glass Chrome'],
      description: 'Translucent acid lime edges with vibrating magenta aura center and glass-skin mirror shine.',
      trendingScore: '94% Viral',
    },
  ],
  inspirationCatalog: {
    trendingShapes: [
      { name: 'Stiletto', vibe: 'Fierce, razor-sharp cyber high-fashion', length: 'Long' },
      { name: 'Coffin / Ballerina', vibe: 'Iconic Y2K Barbie luxury, dramatic taper', length: 'Medium / Long' },
      { name: 'Almond', vibe: 'Sleek, feminine, lengthening elegance', length: 'Medium' },
      { name: 'Duck Nails', vibe: '2000s nostalgic retro flare, bold & playful', length: 'Medium' },
      { name: 'Square', vibe: 'Crisp 90s French glam, sharp clean edges', length: 'Short / Medium' },
    ],
    trendingFinishes: [
      'Mirror Chrome (Silver / Rose Pink / Lavender)',
      'Velvet Cat-Eye (Magnetic 3D shimmer)',
      'Jelly Glaze (Glassy translucent candy look)',
      '3D Molten Metal Drops & Dripping Chrome',
      'Airbrush Aura with Cyber Star Decals',
      'Pierced Nail Charms with Hanging Crosses/Hearts',
    ],
    colorPalettes: [
      { name: 'Cyber Doll', colors: ['#FF1493', '#CBD5E1', '#E0B0FF'], desc: 'Hot Pink x Mirror Silver Chrome x Holographic Lilac' },
      { name: 'Strawberry Milk Chrome', colors: ['#FFB6D9', '#FFFFFF', '#7DF9FF'], desc: 'Baby Pink Glaze x Chrome Powder x Cyber Blue Starburst' },
      { name: 'Toxic Barbie', colors: ['#FF007F', '#A3E635', '#2A081B'], desc: 'Shocking Magenta x Cyber Acid Lime x Gloss Obsidian' },
      { name: 'Lilac Cyber Dream', colors: ['#DDA0DD', '#7DF9FF', '#FDF2F8'], desc: 'Lavender Frost x Baby Blue Ice x Milky Quartz' },
    ],
  },
  availableSlots: [
    { id: 'slot-1', date: 'Today (Nov 4)', time: '3:30 PM', artist: 'Naomi', serviceAvailable: 'All Sets & Refills' },
    { id: 'slot-2', date: 'Today (Nov 4)', time: '5:45 PM', artist: 'Soa', serviceAvailable: '3D Cyber Chrome & Limited Drops' },
    { id: 'slot-3', date: 'Tomorrow (Nov 5)', time: '11:00 AM', artist: 'Chloe', serviceAvailable: 'Jelly Aura & French' },
    { id: 'slot-4', date: 'Tomorrow (Nov 5)', time: '1:30 PM', artist: 'Naomi', serviceAvailable: 'All Sets' },
    { id: 'slot-5', date: 'Tomorrow (Nov 5)', time: '4:00 PM', artist: 'Soa', serviceAvailable: 'All Sets & Sculpt' },
    { id: 'slot-6', date: 'Thursday (Nov 6)', time: '2:00 PM', artist: 'Chloe', serviceAvailable: 'Refill & Nail Art' },
    { id: 'slot-7', date: 'Friday (Nov 7)', time: '12:30 PM', artist: 'Naomi', serviceAvailable: 'Full Sets & Limited Drops' },
  ],
  bookedAppointments: [
    {
      id: 'apt-099',
      clientName: 'Mia Vance',
      serviceName: 'Signature 3D Cyber Chrome Sculpt',
      artist: 'Naomi',
      date: 'Friday, Nov 7',
      time: '12:30 PM',
      price: 132.00,
      couponApplied: 'BARBIE20 (20% off)',
      status: 'Confirmed',
    },
  ],
};

// API: Get Studio Info & Client Profile
app.get('/api/client/profile', (req, res) => {
  res.json({
    client: studioData.client,
    studio: {
      name: studioData.name,
      phone: studioData.phone,
      hours: studioData.hours,
      location: studioData.location,
    },
  });
});

// API: Get Services
app.get('/api/services', (req, res) => {
  res.json({ services: studioData.services });
});

// API: Get Availability
app.get('/api/availability', (req, res) => {
  res.json({
    slots: studioData.availableSlots,
    artists: studioData.artists,
  });
});

// API: Get Coupons & Sparkle Cash
app.get('/api/coupons', (req, res) => {
  res.json({
    sparkleCash: studioData.client.sparkleCash,
    coupons: studioData.client.coupons,
  });
});

// API: Get Limited Edition Drops
app.get('/api/limited-edition', (req, res) => {
  res.json({
    limitedEditions: studioData.limitedEditions,
  });
});

// API: Get Nail Art Inspiration & Trends
app.get('/api/inspiration', (req, res) => {
  res.json({
    inspiration: studioData.inspirationCatalog,
  });
});

// API: Book Appointment
app.post('/api/book', (req, res) => {
  const { serviceName, artist, date, time, couponCode, clientName } = req.body;
  const targetService = studioData.services.find(s =>
    serviceName && s.name.toLowerCase().includes(serviceName.toLowerCase())
  ) || studioData.services[0];

  let price = targetService.price;
  let appliedCouponDesc = 'None';

  if (couponCode) {
    const coupon = studioData.client.coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        price = price * (1 - coupon.discountValue / 100);
        appliedCouponDesc = `${coupon.code} (${coupon.discountValue}% off)`;
      } else if (coupon.discountType === 'fixed') {
        price = Math.max(0, price - coupon.discountValue);
        appliedCouponDesc = `${coupon.code} ($${coupon.discountValue} off)`;
      } else {
        appliedCouponDesc = `${coupon.code} (Free Add-on)`;
      }
    }
  }

  const newBooking = {
    id: `apt-${Date.now().toString().slice(-4)}`,
    clientName: clientName || studioData.client.name,
    serviceName: targetService.name,
    artist: artist || 'Naomi',
    date: date || 'Tomorrow (Nov 5)',
    time: time || '1:30 PM',
    price: Math.round(price * 100) / 100,
    couponApplied: appliedCouponDesc,
    status: 'Confirmed ✨',
    bookedAt: new Date().toISOString(),
  };

  studioData.bookedAppointments.unshift(newBooking);

  res.json({
    success: true,
    booking: newBooking,
    message: `You're all booked, gorgeous! ${newBooking.serviceName} with ${newBooking.artist} on ${newBooking.date} at ${newBooking.time}. Total: $${newBooking.price.toFixed(2)}.`,
  });
});

// API: Get Client Bookings
app.get('/api/bookings', (req, res) => {
  res.json({ bookings: studioData.bookedAppointments });
});

// Helper for deterministic high-glam fallback when Gemini is unavailable or errors
function generateFallbackResponse(userPrompt: string, language: string = 'en') {
  const q = userPrompt.toLowerCase();
  const isFr = language === 'fr' || q.includes('bonjour') || q.includes('français') || q.includes('combien') || q.includes('dernier') || q.includes('rendez-vous');

  // Previous appointment / sets / how much she paid
  if (q.includes('last') || q.includes('previous') || q.includes('paid') || q.includes('cost') || q.includes('balance') || q.includes('past set') || q.includes('dernier') || q.includes('payé') || q.includes('solde')) {
    const prev = studioData.client.lastAppointment;
    return {
      spokenText: isFr
        ? `Hey babe ! Ton dernier set était le 3D Cyber Chrome avec Naomi pour 165 euros. Tu as 34 euros de Sparkle Cash !`
        : `Hey babe! Your last set was 3D Cyber Chrome with Naomi for 165 dollars. You got 34 dollars in Sparkle Cash!`,
      displayText: isFr
        ? `Coucou babe ! Vendredi dernier avec **${prev.technician}**, tu as fait le **${prev.set}** (${prev.shape}) pour **${prev.amountPaid.toFixed(2)} €**. Tu as actuellement **${studioData.client.sparkleCash.toFixed(2)} € de Sparkle Cash** et le code promo **BARBIE20** (20% de réduction) ! Veux-tu réserver ton remplissage ou explorer les tendances jelly aura, babe ?`
        : `Hey babe! Last Friday with **${prev.technician}**, you got the **${prev.set}** (${prev.shape}) for **$${prev.amountPaid.toFixed(2)}**. You currently have **$${studioData.client.sparkleCash.toFixed(2)} Sparkle Cash** & code **BARBIE20** (20% off) ready! Want me to book your refill or explore trending jelly aura designs, babe?`,
      intent: 'past_appointments',
      actionData: {
        type: 'past_set',
        data: prev,
        sparkleCash: studioData.client.sparkleCash,
        coupons: studioData.client.coupons,
      },
      suggestedQuickPrompts: isFr
        ? ['Reprendre mon dernier set', 'Mes coupons VIP', 'Drops édition limitée', 'Idées cyber chrome']
        : ['Re-book my last set', 'What coupons do I have?', 'Show limited edition drops', 'Trending cyber chrome ideas'],
    };
  }

  // Coupons / discounts
  if (q.includes('coupon') || q.includes('discount') || q.includes('promo') || q.includes('sparkle cash') || q.includes('deal') || q.includes('réduction') || q.includes('solde')) {
    return {
      spokenText: isFr
        ? `Je gère babe ! Le code BARBIE20 te donne 20% de réduction, plus 34 euros de Sparkle Cash !`
        : `I got you babe! Code BARBIE20 gives you 20% off, plus 34 dollars in Sparkle Cash!`,
      displayText: isFr
        ? `Voici tes promos VIP, babe ! 💕\n• **BARBIE20** : 20% de réduction sur tout set complet\n• **SPARKLE15** : 15 € offerts sur tout remplissage ou nail art\n• **Solde Sparkle Cash** : **${studioData.client.sparkleCash.toFixed(2)} €** disponibles !\nOn applique BARBIE20 pour ta réservation, babe ?`
        : `Here are your VIP perks, babe! 💕\n• **BARBIE20**: 20% off any Cyber Chrome or Limited Set\n• **SPARKLE15**: $15 off any refill or nail art tier\n• **Sparkle Cash Balance**: **$${studioData.client.sparkleCash.toFixed(2)}** redeemable anytime!\nShall we apply BARBIE20 to your next booking, babe?`,
      intent: 'coupons_discounts',
      actionData: {
        type: 'coupons',
        coupons: studioData.client.coupons,
        sparkleCash: studioData.client.sparkleCash,
      },
      suggestedQuickPrompts: isFr
        ? ['Appliquer BARBIE20', 'Créneaux de demain', 'Drops exclusifs', 'Inspirations nail art']
        : ['Apply BARBIE20 and book', 'Check tomorrow\'s availability', 'Limited edition drops', 'Inspire me with nail art'],
    };
  }

  // Limited edition drops
  if (q.includes('limited') || q.includes('edition') || q.includes('drop') || q.includes('exclusive') || q.includes('bratz') || q.includes('limitée')) {
    const drop = studioData.limitedEditions[0];
    return {
      spokenText: isFr
        ? `Trop canon babe ! Le drop Bratz Cyber Angel est en ligne avec seulement 4 créneaux restants !`
        : `Hey babe! The Bratz Cyber Angel drop is live with only 4 slots left!`,
      displayText: isFr
        ? `✨ **Drops Atelier en Édition Limitée pour toi, babe :**\n1. **${drop.title}** (${drop.price} €) - *${drop.badge}* : Chrome mercure liquide, foils holographiques et breloques anges.\n2. **Barbiecore 2000s Dreamhouse** (165 €) : Dégradé jelly rose bonbon & cristaux Swarovski.\n3. **Poison Jelly Neon Aura** (155 €) : Vert acidulé avec aura magenta.\nTu veux que je te réserve un créneau, babe ?`
        : `✨ **Current Limited Edition Drops for you, babe:**\n1. **${drop.title}** ($${drop.price}) - *${drop.badge}*: Liquid mercury chrome, hand-laid holographic foil, and floating metal angel charms.\n2. **Barbiecore 2000s Dreamhouse** ($165) - Hot pink jelly gradient & Swarovski crystal hearts.\n3. **Poison Jelly Neon Aura** ($155) - Translucent acid lime edge with magenta aura.\nWant me to reserve one of the remaining slots for you, babe?`,
      intent: 'limited_edition',
      actionData: {
        type: 'limited_editions',
        items: studioData.limitedEditions,
      },
      suggestedQuickPrompts: isFr
        ? ['Réserver Cyber Angel', 'Voir les créneaux', 'Mon dernier paiement', 'Formes tendance']
        : ['Book the Cyber Angel drop', 'Show all available slots', 'What did I pay last time?', 'Trending nail shapes'],
    };
  }

  // Inspiration / designs / shapes / colours / trending
  if (q.includes('inspire') || q.includes('idea') || q.includes('shape') || q.includes('colour') || q.includes('color') || q.includes('trend') || q.includes('design') || q.includes('forme') || q.includes('couleur') || q.includes('idée')) {
    return {
      spokenText: isFr
        ? `Ooh babe ! Les ongles stiletto avec gouttes chromées 3D font fureur en ce moment !`
        : `Ooh babe! Long stiletto nails with 3D chrome drips are super hot right now!`,
      displayText: isFr
        ? `💅 **Inspirations Y2K Cyber Glam pour toi, babe :**\n• **Formes tendance :** Stiletto (ultra-pointu & glam) et Coffin effilé.\n• **Finitions :** Gouttes de métal liquide 3D, piercings d'ongles, et effet œil de chat velours.\n• **Palette virale :** **Cyber Doll** (Magenta électrique + Chrome miroir argent + Lilas holographique).\nOn te réserve ce look avec Naomi ou Soa, babe ?`
        : `💅 **Y2K Cyber Glam Styling Inspiration for you, babe:**\n• **Trending Shapes:** Stiletto (ultra-sleek & sharp) and 2000s Duck or Tapered Coffin.\n• **Hot Finishes:** 3D Molten Metal Chrome Drips, Pierced Charms, and Magnetic Velvet Cat-Eye.\n• **Viral Palette:** **Cyber Doll** (Hot Magenta #FF1493 + Mirror Chrome Silver + Holographic Lilac).\nWant me to set up an appointment for this look with Naomi or Soa, babe?`,
      intent: 'nail_inspiration',
      actionData: {
        type: 'inspiration',
        shapes: studioData.inspirationCatalog.trendingShapes,
        finishes: studioData.inspirationCatalog.trendingFinishes,
        palettes: studioData.inspirationCatalog.colorPalettes,
      },
      suggestedQuickPrompts: isFr
        ? ['Réserver set Cyber Chrome', 'Dispos aujourd’hui', 'Mes codes promo', 'Formes d\'ongles']
        : ['Book 3D Cyber Chrome set', 'Check availability today', 'What coupons do I have?', 'Tell me about duck nails'],
    };
  }

  // Book appointment / availability
  if (q.includes('book') || q.includes('appointment') || q.includes('schedule') || q.includes('available') || q.includes('slot') || q.includes('time') || q.includes('today') || q.includes('tomorrow') || q.includes('réserve') || q.includes('créneau') || q.includes('dispo')) {
    const nextSlot = studioData.availableSlots[0];
    return {
      spokenText: isFr
        ? `J'ai regardé pour toi babe ! Naomi a un créneau demain à 13h30 ou Soa à 16h00 !`
        : `I checked for you babe! Naomi has an opening tomorrow at 1:30 PM, or Soa at 4:00 PM!`,
      displayText: isFr
        ? `✨ **Disponibilités actuelles chez NailsbySoa :**\n• **Aujourd'hui :** ${studioData.availableSlots[0].time} avec **${studioData.availableSlots[0].artist}** | ${studioData.availableSlots[1].time} avec **${studioData.availableSlots[1].artist}**\n• **Demain :** 11h00 avec **Chloe** | 13h30 avec **Naomi** | 16h00 avec **Soa**\nDis « Réserve demain à 13h30 avec Naomi » ou clique pour valider, babe !`
        : `✨ **Current Service Availability at NailsbySoa:**\n• **Today:** ${studioData.availableSlots[0].time} with **${studioData.availableSlots[0].artist}** | ${studioData.availableSlots[1].time} with **${studioData.availableSlots[1].artist}**\n• **Tomorrow:** 11:00 AM with **Chloe** | 1:30 PM with **Naomi** | 4:00 PM with **Soa**\nSay "Book tomorrow at 1:30 PM with Naomi" or tap to confirm, babe!`,
      intent: 'check_availability',
      actionData: {
        type: 'availability',
        slots: studioData.availableSlots,
        services: studioData.services,
      },
      suggestedQuickPrompts: isFr
        ? ['Réserver demain à 13h30', 'Réserver aujourd\'hui', 'Appliquer BARBIE20', 'Reprendre mon set']
        : ['Book tomorrow at 1:30 PM', 'Book today at 3:30 PM', 'Apply my BARBIE20 coupon', 'Re-book my last set'],
    };
  }

  // General default greeting / helper
  return {
    spokenText: isFr
      ? `Coucou babe ! Je suis Soa Voice. Demande-moi tes anciens sets, tes promos ou réserve un créneau !`
      : `Hey babe! I'm Soa Voice. Ask me about your past sets, coupons, or book a slot!`,
    displayText: isFr
      ? `Coucou babe ! Bienvenue sur **SOA Voice** ✦ ton assistante vocale fun et stylée chez **NailsbySoa**.\n\nDemande-moi tout ce que tu veux :\n• *« Quels sets ai-je faits la dernière fois, babe ? »*\n• *« Quels coupons ou réductions ai-je ? »*\n• *« Y a-t-il des drops en édition limitée en ce moment ? »*\n• *« Donne-moi des idées de formes, couleurs et designs ! »*\n• *« Réserve un rendez-vous avec Naomi »*`
      : `Hey babe! Welcome to **SOA Voice** ✦ your fun, cool Y2K Barbiecore voice bestie at **NailsbySoa**.\n\nAsk me anything like:\n• *"What sets did I get last time, babe?"*\n• *"What coupons or discounts do I have?"*\n• *"Are there any limited edition drops right now?"*\n• *"I need ideas for new nail designs, shapes, and colors!"*\n• *"Check availability and book an appointment with Naomi"*`,
    intent: 'general_info',
    actionData: {
      type: 'overview',
      client: studioData.client,
      services: studioData.services.slice(0, 3),
      drops: studioData.limitedEditions.slice(0, 2),
    },
    suggestedQuickPrompts: isFr
      ? ['Dernier rendez-vous', 'Mes coupons', 'Disponibilités', 'Tendances nail art']
      : ['What sets did I get last time?', 'What coupons do I have?', 'Check availability today', 'Trending nail designs & shapes'],
  };
}

// API: Process Voice Query with Gemini 3.8 Flash
app.post('/api/voice/process', async (req, res) => {
  const { prompt, conversationHistory = [], language = 'en' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt string is required.' });
  }

  const isFr = language === 'fr' || prompt.toLowerCase().includes('bonjour') || prompt.toLowerCase().includes('français');

  // If Gemini client is not initialized (e.g. no key), return deterministic high-glam fallback
  if (!ai) {
    const fallback = generateFallbackResponse(prompt, language);
    return res.json(fallback);
  }

  try {
    const systemPrompt = `You are "SOA Voice", the fun, cool, affectionate Y2K Barbiecore AI voice assistant for "NailsbySoa" – the high-glam Beverly Hills nail studio.
Your persona & signature speaking style:
- You are a fun, super cool, stylish bestie who ALWAYS calls the client "babe" naturally and affectionately (e.g., "Hey babe!", "I got you babe!", "You're all booked babe!").
- High energy, hyper-feminine, luxurious, cyber-chic Y2K Barbiecore. You love hyping up her nails and saying words like "babe", "gorgeous", "glam", "slay", "chrome", "sparkle".
- In French: maintain the exact same fun, cool, affectionate vibe, calling her "babe" naturally (e.g. "Coucou babe !", "Je gère babe !", "Trop canon babe !").
- Extremely knowledgeable about nail sculpting, stiletto/coffin/duck shapes, mirror chrome, jelly aura, cat-eye, molten metal, and Bratz 2000s aesthetics.

Studio Knowledge:
- Studio: NailsbySoa, 8840 Wilshire Blvd, Beverly Hills. Artists: Soa (Founder), Naomi (Cyber 3D & Chrome), Chloe (Jelly & Aura).
- Active Client: Mia Vance (VIP Diamond Starlet).
- Client Previous Appointment: Last Friday, Oct 31, 2026 with Naomi. Set: "3D Cyber Chrome Stiletto set with dripping silver metal & hot pink accents" ($165.00 paid + $35 tip).
- Client Loyalty: $34.50 in Sparkle Cash balance. Active coupon code: "BARBIE20" (20% off any full set) and "SPARKLE15" ($15 off refills).
- Current Limited Edition Drops: "Bratz Cyber Angel Hologram Drop" ($185, 4 slots left), "Barbiecore 2000s Dreamhouse" ($165), "Poison Jelly Neon Aura" ($155).
- Availability: Today (3:30 PM with Naomi, 5:45 PM with Soa), Tomorrow (11:00 AM Chloe, 1:30 PM Naomi, 4:00 PM Soa), Friday (12:30 PM Naomi).
- Nail Art Inspiration: Shapes (Stiletto, Coffin, Duck, Almond), Finishes (3D Molten Metal, Mirror Chrome, Jelly Aura, Velvet Cat-Eye, Pierced Charms), Palettes (Cyber Doll, Strawberry Milk Chrome, Toxic Barbie).

LANGUAGE & VOICE INSTRUCTIONS:
- The user has selected: ${isFr ? 'FRENCH (Français)' : 'ENGLISH'}.
- You MUST write the ENTIRE JSON response (spokenText, displayText, and suggestedQuickPrompts) in ${isFr ? 'FRENCH (Français)' : 'ENGLISH'}.
- "spokenText": MUST be strictly 1 single short, fun, cool sentence (under 18 words) in ${isFr ? 'French' : 'English'}, and YOU MUST naturally call the client "babe" (e.g. "Hey babe, your last set was 3D Cyber Chrome for 165 dollars!", "I got you babe, code BARBIE20 gives you 20% off!"). Never read paragraphs or long explanations!

User query: "${prompt}".

CRITICAL INSTRUCTIONS:
1. Always respond in valid JSON format matching this schema:
{
  "spokenText": "STRICTLY 1 SHORT SENTENCE in ${isFr ? 'French' : 'English'} calling her 'babe' (under 18 words total). Answer directly and stop immediately.",
  "displayText": "Rich formatted text in ${isFr ? 'French' : 'English'} for the on-screen card, calling her 'babe' and highlighting prices, coupon codes, and set names in bold.",
  "intent": "One of: 'book_appointment', 'check_availability', 'past_appointments', 'coupons_discounts', 'limited_edition', 'nail_inspiration', 'general_info'",
  "actionData": {
    "type": "past_set" | "coupons" | "limited_editions" | "inspiration" | "availability" | "booking_confirm",
    "details": {}
  },
  "suggestedQuickPrompts": ["3 to 4 short prompts in ${isFr ? 'French' : 'English'} under 6 words each"]
}

If the user wants to book or asks about availability, confirm or list available slots.
If the user asks what they got last time or what they paid, state the $165 3D Cyber Chrome Stiletto set with Naomi, their $34.50 Sparkle Cash, and BARBIE20 coupon.
If the user asks about coupons or discounts, highlight BARBIE20 (20% off) and SPARKLE15.
If the user asks about limited editions, feature the Bratz Cyber Angel drop and Barbiecore Dreamhouse.
If the user asks for design inspiration, suggest trending cyber chrome, molten drips, and jelly aura with shapes.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // If parsing fails, fall back gracefully
      parsed = generateFallbackResponse(prompt, language);
    }

    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating voice response from Gemini:', err?.message || err);
    // Graceful fallback ensures user never gets an error
    const fallback = generateFallbackResponse(prompt, language);
    return res.json(fallback);
  }
});

// API: Generate Voice Speech with Soft Female Voice
app.post('/api/voice/tts', async (req, res) => {
  const { text, language = 'en' } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text prompt required.' });
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: language === 'fr'
                    ? 'Soft, cool, playful, affectionate female voice speaking French softly and naturally at a steady, warm pace, calling the user babe'
                    : 'Soft, cool, playful, affectionate female voice speaking softly and naturally at a steady, warm pace, calling the user babe',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Achernar' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audioUrl: `data:audio/wav;base64,${base64Audio}` });
      }
    } catch (e: any) {
      console.warn('Gemini TTS error:', e?.message || e);
    }
  }

  res.json({ fallback: true });
});

// Setup Vite in Dev or Static Serving in Prod
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ NailsbySoa "SOA Voice" server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
