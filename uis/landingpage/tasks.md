# Tareas de implementación — Landing page de Brasaland

Desglose del [plan de implementación](./Plan.md), sujeto a las
[instrucciones del proyecto](./AGENTS.md) y al [briefing](./briefing.md).
La implementación fue autorizada por el usuario. Las tareas no verificadas permanecen pendientes.
Marcar una casilla solo cuando exista el resultado y se haya verificado.

## 1. Requisitos y decisiones previas

- [x] Revisar el briefing, ambos documentos del [Brandbook](./Brandbook/) y los recursos de [Logos](./Logos/) antes de implementar.
- [x] Revisar [photos.md](./photos.md) y respetar la asignación corregida y aprobada por el usuario: Caydesa para Calidad y Sip Bite Go para Experiencia.
- [x] Confirmar el destino y el contenido autorizado del enlace «Menú», sin inventar platos ni precios.
- [x] Confirmar el tratamiento de términos: demostración identificada, sin inscripción definitiva hasta disponer de términos oficiales (decisión del usuario).
- [x] Aclarar si la inscripción admite a quien cumple exactamente 18 años: sí, desde su cumpleaños (decisión del usuario).
- [x] Resolver cualquier contradicción que impida cumplir briefing y brandbook sin cambiar unilateralmente textos obligatorios.
- [x] Confirmar español como idioma base; mantener inglés fuera de la entrega inicial salvo ampliación explícita.

## 2. Base técnica

- [x] Preparar el frontend estático con HTML semántico y JavaScript de validación. La navegación no necesita JavaScript.
- [x] Configurar Tailwind CSS y su compilación optimizada para producción, sin depender del CDN de desarrollo en la entrega.
- [x] Organizar páginas y recursos sin añadir backend ni infraestructura innecesaria.
- [ ] Definir una fuente consistente de países, ciudades y los 14 restaurantes conforme al briefing.
- [x] Establecer las rutas de landing y registro, incluidos enlaces de ida y vuelta.

## 3. Identidad y estructura responsive

- [ ] Aplicar la paleta corporativa y comprobar las combinaciones de texto, fondo y estados interactivos.
- [ ] Elegir tipografías conformes al brandbook, limitando familias, pesos y descargas.
- [x] Incorporar las versiones oficiales del logotipo respetando proporciones, fondos y jerarquía.
- [ ] Seleccionar imágenes autorizadas coherentes con la dirección de arte, sin presentarlas como locales o productos reales si no lo son.
- [ ] Confirmar permisos o licencia, atribución requerida, disponibilidad y contenido visual de cada recurso de [photos.md](./photos.md) antes de incorporarlo.
- [x] Obtener del usuario la URL directa autorizada de Facebook y guardar una copia local optimizada, sin utilizar la página como `src`.
- [x] Definir composición, espaciado y jerarquía visual mobile-first con clases sin prefijo.
- [ ] Verificar visualmente la adaptación implementada con `sm:`, `md:` y `lg:`, incluidos móviles menores de 640 px.
- [ ] Diseñar estados de foco, hover, error, deshabilitado y éxito sin depender solo del color.

## 4. Landing page

- [x] Construir el encabezado con identidad y navegación: Inicio, Ubicaciones, Menú, Brasa Points y Contacto.
- [ ] Comprobar por teclado la navegación móvil visible, sin botón de apertura ni dependencia de JavaScript.
- [x] Construir el hero con titular y subtítulo del briefing y CTA «Únete a Brasa Points» enlazado al formulario.
- [x] Incorporar Nuestra Historia con el texto requerido y una imagen de la identidad de marca.
- [x] Presentar Calidad Consistente, Experiencia Cálida y Rapidez con sus beneficios.
- [x] Integrar en «01. Calidad Consistente» la fotografía de Caydesa con la etiqueta «Corte de chuletón de Rubia Gallega», conforme a la corrección aprobada.
- [x] Integrar en «02. Experiencia Cálida» la fotografía de Sip Bite Go con la etiqueta «costillas St Louis Ribs glaseadas y al grill», conforme a la corrección aprobada.
- [x] Integrar en «03. Rapidez» la fotografía de Facebook con la etiqueta facilitada por el usuario «Servicio a mesa en nuestro local de Coral Gables».
- [x] Optimizar las tres fotografías, reservar sus dimensiones, definir textos alternativos tras revisión visual y aplicar carga diferida.
- [x] Verificar la correspondencia fotografía–tarjeta, legibilidad y adaptación responsive; repetir la medición de rendimiento tras integrar las imágenes.
- [x] Mostrar las ubicaciones en Colombia y Florida, sus ciudades, cantidades y horarios sin inventar direcciones.
- [x] Presentar Brasa Points con acumulación, canjes, ofertas y registro digital conforme al briefing.
- [x] Incluir el mensaje obligatorio sobre pedidos por teléfono o visita presencial.
- [x] Incorporar email y teléfonos oficiales en Contacto.
- [x] Construir el pie profesional con copyright y enlaces sociales requeridos.
- [ ] Completar la verificación de textos y navegación en navegador; enlaces locales y anclas comprobados por HTTP.

