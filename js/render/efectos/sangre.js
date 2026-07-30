/**
 * Módulo de Partículas: Efecto de Sangre
 * Genera y dibuja partículas rojas de salpicadura al recibir daño.
 */

/**
 * Crea un conjunto de partículas físicas de sangre.
 * @param {number} x - Coordenada X del impacto
 * @param {number} y - Coordenada Y del impacto
 * @returns {Array} - Colección de objetos de partículas
 */
export function crearSangre(x, y) {
    const particulas = [];
    const cantidad = 6 + Math.round(Math.random() * 6); // Entre 6 y 12 partículas

    for (let i = 0; i < cantidad; i++) {
        particulas.push({
            x: x,
            y: y - 30, // Centro del cuerpo aproximado
            vx: (Math.random() - 0.5) * 120, // Velocidad lateral aleatoria
            vy: -Math.random() * 160 - 40,   // Fuerza de eyección hacia arriba
            gravedad: 450,                   // Gravedad para formar parábolas
            size: Math.random() * 3.5 + 2,     // Tamaño aleatorio
            life: 0,
            maxLife: 0.5 + Math.random() * 0.4, // Segundos de vida
            tipo: 'sangre'
        });
    }

    return particulas;
}

/**
 * Dibuja una partícula individual de sangre en el Canvas.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D
 * @param {Object} p - Instancia de la partícula
 */
export function dibujarParticulaSangre(ctx, p) {
    ctx.save();

    // Calcular el desvanecimiento (opacidad baja con la edad de la partícula)
    const opacidad = 1 - (p.life / p.maxLife);
    ctx.globalAlpha = opacidad;

    // =========================================================================
    // [DISEÑO DE TU PARTÍCULA DE SANGRE]
    // Coloca aquí tus líneas de código Canvas para dibujar el efecto de sangre.
    // Tienes disponibles las propiedades de la partícula: p.x, p.y, p.size.
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    ctx.fillStyle = '#b30000'; // Rojo sangre oscuro
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    // =========================================================================

    ctx.restore();
}
