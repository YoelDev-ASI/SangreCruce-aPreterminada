import { GestorPersonajes } from '../gestores/gestorPersonajes.js';
import { Minero } from '../entidades/minero.js';
import { Fusilero } from '../entidades/fusilero.js';
import { Miliciano } from '../entidades/miliciano.js';
import { Mina } from '../entidades/mina.js';
import { Base } from '../entidades/base.js';
import { GestorRecursos } from '../gestores/gestorRecursos.js';
import { renderMina, renderBase } from '../render/renderEscenario.js';
import { HudBatalla } from '../ui/hudBatalla.js';
import { IA } from '../ia/IA.js';
import { datosBatallas } from '../config/datosBatallas.js';
import { sonidos } from '../utilidades/sonidos.js';

// Importación de partículas (Fase 7)
import { SistemaParticulas } from '../render/efectos/sistemaParticulas.js';
import { crearSangre } from '../render/efectos/sangre.js';
import { crearHumo } from '../render/efectos/humo.js';
import { crearExplosion } from '../render/efectos/explosion.js';

/**
 * Clase EscenaBatalla - Escena de combate (Fase 8 - Ampliaciones Stick War).
 * Integra cola de reclutamiento (5s), límite de población (50), minería en 3 filas Y
 * con tope de 2 mineros por mina, y fusileros defensores de estatua inmunes en retirada.
 */
export class EscenaBatalla {
    /**
     * @param {number} anchoLogico 
     * @param {number} altoLogico 
     * @param {Motor} motor - Instancia del motor principal
     * @param {Object} datosMision - Configuración de la batalla histórica cargada
     */
    constructor(anchoLogico, altoLogico, motor, datosMision) {
        this.anchoLogico = anchoLogico;
        this.altoLogico = altoLogico;
        this.motor = motor;
        this.datosMision = datosMision;

        // Longitud real del campo de batalla horizontal (3000px)
        this.anchoMundo = 3000;
        this.cameraX = 0;
        this.maxCameraX = this.anchoMundo - this.anchoLogico; // 1720px

        // Estados de arrastre de cámara
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartCameraX = 0;

        // Definir altura del suelo
        this.sueloY = altoLogico - 110;

        // Instanciar gestores
        this.gestor = new GestorPersonajes();
        this.recursos = new GestorRecursos();
        this.particulas = new SistemaParticulas();

        // --- COLA DE ENTRENAMIENTO DE UNIDADES (Fase 8 - Ampliado) ---
        this.colaEntrenamiento = [];
        this.mostrarIntroMision = true; // Modal histórico introductorio antes de iniciar combates

        // Enlazar disparadores de efectos visuales y auditivos (Fase 7 & 8)
        this.gestor.onEfectoTrigger = (tipo, x, y, extra) => {
            if (tipo === 'sangre') {
                this.particulas.agregarParticulas(crearSangre(x, y));
                sonidos.playEfecto('assets/audio/golpe.mp3');
            } else if (tipo === 'humo') {
                this.particulas.agregarParticulas(crearHumo(x, y, extra));
                sonidos.playEfecto('assets/audio/disparo.mp3');
            } else if (tipo === 'explosion') {
                this.particulas.agregarParticulas(crearExplosion(x, y));
                sonidos.playEfecto('assets/audio/choque.mp3');
            }
        };

        // Crear las estructuras estáticas reubicadas en el mundo de 3000px
        this.basePatriota = new Base(100, this.sueloY, 'patriota');      // En x = 100
        this.baseRealista = new Base(this.anchoMundo - 100, this.sueloY, 'realista'); // En x = 2900

        // Crear 8 Minas fijas distribuidas en 3 filas horizontales (Fase 8 - Ampliado)
        this.minas = [
            // Sector Patriota (Cruceño) - 3 filas Y
            new Mina(400, this.sueloY - 20, 'patriota'),
            new Mina(520, this.sueloY + 20, 'patriota'),
            new Mina(640, this.sueloY - 10, 'patriota'),
            new Mina(760, this.sueloY + 10, 'patriota'),

            // Sector Realista (Español) - 3 filas Y
            new Mina(2240, this.sueloY - 20, 'realista'),
            new Mina(2360, this.sueloY + 20, 'realista'),
            new Mina(2480, this.sueloY - 10, 'realista'),
            new Mina(2600, this.sueloY + 10, 'realista')
        ];

        // Órdenes de mando militar
        this.mandoPatriota = 'DEFENDER';

        // Instanciar la IA Realista (Pasándole todas las minas para sus reclutas)
        this.iaRealista = new IA(
            'realista',
            this.recursos,
            this.gestor,
            this.baseRealista,
            this.basePatriota,
            this.minas,
            this.sueloY
        );

        // Configurar dificultad según la misión
        if (this.datosMision.dificultadRealista === 'dificil') {
            this.iaRealista.intervaloDecision = 1.4; // IA ágil
        } else {
            this.iaRealista.intervaloDecision = 3.2; // IA normal
        }

        // Instanciar el HUD táctico
        const uiContainer = document.getElementById('ui-container');
        this.hud = new HudBatalla(
            uiContainer,
            (tipoUnidad) => this.solicitarSpawnPatriota(tipoUnidad),
            (nuevoMando) => this.cambiarMandoPatriota(nuevoMando),
            (tipoUnidad) => this.cancelarSpawnPatriota(tipoUnidad)
        );

        // Variables de flujo de partida y rendimiento
        this.pantallaFinal = null;
        this.mostrarFps = 0;
        this.tiempoTranscurridoAcumulado = 0;
        this.framesAcumulados = 0;
        this.mostrarPausa = false;

        // Iniciar música
        sonidos.playMusica('assets/audio/musica/SonidoEscenaBatalla.mp3');

        // Inicializar escenario y tropas
        this.inicializarMision();
    }

