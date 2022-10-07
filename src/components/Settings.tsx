import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { MdSettings } from 'react-icons/md'
import { toast } from 'react-toastify'
import Button from '../library/Button'
import Overlay from '../library/Overlay'
import TabContainer from '../library/TabContainer'
import { AppClass } from '../models/AppClass'
import { Module } from '../models/Module'
import { appAtom, /*rootSpacesAtom,*/ savedAppAtom, themeAtom, waSpacesAtom } from '../store/main'
import { addShortcut, receiveMessage, sendMessage } from '../util/utils'
import "./Settings.scoped.css"
import localforage from 'localforage'

const AddShortCuts = () => {
    const saver = () => { console.log('save'); sendMessage('save', {}) }
    const opener = () => sendMessage('open', {})
    addShortcut('s', saver, true)
    addShortcut('o', opener, true)
}
AddShortCuts()
//receiveMessage('save',console.log)
const AppSet = () => {
    const [app, setApp] = useAtom(appAtom)
    const [update, saveUpdate] = useAtom(savedAppAtom)
    const saveApp = () => {
        const newApp = { ...app } as any
        const appStr = JSON.stringify(newApp)
        console.log(JSON.parse(JSON.stringify(app)))
        saveUpdate(appStr)
        toast(`${app.name} saved`)
    }
    const openApp = () => {
        try {
            const newAppData = JSON.parse(update)
            const newApp = AppClass.copy(newAppData as AppClass)
            const modules = newApp.modules.map(m => Module.copy(m))
            newApp.modules = modules
            console.log(newApp)
            setApp(newApp)
            toast(`${newApp.name} opened!`)
            sendMessage("settings", { app: newApp })
        } catch (e) {
            toast('Could not open')
        }
    }
    useEffect(() => {
        const clean1 = receiveMessage('save', saveApp)
        const clean2 = receiveMessage('open', openApp)
        return () => {
            clean1()
            clean2()
        }
        //eslint-disable-next-line
    }, [])
    return (
        <div >
            <Button onClick={saveApp} >Save</Button>
            <Button onClick={openApp} >Open</Button>
        </div>
    )
}
const ExportSet = () => {

    return (
        <div>Exports </div>
    )
}
interface ILayout { name: string, data: { id: string, parent: string, orient: 'h' | 'v' }[] }
const l1 = {
    name: 'Ontes',
    data: [
        {
            "id": "seda",
            "parent": "root",
            "orient": "h"
        },
        {
            "id": "messa",
            "parent": "root",
            "orient": "v"
        },
    ]
} as ILayout
const l2 = {
    name: 'Twos',
    data: [
        {
            "id": "seda",
            "parent": "root",
            "orient": "h"
        },
        {
            "id": "messa",
            "parent": "root",
            "orient": "v"
        },
        {
            "id": "desa",
            "parent": "messa",
            "orient": "h"
        },
        {
            "id": "grey",
            "parent": "messa",
            "orient": "h"
        },],
} as ILayout
const Layouts = () => {
    const [lays, setLay] = useState<ILayout[]>([l1, l2])
    const [name, setName] = useState('')
    const [spaces, setSpaces] = useAtom(waSpacesAtom)
    useEffect(() => {
        (async () => {
            setLay(await getLay())
        })()
    }, [])
    const LayRow = ({ data, index }: { data: any, index: number }) => {
        const openLay = () => {
            setSpaces(data.data)
        }
        const delLay = async () => {
            const newLays = [...lays]
            newLays.splice(index, 1)
            try {
                await localforage.setItem('layouts', newLays)
                setLay(newLays)
            } catch (e) {
                toast("💀 Deleting failed.")
            }
        }
        return (
            <div className='set-lay' >
                <div>{data.name}</div>
                <div className='set-buts'>
                    <button className='rexa-button set-but' onClick={openLay} >open</button>
                    <button className='rexa-button set-but' onClick={delLay} >del</button>
                </div>
            </div>
        )
    }
    const saveLay = async () => {
        if (name.length < 3) {
            toast("🚫Name too short.")
            return
        }
        const newLay = { name, data: [...spaces] } as ILayout
        try {
            const allLay = [newLay]
            if ((await localforage.keys()).includes('layouts')) {
                const otherLay = await localforage.getItem('layouts') as ILayout[]
                allLay.splice(1, 0, ...otherLay)
            }
            console.log('all lays', allLay)
            localforage.setItem('layouts', allLay)
            setLay(allLay)
            setName('')
        } catch (e) {
            toast("💀 Failed to store Layouts.")
        }
    }
    const getLay = async () => {
        const allLay = [] as ILayout[]
        try {
            if ((await localforage.keys()).includes('layouts')) {
                const lays = await localforage.getItem('layouts') as ILayout[]
                allLay.splice(0, 1, ...lays)
            }
        } catch (e) {
            console.warn("getting layouts failed.")
        }
        return allLay
    }
    return (
        <div className='set-l-main'>
            <h3 className='set-l-header'>LAYOUTS</h3>
            <div>
                {lays.map((l, i) => <LayRow data={l} index={i} />)}
            </div>
            <div className='set-add'>
                <input className='rexa-input' value={name} onChange={(e) => setName(e.target.value)} placeholder="Layout name" />
                <button className='rexa-button' onClick={saveLay} >Save </button>
            </div>
        </div>
    )

}

const Settings = () => {
    const [open, setOpen] = useState(false)
    const theme = useAtomValue(themeAtom)
    const updateTheme = () => {
        const rootElement = document.documentElement;
        rootElement.dataset.theme = theme;
    }

    updateTheme()
    if (!open) { }
    return (
        <Overlay open={open} setOpen={setOpen} top={4} left={4}
            base={<MdSettings onClick={() => setOpen(!open)} />} >
            <div className='set-main' >
                <div className='title'> Settings</div>
                <TabContainer id='settings' titles={['app', 'Export']} >
                    <AppSet />
                    <ExportSet />
                </TabContainer>
            </div>
            <Layouts />
        </Overlay>
    )
}

export default Settings