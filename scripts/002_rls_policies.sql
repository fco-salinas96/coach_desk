-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-tenant con roles diferenciados
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.coach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rol_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipo_clase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.precios_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- FUNCIONES HELPER PARA RLS
-- =============================================

-- Obtener el coach_id del usuario autenticado (si es coach)
CREATE OR REPLACE FUNCTION get_my_coach_id()
RETURNS UUID AS $$
  SELECT id FROM public.coach WHERE id_usuario = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Obtener el coach_id del alumno autenticado
CREATE OR REPLACE FUNCTION get_my_coach_id_as_alumno()
RETURNS UUID AS $$
  SELECT id_coach FROM public.alumno WHERE id_usuario = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Verificar si el usuario es coach
CREATE OR REPLACE FUNCTION is_coach()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.coach WHERE id_usuario = auth.uid()
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Verificar si el usuario es alumno
CREATE OR REPLACE FUNCTION is_alumno()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.alumno WHERE id_usuario = auth.uid()
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;


-- =============================================
-- POLICIES PARA ALUMNO
-- =============================================

CREATE POLICY "alumno_coach_select" ON public.alumno
  FOR SELECT USING (id_coach = get_my_coach_id());

CREATE POLICY "alumno_coach_insert" ON public.alumno
  FOR INSERT WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY "alumno_coach_update" ON public.alumno
  FOR UPDATE USING (id_coach = get_my_coach_id())
  WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY "alumno_coach_delete" ON public.alumno
  FOR DELETE USING (id_coach = get_my_coach_id());

-- =============================================
-- POLICIES PARA UBICACION
-- =============================================

CREATE POLICY "ubicacion_coach_select" ON public.ubicacion
  FOR SELECT USING (id_coach = get_my_coach_id());

CREATE POLICY "ubicacion_coach_insert" ON public.ubicacion
  FOR INSERT WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY "ubicacion_coach_update" ON public.ubicacion
  FOR UPDATE USING (id_coach = get_my_coach_id())
  WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY "ubicacion_coach_delete" ON public.ubicacion
  FOR DELETE USING (id_coach = get_my_coach_id());

-- =============================================
-- POLICIES PARA PRECIOS
-- =============================================

CREATE POLICY precios_coach_select
ON public.precios
FOR SELECT
USING (id_coach = get_my_coach_id());

CREATE POLICY precios_coach_insert
ON public.precios
FOR INSERT
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY precios_coach_update
ON public.precios
FOR UPDATE
USING (id_coach = get_my_coach_id())
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY precios_coach_delete
ON public.precios
FOR DELETE
USING (id_coach = get_my_coach_id());

-- =============================================
-- POLICIES PARA PRECIOS_HISTORICO
-- =============================================

CREATE POLICY precios_historico_coach_select
ON public.precios_historico
FOR SELECT
USING (id_coach = get_my_coach_id());

CREATE POLICY precios_historico_coach_insert
ON public.precios_historico
FOR INSERT
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY precios_historico_coach_update
ON public.precios_historico
FOR UPDATE
USING (id_coach = get_my_coach_id())
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY precios_historico_coach_delete
ON public.precios_historico
FOR DELETE
USING (id_coach = get_my_coach_id());

-- =============================================
-- POLICIES PARA CLASES
-- =============================================

CREATE POLICY clases_coach_select
ON public.clases
FOR SELECT
USING (id_coach = get_my_coach_id());

CREATE POLICY clases_coach_insert
ON public.clases
FOR INSERT
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY clases_coach_update
ON public.clases
FOR UPDATE
USING (id_coach = get_my_coach_id())
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY clases_coach_delete
ON public.clases
FOR DELETE
USING (id_coach = get_my_coach_id());


CREATE POLICY clases_alumno_select
ON public.clases
FOR SELECT USING (
  id_alumno IN (
    SELECT id FROM public.alumno WHERE id_usuario = auth.uid()
  )
);

-- =============================================
-- POLICIES PARA TIPO CLASE
-- =============================================

CREATE POLICY tipo_clase_coach_select
ON public.tipo_clase
FOR SELECT
USING (id_coach = get_my_coach_id());

CREATE POLICY tipo_clase_coach_insert
ON public.tipo_clase
FOR INSERT
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY tipo_clase_coach_update
ON public.tipo_clase
FOR UPDATE
USING (id_coach = get_my_coach_id())
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY tipo_clase_coach_delete
ON public.tipo_clase
FOR DELETE
USING (id_coach = get_my_coach_id());

-- =============================================
-- POLICIES PARA PAGOS
-- =============================================

CREATE POLICY pagos_coach_select
ON public.pagos
FOR SELECT
USING (id_coach = get_my_coach_id());

CREATE POLICY pagos_coach_insert
ON public.pagos
FOR INSERT
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY pagos_coach_update
ON public.pagos
FOR UPDATE
USING (id_coach = get_my_coach_id())
WITH CHECK (id_coach = get_my_coach_id());

CREATE POLICY pagos_coach_delete
ON public.pagos
FOR DELETE
USING (id_coach = get_my_coach_id());


CREATE POLICY pagos_alumno_select
ON public.pagos
FOR SELECT USING (
  id_alumno IN (
    SELECT id FROM public.alumno WHERE id_usuario = auth.uid()
  )
);
