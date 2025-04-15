// pages/_app.tsx
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
      <Toaster position="top-center" />
    </ThemeProvider>
  )
}
