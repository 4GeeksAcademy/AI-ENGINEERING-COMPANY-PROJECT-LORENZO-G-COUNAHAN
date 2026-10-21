# Brasaland — Sitio público

Landing estática en español con HTML semántico y Tailwind CSS compilado.
La paleta y los logotipos proceden del brandbook y de los recursos del proyecto.
Las versiones WebP conservan las proporciones y el contenido de los originales.
No se utilizan fuentes remotas, fotografías de terceros ni CSS CDN.

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
- [registro.html](./registro.html): aviso temporal, **no es un formulario funcional**.
- [src/styles.css](./src/styles.css): entrada Tailwind, paleta y fuentes locales.
- [tasks.md](./tasks.md): seguimiento; solo se marcan comprobaciones realizadas.
- [Plan.md](./Plan.md): alcance y fases del proyecto.

El menú de navegación permanece visible también en móvil y funciona sin
JavaScript. Los restaurantes se muestran mediante controles nativos `details`.
El CSS base adicional se limita al foco visible, color de controles y
desplazamiento hacia secciones; el diseño utiliza utilidades Tailwind.

## Estado y límites

El usuario aprobó una sección de propuesta gastronómica sin platos ni precios
inventados, una futura demostración del registro y edad mínima de 18 cumplidos.
No hay backend, pedidos, reservas, almacenamiento ni envío de emails.
El formulario con validaciones aún no está implementado.

La política de contenido impidió crear el script de navegación; se optó por
navegación HTML sin script, sin intentar acceder al archivo restringido.
La instalación del navegador de validación falló por incompatibilidad del
entorno. Las comprobaciones visuales, de tecnología de asistencia y las
mediciones Lighthouse/PageSpeed quedan pendientes; no se afirma una puntuación.

## Verificación pendiente

Comprobar móvil, tablet y escritorio, teclado, contraste y todos los enlaces.
La auditoría de rendimiento debe evaluar móvil y escritorio: mínimo superior
a 80, objetivo de al menos 90, registrando fecha, herramienta y condiciones.
Las dependencias Playwright, axe y Lighthouse quedan disponibles para esa
verificación cuando exista un navegador compatible.
