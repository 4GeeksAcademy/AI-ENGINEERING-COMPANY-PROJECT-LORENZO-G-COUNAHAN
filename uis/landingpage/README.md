# Brasaland — Sitio público

Landing estática en español con HTML semántico y Tailwind CSS compilado.
La paleta y los logotipos proceden del brandbook y de los recursos del proyecto.
Las versiones WebP conservan las proporciones y el contenido de los originales.
No se utilizan fuentes remotas ni CSS CDN. Las fotografías de terceros se
incorporan con autorización de uso confirmada por el usuario y se documentan
en [photos.md](./photos.md), incluidas fuentes, etiquetas y limitaciones.

## Ejecución local

Requisitos: Node.js 22 y npm.

Desde la raíz del repositorio:

```sh
cd uis/landingpage
npm ci
npm run build
npx http-server . -p 3000 -a 0.0.0.0 -c-1
```

Abrir `http://localhost:3000/`. En Codespaces, utilizar el puerto reenviado 3000.
`npm start` ejecuta el mismo servidor. La hoja compilada se incluye en el
repositorio, pero debe regenerarse después de modificar HTML o estilos.

## Archivos

- [index.html](./index.html): landing y datos estructurados `Restaurant`.
- [application.html](./application.html): formulario de demostración Brasa Points.
- [validation.js](./validation.js): validación, control de edad y campos dependientes.
- [registro.html](./registro.html): acceso compatible con el enlace anterior al registro.
- [src/styles.css](./src/styles.css): entrada Tailwind, paleta y fuentes locales.
- [tasks.md](./tasks.md): seguimiento; solo se marcan comprobaciones realizadas.
- [Plan.md](./Plan.md): alcance y fases del proyecto.
- [AGENTS.md](./AGENTS.md): instrucciones de diseño y desarrollo.
- [photos.md](./photos.md): fuentes, etiquetas y condiciones de las fotografías.
- [Memoria del proyecto](../../memory-bank/PROJECT_MEMORY.md): estado consolidado.

El menú de navegación permanece visible también en móvil y funciona sin
JavaScript. Los restaurantes se muestran mediante controles nativos `details`.
El CSS base adicional se limita al foco visible, color de controles y
desplazamiento hacia secciones; el diseño utiliza utilidades Tailwind.

## Estado y límites

El usuario aprobó una sección de propuesta gastronómica sin platos ni precios
inventados, el registro de demostración y edad mínima de 18 cumplidos.
No hay backend, pedidos, reservas, almacenamiento ni envío de emails.
El formulario valida los datos sin transmitirlos ni guardarlos. El orden es
nombre, fecha de nacimiento, email, país, ciudad, teléfono, procedencia,
términos y, finalmente, ofertas, restaurante favorito y preferencias.

Nombre y fecha válidos habilitan el resto al pulsar «Continuar». La edad mínima
es 18 años cumplidos; cambiar los datos a una edad no permitida vuelve a bloquear
el formulario. País controla ciudades y prefijo: `+57` para Colombia y `+1` para
Estados Unidos. El teléfono recibe diez dígitos nacionales, con separadores
opcionales, sin repetir el prefijo mostrado. Cambiar país borra el número.
Cambiar país o ciudad elimina cualquier restaurante seleccionado anteriormente.

Ofertas, restaurante y preferencias son opcionales. «Sin restricciones» no se
combina con otras preferencias. Los errores se asocian a sus campos, se anuncian
y el envío lleva el foco al primer error. Sin JavaScript los controles permanecen
bloqueados y se muestra una explicación; no se produce un envío nativo.

La aceptación de términos es únicamente de demostración. El texto oficial sigue
pendiente y no se simula un consentimiento legal real. La confirmación reproduce
el mensaje del briefing como vista previa e indica que no se envían correos
ni se activan beneficios. La página de demostración utiliza `noindex`.

## Verificación del formulario

El 2026-10-21 se comprobó en Chromium: orden y etiquetas, umbral de edad,
fechas futuras y vacías, bloqueo posterior, envíos inválidos y válidos,
restaurantes de las cinco ciudades (14 en total), reinicio de dependencias,
prefijos, consentimiento obligatorio, opcionales y funcionamiento sin JavaScript.
Se verificó ausencia de desbordamientos en 320, 375, 639, 640, 767, 768, 1023,
1024 y 1440 px. Axe no detectó infracciones automáticas WCAG A/AA.

Lighthouse 12.8.2, servidor local HTTP en el puerto 3011, estilos de producción,
Chromium headless y perfiles estándar de Lighthouse, 2026-10-21:

| Página | Perfil | Performance | Accesibilidad | SEO |
| --- | --- | --- | --- | --- |
| `application.html` | Móvil | 100 | 100 | 60 |
| `application.html` | Escritorio | 100 | 100 | 63 |

La puntuación SEO se reduce por la exclusión deliberada de indexación de esta
demostración. Las puntuaciones son mediciones locales, no garantías en producción
ni una certificación de accesibilidad. La revisión manual completa con lector de
pantalla sigue pendiente.

Actualización de la landing con fotografías, 2026-10-21: Lighthouse 12.8.2,
HTTP local puerto 3000, Chromium headless y perfiles estándar obtuvo Performance
98 en móvil y 100 en escritorio. La sección fotográfica no desbordó en los
cinco anchos comprobados y pasó la auditoría automatizada axe.

Para instalar el navegador en este entorno, se utilizó
`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu22.04-x64 npx playwright install chromium`.
El identificador completo resolvió el fallo de instalación anterior.

## Resumen de la entrega — 2026-10-21

Landing, registro validado y fotografías de las tres tarjetas de beneficios
están incorporados y documentados. La asignación final aprobada es Caydesa para
Calidad Consistente, Sip Bite Go para Experiencia Cálida y la imagen facilitada
de Facebook para Rapidez. Los pies visibles son los indicados por el usuario;
los textos alternativos describen el contenido observado.

Toda la aplicación utiliza un único puerto **3000**. El puerto 3011 citado en
las mediciones es histórico y no es necesario para visualizar el formulario.
Las fotos se sirven desde archivos locales, sin depender del enlace firmado
de Facebook. La atribución específica de los permisos originales sigue por
aclarar. No se entregan backend, inscripción legal definitiva, pedidos ni reservas.
