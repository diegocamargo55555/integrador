document.addEventListener("DOMContentLoaded", function () {
    const API_URL_CATEGORIAS = 'http://localhost:8080/aginisia/categoria';
    const API_URL_GASTOS = 'http://localhost:8080/aginisia/gasto';
    
    const ctxPizza = document.getElementById('categoriasPieChart');
    const modalCat = document.getElementById('modal-nova-categoria');
    const tabelaBody = document.querySelector('.tabela-categorias tbody');
    const tabelaResumoBody = document.querySelector('.tabela-resumo tbody');
    const formCat = document.getElementById('form-nova-categoria');

    const elMesAtual = document.querySelector('.mes-atual');
    const btnAnt = document.querySelector('.seta-nav:first-child');
    const btnProx = document.querySelector('.seta-nav:last-child');
    
    const modalAviso = document.getElementById('modal-aviso-exclusao');
    const spanNomeExcluir = document.getElementById('nome-categoria-excluir');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');

    let chartInstance = null;
    let listaCategorias = [];
    let gastosGlobais = [];
    
    let categoriaEditandoID = null;
    let idParaExcluir = null;

    let dataReferencia = new Date();

    function iniciar() {
        configurarNavegacaoData();
        atualizarDisplayData();
        carregarDados();
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

    function configurarNavegacaoData() {
        if(btnAnt) {
            btnAnt.addEventListener('click', () => {
                dataReferencia.setMonth(dataReferencia.getMonth() - 1);
                atualizarDisplayData();
                recalcularPorMes();
            });
        }
        if(btnProx) {
            btnProx.addEventListener('click', () => {
                dataReferencia.setMonth(dataReferencia.getMonth() + 1);
                atualizarDisplayData();
                recalcularPorMes();
            });
        }
    }

    function atualizarDisplayData() {
        if(elMesAtual) {
            const nomeMes = dataReferencia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            elMesAtual.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
        }
    }

    async function carregarDados() {
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) return;

        try {
            const [resCat, resGastos] = await Promise.all([
                fetch(`${API_URL_CATEGORIAS}/user/${usuarioId}`),
                fetch(`${API_URL_GASTOS}/user/${usuarioId}`)
            ]);

            if (!resCat.ok) throw new Error('Erro ao buscar categorias');
            
            const categoriasRaw = await resCat.json();
            const gastosRaw = resGastos.ok ? await resGastos.json() : [];

            listaCategorias = categoriasRaw.map(c => ({...c, total_gasto: 0}));
            gastosGlobais = gastosRaw;

            recalcularPorMes();

        } catch (error) {
            if(tabelaBody) {
                tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Erro de conexão ou nenhum dado.</td></tr>';
            }
            exibirNotificacao("Erro ao carregar dados.", "erro");
        }
    }

    function recalcularPorMes() {
        const mesRef = dataReferencia.getMonth();
        const anoRef = dataReferencia.getFullYear();

        const somaPorCategoria = {};

        gastosGlobais.forEach(gasto => {
            if(!gasto.data) return;
            const dataGasto = new Date(gasto.data);
            
            if (dataGasto.getMonth() === mesRef && dataGasto.getFullYear() === anoRef) {
                const catId = gasto.categoria_id || gasto.CategoriaId;
                const valor = parseFloat(gasto.valor || gasto.Valor || 0);

                if (catId) {
                    if (!somaPorCategoria[catId]) somaPorCategoria[catId] = 0;
                    somaPorCategoria[catId] += valor;
                }
            }
        });

        listaCategorias = listaCategorias.map(cat => {
            const idReal = cat.id || cat.ID;
            return {
                ...cat, 
                total_gasto: somaPorCategoria[idReal] || 0 
            };
        });
        
        renderizarTabela();
        renderizarResumoEGrafico();
    }

    async function salvarCategoria(evento) {
        evento.preventDefault();
        
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
            exibirNotificacao("Sessão expirada. Faça login novamente.", "erro");
            return;
        }

        const nomeInput = document.getElementById('categoria-nome').value;
        const limiteInput = parseFloat(document.getElementById('categoria-limite').value);
        const corInput = document.getElementById('categoria-cor').value;

        const payload = { 
            name: nomeInput,       
            limite: limiteInput,   
            cor: corInput,
            usuario_id: usuarioId 
        };

        const method = categoriaEditandoID ? 'PUT' : 'POST';
        const url = categoriaEditandoID ? `${API_URL_CATEGORIAS}/${categoriaEditandoID}` : API_URL_CATEGORIAS;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.error || 'Erro ao salvar');
            }

            exibirNotificacao(categoriaEditandoID ? 'Categoria atualizada!' : 'Categoria criada!', 'sucesso');
            fecharModal(modalCat);
            carregarDados(); 
        } catch (error) {
            exibirNotificacao(error.message, "erro");
        }
    }
    
    window.solicitarExclusao = function(id, nome) {
        idParaExcluir = id;
        if(spanNomeExcluir) spanNomeExcluir.textContent = nome;
        if(modalAviso) modalAviso.style.display = 'flex';
    };

    window.fecharModalAviso = function() {
        if(modalAviso) modalAviso.style.display = 'none';
        idParaExcluir = null;
    }

    if(btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', async () => {
            if(!idParaExcluir) return;
            
            try {
                const response = await fetch(`${API_URL_CATEGORIAS}/${idParaExcluir}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Erro ao excluir');
                
                exibirNotificacao('Categoria e gastos excluídos!', 'sucesso');
                fecharModalAviso();
                carregarDados();
            } catch (error) {
                exibirNotificacao('Não foi possível excluir a categoria.', 'erro');
                fecharModalAviso();
            }
        });
    }

    function renderizarTabela() {
        if (!tabelaBody) return;
        tabelaBody.innerHTML = '';

        if (!listaCategorias || listaCategorias.length === 0) {
            tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Nenhuma categoria encontrada.</td></tr>';
            return;
        }

        listaCategorias.forEach(cat => {
            const idReal = cat.id || cat.ID; 
            const gastoAtual = cat.total_gasto; 
            const limite = cat.limite || 0;
            
            let porcentagem = 0;
            if (limite > 0) porcentagem = (gastoAtual / limite) * 100;
            
            const larguraBarra = porcentagem > 100 ? 100 : porcentagem;
            const disponivel = limite - gastoAtual;
            const nomeDisplay = cat.name || "Sem Nome"; 
            const corBarra = disponivel < 0 ? '#e74c3c' : cat.cor; 

            const tr = document.createElement('tr');
            tr.classList.add('linha-principal');
            tr.innerHTML = `
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="ponto-cor" style="background-color: ${cat.cor}"></span>
                        <strong>${nomeDisplay}</strong>
                    </div>
                </td>
                <td>
                    <div class="barra-progresso">
                        <div class="progresso-preenchido" style="width: ${larguraBarra}%; background-color: ${corBarra}"></div>
                        <span class="texto-progresso">${porcentagem.toFixed(1)}%</span>
                    </div>
                </td>
                <td style="color: ${disponivel < 0 ? 'red' : 'inherit'}">${formatarMoeda(disponivel)}</td>
                <td>${formatarMoeda(gastoAtual)} / ${formatarMoeda(limite)}</td>
                <td class="col-acoes">
                    <div class="grupo-botoes-acao">
                        <button class="btn-pequeno btn-editar" onclick="window.prepararEdicao('${idReal}')" title="Editar">✏️</button>
                        <button class="btn-pequeno btn-excluir" onclick="window.solicitarExclusao('${idReal}', '${nomeDisplay}')" title="Excluir">🗑️</button>
                    </div>
                </td>
            `;
            tabelaBody.appendChild(tr);
        });
    }

    function renderizarResumoEGrafico() {
        if (tabelaResumoBody) {
            tabelaResumoBody.innerHTML = '';
            listaCategorias.forEach(cat => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span style="color:${cat.cor}">●</span> ${cat.name}</td>
                    <td>${formatarMoeda(cat.total_gasto)}</td> 
                    <td>${formatarMoeda(cat.limite)}</td>
                `;
                tabelaResumoBody.appendChild(tr);
            });
        }

        if (ctxPizza) {
            const labels = listaCategorias.map(c => c.name);
            const dados = listaCategorias.map(c => c.total_gasto); 
            const cores = listaCategorias.map(c => c.cor);

            if (chartInstance) chartInstance.destroy();

            chartInstance = new Chart(ctxPizza, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dados,
                        backgroundColor: cores,
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) label += ': ';
                                    label += context.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    function formatarMoeda(valor) {
        return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function abrirModal(modal) { if(modal) modal.style.display = 'flex'; }
    function fecharModal(modal) { if(modal) modal.style.display = 'none'; }

    window.abrirModalCriacao = function() {
        categoriaEditandoID = null;
        const titulo = document.getElementById('modal-categoria-titulo');
        const form = document.getElementById('form-nova-categoria');
        
        if(titulo) titulo.textContent = 'Nova Categoria';
        if(form) form.reset();
        document.getElementById('categoria-cor').value = '#41B06E';
        abrirModal(modalCat);
    };

    window.prepararEdicao = function(id) {
        const cat = listaCategorias.find(c => (c.id || c.ID) === id);
        if (!cat) return;

        categoriaEditandoID = id;
        document.getElementById('modal-categoria-titulo').textContent = 'Editar: ' + cat.name;
        document.getElementById('categoria-nome').value = cat.name;
        document.getElementById('categoria-limite').value = cat.limite;
        document.getElementById('categoria-cor').value = cat.cor;
        abrirModal(modalCat);
    };

    if (formCat) {
        formCat.addEventListener('submit', salvarCategoria);
    }

    const btnCancelar = document.querySelector('.botao-form-cancelar');
    if(btnCancelar) btnCancelar.addEventListener('click', () => fecharModal(modalCat));

    const btnFecharX = document.querySelector('.fechar-modal');
    if(btnFecharX) btnFecharX.addEventListener('click', () => fecharModal(modalCat));

    iniciar();
});