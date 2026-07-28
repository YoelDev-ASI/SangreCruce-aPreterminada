/**
 * Clase Base Personaje - Define los atributos, física y lógica táctica
 * para todas las unidades, con soporte para lerp de formaciones,
 * guarniciones fuera de pantalla y defensores de estatua.
 */
export class Personaje {
    constructor(x, y, bando, config = {}) {
        this.x = x;
        this.y = y;
        this.sueloY = y; // Guarda la altura de referencia del suelo para movimientos 2D
        this.bando = bando;

        this.hp = config.hp || 100;
        this.maxHp = this.hp;
        this.velocidad = config.velocidad || 80;
        this.rangoAtaque = config.rangoAtaque || 50;
        this.danio = config.danio || 10;
        this.cooldownAtaqueMax = config.cooldownAtaqueMax || 1.5;

        this.ancho = config.ancho || 30;
        this.alto = config.alto || 60;

        this.estado = 'CAMINANDO';
        this.cooldownAtaque = 0;
        this.objetivo = null;

        // Desaparición de cadáveres
        this.tiempoMuerte = 0;
        this.tiempoDesaparicion = 2.0;

        // --- SISTEMA DE FORMACIONES DINÁMICAS Y SUAVES (Lerpeadas) ---
        this.offsetX = 0;
        this.offsetY = 0;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;

        // --- SISTEMA DE RETIRADA Y DEFENSORES DE ESTATUA ---
        this.guarecido = false;       // Unidad oculta fuera del mapa
        this.defensorEstatua = false;  // Fusilero especial de defensa trasera

        // Destino lúdico de movimiento
        this.destinoX = x;
    }

    /**
     * Actualiza el estado y movimiento de la unidad.
     */
    update(dt, gestorRecursos, baseAliada, baseEnemiga, mandoEjercito = 'DEFENDER') {
        if (this.estado === 'MUERTO') {
            this.tiempoMuerte += dt;
            return;
        }

        // Reducir recarga de ataque
        if (this.cooldownAtaque > 0) {
            this.cooldownAtaque -= dt;
        }

        // Interpolación suave (Lerp) de las coordenadas de formación para transiciones fluidas
        this.offsetX += (this.targetOffsetX - this.offsetX) * 4.0 * dt;
        this.offsetY += (this.targetOffsetY - this.offsetY) * 4.0 * dt;

        // Si no está guarecido, interpolar la posición Y real hacia sueloY + offsetY (Fase 8 - Formación 4 Filas)
        if (!this.guarecido) {
            this.y += ((this.sueloY + this.offsetY) - this.y) * 4.0 * dt;
        }

        // --- COMPORTAMIENTO DE LOS DEFENSORES DE ESTATUA ---
        if (this.defensorEstatua) {
            if (mandoEjercito === 'RETIRARSE') {
                // Posición detrás del monumento
                const baseEstatuaX = this.bando === 'patriota' ? 60 : 2940;
                this.destinoX = baseEstatuaX + this.offsetX;
                
                // Confinados estrictamente en el área trasera de la estatua
                if (this.bando === 'patriota') {
                    this.x = Math.max(10, Math.min(130, this.x));
                } else {
                    this.x = Math.max(2870, Math.min(2990, this.x));
                }
            } else {
                // Al presionar Defender/Atacar, se retiran a la izquierda y se eliminan
                this.destinoX = this.bando === 'patriota' ? -100 : 3100;
                if (this.x <= 0 && this.bando === 'patriota') {
                    this.hp = 0;
                    this.estado = 'MUERTO';
                    this.tiempoMuerte = this.tiempoDesaparicion; // Desaparece al instante
                } else if (this.x >= 3000 && this.bando === 'realista') {
                    this.hp = 0;
                    this.estado = 'MUERTO';
                    this.tiempoMuerte = this.tiempoDesaparicion;
                }
            }

            // Atacar o moverse (Fase 8 - Corrección)
            if (this.estado === 'CAMINANDO') {
                this.mover(dt);
            } else if (this.estado === 'ATACANDO') {
                this.atacar(dt);
            }
            return; // Saltar lógica de unidad estándar
        }

        // --- COMPORTAMIENTO DE UNIDADES ESTÁNDAR GUARECIDAS ---
        if (this.guarecido) {
            if (mandoEjercito === 'RETIRARSE') {
                this.hp = Math.min(this.maxHp, this.hp + 12 * dt); // Curado rápido
                return;
            } else {
                // Re-entrar desde el borde de la pantalla conservando formación
                this.guarecido = false;
                this.x = this.bando === 'patriota' ? -20 : 3020;
                this.estado = 'CAMINANDO';
            }
        }

        // --- SISTEMA DE RETIRADA GENERAL ---
        if (mandoEjercito === 'RETIRARSE') {
            // Caminar hasta salir completamente de la pantalla
            this.destinoX = this.bando === 'patriota' ? -80 : 3080;
            if (this.estado === 'ATACANDO') {
                this.estado = 'CAMINANDO';
                this.objetivo = null;
            }

            // Comprobar si ha salido del mapa
            const fueraDePantalla = this.bando === 'patriota' ? (this.x <= 0) : (this.x >= 3000);
            const listoParaRetirarse = this.tipo !== 'minero' || this.recursosCargando === 0;

            if (fueraDePantalla && listoParaRetirarse) {
                this.guarecido = true;
                this.x = this.bando === 'patriota' ? -150 : 3150;
                this.estado = 'CAMINANDO';
                return;
            }
        } else if (mandoEjercito === 'DEFENDER') {
            // Defender en la línea asignada de 3000px
            const defX = this.bando === 'patriota' ? 900 : 2100;
            this.destinoX = defX + this.offsetX;
        } else if (mandoEjercito === 'ATACAR') {
            // Ofensiva total
            this.destinoX = baseEnemiga.x;
        }

        // Ejecutar comportamientos de movimiento o combate
        if (this.estado === 'CAMINANDO') {
            this.mover(dt);
        } else if (this.estado === 'ATACANDO') {
            this.atacar(dt);
        }
    }

