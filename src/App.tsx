import React from 'react';
import './App.css';
import Resizable from './library/Resizable';


const App = () => {
  return (
    <div>
      App
      <Resizable defRatio={[1, 2, 1, 1]} style={{ width: '100%', height: 300 } as any} >
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
    </div>
  )
}

export default App