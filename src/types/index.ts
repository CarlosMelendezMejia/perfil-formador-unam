export type Role = 'PROFESOR' | 'EVALUADOR' | 'ADMINISTRADOR'

export type SectionStatus = 'BORRADOR' | 'EN_REVISION' | 'OBSERVADA' | 'VALIDADA'

export type ItemStatus = 'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO' | 'OBSERVADO'

export type IdentityStatus = 'PENDIENTE' | 'EN_REVISION' | 'VALIDADA' | 'RECHAZADA'

export interface Usuario {
  id: string
  nombre: string
  email: string
  numeroTrabajador?: string
  rol: Role
  avatarUrl?: string
}

export interface ProfesorIdentidad {
  id: string
  usuarioId: string
  numeroTrabajador: string
  rfc: string
  adscripcion: string
  areaDisciplinar: string
  estado: IdentityStatus
  observaciones?: string
  evidencias: IdentityEvidence[]
  fechaCreacion: string
  fechaActualizacion: string
}

export interface IdentityEvidence {
  id: string
  nombre: string
  tipo: string
  url: string
  fechaCarga: string
}

export interface Perfil {
  id: string
  usuarioId: string
  usuario: Usuario
  fechaCreacion: string
  fechaActualizacion: string
  secciones: PerfilSeccion[]
  identidad?: ProfesorIdentidad
}

export interface Seccion {
  id: string
  nombre: string
  descripcion: string
  orden: number
  icono: string
}

export interface PerfilSeccion {
  id: string
  perfilId: string
  seccionId: string
  seccion: Seccion
  estado: SectionStatus
  items: Item[]
  observaciones?: string
  fechaEnvio?: string
  fechaValidacion?: string
}

export interface Item {
  id: string
  perfilSeccionId: string
  titulo: string
  descripcion: string
  institucion?: string
  fechaInicio?: string
  fechaFin?: string
  datos: Record<string, any>
  estado: ItemStatus
  evidencias: Evidencia[]
  observaciones?: string
  fechaCreacion: string
}

export interface Evidencia {
  id: string
  itemId: string
  nombre: string
  tipoArchivo: string
  tamano: number
  rutaArchivo: string
  fechaCarga: string
}

export interface Revision {
  id: string
  perfilId: string
  evaluadorId: string
  evaluador: Usuario
  estado: 'ABIERTA' | 'CERRADA'
  fechaApertura: string
  fechaCierre?: string
  items: RevisionItem[]
}

export interface RevisionItem {
  id: string
  revisionId: string
  itemId: string
  item: Item
  decision: 'APROBADO' | 'RECHAZADO' | 'OBSERVADO' | null
  observaciones?: string
  fechaDecision?: string
}

export interface AuditLog {
  id: string
  usuarioId: string
  usuario: Usuario
  accion: string
  entidad: string
  entidadId: string
  detalles: Record<string, any>
  fecha: string
}

export interface DashboardStats {
  totalProfesores: number
  totalPerfiles: number
  perfilesCompletos: number
  perfilesPendientes: number
  seccionesValidadas: number
  seccionesObservadas: number
  revisionesAbiertas: number
  revisionesCerradas: number
}
