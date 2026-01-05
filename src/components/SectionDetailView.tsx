import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from './StatusBadge'
import { ArrowLeft, Plus, Upload, FileText, Trash, CheckCircle, Warning } from '@phosphor-icons/react'
import type { PerfilSeccion, Perfil, Item, Evidencia } from '@/types'
import { formatDate, formatFileSize, generateId } from '@/lib/helpers'
import { toast } from 'sonner'

interface SectionDetailViewProps {
  seccion: PerfilSeccion
  perfil: Perfil
  onBack: () => void
  onUpdate: (perfil: Perfil) => void
}

export function SectionDetailView({ seccion, perfil, onBack, onUpdate }: SectionDetailViewProps) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<Item>>({
    titulo: '',
    descripcion: '',
    institucion: '',
    fechaInicio: '',
    fechaFin: '',
    datos: {}
  })
  
  const canEdit = seccion.estado === 'BORRADOR' || seccion.estado === 'OBSERVADA'
  const canSubmit = canEdit && seccion.items.length > 0 && seccion.items.every(i => i.evidencias.length > 0)
  
  const handleAddItem = () => {
    if (!newItem.titulo || !newItem.descripcion) {
      toast.error('El título y la descripción son obligatorios')
      return
    }
    
    const item: Item = {
      id: generateId('item'),
      perfilSeccionId: seccion.id,
      titulo: newItem.titulo!,
      descripcion: newItem.descripcion!,
      institucion: newItem.institucion,
      fechaInicio: newItem.fechaInicio,
      fechaFin: newItem.fechaFin,
      datos: newItem.datos || {},
      estado: 'BORRADOR',
      evidencias: [],
      fechaCreacion: new Date().toISOString()
    }
    
    const updatedSeccion = {
      ...seccion,
      items: [...seccion.items, item]
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === seccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    setIsAddingItem(false)
    setNewItem({
      titulo: '',
      descripcion: '',
      institucion: '',
      fechaInicio: '',
      fechaFin: '',
      datos: {}
    })
    toast.success('Elemento agregado correctamente')
  }
  
  const handleFileUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe superar 5 MB')
      return
    }
    
    const evidencia: Evidencia = {
      id: generateId('ev'),
      itemId,
      nombre: file.name,
      tipoArchivo: file.type,
      tamano: file.size,
      rutaArchivo: URL.createObjectURL(file),
      fechaCarga: new Date().toISOString()
    }
    
    const updatedSeccion = {
      ...seccion,
      items: seccion.items.map(item =>
        item.id === itemId
          ? { ...item, evidencias: [...item.evidencias, evidencia] }
          : item
      )
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === seccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    toast.success('Evidencia adjuntada correctamente')
    event.target.value = ''
  }
  
  const handleDeleteItem = (itemId: string) => {
    const updatedSeccion = {
      ...seccion,
      items: seccion.items.filter(item => item.id !== itemId)
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === seccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    toast.success('Elemento eliminado')
  }
  
  const handleSubmitSection = () => {
    const updatedSeccion = {
      ...seccion,
      estado: 'EN_REVISION' as const,
      fechaEnvio: new Date().toISOString()
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === seccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    toast.success('Sección enviada a revisión')
  }
  
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Volver al Perfil
      </Button>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{seccion.seccion.nombre}</CardTitle>
                <CardDescription className="text-base">{seccion.seccion.descripcion}</CardDescription>
              </div>
              <StatusBadge status={seccion.estado} type="section" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {seccion.estado === 'OBSERVADA' && seccion.observaciones && (
              <Alert className="bg-info/10 border-info/20">
                <Warning className="h-4 w-4 text-info" weight="fill" />
                <AlertDescription className="text-info-foreground">
                  <strong>Observaciones del evaluador:</strong> {seccion.observaciones}
                </AlertDescription>
              </Alert>
            )}
            
            {seccion.estado === 'VALIDADA' && (
              <Alert className="bg-success/10 border-success/20">
                <CheckCircle className="h-4 w-4 text-success" weight="fill" />
                <AlertDescription className="text-success-foreground">
                  Esta sección ha sido validada exitosamente. Validado el {formatDate(seccion.fechaValidacion)}
                </AlertDescription>
              </Alert>
            )}
            
            {seccion.estado === 'EN_REVISION' && (
              <Alert className="bg-warning/10 border-warning/20">
                <AlertDescription className="text-warning-foreground">
                  Esta sección se encuentra en proceso de revisión. Enviado el {formatDate(seccion.fechaEnvio)}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                {seccion.items.length} {seccion.items.length === 1 ? 'elemento registrado' : 'elementos registrados'}
              </p>
              <div className="flex gap-2">
                {canEdit && (
                  <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus size={20} className="mr-2" />
                        Agregar Elemento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Nuevo Elemento</DialogTitle>
                        <DialogDescription>
                          Agrega un nuevo elemento a la sección {seccion.seccion.nombre}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="titulo">Título*</Label>
                          <Input
                            id="titulo"
                            value={newItem.titulo}
                            onChange={(e) => setNewItem({ ...newItem, titulo: e.target.value })}
                            placeholder="Ej: Doctorado en Matemáticas"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="descripcion">Descripción*</Label>
                          <Textarea
                            id="descripcion"
                            value={newItem.descripcion}
                            onChange={(e) => setNewItem({ ...newItem, descripcion: e.target.value })}
                            placeholder="Describe brevemente este elemento"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="institucion">Institución</Label>
                          <Input
                            id="institucion"
                            value={newItem.institucion}
                            onChange={(e) => setNewItem({ ...newItem, institucion: e.target.value })}
                            placeholder="Ej: Universidad Nacional Autónoma de México"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                            <Input
                              id="fechaInicio"
                              type="date"
                              value={newItem.fechaInicio}
                              onChange={(e) => setNewItem({ ...newItem, fechaInicio: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fechaFin">Fecha de Fin</Label>
                            <Input
                              id="fechaFin"
                              type="date"
                              value={newItem.fechaFin}
                              onChange={(e) => setNewItem({ ...newItem, fechaFin: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddItem}>
                          Agregar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                
                {canSubmit && (
                  <Button onClick={handleSubmitSection}>
                    Enviar a Revisión
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {seccion.items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay elementos registrados en esta sección. Comienza agregando tu primer elemento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {seccion.items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <CardTitle className="text-xl">{item.titulo}</CardTitle>
                        <StatusBadge status={item.estado} type="item" />
                      </div>
                      <CardDescription>{item.descripcion}</CardDescription>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash size={18} />
                      </Button>
                    )}
                  </div>
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
                  
                  {item.observaciones && (
                    <Alert className="bg-info/10 border-info/20">
                      <Warning className="h-4 w-4 text-info" weight="fill" />
                      <AlertDescription className="text-info-foreground text-sm">
                        <strong>Observación:</strong> {item.observaciones}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Evidencias ({item.evidencias.length})</Label>
                      {canEdit && (
                        <Button variant="outline" size="sm" asChild>
                          <label className="cursor-pointer">
                            <Upload size={16} className="mr-2" />
                            Adjuntar
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(item.id, e)}
                              className="hidden"
                            />
                          </label>
                        </Button>
                      )}
                    </div>
                    
                    {item.evidencias.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {item.evidencias.map((ev) => (
                          <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                            <FileText size={20} className="text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{ev.nombre}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(ev.tamano)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription className="text-sm text-muted-foreground">
                          No hay evidencias adjuntadas. Debes adjuntar al menos un documento.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
