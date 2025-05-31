import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)
const SALT_LENGTH = 16
const KEY_LENGTH = 64

export async function hashPassword(password) {
  try {
    const salt = randomBytes(SALT_LENGTH).toString('hex')
    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH)
    return `${salt}:${derivedKey.toString('hex')}`
  } catch (err) {
    console.error('Error al hashear contraseña:', err)
    throw new Error('Error en el proceso de hash')
  }
}

export async function verifyPassword(storedHash, suppliedPassword) {
  try {
    const [salt, hash] = storedHash.split(':')
    const derivedKey = await scryptAsync(suppliedPassword, salt, KEY_LENGTH)
    return hash === derivedKey.toString('hex')
  } catch (err) {
    console.error('Error al verificar contraseña:', err)
    throw new Error('Error en la verificación')
  }
}
