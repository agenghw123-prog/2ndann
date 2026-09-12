import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import './globals.css';
import { content } from '@/data/content';

export const metadata: Metadata = {
  title: content.title,
  description: 'A little love letter about our past, our present, and all the life still ahead of us.',
  robots: { index: false, follow: false },
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#f5f0e7' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#intro" className="skip-link">Skip opening</a>{children}</body></html>;
}
