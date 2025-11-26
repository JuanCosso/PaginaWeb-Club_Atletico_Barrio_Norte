function initSlider() {
    console.log("Inicializando slider");

    const slider = document.querySelector("#slider ul");
    const slides = document.querySelectorAll("#slider li");

    if (!slider) {
        console.error("No se encontró el contenedor del slider (#slider ul)");
        return;
    }
    if (slides.length === 0) {
        console.error("No se encontraron slides dentro del slider");
        return;
    }

    let currentIndex = 0;
    const slideCount = slides.length;

    //Cambia la cantidad de slides
    slider.style.width = `${slideCount * (100/slideCount)}%`;

    // Ajustar el ancho de cada slide
    slides.forEach((slide) => {
        slide.style.width = `${100 / slideCount}%`;
    });

    function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        slider.style.transition = "transform 0.5s ease-in-out";
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount; // Cicla entre las imágenes
        showSlide(currentIndex);
    }

    // Movimiento automático cada 10 segundos
    setInterval(nextSlide, 10000);

    // Mostrar el primer slide al cargar
    showSlide(currentIndex);
}

// Inicialización al cargar la página por primera vez
document.addEventListener("DOMContentLoaded", initSlider);

// Exponer la función para cargas dinámicas
window.initSlider = initSlider;
