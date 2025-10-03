import { useState, useEffect, useRef, useMemo } from 'react'

const BooksDropdown = ({ books, onBookSelect, searchTerm, setSearchTerm }) => {
    // state
    const [isOpen, setIsOpen] = useState(false)

    // ref for dropdown click outside
    const dropdownRef = useRef(null)

    // Filter books based on search term
    const filteredBooks = useMemo(() => {
        if (!searchTerm.trim()) {
            return books.slice(0, 7) // show first 7 books initially
        }
        return books
            .filter((book) =>
                Object.values(book).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            )
            .slice(0, 20)
    }, [books, searchTerm])

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Handle book selection
    const handleBookSelect = (book) => {
        setSearchTerm(book.name)
        setIsOpen(false)
        onBookSelect(book.id)
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setIsOpen(true)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsOpen(true)}
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for a book..."
            />

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                onClick={() => handleBookSelect(book)}
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">
                                    {book.name}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-gray-500 text-center">
                            {searchTerm.trim()
                                ? 'No books found matching your search'
                                : 'No books available to add'}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default BooksDropdown
