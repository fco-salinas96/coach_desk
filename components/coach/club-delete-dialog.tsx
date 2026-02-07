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
import type { Ubicacion } from '@/lib/types/ubicacion'

interface ClubDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  club: Ubicacion | null
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function ClubDeleteDialog({
  open,
  onOpenChange,
  club,
  onConfirm,
  isLoading,
}: ClubDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar club</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estas seguro de que deseas eliminar el club{' '}
            <strong>{club?.nombre}</strong>? Esta accion no se puede deshacer.
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
