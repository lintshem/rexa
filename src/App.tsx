import React from 'react';
import './App.css';
import Resizable from './library/Resizable';


const App = () => {
  return (
    <div>
      App
      <Resizable align='hor' >
       <h1>'wewe1'</h1>
       <h1>'wewe2'</h1>
       <h1>'wewe2'</h1>
      </Resizable>
    </div>
  )
}

export default App