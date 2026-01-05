import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionCard } from './SectionCard'
import { SectionDetailView } from './SectionDetailView'
import { IdentityView } from './IdentityView'
import { CheckCircle, Clock, Warning } from '@phosphor-icons/react'
import type { Perfil } from '@/types'
import { calculateProfileCompleteness } from '@/lib/helpers'

interface ProfesorDashboardProps {
  perfil: Perfil
  onUpdatePerfil: (perfil: Perfil) => void
}

export function ProfesorDashboard({ perfil, onUpdatePerfil }: ProfesorDashboardProps) {
  const [selectedSeccionId, setSelectedSeccionId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('perfil')
  
  const selectedSeccion = perfil.secciones.find(s => s.id === selectedSeccionId)
  
  const completeness = calculateProfileCompleteness(perfil.secciones)
  const validadas = perfil.secciones.filter(s => s.estado === 'VALIDADA').length
  const enRevision = perfil.secciones.filter(s => s.estado === 'EN_REVISION').length
  const observadas = perfil.secciones.filter(s => s.estado === 'OBSERVADA').length
  
  if (selectedSeccion) {
    return (
      <SectionDetailView
        seccion={selectedSeccion}
        perfil={perfil}
        onBack={() => setSelectedSeccionId(null)}
        onUpdate={onUpdatePerfil}
      />
    )
  }
  
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-2">Mi Perfil Formador</h1>
        <p className="text-muted-foreground">
          Construye y gestiona tu expediente académico integral para procesos de evaluación institucional
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="perfil">Perfil Académico</TabsTrigger>
          <TabsTrigger value="identidad">Mi Identidad</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-wide">Progreso General</CardDescription>
                <CardTitle className="text-3xl">{completeness}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={completeness} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {perfil.secciones.filter(s => s.items && s.items.length > 0).length} de {perfil.secciones.length} secciones con datos
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-wide">Secciones Validadas</CardDescription>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="text-3xl">{validadas}</CardTitle>
                  <CheckCircle className="text-success" size={24} weight="fill" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Completamente aprobadas y verificadas
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-xs uppercase tracking-wide">Requieren Atención</CardDescription>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="text-3xl">{enRevision + observadas}</CardTitle>
                  {observadas > 0 ? (
                    <Warning className="text-info" size={24} weight="fill" />
                  ) : (
                    <Clock className="text-warning" size={24} weight="fill" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {enRevision} en revisión • {observadas} observadas
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Secciones del Perfil</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {perfil.secciones.map((seccion) => (
                <SectionCard
                  key={seccion.id}
                  seccion={seccion}
                  onClick={() => setSelectedSeccionId(seccion.id)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="identidad">
          <IdentityView perfil={perfil} onUpdate={onUpdatePerfil} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
