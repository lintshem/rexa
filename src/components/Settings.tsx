import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { MdSettings } from 'react-icons/md'
import { toast } from 'react-toastify'
import Overlay from '../library/Overlay'
import TabContainer from '../library/TabContainer'
import { AppClass } from '../models/AppClass'
import { appAtom, IPace, lastOpenAtom, themeAtom, waSpacesAtom } from '../store/main'
import "./Settings.scoped.css"
import localforage from 'localforage'
import moment from "moment"

const stringifyCyclic = (obj: any) => {
    let cache = [] as any[]
    const res = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.includes(value)) return;
            cache.push(value);
        }
        return value;
    })
    cache = null as any
    return res
}
export interface ILayout { name: string, time: number, data: { id: string, parent: string, orient: 'h' | 'v' }[] }
const Layouts = () => {
    const [lays, setLay] = useState<ILayout[]>([])
    const [name, setName] = useState('')
    const [spaces, setSpaces] = useAtom(waSpacesAtom)
    useEffect(() => {
        (async () => {
            setLay(await getLay())
        })()
    }, [])
    const LayRow = ({ data, index }: { data: ILayout, index: number }) => {
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
        const info = moment(data.time).fromNow()
        return (
            <div className='set-lay' >
                <div className='set-info'>{data.name}<span className='set-time-dif'>{info}</span></div>
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
        const newLay = { name, time: Date.now(), data: [...spaces] } as ILayout
        try {
            const allLay = [newLay]
            if ((await localforage.keys()).includes('layouts')) {
                const otherLay = await localforage.getItem('layouts') as ILayout[]
                allLay.splice(1, 0, ...otherLay)
            }
            console.log('all lays', allLay)
            await localforage.setItem('layouts', allLay)
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
            <div className='set-add'>
                <input className='rexa-input' value={name} onChange={(e) => setName(e.target.value)} placeholder="New layout name" />
                <button className='rexa-button' onClick={saveLay} >Save </button>
            </div>
            <div>
                {lays.map((l, i) => <LayRow key={i} data={l} index={i} />)}
            </div>
        </div>
    )

}
interface IApp { name: string, time: number, app: AppClass, spaces: IPace[] }
const Apps = () => {
    const [lays, setApp] = useState<IApp[]>([])
    const [name, setName] = useState('')
    const [curApp, setCurApp] = useAtom(appAtom)
    const [appSpaces, setAppSpaces] = useAtom(waSpacesAtom)
    const setLastOpen = useSetAtom(lastOpenAtom)
    // const [apps, setApps] = useAtom(waSpacesAtom)
    useEffect(() => {
        (async () => {
            setApp(await getApp())
        })()
    }, [])
    const AppRow = ({ data, index }: { data: IApp, index: number }) => {
        const openApp = () => {
            const newApp = AppClass.copy(data.app)
            setAppSpaces(data.spaces)
            setCurApp(newApp)
            setLastOpen(data.name)
        }
        const delApp = async () => {
            const newLays = [...lays]
            newLays.splice(index, 1)
            try {
                await localforage.setItem('apps', newLays)
                setApp(newLays)
            } catch (e) {
                toast("💀 Deleting failed.")
            }
        }
        const info = moment(data.time).fromNow()
        return (
            <div className='set-lay' >
                <div className='set-info'>{data.name}<span className='set-time-dif'>{info}</span></div>
                <div className='set-buts'>
                    <button className='rexa-button set-but' onClick={openApp} >open</button>
                    <button className='rexa-button set-but' onClick={delApp} >del</button>
                </div>
            </div>
        )
    }
    const saveApp = async () => {
        if (name.length < 3) {
            toast("🚫Name too short.")
            return
        }
        const newApp = { name, time: Date.now(), app: curApp, spaces: appSpaces } as IApp
        try {
            const allApp = [newApp]
            if ((await localforage.keys()).includes('apps')) {
                const otherApp = await localforage.getItem('apps') as IApp[]
                allApp.splice(1, 0, ...otherApp)
            }
            console.log('allapp', allApp)
            const cache = [] as any[]
            await localforage.setItem('apps', JSON.parse(stringifyCyclic(allApp)))
            cache.length = 0
            setApp(allApp)
            setName('')
        } catch (e) {
            toast("💀 Failed to store apps.")
            console.log(e)
        }
    }
    const getApp = async () => {
        const allLay = [] as IApp[]
        try {
            if ((await localforage.keys()).includes('apps')) {
                const lays = await localforage.getItem('apps') as IApp[]
                allLay.splice(0, 1, ...lays)
            }
        } catch (e) {
            console.warn("getting apps failed.")
        }
        return allLay
    }
    return (
        <div className='set-l-main'>
            <h3 className='set-l-header'>APPS</h3>
            <div className='set-add'>
                <input className='rexa-input' value={name} onChange={(e) => setName(e.target.value)} placeholder="New app name" />
                <button className='rexa-button' onClick={saveApp} >Save </button>
            </div>
            <div>
                {lays.map((l, i) => <AppRow key={i} data={l} index={i} />)}
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
                    <div>One</div>
                    <div>two</div>
                </TabContainer>
            </div>
            <Layouts />
            <Apps />
        </Overlay>
    )
}

export default Settings