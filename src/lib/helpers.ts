export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || ''
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function calculateProfileCompleteness(secciones: any[]): number {
  const totalSecciones = secciones.length
  const seccionesConDatos = secciones.filter(s => s.items && s.items.length > 0).length
  return Math.round((seccionesConDatos / totalSecciones) * 100)
}

export function getSectionProgress(seccion: any): { total: number; validados: number; pendientes: number; observados: number } {
  const items = seccion.items || []
  return {
    total: items.length,
    validados: items.filter((i: any) => i.estado === 'APROBADO').length,
    pendientes: items.filter((i: any) => i.estado === 'BORRADOR' || i.estado === 'EN_REVISION').length,
    observados: items.filter((i: any) => i.estado === 'OBSERVADO' || i.estado === 'RECHAZADO').length
  }
}
