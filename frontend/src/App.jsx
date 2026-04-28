import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';

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
