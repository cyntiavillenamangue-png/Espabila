import { useState, useRef, useEffect, useCallback } from "react";

const COMUNIDADES = [
  "Todas", "Andalucía", "Aragón", "Asturias", "Baleares", "Canarias",
  "Cantabria", "Castilla-La Mancha", "Castilla y León", "Cataluña",
  "Ceuta", "Comunidad de Madrid", "Comunidad Valenciana", "Extremadura",
  "Galicia", "La Rioja", "Melilla", "Murcia", "Navarra", "País Vasco"
];

const GUIDES = [
  {
    id: "renta", emoji: "📄", title: "Declaración de la Renta", color: "#FF6B35", tag: "Impuestos",
    related: ["nomina", "autonomo"],
    steps: [
      { title: "¿Qué es la renta?", body: "El IRPF (Impuesto sobre la Renta de las Personas Físicas) es lo que pagas según tus ingresos anuales. Hacienda hace una estimación y tú corriges si pagaste de más o de menos." },
      { title: "¿Estoy obligado a declarar?", body: "Si ganaste más de 22.000€ de un pagador, o más de 15.000€ de varios pagadores, estás obligado. Por debajo puedes hacerla igualmente si te sale a devolver." },
      { title: "Cómo acceder al borrador", body: "Entra en la web de la AEAT (agenciatributaria.gob.es), accede con Cl@ve o certificado digital y descarga tu borrador. Revísalo siempre antes de confirmarlo." },
      { title: "Desgravaciones clave", body: "Vivienda habitual, aportaciones a planes de pensiones, donativos, alquiler (según CCAA), discapacidad, hijos… No te saltes estas deducciones, pueden suponer cientos de euros." },
      { title: "¿Sale a devolver o a pagar?", body: "Si te retuvieron más de lo que debes → te devuelven. Si retuvieron menos → pagas. Puedes domiciliar el pago o fraccionar en dos plazos (junio y noviembre)." },
    ]
  },
  {
    id: "nomina", emoji: "💶", title: "Entender tu Nómina", color: "#2EC4B6", tag: "Finanzas",
    related: ["renta", "laboral", "ss"],
    steps: [
      { title: "Salario bruto vs neto", body: "El bruto es lo que negocias. El neto es lo que ves en tu cuenta. La diferencia son las cotizaciones a la Seguridad Social y la retención del IRPF." },
      { title: "Cotizaciones a la SS", body: "Pagas un ~6,35% de tu salario bruto a la Seguridad Social. Esto te da derecho a sanidad, paro, jubilación y bajas. No es un impuesto, es una aportación a tu futuro." },
      { title: "Retención del IRPF", body: "Tu empresa te retiene un % según tu salario estimado anual. Si tienes hijos, discapacidad, segunda actividad, etc., rellena el modelo 145 para ajustar la retención." },
      { title: "Pagas extras", body: "Por ley tienes derecho a dos pagas extras al año (junio y Navidad). Pueden estar prorrateadas en 12 mensualidades o pagarse en fechas concretas según convenio." },
      { title: "Conceptos en la nómina", body: "Salario base + complementos = devengos. Menos retenciones e SS = líquido a percibir. Guarda siempre todas tus nóminas." },
    ]
  },
  {
    id: "alquiler", emoji: "🏠", title: "Alquilar un Piso", color: "#A663CC", tag: "Vivienda",
    related: ["padron", "banco", "hipoteca"],
    steps: [
      { title: "El contrato de alquiler", body: "Por ley, la duración mínima es 5 años (7 si el arrendador es empresa). Antes de firmar, léelo entero. Fíjate en la fianza, el IPC y quién paga los suministros." },
      { title: "La fianza", body: "Es obligatoria por ley: equivale a 1 mes de renta. El propietario debe depositarla en el organismo autonómico. Te la deben devolver al salir si todo está bien." },
      { title: "Gastos al entrar", body: "Fianza (1 mes) + garantías adicionales (hasta 2 meses extra) + honorarios si hay agencia. En total puedes necesitar entre 2 y 4 meses por adelantado." },
      { title: "Inventario y fotos", body: "Haz fotos de TODO el piso antes de entrar y envíaselas al propietario por email. Así proteges tu fianza si hay disputas al salir." },
      { title: "Deducción por alquiler", body: "Algunas CCAA tienen deducciones autonómicas por alquiler de vivienda habitual. Si eres menor de 35 años, comprueba si tu comunidad tiene bonificaciones específicas." },
    ]
  },
  {
    id: "ss", emoji: "🏥", title: "Seguridad Social", color: "#E63946", tag: "Gestiones",
    related: ["nomina", "laboral", "autonomo"],
    steps: [
      { title: "Alta en la Seguridad Social", body: "Tu empresa te da de alta automáticamente cuando empiezas a trabajar. Si eres autónomo, debes darte de alta tú mismo en el régimen especial (RETA)." },
      { title: "Tu médico de cabecera", body: "Con el número de la SS puedes pedir tu tarjeta sanitaria en el centro de salud de tu zona. Es gratuita y te da acceso a toda la sanidad pública." },
      { title: "La baja por enfermedad", body: "Si te pones enfermo, el médico te da el parte de baja. Los 3 primeros días no cobras. Del 4º al 20º día cobra la empresa; después, la SS." },
      { title: "El paro (desempleo)", body: "Si te despiden o termina tu contrato, tienes derecho a paro si cotizaste al menos 360 días en los últimos 6 años. Solicítalo en el SEPE en los primeros 15 días hábiles." },
      { title: "Vida laboral", body: "Puedes descargar tu informe de vida laboral en la Sede Electrónica de la SS. Muestra todos tus empleos y cotizaciones. Revísalo para detectar errores." },
    ]
  },
  {
    id: "padron", emoji: "📋", title: "Padrón Municipal", color: "#F4A261", tag: "Gestiones",
    related: ["alquiler", "nie", "ss"],
    steps: [
      { title: "¿Qué es el padrón?", body: "Es el registro de dónde vives. Empadronarte es obligatorio y gratis. Define qué ayuntamiento te da servicios: sanidad, cole, ayudas, etc." },
      { title: "Cómo empadronarse", body: "Ve al ayuntamiento con DNI y prueba de domicilio (contrato de alquiler o autorización del propietario). También se puede hacer online en muchos ayuntamientos." },
      { title: "Para qué sirve", body: "Necesitas el certificado de empadronamiento para: pedir el médico, matricular a los niños, solicitar ayudas sociales, votar, y muchos trámites administrativos." },
      { title: "Cambio de domicilio", body: "Cada vez que te mudes debes actualizar el padrón. Tienes hasta 3 meses desde el cambio de residencia para hacerlo." },
    ]
  },
  {
    id: "banco", emoji: "💳", title: "Finanzas Personales", color: "#06D6A0", tag: "Finanzas",
    related: ["jubilacion", "nomina", "alquiler"],
    steps: [
      { title: "Elige bien tu banco", body: "Compara comisiones de mantenimiento, transferencias y cajeros. Los bancos online (Revolut, N26) suelen tener mejores condiciones para jóvenes." },
      { title: "El fondo de emergencia", body: "Intenta tener entre 3 y 6 meses de gastos ahorrados en una cuenta separada. Es tu red de seguridad para imprevistos." },
      { title: "La regla del 50/30/20", body: "50% para necesidades (alquiler, comida, transporte), 30% para ocio, 20% para ahorro e inversión. Adáptalo a tu situación." },
      { title: "Tarjeta de crédito", body: "La tarjeta de crédito no es dinero gratis. Si no pagas el total cada mes, los intereses pueden ser del 20-25% anual." },
      { title: "Historial crediticio", body: "Pagar a tiempo construye buen historial. Si apareces en ficheros de morosos (ASNEF), te resultará muy difícil conseguir préstamos o alquilar pisos." },
    ]
  },
  {
    id: "becas", emoji: "🎓", title: "Estudios y Becas", color: "#FFD166", tag: "Educación",
    related: ["banco", "padron"],
    steps: [
      { title: "Beca general del MEC", body: "El Ministerio de Educación convoca cada año la beca general universitaria. Depende de tu renta familiar y tu expediente académico. La convocatoria suele salir en verano." },
      { title: "¿Cuánto puedo recibir?", body: "La beca tiene varios componentes: cuantía fija por renta, cuantía variable por expediente, exención de matrícula y ayuda al desplazamiento. Puedes recibir desde 300€ hasta más de 6.000€ anuales." },
      { title: "Becas autonómicas", body: "Además de la beca estatal, muchas CCAA tienen sus propias ayudas: transporte, comedor, material, residencia… Consulta la web de educación de tu comunidad." },
      { title: "Precio de la matrícula", body: "En universidades públicas el precio varía por CCAA (entre 700€ y 1.500€ aprox. por curso). Si repites asignatura, el precio sube significativamente." },
      { title: "Préstamos para estudios", body: "El ICO ofrece préstamos para másteres con tipos de interés bajos. Algunas CCAA también tienen líneas de préstamos blandos para estudiantes." },
    ]
  },
  {
    id: "hipoteca", emoji: "🏗️", title: "Comprar una Vivienda", color: "#EF476F", tag: "Vivienda",
    related: ["alquiler", "banco", "renta"],
    steps: [
      { title: "¿Cuánto necesito ahorrado?", body: "Los bancos financian como máximo el 80% del valor. Necesitas al menos el 20% del precio más un 10-12% extra para gastos. Para un piso de 200.000€, calcula unos 60.000€ mínimo." },
      { title: "Impuestos al comprar", body: "Vivienda nueva: IVA (10%) + AJD. Segunda mano: ITP (entre el 6% y el 10% según la CCAA). Son gastos que van encima del precio de venta." },
      { title: "La hipoteca", body: "Compara siempre varias entidades. Fíjate en el TIN y la TAE. Las hipotecas fijas dan seguridad; las variables pueden ser más baratas pero suben con el Euribor." },
      { title: "Ayudas para jóvenes", body: "El Plan Estatal de Vivienda tiene avales del Estado para menores de 35 años: cubren hasta el 20% adicional sin necesitar ese ahorro propio." },
      { title: "Gastos anuales post-compra", body: "IBI anual, comunidad de propietarios, seguro de hogar (obligatorio con hipoteca), mantenimiento… Calcula entre 1.500€ y 3.000€ extra al año." },
    ]
  },
  {
    id: "laboral", emoji: "📝", title: "Contratos y Derechos Laborales", color: "#4CC9F0", tag: "Trabajo",
    related: ["ss", "nomina", "autonomo"],
    steps: [
      { title: "Tipos de contrato", body: "Indefinido: sin fecha de fin. Temporal: solo para necesidades concretas. Fijo-discontinuo: para trabajos estacionales. Exige siempre que te den copia firmada del contrato." },
      { title: "Período de prueba", body: "Durante el período de prueba cualquiera puede rescindir sin indemnización. Dura máximo 6 meses para titulados y 2 meses para el resto (según convenio)." },
      { title: "Despido e indemnización", body: "Si te despiden improcedentemente, tienes derecho a 33 días de salario por año trabajado (máximo 24 mensualidades). El finiquito incluye días pendientes, vacaciones y pagas prorrateadas." },
      { title: "Vacaciones y permisos", body: "Por ley tienes 30 días naturales de vacaciones al año. También tienes permisos retribuidos: matrimonio, fallecimiento familiar, mudanza, exámenes oficiales…" },
      { title: "Acoso y derechos", body: "Tienes derecho a un ambiente laboral seguro y libre de acoso. Si sufres mobbing o acoso sexual, puedes denunciar a la Inspección de Trabajo o consultar con un sindicato (CCOO, UGT) de forma gratuita." },
    ]
  },
  {
    id: "autonomo", emoji: "🧾", title: "Autónomos y Freelance", color: "#F77F00", tag: "Impuestos",
    related: ["renta", "ss", "banco"],
    steps: [
      { title: "Darte de alta", body: "Debes darte de alta en Hacienda (modelo 036 o 037) y en la Seguridad Social (RETA) antes de empezar a facturar." },
      { title: "La cuota de autónomos", body: "Desde 2023 hay cuotas por tramos de ingresos reales. Si ganas menos de 670€/mes, la cuota mínima es ~230€. La tarifa plana para nuevos autónomos es de 80€/mes el primer año." },
      { title: "IVA e IRPF en facturas", body: "Tus facturas llevan IVA (generalmente 21%) que ingresas a Hacienda cada trimestre (modelo 303). Además retienes un % de IRPF (15% o 7% los primeros años) en cada factura." },
      { title: "Gastos deducibles", body: "Puedes deducir material, software, teléfono, desplazamientos, formación, cuota de autónomo… Guarda siempre las facturas y paga con tarjeta para poder justificarlos." },
      { title: "Declaraciones trimestrales", body: "Cada trimestre presentas el IVA (modelo 303) y el IRPF (modelo 130). Las fechas límite son: enero, abril, julio y octubre. Los retrasos tienen recargos e intereses." },
    ]
  },
  {
    id: "jubilacion", emoji: "👴", title: "Pensión y Jubilación", color: "#7B9E87", tag: "Finanzas",
    related: ["ss", "banco", "nomina"],
    steps: [
      { title: "¿Cómo funciona el sistema?", body: "En España la pensión pública es de reparto: los trabajadores de hoy pagan las pensiones de los jubilados de hoy. Tu futura pensión depende de cuánto y durante cuánto tiempo hayas cotizado." },
      { title: "Años cotizados necesarios", body: "Para la pensión completa necesitas 37 años y 3 meses cotizados (en 2025). Con menos años, la pensión se reduce. La edad legal de jubilación es 66 años y 8 meses actualmente." },
      { title: "Cuánto cobrarás", body: "La pensión se calcula sobre tu base reguladora (media de tus últimas cotizaciones). Con 25 años cotizados cobras el 72,5%; con 37+ años, el 100%. Puedes consultar tu pensión estimada en la web de la SS." },
      { title: "Ahorro privado", body: "Los planes de pensiones desgravan en la renta (hasta 1.500€/año). También hay fondos de inversión y PPA como alternativas para complementar la pensión pública." },
      { title: "Empieza cuanto antes", body: "El interés compuesto hace que ahorrar 100€/mes desde los 25 valga mucho más que ahorrar 300€/mes desde los 45. Aunque sea poco, empieza a pensar en el largo plazo." },
    ]
  },
  {
    id: "nie", emoji: "🛂", title: "Extranjería y NIE", color: "#9B5DE5", tag: "Gestiones",
    related: ["padron", "ss", "laboral"],
    steps: [
      { title: "¿Qué es el NIE?", body: "El NIE (Número de Identidad de Extranjero) es tu identificación fiscal en España si no eres ciudadano español. Lo necesitas para trabajar, abrir cuenta bancaria, alquilar, comprar o cualquier trámite oficial." },
      { title: "Cómo obtener el NIE", body: "Pide cita en la Comisaría de Policía o Extranjería. Necesitas: formulario EX-15, pasaporte original y copia, foto de carné, justificante del motivo (contrato, matrícula…) y pago de la tasa (modelo 790)." },
      { title: "Ciudadanos de la UE", body: "Si eres de la UE y vas a residir más de 3 meses, debes registrarte en el Registro Central de Extranjeros. Recibirás un certificado con tu NIE." },
      { title: "Permisos de residencia", body: "Si no eres de la UE, necesitas un permiso de residencia para estar más de 90 días. Hay varios tipos: por trabajo, reagrupación familiar, estudios, arraigo… Cada uno con requisitos distintos." },
      { title: "Tarjeta de residencia (TIE)", body: "La TIE es el documento físico que acredita tu situación. Debes renovarla antes de que caduque (suele ser anual los primeros años). No renovarla puede generar problemas legales graves." },
    ]
  },
  {
    id: "sanidad", emoji: "🩺", title: "Sanidad Pública", color: "#E63946", tag: "Gestiones",
    related: ["ss", "padron", "laboral"],
    steps: [
      { title: "La tarjeta sanitaria", body: "La tarjeta sanitaria individual (TSI) te da acceso a toda la red pública. Si trabajas o cotizas a la SS, la tienes automáticamente. Pídela en el centro de salud de tu zona con el padrón y el número de la SS." },
      { title: "El médico de cabecera", body: "Es tu puerta de entrada al sistema. Te derivan a especialistas, te dan bajas y recetas. Llama o usa la app de tu comunidad para pedir cita. En urgencias solo ve si realmente es urgente." },
      { title: "Urgencias vs urgencias reales", body: "Las urgencias del hospital están saturadas. Para problemas menores (fiebre, cortes, esguinces) ve al PAC (Punto de Atención Continuada) o centro de salud. Reserva urgencias para situaciones graves." },
      { title: "Recetas y medicamentos", body: "Con receta electrónica el médico carga el medicamento en tu historial. El precio en farmacia depende de tu nivel de renta (copago). Activos laborales pagan entre el 40% y el 60%; pensionistas con bajos ingresos, gratis." },
      { title: "Salud mental pública", body: "Puedes pedir derivación al psicólogo clínico a través de tu médico de cabecera. Las esperas son largas (a veces meses). Muchas CCAA tienen programas específicos para jóvenes con sesiones gratuitas o de bajo coste." },
    ]
  },
  {
    id: "seguros", emoji: "🛡️", title: "Seguros Básicos", color: "#06D6A0", tag: "Finanzas",
    related: ["alquiler", "hipoteca", "banco"],
    steps: [
      { title: "¿Qué seguro necesito?", body: "No todos los seguros son obligatorios. Los esenciales para empezar: seguro de hogar (obligatorio con hipoteca, muy recomendable en alquiler), seguro de salud (si quieres saltarte listas de espera) y seguro de vida (si tienes hipoteca o dependientes)." },
      { title: "Seguro de hogar en alquiler", body: "Aunque no es obligatorio al alquilar, protege tus cosas ante robo, incendio o daños. Un seguro básico para inquilino cuesta desde 8-15€/mes. El seguro del propietario cubre el edificio, no tus pertenencias." },
      { title: "Seguro médico privado", body: "Permite evitar listas de espera y elegir médico. Cuesta entre 40-120€/mes según edad y cobertura. Contrata joven: es más barato y no tienen en cuenta enfermedades previas si entras sano." },
      { title: "Seguro de coche", body: "El seguro a terceros es obligatorio por ley. El todo riesgo compensa si el coche vale más de 8.000€. Compara precios cada año: la fidelidad no premia, cambiar de compañía sí." },
      { title: "Cómo ahorrar en seguros", body: "Compara en comparadores online (rastreator, acierto…). Paga anualmente (suele ser más barato que mensual). Sube la franquicia para bajar la prima. Nunca contrates sin leer qué excluye la póliza." },
    ]
  },
  {
    id: "banca", emoji: "📱", title: "Banca Digital", color: "#4CC9F0", tag: "Finanzas",
    related: ["banco", "autonomo", "renta"],
    steps: [
      { title: "Bancos online vs tradicionales", body: "Los bancos 100% online (Revolut, N26, Wise, Bunq) no tienen oficinas pero ofrecen mejores condiciones: sin comisiones, cambio de divisa a precio real, cashback. Los tradicionales dan más seguridad en trámites complejos (hipotecas, gestiones)." },
      { title: "Revolut para el día a día", body: "Revolut es muy popular en España para jóvenes: sin comisión en pagos internacionales, cambio de divisa sin recargo, tarjeta virtual para compras online y sistema de cuentas compartidas para gastos con amigos." },
      { title: "Bizum y pagos instantáneos", body: "Bizum está disponible en casi todos los bancos españoles. Permite enviar hasta 1.000€ por transferencia y hasta 500€ acumulados al día. Es instantáneo y gratuito." },
      { title: "Seguridad en banca online", body: "Usa contraseñas únicas y activa la autenticación en dos pasos. Nunca hagas banca desde redes wifi públicas sin VPN. Tu banco nunca te pedirá la contraseña completa ni las coordenadas por email o SMS." },
      { title: "Fintech para ahorrar", body: "Apps como Fintonic o Finary te ayudan a ver todos tus bancos juntos y analizar gastos. Muchos bancos también tienen 'Metas de ahorro' automatizadas. Automatizar el ahorro (transferencia automática el día del sueldo) funciona mejor que ahorrar lo que sobra." },
    ]
  },
];

const TIPS = [
  "💡 Pide siempre copia firmada de tu contrato el mismo día que lo firmes.",
  "💡 La declaración de la renta tiene plazo hasta el 30 de junio — no la dejes para el último día.",
  "💡 Guarda todas tus nóminas en una carpeta digital. Las necesitarás para pedir el paro.",
  "💡 Si te cambian de domicilio, actualiza el padrón en menos de 3 meses para evitar problemas.",
  "💡 El fondo de emergencia debería cubrir al menos 3 meses de tus gastos fijos.",
  "💡 Como autónomo nuevo, tienes tarifa plana de 80€/mes el primer año en la SS.",
  "💡 Revisa tu vida laboral al menos una vez al año para detectar errores de cotización.",
  "💡 Antes de firmar un alquiler, haz fotos de cada habitación y envíalas por email al propietario.",
  "💡 El seguro del móvil o la garantía extendida casi nunca compensan. Ahorra ese dinero.",
  "💡 Puedes pedir cita en la Inspección de Trabajo de forma anónima si tu empresa no cumple la ley.",
  "💡 La cuenta nómina no tiene por qué ser tu banco principal — compara condiciones.",
  "💡 El plazo para reclamar el finiquito caduca a los 12 meses. No esperes.",
  "💡 El alquiler no debe superar el 30% de tu sueldo neto para que el presupuesto sea sostenible.",
  "💡 Compara siempre al menos 3 entidades antes de pedir una hipoteca.",
  "💡 Activa la autenticación en dos pasos en tu banco. Es el mejor seguro contra fraude digital.",
  "💡 Si tienes 200€ al mes de margen, una transferencia automática a ahorro el día del sueldo evita gastarlo sin darte cuenta.",
  "💡 Cualquier trabajador puede consultar su convenio colectivo gratis en el BOE.",
];

