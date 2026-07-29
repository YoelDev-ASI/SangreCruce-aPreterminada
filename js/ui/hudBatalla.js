/**
 * Clase HudBatalla - Administra la barra superior de interfaz (HUD)
 * para el reclutamiento táctico de tropas, con soporte para Milicianos
 * y barras de carga individuales bajo cada tarjeta de reclutamiento.
 */
export class HudBatalla {
    /**
     * @param {HTMLElement} contenedor 
     * @param {function} onSpawnRequest 
     * @param {function} onCommandRequest 
     * @param {function} onCancelRequest
     */
    constructor(contenedor, onSpawnRequest, onCommandRequest, onCancelRequest) {
        this.contenedor = contenedor;
        this.onSpawnRequest = onSpawnRequest;
        this.onCommandRequest = onCommandRequest;
        this.onCancelRequest = onCancelRequest;

        this.init();
    }

    /**
     * Inyecta la botonera HTML con soporte para Milicianos, botones circulares, contadores y botones de cancelación.
     */
    init() {
        this.contenedor.innerHTML = `
            <div id="hud-top-bar" style="position: absolute; top: 15px; left: 40px; display: flex; align-items: flex-start; gap: 50px; z-index: 20;">
                <!-- Panel de compra de tropas (Lado Izquierdo) -->
                <div id="recruitment-panel" style="display: flex; gap: 14px; align-items: flex-start;">
                    
                    <!-- Tarjeta Circular: Minero -->
                    <div class="unit-circle-wrapper">
                        <button class="unit-circle-btn" id="btn-spawn-minero" data-cost="150">
                            <!-- Progreso radial -->
                            <div class="unit-circle-progress" id="progress-overlay-minero" style="--progress: 0%;"></div>
                            
                            <!-- Icono (Pickaxe) -->
                            <div class="unit-circle-icon-container">
                                <svg class="unit-circle-icon" viewBox="0 0 24 24" width="28" height="28">
                                    <path d="M14 2l4 4L7 17l-4-4L14 2zm1 1l-1 1 2 2 1-1-2-2zM5 19l-2 2v-2h2z" />
                                </svg>
                            </div>
                            
                            <!-- Cantidad en Cola -->
                            <div class="unit-circle-queue" id="queue-count-minero"></div>
                            
                            <!-- Costo -->
                            <div class="unit-circle-cost">150</div>
                        </button>
                        
                        <!-- Botón Cancelar (X) -->
                        <button class="unit-cancel-btn" id="btn-cancel-minero">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Tarjeta Circular: Miliciano -->
                    <div class="unit-circle-wrapper">
                        <button class="unit-circle-btn" id="btn-spawn-miliciano" data-cost="100">
                            <!-- Progreso radial -->
                            <div class="unit-circle-progress" id="progress-overlay-miliciano" style="--progress: 0%;"></div>
                            
                            <!-- Icono (Sable/Machete) -->
                            <div class="unit-circle-icon-container">
                                <svg class="unit-circle-icon" viewBox="0 0 24 24" width="28" height="28">
                                    <path d="M21 3a1 1 0 0 0-1.4 0l-15 15a1 1 0 0 0 0 1.4l1.5 1.5a1 1 0 0 0 1.4 0l15-15a1 1 0 0 0 0-1.4L21 3z" />
                                </svg>
                            </div>
                            
                            <!-- Cantidad en Cola -->
                            <div class="unit-circle-queue" id="queue-count-miliciano"></div>
                            
                            <!-- Costo -->
                            <div class="unit-circle-cost">100</div>
                        </button>
                        
                        <!-- Botón Cancelar (X) -->
                        <button class="unit-cancel-btn" id="btn-cancel-miliciano">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
 
                    <!-- Tarjeta Circular: Fusilero -->
                    <div class="unit-circle-wrapper">
                        <button class="unit-circle-btn" id="btn-spawn-fusilero" data-cost="300">
                            <!-- Progreso radial -->
                            <div class="unit-circle-progress" id="progress-overlay-fusilero" style="--progress: 0%;"></div>
                            
                            <!-- Icono (Fusil/Rifle) -->
                            <div class="unit-circle-icon-container">
                                <svg class="unit-circle-icon" viewBox="0 0 24 24" width="28" height="28">
                                    <path d="M2 19h2v2H2v-2zM21 4h-2L6 17H4v2h2l13-13h2V4z" />
                                </svg>
                            </div>
                            
                            <!-- Cantidad en Cola -->
                            <div class="unit-circle-queue" id="queue-count-fusilero"></div>
                            
                            <!-- Costo -->
                            <div class="unit-circle-cost">300</div>
                        </button>
                        
                        <!-- Botón Cancelar (X) -->
                        <button class="unit-cancel-btn" id="btn-cancel-fusilero">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
 
                <!-- Panel de mandos militares (Lado Derecho / Centro) -->
                <div id="commands-panel" style="display: flex; gap: 10px;">
                    <button class="cmd-btn" id="btn-cmd-retirarse">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        <span>Retirada</span>
                    </button>
                    
                    <button class="cmd-btn active" id="btn-cmd-defender">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>Defender</span>
                    </button>
                    
                    <button class="cmd-btn" id="btn-cmd-atacar">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14.5 17.5L3 6M10 6.5l11 11M16 3l5 5M3 16l5 5" />
                        </svg>
                        <span>Atacar</span>
                    </button>
                </div>
            </div>
        `;
 
        // 1. Vincular eventos de reclutamiento y cancelación
        document.getElementById('btn-spawn-minero').addEventListener('click', () => {
            this.onSpawnRequest('minero');
        });
        document.getElementById('btn-cancel-minero').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onCancelRequest) this.onCancelRequest('minero');
        });
 
        document.getElementById('btn-spawn-miliciano').addEventListener('click', () => {
            this.onSpawnRequest('miliciano');
        });
        document.getElementById('btn-cancel-miliciano').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onCancelRequest) this.onCancelRequest('miliciano');
        });
 
        document.getElementById('btn-spawn-fusilero').addEventListener('click', () => {
            this.onSpawnRequest('fusilero');
        });
        document.getElementById('btn-cancel-fusilero').addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onCancelRequest) this.onCancelRequest('fusilero');
        });
 
        // 2. Vincular eventos de mandos militares
        const btnsCmd = {
            retirarse: document.getElementById('btn-cmd-retirarse'),
            defender: document.getElementById('btn-cmd-defender'),
            atacar: document.getElementById('btn-cmd-atacar')
        };
 
        const cambiarMandoActivo = (mandoKey) => {
            Object.values(btnsCmd).forEach(btn => btn.classList.remove('active'));
            btnsCmd[mandoKey].classList.add('active');
            this.onCommandRequest(mandoKey.toUpperCase());
        };
 
        btnsCmd.retirarse.addEventListener('click', () => cambiarMandoActivo('retirarse'));
        btnsCmd.defender.addEventListener('click', () => cambiarMandoActivo('defender'));
        btnsCmd.atacar.addEventListener('click', () => cambiarMandoActivo('atacar'));
    }
 
    /**
     * Habilita o deshabilita los botones de compra según el oro y el tope de población,
     * y actualiza los contadores de cola y visibilidad de los botones de cancelar.
     */
    update(oroPatriota, poblacionTotal = 0, colaEntrenamiento = []) {
        const limiteAlcanzado = poblacionTotal >= 50;
 
        const btnMinero = document.getElementById('btn-spawn-minero');
        if (btnMinero) {
            btnMinero.disabled = (oroPatriota < 150) || limiteAlcanzado;
        }
 
        const btnMiliciano = document.getElementById('btn-spawn-miliciano');
        if (btnMiliciano) {
            btnMiliciano.disabled = (oroPatriota < 100) || limiteAlcanzado;
        }
 
        const btnFusilero = document.getElementById('btn-spawn-fusilero');
        if (btnFusilero) {
            btnFusilero.disabled = (oroPatriota < 300) || limiteAlcanzado;
        }

        // Contar unidades en cola
        const counts = { minero: 0, miliciano: 0, fusilero: 0 };
        colaEntrenamiento.forEach(item => {
            if (counts[item.tipo] !== undefined) {
                counts[item.tipo]++;
            }
        });

        // Actualizar contadores visuales y botones de cancelación
        const tipos = ['minero', 'miliciano', 'fusilero'];
        tipos.forEach(t => {
            const countEl = document.getElementById(`queue-count-${t}`);
            const cancelBtn = document.getElementById(`btn-cancel-${t}`);
            const count = counts[t];

            if (countEl) {
                if (count > 0) {
                    countEl.textContent = count;
                    countEl.style.display = 'block';
                } else {
                    countEl.textContent = '';
                    countEl.style.display = 'none';
                }
            }

            if (cancelBtn) {
                if (count > 0) {
                    cancelBtn.style.display = 'flex';
                } else {
                    cancelBtn.style.display = 'none';
                }
            }
        });
    }
 
    /**
     * Actualiza visualmente las barras de progreso individuales para cada unidad.
     * @param {string|null} tipoActivo - Tipo de unidad que se está fabricando en el tope de la cola ('minero', 'miliciano', 'fusilero') o null
     * @param {number} progreso - Porcentaje de progreso de 0 a 1
     */
    updateProgreso(tipoActivo, progreso = 0) {
        const tipos = ['minero', 'miliciano', 'fusilero'];
 
        tipos.forEach(t => {
            const overlay = document.getElementById(`progress-overlay-${t}`);
            if (overlay) {
                if (t === tipoActivo) {
                    overlay.style.setProperty('--progress', `${progreso * 100}%`);
                } else {
                    const countEl = document.getElementById(`queue-count-${t}`);
                    const isInQueue = countEl && countEl.style.display !== 'none';
                    if (isInQueue) {
                        overlay.style.setProperty('--progress', '0%');
                    } else {
                        overlay.style.setProperty('--progress', '100%');
                    }
                }
            }
        });
    }

    limpiar() {
        this.contenedor.innerHTML = '';
    }
}
