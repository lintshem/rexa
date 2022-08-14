import React from 'react'
import Resizable from '../library/Resizable'
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
const DrawArea = () => {

    return (
        <div className='da-main' >
            area
        </div>
    )
}


const Drawer = () => {
    return (
        <>
            <Resizable className='main' defRatio={[1, 1]} >
                <h1>'header 1'</h1>
                <h1>'header 2'</h1>
            </Resizable>
            <Resizable className='main' defRatio={[1, 5]} >
                <Widgets />
                <DrawArea />
            </Resizable>
        </>
    )
}

export default Drawer