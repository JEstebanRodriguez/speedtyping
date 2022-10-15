const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
// almacena la lista de words y el índice de la palabra que el jugador está escribiendo actualmente
let words = [];
let errors = 0;

let wordIndex = 0;
// la hora de inicio
let startTime = Date.now();

// funcion de carga de los elementos getElementById (una especie de shorthand que me gusta usar)
const getById = element => document.getElementById(element);

// elementos de la pagina
const textElement = getById('quote');
const messageElement = getById('message');
const typedValueElement = getById('typed-value');
const typedMask = getById('typed-mask');
const btnStart = getById('start');
const btnRestart = getById('restart');
const modal = getById('modal');
const modalLegend = getById('modal-legend');
const menuBtn = getById('menu-btn');
const sidebar = getById('sidebar');
const sidebarContent = getById('sidebar-content');
const sidebarClose = getById('sidebar-close');
const lastTime = getById('last-time');
const lastQuote = getById('last-quote');
const emptyMessage = getById('empty-message');

// API Js HtmlAudioElement para insertar un audio cuando se pulse alguna tecla
const audioElement = new Audio('assets/type.wav');

// Variable que almacena un indice aleatorio de los textos a tipear
const textoIndice = Math.floor(Math.random() * quotes.length);

// Funcion para desplegar el texto a escribir en el dom
const displayQuote = () => {
    // elegimos el texto de ejemplo a mostrar
    const texto = quotes[textoIndice];
    // separamos el texto en un array de words
    words = texto.split(' ');
    // reestablemos el idice de words para el seguimiento
    wordIndex = 0;

    // Actualizamos la interfaz de usuario
    // Creamos una matriz con los elementos span de nuestro HTML para poder definirles una class
    const spanwords = words.map(function (palabra) { return `<span>${palabra} </span>` });
    // Convertimos a string y lo definimos como innerHTML en el texto de ejemplo a mostrar
    textElement.innerHTML = spanwords.join('');
    // Resaltamos la primer palabra
    textElement.childNodes[0].className = 'highlight';
    // Borramos los mensajes previos
    messageElement.innerText = '';
    // Definimos el elemento textbox
    // Vaciamos el elemento textbox
    typedValueElement.value = '';
    // Definimos el foco en el elemento
    typedValueElement.focus();
    // Establecemos el manejador de eventos
    // Iniciamos el contador de tiempo
    startTime = new Date().getTime();
}

// Listener del boton para inicir el juego
btnStart.addEventListener('click', () => {
    btnStart.style.display = 'none';
    typedMask.classList.add('disabled')
    typedValueElement.style.display = 'block';
    displayQuote();
});

// Listener del boton volver a escribir
btnRestart.addEventListener('click', () => {
    modal.style.display = 'none';
    location.reload();
});

// Listener para abrir el sidebar
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active')
    sidebarContent.classList.toggle('active')
});

// Listener para cerrar el sidebar
sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active')
    sidebarContent.classList.remove('active')
})

typedValueElement.addEventListener('input', () => {
    // reproduce el sonido de la tecla
    audioElement.play();
    // tomamos la palabra actual
    const currentWord = words[wordIndex];
    // tomamos el valor actual
    const typedValue = typedValueElement.value;
    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // fin de la sentencia
        // Definimos el mensaje de éxito
        const elapsedTime = new Date().getTime() - startTime;
        modal.style.display = 'grid';
        const exactTime = elapsedTime / 1000;
        const message = `Finalizaste en ${exactTime} segundos.`;
        // Se guarda en el localStorage los datos del tipeo recien terminado y el tiempo que duro.
        localStorage.setItem('last-typed', JSON.stringify({time: exactTime, quote: quotes[textoIndice]}))
        modalLegend.innerText = message;
        typedValueElement.value = '';
        btnStart.style.display = 'block';
        typedValueElement.style.display = 'none';
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // fin de la palabra
        // vaciamos el valor typedValueElement para la siguiente palabra
        typedValueElement.value = '';
        // movemos a la palabra siguiente
        wordIndex++;
        // reiniciamos el estado de todas las clases para los quotes
        for (const quoteElement of textElement.childNodes) {
            quoteElement.className = '';
        }
        // resaltamos la palabra actual
        textElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        // correcta actual
        // resaltar la siguiente palabra
        typedValueElement.className = '';
    } else {
        // estado error
        typedValueElement.className = 'error';
        errors++;
        // console.log(errors)
    }
});

// Evento de carga del dom.
document.addEventListener('DOMContentLoaded', () => {
    // Se comprueba de que exista un valor de nombre last-typed dentro del local storage y en el caso de que exista se muestra en el dom el ultimo tipeo y su tiempo.
    const localStorageLastTyped = localStorage.getItem('last-typed')
    if (localStorageLastTyped) {
        const {time, quote} = JSON.parse(localStorageLastTyped);
        lastTime.innerText = `Tiempo: ${time} segundos`;
        lastQuote.innerText = `Texto: ${quote}`;
    } else {
        emptyMessage.innerText = 'Todavia no hay registros'
    }
    typedValueElement.style.display = 'none';
})