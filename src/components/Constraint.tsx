import React, { useEffect, useRef, useState } from 'react'
import "./Constraint.scoped.css"

import { useBoundingclientrect } from 'rooks'
import { Resizable } from 're-resizable'

//interface IBond { l: number, r: number, t: number, b: number }
interface IItemCont { items: IItemObj[], index: number, item: IItemObj, update: Function, par: DOMRect | null }
const ItemCont = ({ item, items, update, par }: IItemCont) => {
    const ref = useRef(null)
    const rect = useBoundingclientrect(ref)
    useEffect(() => {
        update((a: number) => a % 100 + 1)
        //eslint-disable-next-line
    }, [rect, par, update])
    //  console.log('rendring', item.name)
    if (rect && par) {
        item.bb = { l: rect.left, r: rect.right, t: rect.top, b: rect.bottom }
        item.bb.t -= par.top
        item.bb.b = item.bb.b - par.top
        item.bb.l -= par.left
        item.bb.r = item.bb.r - par.left
         //      console.log('updating', item.bb)
    }
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
        if (set(cn.r)) {
            const d = retBB(cn.r).l
            const ds = d - item.r
            if (par) {
                const dw = par.width - ds
                //           console.log(item.name, d, ds, dw, retBB(cn.r))
                styles['right'] = dw
            }
            //styles['right'] = retBB(cn.r).l + item.r
        }
        if (set(cn.l)) {
            const d = retBB(cn.l).r
            const ds = d + item.l
            if (par) {
                const dw = ds// par.width - ds
                console.log(item.name, d, ds, dw, retBB(cn.l))
                styles['left'] = dw
            }

            //styles['right'] = retBB(cn.r).l + item.r
        }
        //    console.log(item.name, styles)
        return styles

    }
    return (
        <div className='cont' style={getStyle() as any} ref={ref} >
            IT {item.name}
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
    { w: -1, h: 120, t: 30, b: - 1, l: 15, r: 5, name: 'twos', bb: getBB(), cn: { ...getCN(), r: 1 } },
    { w: -1, h: 50, t: 30, b: 15, l: 10, r: 0, name: 'twos-hang', bb: getBB(), cn: { ...getCN(), t: 2, b: 4, r: 4 } },
    { w: 120, h: -1, t: 5, b: 10, l: -1, r: -10, name: 'fress', bb: getBB(), cn: { ...getCN(), r: 1, t: 3 } },
    { w: -1, h: 50, t: -1, b: 10, l: 15, r: 20, name: 'LeftBot', bb: getBB(), cn: { ...getCN(), r: 4 } },
    { w: -1, h: -1, t: 10, b: 13, l: 20, r: 10, name: 'RightBot', bb: getBB(), cn: { ...getCN(), l: 2, t: 1, b: -1 } },
    { w: -1, h: 50, t: 30, b: -1, l: 10, r: 7, name: 'hang-left', bb: getBB(), cn: { ...getCN(), b: 2, l: 3, t: 2 } },
] as IItemObj[]

const Constraint = () => {
    const ref = useRef(null)
    const ref2 = useRef(null)
    const rect = useBoundingclientrect(ref)
    //   const rect2 = useBoundingclientrect(ref2)
    const update = useState(1)[1]

    const items2 = [...items].slice(1)
    //  console.log('rendring parent', items2)
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
            <TestDrag />
        </div>
    )
}

export default Constraint
