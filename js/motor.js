/**
 * Clase Motor - Maneja el ciclo de vida del juego (Game Loop),
 * el cálculo de deltaTime y la gestión de la escena activa.
 */
export class Motor {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.activo = false;
        this.pausado = false;
        this.ultimoTiempo = 0;
        this.escenaActiva = null;

        // Enlazar el método del bucle para mantener el contexto 'this'
        this.bucle = this.bucle.bind(this);
    }

    /**
     * Define la escena activa del juego.
     * @param {Object} escena - Objeto escena que debe implementar update(dt) y draw(ctx)
     */
    setEscena(escena) {
        this.escenaActiva = escena;
    }

    /**
     * Inicia el bucle de juego.
     */
    iniciar() {
        if (this.activo) return;
        this.activo = true;
        this.ultimoTiempo = performance.now();
        requestAnimationFrame(this.bucle);
        console.log("Motor de juego iniciado.");
    }

    /**
     * Detiene la ejecución del bucle de juego.
     */
    detener() {
        this.activo = false;
        console.log("Motor de juego detenido.");
    }

    /**
     * Alterna el estado de pausa.
     */
    alternarPausa() {
        this.pausado = !this.pausado;
        console.log(this.pausado ? "Juego Pausado" : "Juego Reanudado");
    }

    /**
     * Pausa el juego de manera explícita.
     */
    pausar() {
        this.pausado = true;
        console.log("Juego Pausado Explicito");
    }

    /**
     * Reanuda el juego de manera explícita.
     */
    reanudar() {
        this.pausado = false;
        console.log("Juego Reanudado Explicito");
    }

    /**
     * Bucle principal de ejecución (ejecutado en cada frame).
     * @param {number} tiempoActual - Marca de tiempo proporcionada por requestAnimationFrame
     */
    bucle(tiempoActual) {
        if (!this.activo) return;

        // Calcular deltaTime en segundos
        let dt = (tiempoActual - this.ultimoTiempo) / 1000;
        this.ultimoTiempo = tiempoActual;

        // Cota superior para dt (evita saltos gigantescos si el navegador se suspende)
        if (dt > 0.1) {
            dt = 0.1;
        }

        // Actualizar lógica si no está en pausa
        if (!this.pausado) {
            this.update(dt);
        }

        // Dibujar siempre (incluso en pausa, para renderizar la pantalla de pausa)
        this.draw();

        // Solicitar el próximo frame
        requestAnimationFrame(this.bucle);
    }

    /**
     * Actualiza la lógica de la escena activa.
     * @param {number} dt - Tiempo transcurrido en segundos
     */
    update(dt) {
        if (this.escenaActiva && typeof this.escenaActiva.update === 'function') {
            this.escenaActiva.update(dt);
        }
    }

    /**
     * Dibuja los gráficos de la escena activa.
     */
    draw() {
        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Renderizar escena activa
        if (this.escenaActiva && typeof this.escenaActiva.draw === 'function') {
            this.escenaActiva.draw(this.ctx);
        }
    }
}
