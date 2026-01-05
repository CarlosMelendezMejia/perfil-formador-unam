import type { Usuario, Perfil, ProfesorIdentidad, PerfilSeccion, Item, Evidencia, AuditLog, Revision } from '@/types'
import { SECCIONES_PERFIL } from './constants'

export const MOCK_USUARIOS: Usuario[] = [
  {
    id: 'user-1',
    nombre: 'Dr. Carlos Méndez Rivera',
    email: 'carlos.mendez@unam.mx',
    numeroTrabajador: '000234567',
    rol: 'PROFESOR'
  },
  {
    id: 'user-2',
    nombre: 'Dra. María Elena Torres',
    email: 'maria.torres@unam.mx',
    numeroTrabajador: '000345678',
    rol: 'PROFESOR'
  },
  {
    id: 'user-3',
    nombre: 'Dr. Roberto García Luna',
    email: 'roberto.garcia@unam.mx',
    numeroTrabajador: '000456789',
    rol: 'PROFESOR'
  },
  {
    id: 'eval-1',
    nombre: 'Dra. Patricia Hernández',
    email: 'patricia.hernandez@unam.mx',
    rol: 'EVALUADOR'
  },
  {
    id: 'admin-1',
    nombre: 'Mtro. Luis Ramírez',
    email: 'luis.ramirez@unam.mx',
    rol: 'ADMINISTRADOR'
  }
]

export function generateMockIdentity(usuarioId: string): ProfesorIdentidad {
  const usuario = MOCK_USUARIOS.find(u => u.id === usuarioId)!
  return {
    id: `identity-${usuarioId}`,
    usuarioId,
    numeroTrabajador: usuario.numeroTrabajador || '000000000',
    rfc: 'MERC850215AB3',
    adscripcion: 'Facultad de Ciencias',
    areaDisciplinar: 'Matemáticas Aplicadas',
    estado: usuarioId === 'user-1' ? 'VALIDADA' : usuarioId === 'user-2' ? 'EN_REVISION' : 'PENDIENTE',
    observaciones: usuarioId === 'user-3' ? 'Favor de adjuntar comprobante de adscripción actualizado' : undefined,
    evidencias: [
      {
        id: `id-ev-${usuarioId}-1`,
        nombre: 'Credencial_UNAM.pdf',
        tipo: 'application/pdf',
        url: '/mock/credencial.pdf',
        fechaCarga: new Date(2024, 0, 15).toISOString()
      },
      {
        id: `id-ev-${usuarioId}-2`,
        nombre: 'Comprobante_Adscripcion.pdf',
        tipo: 'application/pdf',
        url: '/mock/adscripcion.pdf',
        fechaCarga: new Date(2024, 0, 15).toISOString()
      }
    ],
    fechaCreacion: new Date(2024, 0, 10).toISOString(),
    fechaActualizacion: new Date(2024, 0, 15).toISOString()
  }
}

export function generateMockItems(seccionId: string, perfilSeccionId: string): Item[] {
  const baseDate = new Date(2024, 0, 20)
  
  if (seccionId === 'sec-2') {
    return [
      {
        id: `item-${perfilSeccionId}-1`,
        perfilSeccionId,
        titulo: 'Doctorado en Matemáticas',
        descripcion: 'Doctorado en Matemáticas Aplicadas',
        institucion: 'Universidad Nacional Autónoma de México',
        fechaInicio: '2010-08-01',
        fechaFin: '2015-06-30',
        datos: {
          gradoObtenido: 'Doctor en Ciencias',
          cedula: '10234567',
          mencionHonorifica: true
        },
        estado: 'APROBADO',
        evidencias: [
          {
            id: `ev-${perfilSeccionId}-1-1`,
            itemId: `item-${perfilSeccionId}-1`,
            nombre: 'Titulo_Doctorado.pdf',
            tipoArchivo: 'application/pdf',
            tamano: 2456789,
            rutaArchivo: '/mock/titulo-doc.pdf',
            fechaCarga: baseDate.toISOString()
          },
          {
            id: `ev-${perfilSeccionId}-1-2`,
            itemId: `item-${perfilSeccionId}-1`,
            nombre: 'Cedula_Profesional.pdf',
            tipoArchivo: 'application/pdf',
            tamano: 1234567,
            rutaArchivo: '/mock/cedula.pdf',
            fechaCarga: baseDate.toISOString()
          }
        ],
        observaciones: undefined,
        fechaCreacion: baseDate.toISOString()
      },
      {
        id: `item-${perfilSeccionId}-2`,
        perfilSeccionId,
        titulo: 'Maestría en Ciencias Matemáticas',
        descripcion: 'Maestría en Ciencias con especialidad en Matemáticas',
        institucion: 'CINVESTAV-IPN',
        fechaInicio: '2008-08-01',
        fechaFin: '2010-06-30',
        datos: {
          gradoObtenido: 'Maestro en Ciencias',
          cedula: '9876543',
          promedio: 9.5
        },
        estado: 'EN_REVISION',
        evidencias: [
          {
            id: `ev-${perfilSeccionId}-2-1`,
            itemId: `item-${perfilSeccionId}-2`,
            nombre: 'Titulo_Maestria.pdf',
            tipoArchivo: 'application/pdf',
            tamano: 2100000,
            rutaArchivo: '/mock/titulo-mae.pdf',
            fechaCarga: baseDate.toISOString()
          }
        ],
        observaciones: undefined,
        fechaCreacion: baseDate.toISOString()
      }
    ]
  }
  
  if (seccionId === 'sec-3') {
    return [
      {
        id: `item-${perfilSeccionId}-3`,
        perfilSeccionId,
        titulo: 'Cálculo Diferencial e Integral',
        descripcion: 'Curso semestral para la licenciatura en Matemáticas',
        institucion: 'Facultad de Ciencias, UNAM',
        fechaInicio: '2023-08-01',
        fechaFin: '2023-12-15',
        datos: {
          nivelAcademico: 'Licenciatura',
          horasSemana: 6,
          numeroAlumnos: 45,
          modalidad: 'Presencial'
        },
        estado: 'OBSERVADO',
        evidencias: [
          {
            id: `ev-${perfilSeccionId}-3-1`,
            itemId: `item-${perfilSeccionId}-3`,
            nombre: 'Constancia_Docencia_2023B.pdf',
            tipoArchivo: 'application/pdf',
            tamano: 890000,
            rutaArchivo: '/mock/constancia-doc.pdf',
            fechaCarga: baseDate.toISOString()
          }
        ],
        observaciones: 'Favor de incluir el plan de estudios del curso o programa analítico',
        fechaCreacion: baseDate.toISOString()
      }
    ]
  }
  
  return []
}

