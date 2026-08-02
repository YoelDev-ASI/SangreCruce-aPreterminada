/**
 * Configuración de Batallas Históricas de la Revolución Cruceña.
 * Contiene los datos narrativos, intros de misión y configuraciones técnicas
 * para los 5 niveles progresivos de la campaña militar.
 */
export const datosBatallas = [
    {
        id: 'revolucion_1',
        nivel: 1,
        nombre: '1. Revolución del 24 de Septiembre',
        fecha: '24 de septiembre de 1810',
        introTexto: '¡Comienza la Revolución! El pueblo cruceño se alza en un cabildo abierto deponiendo a las autoridades realistas. Debemos asegurar la plaza principal y sembrar la semilla de la independencia cruceña.',
        descripcion: 'El cabildo abierto desconoce al gobernador colonial Lemoine y establece la junta provisoria. Es el grito primigenio de libertad en el oriente boliviano que marca el nacimiento de la Sangre Oriental.',
        oroPatriota: 300,
        oroRealista: 120,
        dificultadRealista: 'facil',
        x: 700,
        y: 370
    },
    {
        id: 'florida',
        nivel: 2,
        nombre: '2. Batalla de La Florida',
        fecha: '25 de mayo de 1814',
        introTexto: 'Volvimos a perder la ciudad de Santa Cruz, tendremos que ganarla después. Las fuerzas patriotas al mando de Warnes se reorganizan en el Río Piraí para detener el avance de Blanco en las colinas de La Florida.',
        descripcion: 'Las fuerzas patriotas cruceñas al mando del coronel Ignacio Warnes y el general Arenales se enfrentan a las tropas realistas de Joaquín Blanco. Esta crucial victoria consolida la soberanía rebelde.',
        oroPatriota: 250,
        oroRealista: 150,
        dificultadRealista: 'normal',
        x: 580,
        y: 620
    },
    {
        id: 'santa_barbara',
        nivel: 3,
        nombre: '3. Batalla de Santa Bárbara',
        fecha: '7 de octubre de 1815',
        introTexto: 'Ignacio Warnes marcha hacia la provincia de Chiquitos para repeler la contrarrevolución realista liderada por Juan Jacinto Rodríguez y asegurar las fronteras orientales.',
        descripcion: 'Warnes derrota contundentemente a las divisiones realistas, expandiendo la gobernación patriota de Santa Cruz y pacificando el sector chiquitano ante amenazas externas.',
        oroPatriota: 220,
        oroRealista: 180,
        dificultadRealista: 'normal',
        x: 900,
        y: 300
    },
    {
        id: 'pari',
        nivel: 4,
        nombre: '4. Batalla de El Pari',
        fecha: '21 de noviembre de 1816',
        introTexto: 'El brigadier realista Aguilera marcha con el batallón Talavera hacia Santa Cruz. Debemos defender la plaza de la gobernación en El Pari en el combate más sangriento de la historia de la independencia.',
        descripcion: 'Ignacio Warnes defiende Santa Cruz contra Francisco Javier Aguilera. Un choque cuerpo a cuerpo brutal a bayoneta y sable que define el destino trágico y heroico de la resistencia cruceña.',
        oroPatriota: 150,
        oroRealista: 150,
        dificultadRealista: 'dificil',
        x: 660,
        y: 440
    },
    {
        id: 'liberacion_final',
        nivel: 5,
        nombre: '5. Liberación Final de Santa Cruz',
        fecha: '14 de febrero de 1825',
        introTexto: '¡La ofensiva definitiva! Las guerrillas libertadoras al mando del coronel José Manuel Mercado "El Colorao" asedian la ciudad colonial para expulsar al último reducto español de Aguilera.',
        descripcion: 'Entrada triunfal de las tropas rebeldes. Aguilera huye derrotado, proclamando la independencia definitiva de la provincia de Santa Cruz de la Sierra y el cimiento de la nueva república libre.',
        oroPatriota: 250,
        oroRealista: 250,
        dificultadRealista: 'dificil',
        x: 700,
        y: 370
    }
];