// --- Utilidades IRPF / SS ---
function calcIRPF(bruto) {
  const minPersonal = 5550;
  const base = Math.max(0, bruto - minPersonal);
  const tramos = [
    [12450, 0.19], [20200, 0.24], [35200, 0.30],
    [60000, 0.37], [300000, 0.45], [Infinity, 0.47],
  ];
  let tax = 0, prev = 0;
  for (const [limite, tipo] of tramos) {
    if (base <= prev) break;
    tax += (Math.min(base, limite) - prev) * tipo;
    prev = limite;
  }
  return tax;
}

function calcAutonomoCuota(netMensual) {
  const tramos = [
    [670, 230], [900, 260], [1125, 275], [1300, 294],
    [1500, 314], [1700, 327], [1850, 340], [2030, 357],
    [2330, 380], [Infinity, 405],
  ];
  for (const [hasta, cuota] of tramos) {
    if (netMensual <= hasta) return cuota;
  }
  return 405;
}

const fmt = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtPct = (n) => (n * 100).toFixed(1) + "%";

// --- Markdown renderer ---
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^[\*\-] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[\*\-] /.test(lines[i])) { items.push(lines[i].replace(/^[\*\-] /, "")); i++; }
      elements.push(<ul key={i} style={{ margin: "6px 0", paddingLeft: "18px" }}>{items.map((it, j) => <li key={j} style={{ marginBottom: "3px" }}>{parseBold(it)}</li>)}</ul>);
    } else if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, "")); i++; }
      elements.push(<ol key={i} style={{ margin: "6px 0", paddingLeft: "18px" }}>{items.map((it, j) => <li key={j} style={{ marginBottom: "3px" }}>{parseBold(it)}</li>)}</ol>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />); i++;
    } else {
      elements.push(<p key={i} style={{ margin: "0 0 4px" }}>{parseBold(line)}</p>); i++;
    }
  }
  return elements;
}

function parseBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? <strong key={i}>{p.slice(2, -2)}</strong> : p
  );
}

// --- Componentes ---

function ApiKeyModal({ onSave, onClose }) {
  const [key, setKey] = useState("");
  const valid = key.startsWith("sk-");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "36px", maxWidth: "420px", width: "100%", animation: "fadeIn 0.3s ease" }}>
        <div style={{ fontSize: "2rem", marginBottom: "16px" }}>🔑</div>
        <h2 style={{ margin: "0 0 10px", fontSize: "20px", color: "#fff", fontFamily: "'Syne', sans-serif" }}>API Key de Anthropic</h2>
        <p style={{ margin: "0 0 20px", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>
          Para el chat con IA necesitas tu propia key de Anthropic. Se guarda solo en tu navegador y no se envía a ningún servidor externo.
        </p>
        <input
          type="password" value={key} onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && valid && onSave(key)}
          placeholder="sk-ant-..."
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${valid ? "#FF6B35" : "rgba(255,255,255,0.15)"}`, color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", marginBottom: "12px", boxSizing: "border-box", transition: "border-color 0.2s" }}
          autoFocus
        />
        <button onClick={() => valid && onSave(key)} disabled={!valid}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: valid ? "#FF6B35" : "#2a2a2a", color: valid ? "#fff" : "#555", fontSize: "14px", fontWeight: "600", cursor: valid ? "pointer" : "default", fontFamily: "inherit", transition: "background 0.2s" }}>
          Guardar y continuar
        </button>
        <p style={{ margin: "14px 0 0", color: "#555", fontSize: "12px", textAlign: "center" }}>Obtén tu key en console.anthropic.com</p>
      </div>
    </div>
  );
}

function TipBanner() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [visible, setVisible] = useState(true);

  const next = () => {
    setVisible(false);
    setTimeout(() => { setIdx(i => (i + 1) % TIPS.length); setVisible(true); }, 250);
  };

  return (
    <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "background 0.2s" }}
      onClick={next}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,53,0.13)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,53,0.08)"}>
      <div style={{ flex: 1, fontSize: "13px", color: "#ddd", opacity: visible ? 1 : 0, transition: "opacity 0.25s" }}>{TIPS[idx]}</div>
      <div style={{ color: "#FF6B35", fontSize: "12px", flexShrink: 0, opacity: 0.7 }}>siguiente →</div>
    </div>
  );
}

function GuideCard({ guide, completed, onClick }) {
  return (
    <button onClick={() => onClick(guide)} style={{
      background: completed ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${completed ? guide.color + "44" : "rgba(255,255,255,0.08)"}`,
      borderRadius: "16px", padding: "24px", cursor: "pointer", textAlign: "left",
      transition: "all 0.2s ease", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = guide.color + "66"; }}
      onMouseLeave={e => { e.currentTarget.style.background = completed ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = completed ? guide.color + "44" : "rgba(255,255,255,0.08)"; }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: guide.color + "18", borderRadius: "0 16px 0 80px" }} />
      {completed && (
        <div style={{ position: "absolute", top: "12px", right: "12px", background: guide.color, borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff" }}>✓</div>
      )}
      <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{guide.emoji}</div>
      <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: guide.color, textTransform: "uppercase", marginBottom: "6px" }}>{guide.tag}</div>
      <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff", lineHeight: 1.3 }}>{guide.title}</div>
      <div style={{ marginTop: "12px", fontSize: "12px", color: completed ? guide.color : "#666" }}>
        {completed ? "Completada ✓" : `${guide.steps.length} pasos →`}
      </div>
    </button>
  );
}

