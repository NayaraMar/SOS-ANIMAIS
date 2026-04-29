import { useState } from 'react';
import './App.css';
import Home from './views/Home';
import Login from './views/Login';

function App() {
  const [tela, setTela] = useState('home');

  return (
    <div className="App">
      {tela === 'home' ? (
        <Home onEntrarAdmin={() => setTela('login')} />
      ) : (
        <Login onVoltar={() => setTela('home')} />
      )}
    </div>
  );
}

export default App;
