'use client';

import { useState } from 'react';
import { content, destinations } from '@/data/content';
import { assetPath } from '@/lib/assets';
import { Reveal } from './Reveal';
import { Label, Star } from './StoryText';

// Equirectangular projection, shared with the generated Natural Earth SVG.
function project(lon: number, lat: number) { return [(lon + 180) / 360 * 1000, (90 - lat) / 180 * 500]; }

export function DestinationMap() {
  const [selected, setSelected] = useState('london');
  const [zoom, setZoom] = useState(false);
  const destination = destinations.find(place => place.id === selected)!;
  const c = content.travel;
  const [x, y] = project(destination.lon, destination.lat);
  return <section id="someday" className="destinations" aria-labelledby="destinations-title">
    <div className="section-copy"><Reveal><Label>{c.label}</Label><h2 id="destinations-title">{c.title}</h2><p className="subtitle">{c.subtitle}</p></Reveal></div>
    <Reveal className="atlas">
      <div className="atlas-topline"><span>OUR SOMEDAY ATLAS</span><button type="button" onClick={() => setZoom(!zoom)} aria-pressed={zoom}>{zoom ? 'View the world −' : 'A closer look +'}</button></div>
      <div className="world-map">
        <svg viewBox={zoom ? `${Math.max(0, Math.min(700, x - 150))} ${Math.max(0, Math.min(300, y - 90))} 300 180` : '0 20 1000 440'} aria-label={c.mapLabel} role="group">
          <defs><pattern id="atlas-grid" width="83.333" height="83.333" patternUnits="userSpaceOnUse"><path d="M83.333 0H0V83.333" fill="none" stroke="currentColor" strokeWidth=".4" opacity=".18" /></pattern></defs>
          <rect width="1000" height="500" fill="url(#atlas-grid)" />
          <image href={assetPath('/world-map.svg')} width="1000" height="500" opacity=".75" />
          {destinations.map(place => {
            const [px, py] = project(place.lon, place.lat);
            const active = selected === place.id;
            return <g key={place.id} transform={`translate(${px} ${py})`} className={`map-marker ${active ? 'selected' : ''}`} role="button" tabIndex={0} aria-label={`${place.name}, ${place.country}`} aria-pressed={active} onClick={() => setSelected(place.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(place.id); } }}>
              <title>{place.name}</title><circle className="marker-target" r={zoom ? 3.5 : 5} /><circle className="marker-halo" r={active ? 10 : 5} /><circle className="marker-dot" r={active ? 3.5 : 2} />
            </g>;
          })}
          <g className="map-active-label" transform={`translate(${x} ${y})`} pointerEvents="none"><path d="M0 -12V-28H42" fill="none" stroke="currentColor" strokeWidth=".6" /><text x="4" y="-33" fontSize={zoom ? 5 : 10}>{destination.name.toUpperCase()}</text></g>
        </svg>
        <div className="map-compass" aria-hidden="true"><span>N</span><Star /></div>
      </div>
      <div className="atlas-details">
        <div className="destination-select"><label htmlFor="destination">{c.selectLabel}</label><select id="destination" value={selected} onChange={event => setSelected(event.target.value)}>{destinations.map(place => <option key={place.id} value={place.id}>{place.name} · {place.country}</option>)}</select><p>14 places. Endless possibilities.</p></div>
        <div className="destination-note" aria-live="polite" aria-atomic="true"><Label>{c.noteLabel}</Label><h3>{destination.name}<span>{destination.country}</span></h3><p>“{destination.note}”</p></div>
      </div>
    </Reveal>
    <noscript><div className="section-copy">{destinations.map(place => <p key={place.id}><strong>{place.name}</strong> — {place.note}</p>)}</div></noscript>
    <div className="travel-closing section-copy"><Reveal><p>{c.closing}</p><h3>{c.final}</h3></Reveal></div>
  </section>;
}
