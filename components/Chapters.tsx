import { content } from '@/data/content';
import { Reveal } from './Reveal';
import { Label, Paragraphs, Star, Statement } from './StoryText';

export function IntroStory() {
  const c = content.intro;
  return <section id="intro" className="intro section-copy">
    <Reveal><p className="prelude">{c.prelude}</p><Label>{c.label}</Label><h2>{c.title}</h2></Reveal>
    <Paragraphs items={c.paragraphs} />
    <Reveal className="intro-closing"><p>{c.transition}</p><h3>{c.closing}</h3></Reveal>
  </section>;
}
export function Reflection() {
  const c = content.reflection;
  return <section id="reflection" className="reflection section-copy">
    <Reveal><span className="chapter-thread" /><h2 className="reflection-number">{c.title}</h2></Reveal>
    <Reveal><h3>{c.subtitle}</h3></Reveal><Paragraphs items={c.paragraphs} />
    <Statement>{c.closing}</Statement>
  </section>;
}
export function AnniversarySection() {
  const c = content.today;
  return <section id="today" className="today">
    <div className="section-copy">
      <Reveal><Label>{c.label}</Label><Star className="chapter-star" /><h2>{c.title}</h2></Reveal>
      <Reveal><div className="level-up"><span>{c.yearFrom}</span><span className="level-arrow" aria-hidden="true">⟶</span><strong>{c.yearTo}</strong></div><p className="serif-message">{c.anniversary}</p>{content.anniversaryDate && <time className="date-note" dateTime={content.anniversaryDate}>{content.anniversaryDate}</time>}</Reveal>
      <Reveal className="today-bridge"><p>{c.bridge}</p></Reveal>
      <Reveal><h2 className="birthday-level">{c.birthdayTitle}</h2><div className="level-up"><span>{c.you}</span><span className="level-arrow" aria-hidden="true">⟶</span><strong>{c.increment}</strong></div><h3>{c.birthday}</h3>{content.birthdayDate && <time className="date-note" dateTime={content.birthdayDate}>{content.birthdayDate}</time>}</Reveal>
      <Reveal><p className="today-closing">{c.closing}</p></Reveal>
    </div>
  </section>;
}
export function FutureSection() {
  const c = content.future;
  return <section id="future" className="future section-copy">
    <Label>{c.label}</Label><Statement>{c.opening}</Statement>
    <Reveal><h2>{c.title}</h2></Reveal><Paragraphs items={c.paragraphs} />
    <Statement className="future-written"><Star className="chapter-star" />{c.closing}</Statement>
  </section>;
}
export function BiggerFuture() {
  const c = content.life;
  return <section id="a-life-together" className="life section-copy">
    <Reveal><span className="chapter-thread" /><p className="prelude">{c.opening}</p><h2>{c.title}</h2></Reveal>
    <Paragraphs items={c.paragraphs} />
    <Reveal className="family-intro"><p>{c.family}</p></Reveal>
    <Reveal><h2>{c.familyTitle}</h2></Reveal><Paragraphs items={c.familyParagraphs} />
    <Statement>{c.closing}</Statement>
  </section>;
}
export function BirthdaySection() {
  const c = content.birthday;
  return <section id="your-month" className="birthday-month">
    <div className="birthday-flower" aria-hidden="true"><svg viewBox="0 0 160 240" fill="none"><path d="M77 234C95 170 72 144 80 96M83 178C47 177 35 151 39 147C56 146 78 157 83 178ZM84 150C116 142 130 119 124 116C102 119 90 132 84 150Z" stroke="currentColor"/><path d="M80 99C16 102 32 69 58 70C12 30 64 16 77 53C76 1 118 21 100 58C141 25 161 72 115 81C163 104 115 139 95 103C95 144 48 136 66 103Z" stroke="currentColor"/><circle cx="87" cy="81" r="13" stroke="currentColor"/></svg></div>
    <div className="section-copy"><Reveal><Label>{c.label}</Label><h2>{c.title}</h2><p className="month-intro">{c.intro}</p></Reveal><Reveal><h3>{c.wish}</h3></Reveal><Paragraphs items={c.paragraphs} /></div>
  </section>;
}
