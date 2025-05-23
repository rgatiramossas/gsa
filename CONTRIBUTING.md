# Guia de Contribuição

Obrigado por seu interesse em contribuir com o Sistema de Gestão para Oficinas de Funilaria! Este documento fornece diretrizes para contribuir com o projeto.

## 🚀 Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js 18 ou superior
- MySQL 8.0 ou superior
- Git

### Configuração Inicial

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/sistema-gestao-funilaria.git
cd sistema-gestao-funilaria
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o banco de dados MySQL:**
```sql
CREATE DATABASE funilaria_db;
CREATE USER 'funilaria_user'@'localhost' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON funilaria_db.* TO 'funilaria_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Configure as variáveis de ambiente:**
```bash
# Crie um arquivo .env na raiz do projeto
DATABASE_URL=mysql://funilaria_user:sua_senha@localhost:3306/funilaria_db
```

5. **Execute o projeto:**
```bash
npm run dev
```

## 🏗️ Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Hooks customizados
│   │   ├── lib/           # Utilitários e configurações
│   │   └── assets/        # Imagens e recursos estáticos
├── server/                # Backend Express
│   ├── routes.ts          # Definição das rotas da API
│   ├── storage.ts         # Interface de armazenamento
│   ├── mysql-storage.ts   # Implementação para MySQL
│   └── index.ts           # Servidor principal
├── shared/                # Código compartilhado
│   └── schema.ts         # Esquemas de dados e validação
└── docs/                 # Documentação adicional
```

## 📝 Padrões de Código

### Frontend (React/TypeScript)
- Use TypeScript para todos os componentes
- Implemente componentes funcionais com hooks
- Use Tailwind CSS para estilização
- Siga a convenção de nomenclatura camelCase

### Backend (Node.js/Express)
- Use TypeScript para type safety
- Implemente middleware de autenticação adequado
- Use o padrão Repository para acesso a dados
- Valide dados de entrada com Zod

### Banco de Dados
- Use Drizzle ORM para operações de banco
- Mantenha migrações versionadas
- Evite operações DELETE/UPDATE diretas sem confirmação

## 🔄 Fluxo de Contribuição

1. **Fork do projeto**
2. **Crie uma branch para sua feature:**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Faça suas alterações seguindo os padrões**
4. **Teste suas alterações localmente**
5. **Commit suas mudanças:**
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```
6. **Push para sua branch:**
   ```bash
   git push origin feature/nova-funcionalidade
   ```
7. **Abra um Pull Request**

## 📋 Tipos de Contribuição

### 🐛 Correção de Bugs
- Descreva claramente o problema
- Inclua passos para reproduzir
- Forneça a solução proposta

### ✨ Novas Funcionalidades
- Discuta a funcionalidade antes de implementar
- Siga os padrões de design existentes
- Inclua testes quando aplicável

### 📚 Documentação
- Mantenha a documentação atualizada
- Use linguagem clara e objetiva
- Inclua exemplos quando útil

## 🧪 Testes

Antes de submeter seu PR, certifique-se de que:
- [ ] O projeto compila sem erros
- [ ] Todas as funcionalidades existentes continuam funcionando
- [ ] As novas funcionalidades foram testadas
- [ ] A interface continua responsiva

## 📞 Suporte

Se você tiver dúvidas ou precisar de ajuda:
- Abra uma issue no GitHub
- Entre em contato via email: admin@example.com

## 🙏 Reconhecimento

Todas as contribuições são valorizadas e reconhecidas. Contribuidores serão listados no README do projeto.

---

**Lembre-se:** Este projeto visa facilitar o dia a dia de oficinas de funilaria. Mantenha sempre o foco na usabilidade e na experiência do usuário final.