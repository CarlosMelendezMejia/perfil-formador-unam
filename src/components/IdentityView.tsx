import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from './StatusBadge'
import { User, Upload, FileText, CheckCircle, Warning } from '@phosphor-icons/react'
import type { Perfil, ProfesorIdentidad } from '@/types'
import { IDENTITY_STATUS_CONFIG } from '@/lib/constants'
import { formatDate, formatFileSize, generateId } from '@/lib/helpers'
import { toast } from 'sonner'

interface IdentityViewProps {
  perfil: Perfil
  onUpdate: (perfil: Perfil) => void
}

export function IdentityView({ perfil, onUpdate }: IdentityViewProps) {
  const [isEditing, setIsEditing] = useState(!perfil.identidad || perfil.identidad.estado === 'PENDIENTE')
  const [formData, setFormData] = useState<Partial<ProfesorIdentidad>>(
    perfil.identidad || {
      numeroTrabajador: '',
      rfc: '',
      adscripcion: '',
      areaDisciplinar: ''
    }
  )
  
  const handleInputChange = (field: keyof ProfesorIdentidad, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe superar 5 MB')
      return
    }
    
    const newEvidence = {
      id: generateId('id-ev'),
      nombre: file.name,
      tipo: file.type,
      url: URL.createObjectURL(file),
      fechaCarga: new Date().toISOString()
    }
    
    setFormData(prev => ({
      ...prev,
      evidencias: [...(prev.evidencias || []), newEvidence]
    }))
    
    toast.success('Evidencia adjuntada correctamente')
    event.target.value = ''
  }
  
  const handleSave = () => {
    if (!formData.numeroTrabajador || !formData.rfc || !formData.adscripcion || !formData.areaDisciplinar) {
      toast.error('Todos los campos son obligatorios')
      return
    }
    
    const updatedIdentity: ProfesorIdentidad = {
      id: perfil.identidad?.id || generateId('identity'),
      usuarioId: perfil.usuarioId,
      numeroTrabajador: formData.numeroTrabajador!,
      rfc: formData.rfc!,
      adscripcion: formData.adscripcion!,
      areaDisciplinar: formData.areaDisciplinar!,
      estado: perfil.identidad?.estado || 'PENDIENTE',
      observaciones: perfil.identidad?.observaciones,
      evidencias: formData.evidencias || [],
      fechaCreacion: perfil.identidad?.fechaCreacion || new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    }
    
    const updatedPerfil = { ...perfil, identidad: updatedIdentity }
    onUpdate(updatedPerfil)
    setIsEditing(false)
    toast.success('Identidad guardada correctamente')
  }
  
  const handleSubmitForReview = () => {
    if (!perfil.identidad?.evidencias || perfil.identidad.evidencias.length === 0) {
      toast.error('Debe adjuntar al menos una evidencia documental')
      return
    }
    
    const updatedIdentity: ProfesorIdentidad = {
      ...perfil.identidad,
      estado: 'EN_REVISION',
      fechaActualizacion: new Date().toISOString()
    }
    
    const updatedPerfil = { ...perfil, identidad: updatedIdentity }
    onUpdate(updatedPerfil)
    toast.success('Identidad enviada a revisión')
  }
  
  const canEdit = !perfil.identidad || perfil.identidad.estado === 'PENDIENTE' || perfil.identidad.estado === 'RECHAZADA'
  const canSubmit = perfil.identidad && perfil.identidad.estado === 'PENDIENTE' && (perfil.identidad.evidencias?.length || 0) > 0
  
  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <User size={28} weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-2xl">Identidad Académica</CardTitle>
                <CardDescription className="mt-1">
                  Información institucional y datos de identificación del profesor
                </CardDescription>
              </div>
            </div>
            {perfil.identidad && (
              <StatusBadge 
                status={perfil.identidad.estado as any} 
                type="section" 
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {perfil.identidad?.estado === 'VALIDADA' && (
            <Alert className="bg-success/10 border-success/20">
              <CheckCircle className="h-4 w-4 text-success" weight="fill" />
              <AlertDescription className="text-success-foreground">
                Tu identidad académica ha sido validada exitosamente por el equipo evaluador.
              </AlertDescription>
            </Alert>
          )}
          
          {perfil.identidad?.estado === 'RECHAZADA' && perfil.identidad.observaciones && (
            <Alert className="bg-destructive/10 border-destructive/20">
              <Warning className="h-4 w-4 text-destructive" weight="fill" />
              <AlertDescription className="text-destructive">
                <strong>Rechazada:</strong> {perfil.identidad.observaciones}
              </AlertDescription>
            </Alert>
          )}
          
          {perfil.identidad?.estado === 'EN_REVISION' && (
            <Alert className="bg-warning/10 border-warning/20">
              <AlertDescription className="text-warning-foreground">
                Tu identidad se encuentra en proceso de revisión por el equipo evaluador.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="numeroTrabajador">Número de Trabajador*</Label>
              <Input
                id="numeroTrabajador"
                value={formData.numeroTrabajador || ''}
                onChange={(e) => handleInputChange('numeroTrabajador', e.target.value)}
                disabled={!isEditing || !canEdit}
                placeholder="000000000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC*</Label>
              <Input
                id="rfc"
                value={formData.rfc || ''}
                onChange={(e) => handleInputChange('rfc', e.target.value.toUpperCase())}
                disabled={!isEditing || !canEdit}
                placeholder="ABCD123456XYZ"
                maxLength={13}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adscripcion">Adscripción Académica*</Label>
              <Input
                id="adscripcion"
                value={formData.adscripcion || ''}
                onChange={(e) => handleInputChange('adscripcion', e.target.value)}
                disabled={!isEditing || !canEdit}
                placeholder="Facultad de Ciencias"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="areaDisciplinar">Área Disciplinar*</Label>
              <Input
                id="areaDisciplinar"
                value={formData.areaDisciplinar || ''}
                onChange={(e) => handleInputChange('areaDisciplinar', e.target.value)}
                disabled={!isEditing || !canEdit}
                placeholder="Matemáticas Aplicadas"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Evidencias Documentales</Label>
              {isEditing && canEdit && (
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    Adjuntar Archivo
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
              )}
            </div>
            
            {formData.evidencias && formData.evidencias.length > 0 ? (
              <div className="space-y-2">
                {formData.evidencias.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{ev.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(ev.fechaCarga)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription className="text-muted-foreground">
                  No hay evidencias adjuntadas. Adjunta al menos un documento oficial (credencial UNAM, comprobante de adscripción).
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex items-center gap-3 pt-4">
            {isEditing && canEdit && (
              <>
                <Button onClick={handleSave}>
                  Guardar Cambios
                </Button>
                {perfil.identidad && (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                )}
              </>
            )}
            
            {!isEditing && canEdit && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Editar Información
              </Button>
            )}
            
            {canSubmit && (
              <Button onClick={handleSubmitForReview}>
                Enviar a Validación
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
