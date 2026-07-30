/**
 * Renderizador de Escenario
 * Dibuja los elementos del entorno como la Mina de Oro y las Bases de depósito.
 */

/**
 * Dibuja la mina de oro en el lienzo con el estilo premium detallado.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D
 * @param {Mina} mina - Instancia de la mina
 */
export function renderMina(ctx, mina) {
    const x = mina.x;
    const y = mina.y;
    const scale = 0.18;

    ctx.save();

    // 1. Sombra base de la piedra (del dibujo original)
    ctx.beginPath();
    ctx.ellipse(x, y - 40 * scale, 210 * scale, 40 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fill();

    // 2. Aplicar escala y traslación para dibujar el cuerpo de la roca y la runa de forma exacta
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-300, -520); // El bottom center de la roca original está en (300, 520)

    // Cuerpo base de la piedra (silueta irregular)
    ctx.beginPath();
    ctx.moveTo(290, 140);
    ctx.quadraticCurveTo(360, 160, 410, 210);
    ctx.quadraticCurveTo(480, 280, 500, 360);
    ctx.quadraticCurveTo(510, 430, 470, 470);
    ctx.quadraticCurveTo(400, 520, 300, 520);
    ctx.quadraticCurveTo(200, 510, 130, 450);
    ctx.quadraticCurveTo(90, 390, 100, 300);
    ctx.quadraticCurveTo(120, 220, 190, 170);
    ctx.quadraticCurveTo(240, 130, 290, 140);
    ctx.closePath();

    // Degradado radial para dar volumen 3D a la roca
    const gradRoca = ctx.createRadialGradient(280, 220, 50, 300, 350, 260);
    gradRoca.addColorStop(0, '#9e9182');   // Gris/Marrón claro iluminado
    gradRoca.addColorStop(0.5, '#786b5b'); // Tono medio
    gradRoca.addColorStop(1, '#473d32');   // Sombra oscura en bordes/base

    ctx.fillStyle = gradRoca;
    ctx.fill();

    // Bisel lateral izquierdo oscuro
    ctx.beginPath();
    ctx.moveTo(100, 300);
    ctx.quadraticCurveTo(140, 360, 130, 450);
    ctx.quadraticCurveTo(200, 510, 300, 520);
    ctx.quadraticCurveTo(220, 460, 160, 390);
    ctx.closePath();
    ctx.fillStyle = 'rgba(35, 28, 22, 0.4)';
    ctx.fill();

    // Faceta superior izquierda iluminada
    ctx.beginPath();
    ctx.moveTo(290, 140);
    ctx.quadraticCurveTo(240, 130, 190, 170);
    ctx.lineTo(240, 210);
    ctx.quadraticCurveTo(280, 180, 290, 140);
    ctx.closePath();
    ctx.fillStyle = 'rgba(215, 205, 190, 0.3)';
    ctx.fill();

    // Runa de Oro incrustada
    function dibujarRuna(c) {
        c.beginPath();
        // 1. Cabeza/Extremidad superior
        c.moveTo(290, 190);
        c.lineTo(320, 190);
        c.lineTo(340, 215);
        c.lineTo(370, 250);
        c.lineTo(360, 270);

        // 2. Brazo/Extremidad derecha
        c.lineTo(410, 230);
        c.lineTo(460, 250);
        c.lineTo(460, 280);
        c.lineTo(410, 290);
        c.lineTo(380, 310);

        // 3. Pierna/Pie inferior derecho
        c.lineTo(400, 345);
        c.lineTo(420, 355);
        c.lineTo(410, 385);
        c.lineTo(380, 420);
        c.lineTo(360, 425);
        c.lineTo(350, 385);
        c.lineTo(365, 360);

        // 4. Centro del cuerpo
        c.lineTo(330, 350);

        // 5. Pierna/Pie inferior izquierdo
        c.lineTo(290, 370);
        c.lineTo(260, 420);
        c.lineTo(230, 430);
        c.lineTo(220, 400);
        c.lineTo(250, 370);
        c.lineTo(265, 330);

        // 6. Brazo/Extremidad izquierda
        c.lineTo(220, 330);
        c.lineTo(180, 320);
        c.lineTo(170, 345);
        c.lineTo(160, 320);
        c.lineTo(180, 290);
        c.lineTo(160, 270);
        c.lineTo(180, 255);
        c.lineTo(200, 275);
        c.lineTo(220, 260);

        // 7. Torso superior e integración
        c.lineTo(240, 280);
        c.lineTo(260, 250);
        c.lineTo(240, 230);
        c.lineTo(250, 210);
        c.lineTo(275, 230);
        c.lineTo(290, 260);

        c.closePath();
    }

    // Sombra del bajorrelieve
    ctx.save();
    ctx.translate(3, 4);
    dibujarRuna(ctx);
    ctx.fillStyle = '#3a2707';
    ctx.fill();
    ctx.restore();

    // Relleno de la runa de Oro
    dibujarRuna(ctx);
    const gradOro = ctx.createLinearGradient(150, 200, 450, 400);
    gradOro.addColorStop(0, '#ffd83b');
    gradOro.addColorStop(0.3, '#fff486');
    gradOro.addColorStop(0.7, '#f0a30a');
    gradOro.addColorStop(1, '#b56d00');
    ctx.fillStyle = gradOro;
    ctx.fill();

    // Borde de bisel
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff8b3';
    ctx.stroke();

    ctx.restore();


}

