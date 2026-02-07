'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Alumno } from '@/lib/types/alumno'

interface AlumnoDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumno: Alumno | null
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function AlumnoDeleteDialog({
  open,
  onOpenChange,
  alumno,
  onConfirm,
  isLoading,
}: AlumnoDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar alumno</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar a{' '}
            <span className="font-medium">
              {alumno?.nombre} {alumno?.apellido}
            </span>
            ? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
