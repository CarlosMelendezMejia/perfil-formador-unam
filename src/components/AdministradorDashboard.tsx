import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, GraduationCap, CheckCircle, Clock, FileText, ChartLine } from '@phosphor-icons/react'
import type { Perfil, AuditLog } from '@/types'
import { formatDateTime } from '@/lib/helpers'

interface AdministradorDashboardProps {
  perfiles: Perfil[]
  auditLogs: AuditLog[]
}

export function AdministradorDashboard({ perfiles, auditLogs }: AdministradorDashboardProps) {
  const totalProfesores = perfiles.length
  const totalPerfiles = perfiles.length
  const totalSecciones = perfiles.reduce((acc, p) => acc + p.secciones.length, 0)
  const totalItems = perfiles.reduce((acc, p) => 
    acc + p.secciones.reduce((acc2, s) => acc2 + (s.items?.length || 0), 0), 0
  )
  
  const seccionesValidadas = perfiles.reduce((acc, p) => 
    acc + p.secciones.filter(s => s.estado === 'VALIDADA').length, 0
  )
  
  const seccionesEnRevision = perfiles.reduce((acc, p) => 
    acc + p.secciones.filter(s => s.estado === 'EN_REVISION').length, 0
  )
  
  const seccionesObservadas = perfiles.reduce((acc, p) => 
    acc + p.secciones.filter(s => s.estado === 'OBSERVADA').length, 0
  )
  
  const seccionesBorrador = perfiles.reduce((acc, p) => 
    acc + p.secciones.filter(s => s.estado === 'BORRADOR').length, 0
  )
  
  const identidadesValidadas = perfiles.filter(p => p.identidad?.estado === 'VALIDADA').length
  const identidadesPendientes = perfiles.filter(p => !p.identidad || p.identidad.estado === 'PENDIENTE' || p.identidad.estado === 'EN_REVISION').length
  
  const perfilesCompletos = perfiles.filter(p => {
    const todasValidadas = p.secciones.every(s => s.estado === 'VALIDADA')
    const identidadValidada = p.identidad?.estado === 'VALIDADA'
    return todasValidadas && identidadValidada
  }).length
  
  const recentLogs = auditLogs.slice(0, 15)
  
  const ACCION_CONFIG: Record<string, { label: string; color: string }> = {
    CREAR_ITEM: { label: 'Crear Elemento', color: 'bg-blue-100 text-blue-800' },
    ACTUALIZAR_ITEM: { label: 'Actualizar Elemento', color: 'bg-blue-100 text-blue-800' },
    ELIMINAR_ITEM: { label: 'Eliminar Elemento', color: 'bg-red-100 text-red-800' },
    CARGAR_EVIDENCIA: { label: 'Cargar Evidencia', color: 'bg-green-100 text-green-800' },
    ENVIAR_SECCION: { label: 'Enviar Sección', color: 'bg-purple-100 text-purple-800' },
    APROBAR_ITEM: { label: 'Aprobar', color: 'bg-success/20 text-success' },
    RECHAZAR_ITEM: { label: 'Rechazar', color: 'bg-destructive/20 text-destructive' },
    OBSERVAR_ITEM: { label: 'Observar', color: 'bg-warning/20 text-warning' },
    VALIDAR_SECCION: { label: 'Validar Sección', color: 'bg-success/20 text-success' },
    ACTUALIZAR_IDENTIDAD: { label: 'Actualizar Identidad', color: 'bg-blue-100 text-blue-800' },
    VALIDAR_IDENTIDAD: { label: 'Validar Identidad', color: 'bg-success/20 text-success' }
  }
  
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Panel Administrativo</h1>
        <p className="text-muted-foreground">
          Supervisión y análisis del sistema de perfiles académicos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Total Profesores</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-3xl">{totalProfesores}</CardTitle>
              <User className="text-primary" size={24} weight="fill" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {perfilesCompletos} con perfil completo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Total Elementos</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-3xl">{totalItems}</CardTitle>
              <FileText className="text-accent" size={24} weight="fill" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              En {totalSecciones} secciones
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Secciones Validadas</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-3xl">{seccionesValidadas}</CardTitle>
              <CheckCircle className="text-success" size={24} weight="fill" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {Math.round((seccionesValidadas / totalSecciones) * 100)}% del total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">En Revisión</CardDescription>
            <div className="flex items-baseline gap-2">
              <CardTitle className="text-3xl">{seccionesEnRevision}</CardTitle>
              <Clock className="text-warning" size={24} weight="fill" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pendientes de evaluación
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Estado de Secciones</CardTitle>
            <CardDescription>Distribución por estado de validación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-sm">Validadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{seccionesValidadas}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((seccionesValidadas / totalSecciones) * 100)}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-sm">En Revisión</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{seccionesEnRevision}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((seccionesEnRevision / totalSecciones) * 100)}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-info"></div>
                  <span className="text-sm">Observadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{seccionesObservadas}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((seccionesObservadas / totalSecciones) * 100)}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                  <span className="text-sm">Borrador</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{seccionesBorrador}</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((seccionesBorrador / totalSecciones) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Estado de Identidades</CardTitle>
            <CardDescription>Validación de datos institucionales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-success" size={20} weight="fill" />
                  <span className="text-sm">Identidades Validadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{identidadesValidadas}</span>
                  <span className="text-xs text-muted-foreground">
                    de {totalProfesores}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-warning" size={20} weight="fill" />
                  <span className="text-sm">Pendientes de Validar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{identidadesPendientes}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Las identidades validadas permiten al profesor completar su perfil académico para procesos de evaluación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ChartLine size={24} className="text-primary" weight="duotone" />
            <div>
              <CardTitle className="text-xl">Bitácora de Auditoría</CardTitle>
              <CardDescription>Registro de actividad reciente del sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Fecha/Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log) => {
                  const config = ACCION_CONFIG[log.accion] || { label: log.accion, color: 'bg-muted text-foreground' }
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(log.fecha)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{log.usuario.nombre}</p>
                          <p className="text-xs text-muted-foreground">{log.usuario.rol}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={config.color}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.detalles.seccion && <span className="font-medium">{log.detalles.seccion}</span>}
                        {log.detalles.titulo && <span> • {log.detalles.titulo}</span>}
                        {log.detalles.archivo && <span> • {log.detalles.archivo}</span>}
                        {log.detalles.decision && <span> • {log.detalles.decision}</span>}
                        {log.detalles.profesor && <span> • {log.detalles.profesor}</span>}
                        {log.detalles.items !== undefined && <span> • {log.detalles.items} elementos</span>}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
