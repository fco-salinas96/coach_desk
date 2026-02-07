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
import type { Ubicacion } from '@/lib/types/ubicacion'

interface ClubsTableProps {
  clubs: Ubicacion[]
  onEdit: (club: Ubicacion) => void
  onDelete: (club: Ubicacion) => void
}

export function ClubsTable({ clubs, onEdit, onDelete }: ClubsTableProps) {
  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-muted-foreground">No hay clubs registrados</p>
        <p className="text-sm text-muted-foreground">
          Crea tu primer club para comenzar
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
            <TableHead className="hidden sm:table-cell">Direccion</TableHead>
            <TableHead className="hidden md:table-cell">Comuna</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club) => (
            <TableRow key={club.id}>
              <TableCell className="font-medium">
                {club.nombre}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {club.direccion}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {club.comuna}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(club)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(club)}
                    title="Eliminar"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
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
