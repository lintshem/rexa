import React, { useEffect } from 'react'
import Splitter from '../library/Resizable'
import './WorkArea.scoped.css'
import WorkSpace from './WorkSpace'
import { MdClose, MdAdd, MdToggleOn } from 'react-icons/md'
import { receiveMessage } from '../util/utils'
import { toast } from 'react-toastify'
import { activeWSAtom, waSpacesAtom, wsRootOrint } from '../store/main'
import { useAtom, useAtomValue } from 'jotai'
import { uniqueId } from 'lodash'

interface IWorkArea { id: string, isRoot?: boolean }
const existingWS: { [id: string]: JSX.Element } = {}
const WorkArea = ({ isRoot = false, id = 'root' }: IWorkArea) => {
    const [paces, setPaces] = useAtom(waSpacesAtom)
    const [rootOrient, setRootOrint] = useAtom(wsRootOrint)
    const focusedWs = useAtomValue(activeWSAtom)
    useEffect(() => {
        if (isRoot) {
            const cleanup = receiveMessage("settings", (data) => {
                console.log('restore area', data)
            })
            return cleanup
        }
    }, [isRoot])
    const getWorkAreas = () => {
        const getPanes = (pane_id: string) => paces.filter(p => p.parent === pane_id)
        const waPanes = getPanes(id)
        const works = waPanes.map(p => {
            const isWA = getPanes(p.id).length > 0
            if (isWA) {
                return <WorkArea id={p.id} />
            } else {
                if (existingWS[p.id]) {
                    return existingWS[p.id]
                } else {
                    const ws = <WorkSpace id={p.id} />
                    existingWS[p.id] = ws
                    return ws;
                }
            }
        })
        const orient = paces.find(p => p.id === id)?.orient || (id === 'root' ? rootOrient : 'h')
        return <div className='wa-box' style={{ flexDirection: orient === 'h' ? 'row' : 'column' }} >
            <WAConfig />
            <Splitter align={orient === 'h' ? 'hor' : 'ver'} >
                {works}
            </Splitter>
        </div>
    }
    const toggleAlign = () => {
        if (id === 'root') {
            setRootOrint(rootOrient === 'h' ? 'v' : 'h')
        } else {
            const newPaces = [...paces]
            const pace = newPaces.find(p => p.id === id)!
            if (pace.orient === 'h') pace.orient = 'v'
            else pace.orient = 'h'
            setPaces(newPaces)
            setPaces(newPaces)
        }
    }
    const WAConfig = () => {
        const getIndex = () => {
            let child = paces.filter(p => p.parent == id)
            const foundIndex = child.findIndex(p => p.id === focusedWs)
            return foundIndex
        }
        const addWS = () => {
            const index = getIndex()
            if (index !== -1) {
                const newPaces = [...paces]
                const newPace = { id: uniqueId('ws-'), parent: id, orient: 'h' as 'h' | 'v' }
                newPaces.splice(index, 0, newPace)
                setPaces(newPaces)
            } else {
                toast('🚫 Select WS to use')
            }
        }
        const removeWS = () => {
            const index = paces.findIndex(p => p.id === id)
            if (index !== -1) {
                const newPaces = [...paces]
                newPaces.splice(index, 1)
                setPaces(newPaces)
            } else {
                toast('🚫 Select WS to use')
            }
        }
        return (<div className='wa-config' >
            <MdClose onClick={() => removeWS()} />
            <MdAdd onClick={() => addWS()} />
            <MdToggleOn onClick={toggleAlign} />
        </div>)
    }
    const paneData = getWorkAreas()
    return (
        <div className='wa-main' >
            {paneData}
        </div>
    )
}

export default WorkArea