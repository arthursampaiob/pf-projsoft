# Guia de consulta — prova de Projeto de Software

Este guia usa a base de avaliações que já foi testada. Na prova, adapte o domínio e as regras ao enunciado. Os exemplos com `Produto` e `/produtos` são apenas exemplos de substituição.

## 1. Confira a pasta antes de editar

Use a pasta da prova, separada da pasta do simulado:

```text
C:\Users\asamp\Insper\projsoft\pf-projsoft
```

No terminal local, na raiz do projeto:

```bash
pwd
git remote -v
git status
```

O `origin` deve ser:

```text
https://github.com/arthursampaiob/pf-projsoft.git
```

Não é necessário gerar outro projeto no Spring Initializr. Esta base já tem Java 21, Maven, Spring, PostgreSQL, segurança, React e arquivos de deploy.

## 2. Referência dos ambientes

| Item | Prova | Simulado |
|---|---|---|
| Pasta local | `pf-projsoft` | `avaliacoes` |
| Repositório | `arthursampaiob/pf-projsoft` | `arthursampaiob/simulado-af-projsoft` |
| API local pelo Docker | `http://localhost:8082` | `http://localhost:8081` |
| PostgreSQL local: porta do computador | `5433` | `5432` |
| PostgreSQL: porta dentro do container | `5432` | `5432` |
| Spring: porta dentro do container | `8081` | `8081` |
| API na AWS | `http://3.218.151.246:8082` | `http://3.218.151.246:8081` |
| Front publicado | `https://pf-projsoft.vercel.app` | `https://simulado-af-projsoft.vercel.app` |
| Pasta na EC2 | `/home/ubuntu/pf-projsoft` | `/home/ubuntu/simulado-avaliacoes` |

O front local usa `http://localhost:5173`. Pare o front do simulado antes de iniciar o da prova nessa mesma porta.

## 3. Leia o enunciado e faça este levantamento

Antes de alterar código, anote:

- Nome da entidade e seus campos, tipos e relacionamentos.
- Rotas, métodos HTTP e códigos de resposta exigidos.
- Campos obrigatórios e limites dos valores.
- Regras que pertencem ao Service.
- Quem pode acessar cada rota.
- Necessidade de Observable/Observer, auditoria ou alertas.
- Testes exigidos e classe que precisa de cobertura.
- Funcionalidades obrigatórias do front.

Não acrescente rotas ou padrões apenas porque estavam na prova anterior. Siga o novo enunciado.

## 4. Adapte o back nesta ordem

Os caminhos abaixo começam em `src/main/java/com/example/avaliacoes/`.

Não é necessário renomear o pacote `com.example.avaliacoes`, o artifact do Maven ou a classe principal apenas porque o domínio mudou. Faça isso somente se o professor exigir.

### 4.1. Entidade — `model/Avaliacao.java`

Use esta classe como modelo. Se o enunciado pedir produtos, renomeie a classe e o arquivo para `Produto`.

No IntelliJ, use **Refactor → Rename** para atualizar as referências Java. Confira o resultado depois.

| Trecho atual | O que adaptar |
|---|---|
| `public class Avaliacao` | Nome da nova entidade |
| `private Long id` | Tipo do ID, se o enunciado exigir outro |
| `emailAvaliador`, `emailAvaliado`, `comentarios`, `nota`, `dataAvaliacao` | Campos do novo domínio |
| `@NotBlank`, `@Email`, `@NotNull`, `@Min`, `@Max` | Validações correspondentes a cada campo |
| Getters e setters | Remover os antigos e gerar os dos novos campos |

Mantenha `@Entity`, `@Id` e a geração do ID se o ID continuar sendo gerado pelo banco.

Para gerar getters/setters: cursor dentro da classe → **Alt + Insert → Getter and Setter** → selecione os campos.

Use `@Email` apenas em e-mails. Não copie os limites de `nota` para campos que tenham outras regras. Se houver relacionamentos, implemente os exigidos; trocar apenas os campos não cria uma relação JPA.

### 4.2. Repository — `repository/AvaliacaoRepository.java`

Exemplo de adaptação literal:

Antes:

```java
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
}
```

