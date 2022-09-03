import { useAtom, useAtomValue } from 'jotai'
import React, { useState } from 'react'
import useDimensions from 'react-cool-dimensions'
import { toast } from 'react-toastify'
import Button from '../library/Button'
import Popover from '../library/Popover'
import { Module } from '../models/Module'
import { activeModAtom, modulesAtom } from '../store/main'
import './Explorer.scoped.css'
interface IModItem { mod: Module }
const ModuleItem = ({ mod }: IModItem) => {
    const [activeMod, setActiveMod] = useAtom(activeModAtom)
    const isFocused = activeMod === mod.name
    const classes = `${isFocused ? 'mi-focused' : ''}`
    return (
        <div onClick={() => setActiveMod(mod.name)} className={classes} >
            {mod.name}
        </div>
    )
}
const Explorer = () => {
    const [modules, setModules] = useAtom(modulesAtom)
    const [name, setName] = useState('')
    const { observe, height } = useDimensions()
    const addModule = () => {
        let modName = name.trim()
        if (!modName || modName.length < 3) {
            toast("Name Short", { type: 'info' })
            return;
        }
        if (modules.find(m => m.name == name)) {
            toast("Name taken", { type: 'info' })
            return
        }
        const mod = new Module(name)
        setName('')
        setModules([...modules, mod])
    }
    return (
        <div ref={observe} >
            <div>MODULES</div>
            {modules.map(m => <ModuleItem key={m.name} mod={m} />)}
            <div  >
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <Button onClick={addModule} >ADD</Button>
            </div>
        </div>
    )
}

export default Explorer

export const ModuleConfig = () => {
  return (
    <div>
        ModuleConfig
    </div>
  )
}
