/**
 * Gestor de Audio - Controla la reproducción de música de fondo
 * y los efectos de sonido instantáneos, previniendo errores por políticas
 * de bloqueo de audio de navegadores y móviles.
 */
export class SonidoManager {
    constructor() {
        this.muted = false;
        this.musicaActual = null;
    }

    /**
     * Reproduce una melodía de fondo en bucle.
     * @param {string} src - Ruta del archivo de audio (ej: 'assets/audio/marcha.mp3')
     */
    playMusica(src) {
        if (this.muted) return;

        // Detener música previa
        this.detenerMusica();

        try {
            this.musicaActual = new Audio(src);
            this.musicaActual.loop = true;
            this.musicaActual.volume = 0.35; // Volumen de fondo suave
            
            // Los navegadores bloquean la reproducción automática hasta que el usuario interactúa
            this.musicaActual.play().catch(err => {
                console.warn("Reproducción automática de música bloqueada por el navegador. Se iniciará al interactuar.");
            });
        } catch (error) {
            console.error("No se pudo inicializar la música:", error);
        }
    }

    /**
     * Detiene la música de fondo.
     */
    detenerMusica() {
        if (this.musicaActual) {
            this.musicaActual.pause();
            this.musicaActual = null;
        }
    }

    /**
     * Reproduce un efecto de sonido instantáneo (disparo, espadazo, etc.).
     * @param {string} src - Ruta del archivo
     */
    playEfecto(src) {
        if (this.muted) return;

        try {
            const efecto = new Audio(src);
            efecto.volume = 0.55;
            efecto.play().catch(() => {
                // Silenciar errores asíncronos si el usuario no ha tocado la pantalla todavía
            });
        } catch (error) {
            // Prevenir cuelgues si los archivos assets no existen todavía
            console.log(`Efecto de sonido omitido (archivo no cargado): ${src}`);
        }
    }

    /**
     * Activa o desactiva todo el audio.
     */
    alternarMute() {
        this.muted = !this.muted;
        if (this.muted) {
            if (this.musicaActual) this.musicaActual.pause();
        } else {
            if (this.musicaActual) {
                this.musicaActual.play().catch(() => {});
            }
        }
        console.log(this.muted ? "Audio Silenciado" : "Audio Activado");
    }
}

// Exportar instancia única (Singleton) para reutilizar en todas las escenas
export const sonidos = new SonidoManager();
