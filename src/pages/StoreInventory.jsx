// src/pages/Inventory.jsx
import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import Header from '../components/Header'

import { useLibraryData } from '../hooks/useLibraryData'

import StoreBooks from '../components/StoreBooks'
import BooksDropdown from '../components/BooksDropdown'

const VIEW_OPTIONS = {
    books: 'books',
    authors: 'authors',
}

const Inventory = () => {
    // Store ID
    const { storeId } = useParams()

    // Get data from hook
    const { books, setInventory, inventory, authors, storeBooks } =
        useLibraryData({ storeId })

    // State for UI
    const [activeTab, setActiveTab] = useState(VIEW_OPTIONS.books)
    const [showModal, setShowModal] = useState(false)
    const [booksDropdownSearchTerm, setBooksDropdownSearchTerm] = useState('')

    // State for adding book to store
    const [selectedBookId, setSelectedBookId] = useState('')
    const [bookPrice, setBookPrice] = useState('')

    // Set active tab based on view query param
    const [searchParams, setSearchParams] = useSearchParams()
    const view = searchParams.get('view') || VIEW_OPTIONS.books
    useEffect(() => {
        if (view === VIEW_OPTIONS.authors || view === VIEW_OPTIONS.books) {
            setActiveTab(view)
        }
    }, [view])

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab)
        if (tab !== activeTab) {
            searchParams.set('view', tab)
            setSearchParams(searchParams)
        }
    }

    // Get books not already in this store
    const availableBooks = useMemo(() => {
        const storeBookIds = storeBooks.map((book) => parseInt(book.id, 10))

        return books.filter(
            (book) => !storeBookIds.includes(parseInt(book.id, 10))
        )
    }, [books, storeBooks])

    // Modal controls
    const openModal = () => {
        setShowModal(true)
        resetModal()
    }

    const resetModal = () => {
        setSelectedBookId('')
        setBookPrice('')
        setBooksDropdownSearchTerm('')
    }

    const closeModal = () => {
        setShowModal(false)
        resetModal()
    }

    // Handle book selection from dropdown
    const handleSelectBook = (bookId) => {
        setSelectedBookId(bookId)
    }

    // Handle adding book to store
    const handleAddBookToStore = () => {
        if (!selectedBookId || !bookPrice.trim()) {
            alert('Please select a book and enter a price')
            return
        }

        const price = parseFloat(bookPrice)
        if (isNaN(price) || price < 0) {
            alert('Please enter a valid price')
            return
        }

        // Add new inventory entry
        const newId =
            inventory.length > 0
                ? Math.max(...inventory.map((item) => item.id)) + 1
                : 1
        const newInventoryEntry = {
            id: newId,
            book_id: parseInt(selectedBookId, 10),
            store_id: parseInt(storeId, 10),
            price: price,
        }

        setInventory((prevInventory) => [...prevInventory, newInventoryEntry])
        closeModal()
    }

    return (
        <div className="py-6">
            <div className="flex mb-4 w-full justify-center items-center">
                <button
                    onClick={() => handleTabChange(VIEW_OPTIONS.books)}
                    className={`px-4 border-b-2 py-2 ${activeTab === 'books' ? 'border-b-main' : 'border-b-transparent'}`}
                >
                    Books
                </button>
                <button
                    onClick={() => handleTabChange(VIEW_OPTIONS.authors)}
                    className={`px-4 border-b-2 py-2 ${activeTab === 'authors' ? 'border-b-main' : 'border-b-transparent'}`}
                >
                    Authors
                </button>
            </div>

            <Header
                addNew={openModal}
                title={`Store Inventory`}
                buttonTitle="Add to inventory"
            />

            {activeTab === 'books' ? (
                <StoreBooks
                    storeId={storeId}
                    storeBooks={storeBooks}
                    setInventory={setInventory}
                    authors={authors}
                />
            ) : (
                <p className="text-gray-600">
                    No authors with books in this store.{' '}
                    {/* TODO: Add authors tab here */}
                </p>
            )}

            <Modal
                title="Add Book to Store"
                save={handleAddBookToStore}
                cancel={closeModal}
                show={showModal}
                setShow={setShowModal}
            >
                <div className="flex flex-col gap-4 w-full">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Select Book
                        </label>
                        <BooksDropdown
                            books={availableBooks}
                            onBookSelect={handleSelectBook}
                            searchTerm={booksDropdownSearchTerm}
                            setSearchTerm={setBooksDropdownSearchTerm}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Price
                        </label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={bookPrice}
                            onChange={(e) => setBookPrice(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Price (e.g., 29.99)"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Inventory
