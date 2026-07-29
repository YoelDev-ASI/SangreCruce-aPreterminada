import { Personaje } from './personaje.js';

/**
 * Clase Miliciano - Unidad militar cuerpo a cuerpo básica.
 * Rápido, con un nivel moderado de salud y armado con un sable o machete.
 */
export class Miliciano extends Personaje {
    constructor(x, y, bando) {
        super(x, y, bando, {
            hp: 110,
            velocidad: 90,
            rangoAtaque: 45, // Corto alcance (cuerpo a cuerpo)
            danio: 12,
            cooldownAtaqueMax: 1.3,
            ancho: 30,
            alto: 60
        });

        this.tipo = 'miliciano';
    }
}
