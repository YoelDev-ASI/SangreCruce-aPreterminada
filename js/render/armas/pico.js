/**
 * Módulo de Dibujo: Pico de Minar
 * Exporta la función para renderizar el pico en la mano del Minero.
 */
export function dibujarPico(ctx, x, y, angulo, escala = 1, bando = 'patriota') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    ctx.scale(escala, escala);

    // =========================================================================
    // [DISEÑO DE TU PICO EN CANVAS]
    // Coloca aquí tus líneas de código para dibujar el pico de minado.
    // El punto de origen (0, 0) representa el centro de la mano del personaje.
    // Puedes usar variables de Canvas como ctx.beginPath(), ctx.lineTo(), etc.
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    // Mango de madera
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, -20);
    ctx.stroke();

    // Cabeza de metal
    ctx.strokeStyle = '#708090';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -20, 10, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    // =========================================================================

    ctx.restore();
}
