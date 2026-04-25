# ✅ Tasks CRUD — React Native + TypeScript + SQLite

Aplicação mobile de gerenciamento de tarefas com CRUD completo, construída com **React Native (Expo)**, **TypeScript** e persistência local via **SQLite**.

---

## 📱 Funcionalidades

| Operação | Descrição |
|----------|-----------|
| **Create** | Criar nova tarefa com título, descrição e prioridade |
| **Read** | Listar todas as tarefas / Ver detalhes de uma tarefa |
| **Update** | Editar tarefa existente / Marcar como concluída |
| **Delete** | Excluir tarefa com confirmação |

### Extras
- Estatísticas: total, pendentes e concluídas
- Filtro visual por prioridade (baixa / média / alta)
- Persistência local com SQLite (dados sobrevivem ao fechamento do app)
- Tema dark moderno com design system próprio

---

## 🗂️ Estrutura do Projeto

```
rn-crud-tasks/
├── App.tsx                        # Entry point, inicializa DB e navegação
├── src/
│   ├── types/
│   │   ├── Task.ts                # Interface Task e DTOs
│   │   └── Navigation.ts         # Tipos de navegação
│   ├── database/
│   │   └── taskRepository.ts     # Camada de acesso ao SQLite
│   ├── hooks/
│   │   └── useTasks.ts           # Hook de estado e operações CRUD
│   ├── components/
│   │   ├── theme.ts              # Design tokens (cores, tipografia, espaçamentos)
│   │   ├── TaskCard.tsx          # Card de tarefa na listagem
│   │   └── EmptyState.tsx        # Estado vazio da lista
│   └── screens/
│       ├── TaskListScreen.tsx    # Tela principal (lista)
│       ├── TaskFormScreen.tsx    # Tela de criação / edição
│       └── TaskDetailScreen.tsx  # Tela de detalhes
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🏗️ Arquitetura

```
Screens (UI)
    │
    ▼
useTasks (Hook)   ←→  State local (useState)
    │
    ▼
taskRepository (Database Layer)
    │
    ▼
expo-sqlite (SQLite)
```

**Camadas:**
- **Screens** — Responsabilidade exclusiva de UI e navegação
- **Hook (`useTasks`)** — Gerencia estado em memória e orquestra chamadas ao repositório
- **Repository** — Toda lógica de banco (SQL) isolada aqui; tipagem forte com generics do expo-sqlite
- **Types** — Interfaces e DTOs compartilhados entre camadas

---

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- [Expo Go](https://expo.dev/go) no celular **ou** Android Studio / Xcode

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/rn-crud-tasks.git
cd rn-crud-tasks

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Executar no dispositivo
- **Celular físico**: escaneie o QR code com o app Expo Go
- **Android emulador**: pressione `a` no terminal
- **iOS simulator**: pressione `i` no terminal

---

## 🛠️ Stack Técnica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React Native | 0.74 | Framework mobile |
| Expo | ~51 | Toolchain / build |
| TypeScript | ~5.3 | Tipagem estática |
| expo-sqlite | ~14 | Persistência SQLite |
| React Navigation | ^6 | Navegação entre telas |
| @expo/vector-icons | ^14 | Ícones (Ionicons) |

---

## 📋 Schema do Banco

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  priority    TEXT    NOT NULL DEFAULT 'medium'
                      CHECK(priority IN ('low', 'medium', 'high')),
  completed   INTEGER NOT NULL DEFAULT 0,
  createdAt   TEXT    NOT NULL,
  updatedAt   TEXT    NOT NULL
);
```

---

## 📸 Telas

| Lista | Nova Tarefa | Detalhes |
|-------|-------------|----------|
| Visão geral com stats | Formulário com prioridade | Detalhes completos + ações |

---

## 📄 Licença

MIT — fique à vontade para usar e modificar.
