import { Badge } from '@/components/ui/badge'
import { FileText, Clock, Warning, CheckCircle, X } from '@phosphor-icons/react'
import type { SectionStatus, ItemStatus } from '@/types'
import { SECTION_STATUS_CONFIG, ITEM_STATUS_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: SectionStatus | ItemStatus
  type?: 'section' | 'item'
  className?: string
  showIcon?: boolean
}

const ICON_MAP = {
  FileText: FileText,
  Clock: Clock,
  Warning: Warning,
  CheckCircle: CheckCircle,
  X: X
}

export function StatusBadge({ status, type = 'section', className, showIcon = true }: StatusBadgeProps) {
  const config = type === 'section' 
    ? SECTION_STATUS_CONFIG[status as SectionStatus] 
    : ITEM_STATUS_CONFIG[status as ItemStatus]
  
  if (!config) return null
  
  const IconComponent = ICON_MAP[config.icon as keyof typeof ICON_MAP]
  
  return (
    <Badge className={cn(config.color, 'flex items-center gap-1.5 px-2.5 py-1', className)}>
      {showIcon && IconComponent && <IconComponent size={14} weight="bold" />}
      <span className="text-xs font-medium tracking-wide uppercase">{config.label}</span>
    </Badge>
  )
}
