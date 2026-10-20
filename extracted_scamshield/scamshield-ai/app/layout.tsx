import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'ScamShield AI — Pause. Check. Protect.',
  description: 'Understand suspicious messages and links with explainable scam-risk signals and practical safety steps.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
