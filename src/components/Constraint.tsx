import React, { useRef, useState } from 'react'
import "./Constraint.scoped.css"
import { useBoundingclientrect } from 'rooks'
import { Resizable } from 're-resizable'
import Compact from './Compact'
import {useAtomValue, useSetAtom } from 'jotai'
import { focusedConstAtom, focusedConstItems } from '../store/main'

interface IItemCont { items: ItemMod[], index: number, item: ItemMod, update: Function, par: DOMRect | null }
const ItemCont = ({ item, items, update, par }: IItemCont) => {
    const setFocus = useSetAtom(focusedConstAtom('ss'))
    const ref = useRef(null)
    const [oldRect, setOld] = useState({ w: 0, h: 0 })
    if (par) {
        if (ref.current && ref.current as HTMLDivElement) {
            const rect = (ref.current as HTMLElement).getBoundingClientRect()
            item.bb = { l: rect.left, r: rect.right, t: rect.top, b: rect.bottom }
            item.bb.t -= par.top
            item.bb.b = item.bb.b - par.top
            item.bb.l -= par.left
            item.bb.r = item.bb.r - par.left
            if (oldRect.w !== rect.width || oldRect.h !== rect.height) {
                setOld({ w: rect.width, h: rect.height })
                update((a: number) => a % 100 + 1)
            }
        }
    }
    const set = (a: number) => a !== -1
    const retBB = (index: number) => items[index].bb
    const makeFocused = () => {
        setFocus(item.name)
    }
    const getStyle = () => {
        const styles: { [key: string]: number } = {}
        //   styles['background'] = makeRandColor() as any
        if (set(item.b)) styles['bottom'] = item.b
        if (set(item.t)) styles['top'] = item.t
        if (set(item.l)) styles['left'] = item.l
        if (set(item.r)) styles['right'] = item.r
        if (set(item.w)) styles['width'] = item.w
        if (set(item.h)) styles['height'] = item.h
        const cn = item.cn
        if (set(cn.t)) styles['top'] = retBB(cn.t).b + item.t
        if (set(cn.b)) styles['bottom'] = retBB(cn.b).t + item.b
        if (set(cn.l)) styles['left'] = retBB(cn.l).r + item.l
        if (set(cn.r)) {
            const d = retBB(cn.r).l
            const ds = d - item.r
            if (par) {
                const dw = par.width - ds
                styles['right'] = dw
            }
        }
        if (set(cn.l)) {
            const d = retBB(cn.l).r
            const ds = d + item.l
            if (par) {
                const dw = ds
                styles['left'] = dw
            }
        }
        return styles
    }

    return (
        <div className='cont' style={getStyle() as any} ref={ref} onClick={makeFocused} >
            IT {item.name}
        </div>
    )
}
interface IBond { t: number, b: number, l: number, r: number }
const getBB = (): IBond => {
    return { t: 0, b: 0, l: 0, r: 0 }
}
const getCN = (): IBond => {
    return { t: -1, b: -1, l: -1, r: -1 }
}
export class ItemMod {
    name: string = ''
    w: number = -1
    h: number = -1
    t: number = -1
    b: number = -1
    l: number = -1
    r: number = -1
    bb: IBond = getBB()
    cn: IBond = getCN()
    constructor(args: { [key: string]: any }) {
        Object.assign(this, args)
    }
    scn(data: [key: keyof IBond, val: number][]) {
        for (const d of data) {
            this.cn[d[0]] = d[1]
        }
        return this
    }
    sbb(data: [key: keyof IBond, val: number][]) {
        for (const d of data) {
            this.bb[d[0]] = d[1]
        }
        return this
    }
    static Create(args: { [key: string]: any }) {
        return new ItemMod(args)
    }
    updateCN(pos: keyof IBond, index: number) {
        this.cn[pos] = index;
    }
    updateRect(pos: keyof IBond, index: number) {
        this[pos] = index;
    }

}

const Constraint = () => {
    const ref = useRef(null)
    const ref2 = useRef(null)
    const rect = useBoundingclientrect(ref)
    const update = useState(1)[1]
    const items = useAtomValue(focusedConstItems('ss'))
    const items2 = [...items].slice(1)
    const resize = () => {
        update(a => a % 100 + 1)
    }
    return (
        <div ref={ref2} className='out' >
            <Resizable defaultSize={{ width: 300, height: 400 }} onResize={resize} >
                <div className='stage' ref={ref} >
                    <div style={{ marginLeft: 20 }} > One </div>
                    {items2.map((m, i) => <ItemCont key={m.name} item={m} index={i} items={items} update={update}
                        par={rect} />)}
                </div>
            </Resizable>
            <Compact update={update} />
        </div>
    )
}

export default Constraint
