import React, { useLayoutEffect, useRef, useState } from 'react'
import "./Constraint.scoped.css"

import { useBoundingclientrect } from 'rooks'

interface IBond { l: number, r: number, t: number, b: number }
interface IItemCont { items: IItemObj[], index: number, item: IItemObj, update: Function, par: IBond }
const ItemCont = ({ item, items, update, par }: IItemCont) => {
    const ref = useRef(null)
    const rect = useBoundingclientrect(ref)
    useLayoutEffect(() => {
        if (rect) {
            item.bb = { l: rect.left, r: rect.right, t: rect.top, b: rect.bottom }
            item.bb.t -= par.t
            item.bb.b = item.bb.b - par.t
            item.bb.l -= par.l
            item.bb.r = item.bb.r - par.l
            update((a: number) => a % 100 + 1)
            console.log('updating', item.bb)
        }
        //eslint-disable-next-line
    }, [rect])
    const set = (a: number) => a !== -1
    const retBB = (index: number) => items[index].bb
    const getStyle = () => {
        const styles: { [key: string]: number } = {}
        //styles['background'] = /*'red' as any//*/makeRandColor() as any
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
        if (set(cn.r)) styles['right'] = retBB(cn.r).l + item.r
        console.log(item.name, styles)
        return styles
    }
    return (
        <div className='cont' style={getStyle() as any} ref={ref} >
            items {item.name}
        </div>
    )
}
const TestDrag = () => {
    const dragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text', 'div')

    }
    return (
        <div draggable onDragStart={dragStart}   >
            Div
        </div>
    )
}

interface IItemObj {
    w: number, h: number, t: number, b: number, l: number, r: number, name: string,
    bb: {
        t: number, b: number, l: number, r: number,
    }, cn: {
        t: number, b: number, l: number, r: number,
    }
}
const getBB = () => {
    return { t: 0, b: 0, l: 0, r: 0 }
}
const getCN = () => {
    return { t: -1, b: -1, l: -1, r: -1 }
}

const items = [
    { w: 300, h: 400, t: -1, b: -1, l: -1, r: -1, name: 'oner', bb: getBB(), cn: getCN() },
    { w: 70, h: 130, t: 5, b: -1, l: -1, r: 10, name: 'oner', bb: getBB(), cn: getCN() },
    { w: 100, h: 120, t: 30, b: - 1, l: 15, r: -1, name: 'twos', bb: getBB(), cn: getCN() },
    { w: -1, h: -1, t: 30, b: 15, l: 10, r: 10, name: 'twos-hang', bb: getBB(), cn: { ...getCN(), t: 2, b: 4, l: -1 } },
    { w: 120, h: -1, t: 220, b: 10, l: -1, r: 30, name: 'fress', bb: getBB(), cn: { ...getCN(), r: 2 } },
] as IItemObj[]

const Constraint = () => {
    const ref = useRef(null)
    const ref2 = useRef(null)
    const rect = useBoundingclientrect(ref)
    //   const rect2 = useBoundingclientrect(ref2)
    const update = useState(1)[1]

    const items2 = [...items].slice(1)
    console.log(items2)
    return (
        <div ref={ref2} className='out' >
            <div className='stage' ref={ref} >
                <div style={{ marginLeft: 20 }} > One </div>
                {items2.map((m, i) => <ItemCont key={m.name} item={m} index={i} items={items} update={update}
                    par={rect ? { r: rect.right, l: rect.left, t: rect.top, b: rect.bottom } : {} as any} />)}
            </div>
            <TestDrag />
        </div>
    )
}

export default Constraint
