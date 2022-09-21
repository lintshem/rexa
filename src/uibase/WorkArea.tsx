import React, { useEffect, useState } from 'react'
import Resizable from '../library/Resizable'
import './WorkArea.scoped.css'
import WorkSpace from './WorkSpace'
import { MdClose, MdAdd, MdCode, MdToggleOn } from 'react-icons/md'
import { receiveMessage } from '../util/utils'
import { useAtom } from 'jotai'
import { rootSpacesAtom } from '../store/main'

let WSID = 0
interface IWorkArea {
    no?: number, removeArea?: Function,
    defWs?: { comp: JSX.Element, type: string }[], isRoot?: boolean
}
const WorkArea = ({ removeArea, defWs = [], isRoot = false }: IWorkArea) => {
    const [hor, setHor] = useState(true)
    const [rootSpaces, setRootSpaces] = useAtom(rootSpacesAtom)
    const [_spaces, _setSpaces] = useState(defWs)
    const setSpaces = (newSpaces: any[]) => {
        if (isRoot) {
            setRootSpaces(newSpaces)
        } else {
            _setSpaces(newSpaces)
        }
    }
    const spaces = isRoot ? rootSpaces : _spaces
    useEffect(() => {
        if (isRoot) {
            const cleanup = receiveMessage("settings", (data) => {
                console.log('restore area', data)
            })
            return cleanup
        }
    }, [isRoot])
    const removeAt = (index: number) => {
        const newSpaces = [...spaces]
        newSpaces.splice(index, 1)
        setSpaces(newSpaces)
    }
    const addAreaAt = (index: number) => {
        const ws = spaces[index]
        const newArea = { comp: <WorkArea defWs={[ws]} />, type: 'workarea' }
        const newSpaces = [...spaces]
        newSpaces.splice(index, 1)
        newSpaces.splice(index, 0, newArea)
        setSpaces(newSpaces)
    }
    const addWsAt = (index: number) => {
        const newWs = { comp: <WorkSpace id={WSID++} />, type: 'workspace' }
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
    console.log(spaces)
    return (
        <div className='main' style={{ flexDirection: hor ? 'row' : 'column' }} >
            <Resizable key={spaces.length} style={{ flex: 1 }} align={hor ? 'hor' : 'ver'} resizeDelta={50} >
                {spaces.map((s, i) => <SpaceWrap key={s.comp.props} index={i} >{s.comp}</SpaceWrap>)}
            </Resizable>
        </div>
    )
}

export default WorkArea