'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { AlumnosTable } from '@/components/coach/alumnos-table'
import { AlumnoForm } from '@/components/coach/alumno-form'
import { AlumnoDeleteDialog } from '@/components/coach/alumno-delete-dialog'
import type { Alumno, AlumnoFormData, Ubicacion } from '@/lib/types/alumno'

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([])
  const [filteredAlumnos, setFilteredAlumnos] = useState<Alumno[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coachId, setCoachId] = useState<string | null>(null)

  useEffect(() => {
    fetchCoachAndAlumnos()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      setFilteredAlumnos(
        alumnos.filter(
          (alumno) =>
            alumno.nombre.toLowerCase().includes(query) ||
            alumno.apellido.toLowerCase().includes(query) ||
            alumno.telefono.includes(query)
        )
      )
    } else {
      setFilteredAlumnos(alumnos)
    }
  }, [searchQuery, alumnos])

  const fetchCoachAndAlumnos = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get coach data
      const { data: coachData, error: coachError } = await supabase
        .from('coach')
        .select('id')
        .eq('id_usuario', user.id)
        .single()

      if (coachError) throw coachError
      setCoachId(coachData.id)

      // Get ubicaciones for this coach
      const { data: ubicacionesData, error: ubicacionesError } = await supabase
        .from('ubicacion')
        .select('*')
        .eq('id_coach', coachData.id)
        .order('nombre', { ascending: true })

      if (ubicacionesError) throw ubicacionesError
      setUbicaciones(ubicacionesData || [])

      // Get alumnos for this coach with ubicacion data
      const { data: alumnosData, error: alumnosError } = await supabase
        .from('alumno')
        .select('*, ubicacion:ubicacion(id, nombre, direccion, comuna)')
        .eq('id_coach', coachData.id)
        .order('nombre', { ascending: true })

      if (alumnosError) throw alumnosError
      setAlumnos(alumnosData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAlumno = async (data: AlumnoFormData) => {
    if (!coachId) return
    const supabase = createClient()
    setIsSubmitting(true)

    try {
      const { data: userData } = await supabase.auth.getUser()
      
      const { data: newAlumno, error } = await supabase
        .from('alumno')
        .insert({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          fecha_nacimiento: data.fecha_nacimiento || null,
          direccion: data.direccion || null,
          comuna: data.comuna || null,
          genero: data.genero,
          fecha_primera_clase: data.fecha_primera_clase || null,
          id_ubicacion: data.id_ubicacion || null,
          id_coach: coachId,
          id_usuario: userData.user?.id,
        })
        .select('*, ubicacion:ubicacion(id, nombre, direccion, comuna)')
        .single()

      if (error) throw error
      setAlumnos([...alumnos, newAlumno])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateAlumno = async (data: AlumnoFormData) => {
    if (!selectedAlumno) return
    const supabase = createClient()
    setIsSubmitting(true)

    try {
      const { data: updatedAlumno, error } = await supabase
        .from('alumno')
        .update({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          fecha_nacimiento: data.fecha_nacimiento || null,
          direccion: data.direccion || null,
          comuna: data.comuna || null,
          genero: data.genero,
          fecha_primera_clase: data.fecha_primera_clase || null,
          id_ubicacion: data.id_ubicacion || null,
        })
        .eq('id', selectedAlumno.id)
        .select('*, ubicacion:ubicacion(id, nombre, direccion, comuna)')
        .single()

      if (error) throw error
      setAlumnos(
        alumnos.map((a) => (a.id === selectedAlumno.id ? updatedAlumno : a))
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAlumno = async () => {
    if (!selectedAlumno) return
    const supabase = createClient()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('alumno')
        .delete()
        .eq('id', selectedAlumno.id)

      if (error) throw error
      setAlumnos(alumnos.filter((a) => a.id !== selectedAlumno.id))
      setIsDeleteOpen(false)
      setSelectedAlumno(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditForm = (alumno: Alumno) => {
    setSelectedAlumno(alumno)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (alumno: Alumno) => {
    setSelectedAlumno(alumno)
    setIsDeleteOpen(true)
  }

  const openCreateForm = () => {
    setSelectedAlumno(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alumnos</h1>
          <p className="text-muted-foreground">
            Gestiona tus alumnos
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Alumno
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar alumno..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando alumnos...</p>
        </div>
      ) : (
        <AlumnosTable
          alumnos={filteredAlumnos}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
        />
      )}

      <AlumnoForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        alumno={selectedAlumno}
        ubicaciones={ubicaciones}
        onSubmit={selectedAlumno ? handleUpdateAlumno : handleCreateAlumno}
        isLoading={isSubmitting}
      />

      <AlumnoDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        alumno={selectedAlumno}
        onConfirm={handleDeleteAlumno}
        isLoading={isSubmitting}
      />
    </div>
  )
}
