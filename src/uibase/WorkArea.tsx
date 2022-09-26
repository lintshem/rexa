import React, { useEffect, useState } from 'react'
import Splitter from '../library/Resizable'
import './WorkArea.scoped.css'
import WorkSpace from './WorkSpace'
import { MdClose, MdAdd, MdCode, MdToggleOn } from 'react-icons/md'
import { receiveMessage } from '../util/utils'
// import { rootSpacesAtom } from '../store/main'
import { toast } from 'react-toastify'
import { waSpacesAtom, wsRootOrint } from '../store/main'
import { useAtom } from 'jotai'

let WSID = 0
interface IWorkArea { id: string, isRoot?: boolean }
const existingWS: { [id: string]: JSX.Element } = {}
const WorkArea = ({ isRoot = false, id = 'root' }: IWorkArea) => {
    const [paces, setPaces] = useAtom(waSpacesAtom)
    const [rootOrient, setRootOrint] = useAtom(wsRootOrint)
    useEffect(() => {
        if (isRoot) {
            const cleanup = receiveMessage("settings", (data) => {
                console.log('restore area', data)
            })
            return cleanup
        }
    }, [isRoot])
    const getWorkAreas = () => {
        const waPanes = []
        for (const pane of paces) {
            if (pane.parent === id) {
                waPanes.push(pane)
            }
        }
        let waSpace: JSX.Element | JSX.Element[] | null = null;
        if (waPanes.length === 0) {
            if (existingWS[id]) {
                waSpace = existingWS[id]
            } else {
                const space = <WorkSpace id={id} />
                existingWS[id] = space
                waSpace = space
            }
        } else if (waPanes.length === 1) {
            waSpace = <WorkSpace id={waPanes[0].id} />
        } else if (waPanes.length > 1) {
            const inner = waPanes.map(p => {
                return <WorkArea id={p.id} key={p.id} />
            })
            const paneOrient = paces.find(p => p.id === id)?.orient || 'h'
            const orient = id === 'root' ? rootOrient : paneOrient
            waSpace = (
                <div className='wa-box' style={{ flexDirection: orient === 'h' ? 'row' : 'column' }} >
                    <WAConfig />
                    <Splitter align={orient === 'h' ? 'hor' : 'ver'} >
                        {inner}
                    </Splitter>
                </div>)
        }
        return waSpace
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
            console.log(pace, id, newPaces)
            setPaces(newPaces)
        }
    }
    const WAConfig = () => {
        return (<div className='wa-config' >
            <MdClose onClick={() => { }} />
            <MdAdd onClick={() => { }} />
            <MdCode onClick={() => { }} />
            <MdToggleOn onClick={toggleAlign} />
        </div>
        )
    }
    const paneData = getWorkAreas()
    return (
        <div className='wa-main' >
            {paneData}
        </div>
    )
}

export default WorkArea