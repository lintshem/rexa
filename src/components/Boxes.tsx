import { useAtom } from 'jotai'
import React from 'react'
import { Comp } from '../models/Module'
import { focusedCompAtom } from '../store/main'
import "./Boxes.scoped.css"

type TNS = string | number
interface IBox {
    id: string, modId: string, children: JSX.Element[], direction: 'row' | 'column', isLive?: boolean,
    padding?: TNS, margin?: TNS, child_pad?: TNS, child_mar?: TNS, data?: Comp[]
}

export const Box = ({ id, modId, isLive, children, direction, padding, margin, child_pad, child_mar }: IBox) => {
    const [focused, setFocused] = useAtom(focusedCompAtom(modId))
    const isFocused = focused === id
    children = children.map((c, i) => {
        const nc = { ...c, props: { ...c.props } }
        nc.props['background'] = 'blue'
        nc.props['color'] = 'red'
        console.log(nc)
        return (
            <div >
                {nc}
            </div>
        )
    })


    const makeFocus = () => {
        setFocused(id)
    }
    const classes = `box-main ${isFocused ? 'box-focus' : ''}`
    return (
        <div className={isLive ? '' : classes} id={id}
            style={{ display: 'flex', flexDirection: direction, margin, padding }}
            onClick={makeFocus}  >
            {children}
        </div>
    )
}

const Boxes = () => {
    return (
        <div>Boxes</div>
    )
}

export default Boxes