export function generateMockPerfil(usuarioId: string): Perfil {
  const usuario = MOCK_USUARIOS.find(u => u.id === usuarioId)!
  const identidad = generateMockIdentity(usuarioId)
  
  const secciones: PerfilSeccion[] = SECCIONES_PERFIL.map((seccion, index) => {
    const perfilSeccionId = `ps-${usuarioId}-${seccion.id}`
    let estado: PerfilSeccion['estado'] = 'BORRADOR'
    
    if (usuarioId === 'user-1') {
      if (index < 2) estado = 'VALIDADA'
      else if (index === 2) estado = 'OBSERVADA'
      else if (index === 3) estado = 'EN_REVISION'
    }
    
    return {
      id: perfilSeccionId,
      perfilId: `perfil-${usuarioId}`,
      seccionId: seccion.id,
      seccion,
      estado,
      items: generateMockItems(seccion.id, perfilSeccionId),
      observaciones: estado === 'OBSERVADA' ? 'Se requiere mayor detalle en las evidencias documentales' : undefined,
      fechaEnvio: estado !== 'BORRADOR' ? new Date(2024, 0, 25).toISOString() : undefined,
      fechaValidacion: estado === 'VALIDADA' ? new Date(2024, 0, 28).toISOString() : undefined
    }
  })
  
  return {
    id: `perfil-${usuarioId}`,
    usuarioId,
    usuario,
    fechaCreacion: new Date(2024, 0, 5).toISOString(),
    fechaActualizacion: new Date(2024, 1, 2).toISOString(),
    secciones,
    identidad
  }
}

export function generateMockAuditLogs(): AuditLog[] {
  return [
    {
      id: 'audit-1',
      usuarioId: 'user-1',
      usuario: MOCK_USUARIOS[0],
      accion: 'CREAR_ITEM',
      entidad: 'Item',
      entidadId: 'item-ps-user-1-sec-2-1',
      detalles: { seccion: 'Formación Académica', titulo: 'Doctorado en Matemáticas' },
      fecha: new Date(2024, 0, 20, 10, 30).toISOString()
    },
    {
      id: 'audit-2',
      usuarioId: 'user-1',
      usuario: MOCK_USUARIOS[0],
      accion: 'CARGAR_EVIDENCIA',
      entidad: 'Evidencia',
      entidadId: 'ev-ps-user-1-sec-2-1-1',
      detalles: { archivo: 'Titulo_Doctorado.pdf', tamano: '2.4 MB' },
      fecha: new Date(2024, 0, 20, 10, 45).toISOString()
    },
    {
      id: 'audit-3',
      usuarioId: 'user-1',
      usuario: MOCK_USUARIOS[0],
      accion: 'ENVIAR_SECCION',
      entidad: 'PerfilSeccion',
      entidadId: 'ps-user-1-sec-2',
      detalles: { seccion: 'Formación Académica', items: 2 },
      fecha: new Date(2024, 0, 25, 9, 15).toISOString()
    },
    {
      id: 'audit-4',
      usuarioId: 'eval-1',
      usuario: MOCK_USUARIOS[3],
      accion: 'APROBAR_ITEM',
      entidad: 'Item',
      entidadId: 'item-ps-user-1-sec-2-1',
      detalles: { decision: 'APROBADO', profesor: 'Dr. Carlos Méndez Rivera' },
      fecha: new Date(2024, 0, 28, 14, 20).toISOString()
    },
    {
      id: 'audit-5',
      usuarioId: 'eval-1',
      usuario: MOCK_USUARIOS[3],
      accion: 'OBSERVAR_ITEM',
      entidad: 'Item',
      entidadId: 'item-ps-user-1-sec-3-3',
      detalles: { decision: 'OBSERVADO', observacion: 'Incluir plan de estudios' },
      fecha: new Date(2024, 0, 28, 14, 35).toISOString()
    },
    {
      id: 'audit-6',
      usuarioId: 'user-2',
      usuario: MOCK_USUARIOS[1],
      accion: 'ACTUALIZAR_IDENTIDAD',
      entidad: 'ProfesorIdentidad',
      entidadId: 'identity-user-2',
      detalles: { campo: 'adscripcion', valor: 'Facultad de Ciencias' },
      fecha: new Date(2024, 1, 1, 11, 0).toISOString()
    }
  ]
}

export const MOCK_PERFILES = [
  generateMockPerfil('user-1'),
  generateMockPerfil('user-2'),
  generateMockPerfil('user-3')
]

export const MOCK_AUDIT_LOGS = generateMockAuditLogs()
