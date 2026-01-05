import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { RoleSelector } from './components/RoleSelector'
import { ProfesorDashboard } from './components/ProfesorDashboard'
import { EvaluadorDashboard } from './components/EvaluadorDashboard'
import { AdministradorDashboard } from './components/AdministradorDashboard'
import { Toaster } from './components/ui/sonner'
import type { Role, Perfil, Usuario, AuditLog } from './types'
import { MOCK_USUARIOS, MOCK_PERFILES, MOCK_AUDIT_LOGS } from './lib/mockData'

function App() {
  const [currentRole, setCurrentRole] = useKV<Role>('current-role', 'PROFESOR')
  const [perfiles, setPerfiles] = useKV<Perfil[]>('perfiles', MOCK_PERFILES)
  const [auditLogs, setAuditLogs] = useKV<AuditLog[]>('audit-logs', MOCK_AUDIT_LOGS)
  const [currentUserId, setCurrentUserId] = useState<string>('user-1')
  
  const currentUser = MOCK_USUARIOS.find(u => u.id === currentUserId)
  
  useEffect(() => {
    if (currentRole === 'PROFESOR') {
      setCurrentUserId('user-1')
    } else if (currentRole === 'EVALUADOR') {
      setCurrentUserId('eval-1')
    } else if (currentRole === 'ADMINISTRADOR') {
      setCurrentUserId('admin-1')
    }
  }, [currentRole])
  
  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole)
  }
  
  const handleUpdatePerfil = (updatedPerfil: Perfil) => {
    setPerfiles((currentPerfiles) => 
      (currentPerfiles || []).map(p => p.id === updatedPerfil.id ? updatedPerfil : p)
    )
  }
  
  const currentPerfil = (perfiles || []).find(p => p.usuarioId === currentUserId)
  
  return (
    <div className="min-h-screen bg-background">
      <RoleSelector
        currentRole={currentRole || 'PROFESOR'}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
      />
      
      <main>
        {currentRole === 'PROFESOR' && currentPerfil && (
          <ProfesorDashboard
            perfil={currentPerfil}
            onUpdatePerfil={handleUpdatePerfil}
          />
        )}
        
        {currentRole === 'EVALUADOR' && (
          <EvaluadorDashboard
            perfiles={perfiles || []}
            onUpdatePerfil={handleUpdatePerfil}
          />
        )}
        
        {currentRole === 'ADMINISTRADOR' && (
          <AdministradorDashboard
            perfiles={perfiles || []}
            auditLogs={auditLogs || []}
          />
        )}
      </main>
      
      <Toaster position="top-center" />
    </div>
  )
}

export default App