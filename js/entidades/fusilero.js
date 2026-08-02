import { Personaje } from './personaje.js';

/**
 * Clase Fusilero - Unidad de ataque a larga distancia.
 * Armado con un fusil de chispa colonial, ataca desde lejos pero tiene recargas lentas.
 */
export class Fusilero extends Personaje {
    constructor(x, y, bando) {
        super(x, y, bando, {
            hp: 90,
            velocidad: 60,
            rangoAtaque: 300, // Rango de alcance largo
            danio: 22,
            cooldownAtaqueMax: 2.2, // Tiempo prolongado para recargar pólvora
            ancho: 30,
            alto: 60
        });

        this.tipo = 'fusilero';
    }
}
