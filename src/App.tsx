import Splitter from './library/Resizable';
import TitleBar from './uibase/Titlebar';
import StatusBar from './uibase/Statusbar';
import LeftPane from './uibase/Leftpane';
import RightPane from './uibase/Rightpane';
import './App.css';
import './util/global.css';
import "react-toastify/dist/ReactToastify.css"
import WorkArea from './uibase/WorkArea';
import { useAtomValue } from 'jotai';
import { sbLeftAtom, sbRightAtom } from './store/main';
import { useEffect } from 'react';
import { addShortcut, sendMessage } from './util/utils'

const onSave = () => {
  console.log("saving");
  sendMessage('setting', 'save-app')
}
const onOpen = () => {
  console.log("open");
  sendMessage('setting', 'open-app')
}
const addAppShortcuts = () => {

  addShortcut('s', onSave, true)
  addShortcut('o', onOpen, true)
  console.log('Updating shortcuts')
}
const App = () => {
  const rightSB = useAtomValue(sbRightAtom) as any
  const leftSB = useAtomValue(sbLeftAtom) as any
  const defRatio = [6]; if (leftSB) defRatio.unshift(1); if (rightSB) defRatio.push(1)
  useEffect(() => {
    addAppShortcuts()
  }, [])
  return (
    <div className='app-main' >
      <TitleBar />
      <Splitter defRatio={defRatio} style={{}} key={defRatio.length} >
        {leftSB && <LeftPane />}
        <WorkArea id='root' />
        {rightSB && <RightPane />}
      </Splitter>
      <StatusBar />
    </div>
  )
}

export default App