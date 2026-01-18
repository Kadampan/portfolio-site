import { Inter, Russo_One } from 'next/font/google';
import './globals.css';
import ThemeLoader from '@/components/ThemeLoader';

const inter = Inter({ subsets: ['latin'] });
const russoOne = Russo_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-russo'
});

export const metadata = {
  title: '3D Artist Portfolio | Creative 3D Experiences',
  description: 'Professional 3D artist portfolio showcasing immersive 3D experiences, creative modeling, and stunning visual projects.',
  keywords: '3D Artist, 3D Modeling, Game Developer, Unity, Unreal Engine, Blender, Maya, Cinema 4D',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={russoOne.variable}>
      <body className={inter.className}>
        <ThemeLoader />
        {children}
      </body>
    </html>
  );
}
