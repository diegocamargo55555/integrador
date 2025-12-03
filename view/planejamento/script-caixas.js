document.addEventListener("DOMContentLoaded", function () {
    
    const API_URL = '/aginisia/planejamento';
    
    const containerLista = document.querySelector('.conteudo-lista');
    
    const detalheTitulo = document.querySelector('.titulo-detalhe');
    const detalheIcone = document.querySelector('.icone-detalhe');
    const detalheValorTotal = document.getElementById('detalhe-valor-total');
    const detalheFalta = document.getElementById('detalhe-falta');
    const detalheMensal = document.getElementById('detalhe-valor-mensal');
    const areaAcoes = document.querySelector('.acoes-detalhe');
    
    const modalConfig = document.getElementById('modal-config-caixa');
    const modalDeposito = document.getElementById('modal-deposito');
    
    let chartDonut, chartLine, chartBar;

    let listaMetas = [];
    let metaSelecionada = null;
    let metaEditandoID = null;

    async function carregarMetas() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Erro");
            listaMetas = await response.json();
            renderizarLista();
            
            if (listaMetas.length > 0) {
                const idParaSelecionar = metaSelecionada ? (metaSelecionada.id || metaSelecionada.ID) : (listaMetas[0].id || listaMetas[0].ID);
                selecionarMeta(idParaSelecionar);
            } else {
                limparDetalhes();
            }
        } catch (e) { 
            containerLista.innerHTML = '<div style="text-align:center; padding:20px; color:#888">Erro ao carregar dados.</div>'; 
        }
    }

    function renderizarLista() {
        containerLista.innerHTML = '';
        if (listaMetas.length === 0) {
            containerLista.innerHTML = '<div style="text-align:center; padding:20px; color:#888">Nenhuma meta.</div>';
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

        detalheTitulo.textContent = metaSelecionada.name || metaSelecionada.Nome;
        detalheIcone.style.backgroundColor = cor;
        detalheValorTotal.textContent = formatarMoeda(vTotal);
        detalheFalta.textContent = formatarMoeda(Math.max(vTotal - vAtual, 0));
        detalheMensal.textContent = formatarMoeda(vMensal);

        atualizarGraficos(vTotal, vAtual, vMensal, cor);
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

        try {
            const response = await fetch(`${API_URL}/${id}/depositar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor: valor, data: data })
            });

            if (!response.ok) throw new Error("Erro no depósito");

            alert("Depósito realizado!");
            modalDeposito.style.display = 'none';
            carregarMetas();
        } catch (error) {
            alert("Erro: " + error.message);
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
        
        modalConfig.style.display = 'flex';
    };

    document.getElementById('config-caixa-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuarioId = localStorage.getItem('usuario_id');
        
        const payload = {
            name: document.getElementById('config-nome').value,
            valor_Desejado: parseFloat(document.getElementById('config-valor-total').value),
            valor_atual: parseFloat(document.getElementById('config-valor-atual').value),
            estima_deposito_mensal: parseFloat(document.getElementById('config-mensal').value),
            cor: document.getElementById('config-cor').value,
            usuario_id: usuarioId
        };

        const url = metaEditandoID ? `${API_URL}/${metaEditandoID}` : API_URL;
        const method = metaEditandoID ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method: method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
            if(!res.ok) throw new Error("Erro");
            alert("Salvo!");
            modalConfig.style.display = 'none';
            carregarMetas();
        } catch (e) { alert("Erro ao salvar"); }
    });

    document.getElementById('btn-excluir-meta').addEventListener('click', async () => {
        if(!confirm("Excluir meta?")) return;
        const id = metaSelecionada.id || metaSelecionada.ID;
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarMetas();
    });

    function atualizarGraficos(total, atual, mensal, cor) {
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
        
        const projecao = gerarDadosProjecao(atual, total, mensal);
        chartLine = new Chart(document.getElementById('graficoCrescimento'), {
            type: 'line',
            data: { labels: projecao.labels, datasets: [{ label: 'Projeção', data: projecao.dados, borderColor: cor, tension: 0.3 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }

    function formatarMoeda(v) { return parseFloat(v).toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }
    function formatarMoedaCompacta(v) { return v >= 1000 ? 'R$ ' + (v/1000).toFixed(1) + 'k' : 'R$ ' + v; }
    
    function gerarDadosProjecao(atual, total, mensal) {
        if (!mensal || mensal <= 0) mensal = (total - atual) / 5;
        if (mensal <= 0) mensal = 100;

        const labels = ['Hoje'];
        const dados = [atual];
        let acumulado = atual;
        for (let i = 1; i <= 5; i++) {
            acumulado += mensal;
            labels.push(`Mês ${i}`);
            dados.push(Math.min(acumulado, total * 1.1)); 
        }
        return { labels, dados };
    }
    
    window.fecharModalConfig = () => modalConfig.style.display = 'none';
    window.fecharModalDeposito = () => modalDeposito.style.display = 'none';

    carregarMetas();
});