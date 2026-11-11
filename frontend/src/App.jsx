import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

function App() {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    error,
    getAccessTokenSilently,
  } = useAuth0()

   const [tarefas, settarefas] = useState([])
   const [mensagem, setMensagem] = useState('')
   const [titulo, setTitulo] = useState('')
   const [emailCriador, setEmailCriador] = useState('')
   const [descricao, setDescricao] = useState('')
   const [prioridade, setPrioridade] = useState('')

   async function listarTarefas() {
     setMensagem('')

     try {
       const token = await getAccessTokenSilently()

       const resposta = await fetch(`${API_URL}/tarefas`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       })

       if (!resposta.ok) {
         throw new Error(`Erro ao listar: HTTP ${resposta.status}`)
       }

       const dados = await resposta.json()

       if (dados.length === 0) {
         setMensagem('Nenhuma tarefa cadastrada.')
       }
     } catch (erro) {
       setMensagem(erro.message)
     }
   }

   async function cadastrarTarefa(event) {
     event.preventDefault()
     setMensagem('')

     try {
       const token = await getAccessTokenSilently()

       const resposta = await fetch(`${API_URL}/tarefas`, {
         method: 'POST',
         headers: {
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           emailCriador: user.email,
           titulo,
           descricao,
           prioridade: Number(prioridade),
         }),
       })

       if (!resposta.ok) {
         throw new Error(`Erro ao cadastrar: HTTP ${resposta.status}`)
       }

       setEmailCriador('')
       setTitulo('')
       setDescricao('')
       setPrioridade('')

       await listarTarefas()
     } catch (erro) {
       setMensagem(erro.message)
     }
   }

  if (isLoading) {
    return <p>Carregando...</p>
  }

  if (error) {
    return <p>Erro: {error.message}</p>
  }

  return (
    <main>
      <h1>Sistema de Tarefas</h1>

      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>
          Entrar
        </button>
      ) : (
        <>
          <p>Conectado como: {user.email}</p>

          <form onSubmit={cadastrarTarefa}>
            <h2>Cadastrar tarefa</h2>

            <label>
              E-mail do criador:
              <input
                type="email"
                value={emailCriador}
                onChange={(event) => setEmailCriador(event.target.value)}
                required
              />
            </label>

            <label>
              Título:
              <textarea
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                required
              />
            </label>

            <label>
              Descrição:
              <textarea
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                required
              />
            </label>

            <label>
              Prioridade:
              <input
                type="number"
                min="0"
                max="10"
                step="1"
                value={prioridade}
                onChange={(event) => setPrioridade(event.target.value)}
                required
              />
            </label>

            <button type="submit">Cadastrar</button>
          </form>

          <button onClick={listarTarefas}>
            Listar tarefas
          </button>

          <p>{mensagem}</p>

          <ul>
            {tarefas.map((tarefa) => (
              <li key={tarefa.id}>
                {' — Prioridade: '}{tarefa.prioridade}
                {' — '}{tarefa.titulo}
                {' — '}{tarefa.descricao}
              </li>
            ))}
          </ul>

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
          >
            Sair
          </button>
        </>
      )}
    </main>
  )
}

export default App