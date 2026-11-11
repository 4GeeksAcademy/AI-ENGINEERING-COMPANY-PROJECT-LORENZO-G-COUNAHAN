# Carpeta `uis`

Esta carpeta contiene **todos los proyectos con interfaz de usuario** para el proyecto transversal de AI Engineering de la compañía — por ejemplo: un sitio web público, un frontend de panel de administración, una interfaz de ecommerce, portales para clientes, aplicaciones Streamlit/Gradio u otras herramientas sólo-frontend.

## Aplicación implementada — 2026-10-21

[landingpage](./landingpage/README.md) contiene la web pública de Brasaland:
landing responsive en español, identidad del brandbook, fotografías locales
con autorización declarada por el usuario, Schema.org `Restaurant` y formulario
demostrativo Brasa Points. El formulario valida edad (18 cumplidos), contacto,
ubicaciones dependientes y consentimiento, sin guardar ni enviar datos.

Desde la raíz: `cd uis/landingpage`, `npm ci`, `npm run build` y `npm start`.
La landing y el formulario comparten el puerto **3000**, en `/` y
`/application.html`. Consulta [plan](./landingpage/Plan.md) y
[tareas](./landingpage/tasks.md) para alcance, verificaciones y pendientes
de términos oficiales y accesibilidad manual.

Las áreas de aplicación sugeridas por la plantilla son:

- **`website`** — la presencia web pública de la compañía.
- **`backoffice`** — la aplicación interna de administración. Es el lugar ideal para desarrollar múltiples soluciones dentro de un mismo proyecto: autenticación, gestión de personas, gestión de operaciones, comunicación interna y otras capacidades de back-office.

Organiza `uis/` por **distintas áreas de la compañía** — cada subcarpeta agrupa un ámbito diferente (por ejemplo, web pública frente a operaciones internas) e incluye su propia documentación técnica y funcional.

- **Propósito principal**: centralizar en un único lugar todas las aplicaciones frontend que dan soporte a los casos de uso de la compañía.
- **Recomendación**: documenta en este archivo (o en sub-READMEs) las aplicaciones que vayas añadiendo, su objetivo, tecnología usada y cómo ejecutarlas.

> _These instructions are also available in [English](./README.md)._
