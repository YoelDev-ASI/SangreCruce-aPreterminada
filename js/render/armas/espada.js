/**
 * Módulo de Dibujo: Espada / Machete / Sable
 * Exporta la función para renderizar la espada de combate en la mano del Miliciano o del General.
 */
export function dibujarEspada(ctx, x, y, angulo, escala = 1, bando = 'patriota') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    ctx.scale(escala, escala);

    const dir = bando === 'patriota' ? 1 : -1;

    // =========================================================================
    // [DISEÑO DE TU ESPADA/SABLE EN CANVAS]
    // Coloca aquí tus líneas de código para dibujar la espada, sable o machete.
    // El punto de origen (0, 0) representa el mango (mano del personaje).
    // Puedes usar la variable 'dir' (1 o -1) si requieres orientar la hoja.
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    // Empuñadura
    ctx.strokeStyle = '#c5a059'; // Guardamano dorado
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(0, -5);
    ctx.stroke();

    ctx.fillStyle = '#c5a059';
    ctx.beginPath();
    ctx.arc(0, 5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Hoja del sable metálica
    ctx.strokeStyle = '#d9d9d9'; // Acero
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.quadraticCurveTo(8 * dir, -12, 12 * dir, -26); // Hoja curva de sable colonial
    ctx.stroke();
    // =========================================================================

    ctx.restore();
}
