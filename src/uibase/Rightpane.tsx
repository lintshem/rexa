import React from 'react'
import { useAtom } from 'jotai'
import { basicCompsAtom } from '../store/main'
import { sendDrag } from '../util/utils'
import "./Rightpane.scoped.css"


export const Widgets = () => {
    const [items] = useAtom(basicCompsAtom)
    const WidgetItem = ({ item }: { item: string }) => {
        const dragStart = (e: React.DragEvent) => {
            sendDrag(e, 'widget', item)
            e.stopPropagation()
        }
        return (
            <div className='wi-main' draggable onDragStart={dragStart} >
                {item}
            </div>
        )
    }
    return (
        <div className='wid-main' >
            {items.map(item => <WidgetItem key={item} item={item} />)}
        </div>
    )
}

const Rightpane = () => {
    return (
        <div>
            Rightpane
            <Widgets />
        </div>
    )
}

export default Rightpane