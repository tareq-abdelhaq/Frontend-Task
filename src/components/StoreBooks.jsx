import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import BooksTable from './BooksTable'

const StoreBooks = ({ storeId, storeBooks, setInventory, authors }) => {
    // state for editing
    const [editingRowId, setEditingRowId] = useState(null)
    const [skipPageReset, setSkipPageReset] = useState(false)

    // Search functionality
    const [searchParams] = useSearchParams()
    const searchTerm = searchParams.get('search') || ''

    // Filter books based on search term
    const filteredBooks = useMemo(() => {
        if (!searchTerm.trim()) return storeBooks

        const lowerSearch = searchTerm.toLowerCase()
        // this enables searching in any field of the book not just name
        return storeBooks.filter((book) =>
            Object.values(book).some((value) =>
                String(value).toLowerCase().includes(lowerSearch)
            )
        )
    }, [storeBooks, searchTerm])

    // Handle delete book from store
    const deleteBookFromStore = (bookId, bookName) => {
        if (
            window.confirm(
                `Are you sure you want to remove "${bookName}" from this store?`
            )
        ) {
            setSkipPageReset(true) // persist the table page state

            // Remove the inventory entry for this book in this store
            setInventory((prevInventory) =>
                prevInventory.filter(
                    (item) =>
                        !(
                            item.book_id === parseInt(bookId, 10) &&
                            item.store_id === parseInt(storeId, 10)
                        )
                )
            )

            setEditingRowId(null)
        }
    }

    // handle save edited price
    const handleSave = (bookId, newValue) => {
        const newPrice = parseFloat(newValue)

        if (isNaN(newPrice) || newPrice < 0) {
            alert('Please enter a valid price')
            return
        }

        // Update the inventory entry for this book in this store
        setInventory((prevInventory) =>
            prevInventory.map((item) =>
                item.book_id === parseInt(bookId, 10) &&
                item.store_id === parseInt(storeId, 10)
                    ? { ...item, price: newPrice }
                    : item
            )
        )
    }

    return (
        <div>
            {filteredBooks.length > 0 ? (
                <BooksTable
                    books={filteredBooks}
                    authors={authors}
                    editingRowId={editingRowId}
                    setEditingRowId={setEditingRowId}
                    skipPageReset={skipPageReset}
                    setSkipPageReset={setSkipPageReset}
                    onSave={handleSave}
                    onDelete={deleteBookFromStore}
                    editableCell="price"
                    columnsConfig={[
                        'id',
                        'name',
                        'pages',
                        'author',
                        'price',
                        'actions',
                    ]}
                />
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-600">
                        {searchTerm.trim()
                            ? 'No books found matching your search.'
                            : 'No books available in this store.'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default StoreBooks
