document.addEventListener("DOMContentLoaded", function () {

    const ctxPizza = document.getElementById('categoriasPieChart');
    const modalCat = document.getElementById('modal-nova-categoria');
    
    function abrirModal(modal) { if(modal) modal.style.display = 'flex'; }
    function fecharModal(modal) { if(modal) modal.style.display = 'none'; }

    // gráfico
    if (ctxPizza) {
        try {
            const dadosGraficoCategorias = {
                labels: [ 'Fixos', 'Saúde', 'Lazer' ],
                data: [ 8000, 2000, 800 ],
                colors: [ '#141E46', '#F1C40F', '#41B06E' ] 
            };

            new Chart(ctxPizza, {
                type: 'doughnut', 
                data: {
                    labels: dadosGraficoCategorias.labels,
                    datasets: [{
                        label: 'Gastos',
                        data: dadosGraficoCategorias.data,
                        backgroundColor: dadosGraficoCategorias.colors,
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        } catch (e) {
            console.error("Erro ao criar gráfico de categorias:", e);
        }
    }

    // lógica do Modal e Tabela
    if (modalCat) {
        const tituloModalCat = document.getElementById('modal-categoria-titulo');
        const formCat = document.getElementById('form-nova-categoria');
        const btnAbrirCat = document.querySelector('.btn-nova-categoria'); 
        const btnCancelarCat = modalCat.querySelector('.botao-form-cancelar');
        
        const inputNomeCat = document.getElementById('categoria-nome');
        const inputLimiteCat = document.getElementById('categoria-limite');

        let categoriaEditando = null; 

        const prepararModalCategoria = (modo, elemento = null) => {
            categoriaEditando = elemento;
            if (modo === 'criar') {
                tituloModalCat.textContent = 'Nova Categoria';
                formCat.reset();
            } else {
                const nome = elemento.dataset.nome;
                const limite = elemento.dataset.limite;
                tituloModalCat.textContent = `Editar: ${nome}`;
                inputNomeCat.value = nome;
                inputLimiteCat.value = limite;
            }
            abrirModal(modalCat);
        };

        if(btnAbrirCat) {
            btnAbrirCat.addEventListener('click', () => prepararModalCategoria('criar'));
        }

        if(btnCancelarCat) {
            btnCancelarCat.addEventListener('click', () => fecharModal(modalCat));
        }

        // Tabela: Editar e Excluir
        const tabelaCategorias = document.querySelector('.tabela-categorias');
        if(tabelaCategorias) {
            tabelaCategorias.addEventListener('click', (e) => {
                if(e.target.closest('.btn-editar')) {
                    const linha = e.target.closest('.linha-principal') || e.target.closest('tr'); 
                    prepararModalCategoria('editar', linha);
                }

                if(e.target.closest('.btn-excluir')) {
                    const linha = e.target.closest('tr');
                    const nome = linha.dataset.nome || "Categoria"; 
                    if(confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) {
                        linha.remove();
                        alert('Categoria excluída!');
                    }
                }
            });
        }

        if (formCat) {
            formCat.addEventListener('submit', (e) => {
                e.preventDefault();
                const nome = inputNomeCat.value;
                const limite = inputLimiteCat.value;

                if (categoriaEditando) {
                    categoriaEditando.dataset.nome = nome;
                    categoriaEditando.dataset.limite = limite;
                    
                    const textoNome = categoriaEditando.querySelector('td:first-child strong');
                    const textoTotal = categoriaEditando.querySelector('td:nth-child(4)');
                    
                    if(textoNome) textoNome.textContent = nome;
                    if(textoTotal) textoTotal.textContent = parseFloat(limite).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

                    alert('Categoria atualizada!');
                } else {
                    alert(`Categoria "${nome}" criada com limite de R$ ${limite}!`);
                }
                fecharModal(modalCat);
            });
        }
    }
});