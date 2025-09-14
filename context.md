# Context.md - Controle de Chips WhatsApp

## Visão Geral do Projeto

O **Controle de Chips WhatsApp** é uma aplicação web desenvolvida para gerenciar e monitorar números de WhatsApp Business, permitindo controle completo sobre dispositivos, APIs, status de conexão e métricas operacionais.

### Informações Básicas
- **Nome do Projeto**: Controle Chips (my-v0-project)
- **Versão**: 0.1.0
- **Tipo**: Aplicação Web Dashboard
- **Finalidade**: Gerenciamento de números WhatsApp Business
- **Linguagem Principal**: TypeScript
- **Framework**: Next.js 14.2.32

## Stack Tecnológica

### Frontend
- **Framework**: Next.js 14.2.32 (App Router)
- **Linguagem**: TypeScript 5
- **Estilização**: Tailwind CSS 3.4.17
- **Componentes UI**: Radix UI (conjunto completo)
- **Ícones**: Lucide React 0.454.0
- **Temas**: next-themes 0.4.4
- **Gráficos**: Recharts 2.15.0
- **Formulários**: React Hook Form 7.54.1 + Zod 3.24.1
- **Notificações**: Sonner 1.7.1
- **Datas**: date-fns (latest)

### Backend/Database
- **BaaS**: Supabase (latest)
- **Database**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth
- **ORM**: Supabase Client

### Ferramentas de Desenvolvimento
- **Build Tool**: Next.js
- **Package Manager**: npm/pnpm
- **Linting**: ESLint (desabilitado durante builds)
- **CSS**: PostCSS + Autoprefixer

## Estrutura de Diretórios Detalhada

