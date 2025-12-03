document.addEventListener("DOMContentLoaded", function () {
    
    const API_URL_GASTOS = '/aginisia/gasto';
    const API_URL_CATEGORIAS = '/aginisia/categoria';
    const API_URL_ENTRADAS = '/aginisia/entrada'; 

    const modalEntrada = document.getElementById('modal-nova-entrada');
    const modalSaida = document.getElementById('modal-nova-saida');
    
    const listaEntradas = document.querySelectorAll('.lista-dados')[0];
    const listaGastos = document.querySelectorAll('.lista-dados')[1];
    const listaFixos = document.querySelectorAll('.lista-dados')[2];

    const selectCategoria = document.getElementById('saida-categoria');
    const elementoSaldo = document.querySelector('.valor-saldo');

    let totalEntradas = 0;
    let totalSaidas = 0;
    let listaLocalGastos = []; 
    let listaLocalEntradas = [];
    
    let gastoEditandoID = null;
    let entradaEditandoID = null;

    function iniciar() {
        carregarOpcoesCategorias();
        carregarDadosCompletos();
        configurarDatasPadrao();
    }

    async function carregarDadosCompletos() {
        totalEntradas = 0;
        totalSaidas = 0;
        await Promise.all([carregarEntradas(), carregarGastos()]);
        atualizarDisplaySaldo();
    }

    function atualizarDisplaySaldo() {
        if (!elementoSaldo) return;
        const saldoFinal = totalEntradas - totalSaidas;
        elementoSaldo.textContent = formatarMoeda(saldoFinal);
        elementoSaldo.style.color = saldoFinal >= 0 ? '#141E46' : '#e74c3c';
    }

    async function carregarEntradas() {
        if (!listaEntradas) return;
        try {
            const usuarioId = localStorage.getItem('usuario_id');
            if (!usuarioId) return alert("Faça login novamente.");
            const response = await fetch(API_URL_ENTRADAS+"/user/"+usuarioId);
            if (response.ok) {
                const entradas = await response.json();
                listaLocalEntradas = entradas; 
                listaEntradas.innerHTML = '';
                
                if(!entradas || entradas.length === 0) {
                     listaEntradas.innerHTML = '<li class="item-dados" style="justify-content:center; color:#999">Vazio</li>';
                     return;
                }

                entradas.forEach(ent => {
                    totalEntradas += parseFloat(ent.valor || ent.Valor || 0);
                    const li = criarElementoLista(ent, 'entrada');
                    listaEntradas.appendChild(li);
                });
            }
        } catch (e) { console.log(e); }
    }

    async function salvarEntrada(e) {
        e.preventDefault();
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) return alert("Faça login novamente.");
        
        const form = document.getElementById('form-entrada');
        const dataInput = document.getElementById('entrada-data').value;
        const dataISO = new Date(dataInput).toISOString(); 

        const payload = {
            name: document.getElementById('entrada-nome').value,
            valor: parseFloat(document.getElementById('entrada-valor').value),
            data_entrada: dataISO,
            usuario_id: usuarioId
        };

        // Decide se é POST ou PUT
        const method = entradaEditandoID ? 'PUT' : 'POST';
        const url = entradaEditandoID ? `${API_URL_ENTRADAS}/${entradaEditandoID}` : API_URL_ENTRADAS;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Erro ao salvar');

            alert(entradaEditandoID ? "Entrada atualizada!" : "Entrada registrada!");
            fecharModal(modalEntrada);
            carregarDadosCompletos();
        } catch (error) {
            alert("Erro: " + error.message);
        }
    }

    async function carregarOpcoesCategorias() {
        if (!selectCategoria) return;
        try {
            const usuarioId = localStorage.getItem('usuario_id');
            if (!usuarioId) return alert("Faça login novamente.");
            const response = await fetch(API_URL_CATEGORIAS + "/user/"+usuarioId);
            if (response.ok) {
                const categorias = await response.json();
                selectCategoria.innerHTML = '<option value="">Selecione...</option>';
                categorias.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.id || cat.ID; 
                    opt.textContent = cat.name || cat.nome || cat.Nome; 
                    selectCategoria.appendChild(opt);
                });
            }
        } catch (e) { console.log(e); }
    }

    async function carregarGastos() {
        try {
            const usuarioId = localStorage.getItem('usuario_id');
            if (!usuarioId) return alert("Faça login novamente.");
            const response = await fetch(API_URL_GASTOS+'/user/'+usuarioId);
            if (!response.ok) return;
            const gastos = await response.json();
            listaLocalGastos = gastos; // Salva na memória
            
            if (listaGastos) listaGastos.innerHTML = '';
            if (listaFixos) listaFixos.innerHTML = '';

            gastos.forEach(gasto => {
                totalSaidas += parseFloat(gasto.valor || gasto.Valor || 0);
                const li = criarElementoLista(gasto, 'gasto');

                if (gasto.fixo === true && listaFixos) {
                    listaFixos.appendChild(li);
                } else if (listaGastos) {
                    listaGastos.appendChild(li);
                }
            });
        } catch (error) { console.error(error); }
    }

    async function salvarSaida(e) {
        e.preventDefault();
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) return alert("Faça login novamente.");

        const categoriaId = document.getElementById('saida-categoria').value;
        if (!categoriaId) return alert("Selecione uma categoria!");

        const payload = {
            name: document.getElementById('saida-nome').value,
            valor: parseFloat(document.getElementById('saida-valor').value),
            data: document.getElementById('saida-data').value,
            fixo: document.getElementById('saida-fixo').checked,
            foi_pago: true,
            categoria_id: categoriaId,
            usuario_id: usuarioId
        };

        const method = gastoEditandoID ? 'PUT' : 'POST';
        const url = gastoEditandoID ? `${API_URL_GASTOS}/${gastoEditandoID}` : API_URL_GASTOS;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Erro ao salvar');

            alert(gastoEditandoID ? "Gasto atualizado!" : "Gasto registrado!");
            fecharModal(modalSaida);
            carregarDadosCompletos();
        } catch (error) {
            alert("Erro: " + error.message);
        }
    }

    function criarElementoLista(item, tipo) {
        const li = document.createElement('li');
        li.classList.add('item-dados');
        
        const idReal = item.id || item.ID;
        const nomeDisplay = item.name || item.Nome || 'Item';
        
        let dataCrua = tipo === 'entrada' ? (item.data_entrada || item.Data_Entrada) : item.data;
        const dataDisplay = formatarData(dataCrua);
        
        const valorDisplay = formatarMoeda(item.valor);
        const classeValor = tipo === 'entrada' ? 'receita' : 'despesa';
        const sinal = tipo === 'entrada' ? '+' : '-';

        const funcaoEditar = tipo === 'entrada' ? `window.prepararEdicaoEntrada('${idReal}')` : `window.prepararEdicaoGasto('${idReal}')`;
        const funcaoExcluir = tipo === 'entrada' ? `window.excluirEntrada('${idReal}')` : `window.excluirGasto('${idReal}')`;

        li.innerHTML = `
            <div class="info-item">
                <span class="nome-item">${nomeDisplay}</span>
                <span class="meta-item">${dataDisplay}</span>
            </div>
            <div class="acoes-item">
                <span class="valor-item ${classeValor}">${sinal} ${valorDisplay}</span>
                <button class="btn-acao-icone btn-editar" onclick="${funcaoEditar}" title="Editar">✏️</button>
                <button class="btn-acao-icone btn-excluir" onclick="${funcaoExcluir}" title="Excluir">🗑️</button>
            </div>
        `;
        return li;
    }

    // --- Edição GASTO ---
    window.prepararEdicaoGasto = function(id) {
        const gasto = listaLocalGastos.find(g => (g.id || g.ID) === id);
        if(!gasto) return;

        gastoEditandoID = id;
        document.getElementById('titulo-modal-saida').textContent = 'Editar Saída';
        
        document.getElementById('saida-nome').value = gasto.name || gasto.Nome;
        document.getElementById('saida-valor').value = gasto.valor;
        document.getElementById('saida-categoria').value = gasto.categoria_id || gasto.CategoriaId;
        document.getElementById('saida-fixo').checked = gasto.fixo;
        
        // Data input espera YYYY-MM-DD
        if(gasto.data) {
            document.getElementById('saida-data').value = gasto.data.split('T')[0];
        }

        abrirModal(modalSaida);
    };

    window.abrirModalNovaSaida = function() {
        gastoEditandoID = null;
        document.getElementById('titulo-modal-saida').textContent = 'Nova Saída';
        document.getElementById('form-saida').reset();
        configurarDatasPadrao();
        abrirModal(modalSaida);
    };

    // --- Edição ENTRADA ---
    window.prepararEdicaoEntrada = function(id) {
        const ent = listaLocalEntradas.find(e => (e.id || e.ID) === id);
        if(!ent) return;

        entradaEditandoID = id;
        document.getElementById('titulo-modal-entrada').textContent = 'Editar Entrada';
        
        document.getElementById('entrada-nome').value = ent.name || ent.Nome;
        document.getElementById('entrada-valor').value = ent.valor;
        
        let dataCampo = ent.data_entrada || ent.Data_Entrada;
        if(dataCampo) {
            document.getElementById('entrada-data').value = dataCampo.split('T')[0];
        }

        abrirModal(modalEntrada);
    };

    window.abrirModalNovaEntrada = function() {
        entradaEditandoID = null;
        document.getElementById('titulo-modal-entrada').textContent = 'Nova Entrada';
        document.getElementById('form-entrada').reset();
        configurarDatasPadrao();
        abrirModal(modalEntrada);
    };

    window.excluirGasto = async function(id) {
        if(!confirm("Apagar?")) return;
        try {
            await fetch(`${API_URL_GASTOS}/${id}`, { method: 'DELETE' });
            carregarDadosCompletos();
        } catch (e) { alert("Erro ao excluir"); }
    };

    window.excluirEntrada = async function(id) {
        if(!confirm("Apagar?")) return;
        try {
            await fetch(`${API_URL_ENTRADAS}/${id}`, { method: 'DELETE' });
            carregarDadosCompletos();
        } catch (e) { alert("Erro ao excluir"); }
    };

    function formatarMoeda(val) {
        if (val === undefined || val === null) return "R$ 0,00";
        return parseFloat(val).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }
    
    function formatarData(dataStr) {
        if(!dataStr) return "";
        if(dataStr.includes('T')) {
            const data = new Date(dataStr);
            return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
        const partes = dataStr.split('-');
        if(partes.length === 3) return `${partes[2]}/${partes[1]}`;
        return dataStr;
    }

    function abrirModal(m) { if(m) m.style.display = 'flex'; }
    function fecharModal(m) { if(m) m.style.display = 'none'; }

    function configurarDatasPadrao() {
        const hoje = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(inp => {
            if(!inp.value) inp.value = hoje;
        });
        
        const iInicio = document.getElementById('data-inicio');
        const iFim = document.getElementById('data-fim');
        if(iInicio && iFim) {
             const d = new Date();
             const primeiro = new Date(d.getFullYear(), d.getMonth(), 1);
             iInicio.value = primeiro.toISOString().split('T')[0];
             iFim.value = hoje;
        }
    }

    document.querySelectorAll('.botao-form-cancelar, .fechar-modal').forEach(btn => {
        btn.addEventListener('click', () => fecharModal(btn.closest('.modal-fundo')));
    });

    const formS = document.getElementById('form-saida');
    if (formS) formS.addEventListener('submit', salvarSaida);

    const formE = document.getElementById('form-entrada');
    if (formE) formE.addEventListener('submit', salvarEntrada);

    iniciar();
});