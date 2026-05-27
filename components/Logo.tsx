interface LogoProps {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  accentColor?: string
}

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export default function Logo({ variant = 'dark', size = 'md', accentColor = '#ef476f' }: LogoProps) {
  const textColor = variant === 'dark' ? 'text-white' : 'text-ink'

  return (
    <span className={`font-mono font-normal uppercase tracking-tight ${sizes[size]} ${textColor}`}>
      ΛCΛDEM<span style={{ color: accentColor }}>*</span>IΛ
    </span>
  )
}
