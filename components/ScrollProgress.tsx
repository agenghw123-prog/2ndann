'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '@/data/content';

export function ScrollProgress() {
  const [memory, setMemory] = useState<number | null>(null);
  const [chapter, setChapter] = useState('then');
  const [visible, setVisible] = useState(false);
  const line = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const photos = Array.from(document.querySelectorAll<HTMLElement>('[data-memory]'));
    const gallery = document.getElementById('memories')!;
    const today = document.getElementById('today')!;
    const future = document.getElementById('future')!;
    let frame = 0;
    const measure = () => {
      const viewport = window.innerHeight;
      const midpoint = viewport * 0.5;
      const range = document.documentElement.scrollHeight - viewport;
      if (line.current) line.current.style.transform = `scaleY(${range > 0 ? window.scrollY / range : 0})`;
      setVisible(window.scrollY > viewport * 0.65);
      setChapter(future.getBoundingClientRect().top < midpoint ? 'next' : today.getBoundingClientRect().top < midpoint ? 'now' : 'then');
      const bounds = gallery.getBoundingClientRect();
      if (bounds.top < midpoint && bounds.bottom > midpoint && photos[0].getBoundingClientRect().top < viewport) {
        let nearest = 1;
        let distance = Infinity;
        for (const photo of photos) {
          const rect = photo.getBoundingClientRect();
          const next = Math.abs(rect.top + rect.height / 2 - midpoint);
          if (next < distance) { nearest = Number(photo.dataset.memory); distance = next; }
        }
        setMemory(nearest);
      } else setMemory(null);
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <aside className={`story-progress ${visible ? 'is-visible' : ''}`} aria-label="Story progress">
    <nav aria-label="Story chapters"><a href="#intro" aria-current={chapter === 'then' ? 'location' : undefined}>{content.navigation.progress[0]}</a><span className="progress-track" aria-hidden="true"><span ref={line} /></span><a href="#today" aria-current={chapter === 'now' ? 'location' : undefined}>{content.navigation.progress[1]}</a><span className="progress-dash" aria-hidden="true" /><a href="#future" aria-current={chapter === 'next' ? 'location' : undefined}>{content.navigation.progress[2]}</a></nav>
    {memory !== null && <div className="memory-counter"><span>{content.gallery.counter}</span><strong>{String(memory).padStart(2, '0')} <span>/ 37</span></strong></div>}
  </aside>;
}
