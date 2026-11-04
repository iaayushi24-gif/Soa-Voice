import React, { useState, useEffect } from 'react';
import { audioService } from '../services/audio';

interface AudioPlayerBarProps {
  textToSpeak: string;
  durationSeconds?: number;
  autoPlay?: boolean;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  textToSpeak,
  durationSeconds = 8,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      const stepMs = 100;
      const totalSteps = (durationSeconds * 1000) / stepMs;
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (interval) clearInterval(interval);
            return 100;
          }
          return prev + 100 / totalSteps;
        });
      }, stepMs);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, durationSeconds]);

  const togglePlayback = () => {
    if (isPlaying) {
      audioService.stopSpeaking();
      setIsPlaying(false);
    } else {
      setProgress(0);
      setIsPlaying(true);
      audioService.speak(textToSpeak, {
        onEnd: () => {
          setIsPlaying(false);
          setProgress(100);
        },
        onError: () => {
          setIsPlaying(false);
        },
      });
    }
  };

  const currentSeconds = Math.min(
    durationSeconds,
    Math.round((progress / 100) * durationSeconds)
  );

  return (
    <div className="flex items-center space-x-2 pt-2 border-t border-[#b40065]/15 w-full">
      <button
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        className="w-7 h-7 rounded-full bg-[#ffd9e3] hover:bg-[#ffb0ca] flex items-center justify-center text-[#b40065] transition-colors cursor-pointer"
      >
        <span
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {isPlaying ? 'pause' : 'volume_up'}
        </span>
      </button>

      {/* Progress Track */}
      <div
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          setProgress(Math.max(0, Math.min(100, clickPos * 100)));
        }}
        className="flex-1 bg-[#b40065]/10 h-2 rounded-full overflow-hidden cursor-pointer relative"
      >
        <div
          className="bg-gradient-to-r from-[#b40065] to-[#764d93] h-full rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Tracker */}
      <span className="font-space text-[#8f6e78] text-[10px] min-w-[55px] text-right font-medium">
        0:0{currentSeconds} / 0:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}
      </span>
    </div>
  );
};
