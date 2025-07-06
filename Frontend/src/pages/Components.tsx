import React, { useState } from 'react'
import Card from '../components/common/Card'
import Header from '../components/Header'
import Section from '../components/common/Section'
import Container from '../components/common/Container'
import { Button } from '../components/common/Button'
import { InputField } from '../components/componentesForm/InputField'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'
import Footer from '../components/Footer'
import PageTitle from '../components/common/PageTitle'
import { Dropdown, DropdownItem, DropdownDivider } from '../components/common/Dropdown'
import { Collapse } from '../components/common/Collapse'
import { Input } from '../components/common/Input'
import { InputNumber } from '../components/common/InputNumber'
import { InputDecimal } from '../components/common/InputDecimal'
import InputDatetime from '../components/common/InputDatetime'
import Calendar_DayPicker from '../components/common/Calendar_DayPicker'
import InputCalendar from '../components/common/InputCalendar'

// Dummy data for Table Showcase
const dummyData = [
  { id: 1, name: 'Factura 001', quantity: 1, price: 150.00, status: 'Pagada' },
  { id: 2, name: 'Factura 002', quantity: 1, price: 300.50, status: 'Pendiente' },
  { id: 3, name: 'Factura 003', quantity: 1, price: 75.00, status: 'Anulada' },
]

// Dummy columns for Table Showcase
const dummyColumns = [
  { header: 'ID', accessorKey: 'id' as const, cell: (value: unknown) => value as number },
  { header: 'Name', accessorKey: 'name' as const, cell: (value: unknown) => value as string },
  { header: 'Quantity', accessorKey: 'quantity' as const, cell: (value: unknown) => value as number },
  { header: 'Price', accessorKey: 'price' as const, cell: (value: unknown) => `$${(value as number).toFixed(2)}` },
  { header: 'Estado', accessorKey: 'status' as const, cell: (value: unknown) => <StatusBadge status={value as 'Pagada' | 'Pendiente' | 'Anulada'} /> },
]

