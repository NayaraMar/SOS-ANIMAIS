import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const Acompanhamento = (props) => {
  const [protocolo, setProtocolo] = useState('');
  const [denuncia, setDenuncia] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const buscarProtocolo = async (evento) => {
    evento.preventDefault();

    setMensagem('');
    setDenuncia(null);
    setCarregando(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/denuncias/acompanhar/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            protocolo: protocolo,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDenuncia(data);
      } else {
        setMensagem(
          data.erro ||
          'Protocolo não encontrado.'
        );
      }

    } catch (error) {
      console.error(error);
      setMensagem(
        'Erro ao conectar com o servidor do backend.'
      );
    } finally {
      setCarregando(false);
    }
  };

  const obterEstiloStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'em analise':
        return { background: '#fef7e0', color: '#b06000', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px' };
      case 'resolvido':
        return { background: '#e6f4ea', color: '#137333', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px' };
      case 'rejeitado':
        return { background: '#fce8e6', color: '#a51d24', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px' };
      default:
        return { background: '#e8f0fe', color: '#1a73e8', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px' };
    }
  };

  return (
    <div className="container">
      <header className="header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo-group">
          <img src={logoSos} alt="SOS Animais" width="120" />
        </div>
        <button className="btn-outline" onClick={props.onVoltar}>
          Voltar para Home
        </button>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', flex: 1, gap: '30px' }}>
        <div className="login-box" style={{ width: '450px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>Acompanhar Denúncia</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Insira o número do seu protocolo para verificar o andamento.
            </p>
          </div>

          <form onSubmit={buscarProtocolo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Número do Protocolo *</label>
              <input 
                type="text" 
                value={protocolo} 
                onChange={(e) => setProtocolo(e.target.value.toUpperCase())} 
                placeholder="Ex: C123456" 
                required 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #DDD', fontSize: '16px', textTransform: 'uppercase' }} 
              />
            </div>

            <button type="submit" disabled={carregando} style={{ background: '#333', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', opacity: carregando ? 0.7 : 1 }}>
              {carregando ? 'Buscando...' : 'CONSULTAR STATUS'}
            </button>
          </form>

          {mensagem && (
            <div style={{ marginTop: '20px', fontSize: '14px', padding: '12px', borderRadius: '6px', background: '#fce8e6', color: '#a51d24', fontWeight: '500', textAlign: 'center' }}>
              {mensagem}
            </div>
          )}
        </div>

        {denuncia && (
          <div style={{ width: '450px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Protocolo: {denuncia.protocolo}</span>
              <span style={obterEstiloStatus(denuncia.status)}>
                {denuncia.status || 'Recebida'}
              </span>
            </div>

            <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p><strong>Animal:</strong> {denuncia.tipo_animal}</p>
              <p><strong>Risco:</strong> {denuncia.tipo_risco}</p>
              <p>
                <strong>Localização:</strong>{' '}
                {denuncia.endereco
                  ? denuncia.endereco
                  : denuncia.latitude && denuncia.longitude
                    ? `${denuncia.latitude}, ${denuncia.longitude}`
                    : 'Não informada'}
              </p>
              <p><strong>Descrição:</strong> {denuncia.descricao}</p>
              {denuncia.prioridade && (
                <p style={{ margin: 0 }}><strong>Prioridade de Atendimento:</strong> {denuncia.prioridade}</p>
              )}
            </div>
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

export default Acompanhamento;