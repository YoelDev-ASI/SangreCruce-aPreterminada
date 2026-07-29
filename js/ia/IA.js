import { Minero } from '../entidades/minero.js';
import { Fusilero } from '../entidades/fusilero.js';
import { Miliciano } from '../entidades/miliciano.js';

/**
 * Clase IA - Inteligencia Artificial para el bando realista.
 * Toma decisiones de reclutamiento (mineros, milicianos, fusileros) y tácticas
 * respetando el límite máximo de población de 50.
 */
export class IA {
    /**
     * @param {string} bando 
     * @param {GestorRecursos} recursos 
     * @param {GestorPersonajes} gestor 
     * @param {Base} baseAliada 
     * @param {Base} baseEnemiga 
     * @param {Array<Mina>} minas 
     * @param {number} sueloY 
     */
    constructor(bando, recursos, gestor, baseAliada, baseEnemiga, minas, sueloY) {
        this.bando = bando;
        this.recursos = recursos;
        this.gestor = gestor;
        this.baseAliada = baseAliada;
        this.baseEnemiga = baseEnemiga;
        this.minas = minas;
        this.sueloY = sueloY;

        this.mando = 'DEFENDER';
        this.tiempoDecisionAcumulado = 0;
        this.intervaloDecision = 2.5;
    }

    update(dt) {
        if (this.baseAliada.estado === 'DESTROYED') return;

        this.tiempoDecisionAcumulado += dt;
        if (this.tiempoDecisionAcumulado >= this.intervaloDecision) {
            this.tiempoDecisionAcumulado = 0;
            this.tomarDecisiones();
        }
    }

    tomarDecisiones() {
        // Validar límite máximo de población de 50 unidades (Fase 8 - Ampliado)
        const totalVivas = this.gestor.personajes.filter(
            p => p.bando === this.bando && p.estado !== 'MUERTO' && !p.defensorEstatua
        ).length;
        if (totalVivas >= 50) return;

        const oro = this.recursos.getOro(this.bando);

        // Contar unidades vivas del bando
        const minerosVivos = this.gestor.personajes.filter(
            p => p.bando === this.bando && p.tipo === 'minero' && p.estado !== 'MUERTO'
        );
        const milicianosVivos = this.gestor.personajes.filter(
            p => p.bando === this.bando && p.tipo === 'miliciano' && p.estado !== 'MUERTO'
        );
        const fusilerosVivos = this.gestor.personajes.filter(
            p => p.bando === this.bando && p.tipo === 'fusilero' && p.estado !== 'MUERTO'
        );

        const cantidadMineros = minerosVivos.length;
        const cantidadMilicianos = milicianosVivos.length;
        const cantidadFusileros = fusilerosVivos.length;
        const totalCombatientes = cantidadMilicianos + cantidadFusileros;

        const spawnX = this.baseAliada.x - 70;

        // --- ECONOMÍA Y RECLUTAMIENTO ---
        if (cantidadMineros < 2 && oro >= 150) {
            if (this.recursos.restarOro(this.bando, 150)) {
                const minasRealistas = this.minas.filter(m => m.bando === this.bando);
                const minaAsignada = minasRealistas[Math.floor(Math.random() * minasRealistas.length)];
                this.gestor.agregarPersonaje(
                    new Minero(spawnX, this.sueloY, this.bando, this.baseAliada, minaAsignada)
                );
                console.log("[IA REALISTA] Reclutado Minero en mina distribuida.");
            }
        } 
        else if (cantidadMilicianos < 3 && oro >= 100) {
            if (this.recursos.restarOro(this.bando, 100)) {
                this.gestor.agregarPersonaje(
                    new Miliciano(spawnX, this.sueloY, this.bando)
                );
                console.log("[IA REALISTA] Reclutado Miliciano de combate cuerpo a cuerpo.");
            }
        }
        else if (oro >= 300) {
            if (this.recursos.restarOro(this.bando, 300)) {
                this.gestor.agregarPersonaje(
                    new Fusilero(spawnX, this.sueloY, this.bando)
                );
                console.log("[IA REALISTA] Reclutado Fusilero de infantería.");
            }
        }

        // --- DIRECTRICES TÁCTICAS ---
        if (this.baseAliada.hp < (this.baseAliada.maxHp * 0.3) && totalCombatientes < 2) {
            if (this.mando !== 'RETIRARSE') {
                this.mando = 'RETIRARSE';
                console.log("[IA REALISTA] Orden de RETIRADA general para guarecer tropas.");
            }
        }
        else if (totalCombatientes >= 5) {
            if (this.mando !== 'ATACAR') {
                this.mando = 'ATACAR';
                console.log("[IA REALISTA] Lanzando ofensiva general de ATAQUE.");
            }
        }
        else if (totalCombatientes <= 1 && this.mando === 'ATACAR') {
            this.mando = 'DEFENDER';
            console.log("[IA REALISTA] Ofensiva repelida. Volviendo a modo DEFENDER.");
        }
        else if (this.mando === 'RETIRARSE' && this.baseAliada.hp > (this.baseAliada.maxHp * 0.5)) {
            this.mando = 'DEFENDER';
            console.log("[IA REALISTA] Base restablecida. Cancelando retirada a modo DEFENDER.");
        }
    }
}
