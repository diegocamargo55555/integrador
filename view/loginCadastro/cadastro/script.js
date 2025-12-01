class FormularioCadastro {
    constructor() {
        this.formulario = document.getElementById('formularioCadastro');
        this.botaoCadastrar = this.formulario.querySelector('button[type="submit"]');
        this.botoesAlternarSenha = document.querySelectorAll('.alternar-senha');
        this.mensagemSucesso = document.getElementById('mensagemSucesso');
        this.estaEnviando = false;

        this.validadores = {
            nome: (valor) => {
                if (!valor) return { valido: false, mensagem: 'O nome é obrigatório' };
                if (valor.split(' ').length < 2) return { valido: false, mensagem: 'Digite seu nome completo' };
                return { valido: true };
            },
            email: (valor) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!valor) return { valido: false, mensagem: 'E-mail é obrigatório' };
                if (!regex.test(valor)) return { valido: false, mensagem: 'Digite um e-mail válido' };
                return { valido: true };
            },
            senha: (valor) => {
                if (!valor) return { valido: false, mensagem: 'Senha é obrigatória' };
                if (valor.length < 9) return { valido: false, mensagem: 'Mínimo de 9 caracteres' };
                return { valido: true };
            },
            confirmaSenha: (valor) => {
                const senhaPrincipal = document.getElementById('senha').value;
                if (!valor) return { valido: false, mensagem: 'Confirme sua senha' };
                if (valor !== senhaPrincipal) return { valido: false, mensagem: 'As senhas não coincidem' };
                return { valido: true };
            },
            termos: (checked) => {
                if (!checked) return { valido: false, mensagem: 'Você precisa aceitar os termos' };
                return { valido: true };
            }
        };

        this.iniciar();
    }

    iniciar() {
        this.configurarEventos();
        this.configurarLabelsFlutuantes();
        this.configurarVisibilidadeSenha();
    }

    configurarEventos() {
        this.formulario.addEventListener('submit', (e) => this.lidarComEnvio(e));

        const camposTexto = ['nome', 'email', 'senha', 'confirmaSenha'];

        camposTexto.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                campo.addEventListener('blur', () => this.validarCampo(id));
                campo.addEventListener('input', () => {
                    this.limparErro(id);
                    if (id === 'senha') {
                        const confirma = document.getElementById('confirmaSenha');
                        if (confirma.value) this.limparErro('confirmaSenha');
                    }
                });
            }
        });

        const termos = document.getElementById('termos');
        if (termos) {
            termos.addEventListener('change', () => this.limparErro('termos'));
        }
    }

    configurarLabelsFlutuantes() {
        const inputs = this.formulario.querySelectorAll('input:not([type="checkbox"])');
        inputs.forEach(input => {
            if (input.value) input.classList.add('tem-valor');
            input.addEventListener('input', () => {
                input.classList.toggle('tem-valor', input.value.trim() !== '');
            });
        });
    }

    configurarVisibilidadeSenha() {
        this.botoesAlternarSenha.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icone = btn.querySelector('i');

                const ehSenha = input.type === 'password';
                input.type = ehSenha ? 'text' : 'password';

                if (ehSenha) {
                    icone.classList.remove('fa-eye');
                    icone.classList.add('fa-eye-slash');
                } else {
                    icone.classList.remove('fa-eye-slash');
                    icone.classList.add('fa-eye');
                }
            });
        });
    }

    validarCampo(id) {
        const campo = document.getElementById(id);
        const validador = this.validadores[id];

        if (!campo || !validador) return true;

        const valor = (campo.type === 'checkbox') ? campo.checked : campo.value.trim();
        const resultado = validador(valor);

        if (!resultado.valido) {
            this.mostrarErro(id, resultado.mensagem);
        } else {
            this.limparErro(id);
        }

        return resultado.valido;
    }

    mostrarErro(id, msg) {
        const grupo = document.getElementById(id).closest('.grupo-formulario') || document.querySelector('.opcoes-formulario');
        const idErro = 'erro' + id.charAt(0).toUpperCase() + id.slice(1);
        const spanErro = document.getElementById(idErro);

        if (grupo) grupo.classList.add('erro');
        if (spanErro) {
            spanErro.textContent = msg;
            spanErro.classList.add('mostrar');
        }
    }

    limparErro(id) {
        const grupo = document.getElementById(id).closest('.grupo-formulario') || document.querySelector('.opcoes-formulario');
        const idErro = 'erro' + id.charAt(0).toUpperCase() + id.slice(1);
        const spanErro = document.getElementById(idErro);

        if (grupo) grupo.classList.remove('erro');
        if (spanErro) spanErro.classList.remove('mostrar');
    }

    validarTudo() {
        let valido = true;
        ['nome', 'email', 'senha', 'confirmaSenha'].forEach(id => {
            if (!this.validarCampo(id)) valido = false;
        });
        if (!this.validarCampo('termos')) valido = false;

        return valido;
    }

    async lidarComEnvio(e) {
        e.preventDefault();
        if (this.estaEnviando) return;

        if (!this.validarTudo()) {
            const card = document.querySelector('.cartao-login');
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'shake 0.4s';
            return;
        }

        this.estaEnviando = true;
        this.botaoCadastrar.classList.add('carregando');

        const dadosUsuario = {
            name: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        };

        try {
            const response = await fetch('http://localhost:8080/aginisia/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosUsuario)
            });

            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(resultado.error || 'Erro ao criar conta');
            }

            // Sucesso Visual
            this.formulario.style.display = 'none';
            // Verifica se esses elementos existem antes de tentar esconder
            const divisor = document.querySelector('.divisor');
            const loginSocial = document.querySelector('.login-social');
            if (divisor) divisor.style.display = 'none';
            if (loginSocial) loginSocial.style.display = 'none';

            document.querySelector('.link-cadastro').style.display = 'none';

            this.mensagemSucesso.classList.add('mostrar');

            // Redireciona para o login após 2.5 segundos
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 2500);

        } catch (err) {
            console.error(err);
            
            const msg = err.message.toLowerCase();

            if (msg.includes('senha') || msg.includes('password')) {
                this.mostrarErro('senha', err.message);
            } else {
                this.mostrarErro('email', err.message);
            }
        } finally {
            this.estaEnviando = false;
            this.botaoCadastrar.classList.remove('carregando');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FormularioCadastro();
});