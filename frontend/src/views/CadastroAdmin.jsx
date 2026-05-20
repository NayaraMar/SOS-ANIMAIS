import React, { useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const CadastroAdmin = (props) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
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
      const response = await fetch('http://localhost:8000/api/admin/registrar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          cpf: cpfLimpo,
          senha: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Novo administrador cadastrado com sucesso!');
        setNome('');
        setCpf('');
        setSenha('');
        setConfirmarSenha('');
      } else {
        setMensagem(data.error || 'Erro ao realizar o cadastro.');
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
          Voltar para o Painel
        </button>
      </header>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0', flex: 1 }}>
        <div className="login-box" style={{ width: '400px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 5px 0' }}>Cadastrar Administrador</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Registre um novo usuário com privilégios de triagem.
            </p>
          </div>

          <form onSubmit={cadastrarNovoAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Nome Completo */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Nome Completo *</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome do novo admin" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
            </div>

            {/* CPF */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>CPF *</label>
              <input type="text" value={cpf} onChange={formatarCpf} placeholder="000.000.000-00" maxLength="14" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
            </div>

            {/* Senha */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Senha Inicial *</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="No mínimo 6 caracteres" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
            </div>

            {/* Confirmar Senha */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Confirmar Senha *</label>
              <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Digite a senha novamente" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #DDD' }} />
            </div>

            {/* Mensagens de feedback */}
            {mensagem && (
              <div style={{ fontSize: '13px', padding: '10px', borderRadius: '6px', background: mensagem.includes('sucesso') ? '#e6f4ea' : '#fce8e6', color: mensagem.includes('sucesso') ? 'green' : 'red', fontWeight: '500', textAlign: 'center' }}>
                {mensagem}
              </div>
            )}

            <button type="submit" disabled={carregando} style={{ background: '#333', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', opacity: carregando ? 0.7 : 1, marginTop: '5px' }}>
              {carregando ? 'Cadastrando...' : 'CONCLUIR CADASTRO'}
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

export default CadastroAdmin;