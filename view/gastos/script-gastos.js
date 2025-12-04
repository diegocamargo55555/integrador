document.addEventListener("DOMContentLoaded", function () {

    const API_URL_GASTOS = 'http://localhost:8080/aginisia/gasto';
    const API_URL_CATEGORIAS = 'http://localhost:8080/aginisia/categoria';
    const API_URL_ENTRADAS = 'http://localhost:8080/aginisia/entrada';

    const modalEntrada = document.getElementById('modal-nova-entrada');
    const modalSaida = document.getElementById('modal-nova-saida');

    const listaEntradasEl = document.querySelectorAll('.lista-dados')[0];
    const listaGastosEl = document.querySelectorAll('.lista-dados')[1];
    const listaFixosEl = document.querySelectorAll('.lista-dados')[2];

    const selectCategoria = document.getElementById('saida-categoria');
    const elementoSaldo = document.querySelector('.valor-saldo');

    const inputInicio = document.getElementById('data-inicio');
    const inputFim = document.getElementById('data-fim');

    const modalAviso = document.getElementById('modal-aviso-exclusao');
    const spanNomeExcluir = document.getElementById('nome-item-excluir');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');

    let todosGastos = [];
    let todasEntradas = [];

    let gastoEditandoID = null;
    let entradaEditandoID = null;
    let itemParaExcluir = null;

    function iniciar() {
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
            exibirNotificacao("Usuário não logado.", "erro");
            return;
        }

        configurarDatasPadrao();
        carregarOpcoesCategorias(usuarioId);
        carregarDadosCompletos(usuarioId);
        configurarValidacaoEmTempoReal();

        inputInicio.addEventListener('change', aplicarFiltros);
        inputFim.addEventListener('change', aplicarFiltros);
    }

    function exibirNotificacao(mensagem, tipo = 'sucesso') {
        const container = document.getElementById('container-notificacoes');
        if (!container) return;
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

    function configurarDatasPadrao() {
        const date = new Date();
        const primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1);
        const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const toISO = (d) => {
            return d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0');
        };

        if (inputInicio && !inputInicio.value) inputInicio.value = toISO(primeiroDia);
        if (inputFim && !inputFim.value) inputFim.value = toISO(ultimoDia);
    }

    async function carregarDadosCompletos(usuarioId) {
        try {
            const [resEnt, resGas] = await Promise.all([
                fetch(`${API_URL_ENTRADAS}/user/${usuarioId}`),
                fetch(`${API_URL_GASTOS}/user/${usuarioId}`)
            ]);

            if (resEnt.ok) todasEntradas = await resEnt.json();
            if (resGas.ok) todosGastos = await resGas.json();

            aplicarFiltros();

        } catch (e) {
            exibirNotificacao("Erro ao carregar dados.", "erro");
            console.error(e);
        }
    }

    function aplicarFiltros() {
        const dInicio = new Date(inputInicio.value + 'T00:00:00');
        const dFim = new Date(inputFim.value + 'T23:59:59');

        const entradasFiltradas = todasEntradas.filter(item => {
            if (!item.data_entrada && !item.Data_Entrada) return false;
            const dItem = new Date(item.data_entrada || item.Data_Entrada);
            return dItem >= dInicio && dItem <= dFim;
        });

        const gastosFiltrados = todosGastos.filter(item => {
            if (!item.data) return false;
            const dItem = new Date(item.data);
            return dItem >= dInicio && dItem <= dFim;
        });

        renderizarListas(entradasFiltradas, gastosFiltrados);
    }

    function renderizarListas(entradas, gastos) {
        let totalE = 0;
        let totalS = 0;

        listaEntradasEl.innerHTML = '';
        listaGastosEl.innerHTML = '';
        listaFixosEl.innerHTML = '';

        if (entradas.length === 0) listaEntradasEl.innerHTML = '<li style="text-align:center; padding:10px; color:#999">Nenhuma entrada no período.</li>';

        entradas.forEach(ent => {
            const valor = parseFloat(ent.valor || ent.Valor || 0);
            totalE += valor;
            listaEntradasEl.appendChild(criarElementoLista(ent, 'entrada'));
        });

        let temGasto = false;
        let temFixo = false;

        gastos.forEach(gasto => {
            const valor = parseFloat(gasto.valor || gasto.Valor || 0);
            totalS += valor;
            const li = criarElementoLista(gasto, 'gasto');

            if (gasto.fixo === true) {
                listaFixosEl.appendChild(li);
                temFixo = true;
            } else {
                listaGastosEl.appendChild(li);
                temGasto = true;
            }
        });

        if (!temGasto) listaGastosEl.innerHTML = '<li style="text-align:center; padding:10px; color:#999">Nenhum gasto no período.</li>';
        if (!temFixo) listaFixosEl.innerHTML = '<li style="text-align:center; padding:10px; color:#999">Vazio</li>';

        const saldoFinal = totalE - totalS;
        elementoSaldo.textContent = formatarMoeda(saldoFinal);
        elementoSaldo.style.color = saldoFinal >= 0 ? '#141E46' : '#e74c3c';
    }

    function criarElementoLista(item, tipo) {
        const li = document.createElement('li');
        li.classList.add('item-dados');

        const idReal = item.id || item.ID;
        const nomeDisplay = item.name || item.Nome || 'Item';

        let dataCrua = tipo === 'entrada' ? (item.data_entrada || item.Data_Entrada) : item.data;
        const dataDisplay = formatarData(dataCrua);

        const valorDisplay = formatarMoeda(item.valor || item.Valor);
        const classeValor = tipo === 'entrada' ? 'receita' : 'despesa';
        const sinal = tipo === 'entrada' ? '+' : '-';

        const funcaoEditar = tipo === 'entrada' ? `window.prepararEdicaoEntrada('${idReal}')` : `window.prepararEdicaoGasto('${idReal}')`;
        const funcaoExcluir = `window.solicitarExclusao('${idReal}', '${nomeDisplay}', '${tipo}')`;

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

    async function salvarEntrada(e) {
        e.preventDefault();

        if (!validarFormularioCustomizado('form-entrada')) {
            exibirNotificacao("Preencha os campos obrigatórios!", "erro");
            return;
        }

        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) { exibirNotificacao("Faça login novamente.", "erro"); return; }

        const dataInput = document.getElementById('entrada-data').value;
        const dataISO = new Date(dataInput).toISOString();

        const payload = {
            name: document.getElementById('entrada-nome').value,
            valor: parseFloat(document.getElementById('entrada-valor').value),
            data_entrada: dataISO,
            usuario_id: usuarioId
        };

        const method = entradaEditandoID ? 'PUT' : 'POST';
        const url = entradaEditandoID ? `${API_URL_ENTRADAS}/${entradaEditandoID}` : API_URL_ENTRADAS;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Erro ao salvar');

            exibirNotificacao(entradaEditandoID ? "Entrada atualizada!" : "Entrada registrada!", "sucesso");
            fecharModal(modalEntrada);
            carregarDadosCompletos(usuarioId);
        } catch (error) {
            exibirNotificacao("Erro: " + error.message, "erro");
        }
    }

    async function salvarSaida(e) {
        e.preventDefault();

        if (!validarFormularioCustomizado('form-saida')) {
            exibirNotificacao("Preencha os campos obrigatórios!", "erro");
            return;
        }

        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) { exibirNotificacao("Faça login novamente.", "erro"); return; }

        const categoriaId = document.getElementById('saida-categoria').value;
        if (!categoriaId) { exibirNotificacao("Selecione uma categoria!", "aviso"); return; }

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

            exibirNotificacao(gastoEditandoID ? "Gasto atualizado!" : "Gasto registrado!", "sucesso");
            fecharModal(modalSaida);
            carregarDadosCompletos(usuarioId);
        } catch (error) {
            exibirNotificacao("Erro: " + error.message, "erro");
        }
    }

    async function carregarOpcoesCategorias(usuarioId) {
        if (!selectCategoria) return;
        try {
            const response = await fetch(`${API_URL_CATEGORIAS}/user/${usuarioId}`);
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

    window.prepararEdicaoGasto = function (id) {
        const gasto = todosGastos.find(g => (g.id || g.ID) === id);
        if (!gasto) return;

        gastoEditandoID = id;
        document.getElementById('titulo-modal-saida').textContent = 'Editar Saída';
        document.getElementById('saida-nome').value = gasto.name || gasto.Nome;
        document.getElementById('saida-valor').value = gasto.valor;
        document.getElementById('saida-categoria').value = gasto.categoria_id || gasto.CategoriaId;
        document.getElementById('saida-fixo').checked = gasto.fixo;
        if (gasto.data) document.getElementById('saida-data').value = gasto.data.split('T')[0];

        document.querySelectorAll('#form-saida .input-form').forEach(i => limparErroInput(i));

        abrirModal(modalSaida);
    };

    window.prepararEdicaoEntrada = function (id) {
        const ent = todasEntradas.find(e => (e.id || e.ID) === id);
        if (!ent) return;

        entradaEditandoID = id;
        document.getElementById('titulo-modal-entrada').textContent = 'Editar Entrada';
        document.getElementById('entrada-nome').value = ent.name || ent.Nome;
        document.getElementById('entrada-valor').value = ent.valor;
        let dataCampo = ent.data_entrada || ent.Data_Entrada;
        if (dataCampo) document.getElementById('entrada-data').value = dataCampo.split('T')[0];

        document.querySelectorAll('#form-entrada .input-form').forEach(i => limparErroInput(i));

        abrirModal(modalEntrada);
    };

    window.abrirModalNovaSaida = function () {
        gastoEditandoID = null;
        document.getElementById('titulo-modal-saida').textContent = 'Nova Saída';
        document.getElementById('form-saida').reset();
        document.getElementById('saida-data').value = new Date().toISOString().split('T')[0];
        
        document.querySelectorAll('#form-saida .input-form').forEach(i => limparErroInput(i));
        
        abrirModal(modalSaida);
    };

    window.abrirModalNovaEntrada = function () {
        entradaEditandoID = null;
        document.getElementById('titulo-modal-entrada').textContent = 'Nova Entrada';
        document.getElementById('form-entrada').reset();
        document.getElementById('entrada-data').value = new Date().toISOString().split('T')[0];

        document.querySelectorAll('#form-entrada .input-form').forEach(i => limparErroInput(i));

        abrirModal(modalEntrada);
    };

    window.solicitarExclusao = function (id, nome, tipo) {
        itemParaExcluir = { id, tipo };
        const elNome = document.getElementById('nome-item-excluir');
        if (elNome) elNome.textContent = nome;

        if (modalAviso) modalAviso.style.display = 'flex';
    };

    window.fecharModalAviso = function () {
        if (modalAviso) modalAviso.style.display = 'none';
        itemParaExcluir = null;
    }

    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', async () => {
            if (!itemParaExcluir) return;

            const usuarioId = localStorage.getItem('usuario_id');
            const urlBase = itemParaExcluir.tipo === 'entrada' ? API_URL_ENTRADAS : API_URL_GASTOS;

            try {
                const response = await fetch(`${urlBase}/${itemParaExcluir.id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Erro ao excluir');

                exibirNotificacao(`${itemParaExcluir.tipo === 'entrada' ? 'Entrada' : 'Gasto'} excluído!`, 'sucesso');
                fecharModalAviso();
                carregarDadosCompletos(usuarioId);
            } catch (e) {
                exibirNotificacao("Não foi possível excluir.", "erro");
                fecharModalAviso();
            }
        });
    }

    function formatarMoeda(val) {
        if (val === undefined || val === null) return "R$ 0,00";
        return parseFloat(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarData(dataStr) {
        if (!dataStr) return "";
        if (dataStr.includes('T')) {
            const data = new Date(dataStr);
            return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
        const partes = dataStr.split('-');
        if (partes.length === 3) return `${partes[2]}/${partes[1]}`;
        return dataStr;
    }

    function abrirModal(m) { if (m) m.style.display = 'flex'; }
    function fecharModal(m) { if (m) m.style.display = 'none'; }

    document.querySelectorAll('.botao-form-cancelar, .fechar-modal').forEach(btn => {
        btn.addEventListener('click', () => fecharModal(btn.closest('.modal-fundo')));
    });

    const formS = document.getElementById('form-saida');
    if (formS) formS.addEventListener('submit', salvarSaida);

    const formE = document.getElementById('form-entrada');
    if (formE) formE.addEventListener('submit', salvarEntrada);


    function validarFormularioCustomizado(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input:required, select:required');
        let temErro = false;
    
        inputs.forEach(input => {
            limparErroInput(input);
            if (!input.checkValidity()) {
                temErro = true;
                let mensagem = input.validationMessage;
                if(input.tagName === 'SELECT' && input.value === "") mensagem = "Selecione uma opção.";
                if(input.validity.valueMissing) mensagem = "Campo obrigatório!";
                
                mostrarErroInput(input, mensagem);
            }
        });
    
        return !temErro;
    }
    
    function mostrarErroInput(input, mensagem) {
        input.classList.add('erro'); 
        const divPai = input.parentElement;
        if (!divPai.querySelector('.msg-erro-campo')) {
            const span = document.createElement('span');
            span.className = 'msg-erro-campo';
            span.style.color = '#e74c3c';
            span.style.fontSize = '0.8em';
            span.style.marginTop = '4px';
            span.style.display = 'block';
            span.innerText = mensagem;
            divPai.appendChild(span);
        }
    }
    
    function limparErroInput(input) {
        input.classList.remove('erro');
        const divPai = input.parentElement;
        const span = divPai.querySelector('.msg-erro-campo');
        if (span) span.remove();
    }

    function configurarValidacaoEmTempoReal() {
        const inputs = document.querySelectorAll('form input, form select');
        inputs.forEach(input => {
            input.addEventListener('input', () => limparErroInput(input));
            input.addEventListener('change', () => limparErroInput(input));
        });
    }

    iniciar();
});