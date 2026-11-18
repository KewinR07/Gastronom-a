/* Perú Gastronomía - app.js */
const $ = id => document.getElementById(id);
let idioma = "es";

/* ============ BOTÓN VOLVER ARRIBA ============ */
window.addEventListener("scroll", () => {
    $("btnArriba").classList.toggle("mostrar", window.scrollY > 300);
});

/* ============ MENÚ DESPLEGABLE (móvil) ============ */
const btnMenu = $("btnMenu");
const menu = $("menuPrincipal");

function cerrarMenu() {
    menu.classList.remove("abierto");
    btnMenu.setAttribute("aria-expanded", "false");
}

btnMenu.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    btnMenu.setAttribute("aria-expanded", String(abierto));
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", cerrarMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarMenu(); });

/* ============ CARRUSEL ============ */
// Cada foto tiene su propio alt. Ajusta los dos últimos a lo que muestran tus imágenes.
const galeria = [
    { src: "img/ceviche.jpg",         alt: "Plato de ceviche con pescado fresco, limón y cebolla" },
    { src: "img/im-Lomo saltado.jpg", alt: "Lomo saltado con carne, cebolla, tomate y papas fritas" },
    { src: "img/Aji-gallina.jpg",     alt: "Ají de gallina cremoso con pollo desmenuzado y arroz" },
    { src: "img/Im-Cos.jpg",          alt: "Costa peruana frente al océano Pacífico" },
    { src: "img/im-Sierra.jpg",       alt: "Paisaje de la sierra andina del Perú" },
    { src: "img/selva.jpg",           alt: "Selva amazónica del Perú" },
    { src: "img/Quinua.avif",         alt: "Granos de quinua" },
    { src: "img/imagen 1.jpg",        alt: "Plato típico de la gastronomía peruana" },
    { src: "img/images 2.jpg",        alt: "Plato típico de la gastronomía peruana" }
];

let indice = 0;
let timer = null;
const imagen = $("imagenCarrusel");
const btnPausa = $("pausaCarrusel");
const estadoCar = $("estadoCarrusel");

function mostrarFoto(i) {
    indice = (i + galeria.length) % galeria.length;
    imagen.src = galeria[indice].src;
    imagen.alt = galeria[indice].alt;
    estadoCar.textContent = `${indice + 1} / ${galeria.length}`;
}

function iniciarCarrusel() {
    if (timer) return;
    timer = setInterval(() => mostrarFoto(indice + 1), 4000);
    btnPausa.textContent = textos[idioma].pausar;
    btnPausa.setAttribute("aria-label", textos[idioma].pausarAria);
}

function pausarCarrusel() {
    clearInterval(timer);
    timer = null;
    btnPausa.textContent = textos[idioma].reanudar;
    btnPausa.setAttribute("aria-label", textos[idioma].reanudarAria);
}

$("siguiente").addEventListener("click", () => mostrarFoto(indice + 1));
$("anterior").addEventListener("click", () => mostrarFoto(indice - 1));
btnPausa.addEventListener("click", () => (timer ? pausarCarrusel() : iniciarCarrusel()));

/* ============ QUIZ ============ */
const preguntas = [
    { pregunta: "¿Cuál es considerado el plato bandera del Perú?", opciones: ["Pizza", "Ceviche", "Hamburguesa", "Sushi"], correcta: 1 },
    { pregunta: "¿Qué ingrediente es fundamental en el ceviche?", opciones: ["Chocolate", "Limón", "Leche", "Manzana"], correcta: 1 },
    { pregunta: "¿En qué región destaca la gastronomía amazónica?", opciones: ["Costa", "Sierra", "Selva", "Lima"], correcta: 2 },
    { pregunta: "¿Cuál es un superalimento andino?", opciones: ["Quinua", "Arroz", "Trigo", "Avena"], correcta: 0 },
    { pregunta: "¿Qué ave representa uno de los símbolos del Perú?", opciones: ["Águila", "Cóndor Andino", "Paloma", "Flamenco"], correcta: 1 }
];

let preguntaActual = 0;
let puntaje = 0;

const pregunta = $("pregunta");
const opciones = $("opciones");
const resultado = $("resultadoQuiz");
const siguiente = $("siguientePregunta");
const puntajeFinal = $("puntajeFinal");
const reiniciarQuiz = $("reiniciarQuiz");

function cargarPregunta() {
    resultado.textContent = "";
    resultado.className = "";
    siguiente.style.display = "none";
    pregunta.textContent = preguntas[preguntaActual].pregunta;
    opciones.innerHTML = "";

    preguntas[preguntaActual].opciones.forEach((texto, i) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        boton.classList.add("opcion");
        boton.addEventListener("click", () => verificarRespuesta(i));
        opciones.appendChild(boton);
    });
}

