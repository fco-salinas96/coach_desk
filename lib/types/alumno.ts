export interface Ubicacion {
  id: string
  nombre: string
  direccion: string
  comuna: string
  id_coach: string
}

export interface Alumno {
  id: string
  nombre: string
  apellido: string
  telefono: string
  fecha_nacimiento: string | null
  direccion: string | null
  comuna: string | null
  genero: 'masculino' | 'femenino' | 'otro'
  fecha_primera_clase: string | null
  id_usuario: string
  id_coach: string
  id_ubicacion: string | null
  fecha_creacion: string
  ubicacion?: Ubicacion | null
}

export interface AlumnoFormData {
  nombre: string
  apellido: string
  telefono: string
  fecha_nacimiento: string
  direccion: string
  comuna: string
  genero: 'masculino' | 'femenino' | 'otro'
  fecha_primera_clase: string
  id_ubicacion: string
}
