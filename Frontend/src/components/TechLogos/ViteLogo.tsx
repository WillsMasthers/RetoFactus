import viteLogo from '/vite.svg'

interface LogoProps {
  className?: string
}

export const ViteLogo = ({ className = '' }: LogoProps) => (
  <img src={viteLogo} className={`logo ${className}`} alt="Vite logo" />
)
