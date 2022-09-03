import React from 'react'
import Resizable from '../library/Resizable'
import Explorer from './Explorer'
import './Leftpane.scoped.css'
import ModConfig from './ModConfig'


const Leftpane = () => {
  return (
    <div className='main'  >
      <Resizable align='ver' defRatio={[1,1]} >
        <Explorer />
        <ModConfig />
      </Resizable>
    </div>
  )
}

export default Leftpane