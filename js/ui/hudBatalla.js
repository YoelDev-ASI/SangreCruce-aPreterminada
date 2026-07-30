/**
 * Clase HudBatalla - Administra la barra superior de interfaz (HUD)
 * para el reclutamiento táctico de tropas, con soporte para Milicianos
 * y barras de carga individuales bajo cada tarjeta de reclutamiento.
 */export class HudBatalla {
    /**
     * @param {HTMLElement} contenedor 
     * @param {function} onSpawnRequest 
     * @param {function} onCommandRequest 
     * @param {function} onCancelRequest
     * @param {function} onPauseRequest
     */
    constructor(contenedor, onSpawnRequest, onCommandRequest, onCancelRequest, onPauseRequest) {
        this.contenedor = contenedor;
        this.onSpawnRequest = onSpawnRequest;
        this.onCommandRequest = onCommandRequest;
        this.onCancelRequest = onCancelRequest;
        this.onPauseRequest = onPauseRequest;

        this.init();
    }

    /**
     * Inyecta la botonera HTML con soporte para Milicianos, botones circulares, contadores, recursos y botón de pausa.
     */
    init() {
        this.contenedor.innerHTML = `
            <div id="hud-top-bar" style="position: absolute; top: 15px; left: 40px; right: 40px; display: flex; justify-content: space-between; align-items: center; z-index: 20; pointer-events: none;">
                <!-- Panel Izquierdo: Reclutamiento + Mandos -->
                <div style="display: flex; gap: 30px; align-items: center; pointer-events: auto;">
                    <!-- Panel de compra de tropas -->
                    <div id="recruitment-panel" style="display: flex; gap: 14px; align-items: flex-start;">
                        
                        <!-- Tarjeta Circular: Minero -->
                        <div class="unit-circle-wrapper">
                            <button class="unit-circle-btn" id="btn-spawn-minero" data-cost="150">
                                <!-- Progreso radial -->
                                <div class="unit-circle-progress" id="progress-overlay-minero" style="--progress: 0%;"></div>
                                
                                <!-- Icono (Pickaxe) -->
                                <div class="unit-circle-icon-container">
                                    <canvas id="canvas-icon-minero" style="display: block; pointer-events: none;"></canvas>
                                </div>
                                
                                <!-- Cantidad en Cola -->
                                <div class="unit-circle-queue" id="queue-count-minero"></div>
                                
                                <!-- Costo -->
                                <div class="unit-circle-cost">150</div>
                            </button>
                            
                            <!-- Botón Cancelar (X) -->
                            <button class="unit-cancel-btn" id="btn-cancel-minero">
                                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Tarjeta Circular: Miliciano -->
                        <div class="unit-circle-wrapper">
                            <button class="unit-circle-btn" id="btn-spawn-miliciano" data-cost="100">
                                <!-- Progreso radial -->
                                <div class="unit-circle-progress" id="progress-overlay-miliciano" style="--progress: 0%;"></div>
                                
                                <!-- Icono (Sable/Machete) -->
                                <div class="unit-circle-icon-container">
                                    <canvas id="canvas-icon-miliciano" style="display: block; pointer-events: none;"></canvas>
                                </div>
                                
                                <!-- Cantidad en Cola -->
                                <div class="unit-circle-queue" id="queue-count-miliciano"></div>
                                
                                <!-- Costo -->
                                <div class="unit-circle-cost">100</div>
                            </button>
                            
                            <!-- Botón Cancelar (X) -->
                            <button class="unit-cancel-btn" id="btn-cancel-miliciano">
                                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
     
                        <!-- Tarjeta Circular: Fusilero -->
                        <div class="unit-circle-wrapper">
                            <button class="unit-circle-btn" id="btn-spawn-fusilero" data-cost="300">
                                <!-- Progreso radial -->
                                <div class="unit-circle-progress" id="progress-overlay-fusilero" style="--progress: 0%;"></div>
                                
                                <!-- Icono (Fusil/Rifle) -->
                                <div class="unit-circle-icon-container">
                                    <canvas id="canvas-icon-fusilero" style="display: block; pointer-events: none;"></canvas>
                                </div>
                                
                                <!-- Cantidad en Cola -->
                                <div class="unit-circle-queue" id="queue-count-fusilero"></div>
                                
                                <!-- Costo -->
                                <div class="unit-circle-cost">300</div>
                            </button>
                            
                            <!-- Botón Cancelar (X) -->
                            <button class="unit-cancel-btn" id="btn-cancel-fusilero">
                                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
     
                    <!-- Panel de mandos militares -->
                    <div id="commands-panel" style="display: flex; gap: 10px;">
                        <button class="cmd-btn" id="btn-cmd-retirarse">
                            <canvas id="canvas-icon-retirarse" style="display: block; pointer-events: none;"></canvas>
                            <span>Retirada</span>
                        </button>
                        
                        <button class="cmd-btn active" id="btn-cmd-defender">
                            <canvas id="canvas-icon-defender" style="display: block; pointer-events: none;"></canvas>
                            <span>Defender</span>
                        </button>
                        
                        <button class="cmd-btn" id="btn-cmd-atacar">
                            <canvas id="canvas-icon-atacar" style="display: block; pointer-events: none;"></canvas>
                            <span>Atacar</span>
                        </button>
                    </div>
                </div>

                <!-- Panel Derecho: Recursos y Pausa -->
                <div style="display: flex; gap: 12px; align-items: center; pointer-events: auto;">
                    <!-- Oro -->
                    <div class="hud-status-box" id="gold-panel">
                        <canvas id="canvas-icon-gold" style="display: block; pointer-events: none;"></canvas>
                        <span id="hud-gold-text">0</span>
                    </div>
                    <!-- Población -->
                    <div class="hud-status-box" id="pop-panel">
                        <canvas id="canvas-icon-pop" style="display: block; pointer-events: none;"></canvas>
                        <span id="hud-pop-text">0/50</span>
                    </div>
                    <!-- Pausa -->
                    <button class="cmd-btn" id="btn-hud-pausa" style="border-radius: 50%; width: 54px; height: 54px; padding: 0; display: flex; align-items: center; justify-content: center; min-width: 54px;" title="Pausa">
                        <canvas id="canvas-icon-pausa" style="display: block; pointer-events: none;"></canvas>
                    </button>
                </div>
            </div>
        `;

        // 1. Vincular eventos de reclutamiento y cancelación
        document.getElementById('btn-spawn-minero').addEventListener('click', () => {
            this.onSpawnRequest('minero');
        });
        document.getElementById('btn-cancel-minero').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onCancelRequest) this.onCancelRequest('minero');
        });

        document.getElementById('btn-spawn-miliciano').addEventListener('click', () => {
            this.onSpawnRequest('miliciano');
        });
        document.getElementById('btn-cancel-miliciano').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onCancelRequest) this.onCancelRequest('miliciano');
        });

        document.getElementById('btn-spawn-fusilero').addEventListener('click', () => {
            this.onSpawnRequest('fusilero');
        });
        document.getElementById('btn-cancel-fusilero').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onCancelRequest) this.onCancelRequest('fusilero');
        });

        // 2. Vincular eventos de mandos militares
        const btnsCmd = {
            retirarse: document.getElementById('btn-cmd-retirarse'),
            defender: document.getElementById('btn-cmd-defender'),
            atacar: document.getElementById('btn-cmd-atacar')
        };

        const cambiarMandoActivo = (mandoKey) => {
            Object.values(btnsCmd).forEach(btn => btn.classList.remove('active'));
            btnsCmd[mandoKey].classList.add('active');
            this.onCommandRequest(mandoKey.toUpperCase());

            // Redibujar iconos de mandos para reflejar el color activo/inactivo
            this.dibujarIconosMandos(mandoKey);
        };

        btnsCmd.retirarse.addEventListener('click', () => cambiarMandoActivo('retirarse'));
        btnsCmd.defender.addEventListener('click', () => cambiarMandoActivo('defender'));
        btnsCmd.atacar.addEventListener('click', () => cambiarMandoActivo('atacar'));

        // 3. Vincular evento de pausa
        const btnPausa = document.getElementById('btn-hud-pausa');
        if (btnPausa) {
            btnPausa.addEventListener('click', () => {
                if (this.onPauseRequest) this.onPauseRequest();
            });
        }

        // Dibujar los iconos personalizados estáticos
        this.dibujarIconosCanvas();

        // Dibujar los iconos de mandos iniciales (por defecto 'defender' activo)
        this.dibujarIconosMandos('defender');
    }

