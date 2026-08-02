/**
 * Módulo de Dibujo: Fusil Colonial
 * Exporta la función para renderizar el fusil/mosquete de chispa en la mano del Fusilero.
 */
export function dibujarFusil(ctx, x, y, angulo, escala = 1, bando = 'patriota') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    ctx.scale(escala, escala);

    // Si el bando es realista, miran a la izquierda, por lo que el fusil debe invertirse
    const dir = bando === 'patriota' ? 1 : -1;

    // =========================================================================
    // [DISEÑO DE TU FUSIL EN CANVAS]
    // Coloca aquí tus líneas de código para dibujar el fusil de mosquete.
    // El punto de origen (0, 0) representa el centro de la mano del personaje.
    // Recuerda que 'dir' (1 o -1) controla el sentido en el que apunta el arma.
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    // Culata y cuerpo
    ctx.strokeStyle = '#5c4033'; // Madera oscura
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-8 * dir, 2);
    ctx.lineTo(15 * dir, -2);
    ctx.stroke();

    // Cañón metálico largo
    ctx.strokeStyle = '#4e4e4e'; // Hierro
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(5 * dir, -2);
    ctx.lineTo(25 * dir, -2);
    ctx.stroke();
    // =========================================================================

    ctx.restore();
}
