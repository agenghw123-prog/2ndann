'use client';

import { useEffect, useRef } from 'react';
import { content } from '@/data/content';
import { Star } from './StoryText';

export function SecretMessage() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef('');
  const c = content.secret;
  useEffect(() => () => { document.body.style.overflow = previousOverflow.current; }, []);
  function open() {
    previousOverflow.current = document.body.style.overflow;
    dialog.current?.showModal();
    closeButton.current?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
  }
  function restore() {
    document.body.style.overflow = previousOverflow.current;
    trigger.current?.focus({ preventScroll: true });
  }
  return <div className="secret-message">
    <button ref={trigger} type="button" className="secret-trigger" onClick={open}>{c.button} <span aria-hidden="true">↗</span></button>
    <dialog ref={dialog} className="secret-dialog" aria-labelledby="secret-title" onClose={restore} onKeyDown={event => { if (event.key === 'Tab') { event.preventDefault(); closeButton.current?.focus(); } }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="secret-paper"><button ref={closeButton} type="button" className="dialog-close" aria-label={c.close} onClick={() => dialog.current?.close()}>×</button><Star className="chapter-star" /><p>{c.intro}</p><h2 id="secret-title">{c.title}</h2><p className="secret-again">{c.closing}</p><span className="little-line" /></div>
    </dialog>
  </div>;
}
