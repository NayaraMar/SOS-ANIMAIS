import { useState } from 'react';
import './App.css';
import Home from './views/Home';
import Login from './views/Login';
import Denuncia from './views/Denuncia';

function App() {
  const [tela, setTela] = useState('home');

  // 1. Tela do Painel Administrativo
  if (tela === 'admin') {
    return (
      <div className="App">
        <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
          Tela administrativa em desenvolvimento
        </h1>
        <div style={{ textAlign: 'center' }}>
          <button 
            className="btn-outline" 
            onClick={() => setTela('home')}
            style={{ cursor: 'pointer', padding: '10px 20px' }}
          >
            Sair / Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  // 2. Tela de Registro de Nova Denúncia
  if (tela === 'denuncia') {
    return (
      <div className="App">
        <Denuncia onVoltar={() => setTela('home')} />
      </div>
    );
  }

  // 3. Telas Principais: Home e Login
  return (
    <div className="App">
      {tela === 'home' ? (
        <Home 
          onEntrarAdmin={() => setTela('login')} 
          onEfetuarDenuncia={() => setTela('denuncia')} 
        />
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