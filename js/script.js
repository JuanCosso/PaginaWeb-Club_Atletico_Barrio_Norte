// Detecta cambio en el historial (botón atrás/adelante)
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page) {
    fetch(event.state.page + ".html")
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("main-content").innerHTML = html;
      });
  }
});

// Al cargar la página: verifica si hay hash en la URL
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "");
  const defaultPage = hash || "inicio";
  loadPage(defaultPage); // Carga la página inicial
});

// Cargar la sección de inicio por defecto al cargar la página
window.onload = function () {
  loadPage("inicio"); // Al cargar la página, muestra la sección "Inicio"
};

// Carga una sección HTML dentro de #main-content
async function loadPage(page) {
  try {
    const request = await fetch(page + ".html");
    const htmlPage = await request.text();

    if (htmlPage) {
      document.getElementById("main-content").innerHTML = htmlPage;
      history.pushState({ page: page }, "", "#" + page); // actualiza URL con hash

        // Inicializar sliders del museo si corresponde
      if (page === "museo") {
        if (window.initMuseumSliders) {
            initMuseumSliders();
        }
      }
      // Ejecutar funciones específicas según la página cargada
      if (page === "inicio" || page === "futbol" || page === "futbol_fem" || page === "futbol_inferiores" || page=== "futbol_infantiles") {  
        ordenarTabla(); // Ordenar la tabla de posiciones
        loadUltimasNoticias(); // Cargar las últimas noticias
        // **Reinicializar el slider** tras insertar el HTML
        if (window.initSlider) {
          window.initSlider();
        }
      }
    }

    if (page === "noticias") {
      // Usar setTimeout para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        if (window.setupNoticiasEvents) {
          window.setupNoticiasEvents();
        } else {
          loadNoticias();
        }
      }, 100);
    }
  } catch (error) {
    document.getElementById("main-content").innerHTML =
      "<p>Error al cargar la sección.</p>";
    console.error(error);
  }
}

function ordenarTabla() {
  // Selecciona TODAS las tablas
  const tablas = document.querySelectorAll(".tabla-clasificacion tbody");

  tablas.forEach((tabla) => {
    const filas = Array.from(tabla.rows);

    filas.sort((a, b) => {
      const puntosA = parseInt(a.cells[3]?.textContent || "0", 10); // Pts
      const puntosB = parseInt(b.cells[3]?.textContent || "0", 10);
      const dgA = parseInt(a.cells[8]?.textContent || "0", 10); // DG (columna 8)
      const dgB = parseInt(b.cells[8]?.textContent || "0", 10);
      const pgA = parseInt(a.cells[5]?.textContent || "0", 10); // PG (columna 5)
      const pgB = parseInt(b.cells[5]?.textContent || "0", 10);

      if (puntosB !== puntosA) return puntosB - puntosA;
      if (dgB !== dgA) return dgB - dgA;
      return pgB - pgA;
    });

    filas.forEach((fila, index) => {
      const posicionCell = fila.querySelector(".posicion");
      if (posicionCell) {
        posicionCell.textContent = index + 1;
        
        // Actualizar clases de posición para la tabla del Petit Torneo
        const tablaWrapper = tabla.closest('.tabla-clasificacion-wrapper');
        if (tablaWrapper && tablaWrapper.id === 'petit-torneo') {
          // Remover todas las clases de posición
          posicionCell.classList.remove('top1', 'top3', 'mid3');
          
          // Agregar clase top1 solo a la primera posición
          if (index === 0) {
            posicionCell.classList.add('top1');
          }
        }
      }
      tabla.appendChild(fila); // Reinserta en la tabla actual
    });
  });
}
