import Splitter from './library/Resizable';
import TitleBar from './uibase/Titlebar';
import StatusBar from './uibase/Statusbar';
import LeftPane from './uibase/Leftpane';
import RightPane from './uibase/Rightpane';
import './App.css';
import './util/global.css';
import "react-toastify/dist/ReactToastify.css"
import { Provider } from 'react-keep-alive'
import WorkArea from './uibase/WorkArea';
import { useAtomValue } from 'jotai';
import { sbLeftAtom, sbRightAtom } from './store/main';
import WorkSpace from './uibase/WorkSpace';

const App = () => {
  const rightSB = useAtomValue(sbRightAtom) as any
  const leftSB = useAtomValue(sbLeftAtom) as any
  const defRatio = [...(leftSB ? [1] : []), 6, ...(rightSB ? [1] : [])]
  const getSum = () => {
    let key = 0;
    defRatio.forEach(n => key += n)
    return key
  }
  const WSELEMENT = <WorkArea isRoot defWs={[{ comp: <WorkSpace id={-1}   />, type: 'workspace' }]} />
  return (
    <Provider>
      <div className='app-main' >
        <TitleBar />
        <Splitter defRatio={defRatio} style={{}} key={getSum()}  >
          {leftSB && <LeftPane />}
          {WSELEMENT}
          {rightSB && <RightPane />}
        </Splitter>
        <StatusBar />
      </div>
    </Provider>
  )
}

export default App