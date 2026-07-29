import { sonidos } from '../utilidades/sonidos.js';
import { EscenaMapa } from './EscenaMapa.js';

/**
 * Clase EscenaPrincipal - Menú de Inicio del Juego.
 * Renderiza la portada principal, el botón de Jugar y el modal
 * flotante de Ajustes (sonido, créditos, guía).
 */
export class EscenaPrincipal {
    constructor(anchoLogico, altoLogico, motor) {
        this.anchoLogico = anchoLogico;
        this.altoLogico = altoLogico;
        this.motor = motor;

        // Estados de interfaz
        this.mostrarAjustes = false;
        this.mostrarCreditos = false;

        // Cargar imagen de fondo
        this.imagenFondo = new Image();
        this.imagenFondo.src = 'assets/imagenes/FondoSangreCruceña.jpeg';

        // Iniciar melodía de bienvenida (si no está muteado)
        sonidos.playMusica('assets/audio/marcha_campania.mp3');
    }

    /**
     * Ciclo de actualización lógico
     */
    update(dt) {
        // Estático por el momento
    }

    /**
     * Renderiza los componentes gráficos del menú en el Canvas
     */
    draw(ctx) {
        // 1. Dibujar fondo de la portada
        if (this.imagenFondo.complete && this.imagenFondo.naturalWidth !== 0) {
            // Dibujar la imagen de fondo cubriendo todo el canvas lógico
            ctx.drawImage(this.imagenFondo, 0, 0, this.anchoLogico, this.altoLogico);
        } else {
            // Gradiente premium oscuro de respaldo mientras carga
            const gradiente = ctx.createLinearGradient(0, 0, 0, this.altoLogico);
            gradiente.addColorStop(0, '#121218');
            gradiente.addColorStop(1, '#1b1b28');
            ctx.fillStyle = gradiente;
            ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);
        }

        // =========================================================================
        // [DISEÑO DE TU PORTADA / FONDO PRINCIPAL EN CANVAS]
        // Coloca aquí tus líneas de trazado para la ilustración de fondo.
        // Ej: Dibujos de banderas patriotas, siluetas de soldados o cañones coloniales.
        // =========================================================================

        // 3. Botones principales (Solo si el modal no está activo)
        if (!this.mostrarAjustes && !this.mostrarCreditos) {
            // Botón JUGAR
            this.dibujarBoton(ctx, this.anchoLogico / 2 - 100, 310, 200, 50, "JUGAR", '#c5a059', '#ffffff');

            // Botón AJUSTES
            this.dibujarBoton(ctx, this.anchoLogico / 2 - 100, 380, 200, 50, "AJUSTES", 'rgba(255, 255, 255, 0.08)', '#c5a059');

            // Crédito breve inferior
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = '12px monospace';
            ctx.fillText("UTEPSA - DESARROLLO DE VIDEOJUEGOS 2", this.anchoLogico / 2, this.altoLogico - 40);
        }

        // 4. --- MODAL DE AJUSTES (Caja flotante mediana) ---
        if (this.mostrarAjustes && !this.mostrarCreditos) {
            this.drawModalAjustes(ctx);
        }

