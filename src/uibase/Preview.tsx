import { useAtom, useAtomValue } from 'jotai'
import { Resizable } from 're-resizable'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { modulesAtom, prevChangeAtom, prevSizeAtom } from '../store/main'
import './Preview.scoped.css'

interface IPreview { modName: string }
const Preview = ({ modName }: IPreview) => {
    const modules = useAtomValue(modulesAtom)
    const [size, setSize] = useAtom(prevSizeAtom(modName))
    // eslint-disable-next-line 
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