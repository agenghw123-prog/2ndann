'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '@/data/content';
import { assetPath } from '@/lib/assets';

export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const frame = useRef(0);
  const attempt = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => () => { cancelAnimationFrame(frame.current); attempt.current++; }, []);
  async function toggle() {
    const player = audio.current;
    if (!player) return;
    const currentAttempt = ++attempt.current;
    cancelAnimationFrame(frame.current);
    if (!player.paused) { player.pause(); return; }
    setError('');
    setPending(true);
    try {
      if (player.error) player.load();
      player.volume = 0;
      await player.play();
      if (attempt.current !== currentAttempt) return;
      const start = performance.now();
      const target = Math.max(0, Math.min(1, content.music.volume));
      const fade = (now: number) => {
        if (player.paused) return;
        player.volume = Math.max(0, Math.min(1, (now - start) / 1600)) * target;
        if (now - start < 1600) frame.current = requestAnimationFrame(fade);
      };
      frame.current = requestAnimationFrame(fade);
    } catch { setError('The song couldn’t play. Tap to try again.'); setPlaying(false); }
    finally { if (attempt.current === currentAttempt) setPending(false); }
  }
  return <div className="music-player"><audio ref={audio} src={assetPath(content.music.src)} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setError('The song is unavailable right now.'); setPlaying(false); setPending(false); }} /><button type="button" onClick={toggle} aria-pressed={playing} disabled={pending}><span className={`music-bars ${playing ? 'playing' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>{pending ? 'opening our song…' : playing ? content.music.pauseLabel : content.music.playLabel}</button>{error && <p role="status">{error}</p>}</div>;
}