## 5. Página de registro Brasa Points

- [x] Crear la estructura semántica del formulario y explicar sus campos obligatorios y el carácter simulado del envío.
- [x] Incorporar nombre completo, email y teléfono con tipos y atributos `autocomplete` adecuados.
- [x] Incorporar país, ciudad y ubicación favorita con las opciones del briefing.
- [x] Incorporar preferencias alimentarias y cómo conoció Brasaland.
- [x] Incorporar fecha de nacimiento, aceptación de términos y consentimiento opcional de ofertas, inicialmente desmarcado.
- [x] Asociar cada control con un `<label>` mediante `for` e `id` únicos; agrupar controles relacionados con `<fieldset>` y `<legend>`.
- [x] Implementar país → ciudad → ubicación favorita, limpiando selecciones dependientes que dejen de ser válidas.
- [x] Validar nombre y apellido, email y teléfono con prefijo automático del país y diez dígitos nacionales.
- [x] Validar opciones permitidas y coherencia de país, ciudad, restaurante y demás selecciones.
- [x] Validar fecha real no futura y edad con día, mes y año; bloquear los campos posteriores hasta validar 18 años cumplidos.
- [x] Validar aceptación de términos y campos opcionales cuando tengan valor, sin convertirlos en obligatorios.
- [x] Validar todos los campos con JavaScript antes de aceptar el envío y complementar con restricciones HTML.
- [x] Mostrar los mensajes exactos del briefing junto a los campos inválidos y conservar los valores introducidos.
- [x] Asociar errores con `aria-describedby`, actualizar `aria-invalid`, anunciar errores y llevar el foco al primer campo inválido.
- [x] Mostrar el mensaje de éxito requerido como vista previa anunciada, aclarando que no hay inscripción, email ni beneficios reales.
- [x] Evitar transmisión, persistencia o registro innecesario de datos personales en esta simulación.

## 6. Accesibilidad y SEO

- [ ] Revisar landmarks, idioma del documento, jerarquía de encabezados y títulos de ambas páginas.
- [x] Proporcionar alternativas de texto significativas o `alt=""` en imágenes decorativas.
- [ ] Verificar navegación completa por teclado, orden de foco, foco visible y ausencia de bloqueos.
- [ ] Medir contraste conforme a WCAG 2.2 AA: 4.5:1 para texto normal y 3:1 para texto grande y componentes cuando corresponda.
- [ ] Comprobar con tecnología de asistencia etiquetas, grupos, errores y confirmación del formulario.
- [x] Añadir títulos y metadescripciones adecuados, con contenido rastreable.
- [x] Implementar el JSON-LD `Restaurant`, comprobar su sintaxis JSON y el idioma español. Pendiente auditoría externa de datos estructurados.
- [x] Mantener oculto el selector de idioma mientras no exista una experiencia bilingüe completa.

## 7. Rendimiento

- [x] Generar versiones WebP dimensionadas de los dos logotipos: aproximadamente 97 y 103 KB frente a 846 y 970 KB originales.
- [x] Reservar espacio de imágenes mediante dimensiones explícitas.
- [x] Priorizar la imagen principal sin carga diferida y diferir la imagen de historia.
- [ ] Minimizar fuentes, CSS y JavaScript; evitar dependencias y recursos bloqueantes innecesarios.
- [ ] Medir con Lighthouse o PageSpeed Insights la versión de entrega en móvil y escritorio.
- [ ] Alcanzar Performance superior a 80 en ambos perfiles y perseguir al menos 90.
- [ ] Registrar puntuaciones, páginas evaluadas, herramienta, fecha y condiciones; declarar cualquier medición pendiente.

## 8. Verificación funcional y responsive

