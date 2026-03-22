# CentroGO

CentroGO e uma plataforma digital pensada para transformar o Centro de Aracaju em uma experiencia conectada, com descoberta de lojas, eventos, servicos, seguranca urbana, sugestoes da comunidade e recursos de gamificacao.

Este projeto foi construido com foco em uma experiencia mobile-first, com mapas interativos, navegacao por modulos e dados mockados para demonstracao e evolucao do produto.

## O que a plataforma faz na pratica

Na pratica, a plataforma funciona como um hub digital do centro da cidade:

- Apresenta um onboarding inicial para explicar o valor da plataforma e orientar o primeiro acesso.
- Exibe uma home com destaques, busca, categorias, recomendacoes, joias escondidas e eventos em evidência.
- Permite explorar lojas, mercados, farmacias e servicos com informacoes visuais, promocoes e dados de acessibilidade.
- Reune eventos em andamento e eventos futuros para aumentar o fluxo e a descoberta na regiao central.
- Oferece um modulo de exploracao com mapa, pontos de interesse, sugestao de rota e foco em mobilidade urbana.
- Mostra servicos importantes do centro com filtros, destaque do mais proximo e visualizacao em mapa.
- Disponibiliza um mapa de seguranca com contatos e pontos de apoio importantes.
- Permite visualizar sugestoes urbanas da comunidade, com mapa, votacao social e status de andamento.
- Mantem uma camada de perfil e gamificacao para engajar o usuario com pontos, historico e progresso.

## Modulos principais

### Home
A home concentra o primeiro contato com a plataforma. Ela combina onboarding, stories, busca, categorias, cards de lojas, eventos, recomendacoes personalizadas e atalhos para exploracao.

### Lojas e catalogo urbano
O modulo de lojas trabalha com dados mockados de estabelecimentos, categorias, promocoes, distancia, funcionamento e acessibilidade fisica.

### Eventos
A area de eventos mostra o que esta acontecendo agora e o que vem em seguida, ajudando a conectar publico, criadores e comercio local.

### Explorar
A pagina de exploracao funciona como um mapa interativo do centro, com pontos de interesse, locais em destaque, joias escondidas, estacionamento e um planejador de rota.

### Servicos
O modulo de servicos apresenta servicos publicos e utilitarios importantes, com filtros por categoria, selecao de ponto, distancia e localizacao do usuario.

### Seguranca
A area de seguranca organiza contatos e pontos relevantes como apoio emergencial e presenca institucional no centro.

### Sugestoes
O modulo de sugestoes apresenta ideias da comunidade em um mapa, com dados de engajamento, prioridade e status de execucao.

### Perfil e gamificacao
O usuario possui perfil, historico de pontos, conquistas e progresso, reforcando o lado de engajamento da plataforma.

## Rotas principais

- `/` : pagina inicial da plataforma.
- `/login` : entrada do usuario.
- `/lojas` : catalogo de lojas e estabelecimentos.
- `/eventos` : listagem de eventos.
- `/explorar` : mapa e exploracao urbana.
- `/servicos` : servicos e utilidades do centro.
- `/seguranca` : mapa e contatos de seguranca.
- `/sugestoes` : participacao comunitaria e mapa de sugestoes.
- `/perfil` : perfil do usuario e gamificacao.
- `/configuracoes` : configuracoes gerais da experiencia.
- `/api/mapbox/route` : rota de API usada para calculo de trajetos.

## Tecnologias utilizadas

### Base da aplicacao
- Next.js 16 com App Router.
- React 19.
- TypeScript 5.

### Estilo e interface
- Tailwind CSS 4.
- PostCSS.
- Radix UI para primitives de interface.
- `class-variance-authority`, `clsx` e `tailwind-merge` para composicao de classes.
- `lucide-react` e `react-icons` para iconografia.

### Animacao e experiencia
- Framer Motion para transicoes, onboarding, interacoes e microanimacoes.
- Embla Carousel em fluxos de destaque e slides.
- Vaul para drawers e sheets mobile.

### Formularios e validacao
- React Hook Form.
- Zod.
- `@hookform/resolvers`.

### Mapas e mobilidade
- Mapbox Directions API para calculo de rota quando o token esta configurado.
- MapLibre GL e Mapbox GL para visualizacao cartografica.
- `react-map-gl` para integracao com componentes React.

### Dados e visualizacao
- `date-fns` para datas.
- Recharts para graficos e visualizacoes.

### Estrutura complementar
- Manifest web em `public/manifest.json`, permitindo comportamento de web app instalavel.
- Contexto global de acessibilidade via `AccessibilityContext`.
- `AppShell` para organizar estrutura global e navegacao inferior.

## Estrutura resumida do projeto

