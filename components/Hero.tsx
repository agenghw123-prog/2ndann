import { content } from '@/data/content';
import { Star } from './StoryText';

export function Hero() {
  const c = content.hero;
  const [firstLine, ...remainingLines] = c.title.split('\n');
  const anniversaryParts = firstLine.split('2nd');
  const personalized = !content.girlfriendName.startsWith('[');
  return <section id="beginning" className="hero" aria-labelledby="hero-title">
    <header className="masthead flex items-center justify-between">
      <a className="wordmark" href="#beginning"><Star />{content.navigation.brand}</a>
      <a href="#memories" className="edition-link">{c.edition} <span aria-hidden="true">↗</span></a>
    </header>
    <div className="hero-orbit" aria-hidden="true"><div /><span className="orbit-star"><Star /></span></div>
    <div className="hero-content">
      <p className="eyebrow hero-arrive delay-1">{c.eyebrow}</p>
      <p className="hero-dedication hero-arrive delay-2">{personalized ? `For ${content.girlfriendName}, my favorite person.` : c.dedication}</p>
      <h1 id="hero-title" className="hero-arrive delay-3">{anniversaryParts.length === 2 ? <>{anniversaryParts[0]}<span className="anniversary-number">2<span className="ordinal">nd</span></span>{anniversaryParts[1]}</> : firstLine}{remainingLines.length > 0 && <><br /><em>{remainingLines.join('\n')}</em></>}</h1>
      <p className="hero-subtitle hero-arrive delay-4">{c.subtitle}</p>
      <div className="hero-note hero-arrive delay-5"><span className="little-line" /><p>{c.note}</p></div>
      <a href="#intro" className="scroll-invitation hero-arrive delay-5">{c.scroll}<span className="scroll-arrow" aria-hidden="true">↓</span></a>
    </div>
    <footer className="hero-footer"><span>{c.footer}</span><Star /><span>01 <span className="footer-divider">/</span> 10</span></footer>
  </section>;
}
