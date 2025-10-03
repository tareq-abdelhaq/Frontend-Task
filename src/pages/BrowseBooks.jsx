// src/pages/Browse.jsx
import { useState } from 'react'
import Loading from '../pages/Loading'
import BookCard from '../components/Cards/BookCard'
import { useLibraryData } from '../hooks/useLibraryData'

const BrowseBooks = () => {
    // Use the custom hook
    const { booksWithStores, isLoading } = useLibraryData()

    // Manage sold books state
    // using set to avoid duplicate books and O(1) time complexity for checking if a book is sold
    const [soldBooks, setSoldBooks] = useState(new Set())

    const handleSellBook = (bookId) => {
        setSoldBooks((prevSoldBooks) => {
            const newSoldBooks = new Set(prevSoldBooks)
            newSoldBooks.add(bookId)
            return newSoldBooks
        })
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="py-6 px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Browse All Books
            </h2>
            <div className="flex flex-wrap gap-6 ">
                {booksWithStores.map((book, index) => (
                    <BookCard
                        key={index}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        stores={book.stores}
                        onSell={handleSellBook}
                        isSold={soldBooks.has(book.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default BrowseBooks
