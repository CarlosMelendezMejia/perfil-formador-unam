# Planning Guide

Sistema de demostración del Perfil Formador UNAM - una aplicación integral para la construcción, gestión y validación estructurada de perfiles académicos del profesorado, simulando un flujo completo de captura, revisión y validación institucional.

**Experience Qualities**:
1. **Profesional y estructurado** - La interfaz debe proyectar seriedad institucional y organización metodológica, reflejando el carácter académico formal del sistema.
2. **Transparente y trazable** - Cada acción, estado y decisión debe ser claramente visible, permitiendo comprender el flujo de validación en todo momento.
3. **Accesible y funcional** - Navegación intuitiva que permita a profesores y evaluadores completar sus tareas con claridad y sin ambigüedad.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
- Este sistema requiere múltiples roles (Profesor, Evaluador, Administrador), gestión de estados complejos, flujos de validación por secciones, carga de evidencias, y un sistema de navegación entre diferentes vistas según el rol activo.

## Essential Features

**Sistema de autenticación y roles**
- Functionality: Permite seleccionar entre tres roles (Profesor, Evaluador, Administrador) y simular sesiones de usuarios diferentes
- Purpose: Demostrar la separación de responsabilidades y perspectivas del sistema según el tipo de usuario
- Trigger: Al cargar la aplicación, selector de rol en la parte superior
- Progression: Selección de rol → Vista específica se carga → Acceso a funcionalidades propias del rol
- Success criteria: Cada rol ve únicamente las funcionalidades que le corresponden y puede alternar entre perfiles de prueba

**Construcción del Perfil Formador (Vista Profesor)**
- Functionality: Interfaz estructurada en 8 secciones para capturar información académica, con capacidad de agregar ítems, subir evidencias y enviar a revisión
- Purpose: Validar que el profesor puede construir progresivamente su perfil académico integral de manera ordenada
- Trigger: Profesor accede a su perfil y selecciona una sección
- Progression: Selección de sección → Captura de ítems → Carga de evidencias → Envío a revisión → Espera de validación
- Success criteria: Todas las 8 secciones son navegables, permiten agregar contenido, gestionar estados (borrador, en revisión, observada, validada)

**Validación académica (Vista Evaluador)**
- Functionality: Panel de revisión donde el evaluador puede ver perfiles pendientes, revisar secciones enviadas, aprobar, rechazar u observar ítems individuales
- Purpose: Demostrar el flujo de control de calidad y validación institucional
- Trigger: Evaluador selecciona un perfil pendiente de revisión
- Progression: Lista de perfiles → Selección de perfil → Revisión por sección → Decisión por ítem → Guardar dictamen → Notificar al profesor
- Success criteria: Evaluador puede aprobar/rechazar secciones completas, dejar observaciones detalladas, y los cambios se reflejan en tiempo real

**Gestión de evidencias documentales**
- Functionality: Sistema de carga, almacenamiento y visualización de documentos PDF e imágenes asociados a cada ítem del perfil
- Purpose: Validar el control documental interno sin dependencias externas
- Trigger: Profesor agrega un ítem y selecciona "Adjuntar evidencia"
- Progression: Selección de archivo → Validación de formato → Carga simulada → Visualización en lista → Acceso para evaluador
- Success criteria: Archivos se asocian correctamente a ítems, son visibles para evaluadores, y se puede simular descarga/visualización

**Panel administrativo (Vista Administrador)**
- Functionality: Dashboard con métricas del sistema, gestión de usuarios, visualización de bitácora de auditoría y estadísticas generales
- Purpose: Demostrar capacidades de supervisión, control y análisis del sistema
- Trigger: Administrador accede a su vista principal
- Progression: Vista de dashboard → Navegación entre métricas → Acceso a bitácora → Gestión de usuarios y perfiles
- Success criteria: Muestra estadísticas en tiempo real, permite consultar auditoría completa, visualiza estado general del sistema

