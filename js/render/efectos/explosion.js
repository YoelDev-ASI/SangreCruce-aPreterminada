/**
 * Módulo de Partículas: Destellos de Impacto / Explosiones
 * Genera chispas brillantes cuando un proyectil da en el blanco.
 */

/**
 * Crea un conjunto de chispas/destellos rápidos.
 * @param {number} x - Coordenada X del impacto
 * @param {number} y - Coordenada Y del impacto
 * @returns {Array} - Colección de objetos de partículas
 */
export function crearExplosion(x, y) {
    const particulas = [];
    const cantidad = 5 + Math.round(Math.random() * 5);

    for (let i = 0; i < cantidad; i++) {
        // Angulo de dispersión completo
        const angulo = Math.random() * Math.PI * 2;
        const fuerza = 80 + Math.random() * 120;

        particulas.push({
            x: x,
            y: y - 30, // Centro del objetivo
            vx: Math.cos(angulo) * fuerza,
            vy: Math.sin(angulo) * fuerza,
            gravedad: 100, // Cae muy levemente
            size: Math.random() * 2.5 + 1.5,
            life: 0,
            maxLife: 0.2 + Math.random() * 0.25, // Muy rápida
            tipo: 'explosion'
        });
    }

    return particulas;
}

/**
 * Dibuja una partícula de destello en el Canvas.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} p 
 */
export function dibujarParticulaExplosion(ctx, p) {
    ctx.save();

    const opacidad = 1 - (p.life / p.maxLife);
    ctx.globalAlpha = opacidad;

    // =========================================================================
    // [DISEÑO DE TU PARTÍCULA DE DESTELLO]
    // Coloca aquí tus líneas de código para dibujar las chispas de pólvora/impacto.
    // Tienes disponibles: p.x, p.y, p.size.
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    // Destello de fuego (núcleo blanco, contorno amarillo/naranja)
    ctx.fillStyle = '#ffea00'; // Amarillo
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size + 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff'; // Centro brillante
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    // =========================================================================

    ctx.restore();
}
