import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import Select, { SelectWrap } from '../library/Select'
import { focusedConstAtom, focusedConstItems } from '../store/main'
import "./Compact.scoped.css"
import { ItemMod } from './Constraint'


interface IConst { update: Function }
const Compact = ({ update }: IConst) => {
    const focused = useAtomValue(focusedConstAtom('ss'))
    const items = useAtomValue(focusedConstItems('ss'))
    const con = items.find(t => t.name === focused)
    if (!con) {
        return (
            <div>No Constraint selected</div>
        )
    }
    const ids = ['root', ...items.map(t => t.name)]
    interface ICmpNode { pos: 'l' | 'r' | 'b' | 't' }
    const CmpNode = ({ pos }: ICmpNode) => {
        const [val, setVal] = useState('' + con[pos])
        const anchorElem = con.cn[pos] == -1 ? 'root' : items[con.cn[pos]].name
        const setOffset = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setVal(value)
            const v = parseFloat(value)
            if (v) {
                con.updateRect(pos, v)
                update((p: number) => p % 100 + 1)
            }
        }
        const changeAnchor = (index: number) => {
            if (index === 0) {
                index = NaN
            }
            con.updateCN(pos, index)
            update((d: number) => d % 100 + 1)
        }
        return (
            <div className='node' >
                <input type="number" onChange={setOffset} value={val} />
                <SelectWrap items={ids} defaultValue={anchorElem} onSelect={(i) => changeAnchor(i)} />
            </div>
        )
    }

    return (
        <div className='cattrib' >
            {con.name}
            <div className='center'  >
                <div className='row r1'  >
                    <CmpNode pos='t' />
                </div>
                <div className='row r2'  >
                    <CmpNode pos='l' />
                    <div >MM</div>
                    <CmpNode pos='r' />
                </div>
                <div className='row r3' >
                    <CmpNode pos='b' />
                </div>
            </div>
        </div>
    )
}


export default Compact