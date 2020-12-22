import { useState } from 'react';
import './App.css';
import GameMasterAuth from './components/GameMasterAuth'
// import Lobby from './components/Lobby'
import io from 'socket.io-client';

const socket = io('localhost:5000');
socket.on('connect', function(){console.log('connect')});
socket.on('disconnect', function(){console.log('disconnect')});
window.socket = socket
socket.onAny((eventName, ...args) => {
  console.log(eventName, args)
});
function App() {
  const [page, setPage] = useState('login')
  
  return (
    <div className="App">
      <header className="App-header">
        {page === 'login' && <GameMasterAuth onLogin={() => setPage('lobby')}/>}
      </header>
    </div>
  );
}

export default App;
