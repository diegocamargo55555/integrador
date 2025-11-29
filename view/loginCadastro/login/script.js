class FormularioLoginNeon {
    constructor() {
        this.formulario = document.getElementById('formularioLogin');
        this.botaoEnviar = this.formulario.querySelector('.botao-login');
        this.botaoAlternarSenha = document.getElementById('botaoAlternarSenha');
        this.inputSenha = document.getElementById('senha');
        this.mensagemSucesso = document.getElementById('mensagemSucesso');
        this.estaEnviando = false;

        // Validadores internos
        this.validadores = {
            email: (valor) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!valor) return { valido: false, mensagem: 'E-mail é obrigatório' };
                if (!regex.test(valor)) return { valido: false, mensagem: 'E-mail inválido' };
                return { valido: true };
            },
            senha: (valor) => {
                if (!valor) return { valido: false, mensagem: 'Senha é obrigatória' };
                if (valor.length < 6) return { valido: false, mensagem: 'Mínimo de 6 caracteres' };
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
        this.configurarBotoesSocial();
        this.adicionarEfeitosFundo();
    }

    adicionarOuvintesEventos() {
        // Envio do formulário
        this.formulario.addEventListener('submit', (e) => this.lidarComEnvio(e));

        // Validação em tempo real
        Object.keys(this.validadores).forEach(nomeCampo => {
            const campo = document.getElementById(nomeCampo);
            if (campo) {
                campo.addEventListener('blur', () => this.validarCampo(nomeCampo));
                campo.addEventListener('input', () => this.limparErro(nomeCampo));
            }
        });

        const inputs = this.formulario.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.lidarComFoco(e));
            input.addEventListener('blur', (e) => this.lidarComDesfoque(e));
        });

        const checkbox = document.getElementById('lembrar');
        if (checkbox) {
            checkbox.addEventListener('change', () => this.animarCheckbox());
        }

        const linkEsqueceu = document.querySelector('.esqueceu-senha');
        if (linkEsqueceu) {
            linkEsqueceu.addEventListener('click', (e) => this.lidarComEsqueceuSenha(e));
        }

        const linkCadastro = document.querySelector('.link-cadastro a');
        if (linkCadastro) {
            linkCadastro.addEventListener('click', (e) => this.lidarComLinkCadastro(e));
        }

        this.configurarAtalhosTeclado();
    }

    configurarRotulosFlutuantes() {
        const inputs = this.formulario.querySelectorAll('input');
        inputs.forEach(input => {
            // Verifica se tem valor ao carregar
            if (input.value.trim() !== '') {
                input.classList.add('tem-valor');
            }

            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('tem-valor');
                } else {
                    input.classList.remove('tem-valor');
                }
            });
        });
    }

    adicionarAnimacoesInput() {
        const inputs = this.formulario.querySelectorAll('input');
        inputs.forEach((input, index) => {
            // Animação escalonada ao carregar
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
                iconeAlternar.classList.toggle('mostrar-senha', ehSenha);

                // Efeito de pulso 
                this.botaoAlternarSenha.style.boxShadow = '0 0 15px rgba(141, 236, 180, 0.5)';
                setTimeout(() => {
                    this.botaoAlternarSenha.style.boxShadow = '';
                }, 300);

                // Manter foco no input
                this.inputSenha.focus();
            });
        }
    }


    lidarComFoco(e) {
        const envoltorio = e.target.closest('.envoltorio-input');
        if (envoltorio) {
            envoltorio.classList.add('focado');
            const input = envoltorio.querySelector('input');
            input.style.boxShadow = '0 0 20px rgba(141, 236, 180, 0.1)';
        }
    }

    lidarComDesfoque(e) {
        const envoltorio = e.target.closest('.envoltorio-input');
        if (envoltorio) {
            envoltorio.classList.remove('focado');
            const input = envoltorio.querySelector('input');
            input.style.boxShadow = '';
        }
    }

    animarCheckbox() {
        const checkbox = document.querySelector('.checkbox-customizado');
        if (checkbox) {
            checkbox.style.transform = 'scale(0.8)';
            checkbox.style.boxShadow = '0 0 15px rgba(141, 236, 180, 0.5)';
            setTimeout(() => {
                checkbox.style.transform = 'scale(1)';
                setTimeout(() => {
                    checkbox.style.boxShadow = '';
                }, 200);
            }, 150);
        }
    }

    lidarComEsqueceuSenha(e) {
        e.preventDefault();
        const link = e.target;
        //Fazer depois
        this.animarLink(link, 'rgba(141, 236, 180, 0.8)');
        this.mostrarNotificacao('Link de redefinição enviado para seu e-mail', 'info');
    }

    lidarComLinkCadastro(e) {
        e.preventDefault();
        const link = e.target;
        // pegar destino do href
        const destino = link.getAttribute('href') || '../cadastro/cadastro.html';
        this.animarLink(link, 'rgba(0, 153, 255, 0.8)');
        this.mostrarNotificacao('Redirecionando para página de cadastro...', 'info');
        setTimeout(() => {
            window.location.href = destino;
        }, 600);
    }

    animarLink(elemento, corSombra) {
        elemento.style.textShadow = `0 0 10px ${corSombra}`;
        elemento.style.transform = 'scale(0.98)';
        setTimeout(() => {
            elemento.style.transform = 'scale(1)';
            setTimeout(() => {
                elemento.style.textShadow = '';
            }, 200);
        }, 150);
    }

    lidarComLoginSocial(e) {
        const botao = e.currentTarget;
        const ehGoogle = botao.classList.contains('botao-google');
        const provedor = ehGoogle ? 'Google' : 'Apple';

        // Estado de carregamento com efeito neon
        botao.style.transform = 'scale(0.98)';
        botao.style.boxShadow = '0 0 25px rgba(141, 236, 180, 0.4)';
        botao.style.borderColor = 'var(--verde-principal)';

        setTimeout(() => {
            botao.style.transform = 'scale(1)';
            setTimeout(() => {
                botao.style.boxShadow = '';
                botao.style.borderColor = '';
            }, 300);
        }, 200);

        this.mostrarNotificacao(`Conectando ao ${provedor}...`, 'info');
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
            if (!this.validarCampo(nomeCampo)) {
                ehValido = false;
            }
        });

        return ehValido;
    }

    validarCampo(nomeCampo) {
        const campo = document.getElementById(nomeCampo);
        const validador = this.validadores[nomeCampo];

        if (!campo || !validador) return true;

        const resultado = validador(campo.value.trim());

        if (resultado.valido) {
            this.limparErro(nomeCampo);
            this.mostrarSucessoCampo(nomeCampo);
        } else {
            this.mostrarErro(nomeCampo, resultado.mensagem);
        }

        return resultado.valido;
    }

    mostrarErro(nomeCampo, mensagem) {
        // Ajuste para pegar o ID correto do erro (ex: erroEmail)
        const idErro = `erro${nomeCampo.charAt(0).toUpperCase() + nomeCampo.slice(1)}`;
        const grupoFormulario = document.getElementById(nomeCampo).closest('.grupo-formulario');
        const elementoErro = document.getElementById(idErro);

        if (grupoFormulario && elementoErro) {
            grupoFormulario.classList.add('erro');
            elementoErro.textContent = mensagem;
            elementoErro.classList.add('mostrar');

            // Animação de tremor
            const campo = document.getElementById(nomeCampo);
            campo.style.animation = 'tremer 0.5s ease-in-out';
            campo.style.boxShadow = '0 0 15px rgba(255, 0, 128, 0.5)';
            setTimeout(() => {
                campo.style.animation = '';
                campo.style.boxShadow = '';
            }, 500);
        }
    }

    limparErro(nomeCampo) {
        const idErro = `erro${nomeCampo.charAt(0).toUpperCase() + nomeCampo.slice(1)}`;
        const grupoFormulario = document.getElementById(nomeCampo).closest('.grupo-formulario');
        const elementoErro = document.getElementById(idErro);

        if (grupoFormulario && elementoErro) {
            grupoFormulario.classList.remove('erro');
            elementoErro.classList.remove('mostrar');
            setTimeout(() => {
                elementoErro.textContent = '';
            }, 300);
        }
    }

    mostrarSucessoCampo(nomeCampo) {
        const campo = document.getElementById(nomeCampo);
        const envoltorio = campo.closest('.envoltorio-input');
        envoltorio.style.borderColor = 'var(--verde-principal)';
        campo.style.boxShadow = '0 0 10px rgba(141, 236, 180, 0.3)';
        setTimeout(() => {
            envoltorio.style.borderColor = '';
            campo.style.boxShadow = '';
        }, 2000);
    }

    tremerFormulario() {
        const cartao = document.querySelector('.cartao-login');
        cartao.style.animation = 'tremer 0.5s ease-in-out';
        cartao.style.boxShadow = '0 0 30px rgba(255, 0, 128, 0.3)';
        setTimeout(() => {
            cartao.style.animation = '';
            cartao.style.boxShadow = '';
        }, 500);
    }

    async enviarFormulario() {
        this.estaEnviando = true;
        this.botaoEnviar.classList.add('carregando');

        this.botaoEnviar.style.boxShadow = '0 0 30px rgba(141, 236, 180, 0.6)';

        try {
            // Simular envio
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.mostrarMensagemSucesso();

        } catch (erro) {
            console.error('Erro no login:', erro);
            this.mostrarErroLogin(erro.message);
        } finally {
            this.estaEnviando = false;
            this.botaoEnviar.classList.remove('carregando');
            this.botaoEnviar.style.boxShadow = '';
        }
    }

    mostrarMensagemSucesso() {
        // Animação de saída do formulário
        this.formulario.style.opacity = '0';
        this.formulario.style.transform = 'translateY(-20px) scale(0.95)';

        // Esconder outros elementos
        const seletoresParaEsconder = ['.divisor', '.login-social', '.link-cadastro'];
        seletoresParaEsconder.forEach(seletor => {
            const elemento = document.querySelector(seletor);
            if (elemento) {
                elemento.style.opacity = '0';
                elemento.style.transform = 'translateY(-20px) scale(0.95)';
            }
        });

        // Brilho de sucesso 
        const cartao = document.querySelector('.cartao-login');
        cartao.style.boxShadow = '0 0 50px rgba(141, 236, 180, 0.4)';

        setTimeout(() => {
            this.formulario.style.display = 'none';
            seletoresParaEsconder.forEach(seletor => {
                const elemento = document.querySelector(seletor);
                if (elemento) elemento.style.display = 'none';
            });

            this.mensagemSucesso.classList.add('mostrar');
            setTimeout(() => {
                this.simularRedirecionamento();
            }, 3000);
        }, 300);
    }

    mostrarErroLogin(mensagem) {
        this.mostrarNotificacao(mensagem || 'Falha no login. Tente novamente.', 'erro');
        this.tremerFormulario();
    }

    redefinirFormulario() {
        this.mensagemSucesso.classList.remove('mostrar');

        setTimeout(() => {
            const seletoresParaMostrar = ['.divisor', '.login-social', '.link-cadastro'];
            this.formulario.style.display = 'block';

            seletoresParaMostrar.forEach(seletor => {
                const elemento = document.querySelector(seletor);
                if (elemento) elemento.style.display = 'flex';
            });

            this.formulario.reset();

            // Limpar estados
            Object.keys(this.validadores).forEach(nomeCampo => {
                this.limparErro(nomeCampo);
            });

            // Resetar aparência
            this.formulario.style.opacity = '1';
            this.formulario.style.transform = 'translateY(0) scale(1)';

            seletoresParaMostrar.forEach(seletor => {
                const elemento = document.querySelector(seletor);
                if (elemento) {
                    elemento.style.opacity = '1';
                    elemento.style.transform = 'translateY(0) scale(1)';
                }
            });

            const cartao = document.querySelector('.cartao-login');
            cartao.style.boxShadow = '';

            // Resetar input type senha
            if (this.inputSenha) {
                this.inputSenha.type = 'password';
                const icone = this.botaoAlternarSenha?.querySelector('.icone-alternar');
                if (icone) icone.classList.remove('mostrar-senha');
            }
        }, 300);
    }

    configurarAtalhosTeclado() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.closest('#formularioLogin')) {
                e.preventDefault();
                this.lidarComEnvio(e);
            }

            if (e.key === 'Escape') {
                Object.keys(this.validadores).forEach(nomeCampo => {
                    this.limparErro(nomeCampo);
                });
            }
        });
    }

    // Função auxiliar para notificações 
    mostrarNotificacao(mensagem, tipo = 'info') {
        let toast = document.getElementById('notificacao-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'notificacao-toast';
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(20, 30, 70, 0.9);
                color: #FFF5E0;
                padding: 12px 24px;
                border-radius: 8px;
                border: 1px solid rgba(141, 236, 180, 0.3);
                z-index: 1000;
                transform: translateY(-100px);
                transition: transform 0.3s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = mensagem;
        if (tipo === 'erro') {
            toast.style.borderColor = 'rgba(255, 0, 128, 0.5)';
            toast.style.color = '#ff0080';
        } else {
            toast.style.borderColor = 'rgba(141, 236, 180, 0.3)';
            toast.style.color = '#FFF5E0';
        }

        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(-100px)';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Animação de entrada do cartão
    const cartaoLogin = document.querySelector('.cartao-login');
    if (cartaoLogin) {
        cartaoLogin.style.opacity = '0';
        cartaoLogin.style.transform = 'translateY(30px) scale(0.9)';

        setTimeout(() => {
            cartaoLogin.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            cartaoLogin.style.opacity = '1';
            cartaoLogin.style.transform = 'translateY(0) scale(1)';
        }, 200);
    }

    new FormularioLoginNeon();
});