
import "./globals.css";
import { ConditionalLayout } from "@/components/conditional-layout"
import StoreProvider from './StoreProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen max-w-full overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-500"
        suppressHydrationWarning={true}
      >
        <StoreProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
