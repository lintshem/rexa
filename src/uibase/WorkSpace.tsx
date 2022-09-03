import React from 'react'
import Drawer from '../components/Drawer'
import TabContainer from '../library/TabContainer'
import './WorkSpace.scoped.css'
import Test from '../components/Test'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup'

interface IWorkSpace { height?: number }
const extensions = [basicSetup(), javascript({ jsx: true })]
let v = ''
const WorkSpace = ({ height }: IWorkSpace) => {

  return (
    <div className='main' >
      <TabContainer titles={['one', 'two', 'item', 'etd d']} headerWidth={90} fullWidth style={{ height: '100%' } as any}  >
        <Test />
        <div className='ws-main' >
          one
        </div>
        <Drawer />
        <div className='editor' >
          <h1>2 one</h1>
          <CodeMirror
            value={v}
            onChange={(e) => v = e}
            height={'200px'}
            theme={okaidia}
            extensions={extensions}
            basicSetup={{
              autocompletion: true
            }}
          />
        </div>

      </TabContainer>
    </div>
  )
}

export default WorkSpace