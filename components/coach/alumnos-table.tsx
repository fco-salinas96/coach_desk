'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import type { Alumno } from '@/lib/types/alumno'

interface AlumnosTableProps {
  alumnos: Alumno[]
  onEdit: (alumno: Alumno) => void
  onDelete: (alumno: Alumno) => void
}

function calculateAge(dateString: string | null): string {
  if (!dateString) return '-'
  const birthDate = new Date(dateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return `${age} años`
}

function calculateSeniority(dateString: string | null): string {
  if (!dateString) return '-'
  const startDate = new Date(dateString)
  const today = new Date()
  
  const diffTime = Math.abs(today.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) {
    return `${diffDays} días`
  }
  
  const months = Math.floor(diffDays / 30)
  if (months < 12) {
    return `${months} mes${months > 1 ? 'es' : ''}`
  }
  
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (remainingMonths === 0) {
    return `${years} año${years > 1 ? 's' : ''}`
  }
  return `${years} año${years > 1 ? 's' : ''} ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`
}

function formatGender(gender: string) {
  const genderMap: Record<string, string> = {
    masculino: 'M',
    femenino: 'F',
    otro: 'O',
  }
  return genderMap[gender] || gender
}

export function AlumnosTable({ alumnos, onEdit, onDelete }: AlumnosTableProps) {
  if (alumnos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No hay alumnos registrados</p>
        <p className="text-sm text-muted-foreground">
          Haz clic en &quot;Nuevo Alumno&quot; para agregar uno
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="hidden md:table-cell">Género</TableHead>
            <TableHead className="hidden md:table-cell">Edad</TableHead>
            <TableHead className="hidden lg:table-cell">Antigüedad</TableHead>
            <TableHead className="hidden lg:table-cell">Club habitual</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alumnos.map((alumno) => (
            <TableRow key={alumno.id}>
              <TableCell className="font-medium">
                {alumno.nombre} {alumno.apellido}
              </TableCell>
              <TableCell>{alumno.telefono}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatGender(alumno.genero)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {calculateAge(alumno.fecha_nacimiento)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {calculateSeniority(alumno.fecha_primera_clase)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {alumno.ubicacion?.nombre || '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(alumno)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(alumno)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
