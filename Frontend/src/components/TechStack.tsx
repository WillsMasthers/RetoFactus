/**
 * @file TechStack.tsx
 * @description Componente que muestra la pila tecnológica del proyecto con sus respectivos logos y enlaces.
 * Utiliza Tailwind CSS para el estilizado y maneja la visualización de tecnologías en un formato horizontal.
 */

import { ReactLogo } from './TechLogos/ReactLogo'
import { ViteLogo } from './TechLogos/ViteLogo'
import { MongoLogo } from './TechLogos/MongoLogo'
import { NodeLogo } from './TechLogos/NodeLogo'

/**
 * @interface TechItem
 * @description Define la estructura de cada elemento tecnológico en la pila
 * @property {string} name - Nombre de la tecnología
 * @property {string} url - URL oficial de la tecnología
 * @property {JSX.Element} logo - Componente del logo de la tecnología
 */
interface TechItem {
  name: string
  url: string
  logo: JSX.Element
}

/**
 * @component TechStack
 * @description Componente que renderiza la pila tecnológica del proyecto.
 * Muestra los logos de las tecnologías principales con enlaces a sus sitios oficiales.
 * Los elementos están separados por el símbolo '+' y son clickeables.
 * 
 * @returns {JSX.Element} Componente de la pila tecnológica
 */
export const TechStack = () => {
  // Array de tecnologías con sus respectivos datos
  const techStack: TechItem[] = [
    { name: 'Vite', url: 'https://vite.dev', logo: <ViteLogo className="w-16 h-16" /> },
    { name: 'React', url: 'https://react.dev', logo: <ReactLogo className="w-16 h-16 motion-safe:animate-[spin_20s_linear_infinite]" /> },
    { name: 'MongoDB', url: 'https://www.mongodb.com', logo: <MongoLogo className="w-16 h-16 motion-safe:animate-[bounce_2s_ease-in-out_infinite]" /> },
    { name: 'Node.js', url: 'https://nodejs.org', logo: <NodeLogo className="w-16 h-16" /> }
  ]

  return (
    <div className="flex justify-center items-center space-x mb-4">
      {techStack.map((tech, index) => (
        <div key={tech.name} className="flex items-center">
          {/* Agrega el símbolo '+' entre elementos, excepto antes del primero */}
          {index > 0 && <span className="text-2xl text-gray-600 dark:text-gray-400 mx-4">➕</span>}
          {/* Enlace a la documentación oficial de cada tecnología */}
          <a
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity flex flex-col items-center"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              {tech.logo}
            </div>
            <h2 className="text-center mt-2 text-gray-700 dark:text-gray-300 font-medium">{tech.name}</h2>
          </a>
        </div>
      ))}
    </div>
  )
}
