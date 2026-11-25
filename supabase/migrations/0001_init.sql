-- Elena Fit · esquema inicial (para cuando se pase de demo a producción).
-- Datos de salud = categoría especial RGPD: RLS obligatoria en todas las tablas.

create type user_role as enum ('coach', 'client');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'client',
  full_name text not null,
  goal text,
  created_at timestamptz not null default now()
);

create table coach_clients (
  coach_id uuid not null references profiles(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  mode text not null check (mode in ('online', 'presencial', 'hibrido')),
  active boolean not null default true,
  primary key (coach_id, client_id)
);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle text not null,
  video_url text
);

create table workouts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  is_template boolean not null default false
);

create table workout_exercises (
  workout_id uuid not null references workouts(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  position int not null,
  sets int not null,
  reps text not null,
  target_kg numeric(6,2),
  rest_seconds int not null default 60,
  primary key (workout_id, position)
);

create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  workout_id uuid not null references workouts(id),
  exercise_id uuid not null references exercises(id),
  log_date date not null default current_date,
  set_number int not null,
  reps int,
  kg numeric(6,2)
);

create table foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  serving text not null,
  kcal int not null,
  protein numeric(6,1) not null default 0,
  carbs numeric(6,1) not null default 0,
  fat numeric(6,1) not null default 0
);

create table meal_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  kcal_target int not null,
  protein_target int not null,
  carbs_target int not null,
  fat_target int not null
);

create table food_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  food_id uuid references foods(id),
  name text not null,
  log_date date not null default current_date,
  kcal int not null,
  protein numeric(6,1) not null default 0,
  carbs numeric(6,1) not null default 0,
  fat numeric(6,1) not null default 0
);

create table body_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  log_date date not null default current_date,
  weight_kg numeric(5,1),
  waist_cm numeric(5,1),
  hip_cm numeric(5,1),
  unique (client_id, log_date)
);

create table progress_photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  storage_path text not null, -- bucket PRIVADO
  taken_on date not null default current_date
);

-- ─── RLS ────────────────────────────────────────────────────────────────
alter table profiles          enable row level security;
alter table coach_clients     enable row level security;
alter table workouts          enable row level security;
alter table workout_logs      enable row level security;
alter table meal_plans        enable row level security;
alter table food_logs         enable row level security;
alter table body_metrics      enable row level security;
alter table progress_photos   enable row level security;

create function is_coach_of(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from coach_clients
    where coach_id = auth.uid() and client_id = target and active
  );
$$;

create policy "own profile or my clients" on profiles for select
  using (id = auth.uid() or is_coach_of(id));

create policy "own logs or my clients" on workout_logs for all
  using (client_id = auth.uid() or is_coach_of(client_id))
  with check (client_id = auth.uid());

create policy "own food or my clients" on food_logs for all
  using (client_id = auth.uid() or is_coach_of(client_id))
  with check (client_id = auth.uid());

create policy "own metrics or my clients" on body_metrics for all
  using (client_id = auth.uid() or is_coach_of(client_id))
  with check (client_id = auth.uid());

create policy "own plan or my clients" on meal_plans for all
  using (client_id = auth.uid() or is_coach_of(client_id))
  with check (is_coach_of(client_id));

create policy "own photos or my clients" on progress_photos for all
  using (client_id = auth.uid() or is_coach_of(client_id))
  with check (client_id = auth.uid());

create policy "coach sees own relations" on coach_clients for select
  using (coach_id = auth.uid() or client_id = auth.uid());

create policy "own or assigned workouts" on workouts for all
  using (owner_id = auth.uid() or is_coach_of(owner_id))
  with check (owner_id = auth.uid());
