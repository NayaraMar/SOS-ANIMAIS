import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';
import imgAnimais from '../assets/imgAnimais.png';
const Login = (props) => {
  // Estado que guarda o valor do CPF
  const [cpf, setCpf] = useState('');

  // Função que limpa e formata o texto digitado
  const formatarCpf = (evento) => {
    let valor = evento.target.value;

    // Remove tudo o que não for número (bloqueia letras)
    valor = valor.replace(/\D/g, '');

    // Limita a quantidade máxima de números para 11
    valor = valor.substring(0, 11);

    // Adiciona os pontos e o traço progressivamente
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    setCpf(valor);
  };
  return (
    <div className="container">
      <header className="header" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-outline" onClick={props.onVoltar}>
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
        <div className="login-box" style={{ width: '350px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src={logoSos} alt="Logo" width="100" />
            <h2 style={{ margin: '10px 0 5px 0' }}>Bem vindo, Protetor!</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Entre com suas credenciais
            </p>
          </div>

          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px' }}>
                CPF
              </label>
              <input
                type="text"
                value={cpf}
                onChange={formatarCpf}
                placeholder="000.000.000-00"
                maxLength="14"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px' }}>
                Senha
              </label>
              <input
                type="password"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #DDD',
                }}
              />
            </div>

            <button
              style={{
                background: '#333',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              Entrar
            </button>
          </form>
        </div>

        <img src={imgAnimais} alt="Animais" style={{ width: '400px' }} />
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
        <span>Secretaria Executiva de Proteção Animal | (81)99312-4632</span>

        <img
          src={logoOlinda}
          alt="Olinda"
          width="90"
          style={{ position: 'absolute', right: '0', bottom: '-10px' }}
        />
      </footer>
    </div>
  );
};
export default Login;
