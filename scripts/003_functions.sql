-- =============================================
-- FUNCIONES DE UTILIDAD
-- =============================================

-- Función para crear un nuevo coach (signup de coach)
CREATE OR REPLACE FUNCTION create_coach(
  p_nombre TEXT,
  p_dominio TEXT
)
RETURNS UUID AS $$
DECLARE
  v_coach_id UUID;
BEGIN
  -- Insertar el coach
  INSERT INTO public.coach (nombre, dominio, id_usuario)
  VALUES (p_nombre, p_dominio, auth.uid())
  RETURNING id INTO v_coach_id;
  
  -- Crear el rol de coach para este usuario
  INSERT INTO public.rol_usuario (rol, id_coach, id_usuario)
  VALUES ('coach', v_coach_id, auth.uid());
  
  RETURN v_coach_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para registrar un alumno con cuenta de usuario
CREATE OR REPLACE FUNCTION register_alumno_with_user(
  p_alumno_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_coach_id UUID;
BEGIN
  -- Obtener el coach_id del alumno
  SELECT id_coach INTO v_coach_id
  FROM public.alumno
  WHERE id = p_alumno_id;
  
  -- Verificar que el usuario que ejecuta es el coach
  IF v_coach_id != get_my_coach_id() THEN
    RAISE EXCEPTION 'No tienes permiso para esta acción';
  END IF;
  
  -- Actualizar el alumno con el id de usuario
  UPDATE public.alumno
  SET id_usuario = p_user_id
  WHERE id = p_alumno_id;
  
  -- Crear el rol de alumno
  INSERT INTO public.rol_usuario (rol, id_coach, id_usuario)
  VALUES ('alumno', v_coach_id, p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el resumen de clases de un mes
CREATE OR REPLACE FUNCTION get_monthly_class_summary(
  p_year INTEGER,
  p_month INTEGER
)
RETURNS TABLE (
  total_clases BIGINT,
  clases_realizadas BIGINT,
  clases_canceladas BIGINT,
  ingresos_esperados DECIMAL,
  ingresos_realizados DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_clases,
    COUNT(*) FILTER (WHERE realizada = true)::BIGINT as clases_realizadas,
    COUNT(*) FILTER (WHERE cancelada = true)::BIGINT as clases_canceladas,
    COALESCE(SUM(precio_final), 0) as ingresos_esperados,
    COALESCE(SUM(precio_final) FILTER (WHERE realizada = true), 0) as ingresos_realizados
  FROM public.clases
  WHERE id_coach = get_my_coach_id()
    AND EXTRACT(YEAR FROM fecha) = p_year
    AND EXTRACT(MONTH FROM fecha) = p_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Función para obtener balance de un alumno
CREATE OR REPLACE FUNCTION get_alumno_balance(p_alumno_id UUID)
RETURNS TABLE (
  total_clases DECIMAL,
  total_pagos DECIMAL,
  balance DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE((
      SELECT SUM(precio_final)
      FROM public.clases
      WHERE id_alumno = p_alumno_id
        AND realizada = true
        AND id_coach = get_my_coach_id()
    ), 0) as total_clases,
    COALESCE((
      SELECT SUM(monto)
      FROM public.pagos
      WHERE id_alumno = p_alumno_id
        AND id_coach = get_my_coach_id()
    ), 0) as total_pagos,
    COALESCE((
      SELECT SUM(monto)
      FROM public.pagos
      WHERE id_alumno = p_alumno_id
        AND id_coach = get_my_coach_id()
    ), 0) - COALESCE((
      SELECT SUM(precio_final)
      FROM public.clases
      WHERE id_alumno = p_alumno_id
        AND realizada = true
        AND id_coach = get_my_coach_id()
    ), 0) as balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Función para obtener el coach por dominio (para login)
CREATE OR REPLACE FUNCTION get_coach_by_domain(p_dominio TEXT)
RETURNS TABLE (
  id UUID,
  nombre TEXT,
  dominio TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.nombre, c.dominio
  FROM public.coach c
  WHERE c.dominio = p_dominio;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Función para verificar acceso de usuario a un dominio
CREATE OR REPLACE FUNCTION verify_user_domain_access(p_dominio TEXT)
RETURNS TABLE (
  has_access BOOLEAN,
  rol TEXT,
  coach_id UUID
) AS $$
DECLARE
  v_coach_id UUID;
BEGIN
  -- Obtener el coach_id del dominio
  SELECT c.id INTO v_coach_id
  FROM public.coach c
  WHERE c.dominio = p_dominio;
  
  IF v_coach_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::UUID;
    RETURN;
  END IF;
  
  -- Verificar si el usuario tiene acceso a este dominio
  RETURN QUERY
  SELECT 
    true,
    ru.rol,
    ru.id_coach
  FROM public.rol_usuario ru
  WHERE ru.id_coach = v_coach_id
    AND ru.id_usuario = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
