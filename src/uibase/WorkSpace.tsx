import React, { useEffect, useState } from 'react'
import Drawer from '../components/Drawer'
import TabContainer from '../library/TabContainer'
import './WorkSpace.scoped.css'
import Test from '../components/Test'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup'
import { receiveMessage } from '../util/utils'
import { toast } from 'react-toastify'
import Coder from './Coder'

interface IWorkSpace { height?: number }
const extensions = [basicSetup(), javascript({ jsx: true })]
let v = ''
const WorkSpace = ({ height }: IWorkSpace) => {
  useEffect(() => {
    const cleanUp1 = receiveMessage('workspace', updateTabs)
    const cleanUp2 = receiveMessage('rename-module', renameTabs)
    return () => {
      cleanUp1()
      cleanUp2()
    }
  })
  interface IView { comp: any, name: string, type: string }
  const [views, setViews] = useState<IView[]>([
    {
      comp: <div className='ws-main' >
        one
      </div>,
      name: 'TabTest',
      type: '',
    },
    {
      comp: <Test />,
      name: 'Test',
      type: '',
    }
  ])
  const renameTabs = (data: { old: string, new: string }) => {
    const newViews = views.map(v => {
      if (v.name === data.old) {
        v.name = data.new
      }
      return { ...v };
    })
    setViews(newViews)
  }
  const updateTabs = (data: { action: string, item: string }) => {
    console.log(data)
    if (views.find(v => v.name === data.item && v.type === data.action)) {
      toast('Found item')
      return
    }
    console.log('not found', data, views)
    const getComp = () => {
      if (data.action === 'design') {
        return <Drawer modName={data.item} />
      } else {
        return <Coder modName={data.item} />
      }
    }
    const newView = { comp: getComp(), name: data.item, type: data.action }
    setViews([...views, newView])
  }
  const splitTitleView = () => {
    const titles: string[] = []
    const bodies: any[] = []
    views.forEach(v => {
      let pos = ''
      switch (v.type) {
        case 'code':
          pos = '-C'
          break;
        case 'design':
          pos = '-D'
          break;
      }
      titles.push(v.name + pos)
      bodies.push(v.comp)
    })
    return [titles, bodies]
  }
  const removeTab = (index: number) => {
    const newViews = [...views]
    newViews.splice(index, 1)
    setViews(newViews)
  }
  const [titles, bodies] = splitTitleView()
  return (
    <div className='main' >
      <TabContainer titles={titles} headerWidth={100} fullWidth style={{ height: '100%' } as any}
        onAction={removeTab}  >
        {bodies}
      </TabContainer>
    </div>
  )
}

export default WorkSpace