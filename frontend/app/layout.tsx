import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Phần Mềm Quản Lý - Tạo Lập Cơ Sở Dữ Liệu An Toàn Vệ Sinh Lao Động',
  description: 'Hệ thống quản lý an toàn vệ sinh lao động',
  icons: { icon: '/vna-group-logo.png' },
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