    /**
     * Limpia el campo, reinicia la economía según la misión, y genera unidades iniciales.
     */
    inicializarMision() {
        this.gestor.limpiar();
        this.particulas.limpiar();
        this.recursos.reiniciar();
        this.colaEntrenamiento = [];
        this.pantallaFinal = null;
        this.mostrarPausa = false;
        this.cameraX = 0; // Iniciar en el extremo izquierdo

        // Asegurar que el contenedor HUD HTML sea visible al iniciar/reiniciar
        const uiContainer = document.getElementById('ui-container');
        if (uiContainer) {
            uiContainer.style.display = 'block';
        }

        // Limpiar todas las asignaciones de minas
        for (const m of this.minas) {
            m.minerosAsignados = [];
        }

        // Cargar oro inicial según la configuración histórica de la misión
        this.recursos.oro.patriota = this.datosMision.oroPatriota;
        this.recursos.oro.realista = this.datosMision.oroRealista;

        // Resetear salud de las bases
        this.basePatriota.hp = this.basePatriota.maxHp;
        this.basePatriota.estado = 'ALIVE';
        this.baseRealista.hp = this.baseRealista.maxHp;
        this.baseRealista.estado = 'ALIVE';

        // Resetear órdenes militares
        this.mandoPatriota = 'DEFENDER';
        if (this.iaRealista) {
            this.iaRealista.mando = 'DEFENDER';
        }

        // Reinicializar HUD
        if (this.hud) {
            this.hud.init();
        }

        console.log(`Inicializando la batalla: ${this.datosMision.nombre}`);

        // --- BANDO PATRIOTA ---
        const minasPatriotas = this.minas.filter(m => m.bando === 'patriota');
        // Asignar minero inicial a la primera mina
        const mineroPatriota = new Minero(180, this.sueloY, 'patriota', this.basePatriota, minasPatriotas[0]);
        this.gestor.agregarPersonaje(mineroPatriota);
        const milicianoPatriota = new Miliciano(220, this.sueloY, 'patriota');
        this.gestor.agregarPersonaje(milicianoPatriota);

        // --- BANDO REALISTA ---
        const minasRealistas = this.minas.filter(m => m.bando === 'realista');
        // Asignar minero inicial realista a la primera mina realista
        const mineroRealista = new Minero(this.baseRealista.x - 80, this.sueloY, 'realista', this.baseRealista, minasRealistas[0]);
        this.gestor.agregarPersonaje(mineroRealista);
        const milicianoRealista = new Miliciano(this.baseRealista.x - 120, this.sueloY, 'realista');
        this.gestor.agregarPersonaje(milicianoRealista);
    }

    /**
     * Encola la compra de tropas respetando el límite máximo de población de 50.
     * @param {string} tipoUnidad - 'minero' o 'fusilero'
     */
    solicitarSpawnPatriota(tipoUnidad) {
        if (this.pantallaFinal) return;

        // Validar límite máximo de población (vivos + en cola de entrenamiento)
        const popActual = this.gestor.personajes.filter(
            p => p.bando === 'patriota' && p.estado !== 'MUERTO' && !p.defensorEstatua
        ).length;

        if (popActual + this.colaEntrenamiento.length >= 50) {
            console.log("[HUD] Población máxima de 50 unidades alcanzada.");
            return;
        }

        let costo = 0;
        if (tipoUnidad === 'minero') costo = 150;
        else if (tipoUnidad === 'miliciano') costo = 100;
        else if (tipoUnidad === 'fusilero') costo = 300;

        if (this.recursos.restarOro('patriota', costo)) {
            // Añadir a la cola de entrenamiento de 5 segundos
            this.colaEntrenamiento.push({
                tipo: tipoUnidad,
                tiempo: 5.0,
                tiempoMax: 5.0
            });
            sonidos.playEfecto('assets/audio/spawn.mp3');
        }
    }

