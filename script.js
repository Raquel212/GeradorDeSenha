/* ==================================================
    BLOQUEIO CONTRA INSPEÇÃO E ATALHOS DE DESENVOLVEDOR
    ================================================== */

// 1. Bloqueia o clique com o botão direito
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    mostrarMensagem("Acesso ao menu negado!");
});

// 2. Bloqueia atalhos de teclado comuns de desenvolvedor
document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        mostrarMensagem("Acesso negado!");
    }
    // Ctrl+Shift+I (Inspecionar) / Ctrl+Shift+C / Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        mostrarMensagem("Acesso negado!");
    }
    // Ctrl+U (Ver código-fonte)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        mostrarMensagem("Acesso negado!");
    }
});


/* ==================================================
    LÓGICA PRINCIPAL DO GERADOR DE SENHAS
    ================================================== */

let historicoDeSenhas = [];

function randomIndex(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

function embaralharString(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomIndex(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function gerarSenhas() {
    const length = parseInt(document.getElementById("length").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const excludeChars = document.getElementById("exclude").value;
    
    const useUpper = document.getElementById("chk-upper").checked;
    const useLower = document.getElementById("chk-lower").checked;
    const useNumbers = document.getElementById("chk-numbers").checked;
    const useSymbols = document.getElementById("chk-symbols").checked;

    if (!useUpper && !useLower && !useNumbers && !useSymbols) {
        mostrarMensagem("Selecione pelo menos um tipo de caractere!");
        return;
    }

    if (length < 4) {
        mostrarMensagem("Tamanho mínimo é 4!");
        return;
    }

    let resultados = [];

    for (let i = 0; i < quantity; i++) {
        let senha = gerarSenhaUnica(length, useUpper, useLower, useNumbers, useSymbols, excludeChars);
        resultados.push(senha);
        
        historicoDeSenhas.unshift(senha);
    }

    const campoSenha = document.getElementById("password");
    campoSenha.value = resultados.join('\n');
    
    campoSenha.rows = resultados.length > 5 ? 5 : resultados.length;

    atualizarInterfaceHistorico();
    copiarParaAreaDeTransferencia(campoSenha.value, "Senha(s) copiada(s)");
}

function gerarSenhaUnica(length, useUpper, useLower, useNum, useSym, excludeStr) {
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let num = "0123456789";
    let sym = "!@#$%^&*()_+~|}{[]:;?><,./-=";

    // Filtra os caracteres a serem excluídos
    if (excludeStr) {
        const arrExclusao = excludeStr.split('');
        upper = upper.split('').filter(c => !arrExclusao.includes(c)).join('');
        lower = lower.split('').filter(c => !arrExclusao.includes(c)).join('');
        num = num.split('').filter(c => !arrExclusao.includes(c)).join('');
        sym = sym.split('').filter(c => !arrExclusao.includes(c)).join('');
    }

    let charset = "";
    let caracteresGarantidos = [];

    if (useUpper && upper) { charset += upper; caracteresGarantidos.push(upper[randomIndex(upper.length)]); }
    if (useLower && lower) { charset += lower; caracteresGarantidos.push(lower[randomIndex(lower.length)]); }
    if (useNum && num) { charset += num; caracteresGarantidos.push(num[randomIndex(num.length)]); }
    if (useSym && sym) { charset += sym; caracteresGarantidos.push(sym[randomIndex(sym.length)]); }

    if (charset.length === 0) return "ERRO: Sem caracteres válidos!";

    let senha = "";
    
    for (let i = 0; i < caracteresGarantidos.length; i++) {
        if(senha.length < length) senha += caracteresGarantidos[i];
    }

    while (senha.length < length) {
        senha += charset[randomIndex(charset.length)];
    }

    return embaralharString(senha);
}

function atualizarInterfaceHistorico() {
    const lista = document.getElementById("history-list");
    lista.innerHTML = ""; 

    // Mantém apenas os últimos 20 no histórico para não pesar
    if(historicoDeSenhas.length > 20) {
        historicoDeSenhas = historicoDeSenhas.slice(0, 20);
    }

    if (historicoDeSenhas.length === 0) {
        lista.innerHTML = "<li style='color: var(--text-muted); font-size: 12px; text-align: center;'>Nenhuma senha gerada ainda.</li>";
        return;
    }

    historicoDeSenhas.forEach(senha => {
        const li = document.createElement("li");
        li.className = "history-item";
        
        // Trunca a visualização se for muito longa, mas cópia a inteira
        const senhaExibicao = senha.length > 25 ? senha.substring(0, 25) + "..." : senha;

        li.innerHTML = `
            <span>${senhaExibicao}</span>
            <button title="Copiar esta senha">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>
        `;
        
        // Adiciona evento de clique no botão de copiar do item do histórico
        li.querySelector('button').onclick = () => {
            copiarParaAreaDeTransferencia(senha, "Senha do histórico copiada!");
        };

        lista.appendChild(li);
    });
}

function limparHistorico() {
    historicoDeSenhas = [];
    atualizarInterfaceHistorico();
    mostrarMensagem("Histórico limpo! 🗑️");
}

function copiarSenhaManualmente() {
    const senha = document.getElementById("password").value;
    if (!senha) {
        mostrarMensagem("Gere uma senha primeiro!");
        return;
    }
    copiarParaAreaDeTransferencia(senha, "Senha(s) copiada(s)!");
}

function copiarParaAreaDeTransferencia(texto, mensagemSucesso) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarMensagem(mensagemSucesso);
        }).catch(err => {
            fallbackCopiar(texto, mensagemSucesso);
        });
    } else {
        fallbackCopiar(texto, mensagemSucesso);
    }
}

function fallbackCopiar(texto, mensagemSucesso) {
    const tempInput = document.createElement("textarea");
    tempInput.value = texto;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
        document.execCommand("copy");
        mostrarMensagem(mensagemSucesso);
    } catch (err) {
        mostrarMensagem("Erro ao copiar a senha.");
    }
    
    document.body.removeChild(tempInput);
}

let toastTimeout;
function mostrarMensagem(texto) {
    const toast = document.getElementById("toast");
    toast.textContent = texto;
    toast.classList.add("show");
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Inicializa estado vazio do histórico
atualizarInterfaceHistorico();