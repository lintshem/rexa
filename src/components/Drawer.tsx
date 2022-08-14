import React from 'react'
import Resizable from '../library/Resizable'
import { Comp, Module } from '../models/Module'
import "./Drawer.scoped.css"

export const Widgets = () => {
    const items = ['div', 'h1', 'button']

    const WidgetItem = ({ item }: { item: string }) => {
        return (
            <div className='wi-main' >
                {item}
            </div>
        )
    }
    return (
        <div>
            {items.map(item => <WidgetItem item={item} />)}
        </div>
    )
}
const DrawArea = ({ id }: { id: string }) => {
    return (
        <div className='da-main' >
            {editable.draw()}
        </div>
    )
}
const mod = new Module('Start')
const comp1 = new Comp('div', { style: { width: 200, height: 200, background: 'lavender' } }, ['Test div'])
mod.addComp(comp1)
const editable = mod.tree[0].getEdit()

const Attributes = () => {
    const getAttribs = () => {
        const props = editable.props.style;
        props.map()
        editable.getType('color')
    }
    const AttItem=()=>{

    }
    return (
        <div>
            attribs
        </div>
    )
}

const Drawer = () => {

    return (
        <>
            <Resizable className='main' defRatio={[1, 3,2]} style={{ height: 200 }}  >
                <Widgets />
                <DrawArea id="one" />
                <Attributes />
            </Resizable>
        </>
    )
}

export default Drawer