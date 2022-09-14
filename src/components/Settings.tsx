import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { MdSettings } from 'react-icons/md'
import { toast } from 'react-toastify'
import Button from '../library/Button'
import Overlay from '../library/Overlay'
import TabContainer from '../library/TabContainer'
import { AppClass } from '../models/AppClass'
import { Module } from '../models/Module'
import { appAtom, savedAppAtom } from '../store/main'
import { addShortcut, receiveMessage, sendMessage } from '../util/utils'
import "./Settings.scoped.css"

const AddShortCuts = () => {
    const saver = () => {console.log('save');sendMessage('save', {})}
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
        const appStr = JSON.stringify(app)
        console.log(JSON.parse(JSON.stringify(app)))
        saveUpdate(appStr)
        toast(`${app.name} saved`)
    }
    const openApp = () => {
        try {
            const newApp = AppClass.copy(JSON.parse(update) as AppClass)
            const modules = newApp.modules.map(m => Module.copy(m))
            newApp.modules = modules
            console.log(newApp)
            setApp(newApp)
            toast(`${newApp.name} opened!`)
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
            console.log('celaning')
        }
    },[])
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

const Settings = () => {
    const [open, setOpen] = useState(true)
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
        </Overlay>
    )
}

export default Settings