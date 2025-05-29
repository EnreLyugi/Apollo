# Apollo Discord Bot

Um bot Discord multifuncional desenvolvido por Enre Lyugi, com recursos de música, sistema de XP, mensagens de boas-vindas personalizadas, notificações de aniversário e muito mais.

## 🌟 Funcionalidades

### 🎵 Sistema de Música
- Reprodução de músicas via URL ou nome
- Suporte para várias plataformas de música
- Comandos de controle: play, stop, skip

### ⭐ Sistema de XP
- Sistema de níveis e XP
- Cargos automáticos baseados em XP
- Configuração personalizada de XP por servidor

### 👋 Sistema de Boas-vindas
- Mensagens de boas-vindas personalizáveis
- Suporte para imagens personalizadas
- Cargo automático para novos membros

### 🎂 Sistema de Aniversários
- Notificações de aniversário
- Cargos especiais para aniversariantes
- Canal dedicado para aniversários

### 🛍️ Sistema de Loja
- Loja de cargos coloridos
- Sistema de economia integrado

### 📝 Logs
- Logs de atividade de voz
- Logs de moderação
- Logs de mensagens

## 🛠️ Tecnologias Utilizadas

- TypeScript
- Node.js
- Discord.js
- Sequelize (PostgreSQL)
- Discord Player
- Express
- WebSocket

## ⚙️ Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
yarn install
```

3. Configure as variáveis de ambiente necessárias:
- `DISCORD_TOKEN`
- `DISCORD_CLIENT_ID`
- Outras variáveis de ambiente necessárias para o banco de dados

4. Execute o bot:
```bash
# Desenvolvimento
yarn dev

# Produção
yarn build
yarn start
```

## 📜 Comandos Principais

- `/music play` - Reproduz uma música
- `/music stop` - Para a reprodução
- `/music skip` - Pula para a próxima música
- `/xp` - Verifica seu XP
- `/set channel` - Configura canais automáticos
- `/set role` - Configura cargos especiais
- `/shop` - Acessa a loja
- `/help` - Lista todos os comandos disponíveis

## 🌐 Idiomas Suportados

- Português (BR)
- Inglês (US)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido por Enre Lyugi

---

Para suporte ou mais informações, entre em contato com o desenvolvedor.