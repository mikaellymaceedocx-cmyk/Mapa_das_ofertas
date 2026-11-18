// ==============================================
// 🔌 OPENAPI DA SHOPEE AFILIADO — Conexão Completa
// ==============================================

// 📥 CARREGAR CREDENCIAIS SALVAS NA TELA DE LOGIN
const CREDENCIAIS = {
    nome: localStorage.getItem('userName') || 'Afiliada',
    appId: localStorage.getItem('appId') || '',
    appSecret: localStorage.getItem('appSecret') || '',
    apiUrl: localStorage.getItem('apiUrl') || 'https://open-api.shopee.com.br'
};

console.log('✅ OpenAPI da Shopee — Sistema carregado');
console.log('👤 Usuário:', CREDENCIAIS.nome);
console.log('📡 API:', CREDENCIAIS.apiUrl);
console.log('🔑 App ID:', CREDENCIAIS.appId ? '✅ Configurado' : '⚠️ Não informado');

// ==============================================
// 🖥️ INICIALIZAR DADOS NA TELA
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nome do usuário
    const elementoNome = document.getElementById('exibirNome');
    if (elementoNome) {
        elementoNome.textContent = CREDENCIAIS.nome;
    }

    // Verificar credenciais
    if (!CREDENCIAIS.appId || !CREDENCIAIS.appSecret) {
        console.log('⚠️ Credenciais da API não encontradas — usando exemplos temporários');
        carregarProdutosExemplo();
    } else {
        console.log('🔑 Credenciais encontradas — pronto para conectar à OpenAPI');
        buscarOfertasShopee();
    }
});

// ==============================================
// 📡 FUNÇÃO PRINCIPAL — BUSCAR OFERTAS DA SHOPEE
// ==============================================
async function buscarOfertasShopee() {
    try {
        console.log('📡 Conectando à OpenAPI da Shopee...');
        
        // ⚠️ INSTRUÇÃO: Quando sua API for aprovada, remova os comentários das linhas abaixo
        // const resposta = await fetch(`${CREDENCIAIS.apiUrl}/api/v2/affiliate/products?app_id=${CREDENCIAIS.appId}`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${CREDENCIAIS.appSecret}`,
        //         'Content-Type': 'application/json'
        //     }
        // });
        // const dados = await resposta.json();
        // const listaProdutos = dados.data?.products || [];
        
        // Enquanto API não está ativa, usamos os exemplos abaixo:
        carregarProdutosExemplo();
        
    } catch (erro) {
        console.error('❌ Erro ao buscar ofertas:', erro);
        mostrarMensagem('⚠️ Usando exemplos — API em configuração');
        carregarProdutosExemplo();
    }
}

