import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { StatusBadge } from './StatusBadge'
import { CheckCircle, XCircle, Warning, FileText } from '@phosphor-icons/react'
import type { Perfil, PerfilSeccion, Item } from '@/types'
import { formatDate, formatFileSize } from '@/lib/helpers'
import { toast } from 'sonner'

interface ReviewPanelProps {
  perfil: Perfil
  onUpdate: (perfil: Perfil) => void
  onClose: () => void
}

export function ReviewPanel({ perfil, onUpdate, onClose }: ReviewPanelProps) {
  const [selectedSeccion, setSelectedSeccion] = useState<PerfilSeccion | null>(null)
  const [itemDecisions, setItemDecisions] = useState<Record<string, { decision: 'APROBADO' | 'RECHAZADO' | 'OBSERVADO', observaciones?: string }>>({})
  const [seccionObservaciones, setSeccionObservaciones] = useState('')
  
  const seccionesRevisables = perfil.secciones.filter(s => s.estado === 'EN_REVISION')
  
  const handleItemDecision = (itemId: string, decision: 'APROBADO' | 'RECHAZADO' | 'OBSERVADO') => {
    setItemDecisions(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], decision }
    }))
  }
  
  const handleItemObservacion = (itemId: string, observaciones: string) => {
    setItemDecisions(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], observaciones }
    }))
  }
  
  const handleApproveSection = () => {
    if (!selectedSeccion) return
    
    const allItems = selectedSeccion.items
    const allApproved = allItems.every(item => itemDecisions[item.id]?.decision === 'APROBADO')
    
    if (!allApproved) {
      toast.error('Todos los elementos deben estar aprobados para validar la sección')
      return
    }
    
    const updatedSeccion: PerfilSeccion = {
      ...selectedSeccion,
      estado: 'VALIDADA',
      items: selectedSeccion.items.map(item => ({
        ...item,
        estado: 'APROBADO'
      })),
      fechaValidacion: new Date().toISOString()
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === selectedSeccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    setSelectedSeccion(null)
    setItemDecisions({})
    toast.success('Sección validada exitosamente')
  }
  
  const handleRejectSection = () => {
    if (!selectedSeccion) return
    
    const someObserved = Object.values(itemDecisions).some(d => d.decision === 'OBSERVADO' || d.decision === 'RECHAZADO')
    
    if (!someObserved || !seccionObservaciones.trim()) {
      toast.error('Debes indicar observaciones para devolver la sección')
      return
    }
    
    const updatedSeccion: PerfilSeccion = {
      ...selectedSeccion,
      estado: 'OBSERVADA',
      items: selectedSeccion.items.map(item => ({
        ...item,
        estado: itemDecisions[item.id]?.decision || 'EN_REVISION',
        observaciones: itemDecisions[item.id]?.observaciones
      })),
      observaciones: seccionObservaciones
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === selectedSeccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    setSelectedSeccion(null)
    setItemDecisions({})
    setSeccionObservaciones('')
    toast.success('Sección devuelta con observaciones')
  }
  
  if (selectedSeccion) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">{selectedSeccion.seccion.nombre}</h3>
            <p className="text-sm text-muted-foreground">{selectedSeccion.seccion.descripcion}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedSeccion(null)}>
            Volver
          </Button>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          {selectedSeccion.items.map((item) => {
            const currentDecision = itemDecisions[item.id]
            
            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{item.titulo}</CardTitle>
                    <StatusBadge status={item.estado} type="item" />
                  </div>
                  <CardDescription>{item.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.institucion && (
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">Institución</Label>
                      <p className="text-sm mt-1">{item.institucion}</p>
                    </div>
                  )}
                  
                  {(item.fechaInicio || item.fechaFin) && (
                    <div className="grid grid-cols-2 gap-4">
                      {item.fechaInicio && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Fecha Inicio</Label>
                          <p className="text-sm mt-1">{formatDate(item.fechaInicio)}</p>
                        </div>
                      )}
                      {item.fechaFin && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Fecha Fin</Label>
                          <p className="text-sm mt-1">{formatDate(item.fechaFin)}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-sm mb-2 block">Evidencias ({item.evidencias.length})</Label>
                    {item.evidencias.length > 0 ? (
                      <div className="space-y-2">
                        {item.evidencias.map((ev) => (
                          <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/30">
                            <FileText size={18} className="text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{ev.nombre}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(ev.tamano)} • {formatDate(ev.fechaCarga)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription className="text-sm">
                          Sin evidencias adjuntadas
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-sm">Decisión de Evaluación</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={currentDecision?.decision === 'APROBADO' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleItemDecision(item.id, 'APROBADO')}
                        className={currentDecision?.decision === 'APROBADO' ? 'bg-success hover:bg-success/90' : ''}
                      >
                        <CheckCircle size={16} className="mr-1.5" weight="fill" />
                        Aprobar
                      </Button>
                      <Button
                        variant={currentDecision?.decision === 'OBSERVADO' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleItemDecision(item.id, 'OBSERVADO')}
                        className={currentDecision?.decision === 'OBSERVADO' ? 'bg-info hover:bg-info/90' : ''}
                      >
                        <Warning size={16} className="mr-1.5" weight="fill" />
                        Observar
                      </Button>
                      <Button
                        variant={currentDecision?.decision === 'RECHAZADO' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleItemDecision(item.id, 'RECHAZADO')}
                        className={currentDecision?.decision === 'RECHAZADO' ? 'bg-destructive hover:bg-destructive/90' : ''}
                      >
                        <XCircle size={16} className="mr-1.5" weight="fill" />
                        Rechazar
                      </Button>
                    </div>
                    
                    {(currentDecision?.decision === 'OBSERVADO' || currentDecision?.decision === 'RECHAZADO') && (
                      <Textarea
                        placeholder="Indica las observaciones o razones del rechazo..."
                        value={currentDecision?.observaciones || ''}
                        onChange={(e) => handleItemObservacion(item.id, e.target.value)}
                        rows={3}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observaciones Generales de la Sección</CardTitle>
            <CardDescription>
              Comentarios adicionales para el profesor sobre esta sección
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Escribe observaciones generales (opcional para aprobación, obligatorio para rechazo)..."
              value={seccionObservaciones}
              onChange={(e) => setSeccionObservaciones(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background pb-6">
          <Button
            variant="outline"
            onClick={handleRejectSection}
          >
            Devolver con Observaciones
          </Button>
          <Button
            onClick={handleApproveSection}
            className="bg-success hover:bg-success/90"
          >
            <CheckCircle size={18} className="mr-2" weight="fill" />
            Validar Sección
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {seccionesRevisables.length === 0 ? (
        <Alert>
          <AlertDescription>
            No hay secciones pendientes de revisión en este perfil.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2">Secciones en Revisión</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selecciona una sección para comenzar la evaluación detallada
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {seccionesRevisables.map((seccion) => (
              <AccordionItem key={seccion.id} value={seccion.id} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <p className="font-semibold">{seccion.seccion.nombre}</p>
                      <p className="text-sm text-muted-foreground">{seccion.items.length} elementos</p>
                    </div>
                    <StatusBadge status={seccion.estado} type="section" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{seccion.seccion.descripcion}</p>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-muted-foreground">
                        Enviado el {formatDate(seccion.fechaEnvio)}
                      </p>
                      <Button onClick={() => setSelectedSeccion(seccion)}>
                        Revisar Sección
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Resumen del Perfil</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Secciones</p>
              <p className="text-2xl font-semibold">{perfil.secciones.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Elementos</p>
              <p className="text-2xl font-semibold">
                {perfil.secciones.reduce((acc, s) => acc + (s.items?.length || 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
