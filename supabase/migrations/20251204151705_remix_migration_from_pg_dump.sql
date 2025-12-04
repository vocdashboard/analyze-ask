CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: livechat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.livechat_messages (
    id text NOT NULL,
    session_id text NOT NULL,
    sender text NOT NULL,
    sender_name text,
    message text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: livechat_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.livechat_sessions (
    id text NOT NULL,
    user_id text NOT NULL,
    user_name text NOT NULL,
    user_email text,
    location text,
    local_time text,
    last_message text,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    unread_count integer DEFAULT 0,
    tags text[],
    source text,
    chat_duration text,
    is_first_visit boolean DEFAULT false,
    device text,
    browser text,
    groups text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: livechat_messages livechat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.livechat_messages
    ADD CONSTRAINT livechat_messages_pkey PRIMARY KEY (id);


--
-- Name: livechat_sessions livechat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.livechat_sessions
    ADD CONSTRAINT livechat_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: livechat_sessions update_livechat_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_livechat_sessions_updated_at BEFORE UPDATE ON public.livechat_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: livechat_messages livechat_messages_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.livechat_messages
    ADD CONSTRAINT livechat_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.livechat_sessions(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: livechat_messages Admins can delete messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete messages" ON public.livechat_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: livechat_sessions Admins can delete sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete sessions" ON public.livechat_sessions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.user_roles user_roles_1
  WHERE ((user_roles_1.user_id = auth.uid()) AND (user_roles_1.role = 'admin'::public.app_role)))));


--
-- Name: livechat_messages Authenticated users can insert messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert messages" ON public.livechat_messages FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: livechat_sessions Authenticated users can insert sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can insert sessions" ON public.livechat_sessions FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: livechat_messages Authenticated users can update messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update messages" ON public.livechat_messages FOR UPDATE TO authenticated USING (true);


--
-- Name: livechat_sessions Authenticated users can update sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can update sessions" ON public.livechat_sessions FOR UPDATE TO authenticated USING (true);


--
-- Name: livechat_messages Authenticated users can view messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view messages" ON public.livechat_messages FOR SELECT TO authenticated USING (true);


--
-- Name: livechat_sessions Authenticated users can view sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view sessions" ON public.livechat_sessions FOR SELECT TO authenticated USING (true);


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: livechat_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.livechat_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: livechat_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.livechat_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


