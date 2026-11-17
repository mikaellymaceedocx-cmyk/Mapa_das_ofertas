// ==========================================
// MAPA DAS OFERTAS — Arquivo JavaScript
// ==========================================

// =====================
// DADOS SALVOS
// =====================
function getCredenciais() {
    return {
        nome: localStorage.getItem('usuario_nome') || '',
        appId: localStorage.getItem('shopee_app_id') || '',
        secret: localStorage.getItem('shopee_app_secret') || '',
        apiUrl: localStorage.getItem('shopee_api_url') || ''
    };
}

function salvarCredenciais(nome, appId, secret, apiUrl) {
    localStorage.setItem('usuario_nome', nome);
    localStorage.setItem('shopee_app_id', appId);
    localStorage.setItem('shopee_app_secret', secret);
    localStorage.setItem('shopee_api_url', apiUrl);
}

function estaConectado() {
    const dados = getCredenciais();
    return dados.appId !== '' && dados.secret !== '';
}

// =====================
// TELA DE LOGIN
// =====================
function salvarCredenciaisEEntrar() {
    const nome = document.getElementById('user-name').value.trim();
    const appId = document.getElementById('app-id').value.trim();
    const secret = document.getElementById('app-secret').value.trim();
    const apiUrl = document.getElementById('api-url').value.trim();

    if (!appId || !secret || !apiUrl) {
        alert('⚠️ Por favor, preencha App ID, Secret e URL da API.');
        return;
    }

    salvarCredenciais(nome, appId, secret, apiUrl);
    window.location.href = 'dashboard.html';
}

// Mostrar/esconder senha
const toggleSecret = document.getElementById('toggle-secret');
if (toggleSecret) {
    toggleSecret.addEventListener('click', function() {
        const input = document.getElementById('app-secret');
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    });
}

// =====================
// TELA PRINCIPAL — DASHBOARD
// =====================
function carregarUsuario() {
    const dados = getCredenciais();
    const display = document.getElementById('user-display');
    if (display) {
        display.textContent = dados.nome || 'Usuário';
    }
}

function sair() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuario_nome');
        localStorage.removeItem('shopee_app_id');
        localStorage.removeItem('shopee_app_secret');
        localStorage.removeItem('shopee_api_url');
        window.location.href = 'login.html';
    }
}

// Verificar se está logado ao carregar dashboard
if (document.body.classList.contains('page-dashboard')) {
    if (!estaConectado()) {
        window.location.href = 'login.html';
    } else {
        carregarUsuario();
    }
}

// Botões de filtro
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Botões de preço
document.querySelectorAll('.price-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.price-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

function buscarOfertas() {
    const termo = document.getElementById('search-input').value.trim();
    if (!termo) {
        alert('Digite algo para buscar!');
        return;
    }
    
    const grid = document.getElementById('products-grid');
    grid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-spinner fa-spin"></i>
            <h4>Buscando "${termo}"...</h4>
            <p>Conectando com a API da Shopee...</p>
        </div>
    `;
    
    setTimeout(() => {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h4>Resultados para: "${termo}"</h4>
                <p>🔌 Aqui aparecerão os produtos quando a API estiver conectada.</p>
                <p style="margin-top: 12px; font-size: 13px; color: #7c3aed;">
                    Em desenvolvimento — conecte sua API para ver os produtos reais! ✨
                </p>
            </div>
        `;
        document.getElementById('result-count').textContent = '0 produtos';
    }, 1200);
}

// =====================
// TELA DE OFERTA
// =====================
function voltarParaDashboard() {
    window.location.href = 'dashboard.html';
}

function copiarLink() {
    const link = document.getElementById('produto-link');
    link.select();
    document.execCommand('copy');
    alert('✅ Link copiado!');
}

function gerarPalavras() {
    const nome = document.getElementById('produto-nome').textContent;
    const palavras = nome.split(' ').filter(p => p.length > 2).slice(0, 6);
    const box = document.getElementById('keywords-box');
    box.innerHTML = '';
    palavras.forEach(p => {
        const span = document.createElement('span');
        span.className = 'keyword';
        span.textContent = p;
        box.appendChild(span);
    });
    alert('✅ Palavras geradas!');
}

function gerarLegenda() {
    const nome = document.getElementById('produto-nome').textContent;
    const preco = document.getElementById('produto-preco').textContent;
    const legenda = `✨ ${nome}\n🔥 Oportunidade incrível!\n💰 Apenas ${preco}\n👇 Confira:`;
    document.getElementById('caption-text').value = legenda;
    alert('✅ Legenda gerada!');
}

function copiarLegenda() {
    const texto = document.getElementById('caption-text');
    if (!texto.value) {
        alert('Gere uma legenda primeiro!');
        return;
    }
    texto.select();
    document.execCommand('copy');
    alert('✅ Legenda copiada!');
}

function publicarShopeeVideo() {
    alert('📤 Abrindo Shopee Vídeo...\n\nCole sua legenda e hashtags lá dentro! ✨');
}

function compartilharWhatsApp() {
    const link = document.getElementById('produto-link').value;
    const texto = encodeURIComponent(`Olha essa oferta! ${link}`);
    window.open(`https://wa.me/?text=${texto}`, '_blank');
}

function baixarImagem() {
    alert('🖼️ Salvando imagem...');
}

function verNaShopee() {
    const link = document.getElementById('produto-link').value;
    if (link) window.open(link, '_blank');
}

console.log('✅ Mapa das Ofertas — Carregado com sucesso!');