function verificarRespuesta(elegida) {
    const correcta = preguntas[preguntaActual].correcta;

    document.querySelectorAll(".opcion").forEach((btn, i) => {
        btn.disabled = true;
        if (i === correcta) btn.classList.add("correcta");
        else if (i === elegida) btn.classList.add("incorrecta");
    });

    if (elegida === correcta) {
        puntaje++;
        resultado.textContent = "✔ ¡Respuesta correcta!";
        resultado.className = "ok";
    } else {
        resultado.textContent = "✘ Respuesta incorrecta. La correcta era: " + preguntas[preguntaActual].opciones[correcta];
        resultado.className = "mal";
    }
    siguiente.style.display = "inline-block";
    siguiente.focus();
}

siguiente.addEventListener("click", () => {
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        cargarPregunta();
        return;
    }
    pregunta.textContent = "🎉 Quiz finalizado";
    opciones.innerHTML = "";
    resultado.textContent = "";
    resultado.className = "";
    siguiente.style.display = "none";
    reiniciarQuiz.style.display = "inline-block";

    let msg = `Obtuviste ${puntaje} de ${preguntas.length} respuestas correctas. `;
    if (puntaje === preguntas.length) msg += "🏆 Excelente conocimiento de la gastronomía peruana.";
    else if (puntaje >= 3) msg += "👍 Buen resultado.";
    else msg += "Sigue explorando la gastronomía peruana.";
    puntajeFinal.textContent = msg;
    reiniciarQuiz.focus();
});

reiniciarQuiz.addEventListener("click", () => {
    preguntaActual = 0;
    puntaje = 0;
    puntajeFinal.textContent = "";
    reiniciarQuiz.style.display = "none";
    cargarPregunta();
});

/* ============ FORMULARIO ============ */
$("formContacto").addEventListener("submit", e => {
    e.preventDefault();
    $("estadoForm").textContent = textos[idioma].formOk;
    e.target.reset();
});

