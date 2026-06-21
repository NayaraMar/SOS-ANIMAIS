import React, { useEffect, useState } from 'react';
import logoSos from '../assets/logoSOS.png';
import logoOlinda from '../assets/logoOlinda.png';

const GerenciarUsuarios = ({ onVoltar }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:8000/api/usuarios/',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        setErro('Erro ao carregar usuários');
      }
    } catch {
      setErro('Erro ao conectar com servidor');
    } finally {
      setCarregando(false);
    }
  };

  const excluirUsuario = async (id) => {
    const confirmar = window.confirm(
      'Deseja realmente excluir este usuário?'
    );

    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:8000/api/usuarios/${id}/excluir/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setUsuarios(
          usuarios.filter((u) => u.id !== id)
        );
      } else {
        alert('Erro ao excluir usuário');
      }
    } catch {
      alert('Erro ao conectar com servidor');
    }
  };

  const editarUsuario = async (usuario) => {
    const novoNome = prompt(
      'Novo nome:',
      usuario.nome
    );

    if (!novoNome) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:8000/api/usuarios/${usuario.id}/editar/`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: novoNome
          })
        }
      );

      if (response.ok) {
        setUsuarios(
          usuarios.map((u) =>
            u.id === usuario.id
              ? { ...u, nome: novoNome }
              : u
          )
        );
      } else {
        alert('Erro ao editar');
      }
    } catch {
      alert('Erro ao conectar');
    }
  };

  const badgeTipo = (usuario) => ({
    background: usuario.is_superuser
      ? '#fde7e7'
      : '#e7f3ff',
    color: usuario.is_superuser
      ? '#b42318'
      : '#175cd3',
    padding: '5px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  });

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
          padding: '20px'
        }}
      >
        <img src={logoSos} alt="Logo" width="120" />

        <button
          className="btn-outline"
          onClick={onVoltar}
        >
          Voltar
        </button>
      </header>

      <main style={{ padding: '20px', flex: 1 }}>
        <h2 style={{ marginBottom: '5px' }}>
          Gerenciar Usuários
        </h2>

        <p style={{ color: '#666', marginTop: 0 }}>
          Administre usuários comuns e super usuários
        </p>

        {carregando && <p>Carregando...</p>}
        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        {!carregando && !erro && (
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              overflowX: 'auto',
              marginTop: '20px'
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: '900px',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr style={{ background: '#f7f7f7' }}>
                  <th style={{ padding: '18px' }}>Nome</th>
                  <th style={{ padding: '18px' }}>CPF</th>
                  <th style={{ padding: '18px' }}>E-mail</th>
                  <th style={{ padding: '18px' }}>Tipo</th>
                  <th style={{ padding: '18px' }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      {u.nome}
                    </td>

                    <td style={{ padding: '16px' }}>
                      {u.cpf}
                    </td>

                    <td style={{ padding: '16px' }}>
                      {u.email || 'Sem e-mail'}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={badgeTipo(u)}>
                        {u.is_superuser
                          ? 'Superuser'
                          : 'Usuário'}
                      </span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px'
                        }}
                      >
                        <button
                          onClick={() =>
                            editarUsuario(u)
                          }
                          style={{
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            excluirUsuario(u.id)
                          }
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer
        className="footer"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <span>
          Secretaria Executiva de Proteção Animal |
          (81) 99312-4632
        </span>

        <img
          src={logoOlinda}
          alt="Olinda"
          width="70"
        />
      </footer>
    </div>
  );
};

export default GerenciarUsuarios;