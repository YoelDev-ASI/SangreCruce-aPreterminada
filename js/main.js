import { Motor } from './motor.js';
import { EscenaPrincipal } from './escenas/escenaPrincipal.js'; // Arrancar con el Menú Principal (Fase 8 - Ampliación)

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error("No se encontró el elemento canvas del juego.");
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("No se pudo obtener el contexto 2D del canvas.");
        return;
    }

    // Resolución lógica del juego (16:9 constante)
    const ANCHO_LOGICO = 1280;
    const ALTO_LOGICO = 720;

    // Configurar resolución interna fija del canvas
    canvas.width = ANCHO_LOGICO;
    canvas.height = ALTO_LOGICO;

    console.log(`Resolución de pantalla lógica configurada a: ${ANCHO_LOGICO}x${ALTO_LOGICO}`);

    // Instanciar el motor de juego
    const motor = new Motor(canvas, ctx);

    // Definir funciones globales de pausa/reanudar para el sistema de orientación
    window.pausarJuego = () => {
        motor.pausar();
    };
    window.reanudarJuego = () => {
        motor.reanudar();
    };

    // Instanciar la escena del menú principal (Pasándole la referencia del motor para transiciones)
    const escenaPrincipal = new EscenaPrincipal(ANCHO_LOGICO, ALTO_LOGICO, motor);

    // Asignar la escena y arrancar el motor
    motor.setEscena(escenaPrincipal);
    motor.iniciar();

    // Si orientacion.js detectó orientación incorrecta al arrancar, pausar el juego de entrada
    if (window.juegoDebeEmpezarPausado) {
        motor.pausar();
    }

    // Capturar eventos de ratón/toque (Pointer Events) y transformarlos a coordenadas lógicas
    canvas.addEventListener('pointerdown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickXFisico = e.clientX - rect.left;
        const clickYFisico = e.clientY - rect.top;

        const clickXLogico = (clickXFisico / rect.width) * ANCHO_LOGICO;
        const clickYLogico = (clickYFisico / rect.height) * ALTO_LOGICO;

        if (motor.escenaActiva && typeof motor.escenaActiva.onPointerDown === 'function') {
            motor.escenaActiva.onPointerDown(clickXLogico, clickYLogico);
        }
    });

    canvas.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickXFisico = e.clientX - rect.left;
        const clickYFisico = e.clientY - rect.top;

        const clickXLogico = (clickXFisico / rect.width) * ANCHO_LOGICO;
        const clickYLogico = (clickYFisico / rect.height) * ALTO_LOGICO;

        if (motor.escenaActiva && typeof motor.escenaActiva.onPointerMove === 'function') {
            motor.escenaActiva.onPointerMove(clickXLogico, clickYLogico);
        }
    });

    canvas.addEventListener('pointerup', (e) => {
        if (motor.escenaActiva && typeof motor.escenaActiva.onPointerUp === 'function') {
            motor.escenaActiva.onPointerUp();
        }
    });

    // Guardar referencia en window para depuración
    window.gameEngine = motor;
});
