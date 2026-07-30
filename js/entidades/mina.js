/**
 * Clase Mina - Representa un yacimiento de recursos en el escenario
 * del bando correspondiente, con cupo limitado de mineros trabajando.
 */
export class Mina {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {string} bando - 'patriota' o 'realista'
     * @param {number} cantidadRecurso 
     */
    constructor(x, y, bando, cantidadRecurso = Infinity) {
        this.x = x;
        this.y = y;
        this.bando = bando;
        this.cantidadRecurso = cantidadRecurso;
        this.ancho = 60;
        this.alto = 40;

        // Lista de mineros asignados actualmente a este yacimiento (Fase 8 - Ampliado)
        this.minerosAsignados = [];
    }

    /**
     * Comprueba si la mina tiene cupo disponible (Máximo 2 mineros trabajando simultáneamente).
     * @returns {boolean}
     */
    tieneEspacio() {
        // Filtrar solo los mineros asignados que sigan vivos y en este bando
        this.minerosAsignados = this.minerosAsignados.filter(
            m => m.estado !== 'MUERTO' && m.mina === this
        );
        return this.minerosAsignados.length < 2;
    }

    /**
     * Asigna un minero a la mina si hay espacio.
     * @param {Minero} minero 
     * @returns {boolean}
     */
    asignarMinero(minero) {
        if (this.tieneEspacio()) {
            if (!this.minerosAsignados.includes(minero)) {
                this.minerosAsignados.push(minero);
            }
            return true;
        }
        return false;
    }

    /**
     * Remueve un minero de la lista de asignación.
     * @param {Minero} minero 
     */
    desasignarMinero(minero) {
        this.minerosAsignados = this.minerosAsignados.filter(m => m !== minero);
    }
}
