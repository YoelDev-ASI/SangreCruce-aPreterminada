import { renderMinero } from '../render/renderPersonajes/renderMinero.js';
import { renderFusilero } from '../render/renderPersonajes/renderfusilero.js';
import { renderMiliciano } from '../render/renderPersonajes/renderMiliciano.js';

/**
 * Clase GestorPersonajes - Coordina formaciones dinámicas lerpeadas, Y-sorting
 * y filtrado de exclusiones de combate (mineros pacíficos y defensores inmunes).
 */
export class GestorPersonajes {
    constructor() {
        this.personajes = [];
        this.onEfectoTrigger = null; 
    }

    /**
     * Añade una nueva unidad al gestor.
     */
    agregarPersonaje(personaje) {
        this.personajes.push(personaje);

        // Enlazar eventos de daño y ataque a partículas
        personaje.onDamageReceived = (x, y) => {
            if (typeof this.onEfectoTrigger === 'function') {
                this.onEfectoTrigger('sangre', x, y);
            }
        };

        personaje.onAtaqueRealizado = (x, y, bando, tipo) => {
            if (typeof this.onEfectoTrigger === 'function') {
                if (tipo === 'fusilero') {
                    const dir = bando === 'patriota' ? 1 : -1;
                    const manoX = x + (5 * dir);
                    const manoY = y - 25;
                    this.onEfectoTrigger('humo', manoX, manoY, dir);
                } else {
                    const dir = bando === 'patriota' ? 1 : -1;
                    this.onEfectoTrigger('explosion', x + (25 * dir), y - 30);
                }
            }
        };
    }

    limpiar() {
        this.personajes = [];
    }

    /**
     * Actualiza la lógica de las unidades, aplicando el reordenamiento de formaciones.
     */
    update(dt, gestorRecursos, basePatriota, baseRealista, cmdPatriota = 'DEFENDER', cmdRealista = 'DEFENDER') {
        
        // 1. --- REORGANIZACIÓN DINÁMICA DE FORMACIONES (Ranks & Files) ---
        for (const bando of ['patriota', 'realista']) {
            // Filtrar combatientes activos (excluyendo mineros, cadáveres, guarecidos y defensores de la estatua)
            const combatientes = this.personajes.filter(p => 
                p.bando === bando && 
                p.tipo !== 'minero' && 
                p.estado !== 'MUERTO' && 
                !p.guarecido && 
                !p.defensorEstatua
            );

            // Re-asignar coordenadas objetivo en rejilla (4 filas máximo por columna)
            combatientes.forEach((p, index) => {
                const fila = index % 4;        // Fila vertical (0 a 3)
                const columna = Math.floor(index / 4); // Siguiente columna detrás de la primera

                p.targetOffsetY = -30 + fila * 20; // Rango de Y: -30, -10, 10, 30

                const factorDir = p.bando === 'patriota' ? -1 : 1;
                p.targetOffsetX = factorDir * (columna * 40 + 10);
            });
        }

        // 2. --- BÚSQUEDA TÁCTICA DE OBJETIVOS ---
        for (const p of this.personajes) {
            if (p.estado === 'MUERTO' || p.guarecido) continue;
            
            // Los mineros son pacíficos y nunca inician combate
            if (p.tipo === 'minero') continue;

            const cmdBando = p.bando === 'patriota' ? cmdPatriota : cmdRealista;

            // Evadir combate si se retiran, excepto los defensores de la estatua
            if (cmdBando === 'RETIRARSE' && !p.defensorEstatua) {
                continue;
            }

            // Buscar enemigos
            if (p.estado === 'CAMINANDO') {
                let enemigoCercano = null;
                let menorDistancia = Infinity;

                for (const otro of this.personajes) {
                    if (otro.estado === 'MUERTO' || otro.guarecido) continue;
                    if (otro.bando === p.bando) continue; // Evitar fuego amigo
                    
                    // Los defensores de la estatua son inmunes al targeting directo enemigo
                    if (otro.defensorEstatua) continue;

                    const dist = Math.abs(otro.x - p.x);
                    const direccionCorrecta = p.bando === 'patriota' ? (otro.x > p.x) : (otro.x < p.x);

                    if (direccionCorrecta && dist < menorDistancia) {
                        menorDistancia = dist;
                        enemigoCercano = otro;
                    }
                }

                // Fijar o atacar base rival si el campo de frente está libre
                if (enemigoCercano && menorDistancia <= p.rangoAtaque) {
                    p.objetivo = enemigoCercano;
                    p.estado = 'ATACANDO';
                } else if (!enemigoCercano) {
                    const baseEnemiga = p.bando === 'patriota' ? baseRealista : basePatriota;
                    if (baseEnemiga && baseEnemiga.estado !== 'DESTROYED') {
                        const distBase = Math.abs(p.x - baseEnemiga.x);
                        if (distBase <= (p.rangoAtaque + 50)) {
                            p.objetivo = baseEnemiga;
                            p.estado = 'ATACANDO';
                        }
                    }
                }
            }
        }

        // 3. --- ACTUALIZACIÓN INDIVIDUAL ---
        for (const p of this.personajes) {
            const baseAliada = p.bando === 'patriota' ? basePatriota : baseRealista;
            const baseEnemiga = p.bando === 'patriota' ? baseRealista : basePatriota;
            const cmdBando = p.bando === 'patriota' ? cmdPatriota : cmdRealista;

            p.update(dt, gestorRecursos, baseAliada, baseEnemiga, cmdBando);
        }

        // 4. --- FILTRAR CADÁVERES ---
        this.personajes = this.personajes.filter(p => {
            if (p.estado === 'MUERTO') {
                return p.tiempoMuerte < p.tiempoDesaparicion;
            }
            return true;
        });
    }

    /**
     * Dibuja las unidades visibles en Canvas ordenándolas por Y-sorting.
     */
    draw(ctx) {
        const visibles = this.personajes.filter(p => !p.guarecido);

        // Y-sorting: ordena de fondo a frente basándose en su coordenada Y real en el plano 2D
        visibles.sort((a, b) => a.y - b.y);

        for (const p of visibles) {
            if (p.tipo === 'minero') {
                renderMinero(ctx, p);
            } else if (p.tipo === 'fusilero') {
                renderFusilero(ctx, p);
            } else if (p.tipo === 'miliciano') {
                renderMiliciano(ctx, p);
            }
        }
    }
}
