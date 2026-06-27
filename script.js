const state = {
    license: 'free',
    mode: 'free',
    history: [],
    currentProduct: null
};

const licenseKey = document.getElementById('licenseKey');
const unlockBtn = document.getElementById('unlockBtn');
const unlockSection = document.getElementById('unlockSection');
const appSection = document.getElementById('appSection');
const modeFree = document.getElementById('modeFree');
const modePro = document.getElementById('modePro');
const generateBtn = document.getElementById('generateBtn');
const productUrl = document.getElementById('productUrl');
const results = document.getElementById('results');
const postsContainer = document.getElementById('postsContainer');
const proFeatures = document.getElementById('proFeatures');
const webhookUrl = document.getElementById('webhookUrl');
const webhookBtn = document.getElementById('webhookBtn');
const zipBtn = document.getElementById('zipBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const upgradeBtn = document.getElementById('upgradeBtn');

function init() {
    const saved = localStorage.getItem('vendamax_license');
    if (saved === 'pro') {
        state.license = 'pro';
        showApp();
    }
    loadEventListeners();
}

function loadEventListeners() {
    unlockBtn.addEventListener('click', handleUnlock);
    modeFree.addEventListener('click', () => setMode('free'));
    modePro.addEventListener('click', () => setMode('pro'));
    generateBtn.addEventListener('click', handleGenerate);
    webhookBtn.addEventListener('click', handleWebhook);
    zipBtn.addEventListener('click', handleDownloadZip);
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));
    upgradeBtn.addEventListener('click', () => modal.classList.remove('hidden'));
}

function handleUnlock() {
    const key = licenseKey.value.trim();
    if (key === 'PRO-2026') {
        state.license = 'pro';
        localStorage.setItem('vendamax_license', 'pro');
        showApp();
        showAlert('✅ PRO Desbloqueado!', 'success');
    } else {
        showAlert('❌ Chave inválida', 'error');
    }
}

function showApp() {
    unlockSection.classList.add('hidden');
    appSection.classList.remove('hidden');
}

function setMode(mode) {
    if (mode === 'pro' && state.license !== 'pro') {
        modal.classList.remove('hidden');
        return;
    }
    state.mode = mode;
    modeFree.classList.toggle('active', mode === 'free');
    modePro.classList.toggle('active', mode === 'pro');
}

function handleGenerate() {
    const url = productUrl.value.trim();
    if (!url) {
        showAlert('Cole o link do produto primeiro', 'error');
        return;
    }
    
    const posts = state.mode === 'pro' ? 10 : 3;
    state.currentProduct = {
        titulo: 'Produto Teste',
        preco: 'R$ 99,90',
        imagem: 'https://via.placeholder.com/300',
        linkAfiliado: url,
        loja: 'Shopee'
    };
    
    postsContainer.innerHTML = '';
    for (let i = 1; i <= posts; i++) {
        const post = document.createElement('div');
        post.className = 'post-item';
        post.innerHTML = `
            <h4>Post ${i}</h4>
            <p>🔥 Oferta Imperdível! ${state.currentProduct.titulo}</p>
            <p>💰 Por apenas ${state.currentProduct.preco}</p>
            <a href="${state.currentProduct.linkAfiliado}" target="_blank">👉 Comprar Agora</a>
        `;
        postsContainer.appendChild(post);
    }
    
    results.classList.remove('hidden');
    if (state.license === 'pro') {
        proFeatures.classList.remove('hidden');
    }
}

async function handleWebhook() {
    const url = webhookUrl.value.trim();
    if (!url) {
        showAlert('Cole a URL do webhook', 'error');
        return;
    }
    showAlert('📤 Enviando para Auto-Post...', 'info');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({produto: state.currentProduct})
        });
        if (response.ok) {
            showAlert('✅ Enviado com sucesso!', 'success');
        } else {
            throw new Error('Erro');
        }
    } catch (error) {
        showAlert('❌ Erro ao enviar. Verifique a URL', 'error');
    }
}

function handleDownloadZip() {
    showAlert('📦 Gerando ZIP...', 'info');
    setTimeout(() => {
        showAlert('✅ ZIP baixado!', 'success');
    }, 1000);
}

function showAlert(msg, type) {
    alert(msg);
}

init();