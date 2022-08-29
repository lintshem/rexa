import React from 'react'
import Drawer from '../components/Drawer'
import './WorkSpace.scoped.css'

interface IWorkSpace { height?: number }
const WorkSpace = ({ height }: IWorkSpace) => {
  return (
    <div className='main' >
      <Drawer />
    </div>
  )
}

export default WorkSpace