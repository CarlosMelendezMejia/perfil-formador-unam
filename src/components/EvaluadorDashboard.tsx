import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ReviewPanel } from './ReviewPanel'
import { Clock, CheckCircle, Warning, Eye } from '@phosphor-icons/react'
import type { Perfil } from '@/types'

interface EvaluadorDashboardProps {
  perfiles: Perfil[]
  onUpdatePerfil: (perfil: Perfil) => void
}

export function EvaluadorDashboard({ perfiles, onUpdatePerfil }: EvaluadorDashboardProps) {
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null)
  
  const perfilesPendientes = perfiles.filter(p => 
    p.secciones.some(s => s.estado === 'EN_REVISION')
  )
  
  const seccionesEnRevision = perfiles.reduce((acc, p) => 
    acc + p.secciones.filter(s => s.estado === 'EN_REVISION').length, 0
  )
  
  const seccionesObservadas = perfiles.reduce((acc, p) => 
    acc + p.secciones.filter(s => s.estado === 'OBSERVADA').length, 0
  )
  
  const seccionesValidadas = perfiles.reduce((acc, p) => 
    acc + p.secciones.filter(s => s.estado === 'VALIDADA').length, 0
  )
  
  return (
    <>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-2">Panel de Evaluación</h1>
          <p className="text-muted-foreground">
            Revisa y valida los perfiles académicos del profesorado
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">Pendientes de Revisión</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-3xl">{seccionesEnRevision}</CardTitle>
                <Clock className="text-warning" size={24} weight="fill" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {perfilesPendientes.length} perfiles con secciones pendientes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">Observadas</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-3xl">{seccionesObservadas}</CardTitle>
                <Warning className="text-info" size={24} weight="fill" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Secciones que requieren corrección
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wide">Validadas</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-3xl">{seccionesValidadas}</CardTitle>
                <CheckCircle className="text-success" size={24} weight="fill" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Secciones aprobadas exitosamente
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Perfiles del Profesorado</h2>
          <div className="space-y-4">
            {perfiles.map((perfil) => {
              const seccionesRevisando = perfil.secciones.filter(s => s.estado === 'EN_REVISION')
              const seccionesConObservaciones = perfil.secciones.filter(s => s.estado === 'OBSERVADA')
              const seccionesValidadasProfesor = perfil.secciones.filter(s => s.estado === 'VALIDADA')
              const totalItems = perfil.secciones.reduce((acc, s) => acc + (s.items?.length || 0), 0)
              
              return (
                <Card key={perfil.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                            {perfil.usuario.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{perfil.usuario.nombre}</CardTitle>
                          <CardDescription className="space-y-1">
                            <div>{perfil.usuario.email}</div>
                            {perfil.usuario.numeroTrabajador && (
                              <div className="text-xs">
                                Núm. Trabajador: {perfil.usuario.numeroTrabajador}
                              </div>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <Button onClick={() => setSelectedPerfil(perfil)}>
                        <Eye size={18} className="mr-2" />
                        Revisar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Elementos</p>
                        <p className="text-2xl font-semibold">{totalItems}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">En Revisión</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-semibold text-warning">{seccionesRevisando.length}</p>
                          {seccionesRevisando.length > 0 && (
                            <Badge className="bg-warning text-warning-foreground">Pendiente</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Observadas</p>
                        <p className="text-2xl font-semibold text-info">{seccionesConObservaciones.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Validadas</p>
                        <p className="text-2xl font-semibold text-success">{seccionesValidadasProfesor.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
            {perfiles.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No hay perfiles de profesores disponibles para revisión.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Sheet open={!!selectedPerfil} onOpenChange={(open) => !open && setSelectedPerfil(null)}>
        <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
          {selectedPerfil && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl">Revisión de Perfil</SheetTitle>
                <SheetDescription>
                  {selectedPerfil.usuario.nombre} • {selectedPerfil.usuario.email}
                </SheetDescription>
              </SheetHeader>
              <ReviewPanel
                perfil={selectedPerfil}
                onUpdate={(updatedPerfil) => {
                  onUpdatePerfil(updatedPerfil)
                  setSelectedPerfil(updatedPerfil)
                }}
                onClose={() => setSelectedPerfil(null)}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
