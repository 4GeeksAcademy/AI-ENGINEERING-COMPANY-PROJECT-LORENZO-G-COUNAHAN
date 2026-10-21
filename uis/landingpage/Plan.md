# Plan de implementación — Landing page de Brasaland

## 1. Propósito y fuentes

El proyecto corresponde al primer hito del sitio público de Brasaland: presentar
la marca y sus restaurantes en Colombia y Estados Unidos, comunicar sus beneficios
y facilitar el registro simulado en Brasa Points.

Este documento define el enfoque, las fases y los criterios de aceptación.
No es un listado de tareas: el desglose operativo se realizará en otro documento.
No implica que la implementación o sus verificaciones ya estén realizadas.

Fuentes utilizadas:

- [README del repositorio](../../README.md): organización del monorepo y
  documentación propia para cada aplicación.
- [README de interfaces](../README.md): ubicación y separación de proyectos frontend.
- [Instrucciones de la landing page](./AGENTS.md): diseño, funcionalidad y calidad.
- [Recursos fotográficos](./photos.md): fuentes y asignación obligatoria de
  fotografías a las tarjetas de «Lo que nos hace únicos».
- [Briefing](./briefing.md): referencia de contenido, datos y comportamiento.
- [Brandbook](./Brandbook/Brandbook_Brasaland.pdf) y
  [anexo de logotipo](./Brandbook/Brandbook_Brasaland_Anexo_Logo.pdf):
  referencias de identidad incorporadas por las instrucciones especializadas.

No se encontró un archivo general `agents.md` o `AGENTS.md` en la raíz.
Por tanto, no se le atribuyen instrucciones. Si se incorpora posteriormente,
deberá revisarse su compatibilidad con este plan.

## 2. Alcance

La entrega comprende una landing page pública y una página de registro Brasa
Points, con navegación entre ambas, adaptación responsive, accesibilidad, SEO
y validación completa en el navegador.

El idioma base previsto es español. Inglés se considera una mejora opcional,
sin reducir la completitud del español. El selector ES/EN solo tendrá sentido
cuando toda la experiencia, incluidos errores y confirmación, esté traducida.

Quedan fuera de esta entrega el backend, la persistencia de inscripciones,
el envío real de emails, la autenticación, las reservas y los pedidos en línea.
No se incorporan funcionalidades de otros hitos del monorepo.

## 3. Enfoque técnico y organización

La aplicación permanecerá en este directorio, conforme a la separación de
responsabilidades del repositorio. Tendrá documentación local sobre objetivo,
tecnologías, requisitos, ejecución y límites de la simulación.

Se propone un frontend estático con HTML semántico, JavaScript y Tailwind CSS
compilado para producción. No se presupone un framework ni se añadirá uno sin
una necesidad concreta. Los recursos visuales, estilos generados y lógica de
interacción estarán organizados dentro de la aplicación, sin introducir una
API ni infraestructura innecesaria.

Las clases utilitarias de Tailwind cubrirán el diseño; cualquier CSS
personalizado requerirá una justificación. Los datos de países, ciudades y
restaurantes tendrán una representación consistente para evitar discrepancias
entre la landing y el formulario.

El enfoque mobile-first partirá de estilos sin prefijo. Los breakpoints
nativos serán `sm:` desde 640 px, `md:` desde 768 px y `lg:` desde 1024 px,
sin excluir móviles menores de 640 px.

## 4. Fases de implementación

### Fase 1 — Definición de experiencia y contenido

La base será el contenido obligatorio del briefing y una experiencia centrada
en conocer Brasaland y acceder al registro. Se conservarán el orden de secciones,
los datos de los 14 restaurantes, las condiciones de Brasa Points y los canales
de contacto. El resultado esperado es una estructura de información coherente
con destinos de navegación definidos y sin contenido comercial inventado.

### Fase 2 — Dirección visual y adaptación responsive

La identidad combinará una estética rústica premium con calidez y claridad.
La paleta, tipografía, fotografía y aplicaciones del logotipo seguirán el
brandbook y su anexo, aprovechando los recursos de [Logos](./Logos/).
El resultado esperado es una composición consistente para móvil, tablet y
ordenador, con jerarquía clara, contraste suficiente y foco visible.

Las tarjetas de «Lo que nos hace únicos» utilizarán las fuentes de
[photos.md](./photos.md) respetando esta asignación: «01. Calidad Consistente»
→ Caydesa; «02. Experiencia Cálida» → Sip Bite Go; «03. Rapidez» → Facebook.
Esta asignación sustituye a la inicial por aprobación expresa del usuario.
No se intercambiarán ni sustituirán sin aprobación. Su incorporación requiere
confirmar permisos o licencia, disponibilidad y contenido visual. La referencia
de Facebook necesita un archivo autorizado o una URL directa estable; no es
un archivo de imagen utilizable como `src`. Los bloqueos se comunicarán y la
integración afectada quedará pendiente, sin eludir restricciones de acceso.
Los recursos autorizados se optimizarán con dimensiones explícitas, alternativas
de texto y carga diferida, sin presentarlos como fotografías propias de Brasaland.

### Fase 3 — Construcción de la landing page

La composición incluirá encabezado, hero, Nuestra Historia, beneficios,
ubicaciones, Brasa Points, contacto y pie de página, en el orden del briefing.
El CTA principal llevará al registro. También estará visible el aviso de
pedidos por teléfono o visita al restaurante. La fase se considera cubierta
cuando el contenido requerido esté presente y la navegación sea funcional.

