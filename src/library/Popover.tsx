import React, { useEffect } from 'react'
import './Popover.scoped.css'

interface IPopover { children: any, width?: number | string, top?: number | string, bottom?: number | string, open?: boolean, setOpen?: Function }
const Popover = ({ children, width = 80, top = 10, bottom, open = false, setOpen }: IPopover) => {
  useEffect(() => {
    const clickedOut = () => {
      if (setOpen)
        setOpen(false)
    }
    window.addEventListener('click', clickedOut)
    return () => window.removeEventListener('click', clickedOut)
    // eslint-disable-next-line
  }, [])
  const stopClick = (e: React.MouseEvent) => {
    console.log('stopping')
        e.stopPropagation()
  }
  const keyUp = (e: React.KeyboardEvent) => {
    console.log('closing', e)
    if (e.key === 'esc') {
      if (setOpen)
        setOpen(false)
    }
  }
  return (
    <div className='main' onClick={stopClick} onKeyUp={keyUp} >
      {open && <div className='main-pop' style={{ width, top, bottom }} >
        {children}
      </div>}
    </div>
  )
}

export default Popover

