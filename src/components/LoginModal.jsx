import { useState } from 'react'

import { useAuth } from '../context'

import Modal from './Modal'

const LoginModal = ({ show, onClose }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { login } = useAuth()

    const handleSubmit = async () => {
        try {
            const result = await login(username, password)

            if (result.success) {
                handleClose()
            } else {
                alert(result.error)
            }
        } catch (error) {
            alert('An unexpected error occurred')
        }
    }

    const handleClose = () => {
        setUsername('')
        setPassword('')
        onClose()
    }

    return (
        <Modal
            show={show}
            title="Sign In"
            save={handleSubmit}
            cancel={handleClose}
        >
            <div className="w-full space-y-4">
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="username"
                        required
                    />
                </div>

                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="password"
                        required
                    />
                </div>

                <div className="p-3 bg-gray-100 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">Demo Account:</p>
                    <div className="text-xs space-y-1">
                        <div>admin / admin123</div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default LoginModal
