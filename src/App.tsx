import { ThemeProvider } from './contexts/ThemeContext'
import Navigation from './components/Navigation'
import AppLoader from './components/loading/AppLoader'
import Home from './pages/Home'
import SmoothScrollProvider from './providers/SmoothScrollProvider'

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <Navigation />
        <AppLoader>
          <Home />
        </AppLoader>
      </SmoothScrollProvider>
    </ThemeProvider>
  )
}
