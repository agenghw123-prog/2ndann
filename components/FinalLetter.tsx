import { content } from '@/data/content';
import { Reveal } from './Reveal';
import { Label, Paragraphs, Star } from './StoryText';
import { SecretMessage } from './SecretMessage';

export function FinalLetter() {
  const c = content.letter;
  return <section id="letter" className="final-letter night">
    <div className="section-copy">
      <Reveal><Star className="chapter-star" /><Label>{c.label}</Label><h2>{c.title}</h2></Reveal>
      <Paragraphs items={c.paragraphs} />
      <Reveal className="letter-dreams"><h3>{c.dreams}</h3></Reveal>
      <Reveal><p className="letter-promises">{c.promises}</p></Reveal>
      <Reveal className="letter-closing"><h2>{c.closing}</h2></Reveal>
      <Reveal><p className="serif-message">{c.birthday}<br />{c.anniversary}</p><p className="year-three">{c.yearThree}</p><p className="signature">{c.signature} <span>{content.myName}</span></p></Reveal>
      <SecretMessage />
    </div>
    <footer className="ending-footer"><span>{content.title}</span><a href="#beginning">{c.back} <span aria-hidden="true">↑</span></a></footer>
  </section>;
}
