// Modal component with two action buttons

import React from 'react'

// wrap the modal content in a form to support enter key submission and remove unused setShow prop

const Modal = ({ show, /*setShow,*/ title, save, cancel, children }) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                save()
            }}
        >
            <div
                className={`fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50 ${show ? '' : 'hidden'}`}
            >
                <div className="bg-white rounded-xl shadow-lg w-xl overflow-hidden relative z-10">
                    <h2 className="text-lg  mb-4 bg-main text-white  p-4">
                        {title}
                    </h2>
                    <div className="flex flex-col items-center justify-center w-full p-4 font-light">
                        {children}
                    </div>
                    <div className="flex justify-end space-x-4 p-4 font-light">
                        <button
                            type="button"
                            onClick={cancel}
                            className="text-main border border-main bg-white px-3 py-1.5 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-main text-white px-3 py-1.5 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Modal
