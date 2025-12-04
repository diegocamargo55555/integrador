document.addEventListener("DOMContentLoaded", function () {
    const API_URL_USER = 'http://localhost:8080/aginisia/user';

    const formPerfil = document.getElementById('form-perfil');
    const inputNome = document.getElementById('perfil-nome');
    const inputEmail = document.getElementById('perfil-email');
    const inputSenha = document.getElementById('perfil-senha');
    const inputConfirma = document.getElementById('perfil-confirma-senha');
    const btnLogout = document.getElementById('btn-logout-pagina');

    // Elementos do Modal de Logout
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
    }

    function exibirNotificacao(mensagem, tipo = 'sucesso') {
        const container = document.getElementById('container-notificacoes');
        if(!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        
        let icone = '✅';
        if(tipo === 'erro') icone = '❌';
        if(tipo === 'aviso') icone = '⚠️';

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
            if(response.ok) {
                const dados = await response.json();
                inputNome.value = dados.name || "";
                inputEmail.value = dados.email || "";
            } else {
                throw new Error("Erro ao buscar dados");
            }
        } catch(e) { 
            console.error(e);
            exibirNotificacao("Erro ao carregar seus dados.", "erro");
        }
    }

    formPerfil.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuarioId = localStorage.getItem('usuario_id');
        
        const senha = inputSenha.value;
        const confirma = inputConfirma.value;

        if (senha && senha !== confirma) {
            exibirNotificacao("As senhas não coincidem!", "erro");
            return;
        }

        const payload = {
            name: inputNome.value,
            email: inputEmail.value
        };
        
        if (senha) payload.senha = senha; 

        try {
            const response = await fetch(`${API_URL_USER}/${usuarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Erro ao atualizar");

            localStorage.setItem('usuario_nome', payload.name);
            localStorage.setItem('usuario_email', payload.email);
            
            exibirNotificacao("Perfil atualizado com sucesso!", "sucesso");
            
            inputSenha.value = '';
            inputConfirma.value = '';

        } catch (error) {
            exibirNotificacao("Erro ao atualizar perfil.", "erro");
        }
    });

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if(modalLogout) modalLogout.style.display = 'flex';
        });
    }

    if (btnCancelarLogout) {
        btnCancelarLogout.addEventListener('click', () => {
            if(modalLogout) modalLogout.style.display = 'none';
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

    iniciar();
});