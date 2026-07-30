/**
 * Renderizador de Fondos Históricos
 * Dibuja los fondos procedimentales para los distintos niveles de la campaña.
 */

// =========================================================================
// 1. NIVEL 1 & 5: REVOLUCIÓN DEL 24 DE SEPTIEMBRE / LIBERACIÓN FINAL
// =========================================================================
function dibujarFondo24DeSeptiembre(ctx, cameraX, viewH) {
    const WORLD_HEIGHT = 800;
    const scale = viewH / WORLD_HEIGHT; // 720 / 800 = 0.9
    const widthLogico = 1280;

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-cameraX, 0);

    // --- 1. CIELO AZUL CON NUBES ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 500);
    skyGrad.addColorStop(0, '#5b9bd5');   // Azul claro superior
    skyGrad.addColorStop(0.6, '#a4c2e6'); // Azul cielo horizonte
    skyGrad.addColorStop(1, '#d8e5f3');   // Iluminación baja
    ctx.fillStyle = skyGrad;
    ctx.fillRect(cameraX, 0, widthLogico / scale + 100, WORLD_HEIGHT);

    // Nubes dispersas en el cielo
    dibujarNubeSeptiembre(ctx, 300, 100);
    dibujarNubeSeptiembre(ctx, 800, 140);
    dibujarNubeSeptiembre(ctx, 1400, 90);
    dibujarNubeSeptiembre(ctx, 2000, 130);
    dibujarNubeSeptiembre(ctx, 2600, 110);
    dibujarNubeSeptiembre(ctx, 3100, 100);

    // --- 2. IGLESIA Y ÁRBOLES DE FONDO (LADO DERECHO) ---
    // Árboles verdes traseros
    ctx.fillStyle = '#2d5a27';
    ctx.beginPath(); ctx.arc(1750, 360, 80, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2250, 350, 90, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2350, 330, 70, 0, Math.PI * 2); ctx.fill();

    // Iglesia de Terracota (Sección 1700px a 2200px)
    const colorIglesia = '#b35a38';
    const colorTechoIglesia = '#803419';

    // Torre Izquierda
    ctx.fillStyle = colorIglesia;
    ctx.fillRect(1780, 180, 90, 240);
    ctx.beginPath();
    ctx.moveTo(1775, 180); ctx.lineTo(1825, 90); ctx.lineTo(1875, 180);
    ctx.fillStyle = colorTechoIglesia; ctx.fill();

    // Torre Derecha
    ctx.fillStyle = colorIglesia;
    ctx.fillRect(2050, 180, 90, 240);
    ctx.beginPath();
    ctx.moveTo(2045, 180); ctx.lineTo(2095, 90); ctx.lineTo(2145, 180);
    ctx.fillStyle = colorTechoIglesia; ctx.fill();

    // Cuerpo Central de la Iglesia
    ctx.fillStyle = colorIglesia;
    ctx.fillRect(1870, 240, 180, 180);
    ctx.beginPath();
    ctx.moveTo(1860, 240); ctx.lineTo(1960, 170); ctx.lineTo(2060, 240);
    ctx.fillStyle = colorTechoIglesia; ctx.fill();

    // Cruz Superior
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(1957, 130, 6, 40);
    ctx.fillRect(1945, 142, 30, 6);

    // Ventanales y portal
    ctx.fillStyle = '#4a2313';
    ctx.fillRect(1810, 210, 30, 50);
    ctx.fillRect(2080, 210, 30, 50);
    ctx.beginPath(); ctx.arc(1960, 300, 25, Math.PI, 0); ctx.fill(); ctx.fillRect(1935, 300, 50, 60);

    // --- 3. CASONA Y MURO FRONTAL CONTINUO (3500px) ---
    ctx.fillStyle = '#f4f0eb';
    ctx.fillRect(0, 380, 3500, 180); // Pared blanca

    ctx.fillStyle = '#b33226';
    ctx.fillRect(0, 510, 3500, 50);  // Zócalo rojo

    ctx.fillStyle = '#8c8278';
    ctx.fillRect(0, 555, 3500, 10);  // Base de piedra

    // Tejados de teja roja
    ctx.fillStyle = '#a0482b';
    ctx.fillRect(0, 360, 3500, 20);
    ctx.fillStyle = '#7a311a';
    ctx.fillRect(0, 375, 3500, 7);

    // Balcón / Piso Superior de la Casona (1000px a 1600px)
    ctx.fillStyle = '#f4f0eb';
    ctx.fillRect(1000, 240, 600, 120);
    ctx.fillStyle = '#8a3c22';
    ctx.fillRect(990, 220, 620, 25);

    // Estructura y barandilla de madera del balcón
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(1000, 310, 600, 10);
    ctx.fillRect(1000, 270, 600, 8);
    ctx.fillRect(1030, 278, 6, 32); ctx.fillRect(1080, 278, 6, 32);
    ctx.fillRect(1130, 278, 6, 32); ctx.fillRect(1180, 278, 6, 32);
    ctx.fillRect(1230, 278, 6, 32); ctx.fillRect(1280, 278, 6, 32);
    ctx.fillRect(1330, 278, 6, 32); ctx.fillRect(1380, 278, 6, 32);
    ctx.fillRect(1430, 278, 6, 32); ctx.fillRect(1480, 278, 6, 32);
    ctx.fillRect(1530, 278, 6, 32); ctx.fillRect(1580, 278, 6, 32);

    // Puertas del Balcón
    ctx.fillStyle = '#3b2211';
    ctx.fillRect(1050, 245, 35, 65);
    ctx.fillRect(1200, 245, 35, 65);
    ctx.fillRect(1350, 245, 35, 65);
    ctx.fillRect(1500, 245, 35, 65);

    // --- PUERTAS PRINCIPALES DE LA FACHADA ---
    ctx.fillStyle = '#4a2c17';
    ctx.fillRect(100, 420, 50, 90);   // Puerta 1
    ctx.fillRect(450, 410, 70, 100);  // Puerta 2
    ctx.fillRect(1250, 410, 70, 100); // Puerta 3
    ctx.fillRect(2500, 410, 70, 100); // Puerta 4
    ctx.fillRect(3050, 410, 70, 100); // Puerta 5 (Espacio extendido)
    ctx.fillRect(850, 450, 40, 30);   // Ventanita central

    // --- 4. FLORES Y ARBUSTOS DE BUGAMBILIA ---
    ctx.fillStyle = '#d81b60';
    ctx.beginPath(); ctx.arc(950, 330, 45, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1000, 310, 55, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1060, 320, 50, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1110, 350, 40, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(980, 370, 40, 0, Math.PI * 2); ctx.fill();

    // Árbol de Bugambilia (Lado Derecho)
    ctx.fillStyle = '#3a2211';
    ctx.fillRect(2180, 460, 15, 100);
    ctx.fillStyle = '#c2185b';
    ctx.beginPath(); ctx.arc(2180, 420, 70, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2240, 430, 60, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2130, 430, 50, 0, Math.PI * 2); ctx.fill();

    // --- 5. DETALLES: GUITARRA Y CÁNTAROS ---
    ctx.fillStyle = '#a6593f';
    ctx.beginPath(); ctx.arc(380, 500, 15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2600, 500, 15, 0, Math.PI * 2); ctx.fill();

    // Guitarra recostada
    ctx.fillStyle = '#d97724';
    ctx.beginPath(); ctx.arc(760, 495, 14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(760, 475, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(758, 440, 4, 30);

    // --- 6. PAVIMENTO DE ADOQUINES / CALLE (3500px) ---
    ctx.fillStyle = '#c8b496';
    ctx.fillRect(0, 565, 3500, 235);

    ctx.fillStyle = '#a89476';
    ctx.fillRect(50, 600, 200, 15); ctx.fillRect(300, 600, 200, 15);
    ctx.fillRect(600, 600, 200, 15); ctx.fillRect(900, 600, 200, 15);
    ctx.fillRect(1200, 600, 200, 15); ctx.fillRect(1500, 600, 200, 15);
    ctx.fillRect(1800, 600, 200, 15); ctx.fillRect(2100, 600, 200, 15);
    ctx.fillRect(2400, 600, 200, 15); ctx.fillRect(2700, 600, 200, 15);
    ctx.fillRect(3000, 600, 200, 15); ctx.fillRect(3300, 600, 200, 15); // Adoquines extendidos

    ctx.fillRect(150, 660, 200, 20); ctx.fillRect(450, 660, 200, 20);
    ctx.fillRect(750, 660, 200, 20); ctx.fillRect(1050, 660, 200, 20);
    ctx.fillRect(1350, 660, 200, 20); ctx.fillRect(1650, 660, 200, 20);
    ctx.fillRect(1950, 660, 200, 20); ctx.fillRect(2250, 660, 200, 20);
    ctx.fillRect(2550, 660, 200, 20); ctx.fillRect(2850, 660, 200, 20);
    ctx.fillRect(3150, 660, 200, 20); ctx.fillRect(3450, 660, 50, 20); // Adoquines extendidos

    ctx.restore();
}

function dibujarNubeSeptiembre(ctx, x, y) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y - 10, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y + 10, 20, 0, Math.PI * 2);
    ctx.fill();
}

