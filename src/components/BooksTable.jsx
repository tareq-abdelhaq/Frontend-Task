// src/components/BooksTable.jsx
import { useMemo, useState } from 'react'

import Table from './Table/Table'
import TableActions from './ActionButton/TableActions'

const DEFAULT_COLUMNS = ['id', 'name', 'pages', 'author', 'actions']

const BooksTable = (props) => {
    // props destructuring
    const {
        books,
        authors,
        editingRowId,
        setEditingRowId,
        skipPageReset,
        setSkipPageReset,
        columnsConfig = DEFAULT_COLUMNS,
        onSave,
        onDelete,
        editableCell = 'name', // name or price
    } = props

    // state for editing cell
    const [editValue, setEditValue] = useState('')

    // Create a lookup map for authors
    const authorMap = useMemo(() => {
        return authors.reduce((map, author) => {
            map[author.id] = `${author.first_name} ${author.last_name}`
            return map
        }, {})
    }, [authors])

    // Enrich books with author names
    const enrichedBooks = useMemo(() => {
        return books.map((book) => ({
            ...book,
            author_name: authorMap[book.author_id] || 'Unknown Author',
        }))
    }, [books, authorMap])

    // Define all possible columns
    const allColumns = useMemo(
        () => ({
            id: { header: 'Book Id', accessorKey: 'id' },
            name: {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) =>
                    editingRowId === row.original.id &&
                    editableCell === 'name' ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                    handleSave(row.original.id)
                                if (e.key === 'Escape') handleCancel()
                            }}
                            className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    ) : (
                        row.original.name
                    ),
            },
            pages: { header: 'Pages', accessorKey: 'page_count' },
            author: { header: 'Author', accessorKey: 'author_name' },
            price: {
                header: 'Price',
                accessorKey: 'price',
                cell: ({ row }) =>
                    editingRowId === row.original.id &&
                    editableCell === 'price' ? (
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                    handleSave(row.original.id)
                                if (e.key === 'Escape') handleCancel()
                            }}
                            className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    ) : (
                        `$${row.original.price?.toFixed(2) || '0.00'}`
                    ),
            },
            actions: {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <TableActions
                        onEdit={
                            editingRowId === row.original.id
                                ? handleCancel
                                : () => handleEdit(row.original)
                        }
                        onDelete={() =>
                            onDelete(row.original.id, row.original.name)
                        }
                    />
                ),
            },
        }),
        [editingRowId, editableCell, editValue]
    )

    // Local handlers that manage editValue state
    const handleEdit = (book) => {
        setSkipPageReset(true)
        setEditingRowId(book.id)
        setEditValue(
            editableCell === 'name'
                ? book.name
                : book.price?.toString() || '0.00'
        )
    }

    const handleSave = (id) => {
        setSkipPageReset(true)
        onSave(id, editValue)
        setEditingRowId(null)
        setEditValue('')
    }

    const handleCancel = () => {
        setSkipPageReset(true)
        setEditingRowId(null)
        setEditValue('')
    }

    // Select columns based on columnsConfig
    const columns = useMemo(() => {
        return columnsConfig.map((colKey) => allColumns[colKey]).filter(Boolean)
    }, [columnsConfig, allColumns, editableCell, editValue])

    return (
        <Table
            data={enrichedBooks}
            columns={columns}
            skipPageReset={skipPageReset}
        />
    )
}

export default BooksTable
