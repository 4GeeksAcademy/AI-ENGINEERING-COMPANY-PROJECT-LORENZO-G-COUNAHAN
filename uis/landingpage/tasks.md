# Tareas de implementación — Landing page de Brasaland

Desglose del [plan de implementación](./Plan.md), sujeto a las
[instrucciones del proyecto](./AGENTS.md) y al [briefing](./briefing.md).
Todas las tareas comienzan pendientes. Este documento no autoriza su ejecución.
Marcar una casilla solo cuando exista el resultado y se haya verificado.

## 1. Requisitos y decisiones previas

- [ ] Revisar el briefing, ambos documentos del [Brandbook](./Brandbook/) y los recursos de [Logos](./Logos/) antes de implementar.
- [ ] Confirmar el destino y el contenido autorizado del enlace «Menú», sin inventar platos ni precios.
- [ ] Confirmar el contenido o enlace aprobado de los términos del programa.
- [ ] Aclarar si la inscripción admite a quien cumple exactamente 18 años.
- [ ] Resolver cualquier contradicción que impida cumplir briefing y brandbook sin cambiar unilateralmente textos obligatorios.
- [ ] Confirmar español como idioma base; mantener inglés fuera de la entrega inicial salvo ampliación explícita.

## 2. Base técnica

- [ ] Preparar el frontend estático con HTML semántico y JavaScript dentro de este directorio, reutilizando la configuración existente si la hubiera.
- [ ] Configurar Tailwind CSS y su compilación optimizada para producción, sin depender del CDN de desarrollo en la entrega.
- [ ] Organizar páginas, recursos, estilos generados y lógica sin añadir backend ni infraestructura innecesaria.
- [ ] Definir una fuente consistente de países, ciudades y los 14 restaurantes conforme al briefing.
- [ ] Establecer las rutas de landing y registro, incluidos enlaces de ida y vuelta.

## 3. Identidad y estructura responsive

- [ ] Aplicar la paleta corporativa y comprobar las combinaciones de texto, fondo y estados interactivos.
- [ ] Elegir tipografías conformes al brandbook, limitando familias, pesos y descargas.
- [ ] Incorporar las versiones oficiales del logotipo respetando proporciones, fondos y jerarquía.
- [ ] Seleccionar imágenes autorizadas coherentes con la dirección de arte, sin presentarlas como locales o productos reales si no lo son.
- [ ] Definir composición, espaciado y jerarquía visual mobile-first con clases sin prefijo.
- [ ] Adaptar el diseño mediante `sm:`, `md:` y `lg:` nativos, incluyendo móviles menores de 640 px.
- [ ] Diseñar estados de foco, hover, error, deshabilitado y éxito sin depender solo del color.

## 4. Landing page

- [ ] Construir el encabezado con identidad y navegación: Inicio, Ubicaciones, Menú, Brasa Points y Contacto.
- [ ] Hacer accesible por teclado la navegación móvil, con estado expandido y control de apertura y cierre si corresponde.
- [ ] Construir el hero con titular y subtítulo exactos del briefing y CTA «Únete a Brasa Points» enlazado al registro.
- [ ] Incorporar Nuestra Historia con el texto requerido y una imagen apropiada.
- [ ] Presentar Calidad Consistente, Experiencia Cálida y Rapidez con sus beneficios.
- [ ] Mostrar las ubicaciones en Colombia y Florida, sus ciudades, cantidades y horarios sin inventar direcciones.
- [ ] Presentar Brasa Points con acumulación, canjes, ofertas y registro digital conforme al briefing.
- [ ] Incluir el mensaje obligatorio sobre pedidos por teléfono o visita presencial.
- [ ] Incorporar email y teléfonos oficiales en Contacto.
- [ ] Construir el pie profesional con copyright y enlaces sociales requeridos.
- [ ] Verificar el orden de secciones, los textos obligatorios y los destinos reales de todos los enlaces.

## 5. Página de registro Brasa Points

