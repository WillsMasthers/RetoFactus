// Este middleware ya no se usa, el test de usuario por defecto se ejecuta manualmente
export const initDefaultUser = async (req, res, next) => {
  next()
}
