import { useAtom, useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../library/Button'
import { Comp, Module } from '../models/Module'
import { activeModAtom, modulesAtom, modUpdateAtom } from '../store/main'
import './Explorer.scoped.css'
interface IModItem { mod: Module }
const ModuleItem = ({ mod }: IModItem) => {
    const name = mod.name
    const [activeMod, setActiveMod] = useAtom(activeModAtom)
    const isFocused = activeMod === name
    const classes = `${isFocused ? 'mi-focused' : ''}`
    const clicked = () => {
        setActiveMod(name)
    }
    return (
        <div className={classes} onClick={clicked} >
            {name}
        </div>
    )
}
const Explorer = () => {
    const [modules, setModules] = useAtom(modulesAtom)
    //This line causes rerender due to module rename
    // eslint-disable-next-line
    const [activeMod, setActiveMod] = useAtom(activeModAtom)
    //This line causes rerender due to module rename
    // eslint-disable-next-line
    const modAttr = useAtomValue(modUpdateAtom)
    const [name, setName] = useState('')
    const addModule = () => {
        let modName = name.trim()
        if (!modName || modName.length < 3) {
            toast("Name Short", { type: 'info' })
            return;
        }
        if (modules.find(m => m.name === name)) {
            toast("Name taken", { type: 'info' })
            return
        }
        const mod = new Module(name)
        mod.addComp(new Comp('const', { width: "100%", height: "100%" }, []))
        setName('')
        setModules([...modules, mod])
    }
    if (false) {
        return <div>Ok bros
            <button onClick={() => setActiveMod('ModTest')} >Maonss click me</button>
        </div>
    }
    return (
        <div className='exp-main'  >
            <div>MODULES</div>
            {modules.map(m => <ModuleItem key={m.name} mod={m} />)}
            <div  >
                <input className='rexa-input' value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <Button onClick={addModule} >ADD</Button>
            </div>
        </div>
    )
}

export default Explorer
