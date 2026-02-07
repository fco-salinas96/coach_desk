'use client'

import React from "react"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import type { Alumno, AlumnoFormData, Ubicacion } from '@/lib/types/alumno'

interface AlumnoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alumno?: Alumno | null
  ubicaciones: Ubicacion[]
  onSubmit: (data: AlumnoFormData) => Promise<void>
  isLoading?: boolean
}

const initialFormData: AlumnoFormData = {
  nombre: '',
  apellido: '',
  telefono: '',
  fecha_nacimiento: '',
  direccion: '',
  comuna: '',
  genero: 'masculino',
  fecha_primera_clase: '',
  id_ubicacion: '0', // Updated default value to be a non-empty string
}

export function AlumnoForm({
  open,
  onOpenChange,
  alumno,
  ubicaciones,
  onSubmit,
  isLoading,
}: AlumnoFormProps) {
  const [formData, setFormData] = useState<AlumnoFormData>(initialFormData)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!alumno

  useEffect(() => {
    if (alumno) {
      setFormData({
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        telefono: alumno.telefono || '',
        fecha_nacimiento: alumno.fecha_nacimiento || '',
        direccion: alumno.direccion || '',
        comuna: alumno.comuna || '',
        genero: alumno.genero,
        fecha_primera_clase: alumno.fecha_primera_clase || '',
        id_ubicacion: alumno.id_ubicacion || '0', // Updated default value to be a non-empty string
      })
    } else {
      setFormData(initialFormData)
    }
    setError(null)
  }, [alumno, open])

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+569\d{8}$/
    return phoneRegex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validatePhone(formData.telefono)) {
      setError('El teléfono debe tener el formato +569XXXXXXXX')
      return
    }

    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error')
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (value && !value.startsWith('+')) {
      if (value.startsWith('569')) {
        value = '+' + value
      } else if (value.startsWith('9')) {
        value = '+56' + value
      }
    }

    setFormData({ ...formData, telefono: value })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los datos del alumno'
              : 'Completa los datos para registrar un nuevo alumno'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+569XXXXXXXX"
                value={formData.telefono}
                onChange={handlePhoneChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value: 'masculino' | 'femenino' | 'otro') =>
                  setFormData({ ...formData, genero: value })
                }
              >
                <SelectTrigger id="genero">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_nacimiento: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_primera_clase">Primera Clase</Label>
              <Input
                id="fecha_primera_clase"
                type="date"
                value={formData.fecha_primera_clase}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_primera_clase: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_ubicacion">Club habitual</Label>
            <Select
              value={formData.id_ubicacion}
              onValueChange={(value) =>
                setFormData({ ...formData, id_ubicacion: value })
              }
            >
              <SelectTrigger id="id_ubicacion">
                <SelectValue placeholder="Seleccionar club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin club asignado</SelectItem> {/* Updated value to be a non-empty string */}
                {ubicaciones.map((ubicacion) => (
                  <SelectItem key={ubicacion.id} value={ubicacion.id}>
                    {ubicacion.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comuna">Comuna</Label>
            <Input
              id="comuna"
              value={formData.comuna}
              onChange={(e) =>
                setFormData({ ...formData, comuna: e.target.value })
              }
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear alumno'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