```
c:\projetos\controle-chips/
├── .gitignore                    # Arquivos ignorados pelo Git
├── README.md                     # Documentação básica do projeto
├── context.md                    # Este arquivo de contexto
├── package.json                  # Dependências e scripts npm
├── package-lock.json            # Lock file do npm
├── pnpm-lock.yaml               # Lock file do pnpm
├── next.config.mjs              # Configurações do Next.js
├── tsconfig.json                # Configurações do TypeScript
├── tailwind.config.ts           # Configurações do Tailwind CSS
├── postcss.config.mjs           # Configurações do PostCSS
├── components.json              # Configurações dos componentes UI
├── middleware.ts                # Middleware do Next.js (desabilitado)
│
├── app/                         # App Router do Next.js
│   ├── globals.css             # Estilos globais
│   ├── layout.tsx              # Layout raiz da aplicação
│   ├── page.tsx                # Página inicial (Dashboard)
│   ├── loading.tsx             # Componente de loading global
│   ├── error.tsx               # Componente de erro global
│   ├── auth-provider.tsx       # Provider de autenticação
│   ├── protected-route.tsx     # HOC para rotas protegidas
│   │
│   ├── login/                  # Rota de login
│   │   ├── layout.tsx         # Layout específico do login
│   │   ├── loading.tsx        # Loading específico do login
│   │   └── page.tsx           # Página de login
│   │
│   └── admin/                  # Área administrativa
│       └── users/             # Gestão de usuários
│
├── components/                  # Componentes React reutilizáveis
│   ├── dashboard.tsx           # Componente principal do dashboard
│   ├── header.tsx              # Cabeçalho da aplicação
│   ├── logout-button.tsx       # Botão de logout
│   ├── iframe-modal.tsx        # Modal com iframe
│   ├── theme-provider.tsx      # Provider de temas
│   │
│   ├── auth/                   # Componentes de autenticação
│   │   └── route-guard.tsx    # Guarda de rotas
│   │
│   ├── charts/                 # Componentes de gráficos
│   │   ├── charts-modal.tsx   # Modal com gráficos
│   │   ├── device-allocation-chart.tsx  # Gráfico de alocação
│   │   └── simple-bar-chart.tsx         # Gráfico de barras simples
│   │
│   ├── modals/                 # Componentes de modais
│   │   ├── add-number-modal.tsx        # Modal para adicionar número
│   │   ├── edit-number-modal.tsx       # Modal para editar número
│   │   └── user-register-modal.tsx     # Modal de registro de usuário
│   │
│   └── ui/                     # Componentes UI base (Radix UI)
│       ├── accordion.tsx       # Componente de acordeão
│       ├── alert-dialog.tsx    # Diálogo de alerta
│       ├── alert.tsx           # Componente de alerta
│       ├── aspect-ratio.tsx    # Controle de proporção
│       ├── avatar.tsx          # Avatar de usuário
│       ├── badge.tsx           # Badges/etiquetas
│       ├── breadcrumb.tsx      # Navegação breadcrumb
│       ├── button.tsx          # Botões
│       ├── calendar.tsx        # Calendário
│       ├── card.tsx            # Cards
│       ├── carousel.tsx        # Carrossel
│       ├── chart.tsx           # Componentes de gráfico
│       ├── checkbox.tsx        # Checkboxes
│       ├── collapsible.tsx     # Elementos colapsáveis
│       ├── command.tsx         # Interface de comando
│       ├── context-menu.tsx    # Menu de contexto
│       ├── dialog.tsx          # Diálogos/modais
│       ├── drawer.tsx          # Gavetas laterais
│       ├── dropdown-menu.tsx   # Menus dropdown
│       ├── form.tsx            # Componentes de formulário
│       ├── hover-card.tsx      # Cards com hover
│       ├── input-otp.tsx       # Input para OTP
│       ├── input.tsx           # Inputs de texto
│       ├── label.tsx           # Labels
│       ├── menubar.tsx         # Barra de menu
│       ├── navigation-menu.tsx # Menu de navegação
│       ├── pagination.tsx      # Paginação
│       ├── popover.tsx         # Popovers
│       ├── progress.tsx        # Barras de progresso
│       ├── radio-group.tsx     # Grupos de radio buttons
│       ├── resizable.tsx       # Painéis redimensionáveis
│       ├── scroll-area.tsx     # Áreas de scroll
│       ├── select.tsx          # Selects/dropdowns
│       ├── separator.tsx       # Separadores
│       ├── sheet.tsx           # Folhas/painéis laterais
│       ├── sidebar.tsx         # Sidebar
│       ├── skeleton.tsx        # Skeletons de loading
│       ├── slider.tsx          # Sliders
│       ├── sonner.tsx          # Notificações toast
│       ├── switch.tsx          # Switches/toggles
│       ├── table.tsx           # Tabelas
│       ├── tabs.tsx            # Abas/tabs
│       ├── textarea.tsx        # Áreas de texto
│       ├── toast.tsx           # Sistema de toast
│       ├── toaster.tsx         # Container de toasts
│       ├── toggle-group.tsx    # Grupos de toggle
│       ├── toggle.tsx          # Botões toggle
│       ├── tooltip.tsx         # Tooltips
│       ├── use-mobile.tsx      # Hook para detecção mobile
│       └── use-toast.ts        # Hook para toasts
│
├── hooks/                       # Custom React Hooks
│   ├── use-mobile.tsx          # Hook para detecção de dispositivo móvel
│   └── use-toast.ts            # Hook para sistema de notificações
│
├── lib/                         # Utilitários e configurações
│   ├── utils.ts                # Funções utilitárias
│   ├── schema.sql              # Schema do banco de dados
│   └── supabase/               # Configurações do Supabase
│       ├── client.ts           # Cliente Supabase (browser)
│       └── server.ts           # Cliente Supabase (server)
│
├── public/                      # Arquivos estáticos
│   ├── images/                 # Imagens do projeto
│   │   ├── wbusiness.png       # Logo WhatsApp Business
│   │   ├── wduall.jpeg         # Imagem Dual
│   │   └── whats.png           # Logo WhatsApp
│   ├── placeholder-logo.png    # Logo placeholder
│   ├── placeholder-logo.svg    # Logo placeholder SVG
│   ├── placeholder-user.jpg    # Avatar placeholder
│   ├── placeholder.jpg         # Imagem placeholder
│   └── placeholder.svg         # Placeholder SVG
│
└── styles/                      # Estilos adicionais
    └── globals.css             # Estilos globais CSS
```

## Funcionalidades Principais

### 1. Autenticação e Segurança
- **Sistema de Login**: Autenticação via Supabase Auth
- **Proteção de Rotas**: Middleware e componentes de proteção
- **Gestão de Sessão**: Controle automático de sessões
- **Logout Seguro**: Limpeza completa de cookies e redirecionamento