    /**
     * Cancela la última unidad encolada de un tipo específico (LIFO para ese tipo),
     * devuelve el oro correspondiente y limpia el progreso si se canceló la unidad activa.
     * @param {string} tipoUnidad - 'minero', 'miliciano' o 'fusilero'
     */
    cancelarSpawnPatriota(tipoUnidad) {
        if (this.pantallaFinal) return;

        // Buscar de atrás hacia adelante en la cola para cancelar la última agregada de este tipo
        for (let i = this.colaEntrenamiento.length - 1; i >= 0; i--) {
            if (this.colaEntrenamiento[i].tipo === tipoUnidad) {
                let costo = 0;
                if (tipoUnidad === 'minero') costo = 150;
                else if (tipoUnidad === 'miliciano') costo = 100;
                else if (tipoUnidad === 'fusilero') costo = 300;

                // Devolver el oro
                this.recursos.sumarOro('patriota', costo);

                // Remover de la cola
                this.colaEntrenamiento.splice(i, 1);

                sonidos.playEfecto('assets/audio/click.mp3');

                // Si cancelamos el elemento activo (índice 0) y el HUD existe, reiniciamos el progreso
                if (i === 0 && this.hud) {
                    this.hud.updateProgreso(null, 0);
                }
                break;
            }
        }
    }

    /**
     * Instancia físicamente la unidad en el escenario al completarse el entrenamiento.
     */
    ejecutarSpawnPatriota(tipoUnidad) {
        if (tipoUnidad === 'minero') {
            const minasPatriotas = this.minas.filter(m => m.bando === 'patriota');
            // La IA de minado auto-distribuirá al minero a una mina libre
            const nuevoMinero = new Minero(150, this.sueloY, 'patriota', this.basePatriota, null);
            this.gestor.agregarPersonaje(nuevoMinero);
            console.log("[HUD] Minero entrenado y desplegado.");
        } else if (tipoUnidad === 'miliciano') {
            const nuevoMiliciano = new Miliciano(70, this.sueloY, 'patriota');
            this.gestor.agregarPersonaje(nuevoMiliciano);
            console.log("[HUD] Miliciano entrenado y desplegado.");
        } else if (tipoUnidad === 'fusilero') {
            const nuevoFusilero = new Fusilero(70, this.sueloY, 'patriota');
            this.gestor.agregarPersonaje(nuevoFusilero);
            console.log("[HUD] Fusilero entrenado y desplegado.");
        }
    }

    /**
     * Actualiza la orden táctica del ejército del jugador.
     * Invoca a los 3 fusileros especiales de la estatua si se ordena retirada.
     * @param {string} nuevoMando - 'RETIRARSE', 'DEFENDER', 'ATACAR'
     */
    cambiarMandoPatriota(nuevoMando) {
        if (this.pantallaFinal) return;
        this.mandoPatriota = nuevoMando;
        sonidos.playEfecto('assets/audio/mando.mp3');

        // --- SISTEMA DE FUSILEROS DE ESTATUA EN RETIRADA ---
        if (nuevoMando === 'RETIRARSE') {
            // Contar si ya existen defensores activos
            const defensoresVivos = this.gestor.personajes.filter(
                p => p.bando === 'patriota' && p.defensorEstatua && p.estado !== 'MUERTO'
            ).length;

            if (defensoresVivos === 0) {
                // Instanciar exactamente 3 fusileros defensivos detrás de la base
                for (let i = 0; i < 3; i++) {
                    const xSpawn = 40 + i * 30; // Posicionamiento 40, 70, 100
                    const def = new Fusilero(xSpawn, this.sueloY, 'patriota');
                    def.defensorEstatua = true;
                    def.rangoAtaque = 600; // Rango de disparo aumentado (Fase 8 - Defensores Estatua)
                    // Asignar desvíos de formación Y para alinearse estáticamente
                    def.targetOffsetY = -20 + i * 15;
                    this.gestor.agregarPersonaje(def);
                }
                console.log("[HUD] Activados 3 fusileros protectores de la estatua.");
            }
        }
    }

