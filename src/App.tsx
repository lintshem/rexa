
import './App.css';

import Resizable from './library/Resizable';
import TitleBar from './uibase/Titlebar';
import StatusBar from './uibase/Statusbar';
import LeftPane from './uibase/Leftpane';
import RightPane from './uibase/Rightpane';
import WorkSpace from './uibase/WorkSpace';


const App = () => {
  return (
    <div className='app-main' >
      <TitleBar />
      <Resizable defRatio={[1, 6, 1]} style={{ width: '100%', height: '100%' }} >
        <LeftPane />
        <WorkSpace />
        <RightPane />
      </Resizable>
      <StatusBar />
    </div>
  )
}

export default App