import React from 'react'
import Drawer from '../components/Drawer'
import TabContainer from '../library/TabContainer'
import './WorkSpace.scoped.css'
import Test from '../components/Test'

interface IWorkSpace { height?: number }
const WorkSpace = ({ height }: IWorkSpace) => {
  return (
    <div className='main' >
      <TabContainer titles={['one', 'two', 'item', 'etd d']} headerWidth={90} fullWidth style={{ height: '100%' } as any}  >
        <Test  />
        <h1>2 one</h1>
        <Drawer />
        <h1>2 one</h1>
      </TabContainer>
    </div>
  )
}

export default WorkSpace