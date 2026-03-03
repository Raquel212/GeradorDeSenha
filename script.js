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
    const useBasicSymbols = document.getElementById("chk-basic-symbols").checked;
    const useExtendedSymbols = document.getElementById("chk-extended-symbols").checked;

    if (!useUpper && !useLower && !useNumbers && !useBasicSymbols && !useExtendedSymbols) {
        mostrarMensagem("Selecione pelo menos um tipo de caractere!");
        return;
    }

    if (length < 4) {
        mostrarMensagem("Tamanho mínimo é 4!");
        return;
    }

    let resultados = [];

    for (let i = 0; i < quantity; i++) {
        let senha = gerarSenhaUnica(
            length,
            useUpper,
            useLower,
            useNumbers,
            useBasicSymbols,
            useExtendedSymbols,
            excludeChars
        );

        resultados.push(senha);
        historicoDeSenhas.unshift(senha);
    }

    const campoSenha = document.getElementById("password");
    campoSenha.value = resultados.join('\n');
    campoSenha.rows = resultados.length > 5 ? 5 : resultados.length;

    atualizarInterfaceHistorico();
    copiarParaAreaDeTransferencia(campoSenha.value, "Senha(s) copiada(s)!");
}

function gerarSenhaUnica(length, useUpper, useLower, useNum, useBasicSym, useExtendedSym, excludeStr) {

    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let num = "0123456789";
    let basicSym = "!@#$%&*";
    let extendedSym = "\"'´¨{[]}~^/?;:.>,<()-_=+";

    if (excludeStr) {
        const arrExclusao = excludeStr.split('');

        upper = upper.split('').filter(c => !arrExclusao.includes(c)).join('');
        lower = lower.split('').filter(c => !arrExclusao.includes(c)).join('');
        num = num.split('').filter(c => !arrExclusao.includes(c)).join('');
        basicSym = basicSym.split('').filter(c => !arrExclusao.includes(c)).join('');
        extendedSym = extendedSym.split('').filter(c => !arrExclusao.includes(c)).join('');
    }

    let charset = "";
    let caracteresGarantidos = [];

    if (useUpper && upper) {
        charset += upper;
        caracteresGarantidos.push(upper[randomIndex(upper.length)]);
    }

    if (useLower && lower) {
        charset += lower;
        caracteresGarantidos.push(lower[randomIndex(lower.length)]);
    }

    if (useNum && num) {
        charset += num;
        caracteresGarantidos.push(num[randomIndex(num.length)]);
    }

    if (useBasicSym && basicSym) {
        charset += basicSym;
        caracteresGarantidos.push(basicSym[randomIndex(basicSym.length)]);
    }

    if (useExtendedSym && extendedSym) {
        charset += extendedSym;
        caracteresGarantidos.push(extendedSym[randomIndex(extendedSym.length)]);
    }

    if (charset.length === 0) {
        return "ERRO: Sem caracteres válidos!";
    }

    let senha = "";

    for (let i = 0; i < caracteresGarantidos.length && senha.length < length; i++) {
        senha += caracteresGarantidos[i];
    }

    while (senha.length < length) {
        senha += charset[randomIndex(charset.length)];
    }

    return embaralharString(senha);
}

function atualizarInterfaceHistorico() {
    const lista = document.getElementById("history-list");
    lista.innerHTML = "";

    if (historicoDeSenhas.length > 20) {
        historicoDeSenhas = historicoDeSenhas.slice(0, 20);
    }

    if (historicoDeSenhas.length === 0) {
        lista.innerHTML = "<li style='opacity:0.6;'>Nenhuma senha gerada ainda.</li>";
        return;
    }

    historicoDeSenhas.forEach(senha => {
        const li = document.createElement("li");
        li.className = "history-item";

        li.innerHTML = `
            <span>${senha}</span>
            <button onclick="copiarParaAreaDeTransferencia('${senha}', 'Senha copiada!')">
                Copiar
            </button>
        `;

        lista.appendChild(li);
    });
}

function limparHistorico() {
    historicoDeSenhas = [];
    atualizarInterfaceHistorico();
    mostrarMensagem("Histórico limpo!");
}

function copiarSenhaManualmente() {
    const senha = document.getElementById("password").value;
    if (!senha) {
        mostrarMensagem("Gere uma senha primeiro!");
        return;
    }
    copiarParaAreaDeTransferencia(senha, "Senha(s) copiada(s)!");
}

function copiarParaAreaDeTransferencia(texto, mensagem) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarMensagem(mensagem);
    });
}

function mostrarMensagem(texto) {
    const toast = document.getElementById("toast");
    toast.textContent = texto;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

atualizarInterfaceHistorico();