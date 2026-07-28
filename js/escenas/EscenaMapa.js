import { datosBatallas } from '../config/datosBatallas.js';
import { sonidos } from '../utilidades/sonidos.js';

/**
 * Clase EscenaMapa - Escena de selección de batallas históricas.
 * Renderiza un mapa colonial con nodos geográficos de combate interactivos y
 * muestra fichas informativas de contexto real para el aprendizaje.
 */
export class EscenaMapa {
    /**
     * @param {number} anchoLogico 
     * @param {number} altoLogico 
     * @param {Motor} motor - Instancia del motor principal para alternar escenas
     */
    constructor(anchoLogico, altoLogico, motor) {
        this.anchoLogico = anchoLogico;
        this.altoLogico = altoLogico;
        this.motor = motor;

        // Lista de misiones de la base de datos
        this.misiones = datosBatallas;
        this.misionSeleccionada = null; // Misión cargada en el panel informativo

        // --- CARGAR PROGRESO DE CAMPAÑA (Fase 8 - Niveles) ---
        this.nivelMaximoDesbloqueado = parseInt(localStorage.getItem('sangre_oriental_nivel_max')) || 1;
        this.nivelesCompletados = JSON.parse(localStorage.getItem('sangre_oriental_completados')) || [];

        // Iniciar melodía de campaña
        sonidos.playMusica('assets/audio/marcha_campania.mp3');
    }

    /**
     * Actualiza la lógica de la escena (pulso de animaciones).
     * @param {number} dt 
     */
    update(dt) {
        // Nada requerido de momento, el mapa es mayormente estático/reactivo a clicks
    }

