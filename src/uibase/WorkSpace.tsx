import React, { useEffect } from 'react'
import Drawer from '../components/Drawer'
import TabContainer from '../library/TabContainer'
import './WorkSpace.scoped.css'
import { cancelDrag, receiveDrag, receiveMessage } from '../util/utils'
import { toast } from 'react-toastify'
import Coder from './Coder'
import Preview from './Preview'
import { useAtom } from 'jotai'
import { activeWSAtom, waSpacesAtom, wsViewsAtom } from '../store/main'
import { uniqueId } from 'lodash'
import { EmptyArea } from '../util/SmallComps'

interface IWorkSpace { id: string }
const WorkSpace = ({ id }: IWorkSpace) => {
  const [active, setActive] = useAtom(activeWSAtom)
  useEffect(() => {
    const cleanUp1 = receiveMessage('workspace', updateTabs)
    const cleanUp2 = receiveMessage('rename-module', renameTabs)
    const cleanUp3 = receiveMessage('delete-module', deleteModule)
    return () => {
      cleanUp1()
      cleanUp2()
      cleanUp3()
    }
  })
  const [views, setViews] = useAtom(wsViewsAtom(id))
  const deleteModule = (deleteName: string) => {
    console.log(deleteName)
    const newViews = views.filter(v => v.name !== deleteName)
    setViews(newViews)
    console.log('deleting')
  }
  const renameTabs = (data: { old: string, new: string }) => {
    const newViews = views.map(v => {
      if (v.name === data.old) {
        v.name = data.new
      }
      return { ...v };
    })
    setViews(newViews)
  }
  const getComp = (type: string, item: string) => {
    if (type === 'design') {
      return <Drawer key={item} modName={item} />
    } else if (type === 'code') {
      return <Coder key={item} modName={item} />
    } else if (type === 'live') {
      return <Preview key={item} modName={item} />
    } else {
      return <div>Wrong Editor</div>
    }
  }
  const updateTabs = (data: { action: string, item: string }, isDrop = false) => {
    if (views.find(v => v.name === data.item && v.type === data.action)) {
      toast('Found item')
      return
    }
    if (active === id || isDrop) {
      const newView = { comp: getComp(data.action, data.item), name: data.item, type: data.action }
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
      // v.comp == null after app restore
      const comp = v.comp === null ? getComp(v.type, v.name) : v.comp
      bodies.push(comp)
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
  const Actions = () => {
    const [paces, setPaces] = useAtom(waSpacesAtom)
    const getParIndex = () => {
      const pace = paces.find(p => p.id === id)!
      return paces.findIndex(p => p.id === pace.parent)!
    }
    const splitWS = () => {
      const newPaces = [...paces]
      const parent = { ...paces[getParIndex()] }
      const newId = uniqueId('ws')
      const newPar = { id: newId, parent: parent.id || 'root', orient: 'h' as 'h' | 'v' }
      const newPace = { id, parent: newId, orient: 'h' as 'h' | 'v' }
      newPaces.splice(newPaces.findIndex(p => p.id === id), 1, newPar, newPace)
      // newPaces.push(newPar)
      // newPaces.push(newPace)
      console.log(newPaces, paces)
      setPaces(newPaces)
    }
    const closeWS = () => {
      const newPaces = [...paces]
      const index = paces.findIndex(p => p.id === id)
      newPaces.splice(index, 1)
      setPaces(newPaces)
    }

    return (<div className='ws-actions' >
      <div onClick={splitWS} >+</div>
      <div onClick={closeWS} >x</div>
    </div >
    )
  }
  const handleDrop = (e: React.DragEvent) => {
    const data = receiveDrag(e)
    if (data.action === 'add-ws') {
      const load = data.data as { type: string, name: string }
      updateTabs({ action: load.type, item: load.name }, true)
      e.stopPropagation()
    }
  }
  const [titles, bodies] = splitTitleView()
  const isEmpty = bodies.length === 0
  return (
    <div className='workspace-main' onClick={changeActive} onDragOver={cancelDrag} onDrop={handleDrop} >
      {!isEmpty && <TabContainer id={id} titles={titles} headerWidth={100} fullWidth style={{ height: '100%' } as any}
        onAction={removeTab} actions={<Actions />}  >
        {bodies}
      </TabContainer >}
      {isEmpty && <EmptyArea message='No WorkTab' />}
    </div >
  )
}

export default WorkSpace