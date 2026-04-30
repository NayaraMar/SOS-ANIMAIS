import { useState } from 'react';
import './App.css';
import Home from './views/Home';
import Login from './views/Login';

function App() {
  const [tela, setTela] = useState('home');

  if (tela === 'admin') {
    return <h1>Tela administrativa em desenvolvimento</h1>;
  }

  return (
    <div className="App">
      {tela === 'home' ? (
        <Home onEntrarAdmin={() => setTela('login')} />
      ) : (
        <Login
          onVoltar={() => setTela('home')}
          onLoginSucesso={() => setTela('admin')}
        />
      )}
    </div>
  );
}

export default App;