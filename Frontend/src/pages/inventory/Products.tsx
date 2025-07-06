import React from 'react'
import { Button } from '@/components/common/Button'
import { Plus } from 'lucide-react'
import Container from '@/components/common/Container'
import Section from '@/components/common/Section'
import PageTitle from '@/components/common/PageTitle'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ProductsPage: React.FC = () => {
  return (
    <Container>
      <Header />
      <main className="flex-1">
        <div className="p-4">
          <Section className="mb-8">
            <div className="flex justify-between items-center">
              <PageTitle
                title="Productos"
                description="Administra los productos de tu inventario"
                size="lg"
                align="left"
              />
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </Section>
          
          <Section title="Lista de Productos">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p>Lista de productos aquí</p>
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </Container>
  )
}

export default ProductsPage