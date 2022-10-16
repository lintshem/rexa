import React, { useEffect } from 'react'
import Splitter from '../library/Resizable'
import './WorkArea.scoped.css'
import WorkSpace from './WorkSpace'
import { MdClose, MdAdd, MdToggleOn, MdCloseFullscreen } from 'react-icons/md'
import { receiveMessage } from '../util/utils'
import { toast } from 'react-toastify'
import { activeWSAtom, waSpacesAtom, wsRootOrint } from '../store/main'
import { useAtom, useAtomValue } from 'jotai'
import { uniqueId } from 'lodash'
import { EmptyArea } from '../util/SmallComps'


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
                return <WorkArea key={p.id} id={p.id} />
            } else {
                if (existingWS[p.id]) {
                    return existingWS[p.id]
                } else {
                    const ws = <WorkSpace key={p.id} id={p.id} />
                    existingWS[p.id] = ws
                    return ws;
                }
            }
        })
        const orient = paces.find(p => p.id === id)?.orient || (id === 'root' ? rootOrient : 'h')
        const isEmpty = works.length === 0
        return [<div className='wa-box' style={{ flexDirection: orient === 'h' ? 'row' : 'column' }} >
            <WAConfig orient={orient} />
            {!isEmpty && <Splitter align={orient === 'h' ? 'hor' : 'ver'}  >
                {works.map((w, i) => <div key={i}>{w}</div>)}
            </Splitter>}
            {isEmpty && <EmptyArea message='No Workspaces Here yet' />}
        </div>, isEmpty, works.length]
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
    const WAConfig = ({ orient }: { orient: 'h' | 'v' }) => {
        const getIndex = () => {
            let child = paces.filter(p => p.parent === id)
            const foundIndex = child.findIndex(p => p.id === focusedWs)
            return foundIndex
        }
        const addWS = () => {
            let index = getIndex()
            if (isEmpty) index = 0;
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
                for (const pace of newPaces) {
                    if (pace.parent === id) {
                        pace.parent = newPaces[index].parent
                    }
                }
                newPaces.splice(index, 1)
                setPaces(newPaces)
            } else {
                toast('🚫 Select WS to use')
            }
        }
        const collapse = () => {
            if (length !== 1) {
                toast('😡 Has more than one children')
                return
            }
            // const parent = ''
            const paneIndex = paces.findIndex(p => p.id === id)!
            const newPanes = [...paces]
            paces.forEach((p, i) => {
                if (p.id === paces[paneIndex].parent) {
                    newPanes[i].id = id
                }
            })
            newPanes.splice(paneIndex, 1)
            console.log(newPanes, paces)
            // setPaces(newPanes)
        }
        return (<div className='wa-config' style={{ flexDirection: orient === 'h' ? 'column' : 'row' }} >
            <MdClose onClick={() => removeWS()} />
            <MdAdd onClick={() => addWS()} />
            <MdCloseFullscreen onClick={() => collapse()} color={length === 1 ? 'grey' : ''} />
            <MdToggleOn onClick={toggleAlign} />
        </div>)
    }
    const [paneData, isEmpty, length] = getWorkAreas()
    // return (
    //     <Box modId='rexa' id='w' direction='column'  >
    //         <div>One</div>
    //         <div>Two</div>
    //     </Box>
    // )
    return (
        <div className='wa-main' >
            {paneData}
        </div>
    )
}

export default WorkArea