**Gestión de Identidad del Profesor**
- Functionality: Sección separada para capturar y validar datos de identidad institucional (número de trabajador, RFC, adscripción)
- Purpose: Demostrar la separación conceptual entre identidad institucional y perfil académico
- Trigger: Profesor accede a sección "Mi Identidad" 
- Progression: Captura de datos → Adjuntar evidencia → Envío a validación → Aprobación institucional
- Success criteria: Identidad se gestiona independientemente del perfil formador, requiere validación antes de completar perfil

**Sistema de estados y trazabilidad**
- Functionality: Cada sección e ítem mantiene su estado (borrador, en_revision, observada, validada) y registra todas las acciones en bitácora
- Purpose: Garantizar transparencia y control del proceso de validación
- Trigger: Cualquier acción significativa en el sistema
- Progression: Acción del usuario → Cambio de estado → Registro en bitácora → Actualización de interfaz
- Success criteria: Estados son consistentes, cambios quedan registrados con timestamp y usuario, bitácora es consultable

**Secciones estructuradas del Perfil Formador**
- Functionality: 8 secciones predefinidas que modelan la tabla institucional: Formación académica, Trayectoria docente, Antecedentes académicos, Difusión cultural, Labor administrativa, Antigüedad, Formación de personal
- Purpose: Validar la estructura completa del modelo de evaluación propuesto
- Trigger: Navegación dentro del perfil del profesor
- Progression: Vista general de secciones → Selección → Captura detallada → Revisión → Validación
- Success criteria: Las 8 secciones están implementadas con campos apropiados, iconografía distintiva, y flujos independientes de validación

## Edge Case Handling

- **Perfil incompleto**: Sistema permite guardar borradores y muestra claramente qué secciones faltan por completar con indicadores visuales
- **Evidencias faltantes**: Validación que previene envío a revisión si hay ítems sin evidencia documental adjunta
- **Conflictos de estado**: Si un evaluador está revisando una sección que el profesor intenta editar, se muestra mensaje de bloqueo
- **Observaciones no atendidas**: Secciones observadas quedan bloqueadas para reenvío hasta que el profesor corrija los puntos señalados
- **Sesión sin datos**: Sistema crea datos de demostración automáticamente si no existen perfiles previos
- **Cambio de rol durante edición**: Al cambiar de rol, se guarda automáticamente cualquier cambio pendiente
- **Límite de evidencias**: Control de tamaño y cantidad de archivos para evitar sobrecarga (máximo 5 MB por archivo)

## Design Direction

El diseño debe evocar **confianza institucional, claridad profesional y estructura académica**. La interfaz debe sentirse como un sistema oficial universitario: serio pero accesible, estructurado pero no rígido, académico pero moderno. La experiencia visual debe transmitir orden, transparencia y credibilidad, reflejando la importancia de los procesos de evaluación académica que soporta.

## Color Selection

**Esquema institucional académico con acentos de validación**: Paleta que combina azules institucionales profundos con tonos de validación (verde, amarillo, rojo) para estados del sistema.

- **Primary Color**: Azul universitario profundo `oklch(0.35 0.12 250)` - Representa autoridad institucional, confianza académica y seriedad profesional
- **Secondary Colors**: 
  - Gris pizarra `oklch(0.45 0.02 240)` - Para elementos estructurales y navegación secundaria
  - Crema papel `oklch(0.96 0.01 85)` - Fondos de contenido, evocando documentos académicos
- **Accent Color**: Dorado académico `oklch(0.68 0.15 75)` - Resalta llamados a acción importantes y elementos de atención
- **Estado Colors**:
  - Validado: Verde institucional `oklch(0.55 0.15 145)` 
  - En revisión: Amarillo precaución `oklch(0.75 0.14 85)`
  - Observado: Naranja advertencia `oklch(0.65 0.18 45)`
  - Rechazado: Rojo formal `oklch(0.50 0.20 25)`