    /**
     * Actualiza la lógica de la escena y procesa la cola de entrenamiento.
     */
    update(dt) {
        // Si está en pausa, no actualizar lógica
        if (this.mostrarPausa) return;

        // Calcular FPS
        this.framesAcumulados++;
        this.tiempoTranscurridoAcumulado += dt;
        if (this.tiempoTranscurridoAcumulado >= 0.5) {
            this.mostrarFps = Math.round(this.framesAcumulados / this.tiempoTranscurridoAcumulado);
            this.framesAcumulados = 0;
            this.tiempoTranscurridoAcumulado = 0;
        }

        // Pausar ticks del juego si la introducción de misión está activa (Fase 8)
        if (this.mostrarIntroMision) return;

        // --- PROCESAR COLA DE ENTRENAMIENTO (5 segundos) ---
        if (this.colaEntrenamiento.length > 0 && !this.pantallaFinal) {
            const item = this.colaEntrenamiento[0];
            item.tiempo -= dt;
            const progreso = 1.0 - (item.tiempo / item.tiempoMax);
            if (this.hud) {
                this.hud.updateProgreso(item.tipo, progreso);
            }
            if (item.tiempo <= 0) {
                this.colaEntrenamiento.shift();
                this.ejecutarSpawnPatriota(item.tipo);
                if (this.hud && this.colaEntrenamiento.length === 0) {
                    this.hud.updateProgreso(null, 0);
                }
            }
        } else {
            if (this.hud) {
                this.hud.updateProgreso(null, 0);
            }
        }

        // Si la partida terminó, solo actualizar partículas y cadáveres
        if (this.pantallaFinal) {
            this.gestor.update(dt, this.recursos, this.basePatriota, this.baseRealista, this.mandoPatriota, this.iaRealista.mando);
            this.particulas.update(dt);
            return;
        }

        // Actualizar IA Realista
        if (this.iaRealista) {
            this.iaRealista.update(dt);
        }

        // --- SISTEMA DE FUSILEROS DE ESTATUA PARA REALISTAS (Symmetric CPU Defense) ---
        if (this.iaRealista && this.iaRealista.mando === 'RETIRARSE') {
            const defRealistasVivos = this.gestor.personajes.filter(
                p => p.bando === 'realista' && p.defensorEstatua && p.estado !== 'MUERTO'
            ).length;

            if (defRealistasVivos === 0) {
                for (let i = 0; i < 3; i++) {
                    const xSpawn = 2960 - i * 30; // Posicionamiento 2960, 2930, 2900
                    const def = new Fusilero(xSpawn, this.sueloY, 'realista');
                    def.defensorEstatua = true;
                    def.rangoAtaque = 600; // Rango de disparo aumentado (Fase 8 - Defensores Estatua)
                    def.targetOffsetY = -20 + i * 15;
                    this.gestor.agregarPersonaje(def);
                }
                console.log("[IA REALISTA] Activados 3 fusileros protectores de la estatua Realista.");
            }
        }

        // Actualizar tropas
        this.gestor.update(dt, this.recursos, this.basePatriota, this.baseRealista, this.mandoPatriota, this.iaRealista.mando);

        // Actualizar partículas
        this.particulas.update(dt);

        // Actualizar HUD
        if (this.hud) {
            const popPatriota = this.gestor.personajes.filter(
                p => p.bando === 'patriota' && p.estado !== 'MUERTO' && !p.defensorEstatua
            ).length;
            this.hud.update(this.recursos.getOro('patriota'), popPatriota + this.colaEntrenamiento.length, this.colaEntrenamiento);
        }

        // --- DETECCIÓN DE FIN DE JUEGO ---
        if (this.baseRealista.estado === 'DESTROYED') {
            this.pantallaFinal = 'VICTORIA';
            sonidos.detenerMusica();
            sonidos.playEfecto('assets/audio/victoria.mp3');
            if (this.hud) this.hud.limpiar();

            // --- GUARDAR PROGRESO DE CAMPAÑA (Fase 8) ---
            const completados = JSON.parse(localStorage.getItem('sangre_oriental_completados')) || [];
            if (!completados.includes(this.datosMision.id)) {
                completados.push(this.datosMision.id);
                localStorage.setItem('sangre_oriental_completados', JSON.stringify(completados));
            }

            const nivelMax = parseInt(localStorage.getItem('sangre_oriental_nivel_max')) || 1;
            if (this.datosMision.nivel === nivelMax && nivelMax < 5) {
                localStorage.setItem('sangre_oriental_nivel_max', (nivelMax + 1).toString());
            }
        } else if (this.basePatriota.estado === 'DESTROYED') {
            this.pantallaFinal = 'DERROTA';
            sonidos.detenerMusica();
            sonidos.playEfecto('assets/audio/derrota.mp3');
            if (this.hud) this.hud.limpiar();
        }
    }

