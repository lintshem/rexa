import { useAtomValue } from "jotai"
import React from "react"
import { activeModAtom, modulesAtom } from "../store/main"
import "./ModConfig.scoped.css"

export const ModuleConfig = () => {
    const modules = useAtomValue(modulesAtom)
    const activeMod = useAtomValue(activeModAtom)

    const mod = modules.find(m => m.name === activeMod)
    if (!mod) {
        return (
            <div>
                Select Module
            </div>
        )
    }
    return (
        <div>
            ModuleConfig
            {mod.name}
        </div>
    )
}
export default ModuleConfig