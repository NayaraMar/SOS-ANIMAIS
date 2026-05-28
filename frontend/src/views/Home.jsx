import React from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';
import imgAnimais from '../assets/imgAnimais.png';

const Home = (props) => {
  return (
    <div className="container">
      <header className="header">
        <div className="logo-group">
          <img src={logoSos} alt="SOS Animais" width="120" />
          <img src={logoOlinda} alt="Olinda" width="100" />
        </div>
        <button className="btn-outline" onClick={props.onEntrarAdmin}>
          Entrar como Admin
        </button>
      </header>

      <main
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button className="btn-main" onClick={props.onEfetuarDenuncia}>
            EFETUAR DENÚNCIA
          </button>
          <button className="btn-main" onClick={props.onAcompanharDenuncia}>
            ACOMPANHAR DENÚNCIA
          </button>
        </div>

        <div className="illustration">
          <img src={imgAnimais} alt="Animais" style={{ width: '450px' }} />
        </div>
      </main>

      <footer className="footer">
        Secretaria Executiva de Proteção Animal | (81) 99312-4632
      </footer>
    </div>
  );
};

export default Home;