Depois, se a entidade for `Produto` com ID `Long`:

```java
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
```

Atualize também os imports e o nome do arquivo. Acrescente consultas específicas somente quando o enunciado precisar delas.

### 4.3. Service — `service/AvaliacaoService.java`

A base atual tem `cadastrar()` e `listar()`.

Adapte:

1. Nome da classe, do construtor, do repository e tipos dos métodos.
2. Regras de cadastro e valores definidos pelo servidor.
3. Métodos adicionais pedidos: buscar por ID, atualizar, excluir etc.
4. Tratamento para recursos inexistentes, conforme a resposta HTTP esperada.
5. Publicação de eventos, se houver Observer.

Trechos específicos da avaliação atual:

```java
avaliacao.setId(null);
avaliacao.setDataAvaliacao(LocalDate.now());
```

O primeiro força um novo cadastro. O segundo preenche a data da avaliação. Se a nova entidade não tiver esse campo, remova a chamada da data e o import de `LocalDate` caso deixe de ser usado.

Não deixe chamadas a setters de campos que você removeu da entidade.

### 4.4. Controller — `controller/AvaliacaoController.java`

Adapte nome, construtor, Service, tipos de entrada/saída e rotas.

Exemplo:

Antes:

```java
@RequestMapping("/avaliacoes")
```

Depois:

```java
@RequestMapping("/produtos")
```

Confira as anotações necessárias:

| Anotação | Uso |
|---|---|
| `@GetMapping` | Consultar |
| `@PostMapping` | Cadastrar |
| `@PutMapping` / `@PatchMapping` | Atualizar, se exigido |
| `@DeleteMapping` | Excluir |
| `@PathVariable` | Receber um ID presente na URL |
| `@RequestBody` | Receber JSON |
| `@Valid` | Ativar as validações do objeto recebido |

Na base, o POST retorna `201 Created`. Ajuste os códigos das outras operações conforme o enunciado. Se criar DTOs, coloque as validações nos objetos efetivamente recebidos pelo Controller.

### 4.5. Segurança — `config/SecurityConfig.java`

As regras atuais verificam estas permissões:

| Rota atual | Permissão |
|---|---|
| `POST /avaliacoes` | `create:avaliacoes` |
| `GET /avaliacoes` | `read:avaliacoes` |

Se as rotas mudarem, atualize os `requestMatchers`.

Exemplo, caso você também decida cadastrar novas permissões no Auth0:

```java
.requestMatchers(HttpMethod.POST, "/produtos")
.hasAuthority("create:produtos")
.requestMatchers(HttpMethod.GET, "/produtos")
.hasAuthority("read:produtos")
```

Se houver rota por ID, configure o padrão correspondente, como `/produtos/*`, para cada método HTTP exigido.

**Atenção:** a base termina com `.anyRequest().authenticated()`. Uma rota nova sem regra específica exigirá login, mas não exigirá uma permissão de perfil específica. Cadastre explicitamente as restrições exigidas.

Não troque por `hasRole("ADMIN")` sem configurar a leitura de roles. A base lê o campo `permissions` do token e usa `hasAuthority(...)`.

O CORS da prova deve continuar autorizando:

```java
configuration.setAllowedOrigins(List.of(
        "http://localhost:5173",
        "https://pf-projsoft.vercel.app"
));
```

Se adicionar métodos HTTP, atualize também `setAllowedMethods`, que atualmente permite `GET`, `POST` e `OPTIONS`.

## 5. Auth0: reaproveitar ou adaptar

O login e os perfis já foram testados. Se o novo enunciado mantiver a mesma organização de acesso, a infraestrutura pode ser reaproveitada.

Se mudar os nomes das permissões:

1. **Applications → APIs → API Avaliacoes → Permissions:** crie as novas permissões.
2. **User Management → Roles:** associe as permissões aos perfis exigidos.
3. Confira os perfis atribuídos aos usuários de teste.
4. **API → Application Access → Front Avaliacoes → User-Delegated Access:** autorize as permissões que o front precisará solicitar.
5. Confira **Enable RBAC** e **Add Permissions in the Access Token**.
6. Saia do site e entre novamente para obter um token atualizado.

