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

  useEffect(() => {
    carregarOpcoes();
    pegarLocalizacao();
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
      console.error('Erro ao carregar opções:', error);
    }
  };

  const pegarLocalizacao = () => {
    if (!navigator.geolocation) {
      setMensagem('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setMensagem('Não foi possível obter localização.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const capturarImagem = (evento) => {
    if (evento.target.files && evento.target.files[0]) {
      setImagem(evento.target.files[0]);
    }
  };

  const enviarDenuncia = async (evento) => {
    evento.preventDefault();
    setMensagem('');
    setCarregando(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/denuncias/criar/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tipo_animal: tipoAnimal,
            tipo_risco: tipoOcorrencia,
            descricao: descricao,
            endereco: localizacao,
            latitude: latitude,
            longitude: longitude,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensagem(
          `Denúncia registrada com sucesso! Protocolo: ${data.protocolo}`
        );

        setTipoAnimal('');
        setTipoOcorrencia('');
        setLocalizacao('');
        setDescricao('');
        setImagem(null);

        const inputFoto = document.getElementById('input-foto');
        if (inputFoto) {
          inputFoto.value = '';
        }
      } else {
        setMensagem(data.erro || 'Erro ao registrar denúncia.');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <header
        className="header"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="logo-group">
          <img src={logoSos} alt="SOS Animais" width="120" />
        </div>

        <button className="btn-outline" onClick={props.onVoltar}>
          Voltar para Home
        </button>
      </header>

      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '30px 0',
          flex: 1,
        }}
      >
        <div
          className="login-box"
          style={{
            width: '450px',
            background: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <h2 style={{ margin: '0 0 5px 0' }}>
              Registrar Denúncia
            </h2>

            <p
              style={{
                color: '#666',
                fontSize: '14px',
                margin: 0,
              }}
            >
              Forneça os detalhes do caso.
            </p>
          </div>

          <form
            onSubmit={enviarDenuncia}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>
                Tipo do Animal *
              </label>

              <select
                value={tipoAnimal}
                onChange={(e) => setTipoAnimal(e.target.value)}
                required
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                  background: '#fff',
                }}
              >
                <option value="">Selecione...</option>

                {tiposAnimal.map((animal) => (
                  <option key={animal.valor} value={animal.valor}>
                    {animal.nome}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>
                Tipo da Ocorrência *
              </label>

              <select
                value={tipoOcorrencia}
                onChange={(e) => setTipoOcorrencia(e.target.value)}
                required
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                  background: '#fff',
                }}
              >
                <option value="">Selecione...</option>

                {tiposRisco.map((risco) => (
                  <option key={risco.valor} value={risco.valor}>
                    {risco.nome}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>
                Localização / Endereço *
              </label>

              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Digite o endereço"
                required
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                }}
              />
            </div>

            <button
              type="button"
              onClick={pegarLocalizacao}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#444',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Usar minha localização
            </button>

            {latitude && longitude && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#555',
                  background: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '6px',
                }}
              >
                Latitude: {latitude}
                <br />
                Longitude: {longitude}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>
                Descrição *
              </label>

              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva a situação"
                required
                rows="4"
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>
                Foto (Opcional)
              </label>

              <input
                id="input-foto"
                type="file"
                accept="image/*"
                onChange={capturarImagem}
              />
            </div>

            {mensagem && (
              <div
                style={{
                  fontSize: '13px',
                  padding: '10px',
                  borderRadius: '6px',
                  background: mensagem.includes('sucesso') ? '#e6f4ea' : '#fce8e6',
                  color: mensagem.includes('sucesso') ? 'green' : 'red',
                  fontWeight: '500',
                  textAlign: 'center',
                }}
              >
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              style={{
                background: '#333',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {carregando ? 'Enviando denúncia...' : 'SUBMETER OCORRÊNCIA'}
            </button>
          </form>
        </div>
      </main>

      <footer
        className="footer"
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '10px',
        }}
      >
        <span>
          Secretaria Executiva de Proteção Animal | (81) 99312-4632
        </span>

        <img
          src={logoOlinda}
          alt="Olinda"
          width="90"
          style={{
            position: 'absolute',
            right: '0',
            bottom: '-10px',
          }}
        />
      </footer>
    </div>
  );
};

export default Denuncia;