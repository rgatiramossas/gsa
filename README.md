# Sistema de Gestão para Oficinas de Funilaria

Um sistema completo de gestão para oficinas de funilaria e reparo de veículos, desenvolvido com foco em dispositivos móveis e experiência do usuário intuitiva.

## 🚗 Sobre o Projeto

Este sistema foi desenvolvido para streamlizar os processos operacionais de oficinas de funilaria, oferecendo uma interface responsiva e moderna para gerenciar clientes, veículos e serviços.

## ✨ Funcionalidades

### 📱 Interface Mobile-First
- Design responsivo otimizado para dispositivos móveis
- Navegação intuitiva e consistente entre plataformas
- Interface adaptável para desktop e mobile

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Histórico de serviços por cliente
- Informações de contato e localização
- Visualização detalhada de dados

### 🔐 Sistema de Autenticação
- Login seguro com diferentes níveis de acesso
- Roles de usuário: Admin, Técnico, Gerente
- Proteção de rotas sensíveis

### 📊 Dashboard de Performance
- Acompanhamento de serviços em andamento
- Estatísticas de receita
- Serviços pendentes, em progresso e concluídos
- Visualização de dados em tempo real

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Wouter** - Roteamento leve para React
- **TanStack Query** - Gerenciamento de estado do servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Lucide React** - Ícones modernos

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web para Node.js
- **MySQL** - Banco de dados relacional
- **Drizzle ORM** - ORM TypeScript-first
- **Passport.js** - Middleware de autenticação

### Ferramentas de Desenvolvimento
- **Vite** - Build tool e servidor de desenvolvimento
- **ESBuild** - Bundler JavaScript rápido
- **PostCSS** - Processador CSS

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- MySQL configurado
- Git instalado

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sistema-gestao-funilaria.git
cd sistema-gestao-funilaria
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Configure suas variáveis de banco de dados MySQL
DATABASE_URL=mysql://usuario:senha@localhost:3306/nome_do_banco
```

4. Execute o projeto:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5000`

## 📂 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Hooks customizados
│   │   └── lib/           # Bibliotecas e utilitários
├── server/                # Backend Express
│   ├── routes.ts          # Rotas da API
│   ├── storage.ts         # Interface de armazenamento
│   └── mysql-storage.ts   # Implementação MySQL
├── shared/                # Código compartilhado
│   └── schema.ts         # Esquemas de dados
└── docs/                 # Documentação
```

## 🔑 Usuário Padrão

Para testar o sistema, use as credenciais padrão:
- **Usuário:** admin
- **Senha:** admin123

## 🎯 Funcionalidades Principais

### Gestão de Clientes
- ✅ Listagem de clientes
- ✅ Cadastro de novos clientes
- ✅ Edição de dados do cliente
- ✅ Visualização detalhada
- ✅ Histórico de serviços

### Dashboard
- ✅ Estatísticas de serviços
- ✅ Receita total
- ✅ Serviços por status
- ✅ Interface responsiva

### Autenticação
- ✅ Login seguro
- ✅ Controle de acesso por roles
- ✅ Proteção de rotas

## 🔮 Próximas Funcionalidades

- [ ] Gestão completa de serviços
- [ ] Sistema de orçamentos
- [ ] Relatórios detalhados
- [ ] Notificações em tempo real
- [ ] Integração com sistemas de pagamento
- [ ] App mobile nativo

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Alessandro Figueiredo**
- Email: admin@example.com

## 🙏 Agradecimentos

- Equipe de desenvolvimento
- Comunidade open source
- Oficinas parceiras que forneceram feedback

---

💡 **Dica:** Este sistema foi desenvolvido pensando na praticidade do dia a dia de oficinas de funilaria, priorizando uma interface limpa e funcionalidades essenciais para o negócio.