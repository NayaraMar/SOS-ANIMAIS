import { useState } from 'react';
import './App.css';
import Home from './views/Home';
import Login from './views/Login';
import Denuncia from './views/Denuncia';
import CadastroAdmin from './views/CadastroAdmin';
import PainelAdmin from './views/PainelAdmin';
import Acompanhamento from './views/Acompanhamento';

function App() {
  const [tela, setTela] = useState('home');

  if (tela === 'admin') {
    return (
      <div className="App">
        <PainelAdmin 
          onLogout={() => setTela('home')} 
          onIrParaCadastro={() => setTela('cadastro_admin')}
        />
      </div>
    );
  }

  if (tela === 'cadastro_admin') {
    return (
      <div className="App">
        <CadastroAdmin onVoltar={() => setTela('admin')} />
      </div>
    );
  }

  if (tela === 'denuncia') {
    return (
      <div className="App">
        <Denuncia onVoltar={() => setTela('home')} />
      </div>
    );
  }

  if (tela === 'acompanhamento') {
    return (
      <div className="App">
        <Acompanhamento onVoltar={() => setTela('home')} />
      </div>
    );
  }

  return (
    <div className="App">
      {tela === 'home' ? (
        <Home 
          onEntrarAdmin={() => setTela('login')} 
          onEfetuarDenuncia={() => setTela('denuncia')} 
          onAcompanharDenuncia={() => setTela('acompanhamento')}
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