/**
 * Dibuja los logotipos personalizados en los lienzos canvas de los botones de reclutamiento y recursos.
 */
dibujarIconosCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const size = 34; // Tamaño en píxeles CSS
    const fillColor = "#1a180d"; // Color de silueta oscuro coincidente con el tema

    // 1. Minero (Pico)
    const canvasMinero = document.getElementById('canvas-icon-minero');
    if (canvasMinero) {
        canvasMinero.width = size * dpr;
        canvasMinero.height = size * dpr;
        canvasMinero.style.width = `${size}px`;
        canvasMinero.style.height = `${size}px`;
        const ctx = canvasMinero.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        // Bounding box estimada de la figura original 900x700
        const minX = 100, maxX = 850, minY = -40, maxY = 650;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(size / width, size / height);
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        ctx.fillStyle = fillColor;

        // Mango
        ctx.beginPath();
        ctx.moveTo(170, 560);
        ctx.lineTo(205, 595);
        ctx.lineTo(565, 235);
        ctx.lineTo(530, 200);
        ctx.closePath();
        ctx.fill();

        // Cabeza del pico
        ctx.beginPath();
        ctx.moveTo(505, 170);
        ctx.lineTo(555, 120);
        ctx.lineTo(640, 205);
        ctx.lineTo(590, 255);
        ctx.closePath();
        ctx.fill();

        // Hoja superior
        ctx.beginPath();
        ctx.moveTo(555, 120);
        ctx.bezierCurveTo(475, 70, 355, -20, 145, 35);
        ctx.bezierCurveTo(260, 40, 460, 130, 520, 180);
        ctx.closePath();
        ctx.fill();

        // Hoja inferior
        ctx.beginPath();
        ctx.moveTo(630, 200);
        ctx.bezierCurveTo(800, 380, 810, 460, 760, 610);
        ctx.bezierCurveTo(780, 570, 700, 350, 590, 255);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // 2. Miliciano (Machete)
    const canvasMiliciano = document.getElementById('canvas-icon-miliciano');
    if (canvasMiliciano) {
        canvasMiliciano.width = size * dpr;
        canvasMiliciano.height = size * dpr;
        canvasMiliciano.style.width = `${size}px`;
        canvasMiliciano.style.height = `${size}px`;
        const ctx = canvasMiliciano.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        // Bounding box estimada de la figura original 900x650
        const minX = 80, maxX = 690, minY = 60, maxY = 620;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(size / width, size / height);
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        ctx.fillStyle = fillColor;

        // Hoja del machete
        ctx.beginPath();
        ctx.moveTo(170, 90);
        ctx.bezierCurveTo(115, 175, 145, 245, 260, 305);
        ctx.bezierCurveTo(420, 390, 560, 550, 620, 560);
        ctx.bezierCurveTo(595, 525, 520, 430, 385, 315);
        ctx.bezierCurveTo(285, 225, 240, 155, 200, 120);
        ctx.closePath();
        ctx.fill();

        // Mango
        ctx.beginPath();
        ctx.moveTo(540, 495);
        ctx.quadraticCurveTo(570, 470, 610, 500);
        ctx.lineTo(655, 570);
        ctx.quadraticCurveTo(630, 597, 595, 583);
        ctx.lineTo(532, 520);
        ctx.quadraticCurveTo(518, 508, 540, 495);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // 3. Fusilero (Rifle)
    const canvasFusilero = document.getElementById('canvas-icon-fusilero');
    if (canvasFusilero) {
        canvasFusilero.width = size * dpr;
        canvasFusilero.height = size * dpr;
        canvasFusilero.style.width = `${size}px`;
        canvasFusilero.style.height = `${size}px`;
        const ctx = canvasFusilero.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        // Bounding box estimada de la figura original 600x650
        const minX = 60, maxX = 520, minY = 220, maxY = 630;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(size / width, size / height);
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        ctx.fillStyle = fillColor;

        // Traslación y rotación originales del archivo test
        ctx.translate(170, 520);
        ctx.rotate(-40 * Math.PI / 180);

        // Culata
        ctx.beginPath();
        ctx.moveTo(-80, 50);
        ctx.lineTo(-80, -35);
        ctx.lineTo(50, -18);
        ctx.lineTo(50, 25);
        ctx.lineTo(-5, 30);
        ctx.lineTo(-45, 45);
        ctx.closePath();
        ctx.fill();

        // Empuñadura
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(45, -5);
        ctx.lineTo(55, 18);
        ctx.lineTo(35, 48);
        ctx.lineTo(10, 46);
        ctx.lineTo(15, 10);
        ctx.closePath();
        ctx.fill();

        // Guardamonte
        ctx.beginPath();
        ctx.moveTo(40, 5);
        ctx.lineTo(72, 5);
        ctx.lineTo(100, 10);
        ctx.lineTo(67, 48);
        ctx.lineTo(35, 48);
        ctx.lineTo(42, 35);
        ctx.lineTo(65, 35);
        ctx.lineTo(78, 20);
        ctx.lineTo(62, 12);
        ctx.lineTo(40, 12);
        ctx.closePath();
        ctx.fill();

        // Caja del mecanismo
        ctx.beginPath();
        ctx.moveTo(45, -18);
        ctx.lineTo(95, -18);
        ctx.lineTo(108, -2);
        ctx.lineTo(86, 18);
        ctx.lineTo(40, 18);
        ctx.closePath();
        ctx.fill();

        // Cañón
        ctx.beginPath();
        ctx.rect(92, -12, 330, 24);
        ctx.fill();

        // Pequeño escalón
        ctx.beginPath();
        ctx.moveTo(110, -12);
        ctx.lineTo(125, -24);
        ctx.lineTo(145, -24);
        ctx.lineTo(145, -12);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // 4. Oro (Moneda)
    const canvasGold = document.getElementById('canvas-icon-gold');
    if (canvasGold) {
        const goldSize = 20; // 20px CSS
        canvasGold.width = goldSize * dpr;
        canvasGold.height = goldSize * dpr;
        canvasGold.style.width = `${goldSize}px`;
        canvasGold.style.height = `${goldSize}px`;
        const ctx = canvasGold.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        const minX = 20, maxX = 480, minY = 20, maxY = 480;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(goldSize / width, goldSize / height);
        ctx.translate(goldSize / 2, goldSize / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);

        const cx = 250;
        const cy = 250;

        // Borde exterior
        ctx.beginPath();
        ctx.arc(cx, cy, 210, 0, 2 * Math.PI);
        ctx.fillStyle = '#b87c12';
        ctx.fill();

        // Anillo exterior con degradado
        const gradAnilloExt = ctx.createLinearGradient(100, 100, 400, 400);
        gradAnilloExt.addColorStop(0, '#ffe875');
        gradAnilloExt.addColorStop(0.3, '#f2a912');
        gradAnilloExt.addColorStop(0.7, '#d18608');
        gradAnilloExt.addColorStop(1, '#fff4a8');
        ctx.beginPath();
        ctx.arc(cx, cy, 208, 0, 2 * Math.PI);
        ctx.fillStyle = gradAnilloExt;
        ctx.fill();

        // Borde anillo intermedio
        ctx.beginPath();
        ctx.arc(cx, cy, 185, 0, 2 * Math.PI);
        ctx.strokeStyle = '#8a5907';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Relleno anillo intermedio
        const gradAnilloInt = ctx.createLinearGradient(120, 120, 380, 380);
        gradAnilloInt.addColorStop(0, '#fabb1e');
        gradAnilloInt.addColorStop(0.5, '#e09307');
        gradAnilloInt.addColorStop(1, '#ffe07d');
        ctx.beginPath();
        ctx.arc(cx, cy, 183, 0, 2 * Math.PI);
        ctx.fillStyle = gradAnilloInt;
        ctx.fill();

        // Relieve círculo central
        ctx.beginPath();
        ctx.arc(cx, cy, 131, 0, 2 * Math.PI);
        ctx.fillStyle = '#6e4402';
        ctx.fill();

        // Círculo central
        const gradCentro = ctx.createLinearGradient(150, 150, 350, 350);
        gradCentro.addColorStop(0, '#ffeb7a');
        gradCentro.addColorStop(0.4, '#f5af16');
        gradCentro.addColorStop(1, '#b87400');
        ctx.beginPath();
        ctx.arc(cx, cy, 129, 0, 2 * Math.PI);
        ctx.fillStyle = gradCentro;
        ctx.fill();

        ctx.restore();
    }

    // 5. Población (Personas)
    const canvasPop = document.getElementById('canvas-icon-pop');
    if (canvasPop) {
        const popSize = 20; // 20px CSS
        canvasPop.width = popSize * dpr;
        canvasPop.height = popSize * dpr;
        canvasPop.style.width = `${popSize}px`;
        canvasPop.style.height = `${popSize}px`;
        const ctx = canvasPop.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        const minX = 130, maxX = 370, minY = 150, maxY = 340;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(popSize / width, popSize / height);
        ctx.translate(popSize / 2, popSize / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        ctx.fillStyle = '#ffffff';

        // Persona izquierda (segundo plano)
        ctx.beginPath();
        ctx.arc(175, 215, 23, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(150, 310);
        ctx.lineTo(150, 265);
        ctx.quadraticCurveTo(150, 245, 175, 245);
        ctx.quadraticCurveTo(200, 245, 200, 265);
        ctx.lineTo(200, 310);
        ctx.quadraticCurveTo(175, 313, 150, 310);
        ctx.fill();

        // Persona derecha (segundo plano)
        ctx.beginPath();
        ctx.arc(325, 215, 23, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(300, 310);
        ctx.lineTo(300, 265);
        ctx.quadraticCurveTo(300, 245, 325, 245);
        ctx.quadraticCurveTo(350, 245, 350, 265);
        ctx.lineTo(350, 310);
        ctx.quadraticCurveTo(325, 313, 300, 310);
        ctx.fill();

        // Separación / recorte
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(190, 326);
        ctx.lineTo(190, 268);
        ctx.quadraticCurveTo(190, 236, 250, 236);
        ctx.quadraticCurveTo(310, 236, 310, 268);
        ctx.lineTo(310, 326);
        ctx.quadraticCurveTo(250, 332, 190, 326);
        ctx.fill();
        ctx.restore();

        // Persona central (primer plano)
        ctx.beginPath();
        ctx.arc(250, 205, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(196, 320);
        ctx.lineTo(196, 272);
        ctx.quadraticCurveTo(196, 244, 250, 244);
        ctx.quadraticCurveTo(304, 244, 304, 272);
        ctx.lineTo(304, 320);
        ctx.quadraticCurveTo(250, 326, 196, 320);
        ctx.fill();

        ctx.restore();
    }

    // 6. Pausa (Icono circular)
    const canvasPausa = document.getElementById('canvas-icon-pausa');
    if (canvasPausa) {
        const pauseSize = 34; // 34px CSS (Agrandado para mayor visibilidad)
        canvasPausa.width = pauseSize * dpr;
        canvasPausa.height = pauseSize * dpr;
        canvasPausa.style.width = `${pauseSize}px`;
        canvasPausa.style.height = `${pauseSize}px`;
        const ctx = canvasPausa.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        const minX = 20, maxX = 480, minY = 20, maxY = 480;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(pauseSize / width, pauseSize / height);
        ctx.translate(pauseSize / 2, pauseSize / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);

        const cx = 250;
        const cy = 250;

        // Anillo exterior blanco
        ctx.beginPath();
        ctx.arc(cx, cy, 210, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Círculo interior degradado
        const gradient = ctx.createRadialGradient(230, 200, 20, 250, 250, 200);
        gradient.addColorStop(0, '#fdbb2d');
        gradient.addColorStop(1, '#f39c12');
        ctx.beginPath();
        ctx.arc(cx, cy, 200, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Barra pausa izquierda
        ctx.beginPath();
        ctx.moveTo(178, 170);
        ctx.lineTo(238, 170);
        ctx.lineTo(238, 330);
        ctx.lineTo(178, 330);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Barra pausa derecha
        ctx.beginPath();
        ctx.moveTo(262, 170);
        ctx.lineTo(322, 170);
        ctx.lineTo(322, 330);
        ctx.lineTo(262, 330);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Dibuja los iconos de mando militar (Retirada, Defender, Atacar) con colores dinámicos.
 * @param {string} activeMandoKey - La clave del mando activo ('retirarse', 'defender', 'atacar')
 */
dibujarIconosMandos(activeMandoKey) {
    const dpr = window.devicePixelRatio || 1;
    const size = 18; // 18px CSS para que encaje con el botón cmd-btn
    const activeColorMap = {
        retirarse: '#3ca0ff',
        defender: '#ffd700',
        atacar: '#ff4d4d'
    };
    const inactiveColor = '#a0a0b0';

    // 1. Retirarse (Torre de Castillo)
    const canvasRetirarse = document.getElementById('canvas-icon-retirarse');
    if (canvasRetirarse) {
        canvasRetirarse.width = size * dpr;
        canvasRetirarse.height = size * dpr;
        canvasRetirarse.style.width = `${size}px`;
        canvasRetirarse.style.height = `${size}px`;
        const ctx = canvasRetirarse.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        const minX = 80, maxX = 420, minY = 70, maxY = 460;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(size / width, size / height);
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);

        ctx.fillStyle = (activeMandoKey === 'retirarse') ? activeColorMap.retirarse : inactiveColor;

        // Parte Superior (Almenas)
        ctx.beginPath();
        ctx.moveTo(110, 100);
        ctx.lineTo(170, 100);
        ctx.lineTo(170, 160);
        ctx.lineTo(205, 160);
        ctx.lineTo(205, 100);
        ctx.lineTo(295, 100);
        ctx.lineTo(295, 160);
        ctx.lineTo(330, 160);
        ctx.lineTo(330, 100);
        ctx.lineTo(390, 100);
        ctx.lineTo(390, 210);
        ctx.lineTo(350, 270);
        ctx.lineTo(150, 270);
        ctx.lineTo(110, 210);
        ctx.closePath();
        ctx.fill();

        // Parte Inferior (Base)
        ctx.beginPath();
        ctx.moveTo(140, 305);
        ctx.lineTo(360, 305);
        ctx.lineTo(360, 430);
        ctx.lineTo(285, 430);
        ctx.lineTo(285, 370);
        ctx.quadraticCurveTo(250, 330, 215, 370);
        ctx.lineTo(215, 430);
        ctx.lineTo(140, 430);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // 2. Defender (Escudo)
    const canvasDefender = document.getElementById('canvas-icon-defender');
    if (canvasDefender) {
        canvasDefender.width = size * dpr;
        canvasDefender.height = size * dpr;
        canvasDefender.style.width = `${size}px`;
        canvasDefender.style.height = `${size}px`;
        const ctx = canvasDefender.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        const minX = 120, maxX = 380, minY = 80, maxY = 430;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(size / width, size / height);
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);

        const fillColor = (activeMandoKey === 'defender') ? activeColorMap.defender : inactiveColor;

        // Escudo exterior
        ctx.beginPath();
        ctx.moveTo(150, 120);
        ctx.quadraticCurveTo(250, 105, 350, 120);
        ctx.lineTo(350, 260);
        ctx.quadraticCurveTo(350, 360, 250, 410);
        ctx.quadraticCurveTo(150, 360, 150, 260);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        // Margen intermedio (cut out)
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(162, 133);
        ctx.quadraticCurveTo(250, 119, 338, 133);
        ctx.lineTo(338, 258);
        ctx.quadraticCurveTo(338, 348, 250, 393);
        ctx.quadraticCurveTo(162, 348, 162, 258);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Escudo interior
        ctx.beginPath();
        ctx.moveTo(172, 143);
        ctx.quadraticCurveTo(250, 130, 328, 143);
        ctx.lineTo(328, 256);
        ctx.quadraticCurveTo(328, 338, 250, 379);
        ctx.quadraticCurveTo(172, 338, 172, 256);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.restore();
    }

    // 3. Atacar (Lucha - Espadas Cruzadas)
    const canvasAtacar = document.getElementById('canvas-icon-atacar');
    if (canvasAtacar) {
        canvasAtacar.width = size * dpr;
        canvasAtacar.height = size * dpr;
        canvasAtacar.style.width = `${size}px`;
        canvasAtacar.style.height = `${size}px`;
        const ctx = canvasAtacar.getContext('2d');
        ctx.scale(dpr, dpr);

        ctx.save();
        const minX = 70, maxX = 530, minY = 70, maxY = 530;
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const scale = Math.min(size / width, size / height);
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);

        const fillColor = (activeMandoKey === 'atacar') ? activeColorMap.atacar : inactiveColor;

        const dibujarEspadaLocal = (c) => {
            c.beginPath();
            c.moveTo(0, -220);
            c.lineTo(32, -180);
            c.lineTo(32, 50);
            c.quadraticCurveTo(65, 45, 80, 20);
            c.quadraticCurveTo(65, 75, 30, 80);
            c.quadraticCurveTo(20, 110, 30, 150);
            c.lineTo(42, 160);
            c.lineTo(35, 185);
            c.lineTo(0, 195);
            c.lineTo(-35, 185);
            c.lineTo(-42, 160);
            c.lineTo(-30, 150);
            c.quadraticCurveTo(-20, 110, -30, 80);
            c.quadraticCurveTo(-65, 75, -80, 20);
            c.quadraticCurveTo(-65, 45, -32, 50);
            c.lineTo(-32, -180);
            c.closePath();
            c.fillStyle = fillColor;
            c.fill();
        };

        // Espada 1 (Diagonal 45°)
        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate(45 * Math.PI / 180);
        dibujarEspadaLocal(ctx);
        ctx.restore();

        // Espada 2 (Diagonal -45°)
        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate(-45 * Math.PI / 180);
        dibujarEspadaLocal(ctx);
        ctx.restore();

        ctx.restore();
    }
}

/**
 * Habilita o deshabilita los botones de compra según el oro y el tope de población,
 * y actualiza los contadores de cola y visibilidad de los botones de cancelar.
 */
update(oroPatriota, poblacionTotal = 0, colaEntrenamiento = []) {
    const limiteAlcanzado = poblacionTotal >= 50;

    const btnMinero = document.getElementById('btn-spawn-minero');
    if (btnMinero) {
        btnMinero.disabled = (oroPatriota < 150) || limiteAlcanzado;
    }

    const btnMiliciano = document.getElementById('btn-spawn-miliciano');
    if (btnMiliciano) {
        btnMiliciano.disabled = (oroPatriota < 100) || limiteAlcanzado;
    }

    const btnFusilero = document.getElementById('btn-spawn-fusilero');
    if (btnFusilero) {
        btnFusilero.disabled = (oroPatriota < 300) || limiteAlcanzado;
    }

    // Contar unidades en cola
    const counts = { minero: 0, miliciano: 0, fusilero: 0 };
    colaEntrenamiento.forEach(item => {
        if (counts[item.tipo] !== undefined) {
            counts[item.tipo]++;
        }
    });

    // Actualizar contadores visuales y botones de cancelación
    const tipos = ['minero', 'miliciano', 'fusilero'];
    tipos.forEach(t => {
        const countEl = document.getElementById(`queue-count-${t}`);
        const cancelBtn = document.getElementById(`btn-cancel-${t}`);
        const count = counts[t];

        if (countEl) {
            if (count > 0) {
                countEl.textContent = count;
                countEl.style.display = 'block';
            } else {
                countEl.textContent = '';
                countEl.style.display = 'none';
            }
        }

        if (cancelBtn) {
            if (count > 0) {
                cancelBtn.style.display = 'flex';
            } else {
                cancelBtn.style.display = 'none';
            }
        }
    });

    // Actualizar textos de recursos en HTML
    const goldText = document.getElementById('hud-gold-text');
    if (goldText) {
        goldText.textContent = `${oroPatriota}`;
    }
    const popText = document.getElementById('hud-pop-text');
    if (popText) {
        popText.textContent = `${poblacionTotal}/50`;
    }
}

/**
 * Actualiza visualmente las barras de progreso individuales para cada unidad.
 * @param {string|null} tipoActivo - Tipo de unidad que se está fabricando en el tope de la cola ('minero', 'miliciano', 'fusilero') o null
 * @param {number} progreso - Porcentaje de progreso de 0 a 1
 */
updateProgreso(tipoActivo, progreso = 0) {
    const tipos = ['minero', 'miliciano', 'fusilero'];

    tipos.forEach(t => {
        const overlay = document.getElementById(`progress-overlay-${t}`);
        if (overlay) {
            if (t === tipoActivo) {
                overlay.style.setProperty('--progress', `${progreso * 100}%`);
            } else {
                const countEl = document.getElementById(`queue-count-${t}`);
                const isInQueue = countEl && countEl.style.display !== 'none';
                if (isInQueue) {
                    overlay.style.setProperty('--progress', '0%');
                } else {
                    overlay.style.setProperty('--progress', '100%');
                }
            }
        }
    });
}

limpiar() {
    this.contenedor.innerHTML = '';
}
}
