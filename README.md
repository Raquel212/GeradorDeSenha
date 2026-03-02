# 🔐 Gerador de Senhas

Um gerador de senhas moderno, seguro e altamente personalizável desenvolvido com **HTML, CSS e JavaScript**.  

O projeto apresenta uma interface elegante com efeito **Glassmorphism** e fundo animado, proporcionando uma excelente experiência de utilização tanto em desktop quanto em dispositivos móveis.

---

## ✨ Funcionalidades

- 🔢 **Geração Múltipla**  
  Escolha a quantidade de senhas a gerar de uma só vez (até 20).

- 📏 **Comprimento Personalizável**  
  Defina o tamanho da senha (de 4 a 64 caracteres).

- 🎛️ **Filtros Avançados**  
  Ative ou desative:
  - Letras maiúsculas  
  - Letras minúsculas  
  - Números  
  - Símbolos  

- 🚫 **Exclusão de Caracteres**  
  Evite caracteres confusos digitando quais deseja remover (ex: `O`, `0`, `l`, `1`).

- 🕘 **Histórico de Senhas**  
  Armazena automaticamente as últimas 20 senhas geradas na sessão atual, com botões de cópia rápida.

- 📋 **Cópia Inteligente**  
  Copie todas as senhas geradas com um único clique, com notificações visuais (Toast).

- 🛡️ **Proteção Básica de UI**  
  Scripts que bloqueiam o clique com o botão direito e atalhos de ferramentas de desenvolvedor (`F12`, `Ctrl+Shift+I`) para uma experiência de ecrã mais limpa.

- 📱 **Design Responsivo**  
  Interface fluida que se adapta a diferentes tamanhos de tela.

---

## 🚀 Tecnologias Utilizadas

- **HTML5**  
  Estrutura semântica do projeto.

- **CSS3**  
  - Variáveis CSS  
  - Flexbox  
  - Grid  
  - Animações (`@keyframes`)  
  - Efeito Glassmorphism (`backdrop-filter`)

- **JavaScript (ES6+)**  
  - Geração aleatória segura com `crypto.getRandomValues`  
  - Manipulação do DOM  
  - Gestão da área de transferência (Clipboard API)

---

## 🔒 Segurança

A geração das senhas utiliza a API nativa `crypto.getRandomValues`, garantindo maior segurança e imprevisibilidade na criação dos caracteres, diferente de métodos baseados apenas em `Math.random()`.

---

## 📌 Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

- Praticar JavaScript moderno (ES6+)
- Trabalhar manipulação dinâmica do DOM
- Criar uma interface moderna e interativa
- Aplicar boas práticas de UX/UI
- Implementar geração segura de dados aleatórios

---