- [ ] Comprobar landing y registro en móvil, tablet y ordenador, incluidos anchos inferiores a 640 px y los límites de breakpoints.
- [ ] Verificar legibilidad, navegación y ausencia de desbordamientos horizontales involuntarios.
- [x] Comprobar envío vacío, entradas válidas e inválidas, campos opcionales vacíos y errores simultáneos.
- [x] Comprobar cambios de país y ciudad para descartar selecciones obsoletas y códigos telefónicos incompatibles.
- [x] Comprobar fechas futuras, fechas vacías/no válidas y cumpleaños inmediatamente antes, durante y después del umbral de edad.
- [x] Comprobar rechazo sin aceptación de términos y éxito sin consentimiento comercial.
- [x] Confirmar que el envío inválido no muestra éxito y que corregir errores permite completar la simulación.
- [ ] Ejecutar las comprobaciones existentes pertinentes, sin añadir pruebas automatizadas nuevas salvo petición expresa.
- [ ] Registrar resultados y limitaciones; no marcar verificaciones que no se hayan realizado.

## 9. Documentación y cierre

- [x] Documentar localmente objetivo, tecnologías, prerrequisitos, estructura, compilación y límites del registro simulado.
- [x] Documentar el directorio de ejecución y un comando funcional con `npx`, adecuado a la configuración final.
- [x] Verificar el servidor local y el acceso HTTP directo a la landing y al registro.
- [ ] Contrastar la entrega con todos los criterios de aceptación del plan.
- [ ] Revisar que no se hayan incorporado reservas, pedidos, backend ni funcionalidades ajenas al alcance.
- [ ] Actualizar estas casillas únicamente con resultados comprobados y comunicar los pendientes de entrega.

## Evidencia de esta entrega

2026-10-21: compilación de producción Tailwind completada; servidor `npx
http-server` comprobado por HTTP; estructura HTML, unicidad de identificadores,
anclas, archivos enlazados, dimensiones y alternativas de imágenes y sintaxis
JSON-LD comprobados. `git diff --check` sin errores.

La política de contenido bloqueó la creación del script de navegación, por lo
que la navegación permanece visible y funciona sin él. La instalación del
navegador falló dos veces por incompatibilidad del entorno; no se repitió.
No hay medición Lighthouse ni verificación visual o de lector de pantalla.
Estas limitaciones corresponden a la primera entrega de la landing.

### Ampliación: formulario, 2026-10-21

Implementados `application.html` y `validation.js`, en el orden solicitado.
Los CTA de la landing apuntan al formulario; `registro.html` conserva un acceso
compatible. Compilación Tailwind y sintaxis JavaScript verificadas.

Comprobado en Chromium: edad de 18 años en la víspera, el cumpleaños y el día
siguiente; fechas futuras y vacías; re-bloqueo por edad; mensajes y foco ante
errores; cinco ciudades y 14 restaurantes; limpieza de dependencias; prefijos
telefónicos; términos obligatorios; éxito sin ofertas, restaurante ni
preferencias; selección excluyente de «Sin restricciones»; rechazo de ciudad
y restaurante ajenos al país; controles etiquetados y alternativa sin JavaScript.
No se utiliza almacenamiento del navegador ni envío de datos.

El formulario no desborda a 320, 375, 639, 640, 767, 768, 1023, 1024 y 1440 px.
Axe no detecta infracciones automáticas WCAG A/AA; la comprobación completa con
lector de pantalla sigue pendiente.

Lighthouse 12.8.2 en `application.html`, servidor HTTP local, Chromium headless,
2026-10-21, perfiles estándar móvil y escritorio: Performance 100 y accesibilidad
100 en ambos. SEO 60/63 por `noindex` deliberado para la demostración.
Estos resultados no completan las casillas de auditoría global de la landing.

### Incorporación de fotografías, 2026-10-21

El usuario confirmó autorización de uso, aprobó intercambiar las fuentes de las
dos primeras tarjetas y proporcionó la URL directa de la tercera. Las tres
descargas y las copias WebP locales se verificaron visualmente y en Chromium.
Los pies de foto coinciden con las etiquetas solicitadas; los textos alternativos
describen lo visible, sin verificar de forma independiente la raza o el local.
La atribución específica de las licencias originales no se ha facilitado.

Verificados carga, dimensiones, carga diferida y ausencia de desbordamientos en
320, 375, 768, 1024 y 1440 px. Axe sin infracciones automáticas en la sección.
Lighthouse 12.8.2, landing en HTTP local puerto 3000, Chromium headless, perfiles
estándar móvil y escritorio: Performance 98/100, respectivamente, después de
incorporar las fotos. Las mediciones no sustituyen una auditoría en producción.
