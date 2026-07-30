/**
 * Clase Base - Representa la fortaleza principal de cada bando.
 * Funciona como punto de entrega de recursos recopilados por los mineros,
 * origen de spawn de nuevas unidades, y condición de victoria/derrota.
 */
export class Base {
    constructor(x, y, bando) {
        this.x = x;
        this.y = y;
        this.bando = bando; // 'patriota' o 'realista'
        this.hp = 1200;
        this.maxHp = 1200;
        this.ancho = 100;
        this.alto = 120;
        this.estado = 'ALIVE';
    }

    /**
     * Aplica daño a la fortaleza.
     * @param {number} cantidad - Daño recibido
     */
    recibirDanio(cantidad) {
        if (this.estado === 'DESTROYED') return;

        this.hp -= cantidad;
        if (this.hp <= 0) {
            this.hp = 0;
            this.estado = 'DESTROYED';
            console.log(`¡La base del bando ${this.bando.toUpperCase()} ha sido destruida!`);
        }
    }
}
