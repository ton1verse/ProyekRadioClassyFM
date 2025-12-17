import './globals.css'

export const metadata = {
  title: 'Classy FM',
  description: 'Dashboard for managing radio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}