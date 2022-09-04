import React, { useState } from 'react'
import Resizable from '../library/Resizable'
import './WorkArea.scoped.css'
import WorkSpace from './WorkSpace'
import { MdClose, MdAdd, MdCode, MdToggleOn } from 'react-icons/md'

let WSID = 0
interface IWorkArea { no?: number, removeArea?: Function, defWs?: any[] }
const WorkArea = ({ removeArea, defWs = [] }: IWorkArea) => {
    const [hor, setHor] = useState(true)
    const [spaces, setSpaces] = useState(defWs)
    const removeAt = (index: number) => {
        const newSpaces = [...spaces]
        newSpaces.splice(index, 1)
        setSpaces(newSpaces)
    }
    const addAreaAt = (index: number) => {
        const ws = spaces[index]
        const newArea = <WorkArea defWs={[ws]} />
        const newSpaces = [...spaces]
        newSpaces.splice(index, 1)
        newSpaces.splice(index, 0, newArea)
        setSpaces(newSpaces)
    }
    const addWsAt = (index: number) => {
        const newWs = <WorkSpace id={WSID++} />
        const newSpaces = [...spaces]
        newSpaces.splice(index + 1, 0, newWs)
        setSpaces(newSpaces)
    }

    interface ISpaceWrap { children: any, index: number }
    const SpaceWrap = ({ children, index }: ISpaceWrap) => {
        return <div className='ws-wrap' >
            {children}
            <div className='wrap-close' >
                <MdClose onClick={() => removeAt(index)} />
                <MdAdd onClick={() => addAreaAt(index)} />
                <MdCode onClick={() => addWsAt(index)} />
                <MdToggleOn onClick={toggleAlign} />
             </div>
        </div>
    }
    const toggleAlign = () => setHor(h => !h)
    return (
        <div className='main' style={{ flexDirection: hor ? 'row' : 'column' }} >
            <Resizable  key={spaces.length} style={{ flex: 1 }} align={hor ? 'hor' : 'ver'} resizeDelta={50} >
                {spaces.map((s, i) => <SpaceWrap key={s} index={i} >{s}</SpaceWrap>)}
            </Resizable>
        </div>
    )
}

export default WorkArea