    /**
     * Desplaza al personaje hacia su destinoX.
     */
    mover(dt) {
        const distanciaDestino = Math.abs(this.destinoX - this.x);

        if (distanciaDestino > 5) {
            const direccion = Math.sign(this.destinoX - this.x);
            this.x += this.velocidad * direccion * dt;
        }
    }

    /**
     * Ataque de combate.
     */
    atacar(dt) {
        if (!this.objetivo || this.objetivo.estado === 'MUERTO' || this.objetivo.estado === 'DESTROYED') {
            this.objetivo = null;
            this.estado = 'CAMINANDO';
            return;
        }

        const esEstructura = this.objetivo.ancho && this.objetivo.ancho > 50;
        const offsetColision = esEstructura ? 50 : 0;

        const distancia = Math.abs(this.x - this.objetivo.x);
        if (distancia > (this.rangoAtaque + offsetColision)) {
            this.objetivo = null;
            this.estado = 'CAMINANDO';
            return;
        }

        // Golpear
        if (this.cooldownAtaque <= 0) {
            this.objetivo.recibirDanio(this.danio);
            this.cooldownAtaque = this.cooldownAtaqueMax;

            if (typeof this.onAtaqueRealizado === 'function') {
                this.onAtaqueRealizado(this.x, this.y, this.bando, this.tipo);
            }
        }
    }

    /**
     * Aplica daño.
     */
    recibirDanio(cantidad) {
        if (this.estado === 'MUERTO' || this.defensorEstatua && this.estado === 'ATACANDO' && this.bando === 'patriota' && this.guarecido) return; // Inmunes a ataques si son defensores detrás

        this.hp -= cantidad;

        if (typeof this.onDamageReceived === 'function') {
            this.onDamageReceived(this.x, this.y);
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.estado = 'MUERTO';
            this.objetivo = null;
            console.log(`Unidad ${this.bando.toUpperCase()} ha muerto.`);
        }
    }
}
