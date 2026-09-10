-- ==============================================================================
-- SCHEMA SUPABASE : LE FARDEAU ET LE CHEMIN (荷と道)
-- Version 2.1 : Authentification, Profils, Avis Chapitres, Galerie Hanafuda & Webhooks Email Resend
-- ==============================================================================
-- Ce script est à exécuter dans le SQL Editor du Dashboard Supabase.
-- Il configure :
-- 1. Les types enum (user_role, proposal_status)
-- 2. La table public.profiles avec trigger d'auto-création pour biitsumajin@gmail.com (admin)
-- 3. La table public.chapter_reviews avec RLS strict
-- 4. La table public.hanafuda_proposals avec RLS strict
-- 5. Le bucket Supabase Storage 'hanafuda-images' (2 Mo max, jpg/png/webp)
-- 6. Les extensions Postgres et Webhooks / triggers pour notifier l'Edge Function send-email
-- ==============================================================================

-- 1. CRÉATION DES TYPES ENUM
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('reader', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.proposal_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TABLE DES PROFILS (public.profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('reader', 'admin')),
  hanko_seal_data JSONB DEFAULT '{}'::jsonb,
  saved_stations TEXT[] DEFAULT ARRAY[]::TEXT[],
  bookmarked_chapters INT[] DEFAULT ARRAY[]::INT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- RLS Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des profils" ON public.profiles;
CREATE POLICY "Lecture publique des profils"
  ON public.profiles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Insertion de son propre profil" ON public.profiles;
CREATE POLICY "Insertion de son propre profil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Mise a jour de son propre profil avec controle de role" ON public.profiles;
CREATE POLICY "Mise a jour de son propre profil avec controle de role"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id 
    OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
  )
  WITH CHECK (
    (auth.uid() = id AND (
      role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
      OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
      OR (EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin'
      ))
    ))
    OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ))
  );

-- Trigger d'auto-création de profil avec rôle Admin pour biitsumajin@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_display_name TEXT;
  v_assigned_role TEXT;
BEGIN
  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  IF v_display_name IS NULL OR length(trim(v_display_name)) = 0 THEN
    v_display_name := 'Voyageur du Tōkaidō';
  END IF;

  IF lower(NEW.email) = 'biitsumajin@gmail.com' THEN
    v_assigned_role := 'admin';
  ELSE
    v_assigned_role := 'reader';
  END IF;

  INSERT INTO public.profiles (id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    v_display_name,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    v_assigned_role
  )
  ON CONFLICT (id) DO UPDATE
  SET
    display_name = EXCLUDED.display_name,
    role = CASE 
      WHEN lower(NEW.email) = 'biitsumajin@gmail.com' THEN 'admin'
      ELSE profiles.role 
    END,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger updated_at générique
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 3. TABLE DES AVIS PAR CHAPITRE (public.chapter_reviews)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chapter_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INT NOT NULL CHECK (chapter_number >= 1 AND chapter_number <= 27),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (length(trim(comment)) > 0 AND length(comment) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_chapter_reviews_chapter ON public.chapter_reviews(chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapter_reviews_user ON public.chapter_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_chapter_reviews_created_at ON public.chapter_reviews(created_at DESC);

-- RLS Chapter Reviews
ALTER TABLE public.chapter_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture publique des avis de chapitre" ON public.chapter_reviews;
CREATE POLICY "Lecture publique des avis de chapitre"
  ON public.chapter_reviews
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Deposition d avis par utilisateur authentifie" ON public.chapter_reviews;
CREATE POLICY "Deposition d avis par utilisateur authentifie"
  ON public.chapter_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Modification d avis par son auteur ou admin" ON public.chapter_reviews;
CREATE POLICY "Modification d avis par son auteur ou admin"
  ON public.chapter_reviews
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
  )
  WITH CHECK (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
  );

DROP POLICY IF EXISTS "Suppression d avis par son auteur ou admin" ON public.chapter_reviews;
CREATE POLICY "Suppression d avis par son auteur ou admin"
  ON public.chapter_reviews
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
  );

