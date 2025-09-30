# 🚀 API Pokémon - Sistema Completo de Gerenciamento Pokémon

Uma aplicação full-stack para explorar, favoritar e gerenciar equipes de Pokémon com autenticação segura e interface moderna.

## ✨ Funcionalidades

### 🔐 Autenticação & Usuário
- **Registro e Login** seguro com JWT
- **Sessões persistentes** com tokens de acesso
- **Gestão de perfil** de usuário

### 🔍 Exploração de Pokémon
- **Busca inteligente** por nome ou ID
- **Filtro por gerações** (1ª à 9ª geração)
- **Visualização detalhada** com tipos e imagens
- **Integração em tempo real** com PokeAPI

### ⭐ Sistema de Favoritos
- **Adicionar/remover** Pokémon aos favoritos
- **Lista personalizada** por usuário
- **Acesso rápido** aos Pokémon preferidos

### ⚔️ Equipe de Batalha
- **Montagem estratégica** de equipes
- **Limite de 6 Pokémon** por equipe
- **Status visual** do progresso da equipe
- **Gerenciamento intuitivo** de membros

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python** com Flask
- **SQLAlchemy** para ORM
- **JWT** para autenticação
- **SQLite** como banco de dados
- **Flask-CORS** para comunicação entre domínios

### Frontend
- **Angular 17+** com Standalone Components
- **TypeScript** para tipagem estática
- **Bootstrap 5** para UI/UX
- **Font Awesome** para ícones
- **RxJS** para programação reativa

## 📋 Pré-requisitos

- **Node.js** 18+ e npm
- **Python** 3.8+
- **Git** para versionamento

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone https://github.com/Gabriel-33/api-pokemon.git
cd api-pokemon
# Navegue para a pasta do backend
cd api-pokemon

# Instale as dependências Python
pip install -r requirements.txt

# Configure o CORS (no arquivo app.py)
# Altere a origem para sua URL do frontend:
CORS(app, origins=["http://localhost:4200"], supports_credentials=True)

# Navegue para a pasta do frontend
cd pokedex-frontend

# Instale as dependências Node.js
npm install

# Configure a URL da API (src/app/services/pokemon-api.service.ts)
# Altere a apiUrl para seu backend:
private apiUrl = 'http://localhost:5000';

cd api-pokemon
python app.py

cd pokedex-frontend
ng serve