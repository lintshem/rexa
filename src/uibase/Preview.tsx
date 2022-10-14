import { useAtom, useAtomValue } from 'jotai'
import { Resizable } from 're-resizable'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Module } from '../models/Module'
import { modulesAtom, prevChangeAtom, prevSizeAtom } from '../store/main'
import './Preview.scoped.css'

const usePrevChange = (modName: string, modules: Module[], setMod: Function) => {
    const prevChanged = useAtomValue(prevChangeAtom(modName))
    useEffect(() => {
        setMod(modules.find(m => m.name === modName))
    })
    return prevChanged
}
interface IPreview { modName: string }
const Preview = ({ modName }: IPreview) => {
    const modules = useAtomValue(modulesAtom)
    const [size, setSize] = useAtom(prevSizeAtom(modName))
    const updater = useState(0)[1]
    const [mod, setMod] = useState(modules.find(m => m.name === modName))
    usePrevChange(modName, modules, setMod)
    // eslint-disable-next-line 
    const prevChanged = useAtomValue(prevChangeAtom(modName))
    if (!mod || !mod.name) {
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
    mod.updater = updater
    const liveMod = mod.tree[0].getLive(mod)
    const updateSize = (e: any, dir: any, a: any, d: any) => {
        setSize({ width: size.width + d.width, height: size.height + d.height })
    }
    return (
        <div className="preview" >
            <Resizable defaultSize={size} onResizeStop={updateSize} className="" >
                <div className='prev-center'>
                    {liveMod}
                </div>
            </Resizable>
            <div className='info' >
                <div>{`${size.width}x${size.height}`}</div>
            </div>
        </div>
    )
}

export default Preview

interface IIframe { children?: any, className: string, title: string }
export const IFrame = ({ children, title, ...props }: IIframe) => {
    const [mountRef, setMountRef] = useState<any>(null)
    const mountNode = mountRef?.contentWindow?.document?.body
    console.log(mountRef, mountNode)
    return (
        <iframe  {...props} ref={setMountRef} title={title} >
            {mountNode && createPortal(children, mountNode)}
        </iframe>
    )
}