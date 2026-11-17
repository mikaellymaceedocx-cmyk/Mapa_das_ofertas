// ==========================================
// 🔑 FUNÇÃO DE LOGIN
// ==========================================
function fazerLogin() {
    const nome = document.getElementById('user-name')?.value || '';
    const appId = document.getElementById('app-id')?.value || '';
    const secret = document.getElementById('app-secret')?.value || '';
    const apiUrl = document.getElementById('api-url')?.value || '';

    if (!nome.trim()) {
        alert('Por favor, digite seu nome!');
        return;
    }

    // Salva os dados do usuário
    localStorage.setItem('userName', nome);
    localStorage.setItem('appId', appId);
    localStorage.setItem('appSecret', secret);
    localStorage.setItem('apiUrl', apiUrl);

    // Vai para o painel principal
    window.location.href = 'dashboard.html';
}

// ==========================================
// 👤 CARREGAR NOME DO USUÁRIO NO DASHBOARD
// ==========================================
function carregarDadosUsuario() {
    const nomeSalvo = localStorage.getItem('userName') || 'Usuário';
    const inicial = nomeSalvo.charAt(0).toUpperCase();
    
    const elNome = document.getElementById('user-full-name');
    const elInicial = document.getElementById('user-initial');
    
    if (elNome) elNome.textContent = nomeSalvo.toUpperCase();
    if (elInicial) elInicial.textContent = inicial;
}

// ==========================================
// 🚪 SAIR DO SISTEMA
// ==========================================
function sairDoSistema() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    }
}

