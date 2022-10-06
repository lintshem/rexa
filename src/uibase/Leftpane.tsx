import React from 'react'
import Splitter from '../library/Resizable'
import Explorer from './Explorer'
import './Leftpane.scoped.css'
import ModConfig from './ModConfig'


const Leftpane = () => {
  return (
    <div className='lp-main'  >
      <Splitter align='ver' defRatio={[1,1]} >
        <Explorer />
        <ModConfig />
      </Splitter>
    </div>
  )
}

export default Leftpane