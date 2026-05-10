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
    steps: [
      { title: "¿Qué es el padrón?", body: "Es el registro de dónde vives. Empadronarte es obligatorio y gratis. Define qué ayuntamiento te da servicios: sanidad, cole, ayudas, etc." },
      { title: "Cómo empadronarse", body: "Ve al ayuntamiento con DNI y prueba de domicilio (contrato de alquiler o autorización del propietario). También se puede hacer online en muchos ayuntamientos." },
      { title: "Para qué sirve", body: "Necesitas el certificado de empadronamiento para: pedir el médico, matricular a los niños, solicitar ayudas sociales, votar, y muchos trámites administrativos." },
      { title: "Cambio de domicilio", body: "Cada vez que te mudes debes actualizar el padrón. Tienes hasta 3 meses desde el cambio de residencia para hacerlo." },
    ]
  },
  {
    id: "banco", emoji: "💳", title: "Finanzas Personales", color: "#06D6A0", tag: "Finanzas",
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
    steps: [
      { title: "¿Qué es el NIE?", body: "El NIE (Número de Identidad de Extranjero) es tu identificación fiscal en España si no eres ciudadano español. Lo necesitas para trabajar, abrir cuenta bancaria, alquilar, comprar o cualquier trámite oficial." },
      { title: "Cómo obtener el NIE", body: "Pide cita en la Comisaría de Policía o Extranjería. Necesitas: formulario EX-15, pasaporte original y copia, foto de carné, justificante del motivo (contrato, matrícula…) y pago de la tasa (modelo 790)." },
      { title: "Ciudadanos de la UE", body: "Si eres de la UE y vas a residir más de 3 meses, debes registrarte en el Registro Central de Extranjeros. Recibirás un certificado con tu NIE." },
      { title: "Permisos de residencia", body: "Si no eres de la UE, necesitas un permiso de residencia para estar más de 90 días. Hay varios tipos: por trabajo, reagrupación familiar, estudios, arraigo… Cada uno con requisitos distintos." },
      { title: "Tarjeta de residencia (TIE)", body: "La TIE es el documento físico que acredita tu situación. Debes renovarla antes de que caduque (suele ser anual los primeros años). No renovarla puede generar problemas legales graves." },
    ]
  },
];

// Simple markdown renderer: **bold**, bullet lists, numbered lists
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^[\*\-] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[\*\-] /.test(lines[i])) {
        items.push(lines[i].replace(/^[\*\-] /, ""));
        i++;
      }
      elements.push(
        <ul key={i} style={{ margin: "6px 0", paddingLeft: "18px" }}>
          {items.map((it, j) => <li key={j} style={{ marginBottom: "3px" }}>{parseBold(it)}</li>)}
        </ul>
      );
    } else if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} style={{ margin: "6px 0", paddingLeft: "18px" }}>
          {items.map((it, j) => <li key={j} style={{ marginBottom: "3px" }}>{parseBold(it)}</li>)}
        </ol>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />);
      i++;
    } else {
      elements.push(<p key={i} style={{ margin: "0 0 4px" }}>{parseBold(line)}</p>);
      i++;
    }
  }
  return elements;
}

function parseBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "36px", maxWidth: "420px", width: "100%", animation: "fadeIn 0.3s ease" }}>
        <div style={{ fontSize: "2rem", marginBottom: "16px" }}>🔑</div>
        <h2 style={{ margin: "0 0 10px", fontSize: "20px", color: "#fff", fontFamily: "'Syne', sans-serif" }}>API Key de Anthropic</h2>
        <p style={{ margin: "0 0 20px", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>
          Para usar el chat con IA necesitas tu propia API key de Anthropic. Se guarda solo en tu navegador y nunca se envía a ningún servidor externo.
        </p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && key.startsWith("sk-") && onSave(key)}
          placeholder="sk-ant-..."
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", marginBottom: "12px", boxSizing: "border-box" }}
          autoFocus
        />
        <button
          onClick={() => key.startsWith("sk-") && onSave(key)}
          disabled={!key.startsWith("sk-")}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: key.startsWith("sk-") ? "#FF6B35" : "#333", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: key.startsWith("sk-") ? "pointer" : "default", fontFamily: "inherit", transition: "background 0.2s" }}
        >
          Guardar y continuar
        </button>
        <p style={{ margin: "14px 0 0", color: "#555", fontSize: "12px", textAlign: "center" }}>
          Obtén tu key en console.anthropic.com
        </p>
      </div>
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
        <div style={{ position: "absolute", top: "12px", right: "12px", background: guide.color, borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✓</div>
      )}
      <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{guide.emoji}</div>
      <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: guide.color, textTransform: "uppercase", marginBottom: "6px" }}>{guide.tag}</div>
      <div style={{ fontSize: "16px", fontWeight: "600", color: "#fff", lineHeight: 1.3 }}>{guide.title}</div>
      <div style={{ marginTop: "12px", fontSize: "12px", color: completed ? guide.color : "#888" }}>
        {completed ? "Completada ✓" : `${guide.steps.length} pasos →`}
      </div>
    </button>
  );
}

