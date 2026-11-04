import React from 'react';

interface VoiceOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onOrbClick: () => void;
  statusText?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onOrbClick,
  statusText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-5 relative overflow-hidden select-none">
      {/* Holographic Ambient Background Glows */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-[#ffd9e3] via-[#dcacfb] to-[#79f5fb] opacity-35 blur-3xl pointer-events-none transition-all duration-700" />
      
      {/* Dynamic Animated Halo Rings */}
      <div
        className={`absolute w-52 h-52 rounded-full bg-[#b40065]/20 pointer-events-none transition-all duration-500 ${
          isListening ? 'animate-ping scale-110 opacity-70' : isSpeaking ? 'animate-pulse scale-105 opacity-50' : 'opacity-20 scale-90'
        }`}
      />
      <div
        className={`absolute w-40 h-40 rounded-full bg-[#dcacfb]/40 pointer-events-none transition-all duration-500 ${
          isListening || isSpeaking ? 'animate-pulse scale-105' : 'opacity-20'
        }`}
      />
      <div
        className={`absolute w-36 h-36 rounded-full border-2 border-[#b40065]/30 pointer-events-none ${
          isListening ? 'animate-ping' : ''
        }`}
      />

      {/* Main Trigger Orb */}
      <button
        onClick={onOrbClick}
        aria-label="Voice Activation Orb"
        className={`relative z-10 w-28 h-28 rounded-full bg-gradient-to-b from-[#b40065] via-[#e10080] to-[#764d93] text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all duration-300 border-4 border-white cursor-pointer group hover:shadow-2xl hover:shadow-[#e10080]/40 ${
          isListening
            ? 'ring-4 ring-[#79f5fb] ring-offset-2 scale-105 shadow-[#e10080]/60'
            : isSpeaking
            ? 'ring-4 ring-[#dcacfb] scale-102'
            : 'hover:scale-102'
        }`}
      >
        {/* Specular highlight rim */}
        <div className="absolute inset-x-3 top-1.5 h-6 rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        <span
          className={`material-symbols-outlined text-[42px] drop-shadow-md transition-transform duration-300 ${
            isListening ? 'scale-115 text-white animate-bounce' : isSpeaking ? 'text-[#79f5fb]' : 'group-hover:scale-110'
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {isProcessing ? 'hourglass_top' : isListening ? 'mic' : isSpeaking ? 'volume_up' : 'mic'}
        </span>
        
        <span className="font-space text-[10px] tracking-widest uppercase text-white/95 font-bold mt-0.5 drop-shadow">
          {isListening ? 'LISTENING' : isProcessing ? 'THINKING' : isSpeaking ? 'SPEAKING' : 'HOLD / TAP'}
        </span>
      </button>

      {/* Live Animated Sound Frequency Waveform Bars */}
      <div className="flex items-center space-x-1.5 h-8 mt-4">
        {[
          { color: 'bg-[#b40065]', minH: 'h-2', maxH: 'h-6', delay: '0.05s' },
          { color: 'bg-[#764d93]', minH: 'h-3', maxH: 'h-8', delay: '0.15s' },
          { color: 'bg-[#e10080]', minH: 'h-4', maxH: 'h-9', delay: '0.25s' },
          { color: 'bg-[#008286]', minH: 'h-2', maxH: 'h-6', delay: '0.35s' },
          { color: 'bg-[#b40065]', minH: 'h-3', maxH: 'h-9', delay: '0.1s' },
          { color: 'bg-[#dcacfb]', minH: 'h-4', maxH: 'h-7', delay: '0.2s' },
          { color: 'bg-[#e10080]', minH: 'h-3', maxH: 'h-8', delay: '0.3s' },
          { color: 'bg-[#79f5fb]', minH: 'h-2', maxH: 'h-5', delay: '0.15s' },
          { color: 'bg-[#764d93]', minH: 'h-3', maxH: 'h-7', delay: '0.25s' },
          { color: 'bg-[#b40065]', minH: 'h-2', maxH: 'h-5', delay: '0.05s' },
        ].map((bar, i) => (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-200 ${bar.color} ${
              isListening || isSpeaking
                ? `${bar.maxH} animate-bounce`
                : isProcessing
                ? 'h-4 animate-pulse'
                : `${bar.minH} opacity-40`
            }`}
            style={{ animationDelay: bar.delay }}
          />
        ))}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2 mt-3">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isListening
              ? 'bg-[#b40065] animate-ping'
              : isSpeaking
              ? 'bg-[#764d93] animate-pulse'
              : isProcessing
              ? 'bg-[#008286] animate-spin'
              : 'bg-[#b40065]'
          }`}
        />
        <span className="font-jakarta text-sm font-bold text-[#b40065] tracking-wide">
          {statusText ||
            (isListening
              ? 'SOA is listening...'
              : isProcessing
              ? 'SOA is synthesizing...'
              : isSpeaking
              ? 'SOA is speaking...'
              : 'SOA Voice Ready')}
        </span>
      </div>

      <span className="font-space text-[#8f6e78] uppercase tracking-wider text-xs mt-0.5">
        Say "Hey SOA" or tap the orb to speak
      </span>
    </div>
  );
};
