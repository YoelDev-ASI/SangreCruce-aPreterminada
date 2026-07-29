import { Personaje } from './personaje.js';

/**
 * Clase Minero - Unidad pacífica de recolección de recursos.
 * Navega en 2D en las 3 filas de minas. No ataca ni se defiende.
 * Respeta el límite de 2 mineros por mina, auto-distribuyéndose o esperando.
 */
export class Minero extends Personaje {
    constructor(x, y, bando, base, mina) {
        super(x, y, bando, {
            hp: 80,
            velocidad: 80,
            rangoAtaque: 0, // Sin rango de combate
            danio: 0,
            cooldownAtaqueMax: 999, // Sin cooldown
            ancho: 30,
            alto: 60
        });

        this.tipo = 'minero';
        this.base = base;
        this.mina = mina;

        // Registrar asignación inicial en la mina
        if (this.mina) {
            this.mina.asignarMinero(this);
        }

        this.recursosCargando = 0;
        this.capacidadCarga = 160;
        this.tiempoMinadoAcumulado = 0;
        this.tiempoMinadoMax = 2.5;

        this.estado = 'CAMINANDO_A_MINA';
        this.anguloPico = 0;

        this.textoFlotante = null;
        this.textoFlotanteTimer = 0;

        this.tiempoChequeoMina = 0; // Temporizador para buscar minas libres
    }

    /**
     * Sobrescribe el update para manejar el flujo pacífico, 2D Path y límites.
     */
    update(dt, gestorRecursos, baseAliada, baseEnemiga, mandoEjercito = 'DEFENDER') {
        if (this.textoFlotanteTimer > 0) {
            this.textoFlotanteTimer -= dt;
        }

        // Llamar a Personaje (procesa curación y retiro fuera del mapa)
        super.update(dt, gestorRecursos, baseAliada, baseEnemiga, mandoEjercito);

        if (this.estado === 'MUERTO') {
            // Liberar mina al morir
            if (this.mina) {
                this.mina.desasignarMinero(this);
                this.mina = null;
            }
            return;
        }

        // --- MANEJO DE RETIRADA EN MINEROS ---
        if (mandoEjercito === 'RETIRARSE') {
            if (this.mina) {
                this.mina.desasignarMinero(this);
                this.mina = null;
            }

            if (this.guarecido) return;

            // Si trae oro, marchar a base a descargarlo
            if (this.recursosCargando > 0) {
                this.estado = 'REGRESANDO_A_BASE';
            } else {
                // Irse del mapa
                this.estado = 'CAMINANDO';
                this.destinoX = this.bando === 'patriota' ? -100 : 3100;
                
                // Mover horizontalmente hacia el borde de escape
                const dir = Math.sign(this.destinoX - this.x);
                this.x += this.velocidad * dir * dt;
                
                // Retornar suavemente al suelo Y base
                const dy = this.sueloY - this.y;
                if (Math.abs(dy) > 2) {
                    this.y += this.velocidad * Math.sign(dy) * dt;
                }
                return;
            }
        }

        // --- IA DE BÚSQUEDA Y LÍMITE DE MINEROS ---
        if (mandoEjercito !== 'RETIRARSE' && !this.guarecido) {
            this.tiempoChequeoMina += dt;
            
            // Buscar mina libre si no tiene o la suya está saturada
            if (!this.mina || !this.mina.minerosAsignados.includes(this) || this.mina.minerosAsignados.length > 2) {
                if (this.tiempoChequeoMina >= 1.0) {
                    this.tiempoChequeoMina = 0;
                    this.buscarMinaDisponible(baseAliada);
                }
            }

            // Si está en espera, caminar a zona de guardia
            if (this.estado === 'ESPERANDO_MINA') {
                const waitX = this.base.x + (this.bando === 'patriota' ? 120 : -120);
                const dx = waitX - this.x;
                const dy = this.sueloY - this.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 5) {
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * this.velocidad * dt;
                    this.y += Math.sin(angle) * this.velocidad * dt;
                }
                return;
            }
        }

