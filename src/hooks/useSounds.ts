"use client";

import { useEffect, useState } from "react";

export enum SoundType {
  MOVE = "move",
  CAPTURE = "capture", 
  CHECK = "check",
  CASTLE = "castle",
  GAME_START = "game_start",
  GAME_END = "game_end",
  DRAW_OFFER = "draw_offer",
  LOW_TIME = "low_time",
  BUTTON_CLICK = "button_click"
}

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSounds();
    }
  }

  private initializeSounds() {
    // Create audio elements for different sounds
    // For now, we'll use Web Audio API to generate simple tones
    this.generateTone(SoundType.MOVE, 1000, 0.1);
    this.generateTone(SoundType.CAPTURE, 600, 0.15);
    this.generateTone(SoundType.CHECK, 1000, 0.2);
    this.generateTone(SoundType.CASTLE, 400, 0.2);
    this.generateTone(SoundType.GAME_START, 880, 0.3);
    this.generateTone(SoundType.GAME_END, 440, 0.5);
    this.generateTone(SoundType.DRAW_OFFER, 660, 0.2);
    this.generateTone(SoundType.LOW_TIME, 1200, 0.1);
    this.generateTone(SoundType.BUTTON_CLICK, 1000, 0.05);
  }

  private generateTone(type: SoundType, frequency: number, duration: number) {
    // Create a simple tone using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createTone = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    // Store the tone generator function
    const audio = {
      play: () => {
        if (this.enabled) {
          createTone();
        }
      }
    } as HTMLAudioElement;

    this.sounds.set(type, audio);
  }

  play(type: SoundType) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(type);
    if (sound) {
      try {
        sound.play();
      } catch (error) {
        console.warn('Could not play sound:', error);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isEnabled() {
    return this.enabled;
  }

  getVolume() {
    return this.volume;
  }
}

// Singleton instance
let soundManager: SoundManager | null = null;

export const useSounds = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (typeof window !== 'undefined' && !soundManager) {
      soundManager = new SoundManager();
    }
  }, []);

  const playSound = (type: SoundType) => {
    soundManager?.play(type);
  };

  const toggleSounds = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    soundManager?.setEnabled(newEnabled);
    
    // Save to localStorage
    localStorage.setItem('chess-sounds-enabled', String(newEnabled));
  };

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    soundManager?.setVolume(newVolume);
    
    // Save to localStorage
    localStorage.setItem('chess-sounds-volume', String(newVolume));
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedEnabled = localStorage.getItem('chess-sounds-enabled');
    const savedVolume = localStorage.getItem('chess-sounds-volume');
    
    if (savedEnabled !== null) {
      const enabled = savedEnabled === 'true';
      setIsEnabled(enabled);
      soundManager?.setEnabled(enabled);
    }
    
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      soundManager?.setVolume(vol);
    }
  }, []);

  return {
    playSound,
    isEnabled,
    volume,
    toggleSounds,
    updateVolume
  };
};
