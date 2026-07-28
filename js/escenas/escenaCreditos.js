import { sonidos } from '../utilidades/sonidos.js';

/**
 * Clase EscenaCreditos - Pantalla final del juego.
 * Muestra los créditos del desarrollador Joel, de la universidad UTEPSA y reproduce
 * una banda sonora triunfal.
 */
export class EscenaCreditos {
    /**
     * @param {number} anchoLogico 
     * @param {number} altoLogico 
     * @param {Motor} motor 
     */
    constructor(anchoLogico, altoLogico, motor) {
        this.anchoLogico = anchoLogico;
        this.altoLogico = altoLogico;
        this.motor = motor;

        // Iniciar melodía de créditos
        sonidos.playMusica('assets/audio/creditos.mp3');

        // Efecto de scroll de textos
        this.scrollY = altoLogico;
        this.velocidadScroll = 25; // Píxeles por segundo
    }

    /**
     * Actualiza el scroll del texto de los créditos.
     */
    update(dt) {
        this.scrollY -= this.velocidadScroll * dt;
        
        // Mantener el scroll en una posición legible al finalizar
        if (this.scrollY < -300) {
            this.scrollY = -300;
        }
    }

    /**
     * Dibuja los créditos animados sobre un fondo patriota elegante.
     */
    draw(ctx) {
        // Fondo degradado patriota (Verde y Dorado colonial)
        const gradiente = ctx.createLinearGradient(0, 0, 0, this.altoLogico);
        gradiente.addColorStop(0, '#0a1912');
        gradiente.addColorStop(0.5, '#0c261b');
        gradiente.addColorStop(1, '#020d08');
        ctx.fillStyle = gradiente;
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        // Diseños y ornamentos en Canvas
        ctx.strokeStyle = '#c5a059'; // Marco dorado
        ctx.lineWidth = 4;
        ctx.strokeRect(15, 15, this.anchoLogico - 30, this.altoLogico - 30);

        ctx.strokeStyle = 'rgba(197, 160, 89, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(22, 22, this.anchoLogico - 44, this.altoLogico - 44);

        ctx.save();
        ctx.textAlign = 'center';

        // --- RENDERIZACIÓN DE CRÉDITOS ---
        const startY = this.scrollY;

        // 1. Título del Juego
        ctx.fillStyle = '#ffd700';
        ctx.font = 'extrabold 38px "Outfit", sans-serif';
        ctx.fillText("SANGRE ORIENTAL", this.anchoLogico / 2, startY);

        ctx.fillStyle = '#c5a059';
        ctx.font = 'bold 20px "Outfit", sans-serif';
        ctx.fillText("LA REVOLUCIÓN CRUCEÑA", this.anchoLogico / 2, startY + 40);

        // 2. Rol: Desarrollo y Programación
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.fillText("DISEÑO Y PROGRAMACIÓN:", this.anchoLogico / 2, startY + 110);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'extrabold 28px "Outfit", sans-serif';
        ctx.fillText("JOEL", this.anchoLogico / 2, startY + 145); // Nombre del usuario

        // 3. Rol: Universidad
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.fillText("INSTITUCIÓN EDUCATIVA:", this.anchoLogico / 2, startY + 210);

        ctx.fillStyle = '#e0e0e0';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.fillText("UNIVERSIDAD TECNOLÓGICA PRIVADA DE SANTA CRUZ (UTEPSA)", this.anchoLogico / 2, startY + 245);

        // 4. Detalles Académicos
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.fillText("MATERIA Y FACULTAD:", this.anchoLogico / 2, startY + 310);

        ctx.fillStyle = '#c5a059';
        ctx.font = 'bold 18px "Outfit", sans-serif';
        ctx.fillText("Ingeniería en Sistemas - Desarrollo de Videojuegos II", this.anchoLogico / 2, startY + 345);

        ctx.fillStyle = '#e0e0e0';
        ctx.font = '14px "Outfit", sans-serif';
        ctx.fillText("Proyecto Académico de Simulación Histórica de la Independencia", this.anchoLogico / 2, startY + 375);

        // 5. Agradecimientos finales
        ctx.fillStyle = '#ffd700';
        ctx.font = 'italic 16px "Outfit", sans-serif';
        ctx.fillText("¡Gracias por liderar la revolución por nuestra libertad!", this.anchoLogico / 2, startY + 440);

        ctx.restore();

        // --- BOTÓN: REGRESAR AL MENÚ PRINCIPAL ---
        const btnW = 200;
        const btnH = 42;
        const btnX = this.anchoLogico / 2 - btnW / 2;
        const btnY = this.altoLogico - 90;

        ctx.save();
        ctx.fillStyle = 'rgba(12, 36, 26, 0.9)';
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 2;
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("VOLVER AL MENÚ", this.anchoLogico / 2, btnY + 26);
        ctx.restore();
    }

    /**
     * Maneja el clic en "VOLVER AL MENÚ".
     */
    onPointerDown(clickX, clickY) {
        const btnW = 200;
        const btnH = 42;
        const btnX = this.anchoLogico / 2 - btnW / 2;
        const btnY = this.altoLogico - 90;

        if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btnY && clickY <= btnY + btnH) {
            sonidos.playEfecto('assets/audio/click.mp3');
            sonidos.detenerMusica();

            import('./escenaPrincipal.js').then((module) => {
                const principal = new module.EscenaPrincipal(this.anchoLogico, this.altoLogico, this.motor);
                this.motor.setEscena(principal);
            });
        }
    }
}
