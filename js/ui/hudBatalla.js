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
     */
    constructor(contenedor, onSpawnRequest, onCommandRequest) {
        this.contenedor = contenedor;
        this.onSpawnRequest = onSpawnRequest;
        this.onCommandRequest = onCommandRequest;

        this.init();
    }

    /**
     * Inyecta la botonera HTML con soporte para Milicianos y progresos individuales.
     */
    init() {
        this.contenedor.innerHTML = `
            <div id="hud-top-bar" style="position: absolute; top: 15px; left: 40px; display: flex; align-items: flex-start; gap: 50px; z-index: 20;">
                <!-- Panel de compra de tropas (Lado Izquierdo) -->
                <div id="recruitment-panel" style="display: flex; gap: 10px;">
                    
                    <!-- Tarjeta: Minero -->
                    <div class="unit-wrapper" style="display: flex; flex-direction: column; gap: 4px; width: 105px;">
                        <button class="unit-card" id="btn-spawn-minero" data-cost="150" style="width: 100%; padding: 6px 8px; gap: 6px; justify-content: flex-start;">
                            <svg class="unit-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path d="M14 2l4 4L7 17l-4-4L14 2zm1 1l-1 1 2 2 1-1-2-2zM5 19l-2 2v-2h2z" fill="#ffd700" />
                            </svg>
                            <div class="unit-info">
                                <span class="unit-name" style="font-size: 11px; font-weight:600;">Minero</span>
                                <span class="unit-cost" style="font-size: 9px; font-weight:800; color:#ffd700;">150 Oro</span>
                            </div>
                        </button>
                        <div class="unit-progress" id="progress-minero" style="width: 100%; height: 5px; background: rgba(0,0,0,0.6); border: 1px solid #555; border-radius: 3px; overflow: hidden; display: none;">
                            <div class="bar" style="width: 0%; height: 100%; background: #ffd700; transition: width 0.1s linear;"></div>
                        </div>
                    </div>
                    
                    <!-- Tarjeta: Miliciano (Nueva Entidad) -->
                    <div class="unit-wrapper" style="display: flex; flex-direction: column; gap: 4px; width: 105px;">
                        <button class="unit-card" id="btn-spawn-miliciano" data-cost="100" style="width: 100%; padding: 6px 8px; gap: 6px; justify-content: flex-start;">
                            <svg class="unit-icon" viewBox="0 0 24 24" width="16" height="16">
                                <!-- Sable / Machete SVG -->
                                <path d="M21 3a1 1 0 0 0-1.4 0l-15 15a1 1 0 0 0 0 1.4l1.5 1.5a1 1 0 0 0 1.4 0l15-15a1 1 0 0 0 0-1.4L21 3z" fill="#ff4d4d" />
                            </svg>
                            <div class="unit-info">
                                <span class="unit-name" style="font-size: 11px; font-weight:600;">Miliciano</span>
                                <span class="unit-cost" style="font-size: 9px; font-weight:800; color:#ff4d4d;">100 Oro</span>
                            </div>
                        </button>
                        <div class="unit-progress" id="progress-miliciano" style="width: 100%; height: 5px; background: rgba(0,0,0,0.6); border: 1px solid #555; border-radius: 3px; overflow: hidden; display: none;">
                            <div class="bar" style="width: 0%; height: 100%; background: #ff4d4d; transition: width 0.1s linear;"></div>
                        </div>
                    </div>

                    <!-- Tarjeta: Fusilero -->
                    <div class="unit-wrapper" style="display: flex; flex-direction: column; gap: 4px; width: 105px;">
                        <button class="unit-card" id="btn-spawn-fusilero" data-cost="300" style="width: 100%; padding: 6px 8px; gap: 6px; justify-content: flex-start;">
                            <svg class="unit-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path d="M2 19h2v2H2v-2zM21 4h-2L6 17H4v2h2l13-13h2V4z" fill="#e0e0e0" />
                            </svg>
                            <div class="unit-info">
                                <span class="unit-name" style="font-size: 11px; font-weight:600;">Fusilero</span>
                                <span class="unit-cost" style="font-size: 9px; font-weight:800; color:#e0e0e0;">300 Oro</span>
                            </div>
                        </button>
                        <div class="unit-progress" id="progress-fusilero" style="width: 100%; height: 5px; background: rgba(0,0,0,0.6); border: 1px solid #555; border-radius: 3px; overflow: hidden; display: none;">
                            <div class="bar" style="width: 0%; height: 100%; background: #e0e0e0; transition: width 0.1s linear;"></div>
                        </div>
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

        // 1. Vincular eventos de reclutamiento
        document.getElementById('btn-spawn-minero').addEventListener('click', () => {
            this.onSpawnRequest('minero');
        });

        document.getElementById('btn-spawn-miliciano').addEventListener('click', () => {
            this.onSpawnRequest('miliciano');
        });

        document.getElementById('btn-spawn-fusilero').addEventListener('click', () => {
            this.onSpawnRequest('fusilero');
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
     * Habilita o deshabilita los botones de compra según el oro y el tope de población.
     */
    update(oroPatriota, poblacionTotal = 0) {
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
    }

    /**
     * Actualiza visualmente las barras de progreso individuales para cada unidad.
     * @param {string|null} tipoActivo - Tipo de unidad que se está fabricando en el tope de la cola ('minero', 'miliciano', 'fusilero') o null
     * @param {number} progreso - Porcentaje de progreso de 0 a 1
     */
    updateProgreso(tipoActivo, progreso = 0) {
        const tipos = ['minero', 'miliciano', 'fusilero'];

        tipos.forEach(t => {
            const container = document.getElementById(`progress-${t}`);
            if (container) {
                if (t === tipoActivo) {
                    container.style.display = 'block';
                    const bar = container.querySelector('.bar');
                    if (bar) {
                        bar.style.width = `${progreso * 100}%`;
                    }
                } else {
                    container.style.display = 'none';
                    const bar = container.querySelector('.bar');
                    if (bar) {
                        bar.style.width = '0%';
                    }
                }
            }
        });
    }

    limpiar() {
        this.contenedor.innerHTML = '';
    }
}
