const apiKey = '840430a2eamshc3c7298b9838fd7p187d28jsn4dab3698ef99';
const apiHost = 'shazam.p.rapidapi.com';

document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    const artista = document.getElementById('artistaInput').value;
    const app = document.getElementById('app');
    app.innerHTML = 'Buscando...'; 

    // Buscar canciones del artista
    const searchUrl = `https://shazam.p.rapidapi.com/search?term=${encodeURIComponent(artista)}&locale=es-ES&offset=0&limit=10`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost,
        }
    };
    try {
        const searchRes = await fetch(searchUrl, options); 
        const searchText = await searchRes.text();
        let searchData = {};
        if (searchText) {
            try {
                searchData = JSON.parse(searchText);
            } catch (e) {
                app.innerHTML = 'La respuesta de la API no es un JSON válido.';
                console.error('JSON parse error:', e);
                return;
            }
        } else {
            app.innerHTML = 'La API devolvió una respuesta vacía.';
            return; 
        }

        // Mostrar canciones encontradas
        const tracks = searchData.tracks?.hits;
        if (tracks && tracks.length > 0) {
            app.innerHTML = (`<h2 class="text-2xl font-bold mb-4">Canciones más escuchadas por los usuarios:</h2>
            <ul>
              ${tracks.map(hit => `
                <li class="mb-2">
                  <strong>${hit.track.title}</strong> (${hit.track.subtitle})
                  ${hit.track.images?.coverart ? `<br><img src="${hit.track.images.coverart}" alt="cover" class="w-24 h-24 mt-2">` : ''}
                  ${hit.track.url ? `<br><a href="${hit.track.url}" target="_blank" class="text-blue-500 underline">Escuchar</a>` : ''}
                </li>
              `).join('')}
            </ul>
          `);
                } else {
            app.innerHTML = 'No se encontraron canciones para este artista.';
        }
    } catch (error) {
        app.innerHTML = 'Error al conectar con la API:<br>' + error.message;
        console.error('Error completo:', error);
    }
});