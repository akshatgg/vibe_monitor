
import "./globals.css";

import StoreProvider from './StoreProvider';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-500"
        suppressHydrationWarning={true}
      >
       <StoreProvider>{children}</StoreProvider>
      
       
      </body>
    </html>
  );
}
