import type { Seccion } from '@/types'

export const SECCIONES_PERFIL: Seccion[] = [
  {
    id: 'sec-1',
    nombre: 'Identidad Académica',
    descripcion: 'Datos institucionales y de identificación del profesor',
    orden: 1,
    icono: 'User'
  },
  {
    id: 'sec-2',
    nombre: 'Formación Académica',
    descripcion: 'Grados académicos, estudios formales y cursos de actualización',
    orden: 2,
    icono: 'GraduationCap'
  },
  {
    id: 'sec-3',
    nombre: 'Trayectoria Docente',
    descripcion: 'Experiencia en docencia, dirección de tesis y proyectos académicos',
    orden: 3,
    icono: 'Chalkboard'
  },
  {
    id: 'sec-4',
    nombre: 'Investigación y Producción',
    descripcion: 'Proyectos de investigación, publicaciones y producción académica',
    orden: 4,
    icono: 'FlaskConical'
  },
  {
    id: 'sec-5',
    nombre: 'Antecedentes Profesionales',
    descripcion: 'Experiencia profesional y ejercicio relacionado con el área de conocimiento',
    orden: 5,
    icono: 'Briefcase'
  },
  {
    id: 'sec-6',
    nombre: 'Difusión Cultural',
    descripcion: 'Conferencias, ponencias, seminarios y actividades de divulgación',
    orden: 6,
    icono: 'Microphone'
  },
  {
    id: 'sec-7',
    nombre: 'Labor Administrativa',
    descripcion: 'Cargos académico-administrativos y comisiones institucionales',
    orden: 7,
    icono: 'Building'
  },
  {
    id: 'sec-8',
    nombre: 'Antigüedad Institucional',
    descripcion: 'Tiempo de servicio en la institución',
    orden: 8,
    icono: 'Clock'
  }
]

export const SECTION_STATUS_CONFIG = {
  BORRADOR: {
    label: 'Borrador',
    color: 'bg-muted text-muted-foreground',
    icon: 'FileText'
  },
  EN_REVISION: {
    label: 'En Revisión',
    color: 'bg-warning text-warning-foreground',
    icon: 'Clock'
  },
  OBSERVADA: {
    label: 'Observada',
    color: 'bg-info text-info-foreground',
    icon: 'Warning'
  },
  VALIDADA: {
    label: 'Validada',
    color: 'bg-success text-success-foreground',
    icon: 'CheckCircle'
  }
}

export const ITEM_STATUS_CONFIG = {
  BORRADOR: {
    label: 'Borrador',
    color: 'bg-muted text-muted-foreground',
    icon: 'FileText'
  },
  EN_REVISION: {
    label: 'En Revisión',
    color: 'bg-warning text-warning-foreground',
    icon: 'Clock'
  },
  APROBADO: {
    label: 'Aprobado',
    color: 'bg-success text-success-foreground',
    icon: 'CheckCircle'
  },
  RECHAZADO: {
    label: 'Rechazado',
    color: 'bg-destructive text-destructive-foreground',
    icon: 'X'
  },
  OBSERVADO: {
    label: 'Observado',
    color: 'bg-info text-info-foreground',
    icon: 'Warning'
  }
}

export const IDENTITY_STATUS_CONFIG = {
  PENDIENTE: {
    label: 'Pendiente',
    color: 'bg-muted text-muted-foreground',
    icon: 'FileText'
  },
  EN_REVISION: {
    label: 'En Revisión',
    color: 'bg-warning text-warning-foreground',
    icon: 'Clock'
  },
  VALIDADA: {
    label: 'Validada',
    color: 'bg-success text-success-foreground',
    icon: 'CheckCircle'
  },
  RECHAZADA: {
    label: 'Rechazada',
    color: 'bg-destructive text-destructive-foreground',
    icon: 'X'
  }
}
