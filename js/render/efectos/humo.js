/**
 * Módulo de Partículas: Efecto de Humo de Pólvora
 * Genera y dibuja nubes de humo al disparar fusiles o cañones.
 */

/**
 * Crea un conjunto de partículas físicas de humo.
 * @param {number} x - Coordenada X del disparo (punta del fusil)
 * @param {number} y - Coordenada Y del disparo
 * @param {number} dir - Dirección del disparo (1: derecha, -1: izquierda)
 * @returns {Array} - Colección de objetos de partículas
 */
export function crearHumo(x, y, dir = 1) {
    const particulas = [];
    const cantidad = 4 + Math.round(Math.random() * 3);

    for (let i = 0; i < cantidad; i++) {
        particulas.push({
            x: x,
            y: y,
            vx: dir * (30 + Math.random() * 40),   // Avanza en el sentido del tiro
            vy: -15 - Math.random() * 25,          // Flota lentamente hacia arriba
            gravedad: -10,                         // Flotabilidad invertida (sube levemente)
            size: Math.random() * 4 + 3,           // Tamaño inicial chico
            sizeMax: Math.random() * 12 + 10,      // Tamaño final (se expande)
            life: 0,
            maxLife: 0.8 + Math.random() * 0.6,
            tipo: 'humo'
        });
    }

    return particulas;
}

/**
 * Dibuja una partícula individual de humo en el Canvas.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D
 * @param {Object} p - Instancia de la partícula
 */
export function dibujarParticulaHumo(ctx, p) {
    ctx.save();

    const progreso = p.life / p.maxLife;
    const opacidad = (1 - progreso) * 0.4; // Muy traslúcido
    ctx.globalAlpha = opacidad;

    // El humo se expande a medida que se disipa
    const radioActual = p.size + (p.sizeMax - p.size) * progreso;

    // =========================================================================
    // [DISEÑO DE TU PARTÍCULA DE HUMO]
    // Coloca aquí tus líneas de código para dibujar nubes de humo.
    // Tienes disponibles: p.x, p.y, radioActual (tamaño expandido).
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    ctx.fillStyle = '#cccccc'; // Humo gris claro
    ctx.beginPath();
    ctx.arc(p.x, p.y, radioActual, 0, Math.PI * 2);
    ctx.fill();
    // =========================================================================

    ctx.restore();
}