Permissões no código e no Auth0 devem ter exatamente o mesmo nome.

### Particularidade desta base: tabulação na audience

O Identifier cadastrado no Auth0 contém uma tabulação antes de `https://avaliacoes-api`. Isso foi confirmado no campo `aud` do token.

No `application.properties`, a configuração funcional é:

```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://dev-3yaf2x83rs8ag6au.us.auth0.com/
spring.security.oauth2.resourceserver.jwt.audiences[0]=\u0009https://avaliacoes-api
```

No `frontend/src/main.jsx`, preserve a audience já validada, incluindo a tabulação. Não a redigite sem esse caractere enquanto usar a API atual.

Se criar outra API no Auth0, use um Identifier sem espaços ou tabulações e atualize a audience no back e no front para o mesmo valor. Não precisa criar outra API apenas porque a entidade mudou.

## 6. Se o enunciado exigir Observable/Observer

**Essa parte ainda não está implementada na base.** Implemente conforme a abordagem ensinada pelo professor.

Adaptação esperada:

1. Definir o evento: operação e dados necessários aos observers.
2. Definir o observable/publicador e o contrato dos observers, se a abordagem da aula usar essas interfaces.
3. Registrar os observers.
4. No Service, executar a operação e publicar o evento correspondente.
5. No observer de auditoria, persistir timestamp e operação usando entidade e repository próprios.
6. No observer de estoque, verificar o limite pedido e registrar o alerta no log.

Exemplo do enunciado antigo: publicar CREATE ao cadastrar e DELETE ao excluir; alertar quando a quantidade cadastrada for menor que 10.

Apenas colocar um `if` e um log no Service não implementa o padrão Observer. Se os testes do Service exigirem verificar eventos, confira a interação com o publicador/observable.

## 7. Adapte o front — `frontend/src/App.jsx`

Faça estas mudanças em conjunto:

| Trecho | O que adaptar |
|---|---|
| `useState` dos campos | Campos do formulário do novo domínio |
| Inputs e labels | Tipo, texto, obrigatoriedade e limites |
| `JSON.stringify({...})` | Chaves iguais aos campos/DTO esperados pelo back |
| As chamadas `fetch` | Nova rota e método HTTP |
| `avaliacoes.map(...)` | Campos exibidos e `key` do registro |
| Títulos e mensagens | Nome do novo sistema |
| `Number(nota)` | Converter os novos campos numéricos, quando necessário |

Exemplo de rota:

Antes:

```jsx
fetch(`${API_URL}/avaliacoes`, {
```

Depois:

```jsx
fetch(`${API_URL}/produtos`, {
```

Mantenha o envio do token nas chamadas protegidas:

```jsx
const token = await getAccessTokenSilently()
```

```jsx
Authorization: `Bearer ${token}`
```

No POST/PUT com JSON, mantenha também `'Content-Type': 'application/json'`.

A base mostra o formulário para ambos os perfis e bloqueia USER no back. Se o enunciado exigir esconder controles por perfil, implemente também esse comportamento visual; esconder o formulário não substitui a autorização no servidor.

### Endereço da API

O `App.jsx` já usa:

```jsx
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081'
```

Na prova local, o arquivo **`frontend/.env.local`** precisa conter:

```properties
VITE_API_URL=http://localhost:8082
```

Esse arquivo não vai ao GitHub. Reinicie o Vite após alterar variáveis de ambiente.

Na Vercel, `VITE_API_URL` deve continuar como `/api`. O arquivo `frontend/vercel.json` encaminha `/api/...` para a porta 8082 da AWS. Não coloque o endereço HTTP da EC2 diretamente na configuração do front publicado.

## 8. Teste localmente

### Opção A — back e banco pelo Docker

No computador, com Docker Desktop aberto, na raiz de `pf-projsoft`:

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=60 backend
```

Espere `Started AvaliacoesApplication`.

Depois, usando a rota adaptada:

```bash
curl -i http://localhost:8082/avaliacoes
```

Sem token, uma rota protegida deve retornar 401. Esse teste confirma a resposta do servidor, mas não comprova cadastro ou autorização por perfil.

Em outro terminal, na pasta `frontend`:

```bash
npm install
npm run dev -- --port 5173 --strictPort
```

Abra `http://localhost:5173` e teste o fluxo autenticado.