// =========================================================================
// 2. NIVEL 2: BATALLA DE LA FLORIDA
// =========================================================================
function dibujarFondoBatallaFlorida(ctx, cameraX, viewH) {
    const width = 1280;
    const height = viewH;

    // 1. CIELO DE DÍA
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#3a88e9');   // Azul intenso superior
    skyGrad.addColorStop(0.55, '#87ceeb'); // Azul claro horizonte
    skyGrad.addColorStop(1, '#cbe8f6');    // Tono suave bajo
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. SOL ELEVADO (Parallax 0.4)
    const sunWorldX = 1100 - (cameraX * 0.4);
    const sunY = height * 0.28;
    const sunRadius = 110;

    // Resplandor del Sol
    ctx.beginPath();
    ctx.arc(sunWorldX, sunY, sunRadius + 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 180, 0.35)';
    ctx.fill();

    // Sol Amarillo
    ctx.beginPath();
    ctx.arc(sunWorldX, sunY, sunRadius, 0, Math.PI * 2);
    const sunGrad = ctx.createRadialGradient(sunWorldX, sunY, 10, sunWorldX, sunY, sunRadius);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#ffeb3b');
    sunGrad.addColorStop(1, '#fbc02d');
    ctx.fillStyle = sunGrad;
    ctx.fill();

    // 3. NUBES FLOTANTES (Parallax 0.3)
    dibujarNubeFlorida(ctx, 400 - cameraX * 0.3, height * 0.18, 90);
    dibujarNubeFlorida(ctx, 1200 - cameraX * 0.3, height * 0.12, 120);
    dibujarNubeFlorida(ctx, 2200 - cameraX * 0.3, height * 0.15, 100);

    // 4. MONTAÑAS LEJANAS (Parallax muy lento: 0.15)
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.45);
    ctx.lineTo(300 - cameraX * 0.15, height * 0.32);
    ctx.lineTo(650 - cameraX * 0.15, height * 0.42);
    ctx.lineTo(1000 - cameraX * 0.15, height * 0.28);
    ctx.lineTo(1400 - cameraX * 0.15, height * 0.40);
    ctx.lineTo(1850 - cameraX * 0.15, height * 0.25);
    ctx.lineTo(2300 - cameraX * 0.15, height * 0.38);
    ctx.lineTo(2750 - cameraX * 0.15, height * 0.29);
    ctx.lineTo(3200 - cameraX * 0.15, height * 0.45);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#0F4D18';
    ctx.fill();

    // Segunda capa de picos (Parallax 0.2)
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.50);
    ctx.lineTo(200 - cameraX * 0.2, height * 0.38);
    ctx.lineTo(500 - cameraX * 0.2, height * 0.48);
    ctx.lineTo(850 - cameraX * 0.2, height * 0.35);
    ctx.lineTo(1250 - cameraX * 0.2, height * 0.46);
    ctx.lineTo(1600 - cameraX * 0.2, height * 0.33);
    ctx.lineTo(2050 - cameraX * 0.2, height * 0.47);
    ctx.lineTo(2500 - cameraX * 0.2, height * 0.36);
    ctx.lineTo(3000 - cameraX * 0.2, height * 0.48);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#155C1F';
    ctx.fill();

    // 5. COLINA TRASERA (Verde oscuro, scrolls 1:1 con la cámara)
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.52);
    ctx.quadraticCurveTo(600 - cameraX, height * 0.48, 1200 - cameraX, height * 0.53);
    ctx.quadraticCurveTo(1800 - cameraX, height * 0.58, 2400 - cameraX, height * 0.50);
    ctx.quadraticCurveTo(2800 - cameraX, height * 0.46, 3200 - cameraX, height * 0.54);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#1b5e20';
    ctx.fill();

    // Hierba en la colina trasera
    dibujarBrotesHierba(ctx, 150 - cameraX, height * 0.51, '#2e7d32');
    dibujarBrotesHierba(ctx, 750 - cameraX, height * 0.50, '#2e7d32');
    dibujarBrotesHierba(ctx, 1450 - cameraX, height * 0.55, '#2e7d32');
    dibujarBrotesHierba(ctx, 2150 - cameraX, height * 0.51, '#2e7d32');

    // 6. COLINA FRONTAL PRINCIPAL
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.58);
    ctx.quadraticCurveTo(500 - cameraX, height * 0.65, 1000 - cameraX, height * 0.58);
    ctx.quadraticCurveTo(1600 - cameraX, height * 0.50, 2200 - cameraX, height * 0.62);
    ctx.quadraticCurveTo(2700 - cameraX, height * 0.70, 3200 - cameraX, height * 0.56);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#388e3c';
    ctx.fill();

    // Capa de pradera frontal
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.62);
    ctx.quadraticCurveTo(600 - cameraX, height * 0.72, 1300 - cameraX, height * 0.61);
    ctx.quadraticCurveTo(2000 - cameraX, height * 0.53, 3200 - cameraX, height * 0.66);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#4caf50';
    ctx.fill();

    // Mechones de pasto en primer plano
    dibujarMechonesPasto(ctx, 100 - cameraX, height * 0.62);
    dibujarMechonesPasto(ctx, 450 - cameraX, height * 0.67);
    dibujarMechonesPasto(ctx, 850 - cameraX, height * 0.61);
    dibujarMechonesPasto(ctx, 1350 - cameraX, height * 0.58);
    dibujarMechonesPasto(ctx, 1900 - cameraX, height * 0.55);
    dibujarMechonesPasto(ctx, 2400 - cameraX, height * 0.64);
    dibujarMechonesPasto(ctx, 2850 - cameraX, height * 0.60);
}

