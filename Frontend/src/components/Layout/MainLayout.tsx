import { TechStack } from '../TechStack'
import { Footer } from '../Footer'
import { useAuthStore } from '../../store/authStore'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className={`min-h-screen ${isAuthenticated ? '' : 'dark'}`}>
      <div className="flex flex-col">
        <div className="flex-1">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold underline">Reto Factus!</h1>
              {isAuthenticated && (
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
            <TechStack />
            <section className="mt-8">
              {children}
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
