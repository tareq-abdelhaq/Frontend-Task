// src/hooks/useLibraryData.js
import { useEffect, useState, useMemo } from 'react'

import { API_BASE_URL } from '../api'

export const useLibraryData = ({ storeId = null, searchTerm = '' } = {}) => {
    // State for data
    const [books, setBooks] = useState([])
    const [authors, setAuthors] = useState([])
    const [stores, setStores] = useState([])
    const [inventory, setInventory] = useState([])

    // Fetch all data
    useEffect(() => {
        fetch(`${API_BASE_URL}/stores`)
            .then((response) => response.json())
            .then((data) => setStores(Array.isArray(data) ? data : [data]))
            .catch((error) => console.error('Error fetching stores:', error))

        fetch(`${API_BASE_URL}/books`)
            .then((response) => response.json())
            .then((data) => setBooks(Array.isArray(data) ? data : [data]))
            .catch((error) => console.error('Error fetching books:', error))

        fetch(`${API_BASE_URL}/authors`)
            .then((response) => response.json())
            .then((data) => setAuthors(Array.isArray(data) ? data : [data]))
            .catch((error) => console.error('Error fetching authors:', error))

        fetch(`${API_BASE_URL}/inventory`)
            .then((response) => response.json())
            .then((data) => setInventory(Array.isArray(data) ? data : [data]))
            .catch((error) => console.error('Error fetching inventory:', error))
    }, [])

    // Create lookup maps
    const authorMap = useMemo(() => {
        return authors.reduce((map, author) => {
            map[author.id] = {
                ...author,
                name: `${author.first_name} ${author.last_name}`,
            }
            return map
        }, {})
    }, [authors])

    const storeMap = useMemo(() => {
        return stores.reduce((map, store) => {
            map[store.id] = store
            return map
        }, {})
    }, [stores])

    // Filter books for a specific store (for Inventory page)
    const storeBooks = useMemo(() => {
        if (!storeId) return books

        const storeInventory = inventory.filter(
            (item) => item.store_id === parseInt(storeId, 10)
        )

        let filteredBooks = books
            .filter((book) =>
                storeInventory.some(
                    (item) => item.book_id === parseInt(book.id, 10)
                )
            )
            .map((book) => {
                const inventoryItem = storeInventory.find(
                    (item) => item.book_id === parseInt(book.id, 10)
                )
                return {
                    ...book,
                    price: inventoryItem ? inventoryItem.price : null,
                }
            })

        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase()
            filteredBooks = filteredBooks.filter((book) =>
                Object.values({
                    ...book,
                    author_name:
                        authorMap[book.author_id]?.name || 'Unknown Author',
                }).some((value) =>
                    String(value).toLowerCase().includes(lowerSearch)
                )
            )
        }

        return filteredBooks
    }, [storeId, books, inventory, searchTerm, authorMap])

    // Map books to their stores (for Browse page)
    const booksWithStores = useMemo(() => {
        return books.map((book) => {
            const bookInventory = inventory.filter(
                (item) => item.book_id === parseInt(book.id, 10)
            )
            const bookStores = bookInventory.map((item) => ({
                name: storeMap[item.store_id]?.name || 'Unknown Store',
                price: item.price,
            }))

            return {
                id: book.id, // needed to track the sold book in browse books page
                title: book.name,
                author: authorMap[book.author_id]?.name || 'Unknown Author',
                stores: bookStores,
            }
        })
    }, [books, inventory, authorMap, storeMap])

    // Loading state
    const isLoading =
        !books.length || !authors.length || !stores.length || !inventory.length

    return {
        books,
        setBooks,
        authors,
        stores,
        inventory,
        setInventory,
        authorMap,
        storeMap,
        storeBooks,
        booksWithStores,
        isLoading,
        currentStore: stores.find(
            (store) => store.id === parseInt(storeId, 10)
        ),
    }
}