function dibujarNubeFlorida(ctx, x, y, scale) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(x, y, scale * 0.3, 0, Math.PI * 2);
    ctx.arc(x + scale * 0.25, y - scale * 0.1, scale * 0.25, 0, Math.PI * 2);
    ctx.arc(x + scale * 0.5, y, scale * 0.28, 0, Math.PI * 2);
    ctx.arc(x + scale * 0.25, y + scale * 0.08, scale * 0.2, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarBrotesHierba(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8, y - 18);
    ctx.lineTo(x + 2, y);
    ctx.lineTo(x + 8, y - 24);
    ctx.lineTo(x + 10, y);
    ctx.lineTo(x + 18, y - 15);
    ctx.lineTo(x + 16, y);
    ctx.fill();
}

function dibujarMechonesPasto(ctx, x, y) {
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - 15, y - 30, x - 25, y - 35);
    ctx.quadraticCurveTo(x - 10, y - 15, x - 5, y);
    ctx.quadraticCurveTo(x, y - 40, x + 2, y - 45);
    ctx.quadraticCurveTo(x + 8, y - 20, x + 10, y);
    ctx.quadraticCurveTo(x + 25, y - 35, x + 35, y - 30);
    ctx.quadraticCurveTo(x + 18, y - 10, x + 15, y);
    ctx.fill();
}

