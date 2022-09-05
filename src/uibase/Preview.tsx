import { useAtomValue } from 'jotai'
import React from 'react'
import { modulesAtom, prevChangeAtom } from '../store/main'

interface IPreview { modName: string }
const Preview = ({ modName }: IPreview) => {
    const modules = useAtomValue(modulesAtom)
    const prevChanged = useAtomValue(prevChangeAtom(modName))
    const mod = modules.find(m => m.name === modName)
    if (!mod) {
        return (
            <div>
                NO Module with That Name
            </div>
        )
    }
    if (!mod.getCodeClass()) {
        console.warn(modName, 'Actions not set,could not load class')
        return <div>Action setting error</div>
    }
    const liveMod = mod.tree[0].getLive(mod)
    console.log(prevChanged)
    return (
        <div>
            <div>
                {liveMod}
            </div>
        </div>
    )
}

export default Preview