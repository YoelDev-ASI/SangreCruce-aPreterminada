/**
 * esqueletoRealista.js
 * 
 * Renderizador de esqueleto articulado (Fase Stickman Animado) para el bando Realista.
 * Dibuja el personaje usando cinemática directa (hombros, codos, caderas, rodillas)
 * y expone un callback para acoplar el arma directamente en su mano delantera.
 * 
 * Basado en la estructura de esqueletoPatriota.js pero con orientación invertida (dir = -1)
 * para que mire y camine hacia la izquierda.
 */
export function dibujarEsqueletoRealista(ctx, personaje, colorCuerpo, callbackArma) {
    ctx.save();
    
    // Origen de coordenadas: base del personaje (pies)
    ctx.translate(personaje.x, personaje.y);
    
    // Los realistas avanzan hacia la izquierda por defecto (esPatriota = false, dir = -1)
    const dir = -1;
    ctx.scale(0.18 * dir, 0.18); 

    const posX = 0;
    let posY = -265; // Suelo Y en la animación (pies a Y = 0)

    let tiempo = personaje.tiempoAnimacion;
    
    // Caminando solo si está en movimiento activo hacia su destino
    let estaCaminando = false;
    if (personaje.estado === 'CAMINANDO') {
        const distanciaDestino = Math.abs(personaje.destinoX - personaje.x);
        if (distanciaDestino > 5) {
            estaCaminando = true;
        }
    } else if (['CAMINANDO_A_MINA', 'REGRESANDO_A_BASE'].includes(personaje.estado)) {
        estaCaminando = true;
    }

    const estadoAnimacion = estaCaminando ? 'caminar' : 'idle';

    let anguloHombroIzq = 0, anguloCodoIzq = 0;
    let anguloHombroDer = 0, anguloCodoDer = 0;
    let anguloCaderaIzq = 0, anguloRodillaIzq = 0;
    let anguloCaderaDer = 0, anguloRodillaDer = 0;

    if (estadoAnimacion === 'caminar') {
        // Marcha acelerada y fluida
        const ciclo = Math.sin(tiempo * 5.5);
        posY += Math.abs(Math.sin(tiempo * 11)) * 8; // Rebote vertical

        // Piernas (Movimiento cruzado)
        anguloCaderaIzq = ciclo * 0.7;
        anguloRodillaIzq = (ciclo < 0) ? -ciclo * 0.8 : 0.1;

        anguloCaderaDer = -ciclo * 0.7;
        anguloRodillaDer = (ciclo > 0) ? ciclo * 0.8 : 0.1;

        // Brazos
        anguloHombroIzq = -ciclo * 0.6;
        anguloCodoIzq = -0.8 + Math.sin(tiempo * 4.5) * 0.6;

        anguloHombroDer = ciclo * 0.6;
        anguloCodoDer = -0.8 - Math.sin(tiempo * 4.5) * 0.6;
    } else {
        // Reposo (Idle) / Respiración
        posY += Math.sin(tiempo * 2) * 2;

        anguloHombroIzq = 0.1; anguloCodoIzq = 0.2;
        anguloHombroDer = -0.1; anguloCodoDer = 0.2;
        anguloCaderaIzq = 0.1; anguloRodillaIzq = 0.05;
        anguloCaderaDer = -0.1; anguloRodillaDer = 0.05;
    }

    // Posturas especiales si está combatiendo/minando
    const estaEnAccion = personaje.estado === 'ATACANDO' || personaje.estado === 'MINANDO';
    if (estaEnAccion) {
        // Piernas fijas en guardia
        anguloCaderaIzq = 0.3; anguloRodillaIzq = 0.2;
        anguloCaderaDer = -0.3; anguloRodillaDer = 0.2;

        // Brazo trasero protegiendo
        anguloHombroIzq = 0.4; anguloCodoIzq = -0.8;

        // Brazo delantero realizando la acción física
        if (personaje.tipo === 'miliciano') {
            // Ataque rápido de machete
            anguloHombroDer = -0.6 + Math.sin(tiempo * 12) * 0.4;
            anguloCodoDer = -0.4 + Math.cos(tiempo * 12) * 0.3;
        } else if (personaje.tipo === 'minero') {
            // Picado rítmico en la mina
            anguloHombroDer = -0.4 + Math.sin(tiempo * 8) * 0.5;
            anguloCodoDer = -0.6 + Math.cos(tiempo * 8) * 0.4;
        } else if (personaje.tipo === 'fusilero') {
            // Apuntar fusil horizontalmente al frente
            anguloHombroDer = -1.2;
            anguloCodoDer = -0.8;
        }
    }

    const largoBrazo1 = 50, largoBrazo2 = 45;
    const largoPierna1 = 60, largoPierna2 = 55;
    const grosorExtremidad = 22;

    // Helper interno para dibujar tramos articulados
    function dibujarMiembro(x, y, ang1, lg1, ang2, lg2, grosor, color, esPie, callback) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang1);

        // 1. Tramo Superior
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, lg1);
        ctx.strokeStyle = color;
        ctx.lineWidth = grosor;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Ir a la articulación
        ctx.translate(0, lg1);
        ctx.rotate(ang2);

        // 2. Tramo Inferior
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, lg2);
        ctx.stroke();

        // 3. Mano o Pie
        ctx.translate(0, lg2);
        if (esPie) {
            ctx.beginPath();
            ctx.ellipse(8, 0, grosor / 1.2, grosor / 1.8, 0, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, grosor / 1.6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            // Dibujar arma en la mano
            if (callback) {
                callback(ctx);
            }
        }

        ctx.restore();
    }

    // 1. EXTREMIDADES TRASERAS (LADO IZQUIERDO)
    dibujarMiembro(
        posX + 5, posY + 50,
        anguloHombroIzq, largoBrazo1,
        anguloCodoIzq, largoBrazo2,
        grosorExtremidad - 2, colorCuerpo, false
    );

    dibujarMiembro(
        posX - 5, posY + 150,
        anguloCaderaIzq, largoPierna1,
        anguloRodillaIzq, largoPierna2,
        grosorExtremidad, colorCuerpo, true
    );

    // Dibujar saquito de oro en la espalda si tiene carga (solo para mineros)
    if (personaje.recursosCargando && personaje.recursosCargando > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // A la izquierda de la espalda (X negativo)
        ctx.arc(posX - 15, posY + 85, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    // 2. TORSO (con inclinación de movimiento)
    ctx.save();
    ctx.translate(posX, posY + 30);
    ctx.rotate(0.08);
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(12, 20);
    ctx.lineTo(8, 120);
    ctx.lineTo(-12, 120);
    ctx.lineTo(-14, 20);
    ctx.closePath();
    ctx.fillStyle = colorCuerpo;
    ctx.fill();
    ctx.restore();

    // 3. CABEZA
    ctx.beginPath();
    ctx.arc(posX + 4, posY - 5, 38, 0, Math.PI * 2);
    ctx.fillStyle = colorCuerpo;
    ctx.fill();

    // 4. EXTREMIDADES DELANTERAS (LADO DERECHO)
    dibujarMiembro(
        posX - 5, posY + 150,
        anguloCaderaDer, largoPierna1,
        anguloRodillaDer, largoPierna2,
        grosorExtremidad + 2, colorCuerpo, true
    );

    // Brazo Delantero acoplado con callback de arma
    dibujarMiembro(
        posX + 5, posY + 50,
        anguloHombroDer, largoBrazo1,
        anguloCodoDer, largoBrazo2,
        grosorExtremidad, colorCuerpo, false,
        callbackArma
    );

    ctx.restore();
}
