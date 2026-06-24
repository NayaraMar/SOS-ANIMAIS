import { useState, useEffect, useRef } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const Denuncia = (props) => {
  const reconhecimentoDisponivel =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const leituraDisponivel =
    typeof window !== 'undefined' && Boolean(window.speechSynthesis);
  const [tipoAnimal, setTipoAnimal] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [emailContato, setEmailContato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [tiposAnimal, setTiposAnimal] = useState([]);
  const [tiposRisco, setTiposRisco] = useState([]);
  const [vozSuportada] = useState(reconhecimentoDisponivel);
  const [ouvindo, setOuvindo] = useState(false);
  const [textoParcialVoz, setTextoParcialVoz] = useState('');
  const [statusVoz, setStatusVoz] = useState(
    reconhecimentoDisponivel
      ? 'Transcrição por voz disponível.'
      : 'Seu navegador não oferece transcrição por voz nesta tela.'
  );
  const reconhecimentoVozRef = useRef(null);

  const inputStyle = {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const campoComAudioStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 10,
    alignItems: 'stretch',
  };

  const botaoAudioStyle = {
    background: '#4f46e5',
    color: 'white',
    padding: '0 14px',
    border: 'none',
    borderRadius: 12,
    cursor: leituraDisponivel ? 'pointer' : 'not-allowed',
    fontWeight: 700,
    minWidth: 92,
    opacity: leituraDisponivel ? 1 : 0.55,
  };

  async function carregarOpcoes() {
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
  }

  useEffect(() => {
    Promise.resolve().then(carregarOpcoes);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const reconhecimento = new SpeechRecognition();
    reconhecimento.lang = 'pt-BR';
    reconhecimento.continuous = true;
    reconhecimento.interimResults = true;

    reconhecimento.onstart = () => {
      setOuvindo(true);
      setStatusVoz('Microfone ativado. Fale a descrição da denúncia.');
    };

    reconhecimento.onend = () => {
      setOuvindo(false);
      setTextoParcialVoz('');
      setStatusVoz('Transcrição por voz pausada.');
    };

    reconhecimento.onerror = (evento) => {
      setOuvindo(false);
      setTextoParcialVoz('');

      if (evento.error === 'not-allowed') {
        setStatusVoz(
          'Permita o acesso ao microfone no navegador para usar a voz.'
        );
        return;
      }

      if (evento.error === 'no-speech') {
        setStatusVoz('Nenhuma fala foi detectada. Tente novamente.');
        return;
      }

      setStatusVoz('Não foi possível transcrever o áudio.');
    };

    reconhecimento.onresult = (evento) => {
      let textoFinal = '';
      let textoParcial = '';

      for (let i = evento.resultIndex; i < evento.results.length; i += 1) {
        const trecho = evento.results[i][0].transcript;

        if (evento.results[i].isFinal) {
          textoFinal += trecho;
        } else {
          textoParcial += trecho;
        }
      }

      if (textoFinal.trim()) {
        setDescricao((descricaoAtual) => {
          const separador = descricaoAtual.trim() ? ' ' : '';
          return `${descricaoAtual}${separador}${textoFinal.trim()}`;
        });
      }

      setTextoParcialVoz(textoParcial.trim());
    };

    reconhecimentoVozRef.current = reconhecimento;

    return () => {
      reconhecimento.stop();
    };
  }, []);

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

  const alternarTranscricaoPorVoz = () => {
    const reconhecimento = reconhecimentoVozRef.current;

    if (!reconhecimento) {
      setStatusVoz(
        'Seu navegador não oferece transcrição por voz nesta tela.'
      );
      return;
    }

    if (ouvindo) {
      reconhecimento.stop();
      return;
    }

    setTextoParcialVoz('');
    setStatusVoz('Solicitando acesso ao microfone...');

    try {
      reconhecimento.start();
    } catch {
      setStatusVoz('A transcrição por voz já está em andamento.');
    }
  };

  const falarInstrucao = (texto) => {
    if (!leituraDisponivel) {
      setMensagem(
        'Seu navegador não oferece leitura em voz alta nesta tela.'
      );
      return;
    }

    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);

    fala.lang = 'pt-BR';
    fala.rate = 0.95;
    fala.pitch = 1;

    window.speechSynthesis.speak(fala);
  };

  useEffect(() => {
    return () => {
      if (leituraDisponivel) {
        window.speechSynthesis.cancel();
      }
    };
  }, [leituraDisponivel]);

  const resetarFormulario = () => {
    setTipoAnimal('');
    setTipoOcorrencia('');
    setLocalizacao('');
    setEmailContato('');
    setDescricao('');
    setImagem(null);
    setLatitude(null);
    setLongitude(null);
    setTextoParcialVoz('');
    setStatusVoz(vozSuportada ? 'Transcrição por voz disponível.' : '');

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
    formData.append('email_contato', emailContato);
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
            <div style={campoComAudioStyle}>
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

              <button
                type="button"
                onClick={() =>
                  falarInstrucao('Selecione o tipo de animal.')
                }
                disabled={!leituraDisponivel}
                aria-label="Ouvir instrução do tipo de animal"
                style={botaoAudioStyle}
              >
                Ouvir
              </button>
            </div>

            <div style={campoComAudioStyle}>
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

              <button
                type="button"
                onClick={() =>
                  falarInstrucao('Selecione o tipo de risco ou ocorrência.')
                }
                disabled={!leituraDisponivel}
                aria-label="Ouvir instrução do tipo de ocorrência"
                style={botaoAudioStyle}
              >
                Ouvir
              </button>
            </div>

            <div style={campoComAudioStyle}>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Digite o endereço"
                style={inputStyle}
                required
              />

              <button
                type="button"
                onClick={() =>
                  falarInstrucao('Digite o endereço onde a situação está acontecendo.')
                }
                disabled={!leituraDisponivel}
                aria-label="Ouvir instrução do endereço"
                style={botaoAudioStyle}
              >
                Ouvir
              </button>
            </div>

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

            <div style={campoComAudioStyle}>
              <input
                type="email"
                value={emailContato}
                onChange={(e) => setEmailContato(e.target.value)}
                placeholder="Digite seu email para receber o protocolo (opcional)"
                style={inputStyle}
              />

              <button
                type="button"
                onClick={() =>
                  falarInstrucao('Digite seu email se quiser receber o protocolo da denúncia. Este campo é opcional.')
                }
                disabled={!leituraDisponivel}
                aria-label="Ouvir instrução do email"
                style={botaoAudioStyle}
              >
                Ouvir
              </button>
            </div>

            <div>
              <label
                htmlFor="descricao-denuncia"
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontWeight: 700,
                  color: '#1e293b',
                }}
              >
                Descrição da situação
              </label>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 10,
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={alternarTranscricaoPorVoz}
                  disabled={!vozSuportada}
                  aria-pressed={ouvindo}
                  aria-describedby="status-voz-denuncia"
                  style={{
                    background: ouvindo ? '#b91c1c' : '#16a34a',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: 12,
                    cursor: vozSuportada ? 'pointer' : 'not-allowed',
                    fontWeight: 700,
                    opacity: vozSuportada ? 1 : 0.55,
                  }}
                >
                  {ouvindo ? 'Parar voz' : 'Preencher por voz'}
                </button>

                <span
                  id="status-voz-denuncia"
                  role="status"
                  aria-live="polite"
                  style={{
                    alignSelf: 'center',
                    color: '#475569',
                    fontSize: 14,
                  }}
                >
                  {statusVoz}
                </span>
              </div>

              {textoParcialVoz && (
                <div
                  aria-live="polite"
                  style={{
                    background: '#ecfdf5',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 10,
                    fontSize: 14,
                  }}
                >
                  Transcrevendo: {textoParcialVoz}
                </div>
              )}

              <div style={campoComAudioStyle}>
                <textarea
                  id="descricao-denuncia"
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

                <button
                  type="button"
                  onClick={() =>
                    falarInstrucao('Descreva a situação do animal com o máximo de detalhes possível.')
                  }
                  disabled={!leituraDisponivel}
                  aria-label="Ouvir instrução da descrição"
                  style={botaoAudioStyle}
                >
                  Ouvir
                </button>
              </div>
            </div>

            <div style={campoComAudioStyle}>
              <input
                id="input-foto"
                type="file"
                accept="image/*"
                onChange={capturarImagem}
              />

              <button
                type="button"
                onClick={() =>
                  falarInstrucao('Envie uma foto do animal ou da situação, se tiver. Este campo é opcional.')
                }
                disabled={!leituraDisponivel}
                aria-label="Ouvir instrução da foto"
                style={botaoAudioStyle}
              >
                Ouvir
              </button>
            </div>

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