function GuideDetail({ guide, completed, onComplete, onBack, onOpenGuide }) {
  const [step, setStep] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const current = guide.steps[step];
  const isLast = step === guide.steps.length - 1;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" && !isLast) setStep(s => s + 1);
      if (e.key === "ArrowLeft" && step > 0) setStep(s => s - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, isLast]);

  const handleComplete = () => {
    if (completed) { onBack(); return; }
    setCelebrating(true);
    onComplete(guide.id);
    setTimeout(() => { setCelebrating(false); onBack(); }, 1800);
  };

  const relatedGuides = (guide.related || []).map(id => GUIDES.find(g => g.id === id)).filter(Boolean);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {celebrating && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, pointerEvents: "none", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "80px", animation: "celebrate 1.8s ease forwards" }}>🎉</div>
          <div style={{ color: "#fff", fontWeight: "700", fontSize: "18px", animation: "fadeIn 0.3s ease 0.3s both" }}>¡Guía completada!</div>
        </div>
      )}

      <button onClick={onBack} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "14px", marginBottom: "24px", padding: 0, fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
        ← Volver
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <span style={{ fontSize: "2rem" }}>{guide.emoji}</span>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: guide.color, textTransform: "uppercase" }}>{guide.tag}</div>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#fff" }}>{guide.title}</h2>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
        {guide.steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ flex: 1, height: "4px", border: "none", borderRadius: "2px", cursor: "pointer", background: i <= step ? guide.color : "rgba(255,255,255,0.1)", transition: "background 0.3s ease", padding: 0 }} />
        ))}
      </div>

      {/* Step content */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${guide.color}22`, borderRadius: "16px", padding: "28px", minHeight: "160px", position: "relative" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: guide.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
          Paso {step + 1} de {guide.steps.length}
        </div>
        <h3 style={{ margin: "0 0 14px", fontSize: "18px", color: "#fff" }}>{current.title}</h3>
        <p style={{ margin: 0, color: "#ccc", lineHeight: 1.75, fontSize: "15px" }}>{current.body}</p>
        <div style={{ position: "absolute", bottom: "12px", right: "16px", fontSize: "11px", color: "#444" }}>← → teclado</div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: step === 0 ? "#333" : "#fff", cursor: step === 0 ? "default" : "pointer", fontSize: "14px", fontFamily: "inherit", transition: "all 0.2s" }}>← Anterior</button>
        {isLast ? (
          <button onClick={handleComplete}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", background: completed ? "#2EC4B6" : guide.color, color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit" }}>
            {completed ? "Ya completada ✓" : "Marcar como completada"}
          </button>
        ) : (
          <button onClick={() => setStep(s => s + 1)}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", background: guide.color, color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit" }}>
            Siguiente →
          </button>
        )}
      </div>

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <div style={{ marginTop: "36px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "14px" }}>También te puede interesar</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {relatedGuides.map(g => (
              <button key={g.id} onClick={() => onOpenGuide(g)}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = g.color + "55"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                <span style={{ fontSize: "1.4rem" }}>{g.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: g.color, letterSpacing: "1px", textTransform: "uppercase" }}>{g.tag}</div>
                  <div style={{ fontSize: "14px", color: "#ddd", fontWeight: "500" }}>{g.title}</div>
                </div>
                <span style={{ color: "#444", fontSize: "14px" }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalcNomina() {
  const [bruto, setBruto] = useState(25000);

  const ss = bruto * 0.0635;
  const irpf = calcIRPF(bruto);
  const neto = bruto - ss - irpf;
  const netoMensual = neto / 12;
  const pctTotal = (ss + irpf) / bruto;

  const Row = ({ label, value, color, bold }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: "14px", color: bold ? "#fff" : "#aaa", fontWeight: bold ? "600" : "400" }}>{label}</span>
      <span style={{ fontSize: "14px", color: color || (bold ? "#fff" : "#ccc"), fontWeight: bold ? "700" : "400" }}>{value}</span>
    </div>
  );

  return (
    <div>
      <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#fff" }}>💶 Calculadora de Nómina</h3>
      <p style={{ margin: "0 0 24px", color: "#666", fontSize: "13px" }}>Estimación orientativa del salario neto según el bruto anual.</p>

      <label style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Salario bruto anual</label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <input
          type="range" min="10000" max="100000" step="500" value={bruto}
          onChange={e => setBruto(+e.target.value)}
          style={{ flex: 1, accentColor: "#FF6B35", cursor: "pointer" }}
        />
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 14px", minWidth: "110px", textAlign: "center" }}>
          <input
            type="number" value={bruto} onChange={e => setBruto(Math.max(10000, Math.min(200000, +e.target.value || 10000)))}
            style={{ background: "none", border: "none", color: "#FF6B35", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", width: "90px", textAlign: "center", outline: "none" }}
          />
          <span style={{ color: "#666", fontSize: "13px" }}> €/año</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#444", marginBottom: "24px" }}>
        <span>10.000€</span><span>100.000€</span>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 22px", marginBottom: "16px" }}>
        <Row label="Salario bruto anual" value={fmt(bruto)} bold />
        <Row label={`Cotización SS (~6,35%)`} value={`− ${fmt(ss)}`} color="#E63946" />
        <Row label={`Retención IRPF (${fmtPct(irpf / bruto)})`} value={`− ${fmt(irpf)}`} color="#F77F00" />
        <Row label="Salario neto anual" value={fmt(neto)} bold />
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05))", border: "1px solid rgba(255,107,53,0.25)", borderRadius: "14px", padding: "20px 22px" }}>
        <div style={{ fontSize: "12px", color: "#FF6B35", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Cobras al mes</div>
        <div style={{ fontSize: "36px", fontWeight: "800", color: "#fff", fontFamily: "'Syne', sans-serif" }}>{fmt(netoMensual)}</div>
        <div style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>
          Te retienen el {fmtPct(pctTotal)} de tu bruto ({fmt(ss + irpf)}/año)
        </div>
      </div>
    </div>
  );
}

function CalcAutonomo() {
  const [ingresos, setIngresos] = useState(1500);
  const [nuevo, setNuevo] = useState(false);

  const cuotaSS = nuevo ? 80 : calcAutonomoCuota(ingresos);
  const ivaMes = ingresos * 0.21;
  const irpfRetencion = ingresos * 0.15;
  const gastosMes = cuotaSS + irpfRetencion;
  const netoBolsillo = ingresos - cuotaSS;

  const Row = ({ label, value, color, bold, sub }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: "14px", color: bold ? "#fff" : "#aaa", fontWeight: bold ? "600" : "400" }}>
        {label}
        {sub && <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{sub}</div>}
      </span>
      <span style={{ fontSize: "14px", color: color || (bold ? "#fff" : "#ccc"), fontWeight: bold ? "700" : "400" }}>{value}</span>
    </div>
  );

  return (
    <div>
      <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#fff" }}>🧾 Calculadora Autónomo</h3>
      <p style={{ margin: "0 0 24px", color: "#666", fontSize: "13px" }}>Estimación de cuotas y retenciones según tus ingresos mensuales.</p>

      <label style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Ingresos netos mensuales (sin IVA)</label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <input type="range" min="500" max="5000" step="50" value={ingresos} onChange={e => setIngresos(+e.target.value)} style={{ flex: 1, accentColor: "#F77F00", cursor: "pointer" }} />
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 14px", minWidth: "110px", textAlign: "center" }}>
          <input type="number" value={ingresos} onChange={e => setIngresos(Math.max(500, Math.min(10000, +e.target.value || 500)))} style={{ background: "none", border: "none", color: "#F77F00", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", width: "90px", textAlign: "center", outline: "none" }} />
          <span style={{ color: "#666", fontSize: "13px" }}> €/mes</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#444", marginBottom: "20px" }}>
        <span>500€</span><span>5.000€</span>
      </div>

      <button onClick={() => setNuevo(n => !n)} style={{ background: nuevo ? "rgba(247,127,0,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${nuevo ? "rgba(247,127,0,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", padding: "10px 18px", color: nuevo ? "#F77F00" : "#888", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", marginBottom: "24px", transition: "all 0.2s" }}>
        {nuevo ? "✓ " : ""}Tarifa plana primer año (80€/mes)
      </button>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 22px", marginBottom: "16px" }}>
        <Row label="Ingresos facturados (sin IVA)" value={fmt(ingresos)} bold />
        <Row label="Cuota SS (RETA)" value={`− ${fmt(cuotaSS)}`} color="#E63946" sub={nuevo ? "Tarifa plana nuevo autónomo" : undefined} />
        <Row label="IRPF retenido en factura (15%)" value={`− ${fmt(irpfRetencion)}`} color="#F77F00" sub="Lo retiene quien te paga" />
        <Row label="Neto en tu cuenta" value={fmt(netoBolsillo)} bold />
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 22px", marginBottom: "16px" }}>
        <div style={{ fontSize: "12px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Recuerda reservar también…</div>
        <Row label="IVA a ingresar a Hacienda (21%)" value={fmt(ivaMes) + "/mes"} color="#9B5DE5" sub="Lo cobras tú, lo devuelves cada trimestre" />
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(247,127,0,0.15), rgba(247,127,0,0.05))", border: "1px solid rgba(247,127,0,0.25)", borderRadius: "14px", padding: "20px 22px" }}>
        <div style={{ fontSize: "12px", color: "#F77F00", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Tienes disponible cada mes</div>
        <div style={{ fontSize: "36px", fontWeight: "800", color: "#fff", fontFamily: "'Syne', sans-serif" }}>{fmt(netoBolsillo)}</div>
        <div style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>
          Reserva {fmt(ivaMes + irpfRetencion * 0)} adicionales para el IVA trimestral
        </div>
      </div>
    </div>
  );
}

function CalcAlquiler() {
  const [netoMensual, setNetoMensual] = useState(1800);
  const [alquiler, setAlquiler] = useState(800);

  const pct = alquiler / netoMensual;
  const recomendado = Math.round(netoMensual * 0.3);
  const disponible = netoMensual - alquiler;
  const semaforo = pct <= 0.30 ? "#2EC4B6" : pct <= 0.40 ? "#FFD166" : "#E63946";
  const semMsg = pct <= 0.30 ? "Saludable" : pct <= 0.40 ? "Ajustado" : "Demasiado alto";

  const Row = ({ label, value, color, bold }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: "14px", color: bold ? "#fff" : "#aaa", fontWeight: bold ? "600" : "400" }}>{label}</span>
      <span style={{ fontSize: "14px", color: color || (bold ? "#fff" : "#ccc"), fontWeight: bold ? "700" : "400" }}>{value}</span>
    </div>
  );

  return (
    <div>
      <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#fff" }}>🏠 Calculadora de Alquiler</h3>
      <p style={{ margin: "0 0 24px", color: "#666", fontSize: "13px" }}>¿Puedes permitirte ese piso? La regla del 30% dice que el alquiler no debe superar el 30% de tu sueldo neto.</p>

      <label style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Tu salario neto mensual</label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <input type="range" min="800" max="5000" step="50" value={netoMensual} onChange={e => setNetoMensual(+e.target.value)} style={{ flex: 1, accentColor: "#A663CC", cursor: "pointer" }} />
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 14px", minWidth: "110px", textAlign: "center" }}>
          <input type="number" value={netoMensual} onChange={e => setNetoMensual(Math.max(800, Math.min(10000, +e.target.value || 800)))} style={{ background: "none", border: "none", color: "#A663CC", fontSize: "15px", fontWeight: "700", fontFamily: "inherit", width: "90px", textAlign: "center", outline: "none" }} />
          <span style={{ color: "#666", fontSize: "13px" }}> €/mes</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#444", marginBottom: "24px" }}>
        <span>800€</span><span>5.000€</span>
      </div>

      <label style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Alquiler mensual</label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
        <input type="range" min="300" max={Math.round(netoMensual * 0.8)} step="25" value={Math.min(alquiler, Math.round(netoMensual * 0.8))} onChange={e => setAlquiler(+e.target.value)} style={{ flex: 1, accentColor: semaforo, cursor: "pointer" }} />
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 14px", minWidth: "110px", textAlign: "center" }}>
          <input type="number" value={alquiler} onChange={e => setAlquiler(Math.max(300, Math.min(Math.round(netoMensual * 0.8), +e.target.value || 300)))} style={{ background: "none", border: "none", color: semaforo, fontSize: "15px", fontWeight: "700", fontFamily: "inherit", width: "90px", textAlign: "center", outline: "none" }} />
          <span style={{ color: "#666", fontSize: "13px" }}> €/mes</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#444", marginBottom: "24px" }}>
        <span>300€</span><span>{Math.round(netoMensual * 0.8).toLocaleString("es-ES")}€</span>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 22px", marginBottom: "16px" }}>
        <Row label="Salario neto mensual" value={fmt(netoMensual)} bold />
        <Row label="Alquiler mensual" value={`− ${fmt(alquiler)}`} color={semaforo} />
        <Row label="Alquiler máximo recomendado (30%)" value={fmt(recomendado)} color="#555" />
        <Row label="Dinero restante" value={fmt(disponible)} bold />
      </div>

      <div style={{ background: `linear-gradient(135deg, ${semaforo}22, ${semaforo}08)`, border: `1px solid ${semaforo}44`, borderRadius: "14px", padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: semaforo, flexShrink: 0 }} />
          <div style={{ fontSize: "12px", color: semaforo, letterSpacing: "1px", textTransform: "uppercase", fontWeight: "700" }}>{semMsg}</div>
        </div>
        <div style={{ fontSize: "36px", fontWeight: "800", color: "#fff", fontFamily: "'Syne', sans-serif" }}>{(pct * 100).toFixed(0)}%</div>
        <div style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>de tu sueldo neto va al alquiler</div>
      </div>
    </div>
  );
}

function CalcHipoteca() {
  const [precio, setPrecio] = useState(200000);
  const [entrada, setEntrada] = useState(40000);
  const [plazo, setPlazo] = useState(30);
  const [tipo, setTipo] = useState(3.5);

  const prestamo = precio - entrada;
  const pctEntrada = entrada / precio;
  const r = tipo / 100 / 12;
  const n = plazo * 12;
  const cuota = prestamo > 0 && r > 0 ? prestamo * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : prestamo / n;
  const totalPagado = cuota * n;
  const totalIntereses = totalPagado - prestamo;
  const gastosCompra = precio * 0.10;
  const ahorroNecesario = entrada + gastosCompra;

  const Row = ({ label, value, color, bold, sub }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: "14px", color: bold ? "#fff" : "#aaa", fontWeight: bold ? "600" : "400" }}>
        {label}
        {sub && <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{sub}</div>}
      </span>
      <span style={{ fontSize: "14px", color: color || (bold ? "#fff" : "#ccc"), fontWeight: bold ? "700" : "400" }}>{value}</span>
    </div>
  );

  return (
    <div>
      <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "#fff" }}>🏗️ Calculadora de Hipoteca</h3>
      <p style={{ margin: "0 0 24px", color: "#666", fontSize: "13px" }}>Estima tu cuota mensual y el coste total de la hipoteca.</p>

      {[
        { label: "Precio del inmueble", val: precio, set: setPrecio, min: 50000, max: 800000, step: 5000, color: "#EF476F", unit: "€" },
        { label: "Entrada (ahorro propio)", val: entrada, set: setEntrada, min: Math.round(precio * 0.05), max: Math.round(precio * 0.5), step: 5000, color: "#FFD166", unit: "€" },
      ].map(({ label, val, set, min, max, step, color, unit }) => (
        <div key={label} style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>{label}</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <input type="range" min={min} max={max} step={step} value={Math.min(Math.max(val, min), max)} onChange={e => set(+e.target.value)} style={{ flex: 1, accentColor: color, cursor: "pointer" }} />
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 14px", minWidth: "110px", textAlign: "center" }}>
              <input type="number" value={val} onChange={e => set(Math.max(min, Math.min(max, +e.target.value || min)))} style={{ background: "none", border: "none", color, fontSize: "15px", fontWeight: "700", fontFamily: "inherit", width: "90px", textAlign: "center", outline: "none" }} />
              <span style={{ color: "#666", fontSize: "13px" }}> {unit}</span>
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Plazo (años)</label>
          <div style={{ display: "flex", gap: "6px" }}>
            {[15, 20, 25, 30].map(p => (
              <button key={p} onClick={() => setPlazo(p)} style={{ flex: 1, padding: "10px 6px", border: "none", borderRadius: "8px", background: plazo === p ? "#EF476F" : "rgba(255,255,255,0.06)", color: plazo === p ? "#fff" : "#666", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: plazo === p ? "700" : "400" }}>{p}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Tipo fijo (%)</label>
          <div style={{ display: "flex", gap: "6px" }}>
            {[2.5, 3.0, 3.5, 4.0].map(t => (
              <button key={t} onClick={() => setTipo(t)} style={{ flex: 1, padding: "10px 6px", border: "none", borderRadius: "8px", background: tipo === t ? "#FFD166" : "rgba(255,255,255,0.06)", color: tipo === t ? "#111" : "#666", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: tipo === t ? "700" : "400" }}>{t}%</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 22px", marginBottom: "16px" }}>
        <Row label="Precio del inmueble" value={fmt(precio)} bold />
        <Row label={`Entrada (${(pctEntrada * 100).toFixed(0)}%)`} value={`− ${fmt(entrada)}`} color="#FFD166" />
        <Row label="Préstamo hipotecario" value={fmt(prestamo)} />
        <Row label="Gastos de compra (~10%)" value={fmt(gastosCompra)} color="#E63946" sub="ITP/IVA + notaría + registro" />
        <Row label="Ahorro mínimo necesario" value={fmt(ahorroNecesario)} bold />
      </div>

      <div style={{ background: "linear-gradient(135deg, rgba(239,71,111,0.15), rgba(239,71,111,0.05))", border: "1px solid rgba(239,71,111,0.25)", borderRadius: "14px", padding: "20px 22px" }}>
        <div style={{ fontSize: "12px", color: "#EF476F", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Cuota mensual</div>
        <div style={{ fontSize: "36px", fontWeight: "800", color: "#fff", fontFamily: "'Syne', sans-serif" }}>{fmt(cuota)}</div>
        <div style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>
          Total intereses: {fmt(totalIntereses)} · Total pagado: {fmt(totalPagado)}
        </div>
      </div>
    </div>
  );
}

function CalculadorasView() {
  const [calc, setCalc] = useState("nomina");
  const calcs = [
    { id: "nomina", label: "💶 Nómina" },
    { id: "autonomo", label: "🧾 Autónomo" },
    { id: "alquiler", label: "🏠 Alquiler" },
    { id: "hipoteca", label: "🏗️ Hipoteca" },
  ];
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: "28px", background: "rgba(255,255,255,0.04)", padding: "4px", borderRadius: "12px" }}>
        {calcs.map(t => (
          <button key={t.id} onClick={() => setCalc(t.id)} style={{ padding: "10px", border: "none", borderRadius: "8px", background: calc === t.id ? "rgba(255,255,255,0.1)" : "transparent", color: calc === t.id ? "#fff" : "#666", fontWeight: calc === t.id ? "600" : "400", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", transition: "all 0.2s" }}>{t.label}</button>
        ))}
      </div>
      {calc === "nomina" && <CalcNomina />}
      {calc === "autonomo" && <CalcAutonomo />}
      {calc === "alquiler" && <CalcAlquiler />}
      {calc === "hipoteca" && <CalcHipoteca />}
      <p style={{ margin: "20px 0 0", fontSize: "12px", color: "#444", textAlign: "center", lineHeight: 1.5 }}>
        Cálculo orientativo. Para casos comunes sin deducciones especiales. Consulta a un gestor para tu situación concreta.
      </p>
    </div>
  );
}

function ChatView({ comunidad, apiKey, onNeedKey }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `¡Hola! Soy Espabila, tu asistente para aprender a ser adulto en España${comunidad !== "Todas" ? ` (${comunidad})` : ""}. Pregúntame sobre impuestos, nóminas, alquileres, becas, contratos, autónomos, jubilación, NIE… ¡lo que necesites!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usingFree, setUsingFree] = useState(!apiKey);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { setUsingFree(!apiKey); }, [apiKey]);

  const SUGGESTIONS = [
    "¿Cuándo tengo que hacer la renta?", "¿Cómo pido una beca universitaria?",
    "¿Qué necesito para ser autónomo?", "¿Cómo funciona la hipoteca?",
    "¿Qué derechos tengo en el trabajo?", "¿Cómo consigo el NIE?",
  ];

  const systemPrompt = `Eres Espabila, un asistente experto en trámites, impuestos, finanzas personales, educación, derechos laborales y gestiones administrativas en España, especialmente para jóvenes.${comunidad !== "Todas" ? ` El usuario vive en ${comunidad}, ten en cuenta las particularidades de esa comunidad autónoma.` : ""} Explica de forma clara y cercana, sin tecnicismos. Usa ejemplos concretos con cifras cuando ayude. Puedes usar **negrita** y listas con guiones para organizar la información. Responde siempre en español y de forma concisa.`;

  const sendWithPollinations = async (msgs) => {
    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        messages: [
          { role: "system", content: systemPrompt },
          ...msgs.map(m => ({ role: m.role, content: m.content }))
        ],
        seed: Math.floor(Math.random() * 9999),
        private: true,
      })
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.text();
  };

  const sendWithAnthropic = async (msgs) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: msgs.map(m => ({ role: m.role, content: m.content }))
      })
    });
    if (!res.ok) {
      if (res.status === 401) { onNeedKey(); throw new Error("API key inválida"); }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error ${res.status}`);
    }
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("") || "Sin respuesta, intenta de nuevo.";
  };

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const userMsg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = apiKey
        ? await sendWithAnthropic(newMessages)
        : await sendWithPollinations(newMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `Lo siento, ha ocurrido un error. Inténtalo de nuevo en unos segundos.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 320px)", minHeight: "400px" }}>
      {/* Provider badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2EC4B6" }} />
          <span style={{ fontSize: "12px", color: "#555" }}>
            {apiKey ? "Claude Sonnet (tu API key)" : "IA gratuita · solo necesitas wifi"}
          </span>
        </div>
        <button onClick={onNeedKey} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#555", padding: "4px 10px", cursor: "pointer", fontSize: "11px", fontFamily: "inherit" }}>
          {apiKey ? "🔑 Cambiar key" : "🔑 Usar Claude"}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "14px", alignItems: "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", marginRight: "8px", flexShrink: 0, marginTop: "2px", color: "#fff" }}>E</div>
            )}
            <div style={{ maxWidth: "78%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "#FF6B35" : "rgba(255,255,255,0.06)", color: "#fff", fontSize: "14px", lineHeight: 1.65, border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.09)" : "none" }}>
              {m.role === "assistant" ? renderMarkdown(m.content) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#fff" }}>E</div>
            <div style={{ display: "flex", gap: "5px", padding: "12px 16px", background: "rgba(255,255,255,0.06)", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(255,255,255,0.09)" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#555", animation: `bounce 1s ease ${i * 0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "8px 14px", color: "#aaa", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#aaa"; }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Pregúntame lo que quieras…"
          style={{ flex: 1, padding: "14px 18px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "rgba(255,107,53,0.45)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          style={{ padding: "14px 20px", borderRadius: "14px", border: "none", background: input.trim() && !loading ? "#FF6B35" : "#1e1e1e", color: input.trim() && !loading ? "#fff" : "#444", cursor: input.trim() && !loading ? "pointer" : "default", fontSize: "16px", transition: "all 0.2s" }}>↑</button>
      </div>
    </div>
  );
}

// --- App principal ---
export default function App() {
  const [tab, setTab] = useState("guias");
  const [comunidad, setComunidad] = useState("Todas");
  const [activeGuide, setActiveGuide] = useState(null);
  const [filterTag, setFilterTag] = useState("Todos");
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("espabila_completed") || "[]"); } catch { return []; }
  });
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("espabila_apikey") || "");
  const [showApiModal, setShowApiModal] = useState(false);

  const saveApiKey = (key) => {
    localStorage.setItem("espabila_apikey", key);
    setApiKey(key);
    setShowApiModal(false);
  };

  const markComplete = useCallback((id) => {
    setCompleted(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("espabila_completed", JSON.stringify(next));
      return next;
    });
  }, []);

  const openGuide = (guide) => {
    setActiveGuide(guide);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tags = ["Todos", ...new Set(GUIDES.map(g => g.tag))];
  const filtered = GUIDES.filter(g => {
    const matchTag = filterTag === "Todos" || g.tag === filterTag;
    const q = search.toLowerCase();
    const matchSearch = !q || g.title.toLowerCase().includes(q) || g.tag.toLowerCase().includes(q) || g.steps.some(s => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q));
    return matchTag && matchSearch;
  });

  const progress = Math.round((completed.length / GUIDES.length) * 100);

  const TABS = [
    { id: "guias", label: "📚 Guías" },
    { id: "calc", label: "🔢 Calcular" },
    { id: "chat", label: "💬 IA" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,80%,100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes celebrate { 0% { transform: scale(0) rotate(-20deg); opacity:0; } 40% { transform: scale(1.3) rotate(10deg); opacity:1; } 100% { transform: scale(0.9) rotate(0); opacity:0; } }
        input[type=range] { height: 4px; }
        input::placeholder { color: #555; }
        select option { background: #1a1a1a; }
        button { font-family: inherit; }
      `}</style>

      {showApiModal && <ApiKeyModal onSave={saveApiKey} onClose={() => setShowApiModal(false)} />}

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 20px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px", animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#FF6B35", textTransform: "uppercase", marginBottom: "8px" }}>Generación Z · España</div>
              <h1 style={{ margin: "0 0 6px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 6vw, 40px)", fontWeight: "800", lineHeight: 1.1 }}>
                Aprende a ser<br /><span style={{ color: "#FF6B35" }}>adulto</span> en España
              </h1>
              <p style={{ margin: "10px 0 0", color: "#555", fontSize: "14px" }}>Todo lo que el cole no te enseñó · {GUIDES.length} guías</p>
            </div>
            {/* Progress ring */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <svg width="62" height="62" viewBox="0 0 62 62" style={{ display: "block" }}>
                <circle cx="31" cy="31" r="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle cx="31" cy="31" r="25" fill="none" stroke="#FF6B35" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 25}`}
                  strokeDashoffset={`${2 * Math.PI * 25 * (1 - progress / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 31 31)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
                <text x="31" y="36" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="DM Sans, sans-serif">{progress}%</text>
              </svg>
              <div style={{ fontSize: "10px", color: "#444", marginTop: "4px" }}>{completed.length}/{GUIDES.length}</div>
            </div>
          </div>
        </div>

        {/* Comunidad */}
        <div style={{ marginBottom: "20px" }}>
          <select value={comunidad} onChange={e => setComunidad(e.target.value)}
            style={{ width: "100%", padding: "11px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: comunidad === "Todas" ? "#666" : "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
            {COMUNIDADES.map(c => <option key={c} value={c}>{c === "Todas" ? "📍 Selecciona tu comunidad autónoma" : c}</option>)}
          </select>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "rgba(255,255,255,0.04)", padding: "4px", borderRadius: "14px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setActiveGuide(null); }}
              style={{ flex: 1, padding: "11px 8px", border: "none", borderRadius: "10px", background: tab === t.id ? "#FF6B35" : "transparent", color: tab === t.id ? "#fff" : "#666", fontWeight: tab === t.id ? "600" : "400", cursor: "pointer", fontSize: "13px", transition: "all 0.2s ease", whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* GUÍAS */}
        {tab === "guias" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {activeGuide ? (
              <GuideDetail
                guide={activeGuide}
                completed={completed.includes(activeGuide.id)}
                onComplete={markComplete}
                onBack={() => setActiveGuide(null)}
                onOpenGuide={openGuide}
              />
            ) : (
              <>
                <TipBanner />

                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: "15px", pointerEvents: "none" }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar guías…"
                    style={{ width: "100%", padding: "12px 40px 12px 42px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,107,53,0.35)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                  {search && (
                    <button onClick={() => setSearch("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px", padding: 0, lineHeight: 1 }}>×</button>
                  )}
                </div>

                <div style={{ display: "flex", gap: "7px", marginBottom: "20px", flexWrap: "wrap" }}>
                  {tags.map(t => (
                    <button key={t} onClick={() => setFilterTag(t)}
                      style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid", borderColor: filterTag === t ? "#FF6B35" : "rgba(255,255,255,0.09)", background: filterTag === t ? "#FF6B35" : "transparent", color: filterTag === t ? "#fff" : "#666", fontSize: "12px", cursor: "pointer", transition: "all 0.2s", fontWeight: filterTag === t ? "600" : "400" }}>
                      {t}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔎</div>
                    <div style={{ fontSize: "16px", marginBottom: "16px" }}>Sin resultados para "{search}"</div>
                    <button onClick={() => { setSearch(""); setFilterTag("Todos"); }}
                      style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", color: "#888", padding: "8px 20px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                    {filtered.map(g => <GuideCard key={g.id} guide={g} completed={completed.includes(g.id)} onClick={openGuide} />)}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CALCULADORAS */}
        {tab === "calc" && <CalculadorasView />}

        {/* CHAT */}
        {tab === "chat" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <ChatView comunidad={comunidad} apiKey={apiKey} onNeedKey={() => setShowApiModal(true)} />
          </div>
        )}
      </div>
    </div>
  );
}
