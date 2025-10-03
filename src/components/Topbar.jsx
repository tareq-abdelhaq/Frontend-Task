import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useAuth } from '../context'

import LoginModal from './LoginModal'

import usrImg from '../assets/usr.png'

const Topbar = () => {
    const location = useLocation()
    const { isAuthenticated, user, logout } = useAuth()
    const [showLoginModal, setShowLoginModal] = useState(false)
    const path = location.pathname

    const title = {
        '/': {
            title: 'Shop',
            subtitle: 'Shop > Books',
        },

        '/stores': {
            title: 'Stores',
            subtitle: 'Admin > Stores',
        },
        '/author': {
            title: 'Authors',
            subtitle: 'Admin > Authors',
        },
        '/books': {
            title: 'Books',
            subtitle: 'Admin > Books',
        },
        '/store/:storeId': {
            title: 'Store Inventory',
            subtitle: 'Admin > Store Inventory',
        },

        // Add missing header for browser stores page
        '/browsestores': {
            title: 'Browse Stores',
            subtitle: 'Shop > Stores',
        },

        '/browsebooks': {
            title: 'Browse Books',
            subtitle: 'Shop > Books',
        },
        '/browseauthors': {
            title: 'Browse Authors',
            subtitle: 'Shop > Authors',
        },
    }

    return (
        <div className="h-24 border-b border-b-secondary-text flex justify-between items-center">
            <div className="flex flex-col justify-start items-start ">
                <p className="text-lg text-secondary-text">
                    {title[path]?.title}
                </p>
                <p className="font-light text-secondary-text">
                    {title[path]?.subtitle}
                </p>
            </div>
            <div className="flex-1 flex justify-end items-center">
                {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                        <img src={usrImg} alt="profile" className="rounded" />
                        <p className="text-secondary-text font-light h-full">
                            {user.username}
                        </p>
                        <button
                            onClick={logout}
                            className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="text-sm bg-white text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                        Sign In
                    </button>
                )}
            </div>

            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    )
}

export default Topbar
