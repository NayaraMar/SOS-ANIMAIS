import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';
import imgAnimais from '../assets/imgAnimais.png';

const RecuperarSenha = (props) => {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
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
        setMensagem(
          'Instruções de recuperação enviadas para seu e-mail.'
        );
      } else {
        setMensagem(data.error || 'Erro ao recuperar senha');
      }
    } catch (error) {
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
              Informe seu CPF e e-mail cadastrado
            </p>
          </div>

          <form
            onSubmit={recuperarSenha}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div>
              <label
                style={{
                  fontSize: '12px',
                  marginBottom: '5px',
                  display: 'block',
                }}
              >
                CPF
              </label>

              <input
                type="text"
                value={cpf}
                onChange={formatarCpf}
                placeholder="000.000.000-00"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #DDD',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: '12px',
                  marginBottom: '5px',
                  display: 'block',
                }}
              >
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #DDD',
                  fontSize: '14px',
                }}
              />
            </div>

            {mensagem && (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: mensagem.includes('enviadas')
                    ? 'green'
                    : 'red',
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
                color: '#fff',
                padding: '14px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px',
                opacity: carregando ? 0.7 : 1,
              }}
            >
              {carregando
                ? 'Enviando...'
                : 'Enviar recuperação'}
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
            right: 0,
            bottom: '-10px',
          }}
        />
      </footer>
    </div>
  );
};

export default RecuperarSenha;