    /**
     * Dibuja el mapa geográfico colonial, los nodos y el modal de descripción histórica.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        // 1. Dibujar fondo de pergamino antiguo
        ctx.fillStyle = '#f4ecd8'; // Tono marrón claro papel viejo
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        // =========================================================================
        // [DISEÑO DE TU MAPA COLONIAL EN CANVAS]
        // Coloca aquí tus líneas de código para dibujar la geografía cruceña colonial.
        // Puedes trazar ríos (Río Grande, Río Piraí), montañas, bosques o fronteras.
        // =========================================================================

        // --- DISEÑO TEMPORAL DE GUÍA (Sustitúyelo por tu propio mapa) ---
        ctx.strokeStyle = '#c5a059'; // Marco dorado doble
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, this.anchoLogico - 20, this.altoLogico - 20);
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 2;
        ctx.strokeRect(18, 18, this.anchoLogico - 36, this.altoLogico - 36);

        // Dibujar rosa de los vientos / Brújula decorativa colonial
        ctx.strokeStyle = 'rgba(139, 90, 43, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(150, 550, 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(150, 480); ctx.lineTo(150, 620);
        ctx.moveTo(80, 550); ctx.lineTo(220, 550);
        ctx.stroke();
        // =========================================================================

        // Botón "Menú principal" en la esquina superior izquierda
        if (!this.misionSeleccionada) {
            this.dibujarBoton(ctx, 35, 30, 160, 40, "Menú principal", '#8b2500', '#ffffff');
        }

        // 2. Dibujar título superior del mapa
        ctx.fillStyle = '#4a2f13';
        ctx.font = 'extrabold 32px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("PROVINCIA DE SANTA CRUZ DE LA SIERRA", this.anchoLogico / 2, 60);

        ctx.fillStyle = '#8b5a2b';
        ctx.font = 'italic 16px "Outfit", sans-serif';
        ctx.fillText("Selecciona un emplazamiento de combate para iniciar la revolución", this.anchoLogico / 2, 90);

        // 3. Dibujar nodos geográficos de batallas (Campaña Refinada - Fase 8)
        for (const m of this.misiones) {
            const seleccionado = this.misionSeleccionada && this.misionSeleccionada.id === m.id;
            const bloqueado = m.nivel > this.nivelMaximoDesbloqueado;
            const completado = this.nivelesCompletados.includes(m.id);

            ctx.save();
            ctx.textAlign = 'center';

            // Dibujar anillo de selección activa o pulso
            if (!bloqueado) {
                const pulsoRadius = 24 + Math.sin(Date.now() * 0.007) * 4;
                ctx.strokeStyle = seleccionado ? '#ffae00' : (completado ? 'rgba(46, 125, 50, 0.4)' : 'rgba(21, 101, 192, 0.3)');
                ctx.lineWidth = seleccionado ? 4 : 2;
                ctx.beginPath();
                ctx.arc(m.x, m.y, pulsoRadius, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Círculo base del nodo
            if (bloqueado) {
                ctx.fillStyle = '#808080'; // Gris bloqueado
                ctx.strokeStyle = '#444444';
            } else if (completado) {
                ctx.fillStyle = '#2e7d32'; // Verde completado
                ctx.strokeStyle = '#c5a059';
            } else {
                ctx.fillStyle = seleccionado ? '#ff5500' : '#1565c0'; // Azul activo
                ctx.strokeStyle = '#0d47a1';
            }

            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(m.x, m.y, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Símbolo interior del nodo
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Outfit", sans-serif';
            if (bloqueado) {
                ctx.fillText("🔒", m.x, m.y + 4);
            } else if (completado) {
                ctx.fillText("✓", m.x, m.y + 4);
            } else {
                ctx.fillText("X", m.x, m.y + 4);
            }

            // Nombre de la batalla debajo del nodo
            if (bloqueado) {
                ctx.fillStyle = '#808080';
            } else if (completado) {
                ctx.fillStyle = '#2e7d32';
            } else {
                ctx.fillStyle = '#0d47a1';
            }
            ctx.font = 'bold 13px "Outfit", sans-serif';
            ctx.fillText(m.nombre, m.x, m.y + 36);
            ctx.restore();
        }

        // 4. --- DIBUJAR MODAL INFORMATIVO HISTÓRICO ---
        if (this.misionSeleccionada) {
            this.drawPanelInformativo(ctx);
        }
    }

    /**
     * Dibuja la tarjeta con la descripción histórica y el botón de inicio de combate.
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawPanelInformativo(ctx) {
        ctx.save();
        
        // Velo transparente trasero
        ctx.fillStyle = 'rgba(10, 5, 0, 0.45)';
        ctx.fillRect(0, 0, this.anchoLogico, this.altoLogico);

        // Dimensiones del modal
        const w = 500;
        const h = 420;
        const x = this.anchoLogico / 2 - w / 2;
        const y = this.altoLogico / 2 - h / 2;

        // Caja de pergamino central
        ctx.fillStyle = '#fffdf3';
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 5;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        ctx.textAlign = 'center';

        // Título de la Batalla
        ctx.fillStyle = '#8b2500'; // Rojo ladrillo colonial
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.fillText(this.misionSeleccionada.nombre.toUpperCase(), this.anchoLogico / 2, y + 45);

        // Fecha de la batalla
        ctx.fillStyle = '#5c3a21';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(`Fecha: ${this.misionSeleccionada.fecha}`, this.anchoLogico / 2, y + 75);

        // Línea decorativa
        ctx.strokeStyle = 'rgba(139, 90, 43, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.anchoLogico / 2 - 180, y + 95);
        ctx.lineTo(this.anchoLogico / 2 + 180, y + 95);
        ctx.stroke();

        // Descripción histórica con saltos de línea inteligentes
        ctx.fillStyle = '#3a2211';
        ctx.font = '15px "Outfit", sans-serif';
        this.dibujarTextoMultilinea(ctx, 
            this.misionSeleccionada.descripcion, 
            this.anchoLogico / 2, y + 130, 420, 24
        );

        // Botón de Inicio: "INICIAR COMBATE"
        // Coordenadas lógicas del botón
        const btnW = 220;
        const btnH = 45;
        const btnX = this.anchoLogico / 2 - btnW / 2;
        const btnY = y + 330;

        ctx.fillStyle = '#8b2500'; // Botón rojo/marrón
        ctx.strokeStyle = '#4a2f13';
        ctx.lineWidth = 2;
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        // Texto del botón
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Outfit", sans-serif';
        ctx.fillText("INICIAR COMBATE", this.anchoLogico / 2, btnY + 28);

        // Botón cerrar (Pequeño círculo con una X arriba a la derecha)
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.arc(x + w - 20, y + 20, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText("X", x + w - 20, y + 25);

        ctx.restore();
    }

    /**
     * Dibuja texto respetando saltos de línea para el ancho disponible.
     */
    dibujarTextoMultilinea(ctx, texto, x, y, anchoMax, altoLinea) {
        const palabras = texto.split(' ');
        let linea = '';
        let posY = y;

        for (let n = 0; n < palabras.length; n++) {
            let testLinea = linea + palabras[n] + ' ';
            let metrica = ctx.measureText(testLinea);
            let testAncho = metrica.width;
            if (testAncho > anchoMax && n > 0) {
                ctx.fillText(linea, x, posY);
                linea = palabras[n] + ' ';
                posY += altoLinea;
            } else {
                linea = testLinea;
            }
        }
        ctx.fillText(linea, x, posY);
    }

