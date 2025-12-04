class FormularioLoginNeon {
    constructor() {
        this.formulario = document.getElementById('formularioLogin');
        this.botaoEnviar = this.formulario.querySelector('.botao-login');
        this.botaoAlternarSenha = document.getElementById('botaoAlternarSenha');
        this.inputSenha = document.getElementById('senha');
        this.mensagemSucesso = document.getElementById('mensagemSucesso');
        this.estaEnviando = false;

        // Validadores
        this.validadores = {
            email: (valor) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!valor) return { valido: false, mensagem: 'E-mail é obrigatório' };
                if (!regex.test(valor)) return { valido: false, mensagem: 'E-mail inválido' };
                return { valido: true };
            },
            senha: (valor) => {
                if (!valor) return { valido: false, mensagem: 'Senha é obrigatória' };
                return { valido: true };
            }
        };

        this.iniciar();
    }

    iniciar() {
        this.adicionarOuvintesEventos();
        this.configurarRotulosFlutuantes();
        this.adicionarAnimacoesInput();
        this.configurarAlternanciaSenha();
    }

    adicionarOuvintesEventos() {
        this.formulario.addEventListener('submit', (e) => this.lidarComEnvio(e));

        Object.keys(this.validadores).forEach(nomeCampo => {
            const campo = document.getElementById(nomeCampo);
            if (campo) {
                campo.addEventListener('blur', () => this.validarCampo(nomeCampo));
                campo.addEventListener('input', () => this.limparErro(nomeCampo));
            }
        });
    }

    configurarRotulosFlutuantes() {
        const inputs = this.formulario.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.value.trim() !== '') input.classList.add('tem-valor');
            input.addEventListener('input', () => {
                input.value.trim() !== '' ? input.classList.add('tem-valor') : input.classList.remove('tem-valor');
            });
        });
    }

    adicionarAnimacoesInput() {
        const inputs = this.formulario.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.style.opacity = '0';
            input.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                input.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                input.style.opacity = '1';
                input.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    configurarAlternanciaSenha() {
        if (this.botaoAlternarSenha && this.inputSenha) {
            this.botaoAlternarSenha.addEventListener('click', () => {
                const ehSenha = this.inputSenha.type === 'password';
                const iconeAlternar = this.botaoAlternarSenha.querySelector('.icone-alternar');

                this.inputSenha.type = ehSenha ? 'text' : 'password';

                if (iconeAlternar) {
                    iconeAlternar.classList.toggle('mostrar-senha', ehSenha);
                }

                this.inputSenha.focus();
            });
        }
    }

    async lidarComEnvio(e) {
        e.preventDefault();
        if (this.estaEnviando) return;

        const ehValido = this.validarFormulario();

        if (ehValido) {
            await this.enviarFormulario();
        } else {
            this.tremerFormulario();
        }
    }

    validarFormulario() {
        let ehValido = true;
        Object.keys(this.validadores).forEach(nomeCampo => {
            if (!this.validarCampo(nomeCampo)) ehValido = false;
        });
        return ehValido;
    }

    validarCampo(nomeCampo) {
        const campo = document.getElementById(nomeCampo);
        const validador = this.validadores[nomeCampo];
        if (!campo || !validador) return true;

        const resultado = validador(campo.value.trim());
        resultado.valido ? this.limparErro(nomeCampo) : this.mostrarErro(nomeCampo, resultado.mensagem);
        return resultado.valido;
    }

    mostrarErro(nomeCampo, mensagem) {
        const idErro = `erro${nomeCampo.charAt(0).toUpperCase() + nomeCampo.slice(1)}`;
        const elementoErro = document.getElementById(idErro);
        const grupo = document.getElementById(nomeCampo).closest('.grupo-formulario');

        if (elementoErro && grupo) {
            grupo.classList.add('erro');
            elementoErro.textContent = mensagem;
            elementoErro.classList.add('mostrar');
        }
    }

    limparErro(nomeCampo) {
        const idErro = `erro${nomeCampo.charAt(0).toUpperCase() + nomeCampo.slice(1)}`;
        const elementoErro = document.getElementById(idErro);
        const grupo = document.getElementById(nomeCampo).closest('.grupo-formulario');

        if (elementoErro && grupo) {
            grupo.classList.remove('erro');
            elementoErro.classList.remove('mostrar');
            elementoErro.textContent = '';
        }
    }

    async enviarFormulario() {
        this.estaEnviando = true;
        this.botaoEnviar.classList.add('carregando');

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch('http://localhost:8080/aginisia/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciais inválidas');
            }

            if (data.token) {
                localStorage.setItem('user_token', data.token);
                localStorage.setItem('usuario_id', data.user.id);
            }

            this.mostrarMensagemSucesso();

        } catch (erro) {
            console.error(erro);
            this.mostrarErroLogin(erro.message);
        } finally {
            this.estaEnviando = false;
            this.botaoEnviar.classList.remove('carregando');
        }
    }

    mostrarMensagemSucesso() {
        this.formulario.style.display = 'none';

        // Esconder elementos extras
        const extras = ['.divisor', '.link-cadastro', '.login-social'];
        extras.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = 'none';
        });

        this.mensagemSucesso.classList.add('mostrar');

        setTimeout(() => {
            window.location.href = '../../gastos/gastos.html';
        }, 2000);
    }

    mostrarErroLogin(mensagem) {
        this.tremerFormulario();
        this.mostrarErro('senha', mensagem);
    }

    tremerFormulario() {
        const cartao = document.querySelector('.cartao-login');
        if (cartao) {
            cartao.style.animation = 'none';
            cartao.offsetHeight;
            cartao.style.animation = 'tremer 0.5s ease-in-out';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FormularioLoginNeon();
});