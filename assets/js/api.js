// ATENÇÃO: Altere esta URL para o seu endereço do PythonAnywhere em produção
const API_BASE_URL = 'https://biudopiseiro.pythonanywhere.com';
//const API_BASE_URL = 'http://127.0.0.1:5000'; // Use o servidor local para testar

// --- Funções do Modal de Notícias ---
const newsModal = document.getElementById('news-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openNewsModal(title, content) {
    if (!newsModal || !modalTitle || !modalBody) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    newsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
    if (!newsModal) return;
    newsModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Expose closeNewsModal to global scope for the HTML button onclick
window.closeNewsModal = closeNewsModal;

document.addEventListener('DOMContentLoaded', function () {

    // --- 1. FUNÇÃO PARA CARREGAR A AGENDA DE SHOWS ---
    function loadShows() {
        const apiUrlShows = `${API_BASE_URL}/api/proximos-shows`;
        const agendaContainer = document.getElementById('agenda-container');
        if (!agendaContainer) return;

        // Skeleton Loader para Shows
        agendaContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'py-4 border-b border-white/20 text-center md:text-left animate-pulse';
            skeleton.innerHTML = `
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="w-full">
                        <div class="h-6 bg-white/20 rounded w-1/3 mb-2 mx-auto md:mx-0"></div>
                        <div class="h-4 bg-white/20 rounded w-1/2 mx-auto md:mx-0"></div>
                    </div>
                </div>
            `;
            agendaContainer.appendChild(skeleton);
        }

        fetch(apiUrlShows)
            .then(response => {
                if (!response.ok) { throw new Error('A resposta da rede não foi bem-sucedida.'); }
                return response.json();
            })
            .then(shows => {
                agendaContainer.innerHTML = '';
                if (shows.length === 0) {
                    agendaContainer.innerHTML = '<p class="text-xl text-center">Nenhum show confirmado no momento. Volte em breve!</p>';
                    return;
                }
                shows.forEach(show => {
                    const showElement = document.createElement('div');
                    showElement.className = 'py-4 border-b border-white/20 text-center md:text-left';
                    const innerDiv = document.createElement('div');
                    innerDiv.className = 'flex flex-col md:flex-row justify-between items-center';

                    const textDiv = document.createElement('div');

                    const h4 = document.createElement('h4');
                    h4.className = 'text-xl font-bold text-white';
                    h4.textContent = show.eventName;

                    const p = document.createElement('p');
                    p.className = 'text-gray-300';
                    p.textContent = `${show.showDate} - ${show.city}/${show.state}`;

                    textDiv.appendChild(h4);
                    textDiv.appendChild(p);
                    innerDiv.appendChild(textDiv);
                    showElement.appendChild(innerDiv);
                    agendaContainer.appendChild(showElement);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar a agenda:', error);
                agendaContainer.innerHTML = '<p class="text-xl text-red-400 text-center">Não foi possível carregar a agenda. Tente novamente.</p>';
            });
    }

    // --- 2. FUNÇÃO PARA CARREGAR AS NOTÍCIAS ---
    let allNews = [];

    function renderNews(articles) {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;

        if (articles.length === 0) {
            newsContainer.innerHTML = '<p class="text-center text-xl col-span-full text-gray-500">Nenhuma notícia encontrada.</p>';
            return;
        }
        newsContainer.innerHTML = '';
        articles.forEach(article => {
            const imageUrl = article.image_url ? article.image_url : 'https://placehold.co/600x400/e2e8f0/9ca3af?text=Notícia';

            const articleCard = document.createElement('div');
            articleCard.className = "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer";

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = "Imagem de destaque da notícia";
            img.className = "w-full h-48 object-cover";
            img.loading = "lazy"; // Lazy loading added

            const contentDiv = document.createElement('div');
            contentDiv.className = "p-6";

            const h3 = document.createElement('h3');
            h3.className = "font-bold text-xl mb-2 text-gray-800";
            h3.textContent = article.title;

            const p = document.createElement('p');
            p.className = "text-gray-600 text-sm";
            p.textContent = article.publication_date;

            contentDiv.appendChild(h3);
            contentDiv.appendChild(p);

            articleCard.appendChild(img);
            articleCard.appendChild(contentDiv);

            if (article.source_link_url) {
                const linkElement = document.createElement('a');
                linkElement.href = article.source_link_url;
                linkElement.target = "_blank";
                linkElement.rel = "noopener noreferrer";
                linkElement.appendChild(articleCard);
                newsContainer.appendChild(linkElement);
            } else if (article.content) {
                articleCard.addEventListener('click', () => {
                    openNewsModal(article.title, article.content);
                });
                newsContainer.appendChild(articleCard);
            }
        });
    }

    function loadNews() {
        const apiUrlNews = `${API_BASE_URL}/api/noticias`;
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;

        // Skeleton Loader para Notícias
        newsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = "bg-white rounded-lg overflow-hidden shadow-md animate-pulse";
            skeleton.innerHTML = `
                <div class="w-full h-48 bg-gray-300"></div>
                <div class="p-6">
                    <div class="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            `;
            newsContainer.appendChild(skeleton);
        }

        fetch(apiUrlNews)
            .then(response => response.json())
            .then(articles => {
                allNews = articles;
                renderNews(allNews);
            })
            .catch(error => {
                console.error('Erro ao buscar notícias:', error);
                newsContainer.innerHTML = '<p class="text-center text-xl col-span-full text-red-500">Não foi possível carregar as notícias. Tente novamente.</p>';
            });
    }

    // --- Handler da Busca ---
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('query').value.toLowerCase();
            const filtered = allNews.filter(article =>
                article.title.toLowerCase().includes(query) ||
                (article.content && article.content.toLowerCase().includes(query))
            );
            renderNews(filtered);
        });
    }

    // --- 3. INICIA AS DUAS FUNÇÕES ---
    loadShows();
    loadNews();

    // --- 4. RE-EXECUTA O FEATHER ICONS ---
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
