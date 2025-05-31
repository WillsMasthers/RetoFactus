import React from 'react'
import {
  Table as TremorTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text
} from '@tremor/react'

interface TableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey: keyof T
    align?: 'left' | 'right' | 'center'
    cell?: (value: unknown) => React.ReactNode
  }[]
  title?: string
  description?: string
  actionButton?: {
    label: string
    onClick: () => void
  }
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  onPageChange?: (page: number) => void
  isLoading?: boolean
}

function Table<T extends { [key: string]: unknown }>({
  data,
  columns,
  title,
  description,
  actionButton,
  pagination,
  onPageChange,
  isLoading = false
}: TableProps<T>) {
  const renderPagination = () => {
    if (!pagination || !onPageChange) return null

    const { currentPage, totalPages } = pagination
    const pages: number[] = []

    // Siempre mostrar primera página
    pages.push(1)

    // Agregar páginas alrededor de la página actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Siempre mostrar última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Text className="text-tremor-default text-gray-600 dark:text-gray-300">
          {`Mostrando ${pagination.itemsPerPage * (currentPage - 1) + 1} a ${Math.min(pagination.itemsPerPage * currentPage, pagination.totalItems)} de ${pagination.totalItems} resultados`}
        </Text>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              px-3 py-2 rounded-full
              ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            Anterior
          </button>
          {pages.map((page, index) => {
            const isEllipsis = index > 0 && page - pages[index - 1] > 1

            return (
              <React.Fragment key={page}>
                {isEllipsis && (
                  <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${page === currentPage
                      ? 'bg-tremor-brand text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {page}
                </button>
              </React.Fragment>
            )
          })}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              px-3 py-2 rounded-full
              ${currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            Siguiente
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {(title || actionButton) && (
        <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
          {title && (
            <div>
              <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {title}
              </h3>
              {description && (
                <p className="mt-1 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                  {description}
                </p>
              )}
            </div>
          )}
          {actionButton && (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="mt-4 w-full whitespace-nowrap rounded-tremor-small bg-tremor-brand px-4 py-2.5 text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis sm:mt-0 sm:w-fit"
            >
              {actionButton.label}
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-tremor-brand"></div>
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto">
            <TremorTable>
              <TableHead>
                <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
                  {columns.map((column) => (
                    <TableHeaderCell
                      key={String(column.accessorKey)}
                      className={`
                        text-tremor-content-strong 
                        dark:text-dark-tremor-content-strong 
                        ${column.align === 'right' ? 'text-right' : ''}
                        ${column.align === 'center' ? 'text-center' : ''}
                        whitespace-nowrap
                      `}
                    >
                      {column.header}
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-8 text-tremor-content dark:text-dark-tremor-content"
                    >
                      No hay datos para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell
                          key={`${index}-${String(column.accessorKey)}`}
                          className={`
                            ${column.align === 'right' ? 'text-right' : ''}
                            ${column.align === 'center' ? 'text-center' : ''}
                            whitespace-nowrap
                          `}
                        >
                          {column.cell
                            ? column.cell(item[column.accessorKey])
                            : String(item[column.accessorKey])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </TremorTable>
          </div>
          {renderPagination()}
        </>
      )}
    </>
  )
}

export default Table