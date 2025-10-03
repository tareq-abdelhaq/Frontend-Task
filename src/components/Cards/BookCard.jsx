// src/components/BookCard.jsx
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa' // For the cart icon

import { randomColorGenerator } from '../../utils'

const BookCard = ({ title, author, stores, id, onSell, isSold }) => {
    return (
        <div className="relative bg-white shadow-md rounded-lg p-4 flex gap-4 w-full max-w-md">
            {/* Sold Badge */}
            {isSold && (
                <span className="absolute top-0 start-0 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                    Sold
                </span>
            )}
            {/* Book Cover */}
            <div
                className="flex items-center justify-center h-48 w-28 bg-peach-100 rounded-lg"
                style={{ backgroundColor: randomColorGenerator() }} // Light peach background
            >
                <p className="text-center text-black font-medium text-lg px-2">
                    {title}
                </p>
            </div>

            {/* Book Details */}
            <div className="flex-1">
                <p className="text-lg font-bold text-gray-800">{title}</p>
                <p className="text-sm text-gray-500 mb-2">by {author}</p>
                <span className="text-sm text-gray-500">Stores:</span>

                <div className="flex gap-2 mt-2">
                    {stores.length > 0 ? (
                        stores.map((store, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-between py-2 px-3 bg-peach-100 rounded-lg gap-2"
                                style={{ backgroundColor: '#FFE4E1' }} // Light peach background
                            >
                                <div className="flex flex-col">
                                    <p className="text-sm text-gray-700">
                                        {store.name}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        ${store.price.toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-lg ml-2 hover:bg-blue-600 disabled:bg-gray-400"
                                    onClick={() => onSell(id)}
                                    disabled={isSold}
                                >
                                    {isSold ? 'Sold' : 'Sell'}
                                    <FaShoppingCart className="text-sm" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">
                            No stores available
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookCard
