import logoImg from "@/assets/clogo.jpg";
import prekinderImg from "@/assets/c39_1.jpg";
import kinderImg from "@/assets/c39.jpg";
import p1Img from "@/assets/primero-primaria.jpg";
import p2Img from "@/assets/c40.jpg";
import p3Img from "@/assets/c40_1.jpg";
import p4Img from "@/assets/c40_2.jpg";
import p5Img from "@/assets/c41.jpg";
import p6Img from "@/assets/c41_1.jpg";
import { Product, Order, ClientMessage } from "@/types";

export const SANTA_CRUZ_COORDS = {
  lat: -17.7833,
  lng: -63.1821,
};

export const EDITORIAL_LOCATION = {
  lat: -17.7885,
  lng: -63.1802,
  address: "Calle Germán Herraes #125, Santa Cruz de la Sierra",
};

export const BUSINESS_INFO = {
  name: "Editorial Luchito",
  city: "Santa Cruz de la Sierra, Bolivia",
  address: "Calle Germán Herraes #125, Santa Cruz",
  phone: "+591 62185931",
  whatsappNumber: "59162185931",
  email: "ventas@editorial-luchito.bo",
  slogan: "El arte de aprender",
  hours: [
    { label: "Turno Mañana (Lunes a Viernes)", time: "07:00 – 12:30" },
    { label: "Turno Tarde (Lunes a Viernes)", time: "14:00 – 18:30" },
    { label: "Sábados", time: "08:00 – 13:00" },
  ],
  logo: logoImg,
};