// ==========================================
// 📑 NAVEGAÇÃO ENTRE ABAS
// ==========================================
function mudarAba(nomeAba) {
    // Esconde todas as abas
    document.querySelectorAll('.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });
    // Remove destaque de todas as abas
    document.querySelectorAll('.main-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Mostra a aba selecionada
    const abaAtiva = document.getElementById(`aba-${nomeAba}`);
    const tabAtiva = document.getElementById(`tab-${nomeAba}`);
    if (abaAtiva) abaAtiva.classList.add('active');
    if (tabAtiva) tabAtiva.classList.add('active');
}

// ==========================================
// 🔍 FILTROS — Carregar produtos na aba de ofertas
// ==========================================
let listaProdutos = [];

function carregarProdutos(filtro = 'todas') {
    const grade = document.getElementById('grade-produtos');
    const tituloSecao = document.getElementById('titulo-secao');
    if (!grade) return;

    grade.innerHTML = '';

    let produtosFiltrados = [...listaProdutos];

    // Aplica os filtros
    switch(filtro) {
        case 'avaliadas':
            tituloSecao.textContent = '⭐ BEM AVALIADOS';
            produtosFiltrados.sort((a, b) => parseFloat(b.avaliacao) - parseFloat(a.avaliacao));
            break;
        case 'vendidas':
            tituloSecao.textContent = '🛒 MAIS VENDIDOS';
            produtosFiltrados = produtosFiltrados.filter(p => p.vendas).sort((a, b) => {
                const numA = parseInt(a.vendas) || 0;
                const numB = parseInt(b.vendas) || 0;
                return numB - numA;
            });
            break;
        case 'comissao':
            tituloSecao.textContent = '💰 MAIOR COMISSÃO';
            produtosFiltrados.sort((a, b) => {
                const numA = parseFloat(a.ganho.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
                const numB = parseFloat(b.ganho.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
                return numB - numA;
            });
            break;
        case 'poucos':
            tituloSecao.textContent = '👤 POUCOS AFILIADOS';
            produtosFiltrados.reverse();
            break;
        default:
            tituloSecao.textContent = 'OFERTAS DO DIA';
    }

    document.getElementById('qtd-ofertas').textContent = produtosFiltrados.length;

    // Renderiza os produtos
    produtosFiltrados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <span class="commission-tag">Comissão ${produto.comissao}</span>
                ${produto.desconto ? `<span class="discount-tag">${produto.desconto}</span>` : ''}
                ${produto.destaque ? `<span class="new-badge">${produto.destaque}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${produto.nome}</h3>
                <p class="price">${produto.preco} ${produto.desconto ? `<span class="discount-inline">${produto.desconto}</span>` : ''}</p>
                <p class="rating"><i class="fas fa-star"></i> ${produto.avaliacao}${produto.vendas ? ` • ${produto.vendas}` : ''}</p>
                ${produto.vendedor ? `<p class="seller">${produto.vendedor}</p>` : ''}
                <p class="earning">Você ganha ${produto.ganho}</p>
                <button class="create-offer-btn" onclick="abrirModalOferta(${produto.id})">CRIAR OFERTA</button>
            </div>
        `;
        grade.appendChild(card);
    });

    // Ativa botão do filtro
    document.querySelectorAll('.filter-tags .tag-btn').forEach(btn => btn.classList.remove('active'));
    const btnAtivo = document.getElementById(`filtro-${filtro}`);
    if (btnAtivo) btnAtivo.classList.add('active');
}

function abrirFiltro(tipo) {
    carregarProdutos(tipo);
}

// ==========================================
// ✨ MODAL — CRIAR OFERTA
// ==========================================
let produtoAtual = null;
const dadosHashtags = {
    mamadeira: {
        legenda: "✨ Mamadeira Anticólica — conforto e segurança para seu bebê!\n✅ Sem BPA • Silicone macio • Fácil de limpar\n💝 Perfeita para o dia a dia e viagens\n👉 Garanta a sua com desconto!",
        tags: "#Mamadeira #MamadeiraAnticolica #AlimentacaoBebe #ProdutosParaBebe #CuidaDoBebe #Maternidade #BebeSeguro #SiliconeParaBebe #FamiliaFeliz #AmorDeMae"
    },
    carrinho_bebe: {
        legenda: "👶 Carrinho de Bebê Dobrável — praticidade que você merece!\n✅ Leve e dobrável • Inclui capa de chuva • Seguro e confortável\n💝 Ideal para passeios com seu pequeno\n👉 Confira o preço especial!",
        tags: "#CarrinhoDeBebe #PasseioComBebe #ProdutosInfantis #MaternidadePratica #BebeConfortavel #CuidadosComBebe #PasseioComSeuBebe #MamaeOrganizada #PapaiEBebe #PresenteParaBebe"
    },
    decoração: {
        legenda: "🏠 Deixe sua casa ainda mais bonita! ✨\n✅ Qualidade premium • Entrega rápida • Melhor preço\n💝 Transforme seu ambiente hoje mesmo!",
        tags: "#DecoracaoCasa #MoveisSuaCasa #AmbienteAconchegante #SuaCasaSuaFace #DecoracaoBarata #MoveisQualidade #EstiloDeVida #LarDoceLar #DecoracaoFacil #CasaDosSonhos"
    },
    moveis: {
        legenda: "🪑 Móveis que unem beleza e conforto para sua família! ✨\n✅ Feito com materiais de qualidade • Durável e elegante\n💝 Renove sua sala hoje mesmo!",
        tags: "#MoveisDecoracao #SalaDeEstar #MoveisDeQualidade #CasaOrganizada #AmbienteAgradavel #ConfortoEClasse #DecorarSuaCasa #MoveisEstilosos #LarDosSonhos #FamiliaEmCasa"
    },
    festas: {
        legenda: "🎉 Torne sua festa ainda mais especial! ✨\n✅ Materiais de alta qualidade • Fácil de montar\n💝 Surpreenda seus convidados!",
        tags: "#FestaEmCasa #DecoracaoDeFesta #AniversarioPerfeito #FestaInesquecivel #OrganizacaoDeFestas #FestaEconomica #IdeiasDeFesta #MomentoEspecial #CelebreComEstilo #FestaDosSonhos"
    },
    amamentacao: {
        legenda: "🤱 Conforto e apoio para os momentos mais especiais! 💛\n✅ Design ergonômico • Macio e resistente • Facilita a amamentação\n💝 Cuide de você e do seu bebê com carinho!",
        tags: "#Amamentacao #ConfortoDaMae #MaternidadeReal #AmorDeMae #CuidaDeVoBebe #ApoioParaMae #AmamentacaoComConforto #MaternidadeComCarinho #BemEstarMaeBebe #SuporteMaternal"
    },
    padrão: {
        legenda: "✨ Encontre esse produto com ótimo preço e condições especiais!\n✅ Produto de qualidade • Vendedor confiável • Entrega rápida\n💝 Aproveite essa oferta incrível!",
        tags: "#CompreComConfianca #OfertasDoDia #MelhorPreco #ProdutoOriginal #EntregaRapida #CompraSegura #OportunidadeUnica #ValorParaVoce #QualidadeGarantida #DicaDeCompra"
    }
};

function abrirModalOferta(id) {
    produtoAtual = listaProdutos.find(p => p.id === id);
    if (!produtoAtual) return;

    const modal = document.getElementById('modal-criar-oferta');
    if (modal) modal.style.display = 'flex';

    const nomeEl = document.getElementById('modal-produto-nome');
    const prodNome = document.getElementById('produto-nome-exibicao');
    const prodValor = document.getElementById('produto-valor-exibicao');
    
    if (nomeEl) nomeEl.textContent = produtoAtual.nome.substring(0, 25) + '...';
    if (prodNome) prodNome.value = produtoAtual.nome;
    if (prodValor) prodValor.value = `${produtoAtual.preco} • Comissão: ${produtoAtual.comissao} • Você ganha ${produtoAtual.ganho}`;

    // Reseta opções
    document.querySelectorAll('.opcao-card').forEach(el => el.classList.remove('selecionado'));
    document.getElementById('area-conteudo').style.display = 'none';
}

function fecharModal() {
    const modal = document.getElementById('modal-criar-oferta');
    if (modal) modal.style.display = 'none';
    produtoAtual = null;
}

function selecionarCanal(canal) {
    document.querySelectorAll('.opcao-card').forEach(el => el.classList.remove('selecionado'));
    document.getElementById(`opcao-${canal}`).classList.add('selecionado');
    document.getElementById('area-conteudo').style.display = 'block';

    const cat = produtoAtual.categoria || 'padrão';
    const dados = dadosHashtags[cat] || dadosHashtags.padrão;

    document.getElementById('campo-legenda').value = dados.legenda;
    document.getElementById('campo-hashtags').value = dados.tags;
}

function copiarConteudo() {
    const legenda = document.getElementById('campo-legenda').value;
    const hashtags = document.getElementById('campo-hashtags').value;
    const textoCompleto = `${legenda}\n\n${hashtags}`;
    
    navigator.clipboard.writeText(textoCompleto).then(() => {
        alert('✅ Copiado com sucesso! Cole onde quiser!');
    }).catch(() => {
        alert('Texto copiado manualmente — selecione e copie por favor');
    });
}

function publicar() {
    alert('✅ Conteúdo pronto!\n\n💡 Para o Shopee Vídeo: abra o aplicativo da Shopee → clique em "Vídeo" → "Criar" → cole a legenda e as hashtags.\n\nPara WhatsApp: copie tudo e envie no seu grupo!');
    fecharModal();
}

function irParaOferta(id) {
    abrirModalOferta(id);
}

function voltarParaInicio() {
    window.location.href = 'dashboard.html';
}

function buscarOfertas() {
    const termo = document.getElementById('search-input')?.value || '';
    if (termo.trim()) {
        alert(`🔍 Buscando por: "${termo}"\n\nEssa funcionalidade completa será disponível em breve! Por enquanto, use os filtros abaixo para explorar as ofertas.`);
    }
}

function filtrarPorNicho() {
    const nicho = document.getElementById('nicho-select').value;
    if (nicho === 'todos') {
        carregarProdutos('todas');
        return;
    }
    const filtrados = listaProdutos.filter(p => p.nicho === nicho);
    carregarProdutos('todas');
}

// ==========================================
// 🔒 MOSTRAR/OCULTAR SENHA
// ==========================================
const botaoOlho = document.getElementById('toggle-secret');
if (botaoOlho) {
    botaoOlho.addEventListener('click', () => {
        const campo = document.getElementById('app-secret');
        const icone = botaoOlho.querySelector('i');
        if (campo.type === 'password') {
            campo.type = 'text';
            icone.className = 'fas fa-eye-slash';
        } else {
            campo.type = 'password';
            icone.className = 'fas fa-eye';
        }
    });
}

// ==========================================
// ⚡ INICIALIZA — Quando a página carrega
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver na página de dashboard, carrega dados do usuário e produtos
    if (document.body.classList.contains('page-dashboard')) {
        carregarDadosUsuario();
        
        listaProdutos = [
            { id: 1, nome: "Rack com Painel para TV até 65 Polegadas Life Caemmun", preco: "R$ 805,49", imagem: "https://via.placeholder.com/600x400/e8e8e8/333?text=Rack+TV", comissao: "13%", ganho: "~R$ 104,71", avaliacao: "4,8", vendas: "", nicho: "casa", destaque: "", categoria: "decoração" },
            { id: 2, nome: "Kit 2 Cadeira Orgânica Manuela sala de jantar", preco: "R$ 349,94", imagem: "https://via.placeholder.com/600x400/f0f0f0/333?text=Cadeiras", comissao: "13%", ganho: "~R$ 45,49", avaliacao: "4,8", vendas: "59 vendidos", desconto: "-30%", nicho: "casa", destaque: "", categoria: "moveis" },
            { id: 3, nome: "Kit Festa Cubo 4 Peças (dourado, rose gold, preto)", preco: "R$ 299,20", imagem: "https://via.placeholder.com/600x400/faf0f5/333?text=Festa", comissao: "14%", ganho: "~R$ 41,89", avaliacao: "4,9", vendas: "32 vendidos", desconto: "-12%", nicho: "casa", destaque: "", categoria: "festas" },
            { id: 4, nome: "Poltrona Decorativa Com Almofada Amamentação", preco: "R$ 273,67", imagem: "https://via.placeholder.com/600x400/fff8f0/333?text=Poltrona", comissao: "13%", ganho: "~R$ 35,58", avaliacao: "5,0", vendas: "18 vendidos", desconto: "-12%", nicho: "bebe", destaque: "LANÇAMENTO!", categoria: "amamentacao" },
            { id: 5, nome: "Mamadeira Anticólica 240ml Silicone", preco: "R$ 39,90", imagem: "https://via.placeholder.com/600x400/fff/333?text=Mamadeira", comissao: "12%", ganho: "~R$ 4,79", avaliacao: "4,9", vendas: "230 vendidos", nicho: "bebe", destaque: "", categoria: "mamadeira" },
            { id: 6, nome: "Carrinho de Bebê Dobrável com Capa de Chuva", preco: "R$ 459,90", imagem: "https://via.placeholder.com/600x400/f8f8f8/333?text=Carrinho+Bebê", comissao: "11%", ganho: "~R$ 50,59", avaliacao: "4,7", vendas: "87 vendidos", nicho: "bebe", destaque: "", categoria: "carrinho_bebe" }
        ];

       
// ==========================================
// 🔧 GARANTIR QUE O BOTÃO DE LOGIN FUNCIONE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const botaoEntrar = document.querySelector('.btn-primary');
    if (botaoEntrar) {
        botaoEntrar.addEventListener('click', fazerLogin);
    }
});
