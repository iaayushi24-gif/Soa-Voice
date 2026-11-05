import React, { useState, useEffect, useRef } from 'react';
import { DvdScreensaver } from './components/DvdScreensaver';
import { VoiceOrb } from './components/VoiceOrb';
import { ConversationStream } from './components/ConversationStream';
import { QuickPrompts } from './components/QuickPrompts';
import { HandsFreeBar } from './components/HandsFreeBar';
import { audioService } from './services/audio';
import { VoiceMessage, ClientProfile, AvailableSlot } from './types';

export default function App() {
  // Starts on the DVD Screensaver matching nailsbysoa.netlify.app
  const [view, setView] = useState<'screensaver' | 'studio'>('screensaver');

  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'msg-init-user',
      sender: 'user',
      text: "Hey SOA, what sets did I get last time and what's my balance?",
      timestamp: '2 mins ago',
    },
    {
      id: 'msg-init-soa',
      sender: 'soa',
      text:
        'Hey babe! Last Friday you got the **Gel-X Mix&Match Set** with Naomi (45.00 €). You have **15.00 € in Sparkle Cash** & code **BARBIE20** active! Want to see our Gel-X & Gainage prices or book your next set, babe?',
      spokenText:
        'Hey babe! Your last set was the Gel-X Mix&Match with Naomi for 45 euros. You have 15 euros in Sparkle Cash!',
      timestamp: 'Just now',
      durationSeconds: 5,
      intent: 'past_appointments',
      actionData: {
        type: 'past_set',
        data: {
          id: 'apt-prev-001',
          date: 'Last Friday, Oct 31, 2026',
          time: '3:00 PM',
          technician: 'Naomi',
          set: 'Gel-X Mix&Match Set (Chaque ongle est différent)',
          shape: 'Long Stiletto',
          colors: ['Hyper Metallic Silver Chrome', 'Electric Magenta Pink Accent'],
          addOns: ['2x Molten Liquid Drip Accents', 'Swarovski Star Decals'],
          amountPaid: 45.0,
          tip: 10.0,
          total: 55.0,
          pointsEarned: 45,
        },
        sparkleCash: 15.0,
      },
    },
  ]);

  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHandsFreeEnabled, setIsHandsFreeEnabled] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);

  const isSpeakingRef = useRef(false);
  const isProcessingRef = useRef(false);

  // Load client profile from backend
  useEffect(() => {
    fetch('/api/client/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.client) {
          setClientProfile(data.client);
        }
      })
      .catch((err) => console.log('Could not load client profile', err));
  }, []);

  const EN_PROMPTS = [
    'Pricing for Gel-X & Gainage',
    'How much for a French set?',
    'Re-book my last set (45€)',
    'What coupons do I have?',
    'Check availability today',
    'Trending cyber chrome',
  ];

  const FR_PROMPTS = [
    'Tarifs Gel-X & Gainage',
    'Combien pour un French ?',
    'Reprendre mon dernier set (45€)',
    'Quels sont mes coupons ?',
    'Créneaux disponibles',
    'Tendances cyber chrome',
  ];

  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(EN_PROMPTS);

  // Intelligent Question Completeness & End-of-Speech Analyzer
  const isQuestionComplete = (transcript: string, lang: 'en' | 'fr'): boolean => {
    const t = transcript.trim().toLowerCase();
    if (!t) return false;

    // Terminal punctuation indicates a complete thought
    if (t.endsWith('?') || t.endsWith('.') || t.endsWith('!')) return true;

    const words = t.split(/\s+/).filter(Boolean);
    if (words.length < 2) return false;

    const enStarters = [
      'what', 'how', 'when', 'where', 'why', 'who', 'which',
      'can i', 'could i', 'can you', 'could you', 'do you', 'do i',
      'is there', 'are there', 'will you', 'would you', 'tell me',
      'show me', 'check', 'book', 'rebook', 're-book', 'i want',
      'i need', 'give me', 'help me', 'how much', 'how many', 'is it',
      'what is', 'whats', "what's"
    ];

    const frStarters = [
      'combien', 'quel', 'quelle', 'quels', 'quelles', 'qu\'est',
      'est-ce que', 'est ce que', 'puis-je', 'peux-tu', 'pouvez-vous',
      'as-tu', 'avez-vous', 'y a-t-il', 'comment', 'quand', 'où',
      'pourquoi', 'qui', 'réserve', 'réserver', 'donne-moi',
      'montre-moi', 'je veux', 'je voudrais', 'dis-moi', 'vérifie'
    ];

    const starters = lang === 'fr' ? frStarters : enStarters;
    const startsWithInquiry = starters.some((s) => t.startsWith(s));

    const keywords = [
      'set', 'sets', 'appointment', 'booking', 'book', 'refill', 'nails',
      'coupon', 'coupons', 'discount', 'price', 'cost', 'pay', 'paid',
      'balance', 'sparkle cash', 'stiletto', 'chrome', 'drop', 'limited edition',
      'ideas', 'inspiration', 'trending', 'today', 'tomorrow', 'slot',
      'available', 'naomi', 'refill', 'cash', 'french', 'nailsbysoa',
      'rendez-vous', 'rdv', 'ongles', 'promo', 'promos', 'réduction',
      'solde', 'dernier', 'édition limitée', 'tendance', 'créneau', 'dispo'
    ];

    const hasKeyword = keywords.some((k) => t.includes(k));

    // If starts with inquiry and has topic or at least 3 words
    if (startsWithInquiry && (hasKeyword || words.length >= 3)) return true;

    // If inquiry contains key studio topic and has 3+ words
    if (hasKeyword && words.length >= 3) return true;

    // If query is 4 or more words, treat as complete sentence
    if (words.length >= 4) return true;

    return false;
  };

  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isListeningRef = useRef<boolean>(false);
  const finalTranscriptRef = useRef<string>('');
  const fallbackTimeoutRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (view === 'studio' && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isProcessing, view]);

  // Cleanly stops all active listeners & media
  const stopAllListening = () => {
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    setIsListening(false);
    isListeningRef.current = false;
  };

  // Starts microphone listening with native Web Speech first, then MediaRecorder fallback
  const startListening = () => {
    // 1. Immediately silence any active audio
    audioService.stopSpeaking();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
    setMicError(null);
    setInterimTranscript('');
    finalTranscriptRef.current = '';

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    // A) PRIMARY: Web Speech API (Native browser speech engine)
    if (SpeechRecognition) {
      try {
        stopAllListening();

        const recognition = new SpeechRecognition();
        // continuous = false ensures the browser automatically closes mic when user stops speaking!
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'fr' ? 'fr-FR' : 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
          audioService.playMicStart();
        };

        recognition.onresult = (event: any) => {
          if (isSpeakingRef.current || isProcessingRef.current) return;

          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += ' ' + transcript;
            } else {
              interim += transcript;
            }
          }

          const currentText = (finalTranscriptRef.current + ' ' + interim).trim();
          setInterimTranscript(currentText);
        };

        recognition.onspeechend = () => {
          // Native Voice Activity: Client stopped speaking -> finalize
          try {
            recognition.stop();
          } catch (e) {}
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setMicError(
              language === 'fr'
                ? "Microphone bloqué par le navigateur. Veuillez autoriser l'accès au micro dans votre barre d'adresse."
                : 'Microphone permission denied. Please allow microphone access in your browser address bar.'
            );
          }
          setIsListening(false);
          isListeningRef.current = false;
        };

        recognition.onend = () => {
          setIsListening(false);
          isListeningRef.current = false;
          setInterimTranscript('');

          const captured = finalTranscriptRef.current.trim();
          finalTranscriptRef.current = '';

          if (captured && captured.length >= 2) {
            handleFinalSpeech(captured);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch (err: any) {
        console.warn('Web Speech API failed, trying fallback:', err);
      }
    }

    // B) FALLBACK: MediaRecorder for browsers without Web Speech (Firefox, etc.)
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          stopAllListening();
          audioService.playMicStart();
          setIsListening(true);
          isListeningRef.current = true;
          audioChunksRef.current = [];

          const mime =
            typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm')
              ? 'audio/webm'
              : '';
          const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          recorder.onstop = () => {
            stream.getTracks().forEach((t) => t.stop());
            setIsListening(false);
            isListeningRef.current = false;

            if (audioChunksRef.current.length > 0) {
              const audioBlob = new Blob(audioChunksRef.current, {
                type: recorder.mimeType || 'audio/webm',
              });
              if (audioBlob.size > 800) {
                sendAudioBlobQuery(audioBlob, recorder.mimeType || 'audio/webm');
              }
            }
          };

          recorder.start();
          mediaRecorderRef.current = recorder;

          // Auto-stop fallback after 5 seconds
          fallbackTimeoutRef.current = setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, 5000);
        })
        .catch((err) => {
          console.warn('Microphone getUserMedia error:', err);
          setIsListening(false);
          isListeningRef.current = false;
          setMicError(
            language === 'fr'
              ? "Microphone inaccessible. Veuillez autoriser le micro ou cliquer sur les boutons ci-dessous."
              : 'Microphone inaccessible. Please allow microphone access or click a prompt below.'
          );
        });
    } else {
      setMicError(
        language === 'fr'
          ? "La reconnaissance vocale n'est pas supportée sur ce navigateur. Utilisez les boutons ci-dessous."
          : 'Speech recognition is not supported on this browser. Use the prompt chips below.'
      );
    }
  };

  // Toggle microphone on tap
  const toggleMic = () => {
    // If Soa is speaking, tapping immediately silences her
    if (isSpeaking || isSpeakingRef.current) {
      audioService.stopSpeaking();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      return;
    }

    if (isListening || isListeningRef.current) {
      stopAllListening();
    } else {
      startListening();
    }
  };

  // Send direct audio blob to Gemini for full-duplex understanding
  const sendAudioBlobQuery = async (audioBlob: Blob, mimeType: string) => {
    isProcessingRef.current = true;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;

      const userMsg: VoiceMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: language === 'fr' ? '🎙️ Question vocale...' : '🎙️ Voice inquiry...',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const res = await fetch('/api/voice/process-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64Audio, mimeType, language }),
        });

        const data = await res.json();
        isProcessingRef.current = false;
        setIsProcessing(false);

        // Update transcribed user message if available
        if (data.userTranscription) {
          setMessages((prev) =>
            prev.map((m) => (m.id === userMsg.id ? { ...m, text: data.userTranscription } : m))
          );
        }

        const soaMsg: VoiceMessage = {
          id: `soa-${Date.now()}`,
          sender: 'soa',
          text: data.displayText || data.spokenText || (language === 'fr' ? "Je m'en occupe, babe !" : "I'm on it, babe!"),
          spokenText: data.spokenText || data.displayText,
          timestamp: 'Just now',
          durationSeconds: Math.max(4, Math.min(12, Math.round((data.spokenText?.length || 40) / 14))),
          intent: data.intent,
          actionData: data.actionData,
        };

        setMessages((prev) => [...prev, soaMsg]);

        if (data.suggestedQuickPrompts && Array.isArray(data.suggestedQuickPrompts)) {
          setSuggestedPrompts(data.suggestedQuickPrompts);
        }

        if (soaMsg.spokenText) {
          isSpeakingRef.current = true;
          setIsSpeaking(true);
          audioService.speak(
            soaMsg.spokenText,
            {
              onEnd: () => {
                isSpeakingRef.current = false;
                setIsSpeaking(false);
              },
              onError: () => {
                isSpeakingRef.current = false;
                setIsSpeaking(false);
              },
            },
            language
          );
        }
      } catch (err) {
        console.error('Error in audio query:', err);
        isProcessingRef.current = false;
        setIsProcessing(false);
      }
    };
  };

  const toggleLanguage = (newLang: 'en' | 'fr') => {
    stopAllListening();
    setIsListening(false);
    isListeningRef.current = false;
    setLanguage(newLang);
    setSuggestedPrompts(newLang === 'fr' ? FR_PROMPTS : EN_PROMPTS);

    const switchMsg: VoiceMessage = {
      id: `soa-lang-${Date.now()}`,
      sender: 'soa',
      text:
        newLang === 'fr'
          ? 'Mode Français activé 🇫🇷 ! Demande-moi tes anciens sets, tes promos ou réserve un rendez-vous !'
          : 'English mode activated 🇺🇸! Ask me about your past sets, coupons, or book an appointment!',
      spokenText:
        newLang === 'fr'
          ? 'Mode Français activé ! Que puis-je faire pour toi ?'
          : 'English mode activated! What can I do for you?',
      timestamp: 'Just now',
      durationSeconds: 4,
    };
    setMessages((prev) => [...prev, switchMsg]);

    isSpeakingRef.current = true;
    setIsSpeaking(true);
    audioService.speak(
      switchMsg.spokenText!,
      {
        onEnd: () => {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
        },
        onError: () => {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
        },
      },
      newLang
    );
  };

  const handleFinalSpeech = (rawText: string) => {
    if (isSpeakingRef.current || isProcessingRef.current) {
      return;
    }
    let clean = rawText.trim();
    if (!clean || clean.length < 2) return;

    if (clean.toLowerCase().includes('hey soa') || clean.toLowerCase().includes('soa')) {
      clean = clean.replace(/hey soa/gi, '').replace(/soa/gi, '').trim();
      if (!clean) {
        sendVoiceQuery(
          language === 'fr'
            ? "Bonjour ! Comment peux-tu m'aider aujourd'hui ?"
            : 'Hello! What can you help me with today?'
        );
        return;
      }
    }

    sendVoiceQuery(clean);
  };

  const sendVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // 1. Immediately silence any active speech
    audioService.stopSpeaking();
    setIsSpeaking(false);
    isSpeakingRef.current = false;

    // 2. Immediately stop recognition and clear timers so microphone is closed
    stopAllListening();
    setIsListening(false);
    isListeningRef.current = false;
    isProcessingRef.current = true;
    setIsProcessing(true);

    const userMsg: VoiceMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText, language }),
      });

      const data = await res.json();
      isProcessingRef.current = false;
      setIsProcessing(false);

      const soaMsg: VoiceMessage = {
        id: `soa-${Date.now()}`,
        sender: 'soa',
        text: data.displayText || data.spokenText || (language === 'fr' ? "Je m'en occupe, beauté !" : "I'm on it, babe!"),
        spokenText: data.spokenText || data.displayText,
        timestamp: 'Just now',
        durationSeconds: Math.max(4, Math.min(12, Math.round((data.spokenText?.length || 40) / 14))),
        intent: data.intent,
        actionData: data.actionData,
      };

      setMessages((prev) => [...prev, soaMsg]);

      if (data.suggestedQuickPrompts && Array.isArray(data.suggestedQuickPrompts)) {
        setSuggestedPrompts(data.suggestedQuickPrompts);
      }

      // Speak answer once and cleanly stop! Mic remains closed until user taps again
      if (soaMsg.spokenText) {
        isSpeakingRef.current = true;
        setIsSpeaking(true);

        audioService.speak(
          soaMsg.spokenText,
          {
            onEnd: () => {
              isSpeakingRef.current = false;
              setIsSpeaking(false);
              // The mic remains closed! The user taps the orb when they want to speak again.
            },
            onError: () => {
              isSpeakingRef.current = false;
              setIsSpeaking(false);
            },
          },
          language
        );
      }
    } catch (err) {
      console.error('Error contacting backend voice API', err);
      isProcessingRef.current = false;
      setIsProcessing(false);
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      const fallbackMsg: VoiceMessage = {
        id: `soa-err-${Date.now()}`,
        sender: 'soa',
        text: "I'm right here babe! NailsbySoa is open today. You have coupon BARBIE20 active and slots open tomorrow!",
        spokenText: "I'm right here babe! NailsbySoa is open. You have coupon BARBIE20 active and slots open tomorrow!",
        timestamp: 'Just now',
        durationSeconds: 6,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleBookSlot = async (slot: AvailableSlot, couponCode?: string) => {
    audioService.playSuccessSound();
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: slot.serviceAvailable.includes('Refill')
            ? 'Gel Sculpt Refill & Re-Gloss'
            : 'Signature 3D Cyber Chrome Sculpt',
          artist: slot.artist,
          date: slot.date,
          time: slot.time,
          couponCode: couponCode || 'BARBIE20',
          clientName: clientProfile?.name || 'Mia Vance',
        }),
      });
      const data = await res.json();
      if (data.success) {
        sendVoiceQuery(`Confirmed my appointment on ${slot.date} at ${slot.time} with ${slot.artist}!`);
      }
    } catch (e) {
      sendVoiceQuery(`Please confirm my booking on ${slot.date} at ${slot.time} with ${slot.artist}`);
    }
  };

  // If on DVD Screensaver, show the exact bouncing DVD logo experience
  if (view === 'screensaver') {
    return <DvdScreensaver onEnterApp={() => setView('studio')} />;
  }

  // Y2K McBling Barbiecore Corkboard Atelier Voice Studio
  return (
    <div
      className="min-h-screen text-[#1f1a1d] font-jakarta select-none relative p-2 sm:p-4 md:p-8 flex items-center justify-center"
      style={{
        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBStHzXyc_lNC55IX1sLAeBIUXKo9LA-N3Dnyh2snpMFoOnmY4eDu-XFrYp8aItQeM2BsJg0U2BjkrX6hKwvgknmmSJdpMM9d36zHd3g8IPhG6bF-QRFo0i0XZZ_kiie1ypygUHONyOQ6wY91J8FzoN34DQhFNWiXg54Cz9cIG2ABn-DxJz2E_8DtWvizqLZmKL0QnixMcsz7dnpwetyVciJ43TJbgpmijOMvuNkklk8iZVT2IlfcIb')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '550px auto',
      }}
    >
      {/* Outer Corkboard Heavy Wood Beveled Frame */}
      <div className="relative w-full max-w-2xl bg-[#fff7f9]/92 backdrop-blur-md rounded-3xl sm:rounded-[36px] border-[10px] sm:border-[16px] border-[#2a0e19] shadow-[0_20px_60px_rgba(0,0,0,0.65),inset_0_2px_10px_rgba(255,255,255,0.4)] p-3 sm:p-6 overflow-hidden">
        
        {/* Four Corner Mounting Screws (Click to return to DVD Screensaver like on website) */}
        <button
          onClick={() => {
            audioService.playBouncingBlip(440);
            setView('screensaver');
          }}
          className="absolute top-3 left-3 w-5 h-5 rounded-full bg-stone-800 border-2 border-black shadow-inner opacity-80 cursor-pointer hover:scale-125 transition-transform z-40"
          title="Return to DVD screensaver"
          aria-label="Return to screensaver"
        />
        <button
          onClick={() => {
            audioService.playBouncingBlip(440);
            setView('screensaver');
          }}
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-stone-800 border-2 border-black shadow-inner opacity-80 cursor-pointer hover:scale-125 transition-transform z-40"
          title="Return to DVD screensaver"
          aria-label="Return to screensaver"
        />
        <div className="absolute bottom-3 left-3 w-5 h-5 rounded-full bg-stone-800 border-2 border-black shadow-inner opacity-80 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-stone-800 border-2 border-black shadow-inner opacity-80 pointer-events-none" />

        {/* Top Decorative Y2K Washi Tapes */}
        <div className="w-28 sm:w-36 h-4.5 tape-gingham-pink tape-torn-edges absolute -top-1 left-8 sm:left-14 transform -rotate-6 z-30 flex items-center justify-center border-t border-b border-black/10 shadow-sm pointer-events-none">
          <span className="text-[8px] sm:text-[9px] font-mono font-black text-[#9c1d57] tracking-widest uppercase">
            ✦ PUNK POP VIBES ✦
          </span>
        </div>
        <div className="w-28 sm:w-36 h-4.5 tape-crinkle-metallic tape-torn-edges absolute -top-1 right-8 sm:right-14 transform rotate-6 z-30 flex items-center justify-center border-t border-b border-white/20 shadow-sm pointer-events-none">
          <span className="text-[8px] sm:text-[9px] font-marker text-white drop-shadow">
            ★ Y2K MCBLING ★
          </span>
        </div>

        {/* Pushpins */}
        <div className="pin-head pin-pink left-1/4 -top-2" />
        <div className="pin-head pin-yellow right-1/4 -top-2" />

        {/* Content Container */}
        <div className="flex flex-col w-full space-y-4 pt-3">
          
          {/* Header: SOA VOICE with Y2K Barbie Styling */}
          <header className="flex flex-col items-center justify-center pt-2 pb-1 border-b border-[#b40065]/20 select-none relative">
            
            {/* Top Navigation: Lucky Girl Era, Language Switcher, DVD Mode Switcher */}
            <div className="w-full flex items-center justify-between px-1 mb-1">
              <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-0.5 rounded-full border border-pink-200 shadow-xs">
                <span className="text-xs">🍀</span>
                <span className="font-syne text-[10px] font-bold text-[#b40065]">
                  {language === 'fr' ? 'Ère Lucky Girl' : 'Lucky Girl Era'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switcher Button [ 🇺🇸 EN | 🇫🇷 FR ] */}
                <div
                  className="flex items-center bg-white/95 rounded-full p-0.5 border border-[#e3bdc7] shadow-xs"
                  title={language === 'fr' ? 'Changer de langue' : 'Switch language'}
                >
                  <button
                    onClick={() => {
                      if (language !== 'en') {
                        audioService.playBouncingBlip(620);
                        toggleLanguage('en');
                      }
                    }}
                    className={`px-2 py-0.5 rounded-full font-space text-[10px] font-bold transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-gradient-to-r from-[#b40065] to-[#e10080] text-white shadow-xs'
                        : 'text-[#8f6e78] hover:text-[#1f1a1d]'
                    }`}
                  >
                    🇺🇸 EN
                  </button>
                  <button
                    onClick={() => {
                      if (language !== 'fr') {
                        audioService.playBouncingBlip(620);
                        toggleLanguage('fr');
                      }
                    }}
                    className={`px-2 py-0.5 rounded-full font-space text-[10px] font-bold transition-all cursor-pointer ${
                      language === 'fr'
                        ? 'bg-gradient-to-r from-[#b40065] to-[#e10080] text-white shadow-xs'
                        : 'text-[#8f6e78] hover:text-[#1f1a1d]'
                    }`}
                  >
                    🇫🇷 FR
                  </button>
                </div>

                <button
                  onClick={() => {
                    audioService.playBouncingBlip(520);
                    setView('screensaver');
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-pixel text-xs tracking-wider uppercase shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Watch bouncing DVD logo"
                >
                  <span>💿</span>
                  <span>DVD SCREENSAVER</span>
                </button>
              </div>
            </div>

            {/* Title: SOA VOICE */}
            <div className="flex items-center space-x-2 my-1">
              <span className="text-[#b40065] text-lg font-bold animate-pulse">✦</span>
              <h1 className="font-syne text-2xl sm:text-3xl font-extrabold tracking-wider uppercase bg-gradient-to-r from-[#b40065] via-[#e10080] to-[#764d93] bg-clip-text text-transparent drop-shadow">
                SOA VOICE
              </h1>
              <span className="text-[#764d93] text-lg font-bold animate-pulse">✦</span>
            </div>

            <p className="font-pixel text-xs text-[#8f6e78] tracking-widest uppercase">
              {language === 'fr'
                ? 'ATELIER NAILSBYSOA // AGENT VOCAL Y2K MCBLING'
                : 'NAILSBYSOA ATELIER // STANDALONE Y2K VOICE AGENT'}
            </p>
          </header>

          {/* Client VIP Status Pill Bar */}
          <div className="flex items-center justify-between bg-white/85 border border-[#e3bdc7] rounded-full px-3.5 py-1.5 shadow-xs text-xs font-space select-none">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="text-[#b40065] font-bold">VIP:</span>
              <span className="font-bold text-[#1f1a1d] truncate">
                {clientProfile?.name || 'Mia Vance'}
              </span>
              <span className="text-[#764d93] text-[10px] font-semibold">✦ Diamond Starlet</span>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-[#8f6e78]">
                {language === 'fr' ? 'Solde Sparkle Cash :' : 'Sparkle Cash:'}
              </span>
              <span className="font-bold text-[#b40065] bg-[#ffd9e3] px-2 py-0.5 rounded-full text-[11px]">
                {clientProfile?.sparkleCash ? clientProfile.sparkleCash.toFixed(2) : '15.00'} €
              </span>
            </div>
          </div>

          {/* Center Stage: Giant Pulsating Y2K Cyber Barbie Holographic Voice Orb */}
          <VoiceOrb
            isListening={isListening}
            isSpeaking={isSpeaking}
            isProcessing={isProcessing}
            onOrbClick={toggleMic}
            language={language}
            statusText={
              language === 'fr'
                ? isListening
                  ? interimTranscript
                    ? `« ${interimTranscript} »`
                    : "SOA vous écoute... Parlez"
                  : isProcessing
                  ? "SOA consulte l'atelier..."
                  : isSpeaking
                  ? "SOA vous répond..."
                  : "Toucher l'orbe pour parler"
                : isListening
                ? interimTranscript
                  ? `"${interimTranscript}"`
                  : "SOA is listening... Speak now"
                : isProcessing
                ? "SOA is consulting atelier books..."
                : isSpeaking
                ? "SOA is answering you..."
                : "Tap orb to speak"
            }
          />

          {/* Microphone Permission Alert if browser denied access */}
          {micError && (
            <div className="bg-[#ffd9e3] border-2 border-[#b40065] text-[#b40065] text-xs font-space px-4 py-2.5 rounded-2xl text-center shadow-md animate-in fade-in flex items-center justify-center gap-2 select-text">
              <span className="text-base">⚠️</span>
              <span className="font-semibold">{micError}</span>
            </div>
          )}

          {/* Conversational Audio Stream / Transcript Exchange */}
          <ConversationStream
            messages={messages}
            onSelectAction={sendVoiceQuery}
            onBookSlot={handleBookSlot}
            isProcessing={isProcessing}
            language={language}
          />

          <div ref={scrollRef} />

          {/* Quick Voice Prompt Chips to Speak Directly */}
          <QuickPrompts
            prompts={suggestedPrompts}
            onSelectPrompt={sendVoiceQuery}
            language={language}
          />

          {/* Dedicated Hands-Free Voice Controller Bar */}
          <HandsFreeBar
            isListening={isListening}
            isHandsFreeEnabled={isHandsFreeEnabled}
            interimTranscript={interimTranscript}
            onToggleHandsFree={() => setIsHandsFreeEnabled(!isHandsFreeEnabled)}
            onToggleMic={toggleMic}
            onSubmitText={sendVoiceQuery}
            language={language}
          />

          {/* Cyber Footer Watermark */}
          <footer className="text-center pt-2 select-none border-t border-[#b40065]/10">
            <p className="font-pixel text-[#8f6e78] tracking-widest uppercase text-xs">
              {language === 'fr'
                ? '✦ AGENT VOCAL 100% MAINS LIBRES • INTERFACE CYBER BARBIE Y2K • NAILSBYSOA ✦'
                : '✦ 100% HANDS-FREE VOICE AGENT • Y2K CYBER BARBIE INTERFACE • NAILSBYSOA ✦'}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
