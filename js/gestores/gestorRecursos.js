/**
 * Clase GestorRecursos - Controla la economía de la batalla,
 * manteniendo el conteo de recursos recolectados por los mineros
 * de cada bando.
 */
export class GestorRecursos {
    constructor() {
        this.oro = {
            patriota: 150, // Oro inicial de la partida (Fase 4 - Reclutamiento)
            realista: 150
        };
    }

    /**
     * Incrementa el depósito de oro del bando correspondiente.
     * @param {string} bando - 'patriota' o 'realista'
     * @param {number} cantidad - Oro a depositar
     */
    sumarOro(bando, cantidad) {
        if (this.oro[bando] !== undefined) {
            this.oro[bando] += cantidad;
        }
    }

    /**
     * Intenta sustraer oro para comprar una unidad.
     * @param {string} bando - 'patriota' o 'realista'
     * @param {number} cantidad - Costo de la compra
     * @returns {boolean} - true si la compra fue exitosa, false si no hay fondos suficientes
     */
    restarOro(bando, cantidad) {
        if (this.oro[bando] !== undefined && this.oro[bando] >= cantidad) {
            this.oro[bando] -= cantidad;
            return true;
        }
        return false;
    }

    /**
     * Devuelve el saldo actual de oro del bando.
     * @param {string} bando 
     * @returns {number}
     */
    getOro(bando) {
        return this.oro[bando] || 0;
    }

    /**
     * Reinicia los contadores de oro.
     */
    reiniciar() {
        this.oro.patriota = 150;
        this.oro.realista = 150;
    }
}
