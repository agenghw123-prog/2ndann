import { Reveal } from './Reveal';

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Paragraphs({ items }: { items: readonly string[] }) {
  return <div className="paragraphs">{items.map(text => <Reveal key={text}><p>{text}</p></Reveal>)}</div>;
}
export function Statement({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`statement ${className}`}><Reveal><h2>{children}</h2></Reveal></div>;
}
export function Star({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 1C20 15 25 20 39 20C25 20 20 25 20 39C20 25 15 20 1 20C15 20 20 15 20 1Z" stroke="currentColor" strokeWidth=".8"/><path d="M7 7L33 33M33 7L7 33" stroke="currentColor" strokeWidth=".5"/></svg>;
}
