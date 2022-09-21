import Splitter from './library/Resizable';
import TitleBar from './uibase/Titlebar';
import StatusBar from './uibase/Statusbar';
import LeftPane from './uibase/Leftpane';
import RightPane from './uibase/Rightpane';
import './App.css';
import './util/global.css';
import "react-toastify/dist/ReactToastify.css"
import { DesignMenu } from './util/ContextMenus';
import { Provider } from 'react-keep-alive'
import WorkArea from './uibase/WorkArea';
import { useAtomValue } from 'jotai';
import { sbLeftAtom, sbRightAtom } from './store/main';
import Split from 'react-split'

const App = () => {
  const rightSB = useAtomValue(sbRightAtom) as any
  const leftSB = useAtomValue(sbLeftAtom) as any
  const defRatio = [...(leftSB ? [1] : []), 6, ...(rightSB ? [1] : [])]
  const getSum = () => {
    let key = 0;
    defRatio.forEach(n => key += n)
    return key
  }
  console.log(getSum())
  console.log(defRatio)
  const WSELEMENT = <WorkArea isRoot />
  return (
    <Provider>
      <div className='app-main' >
        <TitleBar />
        {(leftSB || rightSB) && <Splitter defRatio={defRatio} style={{}} key={getSum()}  >
          {leftSB && <LeftPane />}
          {WSELEMENT}
          {rightSB && <RightPane />}
        </Splitter>}
        {!(leftSB || rightSB) && WSELEMENT}
        <StatusBar />
        <DesignMenu />
        <Split style={{ width: '100%', height: 100 }} >
          <h1>so good</h1>
          <div>Come back Here</div>
        </Split>

      </div>
    </Provider>
  )
}

export default App