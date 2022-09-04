import { useAtom, useAtomValue } from "jotai"
import React, { useState } from "react"
import { activeModAtom, modulesAtom, modUpdateAtom } from "../store/main"
import "./ModConfig.scoped.css"
import { MdSave } from 'react-icons/md'
import Button from "../library/Button"
import { sendMessage } from "../util/utils"

interface IRenameField { name: string, setName: (nam: string) => void }
export const RenameField = ({ name, setName }: IRenameField) => {
    const [value, setValue] = useState(name)
    const isDirty = value !== name
    const classes = `${isDirty ? 'rename-dirty' : ''}`
    const updateName = () => setName(value)
    return (
        <div className="rf-main">
            <input className={classes} value={value} onChange={(e) => setValue(e.target.value)} />
            <div onClick={updateName} ><MdSave /></div>
        </div>
    )
}

export const ModuleConfig = () => {
    const modules = useAtomValue(modulesAtom)
    const [modAtt, setModAttr] = useAtom(modUpdateAtom)
    const [activeMod, setActiveMod] = useAtom(activeModAtom)

    const mod = modules.find(m => m.name === activeMod)
    if (!mod) {
        return (
            <div>
                Select Module
            </div>
        )
    }
    const name = mod.name
    const setName = (newName: string) => {
        mod.name = newName
        setActiveMod(newName)
        sendMessage('rename-module', { old: name, new: newName })
        setModAttr(modAtt % 1000 + 1)
    }
    const openDesign = () => {
        sendMessage('workspace', { action: 'design', item: name })
    }
    const openCode = () => {
        sendMessage('workspace', { action: 'code', item: name })
    }
    return (
        <div key={name} >
            <RenameField name={name} setName={setName} />
            <div className="btn-actions">
                <Button onClick={openDesign}  >Design</Button>
                <Button onClick={openCode}  >Code</Button>
            </div>
        </div>

    )
}
export default ModuleConfig