export const PRICE_INICIAL = 240;
export const PRICE_PRIMARIA = 230;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prekinder",
    name: "Prekínder",
    level: "inicial",
    tag: "Nivel Inicial 1ra Sección",
    price: PRICE_INICIAL,
    stock: 85,
    inStock: true,
    image: prekinderImg,
    description: "Desarrollo psicomotriz, grafomotricidad, iniciación a las letras y números, estimulación temprana y valores comunitarios.",
    modules: [
      "Iniciación al lenguaje y fonética",
      "Razonamiento lógico-matemático inicial",
      "Exploración del entorno y naturaleza",
      "Taller de grafomotricidad y motricidad fina",
      "Educación rítmica y canciones infantiles",
      "Valores y convivencia armónica"
    ],
    features: [
      "Papel de alto gramaje para colorear y recortar",
      "Ejercicios secuenciales adaptados a 4 años",
      "Incluye stickers didácticos y recortables",
      "Aprobado por el Ministerio de Educación"
    ],
    color: "#e11d48",
  },
  {
    id: "kinder",
    name: "Kínder",
    level: "inicial",
    tag: "Nivel Inicial 2da Sección",
    price: PRICE_INICIAL,
    stock: 92,
    inStock: true,
    image: kinderImg,
    description: "Preparación sólida para el paso a primaria: lectoescritura inicial, operaciones básicas con material concreto y arte creativo.",
    modules: [
      "Lectoescritura fonológica y trazos guiados",
      "Números del 1 al 50 y nociones espaciales",
      "Ciencias y seres vivos en el entorno",
      "Expresión plástica, recortado y modelado",
      "Música y expresión corporal",
      "Valores sociocomunitarios y autonomía"
    ],
    features: [
      "Hojas resistentes para témperas y crayones",
      "Secuencia pre-escolar integral",
      "Ilustraciones motivadoras a todo color",
      "Recomendado por maestras de nivel inicial"
    ],
    color: "#ea580c",
  },
  {
    id: "p1",
    name: "1ro de Primaria",
    level: "primaria",
    tag: "Primer Año de Primaria",
    price: PRICE_PRIMARIA,
    stock: 120,
    inStock: true,
    image: p1Img,
    description: "Acompaña la alfabetización inicial y el desarrollo numérico con textos interactivos y la sección complementaria 'Manos a la Obra'.",
    modules: [
      "Comunicación y Lenguajes: Lectoescritura y comprensión",
      "Matemática: Adición, sustracción y geometría básica",
      "Ciencias Naturales: El cuerpo humano y el medio ambiente",
      "Ciencias Sociales: Familia, escuela y comunidad",
      "Manos a la Obra: Talleres manuales y arte",
      "Educación Musical y Cancionero patrio"
    ],
    features: [
      "4 áreas fundamentales en un solo tomo integrado",
      "Sección práctica 'Manos a la Obra'",
      "Actividades para el hogar y aula",
      "Cuaderno de caligrafía y razonamiento incluido"
    ],
    color: "#2563eb",
  },
  {
    id: "p2",
    name: "2do de Primaria",
    level: "primaria",
    tag: "Segundo Año de Primaria",
    price: PRICE_PRIMARIA,
    stock: 98,
    inStock: true,
    image: p2Img,
    description: "Consolidación de la lectura fluida, comprensión de textos, multiplicación inicial y conocimiento de las regiones de Bolivia.",
    modules: [
      "Comunicación y Lenguajes: Textos narrativos y ortografía",
      "Matemática: Multiplicación introductoria y problemas",
      "Ciencias Naturales: Animales, plantas y ecosistemas locales",
      "Ciencias Sociales: Símbolos patrios y tradiciones",
      "Manos a la Obra: Experimentos sencillos y proyectos",
      "Valores y convivencia escolar"
    ],
    features: [
      "Lecturas amenas con preguntas inferenciales",
      "Desafíos matemáticos ilustrados",
      "Glosario infantil y curiosidades de Bolivia",
      "Alineado al modelo sociocomunitario"
    ],
    color: "#059669",
  },
  {
    id: "p3",
    name: "3ro de Primaria",
    level: "primaria",
    tag: "Tercer Año de Primaria",
    price: PRICE_PRIMARIA,
    stock: 75,
    inStock: true,
    image: p3Img,
    description: "Fortalecimiento del pensamiento crítico, redacción de párrafos, división, tablas de multiplicar y biodiversidad boliviana.",
    modules: [
      "Comunicación y Lenguajes: Gramática, fábulas y leyendas",
      "Matemática: Multiplicación, división y fracciones básicas",
      "Ciencias Naturales: Los sentidos, nutrición y reciclaje",
      "Ciencias Sociales: Geografía de Bolivia y municipios",
      "Manos a la Obra: Construcción de maquetas",
      "Tecnología y artes plásticas"
    ],
    features: [
      "Evaluaciones diagnósticas por unidad",
      "Talleres de expresión oral y debate",
      "Actividades interdisciplinarias",
      "Material gráfico de alta calidad"
    ],
    color: "#7c3aed",
  },
  {
    id: "p4",
    name: "4to de Primaria",
    level: "primaria",
    tag: "Cuarto Año de Primaria",
    price: PRICE_PRIMARIA,
    stock: 64,
    inStock: true,
    image: p4Img,
    description: "Profundización en comprensión lectora avanzada, decimales, fracciones, historia precolombina y recursos naturales.",
    modules: [
      "Comunicación y Lenguajes: Textos expositivos y conectores",
      "Matemática: Fracciones, decimales y perímetros",
      "Ciencias Naturales: Sistemas del cuerpo y reinos naturales",
      "Ciencias Sociales: Época colonial y pueblos originarios",
      "Manos a la Obra: Proyectos de ciencias y tecnología",
      "Educación Musical y partituras para flauta dulce"
    ],
    features: [
      "Lecturas históricas contextualizadas a Bolivia",
      "Ejercicios paso a paso de matemática",
      "Mapas temáticos y esquemas conceptuales",
      "Códigos QR con recursos digitales"
    ],
    color: "#d97706",
  },
  {
    id: "p5",
    name: "5to de Primaria",
    level: "primaria",
    tag: "Quinto Año de Primaria",
    price: PRICE_PRIMARIA,
    stock: 58,
    inStock: true,
    image: p5Img,
    description: "Desarrollo de habilidades investigativas, geometría, estadística, historia republicana de Bolivia y cuidado medioambiental.",
    modules: [
      "Comunicación y Lenguajes: Ensayos breves y oratoria",
      "Matemática: Áreas, volúmenes, porcentajes y regla de 3",
      "Ciencias Naturales: Ecología aplicada y física elemental",
      "Ciencias Sociales: Historia de Bolivia y héroes patrios",
      "Manos a la Obra: Experimentos caseros comprobados",
      "Tecnología, informática y ciudadanía digital"
    ],
    features: [
      "Enfoque en pensamiento investigativo",
      "Cronologías históricas y biografías ilustradas",
      "Problemas matemáticos de la vida real",
      "Contenido verificado pedagógicamente"
    ],
    color: "#0284c7",
  },
  {
    id: "p6",
    name: "6to de Primaria",
    level: "primaria",
    tag: "Sexto Año de Primaria",
    price: PRICE_PRIMARIA,
    stock: 45,
    inStock: true,
    image: p6Img,
    description: "Preparación integral para la transición a secundaria: redacción formal, álgebra básica, civismo y proyectos comunitarios.",
    modules: [
      "Comunicación y Lenguajes: Literatura boliviana y análisis",
      "Matemática: Razonamiento algebraico y estadística",
      "Ciencias Naturales: Química básica, célula y genética inicial",
      "Ciencias Sociales: Constitución Política y democracia",
      "Manos a la Obra: Emprendimientos escolares y ferias",
      "Valores socioemocionales y vocación"
    ],
    features: [
      "Exigencia adecuada para pase a secundaria",
      "Proyectos prácticos para ferias científicas",
      "Talleres de lectura crítica y argumentación",
      "Edición 2026 actualizada"
    ],
    color: "#4f46e5",
  },
];

