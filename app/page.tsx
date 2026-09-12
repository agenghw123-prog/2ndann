import assets from '@/data/generated-assets.json';
import { Hero } from '@/components/Hero';
import { IntroStory, Reflection, AnniversarySection, FutureSection, BiggerFuture, BirthdaySection } from '@/components/Chapters';
import { MemoryGallery } from '@/components/MemoryGallery';
import { DestinationMap } from '@/components/DestinationMap';
import { FinalLetter } from '@/components/FinalLetter';
import { ScrollProgress } from '@/components/ScrollProgress';
import { MusicPlayer } from '@/components/MusicPlayer';

export default function Home() {
  return <><main><Hero /><IntroStory /><MemoryGallery /><Reflection /><AnniversarySection /><div className="night future-world"><FutureSection /><DestinationMap /></div><BiggerFuture /><BirthdaySection /><FinalLetter /></main><ScrollProgress />{assets.musicExists && <MusicPlayer />}</>;
}
