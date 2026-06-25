import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const AnaliseDenuncia = ({ denuncia, onVoltar }) => {
  const [statusAtual, setStatusAtual] = useState(
    denuncia?.status || 'aberto'
  );
  const [carregando, setCarregando] = useState(false);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  if (!denuncia) return null;

  const obterUrlImagem = (caminho) => {
    if (!caminho) return null;

    if (caminho.startsWith('http')) return caminho;

    const caminhoFormatado = caminho.startsWith('/')
      ? caminho
      : `/${caminho}`;

    return `http://localhost:8000${caminhoFormatado}`;
  };

  const traduzirStatus = (status) => {
    switch (status) {
      case 'aberto':
        return 'Aberto';
      case 'em_andamento':
        return 'Em andamento';
      case 'resolvido':
        return 'Resolvido';
      default:
        return status;
    }
  };

  const alterarStatus = async (novoStatus) => {
    setCarregando(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/denuncias/status/',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            protocolo: denuncia.protocolo,
            status: novoStatus
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatusAtual(novoStatus);
        alert('Status atualizado com sucesso!');
      } else {
        alert(data.erro || 'Erro ao atualizar');
      }
    } catch (error) {
      alert('Erro ao conectar com servidor');
    } finally {
      setCarregando(false);
    }
  };

  const estiloBotao = {
    border: 'none',
    padding: '12px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const urlImagemFinal = obterUrlImagem(denuncia.imagem);

  return (
    <div className="container">
      <header
        className="header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px'
        }}
      >
        {/* LOGO FIXA */}
        <img src={logoSos} alt="SOS Animais" width="130" />

        <button className="btn-outline" onClick={onVoltar}>
          Voltar
        </button>
      </header>

      <main
        style={{
          padding: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '800px',
            background: '#fff',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ marginBottom: '25px' }}>
            Análise da Denúncia
          </h2>

          <p><b>Protocolo:</b> {denuncia.protocolo}</p>
          <p><b>Animal:</b> {denuncia.tipo_animal}</p>
          <p><b>Tipo de risco:</b> {denuncia.tipo_risco}</p>
          <p><b>Status:</b> {traduzirStatus(statusAtual)}</p>
          <p><b>Descrição:</b> {denuncia.descricao || 'Não informada'}</p>

          <button
            onClick={() => setMostrarInfo(!mostrarInfo)}
            style={{
              marginTop: '20px',
              background: '#6c63ff',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            {mostrarInfo
              ? 'Ocultar informações'
              : 'Mais informações'}
          </button>

          {mostrarInfo && (
            <div
              style={{
                marginTop: '20px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px'
              }}
            >
              <p>
                <b>Endereço:</b>{' '}
                {denuncia.endereco
                  ? denuncia.endereco
                  : `${denuncia.latitude}, ${denuncia.longitude}`}
              </p>

              <div style={{ marginTop: '15px' }}>
                <b>Imagem detalhada:</b>
                <br />

                {urlImagemFinal ? (
                  <img
                    src={urlImagemFinal}
                    alt="Evidência"
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      maxWidth: '400px',
                      borderRadius: '12px'
                    }}
                  />
                ) : (
                  <p>Sem imagem enviada.</p>
                )}
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: '35px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <button
              disabled={carregando}
              onClick={() => alterarStatus('aberto')}
              style={{
                ...estiloBotao,
                background: '#28a745',
                color: 'white',
                opacity: carregando ? 0.6 : 1
              }}
            >
              Marcar como Aberto
            </button>

            <button
              disabled={carregando}
              onClick={() => alterarStatus('em_andamento')}
              style={{
                ...estiloBotao,
                background: '#ffc107',
                color: '#333',
                opacity: carregando ? 0.6 : 1
              }}
            >
              Em Atendimento
            </button>

            <button
              disabled={carregando}
              onClick={() => alterarStatus('resolvido')}
              style={{
                ...estiloBotao,
                background: '#007bff',
                color: 'white',
                opacity: carregando ? 0.6 : 1
              }}
            >
              Finalizar
            </button>
          </div>
        </div>
      </main>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          padding: '20px'
        }}
      >
        <span>Secretaria Executiva de Proteção Animal</span>
        <img src={logoOlinda} alt="Olinda" width="90" />
      </footer>
    </div>
  );
};

export default AnaliseDenuncia;