### 2. Dashboard Principal
- **Visualização de Números**: Tabela completa com todos os números WhatsApp
- **Filtros Avançados**: Por aparelho, API, status, recuperação
- **Busca em Tempo Real**: Busca por contato, número, CPF
- **Ordenação**: Ordenação por diferentes campos
- **Seleção Múltipla**: Operações em lote

### 3. Gestão de Números WhatsApp
- **Adicionar Números**: Modal completo para novos números
- **Editar Números**: Edição inline e via modal
- **Exclusão**: Remoção individual ou em lote
- **Status Tracking**: Monitoramento de conexão/desconexão
- **Histórico**: Controle de ativação, reativação, quedas

### 4. Visualização de Dados
- **Gráficos Interativos**: Charts de alocação de dispositivos
- **Métricas**: Dias ativos, dias desconectados, quedas
- **Relatórios**: Análise de performance dos números
- **Exportação**: Funcionalidades de cópia e exportação

### 5. Ferramentas Auxiliares
- **Gerador de CPF**: Integração com ferramenta externa
- **Modais Informativos**: Tooltips e ajuda contextual
- **Notificações**: Sistema de toast para feedback
- **Temas**: Suporte a tema claro/escuro

## Modelo de Dados

### Tabela Principal: `celulares_whatsapp`

```sql
CREATE TABLE celulares_whatsapp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contato TEXT NOT NULL,              -- Identificador do contato
  numero TEXT NOT NULL,               -- Número do WhatsApp
  cpf TEXT NOT NULL,                  -- CPF associado
  ativado_em DATE,                    -- Data de ativação
  reativado_em DATE,                  -- Data de reativação
  aparelho TEXT NOT NULL,             -- Tipo/nome do aparelho
  dias_ativo INTEGER,                 -- Dias que ficou ativo
  api TEXT,                           -- API utilizada
  desconectado_em DATE,               -- Data de desconexão
  dias_desconectado INTEGER,          -- Dias desconectado
  recuperacao TEXT,                   -- Status de recuperação
  recarregar_em DATE,                 -- Data para recarregar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quedas INTEGER,                     -- Número de quedas
  aquecendo BOOLEAN,                  -- Status de aquecimento
  tipo_whats TEXT                     -- Tipo do WhatsApp
);
```

### Campos Principais
- **id**: Identificador único (UUID)
- **contato**: Nome/identificador do contato
- **numero**: Número do WhatsApp no formato internacional
- **cpf**: CPF da pessoa física associada
- **ativado_em**: Data de primeira ativação
- **reativado_em**: Data de última reativação
- **aparelho**: Dispositivo onde está instalado
- **api**: API ou sistema utilizado
- **desconectado_em**: Data da última desconexão
- **recuperacao**: Status de processo de recuperação
- **recarregar_em**: Data programada para recarga
- **quedas**: Contador de quedas de conexão
- **aquecendo**: Flag para números em aquecimento
- **tipo_whats**: Tipo do WhatsApp (Business, etc.)

## Configurações Importantes

### Next.js (next.config.mjs)
```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,    // ESLint desabilitado no build
  },
  typescript: {
    ignoreBuildErrors: true,     // Erros TS ignorados no build
  },
  images: {
    unoptimized: true,          // Imagens não otimizadas
  },
}
```

### TypeScript (tsconfig.json)
- **Target**: ES6
- **Module**: ESNext
- **JSX**: Preserve
- **Strict Mode**: Habilitado
- **Path Mapping**: `@/*` aponta para raiz

### Tailwind CSS
- **Dark Mode**: Baseado em classe
- **Tema Customizado**: Cores e variáveis CSS personalizadas
- **Plugins**: tailwindcss-animate
- **Responsividade**: Mobile-first approach

### Supabase
- **URL**: https://coaweadvgkcenjngsedz.supabase.co
- **Autenticação**: Email/Password
- **RLS**: Row Level Security habilitado
- **Políticas**: Acesso completo para usuários autenticados

## Fluxos de Trabalho

### 1. Fluxo de Autenticação
1. Usuário acessa a aplicação
2. AuthProvider verifica sessão existente
3. Se não autenticado, redireciona para /login
4. Login via Supabase Auth
5. Redirecionamento para dashboard principal
6. ProtectedRoute protege rotas sensíveis

