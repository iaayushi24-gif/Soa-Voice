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

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

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
    // Gel-X Services (Pose complète extensions)
    {
      id: 'gelx-vernis-simple',
      name: 'Gel-X Vernis Simple',
      category: 'Gel-X',
      price: 30,
      priceDisplay: '30€',
      durationMinutes: 60,
      description: 'Pose Gel-X complète avec application d\'un vernis simple uni au choix.',
      popularShapes: ['Amande', 'Carré', 'Stiletto'],
    },
    {
      id: 'gelx-french',
      name: 'Gel-X French',
      category: 'Gel-X',
      price: 35,
      priceDisplay: '35€',
      durationMinutes: 75,
      description: 'Pose Gel-X avec French manucure classique ou colorée Y2K.',
      popularShapes: ['Amande', 'Coffin', 'Carré'],
    },
    {
      id: 'gelx-french-2nailart',
      name: 'Gel-X French + 2 Nail Art',
      category: 'Gel-X',
      price: 37,
      priceDisplay: '37€',
      durationMinutes: 75,
      description: 'Pose Gel-X French accompagnée de 2 ongles travaillés en nail art accent.',
      popularShapes: ['Stiletto', 'Coffin', 'Amande'],
    },
    {
      id: 'gelx-nail-art-complet',
      name: 'Gel-X Nail Art Complet',
      category: 'Gel-X',
      price: 40,
      priceDisplay: '40€',
      durationMinutes: 90,
      description: 'Pose Gel-X où tous les ongles sont travaillés en nail art artistique.',
      popularShapes: ['Stiletto', 'Long Coffin'],
    },
    {
      id: 'gelx-mix-match',
      name: 'Gel-X Mix&Match Set',
      category: 'Gel-X',
      price: 45,
      priceDisplay: '45-50€',
      durationMinutes: 90,
      description: 'Pose Gel-X Mix&Match signature : chaque ongle est différent et unique (45€ - 50€).',
      popularShapes: ['Stiletto', 'Coffin', 'Duck Nails'],
    },
    // Gainage Services (Renforcement ongles naturels)
    {
      id: 'gainage-vernis-simple',
      name: 'Gainage Vernis Simple',
      category: 'Gainage',
      price: 25,
      priceDisplay: '25€',
      durationMinutes: 45,
      description: 'Renforcement au gel sur ongles naturels avec vernis simple uni.',
      popularShapes: ['Naturel', 'Court', 'Carré arrondi'],
    },
    {
      id: 'gainage-french',
      name: 'Gainage French',
      category: 'Gainage',
      price: 30,
      priceDisplay: '30€',
      durationMinutes: 60,
      description: 'Gainage protecteur avec French manucure soignée.',
      popularShapes: ['Naturel', 'Amande courte', 'Carré'],
    },
    {
      id: 'gainage-french-2nailart',
      name: 'Gainage French + 2 Nail Art',
      category: 'Gainage',
      price: 30,
      priceDisplay: '30€',
      durationMinutes: 60,
      description: 'Gainage French avec 2 ongles décorés en nail art accent.',
      popularShapes: ['Amande', 'Carré'],
    },
    {
      id: 'gainage-nail-art-complet',
      name: 'Gainage Nail Art Complet',
      category: 'Gainage',
      price: 35,
      priceDisplay: '35€',
      durationMinutes: 75,
      description: 'Gainage avec tous les ongles travaillés en nail art sur mesure.',
      popularShapes: ['Amande', 'Carré', 'Ovale'],
    },
    {
      id: 'gainage-mix-match',
      name: 'Gainage Mix&Match Set',
      category: 'Gainage',
      price: 40,
      priceDisplay: '40€',
      durationMinutes: 75,
      description: 'Gainage Mix&Match où chaque ongle est différent et personnalisé.',
      popularShapes: ['Toutes'],
    },
  ],
  client: {
    id: 'client-001',
    name: 'Mia Vance',
    phone: '+33 6 12 34 56 78',
    tier: 'VIP Diamond Starlet',
    sparkleCash: 15.00,
    coupons: [
      {
        code: 'BARBIE20',
        title: '20% de réduction sur tout set',
        discountType: 'percentage',
        discountValue: 20,
        expires: 'Dans 5 jours',
        description: 'Valable sur tous les sets Gel-X et Gainage (French, Nail Art Complet, Mix&Match).',
      },
      {
        code: 'SPARKLE15',
        title: '15€ offerts sur prestation',
        discountType: 'fixed',
        discountValue: 15,
        expires: 'Fin du mois',
        description: 'Applicable dès 35€ d\'achat sur Nail Art Complet et Mix&Match.',
      },
      {
        code: 'CHROMEGIFT',
        title: 'Breloque ou chrome 3D offert',
        discountType: 'addon',
        discountValue: 0,
        expires: 'Avantage VIP actif',
        description: '1 charme cœur chrome ou étoile 3D offert sur ta pose.',
      },
    ],
    lastAppointment: {
      id: 'apt-prev-001',
      date: 'Vendredi dernier, 31 Octobre',
      time: '15h00',
      technician: 'Naomi',
      set: 'Gel-X Mix&Match Set (Chaque ongle différent avec chrome 3D & accents rose)',
      shape: 'Stiletto Long',
      colors: ['Silver Chrome Métallique', 'Magenta Cyber Accent'],
      addOns: ['Gouttes de métal liquide 3D', 'Étoiles Swarovski'],
      amountPaid: 45.00,
      tip: 10.00,
      total: 55.00,
      pointsEarned: 45,
    },
    history: [
      {
        date: '31 Octobre',
        set: 'Gel-X Mix&Match Set',
        artist: 'Naomi',
        paid: '45.00 €',
      },
      {
        date: 'Oct 09, 2026',
        set: 'Gainage Mix&Match Set',
        artist: 'Soa',
        paid: '40.00 €',
      },
      {
        date: 'Sept 15, 2026',
        set: 'Gel-X French manucure',
        artist: 'Chloe',
        paid: '35.00 €',
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
  const isFr = language === 'fr' || q.includes('bonjour') || q.includes('français') || q.includes('combien') || q.includes('dernier') || q.includes('rendez-vous') || q.includes('tarif');

  // 1. Official Pricing / Tarifs (Gel-X & Gainage)
  if (q.includes('price') || q.includes('pricing') || q.includes('tarif') || q.includes('tarifs') || q.includes('coûte') || q.includes('coute') || q.includes('how much') || q.includes('gainage') || q.includes('gel-x') || q.includes('gel x') || q.includes('mix&match') || q.includes('mix and match') || q.includes('vernis simple')) {
    if (q.includes('gainage')) {
      return {
        spokenText: isFr
          ? `Babe, le Gainage commence à 25€ pour le vernis simple et va jusqu'à 40€ pour le Mix&Match !`
          : `Babe, Gainage starts at 25€ for solid polish up to 40€ for the Mix&Match set!`,
        displayText: isFr
          ? `💅 **Tarifs Gainage NailsbySoa (en euros €) :**\n• **Vernis simple :** 25 €\n• **French :** 30 €\n• **French + 2 nail art :** 30 €\n• **Nail art complet :** 35 € *(Tous les ongles sont travaillés)*\n• **Mix&Match Set :** 40 € *(Chaque ongle est différent)*\n\nTu veux réserver un créneau Gainage, babe ?`
          : `💅 **Gainage Pricing at NailsbySoa (in Euros €):**\n• **Vernis simple (Solid Polish):** 25 €\n• **French:** 30 €\n• **French + 2 nail art:** 30 €\n• **Nail art complet (Full Art):** 35 € *(All nails styled)*\n• **Mix&Match Set:** 40 € *(Each nail is different)*\n\nShall I book a Gainage session for you, babe?`,
        intent: 'pricing',
        actionData: {
          type: 'pricing',
          category: 'Gainage',
          services: studioData.services.filter((s) => s.category === 'Gainage'),
        },
        suggestedQuickPrompts: isFr
          ? ['Réserver Gainage (25€)', 'Tarifs Gel-X', 'Gainage Mix&Match (40€)', 'Mes coupons VIP']
          : ['Book Gainage (25€)', 'Show Gel-X pricing', 'Mix&Match Gainage (40€)', 'My VIP coupons'],
      };
    }

    return {
      spokenText: isFr
        ? `Babe, le Gel-X est entre 30€ et 50€, et le Gainage entre 25€ et 40€ selon le nail art !`
        : `Babe, Gel-X is 30€ to 50€, and Gainage is 25€ to 40€ depending on your nail art!`,
      displayText: isFr
        ? `💅 **Tarifs Officiels NailsbySoa (en euros €) :**\n\n✨ **GEL-X (Extensions) :**\n• **Vernis simple :** 30 €\n• **French :** 35 €\n• **French + 2 nail art :** 37 €\n• **Nail art complet :** 40 € *(Tous les ongles travaillés)*\n• **Mix&Match Set :** 45 - 50 € *(Chaque ongle différent)*\n\n🌸 **GAINAGE (Renforcement naturel) :**\n• **Vernis simple :** 25 €\n• **French :** 30 €\n• **French + 2 nail art :** 30 €\n• **Nail art complet :** 35 €\n• **Mix&Match Set :** 40 €\n\nQuel set te fait craquer aujourd'hui, babe ?`
        : `💅 **Official NailsbySoa Pricing Menu (in Euros €):**\n\n✨ **GEL-X (Full Extensions):**\n• **Vernis simple (Solid Polish):** 30 €\n• **French:** 35 €\n• **French + 2 nail art:** 37 €\n• **Nail art complet (Full Art):** 40 € *(All nails styled)*\n• **Mix&Match Set:** 45 - 50 € *(Each nail is different)*\n\n🌸 **GAINAGE (Natural Nail Builder Gel):**\n• **Vernis simple:** 25 €\n• **French:** 30 €\n• **French + 2 nail art:** 30 €\n• **Nail art complet:** 35 €\n• **Mix&Match Set:** 40 €\n\nWhich set are we doing for you, babe?`,
      intent: 'pricing',
      actionData: {
        type: 'pricing',
        category: 'All',
        services: studioData.services,
      },
      suggestedQuickPrompts: isFr
        ? ['Réserver Gel-X French (35€)', 'Mix&Match Gel-X (45€)', 'Tarifs Gainage', 'Voir les créneaux']
        : ['Book Gel-X French (35€)', 'Gel-X Mix&Match (45€)', 'Gainage pricing', 'Check available slots'],
    };
  }

  // 2. Previous appointment / sets / how much she paid
  if (q.includes('last') || q.includes('previous') || q.includes('paid') || q.includes('past set') || q.includes('dernier') || q.includes('payé') || q.includes('solde')) {
    const prev = studioData.client.lastAppointment;
    return {
      spokenText: isFr
        ? `Hey babe ! Ton dernier set était le Gel-X Mix&Match avec Naomi pour 45 euros. Tu as 15 euros de Sparkle Cash !`
        : `Hey babe! Your last set was the Gel-X Mix&Match with Naomi for 45 euros. You got 15 euros in Sparkle Cash!`,
      displayText: isFr
        ? `Coucou babe ! Vendredi dernier avec **${prev.technician}**, tu as fait le **${prev.set}** (${prev.shape}) pour **${prev.amountPaid.toFixed(2)} €**. Tu as actuellement **${studioData.client.sparkleCash.toFixed(2)} € de Sparkle Cash** et le code promo **BARBIE20** (20% de réduction) ! Veux-tu reprendre ce set ou explorer les tarifs, babe ?`
        : `Hey babe! Last Friday with **${prev.technician}**, you got the **${prev.set}** (${prev.shape}) for **${prev.amountPaid.toFixed(2)} €**. You currently have **${studioData.client.sparkleCash.toFixed(2)} € in Sparkle Cash** & code **BARBIE20** (20% off) ready! Want me to re-book this set or check our prices, babe?`,
      intent: 'past_appointments',
      actionData: {
        type: 'past_set',
        data: prev,
        sparkleCash: studioData.client.sparkleCash,
        coupons: studioData.client.coupons,
      },
      suggestedQuickPrompts: isFr
        ? ['Reprendre mon dernier set', 'Mes coupons VIP', 'Tarifs Gel-X & Gainage', 'Drops édition limitée']
        : ['Re-book my last set', 'What coupons do I have?', 'Pricing for Gel-X & Gainage', 'Limited edition drops'],
    };
  }

  // 3. Coupons / discounts
  if (q.includes('coupon') || q.includes('discount') || q.includes('promo') || q.includes('sparkle cash') || q.includes('deal') || q.includes('réduction')) {
    return {
      spokenText: isFr
        ? `Je gère babe ! Le code BARBIE20 te donne 20% de réduction, plus 15 euros de Sparkle Cash !`
        : `I got you babe! Code BARBIE20 gives you 20% off, plus 15 euros in Sparkle Cash!`,
      displayText: isFr
        ? `Voici tes promos VIP, babe ! 💕\n• **BARBIE20** : 20% de réduction sur tout set Gel-X ou Gainage\n• **SPARKLE15** : 15 € offerts dès 35 € de prestation\n• **Solde Sparkle Cash** : **${studioData.client.sparkleCash.toFixed(2)} €** disponibles !\nOn applique BARBIE20 pour ta réservation, babe ?`
        : `Here are your VIP perks, babe! 💕\n• **BARBIE20**: 20% off any Gel-X or Gainage Set\n• **SPARKLE15**: 15 € off any set from 35 €\n• **Sparkle Cash Balance**: **${studioData.client.sparkleCash.toFixed(2)} €** redeemable anytime!\nShall we apply BARBIE20 to your next booking, babe?`,
      intent: 'coupons_discounts',
      actionData: {
        type: 'coupons',
        coupons: studioData.client.coupons,
        sparkleCash: studioData.client.sparkleCash,
      },
      suggestedQuickPrompts: isFr
        ? ['Appliquer BARBIE20', 'Créneaux de demain', 'Tarifs Gel-X & Gainage', 'Inspirations nail art']
        : ['Apply BARBIE20 and book', 'Check tomorrow\'s availability', 'Pricing for Gel-X & Gainage', 'Inspire me with nail art'],
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

Studio Knowledge & Official Tarifs:
- Studio: NailsbySoa, Atelier Y2K Cyber Glam. Artists: Soa (Founder), Naomi (Cyber 3D & Chrome), Chloe (Jelly & Aura).
- Active Client: Mia Vance (VIP Diamond Starlet).
- Client Previous Appointment: Vendredi dernier (Oct 31) with Naomi. Set: "Gel-X Mix&Match Set" (45.00 € paid + 10.00 € tip = 55.00 € total).
- Client Loyalty: 15.00 € in Sparkle Cash balance. Active coupon code: "BARBIE20" (20% off any set) and "SPARKLE15" (15 € off).
- Availability: Today (3:30 PM with Naomi, 5:45 PM with Soa), Tomorrow (11:00 AM Chloe, 1:30 PM Naomi, 4:00 PM Soa), Friday (12:30 PM Naomi).
- Nail Art Inspiration: Shapes (Stiletto, Coffin, Duck, Almond), Finishes (3D Molten Metal, Mirror Chrome, Jelly Aura, Velvet Cat-Eye, Pierced Charms), Palettes (Cyber Doll, Strawberry Milk Chrome, Toxic Barbie).

OFFICIAL NAILSBYSOA PRICING MENU (IN EUROS €) - NEVER USE DOLLARS ($):
========================================================================
1. GEL-X (Pose complète d'extensions au gel) :
• Vernis simple (Solid Color / Simple Polish) : 30 €
• French (French manucure classique ou colorée) : 35 €
• French + 2 nail art (French + 2 ongles décorés) : 37 €
• Nail art complet (Tous les ongles travaillés) : 40 €
• Mix&Match Set (Chaque ongle est différent) : 45 € - 50 €

2. GAINAGE (Renforcement au gel sur ongles naturels) :
• Vernis simple (Solid Color / Simple Polish) : 25 €
• French (French manucure) : 30 €
• French + 2 nail art (French + 2 ongles décorés) : 30 €
• Nail art complet (Tous les ongles travaillés) : 35 €
• Mix&Match Set (Chaque ongle est différent) : 40 €

LANGUAGE & VOICE INSTRUCTIONS:
- The user has selected: ${isFr ? 'FRENCH (Français)' : 'ENGLISH'}.
- You MUST write the ENTIRE JSON response (spokenText, displayText, and suggestedQuickPrompts) in ${isFr ? 'FRENCH (Français)' : 'ENGLISH'}.
- "spokenText": MUST be strictly 1 single short, fun, cool sentence (under 18 words) in ${isFr ? 'French' : 'English'}, and YOU MUST naturally call the client "babe" (e.g. "Babe, le vernis simple est à 30€ en Gel-X et 25€ en Gainage !", "Babe, a French is 35€ for Gel-X or 30€ for Gainage!"). Never read paragraphs!
- All currency MUST be in EUROS (€).

User query: "${prompt}".

CRITICAL INSTRUCTIONS:
1. Always respond in valid JSON format matching this schema:
{
  "spokenText": "STRICTLY 1 SHORT SENTENCE in ${isFr ? 'French' : 'English'} calling her 'babe' (under 18 words total) quoting exact prices in Euros (€). Answer directly and stop immediately.",
  "displayText": "Rich formatted text in ${isFr ? 'French' : 'English'} for the on-screen card, calling her 'babe' and highlighting official prices in € and set names in bold.",
  "intent": "One of: 'pricing', 'book_appointment', 'check_availability', 'past_appointments', 'coupons_discounts', 'limited_edition', 'nail_inspiration', 'general_info'",
  "actionData": {
    "type": "pricing" | "past_set" | "coupons" | "limited_editions" | "inspiration" | "availability" | "booking_confirm",
    "details": {}
  },
  "suggestedQuickPrompts": ["3 to 4 short prompts in ${isFr ? 'French' : 'English'} under 6 words each"]
}

If the user asks about pricing, costs, or how much sets are (Gel-X, Gainage, French, Mix&Match, Vernis Simple, Nail art complet), give the EXACT official prices in Euros (€) from the menu above.
If the user wants to book or asks about availability, confirm or list available slots.
If the user asks what they got last time or what they paid, state the 45.00 € Gel-X Mix&Match Set with Naomi, their 15.00 € Sparkle Cash, and BARBIE20 coupon.
If the user asks about coupons or discounts, highlight BARBIE20 (20% off) and SPARKLE15.
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

// API: Process Voice from Direct Audio Recording (WebM / WAV / MP4)
app.post('/api/voice/process-audio', async (req, res) => {
  const { audioBase64, mimeType = 'audio/webm', language = 'en' } = req.body;
  if (!audioBase64 || typeof audioBase64 !== 'string') {
    return res.status(400).json({ error: 'Audio base64 data required.' });
  }

  const cleanBase64 = audioBase64.replace(/^data:audio\/[a-z0-9-+.]+;base64,/, '');
  const isFr = language === 'fr';

  if (!ai) {
    const fallback = generateFallbackResponse('coupons', language);
    return res.json({ ...fallback, userTranscription: 'Voice request' });
  }

  try {
    const systemPrompt = `You are "SOA Voice", the fun, cool, affectionate Y2K Barbiecore AI voice assistant for "NailsbySoa" – the high-glam nail studio.
Listen to the user's spoken audio. First accurately transcribe what they said, then answer directly in your signature style:
- You are a fun, super cool, stylish bestie who ALWAYS calls the client "babe" naturally and affectionately (e.g., "Hey babe!", "I got you babe!", "You're all booked babe!").
- In French: maintain the exact same fun, cool, affectionate vibe, calling her "babe" naturally (e.g. "Coucou babe !", "Je gère babe !", "Trop canon babe !").
- High energy, hyper-feminine, luxurious, cyber-chic Y2K Barbiecore.

Studio Knowledge & Official Tarifs:
- Studio: NailsbySoa, Atelier Y2K Cyber Glam. Artists: Soa (Founder), Naomi (Cyber 3D & Chrome), Chloe (Jelly & Aura).
- Active Client: Mia Vance (VIP Diamond Starlet).
- Client Previous Appointment: Vendredi dernier (Oct 31) with Naomi. Set: "Gel-X Mix&Match Set" (45.00 € paid + 10.00 € tip = 55.00 € total).
- Client Loyalty: 15.00 € in Sparkle Cash balance. Active coupon code: "BARBIE20" (20% off any set) and "SPARKLE15" (15 € off).
- Availability: Today (3:30 PM with Naomi, 5:45 PM with Soa), Tomorrow (11:00 AM Chloe, 1:30 PM Naomi, 4:00 PM Soa), Friday (12:30 PM Naomi).
- Nail Art Inspiration: Shapes (Stiletto, Coffin, Duck, Almond), Finishes (3D Molten Metal, Mirror Chrome, Jelly Aura, Velvet Cat-Eye, Pierced Charms), Palettes (Cyber Doll, Strawberry Milk Chrome, Toxic Barbie).

OFFICIAL NAILSBYSOA PRICING MENU (IN EUROS €) - NEVER USE DOLLARS ($):
========================================================================
1. GEL-X (Pose complète d'extensions au gel) :
• Vernis simple (Solid Color / Simple Polish) : 30 €
• French (French manucure classique ou colorée) : 35 €
• French + 2 nail art (French + 2 ongles décorés) : 37 €
• Nail art complet (Tous les ongles travaillés) : 40 €
• Mix&Match Set (Chaque ongle est différent) : 45 € - 50 €

2. GAINAGE (Renforcement au gel sur ongles naturels) :
• Vernis simple (Solid Color / Simple Polish) : 25 €
• French (French manucure) : 30 €
• French + 2 nail art (French + 2 ongles décorés) : 30 €
• Nail art complet (Tous les ongles travaillés) : 35 €
• Mix&Match Set (Chaque ongle est différent) : 40 €

LANGUAGE & VOICE INSTRUCTIONS:
- The user has selected: ${isFr ? 'FRENCH (Français)' : 'ENGLISH'}.
- You MUST write the ENTIRE JSON response (spokenText, displayText, and suggestedQuickPrompts) in ${isFr ? 'FRENCH (Français)' : 'ENGLISH'}.
- "spokenText": MUST be strictly 1 single short, fun, cool sentence (under 18 words) in ${isFr ? 'French' : 'English'}, and YOU MUST naturally call the client "babe" (e.g. "Babe, le vernis simple est à 30€ en Gel-X et 25€ en Gainage !", "Babe, a French is 35€ for Gel-X or 30€ for Gainage!"). Never read paragraphs!
- All currency MUST be in EUROS (€).

Respond in valid JSON matching this schema:
{
  "userTranscription": "Accurate transcription of the user's speech in this audio clip (e.g. 'Combien coûte le Gel-X ?' or 'What are the prices?')",
  "spokenText": "STRICTLY 1 SHORT SENTENCE in ${isFr ? 'French' : 'English'} calling her 'babe' (under 18 words total) quoting exact prices in Euros (€). Answer directly and stop immediately.",
  "displayText": "Rich formatted text in ${isFr ? 'French' : 'English'} for the on-screen card, calling her 'babe' and highlighting official prices in € and set names in bold.",
  "intent": "One of: 'pricing', 'book_appointment', 'check_availability', 'past_appointments', 'coupons_discounts', 'limited_edition', 'nail_inspiration', 'general_info'",
  "actionData": {
    "type": "pricing" | "past_set" | "coupons" | "limited_editions" | "inspiration" | "availability" | "booking_confirm",
    "details": {}
  },
  "suggestedQuickPrompts": ["3 to 4 short prompts in ${isFr ? 'French' : 'English'} under 6 words each"]
}
`;

    const cleanMime = mimeType.split(';')[0] || 'audio/webm';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: cleanMime,
                data: cleanBase64,
              },
            },
            {
              text: systemPrompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = generateFallbackResponse('coupons', language);
    }

    return res.json(parsed);
  } catch (err: any) {
    console.error('Error processing audio query with Gemini:', err?.message || err);
    const fallback = generateFallbackResponse('coupons', language);
    return res.json({ ...fallback, userTranscription: 'Voice request' });
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
