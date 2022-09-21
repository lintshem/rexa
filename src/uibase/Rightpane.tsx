import React from 'react'
import { useAtom } from 'jotai'
import { basicCompsAtom } from '../store/main'
import { sendDrag } from '../util/utils'
import "./Rightpane.scoped.css"
import Compact from '../components/Compact'
import Splitter from '../library/Resizable'


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
        <Splitter defRatio={[1, 1]} align='ver' >
            <Widgets />
            <Compact />
        </Splitter>
    )
}

export default Rightpane