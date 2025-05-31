import reactLogo from '../../assets/react.svg'

interface LogoProps {
  className?: string
}

export const ReactLogo = ({ className = '' }: LogoProps) => (
  <img src={reactLogo} className={`logo react ${className}`} alt="React logo" />
)
