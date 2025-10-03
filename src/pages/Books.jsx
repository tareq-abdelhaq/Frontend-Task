import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Loading from './Loading'
import BooksTable from '../components/BooksTable'
import { useSearchParams } from 'react-router-dom'
import Modal from '../components/Modal'

import { useLibraryData } from '../hooks/useLibraryData'

const Books = () => {
    const [searchParams] = useSearchParams()
    const searchTerm = searchParams.get('search') || ''
    const [editingRowId, setEditingRowId] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [newBook, setNewBook] = useState({
        author_id: '',
        name: '',
        page_count: '',
    })
    const [skipPageReset, setSkipPageReset] = useState(false)
    const { books, setBooks, authors } = useLibraryData() // Unified hook for all data

    // Filter books based on search
    const filteredBooks = books.filter((book) => {
        if (!searchTerm.trim()) return true
        return Object.values(book).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    // Delete book handler
    const deleteBook = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            setSkipPageReset(true) // persist the table page state
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id))
            setEditingRowId(null)
        }
    }

    // Save edited name
    const handleSave = (id, newValue) => {
        setBooks(
            books.map((book) =>
                book.id === id ? { ...book, name: newValue } : book
            )
        )
    }

    // Add new book handler
    const handleAddNew = () => {
        if (!newBook.author_id || !newBook.name || !newBook.page_count) {
            alert('All fields are required')
            return
        }

        if (isNaN(newBook.page_count) || newBook.page_count <= 0) {
            alert('Page count must be a number')
            return
        }

        const newId =
            books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1
        const newBookObject = {
            id: newId,
            author_id: parseInt(newBook.author_id),
            name: newBook.name,
            page_count: parseInt(newBook.page_count),
        }

        setSkipPageReset(false) // reset the table page state since we are adding a new one at the top
        setBooks((prevBooks) => [newBookObject, ...prevBooks])
        setNewBook({ author_id: '', name: '', page_count: '' })
        setShowModal(false)
    }

    return (
        <div className="py-6">
            <Header addNew={() => setShowModal(true)} title="Books List" />
            {books.length > 0 ? (
                <BooksTable
                    books={filteredBooks}
                    authors={authors}
                    editingRowId={editingRowId}
                    setEditingRowId={setEditingRowId}
                    skipPageReset={skipPageReset}
                    setSkipPageReset={setSkipPageReset}
                    onSave={handleSave}
                    onDelete={deleteBook}
                    editableCell="name"
                />
            ) : (
                <Loading />
            )}
            <Modal
                title="New Book"
                save={handleAddNew}
                cancel={() => setShowModal(false)}
                show={showModal}
                setShow={setShowModal}
            >
                <div className="flex flex-col gap-4 w-full">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Book Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={newBook.name}
                            onChange={(e) =>
                                setNewBook({ ...newBook, name: e.target.value })
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                            placeholder="Enter Book Name"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="page_count"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Number of Pages
                        </label>
                        <input
                            id="page_count"
                            type="number"
                            value={newBook.page_count}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    page_count: e.target.value,
                                })
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                            placeholder="Enter Page Count"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="author_id"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Author
                        </label>
                        <select
                            id="author_id"
                            value={newBook.author_id}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    author_id: e.target.value,
                                })
                            }
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        >
                            <option value="" disabled>
                                Select an Author
                            </option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.first_name} {author.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Books