### Opção B — back pelo IntelliJ e somente banco pelo Docker

Na raiz, pare o back do Docker e mantenha o banco:

```bash
docker compose stop backend
docker compose up -d postgres
```

No `application.properties`, o ambiente local da prova usa:

```properties
server.port=8082
spring.datasource.url=jdbc:postgresql://localhost:5433/avaliacoes
```

Execute a classe principal no IntelliJ com Java 21. Não execute o back no IntelliJ e no Docker simultaneamente na mesma porta.

## 9. Testes automatizados, se forem exigidos

**Os testes de unidade com 100% de cobertura e o teste de integração do POST ainda não foram implementados nesta base.** O teste padrão gerado pelo Initializr não substitui esses requisitos.

Arquivos sugeridos, adaptando o nome ao novo domínio:

```text
src/test/java/com/example/avaliacoes/service/AvaliacaoServiceTest.java
src/test/java/com/example/avaliacoes/controller/AvaliacaoControllerIntegrationTest.java
```

### Unidade do Service

- Instanciar o Service com dependências simuladas, conforme a abordagem da aula.
- Testar cada método e todas as decisões/ramificações.
- Cobrir sucesso e erros previstos nas regras de negócio.
- Verificar dados enviados ao repository e eventos publicados, quando aplicável.
- Medir a cobertura da classe de Service; testes passando não garantem 100%.

No IntelliJ, execute os testes com **Run with Coverage** e confira a classe exigida. Se for necessário relatório automatizado, configure a ferramenta de cobertura; ela ainda não foi acrescentada à base.

### Integração do POST

- Subir o contexto da aplicação e usar um banco de teste configurado.
- Autenticar a requisição com as authorities/permissões exigidas.
- Enviar um JSON válido, conferir o status esperado e os dados persistidos.
- Não confundir um Controller com Service totalmente mockado com a verificação completa da persistência.
- Manter os testes isolados dos dados de produção.

Para executar pelo Maven no Git Bash, na raiz:

```bash
./mvnw test
```

O Dockerfile atual usa `package -DskipTests`: **o deploy verde não significa que os testes passaram**. Se a prova exigir CI com testes, acrescente uma etapa de testes ao workflow antes de construir/enviar a imagem e configure as dependências de teste necessárias.

## 10. Ajuste obrigatório no workflow se a rota mudar

Arquivo: **`.github/workflows/deploy.yml`**.

A verificação atual chama:

```text
http://localhost:8082/avaliacoes
```

Se trocar a rota, atualize essa URL, por exemplo:

```text
http://localhost:8082/produtos
```

A verificação espera 401 porque chama sem token. Use uma rota protegida existente. Se alterar o comportamento de segurança, adapte o status esperado e confira a resposta efetiva; um status de uma rota desconhecida não comprova o funcionamento do novo recurso.

Mantenha os destinos da prova:

| Configuração | Valor |
|---|---|
| Imagem construída e empacotada | `pf-projsoft:latest` |
| Pasta de envio e `cd` remoto | `/home/ubuntu/pf-projsoft` |
| Grupo de concorrência | `deploy-pf-projsoft` |
| Compose remoto | `compose.prod.yaml` |

Os Secrets `AWS_HOST`, `AWS_USER` e `AWS_SSH_KEY` já foram cadastrados neste repositório. Não coloque a chave `.pem` no código ou no README.

## 11. Envie e confira os dois deploys

Na raiz de `pf-projsoft`:

```bash
git status
git diff --check
git diff
```

Revise os arquivos modificados e confirme que não está incluindo credenciais ou arquivos desnecessários. Depois:

```bash
git add .
git commit -m "Adapta sistema ao enunciado da prova"
git push
```

Confira separadamente:

1. **GitHub → pf-projsoft → Actions:** deploy do back verde.
2. **Vercel → pf-projsoft:** deploy do front pronto, com o commit atualizado.
3. **Site publicado:** login, operações, persistência e permissões.

Não é necessário executar `git pull` ou compilar manualmente na EC2: o workflow envia a imagem pronta.

## 12. Matriz de conferência antes da entrega