### Fase 4 — Registro y estados de interacción

La página de registro recogerá los once campos definidos en el briefing,
respetando cuáles son obligatorios y cuáles opcionales. El flujo contemplará
estado inicial, selecciones dependientes, errores y confirmación simulada.

La validación JavaScript abarcará todos los campos antes de aceptar el envío,
incluidos los opcionales con valor. País, ciudad y restaurante deberán ser
compatibles; cambiar un campo padre limpiará selecciones inválidas. La fecha de
nacimiento se comprobará con la fecha completa, no solo con el año.
Los términos serán obligatorios y las ofertas por email comenzarán desmarcadas.

El resultado esperado es un registro que impida datos inválidos, conserve las
entradas al mostrar errores y comunique el éxito sin atribuir persistencia
ni envío real de emails a la simulación.

### Fase 5 — Calidad técnica y optimización

Accesibilidad, SEO y rendimiento serán criterios transversales desde el diseño;
esta fase consolidará su verificación sobre la versión de entrega.

El HTML y los estados del formulario deberán cumplir WCAG 2.2 AA, con etiquetas
asociadas, navegación por teclado, errores anunciados y contraste comprobado.
El SEO incluirá metadatos y JSON-LD `Restaurant` con los datos del briefing
y únicamente los idiomas realmente disponibles.

La optimización priorizará imágenes dimensionadas y comprimidas, fuentes
limitadas, CSS generado y JavaScript ligero. La imagen principal no tendrá
carga diferida si constituye el elemento LCP.

### Fase 6 — Validación de entrega y documentación

La entrega se apoyará en comprobaciones manuales enfocadas y herramientas ya
disponibles, sin incorporar nuevas pruebas automatizadas salvo petición expresa.
La documentación local explicará cómo ejecutar y verificar ambas páginas.

Para el enfoque estático propuesto, el comando de referencia desde este
directorio será `npx http-server . -p 3000 -a 0.0.0.0`, con Node.js y npm
disponibles y los recursos de producción generados. El comando definitivo y
cualquier paso de compilación deberán verificarse y documentarse durante
la implementación; no se consideran funcionales por figurar en este plan.

## 5. Criterios de aceptación

| Área | Condición de aceptación |
| --- | --- |
| Contenido y marca | Secciones, textos y datos del briefing presentes; identidad conforme al brandbook y al anexo; fotografías de `photos.md` en las tres tarjetas asignadas, con permisos y acceso resueltos antes de integrarlas. |
| Navegación | Enlaces y CTA con destinos funcionales; acceso claro al formulario y retorno a la landing. |
| Responsive | Uso correcto en móvil, tablet y ordenador, incluidos anchos inferiores a 640 px, sin desbordamiento horizontal involuntario. |
| Formulario | Campos y opciones completos, validación previa al envío, dependencias consistentes y mensajes requeridos. |
| Casos límite | Comprobaciones de datos válidos e inválidos, campos opcionales, cambios de país y ciudad y cumpleaños alrededor del umbral de edad. |
| Accesibilidad | HTML semántico, labels asociados, teclado y foco utilizables, alternativas de imágenes y anuncios de errores y éxito. Contraste mínimo aplicable de 4.5:1 para texto normal y 3:1 para texto grande y componentes. |
| SEO | Título, metadescripción, idioma y marcado `Restaurant` coherentes con contenido y datos oficiales. |
| Estilos | Tailwind como base del diseño, sin CSS personalizado injustificado. |
| Ejecución | Comando con `npx` documentado y comprobado para la landing y el registro. |
| Rendimiento | Performance superior a 80 en móvil y escritorio, con objetivo de al menos 90, medido con Lighthouse o PageSpeed Insights. |
| Evidencias | Mediciones con herramienta, fecha y condiciones; limitaciones o verificaciones pendientes declaradas explícitamente. |

## 6. Decisiones y dependencias

- Decisión del usuario: «Menú» presenta la propuesta gastronómica del brandbook
  sin inventar platos, precios ni una funcionalidad de pedidos.
- Decisión del usuario: el formulario es una demostración identificada.
  Los términos oficiales siguen pendientes y son necesarios para habilitar
  una inscripción definitiva; no se inventará un documento legal.
- Decisión del usuario: se admite la inscripción desde el día que se cumplen
  18 años, calculando la edad con la fecha completa.
- El contraste y la legibilidad prevalecerán sobre combinaciones de color
  inadecuadas, manteniendo la identidad de marca.
- La rapidez del servicio y la cocción lenta deben comunicarse sin contradicción.
  Cualquier cambio en textos obligatorios requerirá aprobación.
- El posicionamiento familiar premium no añadirá condiciones de elegibilidad
  ajenas al briefing, como ingresos o pertenencia al rango de 30 a 60 años.

Las fases expresan una secuencia conceptual, no tareas asignadas ni estimaciones.
El futuro documento de tareas podrá concretarlas sin alterar este alcance.

El formulario se implementa en [application.html](./application.html) y su lógica
en [validation.js](./validation.js). Por petición del usuario, el orden es nombre,
fecha de nacimiento (habilita la continuación), email, país, ciudad, teléfono,
procedencia, términos, ofertas, ubicación favorita y preferencias alimentarias.
