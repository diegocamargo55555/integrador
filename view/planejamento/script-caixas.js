document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. LÓGICA DO CALENDÁRIO (Navegador de Mês)
    // ==========================================
    const textoMes = document.querySelector('.mes-atual');
    const textoDia = document.querySelector('.dia-atual'); // Opcional, se tiver no HTML
    const botoesNav = document.querySelectorAll('.seta-nav');
    
    let dataAtual = new Date();

    function atualizarCabecalhoData() {
        if (!textoMes) return;

        // Formata para "Fevereiro 2025" (primeira letra maiúscula via CSS ou JS)
        const opcoes = { month: 'long', year: 'numeric' };
        textoMes.textContent = dataAtual.toLocaleDateString('pt-BR', opcoes);

        // Se tiver o dia (ex: Dia 23)
        if (textoDia) {
            const hoje = new Date();
            // Só mostra o dia se estivermos no mês corrente
            if (dataAtual.getMonth() === hoje.getMonth() && dataAtual.getFullYear() === hoje.getFullYear()) {
                textoDia.textContent = `Dia ${hoje.getDate()}`;
            } else {
                textoDia.textContent = "Visualizando"; 
            }
        }
    }

    if (botoesNav.length >= 2) {
        // Voltar Mês
        botoesNav[0].addEventListener('click', () => {
            dataAtual.setMonth(dataAtual.getMonth() - 1);
            atualizarCabecalhoData();
            // Futuro: chamar função carregarCaixas(dataAtual) se tiver histórico
        });

        // Avançar Mês
        botoesNav[1].addEventListener('click', () => {
            dataAtual.setMonth(dataAtual.getMonth() + 1);
            atualizarCabecalhoData();
        });
    }

    // Inicializa a data assim que carrega
    atualizarCabecalhoData();


    // ==========================================
    // 2. LÓGICA DAS CAIXAS E GRÁFICOS
    // ==========================================
    let graficoDonut, graficoLinha, graficoBarras;
    
    const listaDeCaixas = document.querySelectorAll('.item-caixa'); 
    const painelDetalhe = document.querySelector('.painel-detalhe');
    
    const ctxDonut = document.getElementById('graficoDonut');
    const ctxLinha = document.getElementById('graficoCrescimento');
    const ctxBarras = document.getElementById('graficoDepositos');
    
    const modalConfig = document.getElementById('modal-config-caixa');
    const formConfig = document.getElementById('config-caixa-form');
    const btnCancelarConfig = document.getElementById('config-cancel-btn');

    // Funções de Modal
    function abrirModal(modal) { if(modal) modal.style.display = 'flex'; }
    function fecharModal(modal) { if(modal) modal.style.display = 'none'; }

    if (listaDeCaixas.length > 0 && painelDetalhe && ctxDonut && modalConfig) {
        
        // Elementos do Modal
        const inputConfigValor = document.getElementById('config-valor-desejado');
        const inputConfigDeposito = document.getElementById('config-deposito-mensal');
        const inputConfigCor = document.getElementById('config-cor');

        // Elementos do Painel de Detalhe
        const detalheTitulo = painelDetalhe.querySelector('.titulo-detalhe');
        const detalheIcone = painelDetalhe.querySelector('.icone-detalhe');
        const detalheValorTotal = document.getElementById('detalhe-valor-total');
        const detalheTempo = document.getElementById('detalhe-tempo');
        const detalheValorMensal = document.getElementById('detalhe-valor-mensal');

        let caixaSendoEditada = null;

        // Calcular Tempo Estimado
        function calcularEAtualizarEstimativa(caixa) {
            const dados = caixa.dataset;
            const valorTotal = parseFloat(dados.valorTotal || 0);
            const valorAtual = parseFloat(dados.valorAtual || 0);
            const depositoMensal = parseFloat(dados.valorMensal || 0);

            let mesesEstimados = 0;
            if (depositoMensal > 0) {
                const valorRestante = valorTotal - valorAtual;
                if (valorRestante > 0) {
                    mesesEstimados = Math.ceil(valorRestante / depositoMensal);
                }
            }

            const spanEstimativa = caixa.querySelector('.estimativa-caixa strong');
            if (spanEstimativa) {
                spanEstimativa.textContent = mesesEstimados > 0 ? `${mesesEstimados} meses` : "Concluído!";
            }
            return mesesEstimados;
        }

        // Desenhar Gráficos
        function atualizarGraficos(dados) {
            const percent = parseFloat(dados.percent || 0);
            const labels = JSON.parse(dados.graficoLabels || "[]");
            const dadosCrescimento = JSON.parse(dados.crescimentoDados || "[]");
            const dadosDepositos = JSON.parse(dados.depositosDados || "[]");
            const cor = dados.color || '#141E46'; 

            if (graficoDonut) graficoDonut.destroy();
            if (graficoLinha) graficoLinha.destroy();
            if (graficoBarras) graficoBarras.destroy();

            // Rosca
            graficoDonut = new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: ['Tenho', 'Falta'],
                    datasets: [{
                        data: [percent, 100 - percent],
                        backgroundColor: [cor, '#FFF5E0'],
                        borderWidth: 0
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
            });

            // Linha
            graficoLinha = new Chart(ctxLinha, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Evolução',
                        data: dadosCrescimento,
                        borderColor: cor,
                        backgroundColor: cor + '20',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 4
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                }
            });

            // Barras
            graficoBarras = new Chart(ctxBarras, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Depósitos',
                        data: dadosDepositos,
                        backgroundColor: cor,
                        borderRadius: 4
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                }
            });
        }

        // Event Listeners das Caixas
        listaDeCaixas.forEach(caixa => {
            caixa.addEventListener('click', () => {
                // Remove ativo de todas e adiciona na clicada
                listaDeCaixas.forEach(c => c.classList.remove('ativo'));
                caixa.classList.add('ativo');

                const dados = caixa.dataset;
                const meses = calcularEAtualizarEstimativa(caixa);

                // Preenche o painel lateral
                detalheTitulo.textContent = dados.title;
                detalheIcone.style.backgroundColor = dados.color;
                detalheValorTotal.textContent = parseFloat(dados.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                detalheTempo.textContent = meses > 0 ? `${meses} meses` : "Concluído";
                detalheValorMensal.textContent = parseFloat(dados.valorMensal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                atualizarGraficos(dados);
                
                // Em mobile, scrolla suave até o detalhe
                if(window.innerWidth <= 1024) {
                    painelDetalhe.scrollIntoView({ behavior: 'smooth' });
                }
            });

            // Botão Engrenagem (Configurar)
            const btnConfig = caixa.querySelector('.btn-config-caixa');
            if(btnConfig) {
                btnConfig.addEventListener('click', (e) => {
                    e.stopPropagation(); // Impede que o clique abra o painel lateral
                    caixaSendoEditada = caixa;
                    const dados = caixaSendoEditada.dataset;
                    
                    inputConfigValor.value = dados.valorTotal;
                    inputConfigDeposito.value = dados.valorMensal;
                    inputConfigCor.value = dados.color;
                    
                    abrirModal(modalConfig);
                });
            }
            
            // Calculo inicial
            calcularEAtualizarEstimativa(caixa);
        });

        // Seleciona a primeira caixa automaticamente ao abrir
        const caixaAtivaInicial = document.querySelector('.item-caixa.ativo') || listaDeCaixas[0];
        if (caixaAtivaInicial) caixaAtivaInicial.click();

        // Lógica do Modal Salvar/Cancelar
        if (btnCancelarConfig) {
            btnCancelarConfig.addEventListener('click', () => {
                fecharModal(modalConfig);
                caixaSendoEditada = null;
            });
        }

        if (formConfig) {
            formConfig.addEventListener('submit', (e) => {
                e.preventDefault();
                if (caixaSendoEditada) {
                    // Atualiza Dataset
                    caixaSendoEditada.dataset.valorTotal = inputConfigValor.value;
                    caixaSendoEditada.dataset.valorMensal = inputConfigDeposito.value;
                    caixaSendoEditada.dataset.color = inputConfigCor.value;

                    // Atualiza visual da lista (barra e cor)
                    const barra = caixaSendoEditada.querySelector('.preenchimento-progresso');
                    const iconeLista = caixaSendoEditada.querySelector('.icone-caixa-lista'); // Se tiver ícone na lista
                    if (barra) barra.style.backgroundColor = inputConfigCor.value;
                    
                    // Recalcula e atualiza tudo
                    calcularEAtualizarEstimativa(caixaSendoEditada);
                    caixaSendoEditada.click(); // Força update do painel lateral

                    fecharModal(modalConfig);
                    caixaSendoEditada = null;
                }
            });
        }
    }
});