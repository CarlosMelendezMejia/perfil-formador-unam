import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, GraduationCap, ShieldCheck } from '@phosphor-icons/react'
import type { Role, Usuario } from '@/types'

interface RoleSelectorProps {
  currentRole: Role
  currentUser: Usuario | undefined
  onRoleChange: (role: Role) => void
}

export function RoleSelector({ currentRole, currentUser, onRoleChange }: RoleSelectorProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="text-primary-foreground" size={24} weight="bold" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Perfil Formador UNAM</h1>
                <p className="text-xs text-muted-foreground tracking-wide uppercase">Sistema de Gestión Académica</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <Select value={currentRole} onValueChange={(value) => onRoleChange(value as Role)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROFESOR">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Profesor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EVALUADOR">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} />
                      <span>Evaluador</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMINISTRADOR">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      <span>Administrador</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {currentUser && (
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              )}
            </div>
            
            {currentUser && (
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                  {currentUser.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
