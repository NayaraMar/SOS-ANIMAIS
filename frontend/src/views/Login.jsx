import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';
import imgAnimais from '../assets/imgAnimais.png';

const Login = (props) => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const recaptchaRef = useRef(null);

  const formatarCpf = (evento) => {
    let valor = evento.target.value;

    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    setCpf(valor);
  };

  const validarCpf = (cpf) => {
    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
  };

  const fazerLogin = async (evento) => {
    evento.preventDefault();

    setMensagem('');

    const cpfLimpo = cpf.replace(/\D/g, '');
    console.log('CPF:', cpfLimpo);
    console.log('Tamanho:', cpfLimpo.length);

    if (cpfLimpo.length !== 11) {
      setMensagem('CPF deve conter 11 números');
      return;
    }

    if (!validarCpf(cpfLimpo)) {
      setMensagem('CPF inválido');
      return;
    }

    if (!senha || senha.length < 6) {
      setMensagem('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!recaptchaToken) {
      setMensagem('Confirme o reCAPTCHA');
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cpf: cpfLimpo,
            senha,
            recaptcha_token: recaptchaToken,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem('token', data.access);

        localStorage.setItem(
          'usuario',
          JSON.stringify(data.usuario)
        );

        setMensagem('Login realizado com sucesso');

        setTimeout(() => {
          props.onLoginSucesso(data.usuario);
        }, 1000);

      } else {
        setMensagem(
          data.error ||
          'CPF ou senha inválidos'
        );
      }

    } catch (error) {
      console.error(error);
      setMensagem('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);

      setRecaptchaToken(null);

      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
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
          Voltar para tela inicial
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
          style={{ width: '350px' }}
        >

          <div
            style={{
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <img
              src={logoSos}
              alt="Logo"
              width="100"
            />

            <h2
              style={{
                margin: '10px 0 5px 0',
              }}
            >
              Bem-vindo, Protetor!
            </h2>

            <p
              style={{
                color: '#666',
                fontSize: '14px',
              }}
            >
              Entre com suas credenciais
            </p>
          </div>

          <form
            onSubmit={fazerLogin}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <label
                style={{
                  fontSize: '12px',
                  marginBottom: '5px',
                }}
              >
                CPF
              </label>

              <input
                type="text"
                value={cpf}
                onChange={formatarCpf}
                placeholder="000.000.000-00"
                maxLength="14"
                required
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <label
                style={{
                  fontSize: '12px',
                  marginBottom: '5px',
                }}
              >
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                required
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                }}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={props.onEsqueciSenha}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Esqueci minha senha
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px',
              }}
            >
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LdkYdssAAAAALtVnjoAx19CqXXM1e33cH16E8su"
                onChange={(token) =>
                  setRecaptchaToken(token)
                }
              />
            </div>

            {mensagem && (
              <div
                style={{
                  fontSize: '13px',
                  color: mensagem.includes('sucesso')
                    ? 'green'
                    : 'red',
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
                marginTop: '10px',
                cursor: 'pointer',
                opacity: carregando ? 0.7 : 1,
                fontWeight: 'bold',
              }}
            >
              {carregando
                ? 'Entrando...'
                : 'Entrar'}
            </button>

          </form>
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
            right: '0',
            bottom: '-10px',
          }}
        />
      </footer>

    </div>
  );
};

export default Login;