import React, { useRef, useState } from 'react'
import "./Constraint.scoped.css"
import { useBoundingclientrect, useDidMount } from 'rooks'
import { Resizable } from 're-resizable'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { focusedConstAtom, constraintItemsAtom, constraintUpdateAtom, showArrowsAtom, focusedCompAtom, newTextAtom } from '../store/main'
import XArrow from 'react-xarrows'
import _ from 'lodash'
import { receiveDrag } from '../util/utils'
import { Comp } from '../models/Module'

interface IItemCont { items: ItemMod[], index: number, item: ItemMod, update: Function, par: DOMRect | null, modName: string }
const ItemCont = ({ item, items, update, par, modName }: IItemCont) => {
    const showArrows = useAtomValue(showArrowsAtom)
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
        if (set(cn.t) && set(item.t)) styles['top'] = retBB(cn.t).b + item.t
        if (set(cn.b) && set(item.b)) styles['bottom'] = retBB(cn.b).t + item.b
        if (set(cn.l) && set(item.l)) styles['left'] = retBB(cn.l).r + item.l
        if (set(cn.r) && set(item.r)) {
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
    const getArrows = () => {
        const arrows: any[] = []
        const positions = ['middle', 'left', 'right', 'top', 'bottom', 'auto']
        for (const dir of (['t', 'b', 'l', 'r'])) {
            if (set((item as any)[dir])) {
                let cnName = modName + 'root'
                if (set((item.cn as any)[dir])) {
                    cnName = items[(item.cn as any)[dir]].name
                    const startAnchor = positions.find(p => p.startsWith(dir)) as any
                    arrows.push(<XArrow path='smooth' color="purple"
                        start={modName + item.name}
                        startAnchor={showArrows ? startAnchor : undefined}
                        end={modName + cnName}
                        strokeWidth={1}
                    />)
                }
            }
        }
        return arrows
    }

    const id = modName + item.name
    return (
        <div className='cont' id={id} style={getStyle() as any} ref={ref} onClick={makeFocused} >
            IT {item.name}
            {item.child}
            {getArrows()}
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
    child: any = null
    comp: Comp | undefined
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
        if (index === 0) {
            this.cn[pos] = -1
        } else {
            this.cn[pos] = index;
        }
        this.comp!.constraintInfo = { ...this }
    }
    updateRect(pos: keyof IBond, index: number) {
        this[pos] = index;
        this.comp!.constraintInfo = { ...this }
    }

}

interface IContraint { children?: any, comp?: Comp, modId?: string, props?: { [key: string]: any }, update?: Function }
const Constraint = ({ children, comp, modId, props, update: randomUpdate }: IContraint) => {
    const modName = "ss"
    const [focused, setFocused] = useAtom(focusedCompAtom(modId || ''))
    const [NEW_TEXT] = useAtomValue(newTextAtom)
    const ref = useRef(null)
    const ref2 = useRef(null)
    const rect = useBoundingclientrect(ref)
    const update = useState(1)[1]
    const [updater, setUpdater] = useAtom(constraintUpdateAtom)
    const [items, setItems] = useAtom(constraintItemsAtom(modName))
    const resize = () => {
        update(a => a % 100 + 1)
    }
    const changeUpdate = () => {
        if (updater.name !== modName) {
            setUpdater({ update: update, name: modName })
        }
    }
    if (!children || !_.isArray(children)) {
        children = []
    }
    const items2 = children.map((c: { comp: Comp, child: any }) => {
        const mod = new ItemMod({ name: c.comp.id, ...(comp?.constraintInfo || {}) })
        mod.child = c.child;
        mod.comp = comp
        return mod
    }) as ItemMod[]
    useDidMount(() => {
        setItems(items)
    })
    const drop = (e: React.DragEvent) => {
        const dragData = receiveDrag(e)
        e.preventDefault()
        e.stopPropagation()
        if (dragData.action === 'widget' && comp) {
            let newChild
            if (dragData.data === 'text') {
                newChild = NEW_TEXT + Math.random().toFixed(2)
            } else {
                newChild = new Comp(dragData.data, {}, [])
            }
            comp.addChild(newChild)
            if (newChild instanceof Comp) {
                setFocused(newChild.id)
            } else {
                //  update(p => p % 100 + 1)
            }
            if (randomUpdate) randomUpdate((p: number) => p % 100 + 1)

            console.log('dropped')
        }
        console.log('dropped-1', !!comp, dragData.action)
        //Prevent content editable getting data
        return true
    }
    console.log('updating', items)
    return (
        <div ref={ref2} className='out' onClick={changeUpdate} >
            <Resizable defaultSize={{ width: 300, height: 400 }} onResize={resize} >
                <div className='stage' ref={ref} id={modName + 'root'} {...props}
                    onDrop={drop} onDragOver={e => e.preventDefault()} >
                    {items.map((m, i) => <ItemCont key={m.name} item={m} index={i}
                        items={items} update={update} par={rect} modName={modName} />)}
                    {items2.map((m, i) => <ItemCont key={m.name} item={m} index={i}
                        items={items} update={update} par={rect} modName={modName} />)}

                </div>
            </Resizable>

        </div>
    )
}

export default Constraint

