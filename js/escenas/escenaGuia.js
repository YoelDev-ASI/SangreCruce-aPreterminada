import { sonidos } from '../utilidades/sonidos.js';

/**
 * Clase EscenaGuia - Pantalla instructiva de controles y mecánicas.
 * Detalla el arrastre horizontal de cámara, la economía y los mandos militares.
 */
export class EscenaGuia {
    constructor(anchoLogico, altoLogico, motor) {
        this.anchoLogico = anchoLogico;
        this.altoLogico = altoLogico;
        this.motor = motor;
    }

    update(dt) {
        // Estático
    }

    draw(ctx) {
        // Fondo de pergamino de guía
        ctx.fillStyle = '#fbf7eb';
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        // Marco doble
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, this.anchoLogico - 40, this.altoLogico - 40);
        ctx.strokeStyle = 'rgba(139, 90, 43, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(26, 26, this.anchoLogico - 52, this.altoLogico - 52);

        // Título de la guía
        ctx.fillStyle = '#8b2500';
        ctx.font = 'bold 32px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("GUÍA DE ESTRATEGIA - MOVIMIENTOS BÁSICOS", this.anchoLogico / 2, 75);

        // Subtítulo
        ctx.fillStyle = '#5c3a21';
        ctx.font = 'italic 15px "Outfit", sans-serif';
        ctx.fillText("Aprende a comandar tus tropas contra la Corona Española", this.anchoLogico / 2, 105);

        // Separador
        ctx.strokeStyle = 'rgba(139, 90, 43, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 125);
        ctx.lineTo(this.anchoLogico - 100, 125);
        ctx.stroke();

        // --- COLUMNAS INSTRUCTIVAS ---
        const colY = 160;
        const colW = 320;

        // Columna 1: Cámara Horizontal Deslizable
        this.dibujarSeccionGuia(ctx, 80, colY, colW, 
            "1. CÁMARA DESLIZABLE",
            "El campo de batalla es más ancho que tu pantalla. Arrastra la pantalla horizontalmente deslizando tu dedo en celular o manteniendo presionado el mouse para mover la cámara y vigilar las tropas realistas."
        );

        // Columna 2: Recolección y Economía
        this.dibujarSeccionGuia(ctx, 480, colY, colW, 
            "2. ECONOMÍA DE MINAS",
            "El oro es crucial. Compra Mineros en el HUD superior. Ellos caminarán de forma automática a la mina del centro para extraer oro y depositarlo en tu fortaleza, aumentando tu capital militar."
        );

        // Columna 3: Directrices Militares
        this.dibujarSeccionGuia(ctx, 880, colY, colW, 
            "3. ÓRDENES DEL EJÉRCITO",
            "Tus soldados obedecen órdenes directas: RETIRADA (los repliega a la base para curar su vitalidad), DEFENSA (montan una línea de guardia intermedia) y ATAQUE (marchan a destruir la fortaleza enemiga)."
        );

        // Ilustración conceptual del gesto de scroll de la cámara
        const gestX = this.anchoLogico / 2;
        const gestY = 460;
        
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(gestX - 100, gestY);
        ctx.lineTo(gestX + 100, gestY);
        ctx.stroke();
        ctx.setLineDash([]); // Resetear

        // Puntas de flechas
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.moveTo(gestX - 100, gestY - 6);
        ctx.lineTo(gestX - 112, gestY);
        ctx.lineTo(gestX - 100, gestY + 6);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(gestX + 100, gestY - 6);
        ctx.lineTo(gestX + 112, gestY);
        ctx.lineTo(gestX + 100, gestY + 6);
        ctx.fill();

        ctx.fillStyle = '#4a2f13';
        ctx.font = 'bold 12px monospace';
        ctx.fillText("ARRAS TRAR PANTALLA (SCROLL)", gestX, gestY + 25);

        // Botón REGRESAR AL MENÚ
        const btnW = 260;
        const btnH = 48;
        const btnX = this.anchoLogico / 2 - btnW / 2;
        const btnY = 560;

        ctx.fillStyle = '#8b2500';
        ctx.strokeStyle = '#4a2f13';
        ctx.lineWidth = 2;
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Outfit", sans-serif';
        ctx.fillText("REGRESAR AL MENÚ", this.anchoLogico / 2, btnY + 30);
    }

    /**
     * Dibuja un recuadro ilustrativo con textos.
     */
    dibujarSeccionGuia(ctx, x, y, w, titulo, parrafo) {
        ctx.save();
        ctx.fillStyle = 'rgba(139, 90, 43, 0.05)';
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 1;
        ctx.fillRect(x, y, w, 240);
        ctx.strokeRect(x, y, w, 240);

        ctx.fillStyle = '#8b2500';
        ctx.font = 'bold 16px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(titulo, x + w / 2, y + 35);

        ctx.fillStyle = '#3a2211';
        ctx.font = '14px "Outfit", sans-serif';
        this.dibujarTextoMultilinea(ctx, parrafo, x + w / 2, y + 75, w - 30, 22);
        ctx.restore();
    }

    dibujarTextoMultilinea(ctx, texto, x, y, anchoMax, altoLinea) {
        const palabras = texto.split(' ');
        let linea = '';
        let posY = y;

        for (let n = 0; n < palabras.length; n++) {
            let testLinea = linea + palabras[n] + ' ';
            let metrica = ctx.measureText(testLinea);
            let testAncho = metrica.width;
            if (testAncho > anchoMax && n > 0) {
                ctx.fillText(linea, x, posY);
                linea = palabras[n] + ' ';
                posY += altoLinea;
            } else {
                linea = testLinea;
            }
        }
        ctx.fillText(linea, x, posY);
    }

    onPointerDown(clickX, clickY) {
        const btnW = 260;
        const btnH = 48;
        const btnX = this.anchoLogico / 2 - btnW / 2;
        const btnY = 560;

        if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btnY && clickY <= btnY + btnH) {
            sonidos.playEfecto('assets/audio/click.mp3');
            
            // Regresar al menú principal
            import('./escenaPrincipal.js').then((module) => {
                const principal = new module.EscenaPrincipal(this.anchoLogico, this.altoLogico, this.motor);
                this.motor.setEscena(principal);
            });
        }
    }
}
