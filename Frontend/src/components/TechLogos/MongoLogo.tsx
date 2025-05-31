import mongoLogo from '../../assets/mongodb.svg'

interface LogoProps {
  className?: string
}

export const MongoLogo = ({ className = '' }: LogoProps) => (
  <img src={mongoLogo} className={`logo mongo ${className}`} alt="MongoDB logo" />
)
