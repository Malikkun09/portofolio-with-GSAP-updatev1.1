import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue/50',
        isLight
          ? 'border-black/10 bg-white text-black hover:border-black/30 hover:bg-white/90'
          : 'border-cyber-fg/10 bg-cyber-bg-surface text-cyber-fg hover:border-cyber-fg/30 hover:bg-cyber-bg-card',
        className
      )}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-all duration-300',
          isLight ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        )}
      >
        <Moon size={16} />
      </span>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-all duration-300',
          isLight ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        )}
      >
        <Sun size={16} />
      </span>
    </button>
  )
}