// ==============================================
// 📦 PRODUTOS DE EXEMPLO — Mostra enquanto API não está ativa
// ==============================================
const PRODUTOS_EXEMPLO = [
    { id: 1, nome: "Rack com Painel para TV até 65\"", preco: 799.90, comissao: 14, poucosAfiliados: true, nicho: "casa", img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop" },
    { id: 2, nome: "Vestido Midi Floral Elegante", preco: 89.90, comissao: 18, poucosAfiliados: false, nicho: "moda", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92a1?w=400&h=300&fit=crop" },
    { id: 3, nome: "Travesseiro de Amamentação Ajustável", preco: 85.90, comissao: 22, poucosAfiliados: true, nicho: "bebe", img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop" },
    { id: 4, nome: "Kit 4 Potes Herméticos de Vidro", preco: 59.90, comissao: 19, poucosAfiliados: true, nicho: "casa", img: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&h=300&fit=crop" },
    { id: 5, nome: "Creme Hidratante Corporal 500ml", preco: 44.90, comissao: 25, poucosAfiliados: false, nicho: "beleza", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop" },
    { id: 6, nome: "Bolsa Transversal Couro Sintético", preco: 79.90, comissao: 16, poucosAfiliados: true, nicho: "moda", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop" },
    { id: 7, nome: "Ração Seca para Cães 10kg", preco: 139.90, comissao: 9, poucosAfiliados: false, nicho: "pet", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop" },
    { id: 8, nome: "Brinquedo Educativo Montessori Bebê", preco: 54.90, comissao: 28, poucosAfiliados: true, nicho: "bebe", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop" }
];

let abaAtiva = 'todos';
let nichoSelecionado = 'todos';

function carregarProdutosExemplo() {
    renderizarProdutos(PRODUTOS_EXEMPLO);
    atualizarContagem(PRODUTOS_EXEMPLO.length);
}

// ==============================================
// 🎨 RENDERIZAR PRODUTOS NA TELA
// ==============================================
function renderizarProdutos(lista) {
    const container = document.getElementById('gradeProdutos');
    if (!container) return;
    
    // Aplicar filtros
    let filtrada = [...lista];
    
    if (abaAtiva === 'poucos') {
        filtrada = filtrada.filter(p => p.poucosAfiliados);
    }
    if (abaAtiva === 'comissao') {
        filtrada = filtrada.sort((a, b) => b.comissao - a.comissao);
    }
    if (nichoSelecionado !== 'todos') {
        filtrada = filtrada.filter(p => p.nicho === nichoSelecionado);
    }
    
    container.innerHTML = '';
    
    if (filtrada.length === 0) {
        container.innerHTML = '<div style="grid-column:span-2;text-align:center;padding:40px;color:#777;"><p>Nenhum produto encontrado</p></div>';
        return;
    }
    
    filtrada.forEach(produto => {
        const badgePoucos = produto.poucosAfiliados 
            ? '<span style="background:#4CAF50;color:white;padding:2px 6px;border-radius:3px;font-size:10px;">Poucos Afiliados</span>' 
            : '';
        
        container.innerHTML += `
            <div class="produto-card">
                <div class="produto-imagem" style="position:relative;">
                    <img src="${produto.img}" alt="${produto.nome}" loading="lazy">
                    <div style="position:absolute;top:8px;left:8px;right:8px;display:flex;justify-content:space-between;">
                        <span style="background:#7B1FA2;color:white;padding:2px 6px;border-radius:3px;font-size:11px;font-weight:bold;">${produto.comissao}%</span>
                        ${badgePoucos}
                    </div>
                </div>
                <div style="padding:10px;">
                    <h3 style="font-size:14px;color:#333;margin-bottom:6px;line-height:1.3;">${produto.nome}</h3>
                    <p style="font-size:17px;font-weight:bold;color:#222;margin-bottom:4px;">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    <p style="font-size:11px;color:#777;margin-bottom:10px;">Você ganha ~R$${(produto.preco * produto.comissao / 100).toFixed(2).replace('.', ',')}</p>
                    <button onclick="criarOferta(${produto.id})" style="width:100%;background:#7B1FA2;color:white;border:none;padding:9px;border-radius:6px;font-size:14px;font-weight:bold;cursor:pointer;">CRIAR OFERTA</button>
                </div>
            </div>
        `;
    });
    
    atualizarContagem(filtrada.length);
}

// ==============================================
// 🔧 FUNÇÕES AUXILIARES
// ==============================================
function atualizarContagem(quantidade) {
    const el = document.getElementById('qtdOfertas');
    if (el) el.textContent = `${quantidade} produtos`;
}

function mudarAba(tipo) {
    abaAtiva = tipo;
    carregarProdutosExemplo();
}

function filtrarPorNicho(tipo) {
    nichoSelecionado = tipo;
    carregarProdutosExemplo();
}

function buscarOfertas() {
    const termo = document.getElementById('campoBusca')?.value?.toLowerCase() || '';
    if (!termo) {
        carregarProdutosExemplo();
        return;
    }
    const filtrados = PRODUTOS_EXEMPLO.filter(p => p.nome.toLowerCase().includes(termo));
    renderizarProdutos(filtrados);
    atualizarContagem(filtrados.length);
}

function criarOferta(id) {
    localStorage.setItem('produtoSelecionado', id);
    mostrarMensagem('✅ Abrindo oferta...');
    // window.location.href = 'oferta.html'; // ative quando a página estiver pronta
}

function mostrarMensagem(texto) {
    console.log(texto);
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = texto;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 3000);
    }
}

function sairDoSistema() {
    if (confirm('Deseja sair da sua conta?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}
