import React, { useEffect, useState } from 'react'
import Drawer from '../components/Drawer'
import TabContainer from '../library/TabContainer'
import './WorkSpace.scoped.css'
import { receiveMessage } from '../util/utils'
import { toast } from 'react-toastify'
import Coder from './Coder'
import Preview from './Preview'
import { useAtom } from 'jotai'
import { activeWSAtom } from '../store/main'
import Constraint from '../components/Constraint'

interface IWorkSpace { height?: number, id: any }
const WorkSpace = ({ height, id }: IWorkSpace) => {
  const [active, setActive] = useAtom(activeWSAtom)
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
      comp: <Constraint props={{}} />,
      name: 'Const',
      type: 'const',
    },
    {
      comp: <Preview key="mdtest" modName='ModTest' />,
      name: 'ModTest',
      type: 'live',
    },
    {
      comp: <Drawer key="mdtest" modName='ModTest' />,
      name: 'ModTest',
      type: 'design',
    },
    {
      comp: <Coder key="modcod" modName='ModTest' />,
      name: 'ModTest',
      type: 'code',
    },
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
    if (views.find(v => v.name === data.item && v.type === data.action)) {
      toast('Found item')
      return
    }
    const getComp = () => {
      if (data.action === 'design') {
        return <Drawer key={data.item} modName={data.item} />
      } else if (data.action === 'code') {
        return <Coder key={data.item} modName={data.item} />
      } else if (data.action === 'live') {
        return <Preview key={data.item} modName={data.item} />
      } else {
        return <div>Wrong Editor</div>
      }
    }
    if (active === id) {
      const newView = { comp: getComp(), name: data.item, type: data.action }
      setViews([...views, newView])
    }
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
        case 'live':
          pos = '-L'
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
  const changeActive = (e: React.MouseEvent) => {
    setActive(id)
  }
  const [titles, bodies] = splitTitleView()
  return (
    <div className='main' onClick={changeActive} >
      <TabContainer id={id} titles={titles} headerWidth={100} fullWidth style={{ height: '100%' } as any}
        onAction={removeTab}  >
        {bodies}
      </TabContainer>
    </div>
  )
}

export default WorkSpace