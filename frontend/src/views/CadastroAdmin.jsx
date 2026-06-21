import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const CadastroAdmin = (props) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('comum');
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

  const cadastrarNovoAdmin = async (evento) => {
    evento.preventDefault();
    setMensagem('');

    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      setMensagem('O CPF deve conter 11 dígitos.');
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem('As senhas não coincidem!');
      return;
    }

    if (senha.length < 6) {
      setMensagem('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:8000/api/usuarios/criar/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            cpf: cpfLimpo,
            email,
            senha,
            is_superuser: tipoUsuario === 'superuser'
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        setNome('');
        setCpf('');
        setEmail('');
        setSenha('');
        setConfirmarSenha('');
        setTipoUsuario('comum');
      } else {
        setMensagem(data.error || 'Erro ao cadastrar');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com backend');
    } finally {
      setCarregando(false);
    }
  };

  const estiloInput = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #d9d9d9',
    fontSize: '15px',
    boxSizing: 'border-box',
    outline: 'none'
  };

  return (
    <div
      className="container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f7fa'
      }}
    >
      <header
        className="header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          padding: '20px'
        }}
      >
        <img src={logoSos} alt="SOS Animais" width="120" />

        <button
          onClick={props.onVoltar}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            background: '#333',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Voltar para o Painel
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            background: '#fff',
            padding: 'clamp(20px, 4vw, 35px)',
            borderRadius: '20px',
            boxShadow: '0 12px 35px rgba(0,0,0,0.08)'
          }}
        >
          <h2
            style={{
              marginBottom: '25px',
              textAlign: 'center',
              color: '#222'
            }}
          >
            Cadastrar Usuário
          </h2>

          <form
            onSubmit={cadastrarNovoAdmin}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              required
              style={estiloInput}
            />

            <input
              type="text"
              value={cpf}
              onChange={formatarCpf}
              placeholder="CPF"
              maxLength="14"
              required
              style={estiloInput}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              style={estiloInput}
            />

            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              style={estiloInput}
            >
              <option value="comum">Usuário Comum</option>
              <option value="superuser">Super Usuário</option>
            </select>

            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
              required
              style={estiloInput}
            />

            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirmar senha"
              required
              style={estiloInput}
            />

            {mensagem && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: mensagem.includes('sucesso')
                    ? '#e8f8ee'
                    : '#ffeaea',
                  color: mensagem.includes('sucesso')
                    ? '#0f7b34'
                    : '#b42318',
                  fontSize: '14px'
                }}
              >
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                border: 'none',
                background: '#28a745',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </main>

      <footer
        className="footer"
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          textAlign: 'center'
        }}
      >
        <span>Secretaria Executiva de Proteção Animal</span>
        <img src={logoOlinda} alt="Olinda" width="70" />
      </footer>
    </div>
  );
};

export default CadastroAdmin;