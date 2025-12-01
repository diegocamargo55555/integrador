document.addEventListener("DOMContentLoaded", function () {
    
    const btnAbrirEntrada = document.querySelector('.botao-acao--receita');
    const btnAbrirSaida = document.querySelector('.botao-acao--despesa');
    const modalEntrada = document.getElementById('modal-nova-entrada');
    const modalSaida = document.getElementById('modal-nova-saida');

    function abrirModal(modal) { if(modal) modal.style.display = 'flex'; }
    function fecharModal(modal) { if(modal) modal.style.display = 'none'; }

    if (btnAbrirEntrada && btnAbrirSaida && modalEntrada && modalSaida) {

        btnAbrirEntrada.addEventListener('click', () => abrirModal(modalEntrada));
        btnAbrirSaida.addEventListener('click', () => abrirModal(modalSaida));

        document.querySelectorAll('.botao-form-cancelar').forEach(btn => {
            btn.addEventListener('click', () => fecharModal(btn.closest('.modal-fundo')));
        });

        document.querySelectorAll('.modal-fundo').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) fecharModal(overlay);
            });
        });

        const formEntrada = modalEntrada.querySelector('.formulario-transacao');
        if (formEntrada) {
            formEntrada.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(formEntrada);
                const dados = Object.fromEntries(formData.entries());
                
                console.log("NOVA ENTRADA:", dados); 
                alert(`Entrada de R$ ${dados['entrada-valor']} registrada!`);
                
                fecharModal(modalEntrada);
                formEntrada.reset();
            });
        }

        const formSaida = modalSaida.querySelector('.formulario-transacao');
        if (formSaida) {
            formSaida.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(formSaida);
                const dados = Object.fromEntries(formData.entries());
                
                console.log("NOVA SAÍDA:", dados);
                alert(`Saída de R$ ${dados['saida-valor']} registrada em ${dados['saida-categoria']}!`);
                
                fecharModal(modalSaida);
                formSaida.reset();
            });
        }
    }

    const inputInicio = document.getElementById('data-inicio');
    const inputFim = document.getElementById('data-fim');
    const formatarISO = (data) => data.toISOString().split('T')[0];

    if (inputInicio && inputFim) {
        const hoje = new Date();
        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

        inputInicio.value = formatarISO(primeiroDiaMes);
        inputFim.value = formatarISO(hoje);
    }

    const inputsDataModal = document.querySelectorAll('.modal-conteudo input[type="date"]');
    const hojeISO = formatarISO(new Date());

    inputsDataModal.forEach(input => {
        if (!input.value) {
            input.value = hojeISO;
        }
    });
});