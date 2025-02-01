document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener el ID de la película de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        
        if (!movieId) {
            throw new Error('ID de película no encontrado');
        }

        await cargarDetallesPelicula(movieId);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudieron cargar los detalles de la película');
    }
});

const cargarDetallesPelicula = async (movieId) => {
    try {
        // Obtener detalles de la película
        const respuestaPelicula = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=d5c775389c73a0b2a2bc815d05093528&language=es-MX`
        );

        if (!respuestaPelicula.ok) {
            throw new Error('Error al obtener detalles de la película');
        }

        const pelicula = await respuestaPelicula.json();
        
        // Obtener el tráiler
        const trailer = await obtenerTrailer(movieId);

        // Actualizar el contenido de la página
        actualizarContenidoPelicula(pelicula, trailer);
    } catch (error) {
        console.error('Error en cargarDetallesPelicula:', error);
        mostrarError('Error al cargar los detalles de la película');
    }
};

const obtenerTrailer = async (movieId) => {
    try {
        const respuesta = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=d5c775389c73a0b2a2bc815d05093528&language=es-MX`
        );

        if (!respuesta.ok) {
            throw new Error('Error al obtener el tráiler');
        }

        const datos = await respuesta.json();
        const trailer = datos.results.find(video => video.type === "Trailer");
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
        console.error('Error en obtenerTrailer:', error);
        return null;
    }
};

const actualizarContenidoPelicula = (pelicula, trailerUrl) => {
    const contenedorDetalle = document.getElementById('contenedorDetalle');
    
    // Verificar si hay una imagen de póster
    const posterPath = pelicula.poster_path 
        ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
        : 'ruta-a-imagen-por-defecto.jpg';

    contenedorDetalle.innerHTML = `
        <div class="detallePelicula">
            <img class="poster" src="${posterPath}" alt="${pelicula.title}">
            <h1 class="titulo">${pelicula.title}</h1>
            <p class="descripcion">${pelicula.overview || 'No hay descripción disponible.'}</p>
            <div class="info-adicional">
                <p><strong>Fecha de estreno:</strong> ${pelicula.release_date || 'No disponible'}</p>
                <p><strong>Puntuación:</strong> ${pelicula.vote_average || 'No disponible'}/10</p>
            </div>
            ${trailerUrl ? `
                <button class="trailer-btn" onclick="verTrailer('${trailerUrl}')">
                    Ver Tráiler
                </button>
            ` : ''}
        </div>
    `;
};

const mostrarError = (mensaje) => {
    const contenedorDetalle = document.getElementById('contenedorDetalle');
    contenedorDetalle.innerHTML = `
        <div class="error">
            <p>${mensaje}</p>
        </div>
    `;
};

const verTrailer = (url) => {
    if (url) {
        window.open(url, "_blank");
    } else {
        alert("No hay tráiler disponible para esta película.");
    }
};