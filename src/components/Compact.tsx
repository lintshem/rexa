import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { SelectWrap } from '../library/Select'
import { focusedConstAtom, focusedConstItems } from '../store/main'
import "./Compact.scoped.css"

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
        const anchorElem = con.cn[pos] === -1 ? 'root' : items[con.cn[pos]].name
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
                <input className='node-input' type="number" onChange={setOffset} value={val} />
                <SelectWrap items={ids} defaultValue={anchorElem} onSelect={(i) => changeAnchor(i)} />
            </div>
        )
    }
    interface ICmpDim { dim: "height" | "width" }
    const CmpDim = ({ dim }: ICmpDim) => {
        const dimName = dim === 'width' ? "w" : "h"
        const [val, setVal] = useState('' + con[dimName])
        const updateVal = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            setVal(value)
            const valNo = Number(value)
            if (value && valNo) {
                con[dimName] = valNo
            }
            update((d: number) => d % 100 + 1)
        }
        return (
            <div>
                <div>{dim}</div>
                <input className='dim-input' value={val} onChange={updateVal} />
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
            <div className='dims'>
                <div>
                    <CmpDim dim="width" />
                </div>
                <div>
                    <CmpDim dim="height" />
                </div>
            </div>
        </div>
    )
}


export default Compact