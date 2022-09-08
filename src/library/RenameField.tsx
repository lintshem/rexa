import { useState } from 'react'
import { MdSave } from 'react-icons/md'
import './RenameField.scoped.css'

interface IRenameField { name: string, setName: (nam: string) => void }
export const RenameField = ({ name, setName }: IRenameField) => {
    const [value, setValue] = useState(name)
    const isDirty = value !== name
    const classes = `${isDirty ? 'rename-dirty' : ''}`
    const updateName = () => setName(value)
    return (
        <div className="rf-main">
            <input className={classes} value={value} onChange={(e) => setValue(e.target.value)} />
            <div onClick={updateName} ><MdSave /></div>
        </div>
    )
}
