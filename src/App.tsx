import Navigation from './components/Navigation'
import AppLoader from './components/loading/AppLoader'
import Home from './pages/Home'
import SmoothScrollProvider from './providers/SmoothScrollProvider'

export default function App() {
  return (
    <SmoothScrollProvider>
      <Navigation />
      <AppLoader>
        <Home />
      </AppLoader>
    </SmoothScrollProvider>
  )
}
