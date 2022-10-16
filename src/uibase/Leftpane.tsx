import React from 'react'
import Splitter from '../library/Resizable'
import Explorer from './Explorer'
import './Leftpane.scoped.css'
import ModConfig from './ModConfig'


const LeftPane = () => {
  return (
    <div className='lpp-main'  >
      <Splitter align='ver'   >
        <Explorer />
        <ModConfig />
      </Splitter>
    </div>
  )
}

export default LeftPane