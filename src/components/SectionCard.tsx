import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'
import { CaretRight, User, GraduationCap, Chalkboard, Flask, Briefcase, Microphone, Building, Clock } from '@phosphor-icons/react'
import type { PerfilSeccion } from '@/types'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  seccion: PerfilSeccion
  onClick: () => void
}

const ICON_MAP = {
  User: User,
  GraduationCap: GraduationCap,
  Chalkboard: Chalkboard,
  FlaskConical: Flask,
  Briefcase: Briefcase,
  Microphone: Microphone,
  Building: Building,
  Clock: Clock
}

const STATUS_BORDER_COLOR = {
  BORRADOR: 'border-l-muted',
  EN_REVISION: 'border-l-warning',
  OBSERVADA: 'border-l-info',
  VALIDADA: 'border-l-success'
}

export function SectionCard({ seccion, onClick }: SectionCardProps) {
  const IconComponent = ICON_MAP[seccion.seccion.icono as keyof typeof ICON_MAP] || User
  const itemCount = seccion.items?.length || 0
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-l-4',
        STATUS_BORDER_COLOR[seccion.estado]
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <IconComponent size={24} weight="duotone" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1 line-clamp-1">{seccion.seccion.nombre}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm">{seccion.seccion.descripcion}</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0 ml-2">
          <CaretRight size={20} />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{itemCount} {itemCount === 1 ? 'elemento' : 'elementos'}</span>
            {seccion.fechaEnvio && (
              <span className="text-xs">
                Enviado: {new Date(seccion.fechaEnvio).toLocaleDateString('es-MX')}
              </span>
            )}
          </div>
          <StatusBadge status={seccion.estado} type="section" />
        </div>
        {seccion.observaciones && (
          <div className="mt-3 p-2.5 rounded-md bg-info/10 border border-info/20">
            <p className="text-xs text-info-foreground line-clamp-2">{seccion.observaciones}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