// =========================================================================
// 3. NIVEL 3: BATALLA DE SANTA BÁRBARA
// =========================================================================
function dibujarFondoBatallaSantaBarbara(ctx, cameraX, viewH) {
    const width = 1280;
    const height = viewH;

    // 1. CIELO DE DÍA (Degradado Azul Diurno)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#3a88e9');   // Azul intenso superior
    skyGrad.addColorStop(0.55, '#87ceeb'); // Azul claro horizonte
    skyGrad.addColorStop(1, '#cbe8f6');    // Tono suave bajo
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. SOL PARCIALMENTE OCULTO (Parallax 0.4)
    const sunWorldX = 1100 - (cameraX * 0.4);
    const sunY = height * 0.28;
    const sunRadius = 140;

    // Resplandor del Sol
    ctx.beginPath();
    ctx.arc(sunWorldX, sunY, sunRadius + 25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 180, 0.35)';
    ctx.fill();

    // Sol Amarillo
    ctx.beginPath();
    ctx.arc(sunWorldX, sunY, sunRadius, 0, Math.PI * 2);
    const sunGrad = ctx.createRadialGradient(sunWorldX, sunY, 10, sunWorldX, sunY, sunRadius);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#ffeb3b');
    sunGrad.addColorStop(1, '#fbc02d');
    ctx.fillStyle = sunGrad;
    ctx.fill();

    // NUBES
    dibujarNubeFlorida(ctx, 400 - cameraX * 0.3, height * 0.25, 90);
    dibujarNubeFlorida(ctx, 1200 - cameraX * 0.3, height * 0.18, 120);
    dibujarNubeFlorida(ctx, 2200 - cameraX * 0.3, height * 0.22, 100);

    // 3. COLINA TRASERA (Verde Oscuro, scrolls 1:1)
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.52);
    ctx.quadraticCurveTo(600 - cameraX, height * 0.48, 1200 - cameraX, height * 0.53);
    ctx.quadraticCurveTo(1800 - cameraX, height * 0.58, 2400 - cameraX, height * 0.50);
    ctx.quadraticCurveTo(2800 - cameraX, height * 0.46, 3200 - cameraX, height * 0.54);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#1b5e20';
    ctx.fill();

    // Detalles de hierba alta en colina trasera
    dibujarBrotesHierba(ctx, 150 - cameraX, height * 0.51, '#2e7d32');
    dibujarBrotesHierba(ctx, 750 - cameraX, height * 0.50, '#2e7d32');
    dibujarBrotesHierba(ctx, 1450 - cameraX, height * 0.55, '#2e7d32');
    dibujarBrotesHierba(ctx, 2150 - cameraX, height * 0.51, '#2e7d32');

    // 4. COLINA FRONTAL PRINCIPAL
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.58);
    ctx.quadraticCurveTo(500 - cameraX, height * 0.65, 1000 - cameraX, height * 0.58);
    ctx.quadraticCurveTo(1600 - cameraX, height * 0.50, 2200 - cameraX, height * 0.62);
    ctx.quadraticCurveTo(2700 - cameraX, height * 0.70, 3200 - cameraX, height * 0.56);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#388e3c';
    ctx.fill();

    // Capa de pradera frontal
    ctx.beginPath();
    ctx.moveTo(0 - 100, height);
    ctx.lineTo(0 - 100, height * 0.62);
    ctx.quadraticCurveTo(600 - cameraX, height * 0.72, 1300 - cameraX, height * 0.61);
    ctx.quadraticCurveTo(2000 - cameraX, height * 0.53, 3200 - cameraX, height * 0.66);
    ctx.lineTo(width + 100, height);
    ctx.closePath();
    ctx.fillStyle = '#4caf50';
    ctx.fill();

    // Mechones de pasto en primer plano
    dibujarMechonesPasto(ctx, 100 - cameraX, height * 0.62);
    dibujarMechonesPasto(ctx, 450 - cameraX, height * 0.67);
    dibujarMechonesPasto(ctx, 850 - cameraX, height * 0.61);
    dibujarMechonesPasto(ctx, 1350 - cameraX, height * 0.58);
    dibujarMechonesPasto(ctx, 1900 - cameraX, height * 0.55);
    dibujarMechonesPasto(ctx, 2400 - cameraX, height * 0.64);
    dibujarMechonesPasto(ctx, 2850 - cameraX, height * 0.60);
}

