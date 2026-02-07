-- =============================================
-- SCHEMA DE BASE DE DATOS PARA APP DE CLASES
-- Multi-tenant con Coach como tenant principal
-- =============================================

-- 1. TABLA COACH (Tenant Principal)
CREATE TABLE public.coach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  dominio TEXT UNIQUE NOT NULL,
  id_usuario UUID REFERENCES auth.users(id) ON DELETE RESTRICT UNIQUE NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLA ROL_USUARIO (RBAC)
CREATE TABLE public.rol_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rol TEXT NOT NULL CHECK (rol IN ('coach', 'alumno')),
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  id_usuario UUID REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_coach, id_usuario)
);

CREATE INDEX idx_rol_usuario_coach ON public.rol_usuario(id_coach);
CREATE INDEX idx_rol_usuario_usuario ON public.rol_usuario(id_usuario);

-- 3. TABLA ALUMNO
CREATE TABLE public.alumno (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT NOT NULL,
  fecha_nacimiento DATE,
  direccion TEXT,
  comuna TEXT,
  genero TEXT NOT NULL CHECK (genero IN ('masculino', 'femenino','otro')),
  fecha_primera_clase DATE,
  id_usuario UUID REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  id_ubicacion UUID REFERENCES public.ubicacion(id) ON DELETE SET NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_coach, id_usuario)
);

CREATE INDEX idx_alumno_coach ON public.alumno(id_coach);
CREATE INDEX idx_alumno_usuario ON public.alumno(id_usuario);
CREATE INDEX idx_alumno_ubicacion ON public.alumno(id_ubicacion);

-- 4. TABLA UBICACION
CREATE TABLE public.ubicacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  comuna TEXT NOT NULL,
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ubicacion_coach ON public.ubicacion(id_coach);

-- 4.1 TABLA TIPO_CLASE
CREATE TABLE public.tipo_clase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  modalidad TEXT NOT NULL CHECK (modalidad IN ('club', 'domicilio')),
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now(),
  UNIQUE(id_coach, nombre)
);

CREATE INDEX idx_tipo_clase_coach ON public.tipo_clase(id_coach);

CREATE TYPE public.dia_semana AS ENUM (
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo'
);

-- 5. TABLA PRECIOS
CREATE TABLE public.precios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  id_tipo_clase UUID REFERENCES public.tipo_clase(id) ON DELETE RESTRICT NOT NULL,
  id_ubicacion UUID REFERENCES public.ubicacion(id) ON DELETE RESTRICT,
  dias public.dia_semana[] NOT NULL,
  hora_inicio TIME NOT NULL DEFAULT '00:00',
  hora_fin    TIME NOT NULL DEFAULT '23:59',
  precio DECIMAL(10,2) NOT NULL,
  costo DECIMAL(10,2),
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_precios_coach ON public.precios(id_coach);
CREATE INDEX idx_precios_tipo_clase ON public.precios(id_tipo_clase);
CREATE INDEX idx_precios_ubicacion ON public.precios(id_ubicacion);

-- 6. TABLA PRECIOS_HISTORICO
CREATE TABLE public.precios_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  id_tipo_clase UUID REFERENCES public.tipo_clase(id) ON DELETE RESTRICT NOT NULL,
  id_ubicacion UUID REFERENCES public.ubicacion(id) ON DELETE RESTRICT,
  dias public.dia_semana[] NOT NULL,
  hora_inicio TIME NOT NULL DEFAULT '00:00',
  hora_fin    TIME NOT NULL DEFAULT '23:59',
  precio DECIMAL(10,2) NOT NULL,
  costo DECIMAL(10,2),
  fecha_inicio_validez DATE NOT NULL,
  fecha_fin_validez DATE,
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now()
);

-- 7. TABLA CLASES
CREATE TABLE public.clases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_alumno UUID REFERENCES public.alumno(id) ON DELETE RESTRICT NOT NULL,
  id_ubicacion UUID REFERENCES public.ubicacion(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  id_tipo_clase UUID REFERENCES public.tipo_clase(id) ON DELETE RESTRICT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descuento DECIMAL(10,2) DEFAULT 0,
  precio_final DECIMAL(10,2) NOT NULL,
  cancelada BOOLEAN DEFAULT false,
  realizada BOOLEAN DEFAULT false,
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clases_coach ON public.clases(id_coach);
CREATE INDEX idx_clases_alumno ON public.clases(id_alumno);
CREATE INDEX idx_clases_fecha ON public.clases(fecha);

CREATE TYPE public.metodo_pago AS ENUM (
  'efectivo',
  'transferencia',
  'debito',
  'credito'
);

-- 8. TABLA PAGOS
CREATE TABLE public.pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_alumno UUID REFERENCES public.alumno(id) ON DELETE RESTRICT NOT NULL,
  fecha DATE NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago public.metodo_pago NOT NULL,
  descripcion TEXT,
  id_coach UUID REFERENCES public.coach(id) ON DELETE RESTRICT NOT NULL,
  fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pagos_coach ON public.pagos(id_coach);
CREATE INDEX idx_pagos_alumno ON public.pagos(id_alumno);
CREATE INDEX idx_pagos_fecha ON public.pagos(fecha);
