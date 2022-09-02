import React from 'react'
import Drawer from '../components/Drawer'
import TabContainer from '../library/TabContainer'
import './WorkSpace.scoped.css'
import Test from '../components/Test'
import { Resizable } from 're-resizable'

interface IWorkSpace { height?: number }
const WorkSpace = ({ height }: IWorkSpace) => {

  const resizeStop = (e: any, d: any) => {
    console.log(e, d)
  }
  return (
    <div className='main' >
      <TabContainer titles={['one', 'two', 'item', 'etd d']} headerWidth={90} fullWidth style={{ height: '100%' } as any}  >
        <Test />
        <Resizable defaultSize={{ width: 200, height: 130 }} minHeight={10} minWidth={10}
          onResizeStop={resizeStop} >
          <div className='ws-main' >
            one
          </div>
        </Resizable>
        <Drawer />
        <h1>2 one</h1>
      </TabContainer>
    </div>
  )
}

export default WorkSpace