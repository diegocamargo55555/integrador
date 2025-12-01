document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Lógica do Navegador de Mês (Topo) ---
    const textoMes = document.querySelector('.mes-atual');
    const textoDia = document.querySelector('.dia-atual');
    const botoesNav = document.querySelectorAll('.seta-nav');
    
    // Estado atual
    let dataNavegacao = new Date();

    function atualizarCabecalho() {
        if (!textoMes) return;

        // Formata: "Janeiro 2025"
        const formatadorMes = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
        textoMes.textContent = formatadorMes.format(dataNavegacao);

        // Se existir o indicador de dia (Dia 23)
        if (textoDia) {
            // Se estivermos no mês/ano atual, mostra o dia de hoje. Senão, esconde ou mostra dia 01
            const hoje = new Date();
            if (dataNavegacao.getMonth() === hoje.getMonth() && dataNavegacao.getFullYear() === hoje.getFullYear()) {
                textoDia.textContent = `Dia ${hoje.getDate()}`;
            } else {
                textoDia.textContent = "Visualizando"; 
            }
        }
    }

    if (botoesNav.length >= 2) {
        // Botão Voltar (<)
        botoesNav[0].addEventListener('click', () => {
            dataNavegacao.setMonth(dataNavegacao.getMonth() - 1);
            atualizarCabecalho();
            // Aqui você chamaria a função que recarrega dados: carregarDados(dataNavegacao);
        });

        // Botão Avançar (>)
        botoesNav[1].addEventListener('click', () => {
            dataNavegacao.setMonth(dataNavegacao.getMonth() + 1);
            atualizarCabecalho();
            // carregarDados(dataNavegacao);
        });
    }

    // Inicializa
    atualizarCabecalho();


    // --- 2. Preencher Inputs de Data Automaticamente (Modais) ---
    // Pega todos os inputs do tipo date
    const inputsData = document.querySelectorAll('input[type="date"]');
    
    const hojeISO = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    inputsData.forEach(input => {
        // Só preenche se estiver vazio
        if (!input.value) {
            input.value = hojeISO;
        }
    });

    // Ajusta o filtro da Home para Inicio = Dia 1, Fim = Hoje
    const inputInicio = document.getElementById('data-inicio');
    const inputFim = document.getElementById('data-fim');
    
    if (inputInicio && inputFim) {
        const primeiroDia = new Date(dataNavegacao.getFullYear(), dataNavegacao.getMonth(), 1).toISOString().split('T')[0];
        inputInicio.value = primeiroDia;
        inputFim.value = hojeISO;
    }
});