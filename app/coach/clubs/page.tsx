'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { ClubsTable } from '@/components/coach/clubs-table'
import { ClubForm } from '@/components/coach/club-form'
import { ClubDeleteDialog } from '@/components/coach/club-delete-dialog'
import type { Ubicacion, UbicacionFormData } from '@/lib/types/ubicacion'

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Ubicacion[]>([])
  const [filteredClubs, setFilteredClubs] = useState<Ubicacion[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedClub, setSelectedClub] = useState<Ubicacion | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coachId, setCoachId] = useState<string | null>(null)

  useEffect(() => {
    fetchCoachAndClubs()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      setFilteredClubs(
        clubs.filter(
          (club) =>
            club.nombre.toLowerCase().includes(query) ||
            club.direccion.toLowerCase().includes(query) ||
            club.comuna.toLowerCase().includes(query)
        )
      )
    } else {
      setFilteredClubs(clubs)
    }
  }, [searchQuery, clubs])

  const fetchCoachAndClubs = async () => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: coachData, error: coachError } = await supabase
        .from('coach')
        .select('id')
        .eq('id_usuario', user.id)
        .single()

      if (coachError) throw coachError
      setCoachId(coachData.id)

      const { data: clubsData, error: clubsError } = await supabase
        .from('ubicacion')
        .select('*')
        .eq('id_coach', coachData.id)
        .order('nombre', { ascending: true })

      if (clubsError) throw clubsError
      setClubs(clubsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateClub = async (data: UbicacionFormData) => {
    if (!coachId) return
    const supabase = createClient()
    setIsSubmitting(true)

    try {
      const { data: newClub, error } = await supabase
        .from('ubicacion')
        .insert({
          nombre: data.nombre,
          direccion: data.direccion,
          comuna: data.comuna,
          id_coach: coachId,
        })
        .select()
        .single()

      if (error) throw error
      setClubs([...clubs, newClub])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateClub = async (data: UbicacionFormData) => {
    if (!selectedClub) return
    const supabase = createClient()
    setIsSubmitting(true)

    try {
      const { data: updatedClub, error } = await supabase
        .from('ubicacion')
        .update({
          nombre: data.nombre,
          direccion: data.direccion,
          comuna: data.comuna,
        })
        .eq('id', selectedClub.id)
        .select()
        .single()

      if (error) throw error
      setClubs(
        clubs.map((c) => (c.id === selectedClub.id ? updatedClub : c))
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClub = async () => {
    if (!selectedClub) return
    const supabase = createClient()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('ubicacion')
        .delete()
        .eq('id', selectedClub.id)

      if (error) throw error
      setClubs(clubs.filter((c) => c.id !== selectedClub.id))
      setIsDeleteOpen(false)
      setSelectedClub(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditForm = (club: Ubicacion) => {
    setSelectedClub(club)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (club: Ubicacion) => {
    setSelectedClub(club)
    setIsDeleteOpen(true)
  }

  const openCreateForm = () => {
    setSelectedClub(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clubs</h1>
          <p className="text-muted-foreground">
            Gestiona tus clubs y ubicaciones
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Club
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando clubs...</p>
        </div>
      ) : (
        <ClubsTable
          clubs={filteredClubs}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
        />
      )}

      <ClubForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        club={selectedClub}
        onSubmit={selectedClub ? handleUpdateClub : handleCreateClub}
        isLoading={isSubmitting}
      />

      <ClubDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        club={selectedClub}
        onConfirm={handleDeleteClub}
        isLoading={isSubmitting}
      />
    </div>
  )
}
