document.addEventListener("DOMContentLoaded", function () {
    const API_URL_USER = 'http://localhost:8080/aginisia/user';

    const formPerfil = document.getElementById('form-perfil');
    const inputNome = document.getElementById('perfil-nome');
    const inputEmail = document.getElementById('perfil-email');
    const inputSenha = document.getElementById('perfil-senha');
    const inputConfirma = document.getElementById('perfil-confirma-senha');
    const inputSenhaAtual = document.getElementById('perfil-senha-atual');

    const btnLogout = document.getElementById('btn-logout-pagina');
    const modalLogout = document.getElementById('modal-logout');
    const btnConfirmarLogout = document.getElementById('btn-confirmar-logout');
    const btnCancelarLogout = document.getElementById('btn-cancelar-logout');

    function iniciar() {
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
            exibirNotificacao("Usuário não identificado.", "erro");
            setTimeout(() => window.location.href = '../loginCadastro/login/login.html', 1500);
            return;
        }
        carregarDadosUsuario(usuarioId);
        configurarValidacaoEmTempoReal();
    }

    function exibirNotificacao(mensagem, tipo = 'sucesso') {
        const container = document.getElementById('container-notificacoes');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        let icone = tipo === 'erro' ? '❌' : (tipo === 'aviso' ? '⚠️' : '✅');

        toast.innerHTML = `<span>${icone}</span> <span>${mensagem}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    async function carregarDadosUsuario(id) {
        try {
            const response = await fetch(`${API_URL_USER}/${id}`);
            if (response.ok) {
                const dados = await response.json();
                inputNome.value = dados.name || dados.Nome || "";
                inputEmail.value = dados.email || dados.Email || "";
            } else {
                throw new Error("Erro ao buscar dados");
            }
        } catch (e) {
            console.error(e);
            exibirNotificacao("Erro ao carregar seus dados.", "erro");
        }
    }

    formPerfil.addEventListener('submit', async (e) => {
        e.preventDefault();

        document.querySelectorAll('.input-form').forEach(limparErroInput);

        const usuarioId = localStorage.getItem('usuario_id');
        const nome = inputNome.value.trim();
        const email = inputEmail.value.trim();
        const senhaNova = inputSenha.value;
        const senhaAtual = inputSenhaAtual.value;
        const confirma = inputConfirma.value;

        let temErro = false;

        if (!nome) {
            mostrarErroInput(inputNome, "Nome é obrigatório.");
            temErro = true;
        } else if (!nome.includes(' ') || nome.split(' ').pop().length < 1) {
            mostrarErroInput(inputNome, "Por favor, digite seu nome e sobrenome.");
            temErro = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            mostrarErroInput(inputEmail, "E-mail é obrigatório.");
            temErro = true;
        } else if (!emailRegex.test(email)) {
            mostrarErroInput(inputEmail, "E-mail inválido.");
            temErro = true;
        }

        if (senhaNova) {
            if (senhaNova.length < 8) {
                mostrarErroInput(inputSenha, "A nova senha deve ter no mínimo 8 caracteres.");
                temErro = true;
            }

            if (senhaNova !== confirma) {
                mostrarErroInput(inputConfirma, "As senhas não coincidem.");
                temErro = true;
            }

            if (!senhaAtual) {
                mostrarErroInput(inputSenhaAtual, "Digite sua senha atual para confirmar a mudança.");
                temErro = true;
            }
        }

        if (temErro) {
            exibirNotificacao("Corrija os campos em vermelho.", "erro");
            return;
        }

        const payload = {
            name: nome,
            email: email
        };

        if (senhaNova) {
            payload.senha = senhaNova;
            payload.senha_atual = senhaAtual;
        }

        try {
            const response = await fetch(`${API_URL_USER}/${usuarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const erroData = await response.json();
                throw new Error(erroData.error || "Erro ao atualizar");
            }

            localStorage.setItem('usuario_nome', payload.name);
            if (payload.email) localStorage.setItem('usuario_email', payload.email);

            exibirNotificacao("Perfil atualizado com sucesso!", "sucesso");

            inputSenha.value = '';
            inputConfirma.value = '';
            inputSenhaAtual.value = '';

        } catch (error) {
            console.error(error);
            exibirNotificacao(error.message || "Erro ao atualizar perfil.", "erro");
        }
    });

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (modalLogout) modalLogout.style.display = 'flex';
        });
    }

    if (btnCancelarLogout) {
        btnCancelarLogout.addEventListener('click', () => {
            if (modalLogout) modalLogout.style.display = 'none';
        });
    }

    if (btnConfirmarLogout) {
        btnConfirmarLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../loginCadastro/login/login.html';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalLogout) {
            modalLogout.style.display = 'none';
        }
    });

    function mostrarErroInput(input, mensagem) {
        input.classList.add('erro');
        const divPai = input.parentElement;
        if (!divPai.querySelector('.msg-erro-campo')) {
            const span = document.createElement('span');
            span.className = 'msg-erro-campo';
            span.style.color = '#e74c3c';
            span.style.fontSize = '0.8em';
            span.style.marginTop = '5px';
            span.style.display = 'block';
            span.innerText = mensagem;
            divPai.appendChild(span);
        }
    }

    function limparErroInput(input) {
        input.classList.remove('erro');
        const divPai = input.parentElement;
        const span = divPai.querySelector('.msg-erro-campo');
        if (span) span.remove();
    }

    function configurarValidacaoEmTempoReal() {
        const inputs = document.querySelectorAll('.input-form');
        inputs.forEach(input => {
            input.addEventListener('input', () => limparErroInput(input));
        });
    }

    iniciar();
});