import { useState, useEffect } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const PainelAdmin = (props) => {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sessaoAtiva, setSessaoAtiva] = useState('aberto');

  const usuarioLogado = JSON.parse(
    localStorage.getItem('usuario') || 'null'
  );

  const buscarDenuncias = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:8000/api/denuncias/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDenuncias(data);
        setErro('');
      } else {
        setErro('Não foi possível carregar as denúncias.');
      }
    } catch {
      setErro('Erro ao conectar com servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDenuncias();

    const intervalo = setInterval(() => {
      buscarDenuncias();
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  const efetuarLogout = () => {
    localStorage.clear();
    props.onLogout();
  };

  const traduzirStatus = (status) => {
    switch (status) {
      case 'aberto':
        return 'Aberto';
      case 'em_andamento':
        return 'Em Atendimento';
      case 'resolvido':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const estiloStatus = (status) => {
    switch (status) {
      case 'aberto':
        return {
          background: '#f8d7da',
          color: '#721c24',
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: 'bold'
        };

      case 'em_andamento':
        return {
          background: '#fff3cd',
          color: '#856404',
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: 'bold'
        };

      case 'resolvido':
        return {
          background: '#d4edda',
          color: '#155724',
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: 'bold'
        };

      default:
        return {};
    }
  };

  const denunciasAbertas = denuncias.filter(
    (d) => d.status === 'aberto'
  );

  const denunciasAndamento = denuncias.filter(
    (d) => d.status === 'em_andamento'
  );

  const denunciasFinalizadas = denuncias.filter(
    (d) => d.status === 'resolvido'
  );

  const denunciasFiltradas =
    sessaoAtiva === 'aberto'
      ? denunciasAbertas
      : sessaoAtiva === 'em_andamento'
      ? denunciasAndamento
      : denunciasFinalizadas;

  return (
    <div
      className="container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <header
        className="header"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div className="logo-group">
          <img src={logoSos} alt="SOS Animais" width="120" />

          <span
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              marginLeft: '15px'
            }}
          >
            Painel de Triagem
          </span>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            className="btn-outline"
            onClick={props.onVoltar}
          >
            Voltar
          </button>

          {usuarioLogado?.is_superuser && (
            <>
              <button
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={props.onIrUsuarios}
              >
                Gerenciar Usuários
              </button>

              <button
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={props.onIrParaCadastro}
              >
                + Cadastrar Protetor
              </button>
            </>
          )}

          <button
            onClick={efetuarLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main
        style={{
          padding: '30px',
          flex: 1
        }}
      >
        <h2>Ocorrências Registradas</h2>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '25px',
            position: 'sticky',
            top: 0,
            background: '#f8f8f8',
            padding: '15px 0',
            zIndex: 10
          }}
        >
          <button
            onClick={() => setSessaoAtiva('aberto')}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              background:
                sessaoAtiva === 'aberto' ? '#dc3545' : '#eee',
              color:
                sessaoAtiva === 'aberto' ? 'white' : '#333',
              fontWeight: 'bold'
            }}
          >
            Em Aberto ({denunciasAbertas.length})
          </button>

          <button
            onClick={() => setSessaoAtiva('em_andamento')}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              background:
                sessaoAtiva === 'em_andamento'
                  ? '#ffc107'
                  : '#eee',
              color: '#333',
              fontWeight: 'bold'
            }}
          >
            Em Atendimento ({denunciasAndamento.length})
          </button>

          <button
            onClick={() => setSessaoAtiva('resolvido')}
            style={{
              padding: '12px 16px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              background:
                sessaoAtiva === 'resolvido'
                  ? '#28a745'
                  : '#eee',
              color:
                sessaoAtiva === 'resolvido'
                  ? 'white'
                  : '#333',
              fontWeight: 'bold'
            }}
          >
            Finalizadas ({denunciasFinalizadas.length})
          </button>
        </div>

        {carregando && <p>Carregando denúncias...</p>}
        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        {!carregando && !erro && (
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 15 }}>Protocolo</th>
                  <th style={{ padding: 15 }}>Animal</th>
                  <th style={{ padding: 15 }}>Risco</th>
                  <th style={{ padding: 15 }}>Status</th>
                  <th style={{ padding: 15 }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {denunciasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: 20 }}>
                      Nenhuma denúncia.
                    </td>
                  </tr>
                ) : (
                  denunciasFiltradas.map((d) => (
                    <tr key={d.protocolo}>
                      <td style={{ padding: 15 }}>
                        {d.protocolo}
                      </td>

                      <td style={{ padding: 15 }}>
                        {d.tipo_animal}
                      </td>

                      <td style={{ padding: 15 }}>
                        {d.tipo_risco}
                      </td>

                      <td style={{ padding: 15 }}>
                        <span style={estiloStatus(d.status)}>
                          {traduzirStatus(d.status)}
                        </span>
                      </td>

                      <td style={{ padding: 15 }}>
                        <button
                          onClick={() => props.onAnalisar(d)}
                          style={{
                            background: '#333',
                            color: 'white',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Analisar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer
        className="footer"
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '10px'
        }}
      >
        <span>
          Secretaria Executiva de Proteção Animal |
          (81) 99312-4632
        </span>

        <img
          src={logoOlinda}
          alt="Olinda"
          width="90"
          style={{
            position: 'absolute',
            right: 0,
            bottom: '-10px'
          }}
        />
      </footer>
    </div>
  );
};

export default PainelAdmin;