    /**
     * Dibuja los gráficos del juego aplicando el desplazamiento de la cámara en el mundo scrollable.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D
     */
    draw(ctx) {
        // --- 1. ELEMENTOS DESPLAZABLES (Mundo de 3000px) ---
        ctx.save();
        ctx.translate(-this.cameraX, 0);

        // Dibujar fondo degradado extendido a 3000px
        const gradiente = ctx.createLinearGradient(0, 0, 0, this.altoLogico);
        gradiente.addColorStop(0, '#101018');
        gradiente.addColorStop(1, '#191924');
        ctx.fillStyle = gradiente;
        ctx.fillRect(0, 0, this.anchoMundo, this.altoLogico);

        // Dibujar cuadrícula extendida a 3000px
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.04)';
        ctx.lineWidth = 1;
        const gridSpacing = 80;
        for (let x = 0; x < this.anchoMundo; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.altoLogico);
            ctx.stroke();
        }
        for (let y = 0; y < this.altoLogico; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.anchoMundo, y);
            ctx.stroke();
        }

        // Dibujar suelo extendido a 3000px
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, this.sueloY);
        ctx.lineTo(this.anchoMundo, this.sueloY);
        ctx.stroke();

        ctx.fillStyle = '#0f0f13';
        ctx.fillRect(0, this.sueloY + 2, this.anchoMundo, this.altoLogico - this.sueloY);

        // Dibujar estructuras
        renderBase(ctx, this.basePatriota);
        renderBase(ctx, this.baseRealista);

        // Dibujar las 8 Minas distribuidas en 3 filas Y
        for (const m of this.minas) {
            renderMina(ctx, m);
        }

        // Dibujar unidades (Y-sorted por profundidad dentro del gestor)
        this.gestor.draw(ctx);

        // Dibujar partículas sobre las unidades
        this.particulas.draw(ctx);

        ctx.restore(); // Finalizar espacio desplazable

        // --- 2. ELEMENTOS ESTÁTICOS FIJOS (HUD e Interfaz sobre el visor) ---
        // Dibujar HUD de Oro y Población Patriota (Solo si sigue activa)
        if (!this.pantallaFinal) {
            const popPatriota = this.gestor.personajes.filter(p => p.bando === 'patriota' && p.estado !== 'MUERTO' && !p.defensorEstatua).length;

            ctx.save();
            ctx.fillStyle = 'rgba(12, 12, 20, 0.85)';
            ctx.strokeStyle = '#c5a059';
            ctx.lineWidth = 2;

            const boxW = 220;
            const boxH = 45;
            // Botón de pausa empieza en this.anchoLogico - 110 = 1170.
            // Queremos el cuadro a 40px a la izquierda de la pausa.
            const boxX = (this.anchoLogico - 110) - 40 - boxW; // 910
            const boxY = 15;

            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.strokeRect(boxX, boxY, boxW, boxH);

            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 14px "Outfit", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`Patriotas: ${this.recursos.getOro('patriota')} Oro (${popPatriota}/50)`, boxX + boxW / 2, boxY + 27);
            ctx.restore();
        }

        // Dibujar botón de pausa (estilo premium en el lado superior derecho)
        if (!this.pantallaFinal && !this.mostrarIntroMision) {
            this.dibujarBoton(ctx, this.anchoLogico - 110, 15, 80, 45, "PAUSA", '#c5a059', '#ffffff');
        }

        // Indicador de posición de cámara para celulares
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = '10px monospace';
        ctx.fillText(`Cámara X: ${Math.round(this.cameraX)}px / ${this.maxCameraX}px (Arrastra para desplazar)`, this.anchoLogico - 300, this.altoLogico - 30);

        // Renderizado de pantalla final o intro de misión o menú de pausa
        if (this.pantallaFinal) {
            this.drawPantallaFinal(ctx);
        } else if (this.mostrarPausa) {
            this.drawPausa(ctx);
        } else if (this.mostrarIntroMision) {
            this.drawIntroMision(ctx);
        }
    }

    /**
     * Dibuja la caja de veredicto con los botones correspondientes (3 para victoria, 2 para derrota).
     */
    drawPantallaFinal(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(8, 8, 12, 0.82)';
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        const boxW = 660;
        const boxH = 320;
        const boxX = this.anchoLogico / 2 - boxW / 2;
        const boxY = this.altoLogico / 2 - boxH / 2;

        ctx.fillStyle = 'rgba(23, 23, 33, 0.95)';
        ctx.strokeStyle = this.pantallaFinal === 'VICTORIA' ? '#c5a059' : '#b22222';
        ctx.lineWidth = 4;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        ctx.textAlign = 'center';

        if (this.pantallaFinal === 'VICTORIA') {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 30px "Outfit", sans-serif';
            ctx.fillText("¡VICTORIA PATRIOTA!", this.anchoLogico / 2, boxY + 60);

            ctx.fillStyle = '#e0e0e0';
            ctx.font = '15px "Outfit", sans-serif';

            let descVictoria = "Santa Cruz de la Sierra proclama su libertad del yugo español. Las fuerzas de la revolución cruceña han derribado la fortaleza realista en esta batalla histórica.";
            if (this.datosMision.nivel === 5) {
                descVictoria = "¡FELICIDADES COMANDANTE! Has completado todas las batallas históricas y liberado definitivamente a Santa Cruz de la Sierra de la Corona Española. La Sangre Oriental prevalece.";
            }

            this.dibujarTextoMultilinea(ctx, descVictoria, this.anchoLogico / 2, boxY + 110, 560, 24);

            // 3 Botones de acción horizontales para la Victoria
            const btnY = boxY + 240;
            const btnW = 180;
            const btnH = 42;

            // Botón 1: REINTENTAR (Izquierda)
            const btn1X = this.anchoLogico / 2 - 280;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.fillRect(btn1X, btnY, btnW, btnH);
            ctx.strokeRect(btn1X, btnY, btnW, btnH);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Outfit", sans-serif';
            ctx.fillText("REINTENTAR", btn1X + btnW / 2, btnY + 26);

            // Botón 2: SIGUIENTE NIVEL / VER CRÉDITOS (Centro)
            const btn2X = this.anchoLogico / 2 - 90;
            ctx.fillStyle = '#1b5e20'; // Verde bosque
            ctx.strokeStyle = '#c5a059';
            ctx.fillRect(btn2X, btnY, btnW, btnH);
            ctx.strokeRect(btn2X, btnY, btnW, btnH);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Outfit", sans-serif';
            const textoBoton2 = this.datosMision.nivel < 5 ? "SIGUIENTE NIVEL" : "VER CRÉDITOS";
            ctx.fillText(textoBoton2, btn2X + btnW / 2, btnY + 26);

            // Botón 3: REGRESAR AL MAPA (Derecha)
            const btn3X = this.anchoLogico / 2 + 100;
            ctx.fillStyle = '#8b2500'; // Rojo colonial
            ctx.strokeStyle = '#c5a059';
            ctx.fillRect(btn3X, btnY, btnW, btnH);
            ctx.strokeRect(btn3X, btnY, btnW, btnH);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Outfit", sans-serif';
            ctx.fillText("REGRESAR AL MAPA", btn3X + btnW / 2, btnY + 26);

        } else {
            ctx.fillStyle = '#ff4d4d';
            ctx.font = 'bold 30px "Outfit", sans-serif';
            ctx.fillText("¡DERROTA REVOLUCIONARIA!", this.anchoLogico / 2, boxY + 60);

            ctx.fillStyle = '#e0e0e0';
            ctx.font = '15px "Outfit", sans-serif';
            this.dibujarTextoMultilinea(ctx,
                "Las experimentadas tropas de la Corona Española dirigidas por el brigadier Francisco Javier Aguilera han sofocado la revolución cruceña, destruyendo tus defensas. Reorganiza tus milicias y vuelve a intentarlo.",
                this.anchoLogico / 2, boxY + 110, 540, 24
            );

            // 2 Botones tradicionales para la Derrota
            const btnY = boxY + 240;
            const btnW = 190;
            const btnH = 42;

            // Botón 1: REINTENTAR (Izquierda)
            const btn1X = this.anchoLogico / 2 - 210;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            ctx.fillRect(btn1X, btnY, btnW, btnH);
            ctx.strokeRect(btn1X, btnY, btnW, btnH);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px "Outfit", sans-serif';
            ctx.fillText("REINTENTAR", btn1X + btnW / 2, btnY + 26);

            // Botón 2: REGRESAR AL MAPA (Derecha)
            const btn2X = this.anchoLogico / 2 + 20;
            ctx.fillStyle = '#8b2500';
            ctx.strokeStyle = '#c5a059';
            ctx.fillRect(btn2X, btnY, btnW, btnH);
            ctx.strokeRect(btn2X, btnY, btnW, btnH);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px "Outfit", sans-serif';
            ctx.fillText("REGRESAR AL MAPA", btn2X + btnW / 2, btnY + 26);
        }

        ctx.restore();
    }

    /**
     * Dibuja la ventana emergente con la introducción histórica de la misión.
     */
    drawIntroMision(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(8, 8, 12, 0.85)';
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        const boxW = 560;
        const boxH = 340;
        const boxX = this.anchoLogico / 2 - boxW / 2;
        const boxY = this.altoLogico / 2 - boxH / 2;

        // Caja de pergamino central
        ctx.fillStyle = '#fffdf3';
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 4;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        ctx.textAlign = 'center';

        // Título de la Batalla
        ctx.fillStyle = '#8b2500';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.fillText(this.datosMision.nombre.toUpperCase(), this.anchoLogico / 2, boxY + 45);

        // Fecha de la batalla
        ctx.fillStyle = '#5c3a21';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`Fecha: ${this.datosMision.fecha}`, this.anchoLogico / 2, boxY + 72);

        // Línea decorativa
        ctx.strokeStyle = 'rgba(139, 90, 43, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.anchoLogico / 2 - 160, boxY + 90);
        ctx.lineTo(this.anchoLogico / 2 + 160, boxY + 90);
        ctx.stroke();

        // Descripción de introducción
        ctx.fillStyle = '#3a2211';
        ctx.font = 'bold 15px "Outfit", sans-serif';
        this.dibujarTextoMultilinea(ctx,
            this.datosMision.introTexto,
            this.anchoLogico / 2, boxY + 125, 480, 24
        );

        // Botón: CONTINUAR
        const btnW = 180;
        const btnH = 42;
        const btnX = this.anchoLogico / 2 - btnW / 2;
        const btnY = boxY + 260;

        ctx.fillStyle = '#1b5e20'; // Verde patriota
        ctx.strokeStyle = '#c5a059';
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px "Outfit", sans-serif';
        ctx.fillText("CONTINUAR", this.anchoLogico / 2, btnY + 26);

        ctx.restore();
    }

    /**
     * Dibuja el modal de Pausa.
     */
    drawPausa(ctx) {
        ctx.save();
        // Velo oscuro
        ctx.fillStyle = 'rgba(8, 8, 12, 0.7)';
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        const w = 350;
        const h = 280;
        const x = this.anchoLogico / 2 - w / 2;
        const y = this.altoLogico / 2 - h / 2;

        // Caja de fondo
        ctx.fillStyle = '#171721';
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 3;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        // Título "JUEGO PAUSADO"
        ctx.textAlign = 'center';
        ctx.fillStyle = '#c5a059';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.fillText("JUEGO PAUSADO", this.anchoLogico / 2, y + 45);

        // Línea decorativa
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.25)';
        ctx.beginPath();
        ctx.moveTo(x + 40, y + 65);
        ctx.lineTo(x + w - 40, y + 65);
        ctx.stroke();

        // Botón: CONTINUAR
        this.dibujarBoton(ctx, x + 45, y + 90, 260, 42, "CONTINUAR", '#1b5e20', '#ffffff');

        // Botón: REINICIAR
        this.dibujarBoton(ctx, x + 45, y + 145, 260, 42, "REINICIAR", 'rgba(255, 255, 255, 0.08)', '#ffffff');

        // Botón: SALIR (Vuelve a EscenaMapa)
        this.dibujarBoton(ctx, x + 45, y + 200, 260, 42, "SALIR", '#8b2500', '#ffffff');

        ctx.restore();
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
     * Dibuja texto respetando saltos de línea para el ancho disponible.
     */
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

    /**
     * Recibe eventos de pulsado del puntero (Pointer Down)
     */
    onPointerDown(clickX, clickY) {
        // A. Clic en el botón "CONTINUAR" de la introducción histórica
        if (this.mostrarIntroMision) {
            const boxY = this.altoLogico / 2 - 340 / 2;
            const btnW = 180;
            const btnH = 42;
            const btnX = this.anchoLogico / 2 - btnW / 2;
            const btnY = boxY + 260;

            if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.mostrarIntroMision = false;
            }
            return;
        }

        // B. Si la partida ha terminado, evaluar botones
        if (this.pantallaFinal) {
            const btnY = (this.altoLogico / 2 - 320 / 2) + 240;

            if (this.pantallaFinal === 'VICTORIA') {
                const btnW = 180;
                const btnH = 42;

                const btn1X = this.anchoLogico / 2 - 280; // Reintentar
                const btn2X = this.anchoLogico / 2 - 90;  // Siguiente nivel / Ver créditos
                const btn3X = this.anchoLogico / 2 + 100; // Regresar al mapa

                // Clic Reintentar
                if (clickX >= btn1X && clickX <= btn1X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                    sonidos.playEfecto('assets/audio/click.mp3');
                    this.inicializarMision();
                    return;
                }

                // Clic Siguiente Nivel / Créditos
                if (clickX >= btn2X && clickX <= btn2X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                    sonidos.playEfecto('assets/audio/click.mp3');
                    if (this.datosMision.nivel < 5) {
                        const nextMission = datosBatallas.find(m => m.nivel === this.datosMision.nivel + 1);
                        if (nextMission) {
                            const batalla = new EscenaBatalla(this.anchoLogico, this.altoLogico, this.motor, nextMission);
                            this.motor.setEscena(batalla);
                        }
                    } else {
                        // Fin de Campaña: Ir a escena de créditos finales
                        sonidos.detenerMusica();
                        if (this.hud) this.hud.limpiar();
                        import('./escenaCreditos.js').then((module) => {
                            const creditos = new module.EscenaCreditos(this.anchoLogico, this.altoLogico, this.motor);
                            this.motor.setEscena(creditos);
                        });
                    }
                    return;
                }

                // Clic Regresar al Mapa
                if (clickX >= btn3X && clickX <= btn3X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                    sonidos.playEfecto('assets/audio/click.mp3');
                    sonidos.detenerMusica();
                    if (this.hud) this.hud.limpiar();
                    import('./EscenaMapa.js').then((module) => {
                        const mapa = new module.EscenaMapa(this.anchoLogico, this.altoLogico, this.motor);
                        this.motor.setEscena(mapa);
                    });
                    return;
                }
            } else {
                // Derrota (2 botones estándar)
                const btnW = 190;
                const btnH = 42;
                const btn1X = this.anchoLogico / 2 - 210; // Reintentar
                const btn2X = this.anchoLogico / 2 + 20;  // Regresar

                if (clickX >= btn1X && clickX <= btn1X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                    sonidos.playEfecto('assets/audio/click.mp3');
                    this.inicializarMision();
                    return;
                }

                if (clickX >= btn2X && clickX <= btn2X + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                    sonidos.playEfecto('assets/audio/click.mp3');
                    sonidos.detenerMusica();
                    if (this.hud) this.hud.limpiar();
                    import('./EscenaMapa.js').then((module) => {
                        const mapa = new module.EscenaMapa(this.anchoLogico, this.altoLogico, this.motor);
                        this.motor.setEscena(mapa);
                    });
                    return;
                }
            }
            return;
        }

        // Evaluar clics dentro del menú de pausa si está activo
        if (this.mostrarPausa) {
            const modalW = 350;
            const modalH = 280;
            const modalX = this.anchoLogico / 2 - modalW / 2;
            const modalY = this.altoLogico / 2 - modalH / 2;

            const btnX = modalX + 45;
            const btnW = 260;
            const btnH = 42;

            // 1. CONTINUAR
            const btn1Y = modalY + 90;
            if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btn1Y && clickY <= btn1Y + btnH) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.mostrarPausa = false;
                const uiContainer = document.getElementById('ui-container');
                if (uiContainer) uiContainer.style.display = 'block';
                return;
            }

            // 2. REINICIAR
            const btn2Y = modalY + 145;
            if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btn2Y && clickY <= btn2Y + btnH) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.mostrarPausa = false;
                const uiContainer = document.getElementById('ui-container');
                if (uiContainer) uiContainer.style.display = 'block';
                this.inicializarMision();
                return;
            }

            // 3. SALIR (vuelve a EscenaMapa)
            const btn3Y = modalY + 200;
            if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btn3Y && clickY <= btn3Y + btnH) {
                sonidos.playEfecto('assets/audio/click.mp3');
                sonidos.detenerMusica();
                this.mostrarPausa = false;
                if (this.hud) this.hud.limpiar();
                const uiContainer = document.getElementById('ui-container');
                if (uiContainer) uiContainer.style.display = 'block';
                import('./EscenaMapa.js').then((module) => {
                    const mapa = new module.EscenaMapa(this.anchoLogico, this.altoLogico, this.motor);
                    this.motor.setEscena(mapa);
                });
                return;
            }
            return;
        }

        // Evaluar clic en botón PAUSA (x = anchoLogico - 110, y = 15, w = 80, h = 45)
        if (!this.pantallaFinal && !this.mostrarIntroMision) {
            const pauseBtnX = this.anchoLogico - 110;
            const pauseBtnY = 15;
            const pauseBtnW = 80;
            const pauseBtnH = 45;

            if (clickX >= pauseBtnX && clickX <= pauseBtnX + pauseBtnW && clickY >= pauseBtnY && clickY <= pauseBtnY + pauseBtnH) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.mostrarPausa = true;
                const uiContainer = document.getElementById('ui-container');
                if (uiContainer) uiContainer.style.display = 'none';
                return;
            }
        }

        // Ignorar toques sobre la botonera del HUD superior
        if (clickY < 90) return;

        // C. Iniciar arrastre (Drag) de la cámara en combate activo
        this.isDragging = true;
        this.dragStartX = clickX;
        this.dragStartCameraX = this.cameraX;
    }

    /**
     * Recibe eventos de movimiento del puntero (Pointer Move)
     */
    onPointerMove(clickX, clickY) {
        if (this.isDragging && !this.pantallaFinal) {
            // Multiplicador de sensibilidad de arrastre (Fase 8 - Móvil)
            const sensibilidad = 2.2;
            const deltaX = (clickX - this.dragStartX) * sensibilidad;
            this.cameraX = this.dragStartCameraX - deltaX;
            // Clampear la cámara para que no se salga de los límites del mapa (0px a 1720px)
            this.cameraX = Math.max(0, Math.min(this.maxCameraX, this.cameraX));
        }
    }

    /**
     * Recibe eventos de soltado del puntero (Pointer Up)
     */
    onPointerUp() {
        this.isDragging = false;
    }
}
