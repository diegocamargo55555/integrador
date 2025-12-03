document.addEventListener("DOMContentLoaded", function () {
    const API_URL = '/aginisia/categoria';
    const ctxPizza = document.getElementById('categoriasPieChart');
    const modalCat = document.getElementById('modal-nova-categoria');
    const tabelaBody = document.querySelector('.tabela-categorias tbody');
    const tabelaResumoBody = document.querySelector('.tabela-resumo tbody');
    const formCat = document.getElementById('form-nova-categoria');
    let chartInstance = null;
    let listaCategorias = [];
    let categoriaEditandoID = null;

    async function carregarCategorias() {
        try {
            const usuarioId = localStorage.getItem('usuario_id');
            if (!usuarioId) {
                alert("Sessão expirada. Faça login novamente.");
                window.location.href = '../login/login.html';
                return;
            }
            const response = await fetch(API_URL+"/user/"+usuarioId);
            if (!response.ok) throw new Error('Erro ao buscar categorias');
            
            listaCategorias = await response.json();
            
            renderizarTabela();
            renderizarResumoEGrafico();
        } catch (error) {
            console.error(error);
            if(tabelaBody) {
                tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align:center">Erro ao carregar dados. Verifique se o servidor está rodando.</td></tr>';
            }
        }
    }

    async function salvarCategoria(evento) {
        evento.preventDefault();
        
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = '../login/login.html';
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
        const url = categoriaEditandoID ? `${API_URL}/${categoriaEditandoID}` : API_URL;

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

            alert(categoriaEditandoID ? 'Categoria atualizada!' : 'Categoria criada!');
            fecharModal(modalCat);
            carregarCategorias(); 
        } catch (error) {
            console.error(error);
            alert('Erro: ' + error.message);
        }
    }

    async function excluirCategoria(id, nome) {
        if (!confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir');
            
            alert('Categoria excluída!');
            carregarCategorias();
        } catch (error) {
            console.error(error);
            alert('Não foi possível excluir.');
        }
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
            
            const gastoAtual = 0; 
            const limite = cat.limite || 0;
            const porcentagem = limite > 0 ? (gastoAtual / limite) * 100 : 0;
            const disponivel = limite - gastoAtual;
            const nomeDisplay = cat.name || "Sem Nome"; 

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
                        <div class="progresso-preenchido" style="width: ${porcentagem}%; background-color: ${cat.cor}"></div>
                        <span class="texto-progresso">${porcentagem.toFixed(1)}%</span>
                    </div>
                </td>
                <td>${formatarMoeda(disponivel)}</td>
                <td>${formatarMoeda(limite)}</td>
                <td class="col-acoes">
                    <div class="grupo-botoes-acao">
                        <button class="btn-pequeno btn-editar" onclick="window.prepararEdicao('${idReal}')">✏️</button>
                        <button class="btn-pequeno btn-excluir" onclick="window.solicitarExclusao('${idReal}', '${nomeDisplay}')">🗑️</button>
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
                    <td>${formatarMoeda(0)}</td> 
                    <td>${formatarMoeda(cat.limite)}</td>
                `;
                tabelaResumoBody.appendChild(tr);
            });
        }

        if (ctxPizza) {
            const labels = listaCategorias.map(c => c.name);
            const dataLimites = listaCategorias.map(c => c.limite);
            const cores = listaCategorias.map(c => c.cor);

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctxPizza, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataLimites,
                        backgroundColor: cores,
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
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
        
        if (!cat) {
            console.error("Categoria não encontrada:", id);
            return;
        }

        categoriaEditandoID = id;
        document.getElementById('modal-categoria-titulo').textContent = 'Editar: ' + cat.name;
        document.getElementById('categoria-nome').value = cat.name;
        document.getElementById('categoria-limite').value = cat.limite;
        document.getElementById('categoria-cor').value = cat.cor;
        
        abrirModal(modalCat);
    };

    window.solicitarExclusao = function(id, nome) {
        excluirCategoria(id, nome);
    };

    if (formCat) {
        formCat.addEventListener('submit', salvarCategoria);
    }

    const btnCancelar = document.querySelector('.botao-form-cancelar');
    if(btnCancelar) {
        btnCancelar.addEventListener('click', () => fecharModal(modalCat));
    }

    const btnFecharX = document.querySelector('.fechar-modal');
    if(btnFecharX) {
        btnFecharX.addEventListener('click', () => fecharModal(modalCat));
    }

    carregarCategorias();
});