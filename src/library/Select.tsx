import React, { useState } from 'react'
import Popover from './Popover'
import "./Select.scoped.css"

interface ISelect { items: string[], onSelect: (index: number) => void }
const Select = ({ items, onSelect }: ISelect) => {
    interface ICombo { item: string, index: number }
    const ComboItem = ({ item, index }: ICombo) => {
        return <div className="combo-item" style={{ height: 20 }} onClick={() => onSelect(index)} >{item}</div>
    }
    return (
        <div className='combo' onClick={(e) => e.stopPropagation()} >
            {items.map((t, i) => <ComboItem item={t} index={i} />)}
        </div>
    )
}
interface ISelectWrap { items: string[], defaultValue?: string, onSelect: (index: number) => void }
export const SelectWrap = ({ items, onSelect, defaultValue }: ISelectWrap) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(defaultValue || items[0])
    const useSelection = (index: number) => {
        setValue(items[index])
        onSelect(index)
    }
    return (
        <div onDoubleClick={() => setOpen(!open)} className="select-main" >
            <div>{value}</div>
            <Popover open={open} setOpen={setOpen} clickClose>
                <Select items={items} onSelect={useSelection} />
            </Popover>
        </div>
    )
}
export default Select
