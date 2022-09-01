import React from 'react'
import Drawer from '../components/Drawer'
import TabContainer from '../library/TabContainer'
import './WorkSpace.scoped.css'
import Popover from '../library/Popover'

interface IWorkSpace { height?: number }
const WorkSpace = ({ height }: IWorkSpace) => {
  return (
    <div className='main' >
      <TabContainer titles={['one', 'two', 'item', 'etd d']} headerWidth={90} fullWidth style={{ height: '100%' } as any}  >
        <Popover open={true} width={90} top={20}  >
          <h1>1nos</h1>
          <h1>2nos</h1>
          <h1>3nos</h1>
        </Popover>
        <h1>2 one</h1>
        <Drawer />
        <h1>2 one</h1>
      </TabContainer>
    </div>
  )
}

export default WorkSpace