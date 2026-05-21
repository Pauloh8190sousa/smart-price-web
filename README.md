# Smart Price Web

Frontend da aplicação **Smart Price**, desenvolvido com React, TypeScript, Vite e Shadcn UI.

O projeto tem como objetivo fornecer uma interface moderna e performática para gerenciamento e consulta de preços, autenticação de usuários e operações administrativas.

---

## 🚀 Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- React Hook Form
- Zod
- Axios
- Tailwind CSS v4
- Shadcn UI
- Sonner

---

## 📁 Estrutura do Projeto

```txt
src/
├── assets/
├── components/
│   ├── form/
│   └── ui/
├── lib/
├── pages/
├── routes/
├── services/
├── types/
├── index.css
└── main.tsx
```

---

## 📦 Instalação

Clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd smart-price-web
```

Instale as dependências:

```bash
npm install
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

---

## ▶️ Executando o Projeto

Modo desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Preview da build:

```bash
npm run preview
```

---

## 🔐 Autenticação

A autenticação é baseada em JWT.

Fluxo atual:

- Login via API
- Armazenamento do token no `localStorage`
- Interceptor Axios adicionando automaticamente o `Authorization`
- Rotas privadas protegidas

---

## 🧩 Componentes Reutilizáveis

O projeto utiliza componentes reutilizáveis para formulários:

- `Form`
- `FormField`
- `FormSubmit`

Com integração entre:

- React Hook Form
- Zod
- Shadcn UI

---

## 📄 Funcionalidades Atuais

- Login
- Logout
- Proteção de rotas privadas
- Toasts de feedback
- Integração com API
- Estrutura escalável para CRUDs

---

## 📌 Próximas Implementações

- Dashboard completo
- CRUD de produtos
- CRUD de lojas
- Controle de permissões
- Tema dark/light
- Sidebar administrativa
- Tabelas e filtros
- Skeleton loading
- Persistência de usuário autenticado

---

## 👨‍💻 Autor

Paulo Henrique Sousa
