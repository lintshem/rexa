import Resizable from './library/Resizable';
import TitleBar from './uibase/Titlebar';
import StatusBar from './uibase/Statusbar';
import LeftPane from './uibase/Leftpane';
import RightPane from './uibase/Rightpane';
import WorkSpace from './uibase/WorkSpace';
import './App.css';
import './util/global.css';
import "react-toastify/dist/ReactToastify.css"
import { DesignMenu } from './util/ContextMenus';
import { Provider } from 'react-keep-alive'
import { ToastContainer } from 'react-toastify';
import { useAtomValue } from 'jotai';
import { themeAtom } from './store/main';

const App = () => {
  const theme = useAtomValue(themeAtom)

  return (
    <Provider>
      <div className='app-main' >
        <TitleBar />
        <Resizable defRatio={[1, 6, 1]} style={{}}  >
          <LeftPane />
          <WorkSpace />
          <RightPane />
        </Resizable>
        <StatusBar />
        <DesignMenu />
      </div>
      <ToastContainer position='bottom-left' pauseOnHover
        theme={theme == 'dark' ? theme : 'light'} autoClose={3000} newestOnTop
      />
    </Provider>
  )
}

export default App