Adapte os resultados esperados ao enunciado.

| Teste | Resultado esperado na base atual |
|---|---|
| Requisição protegida sem token | 401 |
| ADMIN lista | 200 e dados corretos |
| ADMIN cadastra dados válidos | 201 e registro salvo |
| USER lista | 200 e dados corretos |
| USER tenta cadastrar | 403 e nenhum cadastro |
| ADMIN envia nota fora do limite | 400 |
| ADMIN envia campo obrigatório vazio | 400 |
| Atualizar página e listar novamente | Dados continuam no banco |
| Novas rotas por ID | Comportamentos de sucesso e ID inexistente conferidos |
| Observer, se exigido | Evento, auditoria e alerta conferidos |
| Testes automatizados, se exigidos | Executados e cobertura medida |
| GitHub Actions e Vercel | Último commit publicado nos dois |

## 13. Soluções para os problemas que já apareceram

### Classes do Spring vermelhas no IntelliJ

**Settings → Build, Execution, Deployment → Build Tools → Maven → Maven home path → Bundled (Maven 3)**.

Depois, no `pom.xml`: **Maven → Sync Project** e, se necessário, **reload all projects**. Confira também o Project SDK Java 21.

### Porta ocupada no Windows

No Git Bash, para a porta da prova:

```bash
netstat -ano | findstr :8082
```

Pegue o PID da última coluna e identifique o programa, substituindo `NUMERO`:

```bash
tasklist //FI "PID eq NUMERO"
```

Se confirmou que é uma execução antiga do seu back, encerre:

```bash
taskkill //PID NUMERO //F
```

Se quem ocupa a porta for um container seu, pare o serviço correspondente pelo Compose. Não encerre processos do Docker sem identificar o que são.

### Container reiniciando ou sem responder

```bash
docker compose ps -a
docker compose logs --tail=80 backend
```

Se a configuração estiver correta e o erro for a rede, como ocorreu com `UnknownHostException: postgres`, recrie os containers e a rede:

```bash
docker compose down
docker compose up -d --build
```

Não use `down -v`: isso remove os volumes e pode apagar o banco desse projeto.

### HTTP 401 em uma chamada autenticada

No navegador: **F12 → Rede → requisição → Cabeçalhos de resposta → WWW-Authenticate**.

Confira o erro antes de mudar código. Já ocorreu diferença na audience por causa da tabulação do Identifier. Confira também emissor, expiração e envio do token.

### HTTP 403

Na aba **Resposta** da requisição:

- `Invalid CORS request`: conferir a origem no `SecurityConfig` e o método em `setAllowedMethods`.
- Falta de permissão: conferir perfil do usuário, permissões do perfil, autorização da aplicação e regra do `requestMatcher`.

Depois de mudar permissões no Auth0, saia e entre novamente.

### Deploy precisa de diagnóstico na AWS

No terminal SSH:

```bash
cd /home/ubuntu/pf-projsoft
docker compose -f compose.prod.yaml ps -a
docker compose -f compose.prod.yaml logs --tail=80 backend
```

O workflow já inclui repetição da verificação para esperar o Spring iniciar. Se falhar novamente, leia o log antes de repetir o deploy.

## 14. Entrega

- [ ] Todas as exigências do enunciado foram atendidas.
- [ ] Não restaram campos, rotas ou regras antigas usados por engano.
- [ ] Segurança das novas rotas foi conferida por método e perfil.
- [ ] Front envia JSON com os nomes esperados pelo back.
- [ ] Testes e cobertura exigidos foram entregues.
- [ ] Código foi enviado ao repositório oficial `pf-projsoft`.
- [ ] Último deploy do back ficou verde.
- [ ] Último deploy do front ficou pronto.
- [ ] Fluxo completo foi testado no site publicado.
- [ ] Links e demais evidências solicitadas pelo professor foram entregues.

Links da prova:

- Repositório: https://github.com/arthursampaiob/pf-projsoft
- Front: https://pf-projsoft.vercel.app
- API: http://3.218.151.246:8082

O domínio da entidade ainda é o de avaliações. A infraestrutura pronta não substitui a implementação das exigências do novo enunciado.