    /**
     * Procesa la entrada táctil o clics de mouse.
     * @param {number} clickX 
     * @param {number} clickY 
     */
    onPointerDown(clickX, clickY) {
        // A. Clic en "Menú principal" (x=35, y=30, w=160, h=40)
        // Solo si no hay un modal informativo abierto
        if (!this.misionSeleccionada) {
            if (clickX >= 35 && clickX <= 35 + 160 && clickY >= 30 && clickY <= 30 + 40) {
                sonidos.playEfecto('assets/audio/click.mp3');
                sonidos.detenerMusica();
                import('./escenaPrincipal.js').then((module) => {
                    const principal = new module.EscenaPrincipal(this.anchoLogico, this.altoLogico, this.motor);
                    this.motor.setEscena(principal);
                });
                return;
            }
        }

        // B. Si hay un modal abierto, evaluar interacciones en él
        if (this.misionSeleccionada) {
            const w = 500;
            const h = 420;
            const x = this.anchoLogico / 2 - w / 2;
            const y = this.altoLogico / 2 - h / 2;

            // Coordenadas del botón de Iniciar Combate
            const btnW = 220;
            const btnH = 45;
            const btnX = this.anchoLogico / 2 - btnW / 2;
            const btnY = y + 330;

            // Clic en "INICIAR COMBATE"
            if (clickX >= btnX && clickX <= btnX + btnW && clickY >= btnY && clickY <= btnY + btnH) {
                sonidos.playEfecto('assets/audio/carga.mp3');
                sonidos.detenerMusica(); // Detener música del mapa

                // Importar dinámicamente EscenaBatalla para evadir referencias cruzadas
                import('./EscenaBatalla.js').then((module) => {
                    const batalla = new module.EscenaBatalla(this.anchoLogico, this.altoLogico, this.motor, this.misionSeleccionada);
                    this.motor.setEscena(batalla);
                });
                return;
            }

            // Clic en la "X" del botón de cerrar
            const distCerrar = Math.hypot(clickX - (x + w - 20), clickY - (y + 20));
            if (distCerrar <= 16) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.misionSeleccionada = null;
                return;
            }

            // Clic fuera del modal (cierra la ficha)
            if (clickX < x || clickX > x + w || clickY < y || clickY > y + h) {
                sonidos.playEfecto('assets/audio/click.mp3');
                this.misionSeleccionada = null;
                return;
            }
        } 
        // C. Si no hay modal, revisar si clica en algún nodo de misión
        else {
            for (const m of this.misiones) {
                const dist = Math.hypot(clickX - m.x, clickY - m.y);
                if (dist <= 25) { // Clic dentro de la hitbox del nodo
                    if (m.nivel > this.nivelMaximoDesbloqueado) {
                        sonidos.playEfecto('assets/audio/click.mp3');
                        console.log(`Misión bloqueada: ${m.nombre}`);
                        return;
                    }
                    sonidos.playEfecto('assets/audio/click.mp3');
                    this.misionSeleccionada = m;
                    console.log(`Misión seleccionada: ${m.nombre}`);
                    return;
                }
            }
        }
    }

    /**
     * Función utilitaria para dibujar botones planos estilizados.
     */
    dibujarBoton(ctx, x, y, w, h, texto, colorFondo, colorTexto) {
        ctx.save();
        ctx.fillStyle = colorFondo;
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 1.5;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = colorTexto;
        ctx.font = 'bold 14px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(texto, x + w / 2, y + h / 2 + 5);
        ctx.restore();
    }
}