### 2. Fluxo de Gestão de Números
1. Dashboard carrega dados do Supabase
2. Usuário pode filtrar, buscar, ordenar
3. Operações CRUD via modais
4. Atualizações em tempo real
5. Feedback via sistema de toast

### 3. Fluxo de Visualização
1. Dados processados para gráficos
2. Cálculos de métricas (dias ativos, etc.)
3. Renderização de charts interativos
4. Exportação de dados

## Scripts Disponíveis

```json
{
  "dev": "next dev",           // Servidor de desenvolvimento
  "build": "next build",       // Build de produção
  "start": "next start",       // Servidor de produção
  "lint": "next lint"          // Linting do código
}
```

## Dependências Críticas

### Produção
- **@supabase/supabase-js**: Cliente JavaScript do Supabase
- **@supabase/ssr**: Suporte a SSR para Supabase
- **next**: Framework React
- **react**: Biblioteca principal
- **react-hook-form**: Gestão de formulários
- **zod**: Validação de schemas
- **tailwindcss**: Framework CSS
- **lucide-react**: Biblioteca de ícones
- **recharts**: Biblioteca de gráficos
- **date-fns**: Manipulação de datas

### Desenvolvimento
- **typescript**: Linguagem tipada
- **@types/***: Definições de tipos
- **tailwindcss**: Framework CSS
- **postcss**: Processador CSS

## Padrões de Código

### Estrutura de Componentes
- **"use client"**: Componentes client-side explícitos
- **TypeScript**: Tipagem forte em todos os componentes
- **Props Interfaces**: Interfaces bem definidas
- **Error Handling**: Tratamento de erros consistente

### Convenções de Nomenclatura
- **Componentes**: PascalCase (Dashboard.tsx)
- **Arquivos**: kebab-case (add-number-modal.tsx)
- **Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE

### Organização de Imports
1. React e Next.js
2. Bibliotecas externas
3. Componentes internos
4. Utilitários e tipos
5. Estilos

## Considerações de Performance

### Otimizações Implementadas
- **Dynamic Imports**: Carregamento sob demanda
- **Memoização**: useMemo para cálculos pesados
- **Lazy Loading**: Componentes carregados quando necessário
- **Client-Side Caching**: Cache do Supabase

### Configurações de Build
- **ESLint**: Desabilitado durante build para velocidade
- **TypeScript**: Erros ignorados no build
- **Images**: Otimização desabilitada

## Segurança

### Medidas Implementadas
- **Row Level Security**: Habilitado no Supabase
- **Autenticação**: Obrigatória para todas as operações
- **Sanitização**: Inputs validados com Zod
- **HTTPS**: Comunicação segura com Supabase

### Considerações
- **Chaves API**: Hardcoded (apenas para demonstração)
- **Cookies**: Limpeza manual no logout
- **Sessões**: Gerenciadas pelo Supabase

## Deployment

### Plataforma
- **Vercel**: Plataforma de deploy principal
- **URL**: https://vercel.com/thadeu-fayads-projects/v0-controle-chips
- **Sincronização**: Automática com v0.dev

### Configurações
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Node Version**: Latest LTS

## Manutenção e Desenvolvimento

### Para Desenvolvedores
1. **Clone o repositório**
2. **Instale dependências**: `npm install` ou `pnpm install`
3. **Configure variáveis de ambiente** (Supabase)
4. **Execute em desenvolvimento**: `npm run dev`
5. **Acesse**: http://localhost:3000

### Para IAs/Assistentes
- **Contexto Completo**: Este arquivo fornece visão completa
- **Padrões**: Siga os padrões estabelecidos
- **Tipagem**: Mantenha TypeScript rigoroso
- **Componentes**: Use a biblioteca UI existente
- **Estado**: Prefira hooks do React
- **Dados**: Sempre via Supabase client

### Próximos Passos Sugeridos
1. **Testes**: Implementar testes unitários e E2E
2. **Variáveis de Ambiente**: Mover chaves para .env
3. **Otimização**: Implementar lazy loading
4. **Monitoramento**: Adicionar analytics
5. **Documentação**: Expandir documentação da API

---

**Última Atualização**: Janeiro 2025
**Versão do Context**: 1.0
**Mantenedor**: Sistema de Controle de Chips WhatsApp