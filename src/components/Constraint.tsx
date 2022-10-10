import React, { useRef, useState } from 'react'
import "./Constraint.scoped.css"
import { useBoundingclientrect } from 'rooks'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { focusedConstAtom, constraintItemsAtom, constraintUpdateAtom, showArrowsAtom, focusedCompAtom, newTextAtom, attribAtom } from '../store/main'
import XArrow from 'react-xarrows'
import { receiveDrag, sendDrag } from '../util/utils'
import { Comp } from '../models/Module'

interface IItemCont { items: ItemMod[], index: number, item: ItemMod, isLive?: boolean, update: Function, par: DOMRect | null, modName: string, parRef: React.Ref<HTMLDivElement> }
const ItemCont = ({ item, items, update, par, modName, isLive = false }: IItemCont) => {
    const showArrows = useAtomValue(showArrowsAtom)
    const setFocus = useSetAtom(focusedConstAtom('ss'))
    const ref = useRef(null)
    const [focused, setFocused] = useAtom(focusedCompAtom(modName))
    const isFocused = focused === item.name
    const setItems = useSetAtom(constraintItemsAtom('ss'))
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
    const makeFocused = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFocused(item.name)
        setItems([...items])
        setFocus(item.name)
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
        if (set(cn.l) && set(item.l)) {
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
        if (isLive) return []
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
    const dragStart = (e: React.DragEvent) => {
        sendDrag(e, 'dragconst', id)
    }
    const dragging = (e: React.MouseEvent) => {
        if (e.ctrlKey) return true
    }
    // console.log(item.child)
    const id = modName + item.name
    const classes = `cont ${!isLive ? 'cont-extra' : ''} ${(isFocused && !isLive) ? 'cont-focused' : ''}`
    return (
        <div draggable className={classes} id={id}
            style={getStyle() as any} ref={ref}
            onClick={makeFocused}
            onDrag={dragging}
            onDragStart={dragStart}
        >
            {item.child}
            {getArrows()}
            {/* <Dragger cn='dragger1' />
            <Dragger cn='dragger2' /> */}
        </div>
    )
}
interface IBond { t: number, b: number, l: number, r: number, w?: number, h?: number }
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

interface IContraint { childs: any[], comp: Comp, modId: string, update?: Function, stylingProps: any[], isLive?: boolean }
const Constraint = ({ childs, comp, modId, update: randomUpdate, stylingProps, isLive = false }: IContraint) => {
    console.log(comp)
    const [,] = useAtom(attribAtom)
    const modName = "ss"
    const [NEW_TEXT] = useAtomValue(newTextAtom)
    const ref = useRef(null)
    const ref2 = useRef(null)
    const rect = useBoundingclientrect(ref)
    const update = useState(1)[1]
    const [updater, setUpdater] = useAtom(constraintUpdateAtom)
    // reload on compact change of saved items
    // eslint-disable-next-line
    const [savedItems, setSavedItems] = useAtom(constraintItemsAtom(modName))
    const [focused, setFocused] = useAtom(focusedCompAtom(modId))
    const isFocused = focused === comp.id
    // const props = comp.props

    const changeUpdate = (forceIt: boolean = false) => {
        if (updater.name !== modName || forceIt) {
            setUpdater({
                update: (r: number) => {
                    console.log('updater', modName, r)
                    //  if (randomUpdate) randomUpdate((p: number) => p % 100 + 1)
                    update(r)
                    changeUpdate(true)
                },
                name: modName
            })
        }
        setItems(getItems())
    }
    const getItems = () => {
        let items: ItemMod[] = []
        if (childs && comp) {
            items = childs.map((c: any, i: number) => {
                const child = comp.children[i]
                const tempId = 'text' + Math.random().toFixed(5)
                const newChild = new Comp('p', {}, [child]); newChild.setId(tempId);
                const curComp = (child instanceof Comp) ? child : newChild
                const constr = curComp.constraintInfo
                const mod = new ItemMod({
                    ...constr,
                    name: curComp.id,
                })
                mod.child = c;
                mod.comp = curComp
                return mod
            })
        }
        return items
    }
    const [items, setItems] = useState(getItems)
    const drop = (e: React.DragEvent) => {
        const dragData = receiveDrag(e)
        e.preventDefault()
        e.stopPropagation()
        // add child to the const container
        if (dragData.action === 'widget' && comp) {
            let newChild
            if (dragData.data === 'text') {
                newChild = NEW_TEXT + Math.random().toFixed(2)
            } else {
                newChild = new Comp(dragData.data, {}, [])
            }
            comp.addChild(newChild)
            if (newChild instanceof Comp) {
                const x = e.clientX - ((rect && rect?.left) || e.clientX);
                const y = e.clientY - ((rect && rect?.top) || e.clientY);
                newChild.constraintInfo.l = Math.round(x);
                newChild.constraintInfo.t = Math.round(y);
                setFocused(newChild.id)
            }
            if (randomUpdate) randomUpdate((p: number) => p % 100 + 1)
            const newItems = [...items] // getItems()
            setItems(newItems)
            setSavedItems(newItems)
        }
        // Reposition const item on drag
        if (dragData.action === 'dragconst' && ref.current && comp) {
            const cRef = document.getElementById(dragData.data)!
            const cRec = cRef.getBoundingClientRect()
            const pRec = (ref.current as HTMLElement).getBoundingClientRect()
            const item = items.find(t => modId + t.name === dragData.data)
            if (!item) {
                console.warn('item error', items, item, dragData.data)
                return
            }
            let pt = pRec.top, pb = pRec.bottom, pl = pRec.left, pr = pRec.right;
            const set = (a: number) => a !== -1
            const top = Math.round(e.clientY - pt)
            const left = Math.round(e.clientX - pl)
            const bottom = Math.round(pb - (e.clientY + cRec.height))
            const right = Math.round(pr - (e.clientX + cRec.width))
            if (set(item.t)) item.updateRect('t', top)
            if (set(item.b)) item.updateRect('b', bottom)
            if (set(item.r)) item.updateRect('r', right)
            if (set(item.l)) item.updateRect('l', left)
            //     console.log('const dragged', dragData, e, child, item)
        }
        update(p => p % 100 + 1)
        //Prevent content editable getting data
        return true
    }
    const setActiveConst = (e: React.MouseEvent) => {
        e.stopPropagation()
        setFocused(comp?.id)
    }
    const classes = `stage stage-extra ${isFocused ? 'stage-active' : ''}`
    const [styleProps, baseProps] = stylingProps || []
    if (isLive) {
        return (<div className='stage' {...baseProps} style={styleProps} >
            {items.map((m, i) => <ItemCont key={m.name} item={m} index={i} parRef={ref.current}
                items={items} update={update} par={rect} modName={modId || ''} isLive={isLive} />)}
        </div>)
    }
    return (
        <div ref={ref2} className='out' onClick={() => changeUpdate()} style={{ width: styleProps?.width || '', height: styleProps?.height || '' }}  >
            <div className={classes} ref={ref} id={modName + 'root'} {...baseProps} style={styleProps}
                onClick={setActiveConst}
                onDrop={drop} onDragOver={e => e.preventDefault()} >
                {items.map((m, i) => <ItemCont key={m.name} item={m} index={i} parRef={ref.current}
                    items={items} update={update} par={rect} modName={modId || ''} />)}
            </div>
        </div>
    )
}

export default Constraint

// 