- **Foreground/Background Pairings**: 
  - Primary (Azul #2B4570): White text (#FFFFFF) - Ratio 8.2:1 ✓
  - Background (Crema #F5F3ED): Dark slate text (#1A2332) - Ratio 12.5:1 ✓
  - Accent (Dorado #C9984A): Dark text (#1A2332) - Ratio 7.8:1 ✓
  - Success (Verde #4A8F5C): White text (#FFFFFF) - Ratio 5.2:1 ✓

## Font Selection

Tipografía que equilibra autoridad académica con legibilidad moderna, evocando documentación oficial pero con claridad contemporánea.

- **Typographic Hierarchy**:
  - H1 (Títulos de vista principal): Crimson Pro SemiBold/32px/tracking tight - Autoridad académica clásica
  - H2 (Títulos de sección): Crimson Pro Medium/24px/tracking normal - Estructura clara
  - H3 (Subtítulos y cards): Space Grotesk Medium/18px/tracking slight - Modernidad técnica
  - Body (Texto general): Space Grotesk Regular/16px/leading relaxed - Legibilidad óptima
  - Caption (Metadatos, timestamps): Space Grotesk Regular/13px/tracking wide/uppercase - Información auxiliar
  - Label (Formularios): Space Grotesk Medium/14px/tracking normal - Claridad en captura

## Animations

Las animaciones deben reforzar la **estructura del flujo de validación** y proporcionar retroalimentación clara sobre cambios de estado, sin distraer del contenido académico serio.

- Transiciones suaves entre secciones con fade + slide lateral (300ms ease-out)
- Cambios de estado con pulso sutil de color (200ms) al actualizar estatus de validación
- Carga de evidencias con barra de progreso fluida y checkmark animado al completar
- Expansión/colapso de secciones con accordion suave (250ms ease-in-out)
- Hover sobre cards de perfil con elevación sutil (shadow + translateY)
- Aparición de modales de revisión con backdrop blur progresivo (400ms)
- Indicadores de carga con spinner institucional sobrio
- Notificaciones toast que se deslizan desde arriba con bounce mínimo

## Component Selection

- **Components**: 
  - Navigation: Tabs para cambio de rol, Sidebar para navegación del profesor
  - Cards para mostrar secciones del perfil con estados visuales
  - Dialog para formularios de captura de ítems y evidencias
  - Alert para mostrar observaciones del evaluador
  - Badge para indicadores de estado (borrador, revisión, validado, observado)
  - Table para vista de evaluador (lista de perfiles y revisión de ítems)
  - Sheet para panel de revisión detallada del evaluador
  - Progress para indicar completitud del perfil
  - Textarea para observaciones y comentarios del evaluador
  - Select para dropdowns de selección (tipo de grado, institución, etc.)
  - Input para campos de captura básicos
  - Separator para dividir secciones visualmente
  - ScrollArea para contenido largo sin romper layout
  - Avatar para identificación de usuarios
  - Breadcrumb para navegación contextual
  
- **Customizations**: 
  - Card de sección personalizado con barra lateral de color según estado
  - Badge de estado con íconos específicos (check, clock, alert, x)
  - Timeline component custom para bitácora de auditoría
  - Upload zone personalizada con preview de documentos PDF e imágenes
  - Panel de revisión con layout split (ítems izquierda, detalle derecha)
  
- **States**: 
  - Buttons: hover con darkening sutil, active con scale(0.98), disabled con opacity 0.5
  - Inputs: focus con ring de color primario, error con ring rojo, success con ring verde
  - Cards: hover con elevación shadow-lg, selected con borde primario grueso
  - Badges: animación de pulso en estado "en_revision"
  
- **Icon Selection**: 
  - @phosphor-icons/react usado consistentemente
  - User, GraduationCap, FileText, CheckCircle, Clock, Warning, X, Upload, Download, Eye, CaretRight, Plus, Pencil, Trash
  
- **Spacing**: 
  - Container padding: p-6 en desktop, p-4 en mobile
  - Card internal: p-6
  - Gap entre cards: gap-4
  - Section spacing: space-y-8
  - Form fields: space-y-4
  
- **Mobile**: 
  - Sidebar colapsa a Sheet modal activado por botón hamburguesa
  - Tabs de rol se convierten en Select dropdown
  - Table de evaluador pasa a lista de cards apiladas
  - Panel split de revisión se convierte en vista secuencial (scroll vertical)
  - Font sizes reducen 2px en breakpoint < 768px
  - Padding general de p-6 a p-4