- [ ] Crear la estructura semántica del formulario y explicar sus campos obligatorios y el carácter simulado del envío.
- [ ] Incorporar nombre completo, email y teléfono con tipos y atributos `autocomplete` adecuados.
- [ ] Incorporar país, ciudad y ubicación favorita con las opciones del briefing.
- [ ] Incorporar preferencias alimentarias y cómo conoció Brasaland.
- [ ] Incorporar fecha de nacimiento, aceptación de términos y consentimiento opcional de ofertas, inicialmente desmarcado.
- [ ] Asociar cada control con un `<label>` mediante `for` e `id` únicos; agrupar controles relacionados con `<fieldset>` y `<legend>`.
- [ ] Implementar país → ciudad → ubicación favorita, limpiando selecciones dependientes que dejen de ser válidas.
- [ ] Validar nombre y apellido, email y teléfono con el código del país seleccionado.
- [ ] Validar opciones permitidas y coherencia de país, ciudad, restaurante y demás selecciones.
- [ ] Validar fecha real no futura y edad con día, mes y año según la decisión aprobada.
- [ ] Validar aceptación de términos y campos opcionales cuando tengan valor, sin convertirlos en obligatorios.
- [ ] Validar todos los campos con JavaScript antes de aceptar el envío y complementar con restricciones HTML.
- [ ] Mostrar los mensajes exactos del briefing junto a los campos inválidos y conservar los valores introducidos.
- [ ] Asociar errores con `aria-describedby`, actualizar `aria-invalid`, anunciar errores y llevar el foco al primer campo inválido.
- [ ] Mostrar y anunciar el mensaje de éxito requerido tras una validación correcta, aclarando la simulación sin afirmar persistencia ni envío real de emails.
- [ ] Evitar transmisión, persistencia o registro innecesario de datos personales en esta simulación.

## 6. Accesibilidad y SEO

- [ ] Revisar landmarks, idioma del documento, jerarquía de encabezados y títulos de ambas páginas.
- [ ] Proporcionar alternativas de texto significativas o `alt=""` en imágenes decorativas.
- [ ] Verificar navegación completa por teclado, orden de foco, foco visible y ausencia de bloqueos.
- [ ] Medir contraste conforme a WCAG 2.2 AA: 4.5:1 para texto normal y 3:1 para texto grande y componentes cuando corresponda.
- [ ] Comprobar con tecnología de asistencia etiquetas, grupos, errores y confirmación del formulario.
- [ ] Añadir títulos y metadescripciones adecuados, con contenido rastreable.
- [ ] Implementar y validar el JSON-LD `Restaurant` con los datos requeridos y `availableLanguage` limitado a idiomas implementados.
- [ ] Mantener oculto el selector de idioma mientras no exista una experiencia bilingüe completa.

## 7. Rendimiento

- [ ] Optimizar formato, compresión y dimensiones de imágenes para los tamaños de visualización.
- [ ] Reservar espacio para imágenes y otros recursos para evitar desplazamientos de diseño.
- [ ] Priorizar la imagen LCP sin carga diferida y diferir imágenes fuera del primer viewport.
- [ ] Minimizar fuentes, CSS y JavaScript; evitar dependencias y recursos bloqueantes innecesarios.
- [ ] Medir con Lighthouse o PageSpeed Insights la versión de entrega en móvil y escritorio.
- [ ] Alcanzar Performance superior a 80 en ambos perfiles y perseguir al menos 90.
- [ ] Registrar puntuaciones, páginas evaluadas, herramienta, fecha y condiciones; declarar cualquier medición pendiente.

## 8. Verificación funcional y responsive

- [ ] Comprobar landing y registro en móvil, tablet y ordenador, incluidos anchos inferiores a 640 px y los límites de breakpoints.
- [ ] Verificar legibilidad, navegación y ausencia de desbordamientos horizontales involuntarios.
- [ ] Comprobar envío vacío, entradas válidas e inválidas, campos opcionales vacíos y errores simultáneos.
- [ ] Comprobar cambios de país y ciudad para descartar selecciones obsoletas y códigos telefónicos incompatibles.
- [ ] Comprobar fechas futuras, fechas inválidas y cumpleaños inmediatamente antes, durante y después del umbral de edad.
- [ ] Comprobar rechazo sin aceptación de términos y éxito sin consentimiento comercial.
- [ ] Confirmar que el envío inválido no muestra éxito y que corregir errores permite completar la simulación.
- [ ] Ejecutar las comprobaciones existentes pertinentes, sin añadir pruebas automatizadas nuevas salvo petición expresa.
- [ ] Registrar resultados y limitaciones; no marcar verificaciones que no se hayan realizado.

## 9. Documentación y cierre

- [ ] Documentar localmente objetivo, tecnologías, prerrequisitos, estructura, compilación y límites del registro simulado.
- [ ] Documentar el directorio de ejecución y un comando funcional con `npx`, adecuado a la configuración final.
- [ ] Verificar el comando documentado y el acceso directo tanto a la landing como al registro.
- [ ] Contrastar la entrega con todos los criterios de aceptación del plan.
- [ ] Revisar que no se hayan incorporado reservas, pedidos, backend ni funcionalidades ajenas al alcance.
- [ ] Actualizar estas casillas únicamente con resultados comprobados y comunicar los pendientes de entrega.
