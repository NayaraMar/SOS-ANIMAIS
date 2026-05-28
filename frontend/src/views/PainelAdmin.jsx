import React, { useState, useEffect } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const PainelAdmin = (props) => {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarDenuncias = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/denuncias/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDenuncias(data);
        } else {
          setErro('Não foi possível carregar as denúncias. Acesso negado.');
        }
      } catch (err) {
        setErro('Erro ao conectar com o servidor.');
      } finally {
        setCarregando(false);
      }
    };
    buscarDenuncias();
  }, []);

  const efetuarLogout = () => {
    localStorage.clear();
    props.onLogout();
  };

  const obterEstiloPrioridade = (prioridade) => {
    switch (prioridade?.toLowerCase()) {
      case 'alta':
        return { background: '#fce8e6', color: '#a51d24', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' };
      case 'media':
        return { background: '#fef7e0', color: '#b06000', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' };
      default:
        return { background: '#e6f4ea', color: '#137333', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' };
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo-group">
          <img src={logoSos} alt="SOS Animais" width="120" />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginLeft: '15px' }}>
            Painel de Triagem
          </span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn-outline" style={{ background: '#007bff', color: 'white', border: 'none' }} onClick={props.onIrParaCadastro}>
            + Cadastrar Protetor
          </button>
          <button className="btn-outline" onClick={efetuarLogout}>
            Sair (Logout)
          </button>
        </div>
      </header>

      <main style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Ocorrências Registradas</h2>
          <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>
            Gerencie e despache os casos abaixo.
          </p>
        </div>

        {carregando && <p style={{ textAlign: 'center' }}>Carregando denúncias...</p>}
        {erro && <p style={{ color: 'red', textAlign: 'center' }}>{erro}</p>}

        {!carregando && !erro && (
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '15px' }}>Protocolo</th>
                  <th style={{ padding: '15px' }}>Animal</th>
                  <th style={{ padding: '15px' }}>Ocorrência</th>
                  <th style={{ padding: '15px' }}>Prioridade</th>
                  <th style={{ padding: '15px' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {denuncias.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>Nenhuma denúncia no momento.</td></tr>
                ) : (
                  denuncias.map((d) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{d.protocolo}</td>
                      <td style={{ padding: '15px' }}>{d.tipo_animal}</td>
                      <td style={{ padding: '15px' }}>{d.tipo_ocorrencia}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={obterEstiloPrioridade(d.prioridade)}>{d.prioridade || 'Média'}</span>
                      </td>
                      <td style={{ padding: '15px' }}>{d.status || 'Recebida'}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button style={{ background: '#333', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Analisar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="footer" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px' }}>
        <span>Secretaria Executiva de Proteção Animal | (81) 99312-4632</span>
        <img src={logoOlinda} alt="Olinda" width="90" style={{ position: 'absolute', right: '0', bottom: '-10px' }} />
      </footer>
    </div>
  );
};

export default PainelAdmin;