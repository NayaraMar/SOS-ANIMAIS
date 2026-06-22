import React, { useState, useEffect } from 'react';
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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [tiposAnimal, setTiposAnimal] = useState([]);
  const [tiposRisco, setTiposRisco] = useState([]);

  const inputStyle = {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  };

  useEffect(() => {
    carregarOpcoes();
  }, []);

  const carregarOpcoes = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/api/denuncias/opcoes/'
      );
      const data = await response.json();
      setTiposAnimal(data.tipos_animal || []);
      setTiposRisco(data.tipos_risco || []);
    } catch (error) {
      console.error(error);
    }
  };

  const pegarLocalizacao = () => {
    if (!navigator.geolocation) {
      setMensagem('Geolocalização não suportada.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Number(position.coords.latitude.toFixed(8)));
        setLongitude(Number(position.coords.longitude.toFixed(8)));
      },
      () => {
        setMensagem('Não foi possível obter localização.');
      }
    );
  };

  const capturarImagem = (evento) => {
    if (evento.target.files && evento.target.files[0]) {
      setImagem(evento.target.files[0]);
    }
  };

  const resetarFormulario = () => {
    setTipoAnimal('');
    setTipoOcorrencia('');
    setLocalizacao('');
    setDescricao('');
    setImagem(null);
    setLatitude(null);
    setLongitude(null);

    const inputFoto = document.getElementById('input-foto');
    if (inputFoto) inputFoto.value = '';
  };

  const enviarDenuncia = async (evento) => {
    evento.preventDefault();
    setMensagem('');
    setCarregando(true);

    const formData = new FormData();

    formData.append('tipo_animal', tipoAnimal);
    formData.append('tipo_risco', tipoOcorrencia);
    formData.append('descricao', descricao);
    formData.append('endereco', localizacao);
    formData.append('latitude', latitude ?? '');
    formData.append('longitude', longitude ?? '');

    if (imagem) {
      formData.append('imagem', imagem);
    }

    try {
      const response = await fetch(
        'http://localhost:8000/api/denuncias/criar/',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensagem(
          `Denúncia registrada com sucesso! Protocolo: ${data.protocolo}`
        );
        resetarFormulario();
      } else {
        setMensagem(data.erro || 'Erro ao registrar denúncia.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc, #dbeafe)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
        }}
      >
        <img src={logoSos} alt="SOS" width="130" />

        <button
          onClick={props.onVoltar}
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            border: 'none',
            background: '#1e293b',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Voltar
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <div
          style={{
            width: 550,
            background: 'white',
            padding: 40,
            borderRadius: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ margin: 0, fontSize: 30 }}>
              Registrar Denúncia
            </h2>
            <p style={{ color: '#64748b' }}>
              Informe os dados da ocorrência
            </p>
          </div>

          <form
            onSubmit={enviarDenuncia}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <select
              value={tipoAnimal}
              onChange={(e) => setTipoAnimal(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">Selecione o animal</option>
              {tiposAnimal.map((animal) => (
                <option key={animal.valor} value={animal.valor}>
                  {animal.nome}
                </option>
              ))}
            </select>

            <select
              value={tipoOcorrencia}
              onChange={(e) => setTipoOcorrencia(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">Selecione ocorrência</option>
              {tiposRisco.map((risco) => (
                <option key={risco.valor} value={risco.valor}>
                  {risco.nome}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder="Digite o endereço"
              style={inputStyle}
            />

            <button
              type="button"
              onClick={pegarLocalizacao}
              style={{
                background: '#0ea5e9',
                color: 'white',
                padding: 14,
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Usar minha localização
            </button>

            {latitude && longitude && (
              <div
                style={{
                  background: '#f1f5f9',
                  padding: 14,
                  borderRadius: 12,
                  fontSize: 14,
                }}
              >
                <strong>Localização capturada</strong>
                <br />
                Lat: {latitude}
                <br />
                Long: {longitude}
              </div>
            )}

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a situação"
              required
              style={{
                ...inputStyle,
                minHeight: 120,
                resize: 'none',
              }}
            />

            <input
              id="input-foto"
              type="file"
              accept="image/*"
              onChange={capturarImagem}
            />

            {mensagem && (
              <div
                style={{
                  background: mensagem.includes('sucesso')
                    ? '#dcfce7'
                    : '#fee2e2',
                  color: mensagem.includes('sucesso')
                    ? '#166534'
                    : '#991b1b',
                  padding: 14,
                  borderRadius: 12,
                }}
              >
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              style={{
                background:
                  'linear-gradient(135deg, #111827, #374151)',
                color: 'white',
                padding: 16,
                borderRadius: 14,
                border: 'none',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {carregando ? 'Enviando...' : 'SUBMETER DENÚNCIA'}
            </button>
          </form>
        </div>
      </main>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          padding: 20,
        }}
      >
        <span>
          Secretaria Executiva de Proteção Animal | (81) 99312-4632
        </span>
        <img src={logoOlinda} alt="Olinda" width="90" />
      </footer>
    </div>
  );
};

export default Denuncia;