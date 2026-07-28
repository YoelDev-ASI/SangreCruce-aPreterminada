/**
 * Renderizador de Escenario
 * Dibuja los elementos del entorno como la Mina de Oro y las Bases de depósito.
 */

/**
 * Dibuja la mina de oro en el lienzo.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D
 * @param {Mina} mina - Instancia de la mina
 */
export function renderMina(ctx, mina) {
    ctx.save();

    const x = mina.x;
    const y = mina.y;

    // 1. Dibujar cuerpo rocoso de la mina (Polígono irregular)
    ctx.fillStyle = '#4a4a5a'; // Roca gris oscuro
    ctx.strokeStyle = '#2d2d3a';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x - 50, y);
    ctx.quadraticCurveTo(x - 40, y - 45, x - 10, y - 50);
    ctx.lineTo(x + 10, y - 50);
    ctx.quadraticCurveTo(x + 40, y - 45, x + 50, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dibujar algunas rocas menores al costado para darle detalle
    ctx.fillStyle = '#5c5c6d';
    ctx.beginPath();
    ctx.arc(x - 45, y, 12, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 45, y, 10, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Dibujar betas de oro brillantes (Polígonos dorados)
    ctx.fillStyle = '#ffd700'; // Oro brillante (Dorado)
    ctx.beginPath();
    ctx.moveTo(x - 20, y - 25);
    ctx.lineTo(x - 10, y - 35);
    ctx.lineTo(x - 5, y - 20);
    ctx.lineTo(x - 15, y - 15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 10, y - 15);
    ctx.lineTo(x + 25, y - 30);
    ctx.lineTo(x + 30, y - 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - 5, y - 40);
    ctx.lineTo(x + 5, y - 45);
    ctx.lineTo(x, y - 30);
    ctx.closePath();
    ctx.fill();

    // Añadir destellos de luz (Pequeños círculos blancos sobre el oro)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 12, y - 24, 2, 0, Math.PI * 2);
    ctx.arc(x + 18, y - 18, 2, 0, Math.PI * 2);
    ctx.arc(x, y - 38, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. Etiqueta de la mina
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("MINA DE ORO", x, y - 62);

    ctx.restore();
}

/**
 * Dibuja la estructura base de un bando.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D
 * @param {Base} base - Instancia de la base
 */
export function renderBase(ctx, base) {
    ctx.save();

    const x = base.x;
    const y = base.y;

    // Colores según el bando (Patriotas: Azul/Madera, Realistas: Rojo/Piedra)
    const esPatriota = base.bando === 'patriota';
    const colorPrimario = esPatriota ? '#1a3c5c' : '#7a2222';
    const colorDetalle = esPatriota ? '#c5a059' : '#e0e0e0';

    // 1. Dibujar estructura (Tipo torre/fortaleza colonial simplificada)
    ctx.fillStyle = '#3a3a44'; // Cimientos de piedra
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.fillRect(x - 50, y - 100, 100, 100);
    ctx.strokeRect(x - 50, y - 100, 100, 100);

    // Techo colonial / Almenas
    ctx.fillStyle = colorPrimario;
    ctx.beginPath();
    ctx.moveTo(x - 60, y - 100);
    ctx.lineTo(x, y - 130);
    ctx.lineTo(x + 60, y - 100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bandera en la parte superior
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y - 130);
    ctx.lineTo(x, y - 165);
    ctx.stroke();

    // Paño de bandera
    ctx.fillStyle = esPatriota ? '#0d59a3' : '#b22222'; // Azul Patriota / Rojo Realista
    ctx.fillRect(x, y - 165, 25, 15);
    // Cruz o franja en la bandera
    ctx.fillStyle = colorDetalle;
    if (esPatriota) {
        ctx.fillRect(x, y - 158, 25, 3); // Franja dorada
    } else {
        // Cruz de Borgoña realista simplificada
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 2, y - 163);
        ctx.lineTo(x + 23, y - 152);
        ctx.moveTo(x + 2, y - 152);
        ctx.lineTo(x + 23, y - 163);
        ctx.stroke();
    }

    // Puerta de la base
    ctx.fillStyle = '#4a2f13'; // Madera oscura
    ctx.fillRect(x - 20, y - 40, 40, 40);
    ctx.strokeRect(x - 20, y - 40, 40, 40);

    ctx.restore();

    // 2. Barra de salud de la base
    if (base.estado !== 'DESTROYED') {
        const barW = 80;
        const barH = 7;
        const barX = base.x - barW / 2;
        const barY = y - 118;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(barX, barY, barW, barH);

        const vidaRatio = base.hp / base.maxHp;
        ctx.fillStyle = vidaRatio > 0.4 ? '#00ff66' : '#ff3333';
        ctx.fillRect(barX, barY, barW * vidaRatio, barH);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(barX, barY, barW, barH);
    }
}