function GuideDetail({ guide, completed, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const current = guide.steps[step];
  const isLast = step === guide.steps.length - 1;

  const handleComplete = () => {
    setCelebrating(true);
    onComplete(guide.id);
    setTimeout(() => { setCelebrating(false); onBack(); }, 2000);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {celebrating && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, pointerEvents: "none" }}>
          <div style={{ fontSize: "80px", animation: "celebrate 0.6s ease" }}>🎉</div>
        </div>
      )}
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "14px", marginBottom: "24px", padding: 0, fontFamily: "inherit" }}>← Volver</button>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <span style={{ fontSize: "2rem" }}>{guide.emoji}</span>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: guide.color, textTransform: "uppercase" }}>{guide.tag}</div>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#fff" }}>{guide.title}</h2>
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
        {guide.steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ flex: 1, height: "4px", border: "none", borderRadius: "2px", cursor: "pointer", background: i <= step ? guide.color : "rgba(255,255,255,0.1)", transition: "background 0.3s ease", padding: 0 }} />
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "28px", minHeight: "160px" }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: guide.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Paso {step + 1} de {guide.steps.length}</div>
        <h3 style={{ margin: "0 0 14px", fontSize: "18px", color: "#fff" }}>{current.title}</h3>
        <p style={{ margin: 0, color: "#ccc", lineHeight: 1.7, fontSize: "15px" }}>{current.body}</p>
      </div>
      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: step === 0 ? "#444" : "#fff", cursor: step === 0 ? "default" : "pointer", fontSize: "14px", fontFamily: "inherit" }}>← Anterior</button>
        {isLast ? (
          <button onClick={completed ? onBack : handleComplete} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", background: completed ? "#2EC4B6" : guide.color, color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit" }}>
            {completed ? "Ya completada ✓" : "Marcar como completada"}
          </button>
        ) : (
          <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", background: guide.color, color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600", fontFamily: "inherit" }}>Siguiente →</button>
        )}
      </div>
    </div>
  );
}

