// Funcionalidad para la página de historia
document.addEventListener('DOMContentLoaded', function() {
    
    // Botón volver arriba
    const botonVolverArriba = document.getElementById('volver-arriba');
    
    // Mostrar/ocultar botón según el scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            botonVolverArriba.classList.add('visible');
        } else {
            botonVolverArriba.classList.remove('visible');
        }
    });
    
    // Funcionalidad del botón volver arriba
    botonVolverArriba.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Navegación suave para los enlaces del menú
    const enlacesMenu = document.querySelectorAll('.menu-lateral-items a');
    
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100; // Ajuste para el menú sticky
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto de resaltado en el menú según la sección visible
    const secciones = document.querySelectorAll('.seccion-historia[id]');
    const enlaces = document.querySelectorAll('.menu-lateral-items a');
    
    function resaltarEnlaceActivo() {
        let seccionActual = '';
        
        secciones.forEach(seccion => {
            const rect = seccion.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                seccionActual = seccion.getAttribute('id');
            }
        });
        
        enlaces.forEach(enlace => {
            enlace.classList.remove('activo');
            if (enlace.getAttribute('href') === '#' + seccionActual) {
                enlace.classList.add('activo');
            }
        });
    }
    
    window.addEventListener('scroll', resaltarEnlaceActivo);
    
    // Animación de entrada para las imágenes
    const imagenes = document.querySelectorAll('.imagen-flotante');
    
    const observerImagenes = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    imagenes.forEach(imagen => {
        imagen.style.opacity = '0';
        imagen.style.transform = 'translateY(30px)';
        imagen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observerImagenes.observe(imagen);
    });
    
    // Efecto parallax sutil para las imágenes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.imagen-flotante');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Tooltip para las imágenes
    imagenes.forEach(imagen => {
        const caption = imagen.querySelector('.caption');
        if (caption) {
            imagen.addEventListener('mouseenter', function() {
                caption.style.transform = 'translateY(0)';
            });
            
            imagen.addEventListener('mouseleave', function() {
                caption.style.transform = 'translateY(100%)';
            });
        }
    });
    
    // Efecto de carga progresiva para las imágenes
    function cargarImagenes() {
        const imagenes = document.querySelectorAll('.imagen-flotante img');
        
        imagenes.forEach(img => {
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
            }
        });
    }
    
    // Inicializar carga de imágenes
    cargarImagenes();
    
    // Efecto de escritura para los títulos
    const titulos = document.querySelectorAll('.texto-principal h2');
    
    const observerTitulos = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('titulo-animado');
            }
        });
    }, {
        threshold: 0.5
    });
    
    titulos.forEach(titulo => {
        observerTitulos.observe(titulo);
    });
    
    // Contador de años para la sección de fundación
    function animarContador() {
        const añoFundacion = 1950;
        const añoActual = new Date().getFullYear();
        const añosTranscurridos = añoActual - añoFundacion;
        
        // Crear elemento para mostrar los años
        const contadorElement = document.createElement('div');
        contadorElement.className = 'contador-anos';
        contadorElement.innerHTML = `
            <span class="numero">${añosTranscurridos}</span>
            <span class="texto">años de historia</span>
        `;
        
        // Insertar en la sección de fundación
        const seccionFundacion = document.querySelector('#fundacion .texto-principal');
        if (seccionFundacion) {
            seccionFundacion.appendChild(contadorElement);
        }
    }
    
    // Ejecutar contador
    animarContador();
    
    // Efecto de partículas de fondo (opcional)
    function crearParticulas() {
        const container = document.querySelector('.historia-container');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particula = document.createElement('div');
            particula.className = 'particula';
            particula.style.left = Math.random() * 100 + '%';
            particula.style.animationDelay = Math.random() * 20 + 's';
            particula.style.animationDuration = (Math.random() * 10 + 10) + 's';
            container.appendChild(particula);
        }
    }
    
    // Crear partículas si se desea
    // crearParticulas();
});

// Estilos adicionales para efectos especiales
const estilosAdicionales = `
    .menu-lateral-items a.activo {
        background: #D32F2F !important;
        color: white !important;
        border-left-color: #D32F2F !important;
        box-shadow: inset 4px 0 0 #fff !important;
    }
    
    .titulo-animado {
        animation: escribirTitulo 1.5s ease-out;
    }
    
    @keyframes escribirTitulo {
        0% {
            opacity: 0;
            transform: translateX(-50px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .contador-anos {
        text-align: center;
        margin-top: 2rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .contador-anos .numero {
        display: block;
        font-size: 3rem;
        font-weight: bold;
        color: #D32F2F;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .contador-anos .texto {
        font-size: 1.2rem;
        color: #666;
        font-style: italic;
    }
    
    .particula {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(102, 126, 234, 0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: flotar linear infinite;
    }
    
    @keyframes flotar {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = estilosAdicionales;
document.head.appendChild(styleSheet); 