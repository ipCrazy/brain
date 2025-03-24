import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Inline skripta za postavljanje dark mode-a pre hidracije */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const darkModeOn = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (darkModeOn) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
