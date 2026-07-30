import { dibujarEspada } from '../armas/espada.js';

/**
 * Renderizador de Miliciano (Fase 7 - Esqueleto de Gráficos)
 * Prepara el lienzo, el sentido de mirada y la opacidad.
 * Proporciona un bloque libre para que diseñes el personaje en Canvas.
 */
export function renderMiliciano(ctx, miliciano) {
    ctx.save();

    // 1. Calcular opacidad de muerte (Desvanecimiento)
    let opacidad = 1.0;
    if (miliciano.estado === 'MUERTO') {
        opacidad = 1.0 - (miliciano.tiempoMuerte / miliciano.tiempoDesaparicion);
        if (opacidad < 0) opacidad = 0;
    }
    ctx.globalAlpha = opacidad;

    // Colores sugeridos según el bando
    const esPatriota = miliciano.bando === 'patriota';
    const colorCuerpo = esPatriota ? '#00796b' : '#d84315'; // Verde patriota / Naranja realista
    const colorDetalle = esPatriota ? '#c5a059' : '#ffffff';

    const posX = miliciano.x - miliciano.ancho / 2;
    const posY = miliciano.y - miliciano.alto;

    // 2. Rotar el lienzo si está muerto (Efecto de caída)
    if (miliciano.estado === 'MUERTO') {
        ctx.translate(miliciano.x, miliciano.y);
        ctx.rotate(esPatriota ? -Math.PI / 2 : Math.PI / 2);
        ctx.translate(-miliciano.x, -miliciano.y);
    }

    // =========================================================================
    // [DISEÑO DE TU MILICIANO EN CANVAS]
    // Coloca aquí tus líneas de código para dibujar el cuerpo del Miliciano.
    // Tienes disponibles las siguientes variables de apoyo:
    // - miliciano.x, miliciano.y : Coordenadas lógicas de la base (los pies) de la unidad.
    // - posX, posY : Coordenadas superiores izquierdas de la caja limitadora.
    // - colorCuerpo : Color representativo del bando ('#00796b' o '#d84315').
    // - colorDetalle : Color secundario ('#c5a059' o '#ffffff').
    // - esPatriota : true si es del ejército cruceño, false si es realista español.
    // =========================================================================

    // --- DIBUJO TEMPORAL DE REFERENCIA (Sustitúyelo por tu propio diseño) ---
    ctx.fillStyle = colorCuerpo;
    ctx.fillRect(posX, posY, miliciano.ancho, miliciano.alto);
    ctx.strokeStyle = colorDetalle;
    ctx.lineWidth = 2;
    ctx.strokeRect(posX, posY, miliciano.ancho, miliciano.alto);
    // =========================================================================

    // 3. Dibujar sable/espada en su mano (Fase 7)
    if (miliciano.estado !== 'MUERTO') {
        const dir = esPatriota ? 1 : -1;
        const manoX = miliciano.x + (6 * dir);
        const manoY = posY + 35;
        
        // Animar la rotación del sable al atacar para simular el espadazo
        let anguloSable = 0;
        if (miliciano.estado === 'ATACANDO') {
            // El sable oscila rápidamente al golpear
            anguloSable = (Math.sin(Date.now() * 0.02) * 1.2) - (0.5 * dir);
        }

        dibujarEspada(ctx, manoX, manoY, anguloSable, 1, miliciano.bando);
    }

    ctx.restore();

    // 4. Dibujar la barra de salud (Fuera de rotaciones de muerte)
    if (miliciano.estado !== 'MUERTO') {
        const barW = 32;
        const barH = 5;
        const barX = miliciano.x - barW / 2;
        const barY = posY - 12;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(barX, barY, barW, barH);

        const vidaRatio = miliciano.hp / miliciano.maxHp;
        ctx.fillStyle = vidaRatio > 0.4 ? '#00ff66' : '#ff3333';
        ctx.fillRect(barX, barY, barW * vidaRatio, barH);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);
    }
}
