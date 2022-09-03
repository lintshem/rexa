import React from 'react'
import Resizable from '../library/Resizable'
import Explorer from './Explorer'
import './Leftpane.scoped.css'
import ModConfig from './ModConfig'


const Leftpane = () => {
  return (
    <div style={{ width: '98%',background:'green' }} >
      <Resizable align='ver' defRatio={[1,1]} style={{heigth:300}} >
        <Explorer />
        <ModConfig />
      </Resizable>
    </div>
  )
}

export default Leftpane