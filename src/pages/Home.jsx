// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Loading from '../pages/Loading'
import StoreCard from '../components/Cards/StoreCard'
import BookCard from '../components/Cards/BookCard'
import AuthorCard from '../components/Cards/AuthorCard'
import { useLibraryData } from '../hooks/useLibraryData'

const Home = () => {
    const { stores, booksWithStores, authors, books, inventory, isLoading } =
        useLibraryData()

    // Manage sold books state
    const [soldBooks, setSoldBooks] = React.useState(new Set())

    const handleSellBook = (bookId) => {
        setSoldBooks((prevSoldBooks) => {
            const newSoldBooks = new Set(prevSoldBooks)
            newSoldBooks.add(bookId)
            return newSoldBooks
        })
    }

    const storesWithMetrics = React.useMemo(() => {
        return stores.slice(0, 5).map((store) => {
            const storeInventory = inventory.filter(
                (item) => item.store_id === store.id
            )
            const noOfBooks = storeInventory.length
            const totalPrice = storeInventory.reduce(
                (sum, item) => sum + item.price,
                0
            )
            const averagePrice = noOfBooks > 0 ? totalPrice / noOfBooks : 0

            return {
                id: store.id, // Fix broken navigation in StoreCard
                name: store.name,
                noOfBooks,
                averagePrice,
            }
        })
    }, [stores, inventory])

    // slice would yeild books with stores, so we add the sold books state here too
    // in this demo data, it's not appeared but in the real data, it would be
    const limitedBooksWithStores = booksWithStores.slice(0, 5)

    const authorsWithBookCount = React.useMemo(() => {
        return authors.slice(0, 5).map((author) => {
            const noOfBooks = books.filter(
                (book) => book.author_id === author.id
            ).length
            return {
                name: `${author.first_name} ${author.last_name}`,
                noOfBooks,
            }
        })
    }, [authors, books])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="py-6 px-4">
            {/* Stores Section */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Stores</h2>
                    <Link
                        to="/browsestores"
                        className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
                    >
                        View All
                    </Link>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4">
                    {storesWithMetrics.map((store, index) => (
                        <div key={index} className="flex-shrink-0">
                            <StoreCard
                                id={store.id}
                                name={store.name}
                                noOfBooks={store.noOfBooks}
                                averagePrice={store.averagePrice}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Books Section */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Books</h2>
                    <Link
                        to="/browsebooks"
                        className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
                    >
                        View All
                    </Link>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4">
                    {limitedBooksWithStores.map((book, index) => (
                        <div key={index} className="flex-shrink-0">
                            <BookCard
                                title={book.title}
                                author={book.author}
                                stores={book.stores}
                                id={book.id}
                                onSell={handleSellBook}
                                isSold={soldBooks.has(book.id)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Authors Section */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Authors
                    </h2>
                    <Link
                        to="/browseauthors"
                        className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
                    >
                        View All
                    </Link>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4">
                    {authorsWithBookCount.map((author, index) => (
                        <div key={index} className="flex-shrink-0">
                            <AuthorCard
                                name={author.name}
                                noOfBooks={author.noOfBooks}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Home
