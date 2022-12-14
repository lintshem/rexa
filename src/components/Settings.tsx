import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { MdDelete, MdDownload, MdEdit, MdSettings } from 'react-icons/md'
import { toast } from 'react-toastify'
import Overlay from '../library/Overlay'
import TabContainer from '../library/TabContainer'
import { AppClass } from '../models/AppClass'
import { appAtom, IPace, IWsAllViews, lastOpenAtom, themeAtom, waSpacesAtom, wsAllViewsAtom } from '../store/main'
import "./Settings.scoped.css"
import localforage from 'localforage'
import moment from "moment"
import { downloadData, sendStat } from '../util/utils'


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
            <div className='set-l-body'>
                {lays.map((l, i) => <LayRow key={i} data={l} index={i} />)}
            </div>
        </div>
    )

}
interface IApp { name: string, time: number, app: AppClass, spaces: IPace[], wsViews: IWsAllViews }
const Apps = () => {
    const [lays, setApp] = useState<IApp[]>([])
    const [name, setName] = useState('')
    const [curApp, setCurApp] = useAtom(appAtom)
    const [appSpaces, setAppSpaces] = useAtom(waSpacesAtom)
    const [wsAllViews, setWsAllViews] = useAtom(wsAllViewsAtom)

    const setLastOpen = useSetAtom(lastOpenAtom)
    useEffect(() => {
        (async () => {
            setApp(await getApp())
        })()
    }, [])
    const reOpenApp = (data: IApp) => {
        const newApp = AppClass.copy(data.app)
        setAppSpaces(data.spaces)
        setCurApp(newApp)
        setLastOpen(data.name)
        setWsAllViews(setViews(data.wsViews))
    }
    const AppRow = ({ data, index }: { data: IApp, index: number }) => {
        const openApp = () => {
            reOpenApp(data)
            console.log('done')
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
        const downloadApp = async () => {
            downloadData(JSON.stringify(data), `rexa-${data.name}`)
        }
        const info = moment(data.time).fromNow()
        return (
            <div className='set-lay' >
                <div className='set-info'>{data.name}<span className='set-time-dif'>{info}</span></div>
                <div className='set-buts'>
                    <button className='rexa-button set-but' onClick={downloadApp} ><MdDownload /></button>
                    <button className='rexa-button set-but' onClick={openApp} ><MdEdit /></button>
                    <button className='rexa-button set-but' onClick={delApp} ><MdDelete /></button>
                </div>
            </div>
        )
    }
    const setViews = (allViews: IWsAllViews) => {
        const views = {} as any
        for (const [key, value] of Object.entries(allViews)) {
            views[key] = value.map(v => ({ ...v, comp: null }))
        }
        return views
    }
    const saveApp = async () => {
        if (name.length < 3) {
            toast("🚫Name too short.")
            return
        }
        // constraint layout 
        const removeCyclic = (app: AppClass) => {
            const newApp = { ...app }
            newApp.modules.forEach(m => {
                m.flatTree().forEach(c => {
                    if (c?.constraintInfo?.child && c?.constraintInfo?.comp) {
                        c.constraintInfo.child = 'cyclic removed'
                        c.constraintInfo.comp = 'cyclic removed' as any
                    }
                })
            })
            return JSON.parse(JSON.stringify(newApp))
        }
        const newApp = { name, time: Date.now(), app: removeCyclic(curApp), spaces: appSpaces, wsViews: wsAllViews } as IApp
        try {
            const allApp = [newApp]
            if ((await localforage.keys()).includes('apps')) {
                const otherApp = await localforage.getItem('apps') as IApp[]
                allApp.splice(1, 0, ...otherApp)
            }
            let failed = false
            try {
                await localforage.setItem('apps', JSON.parse(JSON.stringify(allApp)))
            } catch (e) {
                // await localforage.setItem('apps', JSON.parse(stringifyCyclic(allApp)))
                failed = true
                throw new Error("Saving app failed: " + (e as Error).message)
            }
            if (!failed) {
                setApp(allApp)
                setName('')
            }
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
    const uploadApp = async (e: React.ChangeEvent) => {
        const target = (e.target as HTMLInputElement)
        if (target.files) {
            try {
                const file = target.files[0]
                const data = JSON.parse(await file.text()) as IApp
                reOpenApp(data)
            } catch (e) {
                toast("😡 Reading file failed")
            }
        }
    }
    return (
        <div className='set-l-main'>
            <h3 className='set-l-header'>APPS</h3>
            <div className='set-add'>
                <input className='rexa-input' value={name} onChange={(e) => setName(e.target.value)} placeholder="New app name" />
                <button className='rexa-button' onClick={saveApp} >Save </button>
            </div>
            <div className='set-l-body' >
                {lays.map((l, i) => <AppRow key={i} data={l} index={i} />)}
            </div>
            <div>
                <input type="file" onChange={uploadApp} />
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