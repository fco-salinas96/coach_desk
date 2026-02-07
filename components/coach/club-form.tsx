'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Ubicacion, UbicacionFormData } from '@/lib/types/ubicacion'

interface ClubFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  club: Ubicacion | null
  onSubmit: (data: UbicacionFormData) => Promise<void>
  isLoading: boolean
}

export function ClubForm({
  open,
  onOpenChange,
  club,
  onSubmit,
  isLoading,
}: ClubFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UbicacionFormData>()

  useEffect(() => {
    if (open) {
      if (club) {
        reset({
          nombre: club.nombre,
          direccion: club.direccion,
          comuna: club.comuna,
        })
      } else {
        reset({
          nombre: '',
          direccion: '',
          comuna: '',
        })
      }
    }
  }, [open, club, reset])

  const handleFormSubmit = async (data: UbicacionFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {club ? 'Editar Club' : 'Nuevo Club'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              {...register('nombre', { required: 'El nombre es requerido' })}
              placeholder="Nombre del club"
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Direccion *</Label>
            <Input
              id="direccion"
              {...register('direccion', { required: 'La direccion es requerida' })}
              placeholder="Direccion del club"
            />
            {errors.direccion && (
              <p className="text-sm text-destructive">{errors.direccion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comuna">Comuna *</Label>
            <Input
              id="comuna"
              {...register('comuna', { required: 'La comuna es requerida' })}
              placeholder="Comuna"
            />
            {errors.comuna && (
              <p className="text-sm text-destructive">{errors.comuna.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : club ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
