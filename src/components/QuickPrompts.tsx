import React from 'react';

interface QuickPromptsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  language?: 'en' | 'fr';
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({
  prompts,
  onSelectPrompt,
  language = 'en',
}) => {
  return (
    <div className="space-y-2 pt-1 w-full select-none">
      <div className="flex items-center justify-between">
        <span className="font-space text-[#8f6e78] uppercase tracking-wider text-xs font-semibold">
          {language === 'fr' ? 'Toucher pour parler instantanément' : 'Tap to speak instantly'}
        </span>
        <span className="text-[#b40065] font-bold text-xs">✦ 🎙️ ✦</span>
      </div>

      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p)}
            className="flex items-center space-x-1.5 bg-white border border-[#e3bdc7] hover:border-[#b40065] hover:bg-[#fff7f9] px-3.5 py-2 rounded-full shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer group"
          >
            <span className="text-xs group-hover:scale-110 transition-transform">
              🎙️
            </span>
            <span className="font-space text-xs text-[#1f1a1d] font-semibold group-hover:text-[#b40065]">
              "{p}"
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
