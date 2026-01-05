import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from './StatusBadge'
import { ArrowLeft, Plus, Upload, FileText, Trash, CheckCircle, Warning, X, Pencil, DownloadSimple } from '@phosphor-icons/react'
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
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [dragActive, setDragActive] = useState<string | null>(null)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  
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
  
  const resetForm = () => {
    setNewItem({
      titulo: '',
      descripcion: '',
      institucion: '',
      fechaInicio: '',
      fechaFin: '',
      datos: {}
    })
    setEditingItem(null)
  }

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item)
    setNewItem({
      titulo: item.titulo,
      descripcion: item.descripcion,
      institucion: item.institucion,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      datos: item.datos
    })
    setIsAddingItem(true)
  }

  const handleAddItem = () => {
    if (!newItem.titulo || !newItem.descripcion) {
      toast.error('El título y la descripción son obligatorios')
      return
    }
    
    if (editingItem) {
      const updatedItem: Item = {
        ...editingItem,
        titulo: newItem.titulo!,
        descripcion: newItem.descripcion!,
        institucion: newItem.institucion,
        fechaInicio: newItem.fechaInicio,
        fechaFin: newItem.fechaFin,
        datos: newItem.datos || {}
      }
      
      const updatedSeccion = {
        ...seccion,
        items: seccion.items.map(item => item.id === editingItem.id ? updatedItem : item)
      }
      
      const updatedPerfil = {
        ...perfil,
        secciones: perfil.secciones.map(s => s.id === seccion.id ? updatedSeccion : s)
      }
      
      onUpdate(updatedPerfil)
      setIsAddingItem(false)
      resetForm()
      toast.success('Elemento actualizado correctamente')
    } else {
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
      resetForm()
      toast.success('Elemento agregado correctamente')
    }
  }
  
  const handleFileUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    processFiles(itemId, Array.from(files))
    event.target.value = ''
  }

  const handleDrop = (itemId: string, event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(null)
    
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(itemId, Array.from(files))
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragEnter = (itemId: string, event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(itemId)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(null)
  }

  const processFiles = (itemId: string, files: File[]) => {
    const validFiles: File[] = []
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} supera el límite de 5 MB`)
        continue
      }
      
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} no es un tipo de archivo válido (PDF, JPG, PNG)`)
        continue
      }
      
      validFiles.push(file)
    }
    
    if (validFiles.length === 0) return
    
    const evidencias: Evidencia[] = validFiles.map(file => ({
      id: generateId('ev'),
      itemId,
      nombre: file.name,
      tipoArchivo: file.type,
      tamano: file.size,
      rutaArchivo: URL.createObjectURL(file),
      fechaCarga: new Date().toISOString()
    }))
    
    const updatedSeccion = {
      ...seccion,
      items: seccion.items.map(item =>
        item.id === itemId
          ? { ...item, evidencias: [...item.evidencias, ...evidencias] }
          : item
      )
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === seccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    toast.success(`${validFiles.length} ${validFiles.length === 1 ? 'evidencia adjuntada' : 'evidencias adjuntadas'}`)
  }

  const handleDeleteEvidence = (itemId: string, evidenciaId: string) => {
    const updatedSeccion = {
      ...seccion,
      items: seccion.items.map(item =>
        item.id === itemId
          ? { ...item, evidencias: item.evidencias.filter(ev => ev.id !== evidenciaId) }
          : item
      )
    }
    
    const updatedPerfil = {
      ...perfil,
      secciones: perfil.secciones.map(s => s.id === seccion.id ? updatedSeccion : s)
    }
    
    onUpdate(updatedPerfil)
    toast.success('Evidencia eliminada')
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
                  <Dialog open={isAddingItem} onOpenChange={(open) => {
                    setIsAddingItem(open)
                    if (!open) resetForm()
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus size={20} className="mr-2" />
                        Agregar Elemento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Editar Elemento' : 'Nuevo Elemento'}</DialogTitle>
                        <DialogDescription>
                          {editingItem ? 'Modifica' : 'Agrega'} un elemento {editingItem ? 'en' : 'a'} la sección {seccion.seccion.nombre}
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
                        
                        {seccion.seccion.id === 'sec-2' && (
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-sm">Información Adicional - Formación Académica</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="gradoObtenido">Grado Obtenido</Label>
                                <Select
                                  value={newItem.datos?.gradoObtenido || ''}
                                  onValueChange={(value) => setNewItem({ ...newItem, datos: { ...newItem.datos, gradoObtenido: value } })}
                                >
                                  <SelectTrigger id="gradoObtenido">
                                    <SelectValue placeholder="Seleccionar grado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                                    <SelectItem value="Especialidad">Especialidad</SelectItem>
                                    <SelectItem value="Maestría">Maestría</SelectItem>
                                    <SelectItem value="Doctorado">Doctorado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cedula">Cédula Profesional</Label>
                                <Input
                                  id="cedula"
                                  value={newItem.datos?.cedula || ''}
                                  onChange={(e) => setNewItem({ ...newItem, datos: { ...newItem.datos, cedula: e.target.value } })}
                                  placeholder="Número de cédula"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {seccion.seccion.id === 'sec-3' && (
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-sm">Información Adicional - Docencia</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="nivelAcademico">Nivel Académico</Label>
                                <Select
                                  value={newItem.datos?.nivelAcademico || ''}
                                  onValueChange={(value) => setNewItem({ ...newItem, datos: { ...newItem.datos, nivelAcademico: value } })}
                                >
                                  <SelectTrigger id="nivelAcademico">
                                    <SelectValue placeholder="Seleccionar nivel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                                    <SelectItem value="Posgrado">Posgrado</SelectItem>
                                    <SelectItem value="Educación Continua">Educación Continua</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="horasSemana">Horas por Semana</Label>
                                <Input
                                  id="horasSemana"
                                  type="number"
                                  value={newItem.datos?.horasSemana || ''}
                                  onChange={(e) => setNewItem({ ...newItem, datos: { ...newItem.datos, horasSemana: parseInt(e.target.value) || 0 } })}
                                  placeholder="Ej: 6"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {seccion.seccion.id === 'sec-4' && (
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium text-sm">Información Adicional - Investigación</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="tipoProduccion">Tipo de Producción</Label>
                                <Select
                                  value={newItem.datos?.tipoProduccion || ''}
                                  onValueChange={(value) => setNewItem({ ...newItem, datos: { ...newItem.datos, tipoProduccion: value } })}
                                >
                                  <SelectTrigger id="tipoProduccion">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Artículo">Artículo</SelectItem>
                                    <SelectItem value="Libro">Libro</SelectItem>
                                    <SelectItem value="Capítulo de Libro">Capítulo de Libro</SelectItem>
                                    <SelectItem value="Proyecto">Proyecto</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="isbn">ISBN/ISSN</Label>
                                <Input
                                  id="isbn"
                                  value={newItem.datos?.isbn || ''}
                                  onChange={(e) => setNewItem({ ...newItem, datos: { ...newItem.datos, isbn: e.target.value } })}
                                  placeholder="Número de identificación"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setIsAddingItem(false)
                          resetForm()
                        }}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddItem}>
                          {editingItem ? 'Actualizar' : 'Agregar'}
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(item)}
                          title="Editar elemento"
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Eliminar elemento"
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
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
                  
                  {item.datos && Object.keys(item.datos).length > 0 && (
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border">
                      {item.datos.gradoObtenido && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Grado Obtenido</Label>
                          <p className="text-sm mt-1">{item.datos.gradoObtenido}</p>
                        </div>
                      )}
                      {item.datos.cedula && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Cédula Profesional</Label>
                          <p className="text-sm mt-1">{item.datos.cedula}</p>
                        </div>
                      )}
                      {item.datos.nivelAcademico && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Nivel Académico</Label>
                          <p className="text-sm mt-1">{item.datos.nivelAcademico}</p>
                        </div>
                      )}
                      {item.datos.horasSemana && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Horas por Semana</Label>
                          <p className="text-sm mt-1">{item.datos.horasSemana}</p>
                        </div>
                      )}
                      {item.datos.tipoProduccion && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Tipo de Producción</Label>
                          <p className="text-sm mt-1">{item.datos.tipoProduccion}</p>
                        </div>
                      )}
                      {item.datos.isbn && (
                        <div>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide">ISBN/ISSN</Label>
                          <p className="text-sm mt-1">{item.datos.isbn}</p>
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
                              ref={(el) => { fileInputRefs.current[item.id] = el }}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              multiple
                              onChange={(e) => handleFileUpload(item.id, e)}
                              className="hidden"
                            />
                          </label>
                        </Button>
                      )}
                    </div>
                    
                    {canEdit && (
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                          dragActive === item.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-muted/20'
                        }`}
                        onDrop={(e) => handleDrop(item.id, e)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(item.id, e)}
                        onDragLeave={handleDragLeave}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <Upload size={32} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Arrastra archivos aquí o haz clic en "Adjuntar"
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, JPG, PNG hasta 5 MB por archivo
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {item.evidencias.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.evidencias.map((ev) => (
                          <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card group hover:border-primary/50 transition-colors">
                            <FileText size={24} className="text-primary shrink-0 mt-0.5" weight="fill" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{ev.nombre}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(ev.tamano)}
                                </p>
                                <span className="text-xs text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(ev.fechaCarga).toLocaleDateString('es-MX')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => window.open(ev.rutaArchivo, '_blank')}
                                title="Ver documento"
                              >
                                <DownloadSimple size={16} />
                              </Button>
                              {canEdit && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteEvidence(item.id, ev.id)}
                                  title="Eliminar evidencia"
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription className="text-sm text-muted-foreground">
                          No hay evidencias adjuntadas. Debes adjuntar al menos un documento para enviar esta sección a revisión.
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
