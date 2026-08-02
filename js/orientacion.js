/**
 * orientacion.js
 * 
 * Lógica de detección y gestión de orientación para dispositivos móviles.
 * Bloquea el inicio/partida si el teléfono se encuentra en modo vertical (portrait),
 * pausando el juego y mostrando un overlay informativo. Al pasar a modo horizontal (landscape),
 * reanuda el juego y solicita pantalla completa (Fullscreen API).
 */

(function () {
    // 1. Detección de dispositivo móvil (Android, iPhone, iPad, iPod)
    const esDispositivoMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                               (navigator.maxTouchPoints > 0 && /Macintosh/i.test(navigator.userAgent));

    // Si no es un dispositivo móvil, el sistema no hace absolutamente nada
    if (!esDispositivoMovil) {
        console.log("[Orientación] Jugando desde computadora. Sistema inactivo.");
        return;
    }

    console.log("[Orientación] Dispositivo móvil detectado. Iniciando monitoreo de orientación.");

    // Elemento del DOM para el overlay de rotación
    let overlay = null;

    // Almacena el último estado de orientación para evitar bucles de eventos redundantes (especialmente en iOS Safari)
    let ultimoEstadoVertical = null;

    /**
     * Determina si el dispositivo está actualmente en modo vertical (portrait)
     */
    function esOrientacionVertical() {
        // Método moderno usando Screen Orientation API si está disponible
        if (window.screen && window.screen.orientation) {
            // Si la orientación física es vertical, es vertical.
            if (window.screen.orientation.type.startsWith("portrait")) {
                return true;
            }
            // Si la orientación física es horizontal, pero las dimensiones internas de la ventana
            // aún no se han redimensionado (el alto sigue siendo mayor o igual al ancho),
            // consideramos que el layout sigue temporalmente en vertical (modo de transición).
            if (window.screen.orientation.type.startsWith("landscape") && window.innerHeight >= window.innerWidth) {
                return true;
            }
        }
        // Fallback robusto comparando dimensiones reales de la ventana
        return window.innerHeight > window.innerWidth;
    }

    /**
     * Pausa el juego y muestra el overlay de orientación
     */
    function pausarPorOrientacion() {
        if (overlay) {
            overlay.style.display = "flex";
        }

        // Llamar a la función de pausa del juego en main.js (si ya está cargada)
        if (typeof window.pausarJuego === "function") {
            window.pausarJuego();
        } else {
            // Si el juego no ha cargado/iniciado todavía, marcamos que empiece pausado
            window.juegoDebeEmpezarPausado = true;
        }
    }

    /**
     * Reanuda el juego, oculta el overlay e intenta activar pantalla completa
     */
    function reanudarPorOrientacion() {
        if (overlay) {
            overlay.style.display = "none";
        }

        // Marcar la bandera para evitar pausas automáticas al iniciar
        window.juegoDebeEmpezarPausado = false;

        // Intentar reanudar el motor
        if (typeof window.reanudarJuego === "function") {
            window.reanudarJuego();
        }

        // Forzar scroll al tope para ocultar la barra de navegación del móvil
        window.scrollTo(0, 0);

        // Intentar entrar en pantalla completa automáticamente
        intentarEntrarPantallaCompleta();

        // Registrar siempre el fallback de gesto por si la activación automática falló o fue bloqueada
        registrarGestoPantallaCompleta();
    }

    /**
     * Verifica si la pantalla completa está activa en cualquier implementación
     */
    function estaEnPantallaCompleta() {
        return !!(document.fullscreenElement || 
                  document.webkitFullscreenElement || 
                  document.mozFullScreenElement || 
                  document.msFullscreenElement);
    }

    /**
     * Intenta iniciar el modo pantalla completa utilizando la Fullscreen API
     */
    function intentarEntrarPantallaCompleta() {
        if (estaEnPantallaCompleta()) return;

        const docEl = document.documentElement;
        const requestFS = docEl.requestFullscreen || 
                          docEl.webkitRequestFullscreen || 
                          docEl.mozRequestFullScreen || 
                          docEl.msRequestFullscreen;

        if (requestFS) {
            // Intentamos la activación automática protegiendo contra implementaciones antiguas que no retornan Promesa
            try {
                const promise = requestFS.call(docEl);
                if (promise && typeof promise.then === "function") {
                    promise
                        .then(() => {
                            console.log("[Orientación] Pantalla completa activada correctamente.");
                        })
                        .catch((err) => {
                            console.warn("[Orientación] Pantalla completa bloqueada automáticamente. Esperando toque del usuario.", err);
                            registrarGestoPantallaCompleta();
                        });
                } else {
                    console.log("[Orientación] Pantalla completa solicitada (sin promesa).");
                    registrarGestoPantallaCompleta();
                }
            } catch (err) {
                console.warn("[Orientación] Excepción al solicitar pantalla completa:", err);
                registrarGestoPantallaCompleta();
            }
        }
    }

    let gestoRegistrado = false;

    /**
     * Registra listeners de un único toque/click para solicitar pantalla completa en la primera interacción
     */
    function registrarGestoPantallaCompleta() {
        if (estaEnPantallaCompleta()) return;
        if (gestoRegistrado) return; // Evita añadir múltiples listeners duplicados
        gestoRegistrado = true;

        const activarFS = () => {
            gestoRegistrado = false;
            // Solo solicitar si seguimos en modo horizontal, el overlay no está activo y no está ya en fullscreen
            if (!esOrientacionVertical() && !estaEnPantallaCompleta()) {
                const docEl = document.documentElement;
                const requestFS = docEl.requestFullscreen || 
                                  docEl.webkitRequestFullscreen || 
                                  docEl.mozRequestFullScreen || 
                                  docEl.msRequestFullscreen;
                if (requestFS) {
                    try {
                        const promise = requestFS.call(docEl);
                        if (promise && typeof promise.catch === "function") {
                            promise.catch(err => console.log("[Orientación] Falla al entrar en pantalla completa por gesto:", err));
                        }
                    } catch (err) {
                        console.log("[Orientación] Excepción al entrar en pantalla completa por gesto:", err);
                    }
                }
            }
            // Remover inmediatamente los listeners para no interferir con el gameplay posterior
            document.removeEventListener("click", activarFS);
            document.removeEventListener("touchstart", activarFS);
        };

        document.addEventListener("click", activarFS);
        document.addEventListener("touchstart", activarFS);
    }

    /**
     * Evalúa la orientación actual y aplica los estados correspondientes
     */
    function evaluarOrientacion() {
        const esVertical = esOrientacionVertical();
        
        // Si no ha cambiado el estado de orientación, ignoramos el evento de redimensionado (evita bucles infinitos en iOS)
        if (esVertical === ultimoEstadoVertical) {
            return;
        }
        ultimoEstadoVertical = esVertical;

        if (esVertical) {
            console.log("[Orientación] Modo Vertical detectado. Pausando juego.");
            pausarPorOrientacion();
        } else {
            console.log("[Orientación] Modo Horizontal detectado. Reanudando juego.");
            reanudarPorOrientacion();
        }
    }


    // Inicialización al cargar el DOM
    window.addEventListener("DOMContentLoaded", () => {
        // Añadir clase para estilos móviles si corresponde
        if (esDispositivoMovil) {
            document.body.classList.add("dispositivo-movil");
        }
        overlay = document.getElementById("overlay-orientacion");

        // Mostrar tip de pantalla completa para iPhone/iPad si no está en modo autónomo (standalone)
        const esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                      (navigator.maxTouchPoints > 0 && /Macintosh/i.test(navigator.userAgent));
        const esStandalone = window.navigator.standalone === true;
        if (esIOS && !esStandalone) {
            const tipIphone = document.getElementById("tip-iphone");
            if (tipIphone) {
                tipIphone.style.display = "block";
            }
        }
        
        // Evaluar la orientación inicial de entrada
        evaluarOrientacion();
    });

    // Escuchar cambios de orientación mediante eventos modernos
    window.addEventListener("resize", evaluarOrientacion);
    window.addEventListener("orientationchange", evaluarOrientacion);

    if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener("change", evaluarOrientacion);
    }
})();
