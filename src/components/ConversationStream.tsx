import React from 'react';
import { VoiceMessage, AvailableSlot } from '../types';
import { AudioPlayerBar } from './AudioPlayerBar';
import { ActionCards } from './ActionCards';

interface ConversationStreamProps {
  messages: VoiceMessage[];
  onSelectAction: (voicePrompt: string) => void;
  onBookSlot?: (slot: AvailableSlot, couponCode?: string) => void;
  isProcessing?: boolean;
  language?: 'en' | 'fr';
}

export const ConversationStream: React.FC<ConversationStreamProps> = ({
  messages,
  onSelectAction,
  onBookSlot,
  isProcessing,
  language = 'en',
}) => {
  return (
    <div className="space-y-4 w-full">
      {messages.map((msg) => {
        if (msg.sender === 'user') {
          return (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="font-space text-xs text-[#8f6e78] font-medium">
                  {language === 'fr' ? 'Vous' : 'You'}
                </span>
                <span className="material-symbols-outlined text-[#8f6e78] text-[14px]">
                  graphic_eq
                </span>
              </div>
              <div className="bg-[#fbf1f5] border border-[#e3bdc7]/50 text-[#1f1a1d] p-3.5 rounded-2xl rounded-tr-sm max-w-[90%] shadow-xs">
                <p className="font-jakarta text-sm leading-snug font-medium">
                  "{msg.text}"
                </p>
                <div className="text-[10px] font-space text-[#8f6e78] text-right mt-1">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        }

        // SOA Voice AI Response Bubble
        return (
          <div key={msg.id} className="flex flex-col items-start w-full">
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="text-[#b40065] font-bold text-xs animate-spin">✦</span>
              <span className="font-space text-[#b40065] font-bold text-xs tracking-wider">
                SOA Voice AI
              </span>
            </div>

            <div className="bg-gradient-to-r from-white to-[#f5ebef] border border-[#b40065]/25 text-[#1f1a1d] p-4 rounded-2xl rounded-tl-sm shadow-sm space-y-2.5 w-full">
              <div
                className="font-jakarta text-sm leading-relaxed text-[#1f1a1d] prose prose-pink max-w-none [&_strong]:text-[#b40065] [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_p]:my-1"
                dangerouslySetInnerHTML={{
                  __html: formatTextWithHighlights(msg.text),
                }}
              />

              {/* Real-time Audio Playback Bar */}
              <AudioPlayerBar
                textToSpeak={msg.spokenText || msg.text}
                durationSeconds={msg.durationSeconds || 9}
              />

              {/* Action Attachment Cards (e.g. Past appointment breakdown, coupons, available slots, inspiration) */}
              {msg.actionData && (
                <ActionCards
                  actionData={msg.actionData}
                  onSelectAction={onSelectAction}
                  onBookSlot={onBookSlot}
                  language={language}
                />
              )}
            </div>
          </div>
        );
      })}

      {isProcessing && (
        <div className="flex flex-col items-start w-full animate-pulse">
          <div className="flex items-center space-x-1.5 mb-1">
            <span className="text-[#b40065] font-bold text-xs">✦</span>
            <span className="font-space text-[#b40065] font-bold text-xs">SOA Voice AI</span>
          </div>
          <div className="bg-white/80 border border-[#b40065]/20 p-4 rounded-2xl rounded-tl-sm shadow-xs flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#b40065] animate-ping" />
            <span className="font-jakarta text-xs text-[#5b3f48] font-medium">
              {language === 'fr'
                ? 'Consultation du carnet de rendez-vous et du catalogue NailsbySoa...'
                : 'Consulting NailsbySoa appointment books & styling catalog...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Converts markdown-style **bold** and newlines into clean styled HTML
function formatTextWithHighlights(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#b40065]">$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
