import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';
import imgAnimais from '../assets/imgAnimais.png';

const RecuperarSenha = (props) => {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [etapa, setEtapa] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const formatarCpf = (evento) => {
    let valor = evento.target.value;

    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    setCpf(valor);
  };

  const recuperarSenha = async (evento) => {
    evento.preventDefault();
    setMensagem('');
    setCarregando(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/recuperar-senha/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cpf: cpf.replace(/\D/g, ''),
            email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensagem('Código enviado para seu e-mail.');
        setEtapa(2);
      } else {
        setMensagem(data.error || 'Erro ao recuperar senha');
      }
    } catch {
      setMensagem('Erro ao conectar com servidor');
    } finally {
      setCarregando(false);
    }
  };

  const redefinirSenha = async (evento) => {
    evento.preventDefault();
    setMensagem('');

    if (novaSenha.length < 6) {
      setMensagem('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/redefinir-senha/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cpf: cpf.replace(/\D/g, ''),
            email,
            codigo,
            nova_senha: novaSenha,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensagem('Senha redefinida com sucesso! Redirecionando...');

        setTimeout(() => {
          props.onVoltar();
        }, 2000);
      } else {
        setMensagem(data.error || 'Erro ao redefinir senha');
      }
    } catch {
      setMensagem('Erro ao conectar com servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <header
        className="header"
        style={{ justifyContent: 'flex-end' }}
      >
        <button
          className="btn-outline"
          onClick={props.onVoltar}
        >
          Voltar
        </button>
      </header>

      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '80px',
          flex: 1,
        }}
      >
        <div
          className="login-box"
          style={{
            width: '380px',
            background: '#fff',
            padding: '35px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <img src={logoSos} alt="Logo" width="100" />

            <h2 style={{ margin: '15px 0 5px' }}>
              Recuperar Senha
            </h2>

            <p
              style={{
                color: '#666',
                fontSize: '14px',
              }}
            >
              {etapa === 1
                ? 'Informe seu CPF e e-mail cadastrado'
                : 'Digite o código enviado e sua nova senha'}
            </p>
          </div>

          {etapa === 1 ? (
            <form
              onSubmit={recuperarSenha}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <input
                type="text"
                value={cpf}
                onChange={formatarCpf}
                placeholder="CPF"
                required
                style={inputStyle}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                style={inputStyle}
              />

              {mensagem && (
                <Mensagem mensagem={mensagem} />
              )}

              <button
                type="submit"
                disabled={carregando}
                style={botaoStyle}
              >
                {carregando
                  ? 'Enviando...'
                  : 'Enviar recuperação'}
              </button>
            </form>
          ) : (
            <form
              onSubmit={redefinirSenha}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <input
                type="text"
                value={codigo}
                onChange={(e) =>
                  setCodigo(e.target.value)
                }
                placeholder="Código de 6 dígitos"
                required
                style={inputStyle}
              />

              <input
                type="password"
                value={novaSenha}
                onChange={(e) =>
                  setNovaSenha(e.target.value)
                }
                placeholder="Nova senha"
                required
                style={inputStyle}
              />

              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
                placeholder="Confirmar senha"
                required
                style={inputStyle}
              />

              {mensagem && (
                <Mensagem mensagem={mensagem} />
              )}

              <button
                type="submit"
                disabled={carregando}
                style={botaoStyle}
              >
                {carregando
                  ? 'Redefinindo...'
                  : 'Redefinir senha'}
              </button>
            </form>
          )}
        </div>

        <img
          src={imgAnimais}
          alt="Animais"
          style={{ width: '400px' }}
        />
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
            bottom: '-10px',
          }}
        />
      </footer>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #DDD',
  fontSize: '14px',
};

const botaoStyle = {
  background: '#333',
  color: '#fff',
  padding: '14px',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px',
};

const Mensagem = ({ mensagem }) => (
  <div
    style={{
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '500',
      color:
        mensagem.includes('sucesso') ||
        mensagem.includes('enviado') ||
        mensagem.includes('Redirecionando')
          ? 'green'
          : 'red',
    }}
  >
    {mensagem}
  </div>
);

export default RecuperarSenha;