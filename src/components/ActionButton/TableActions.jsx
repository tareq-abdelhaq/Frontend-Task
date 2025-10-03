import React from 'react'
import ActionButton from '../ActionButton/ActionButton'
import pencil from '../../assets/Pencil.png'
import trash from '../../assets/Bin.png'

// remove row prop since it's not needed in this component
const TableActions = ({ onEdit, onDelete }) => {
    return (
        <div className="flex space-x-2">
            <ActionButton icon={pencil} action={onEdit} />
            <ActionButton
                icon={trash}
                action={onDelete}
                className="bg-red-500 hover:bg-red-600"
            />
        </div>
    )
}
export default TableActions
