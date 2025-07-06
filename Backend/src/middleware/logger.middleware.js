export const requestLogger = (req, res, next) => {
  const start = Date.now()
  console.log(
    `\n📥 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  )
  console.log('📦 Body:', req.body)
  console.log('🔍 Params:', req.params)
  console.log('🔑 Query:', req.query)

  // Capturar la respuesta
  const originalSend = res.send
  res.send = function (body) {
    const duration = Date.now() - start
    console.log(
      `\n📤 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    )
    console.log(`⏱️  Duración: ${duration}ms`)
    console.log('📦 Response:', body)
    console.log('📊 Status:', res.statusCode)
    console.log('----------------------------------------')
    return originalSend.call(this, body)
  }

  next()
}
