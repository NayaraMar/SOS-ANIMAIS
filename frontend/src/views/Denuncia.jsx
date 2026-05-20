import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const Denuncia = (props) => {
  const [tipoAnimal, setTipoAnimal] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [contato, setContato] = useState('');
  const [imagem, setImagem] = useState(null);
  
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerenciarArquivo = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
    }
  };

  const enviarDenuncia = async (evento) => {
    evento.preventDefault();
    setMensagem('');

    // Validação de Regra de Negócio (RB01 / RNF04: Imagem + Localização Obrigatórias)
    if (!localizacao) {
      setMensagem('A localização/endereço é obrigatória.');
      return;
    }
    if (!imagem) {
      setMensagem('É obrigatório fazer o upload de pelo menos 1 imagem como evidência.');
      return;
    }

    setCarregando(true);

    // Como temos arquivo físico (imagem), precisamos usar FormData para enviar ao Django
    const formData = new FormData();
    formData.append('tipo_animal', tipoAnimal);
    formData.append('tipo_ocorrencia', tipoOcorrencia);
    formData.append('descricao', descricao);
    formData.append('localizacao', localizacao);
    formData.append('contato', contato); // Opcional (RF7)
    formData.append('imagem', imagem);

    try {
      const response = await fetch('http://localhost:8000/api/denuncias/', {
        method: 'POST',
        body: formData, // O Django recebe multipart/form-data aqui
      });

      const data = await response.json();

      if (response.ok) {
        // Exibe o protocolo gerado automaticamente pelo backend (RF20 e RF21)
        setMensagem(`Denúncia registrada com sucesso! Guarde seu protocolo: ${data.protocolo}`);
        
        // Limpa o formulário após o sucesso
        setTipoAnimal('');
        setTipoOcorrencia('');
        setDescricao('');
        setLocalizacao('');
        setContato('');
        setImagem(null);
        evento.target.reset();
      } else {
        setMensagem(data.error || 'Erro ao registrar denúncia. Verifique os campos.');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor do backend.');
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
          Voltar para tela inicial
        </button>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0', flex: 1 }}>
        <div className="login-box" style={{ width: '450px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>Nova Denúncia</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Insira os detalhes abaixo para registrar a ocorrência.
            </p>
          </div>

          <form onSubmit={enviarDenuncia} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Tipo de Animal (RF05) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Tipo de Animal *</label>
              <select value={tipoAnimal} onChange={(e) => setTipoAnimal(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }}>
                <option value="">Selecione...</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Cavalo">Cavalo</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Tipo de Ocorrência (RF04) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Tipo de Ocorrência *</label>
              <select value={tipoOcorrencia} onChange={(e) => setTipoOcorrencia(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }}>
                <option value="">Selecione...</option>
                <option value="Violência física">Violência física</option>
                <option value="Maus-tratos">Maus-tratos</option>
                <option value="Em perigo">Em perigo</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Localização (RF01 / RNF04) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Localização / Endereço Completo *</label>
              <input type="text" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} placeholder="Ex: Rua, Número, Bairro, Ponto de referência" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
            </div>

            {/* Descrição em Texto (RF6) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Descrição do Caso</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva a situação atual do animal..." rows="3" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD', resize: 'none' }}></textarea>
            </div>

            {/* Upload de Imagem (RF02 / RNF04) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Evidência Fotográfica (Imagem) *</label>
              <input type="file" accept="image/*" onChange={gerenciarArquivo} required style={{ fontSize: '13px' }} />
            </div>

            {/* Informar Contato Opcional (RF7) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', color: '#555' }}>E-mail ou Telefone para receber o protocolo (Opcional)</label>
              <input type="text" value={contato} onChange={(e) => setContato(e.target.value)} placeholder="exemplo@email.com ou (81) 99999-9999" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
            </div>

            {/* Exibição de Mensagens de Erro ou Sucesso */}
            {mensagem && (
              <div style={{ fontSize: '13px', padding: '10px', borderRadius: '6px', background: mensagem.includes('sucesso') ? '#e6f4ea' : '#fce8e6', color: mensagem.includes('sucesso') ? 'green' : 'red', fontWeight: '500', textAlign: 'center' }}>
                {mensagem}
              </div>
            )}

            <button type="submit" disabled={carregando} style={{ background: '#333', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', opacity: carregando ? 0.7 : 1, marginTop: '5px' }}>
              {carregando ? 'Enviando...' : 'SUBMETER DENÚNCIA'}
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