function ChatView({ comunidad, apiKey, onNeedKey }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `¡Hola! Soy tu asistente para aprender a ser adulto en España${comunidad !== "Todas" ? ` (${comunidad})` : ""}. Pregúntame sobre impuestos, nóminas, alquileres, becas, contratos, autónomos, jubilación, NIE… ¡lo que necesites!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const SUGGESTIONS = ["¿Cuándo tengo que hacer la renta?", "¿Cómo pido una beca universitaria?", "¿Qué necesito para ser autónomo?", "¿Cómo funciona la hipoteca?", "¿Qué derechos tengo en el trabajo?", "¿Cómo consigo el NIE?"];

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    if (!apiKey) { onNeedKey(); return; }
    const userMsg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          system: `Eres un asistente experto en trámites, impuestos, finanzas personales, educación, derechos laborales y gestiones administrativas en España, especialmente para jóvenes de la Generación Z.${comunidad !== "Todas" ? ` El usuario vive en ${comunidad}, ten en cuenta las particularidades de esa comunidad autónoma.` : ""} Explica de forma clara y cercana, sin tecnicismos. Usa ejemplos concretos con cifras cuando sea útil. Puedes usar **negrita** y listas con guiones para organizar la información. Responde siempre en español.`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401) { onNeedKey(); return; }
        throw new Error(err.error?.message || "Error de API");
      }
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "No pude responder, intenta de nuevo.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${e.message}. Intenta de nuevo.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 300px)", minHeight: "400px" }}>
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "14px" }}>
            {m.role === "assistant" && (
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", marginRight: "8px", flexShrink: 0, marginTop: "2px" }}>E</div>
            )}
            <div style={{ maxWidth: "78%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "#FF6B35" : "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px", lineHeight: 1.65, border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
              {m.role === "assistant" ? renderMarkdown(m.content) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>E</div>
            <div style={{ display: "flex", gap: "5px", padding: "12px 16px", background: "rgba(255,255,255,0.07)", borderRadius: "18px 18px 18px 4px", border: "1px solid rgba(255,255,255,0.1)" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#666", animation: `bounce 1s ease ${i * 0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {messages.length === 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "8px 14px", color: "#ccc", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#ccc"; }}
            >{s}</button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder="Pregúntame lo que quieras…" style={{ flex: 1, padding: "14px 18px", borderRadius: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "rgba(255,107,53,0.5)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ padding: "14px 20px", borderRadius: "14px", border: "none", background: input.trim() && !loading ? "#FF6B35" : "#2a2a2a", color: input.trim() && !loading ? "#fff" : "#555", cursor: input.trim() && !loading ? "pointer" : "default", fontSize: "16px", transition: "all 0.2s" }}>↑</button>
      </div>
    </div>
  );
}

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

  const tags = ["Todos", ...new Set(GUIDES.map(g => g.tag))];

  const filtered = GUIDES.filter(g => {
    const matchTag = filterTag === "Todos" || g.tag === filterTag;
    const q = search.toLowerCase();
    const matchSearch = !q || g.title.toLowerCase().includes(q) || g.tag.toLowerCase().includes(q) || g.steps.some(s => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q));
    return matchTag && matchSearch;
  });

  const progress = Math.round((completed.length / GUIDES.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,80%,100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes celebrate { 0% { transform: scale(0) rotate(-20deg); opacity:0; } 50% { transform: scale(1.3) rotate(10deg); opacity:1; } 100% { transform: scale(1) rotate(0); opacity:0; } }
        input::placeholder { color: #555; }
        select option { background: #1a1a1a; }
        button { font-family: inherit; }
      `}</style>

      {showApiModal && <ApiKeyModal onSave={saveApiKey} />}

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 20px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px", animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#FF6B35", textTransform: "uppercase", marginBottom: "8px" }}>Generación Z</div>
              <h1 style={{ margin: "0 0 6px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 6vw, 40px)", fontWeight: "800", lineHeight: 1.1 }}>
                Aprende a ser<br /><span style={{ color: "#FF6B35" }}>adulto</span> en España
              </h1>
              <p style={{ margin: "10px 0 0", color: "#666", fontSize: "14px" }}>Todo lo que el cole no te enseñó · {GUIDES.length} guías</p>
            </div>
            {/* Progress ring */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
                <circle cx="30" cy="30" r="24" fill="none" stroke="#FF6B35" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
                <text x="30" y="35" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="inherit">{progress}%</text>
              </svg>
              <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>{completed.length}/{GUIDES.length}</div>
            </div>
          </div>
        </div>

        {/* Comunidad selector */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "11px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Tu comunidad autónoma</label>
          <select value={comunidad} onChange={e => setComunidad(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
            {COMUNIDADES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "rgba(255,255,255,0.04)", padding: "4px", borderRadius: "14px" }}>
          {[{ id: "guias", label: "📚 Guías" }, { id: "chat", label: "💬 Pregunta a la IA" }].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setActiveGuide(null); }} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "10px", background: tab === t.id ? "#FF6B35" : "transparent", color: tab === t.id ? "#fff" : "#777", fontWeight: tab === t.id ? "600" : "400", cursor: "pointer", fontSize: "14px", transition: "all 0.2s ease" }}>{t.label}</button>
          ))}
        </div>

        {tab === "guias" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {activeGuide ? (
              <GuideDetail
                guide={activeGuide}
                completed={completed.includes(activeGuide.id)}
                onComplete={markComplete}
                onBack={() => setActiveGuide(null)}
              />
            ) : (
              <>
                {/* Search */}
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar guías…"
                    style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,107,53,0.4)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                  {search && (
                    <button onClick={() => setSearch("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "16px", padding: 0, lineHeight: 1 }}>×</button>
                  )}
                </div>

                {/* Tag filters */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                  {tags.map(t => (
                    <button key={t} onClick={() => setFilterTag(t)} style={{ padding: "7px 16px", borderRadius: "20px", border: "1px solid", borderColor: filterTag === t ? "#FF6B35" : "rgba(255,255,255,0.1)", background: filterTag === t ? "#FF6B35" : "transparent", color: filterTag === t ? "#fff" : "#777", fontSize: "12px", cursor: "pointer", transition: "all 0.2s", fontWeight: filterTag === t ? "600" : "400" }}>{t}</button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔎</div>
                    <div style={{ fontSize: "16px" }}>No hay guías que coincidan</div>
                    <button onClick={() => { setSearch(""); setFilterTag("Todos"); }} style={{ marginTop: "14px", background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", color: "#888", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>Limpiar filtros</button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                    {filtered.map(g => (
                      <GuideCard key={g.id} guide={g} completed={completed.includes(g.id)} onClick={setActiveGuide} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === "chat" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {!apiKey && (
              <div style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.25)", borderRadius: "14px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ color: "#ccc", fontSize: "14px" }}>🔑 Necesitas una API key para usar el chat</div>
                <button onClick={() => setShowApiModal(true)} style={{ background: "#FF6B35", border: "none", borderRadius: "10px", color: "#fff", padding: "9px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>Configurar</button>
              </div>
            )}
            {apiKey && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
                <button onClick={() => setShowApiModal(true)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#555", padding: "6px 12px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>🔑 Cambiar API key</button>
              </div>
            )}
            <ChatView comunidad={comunidad} apiKey={apiKey} onNeedKey={() => setShowApiModal(true)} />
          </div>
        )}
      </div>
    </div>
  );
}
