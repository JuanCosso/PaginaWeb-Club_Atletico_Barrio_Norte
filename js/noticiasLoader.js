console.log("noticiasLoader.js ejecutado");

function crearNoticia(noticia) {
  return `
      <article class="noticia">
        <div class="noticia-imagen">
          <img src="${noticia.imagen}" alt="Imagen de ${noticia.titulo}">
        </div>
        <div class="noticia-contenido">
          <h3>${noticia.titulo}</h3>
          <p>${noticia.resumen}</p>
          <a href="noticia-detail.html?id=${noticia.id}" class="leer-mas">Leer más</a>
        </div>
        <div class="noticia-etiquetas">
          <span class="noticia-etiqueta">${noticia.etiqueta_1}</span>
          <span class="noticia-etiqueta">${noticia.etiqueta_2}</span>
        </div>
      </article>
    `;
}

function loadUltimasNoticias() {
  const NOTICIAS_URL = "json/noticias.json";

  fetch(NOTICIAS_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      // Ordenar las noticias por fecha descendente
      data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      // Seleccionar las 3 noticias más recientes
      const ultimasNoticias = data.slice(0, 4);

      const container = document.querySelector(".noticias-container");
      if (!container) {
        console.error("No se encontró el contenedor con clase 'noticias-container'");
        return;
      }

      // Eliminar solo los elementos de noticias existentes, pero conservar el encabezado
      const noticiasExistentes = container.querySelectorAll(".noticia");
      noticiasExistentes.forEach((noticia) => noticia.remove());

      // Generar el HTML para las noticias
      const noticiasHTML = ultimasNoticias
        .map((noticia) => crearNoticia(noticia))
        .join("");

      // Agregar las noticias al contenedor sin eliminar el encabezado
      container.innerHTML += noticiasHTML;
    })
    .catch((error) => {
      console.error("Error al cargar las noticias:", error);
    });
}

let allNews = []; // Almacena todas las noticias ordenadas
let loadedCount = 0; // Contador de noticias cargadas
const NEWS_PER_LOAD = 8; // Noticias por carga

function loadNoticias(loadMore = false) {
  const NOTICIAS_URL = "json/noticias.json";
  const container = document.querySelector(".noticias-container");

  if (!container) {
    console.error("Contenedor no encontrado");
    return;
  }

  // Mantener el encabezado intacto
  const header = container.querySelector(".noticias-header");
  if (!header) {
    console.error("Encabezado no encontrado en el contenedor");
    return;
  }

  if (!loadMore) {
    loadedCount = 0; // Reiniciamos el contador
    // Eliminar solo las noticias existentes, pero conservar el encabezado
    const noticiasExistentes = container.querySelectorAll(".noticia");
    noticiasExistentes.forEach((noticia) => noticia.remove());
  }

  // SIEMPRE hacer fetch y filtrar/ordenar cuando NO es loadMore
  if (!loadMore) {
    fetch(NOTICIAS_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Error: " + response.status);
        return response.json();
      })
      .then((data) => {
        // Obtener valores de los filtros
        const dateOrder = document.getElementById("filter-date").value;
        const selectedTag = document.getElementById("filter-tag").value;

        console.log("Filtros aplicados:", { dateOrder, selectedTag });

        let sortedData = data.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
          return dateOrder === "oldest" ? dateA - dateB : dateB - dateA;
        });

        // Filtrar por etiqueta
        if (selectedTag) {
          sortedData = sortedData.filter(noticia => {
            // Verificar si la etiqueta está en etiqueta_1 o etiqueta_2
            const etiqueta1 = Array.isArray(noticia.etiqueta_1) ? noticia.etiqueta_1 : [noticia.etiqueta_1];
            const etiqueta2 = Array.isArray(noticia.etiqueta_2) ? noticia.etiqueta_2 : [noticia.etiqueta_2];
            
            return etiqueta1.includes(selectedTag) || etiqueta2.includes(selectedTag);
          });
        }

        allNews = sortedData;
        renderNews(container, false);
        console.log("FILTRANDO con: ", {
          orden: document.getElementById("filter-date")?.value,
          etiqueta: document.getElementById("filter-tag")?.value,
          noticiasFiltradas: allNews.length
        });
      })
      .catch((error) => console.error("Error:", error));
  } else {
    // Si es loadMore, solo renderiza el siguiente bloque
    renderNews(container, true);
  }
}

function renderNews(container, loadMore) {
  // Calcular segmento a mostrar
  const newsToShow = loadMore
    ? allNews.slice(loadedCount, loadedCount + NEWS_PER_LOAD)
    : allNews.slice(0, NEWS_PER_LOAD);

  // Actualizar contador
  loadedCount = loadMore
    ? loadedCount + newsToShow.length
    : NEWS_PER_LOAD;

  // Insertar noticias
  container.insertAdjacentHTML(
    "beforeend",
    newsToShow.map((noticia) => crearNoticia(noticia)).join("")
  );

  checkLoadMoreButton();
}

function checkLoadMoreButton() {
  let button = document.getElementById("load-more-news");

  // Eliminar botón si no hay más noticias
  if (loadedCount >= allNews.length) {
    if (button) button.remove();
    return;
  }

  // Crear botón si no existe
  if (!button) {
    button = document.createElement("button");
    button.id = "load-more-news";
    button.textContent = "Cargar más";
    button.addEventListener("click", () => loadNoticias(true));

    // Insertar después del contenedor
    const container = document.querySelector(".noticias-container");
    container.parentNode.insertBefore(button, container.nextSibling);
  }
}

// Función para configurar los eventos del formulario de filtros
function setupFilterEvents() {
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    // Remover eventos existentes para evitar duplicados
    const newForm = filterForm.cloneNode(true);
    filterForm.parentNode.replaceChild(newForm, filterForm);
    
    newForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Formulario enviado - aplicando filtros");
      loadNoticias(); // Esto aplicará los filtros inmediatamente
    });
    
    console.log("Eventos de filtro configurados correctamente");
  }
}

// Observador de mutaciones para detectar cuando se carga la página de noticias
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Verificar si se agregó el contenedor de noticias
            if (node.querySelector && node.querySelector('.noticias-container')) {
              console.log("Página de noticias detectada, configurando eventos...");
              setTimeout(() => {
                setupFilterEvents();
                loadNoticias(); // Cargar noticias iniciales
              }, 100);
            }
          }
        });
      }
    });
  });

  // Observar cambios en el contenido principal
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    observer.observe(mainContent, {
      childList: true,
      subtree: true
    });
    console.log("Observador de mutaciones configurado");
  }
}

// Evento para recargar al volver a la sección
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Verificar si estamos en la página de noticias
    const noticiasContainer = document.querySelector(".noticias-container");
    if (noticiasContainer) {
      loadNoticias();
    }
  }
});

// Configurar todo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  setupMutationObserver();
  
  // También configurar eventos si la página ya está cargada
  const noticiasContainer = document.querySelector(".noticias-container");
  if (noticiasContainer) {
    setupFilterEvents();
    loadNoticias();
  }
});

// Función global para ser llamada desde script.js
window.setupNoticiasEvents = function() {
  setupFilterEvents();
  loadNoticias();
};