        // Ciclo normal de recolección en 2D
        if (this.estado === 'CAMINANDO_A_MINA') {
            this.irAMina(dt);
        } else if (this.estado === 'MINANDO') {
            this.minar(dt);
        } else if (this.estado === 'REGRESANDO_A_BASE') {
            this.irABase(dt, gestorRecursos);
        }
    }

    /**
     * Busca una mina de su bando que tenga menos de 2 mineros asignados.
     */
    buscarMinaDisponible(baseAliada) {
        // Acceder a la lista de minas de la escena activa (guardada en el motor global o window)
        const escena = window.gameEngine ? window.gameEngine.escenaActiva : null;
        if (!escena || !escena.minas) return;

        const minasBando = escena.minas.filter(m => m.bando === this.bando);
        let minaLibre = null;

        for (const m of minasBando) {
            if (m.tieneEspacio()) {
                minaLibre = m;
                break;
            }
        }

        if (minaLibre) {
            if (this.mina) {
                this.mina.desasignarMinero(this);
            }
            this.mina = minaLibre;
            this.mina.asignarMinero(this);
            this.estado = this.recursosCargando > 0 ? 'REGRESANDO_A_BASE' : 'CAMINANDO_A_MINA';
            console.log(`[MINERO ${this.bando.toUpperCase()}] Asignado a mina en x: ${this.mina.x}`);
        } else {
            // Ir a base a esperar
            if (this.mina) {
                this.mina.desasignarMinero(this);
                this.mina = null;
            }
            this.estado = 'ESPERANDO_MINA';
        }
    }

    /**
     * Se desplaza vectorialmente en 2D hacia la mina asignada.
     */
    irAMina(dt) {
        if (!this.mina) {
            this.estado = 'ESPERANDO_MINA';
            return;
        }

        const dx = this.mina.x - this.x;
        const dy = this.mina.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist <= 10) {
            this.estado = 'MINANDO';
            this.tiempoMinadoAcumulado = 0;
            this.x = this.mina.x;
            this.y = this.mina.y;
        } else {
            const angle = Math.atan2(dy, dx);
            this.destinoX = this.mina.x;
            this.x += Math.cos(angle) * this.velocidad * dt;
            this.y += Math.sin(angle) * this.velocidad * dt;
        }
    }

    /**
     * Extrae mineral.
     */
    minar(dt) {
        this.anguloPico = Math.sin(Date.now() * 0.015) * 0.7;

        this.tiempoMinadoAcumulado += dt;
        if (this.tiempoMinadoAcumulado >= this.tiempoMinadoMax) {
            this.recursosCargando = this.capacidadCarga;
            this.estado = 'REGRESANDO_A_BASE';
            this.anguloPico = 0;
            
            // Liberar slot de minado al emprender retorno para dejar que otro mine mientras camina
            if (this.mina) {
                this.mina.desasignarMinero(this);
            }
        }
    }

    /**
     * Regresa vectorialmente en 2D a la base a depositar oro.
     */
    irABase(dt, gestorRecursos) {
        if (!this.base) return;

        const dx = this.base.x - this.x;
        const dy = this.sueloY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= 15) {
            if (gestorRecursos) {
                gestorRecursos.sumarOro(this.bando, this.recursosCargando);
            }

            this.textoFlotante = `+${this.recursosCargando} Oro`;
            this.textoFlotanteTimer = 1.2;
            this.recursosCargando = 0;

            // Retornar al trabajo buscando mina libre
            this.buscarMinaDisponible(this.base);
        } else {
            const angle = Math.atan2(dy, dx);
            this.destinoX = this.base.x;
            this.x += Math.cos(angle) * this.velocidad * dt;
            this.y += Math.sin(angle) * this.velocidad * dt;
        }
    }

    /**
     * Omitir ataque completamente (IA Pacífica).
     */
    atacar(dt) {
        this.estado = 'CAMINANDO';
    }
}
