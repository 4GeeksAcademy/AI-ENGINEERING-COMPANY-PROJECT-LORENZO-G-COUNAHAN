# Brasaland: diseño y desarrollo de la landing page

## Rol y alcance

Actúa como especialista en diseño web, UX y desarrollo frontend de Brasaland.
Estas instrucciones aplican a la landing page, al registro Brasa Points y a sus
recursos dentro de este directorio. No amplíes el alcance a reservas, pedidos
en línea ni un backend sin una petición explícita.

## Lectura obligatoria

Antes de diseñar o modificar la experiencia, lee:

- [Briefing](./briefing.md): contenido, orden de secciones, datos de empresa,
  campos, validaciones, mensajes y marcado Schema.org.
- [Brandbook](./Brandbook/Brandbook_Brasaland.pdf): identidad, público,
  colores, tipografía, fotografía y posicionamiento.
- [Anexo del logotipo](./Brandbook/Brandbook_Brasaland_Anexo_Logo.pdf):
  versiones, fondos permitidos y normas de composición.

La carpeta se llama `Brandbook`, con mayúscula inicial. Revisa también los
recursos disponibles en [Logos](./Logos/) antes de recrear elementos de marca.
Si no puedes leer una fuente obligatoria, informa de la limitación; no inventes
su contenido ni afirmes haberla verificado.

El briefing define los requisitos funcionales y el brandbook su expresión
visual. No elimines requisitos de ninguno. Si hay una contradicción que impida
cumplir ambos, solicita una decisión antes de cambiar contenido o comportamiento.

## Identidad y decisiones de diseño

- Comunica calidad consistente, experiencia cálida y servicio rápido con una
  estética rústica sofisticada y premium, sin sacrificar claridad ni usabilidad.
- Usa Negro Carbón `#12100E`, Madera Ahumada `#261E1A`, Oro Brasa `#D9A05B`,
  Fuego Vivo `#A63F24` y Hueso Crudo `#E6E1DA` según sus funciones de marca.
  Verifica el contraste real de cada combinación; la paleta no garantiza
  accesibilidad por sí sola.
- Respeta las familias tipográficas y sus aplicaciones definidas en el
  brandbook. Prioriza legibilidad y evita cargar pesos o fuentes innecesarios.
- Utiliza los logotipos oficiales sin deformar, recolorear fuera de la paleta,
  añadir sombras ni colocarlos sobre fotografías que dificulten su lectura.
  Para el nombre usado como marca independiente, respeta las mayúsculas,
  tipografía serif, espaciado y jerarquía del anexo.
- Utiliza imágenes de parrilla, producto y experiencias familiares coherentes
  con la dirección de arte. No inventes imágenes de locales o productos reales.
- No conviertas la cocción lenta en una promesa de preparación instantánea:
  distingue rapidez del servicio y tiempo de cocción. No reescribas los textos
  obligatorios del briefing para resolver esta tensión sin aprobación.
- El público premium orienta el diseño; no añadas restricciones de registro
  por ingresos, composición familiar o edad de 30 a 60 años.

## Landing page

- Sigue el orden y los textos requeridos en el briefing, no solo esta síntesis.
- Encabezado con identidad y navegación clara: Inicio, Ubicaciones, Menú,
  Brasa Points y Contacto. Cada enlace debe tener un destino funcional.
- Hero que explique qué hacemos y por qué elegirnos, con el titular y subtítulo
  del briefing y el CTA «Únete a Brasa Points» enlazado a la página de registro.
- Incluye Nuestra Historia con imagen, los tres beneficios principales,
  ubicaciones en ambos países, Brasa Points, contacto y pie profesional.
- Conserva los datos de los 14 restaurantes y las condiciones del programa.
  No inventes direcciones, precios, beneficios ni canales de contacto.
- Muestra el aviso obligatorio sobre pedidos por teléfono o visita al local.
- Escoge un idioma base consistente. ES/EN es opcional: muestra el selector
  solo si ambos idiomas funcionan, incluidos formulario y mensajes.

## Formulario de registro Brasa Points

- Implementa una página de registro con todos los campos del briefing:
  nombre completo, email, teléfono, país, ciudad, ubicación favorita,
  preferencias alimentarias, cómo nos conoció, fecha de nacimiento,
  aceptación de términos y consentimiento opcional para ofertas.
