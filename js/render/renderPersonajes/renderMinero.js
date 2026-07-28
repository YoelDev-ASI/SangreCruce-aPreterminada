import { dibujarPico } from '../armas/pico.js';

/**
 * Renderizador de Minero (Fase 7 - Esqueleto de Gráficos)
 * Prepara el lienzo, el sentido de mirada y los datos del minero.
 * Proporciona un bloque libre para que diseñes el personaje en Canvas.
 */
export function renderMinero(ctx, minero) {
    ctx.save();

    // 1. Calcular opacidad de muerte (Desvanecimiento)
    let opacidad = 1.0;
    if (minero.estado === 'MUERTO') {
        opacidad = 1.0 - (minero.tiempoMuerte / minero.tiempoDesaparicion);
        if (opacidad < 0) opacidad = 0;
    }
    ctx.globalAlpha = opacidad;

    // Colores sugeridos según el bando
    const esPatriota = minero.bando === 'patriota';
    const colorCuerpo = esPatriota ? '#0d59a3' : '#b22222';
    const colorDetalle = esPatriota ? '#c5a059' : '#ffffff';

    const posX = minero.x - minero.ancho / 2;
    const posY = minero.y - minero.alto;

    // 2. Rotar el lienzo si está muerto (Efecto de caída)
    if (minero.estado === 'MUERTO') {
        ctx.translate(minero.x, minero.y);
        ctx.rotate(esPatriota ? -Math.PI / 2 : Math.PI / 2);
        ctx.translate(-minero.x, -minero.y);
    }

    // =========================================================================
    // [DISEÑO DE TU MINERO EN CANVAS]
    // Coloca aquí tus líneas de código para dibujar el cuerpo del Minero.
    // Tienes disponibles las siguientes variables de apoyo:
    // - minero.x, minero.y : Coordenadas lógicas de la base (los pies) de la unidad.
    // - posX, posY : Coordenadas superiores izquierdas de la caja limitadora (AABB).
    // - colorCuerpo : Color representativo del bando ('#0d59a3' o '#b22222').
    // - colorDetalle : Color secundario ('#c5a059' o '#ffffff').
    // - esPatriota : true si es del ejército cruceño, false si es realista español.
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    ctx.fillStyle = colorCuerpo;
    ctx.fillRect(posX, posY, minero.ancho, minero.alto);
    ctx.strokeStyle = colorDetalle;
    ctx.lineWidth = 2;
    ctx.strokeRect(posX, posY, minero.ancho, minero.alto);
    // =========================================================================

    // 3. Dibujar saquito de oro en la espalda si tiene carga (Fase 3)
    if (minero.recursosCargando > 0 && minero.estado !== 'MUERTO') {
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 1.5;
        const sacoOffset = esPatriota ? -12 : 12;
        ctx.beginPath();
        ctx.arc(minero.x + sacoOffset, posY + 40, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // 4. Dibujar pico de minar en su mano (Fase 3 & 7)
    if (minero.estado !== 'MUERTO') {
        const manoX = minero.x + (esPatriota ? 8 : -8);
        const manoY = posY + 35;
        dibujarPico(ctx, manoX, manoY, minero.anguloPico, 1, minero.bando);
    }

    ctx.restore();

    // 5. Dibujar la barra de salud sobre el minero (Fuera de rotaciones de muerte)
    if (minero.estado !== 'MUERTO') {
        const barW = 32;
        const barH = 5;
        const barX = minero.x - barW / 2;
        const barY = posY - 12;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(barX, barY, barW, barH);

        const vidaRatio = minero.hp / minero.maxHp;
        ctx.fillStyle = vidaRatio > 0.4 ? '#00ff66' : '#ff3333';
        ctx.fillRect(barX, barY, barW * vidaRatio, barH);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);
    }

    // 6. Dibujar barra de progreso de minado si está picando
    if (minero.estado === 'MINANDO' && minero.estado !== 'MUERTO') {
        const progW = 40;
        const progH = 6;
        const progX = minero.x - progW / 2;
        const progY = posY - 23;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(progX, progY, progW, progH);

        const progRatio = minero.tiempoMinadoAcumulado / minero.tiempoMinadoMax;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(progX + 1, progY + 1, (progW - 2) * progRatio, progH - 2);

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1;
        ctx.strokeRect(progX, progY, progW, progH);
    }

    // 7. Dibujar texto flotante de depósito (+10 Oro)
    if (minero.textoFlotanteTimer > 0) {
        ctx.save();
        const ratio = minero.textoFlotanteTimer / 1.2;
        ctx.globalAlpha = ratio;
        const subida = (1.2 - minero.textoFlotanteTimer) * 45;
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 15px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(minero.textoFlotante, minero.x, posY - 20 - subida);
        ctx.restore();
    }
}
