let pagina = 1;
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");

btnSiguiente.addEventListener("click", () => {
    if (pagina < 1000) {
        pagina += 1;
        obtenerPeliculasFamilia();
    }
});

btnAnterior.addEventListener("click", () => {
    if (pagina > 1) {
        pagina -= 1;
        obtenerPeliculasFamilia();
    }
});

const obtenerPeliculasFamilia = async () => {
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=d5c775389c73a0b2a2bc815d05093528&language=es-MX&with_genres=10751&page=${pagina}`);
        
        if (respuesta.status === 200) {
            const datos = await respuesta.json();
            let peliculas = "";
            
            datos.results.forEach(pelicula => {
                peliculas += `
                    <div class="pelicula" onclick="window.location.href='pelicula.html?id=${pelicula.id}'">
                        <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="${pelicula.title}">
                    </div>
                `;
            });
            
            document.getElementById("contenedor").innerHTML = peliculas;
        }
    } catch (error) {
        console.log("Error en la petición:", error);
    }
};

obtenerPeliculasFamilia();
