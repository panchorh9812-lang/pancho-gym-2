/* PANCHO GYM 2.0 - Vanilla JS PWA application */
(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const uid = (prefix = 'id') => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
  const today = () => new Date().toISOString().slice(0, 10);
  const EXERCISES = {
    'squat': { name: 'Sentadilla', muscle: 'Piernas y glúteos', category: 'Fuerza', image: 'squat.svg', instructions: 'Coloca los pies algo más abiertos que las caderas y baja flexionando cadera y rodillas.', start: 'Pies apoyados, abdomen firme, pecho abierto y mirada al frente.', execution: 'Desciende con control hasta donde mantengas la espalda neutra y empuja el suelo para subir.', mistakes: 'Juntar las rodillas, levantar los talones o redondear la espalda.' },
    'push-up': { name: 'Flexión de brazos', muscle: 'Pecho y tríceps', category: 'Fuerza', image: 'push-up.svg', instructions: 'Coloca las manos un poco más abiertas que los hombros y mantén el cuerpo alineado.', start: 'Plancha alta, manos debajo o ligeramente fuera de los hombros.', execution: 'Flexiona los codos para acercar el pecho al suelo y empuja hasta extender los brazos.', mistakes: 'Dejar caer la cadera, abrir demasiado los codos o acortar el recorrido.' },
    'lat-pulldown': { name: 'Jalón al pecho', muscle: 'Espalda', category: 'Fuerza', image: 'lat-pulldown.svg', instructions: 'Sujeta la barra algo más abierta que los hombros y estabiliza el tronco.', start: 'Sentado, muslos sujetos bajo el apoyo y brazos extendidos.', execution: 'Lleva los codos hacia abajo y la barra hacia la parte alta del pecho; vuelve lentamente.', mistakes: 'Balancear el tronco o tirar de la barra detrás de la nuca.' },
    'deadlift': { name: 'Peso muerto', muscle: 'Cadena posterior', category: 'Fuerza', image: 'deadlift.svg', instructions: 'Acerca la barra al cuerpo y flexiona cadera y rodillas manteniendo la columna neutra.', start: 'Pies bajo la barra, agarre firme, hombros sobre la barra.', execution: 'Empuja el suelo y extiende cadera y rodillas a la vez; baja siguiendo el mismo recorrido.', mistakes: 'Separar la barra del cuerpo, redondear la espalda o hiperextender arriba.' },
    'lunge': { name: 'Zancada', muscle: 'Piernas y glúteos', category: 'Fuerza', image: 'lunge.svg', instructions: 'Da un paso cómodo hacia delante y reparte el peso entre ambas piernas.', start: 'De pie, pies separados al ancho de caderas y tronco erguido.', execution: 'Flexiona ambas rodillas con control, mantén la rodilla delantera alineada y vuelve.', mistakes: 'Perder el equilibrio, juntar demasiado los pies o dejar colapsar la rodilla.' },
    'plank': { name: 'Plancha', muscle: 'Abdomen', category: 'Abdomen', image: 'plank.svg', instructions: 'Apoya antebrazos y puntas de los pies y crea una línea recta con el cuerpo.', start: 'Codos debajo de hombros, cuello neutro y abdomen contraído.', execution: 'Mantén la posición respirando con normalidad y sin dejar caer la zona lumbar.', mistakes: 'Elevar demasiado la cadera, hundir la espalda o aguantar la respiración.' },
    'mountain-climber': { name: 'Escalador', muscle: 'Core y cardio', category: 'Cardio', image: 'mountain-climber.svg', instructions: 'Desde plancha alta, alterna llevando las rodillas hacia el pecho.', start: 'Manos debajo de hombros, abdomen firme y piernas extendidas.', execution: 'Alterna las rodillas con ritmo controlado sin rebotar la zona lumbar.', mistakes: 'Elevar demasiado la cadera o desplazar los hombros detrás de las manos.' },
    'glute-bridge': { name: 'Puente de glúteos', muscle: 'Glúteos', category: 'Fuerza', image: 'glute-bridge.svg', instructions: 'Túmbate boca arriba con rodillas flexionadas y pies apoyados.', start: 'Pies al ancho de caderas, brazos a los lados y pelvis neutra.', execution: 'Eleva la pelvis apretando glúteos hasta alinear hombros, cadera y rodillas; baja lento.', mistakes: 'Arquea la zona lumbar o empujar principalmente con los talones demasiado lejos.' },
    'jumping-jacks': { name: 'Saltos de tijera', muscle: 'Cardio', category: 'Cardio', image: 'jumping-jacks.svg', instructions: 'Salta separando pies y elevando brazos, y vuelve al centro con suavidad.', start: 'De pie, pies juntos, brazos a los lados y rodillas relajadas.', execution: 'Coordina apertura y cierre con aterrizajes suaves y ritmo regular.', mistakes: 'Aterrizar rígido o forzar el rango de hombros.' },
    'shoulder-press': { name: 'Press de hombros', muscle: 'Hombros', category: 'Fuerza', image: 'shoulder-press.svg', instructions: 'Sostén las mancuernas a la altura de los hombros y estabiliza el abdomen.', start: 'Sentado o de pie, muñecas neutras y codos ligeramente por delante.', execution: 'Empuja las mancuernas arriba sin arquear la espalda y baja con control.', mistakes: 'Abrir excesivamente las costillas o bloquear con fuerza los codos.' },
    'row': { name: 'Remo con mancuerna', muscle: 'Espalda', category: 'Fuerza', image: 'row.svg', instructions: 'Apoya una mano en un banco, inclina el tronco y deja colgar la mancuerna.', start: 'Espalda neutra, hombro lejos de la oreja y brazo extendido.', execution: 'Lleva el codo hacia la cadera y baja lentamente sin rotar el tronco.', mistakes: 'Girar el cuerpo, encoger el hombro o usar impulso.' },
    'biceps-curl': { name: 'Curl de bíceps', muscle: 'Bíceps', category: 'Fuerza', image: 'biceps-curl.svg', instructions: 'Sujeta las mancuernas con palmas al frente y codos cerca del torso.', start: 'De pie, abdomen firme y brazos extendidos sin bloquear.', execution: 'Flexiona los codos para subir y baja de forma lenta y controlada.', mistakes: 'Balancear el cuerpo o adelantar los codos para ganar impulso.' },
    'cat-cow': { name: 'Gato-vaca', muscle: 'Movilidad', category: 'Movilidad', image: 'cat-cow.svg', instructions: 'A cuatro apoyos, alterna redondear y extender suavemente la columna.', start: 'Manos bajo hombros y rodillas bajo caderas.', execution: 'Exhala al redondear y lleva el pecho al frente al inhalar, sin forzar el cuello.', mistakes: 'Hacer movimientos bruscos o forzar el rango lumbar.' },
    'treadmill': { name: 'Caminata en cinta', muscle: 'Cardio', category: 'Cardio', image: 'treadmill.svg', instructions: 'Camina a un ritmo que eleve ligeramente la respiración y te permita hablar.', start: 'Sube con la cinta detenida y ajusta una velocidad cómoda.', execution: 'Mantén una zancada natural, mirada al frente y postura erguida.', mistakes: 'Saltar a la cinta en marcha o depender constantemente de las barras.' },
    'child-pose': { name: 'Postura del niño', muscle: 'Espalda y caderas', category: 'Recuperación', image: 'child-pose.svg', instructions: 'Desde rodillas, lleva la cadera suavemente hacia los talones y extiende los brazos al frente.', start: 'Rodillas cómodas, empeines apoyados y columna relajada.', execution: 'Respira profundo y mantén la posición sin forzar hombros ni caderas.', mistakes: 'Forzar las rodillas o contener la respiración.' },
    'hip-flexor': { name: 'Estiramiento de flexor de cadera', muscle: 'Cadera', category: 'Movilidad', image: 'hip-flexor.svg', instructions: 'Coloca una rodilla en el suelo y el otro pie delante, como en una zancada estable.', start: 'Tronco erguido y pelvis neutra.', execution: 'Desplaza la pelvis ligeramente hacia delante hasta notar tensión suave en la parte frontal de la cadera.', mistakes: 'Arquea la zona lumbar o forzar el estiramiento con rebotes.' }
  };
  Object.assign(EXERCISES, {
    'bench-press': { name: 'Press de banca', muscle: 'Pecho y tríceps', category: 'Fuerza', image: 'push-up.svg', instructions: 'Acuéstate en el banco, retrae suavemente los omóplatos y sujeta la barra.', start: 'Pies firmes en el suelo y manos algo más abiertas que los hombros.', execution: 'Baja la barra al pecho con control y empuja hacia arriba.', mistakes: 'Rebotar la barra o arquear excesivamente la espalda.' },
    'incline-press': { name: 'Press inclinado con mancuernas', muscle: 'Pecho superior', category: 'Fuerza', image: 'push-up.svg', instructions: 'Usa un banco inclinado y sostén las mancuernas a los lados del pecho.', start: 'Escápulas estables y pies apoyados.', execution: 'Empuja las mancuernas arriba y júntalas ligeramente sin golpearlas.', mistakes: 'Abrir demasiado los codos o perder el control.' },
    'chest-fly': { name: 'Aperturas con mancuernas', muscle: 'Pecho', category: 'Fuerza', image: 'push-up.svg', instructions: 'Con mancuernas ligeras, abre los brazos con codos ligeramente flexionados.', start: 'Tumbado en banco, mancuernas sobre el pecho.', execution: 'Abre hasta un estiramiento cómodo y vuelve cerrando los brazos.', mistakes: 'Bajar demasiado o convertirlo en un press.' },
    'triceps-extension': { name: 'Extensión de tríceps', muscle: 'Tríceps', category: 'Fuerza', image: 'shoulder-press.svg', instructions: 'Sujeta una mancuerna y mantén los codos cerca de la cabeza.', start: 'De pie o sentado, abdomen firme.', execution: 'Flexiona los codos para bajar la mancuerna y extiéndelos para subir.', mistakes: 'Abrir los codos o arquear la espalda.' },
    'triceps-pushdown': { name: 'Jalón de tríceps en polea', muscle: 'Tríceps', category: 'Fuerza', image: 'lat-pulldown.svg', instructions: 'Colócate frente a la polea alta con los codos pegados al torso.', start: 'Agarra la cuerda o barra con muñecas neutras.', execution: 'Extiende los codos hacia abajo y regresa lentamente.', mistakes: 'Balancear el cuerpo o separar los codos.' },
    'hammer-curl': { name: 'Curl martillo', muscle: 'Bíceps y antebrazo', category: 'Fuerza', image: 'biceps-curl.svg', instructions: 'Sujeta las mancuernas con las palmas enfrentadas.', start: 'De pie, codos junto al cuerpo.', execution: 'Flexiona los codos sin girar las muñecas y baja con control.', mistakes: 'Usar impulso o mover los hombros.' },
    'preacher-curl': { name: 'Curl en banco Scott', muscle: 'Bíceps', category: 'Fuerza', image: 'biceps-curl.svg', instructions: 'Apoya la parte posterior de los brazos en el banco Scott.', start: 'Agarre cómodo y codos apoyados.', execution: 'Flexiona los codos y baja sin bloquearlos bruscamente.', mistakes: 'Despegar los brazos del apoyo o usar demasiado peso.' },
    'seated-row': { name: 'Remo sentado en polea', muscle: 'Espalda media', category: 'Fuerza', image: 'row.svg', instructions: 'Siéntate frente a la polea con el torso erguido.', start: 'Rodillas ligeramente flexionadas y brazos extendidos.', execution: 'Lleva el agarre hacia el abdomen juntando suavemente los omóplatos.', mistakes: 'Redondear la espalda o echar el torso hacia atrás.' },
    'lateral-raise': { name: 'Elevación lateral', muscle: 'Hombro medio', category: 'Fuerza', image: 'shoulder-press.svg', instructions: 'Sujeta mancuernas ligeras a los lados del cuerpo.', start: 'Codos ligeramente flexionados y abdomen firme.', execution: 'Eleva los brazos hacia los lados hasta la altura de los hombros y baja lentamente.', mistakes: 'Balancear el cuerpo o elevar los hombros hacia las orejas.' },
    'face-pull': { name: 'Face pull', muscle: 'Hombro posterior y espalda alta', category: 'Fuerza', image: 'row.svg', instructions: 'Coloca la cuerda a la altura de la cara.', start: 'De pie, brazos extendidos y abdomen firme.', execution: 'Tira de la cuerda hacia la cara separando las manos.', mistakes: 'Elevar los hombros o arquear la zona lumbar.' },
    'pull-up': { name: 'Dominadas asistidas', muscle: 'Espalda y bíceps', category: 'Fuerza', image: 'lat-pulldown.svg', instructions: 'Usa una máquina asistida o banda para adaptar la dificultad.', start: 'Agarra la barra y activa los hombros.', execution: 'Lleva el pecho hacia la barra y baja de forma controlada.', mistakes: 'Balancearte o encoger los hombros.' },
    'straight-arm-pulldown': { name: 'Jalón con brazos rectos', muscle: 'Dorsales', category: 'Fuerza', image: 'lat-pulldown.svg', instructions: 'Frente a una polea alta, sujeta la barra con brazos casi extendidos.', start: 'Cadera ligeramente atrás y abdomen firme.', execution: 'Lleva la barra hacia los muslos sin doblar mucho los codos.', mistakes: 'Balancear el tronco o convertirlo en un remo.' },
    'leg-press': { name: 'Prensa de piernas', muscle: 'Cuádriceps y glúteos', category: 'Fuerza', image: 'squat.svg', instructions: 'Coloca los pies en la plataforma al ancho de hombros.', start: 'Espalda y cadera apoyadas en el respaldo.', execution: 'Baja hasta un rango cómodo y empuja sin bloquear las rodillas.', mistakes: 'Despegar la pelvis o juntar las rodillas.' },
    'leg-extension': { name: 'Extensión de piernas', muscle: 'Cuádriceps', category: 'Fuerza', image: 'squat.svg', instructions: 'Ajusta el respaldo y el rodillo sobre la parte baja de las piernas.', start: 'Rodillas alineadas con el eje de la máquina.', execution: 'Extiende las rodillas y baja lentamente.', mistakes: 'Dar impulso o usar un peso excesivo.' },
    'leg-curl': { name: 'Curl femoral', muscle: 'Isquiotibiales', category: 'Fuerza', image: 'deadlift.svg', instructions: 'Ajusta la máquina para que el rodillo quede sobre los talones.', start: 'Cadera estable y abdomen firme.', execution: 'Flexiona las rodillas acercando los talones y regresa despacio.', mistakes: 'Levantar la cadera o soltar el peso.' },
    'calf-raise': { name: 'Elevación de talones', muscle: 'Pantorrillas', category: 'Fuerza', image: 'lunge.svg', instructions: 'Coloca la parte delantera de los pies sobre una superficie estable.', start: 'De pie, rodillas suaves y apoyo firme.', execution: 'Eleva los talones, pausa arriba y baja con control.', mistakes: 'Rebotar o perder el equilibrio.' },
    'bulgarian-split-squat': { name: 'Sentadilla búlgara', muscle: 'Piernas y glúteos', category: 'Fuerza', image: 'lunge.svg', instructions: 'Coloca el empeine trasero sobre un banco bajo.', start: 'Da un paso al frente que te permita mantener equilibrio.', execution: 'Flexiona la pierna delantera y sube empujando el suelo.', mistakes: 'Dar un paso demasiado corto o dejar caer la rodilla hacia dentro.' },
    'romanian-deadlift': { name: 'Peso muerto rumano', muscle: 'Glúteos e isquiotibiales', category: 'Fuerza', image: 'deadlift.svg', instructions: 'Sujeta mancuernas o barra frente a los muslos.', start: 'Rodillas ligeramente flexionadas y espalda neutra.', execution: 'Lleva la cadera atrás deslizando el peso cerca de las piernas y vuelve.', mistakes: 'Redondear la espalda o convertirlo en una sentadilla.' },
    'hip-thrust': { name: 'Hip thrust', muscle: 'Glúteos', category: 'Fuerza', image: 'glute-bridge.svg', instructions: 'Apoya la espalda alta en un banco y coloca los pies firmes.', start: 'Barbilla ligeramente recogida y pelvis neutra.', execution: 'Eleva la cadera apretando glúteos y baja con control.', mistakes: 'Hiperextender la espalda o colocar los pies demasiado lejos.' },
    'step-up': { name: 'Subida al banco', muscle: 'Piernas y glúteos', category: 'Fuerza', image: 'lunge.svg', instructions: 'Usa un cajón o escalón estable de altura moderada.', start: 'Coloca un pie completo sobre el escalón.', execution: 'Empuja con la pierna elevada para subir y baja despacio.', mistakes: 'Impulsarte demasiado con la pierna de abajo.' },
    'sumo-squat': { name: 'Sentadilla sumo', muscle: 'Glúteos y aductores', category: 'Fuerza', image: 'squat.svg', instructions: 'Separa los pies más que los hombros y orienta las puntas ligeramente afuera.', start: 'Pecho abierto y abdomen firme.', execution: 'Baja entre las caderas y sube empujando el suelo.', mistakes: 'Dejar colapsar las rodillas o redondear la espalda.' },
    'goblet-squat': { name: 'Sentadilla goblet', muscle: 'Piernas y core', category: 'Fuerza', image: 'squat.svg', instructions: 'Sostén una mancuerna vertical frente al pecho.', start: 'Pies al ancho cómodo y codos apuntando hacia abajo.', execution: 'Flexiona cadera y rodillas manteniendo el torso estable.', mistakes: 'Levantar talones o perder la postura.' },
    'side-plank': { name: 'Plancha lateral', muscle: 'Oblicuos', category: 'Abdomen', image: 'plank.svg', instructions: 'Apoya un antebrazo y el lateral del pie.', start: 'Codo debajo del hombro y cuerpo alineado.', execution: 'Eleva la cadera y mantén la posición respirando.', mistakes: 'Dejar caer la pelvis o girar el tronco.' },
    'dead-bug': { name: 'Dead bug', muscle: 'Abdomen profundo', category: 'Abdomen', image: 'plank.svg', instructions: 'Túmbate boca arriba con brazos arriba y rodillas a 90 grados.', start: 'Mantén la zona lumbar estable contra el suelo.', execution: 'Extiende brazo y pierna contrarios y alterna lentamente.', mistakes: 'Arquear la espalda o acelerar el movimiento.' },
    'bird-dog': { name: 'Bird dog', muscle: 'Core y espalda', category: 'Abdomen', image: 'cat-cow.svg', instructions: 'Colócate a cuatro apoyos con columna neutra.', start: 'Manos bajo hombros y rodillas bajo caderas.', execution: 'Extiende brazo y pierna contrarios sin girar la pelvis.', mistakes: 'Elevar demasiado la pierna o arquear la espalda.' },
    'crunch': { name: 'Abdominal corto', muscle: 'Abdomen', category: 'Abdomen', image: 'plank.svg', instructions: 'Túmbate boca arriba con rodillas flexionadas.', start: 'Manos junto a las sienes sin tirar del cuello.', execution: 'Eleva ligeramente los hombros contrayendo el abdomen y baja despacio.', mistakes: 'Tirar de la cabeza o hacer impulso.' },
    'bicycle-crunch': { name: 'Abdominal bicicleta', muscle: 'Abdomen y oblicuos', category: 'Abdomen', image: 'plank.svg', instructions: 'Túmbate boca arriba con manos junto a las sienes.', start: 'Eleva hombros y piernas con control.', execution: 'Acerca codo y rodilla contrarios alternando sin tirar del cuello.', mistakes: 'Hacerlo rápido o mover solo los codos.' },
    'russian-twist': { name: 'Giros rusos', muscle: 'Oblicuos', category: 'Abdomen', image: 'plank.svg', instructions: 'Siéntate con rodillas flexionadas y torso ligeramente inclinado.', start: 'Mantén el pecho abierto y abdomen activo.', execution: 'Gira el tronco de lado a lado con recorrido controlado.', mistakes: 'Redondear la espalda o mover solo los brazos.' },
    'high-knees': { name: 'Rodillas altas', muscle: 'Cardio', category: 'Cardio', image: 'mountain-climber.svg', instructions: 'Corre en el sitio elevando las rodillas a una altura cómoda.', start: 'De pie, mirada al frente y abdomen activo.', execution: 'Alterna las piernas con aterrizajes ligeros.', mistakes: 'Inclinar demasiado el tronco o aterrizar rígido.' },
    'burpee': { name: 'Burpee adaptado', muscle: 'Cuerpo completo', category: 'Cardio', image: 'jumping-jacks.svg', instructions: 'Realiza una sentadilla, lleva las manos al suelo y camina o salta a plancha.', start: 'De pie, pies al ancho de caderas.', execution: 'Regresa los pies, levántate y añade salto solo si es cómodo.', mistakes: 'Perder la alineación lumbar o acelerar sin control.' },
    'step-jacks': { name: 'Tijeras sin salto', muscle: 'Cardio', category: 'Cardio', image: 'jumping-jacks.svg', instructions: 'Alterna pasos laterales mientras elevas los brazos.', start: 'De pie, rodillas suaves.', execution: 'Abre una pierna a la vez y acompaña con los brazos.', mistakes: 'Hacer pasos bruscos o bloquear las rodillas.' },
    'bike': { name: 'Bicicleta estática', muscle: 'Cardio', category: 'Cardio', image: 'treadmill.svg', instructions: 'Ajusta asiento y manubrio antes de comenzar.', start: 'Rodillas ligeramente flexionadas al extender el pedal.', execution: 'Pedalea a ritmo constante y ajusta la resistencia gradualmente.', mistakes: 'Balancear la cadera o colocar el asiento demasiado bajo.' },
    'elliptical': { name: 'Elíptica', muscle: 'Cardio', category: 'Cardio', image: 'treadmill.svg', instructions: 'Sube con cuidado y coloca los pies completos en los pedales.', start: 'Espalda erguida y manos en los agarres.', execution: 'Mantén un movimiento fluido y una intensidad conversacional.', mistakes: 'Colgar todo el peso de los brazos o encorvarse.' },
    'rowing-machine': { name: 'Remo en máquina', muscle: 'Cuerpo completo', category: 'Cardio', image: 'row.svg', instructions: 'Ajusta los pies y sujeta el mango con brazos relajados.', start: 'Espalda neutra, rodillas flexionadas y torso ligeramente inclinado.', execution: 'Empuja primero con piernas, después lleva el mango al torso; regresa en orden inverso.', mistakes: 'Tirar solo con brazos o redondear la espalda.' },
    'cobra-stretch': { name: 'Estiramiento de cobra suave', muscle: 'Abdomen y espalda', category: 'Movilidad', image: 'child-pose.svg', instructions: 'Boca abajo, coloca las manos junto al pecho.', start: 'Pelvis apoyada y hombros relajados.', execution: 'Eleva suavemente el pecho hasta donde resulte cómodo.', mistakes: 'Forzar la zona lumbar o encoger los hombros.' },
    'thoracic-rotation': { name: 'Rotación torácica', muscle: 'Espalda alta', category: 'Movilidad', image: 'cat-cow.svg', instructions: 'A cuatro apoyos, coloca una mano detrás de la cabeza.', start: 'Caderas estables y abdomen activo.', execution: 'Gira el codo hacia el techo y después hacia el brazo de apoyo.', mistakes: 'Mover la pelvis en lugar del torso.' },
    'hamstring-stretch': { name: 'Estiramiento de isquiotibiales', muscle: 'Parte posterior del muslo', category: 'Movilidad', image: 'hip-flexor.svg', instructions: 'Extiende una pierna con talón apoyado y rodilla suave.', start: 'Tronco erguido y cadera orientada al frente.', execution: 'Inclina el torso desde la cadera hasta sentir tensión ligera.', mistakes: 'Rebotar o redondear excesivamente la espalda.' },
    'quad-stretch': { name: 'Estiramiento de cuádriceps', muscle: 'Parte frontal del muslo', category: 'Movilidad', image: 'lunge.svg', instructions: 'De pie y con apoyo cercano si hace falta, acerca un talón al glúteo.', start: 'Rodillas juntas y pelvis neutra.', execution: 'Mantén el estiramiento sin tirar con fuerza.', mistakes: 'Arquear la espalda o abrir la rodilla hacia fuera.' },
    'ankle-mobility': { name: 'Movilidad de tobillo', muscle: 'Tobillos y pantorrillas', category: 'Movilidad', image: 'lunge.svg', instructions: 'Coloca un pie delante de una pared o apoyo estable.', start: 'Talón completamente apoyado.', execution: 'Lleva la rodilla hacia delante sobre los dedos y regresa.', mistakes: 'Levantar el talón o colapsar el arco del pie.' },
    'shoulder-circles': { name: 'Círculos de hombros', muscle: 'Hombros', category: 'Movilidad', image: 'shoulder-press.svg', instructions: 'De pie, deja los brazos relajados a los lados.', start: 'Cuello largo y postura cómoda.', execution: 'Haz círculos lentos hacia delante y hacia atrás.', mistakes: 'Hacer círculos bruscos o elevar el cuello.' }
  });
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const state = {
    view: 'inicio', profileId: localStorage.getItem('pg-active-profile') || 'profile-me',
    profile: null, profiles: [], routines: [], sessions: [], measurements: [], photos: [],
    editRoutine: null, editDayIndex: 0, showProfileCreate: false,
    activeSession: null, paused: false, timerRemaining: 0, timerInterval: null,
    cardioTimer: { exIndex: null, remaining: 0, running: false }, cardioTimerInterval: null,
    detailExercise: null, photoCompare: [], photoUrls: [],
    installPrompt: null
  };
  const root = $('#app');

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }
  function fmtDate(date, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
    if (!date) return '—';
    const d = new Date(date.length === 10 ? `${date}T12:00:00` : date);
    return Number.isNaN(d.getTime()) ? '—' : new Intl.DateTimeFormat('es-MX', options).format(d);
  }
  function notify(message, type = 'success') {
    const region = $('#toast-region');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    region.append(el);
    setTimeout(() => el.remove(), 3500);
  }
  async function refreshData() {
    state.profiles = await GymDB.getAll('profiles');
    state.profile = state.profiles.find(p => p.id === state.profileId) || state.profiles[0] || null;
    if (state.profile) {
      state.profileId = state.profile.id;
      localStorage.setItem('pg-active-profile', state.profileId);
      const bundle = await GymDB.profileBundle(state.profileId);
      state.routines = bundle.routines.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      state.sessions = bundle.sessions.sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
      state.measurements = bundle.measurements.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      state.photos = bundle.photos.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    } else {
      state.routines = []; state.sessions = []; state.measurements = []; state.photos = [];
    }
    const active = state.sessions.find(s => s.status === 'active');
    if (active && (!state.activeSession || state.activeSession.profileId === state.profileId)) state.activeSession = active;
    if (state.activeSession && state.activeSession.profileId !== state.profileId) state.activeSession = null;
  }
  function updateChrome() {
    const switcher = $('#profile-switch');
    switcher.innerHTML = state.profiles.map(p => `<option value="${esc(p.id)}" ${p.id === state.profileId ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
    $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === state.view));
    const status = $('#network-status');
    status.classList.toggle('offline', !navigator.onLine);
    status.querySelector('span').textContent = navigator.onLine ? 'Local' : 'Sin conexión';
  }
  function metricCard(label, value, suffix, icon, note = '') {
    return `<article class="metric-card"><div class="metric-top"><span>${esc(label)}</span><b>${icon}</b></div><strong>${esc(value)}<small>${esc(suffix || '')}</small></strong>${note ? `<p>${esc(note)}</p>` : ''}</article>`;
  }
  function buildRecommendedRoutine(profile) {
    const experience = profile.experience || 'Principiante';
    const sets = experience === 'Avanzado' ? 4 : experience === 'Intermedio' ? 3 : 2;
    const goal = profile.goal || 'Perder grasa y conservar músculo';
    const availability = Array.isArray(profile.availability) && profile.availability.length ? profile.availability : ['Lunes', 'Miércoles', 'Viernes'];
    const daysCount = Math.min(3, Math.max(1, availability.length));
    const mobilityGoal = /movilidad|recuperaci/i.test(goal);
    const strengthGoal = /fuerza|masa muscular|hipertrofia/i.test(goal);
    // Seis ejercicios por sesión, equilibrados según el objetivo seleccionado.
    const plans = mobilityGoal ? [
      [['cat-cow', 10], ['hip-flexor', 30], ['child-pose', 30], ['glute-bridge', 12], ['treadmill', 10], ['plank', 20]],
      [['glute-bridge', 12], ['cat-cow', 10], ['child-pose', 30], ['hip-flexor', 30], ['treadmill', 10], ['mountain-climber', 15]],
      [['hip-flexor', 30], ['child-pose', 30], ['treadmill', 10], ['cat-cow', 10], ['glute-bridge', 12], ['plank', 20]]
    ] : strengthGoal ? [
      [['squat', 8], ['push-up', 10], ['row', 10], ['plank', 30], ['shoulder-press', 8], ['biceps-curl', 12]],
      [['deadlift', 8], ['lunge', 10], ['glute-bridge', 12], ['lat-pulldown', 10], ['squat', 10], ['mountain-climber', 20]],
      [['shoulder-press', 8], ['row', 10], ['biceps-curl', 12], ['push-up', 10], ['lat-pulldown', 10], ['cat-cow', 8]]
    ] : [
      [['squat', 10], ['push-up', 10], ['lat-pulldown', 12], ['plank', 30], ['shoulder-press', 10], ['treadmill', 10]],
      [['deadlift', 8], ['lunge', 10], ['glute-bridge', 12], ['mountain-climber', 20], ['squat', 10], ['jumping-jacks', 30]],
      [['shoulder-press', 10], ['row', 12], ['jumping-jacks', 30], ['treadmill', 10], ['biceps-curl', 12], ['plank', 30]]
    ];
    const labels = mobilityGoal ? ['Movilidad general', 'Cadera y estabilidad', 'Recuperación activa'] : ['Cuerpo completo', 'Pierna y core', 'Tren superior y cardio'];
    const days = Array.from({ length: daysCount }, (_, i) => ({
      id: uid('day'), name: `${availability[i] || `Día ${i + 1}`} · ${labels[i]}`,
      exercises: plans[i].map(([exerciseId, reps]) => ({
        exerciseId, sets: mobilityGoal ? 2 : sets, reps,
        rest: mobilityGoal ? 30 : strengthGoal ? 90 : 60, weight: 0
      }))
    }));
    return {
      id: uid('routine'), profileId: profile.id,
      name: mobilityGoal ? 'Plan recomendado · movilidad' : strengthGoal ? 'Plan recomendado · fuerza' : 'Plan recomendado · acondicionamiento',
      goal, location: 'Mixto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), days
    };
  }
  function sessionsCount(rangeStart = null) {
    return state.sessions.filter(s => s.status === 'completed' && (!rangeStart || new Date(s.endedAt || s.startedAt) >= rangeStart)).length;
  }
  function weekStart(date = new Date()) {
    const d = new Date(date); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d;
  }
  function renderHome() {
    const completed = state.sessions.filter(s => s.status === 'completed');
    const thisWeek = sessionsCount(weekStart());
    const daysSet = new Set(completed.filter(s => new Date(s.endedAt || s.startedAt) >= weekStart()).map(s => (s.endedAt || s.startedAt).slice(0, 10)));
    const last = completed[0];
    const weight = state.profile?.weight ? `${Number(state.profile.weight).toLocaleString('es-MX')}` : '—';
    const height = state.profile?.height ? `${Number(state.profile.height).toLocaleString('es-MX')}` : '—';
    const schedule = Array.isArray(state.profile?.availability) ? state.profile.availability : [];
    const recent = completed.slice(0, 3);
    return `
      <section class="hero-panel">
        <div class="hero-copy"><span class="eyebrow">TU ESPACIO. TU PROGRESO.</span><h1>Vamos a por tu <em>siguiente nivel.</em></h1><p>Hola, ${esc(state.profile?.name || 'atleta')}. Entrena con constancia y registra cada avance.</p><div class="hero-actions"><button class="button button-primary" data-view="entrenar">Iniciar entrenamiento <span>→</span></button><button class="button button-outline" data-view="rutinas">Ver mis rutinas</button></div></div>
        <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-dumbbell">✦</div><div class="hero-stats"><small>ENTRENAMIENTOS ESTA SEMANA</small><strong>${thisWeek}<span> / 7</span></strong></div><div class="hero-tag">DISCIPLINA &nbsp;·&nbsp; PROGRESO</div></div>
      </section>
      <div class="section-heading"><div><span class="eyebrow">RESUMEN PERSONAL</span><h2>Tu actividad</h2></div><button class="text-button" data-view="progreso">Ver estadísticas <span>→</span></button></div>
      <section class="metrics-grid">
        ${metricCard('Peso actual', weight, 'kg', '↗', state.profile?.weight ? 'Actualiza tu medida cuando quieras' : 'Añade tu peso en Mi perfil')}
        ${metricCard('Estatura', height, 'cm', '↕', 'Dato de referencia')}
        ${metricCard('Sesiones completadas', completed.length, 'total', '◉', `${thisWeek} esta semana`)}
        ${metricCard('Días entrenados', daysSet.size, 'esta semana', '◷', 'Días distintos con sesión')}
      </section>
      <div class="dashboard-columns"><section class="panel"><div class="panel-heading"><div><span class="eyebrow">CONSTANCIA</span><h3>Tu semana</h3></div><span class="chip">${thisWeek} sesiones</span></div><div class="week-strip">${DAYS.map((day, i) => { const date = new Date(weekStart()); date.setDate(date.getDate() + i); const key = date.toISOString().slice(0, 10); const done = completed.some(s => (s.endedAt || s.startedAt).slice(0, 10) === key); return `<div class="week-day ${done ? 'done' : ''}"><span>${day.slice(0, 2)}</span><b>${date.getDate()}</b><i>${done ? '✓' : ''}</i></div>`; }).join('')}</div><div class="panel-foot"><span class="legend-dot"></span> Sesión completada</div></section>
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">PLANIFICACIÓN</span><h3>Días disponibles</h3></div><button class="mini-edit" data-action="edit-profile" title="Editar disponibilidad">✎</button></div><div class="availability-list">${(schedule.length ? schedule : ['Aún sin definir']).map(day => `<span class="availability-pill">${esc(day)}</span>`).join('')}</div><p class="muted small-copy">Ajusta tu disponibilidad desde tu perfil para organizar las sesiones.</p></section></div>
      <section class="panel recent-panel"><div class="panel-heading"><div><span class="eyebrow">HISTORIAL</span><h3>Actividad reciente</h3></div><button class="text-button" data-view="progreso">Ver todo →</button></div>${recent.length ? `<div class="recent-list">${recent.map(s => `<div class="recent-row"><span class="recent-icon">✓</span><div><strong>${esc(s.routineName || 'Entrenamiento')}</strong><small>${fmtDate(s.endedAt || s.startedAt)} · ${esc(s.dayName || 'Sesión')}</small></div><b>${Math.max(1, Math.round((s.durationSeconds || 0) / 60))} min</b></div>`).join('')}</div>` : `<div class="empty-inline"><span>◷</span><div><strong>Tu historial empieza aquí</strong><p>Completa tu primera sesión para ver tu actividad reciente.</p></div></div>`}</section>`;
  }
  function renderCreateProfilePanel() {
    if (!state.showProfileCreate) return '';
    return `<form class="panel create-profile-panel" id="create-profile-form"><div class="panel-heading"><div><span class="eyebrow">NUEVO ESPACIO</span><h3>Añadir perfil</h3></div><button type="button" class="mini-edit" data-action="close-profile-create">✕</button></div><label>Nombre del perfil<input name="name" required maxlength="48" placeholder="Ej. Carlos" autofocus></label><button class="button button-primary" type="submit">Crear perfil</button></form>`;
  }
  function renderProfile() {
    const p = state.profile;
    return `${renderCreateProfilePanel()}<div class="page-heading"><div><span class="eyebrow">DATOS PERSONALES</span><h1>Mi perfil</h1><p>Información, objetivos y disponibilidad de ${esc(p.name)}.</p></div><span class="profile-avatar">${esc((p.name || 'P').slice(0, 1).toUpperCase())}</span></div>
      <form class="panel profile-form" id="profile-form"><div class="form-grid">
      <label>Nombre<input name="name" required maxlength="48" value="${esc(p.name)}"></label>
      <label>Género<select name="gender">${[["","Selecciona"],["Mujer","Mujer"],["Hombre","Hombre"],["No binario","No binario"],["Prefiero no decirlo","Prefiero no decirlo"]].map(([v,t]) => `<option value="${v}" ${(p.gender || "") === v ? "selected" : ""}>${t}</option>`).join("")}</select></label><label>Edad (años)<input name="age" type="number" min="10" max="100" value="${esc(p.age)}" placeholder="Ej. 28"></label>
      <label>Peso actual (kg)<input name="weight" type="number" min="20" max="400" step="0.1" value="${esc(p.weight)}" placeholder="Ej. 78.5"></label>
      <label>Estatura (cm)<input name="height" type="number" min="100" max="250" step="0.1" value="${esc(p.height)}" placeholder="Ej. 175"></label>
      <label>Objetivo<select name="goal">${['Perder grasa y conservar músculo', 'Mejorar condición física', 'Ganar fuerza', 'Ganar masa muscular', 'Mejorar movilidad', 'Mantenerme activo'].map(x => `<option ${p.goal === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      <label>Experiencia<select name="experience">${['Principiante', 'Intermedio', 'Avanzado'].map(x => `<option ${p.experience === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
      </div><div class="form-divider"></div><div class="field-title"><h3>Disponibilidad semanal</h3><p>Selecciona los días en los que normalmente puedes entrenar.</p></div><div class="day-checks">${DAYS.map(day => `<label class="day-check"><input type="checkbox" name="availability" value="${day}" ${(p.availability || []).includes(day) ? 'checked' : ''}><span>${day.slice(0, 3)}</span></label>`).join('')}</div><div class="form-actions"><button class="button button-primary" type="submit">Guardar cambios</button><span class="muted small-copy">Se guarda automáticamente en este dispositivo al confirmar.</span></div></form>
      <section class="panel danger-zone"><div><strong>Gestión de perfil</strong><p>Los datos de cada perfil permanecen separados.</p></div><button class="button button-danger" data-action="delete-profile" ${state.profiles.length <= 1 ? 'disabled' : ''}>Eliminar este perfil</button></section>`;
  }
  function routineCard(r) {
    const exerciseCount = (r.days || []).reduce((total, day) => total + (day.exercises || []).length, 0);
    return `<article class="routine-card"><div class="routine-card-top"><span class="routine-mark">▤</span><span class="chip">${esc(r.location || 'Gimnasio')}</span></div><h3>${esc(r.name)}</h3><p>${esc(r.goal || 'Plan personal')}</p><div class="routine-meta"><span>▦ ${(r.days || []).length} días</span><span>◉ ${exerciseCount} ejercicios</span></div><div class="routine-actions"><button class="button button-outline" data-action="edit-routine" data-id="${esc(r.id)}">Editar</button><button class="button button-primary" data-action="start-routine" data-id="${esc(r.id)}">Entrenar →</button></div></article>`;
  }
  function exerciseRow(ex, index) {
    const details = EXERCISES[ex.exerciseId] || EXERCISES.squat;
    return `<div class="routine-exercise-row" data-ex-index="${index}" data-cardio-role="${esc(ex.cardioRole || "")}"><img src="assets/exercises/${details.image}" alt="Ilustración de ${esc(details.name)}"><div class="exercise-fields"><div class="exercise-select-line"><select data-field="exerciseId" aria-label="Ejercicio" ${ex.cardioRole ? "disabled" : ""}>${Object.entries(EXERCISES).map(([id, item]) => `<option value="${id}" ${id === ex.exerciseId ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select><button type="button" class="mini-edit" data-action="exercise-detail" data-id="${esc(ex.exerciseId)}" title="Ver técnica">ⓘ</button>${ex.cardioRole ? `<span class="chip">Cardio obligatorio</span>` : `<button type="button" class="mini-edit remove-exercise" data-action="remove-exercise" data-index="${index}" title="Quitar ejercicio">×</button>`}</div><div class="exercise-number-fields"><label>Series<input type="number" min="1" max="50" data-field="sets" value="${Number(ex.sets) || 3}"></label><label>Reps / seg<input type="number" min="1" max="300" data-field="reps" value="${Number(ex.reps) || 10}"></label><label>Descanso (s)<input type="number" min="0" max="600" data-field="rest" value="${Number(ex.rest) || 60}"></label><label>Peso (kg)<input type="number" min="0" max="500" step="0.5" data-field="weight" value="${Number(ex.weight) || 0}"></label></div><small>${esc(details.muscle)} · ${esc(details.category)}</small></div></div>`;
  }
  function renderRoutineEditor() {
    const routine = state.editRoutine;
    const day = routine.days[state.editDayIndex] || routine.days[0];
    return `<section class="page-heading"><div><span class="eyebrow">DISEÑA TU PLAN</span><h1>${routine.id ? 'Editar rutina' : 'Crear rutina'}</h1><p>Adapta los ejercicios, series, repeticiones y descansos.</p></div><button class="button button-quiet" data-action="close-routine-editor">← Volver</button></section>
      <form id="routine-editor-form" class="panel routine-editor"><div class="form-grid"><label>Nombre de la rutina<input name="name" required maxlength="60" value="${esc(routine.name)}"></label><label>Objetivo<select name="goal">${['Perder grasa y conservar músculo','Mejorar condición física','Fuerza','Hipertrofia','Movilidad y recuperación'].map(x => `<option ${routine.goal === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label><label>Entorno<select name="location">${['Gimnasio','Casa','Mixto'].map(x => `<option ${routine.location === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label></div>
      <div class="form-divider"></div><div class="editor-day-tabs">${routine.days.map((d, i) => `<button type="button" class="day-tab ${i === state.editDayIndex ? 'active' : ''}" data-action="select-edit-day" data-index="${i}">${esc(d.name || `Día ${i + 1}`)}</button>`).join('')}<button type="button" class="day-tab add-day" data-action="add-routine-day">＋ Añadir día</button></div>
      <label class="day-name-field">Nombre del día<input name="dayName" maxlength="50" value="${esc(day.name)}"></label>
      <div class="exercise-editor-list">${day.exercises.map(exerciseRow).join('') || `<div class="empty-inline"><span>＋</span><div><strong>Este día aún no tiene ejercicios</strong><p>Añade ejercicios desde la biblioteca.</p></div></div>`}</div>
      <button type="button" class="button button-outline add-exercise-button" data-action="add-exercise">＋ Añadir ejercicio</button>
      <div class="form-actions"><button class="button button-primary" type="submit">Guardar rutina</button><button class="button button-quiet" type="button" data-action="close-routine-editor">Cancelar</button>${routine.id ? `<button class="text-button danger-text" type="button" data-action="delete-routine" data-id="${esc(routine.id)}">Eliminar rutina</button>` : ''}</div></form>`;
  }
  function buildMuscleSplitRoutine() {
    const now = new Date().toISOString();
    const make = (id, reps, sets = 3) => ({ exerciseId: id, sets, reps, rest: 60, weight: 0 });
    const cardio = (minutes, cardioRole) => ({ ...make('treadmill', minutes, 1), cardioRole });
    const days = [
      { id: uid('day'), name: 'Día 1 · Pierna completa', exercises: [
        cardio(20, 'cardio-start'), make('squat', 10), make('leg-press', 12), make('romanian-deadlift', 10), make('leg-extension', 12), make('leg-curl', 12), make('calf-raise', 15), cardio(10, 'cardio-end')
      ]},
      { id: uid('day'), name: 'Día 2 · Pecho y brazo', exercises: [
        cardio(20, 'cardio-start'), make('bench-press', 10), make('incline-press', 10), make('chest-fly', 12), make('biceps-curl', 12), make('hammer-curl', 12), make('triceps-pushdown', 12), make('triceps-extension', 12), cardio(10, 'cardio-end')
      ]},
      { id: uid('day'), name: 'Día 3 · Espalda y hombro', exercises: [
        cardio(20, 'cardio-start'), make('lat-pulldown', 10), make('seated-row', 12), make('face-pull', 15), make('shoulder-press', 10), make('row', 12), make('lateral-raise', 12), cardio(10, 'cardio-end')
      ]}
    ];
    return { id: uid('routine'), profileId: state.profileId, name: 'Rutina dividida · 3 grupos musculares', goal: 'Fuerza e hipertrofia', location: 'Gimnasio', createdAt: now, updatedAt: now, cardioRequired: true, days };
  }

  function muscleGroup(exercise) {
    if (exercise.category === 'Cardio') return 'Cardio';
    if (exercise.category === 'Movilidad' || exercise.category === 'Recuperación') return 'Movilidad y recuperación';
    const muscle = String(exercise.muscle || '').toLowerCase();
    if (muscle.includes('pecho')) return 'Pecho';
    if (muscle.includes('espalda') || muscle.includes('dorsal') || muscle.includes('cadena posterior')) return 'Espalda';
    if (muscle.includes('hombro')) return 'Hombros';
    if (muscle.includes('bíceps') || muscle.includes('biceps')) return 'Bíceps';
    if (muscle.includes('tríceps') || muscle.includes('triceps')) return 'Tríceps';
    if (['pierna','glúte','cuádr','isqui','pantorrilla','aductor','femoral'].some(term => muscle.includes(term))) return 'Piernas y glúteos';
    if (['abdomen','core','oblicuo'].some(term => muscle.includes(term))) return 'Abdomen y core';
    return 'Otros músculos';
  }
  function renderExerciseLibrary() {
    const groups = {};
    Object.entries(EXERCISES).forEach(([id, ex]) => { const group = muscleGroup(ex); (groups[group] ||= []).push([id, ex]); });
    const order = ['Pecho','Espalda','Hombros','Bíceps','Tríceps','Piernas y glúteos','Abdomen y core','Otros músculos','Movilidad y recuperación','Cardio'];
    return order.filter(group => groups[group]?.length).map(group => '<section class="exercise-library-group"><div class="library-group-heading"><h4>' + group + '</h4><span>' + groups[group].length + ' ejercicios</span></div><div class="library-grid">' + groups[group].map(([id, ex]) => '<button class="library-item" data-action="exercise-detail" data-id="' + id + '"><img src="assets/exercises/' + ex.image + '" alt="Ilustración de ' + esc(ex.name) + '"><span><strong>' + esc(ex.name) + '</strong><small>' + esc(ex.muscle) + '</small></span><b>ⓘ</b></button>').join('') + '</div></section>').join('');
  }

  function renderRoutines() {
    if (state.editRoutine) return renderRoutineEditor();
    return `<div class="page-heading"><div><span class="eyebrow">PLANIFICACIÓN</span><h1>Mis rutinas</h1><p>Planes adaptables a tu objetivo y al equipo que tienes disponible.</p></div><div class="heading-actions"><button class="button button-outline" data-action="generate-routine">✦ Generar recomendada</button><button class="button button-outline" data-action="create-muscle-split">＋ Rutina por músculos</button><button class="button button-primary" data-action="new-routine">＋ Crear rutina</button></div></div>
      <div class="routine-guidance"><span>✦</span><div><strong>Rutina dividida por músculos</strong><p>Incluye pierna completa, pecho y brazo, y espalda y hombro. Cada sesión lleva 20 minutos de cardio al inicio y 10 minutos al final.</p></div></div>
      ${state.routines.length ? `<section class="routine-grid">${state.routines.map(routineCard).join('')}</section>` : `<section class="empty-state"><div class="empty-symbol">▤</div><h3>Tu primer plan empieza aquí</h3><p>Crea una rutina para este perfil. Los planes no se comparten con otros perfiles.</p><div class="empty-actions"><button class="button button-primary" data-action="generate-routine">✦ Generar rutina recomendada</button><button class="button button-outline" data-action="new-routine">Crear desde cero</button></div></section>`}
      <section class="panel exercise-library"><div class="panel-heading"><div><span class="eyebrow">BIBLIOTECA</span><h3>Ejercicios disponibles</h3></div><span class="chip">${Object.keys(EXERCISES).length} ejercicios</span></div><div class="library-grid">${renderExerciseLibrary()}</div></section>`;
  }
  function newSession(routine) {
    const dayIndex = Math.max(0, Number($('#training-day')?.value || 0));
    const day = routine.days[dayIndex] || routine.days[0];
    if (!day || !day.exercises?.length) return notify('Añade al menos un ejercicio a este día antes de entrenar.', 'error'), null;
    const cardioStart = day.exercises.find(ex => ex.cardioRole === 'cardio-start');
    const cardioEnd = day.exercises.find(ex => ex.cardioRole === 'cardio-end');
    const sourceExercises = day.exercises.filter(ex => !ex.cardioRole);
    const cardioItem = (role, minutes) => ({ exerciseId: 'treadmill', cardioRole: role, sets: 1, reps: minutes, rest: 0, weight: 0 });
    const exercises = [cardioStart || cardioItem('cardio-start', 20), ...sourceExercises, cardioEnd || cardioItem('cardio-end', 10)].map(ex => {
      const info = EXERCISES[ex.exerciseId] || EXERCISES.squat;
      return {
        exerciseId: ex.exerciseId, name: info.name, muscle: info.muscle, ...(ex.cardioRole ? { cardioRole: ex.cardioRole } : {}),
        rest: Number(ex.rest) || 60,
        sets: Array.from({ length: Math.max(1, Math.min(50, Number(ex.sets) || 3)) }, () => ({ reps: Number(ex.reps) || 10, weight: Number(ex.weight) || 0, done: false }))
      };
    });
    return {
      id: uid('session'), profileId: state.profileId, routineId: routine.id,
      routineName: routine.name, dayName: day.name, dayIndex,
      status: 'active', startedAt: new Date().toISOString(), exercises
    };
  }
  function workoutProgress(session) {
    const sets = (session?.exercises || []).filter(ex => !ex.cardioRole).flatMap(ex => ex.sets || []);
    const total = sets.length;
    const done = sets.filter(set => set.done).length;
    return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function renderTrainingPreview(day) {
    if (!day) return `<div class="empty-inline"><span>＋</span><div><strong>Selecciona un día</strong><p>Elige una rutina para ver sus ejercicios.</p></div></div>`;
    const exercises = day.exercises || [];
    return `<div class="preview-heading"><strong>${esc(day.name)}</strong><span>${exercises.length} ejercicios</span></div><div class="preview-exercises">${exercises.map(ex => { const info = EXERCISES[ex.exerciseId] || EXERCISES.squat; return `<div><img src="assets/exercises/${info.image}" alt=""><span>${esc(info.name)}</span><small>${ex.cardioRole ? `${Number(ex.reps)} min` : `${Number(ex.sets) || 3} × ${Number(ex.reps) || 10}`}</small></div>`; }).join('') || '<p class="muted small-copy">Este día aún no tiene ejercicios.</p>'}</div>`;
  }
  function formatCountdown(seconds) { const n = Math.max(0, Number(seconds) || 0); return String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0'); }
  function renderCardioCountdown(ex, index) { const duration = ex.cardioRole === 'cardio-start' ? 1200 : 600; const t = state.cardioTimer; const selected = t.exIndex === index; const remaining = selected ? t.remaining : duration; return '<section class="timer-panel cardio-countdown"><div><span class="eyebrow">' + (ex.cardioRole === 'cardio-start' ? 'CUENTA REGRESIVA · CARDIO INICIAL' : 'CUENTA REGRESIVA · CARDIO FINAL') + '</span><strong data-cardio-clock="' + index + '">' + formatCountdown(remaining) + '</strong><small>' + (selected && remaining === 0 ? '¡Tiempo completado!' : selected && !t.running ? 'Temporizador pausado' : selected && t.running ? 'Temporizador en marcha' : 'Temporizador listo') + '</small></div><div class="timer-actions"><button class="button button-primary" type="button" data-action="cardio-timer-toggle" data-index="' + index + '" ' + (state.paused || (selected && t.running) ? 'disabled' : '') + '>' + (selected && remaining < duration && remaining > 0 ? 'Reanudar' : 'Iniciar') + '</button><button class="button button-quiet" type="button" data-action="cardio-timer-reset" data-index="' + index + '" ' + (state.paused ? 'disabled' : '') + '>Reiniciar</button></div></section>'; }
  function stopCardioTimer() { clearInterval(state.cardioTimerInterval); state.cardioTimerInterval = null; state.cardioTimer.running = false; }
  function startCardioTimer(index, reset = false) { const ex = state.activeSession && state.activeSession.exercises[index]; if (!ex || !ex.cardioRole || state.paused) return; const duration = ex.cardioRole === 'cardio-start' ? 1200 : 600; if (reset || state.cardioTimer.exIndex !== index) state.cardioTimer = { exIndex: index, remaining: duration, running: false }; if (state.cardioTimer.remaining <= 0) state.cardioTimer.remaining = duration; stopCardioTimer(); state.cardioTimer.running = true; const paint = () => { const clock = document.querySelector('[data-cardio-clock="' + index + '"]'); if (clock) { clock.textContent = formatCountdown(state.cardioTimer.remaining); const small = clock.parentElement.querySelector('small'); if (small) small.textContent = state.cardioTimer.remaining === 0 ? '¡Tiempo completado!' : state.cardioTimer.running ? 'Temporizador en marcha' : 'Temporizador pausado'; } }; paint(); state.cardioTimerInterval = setInterval(() => { if (state.paused || !state.cardioTimer.running) return; state.cardioTimer.remaining = Math.max(0, state.cardioTimer.remaining - 1); paint(); if (!state.cardioTimer.remaining) { stopCardioTimer(); paint(); const button = document.querySelector('[data-action="cardio-timer-toggle"][data-index="' + index + '"]'); if (button) { button.disabled = false; button.textContent = 'Iniciar'; } notify(ex.cardioRole === 'cardio-start' ? '¡Cardio inicial completado! Continúa con tus ejercicios.' : '¡Cardio final completado! Excelente trabajo.'); } }, 1000); }
  function renderTraining() {
    const session = state.activeSession && state.activeSession.profileId === state.profileId && state.activeSession.status === 'active' ? state.activeSession : null;
    if (session) {
      const { pct, done, total } = workoutProgress(session);
      const pausedBanner = state.paused ? '<div class="paused-banner">Entrenamiento pausado. Pulsa Reanudar cuando estés listo.</div>' : '';
      const cardioStartIndex = session.exercises.findIndex(ex => ex.cardioRole === 'cardio-start');
      const cardioEndIndex = session.exercises.findIndex(ex => ex.cardioRole === 'cardio-end');
      const exercises = session.exercises.map((ex, exIndex) => {
        const info = EXERCISES[ex.exerciseId] || EXERCISES.squat;
        if (ex.cardioRole) return '';
        return `<article class="panel workout-exercise"><div class="workout-exercise-head"><img src="assets/exercises/${info.image}" alt="Ilustración de ${esc(info.name)}"><div><span class="eyebrow">${ex.cardioRole === "cardio-start" ? "CARDIO INICIAL · 20 MIN" : ex.cardioRole === "cardio-end" ? "CARDIO FINAL · 10 MIN" : `EJERCICIO ${exIndex + 1}`}</span><h3>${esc(ex.name || info.name)}</h3><small>${esc(info.muscle)}</small></div><button class="mini-edit" type="button" data-action="exercise-detail" data-id="${esc(ex.exerciseId)}" aria-label="Ver técnica de ${esc(info.name)}">ⓘ</button></div>
          <div class="set-table"><div class="set-table-head"><span>Serie</span><span>Reps / min</span><span>Peso (kg)</span><span>Hecha</span></div>${ex.sets.map((set, setIndex) => `<div class="set-row ${set.done ? 'set-done' : ''}"><b>${setIndex + 1}</b><input type="number" min="1" max="300" value="${Number(set.reps) || 10}" aria-label="Repeticiones" data-session-field="reps" data-ex-index="${exIndex}" data-set-index="${setIndex}" ${state.paused ? 'disabled' : ''}><input type="number" min="0" max="500" step="0.5" value="${Number(set.weight) || 0}" aria-label="Peso utilizado en kg" data-session-field="weight" data-ex-index="${exIndex}" data-set-index="${setIndex}" ${state.paused ? 'disabled' : ''}><label class="set-check" aria-label="Marcar serie ${setIndex + 1}"><input type="checkbox" data-session-field="done" data-ex-index="${exIndex}" data-set-index="${setIndex}" ${set.done ? 'checked' : ''} ${state.paused ? 'disabled' : ''}><span></span></label></div>`).join('')}</div>
          ${!ex.cardioRole ? `<div class="session-set-actions"><button type="button" class="button button-outline" data-action="add-session-set" data-index="${exIndex}" ${state.paused || ex.sets.length >= 50 ? "disabled" : ""}>＋ Agregar serie</button><button type="button" class="button button-quiet" data-action="remove-session-set" data-index="${exIndex}" ${state.paused || ex.sets.length <= 1 ? "disabled" : ""}>− Quitar última</button></div>` : ""}<div class="workout-exercise-foot"><span>Descanso sugerido: ${Number(ex.rest) || 60} s</span><label>Sustituir <select data-replace-exercise="${exIndex}" ${(state.paused || ex.cardioRole) ? 'disabled' : ''}>${Object.entries(EXERCISES).map(([id, item]) => `<option value="${id}" ${id === ex.exerciseId ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select></label></div></article>`;
      }).join('');
      return `<div class="page-heading"><div><span class="eyebrow">SESIÓN EN CURSO</span><h1>${esc(session.routineName)}</h1><p>${esc(session.dayName)} · ${fmtDate(session.startedAt)}</p></div><span class="live-chip">● ${state.paused ? 'EN PAUSA' : 'EN VIVO'}</span></div>
        <section class="panel workout-summary"><div><span class="eyebrow">AVANCE DE LA SESIÓN</span><strong>${pct}%</strong><p>${done} de ${total} series completadas</p></div><div class="progress-ring" style="--progress:${pct * 3.6}deg"><span>${pct}%</span></div><div class="progress-track"><span style="width:${pct}%"></span></div></section>${pausedBanner}
        ${cardioStartIndex >= 0 ? renderCardioCountdown(session.exercises[cardioStartIndex], cardioStartIndex) : ''}
        <section class="workout-exercises">${exercises}</section>
         ${cardioEndIndex >= 0 ? renderCardioCountdown(session.exercises[cardioEndIndex], cardioEndIndex) : ''}
        <div class="sticky-workout-actions">${state.paused ? '<button class="button button-primary" data-action="resume-workout">▶ Reanudar</button>' : '<button class="button button-outline" data-action="pause-workout">Ⅱ Pausar</button>'}<button class="button button-primary" data-action="finish-workout">Finalizar sesión</button><button class="button button-danger" data-action="cancel-workout">Cancelar</button></div>`;
    }
    if (!state.routines.length) return `<div class="page-heading"><div><span class="eyebrow">ENTRENAMIENTO</span><h1>Tu próxima sesión</h1><p>Primero crea o genera una rutina para este perfil.</p></div></div><section class="empty-state"><div class="empty-symbol">◉</div><h3>Sin rutinas todavía</h3><p>Los planes son independientes para cada perfil.</p><div class="empty-actions"><button class="button button-primary" data-action="generate-routine">Generar rutina recomendada</button><button class="button button-outline" data-view="rutinas">Ver rutinas</button></div></section>`;
    const selected = state.routines.find(r => r.id === state.selectedRoutineId) || state.routines[0];
    if (selected) state.selectedRoutineId = selected.id;
    return `<div class="page-heading"><div><span class="eyebrow">ENTRENAMIENTO</span><h1>Prepara tu sesión</h1><p>Selecciona tu plan y el día que vas a realizar.</p></div><span class="local-badge">Guardado local</span></div><section class="panel training-picker"><label>Rutina<select id="training-routine">${state.routines.map(r => `<option value="${esc(r.id)}" ${r.id === selected.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select></label><label>Día de entrenamiento<select id="training-day">${selected.days.map((d, i) => `<option value="${i}">${esc(d.name)}</option>`).join('')}</select></label><div class="training-preview" id="training-preview">${renderTrainingPreview(selected.days[0])}</div><button class="button button-outline button-large" type="button" data-action="edit-selected-routine">＋ Agregar o quitar ejercicios de esta rutina</button><p class="training-note">Ajusta las cargas a tu nivel. Prioriza la técnica y detente si aparece dolor.</p><button class="button button-primary button-large" data-action="start-selected-workout">Iniciar entrenamiento →</button></section>`;
  }
  function startRest(seconds) {
    clearInterval(state.timerInterval);
    state.timerRemaining = Math.max(0, Math.floor(Number(seconds) || 0));
    const output = $('#rest-timer');
    const paint = () => { if ($('#rest-timer')) $('#rest-timer').textContent = `${String(Math.floor(state.timerRemaining / 60)).padStart(2, '0')}:${String(state.timerRemaining % 60).padStart(2, '0')}`; };
    paint();
    if (!state.timerRemaining || state.paused) return;
    state.timerInterval = setInterval(() => {
      if (state.paused) { clearInterval(state.timerInterval); return; }
      state.timerRemaining = Math.max(0, state.timerRemaining - 1); paint();
      if (state.timerRemaining <= 0) { clearInterval(state.timerInterval); notify('Descanso terminado. ¡A por la siguiente serie!', 'info'); }
    }, 1000);
  }
  function renderProgress() {
    const completed = state.sessions.filter(s => s.status === 'completed');
    const measurements = [...state.measurements].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const weights = measurements.filter(m => Number(m.weight) > 0);
    const initial = weights[0]?.weight ?? state.profile.weight ?? '—';
    const current = state.profile.weight || weights.at(-1)?.weight || '—';
    const difference = Number(initial) && Number(current) ? Number((Number(current) - Number(initial)).toFixed(1)) : null;
    const thisWeek = sessionsCount(weekStart());
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
    const thisMonth = sessionsCount(monthStart);
    const maxWeight = Math.max(1, ...weights.map(m => Number(m.weight)));
    const minWeight = Math.min(maxWeight, ...weights.map(m => Number(m.weight)));
    let chart = '<div class="chart-empty"><span>⌁</span><strong>Aún no hay registros de peso</strong><p>Guarda medidas para ver tu evolución.</p></div>';
    if (weights.length) {
      const points = weights.map((m, i) => {
        const x = weights.length === 1 ? 50 : 8 + i * 84 / (weights.length - 1);
        const y = 78 - ((Number(m.weight) - minWeight + 1) / (maxWeight - minWeight + 1)) * 58;
        return `${x},${y}`;
      }).join(' ');
      chart = `<svg class="weight-chart" viewBox="0 0 100 86" role="img" aria-label="Evolución del peso"><polyline points="${points}" fill="none" stroke="#a9ef38" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${weights.map((m, i) => { const x = weights.length === 1 ? 50 : 8 + i * 84 / (weights.length - 1); const y = 78 - ((Number(m.weight) - minWeight + 1) / (maxWeight - minWeight + 1)) * 58; return `<circle cx="${x}" cy="${y}" r="2.8" fill="#a9ef38"/>`; }).join('')}</svg><div class="chart-legend"><span>${fmtDate(weights[0].date)}</span><strong>${Number(current).toLocaleString('es-MX')} kg</strong><span>${fmtDate(weights.at(-1).date)}</span></div>`;
    }
    const weekdays = DAYS.slice(0, 7).map((day, i) => {
      const start = weekStart(); start.setDate(start.getDate() + i);
      const count = completed.filter(s => { const d = new Date(s.endedAt || s.startedAt); return d.toDateString() === start.toDateString(); }).length;
      return `<div class="bar-column"><b>${count || ''}</b><div class="bar-track"><i style="height:${Math.max(3, count * 35)}%"></i></div><small>${day.slice(0,2)}</small></div>`;
    }).join('');
    const history = completed.map(s => `<div class="history-row"><span class="history-check">✓</span><div><strong>${esc(s.routineName || 'Entrenamiento')}</strong><small>${fmtDate(s.endedAt || s.startedAt)} · ${esc(s.dayName || 'Sesión')}</small></div><span>${Math.max(1, Math.round((s.durationSeconds || 0) / 60))} min</span></div>`).join('') || '<div class="empty-inline"><span>◷</span><div><strong>Aún no hay entrenamientos</strong><p>Las sesiones completadas aparecerán aquí.</p></div></div>';
    const measurementsList = [...measurements].reverse().map(m => `<div class="measurement-row"><strong>${fmtDate(m.date)}</strong><span>${[['weight','Peso','kg'],['waist','Cintura','cm'],['chest','Pecho','cm'],['hip','Cadera','cm'],['arm','Brazo','cm'],['thigh','Muslo','cm']].filter(([key]) => m[key] !== undefined && m[key] !== '').map(([key,label,unit]) => `${label}: ${m[key]} ${unit}`).join(' · ')}</span><button class="mini-edit" data-action="delete-measurement" data-id="${esc(m.id)}" aria-label="Eliminar medida">×</button></div>`).join('');
    const loads = completed.flatMap(s => s.exercises.flatMap(ex => (ex.sets || []).map(set => ({ name: ex.name || EXERCISES[ex.exerciseId]?.name || 'Ejercicio', weight: Number(set.weight) || 0, date: s.endedAt || s.startedAt })))).filter(x => x.weight > 0).sort((a,b) => b.weight - a.weight).slice(0,8);
    return `<div class="page-heading"><div><span class="eyebrow">DATOS Y CONSTANCIA</span><h1>Tu progreso</h1><p>Una visión de tus medidas, entrenamientos y cargas registradas.</p></div><button class="button button-outline" data-action="jump-measurement">＋ Registrar medidas</button></div>
      <section class="metrics-grid progress-metrics">${metricCard('Peso inicial', initial, 'kg', '↗', 'Primer registro disponible')}${metricCard('Peso actual', current, 'kg', '↕', 'Último dato de perfil')}${metricCard('Cambio de peso', difference === null ? '—' : `${difference > 0 ? '+' : ''}${difference}`, 'kg', '⌁', 'Respecto al peso inicial')}${metricCard('Entrenamientos', completed.length, 'total', '◉', `${thisWeek} esta semana · ${thisMonth} este mes`)}</section>
      <div class="dashboard-columns"><section class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">EVOLUCIÓN CORPORAL</span><h3>Peso a lo largo del tiempo</h3></div></div>${chart}</section><section class="panel"><div class="panel-heading"><div><span class="eyebrow">CONSTANCIA</span><h3>Esta semana</h3></div><span class="chip">${thisWeek} sesiones</span></div><div class="weekly-bars">${weekdays}</div></section></div>
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">MEDIDAS</span><h3>Registrar medidas corporales</h3></div></div><form id="measurement-form" class="measurement-form"><label>Fecha<input type="date" name="date" value="${today()}" required></label>${[['weight','Peso (kg)'],['waist','Cintura (cm)'],['chest','Pecho (cm)'],['hip','Cadera (cm)'],['arm','Brazo (cm)'],['thigh','Muslo (cm)']].map(([key,label]) => `<label>${label}<input type="number" name="${key}" min="0" max="500" step="0.1" placeholder="—" value="${key === 'weight' && state.profile.weight ? esc(state.profile.weight) : ''}"></label>`).join('')}<button class="button button-primary" type="submit">Guardar medidas</button></form><div class="measurement-history"><h4>Historial de medidas</h4>${measurementsList || '<p class="muted small-copy">Todavía no hay medidas registradas.</p>'}</div></section>
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">CARGAS</span><h3>Pesos utilizados</h3></div></div><div class="load-list">${loads.map(x => `<div><span>${esc(x.name)}</span><b>${x.weight.toLocaleString('es-MX')} kg</b><small>${fmtDate(x.date)}</small></div>`).join('') || '<p class="muted small-copy">Registra pesos en tus sesiones para consultar aquí la evolución de las cargas.</p>'}</div></section>
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">HISTORIAL</span><h3>Entrenamientos completados</h3></div><span class="chip">${completed.length}</span></div><div class="history-list">${history}</div></section>`;
  }
  function renderPhotos() {
    for (const url of state.photoUrls) URL.revokeObjectURL(url);
    state.photoUrls = [];
    const photos = [...state.photos].sort((a,b) => (b.date || '').localeCompare(a.date || ''));
    const urlFor = photo => { const url = URL.createObjectURL(photo.blob); state.photoUrls.push(url); return url; };
    const cards = photos.map(photo => `<article class="photo-card"><img src="${urlFor(photo)}" alt="Fotografía ${esc(photo.category)} del ${fmtDate(photo.date)}"><div class="photo-card-info"><span class="chip">${esc(photo.category)}</span><strong>${fmtDate(photo.date)}</strong><p>${esc(photo.comment || 'Sin comentario')}</p><button class="text-button" data-action="delete-photo" data-id="${esc(photo.id)}">Eliminar fotografía</button></div></article>`).join('');
    const optionList = photos.map(p => `<option value="${esc(p.id)}">${fmtDate(p.date)} · ${esc(p.category)}</option>`).join('');
    const selectedA = photos.find(p => p.id === state.photoCompare[0]);
    const selectedB = photos.find(p => p.id === state.photoCompare[1]);
    const comparison = selectedA && selectedB ? `<div class="photo-comparison"><figure><img src="${urlFor(selectedA)}" alt="Comparación ${esc(selectedA.category)}"><figcaption><strong>${esc(selectedA.category)}</strong><span>${fmtDate(selectedA.date)}</span></figcaption></figure><figure><img src="${urlFor(selectedB)}" alt="Comparación ${esc(selectedB.category)}"><figcaption><strong>${esc(selectedB.category)}</strong><span>${fmtDate(selectedB.date)}</span></figcaption></figure></div>` : '<p class="muted small-copy">Selecciona dos registros para compararlos lado a lado.</p>';
    return `<div class="page-heading"><div><span class="eyebrow">EVOLUCIÓN VISUAL</span><h1>Mis fotografías</h1><p>Registra tus avances y compáralos entre fechas. Las imágenes se guardan en este dispositivo.</p></div><span class="photo-count">${photos.length}<small> fotos</small></span></div>
      <section class="panel photo-upload-panel"><div class="panel-heading"><div><span class="eyebrow">NUEVO REGISTRO</span><h3>Añadir fotografía</h3></div><span class="chip">Solo almacenamiento local</span></div><form id="photo-form" class="photo-form"><label class="photo-drop"><input type="file" name="photo" accept="image/*" capture="environment" required><span class="upload-symbol">＋</span><strong>Selecciona una foto</strong><small>Desde tu móvil o computadora · JPG, PNG o WebP</small></label><div class="photo-form-fields"><label>Fecha<input type="date" name="date" value="${today()}" required></label><label>Vista<select name="category"><option value="Frente">Frente</option><option value="Perfil">Perfil</option><option value="Espalda">Espalda</option><option value="Otra">Otra</option></select></label><label class="full-field">Comentario<textarea name="comment" rows="2" maxlength="240" placeholder="Notas sobre esta foto (opcional)"></textarea></label><button class="button button-primary" type="submit">Guardar fotografía</button></div></form></section>
      ${photos.length > 1 ? `<section class="panel"><div class="panel-heading"><div><span class="eyebrow">COMPARADOR</span><h3>Compara dos fechas</h3></div></div><div class="compare-selectors"><label>Primera fotografía<select data-compare-index="0"><option value="">Seleccionar</option>${optionList}</select></label><label>Segunda fotografía<select data-compare-index="1"><option value="">Seleccionar</option>${optionList}</select></label></div>${comparison}</section>` : ''}
      <section class="panel"><div class="panel-heading"><div><span class="eyebrow">GALERÍA PERSONAL</span><h3>Registros guardados</h3></div><span class="chip">${photos.length} imágenes</span></div><div class="photo-gallery">${cards || '<div class="photo-empty empty-state"><div class="empty-symbol">▧</div><h3>Aún no hay fotografías</h3><p>Sube la primera foto para empezar tu seguimiento visual.</p></div>'}</div></section>`;
  }
  function renderSettings() {
    return `<div class="page-heading"><div><span class="eyebrow">DATOS EN TU DISPOSITIVO</span><h1>Ajustes y respaldos</h1><p>Exporta o recupera perfiles, rutinas, sesiones, medidas y fotografías.</p></div><span class="local-badge">Sin nube · Sin cuentas</span></div>
      <section class="panel backup-panel"><div class="backup-icon">⇅</div><div class="backup-copy"><h3>Respaldo completo</h3><p>Descarga un archivo JSON con todos los perfiles y su información, incluidas las fotografías. Guárdalo en un lugar privado para poder transferirlo a otro dispositivo.</p><button class="button button-primary" data-action="export-backup">Descargar respaldo completo</button><small>La restauración reemplaza todos los datos locales actuales de este navegador.</small></div></section>
      <section class="panel backup-panel"><div class="backup-icon">↥</div><div class="backup-copy"><h3>Restaurar un respaldo</h3><p>Selecciona un archivo JSON creado por PANCHO GYM 2.0. Se validará antes de reemplazar el contenido actual.</p><label class="button button-outline file-button">Seleccionar archivo JSON<input id="backup-file" type="file" accept="application/json,.json"></label><small>Antes de importar, descarga una copia del estado actual para poder recuperarlo.</small></div></section>
      <section class="panel settings-info"><h3>Almacenamiento local</h3><div class="settings-row"><span>Base de datos</span><strong>IndexedDB · pancho-gym-2</strong></div><div class="settings-row"><span>Fotos</span><strong>Guardadas como imágenes Blob</strong></div><div class="settings-row"><span>Conexión</span><strong>Sincronización en la nube desactivada</strong></div><div class="settings-row"><span>Perfiles</span><strong>${state.profiles.length} perfiles independientes</strong></div></section>
      <section class="panel about-panel"><div><h3>PANCHO GYM 2.0</h3><p>Aplicación web progresiva de entrenamiento personal. Puedes instalarla desde Chrome cuando se sirva desde localhost o un origen HTTPS. El proyecto no incluye APK.</p></div><button class="button button-outline" data-action="install-app">Instalar aplicación</button></section>`;
  }
  function renderExerciseDetail(exerciseId) {
    const info = EXERCISES[exerciseId] || EXERCISES.squat;
    return `<div class="detail-backdrop" data-action="close-exercise-detail"><article class="exercise-detail-card" data-detail-card><button class="detail-close" type="button" data-action="close-exercise-detail">×</button><img src="assets/exercises/${info.image}" alt="Ilustración de ${esc(info.name)}"><span class="eyebrow">${esc(info.category)} · ${esc(info.muscle)}</span><h2>${esc(info.name)}</h2><p>${esc(info.instructions)}</p><div class="detail-section"><strong>POSICIÓN INICIAL</strong><p>${esc(info.start)}</p></div><div class="detail-section"><strong>EJECUCIÓN CORRECTA</strong><p>${esc(info.execution)}</p></div><div class="detail-section warning-detail"><strong>ERRORES FRECUENTES</strong><p>${esc(info.mistakes)}</p></div></article></div>`;
  }
  async function render() {
    await refreshData();
    let content = '';
    if (!state.profile) content = '<section class="empty-state"><h2>No hay perfiles</h2><button class="button button-primary" data-action="new-profile">Crear perfil</button></section>';
    else if (state.view === 'inicio') content = `${renderCreateProfilePanel()}${renderHome()}`;
    else if (state.view === 'perfil') content = renderProfile();
    else if (state.view === 'rutinas') content = renderRoutines();
    else if (state.view === 'entrenar') content = renderTraining();
    else if (state.view === 'progreso') content = renderProgress();
    else if (state.view === 'fotos') content = renderPhotos();
    else if (state.view === 'ajustes') content = renderSettings();
    else content = renderHome();
    root.innerHTML = content + (state.detailExercise ? renderExerciseDetail(state.detailExercise) : '');
    updateChrome();
  }
  function navigate(view) {
    state.view = view;
    if (view !== 'rutinas') state.editRoutine = null;
    render();
  }

  function captureRoutineEditor() {
    const form = $('#routine-editor-form');
    if (!form || !state.editRoutine) return;
    const fd = new FormData(form);
    state.editRoutine.name = String(fd.get('name') || '').trim();
    state.editRoutine.goal = String(fd.get('goal') || '');
    state.editRoutine.location = String(fd.get('location') || 'Gimnasio');
    const day = state.editRoutine.days[state.editDayIndex];
    if (day) {
      day.name = String(fd.get('dayName') || day.name).trim();
      day.exercises = $$('.routine-exercise-row', form).map(row => {
        const val = field => row.querySelector(`[data-field="${field}"]`)?.value;
        return { exerciseId: val('exerciseId') || 'squat', ...(row.dataset.cardioRole ? { cardioRole: row.dataset.cardioRole } : {}), sets: Math.max(1, Math.min(50, Number(val('sets')) || 3)), reps: Math.max(1, Number(val('reps')) || 10), rest: Math.max(0, Number(val('rest')) || 0), weight: Math.max(0, Number(val('weight')) || 0) };
      });
    }
  }
  async function saveMeasurement(form) {
    const fd = new FormData(form), measurement = { id: uid('measure'), profileId: state.profileId, date: fd.get('date') || today() };
    ['weight','waist','chest','hip','arm','thigh'].forEach(key => { const value = fd.get(key); if (value !== '' && value != null) measurement[key] = Number(value); });
    if (!Object.keys(measurement).some(k => ['weight','waist','chest','hip','arm','thigh'].includes(k))) return notify('Añade al menos una medida.', 'error');
    await GymDB.put('measurements', measurement);
    if (measurement.weight > 0) {
      const p = { ...state.profile, weight: measurement.weight, updatedAt: new Date().toISOString() };
      await GymDB.put('profiles', p);
    }
    notify('Medidas guardadas.'); await render();
  }
  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob);
    });
  }
  function dataUrlToBlob(dataUrl) {
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) throw new Error('Una fotografía del respaldo tiene un formato no válido.');
    const [meta, data] = dataUrl.split(',');
    const mime = meta.match(/data:([^;]+)/)?.[1] || 'application/octet-stream';
    const binary = atob(data); const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  async function exportBackup() {
    notify('Preparando respaldo…');
    const data = await GymDB.allData();
    const photos = await Promise.all(data.photos.map(async p => ({ ...p, dataUrl: await blobToDataUrl(p.blob), blob: undefined })));
    const backup = { app: 'PANCHO GYM 2.0', backupVersion: 1, exportedAt: new Date().toISOString(), activeProfileId: state.profileId, profiles: data.profiles, routines: data.routines, sessions: data.sessions, measurements: data.measurements, photos };
    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `PANCHO_GYM_2.0_respaldo_${today()}.json`; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000); notify('Respaldo descargado. Guárdalo en un lugar seguro.');
  }
  async function importBackup(file) {
    if (!file) return;
    if (file.size > 500 * 1024 * 1024) throw new Error('El archivo supera el límite de 500 MB.');
    const parsed = JSON.parse(await file.text());
    if (parsed.app !== 'PANCHO GYM 2.0' || parsed.backupVersion !== 1) throw new Error('El archivo no es un respaldo compatible de PANCHO GYM 2.0.');
    for (const name of ['profiles','routines','sessions','measurements','photos']) if (!Array.isArray(parsed[name])) throw new Error(`El respaldo está incompleto: falta el apartado ${name}.`);
    if (!parsed.profiles.length) throw new Error('El respaldo no contiene perfiles.');
    const ids = new Set(parsed.profiles.map(p => p.id));
    if (ids.size !== parsed.profiles.length || parsed.profiles.some(p => !p.id || !p.name)) throw new Error('El respaldo contiene perfiles duplicados o incompletos.');
    for (const key of ['routines','sessions','measurements','photos']) {
      if (parsed[key].some(row => !row.id || !ids.has(row.profileId))) throw new Error(`Hay registros de ${key} sin un perfil válido.`);
    }
    const photos = parsed.photos.map(p => {
      if (typeof p.dataUrl !== 'string') throw new Error('El respaldo contiene una foto sin datos.');
      const { dataUrl, ...rest } = p; return { ...rest, blob: dataUrlToBlob(dataUrl) };
    });
    const data = { profiles: parsed.profiles, routines: parsed.routines, sessions: parsed.sessions, measurements: parsed.measurements, photos };
    if (!confirm(`Vas a reemplazar TODOS los datos guardados en este dispositivo (${state.profiles.length} perfiles actuales) por el respaldo del ${fmtDate(parsed.exportedAt)}. Esta acción no se puede deshacer.\n\n¿Has descargado una copia de seguridad de los datos actuales?`)) return;
    await GymDB.replaceAll(data);
    state.profileId = ids.has(parsed.activeProfileId) ? parsed.activeProfileId : (parsed.profiles.find(p => p.id === 'profile-me')?.id || parsed.profiles[0].id); localStorage.setItem('pg-active-profile', state.profileId);
    state.activeSession = null; state.editRoutine = null; state.view = 'inicio';
    await render(); notify('Respaldo restaurado correctamente. Se han recuperado también las fotografías.');
  }
  async function addPhoto(form) {
    const fd = new FormData(form), file = fd.get('photo');
    if (!(file instanceof File) || !file.size) return notify('Selecciona una fotografía.', 'error');
    if (!file.type.startsWith('image/')) return notify('El archivo seleccionado no es una imagen.', 'error');
    if (file.size > 25 * 1024 * 1024) return notify('La imagen supera el límite de 25 MB.', 'error');
    const photo = { id: uid('photo'), profileId: state.profileId, date: fd.get('date') || today(), category: fd.get('category') || 'Otra', comment: String(fd.get('comment') || '').trim(), name: file.name, type: file.type, blob: file, createdAt: new Date().toISOString() };
    await GymDB.put('photos', photo); state.photoCompare = []; notify('Fotografía guardada en la galería del perfil.'); await render();
  }
  async function handleAction(action, element) {
    const id = element.dataset.id;
    switch (action) {
      case 'new-profile': state.showProfileCreate = true; state.view = 'perfil'; await render(); break;
      case 'close-profile-create': state.showProfileCreate = false; await render(); break;
      case 'edit-profile': state.view = 'perfil'; await render(); break;
      case 'create-muscle-split': { const routine = buildMuscleSplitRoutine(); await GymDB.put('routines', routine); state.selectedRoutineId = routine.id; notify('Rutina dividida creada con cardio obligatorio al inicio y al final de cada día.'); await render(); break; }
      case 'generate-routine': { const recommended = buildRecommendedRoutine(state.profile); await GymDB.put('routines', recommended); state.selectedRoutineId = recommended.id; notify(`Rutina recomendada creada para ${state.profile.name}. Ajusta las cargas a tu nivel.`); await render(); break; }
      case 'new-routine': state.editRoutine = { id: null, profileId: state.profileId, name: 'Mi nueva rutina', goal: state.profile.goal, location: 'Gimnasio', createdAt: new Date().toISOString(), days: [{ id: uid('day'), name: 'Día 1 · Cuerpo completo', exercises: [{ exerciseId: 'squat', sets: 3, reps: 10, rest: 60, weight: 0 }] }] }; state.editDayIndex = 0; await render(); break;
      case 'edit-routine': state.editRoutine = structuredClone(state.routines.find(r => r.id === id)); state.editDayIndex = 0; await render(); break;
      case 'close-routine-editor': captureRoutineEditor(); state.editRoutine = null; await render(); break;
      case 'add-exercise': captureRoutineEditor(); state.editRoutine.days[state.editDayIndex].exercises.push({ exerciseId: 'push-up', sets: 3, reps: 10, rest: 60, weight: 0 }); await render(); break;
      case 'remove-exercise': captureRoutineEditor(); state.editRoutine.days[state.editDayIndex].exercises.splice(Number(element.dataset.index), 1); await render(); break;
      case 'add-routine-day': captureRoutineEditor(); state.editRoutine.days.push({ id: uid('day'), name: `Día ${state.editRoutine.days.length + 1}`, exercises: [] }); state.editDayIndex = state.editRoutine.days.length - 1; await render(); break;
      case 'select-edit-day': captureRoutineEditor(); state.editDayIndex = Number(element.dataset.index); await render(); break;
      case 'delete-routine': if (confirm('¿Eliminar esta rutina? El historial de entrenamientos realizados se conservará.')) { await GymDB.remove('routines', id); state.editRoutine = null; notify('Rutina eliminada.'); await render(); } break;
      case 'start-routine': state.view = 'entrenar'; state.selectedRoutineId = id; await render(); break;
      case 'edit-selected-routine': { const routine = state.routines.find(r => r.id === state.selectedRoutineId) || state.routines[0]; if (!routine) return notify('No se encontró la rutina seleccionada.', 'error'); state.editRoutine = structuredClone(routine); state.editDayIndex = 0; state.view = 'rutinas'; await render(); break; }
      case 'start-selected-workout': {
        const rid = $('#training-routine')?.value || state.routines[0]?.id;
        const routine = state.routines.find(r => r.id === rid); if (!routine) return notify('No se encontró la rutina seleccionada.', 'error');
        const session = newSession(routine); await GymDB.put('sessions', session); state.activeSession = session; state.selectedRoutineId = routine.id; state.paused = false; state.timerRemaining = 0; state.view = 'entrenar'; await render(); notify('¡Entrenamiento iniciado!'); break;
      }
      case 'exercise-detail': state.detailExercise = id; await render(); break;
      case 'close-exercise-detail': if (element.matches('[data-detail-card]')) break; state.detailExercise = null; await render(); break;
      case 'rest-start': startRest(Number(element.dataset.seconds)); break;
      case 'rest-stop': startRest(0); break;
      case 'cardio-timer-toggle': startCardioTimer(Number(element.dataset.index)); break;
      case 'cardio-timer-reset': { const idx = Number(element.dataset.index), ex = state.activeSession?.exercises?.[idx]; stopCardioTimer(); state.cardioTimer = { exIndex: idx, remaining: ex?.cardioRole === 'cardio-start' ? 1200 : 600, running: false }; await render(); break; }
      case 'add-session-set': { const ex = state.activeSession?.exercises?.[Number(element.dataset.index)]; if (ex && !ex.cardioRole && !state.paused && ex.sets.length < 50) { const last = ex.sets[ex.sets.length - 1] || { reps: 10, weight: 0 }; ex.sets.push({ reps: last.reps, weight: last.weight, done: false }); await GymDB.put('sessions', state.activeSession); await render(); } break; }
      case 'remove-session-set': { const ex = state.activeSession?.exercises?.[Number(element.dataset.index)]; if (ex && !ex.cardioRole && !state.paused && ex.sets.length > 1) { ex.sets.pop(); await GymDB.put('sessions', state.activeSession); await render(); } break; }
      case 'pause-workout': state.paused = true; clearInterval(state.timerInterval); stopCardioTimer(); await render(); break;
      case 'resume-workout': state.paused = false; await render(); break;
      case 'cancel-workout': if (confirm('¿Cancelar esta sesión? No aparecerá como entrenamiento completado en tu historial.')) { clearInterval(state.timerInterval); stopCardioTimer(); const s = { ...state.activeSession, status: 'cancelled', endedAt: new Date().toISOString() }; await GymDB.put('sessions', s); state.activeSession = null; state.paused = false; state.timerRemaining = 0; notify('Sesión cancelada.'); await render(); } break;
      case 'finish-workout': if (confirm('¿Has terminado tu entrenamiento? Se guardará en el historial.')) { clearInterval(state.timerInterval); stopCardioTimer(); const started = new Date(state.activeSession.startedAt).getTime(); const s = { ...state.activeSession, status: 'completed', endedAt: new Date().toISOString(), durationSeconds: Math.max(0, Math.round((Date.now() - started) / 1000)) }; await GymDB.put('sessions', s); state.activeSession = null; state.paused = false; state.timerRemaining = 0; notify('¡Sesión completada! Tu progreso se ha guardado.'); await render(); } break;
      case 'jump-measurement': $('#measurement-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'delete-measurement': if (confirm('¿Eliminar este registro de medidas?')) { await GymDB.remove('measurements', id); notify('Registro eliminado.'); await render(); } break;
      case 'delete-photo': if (confirm('¿Eliminar esta fotografía de forma permanente?')) { await GymDB.remove('photos', id); state.photoCompare = state.photoCompare.filter(x => x !== id); notify('Fotografía eliminada.'); await render(); } break;
      case 'export-backup': await exportBackup(); break;
      case 'install-app': if (state.installPrompt) { state.installPrompt.prompt(); await state.installPrompt.userChoice; state.installPrompt = null; await render(); } else notify('Abre el menú de Chrome y selecciona «Instalar aplicación» o «Añadir a pantalla de inicio».', 'info'); break;
    }
  }

  document.addEventListener('click', async event => {
    if (event.target.closest('#add-profile-btn')) { state.showProfileCreate = true; state.view = 'perfil'; await render(); return; }
    const viewButton = event.target.closest('[data-view]');
    if (viewButton) { navigate(viewButton.dataset.view); return; }
    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      if (actionButton.dataset.action === 'close-exercise-detail' && event.target.closest('[data-detail-card]') && !event.target.closest('.detail-close')) return;
      try { await handleAction(actionButton.dataset.action, actionButton); } catch (error) { console.error(error); notify(error.message || 'Ocurrió un error.', 'error'); }
    }
  });

  document.addEventListener('change', async event => {
    const target = event.target;
    try {
      if (target.id === 'profile-switch') {
        if (state.activeSession && state.activeSession.status === 'active' && state.activeSession.profileId === state.profileId) {
          // The active workout remains safely stored under its original profile.
          state.activeSession = null;
        }
        state.profileId = target.value; state.view = 'inicio'; state.editRoutine = null; await render();
      }
      if (target.id === 'training-routine') {
        const routine = state.routines.find(r => r.id === target.value);
        const daySelect = $('#training-day');
        if (daySelect) daySelect.innerHTML = (routine?.days || []).map((d, i) => `<option value="${i}">${esc(d.name)}</option>`).join('');
        const preview = $('#training-preview'); if (preview) preview.innerHTML = renderTrainingPreview(routine?.days?.[0]);
      }
      if (target.id === 'training-day') {
        const r = state.routines.find(r => r.id === $('#training-routine')?.value);
        const preview = $('#training-preview'); if (preview) preview.innerHTML = renderTrainingPreview(r?.days?.[Number(target.value)]);
      }
      if (target.matches('[data-field]')) {
        const row = target.closest('.routine-exercise-row');
        const im = row?.querySelector('img');
        if (target.dataset.field === 'exerciseId' && im) { const ex = EXERCISES[target.value]; im.src = `assets/exercises/${ex.image}`; im.alt = `Ilustración de ${ex.name}`; }
      }
      if (target.matches('[data-session-field]')) {
        const exIndex = Number(target.dataset.exIndex), setIndex = Number(target.dataset.setIndex), field = target.dataset.sessionField;
        const set = state.activeSession?.exercises?.[exIndex]?.sets?.[setIndex];
        if (set && !state.paused) {
          set[field] = field === 'done' ? target.checked : Math.max(field === 'weight' ? 0 : 1, Number(target.value) || 0);
          await GymDB.put('sessions', state.activeSession);
          const { pct, done, total } = workoutProgress(state.activeSession);
          const summary = $('.workout-summary');
          if (summary) { summary.querySelector('.progress-ring').style.setProperty('--progress', `${pct * 3.6}deg`); summary.querySelector('.progress-ring span').textContent = `${pct}%`; summary.querySelector('strong')?.replaceChildren(document.createTextNode(`${pct}%`)); summary.querySelector('p')?.replaceChildren(document.createTextNode(`${done} de ${total} series completadas`)); summary.querySelector('.progress-track span').style.width = `${pct}%`; }
          if (field === 'done') await render();
        }
      }
      if (target.matches('[data-replace-exercise]')) {
        const idx = Number(target.dataset.replaceExercise), exId = target.value, detail = EXERCISES[exId];
        if (state.activeSession?.exercises[idx] && detail) { state.activeSession.exercises[idx].exerciseId = exId; state.activeSession.exercises[idx].name = detail.name; await GymDB.put('sessions', state.activeSession); await render(); }
      }
      if (target.matches('[data-compare-index]')) {
        const idx = Number(target.dataset.compareIndex); state.photoCompare[idx] = target.value || null; await render();
      }
      if (target.id === 'backup-file' && target.files?.[0]) {
        await importBackup(target.files[0]); target.value = '';
      }
    } catch (error) { console.error(error); notify(error.message || 'No se pudo completar la acción.', 'error'); }
  });

  document.addEventListener('submit', async event => {
    event.preventDefault(); const form = event.target;
    try {
      if (form.id === 'create-profile-form') {
        const name = new FormData(form).get('name')?.trim(); if (!name) return;
        const profile = { id: uid('profile'), name, age: '', weight: '', height: '', goal: 'Perder grasa y conservar músculo', experience: 'Principiante', gender: '', availability: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        await GymDB.put('profiles', profile); state.profileId = profile.id; state.showProfileCreate = false; state.view = 'perfil'; notify('Perfil creado. Sus datos están separados de los demás.'); await render();
      }
      if (form.id === 'profile-form') {
        const fd = new FormData(form), previousWeight = Number(state.profile.weight) || 0;
        const updated = { ...state.profile, name: fd.get('name').trim(), age: fd.get('age') ? Number(fd.get('age')) : '', weight: fd.get('weight') ? Number(fd.get('weight')) : '', height: fd.get('height') ? Number(fd.get('height')) : '', goal: fd.get('goal'), experience: fd.get('experience'), gender: fd.get('gender') || '', availability: fd.getAll('availability'), updatedAt: new Date().toISOString() };
        await GymDB.put('profiles', updated);
        if (updated.weight && updated.weight !== previousWeight) await GymDB.put('measurements', { id: uid('measure'), profileId: state.profileId, date: today(), weight: updated.weight, source: 'profile' });
        notify('Perfil actualizado correctamente.'); await render();
      }
      if (form.id === 'routine-editor-form') {
        captureRoutineEditor(); const r = state.editRoutine;
        if (!r.name.trim()) return notify('Escribe un nombre para la rutina.', 'error');
        if (!r.days.length || r.days.some(d => !d.exercises.length)) return notify('Cada día debe tener al menos un ejercicio.', 'error');
        r.updatedAt = new Date().toISOString(); if (!r.id) r.id = uid('routine');
        await GymDB.put('routines', r); state.editRoutine = null; notify('Rutina guardada en este perfil.'); await render();
      }
      if (form.id === 'measurement-form') await saveMeasurement(form);
      if (form.id === 'photo-form') await addPhoto(form);
    } catch (error) { console.error(error); notify(error.message || 'No se pudieron guardar los cambios.', 'error'); }
  });

  document.addEventListener('click', async event => {
    const deleteProfile = event.target.closest('[data-action="delete-profile"]');
    if (deleteProfile) {
      if (state.profiles.length <= 1) return;
      if (!confirm(`¿Eliminar el perfil «${state.profile.name}» y todos sus datos, rutinas, fotos e historial? Esta acción no se puede deshacer.`)) return;
      const bundle = await GymDB.profileBundle(state.profileId);
      for (const store of ['routines','sessions','measurements','photos']) for (const record of bundle[store]) await GymDB.remove(store, record.id);
      await GymDB.remove('profiles', state.profileId); state.activeSession = null; state.profileId = state.profiles.find(p => p.id !== state.profileId)?.id || ''; state.view = 'inicio'; notify('Perfil y sus datos eliminados.'); await render();
    }
  });

  window.addEventListener('online', updateChrome);
  window.addEventListener('offline', updateChrome);
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); state.installPrompt = event; if (state.view === 'ajustes') render(); });
  window.addEventListener('appinstalled', () => { state.installPrompt = null; notify('PANCHO GYM 2.0 se ha instalado.'); });

  async function registerPWA() {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
    try {
      const registration = await navigator.serviceWorker.register('./service-worker.js');
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) notify('Hay una actualización lista. Recarga para usar la versión nueva.', 'info');
        });
      });
    } catch (error) { console.warn('Service Worker no disponible:', error); }
  }
  async function init() {
    try {
      await GymDB.open();
      await GymDB.seed();
      if (!(await GymDB.get('profiles', state.profileId))) state.profileId = (await GymDB.getAll('profiles'))[0]?.id;
      try { await navigator.storage?.persist?.(); } catch (_) { /* Optional browser quota hint. */ }
      await registerPWA(); await render();
      if (navigator.storage?.estimate) {
        const estimate = await navigator.storage.estimate();
        console.info('Almacenamiento del navegador:', estimate);
      }
    } catch (error) {
      console.error(error);
      root.innerHTML = `<section class="error-panel"><h1>No se pudo iniciar PANCHO GYM 2.0</h1><p>${esc(error.message)}</p><p>Abre la aplicación desde un navegador moderno (Chrome, Edge o Samsung Internet) y no en modo incógnito.</p></section>`;
    }
  }
  init();
})();
