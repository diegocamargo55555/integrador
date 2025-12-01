const API_USERS = "http://localhost:8080/users";

document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("formularioCadastro");
    if (formCadastro) {
        formCadastro.addEventListener("submit", registrarUsuario);
    }
});

// ============================================================
// FUNÇÃO PRINCIPAL DE CADASTRO (POST)
// ============================================================
async function registrarUsuario(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.classList.add('carregando'); // Feedback visual de loading

    // 1. Coleta dados do formulário
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmaSenha = document.getElementById("confirmaSenha").value;
    const termos = document.getElementById("termos").checked;

    // 2. Validações básicas (Front-end)
    // Verifica se as senhas batem
    if (senha !== confirmaSenha) {
        mostrarErroInput('confirmaSenha', 'As senhas não coincidem.');
        btn.classList.remove('carregando');
        return;
    }

    // Verifica se aceitou os termos
    if (!termos) {
        mostrarErroInput('termos', 'Aceite os termos para continuar.');
        btn.classList.remove('carregando');
        return;
    }

    // 3. Monta o payload (Objeto JSON igual à struct do Go)
    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    try {
        // Envia para o Backend
        const response = await fetch(API_USERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoUsuario)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || "Erro ao criar usuário");
        }

        // 4. Sucesso!
        const msgSucesso = document.querySelector('.mensagem-sucesso');
        if (msgSucesso) msgSucesso.classList.add('mostrar');
        
        // Esconde o formulário para focar na mensagem
        const form = document.querySelector('.formulario-login');
        if (form) form.style.display = 'none'; 
        
        // Redireciona para o login após 2 segundos
        setTimeout(() => {
            window.location.href = "../login/login.html"; 
        }, 2000);

    } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Não foi possível realizar o cadastro: " + error.message);
    } finally {
        btn.classList.remove('carregando');
    }
}