/* ============ IDIOMA (ES / EN) ============ */
// Cada clave es el id del elemento HTML cuyo texto se reemplaza.
const textos = {
    es: {
        tituloPrincipal: "Perú Gastronomía", btnMenu: "☰ Menú", menuInicio: "Inicio", menuGastro: "Gastronomía Peruana",
        menuPlatos: "Platos Típicos", menuIngredientes: "Ingredientes Tradicionales",
        menuRegiones: "Regiones Gastronómicas", menuCultura: "Cultura e Historia", menuContacto: "Contacto",
        heroTitulo: "Descubre los sabores del Perú",
        heroTexto: "Explora la riqueza culinaria de la costa, sierra y selva peruana.",
        tituloGastronomia: "La Gastronomía Peruana",
        textoGastronomia: "La gastronomía peruana es reconocida mundialmente por su diversidad de sabores, ingredientes y tradiciones culinarias.",
        tituloPlatos: "🍽️ Platos Típicos",
        plato1Titulo: "Ceviche", plato1Texto: "Plato emblemático del Perú preparado con pescado fresco, limón, cebolla y ají.",
        plato2Titulo: "Lomo Saltado", plato2Texto: "Combinación de carne, cebolla, tomate y papas fritas, influenciada por la cocina china-peruana.",
        plato3Titulo: "Ají de Gallina", plato3Texto: "Cremoso plato elaborado con pollo desmenuzado, ají amarillo y pan.",
        tituloIngredientes: "🌽 Ingredientes Tradicionales",
        ing1Titulo: "Ají Amarillo", ing1Texto: "Uno de los ingredientes más representativos de la cocina peruana.",
        ing2Titulo: "Papa Peruana", ing2Texto: "Perú posee miles de variedades de papa que forman parte esencial de su gastronomía.",
        ing3Titulo: "Maíz", ing3Texto: "Presente en diversas preparaciones y bebidas típicas de las regiones peruanas.",
        ing4Titulo: "Quinua", ing4Texto: "Considerado un superalimento andino por su alto valor nutricional.",
        tituloRegiones: "🗺️ Regiones Gastronómicas",
        region1Titulo: "Costa", region1Texto: "La costa peruana destaca por sus platos marinos, especialmente el ceviche, la causa limeña y los tiraditos.",
        region2Titulo: "Sierra", region2Texto: "La gastronomía andina incluye platos tradicionales como la pachamanca, el cuy chactado y preparaciones con papa y quinua.",
        region3Titulo: "Selva", region3Texto: "La cocina amazónica se caracteriza por ingredientes naturales como el plátano, la yuca y el pescado de río.",
        tituloCultura: "📜 Cultura e Historia",
        textoMachuPicchu: "Machu Picchu representa el legado histórico y cultural del Perú. Las antiguas civilizaciones andinas desarrollaron técnicas agrícolas que permitieron cultivar ingredientes como la papa, el maíz y la quinua, fundamentales en la gastronomía peruana actual.",
        tituloSimbolos: "🏛️ Cultura y Símbolos del Perú",
        textoCondor: "El cóndor andino es uno de los símbolos más importantes del Perú y representa la conexión entre la naturaleza y las culturas andinas. Su imagen forma parte de las tradiciones que enriquecen la identidad cultural del país y complementan el valor de su patrimonio gastronómico.",
        tituloGaleria: "📷 Galería Gastronómica",
        tituloQuiz: "🏆 Desafío Gastronómico Peruano",
        tituloContacto: "📩 Contacto",
        lblNombre: "Nombre completo", lblCorreo: "Correo electrónico", lblMensaje: "Mensaje", btnEnviar: "Enviar",
        textoMusica: "🎵 Música Andina",
        formOk: "¡Gracias! Tu mensaje fue enviado.",
        pausar: "⏸ Pausar", reanudar: "▶ Reanudar",
        pausarAria: "Pausar carrusel automático", reanudarAria: "Reanudar carrusel automático"
    },
    en: {
        tituloPrincipal: "Peru Gastronomy", btnMenu: "☰ Menu", menuInicio: "Home", menuGastro: "Peruvian Gastronomy",
        menuPlatos: "Typical Dishes", menuIngredientes: "Traditional Ingredients",
        menuRegiones: "Gastronomic Regions", menuCultura: "Culture and History", menuContacto: "Contact",
        heroTitulo: "Discover the Flavors of Peru",
        heroTexto: "Explore the culinary richness of Peru's coast, highlands and rainforest.",
        tituloGastronomia: "Peruvian Gastronomy",
        textoGastronomia: "Peruvian gastronomy is recognized worldwide for its diversity of flavors, ingredients, and culinary traditions.",
        tituloPlatos: "🍽️ Typical Dishes",
        plato1Titulo: "Ceviche", plato1Texto: "Peru's signature dish prepared with fresh fish, lime juice, onion, and chili pepper.",
        plato2Titulo: "Lomo Saltado", plato2Texto: "A combination of beef, onions, tomatoes, and French fries influenced by Chinese-Peruvian cuisine.",
        plato3Titulo: "Ají de Gallina", plato3Texto: "A creamy dish made with shredded chicken, yellow chili pepper, and bread.",
        tituloIngredientes: "🌽 Traditional Ingredients",
        ing1Titulo: "Yellow Chili Pepper", ing1Texto: "One of the most representative ingredients of Peruvian cuisine.",
        ing2Titulo: "Peruvian Potato", ing2Texto: "Peru has thousands of potato varieties that are an essential part of its gastronomy.",
        ing3Titulo: "Corn", ing3Texto: "Present in many traditional dishes and beverages across Peru.",
        ing4Titulo: "Quinoa", ing4Texto: "Considered an Andean superfood due to its high nutritional value.",
        tituloRegiones: "🗺️ Gastronomic Regions",
        region1Titulo: "Coast", region1Texto: "The Peruvian coast is famous for its seafood dishes, especially ceviche, causa limeña, and tiraditos.",
        region2Titulo: "Highlands", region2Texto: "Andean cuisine includes traditional dishes such as pachamanca, cuy chactado, and preparations made with potatoes and quinoa.",
        region3Titulo: "Rainforest", region3Texto: "Amazonian cuisine is characterized by natural ingredients such as plantain, cassava, and freshwater fish.",
        tituloCultura: "📜 Culture and History",
        textoMachuPicchu: "Machu Picchu represents Peru's historical and cultural legacy. Ancient Andean civilizations developed agricultural techniques that allowed the cultivation of ingredients such as potatoes, corn, and quinoa, which remain essential in Peruvian cuisine today.",
        tituloSimbolos: "🏛️ Culture and Symbols of Peru",
        textoCondor: "The Andean condor is one of Peru's most important national symbols and represents the connection between nature and Andean cultures. Its image is part of traditions that enrich the country's cultural identity and complement the value of its gastronomic heritage.",
        tituloGaleria: "📷 Gastronomic Gallery",
        tituloQuiz: "🏆 Peruvian Gastronomy Challenge",
        tituloContacto: "📩 Contact",
        lblNombre: "Full name", lblCorreo: "Email", lblMensaje: "Message", btnEnviar: "Send",
        textoMusica: "🎵 Andean Music",
        formOk: "Thank you! Your message was sent.",
        pausar: "⏸ Pause", reanudar: "▶ Resume",
        pausarAria: "Pause automatic carousel", reanudarAria: "Resume automatic carousel"
    }
};

const claves = ["pausar", "reanudar", "pausarAria", "reanudarAria", "formOk"];

function cambiarIdioma(l) {
    idioma = l;
    document.documentElement.lang = l;

    for (const [id, texto] of Object.entries(textos[l])) {
        if (claves.includes(id)) continue;
        const el = $(id);
        if (el) el.textContent = texto;
    }

    btnPausa.textContent = timer ? textos[l].pausar : textos[l].reanudar;
    btnPausa.setAttribute("aria-label", timer ? textos[l].pausarAria : textos[l].reanudarAria);
    $("btnES").setAttribute("aria-pressed", String(l === "es"));
    $("btnEN").setAttribute("aria-pressed", String(l === "en"));
}

$("btnES").addEventListener("click", () => cambiarIdioma("es"));
$("btnEN").addEventListener("click", () => cambiarIdioma("en"));

/* ============ ARRANQUE ============ */
cargarPregunta();
mostrarFoto(0);
// Respeta a quien prefiere menos movimiento: el carrusel no arranca solo
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) pausarCarrusel();
else iniciarCarrusel();
