-- =====================================================================================
-- SCRIPT DE INSERCIÓN DE USUARIOS: COLEGIO ENRIQUE WITHE
-- =====================================================================================
-- Instrucciones para ejecutar:
-- 1. Abre tu Supabase Dashboard: https://supabase.com/dashboard/project/igdokomdqplamqwbuzat
-- 2. Ve a "SQL Editor" en el menú lateral izquierdo.
-- 3. Haz clic en "New Query".
-- 4. Pega todo este código SQL y haz clic en "Run" (o presiona Ctrl + Enter).
-- =====================================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_tenant_id uuid;
  v_default_password text := 'EnriqueWithe2026!';
  v_encrypted_pw text;
  r record;
  v_user_id uuid;
BEGIN
  -- 1. Generar hash de la contraseña por defecto
  v_encrypted_pw := extensions.crypt(v_default_password, extensions.gen_salt('bf'));

  -- 2. Obtener o crear el Tenant "Colegio Enrique Withe"
  SELECT id INTO v_tenant_id FROM public.tenants WHERE lower(name) = lower('Colegio Enrique Withe') OR slug = 'colegio-enrique-withe' LIMIT 1;

  IF v_tenant_id IS NULL THEN
    INSERT INTO public.tenants (name, slug, settings)
    VALUES (
      'Colegio Enrique Withe',
      'colegio-enrique-withe',
      '{"school_name": "Colegio Enrique Withe", "city": "Colombia"}'::jsonb
    )
    RETURNING id INTO v_tenant_id;
    RAISE NOTICE 'Tenant creado con ID: %', v_tenant_id;
  ELSE
    RAISE NOTICE 'Tenant existente encontrado con ID: %', v_tenant_id;
  END IF;

  -- 3. Crear tabla temporal con los registros procesados
  CREATE TEMP TABLE temp_alumnos_withe (
    full_name text,
    grado text,
    email text,
    username text,
    phone text
  ) ON COMMIT DROP;

  INSERT INTO temp_alumnos_withe (full_name, grado, email, username, phone) VALUES
    ('María Fernanda Álvarez David', '701', 'Guisaojuanpablo7@gmail.com', 'maria.alvarez', NULL),
    ('Anny Sofia Usme Hurtado', '701', 'Annyusme14@gmail.com', 'anny.usme', NULL),
    ('Juan David Isaza Pérez', '701', 'Isazaperezjuandavid1@gmail.com', 'juan.isaza', NULL),
    ('Melany A. Gómez Sánchez', '701', 'Mg6652969@gmail.com', 'melany.gomez', '3229156276'),
    ('Karoll Thaliana Estrada Vargas', '701', 'Linaalejandraestrada48@gmail.com', 'karoll.estrada', NULL),
    ('Freidymar Moreno Rodríguez', '701', 'rodriguezninoska@gmail.com', 'freidymar.moreno', '3133883671'),
    ('Santiago Israel Moy Sosa', '601', 'santiagoisraelmoysosa@gmail.com', 'santiago.moy', '3122423862'),
    ('Joan Estiven Chanci Flórez', '803', 'Estivenflorez1047@gmail.com', 'joan.chanci', NULL),
    ('Cristian D Osorio Giraldo', '803', 'Crisitiandanielosoriogiraldo@gmail.com', 'cristian.osorio', NULL),
    ('Franklin Sepúlveda Guisao', '803', 'franklin.sepulveda@enriquewithe.edu.co', 'franklin.sepulveda', NULL),
    ('Vaioleth Bedoya Usuga', '604', 'bedoyavaiollet@gmail.com', 'vaioleth.bedoya', NULL),
    ('María Alejandra Gómez Usuga', '803', 'Mariagomsuga11@gmail.com', 'maria.gomez', NULL),
    ('Issis J. Durango Usuga', '803', 'durangoissis@gmail.com', 'issis.durango', NULL),
    ('Eileen J. Higuita Moreno', '803', 'joselinmorenohiguita@gmail.com', 'eileen.higuita', NULL),
    ('Ana María Higuita Benitez', '803', 'anamariahiguitabenitez@gmail.com', 'ana.higuita', NULL),
    ('Kevin A Domico Domico', '703', 'kevin.domico@enriquewithe.edu.co', 'kevin.domico', NULL),
    ('Manuel A. Sánchez puerta', '603', 'alejandrosanchez@gmail.com', 'manuel.sanchez', NULL),
    ('Alejandro Acevedo Cano', '603', 'Alejandroacevedo2026@gmail.com', 'alejandro.acevedo', NULL),
    ('Valery D Giraldo parra', '603', 'giraldoparrawaleridahian123@gmail.com', 'valery.giraldo', '3012321252'),
    ('Emanuel Oquendo Gómez', '602', 'emanuel.oquendo@enriquewithe.edu.co', 'emanuel.oquendo', NULL),
    ('Salome Higuita Posada', '801', 'salomehiguitaposada@gmail.com', 'salome.higuita', NULL),
    ('Maia Hernández Correa', '804', 'Hernandezmaia1531@gmail.com', 'maia.hernandez', NULL),
    ('Michel D. Oquendo Gañan', '804', 'micheldahianaoquendo@gmail.com', 'michel.oquendo', NULL),
    ('Mariangel Henao Jiménez', '701', 'Rodolfohenao75@hotmail.com', 'mariangel.henao', NULL),
    ('Jhojan Emanuel David', '601', 'jhojan.david@enriquewithe.edu.co', 'jhojan.david', NULL),
    ('Mariangel Henao Jiménez (702)', '702', 'mariangel.henao702@enriquewithe.edu.co', 'mariangel.henao2', NULL),
    ('Ismari Celismar Moy Delgado', '702', 'ismaricelismarmoy@gmail.com', 'ismari.moy', '3104507878'),
    ('Nelson Bailarín mejoré', '603', 'deisonmajore@gmail.com', 'nelson.bailarin', NULL),
    ('Gareth Yesid Mosquera Córdoba', '602', 'Yesid2014mosquera@gmail.com', 'gareth.mosquera', NULL);

  -- 4. Iterar e insertar/actualizar cada estudiante
  FOR r IN SELECT * FROM temp_alumnos_withe LOOP
    -- Buscar si ya existe el usuario por email
    SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(r.email) LIMIT 1;

    IF v_user_id IS NULL THEN
      -- Crear usuario en auth.users
      v_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change
      ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'authenticated',
        'authenticated',
        lower(r.email),
        v_encrypted_pw,
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object(
          'full_name', r.full_name,
          'username', lower(r.username),
          'grado', r.grado,
          'phone', r.phone
        ),
        now(),
        now(),
        '',
        '',
        '',
        ''
      );
      RAISE NOTICE 'Usuario auth creado: % (%) -> ID: %', r.full_name, r.username, v_user_id;
    ELSE
      -- Actualizar metadata y contraseña si ya existía
      UPDATE auth.users
      SET
        raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
          'full_name', r.full_name,
          'username', lower(r.username),
          'grado', r.grado,
          'phone', r.phone
        ),
        updated_at = now()
      WHERE id = v_user_id;
      RAISE NOTICE 'Usuario auth existente actualizado: % (%) -> ID: %', r.full_name, r.username, v_user_id;
    END IF;

    -- 5. Crear o actualizar perfil en public.profiles
    INSERT INTO public.profiles (user_id, full_name, email, username)
    VALUES (
      v_user_id,
      r.full_name,
      lower(r.email),
      lower(r.username)
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      username = EXCLUDED.username;

    -- 6. Asignar rol de 'student' en public.user_roles para el colegio
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND tenant_id = v_tenant_id
    ) THEN
      INSERT INTO public.user_roles (user_id, tenant_id, role)
      VALUES (v_user_id, v_tenant_id, 'student');
    END IF;

  END LOOP;

  RAISE NOTICE '¡Proceso completado exitosamente para Colegio Enrique Withe!';
END $$;

-- 7. Consulta de verificación: Listar todos los estudiantes creados para Colegio Enrique Withe
SELECT 
  t.name AS colegio,
  p.full_name AS nombre_estudiante,
  p.username AS nombre_usuario,
  p.email AS correo,
  (u.raw_user_meta_data->>'grado') AS grado,
  (u.raw_user_meta_data->>'phone') AS telefono,
  ur.role AS rol
FROM public.user_roles ur
JOIN public.tenants t ON t.id = ur.tenant_id
JOIN public.profiles p ON p.user_id = ur.user_id
JOIN auth.users u ON u.id = ur.user_id
WHERE t.name ILIKE '%Enrique Withe%'
ORDER BY (u.raw_user_meta_data->>'grado'), p.full_name;
