import React from 'react'
import './Overlay.scoped.css'

interface IOverlay { children: any, open?: boolean, setOpen?: Function, base?: any, top?: any, left?: any, right?: any, bottom?:any}
const Overlay = ({ children, open = true, setOpen, base,top,bottom,left,right }: IOverlay) => {
    const close = () => {
        if (setOpen) setOpen(false)
    }
    const cancelClick = (e: React.MouseEvent) => e.stopPropagation()
    if (!open) {
        return base
    }
    return (
        <div>
            {base}
            {open && <div className='main' onClick={close} >
                <div className='children' onClick={cancelClick} style={{ top, left, bottom, right }} >
                    {children}
                </div>
            </div>}
        </div>
    )
}

export default Overlay