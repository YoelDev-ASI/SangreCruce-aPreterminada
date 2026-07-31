import { dibujarFusil } from '../armas/fusil.js';
import { dibujarEsqueletoPatriota } from './esqueletoPatriota.js';

/**
 * Renderizador de Fusilero (Fase 7 - Esqueleto de Gráficos)
 * Prepara el lienzo, el sentido de mirada y la opacidad.
 * Proporciona un bloque libre para que diseñes el personaje en Canvas.
 */
export function renderFusilero(ctx, fusilero) {
    ctx.save();

    // Guardar la matriz base (espacio del mundo translated por cámara) para el trazador de disparo
    const baseMatrix = ctx.getTransform();

    // 1. Calcular opacidad de muerte (Desvanecimiento)
    let opacidad = 1.0;
    if (fusilero.estado === 'MUERTO') {
        opacidad = 1.0 - (fusilero.tiempoMuerte / fusilero.tiempoDesaparicion);
        if (opacidad < 0) opacidad = 0;
    }
    ctx.globalAlpha = opacidad;

    // Colores sugeridos según el bando
    const esPatriota = fusilero.bando === 'patriota';
    const colorCuerpo = esPatriota ? '#00796b' : '#d32f2f';
    const colorDetalle = esPatriota ? '#c5a059' : '#ffffff';

    const posX = fusilero.x - fusilero.ancho / 2;
    const posY = fusilero.y - fusilero.alto;

    // 2. Rotar el lienzo si está muerto (Efecto de caída)
    if (fusilero.estado === 'MUERTO') {
        ctx.translate(fusilero.x, fusilero.y);
        ctx.rotate(esPatriota ? -Math.PI / 2 : Math.PI / 2);
        ctx.translate(-fusilero.x, -fusilero.y);
    }

    if (esPatriota) {
        // Dibujo articulado con esqueleto patriota
        const dir = 1;
        const callbackArma = (c) => {
            let anguloFusil = -1.57; // Paralelo al cuerpo al marchar/reposo
            if (fusilero.estado === 'ATACANDO') {
                anguloFusil = -10.35; // Apuntando al frente
            }

            // Dibujar fusil
            dibujarFusil(c, 0, 0, anguloFusil, 5.55, fusilero.bando);

            // Destello de disparo y trazador
            if (fusilero.estado === 'ATACANDO' && fusilero.cooldownAtaque > (fusilero.cooldownAtaqueMax - 0.15)) {
                const puntaX = 25 * dir;
                const puntaY = -2;

                // Destello amarillo
                c.fillStyle = '#ffea00';
                c.beginPath();
                c.arc(puntaX, puntaY, 8, 0, Math.PI * 2);
                c.fill();

                c.strokeStyle = '#ff3d00';
                c.lineWidth = 1;
                c.stroke();

                // Trazador instantáneo usando transformación de matrices
                if (fusilero.objetivo) {
                    try {
                        const handMatrix = c.getTransform();
                        // 1. Proyectar el objetivo en coordenadas de pantalla
                        const screenTarget = baseMatrix.transformPoint(new DOMPoint(fusilero.objetivo.x, fusilero.objetivo.y - 30));
                        // 2. Desproyectar a coordenadas locales de la mano
                        const localTarget = handMatrix.inverse().transformPoint(screenTarget);

                        c.strokeStyle = 'rgba(255, 234, 0, 0.4)';
                        c.lineWidth = 2;
                        c.beginPath();
                        c.moveTo(puntaX, puntaY);
                        c.lineTo(localTarget.x, localTarget.y);
                        c.stroke();
                    } catch (e) {
                        console.error("Error drawing tracer:", e);
                    }
                }
            }
        };
        dibujarEsqueletoPatriota(ctx, fusilero, colorCuerpo, callbackArma);
    } else {
        // --- DIBUJO REALISTA ORIGINAL ---
        ctx.fillStyle = colorCuerpo;
        ctx.fillRect(posX, posY, fusilero.ancho, fusilero.alto);
        ctx.strokeStyle = colorDetalle;
        ctx.lineWidth = 2;
        ctx.strokeRect(posX, posY, fusilero.ancho, fusilero.alto);

        // 3. Dibujar fusil de mosquete en su mano (Fase 7)
        const dir = esPatriota ? 1 : -1;
        const manoX = fusilero.x + (5 * dir);
        const manoY = posY + 35;

        // El fusil rota levemente al marchar o apuntar (puedes enlazarlo a variables de animación)
        const anguloFusil = 0;
        dibujarFusil(ctx, manoX, manoY, anguloFusil, 1, fusilero.bando);

        // 4. Dibujar destello de disparo si acaba de atacar (Fase 2 & 7)
        if (fusilero.estado === 'ATACANDO' && fusilero.cooldownAtaque > (fusilero.cooldownAtaqueMax - 0.15)) {
            const fusilLargo = 25;
            const puntaX = manoX + (fusilLargo * dir);
            const puntaY = manoY - 2;

            ctx.fillStyle = '#ffea00';
            ctx.beginPath();
            ctx.arc(puntaX, puntaY, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ff3d00';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Trazador instantáneo hacia el objetivo
            if (fusilero.objetivo) {
                ctx.strokeStyle = 'rgba(255, 234, 0, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(puntaX, puntaY);
                ctx.lineTo(fusilero.objetivo.x, fusilero.objetivo.y - 30);
                ctx.stroke();
            }
        }
    }

    ctx.restore();

    // 5. Dibujar la barra de salud (Fuera de rotaciones de muerte)
    if (fusilero.estado !== 'MUERTO') {
        const barW = 32;
        const barH = 5;
        const barX = fusilero.x - barW / 2;
        const barY = posY - 12;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(barX, barY, barW, barH);

        const vidaRatio = fusilero.hp / fusilero.maxHp;
        ctx.fillStyle = vidaRatio > 0.4 ? '#00ff66' : '#ff3333';
        ctx.fillRect(barX, barY, barW * vidaRatio, barH);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);
    }
}
