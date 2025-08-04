# 🧠 Cognitivo Treinamento Frontend

Sistema frontend para gerenciamento de check-ins e treinamento corporativo, desenvolvido com Angular 20.1.1 e seguindo as melhores práticas de clean code.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Funcionalidades](#-funcionalidades)
- [API Integration](#-api-integration)
- [Componentes](#-componentes)
- [Serviços](#-serviços)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O **Cognitivo Treinamento Frontend** é uma aplicação web moderna para gestão de check-ins de funcionários, com sistema de ranking, perfis de usuário e autenticação segura. O projeto foi desenvolvido seguindo as melhores práticas do Angular e princípios de clean code.

### ✨ Principais Características

- ✅ **Sistema de Autenticação** completo (login, registro, reset de senha)
- ✅ **Check-in Inteligente** com validação de finais de semana
- ✅ **Ranking Semanal** de funcionários
- ✅ **Perfil de Usuário** personalizável
- ✅ **Interface Responsiva** e moderna
- ✅ **Integração com API** Backend com fallback para mock
- ✅ **Gerenciamento de Estado** eficiente
- ✅ **Validação de Formulários** robusta

## 🚀 Tecnologias

### Core Technologies
- **Angular 20.1.1** - Framework principal
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **SCSS** - Pré-processador CSS

### Ferramentas de Desenvolvimento
- **Angular CLI** - Ferramenta de linha de comando
- **ESLint** - Linter para código
- **Karma & Jasmine** - Framework de testes

### APIs e Integrações
- **HTTP Client** - Comunicação com backend
- **LocalStorage** - Armazenamento local
- **Router** - Navegação SPA

## 🏗 Arquitetura

O projeto segue uma arquitetura modular baseada nos princípios do Angular e clean architecture:

```
src/app/
├── components/          # Componentes da aplicação
├── services/           # Serviços e lógica de negócio
├── models/             # Interfaces e tipos
├── constants/          # Constantes da aplicação
├── utils/              # Utilitários e helpers
├── config/             # Configurações
├── interceptors/       # Interceptadores HTTP
└── assets/             # Recursos estáticos
```

### 📐 Princípios Aplicados

- **Single Responsibility Principle (SRP)** - Cada classe tem uma única responsabilidade
- **Dependency Injection** - Injeção de dependências do Angular
- **Observable Pattern** - Programação reativa com RxJS
- **Service Layer Pattern** - Separação da lógica de negócio
- **Component-Service Separation** - Componentes focados na apresentação

## 📁 Estrutura do Projeto

```
cognitivo-treinamento-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── checkin/
│   │   │   │   ├── checkin.component.ts
│   │   │   │   ├── checkin.html
│   │   │   │   └── checkin.scss
│   │   │   ├── login/
│   │   │   │   ├── login.ts
│   │   │   │   ├── login.html
│   │   │   │   └── login.scss
│   │   │   ├── create-user/
│   │   │   ├── reset-password/
│   │   │   ├── ranking/
│   │   │   └── perfil/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── storage.service.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── auth.model.ts
│   │   │   ├── checkin.model.ts
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   └── app.constants.ts
│   │   ├── utils/
│   │   │   ├── date.utils.ts
│   │   │   └── validation.utils.ts
│   │   ├── config/
│   │   │   └── api.config.ts
│   │   ├── interceptors/
│   │   │   └── api.interceptor.ts
│   │   ├── assets/
│   │   │   ├── Logo.svg
│   │   │   ├── Logo2.svg
│   │   │   ├── Cerebro.svg
│   │   │   ├── Perfil.svg
│   │   │   └── Star.svg
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   └── app.html
│   ├── main.ts
│   ├── index.html
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── README.md
```

## 🔧 Instalação

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior)
- **Angular CLI** (versão 20 ou superior)

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd cognitivo-treinamento-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Instale o Angular CLI globalmente** (se não tiver)
   ```bash
   npm install -g @angular/cli
   ```

## ⚙️ Configuração

### Configuração da API

Edite o arquivo `src/app/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8002', // URL do seu backend
  USE_MOCK_API: false, // true para usar dados mock, false para API real
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login',
      REGISTER: '/users',
      RESET_PASSWORD: '/users/reset-password'
    },
    USER: {
      RANKING: '/ranking/weekly'
    },
    CHECKIN: {
      CREATE: '/checkin/',
      STATUS: '/checkin/status',
      HISTORY: '/checkin/history'
    }
  }
};
```

### Configuração de Porta

A aplicação está configurada para rodar na porta **4203**. Esta configuração está no arquivo `angular.json`:

```json
{
  "serve": {
    "options": {
      "port": 4203
    }
  }
}
```

## 🚀 Execução

### Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento na porta 4203
ng serve

# Ou com porta customizada
ng serve --port 4200
```

Acesse: `http://localhost:4203`

### Build para Produção

```bash
# Build otimizado para produção
ng build --configuration production

# Os arquivos gerados estarão em dist/
```

### Testes

```bash
# Executa testes unitários
ng test

# Executa testes com coverage
ng test --code-coverage

# Executa testes end-to-end
ng e2e
```

## 🎨 Funcionalidades

### 🔐 Sistema de Autenticação

**Login**
- ✅ Validação de formulário
- ✅ Integração com API backend
- ✅ Fallback para dados mock
- ✅ Feedback visual para usuário
- ✅ Redirecionamento automático

**Registro de Usuário**
- ✅ Criação de novos usuários
- ✅ Validação de dados
- ✅ Integração com endpoint `/users`

**Reset de Senha**
- ✅ Recuperação de senha
- ✅ Validação de usuário
- ✅ Integração com endpoint `/users/reset-password`

### ✅ Sistema de Check-in

**Check-in Inteligente**
- ✅ Validação de final de semana
- ✅ Verificação de check-in já realizado
- ✅ Mensagens contextuais
- ✅ Histórico de check-ins
- ✅ Sistema de pontuação

**Validações Implementadas**
- 🚫 Bloqueio em finais de semana
- 🚫 Prevenção de múltiplos check-ins no mesmo dia
- ✅ Confirmação visual de sucesso
- ⚠️ Alertas para situações especiais

### 📊 Sistema de Ranking

**Ranking Semanal**
- ✅ Lista ordenada por pontuação
- ✅ Informações detalhadas dos usuários
- ✅ Atualização em tempo real
- ✅ Design responsivo

### 👤 Perfil de Usuário

**Informações Pessoais**
- ✅ Dados do usuário
- ✅ Estatísticas de check-in
- ✅ Histórico de pontuação

## 🔌 API Integration

### Endpoints Suportados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/login` | Autenticação de usuário |
| `POST` | `/users` | Criação de novo usuário |
| `PUT` | `/users/reset-password` | Reset de senha |
| `GET` | `/ranking/weekly` | Ranking semanal |
| `POST` | `/checkin/` | Realizar check-in |
| `GET` | `/checkin/status` | Status do check-in |

### Formato de Resposta do Check-in Status

```typescript
interface CheckinStatusResponse {
  can_checkin: boolean;
  reason: string;
  message: string;
  today: string;
  is_weekend: boolean;
  already_checked_in: boolean;
}
```

### Sistema Mock

O sistema inclui dados mock para desenvolvimento:
- ✅ Login com credenciais de teste
- ✅ Simulação de check-ins
- ✅ Dados de ranking fictícios
- ✅ Validação de final de semana

## 🧩 Componentes

### CheckinComponent
**Responsabilidades:**
- Gerenciamento de check-ins
- Validação de finais de semana
- Exibição de status e mensagens
- Integração com API de check-in

**Principais Métodos:**
- `doCheckin()` - Realizar check-in
- `loadCheckinStatus()` - Carregar status atual
- `resetTodayCheckin()` - Reset para desenvolvimento

### LoginComponent
**Responsabilidades:**
- Autenticação de usuários
- Validação de formulários
- Redirecionamento pós-login
- Integração com AuthService

### RankingComponent
**Responsabilidades:**
- Exibição do ranking semanal
- Carregamento de dados dos usuários
- Ordenação por pontuação

### PerfilComponent
**Responsabilidades:**
- Exibição de dados do usuário
- Estatísticas pessoais
- Informações de perfil

## 🛠 Serviços

### ApiService
**Funcionalidades:**
- Comunicação com backend
- Gerenciamento de requisições HTTP
- Sistema de fallback para mock
- Tratamento de erros
- Logging detalhado

### AuthService
**Funcionalidades:**
- Gerenciamento de autenticação
- Controle de sessão
- Redirecionamentos
- Integração com StorageService

### StorageService
**Funcionalidades:**
- Gerenciamento do localStorage
- Armazenamento de dados de auth
- Cache de check-ins
- Limpeza automática de dados antigos

## 🧪 Utilitários

### DateUtils
**Funcionalidades:**
- Formatação de datas
- Validação de finais de semana
- Comparação de datas
- Helpers para datas em português

### ValidationUtils
**Funcionalidades:**
- Validação de emails
- Validação de senhas
- Validação de usernames
- Sanitização de inputs

## 📱 Design Responsivo

A aplicação foi desenvolvida com design responsivo:
- ✅ Layout adaptável para mobile, tablet e desktop
- ✅ Componentes flexíveis
- ✅ Tipografia escalável
- ✅ Navegação touch-friendly

## 🔒 Segurança

Medidas de segurança implementadas:
- ✅ Sanitização de inputs
- ✅ Validação client-side e server-side
- ✅ Gerenciamento seguro de tokens
- ✅ Proteção contra XSS básico
- ✅ Tratamento adequado de erros

## 🚀 Performance

Otimizações implementadas:
- ✅ Lazy loading de componentes
- ✅ OnPush change detection strategy
- ✅ Unsubscribe automático de observables
- ✅ Minificação de assets
- ✅ Tree shaking automático

## 🧪 Testes

Estratégia de testes:
- ✅ Testes unitários de serviços
- ✅ Testes de componentes
- ✅ Testes de integração
- ✅ Mocks para APIs externas

## 📝 Scripts Disponíveis

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "serve:prod": "ng build --configuration production && ng serve --configuration production"
  }
}
```

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
4. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. **Push** para a branch (`git push origin feature/AmazingFeature`)
6. **Abra** um Pull Request

### Padrões de Código

- ✅ Seguir o **Angular Style Guide**
- ✅ Usar **TypeScript strict mode**
- ✅ Implementar **testes unitários**
- ✅ Documentar **funções complexas**
- ✅ Seguir **convenções de naming**

### Estrutura de Commits

```
type(scope): description

feat(auth): add login functionality
fix(checkin): resolve weekend validation bug
docs(readme): update installation guide
style(components): improve CSS consistency
refactor(services): optimize API calls
test(auth): add login component tests
```

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato:

- 📧 **Email**: suporte@cognitivo.com
- 🐛 **Bugs**: [GitHub Issues](github-issues-url)
- 💡 **Sugestões**: [GitHub Discussions](github-discussions-url)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 🚀 Quick Start

```bash
# Clone e instale
git clone <repository-url>
cd cognitivo-treinamento-frontend
npm install

# Configure a API (opcional)
# Edite src/app/config/api.config.ts

# Execute em desenvolvimento
ng serve

# Acesse http://localhost:4203
```

**Credenciais de Teste (Mock):**
- Username: `admin` | Password: `123456`
- Username: `user@example.com` | Password: `password`

---

**Desenvolvido com ❤️ usando Angular 20.1.1**
