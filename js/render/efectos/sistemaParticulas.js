import { dibujarParticulaSangre } from './sangre.js';
import { dibujarParticulaHumo } from './humo.js';
import { dibujarParticulaExplosion } from './explosion.js';

/**
 * Clase SistemaParticulas - Administra la física (movimiento, gravedad, vida)
 * y el renderizado de todos los efectos especiales de partículas en pantalla.
 */
export class SistemaParticulas {
    constructor() {
        this.particulas = [];
    }

    /**
     * Añade una lista de nuevas partículas.
     * @param {Array} listaParticulas 
     */
    agregarParticulas(listaParticulas) {
        if (Array.isArray(listaParticulas)) {
            this.particulas.push(...listaParticulas);
        }
    }

    /**
     * Limpia todas las partículas de la escena.
     */
    limpiar() {
        this.particulas = [];
    }

    /**
     * Actualiza la física de cada partícula individual.
     * @param {number} dt - Tiempo transcurrido en segundos
     */
    update(dt) {
        for (const p of this.particulas) {
            // Aplicar gravedad si la partícula cuenta con ella (ej. sangre cayendo)
            if (p.gravedad) {
                p.vy += p.gravedad * dt;
            }

            // Desplazar partícula
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Incrementar vida
            p.life += dt;
        }

        // Conservar únicamente las partículas que sigan vigentes (vida < maxLife)
        this.particulas = this.particulas.filter(p => p.life < p.maxLife);
    }

    /**
     * Dibuja las partículas activas delegando a sus respectivos archivos de diseño.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D
     */
    draw(ctx) {
        for (const p of this.particulas) {
            if (p.tipo === 'sangre') {
                dibujarParticulaSangre(ctx, p);
            } else if (p.tipo === 'humo') {
                dibujarParticulaHumo(ctx, p);
            } else if (p.tipo === 'explosion') {
                dibujarParticulaExplosion(ctx, p);
            }
        }
    }
}
