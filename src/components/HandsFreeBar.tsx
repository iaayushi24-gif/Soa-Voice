import React, { useState } from 'react';

interface HandsFreeBarProps {
  isListening: boolean;
  isHandsFreeEnabled: boolean;
  interimTranscript: string;
  onToggleHandsFree: () => void;
  onToggleMic: () => void;
  onSubmitText: (text: string) => void;
  language?: 'en' | 'fr';
}

export const HandsFreeBar: React.FC<HandsFreeBarProps> = ({
  isListening,
  isHandsFreeEnabled,
  interimTranscript,
  onToggleHandsFree,
  onToggleMic,
  onSubmitText,
  language = 'en',
}) => {
  const [showInput, setShowInput] = useState(false);
  const [typedText, setTypedText] = useState('');

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedText.trim()) {
      onSubmitText(typedText.trim());
      setTypedText('');
      setShowInput(false);
    }
  };

  return (
    <div className="w-full space-y-2 select-none">
      <div className="rounded-2xl bg-[#efe6ea]/80 backdrop-blur-md p-3 flex items-center justify-between border border-[#e3bdc7]/60 shadow-sm transition-all">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button
            onClick={onToggleMic}
            aria-label={isListening ? 'Stop listening' : 'Start microphone'}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-transform cursor-pointer shrink-0 ${
              isListening
                ? 'bg-gradient-to-r from-[#b40065] to-[#e10080] ring-2 ring-[#79f5fb] ring-offset-1 animate-pulse'
                : 'bg-gradient-to-r from-[#b40065] to-[#764d93]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isListening ? 'mic' : 'mic_none'}
            </span>
          </button>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-syne text-xs font-bold text-[#1f1a1d] truncate">
              {isListening
                ? interimTranscript || (language === 'fr' ? "À l'écoute... Parlez maintenant" : 'Listening... Speak now')
                : (language === 'fr' ? 'Micro fermé • Toucher pour parler' : 'Microphone closed • Tap to speak')}
            </span>
            <span className="font-space text-[#8f6e78] text-[10px] truncate">
              {isListening
                ? (language === 'fr' ? 'Le micro se coupe automatiquement dès que tu as fini' : 'Mic cuts automatically the moment you stop speaking')
                : (language === 'fr' ? 'Détection intelligente de fin de question active' : 'Intelligent question-completion detection active')}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 ml-2">
          {/* Waveform indicator when listening */}
          {isListening ? (
            <div className="flex items-center space-x-1 px-1">
              <span className="w-1 h-3 bg-[#b40065] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 h-5 bg-[#764d93] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-2 bg-[#b40065] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            </div>
          ) : (
            <div
              className="font-space text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#79f5fb]/80 text-[#002021] border border-[#00676a]/20 shadow-xs flex items-center gap-1"
              title="Intelligent Voice Activity Detection is active"
            >
              <span className="text-[9px]">⚡</span>
              <span>AUTO-CUT</span>
            </div>
          )}

          {/* Quick keyboard icon toggle */}
          <button
            onClick={() => setShowInput(!showInput)}
            aria-label="Toggle text input"
            className="w-8 h-8 rounded-full bg-white border border-[#e3bdc7] text-[#764d93] flex items-center justify-center hover:bg-[#ffd9e3] active:scale-90 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {showInput ? 'close' : 'keyboard'}
            </span>
          </button>
        </div>
      </div>

      {/* Manual Input Fallback Drawer */}
      {showInput && (
        <form
          onSubmit={handleSendTyped}
          className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-[#b40065]/40 shadow-md animate-in fade-in duration-200"
        >
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder={language === 'fr' ? "Ou écris ici : Quel était mon dernier set ?" : "Or type here e.g. What did I pay last time?"}
            className="flex-1 bg-transparent px-3 py-1 font-jakarta text-xs text-[#1f1a1d] outline-none placeholder:text-[#8f6e78]"
            autoFocus
          />
          <button
            type="submit"
            disabled={!typedText.trim()}
            className="bg-gradient-to-r from-[#b40065] to-[#e10080] text-white px-3 py-1.5 rounded-full font-space text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            {language === 'fr' ? 'Demander à SOA' : 'Ask SOA'}
          </button>
        </form>
      )}
    </div>
  );
};