function Components() {
  const [inputValue, setInputValue] = useState('')
  const [numericInputValue, setNumericInputValue] = useState('')
  const [decimalInputValue, setDecimalInputValue] = useState('')

  return (
    <Container>
      <Header />
      <main className="flex-1">
        <div className="p-4">
          <Section className="mb-8">
            <PageTitle title="Componentes" description='Catálogo de componentes disponibles' />
          </Section>

          {/* Calendar Showcase */}
          <Collapse
            title="Calendar"
            description="Calendar component for date selection"
            className="mb-8"
          >
            <div className="space-y-4">
              <Calendar_DayPicker
                className="max-w-fit mx-auto"
              />
              <div className="text-center text-sm text-gray-500">
                Selecciona una fecha para verla en consola
              </div>
            </div>
            <div className="space-y-4 w-sm">
              <InputCalendar />
            </div>
          </Collapse>

          {/* Button Showcase */}
          <Collapse
            title="Buttons"
            description="Catálogo de botones con diferentes variantes, modos y estados"
            className="mb-8"
          >
            <div className="space-y-8 relative z-10">
              {/* Variantes */}
              <div>
                <p>Primary</p>
                <h3 className="text-lg font-semibold mb-4 dark:text-slate-400">Variantes</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="tertiary">Tertiary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="light-info">Info</Button>
                </div>
              </div>

              {/* Modos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-slate-400">Modos</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="light-primary">Light</Button>
                  <Button variant="dark-primary">Dark</Button>
                  <Button variant="link-primary">Link</Button>
                  <Button variant="ghost-primary">Ghost</Button>
                  <Button variant="outline-primary">Outline</Button>
                  <Button variant="soft-primary">Soft</Button>
                </div>
              </div>

              {/* Tamaños */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-slate-400">Tamaños</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="light-primary" size="sm">Small</Button>
                  <Button variant="light-primary" size="md">Medium</Button>
                  <Button variant="light-primary" size="lg">Large</Button>
                </div>
              </div>

              {/* Combinaciones */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-slate-400">Combinaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium dark:text-slate-400">Primary</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="light-primary">Light</Button>
                      <Button variant="primary">Solid</Button>
                      <Button variant="dark-primary">Dark</Button>
                      <Button variant="link-primary">Link</Button>
                      <Button variant="ghost-primary">Ghost</Button>
                      <Button variant="outline-primary">Outline</Button>
                      <Button variant="soft-primary">Soft</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium dark:text-slate-400">Secondary</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="light-secondary">Light</Button>
                      <Button variant="secondary">Solid</Button>
                      <Button variant="dark-secondary">Dark</Button>
                      <Button variant="link-secondary">Link</Button>
                      <Button variant="ghost-secondary">Ghost</Button>
                      <Button variant="outline-secondary">Outline</Button>
                      <Button variant="soft-secondary">Soft</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium dark:text-slate-400">Tertiary</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="light-tertiary">Light</Button>
                      <Button variant="tertiary">Solid</Button>
                      <Button variant="dark-tertiary">Dark</Button>
                      <Button variant="link-tertiary">Link</Button>
                      <Button variant="ghost-tertiary">Ghost</Button>
                      <Button variant="outline-tertiary">Outline</Button>
                      <Button variant="soft-tertiary">Soft</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium dark:text-slate-400">Danger</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="light-danger">Light</Button>
                      <Button variant="danger">Solid</Button>
                      <Button variant="dark-danger">Dark</Button>
                      <Button variant="link-danger">Link</Button>
                      <Button variant="ghost-danger">Ghost</Button>
                      <Button variant="outline-danger">Outline</Button>
                      <Button variant="soft-danger">Soft</Button>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h4 className="font-medium dark:text-slate-400">Success</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="light-success">Light</Button>
                      <Button variant="success">Light</Button>
                      <Button variant="dark-success">Dark</Button>
                      <Button variant="link-success">Link</Button>
                      <Button variant="ghost-success">Ghost</Button>
                      <Button variant="outline-success">Outline</Button>
                      <Button variant="soft-success">Soft</Button>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h4 className="font-medium dark:text-slate-400">Warning</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="light-warning">Light</Button>
                      <Button variant="warning">Solid</Button>
                      <Button variant="dark-warning">Dark</Button>
                      <Button variant="link-warning">Link</Button>
                      <Button variant="ghost-warning">Ghost</Button>
                      <Button variant="outline-warning">Outline</Button>
                      <Button variant="soft-warning">Soft</Button>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <h4 className="font-medium dark:text-slate-400">Info</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="light-info">Light</Button>
                      <Button variant="info">Solid</Button>
                      <Button variant="dark-info">Dark</Button>
                      <Button variant="link-info">Link</Button>
                      <Button variant="ghost-info">Ghost</Button>
                      <Button variant="outline-info">Outline</Button>
                      <Button variant="soft-info">Soft</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estados */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-slate-400">Estados</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="secondary" loading>Loading</Button>
                  <Button variant="tertiary" loading>Loading</Button>
                  <Button variant="danger" loading>Loading</Button>
                  <Button variant="success" loading>Loading</Button>
                  <Button variant="warning" loading>Loading</Button>
                  <Button variant="info" loading>Loading</Button>
                  <Button variant="primary" fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </Collapse>

          {/* InputField Showcase */}
          <Collapse
            title="Input Fields"
            description="Campos de entrada de texto con diferentes configuraciones y tipos"
            className="mb-8"
          >
            <div className="flex flex-wrap gap-4 relative z-10">
              {/* Ejemplos existentes */}
              <InputField label="Standard Input" placeholder="Enter text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <InputField label="Required Input" required placeholder="Required field" />

              {/* Ejemplos numéricos */}
              <InputField
                label="Numeric Input (Integers Only)"
                type='number'
                placeholder="Enter integers"
                value={numericInputValue}
                onChange={(e) => setNumericInputValue(e.target.value)}
              />
              <InputField
                label="Numeric Input (Decimals Allowed)"
                type='decimal'
                placeholder="Enter decimals"
                value={decimalInputValue}
                onChange={(e) => setDecimalInputValue(e.target.value)}
              />

              {/* Otros tipos por Type */}
              <InputField label="Email Input" type="email" placeholder="Enter email" />
              <InputField label="Password Input" type="password" placeholder="Enter password" />
              <InputField label="Date Input" type="date" />
              <InputField label="Telephone Input" type="tel" placeholder="Enter phone number" />
              <InputField label="URL Input" type="url" placeholder="Enter URL" />
              <InputField label="Color Input" type="color" />
            </div>
            <div>
              <h2 className='text-lg font-semibold dark:text-slate-400'>Input</h2>
              <h3 className='dark:text-slate-400'>Standard Input</h3>
              <Input />
              <h3 className='dark:text-slate-400'>Number Input</h3>
              <InputNumber />
              <h3 className='dark:text-slate-400'>Decimal Input</h3>
              <InputDecimal />
              <InputDatetime format='24h' />
              <InputDatetime format='dd/mm/yyyy' />
            </div>
          </Collapse>

          {/* Card Showcase */}
          <Collapse
            title="Card"
            description="Componente de tarjeta para agrupar contenido relacionado"
            className="mb-8"
          >
            <Card>
              <p className="text-text">This is a simple card component. It provides a container with padding, rounded corners, and a shadow.</p>
            </Card>
          </Collapse>

          {/* Table Showcase */}
          <Collapse
            title="Table"
            description="Tabla de datos con paginación y acciones"
            className="mb-8"
          >
            <Card>
              <Table
                data={dummyData}
                columns={dummyColumns}
                title="Dummy Data Table"
                description="Showing a preview of the table component."
                isLoading={false}
                pagination={{ currentPage: 1, totalPages: 1, totalItems: dummyData.length, itemsPerPage: 10 }}
                onPageChange={() => { }}
                actionButton={{ label: 'Add Item', onClick: () => console.log('Add clicked') }}
              />
            </Card>
          </Collapse>

          {/* StatusBadge Showcase */}
          <Collapse
            title="Status Badges"
            description="Insignias para mostrar estados o estados de elementos"
            className="mb-8"
          >
            <div className="flex gap-4 relative z-10">
              <StatusBadge status="Pagada" />
              <StatusBadge status="Pendiente" />
              <StatusBadge status="Anulada" />
            </div>
          </Collapse>

          {/* Dropdown Showcase */}
          <Collapse
            title="Dropdown"
            description="Menús desplegables con diferentes configuraciones"
            className="mb-8"
          >
            <div className="space-y-8 relative z-10">
              {/* Basic Dropdown */}
              <Dropdown
                trigger={
                  <Button variant="light-primary">Menú Desplegable</Button>
                }
              >
                <DropdownItem onClick={() => console.log('Opción 1')}>
                  Opción 1
                </DropdownItem>
                <DropdownItem onClick={() => console.log('Opción 2')}>
                  Opción 2
                </DropdownItem>
                <DropdownItem disabled>
                  Opción Deshabilitada
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  onClick={() => console.log('Opción con Estilo')}
                  className="text-blue-600 dark:text-blue-400"
                >
                  Opción con Estilo
                </DropdownItem>
              </Dropdown>
            </div>
          </Collapse>
        </div>
      </main>
      <Footer />
    </Container>
  )
}

export default Components
