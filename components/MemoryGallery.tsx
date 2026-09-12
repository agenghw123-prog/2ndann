import { Fragment } from 'react';
import assets from '@/data/generated-assets.json';
import { content } from '@/data/content';
import { memoryBreaks } from '@/data/memories';
import { MemoryImage } from './MemoryImage';
import { Reveal } from './Reveal';
import { Label, Paragraphs, Star } from './StoryText';

export function MemoryGallery() {
  const c = content.gallery;
  return <section id="memories" className="memory-gallery" aria-labelledby="memories-title">
    <div className="gallery-introduction section-copy">
      <Reveal><Label>{c.label}</Label><Star className="chapter-star" /><h2 id="memories-title">{c.title}</h2><p className="subtitle">{c.subtitle}</p></Reveal>
      <Paragraphs items={c.paragraphs} />
      <span className="chapter-thread" aria-hidden="true" />
    </div>
    <div className="memories-sequence">
      {assets.photos.map((photo, index) => {
        const portrait = photo.height > photo.width;
        const layout = ['center', 'left', 'right', 'polaroid', 'wide', 'offset'][index % 6];
        const pause = memoryBreaks[photo.id];
        return <Fragment key={photo.filename}>
          {photo.id === 37 && <div className="one-more"><Reveal><p>{c.last}</p></Reveal></div>}
          <article id={`memory-${photo.id}`} data-memory={photo.id} className={`memory memory-${layout} ${portrait ? 'portrait' : 'landscape'} ${photo.id >= 30 ? 'memory-slow' : ''} ${photo.id === 37 ? 'memory-final' : ''}`}>
            <Reveal className="memory-composition" variant={index % 4}>
              <div className="memory-marginalia" aria-hidden="true"><span>THE WAY WE WERE</span><span>NO. {String(photo.id).padStart(2, '0')}</span></div>
              <figure>
                <div className="photo-mat" style={{ backgroundImage: `url("${photo.placeholder}")` }}>
                  <MemoryImage photo={photo} portrait={portrait} />
                </div>
                <figcaption><span className="photo-index">{String(photo.id).padStart(2, '0')}<span> / 37</span></span><span className="photo-caption">{photo.caption}</span>{photo.note && <p className="photo-note">{photo.note}</p>}</figcaption>
              </figure>
            </Reveal>
          </article>
          {pause && <div className={`memory-break ${photo.id === 19 ? 'halfway' : ''}`} data-break-after={photo.id}><Reveal><Star className="chapter-star" /><h3>{pause.title}</h3>{pause.text && <p>{pause.text}</p>}{photo.id === 19 && <span className="halfway-rule" />}</Reveal></div>}
        </Fragment>;
      })}
    </div>
  </section>;
}
