import { useAtom, useAtomValue } from "jotai"
import React from "react"
import { activeModAtom, modulesAtom, modUpdateAtom } from "../store/main"
import "./ModConfig.scoped.css"
import Button from "../library/Button"
import { sendMessage } from "../util/utils"
import Files from "../components/Files"
import { RenameField } from "../library/RenameField"


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
    const openLive = () => {
        sendMessage('workspace', { action: 'live', item: name })
    }
    return (
        <div key={name} className="mc-main" >
            <RenameField name={name} setName={setName} />
            <div className="btn-actions">
                <Button onClick={openDesign}  >Design</Button>
                <Button onClick={openCode}  >Code</Button>
                <Button onClick={openLive}  >Live</Button>
            </div>
            <Files modName={name} />
        </div>

    )
}
export default ModuleConfig