```text
app/          -> rotas da aplicacao e rota de API
components/   -> componentes visuais e modulos de interface
context/      -> providers e estado global
hooks/        -> hooks reutilizaveis
lib/          -> dados mockados, funcoes utilitarias e configuracoes de mapa
public/       -> imagens, manifest e arquivos estaticos
services/     -> servicos auxiliares, como integracao de mapa e rotas
styles/       -> estilos complementares
```

## Como baixar o projeto

### Opcao 1: clonando do GitHub

```bash
git clone https://github.com/codepacceproduct/centrogo.git
cd centrogo
```

### Opcao 2: baixando o ZIP

1. Abra o repositorio no GitHub.
2. Clique em `Code`.
3. Escolha `Download ZIP`.
4. Extraia os arquivos.
5. Abra a pasta do projeto no VS Code ou no editor de sua preferencia.

## Como instalar as dependencias

Este projeto usa `pnpm` como fluxo principal, porque existe um `pnpm-lock.yaml` no repositorio e o deploy atual tambem segue essa linha.

```bash
pnpm install
```

Se necessario, instale o `pnpm` antes:

```bash
npm install -g pnpm
```

## Variaveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto.

### Variavel suportada hoje

```env
MAPBOX_SECRET_TOKEN=seu_token_aqui
```

### Observacao importante

Essa variavel e opcional para rodar a interface, mas recomendada para rotas reais no modulo de exploracao. Se ela nao estiver configurada, a API `/api/mapbox/route` retorna uma rota de fallback em linha reta entre os pontos.

## Como rodar localmente

### Ambiente de desenvolvimento

```bash
pnpm dev
```

Depois, abra no navegador:

```text
http://localhost:3000
```

### Gerar build de producao

```bash
pnpm build
```

### Subir a build localmente

```bash
pnpm start
```

### Rodar lint

```bash
pnpm lint
```

## Como funciona a integracao de mapas e rotas

O fluxo de mapas funciona assim:

1. O frontend envia origem e destino para `/api/mapbox/route`.
2. A rota de API valida os dados recebidos.
3. Se `MAPBOX_SECRET_TOKEN` estiver configurado, a aplicacao consulta a Mapbox Directions API.
4. Se a chamada falhar ou o token nao existir, a aplicacao devolve uma rota fallback simples.
5. O frontend renderiza essa rota no mapa para orientar o usuario.

Isso permite que a plataforma continue funcional mesmo em ambientes de demonstracao sem segredo configurado.

## Como dar deploy

### Deploy recomendado: Vercel

A estrutura atual do projeto e compativel com deploy na Vercel.

#### Passo a passo

1. Envie o repositorio para o GitHub.
2. Acesse a Vercel e importe o projeto.
3. Deixe a Vercel detectar automaticamente o framework como Next.js.
4. Instale as dependencias com `pnpm`.
5. Configure a variavel `MAPBOX_SECRET_TOKEN` nas Environment Variables, se quiser rotas reais da Mapbox.
6. Execute o deploy.

#### Comandos esperados no deploy

- Install: `pnpm install`
- Build: `pnpm run build`
- Start: `pnpm start`

### Deploy manual em servidor Node

Tambem e possivel publicar fora da Vercel:

```bash
pnpm install
pnpm build
pnpm start
```

Depois, basta expor a porta do processo com o servidor ou proxy de sua infraestrutura.

## Observacoes importantes para manutencao

- A plataforma ainda trabalha fortemente com dados mockados em arquivos como `lib/data.ts`, `lib/explorar-map.ts`, `lib/servicos-map.ts`, `lib/seguranca-map.ts` e `lib/sugestoes-map.ts`.
- A home e carregada com `dynamic(..., { ssr: false })`, o que ajuda em fluxos que dependem bastante do navegador e de APIs do cliente.
- O arquivo `next.config.mjs` esta com `typescript.ignoreBuildErrors = true`, entao o ideal e nao depender apenas do build para garantia de qualidade.
- O projeto esta orientado a experiencia mobile-first, mas tambem possui adaptacoes para desktop em varios modulos.
- O manifesto em `public/manifest.json` permite comportamento semelhante ao de web app instalavel.

## Fluxo recomendado para quem vai continuar o projeto

1. Clonar o repositorio.
2. Instalar dependencias com `pnpm install`.
3. Criar `.env.local`.
4. Rodar `pnpm dev`.
5. Validar as paginas principais.
6. Rodar `pnpm lint` e `pnpm build` antes de publicar.
7. Fazer deploy na Vercel ou em ambiente Node compativel.

## Assinatura

Assinado por:

- Caio Lincoln
- Ebert Ryan
- Eyck Santos
- Matheus Santana
- Delcio Farias