/**
 * Dibuja la estructura base colonial de un bando.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D
 * @param {Base} base - Instancia de la base
 */
export function renderBase(ctx, base) {
    const x = base.x;
    const y = base.y;
    const esPatriota = base.bando === 'patriota';
    const scale = 0.28;

    ctx.save();

    if (esPatriota) {
        // --- 1. BASE PATRIOTA (Cabildo de Santa Cruz) ---
        const colorPared = '#f7f7f7';
        const colorSombra = '#e0e0e0';
        const colorVentana = '#2c3e50';
        const colorMarco = '#ffffff';
        const colorPuerta = '#bdc3c7';
        const colorEscalon = '#7f8c8d';
        const colorTejado = '#a04000';

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.translate(-400, -520); // El bottom center del Cabildo original está en (400, 520)

        // Línea minimalista del tejado
        ctx.fillStyle = colorTejado;
        ctx.fillRect(80, 95, 640, 10);

        // Fachada Principal (Cuerpo del edificio)
        ctx.fillStyle = colorPared;
        ctx.fillRect(100, 105, 600, 420);

        // Módulo o Torre Central Sobresaliente
        ctx.fillRect(350, 75, 100, 450);

        // Sombras sutiles del relieve central
        ctx.fillStyle = colorSombra;
        ctx.fillRect(345, 105, 5, 420);
        ctx.fillRect(450, 105, 5, 420);

        // Arquería Superior (Piso 4 - Galerías)
        ctx.fillStyle = colorVentana;
        // Lado Izquierdo
        ctx.beginPath(); ctx.arc(160, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(148, 135, 24, 20);
        ctx.beginPath(); ctx.arc(210, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(198, 135, 24, 20);
        ctx.beginPath(); ctx.arc(260, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(248, 135, 24, 20);
        ctx.beginPath(); ctx.arc(310, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(298, 135, 24, 20);
        // Lado Derecho
        ctx.beginPath(); ctx.arc(490, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(478, 135, 24, 20);
        ctx.beginPath(); ctx.arc(540, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(528, 135, 24, 20);
        ctx.beginPath(); ctx.arc(590, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(578, 135, 24, 20);
        ctx.beginPath(); ctx.arc(640, 135, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(628, 135, 24, 20);

        // Ventana Central Superior
        ctx.fillRect(380, 95, 40, 35);

        // Ventanas Piso 3
        // Bloque Izquierdo
        ctx.fillRect(140, 180, 35, 50);
        ctx.fillRect(210, 180, 35, 50);
        ctx.fillRect(280, 180, 35, 50);
        // Bloque Central
        ctx.fillRect(365, 180, 20, 50);
        ctx.fillRect(390, 180, 20, 50);
        ctx.fillRect(415, 180, 20, 50);
        // Bloque Derecho
        ctx.fillRect(485, 180, 35, 50);
        ctx.fillRect(555, 180, 35, 50);
        ctx.fillRect(625, 180, 35, 50);

        // Ventanas Piso 2
        // Bloque Izquierdo
        ctx.fillRect(140, 270, 35, 50);
        ctx.fillRect(210, 270, 35, 50);
        ctx.fillRect(280, 270, 35, 50);
        // Bloque Central
        ctx.fillRect(380, 270, 40, 50);
        // Bloque Derecho
        ctx.fillRect(485, 270, 35, 50);
        ctx.fillRect(555, 270, 35, 50);
        ctx.fillRect(625, 270, 35, 50);

        // Ventanas Piso 1
        // Bloque Izquierdo
        ctx.fillRect(135, 360, 45, 75);
        ctx.fillRect(205, 360, 45, 75);
        ctx.fillRect(275, 360, 45, 75);
        // Bloque Derecho
        ctx.fillRect(480, 360, 45, 75);
        ctx.fillRect(550, 360, 45, 75);
        ctx.fillRect(620, 360, 45, 75);

        // Portal y Puerta Principal
        ctx.fillStyle = colorMarco;
        ctx.fillRect(340, 340, 120, 135);
        ctx.fillStyle = colorPared;
        ctx.fillRect(348, 345, 104, 130);

        // Arco de la entrada
        ctx.fillStyle = colorVentana;
        ctx.beginPath();
        ctx.arc(400, 395, 40, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(360, 395, 80, 80);

        // Hojas de la puerta
        ctx.fillStyle = colorPuerta;
        ctx.fillRect(365, 405, 33, 70);
        ctx.fillRect(402, 405, 33, 70);

        // Escalinatas
        ctx.fillStyle = colorEscalon;
        ctx.fillRect(330, 475, 140, 10);
        ctx.fillRect(320, 485, 160, 10);
        ctx.fillRect(310, 495, 180, 10);
        ctx.fillRect(300, 505, 200, 15);

        ctx.restore();
    } else {
        // --- 2. BASE REALISTA (Casona Colonial Española) ---
        const colorPared = '#fffdfa';
        const colorTeja = '#b33928';
        const colorMadera = '#962d1d';
        const colorPaneles = '#7a2214';
        const colorReja = '#3a1e1a';
        const colorBorde = '#5c4838';

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.translate(-400, -470); // El bottom center de la Casona original está en (400, 470)

        // Tejados laterales de teja roja
        ctx.fillStyle = colorTeja;
        // Tejado izquierdo
        ctx.beginPath();
        ctx.moveTo(70, 240);
        ctx.lineTo(100, 180);
        ctx.lineTo(210, 180);
        ctx.lineTo(210, 240);
        ctx.closePath();
        ctx.fill();

        // Tejado derecho
        ctx.beginPath();
        ctx.moveTo(590, 240);
        ctx.lineTo(590, 180);
        ctx.lineTo(700, 180);
        ctx.lineTo(730, 240);
        ctx.closePath();
        ctx.fill();

        // Bloques superiores (Piso superior / Pretiles)
        ctx.fillStyle = colorPared;
        ctx.fillRect(180, 130, 170, 110); // Pretil izquierdo
        ctx.fillRect(450, 130, 170, 110); // Pretil derecho
        ctx.fillRect(330, 100, 140, 140); // Pretil central alto

        // Moldura curvada superior del centro
        ctx.beginPath();
        ctx.arc(400, 100, 45, Math.PI, 0);
        ctx.fillStyle = colorPared;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = colorBorde;
        ctx.stroke();

        // Cornisas horizontales superiores
        ctx.fillStyle = colorBorde;
        ctx.fillRect(175, 125, 180, 6);
        ctx.fillRect(445, 125, 180, 6);
        ctx.fillRect(325, 95, 150, 6);

        // Fachada Principal (Bloque bajo)
        ctx.fillStyle = colorPared;
        ctx.fillRect(90, 240, 620, 230);

        // Zócalo inferior
        ctx.fillStyle = '#e8e2d8';
        ctx.fillRect(90, 440, 620, 30);
        ctx.fillStyle = colorBorde;
        ctx.fillRect(90, 440, 620, 3);

        // Ventana Izquierda (Con arco y rejas)
        ctx.fillStyle = '#e0dad0';
        ctx.beginPath(); ctx.arc(220, 320, 45, Math.PI, 0); ctx.fill(); ctx.fillRect(175, 320, 90, 80);
        ctx.fillStyle = colorMadera;
        ctx.beginPath(); ctx.arc(220, 325, 38, Math.PI, 0); ctx.fill(); ctx.fillRect(182, 325, 76, 70);

        // Rejas verticales
        ctx.fillStyle = colorReja;
        ctx.fillRect(197, 300, 4, 95);
        ctx.fillRect(212, 290, 4, 105);
        ctx.fillRect(227, 290, 4, 105);
        ctx.fillRect(242, 300, 4, 95);

        // Repisa inferior
        ctx.fillStyle = colorBorde;
        ctx.fillRect(170, 395, 100, 8);

        // Ventana Derecha (Con arco y rejas)
        ctx.fillStyle = '#e0dad0';
        ctx.beginPath(); ctx.arc(580, 320, 45, Math.PI, 0); ctx.fill(); ctx.fillRect(535, 320, 90, 80);
        ctx.fillStyle = colorMadera;
        ctx.beginPath(); ctx.arc(580, 325, 38, Math.PI, 0); ctx.fill(); ctx.fillRect(542, 325, 76, 70);

        // Rejas verticales
        ctx.fillStyle = colorReja;
        ctx.fillRect(557, 300, 4, 95);
        ctx.fillRect(572, 290, 4, 105);
        ctx.fillRect(587, 290, 4, 105);
        ctx.fillRect(602, 300, 4, 95);

        // Repisa inferior
        ctx.fillStyle = colorBorde;
        ctx.fillRect(530, 395, 100, 8);

        // PORTÓN PRINCIPAL COMPLETAMENTE CERRADO
        // Marco exterior arqueado
        ctx.fillStyle = colorBorde;
        ctx.beginPath(); ctx.arc(400, 240, 68, Math.PI, 0); ctx.fill(); ctx.fillRect(332, 240, 136, 230);

        // Fondo base del portón
        ctx.fillStyle = colorMadera;
        ctx.beginPath(); ctx.arc(400, 243, 62, Math.PI, 0); ctx.fill(); ctx.fillRect(338, 243, 124, 227);

        // --- HOJA IZQUIERDA (CERRADA) ---
        ctx.fillStyle = colorPaneles;
        ctx.fillRect(346, 260, 48, 35);
        ctx.fillRect(346, 305, 48, 35);
        ctx.fillRect(346, 350, 48, 35);
        ctx.fillRect(346, 395, 48, 35);
        ctx.fillRect(346, 440, 48, 25);

        // --- HOJA DERECHA (CERRADA) ---
        ctx.fillStyle = colorPaneles;
        ctx.fillRect(406, 260, 48, 35);
        ctx.fillRect(406, 305, 48, 35);
        ctx.fillRect(406, 350, 48, 35);
        ctx.fillRect(406, 395, 48, 35);
        ctx.fillRect(406, 440, 48, 25);

        // Línea divisoria central del portón
        ctx.fillStyle = colorBorde;
        ctx.fillRect(398, 180, 4, 290);

        // Columnas Salomónicas
        // Columna Izquierda
        ctx.fillStyle = '#f0eae1';
        ctx.fillRect(300, 120, 30, 350);
        ctx.fillStyle = colorBorde;
        ctx.fillRect(295, 420, 40, 50); // Base
        ctx.fillRect(295, 115, 40, 10); // Capitel

        // Columna Derecha
        ctx.fillStyle = '#f0eae1';
        ctx.fillRect(470, 120, 30, 350);
        ctx.fillStyle = colorBorde;
        ctx.fillRect(465, 420, 40, 50); // Base
        ctx.fillRect(465, 115, 40, 10); // Capitel

        ctx.restore();
    }

    // --- 3. DIBUJAR LAS BANDERAS NACIONALES SOBRE LOS EDIFICIOS ---
    const flagBaseY = esPatriota ? (y - 125) : (y - 105);
    const flagTopY = flagBaseY - 35;
    const colorDetalle = esPatriota ? '#c5a059' : '#e0e0e0';

    ctx.strokeStyle = '#555';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, flagBaseY);
    ctx.lineTo(x, flagTopY);
    ctx.stroke();

    // Paño de bandera
    ctx.fillStyle = esPatriota ? '#256E29' : '#b22222'; // Azul/Verde Patriota / Rojo Realista
    ctx.fillRect(x, flagTopY, 25, 15);
    // Cruz o franja en la bandera
    ctx.fillStyle = colorDetalle;
    if (esPatriota) {
        ctx.fillRect(x, flagTopY + 6, 25, 3); // Franja dorada
    } else {
        // Cruz de Borgoña realista simplificada
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 2, flagTopY + 2);
        ctx.lineTo(x + 23, flagTopY + 13);
        ctx.moveTo(x + 2, flagTopY + 13);
        ctx.lineTo(x + 23, flagTopY + 2);
        ctx.stroke();
    }

    ctx.restore();

    // --- 4. BARRA DE SALUD DE LA BASE ---
    if (base.estado !== 'DESTROYED') {
        const barW = 80;
        const barH = 7;
        const barX = base.x - barW / 2;
        // La barra de salud se coloca por encima de las banderas
        const barY = esPatriota ? (y - 175) : (y - 155);

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