        // 5. --- MODAL DE CRÉDITOS ---
        if (this.mostrarCreditos) {
            this.drawModalCreditos(ctx);
        }
    }

    /**
     * Dibuja el modal de Ajustes centrado.
     */
    drawModalAjustes(ctx) {
        // Velo oscuro
        ctx.fillStyle = 'rgba(8, 8, 12, 0.6)';
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        const w = 400;
        const h = 390;
        const x = this.anchoLogico / 2 - w / 2;
        const y = this.altoLogico / 2 - h / 2;

        // Marco de la ventana
        ctx.fillStyle = '#171721';
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 3;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("AJUSTES", this.anchoLogico / 2, y + 45);

        // Línea decorativa
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.25)';
        ctx.beginPath();
        ctx.moveTo(x + 40, y + 65);
        ctx.lineTo(x + w - 40, y + 65);
        ctx.stroke();

        // Botón 1: Alternar Sonido (Mute)
        const txtSonido = sonidos.muted ? "MÚSICA: SILENCIADA" : "MÚSICA: ACTIVA";
        this.dibujarBoton(ctx, x + 40, y + 95, 320, 45, txtSonido, sonidos.muted ? '#d32f2f' : '#388e3c', '#ffffff');

        // Botón 2: Guía de Juego
        this.dibujarBoton(ctx, x + 40, y + 160, 320, 45, "GUÍA DEL JUEGO", 'rgba(255,255,255,0.06)', '#c5a059');

        // Botón 3: Créditos
        this.dibujarBoton(ctx, x + 40, y + 225, 320, 45, "CRÉDITOS", 'rgba(255,255,255,0.06)', '#c5a059');

        // Botón 4: Cerrar Ajustes
        this.dibujarBoton(ctx, x + 40, y + 305, 320, 45, "CERRAR", 'rgba(255, 255, 255, 0.1)', '#ffffff');
    }

    /**
     * Dibuja el modal de Créditos.
     */
    drawModalCreditos(ctx) {
        ctx.fillStyle = 'rgba(8, 8, 12, 0.7)';
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        const w = 450;
        const h = 320;
        const x = this.anchoLogico / 2 - w / 2;
        const y = this.altoLogico / 2 - h / 2;

        ctx.fillStyle = '#171721';
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 3;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#c5a059';
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.fillText("CRÉDITOS", this.anchoLogico / 2, y + 45);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px "Outfit", sans-serif';
        ctx.fillText("SANGRE ORIENTAL - REVOLUCIÓN CRUCEÑA", this.anchoLogico / 2, y + 90);

        ctx.fillStyle = '#b0b0b0';
        ctx.font = '14px "Outfit", sans-serif';
        ctx.fillText("Desarrollador del Proyecto:", this.anchoLogico / 2, y + 130);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Outfit", sans-serif';
        ctx.fillText("Joel - Estudiante de Ingeniería de Sistemas", this.anchoLogico / 2, y + 150);

        ctx.fillStyle = '#b0b0b0';
        ctx.font = '14px "Outfit", sans-serif';
        ctx.fillText("Materia:", this.anchoLogico / 2, y + 190);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Outfit", sans-serif';
        ctx.fillText("Desarrollo de Videojuegos II", this.anchoLogico / 2, y + 210);

        // Botón cerrar créditos
        this.dibujarBoton(ctx, x + 125, y + 250, 200, 42, "CERRAR CRÉDITOS", '#8b2500', '#ffffff');
    }

    /**
     * Función utilitaria para dibujar botones planos estilizados.
     */
    dibujarBoton(ctx, x, y, w, h, texto, colorFondo, colorTexto) {
        ctx.save();
        ctx.fillStyle = colorFondo;
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 1.5;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = colorTexto;
        ctx.font = 'bold 14px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(texto, x + w / 2, y + h / 2 + 5);
        ctx.restore();
    }

    /**
     * Captura interacciones táctiles / clics
     */
    onPointerDown(clickX, clickY) {
        // A. Clics en el modal de créditos
        if (this.mostrarCreditos) {
            const w = 450;
            const h = 320;
            const x = this.anchoLogico / 2 - w / 2;
            const y = this.altoLogico / 2 - h / 2;

            // Coordenadas botón Cerrar Créditos
            const btnX = x + 125;
            const btnY = y + 250;
            const btnW = 200;
            const btnH = 42;

            if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.mostrarCreditos = false;
            }
            return;
        }

        // B. Clics en el modal de ajustes
        if (this.mostrarAjustes) {
            const w = 400;
            const h = 390;
            const x = this.anchoLogico / 2 - w / 2;
            const y = this.altoLogico / 2 - h / 2;

            // Botón Alternar Mute (x + 40, y + 95, w: 320, h: 45)
            if (clickX >= x + 40 && clickX <= x + 360 && clickY >= y + 95 && clickY <= y + 140) {
                sonidos.alternarMute();
                sonidos.playEfecto('assets/audio/click.mp3');
                return;
            }

            // Botón Guía (x + 40, y + 160, w: 320, h: 45)
            if (clickX >= x + 40 && clickX <= x + 360 && clickY >= y + 160 && clickY <= y + 205) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.mostrarAjustes = false; // Cerrar panel

                // Cargar Escena de Guía
                import('./escenaGuia.js').then((module) => {
                    const guia = new module.EscenaGuia(this.anchoLogico, this.altoLogico, this.motor);
                    this.motor.setEscena(guia);
                });
                return;
            }

            // Botón Créditos (x + 40, y + 225, w: 320, h: 45) (Fase 8)
            if (clickX >= x + 40 && clickX <= x + 360 && clickY >= y + 225 && clickY <= y + 270) {
                sonidos.playEfecto('assets/audio/click.mp3');
                sonidos.detenerMusica();
                this.mostrarAjustes = false;
                import('./escenaCreditos.js').then((module) => {
                    const creditos = new module.EscenaCreditos(this.anchoLogico, this.altoLogico, this.motor);
                    this.motor.setEscena(creditos);
                });
                return;
            }

            // Botón Cerrar Ajustes (x + 40, y + 305, w: 320, h: 45)
            if (clickX >= x + 40 && clickX <= x + 360 && clickY >= y + 305 && clickY <= y + 350) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.mostrarAjustes = false;
                return;
            }
            return;
        }

        // C. Clics en la portada principal
        const btnX = this.anchoLogico / 2 - 100;

        // Clic en JUGAR (y: 310, w: 200, h: 50)
        if (clickX >= btnX && clickX <= btnX + 200 && clickY >= 310 && clickY <= 360) {
            sonidos.playEfecto('assets/audio/click.mp3');
            // Cargar escena del mapa de batallas
            const mapa = new EscenaMapa(this.anchoLogico, this.altoLogico, this.motor);
            this.motor.setEscena(mapa);
            return;
        }

        // Clic en AJUSTES (y: 380, w: 200, h: 50)
        if (clickX >= btnX && clickX <= btnX + 200 && clickY >= 380 && clickY <= 430) {
            sonidos.playEfecto('assets/audio/click.mp3');
            this.mostrarAjustes = true;
            return;
        }
    }
}