DROP TRIGGER IF EXISTS tr_chapter_reviews_updated_at ON public.chapter_reviews;
CREATE TRIGGER tr_chapter_reviews_updated_at
  BEFORE UPDATE ON public.chapter_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 4. TABLE DES PROPOSITIONS HANAFUDA (public.hanafuda_proposals)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hanafuda_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL CHECK (chapter_number >= 1 AND chapter_number <= 27),
  card_title TEXT NOT NULL CHECK (length(trim(card_title)) > 0 AND length(card_title) <= 120),
  kanji VARCHAR(10) NOT NULL,
  symbol TEXT NOT NULL,
  description TEXT NOT NULL CHECK (length(trim(description)) > 0 AND length(description) <= 1500),
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderation_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_hanafuda_status ON public.hanafuda_proposals(status);
CREATE INDEX IF NOT EXISTS idx_hanafuda_user ON public.hanafuda_proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_hanafuda_chapter ON public.hanafuda_proposals(chapter_number);
CREATE INDEX IF NOT EXISTS idx_hanafuda_created_at ON public.hanafuda_proposals(created_at DESC);

-- RLS Hanafuda Proposals
ALTER TABLE public.hanafuda_proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lecture des cartes Hanafuda approuvees ou propres ou admin" ON public.hanafuda_proposals;
CREATE POLICY "Lecture des cartes Hanafuda approuvees ou propres ou admin"
  ON public.hanafuda_proposals
  FOR SELECT
  USING (
    status = 'approved'
    OR (auth.uid() = user_id)
    OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
  );

DROP POLICY IF EXISTS "Soumission de proposition Hanafuda par membre" ON public.hanafuda_proposals;
CREATE POLICY "Soumission de proposition Hanafuda par membre"
  ON public.hanafuda_proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      status = 'pending'
      OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
      OR (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
      ))
    )
  );

DROP POLICY IF EXISTS "Moderation et modification des propositions Hanafuda" ON public.hanafuda_proposals;
CREATE POLICY "Moderation et modification des propositions Hanafuda"
  ON public.hanafuda_proposals
  FOR UPDATE
  USING (
    (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
    OR (auth.uid() = user_id AND status = 'pending')
  )
  WITH CHECK (
    (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
    OR (auth.uid() = user_id AND status = 'pending')
  );

DROP POLICY IF EXISTS "Suppression des propositions Hanafuda" ON public.hanafuda_proposals;
CREATE POLICY "Suppression des propositions Hanafuda"
  ON public.hanafuda_proposals
  FOR DELETE
  USING (
    (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
    OR (EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    ))
    OR (auth.uid() = user_id AND status = 'pending')
  );

DROP TRIGGER IF EXISTS tr_hanafuda_updated_at ON public.hanafuda_proposals;
CREATE TRIGGER tr_hanafuda_updated_at
  BEFORE UPDATE ON public.hanafuda_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 5. BUCKET SUPABASE STORAGE 'hanafuda-images' & POLITIQUES DE STOCKAGE
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hanafuda-images',
  'hanafuda-images',
  true,
  2097152, -- 2 Mo max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Lecture publique des images Hanafuda" ON storage.objects;
CREATE POLICY "Lecture publique des images Hanafuda"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hanafuda-images');

DROP POLICY IF EXISTS "Depot d images Hanafuda par membres authentifies" ON storage.objects;
CREATE POLICY "Depot d images Hanafuda par membres authentifies"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hanafuda-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Gestion de ses propres images Hanafuda ou admin" ON storage.objects;
CREATE POLICY "Gestion de ses propres images Hanafuda ou admin"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'hanafuda-images'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (auth.jwt() ->> 'email' = 'biitsumajin@gmail.com')
      OR (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
      ))
    )
  );

