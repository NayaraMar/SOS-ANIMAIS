import { useState } from 'react';
import './App.css';

import Home from './views/Home';
import Login from './views/Login';
import Denuncia from './views/Denuncia';
import CadastroAdmin from './views/CadastroAdmin';
import PainelAdmin from './views/PainelAdmin';
import Acompanhamento from './views/Acompanhamento';
import RecuperarSenha from './views/RecuperarSenha';

// NOVOS IMPORTS
import AnaliseDenuncia from './views/AnaliseDenuncia';
import GerenciarUsuarios from './views/GerenciarUsuarios';

function App() {
  const [tela, setTela] = useState('home');

  // NOVO ESTADO
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);

  if (tela === 'admin') {
    return (
      <div className="App">
        <PainelAdmin
          onLogout={() => setTela('home')}
          onVoltar={() => setTela('login')}
          onIrParaCadastro={() => setTela('cadastro_admin')}
          onIrUsuarios={() => setTela('usuarios')}
          onAnalisar={(denuncia) => {
            setDenunciaSelecionada(denuncia);
            setTela('analise');
          }}
        />
      </div>
    );
  }

  if (tela === 'analise') {
    return (
      <div className="App">
        <AnaliseDenuncia
          denuncia={denunciaSelecionada}
          onVoltar={() => setTela('admin')}
        />
      </div>
    );
  }

  if (tela === 'usuarios') {
    return (
      <div className="App">
        <GerenciarUsuarios
          onVoltar={() => setTela('admin')}
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

  if (tela === 'recuperar_senha') {
    return (
      <div className="App">
        <RecuperarSenha
          onVoltar={() => setTela('login')}
        />
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
          onEsqueciSenha={() => setTela('recuperar_senha')}
        />
      )}
    </div>
  );
}

export default App;
