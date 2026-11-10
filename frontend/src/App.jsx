import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'

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

   const [avaliacoes, setAvaliacoes] = useState([])
   const [mensagem, setMensagem] = useState('')
   const [emailAvaliado, setEmailAvaliado] = useState('')
   const [comentarios, setComentarios] = useState('')
   const [nota, setNota] = useState('')

   async function listarAvaliacoes() {
     setMensagem('')

     try {
       const token = await getAccessTokenSilently()

       const resposta = await fetch('http://localhost:8081/avaliacoes', {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       })

       if (!resposta.ok) {
         throw new Error(`Erro ao listar: HTTP ${resposta.status}`)
       }

       const dados = await resposta.json()
       setAvaliacoes(dados)

       if (dados.length === 0) {
         setMensagem('Nenhuma avaliação cadastrada.')
       }
     } catch (erro) {
       setMensagem(erro.message)
     }
   }

   async function cadastrarAvaliacao(event) {
     event.preventDefault()
     setMensagem('')

     try {
       const token = await getAccessTokenSilently()

       const resposta = await fetch('http://localhost:8081/avaliacoes', {
         method: 'POST',
         headers: {
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           emailAvaliador: user.email,
           emailAvaliado,
           comentarios,
           nota: Number(nota),
         }),
       })

       if (!resposta.ok) {
         throw new Error(`Erro ao cadastrar: HTTP ${resposta.status}`)
       }

       setEmailAvaliado('')
       setComentarios('')
       setNota('')

       await listarAvaliacoes()
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
      <h1>Sistema de Avaliações</h1>

      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>
          Entrar
        </button>
      ) : (
        <>
          <p>Conectado como: {user.email}</p>

          <form onSubmit={cadastrarAvaliacao}>
            <h2>Cadastrar avaliação</h2>

            <label>
              E-mail do avaliado:
              <input
                type="email"
                value={emailAvaliado}
                onChange={(event) => setEmailAvaliado(event.target.value)}
                required
              />
            </label>

            <label>
              Comentários:
              <textarea
                value={comentarios}
                onChange={(event) => setComentarios(event.target.value)}
                required
              />
            </label>

            <label>
              Nota:
              <input
                type="number"
                min="0"
                max="10"
                step="1"
                value={nota}
                onChange={(event) => setNota(event.target.value)}
                required
              />
            </label>

            <button type="submit">Cadastrar</button>
          </form>

          <button onClick={listarAvaliacoes}>
            Listar avaliações
          </button>

          <p>{mensagem}</p>

          <ul>
            {avaliacoes.map((avaliacao) => (
              <li key={avaliacao.id}>
                {avaliacao.emailAvaliador} avaliou {avaliacao.emailAvaliado}
                {' — Nota: '}{avaliacao.nota}
                {' — '}{avaliacao.comentarios}
                {' — Data: '}{avaliacao.dataAvaliacao}
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