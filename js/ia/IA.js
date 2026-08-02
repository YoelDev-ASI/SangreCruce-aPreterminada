import { Minero } from '../entidades/minero.js';
import { Fusilero } from '../entidades/fusilero.js';
import { Miliciano } from '../entidades/miliciano.js';

/**
 * Clase IA - Inteligencia Artificial para el bando realista.
 * Toma decisiones de reclutamiento (mineros, milicianos, fusileros) y tácticas
 * respetando el límite máximo de población de 50.
 */
export class IA {
    constructor(bando, recursos, gestor, baseAliada, baseEnemiga, minas, sueloY, nivel = 1) {
        this.bando = bando;
        this.recursos = recursos;
        this.gestor = gestor;
        this.baseAliada = baseAliada;
        this.baseEnemiga = baseEnemiga;
        this.minas = minas;
        this.sueloY = sueloY;
        this.nivel = nivel;

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
        let maxMineros = 2;
        if (this.nivel === 2 || this.nivel === 3) {
            maxMineros = 4;
        } else if (this.nivel === 4) {
            maxMineros = 6;
        } else if (this.nivel >= 5) {
            maxMineros = 8;
        }

        const maxMilicianos = this.nivel >= 4 ? 8 : (this.nivel >= 2 ? 6 : 3);

        // Evaluar si prioritariamente debemos reclutar un minero.
        // Queremos siempre tener al menos 2 mineros al inicio.
        // Después de 2 mineros, solo compramos otro si tenemos suficientes soldados para defender (escolta).
        let debeReclutarMinero = false;
        if (cantidadMineros < maxMineros && oro >= 150) {
            if (cantidadMineros < 2) {
                debeReclutarMinero = true;
            } else {
                const combatientesRequeridos = (cantidadMineros - 2) * 1.5;
                if (totalCombatientes >= combatientesRequeridos) {
                    debeReclutarMinero = true;
                }
            }
        }

        if (debeReclutarMinero) {
            if (this.recursos.restarOro(this.bando, 150)) {
                const minasRealistas = this.minas.filter(m => m.bando === this.bando);
                const minaAsignada = minasRealistas[Math.floor(Math.random() * minasRealistas.length)];
                this.gestor.agregarPersonaje(
                    new Minero(spawnX, this.sueloY, this.bando, this.baseAliada, minaAsignada)
                );
                console.log(`[IA REALISTA] Reclutado Minero (${cantidadMineros + 1}/${maxMineros}).`);
            }
        } 
        else if (cantidadMilicianos < maxMilicianos && oro >= 100) {
            if (this.recursos.restarOro(this.bando, 100)) {
                this.gestor.agregarPersonaje(
                    new Miliciano(spawnX, this.sueloY, this.bando)
                );
                console.log(`[IA REALISTA] Reclutado Miliciano de combate cuerpo a cuerpo. (${cantidadMilicianos + 1}/${maxMilicianos})`);
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
        const hpCriticoBase = this.baseAliada.hp < (this.baseAliada.maxHp * 0.3);

        if (hpCriticoBase && totalCombatientes < 2) {
            if (this.mando !== 'RETIRARSE') {
                this.mando = 'RETIRARSE';
                console.log("[IA REALISTA] Orden de RETIRADA general para guarecer tropas.");
            }
        }
        else if (this.mando === 'RETIRARSE' && this.baseAliada.hp > (this.baseAliada.maxHp * 0.5)) {
            this.mando = 'DEFENDER';
            console.log("[IA REALISTA] Base restablecida. Cancelando retirada a modo DEFENDER.");
        }
        else {
            // Lógica táctica de oleadas de ataque agrupadas (suavizada para balancear dificultad)
            let minUnidadesAtaque = 5;
            let minUnidadesRegresoDefensa = 1;

            if (this.nivel === 2) {
                minUnidadesAtaque = 6;
                minUnidadesRegresoDefensa = 1;
            } else if (this.nivel === 3) {
                minUnidadesAtaque = 8;
                minUnidadesRegresoDefensa = 2;
            } else if (this.nivel === 4) {
                minUnidadesAtaque = 11;
                minUnidadesRegresoDefensa = 3;
            } else if (this.nivel >= 5) {
                minUnidadesAtaque = 13;
                minUnidadesRegresoDefensa = 3;
            }

            if (this.mando !== 'ATACAR') {
                // Modo DEFENDER/agrupamiento: Sólo ataca en bloque cuando alcanza el tamaño de grupo
                if (totalCombatientes >= minUnidadesAtaque) {
                    this.mando = 'ATACAR';
                    console.log(`[IA REALISTA] Grupo completo (${totalCombatientes}/${minUnidadesAtaque}). Lanzando ataque coordinado.`);
                }
            } else {
                // Modo ATACAR: Mantiene la ofensiva hasta que las tropas caigan por debajo del límite de resistencia
                if (totalCombatientes <= minUnidadesRegresoDefensa) {
                    this.mando = 'DEFENDER';
                    console.log(`[IA REALISTA] Ofensiva repelida (${totalCombatientes} unidades restantes). Regresando a DEFENDER para reagrupar.`);
                }
            }
        }
    }
}