export const PRODUCTS = INITIAL_PRODUCTS;

export const INITIAL_ORDERS: Order[] = [
  {
    id: "LUCHITO-2026-1042",
    customer: {
      nombre: "Carmen Rosa Melgar",
      celular: "78045123",
      correo: "carmen.melgar@gmail.com",
      unidad: "Colegio Alemán Santa Cruz",
      ciudad: "Santa Cruz de la Sierra",
      notas: "Entregar en portería del colegio por favor.",
    },
    items: [
      { productId: "p3", name: "3ro de Primaria", unitPrice: 230, qty: 1, subtotal: 230, image: p3Img },
      { productId: "p5", name: "5to de Primaria", unitPrice: 230, qty: 1, subtotal: 230, image: p5Img },
    ],
    total: 460,
    totalBooks: 2,
    deliveryType: "colegio",
    deliveryDate: "2026-11-03",
    deliverySlot: "07:00-09:30",
    deliveryLocation: {
      lat: -17.7712,
      lng: -63.1754,
      addressText: "Av. San Martín y 4to Anillo (Equipetrol)",
    },
    paymentMethod: "qr",
    status: "pagado",
    createdAt: "2026-11-01T15:20:00.000Z",
  },
  {
    id: "LUCHITO-2026-1043",
    customer: {
      nombre: "Lic. Carlos Siles",
      celular: "69123840",
      correo: "profe.siles@colegios.bo",
      unidad: "U.E. Gabriel René Moreno",
      ciudad: "Santa Cruz de la Sierra",
      notas: "Pedido de curso para 2do de Primaria",
    },
    items: [
      { productId: "p2", name: "2do de Primaria", unitPrice: 230, qty: 12, subtotal: 2760, image: p2Img },
    ],
    total: 2760,
    totalBooks: 12,
    deliveryType: "colegio",
    deliveryDate: "2026-11-04",
    deliverySlot: "09:30-12:30",
    deliveryLocation: {
      lat: -17.7850,
      lng: -63.1900,
      addressText: "Calle Ballivián esq. René Moreno",
    },
    paymentMethod: "efectivo",
    status: "en_camino",
    createdAt: "2026-11-01T16:10:00.000Z",
  },
  {
    id: "LUCHITO-2026-1044",
    customer: {
      nombre: "María Elena Vaca",
      celular: "71092834",
      unidad: "Kínder Campanita",
      ciudad: "Santa Cruz de la Sierra",
      notas: "Pasará a recoger el papá a mediodía",
    },
    items: [
      { productId: "prekinder", name: "Prekínder", unitPrice: 240, qty: 1, subtotal: 240, image: prekinderImg },
      { productId: "kinder", name: "Kínder", unitPrice: 240, qty: 1, subtotal: 240, image: kinderImg },
    ],
    total: 480,
    totalBooks: 2,
    deliveryType: "recojo",
    deliveryDate: "2026-11-02",
    deliverySlot: "14:00-16:30",
    paymentMethod: "qr",
    status: "pendiente",
    createdAt: "2026-11-01T18:05:00.000Z",
  },
];