// =========================================================================
// 5. NIVEL 4: BATALLA DEL PARI
// =========================================================================
function dibujarFondoBatallaDelPari(ctx, cameraX, viewH) {
    const WORLD_HEIGHT = 800;
    const scale = viewH / WORLD_HEIGHT; // 720 / 800 = 0.9
    const widthLogico = 1280;

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-cameraX, 0);

    // --- 1. CIELO AZUL DIURNO Y NUBES ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 450);
    skyGrad.addColorStop(0, '#2b80d9');   // Azul vívido superior
    skyGrad.addColorStop(0.6, '#6eb0f2'); // Azul claro
    skyGrad.addColorStop(1, '#bde0fe');   // Iluminación bajo el horizonte
    ctx.fillStyle = skyGrad;
    ctx.fillRect(cameraX, 0, widthLogico / scale + 100, WORLD_HEIGHT);

    // Nubes esponjosas dispersas
    dibujarNubePari(ctx, 250, 90, 1.2);
    dibujarNubePari(ctx, 750, 130, 0.9);
    dibujarNubePari(ctx, 1300, 80, 1.4);
    dibujarNubePari(ctx, 1850, 110, 1.1);
    dibujarNubePari(ctx, 2450, 95, 1.3);
    dibujarNubePari(ctx, 3050, 100, 1.2); // Nube adicional

    // --- 2. ARBOLEDA Y VEGETACIÓN TRASERA ---
    ctx.fillStyle = '#2d6a36'; // Verde follaje denso
    ctx.beginPath(); ctx.arc(150, 260, 120, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(280, 240, 140, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1050, 310, 80, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1150, 300, 90, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2050, 300, 95, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2170, 290, 110, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2800, 280, 130, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3100, 280, 120, 0, Math.PI * 2); ctx.fill(); // Árbol adicional
    ctx.beginPath(); ctx.arc(3250, 270, 100, 0, Math.PI * 2); ctx.fill(); // Árbol adicional

    // --- 3. ESTRUCTURA DE CASAS COLONIALES ---
    // Paredes blancas continuas
    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(0, 360, 600, 200);      // Módulo Casona Izquierda Grande
    ctx.fillRect(600, 390, 1200, 170);   // Módulo Central Bajo
    ctx.fillRect(1800, 360, 1700, 200);  // Módulo Casona Derecha (Extendido)

    // Zócalo rojo terracota
    ctx.fillStyle = '#b53a2b';
    ctx.fillRect(0, 510, 3500, 50);

    // Zócalo de piedra base
    ctx.fillStyle = '#b89d82';
    ctx.fillRect(1000, 480, 500, 30);
    ctx.fillStyle = '#8f745b';
    ctx.fillRect(1000, 505, 500, 5);

    // --- 4. TEJADOS DE TEJA ROJA ---
    ctx.fillStyle = '#bd462b';
    ctx.fillRect(-10, 335, 630, 30);      // Tejado Izquierdo Alto
    ctx.fillRect(590, 365, 1230, 30);     // Tejado Central Bajo
    ctx.fillRect(1790, 335, 1720, 30);    // Tejado Derecho Alto (Extendido)

    // Sombra bajo las tejas
    ctx.fillStyle = '#6e2414';
    ctx.fillRect(-10, 360, 630, 6);
    ctx.fillRect(590, 390, 1230, 6);
    ctx.fillRect(1790, 360, 1720, 6); // Sombra tejado extendido

    // --- 5. PUERTAS Y VENTANAS ---
    dibujarPuertaArqueadaPari(ctx, 300, 400, 90, 160, '#66321b'); // Casona Izq
    dibujarPuertaArqueadaPari(ctx, 820, 430, 75, 130, '#592915'); // Centro 1
    dibujarPuertaArqueadaPari(ctx, 1600, 430, 80, 130, '#592915'); // Centro 2
    dibujarPuertaArqueadaPari(ctx, 2850, 400, 90, 160, '#66321b'); // Casona Der
    dibujarPuertaArqueadaPari(ctx, 3350, 400, 90, 160, '#66321b'); // Puerta Casona Der (Adicional)

    // Puerta rectangular principal
    ctx.fillStyle = '#7a6452'; // Marco piedra
    ctx.fillRect(1200, 400, 150, 160);
    ctx.fillStyle = '#542916'; // Madera puerta
    ctx.fillRect(1212, 412, 60, 148);
    ctx.fillRect(1278, 412, 60, 148);
    ctx.fillStyle = '#f0c15d'; // Manijas doradas
    ctx.fillRect(1266, 480, 4, 12);
    ctx.fillRect(1272, 480, 4, 12);

    // Ventanas con rejas
    dibujarVentanaRejasPari(ctx, 120, 410, 90, 80);
    dibujarVentanaRejasPari(ctx, 960, 440, 60, 60);
    dibujarVentanaRejasPari(ctx, 1410, 440, 60, 60);
    dibujarVentanaRejasPari(ctx, 2600, 410, 90, 80);
    dibujarVentanaRejasPari(ctx, 3150, 410, 90, 80); // Ventana Casona Der (Adicional)

    // --- 6. FLORES DE BUGAMBILIA ---
    // Enredadera Bugambilia Izquierda
    ctx.fillStyle = '#4a2817'; // Tronco
    ctx.fillRect(260, 350, 16, 210);
    ctx.fillStyle = '#d81b60'; // Fucsia
    ctx.beginPath(); ctx.arc(100, 270, 70, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(180, 250, 80, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(260, 280, 75, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(320, 330, 60, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(370, 390, 50, 0, Math.PI * 2); ctx.fill();

    // Flores moradas en pérgolas (Centro)
    ctx.fillStyle = '#4a2817'; // Tronco
    ctx.fillRect(800, 350, 16, 210);
    ctx.fillStyle = '#9c27b0'; // Morado
    ctx.beginPath(); ctx.arc(800, 380, 45, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(850, 360, 50, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(910, 390, 40, 0, Math.PI * 2); ctx.fill();

    // Bugambilia Derecha
    ctx.fillStyle = '#4a2817'; // Tronco
    ctx.fillRect(2380, 440, 16, 120);
    ctx.fillStyle = '#d81b60'; // Fucsia
    ctx.beginPath(); ctx.arc(2380, 390, 60, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2430, 400, 50, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2330, 410, 45, 0, Math.PI * 2); ctx.fill();

    // --- 7. MACETAS ---
    dibujarMacetaPari(ctx, 50, 520, 35, 40);
    dibujarMacetaPari(ctx, 720, 520, 30, 35);
    dibujarMacetaPari(ctx, 1850, 520, 30, 35);
    dibujarMacetaPari(ctx, 2500, 520, 35, 40);
    dibujarMacetaPari(ctx, 3100, 520, 35, 40); // Maceta adicional

    // --- 8. SUELO Y ADOQUINES ---
    ctx.fillStyle = '#d6c4aa';
    ctx.fillRect(0, 560, 3500, 240); // Suelo base claro (Extendido)

    // Sombra de edificios en la calle
    ctx.fillStyle = 'rgba(74, 58, 43, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.lineTo(3500, 560);
    ctx.lineTo(3500, 660);
    ctx.lineTo(0, 710);
    ctx.closePath();
    ctx.fill();

    // Adoquines detallados
    ctx.fillStyle = '#b3a087';
    // Fila 1
    ctx.fillRect(100, 600, 140, 20); ctx.fillRect(350, 600, 140, 20);
    ctx.fillRect(600, 600, 140, 20); ctx.fillRect(850, 600, 140, 20);
    ctx.fillRect(1100, 600, 140, 20); ctx.fillRect(1350, 600, 140, 20);
    ctx.fillRect(1600, 600, 140, 20); ctx.fillRect(1850, 600, 140, 20);
    ctx.fillRect(2100, 600, 140, 20); ctx.fillRect(2350, 600, 140, 20);
    ctx.fillRect(2600, 600, 140, 20); ctx.fillRect(2850, 600, 140, 20);
    ctx.fillRect(3100, 600, 140, 20); ctx.fillRect(3350, 600, 140, 20); // Adoquines adicionales

    // Fila 2
    ctx.fillRect(200, 660, 160, 25); ctx.fillRect(500, 660, 160, 25);
    ctx.fillRect(800, 660, 160, 25); ctx.fillRect(1100, 660, 160, 25);
    ctx.fillRect(1400, 660, 160, 25); ctx.fillRect(1700, 660, 160, 25);
    ctx.fillRect(2000, 660, 160, 25); ctx.fillRect(2300, 660, 160, 25);
    ctx.fillRect(2600, 660, 160, 25); ctx.fillRect(2900, 660, 160, 25);
    ctx.fillRect(3200, 660, 160, 25); // Adoquines adicionales

    // Fila 3
    ctx.fillRect(80, 730, 200, 30); ctx.fillRect(400, 730, 200, 30);
    ctx.fillRect(720, 730, 200, 30); ctx.fillRect(1040, 730, 200, 30);
    ctx.fillRect(1360, 730, 200, 30); ctx.fillRect(1680, 730, 200, 30);
    ctx.fillRect(2000, 730, 200, 30); ctx.fillRect(2320, 730, 200, 30);
    ctx.fillRect(2640, 730, 200, 30); ctx.fillRect(2960, 730, 200, 30);
    ctx.fillRect(3280, 730, 200, 30); // Adoquines adicionales

    ctx.restore();
}

function dibujarNubePari(ctx, x, y, scale) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 35 * scale, 0, Math.PI * 2);
    ctx.arc(x + 30 * scale, y - 12 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 60 * scale, y, 35 * scale, 0, Math.PI * 2);
    ctx.arc(x + 30 * scale, y + 12 * scale, 25 * scale, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarPuertaArqueadaPari(ctx, x, y, width, height, color) {
    const radius = width / 2;
    ctx.fillStyle = '#b53a2b'; // Marco exterior
    ctx.beginPath();
    ctx.arc(x + radius, y + radius - 6, radius + 6, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x - 6, y + radius - 6, width + 12, height - radius + 6);

    ctx.fillStyle = color; // Madera interior
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x, y + radius, width, height - radius);
}

function dibujarVentanaRejasPari(ctx, x, y, w, h) {
    ctx.fillStyle = '#b53a2b';
    ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
    ctx.fillStyle = '#3a2016';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#1f130e';
    ctx.fillRect(x + w * 0.25, y, 4, h);
    ctx.fillRect(x + w * 0.50, y, 4, h);
    ctx.fillRect(x + w * 0.75, y, 4, h);
    ctx.fillRect(x, y + h * 0.5, w, 4);
}

function dibujarMacetaPari(ctx, x, y, w, h) {
    ctx.fillStyle = '#2e7d32'; // Planta
    ctx.beginPath();
    ctx.arc(x + w / 2, y - 10, w * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a65233'; // Maceta
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w * 0.85, y + h);
    ctx.lineTo(x + w * 0.15, y + h);
    ctx.closePath();
    ctx.fill();
}


// =========================================================================
// SELECTOR PRINCIPAL DE FONDO
// =========================================================================
export function renderFondo(ctx, nivel, cameraX, viewH) {
    switch (nivel) {
        case 1:
            dibujarFondo24DeSeptiembre(ctx, cameraX, viewH);
            break;
        case 2:
            dibujarFondoBatallaFlorida(ctx, cameraX, viewH);
            break;
        case 3:
            dibujarFondoBatallaSantaBarbara(ctx, cameraX, viewH);
            break;
        case 4:
            dibujarFondoBatallaDelPari(ctx, cameraX, viewH);
            break;
        case 5:
            dibujarFondo24DeSeptiembre(ctx, cameraX, viewH);
            break;
        default:
            // Fallback (Degradado por defecto)
            const gradiente = ctx.createLinearGradient(0, 0, 0, viewH);
            gradiente.addColorStop(0, '#101018');
            gradiente.addColorStop(1, '#191924');
            ctx.fillStyle = gradiente;
            ctx.fillRect(0, 0, 3000, viewH);
            break;
    }
}
