import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'VNA Application',
  description: 'VNA Management System',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
