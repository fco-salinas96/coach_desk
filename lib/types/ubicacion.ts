export interface Ubicacion {
  id: string
  nombre: string
  direccion: string
  comuna: string
  id_coach: string
  fecha_creacion: string
}

export interface UbicacionFormData {
  nombre: string
  direccion: string
  comuna: string
}
