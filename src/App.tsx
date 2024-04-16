import React, { useState } from 'react';
import { ConnectionModeSelector } from './components/ConnectionModeSelector';
import { ConnectionMode } from './types/connectionMode';

function App() {

  const [connectionMode, setConnectionMode] = useState<ConnectionMode | undefined>();
  if (!connectionMode){
    return (<ConnectionModeSelector onModeSelected={setConnectionMode}></ConnectionModeSelector>);
  }
  return (
    <div></div>
  );
}

export default App;
