import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const Denuncia = (props) => {
  const [tipoAnimal, setTipoAnimal] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const capturarImagem = (evento) => {
    if (evento.target.files && evento.target.files[0]) {
      setImagem(evento.target.files[0]);
    }
  };

  const enviarDenuncia = async (evento) => {
    evento.preventDefault();
    setMensagem('');
    setCarregando(true);

    const formData = new FormData();
    formData.append('tipo_animal', tipoAnimal);
    formData.append('tipo_ocorrencia', tipoOcorrencia);
    formData.append('localizacao', localizacao);
    formData.append('descricao', descricao);
    
    if (imagem) {
      formData.append('imagem', imagem);
    }

    try {
      const response = await fetch('http://localhost:8000/api/denuncias/nova/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(`Denúncia registrada com sucesso! Guarde seu protocolo: ${data.protocolo}`);
        setTipoAnimal('');
        setTipoOcorrencia('');
        setLocalizacao('');
        setDescricao('');
        setImagem(null);
        document.getElementById('input-foto').value = '';
      } else {
        setMensagem(data.error || 'Erro ao submeter denúncia.');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
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

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px 0', flex: 1 }}>
        <div className="login-box" style={{ width: '450px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>Registrar Denúncia</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Forneça os detalhes do caso de maus-tratos ou abandono.
            </p>
          </div>

          <form onSubmit={enviarDenuncia} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Tipo do Animal *</label>
              <select value={tipoAnimal} onChange={(e) => setTipoAnimal(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD', background: '#fff' }}>
                <option value="">Selecione...</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Cavalo">Equino/Cavalo</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Tipo da Ocorrência *</label>
              <select value={tipoOcorrencia} onChange={(e) => setTipoOcorrencia(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD', background: '#fff' }}>
                <option value="">Selecione...</option>
                <option value="Maus-tratos físicos">Maus-tratos físicos / Agressão</option>
                <option value="Abandono">Abandono em via pública</option>
                <option value="Privação de alimento/água">Privação de alimento ou água</option>
                <option value="Animal acorrentado">Animal severamente acorrentado</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Localização / Endereço *</label>
              <input type="text" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} placeholder="Ex: Rua do Sol, Nº 10, Carmo, Olinda" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Descrição dos Fatos *</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva a situação do animal em detalhes..." required rows="4" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD', resize: 'none', fontFamily: 'inherit' }}></textarea>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Foto da Evidência (Opcional)</label>
              <input id="input-foto" type="file" accept="image/*" onChange={capturarImagem} style={{ fontSize: '14px' }} />
            </div>

            {mensagem && (
              <div style={{ fontSize: '13px', padding: '10px', borderRadius: '6px', background: mensagem.includes('sucesso') ? '#e6f4ea' : '#fce8e6', color: mensagem.includes('sucesso') ? 'green' : 'red', fontWeight: '500', textAlign: 'center' }}>
                {mensagem}
              </div>
            )}

            <button type="submit" disabled={carregando} style={{ background: '#333', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', opacity: carregando ? 0.7 : 1, marginTop: '5px' }}>
              {carregando ? 'Enviando denúncia...' : 'SUBMETER OCORRÊNCIA'}
            </button>
          </form>
        </div>
      </main>

      <footer className="footer" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px' }}>
        <span>Secretaria Executiva de Proteção Animal | (81) 99312-4632</span>
        <img src={logoOlinda} alt="Olinda" width="90" style={{ position: 'absolute', right: '0', bottom: '-10px' }} />
      </footer>
    </div>
  );
};

export default Denuncia;