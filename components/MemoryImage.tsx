'use client';

import { assetPath } from '@/lib/assets';

type Props = { photo: { src: string; alt: string; width: number; height: number; variants: { src: string; width: number }[] }; portrait: boolean };
export function MemoryImage({ photo, portrait }: Props) {
  return <picture><source type="image/webp" srcSet={photo.variants.map(v => `${assetPath(v.src)} ${v.width}w`).join(', ')} sizes={portrait ? '(max-width: 600px) 88vw, (max-width: 900px) 65vw, 520px' : '(max-width: 600px) 88vw, (max-width: 1100px) 80vw, 980px'} />
    {/* Build-time image variants keep this component independent of a server. */}
    <img src={assetPath(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" onLoad={event => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) event.currentTarget.animate([{ opacity: .15 }, { opacity: 1 }], { duration: 650, easing: 'ease-out' }); }} />
  </picture>;
}
