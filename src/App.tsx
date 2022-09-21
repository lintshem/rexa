import Resizable from './library/Resizable';
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

const App = () => {
  return (
    <Provider>
      <div className='app-main' >
        <TitleBar />
        <Resizable defRatio={[1, 6, 1]} style={{}}  >
          <LeftPane />
          <WorkArea isRoot />
          <RightPane />
        </Resizable>
        <StatusBar />
        <DesignMenu />
      </div>
    </Provider>
  )
}

export default App