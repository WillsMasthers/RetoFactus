# Documentación de Autenticación y Manejo de Tokens

## 1. Almacenamiento de Tokens

### 1.1 Ubicaciones de Almacenamiento
El token de autenticación se almacena en dos lugares:

1. **LocalStorage**
   - Key: `authToken`
   - Se usa como fuente de verdad principal
   - Se actualiza en cada cambio de estado

2. **Auth Store**
   - Se accede a través de `useAuthStore`
   - Contiene el estado actual del token
   - Se actualiza automáticamente cuando cambia el token en localStorage

### 1.2 Flujo de Actualización
1. Cuando se obtiene un nuevo token:
   ```typescript
   // Guardar en localStorage
   localStorage.setItem('authToken', token)
   
   // Actualizar auth store
   useAuthStore.setState({ token })
   ```

2. Cuando se necesita el token:
   ```typescript
   // Primero intentar obtener del localStorage
   const token = localStorage.getItem('authToken')
   
   // Si no existe en localStorage, verificar auth store
   if (!token) {
     const authStore = useAuthStore.getState()
     if (authStore.token) {
       localStorage.setItem('authToken', authStore.token)
       token = authStore.token
     }
   }
   ```

## 2. Interceptor de Axios

### 2.1 Configuración
El interceptor de peticiones debe:

1. Buscar el token en localStorage
2. Si no lo encuentra, verificar en el auth store
3. Agregar el token a las cabeceras
4. Registrar en la consola si el token se agregó o no

```typescript
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Buscar en localStorage
    let token = localStorage.getItem('authToken')
    
    // 2. Si no existe, verificar en auth store
    if (!token) {
      const authStore = useAuthStore.getState()
      if (authStore.token) {
        localStorage.setItem('authToken', authStore.token)
        token = authStore.token
      }
    }
    
    // 3. Agregar a las cabeceras
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Token agregado a la petición:', token)
    } else {
      console.log('No se encontró token')
    }
    
    return config
  }
)
```

### 2.2 Manejo de Errores

1. Error 401 (Unauthorized):
   ```typescript
   if (error.response?.status === 401) {
     // Limpiar token en ambos lugares
     localStorage.removeItem('authToken')
     useAuthStore.setState({ token: null })
     
     // Redirigir al login
     window.location.href = '/login'
   }
   ```

2. Error de Conexión:
   ```typescript
   if (error.code === 'ECONNABORTED') {
     console.log('Conexión abortada, intentando nuevamente...')
     return axiosInstance(error.config)
   }
   ```

## 3. Inicialización

### 3.1 Verificación Inicial
Al iniciar la aplicación:

1. Verificar si hay token en localStorage
2. Si existe, intentar verificar la autenticación
3. Si no existe o falla la verificación, redirigir al login

```typescript
const initializeAuth = async () => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false
      })
      return
    }

    // Configurar token en axios
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`

    // Verificar autenticación
    const response = await axiosInstance.get('/auth/verify')
    
    if (response.data.success) {
      set({
        user: response.data.user,
        isAuthenticated: true,
        isInitialized: true,
        isLoading: false,
        token
      })
    } else {
      localStorage.removeItem('authToken')
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
        isLoading: false
      })
    }
  } catch (error) {
    console.error('Error al inicializar autenticación:', error)
    localStorage.removeItem('authToken')
    set({
      user: null,
      isAuthenticated: false,
      isInitialized: true,
      isLoading: false
    })
  }
}
```

## 4. Mejores Prácticas

1. **Sincronización**
   - Mantener ambos lugares de almacenamiento sincronizados
   - Actualizar localStorage siempre que se cambie el token
   - Verificar auth store si no se encuentra en localStorage

2. **Logging**
   - Registrar en la consola cuando se agrega o remueve un token
   - Registrar errores de autenticación
   - Registrar intentos de conexión fallidos

3. **Seguridad**
   - No almacenar tokens en memoria a menos que sea necesario
   - Limpiar tokens en ambos lugares cuando se cierra sesión
   - Verificar la validez del token periódicamente

## 5. Flujo de Autenticación

1. **Login**
   ```typescript
   const login = async (username: string, password: string) => {
     try {
       const response = await axiosInstance.post('/auth/login', {
         username,
         password
       })

       if (response.data.success) {
         // Guardar token en ambos lugares
         localStorage.setItem('authToken', response.data.token)
         useAuthStore.setState({ token: response.data.token })
         
         // Configurar axios
         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
       }
     } catch (error) {
       // Manejar error
     }
   }
   ```

2. **Logout**
   ```typescript
   const logout = async () => {
     try {
       // Limpiar token en ambos lugares
       localStorage.removeItem('authToken')
       useAuthStore.setState({ token: null })
       
       // Limpiar headers de axios
       delete axiosInstance.defaults.headers.common['Authorization']
     } catch (error) {
       // Manejar error
     }
   }
   ```

## 6. Verificación Periódica

1. **Verificación Automática**
   - Verificar la validez del token cada 5 minutos
   - Si el token es inválido, redirigir al login
   - Si el token es válido, actualizar el estado

2. **Renovación de Token**
   - Implementar renovación automática si el backend lo soporta
   - Manejar correctamente los errores de renovación
   - Actualizar ambos lugares de almacenamiento al renovar

## 7. Depuración

1. **Logs Importantes**
   - Estado inicial de autenticación
   - Cambios en el token
   - Errores de autenticación
   - Intentos de conexión fallidos

2. **Puntos de Verificación**
   - Verificar que el token existe en localStorage
   - Verificar que el token está en las cabeceras de axios
   - Verificar el estado del auth store
   - Verificar la respuesta del backend

## 8. Errores Comunes y Soluciones

1. **Error 401**
   - Verificar que el token existe en localStorage
   - Verificar que el token está en las cabeceras
   - Limpiar y volver a intentar

2. **Error de Conexión**
   - Verificar la URL del backend
   - Verificar el estado del servidor
   - Intentar nuevamente

3. **Token Inválido**
   - Limpiar ambos lugares de almacenamiento
   - Redirigir al login
   - Mostrar mensaje de error