export const INITIAL_MESSAGES: ClientMessage[] = [
  {
    id: "MSG-001",
    name: "Prof. Jorge Antelo",
    phone: "75382910",
    email: "jorge.antelo@gmail.com",
    school: "Colegio Don Bosco",
    subject: "Cotización por lote para 4to y 5to de Primaria",
    message: "Buenas tardes, somos la junta escolar de 4to y 5to grado, requerimos 45 libros en total. ¿Tienen descuento especial por cantidad y emisión de factura?",
    createdAt: "2026-11-01T14:30:00.000Z",
    status: "nuevo",
  },
  {
    id: "MSG-002",
    name: "Daniela Justiniano",
    phone: "72194830",
    school: "Colegio La Salle",
    subject: "Consulta sobre envío a Montero",
    message: "Hola, quisiera saber si hacen entrega personal en Montero o si el envío es por transporte Trujillo. Gracias.",
    createdAt: "2026-11-01T11:15:00.000Z",
    status: "respondido",
  },
];

export const FAQS = [
  {
    q: "¿Dónde puedo comprar los Multitextos Luchito?",
    a: "Puedes adquirirlos directamente en nuestra sede en Santa Cruz de la Sierra (Calle Germán Herraes #125) o solicitar entrega directa en tu colegio / domicilio mediante este portal o WhatsApp.",
  },
  {
    q: "¿Cómo funciona la entrega con ubicación en el mapa?",
    a: "Al llenar tu pedido, puedes marcar en el mapa interactivo la ubicación exacta de tu colegio o casa. Nosotros recibimos las coordenadas y el enlace de Google Maps para que nuestro repartidor llegue con precisión sin perderse.",
  },
  {
    q: "¿Cuáles son las franjas horarias de entrega?",
    a: "Respetamos los horarios escolares: Mañana (07:00 a 09:30 y 09:30 a 12:30) y Tarde (14:00 a 16:30 y 16:30 a 18:30). Puedes escoger el día hábil que más te convenga.",
  },
  {
    q: "¿Cómo pago con QR Simple o Transferencia Bancaria?",
    a: "Al seleccionar 'Pago por QR', la pantalla te mostrará el código QR oficial de Editorial Luchito para escanear desde cualquier app bancaria de Bolivia (Banco Unión, BCP, BNB, Banco Mercantil, Fassil/Bisa, Ganadero, etc.) y los datos de cuenta.",
  },
  {
    q: "¿Hacen envíos a otras provincias y departamentos de Bolivia?",
    a: "¡Sí! Realizamos despachos diarios a todas las provincias de Santa Cruz y a toda Bolivia (La Paz, Cochabamba, Sucre, Tarija, Oruro, Potosí, Beni y Pando) mediante encomienda segura.",
  },
  {
    q: "¿Ofrecen descuentos por paquetes para colegios y cursos?",
    a: "Sí, para profesores de grado, juntas de padres y directores de unidades educativas tenemos precios al por mayor y material de guía docente. Puedes consultarlo en el formulario o al WhatsApp +591 62185931.",
  },
];
