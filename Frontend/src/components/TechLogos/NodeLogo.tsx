import nodejsLogo from '../../assets/nodejs.svg'

interface LogoProps {
  className?: string
}

export const NodeLogo = ({ className = '' }: LogoProps) => (
  <img src={nodejsLogo} className={`logo nodejs ${className}`} alt="Node.js logo" />
)
