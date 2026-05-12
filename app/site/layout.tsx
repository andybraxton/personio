import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './styles.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'High Trust Systems — Turn your website into your highest-converting salesperson',
  description:
    'We help product and growth teams fix the trust gap that\'s costing them leads. Typical clients see 30–60% more qualified enquiries within 8 weeks. Get a free homepage audit.',
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`htd-root ${inter.variable} ${spaceGrotesk.variable}`}
      style={
        {
          '--font-sans': 'var(--font-inter), Helvetica Neue, Arial, sans-serif',
          '--font-display': 'var(--font-space-grotesk), var(--font-inter), Helvetica Neue, Arial, sans-serif',
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
