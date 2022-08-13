import React from 'react';
import './App.css';
import Resizable from './library/Resizable';
import TabContainer from './library/TabContainer';


const App = () => {
  return (
    <div>
      App
      <Resizable defRatio={[1, 2, 1]} style={{ width: '100%', height: 300 } as any} >
        <Resizable align='ver' style={{ height: '100%' } as any} >
          <h1>'wewe1'</h1>
          <h1>'wewe2'</h1>

        </Resizable>
        <Resizable align='hor' defRatio={[1, 2]} style={{ width: 100, height: '100%' } as any} >
          <h1>Body</h1>
        </Resizable>
        <Resizable align='ver' style={{ height: '100%' } as any} >
          <h1>'wewe1'</h1>
          <h1>'wewe2'</h1>

        </Resizable>

      </Resizable>
      <TabContainer titles={['one', 'two', 'click', 'done']}  >
        <div>
          <h1>'head 1'</h1>
        </div>
        <div>
          <h1>'head 2'</h1>
        </div>
        <div>
          <h1>'head 3'</h1>
        </div>
        <div>
          <h1>'head 4'</h1>
        </div>
      </TabContainer>
      <TabContainer titles={['one', 'two', 'click', 'done']} align={'ver'} >
        <div>
          <h1>'head 1'</h1>
        </div>
        <div>
          <h1>'head 2'</h1>
        </div>
        <div>
          <h1>'head 3'</h1>
        </div>
        <div>
          <h1>'head 4'</h1>
        </div>
      </TabContainer>

    </div>
  )
}

export default App