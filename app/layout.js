import "./globals.css";

export const metadata = {
  title: "Bollywood Voice Personas",
  description: "Talk to Gabbar, Mogambo, Basanti or Babu Bhaiyya — voice in, voice out.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}