-- ==============================================================================
-- 6. CONFIGURATION DES WEBHOOKS & NOTIFICATIONS AUTOMATIQUES (send-email)
-- ==============================================================================
-- Deux méthodes au choix pour relier les événements de base de données à l'Edge Function :
--
-- MÉTHODE A (Recommandée & Moderne) : Dashboard Supabase Webhooks
-- 1. Rendez-vous dans : Dashboard Supabase > Integrations / Database > Webhooks
-- 2. Créer un nouveau Webhook :
--    - Nom : "Notification Nouvel Avis"
--    - Table : public.chapter_reviews (Événement : INSERT)
--    - Type : Supabase Edge Functions > Sélectionner "send-email"
--    - Method : POST
-- 3. Créer un second Webhook :
--    - Nom : "Notification Nouvelle Carte Hanafuda"
--    - Table : public.hanafuda_proposals (Événement : INSERT)
--    - Type : Supabase Edge Functions > Sélectionner "send-email"
--
-- MÉTHODE B (Postgres pg_net / HTTP direct via SQL) :
-- Si vous utilisez pg_net pour appeler l'Edge Function directement depuis un trigger Postgres :

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Fonction de déclenchement générique pour appeler l'Edge Function
CREATE OR REPLACE FUNCTION public.notify_admin_on_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_supabase_url TEXT;
  v_anon_key TEXT;
  v_edge_function_url TEXT;
  v_payload JSONB;
  v_author_name TEXT;
BEGIN
  -- Récupération du pseudo de l'auteur
  SELECT display_name INTO v_author_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  IF v_author_name IS NULL THEN
    v_author_name := 'Voyageur du Tōkaidō';
  END IF;

  -- Détermination du type d'événement
  IF TG_TABLE_NAME = 'chapter_reviews' THEN
    v_payload := jsonb_build_object(
      'type', 'new_review',
      'customData', jsonb_build_object(
        'chapter_number', NEW.chapter_number,
        'display_name', v_author_name,
        'rating', NEW.rating,
        'comment', NEW.comment
      )
    );
  ELSIF TG_TABLE_NAME = 'hanafuda_proposals' THEN
    v_payload := jsonb_build_object(
      'type', 'new_hanafuda',
      'customData', jsonb_build_object(
        'chapter_number', NEW.chapter_number,
        'display_name', v_author_name,
        'card_title', NEW.card_title,
        'kanji', NEW.kanji,
        'symbol', NEW.symbol,
        'description', NEW.description,
        'image_url', NEW.image_url
      )
    );
  ELSIF TG_TABLE_NAME = 'profiles' THEN
    v_payload := jsonb_build_object(
      'type', 'new_member',
      'customData', jsonb_build_object(
        'display_name', NEW.display_name
      )
    );
  END IF;

  -- Note : Si configuré avec pg_net, décommentez et remplacez par votre URL de projet :
  /*
  PERFORM net.http_post(
    url := 'https://<VOTRE-PROJECT-REF>.supabase.co/functions/v1/send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <VOTRE-ANON-KEY>'
    ),
    body := v_payload
  );
  */

  RETURN NEW;
END;
$$;

-- Triggers d'activation
DROP TRIGGER IF EXISTS tr_notify_new_review ON public.chapter_reviews;
CREATE TRIGGER tr_notify_new_review
  AFTER INSERT ON public.chapter_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_event();

DROP TRIGGER IF EXISTS tr_notify_new_hanafuda ON public.hanafuda_proposals;
CREATE TRIGGER tr_notify_new_hanafuda
  AFTER INSERT ON public.hanafuda_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_event();

-- Commentaires de documentation
COMMENT ON TABLE public.chapter_reviews IS 'Registre des avis, critiques et notes de lecture pour chaque chapitre du roman';
COMMENT ON TABLE public.hanafuda_proposals IS 'Galerie participative des cartes de jeu Hanafuda associées aux 26 chapitres et à l épilogue';
