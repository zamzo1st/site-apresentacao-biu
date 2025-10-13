// noticia para consumir API News e exibir notícias na seção Notícias

    const form = document.getElementById('searchForm');
    const queryInput = document.getElementById('query');
    const newsContainer = document.getElementById('newsContainer');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = queryInput.value;
      const apiKey = 'SUA_CHAVE_API'; // Substitua pela sua chave da NewsAPI
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=pt&apiKey=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      newsContainer.innerHTML = '';
      data.articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow p-4';
        card.innerHTML = `
          <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="${article.title}" class="w-full h-48 object-cover rounded mb-4">
          <h3 class="text-xl font-semibold mb-2">${article.title}</h3>
          <p class="text-sm text-gray-600 mb-4">${article.description || ''}</p>
          <a href="${article.url}" target="_blank" class="text-amber-700 font-bold hover:underline">Leia mais</a>
        `;
        newsContainer.appendChild(card);
      });
    });
  
    