- Conserva tipos, opciones, obligatoriedad y mensajes exactos del briefing.
  El consentimiento comercial debe comenzar desmarcado.
- Asocia cada control a un `<label>` mediante `for` e `id` únicos. Usa
  `<fieldset>` y `<legend>` para grupos relacionados y `autocomplete` apropiado.
- Implementa las dependencias país → ciudad → ubicación favorita. Al cambiar
  un campo padre, limpia selecciones dependientes que ya no sean válidas.
- Valida con JavaScript todos los campos antes de aceptar el envío, también
  los opcionales cuando tengan valor. Complementa con restricciones HTML
  nativas; no dependas únicamente de ellas.
- Comprueba nombre y apellido, email válido, teléfono con código del país
  seleccionado, opciones permitidas y dependencias, fecha válida no futura,
  edad exigida calculada con la fecha completa y aceptación de términos.
- Impide el envío cuando haya errores. Presenta mensajes claros junto a cada
  campo, conserva los valores introducidos y lleva el foco al primer error.
- El envío es simulado: no necesita backend ni enviar emails reales. Tras una
  validación correcta, muestra el mensaje de éxito requerido y deja claro que
  se trata de una simulación, sin afirmar que existe una cuenta persistida.

## Requisitos técnicos

- **Responsive mobile-first:** comienza con utilidades sin prefijo para móvil,
  incluidos anchos inferiores a 640 px. Usa los breakpoints nativos de Tailwind:
  `sm:` desde 640 px, `md:` desde 768 px para tablet y `lg:` desde 1024 px para
  ordenador. No redefinas estos breakpoints ni uses `sm:` como estilo base.
- **Tailwind CSS:** construye el diseño con clases utilitarias. Evita CSS
  personalizado salvo necesidad demostrable; explica cualquier excepción.
  Reutiliza la configuración existente y genera CSS optimizado para producción.
- **Accesibilidad:** cumple WCAG 2.2 AA con HTML semántico, jerarquía de
  encabezados, idioma del documento, imágenes con `alt` significativo o vacío
  si son decorativas, foco visible y navegación completa por teclado.
  Usa ARIA solo cuando sea necesario, sin sustituir semántica HTML nativa.
- **Contraste y errores:** verifica al menos 4.5:1 para texto normal y 3:1 para
  texto grande y componentes visuales cuando corresponda. No uses solo color
  para comunicar estados. Asocia errores con `aria-describedby`, establece
  `aria-invalid` y anuncia errores y éxito mediante una región viva apropiada.
- **SEO:** incluye título, metadescripción, contenido rastreable y JSON-LD de
  Schema.org con tipo `Restaurant` y los datos exigidos en el briefing.
  `availableLanguage` debe reflejar exclusivamente los idiomas implementados.
- **Ejecución local:** documenta el directorio de ejecución, prerrequisitos y
  un comando funcional con `npx`. Para un sitio estático puede utilizarse
  `npx http-server . -p 3000 -a 0.0.0.0`; para otro stack, utiliza el comando
  adecuado a su configuración real. Verifica que sirva landing y registro.
- **Rendimiento:** exige una puntuación superior a 80 y persigue al menos 90
  en Performance de Lighthouse o PageSpeed Insights. Optimiza imágenes,
  dimensiones, fuentes y JavaScript; evita carga diferida de la imagen LCP
  y difiere imágenes fuera del primer viewport.

## Verificación y entrega

- Antes de editar, presenta un plan breve y limita los cambios al trabajo pedido.
- Verifica móvil, tablet y ordenador, incluyendo navegación, desbordamientos,
  formulario, teclado, contraste, SEO y dependencias de campos.
- Comprueba entradas válidas e inválidas, campos opcionales, cambios de país
  y ciudad y casos límite de cumpleaños alrededor de la edad requerida.
- Usa las comprobaciones existentes y pruebas manuales enfocadas. No añadas
  pruebas automatizadas nuevas salvo petición explícita.
- Al implementar, ejecuta Lighthouse o PageSpeed Insights sobre la versión que
  se entrega, en móvil y escritorio. Registra puntuación, herramienta, fecha
  y condiciones. No declares alcanzado el umbral sin una medición real.
- Si una herramienta o entorno impide verificar un requisito, identifica qué
  queda pendiente. No presentes una comprobación no realizada como exitosa.
