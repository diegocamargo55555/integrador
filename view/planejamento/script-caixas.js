document.addEventListener("DOMContentLoaded", function () {
    const API_URL = 'http://localhost:8080/aginisia/planejamento';
    const API_URL_CATEGORIAS = 'http://localhost:8080/aginisia/categoria';
    const API_URL_GASTOS = 'http://localhost:8080/aginisia/gasto';
    
    const containerLista = document.querySelector('.conteudo-lista');
    
    const detalheTitulo = document.querySelector('.titulo-detalhe');
    const detalheIcone = document.querySelector('.icone-detalhe');
    const detalheValorTotal = document.getElementById('detalhe-valor-total');
    const detalheFalta = document.getElementById('detalhe-falta');
    const detalheMensal = document.getElementById('detalhe-valor-mensal');
    const detalheTempo = document.getElementById('detalhe-tempo');
    const areaAcoes = document.querySelector('.acoes-detalhe');
    
    const modalConfig = document.getElementById('modal-config-caixa');
    const modalDeposito = document.getElementById('modal-deposito');
    const selectCategoria = document.getElementById('config-categoria');
    
    const modalAviso = document.getElementById('modal-aviso-exclusao');
    const spanNomeExcluir = document.getElementById('nome-meta-excluir');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');

    let chartDonut, chartLine, chartBar;
    let listaMetas = [];
    let listaGastos = [];
    let metaSelecionada = null;
    let metaEditandoID = null;
    let idParaExcluir = null;

    function iniciar() {
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
            exibirNotificacao("Usuário não identificado.", "erro");
            return;
        }
        carregarTudo(usuarioId);
    }

    function exibirNotificacao(mensagem, tipo = 'sucesso') {
        const container = document.getElementById('container-notificacoes');
        if(!container) return;
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

    async function carregarTudo(usuarioId) {
        try {
            const [resCat, resMetas, resGastos] = await Promise.all([
                fetch(`${API_URL_CATEGORIAS}/user/${usuarioId}`),
                fetch(`${API_URL}/user/${usuarioId}`),
                fetch(`${API_URL_GASTOS}/user/${usuarioId}`)
            ]);

            if (resCat.ok && selectCategoria) {
                const categorias = await resCat.json();
                selectCategoria.innerHTML = '<option value="">Selecione...</option>';
                categorias.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.id || cat.ID;
                    opt.textContent = cat.name || cat.Name;
                    selectCategoria.appendChild(opt);
                });
            }

            if (resGastos.ok) listaGastos = await resGastos.json();

            if (resMetas.ok) {
                listaMetas = await resMetas.json();
                renderizarLista();
                if (listaMetas.length > 0) {
                    const idParaSelecionar = metaSelecionada ? (metaSelecionada.id || metaSelecionada.ID) : (listaMetas[0].id || listaMetas[0].ID);
                    selecionarMeta(idParaSelecionar);
                } else {
                    limparDetalhes();
                }
            }
        } catch (e) {
            containerLista.innerHTML = '<div style="text-align:center; padding:20px; color:#888">Erro ao carregar dados.</div>';
            console.error(e);
        }
    }

    function renderizarLista() {
        containerLista.innerHTML = '';
        if (!listaMetas || listaMetas.length === 0) {
            containerLista.innerHTML = '<div style="text-align:center; padding:20px; color:#888">Nenhuma meta encontrada.</div>';
            return;
        }

        listaMetas.forEach(meta => {
            const idReal = meta.id || meta.ID;
            const vTotal = meta.valor_Desejado || 0;
            const vAtual = meta.valor_atual || 0;
            const cor = meta.cor || '#141E46';
            const pct = vTotal > 0 ? Math.min((vAtual / vTotal) * 100, 100) : 0;

            const div = document.createElement('div');
            div.className = 'item-caixa';
            div.dataset.id = idReal;
            if (metaSelecionada && (metaSelecionada.id || metaSelecionada.ID) === idReal) div.classList.add('ativo');

            div.innerHTML = `
                <button class="btn-config-caixa">⚙️</button>
                <h3 class="titulo-caixa" style="color:${cor}">${meta.name || meta.Nome}</h3>
                <div class="barra-progresso-caixa">
                    <div class="preenchimento-progresso" style="width:${pct}%; background:${cor}"></div>
                </div>
                <div class="valores-caixa">
                    <span class="valor-atual">${formatarMoedaCompacta(vAtual)}</span>
                    <span class="valor-meta">de ${formatarMoedaCompacta(vTotal)}</span>
                </div>
            `;

            div.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-config-caixa')) {
                    e.stopPropagation();
                    abrirModalEdicao(meta);
                } else {
                    selecionarMeta(idReal);
                }
            });
            containerLista.appendChild(div);
        });
    }

    function selecionarMeta(id) {
        metaSelecionada = listaMetas.find(m => (m.id || m.ID) === id);
        if (!metaSelecionada) return;

        document.querySelectorAll('.item-caixa').forEach(el => el.classList.toggle('ativo', el.dataset.id === id));
        areaAcoes.style.display = 'flex';

        const vTotal = metaSelecionada.valor_Desejado || 0;
        const vAtual = metaSelecionada.valor_atual || 0;
        const vMensal = metaSelecionada.estima_deposito_mensal || 0;
        const cor = metaSelecionada.cor || '#141E46';
        const falta = Math.max(vTotal - vAtual, 0);

        detalheTitulo.textContent = metaSelecionada.name || metaSelecionada.Nome;
        detalheIcone.style.backgroundColor = cor;
        detalheValorTotal.textContent = formatarMoeda(vTotal);
        detalheFalta.textContent = formatarMoeda(falta);
        detalheMensal.textContent = formatarMoeda(vMensal);

        if (vMensal > 0 && falta > 0) {
            const mesesRestantes = Math.ceil(falta / vMensal);
            if (mesesRestantes > 12) {
                const anos = Math.floor(mesesRestantes / 12);
                const meses = mesesRestantes % 12;
                detalheTempo.textContent = `${anos} ano(s) e ${meses} mês(es)`;
            } else {
                detalheTempo.textContent = `${mesesRestantes} mês(es)`;
            }
        } else if (falta <= 0) {
            detalheTempo.textContent = "Concluída! 🎉";
        } else {
            detalheTempo.textContent = "-";
        }

        const depositosHistorico = listaGastos
            .filter(g => (g.planejamento_id || g.PlanejamentoId) === id);

        atualizarGraficos(vTotal, vAtual, vMensal, cor, depositosHistorico);
    }

    function limparDetalhes() {
        detalheTitulo.textContent = "Nenhuma Meta";
        areaAcoes.style.display = 'none';
        if(chartDonut) chartDonut.destroy();
        if(chartLine) chartLine.destroy();
        if(chartBar) chartBar.destroy();
    }

    document.getElementById('btn-depositar-meta').addEventListener('click', () => {
        if(!metaSelecionada) return;
        document.getElementById('nome-meta-deposito').textContent = metaSelecionada.name || metaSelecionada.Nome;
        document.getElementById('form-deposito').reset();
        document.getElementById('deposito-data').value = new Date().toISOString().split('T')[0];
        modalDeposito.style.display = 'flex';
    });

    document.getElementById('form-deposito').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = metaSelecionada.id || metaSelecionada.ID;
        const valor = parseFloat(document.getElementById('deposito-valor').value);
        const data = document.getElementById('deposito-data').value;
        const usuarioId = localStorage.getItem('usuario_id');

        try {
            const response = await fetch(`${API_URL}/${id}/depositar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor: valor, data: data })
            });

            if (!response.ok) throw new Error("Erro no depósito");
            exibirNotificacao("Depósito realizado!", "sucesso");
            modalDeposito.style.display = 'none';
            carregarTudo(usuarioId);
        } catch (error) {
            exibirNotificacao("Erro: " + error.message, "erro");
        }
    });

    window.abrirModalCriacao = function() {
        metaEditandoID = null;
        document.getElementById('modal-titulo').textContent = "Nova Meta";
        document.getElementById('config-caixa-form').reset();
        modalConfig.style.display = 'flex';
    };

    window.abrirModalEdicao = function(meta) {
        metaEditandoID = meta.id || meta.ID;
        document.getElementById('modal-titulo').textContent = "Editar Meta";
        document.getElementById('config-nome').value = meta.name || meta.Nome;
        document.getElementById('config-valor-total').value = meta.valor_Desejado;
        document.getElementById('config-valor-atual').value = meta.valor_atual;
        document.getElementById('config-mensal').value = meta.estima_deposito_mensal;
        document.getElementById('config-cor').value = meta.cor;
        if(selectCategoria) selectCategoria.value = meta.categoria_id || meta.CategoriaId;
        modalConfig.style.display = 'flex';
    };

    document.getElementById('config-caixa-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuarioId = localStorage.getItem('usuario_id');
        const catId = selectCategoria ? selectCategoria.value : null;
        if (!catId) { exibirNotificacao("Selecione uma categoria!", "aviso"); return; }

        const payload = {
            name: document.getElementById('config-nome').value,
            valor_Desejado: parseFloat(document.getElementById('config-valor-total').value),
            valor_atual: parseFloat(document.getElementById('config-valor-atual').value),
            estima_deposito_mensal: parseFloat(document.getElementById('config-mensal').value),
            cor: document.getElementById('config-cor').value,
            categoria_id: catId,
            usuario_id: usuarioId
        };

        const url = metaEditandoID ? `${API_URL}/${metaEditandoID}` : API_URL;
        const method = metaEditandoID ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method: method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
            if(!res.ok) throw new Error("Erro");
            exibirNotificacao("Salvo com sucesso!", "sucesso");
            modalConfig.style.display = 'none';
            carregarTudo(usuarioId);
        } catch (e) { exibirNotificacao("Erro ao salvar", "erro"); }
    });

    document.getElementById('btn-excluir-meta').addEventListener('click', () => {
        if(!metaSelecionada) return;
        idParaExcluir = metaSelecionada.id || metaSelecionada.ID;
        if(spanNomeExcluir) spanNomeExcluir.textContent = metaSelecionada.name || metaSelecionada.Nome;
        if(modalAviso) modalAviso.style.display = 'flex';
    });

    window.fecharModalAviso = () => { if(modalAviso) modalAviso.style.display = 'none'; idParaExcluir = null; };

    if(btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', async () => {
            if(!idParaExcluir) return;
            const usuarioId = localStorage.getItem('usuario_id');
            try {
                await fetch(`${API_URL}/${idParaExcluir}`, { method: 'DELETE' });
                exibirNotificacao('Meta excluída!', 'sucesso');
                fecharModalAviso();
                metaSelecionada = null;
                carregarTudo(usuarioId);
            } catch (error) { exibirNotificacao('Erro ao excluir.', 'erro'); }
        });
    }

    function atualizarGraficos(total, atual, mensal, cor, historico) {
        const falta = Math.max(total - atual, 0);

        if (chartDonut) chartDonut.destroy();
        chartDonut = new Chart(document.getElementById('graficoDonut'), {
            type: 'doughnut',
            data: { labels: ['Tenho', 'Falta'], datasets: [{ data: [atual, falta], backgroundColor: [cor, '#eee'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
        });

        if (chartBar) chartBar.destroy();
        chartBar = new Chart(document.getElementById('graficoDepositos'), {
            type: 'bar',
            data: { labels: ['Meta', 'Atual'], datasets: [{ label: 'R$', data: [total, atual], backgroundColor: [cor, cor], borderRadius: 5 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
        
        if (chartLine) chartLine.destroy();
        
        const dadosTimeline = gerarDadosTimeline(atual, historico);
        
        chartLine = new Chart(document.getElementById('graficoCrescimento'), {
            type: 'line',
            data: { 
                labels: dadosTimeline.labels, 
                datasets: [{ 
                    label: 'Patrimônio', 
                    data: dadosTimeline.data, 
                    borderColor: cor, 
                    backgroundColor: cor,
                    stepped: 'after', 
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatarMoeda(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) { return 'R$ ' + value; }
                        }
                    }
                }
            }
        });
    }

    function formatarMoeda(v) { return parseFloat(v).toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }
    function formatarMoedaCompacta(v) { return v >= 1000 ? 'R$ ' + (v/1000).toFixed(1) + 'k' : 'R$ ' + v; }
    
    function gerarDadosTimeline(atual, historico) {
        const labels = [];
        const data = [];
        const saldosPorMes = {};
        let totalDepositado = 0;
        let dataMinimaStr = null;

        if (historico && historico.length > 0) {
            historico.forEach(deposito => {
                const valor = parseFloat(deposito.valor || deposito.Valor);
                totalDepositado += valor;
                
                // Pega a data (YYYY-MM-DD) direto da string para evitar fuso horário
                const dataRaw = deposito.data.split('T')[0]; 
                const partes = dataRaw.split('-');
                const chaveMes = `${partes[0]}-${partes[1]}`;
                
                if (!saldosPorMes[chaveMes]) saldosPorMes[chaveMes] = 0;
                saldosPorMes[chaveMes] += valor;

                if(!dataMinimaStr || dataRaw < dataMinimaStr) {
                    dataMinimaStr = dataRaw;
                }
            });
        }

        let saldoAcumulado = Math.max(0, atual - totalDepositado);
        
        labels.push('Início');
        data.push(saldoAcumulado);

        if (dataMinimaStr) {
            const partesMin = dataMinimaStr.split('-');
            let cursorData = new Date(parseInt(partesMin[0]), parseInt(partesMin[1]) - 1, 1);
            const hoje = new Date();

            // Loop mês a mês até hoje
            while (cursorData <= hoje || (cursorData.getMonth() === hoje.getMonth() && cursorData.getFullYear() === hoje.getFullYear())) {
                const ano = cursorData.getFullYear();
                const mes = (cursorData.getMonth() + 1).toString().padStart(2, '0');
                const chaveMes = `${ano}-${mes}`;
                
                if (saldosPorMes[chaveMes]) {
                    saldoAcumulado += saldosPorMes[chaveMes];
                }

                const labelMes = cursorData.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
                const labelFinal = labelMes.charAt(0).toUpperCase() + labelMes.slice(1);

                labels.push(labelFinal);
                data.push(saldoAcumulado);

                // Avança para o dia 1 do próximo mês para evitar bugs de dia 31
                cursorData.setMonth(cursorData.getMonth() + 1);
                cursorData.setDate(1); 
            }
        } else {
            labels.push('Hoje');
            data.push(atual);
        }

        return { labels, data };
    }
    
    window.fecharModalConfig = () => modalConfig.style.display = 'none';
    window.fecharModalDeposito = () => modalDeposito.style.display = 'none';
    window.fecharModalAviso = () => { if(modalAviso) modalAviso.style.display = 'none'; idParaExcluir = null; };

    iniciar();
});