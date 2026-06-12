--
-- PostgreSQL database dump
--

\restrict G0UdD6AW1lw8xHect0HG0Xhitk7N6aGGi9dUOQw3nsfMdhng7haAPUuhksAiHW8

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.images_tags DROP CONSTRAINT IF EXISTS images_tags_tag_id_fkey;
ALTER TABLE IF EXISTS ONLY public.images_tags DROP CONSTRAINT IF EXISTS images_tags_image_id_fkey;
ALTER TABLE IF EXISTS ONLY public.collections_publications DROP CONSTRAINT IF EXISTS collections_publications_publication_id_fkey;
ALTER TABLE IF EXISTS ONLY public.collections_publications DROP CONSTRAINT IF EXISTS collections_publications_collection_id_fkey;
ALTER TABLE IF EXISTS ONLY public."Reports" DROP CONSTRAINT IF EXISTS "Reports_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Reports" DROP CONSTRAINT IF EXISTS "Reports_image_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Reports" DROP CONSTRAINT IF EXISTS "Reports_comment_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Ratings" DROP CONSTRAINT IF EXISTS "Ratings_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Ratings" DROP CONSTRAINT IF EXISTS "Ratings_image_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Publications" DROP CONSTRAINT IF EXISTS "Publications_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Notifications" DROP CONSTRAINT IF EXISTS "Notifications_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Notifications" DROP CONSTRAINT IF EXISTS "Notifications_image_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Notifications" DROP CONSTRAINT IF EXISTS "Notifications_actor_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Messages" DROP CONSTRAINT IF EXISTS "Messages_sender_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Messages" DROP CONSTRAINT IF EXISTS "Messages_image_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Messages" DROP CONSTRAINT IF EXISTS "Messages_conversation_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Images" DROP CONSTRAINT IF EXISTS "Images_publication_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Followers" DROP CONSTRAINT IF EXISTS "Followers_follower_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Followers" DROP CONSTRAINT IF EXISTS "Followers_followed_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Conversations" DROP CONSTRAINT IF EXISTS "Conversations_seller_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Conversations" DROP CONSTRAINT IF EXISTS "Conversations_image_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Conversations" DROP CONSTRAINT IF EXISTS "Conversations_buyer_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Comments" DROP CONSTRAINT IF EXISTS "Comments_user_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Comments" DROP CONSTRAINT IF EXISTS "Comments_image_id_fkey";
ALTER TABLE IF EXISTS ONLY public."Collections" DROP CONSTRAINT IF EXISTS "Collections_user_id_fkey";
DROP INDEX IF EXISTS public.idx_reports_image_id;
DROP INDEX IF EXISTS public.idx_reports_comment_id;
DROP INDEX IF EXISTS public.idx_ratings_image_id;
DROP INDEX IF EXISTS public.idx_publications_user_id;
DROP INDEX IF EXISTS public.idx_notifications_user_read;
DROP INDEX IF EXISTS public.idx_notifications_user_created;
DROP INDEX IF EXISTS public.idx_messages_sender_id;
DROP INDEX IF EXISTS public.idx_messages_conversation_created;
DROP INDEX IF EXISTS public.idx_images_tags_tag_id;
DROP INDEX IF EXISTS public.idx_images_publication_id;
DROP INDEX IF EXISTS public.idx_followers_followed_id;
DROP INDEX IF EXISTS public.idx_conversations_seller_id;
DROP INDEX IF EXISTS public.idx_conversations_image_id;
DROP INDEX IF EXISTS public.idx_conversations_buyer_id;
DROP INDEX IF EXISTS public.idx_comments_user_id;
DROP INDEX IF EXISTS public.idx_comments_image_id;
DROP INDEX IF EXISTS public.idx_collections_user_id;
DROP INDEX IF EXISTS public.idx_collections_publications_publication_id;
ALTER TABLE IF EXISTS ONLY public."Reports" DROP CONSTRAINT IF EXISTS uq_user_image_report;
ALTER TABLE IF EXISTS ONLY public."Ratings" DROP CONSTRAINT IF EXISTS uq_user_image_rating;
ALTER TABLE IF EXISTS ONLY public."Reports" DROP CONSTRAINT IF EXISTS uq_user_comment_report;
ALTER TABLE IF EXISTS ONLY public."Collections" DROP CONSTRAINT IF EXISTS uq_user_collection_name;
ALTER TABLE IF EXISTS ONLY public.images_tags DROP CONSTRAINT IF EXISTS uq_image_tag;
ALTER TABLE IF EXISTS ONLY public."Followers" DROP CONSTRAINT IF EXISTS uq_follower_followed;
ALTER TABLE IF EXISTS ONLY public."Conversations" DROP CONSTRAINT IF EXISTS uq_conversation_image_buyer;
ALTER TABLE IF EXISTS ONLY public.collections_publications DROP CONSTRAINT IF EXISTS uq_collection_publication;
ALTER TABLE IF EXISTS ONLY public.images_tags DROP CONSTRAINT IF EXISTS images_tags_pkey;
ALTER TABLE IF EXISTS ONLY public.collections_publications DROP CONSTRAINT IF EXISTS collections_publications_pkey;
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_pkey";
ALTER TABLE IF EXISTS ONLY public."Users" DROP CONSTRAINT IF EXISTS "Users_nickname_key";
ALTER TABLE IF EXISTS ONLY public."Tags" DROP CONSTRAINT IF EXISTS "Tags_title_key";
ALTER TABLE IF EXISTS ONLY public."Tags" DROP CONSTRAINT IF EXISTS "Tags_pkey";
ALTER TABLE IF EXISTS ONLY public."SequelizeMeta" DROP CONSTRAINT IF EXISTS "SequelizeMeta_pkey";
ALTER TABLE IF EXISTS ONLY public."Reports" DROP CONSTRAINT IF EXISTS "Reports_pkey";
ALTER TABLE IF EXISTS ONLY public."Ratings" DROP CONSTRAINT IF EXISTS "Ratings_pkey";
ALTER TABLE IF EXISTS ONLY public."Publications" DROP CONSTRAINT IF EXISTS "Publications_pkey";
ALTER TABLE IF EXISTS ONLY public."Notifications" DROP CONSTRAINT IF EXISTS "Notifications_pkey";
ALTER TABLE IF EXISTS ONLY public."Messages" DROP CONSTRAINT IF EXISTS "Messages_pkey";
ALTER TABLE IF EXISTS ONLY public."Images" DROP CONSTRAINT IF EXISTS "Images_pkey";
ALTER TABLE IF EXISTS ONLY public."Followers" DROP CONSTRAINT IF EXISTS "Followers_pkey";
ALTER TABLE IF EXISTS ONLY public."Conversations" DROP CONSTRAINT IF EXISTS "Conversations_pkey";
ALTER TABLE IF EXISTS ONLY public."Comments" DROP CONSTRAINT IF EXISTS "Comments_pkey";
ALTER TABLE IF EXISTS ONLY public."Collections" DROP CONSTRAINT IF EXISTS "Collections_pkey";
ALTER TABLE IF EXISTS public.images_tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.collections_publications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Users" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Tags" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Reports" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Ratings" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Publications" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Notifications" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Messages" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Images" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Followers" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Conversations" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Comments" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Collections" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.images_tags_id_seq;
DROP TABLE IF EXISTS public.images_tags;
DROP SEQUENCE IF EXISTS public.collections_publications_id_seq;
DROP TABLE IF EXISTS public.collections_publications;
DROP SEQUENCE IF EXISTS public."Users_id_seq";
DROP TABLE IF EXISTS public."Users";
DROP SEQUENCE IF EXISTS public."Tags_id_seq";
DROP TABLE IF EXISTS public."Tags";
DROP TABLE IF EXISTS public."SequelizeMeta";
DROP SEQUENCE IF EXISTS public."Reports_id_seq";
DROP TABLE IF EXISTS public."Reports";
DROP SEQUENCE IF EXISTS public."Ratings_id_seq";
DROP TABLE IF EXISTS public."Ratings";
DROP SEQUENCE IF EXISTS public."Publications_id_seq";
DROP TABLE IF EXISTS public."Publications";
DROP SEQUENCE IF EXISTS public."Notifications_id_seq";
DROP TABLE IF EXISTS public."Notifications";
DROP SEQUENCE IF EXISTS public."Messages_id_seq";
DROP TABLE IF EXISTS public."Messages";
DROP SEQUENCE IF EXISTS public."Images_id_seq";
DROP TABLE IF EXISTS public."Images";
DROP SEQUENCE IF EXISTS public."Followers_id_seq";
DROP TABLE IF EXISTS public."Followers";
DROP SEQUENCE IF EXISTS public."Conversations_id_seq";
DROP TABLE IF EXISTS public."Conversations";
DROP SEQUENCE IF EXISTS public."Comments_id_seq";
DROP TABLE IF EXISTS public."Comments";
DROP SEQUENCE IF EXISTS public."Collections_id_seq";
DROP TABLE IF EXISTS public."Collections";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Collections" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(50) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Collections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Collections_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Collections_id_seq" OWNED BY public."Collections".id;


--
-- Name: Comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comments" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    image_id integer NOT NULL,
    content character varying(250) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: Conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Conversations" (
    id integer NOT NULL,
    image_id integer NOT NULL,
    buyer_id integer NOT NULL,
    seller_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT chk_conversation_distinct_users CHECK ((buyer_id <> seller_id))
);


--
-- Name: Conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Conversations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Conversations_id_seq" OWNED BY public."Conversations".id;


--
-- Name: Followers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Followers" (
    id integer NOT NULL,
    follower_id integer NOT NULL,
    followed_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT chk_no_self_follow CHECK ((follower_id <> followed_id))
);


--
-- Name: Followers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Followers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Followers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Followers_id_seq" OWNED BY public."Followers".id;


--
-- Name: Images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Images" (
    id integer NOT NULL,
    publication_id integer NOT NULL,
    url character varying(255) NOT NULL,
    text_markwater character varying(255),
    order_number integer NOT NULL,
    license character varying(255) DEFAULT 'sin_copyright'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Images_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Images_id_seq" OWNED BY public."Images".id;


--
-- Name: Messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Messages" (
    id integer NOT NULL,
    conversation_id integer NOT NULL,
    sender_id integer NOT NULL,
    image_id integer,
    content character varying(1000) NOT NULL,
    read_at timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Messages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Messages_id_seq" OWNED BY public."Messages".id;


--
-- Name: Notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notifications" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    actor_id integer NOT NULL,
    type character varying(255) NOT NULL,
    image_id integer,
    read_at timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT chk_notification_type CHECK (((type)::text = ANY ((ARRAY['comment'::character varying, 'rating'::character varying, 'interest'::character varying, 'follow'::character varying, 'report'::character varying])::text[])))
);


--
-- Name: Notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Notifications_id_seq" OWNED BY public."Notifications".id;


--
-- Name: Publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Publications" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255),
    comments_enabled boolean DEFAULT true NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Publications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Publications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Publications_id_seq" OWNED BY public."Publications".id;


--
-- Name: Ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Ratings" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    image_id integer NOT NULL,
    value integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT chk_value_range CHECK (((value >= 1) AND (value <= 5)))
);


--
-- Name: Ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Ratings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Ratings_id_seq" OWNED BY public."Ratings".id;


--
-- Name: Reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Reports" (
    id integer NOT NULL,
    reason character varying(255) NOT NULL,
    description character varying(250) NOT NULL,
    user_id integer NOT NULL,
    image_id integer,
    comment_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT chk_report_target CHECK (((((image_id IS NOT NULL))::integer + ((comment_id IS NOT NULL))::integer) = 1))
);


--
-- Name: Reports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Reports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Reports_id_seq" OWNED BY public."Reports".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: Tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tags" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Tags_id_seq" OWNED BY public."Tags".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    nickname character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    biography character varying(255),
    profile_img character varying(255),
    active boolean DEFAULT true NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: collections_publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections_publications (
    id integer NOT NULL,
    collection_id integer NOT NULL,
    publication_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: collections_publications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collections_publications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: collections_publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collections_publications_id_seq OWNED BY public.collections_publications.id;


--
-- Name: images_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images_tags (
    id integer NOT NULL,
    image_id integer NOT NULL,
    tag_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: images_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.images_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.images_tags_id_seq OWNED BY public.images_tags.id;


--
-- Name: Collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collections" ALTER COLUMN id SET DEFAULT nextval('public."Collections_id_seq"'::regclass);


--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: Conversations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversations" ALTER COLUMN id SET DEFAULT nextval('public."Conversations_id_seq"'::regclass);


--
-- Name: Followers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Followers" ALTER COLUMN id SET DEFAULT nextval('public."Followers_id_seq"'::regclass);


--
-- Name: Images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Images" ALTER COLUMN id SET DEFAULT nextval('public."Images_id_seq"'::regclass);


--
-- Name: Messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages" ALTER COLUMN id SET DEFAULT nextval('public."Messages_id_seq"'::regclass);


--
-- Name: Notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications" ALTER COLUMN id SET DEFAULT nextval('public."Notifications_id_seq"'::regclass);


--
-- Name: Publications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Publications" ALTER COLUMN id SET DEFAULT nextval('public."Publications_id_seq"'::regclass);


--
-- Name: Ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ratings" ALTER COLUMN id SET DEFAULT nextval('public."Ratings_id_seq"'::regclass);


--
-- Name: Reports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reports" ALTER COLUMN id SET DEFAULT nextval('public."Reports_id_seq"'::regclass);


--
-- Name: Tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tags" ALTER COLUMN id SET DEFAULT nextval('public."Tags_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: collections_publications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_publications ALTER COLUMN id SET DEFAULT nextval('public.collections_publications_id_seq'::regclass);


--
-- Name: images_tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images_tags ALTER COLUMN id SET DEFAULT nextval('public.images_tags_id_seq'::regclass);


--
-- Data for Name: Collections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Collections" (id, user_id, name, "createdAt", "updatedAt") FROM stdin;
1	2	Favoritos	2026-06-12 19:58:20.631-03	2026-06-12 19:58:20.631-03
2	2	Inspiracion	2026-06-12 19:58:20.645-03	2026-06-12 19:58:20.645-03
3	3	Paisajes	2026-06-12 19:58:20.653-03	2026-06-12 19:58:20.653-03
4	4	Ideas	2026-06-12 19:58:20.663-03	2026-06-12 19:58:20.663-03
\.


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comments" (id, user_id, image_id, content, "createdAt", "updatedAt") FROM stdin;
1	1	1	Que buena toma!	2026-06-12 19:58:20.569-03	2026-06-12 19:58:20.569-03
2	4	3	Espectacular composicion.	2026-06-12 19:58:20.572-03	2026-06-12 19:58:20.572-03
3	6	5	Increibles colores.	2026-06-12 19:58:20.573-03	2026-06-12 19:58:20.573-03
4	2	7	Tremendo encuadre.	2026-06-12 19:58:20.575-03	2026-06-12 19:58:20.575-03
5	5	9	Que buena toma!	2026-06-12 19:58:20.577-03	2026-06-12 19:58:20.577-03
6	1	11	Espectacular composicion.	2026-06-12 19:58:20.578-03	2026-06-12 19:58:20.578-03
7	3	13	Increibles colores.	2026-06-12 19:58:20.58-03	2026-06-12 19:58:20.58-03
8	6	15	Tremendo encuadre.	2026-06-12 19:58:20.581-03	2026-06-12 19:58:20.581-03
9	2	17	Que buena toma!	2026-06-12 19:58:20.582-03	2026-06-12 19:58:20.582-03
10	4	19	Espectacular composicion.	2026-06-12 19:58:20.584-03	2026-06-12 19:58:20.584-03
11	1	21	Increibles colores.	2026-06-12 19:58:20.586-03	2026-06-12 19:58:20.586-03
12	4	23	Tremendo encuadre.	2026-06-12 19:58:20.587-03	2026-06-12 19:58:20.587-03
\.


--
-- Data for Name: Conversations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Conversations" (id, image_id, buyer_id, seller_id, "createdAt", "updatedAt") FROM stdin;
1	6	1	2	2026-06-12 19:58:20.703-03	2026-06-12 19:58:20.703-03
2	9	1	3	2026-06-12 19:58:20.714-03	2026-06-12 19:58:20.714-03
3	10	1	3	2026-06-12 19:58:20.72-03	2026-06-12 19:58:20.72-03
4	22	1	6	2026-06-12 19:58:20.729-03	2026-06-12 19:58:20.729-03
\.


--
-- Data for Name: Followers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Followers" (id, follower_id, followed_id, "createdAt", "updatedAt") FROM stdin;
1	2	3	2026-06-12 19:58:20.59-03	2026-06-12 19:58:20.59-03
2	2	4	2026-06-12 19:58:20.594-03	2026-06-12 19:58:20.594-03
3	2	5	2026-06-12 19:58:20.597-03	2026-06-12 19:58:20.597-03
4	3	2	2026-06-12 19:58:20.6-03	2026-06-12 19:58:20.6-03
5	3	6	2026-06-12 19:58:20.603-03	2026-06-12 19:58:20.603-03
6	4	2	2026-06-12 19:58:20.605-03	2026-06-12 19:58:20.605-03
7	4	3	2026-06-12 19:58:20.608-03	2026-06-12 19:58:20.608-03
8	5	6	2026-06-12 19:58:20.611-03	2026-06-12 19:58:20.611-03
9	5	2	2026-06-12 19:58:20.613-03	2026-06-12 19:58:20.613-03
10	6	2	2026-06-12 19:58:20.616-03	2026-06-12 19:58:20.616-03
11	6	3	2026-06-12 19:58:20.62-03	2026-06-12 19:58:20.62-03
12	6	4	2026-06-12 19:58:20.623-03	2026-06-12 19:58:20.623-03
13	1	2	2026-06-12 19:58:20.626-03	2026-06-12 19:58:20.626-03
14	1	3	2026-06-12 19:58:20.629-03	2026-06-12 19:58:20.629-03
\.


--
-- Data for Name: Images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Images" (id, publication_id, url, text_markwater, order_number, license, "createdAt", "updatedAt") FROM stdin;
1	1	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066377/fotaza/seed/rsppiufxbziyltndewmk.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.269-03	2026-06-12 19:58:20.269-03
2	1	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066379/fotaza/seed/griugeevjrdeyakyj6ox.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.284-03	2026-06-12 19:58:20.284-03
3	2	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066382/fotaza/seed/mozk05az3qoj3jejpb8f.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.292-03	2026-06-12 19:58:20.292-03
4	2	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066386/fotaza/seed/dw0pobvmzh1nhkwq34vp.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.301-03	2026-06-12 19:58:20.301-03
5	2	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066387/fotaza/seed/dx68qtixloyidbbtxekk.jpg	\N	2	sin_copyright	2026-06-12 19:58:20.307-03	2026-06-12 19:58:20.307-03
6	3	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066390/fotaza/seed/z4ae6n9qptw2wzspcdrs.jpg	ana	0	copyright	2026-06-12 19:58:20.317-03	2026-06-12 19:58:20.317-03
7	4	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066394/fotaza/seed/r5ajtvqfjyafr9ba3zia.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.326-03	2026-06-12 19:58:20.326-03
8	4	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066396/fotaza/seed/s2bf7fwohii7v7uc1dkt.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.332-03	2026-06-12 19:58:20.332-03
9	5	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066399/fotaza/seed/j23oditv0j3gpe8cocmv.jpg	beto	0	copyright	2026-06-12 19:58:20.338-03	2026-06-12 19:58:20.338-03
10	5	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066402/fotaza/seed/jyvsuzx25z4lq6rvmn7u.jpg	beto	1	copyright	2026-06-12 19:58:20.345-03	2026-06-12 19:58:20.345-03
11	6	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066404/fotaza/seed/pszyewerlgvbgrsdajrr.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.354-03	2026-06-12 19:58:20.354-03
12	6	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066408/fotaza/seed/nycirvezsruhakrulujv.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.36-03	2026-06-12 19:58:20.36-03
13	6	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066410/fotaza/seed/efq8e6b6fslqrbugkmws.jpg	\N	2	sin_copyright	2026-06-12 19:58:20.365-03	2026-06-12 19:58:20.365-03
14	7	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066412/fotaza/seed/rznl3kksz5f49cgmlu5d.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.375-03	2026-06-12 19:58:20.375-03
15	8	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066415/fotaza/seed/y5rvyo13ihtcbkbgvvnb.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.382-03	2026-06-12 19:58:20.382-03
16	8	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066417/fotaza/seed/sxvcchgkzmexbeui5zrr.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.387-03	2026-06-12 19:58:20.387-03
17	9	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066420/fotaza/seed/osdcpl2ktk7va2c8n4rf.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.398-03	2026-06-12 19:58:20.398-03
18	9	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066424/fotaza/seed/onmcyi6ssxrbkicdmfad.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.404-03	2026-06-12 19:58:20.404-03
19	10	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066427/fotaza/seed/afrv0j9z25qikxg6jj9c.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.414-03	2026-06-12 19:58:20.414-03
20	10	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066428/fotaza/seed/p1ekrcax0h9a5kaa5uuy.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.42-03	2026-06-12 19:58:20.42-03
21	10	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066431/fotaza/seed/hky71mbzuckmkkiojrr2.jpg	\N	2	sin_copyright	2026-06-12 19:58:20.427-03	2026-06-12 19:58:20.427-03
22	11	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066433/fotaza/seed/g3prw4e2zmczustqhgde.jpg	eli	0	copyright	2026-06-12 19:58:20.436-03	2026-06-12 19:58:20.436-03
23	12	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066435/fotaza/seed/vhoxlnjuyabz7okb8x6d.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.445-03	2026-06-12 19:58:20.445-03
24	12	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066437/fotaza/seed/k4xva80sufll6o5yfead.jpg	\N	1	sin_copyright	2026-06-12 19:58:20.449-03	2026-06-12 19:58:20.449-03
25	13	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066377/fotaza/seed/rsppiufxbziyltndewmk.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.69-03	2026-06-12 19:58:20.69-03
26	14	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066379/fotaza/seed/griugeevjrdeyakyj6ox.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.694-03	2026-06-12 19:58:20.694-03
27	15	https://res.cloudinary.com/dkoff52tr/image/upload/v1781066382/fotaza/seed/mozk05az3qoj3jejpb8f.jpg	\N	0	sin_copyright	2026-06-12 19:58:20.697-03	2026-06-12 19:58:20.697-03
\.


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Messages" (id, conversation_id, sender_id, image_id, content, read_at, "createdAt", "updatedAt") FROM stdin;
1	1	1	6	Hola! Me interesa obtener esta imagen.	2026-06-12 19:58:20.708-03	2026-06-12 19:58:20.708-03	2026-06-12 19:58:20.708-03
2	1	2	\N	Hola! Si, claro. Que uso le queres dar?	\N	2026-06-12 19:58:20.712-03	2026-06-12 19:58:20.712-03
3	2	1	9	Hola! Me interesa obtener esta imagen.	2026-06-12 19:58:20.716-03	2026-06-12 19:58:20.716-03	2026-06-12 19:58:20.716-03
4	2	3	\N	Hola! Si, claro. Que uso le queres dar?	2026-06-12 19:58:20.717-03	2026-06-12 19:58:20.717-03	2026-06-12 19:58:20.717-03
5	2	1	\N	Es para la portada de un blog de viajes. Cuanto saldria la licencia?	\N	2026-06-12 19:58:20.719-03	2026-06-12 19:58:20.719-03
6	3	1	10	Hola! Me interesa obtener esta imagen.	2026-06-12 19:58:20.722-03	2026-06-12 19:58:20.722-03	2026-06-12 19:58:20.722-03
7	3	3	\N	Hola! Si, claro. Que uso le queres dar?	2026-06-12 19:58:20.724-03	2026-06-12 19:58:20.724-03	2026-06-12 19:58:20.724-03
8	3	1	\N	Es para la portada de un blog de viajes. Cuanto saldria la licencia?	2026-06-12 19:58:20.725-03	2026-06-12 19:58:20.725-03	2026-06-12 19:58:20.725-03
9	3	3	\N	Te paso los detalles por aca y arreglamos un precio.	\N	2026-06-12 19:58:20.727-03	2026-06-12 19:58:20.727-03
10	4	1	22	Hola! Me interesa obtener esta imagen.	2026-06-12 19:58:20.73-03	2026-06-12 19:58:20.731-03	2026-06-12 19:58:20.731-03
11	4	6	\N	Hola! Si, claro. Que uso le queres dar?	\N	2026-06-12 19:58:20.732-03	2026-06-12 19:58:20.732-03
\.


--
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notifications" (id, user_id, actor_id, type, image_id, read_at, "createdAt", "updatedAt") FROM stdin;
1	2	1	rating	1	2026-06-12 19:58:20.457-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
2	2	3	rating	2	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
3	2	4	rating	3	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
4	2	5	rating	4	2026-06-12 19:58:20.472-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
5	2	6	rating	5	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
6	2	1	rating	6	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
7	3	2	rating	7	2026-06-12 19:58:20.487-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
8	3	4	rating	8	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
9	3	5	rating	9	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
10	3	6	rating	10	2026-06-12 19:58:20.502-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
11	4	1	rating	11	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
12	4	2	rating	12	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
13	4	3	rating	13	2026-06-12 19:58:20.516-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
14	4	5	rating	14	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
15	5	6	rating	15	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
16	5	1	rating	16	2026-06-12 19:58:20.53-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
17	5	2	rating	17	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
18	5	3	rating	18	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
19	6	4	rating	19	2026-06-12 19:58:20.544-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
20	6	5	rating	20	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
21	6	1	rating	21	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
22	6	2	rating	22	2026-06-12 19:58:20.557-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
23	1	4	rating	23	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
24	1	5	rating	24	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
25	2	1	comment	1	2026-06-12 19:58:20.572-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
26	2	4	comment	3	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
27	2	6	comment	5	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
28	3	2	comment	7	2026-06-12 19:58:20.577-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
29	3	5	comment	9	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
30	4	1	comment	11	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
31	4	3	comment	13	2026-06-12 19:58:20.581-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
32	5	6	comment	15	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
33	5	2	comment	17	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
34	6	4	comment	19	2026-06-12 19:58:20.586-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
35	6	1	comment	21	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
36	1	4	comment	23	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
37	3	2	follow	\N	2026-06-12 19:58:20.593-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
38	4	2	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
39	5	2	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
40	2	3	follow	\N	2026-06-12 19:58:20.602-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
41	6	3	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
42	2	4	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
43	3	4	follow	\N	2026-06-12 19:58:20.61-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
44	6	5	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
45	2	5	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
46	2	6	follow	\N	2026-06-12 19:58:20.618-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
47	3	6	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
48	4	6	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
49	2	1	follow	\N	2026-06-12 19:58:20.628-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
50	3	1	follow	\N	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
51	2	3	report	1	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
52	2	1	interest	6	2026-06-12 19:58:20.708-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
53	3	1	interest	9	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
54	3	1	interest	10	\N	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
55	6	1	interest	22	2026-06-12 19:58:20.73-03	2026-06-12 19:58:20.734-03	2026-06-12 19:58:20.734-03
\.


--
-- Data for Name: Publications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Publications" (id, user_id, title, description, comments_enabled, deleted, "createdAt", "updatedAt") FROM stdin;
1	2	Atardecer en la costa	Tarde dorada sobre el mar.	t	f	2026-06-12 19:58:20.262-03	2026-06-12 19:58:20.262-03
2	2	Montañas al amanecer	Primera luz sobre la cordillera.	t	f	2026-06-12 19:58:20.289-03	2026-06-12 19:58:20.289-03
3	2	Lago espejo	Reflejos perfectos en el agua.	t	f	2026-06-12 19:58:20.315-03	2026-06-12 19:58:20.315-03
4	3	Luces de la ciudad	La city de noche desde un mirador.	t	f	2026-06-12 19:58:20.324-03	2026-06-12 19:58:20.324-03
5	3	Geometria urbana	Lineas y formas entre edificios.	t	f	2026-06-12 19:58:20.336-03	2026-06-12 19:58:20.336-03
6	4	Miradas	Serie de retratos en estudio.	t	f	2026-06-12 19:58:20.352-03	2026-06-12 19:58:20.352-03
7	4	Blanco y negro	Contrastes y texturas en monocromo.	t	f	2026-06-12 19:58:20.372-03	2026-06-12 19:58:20.372-03
8	5	Fauna salvaje	Animales en su habitat.	t	f	2026-06-12 19:58:20.38-03	2026-06-12 19:58:20.38-03
9	5	Bosque profundo	Caminata entre arboles centenarios.	t	f	2026-06-12 19:58:20.394-03	2026-06-12 19:58:20.394-03
10	6	Postales de viaje	Lugares que visite este año.	t	f	2026-06-12 19:58:20.411-03	2026-06-12 19:58:20.411-03
11	6	Playas escondidas	Rincones de arena y mar.	t	f	2026-06-12 19:58:20.434-03	2026-06-12 19:58:20.434-03
12	1	Galeria destacada	Seleccion del equipo de Fotaza.	t	f	2026-06-12 19:58:20.442-03	2026-06-12 19:58:20.442-03
13	3	Sesion sin permiso	Publicacion dada de baja por el validador.	t	t	2026-06-12 19:58:20.688-03	2026-06-12 19:58:20.688-03
14	3	Reposteo no autorizado	Publicacion dada de baja por el validador.	t	t	2026-06-12 19:58:20.692-03	2026-06-12 19:58:20.692-03
15	3	Material en revision	Publicacion con denuncias pendientes de revision.	t	f	2026-06-12 19:58:20.696-03	2026-06-12 19:58:20.696-03
\.


--
-- Data for Name: Ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Ratings" (id, user_id, image_id, value, "createdAt", "updatedAt") FROM stdin;
1	1	1	1	2026-06-12 19:58:20.454-03	2026-06-12 19:58:20.454-03
2	3	1	3	2026-06-12 19:58:20.457-03	2026-06-12 19:58:20.457-03
3	3	2	2	2026-06-12 19:58:20.459-03	2026-06-12 19:58:20.459-03
4	4	2	4	2026-06-12 19:58:20.46-03	2026-06-12 19:58:20.46-03
5	5	2	1	2026-06-12 19:58:20.462-03	2026-06-12 19:58:20.462-03
6	4	3	3	2026-06-12 19:58:20.463-03	2026-06-12 19:58:20.463-03
7	5	3	5	2026-06-12 19:58:20.465-03	2026-06-12 19:58:20.465-03
8	6	3	2	2026-06-12 19:58:20.467-03	2026-06-12 19:58:20.467-03
9	1	3	4	2026-06-12 19:58:20.469-03	2026-06-12 19:58:20.469-03
10	5	4	4	2026-06-12 19:58:20.47-03	2026-06-12 19:58:20.47-03
11	6	4	1	2026-06-12 19:58:20.472-03	2026-06-12 19:58:20.472-03
12	6	5	5	2026-06-12 19:58:20.473-03	2026-06-12 19:58:20.473-03
13	1	5	2	2026-06-12 19:58:20.475-03	2026-06-12 19:58:20.475-03
14	3	5	4	2026-06-12 19:58:20.477-03	2026-06-12 19:58:20.477-03
15	1	6	1	2026-06-12 19:58:20.478-03	2026-06-12 19:58:20.478-03
16	3	6	3	2026-06-12 19:58:20.48-03	2026-06-12 19:58:20.48-03
17	4	6	5	2026-06-12 19:58:20.482-03	2026-06-12 19:58:20.482-03
18	5	6	2	2026-06-12 19:58:20.484-03	2026-06-12 19:58:20.484-03
19	2	7	2	2026-06-12 19:58:20.485-03	2026-06-12 19:58:20.485-03
20	4	7	4	2026-06-12 19:58:20.487-03	2026-06-12 19:58:20.487-03
21	4	8	3	2026-06-12 19:58:20.488-03	2026-06-12 19:58:20.488-03
22	5	8	5	2026-06-12 19:58:20.49-03	2026-06-12 19:58:20.49-03
23	6	8	2	2026-06-12 19:58:20.491-03	2026-06-12 19:58:20.491-03
24	5	9	4	2026-06-12 19:58:20.493-03	2026-06-12 19:58:20.493-03
25	6	9	1	2026-06-12 19:58:20.495-03	2026-06-12 19:58:20.495-03
26	1	9	3	2026-06-12 19:58:20.496-03	2026-06-12 19:58:20.496-03
27	2	9	5	2026-06-12 19:58:20.498-03	2026-06-12 19:58:20.498-03
28	6	10	5	2026-06-12 19:58:20.5-03	2026-06-12 19:58:20.5-03
29	1	10	2	2026-06-12 19:58:20.502-03	2026-06-12 19:58:20.502-03
30	1	11	1	2026-06-12 19:58:20.504-03	2026-06-12 19:58:20.504-03
31	2	11	3	2026-06-12 19:58:20.505-03	2026-06-12 19:58:20.505-03
32	3	11	5	2026-06-12 19:58:20.507-03	2026-06-12 19:58:20.507-03
33	2	12	2	2026-06-12 19:58:20.509-03	2026-06-12 19:58:20.509-03
34	3	12	4	2026-06-12 19:58:20.51-03	2026-06-12 19:58:20.51-03
35	5	12	1	2026-06-12 19:58:20.512-03	2026-06-12 19:58:20.512-03
36	6	12	3	2026-06-12 19:58:20.513-03	2026-06-12 19:58:20.513-03
37	3	13	3	2026-06-12 19:58:20.515-03	2026-06-12 19:58:20.515-03
38	5	13	5	2026-06-12 19:58:20.516-03	2026-06-12 19:58:20.516-03
39	5	14	4	2026-06-12 19:58:20.518-03	2026-06-12 19:58:20.518-03
40	6	14	1	2026-06-12 19:58:20.519-03	2026-06-12 19:58:20.519-03
41	1	14	3	2026-06-12 19:58:20.521-03	2026-06-12 19:58:20.521-03
42	6	15	5	2026-06-12 19:58:20.522-03	2026-06-12 19:58:20.522-03
43	1	15	2	2026-06-12 19:58:20.524-03	2026-06-12 19:58:20.524-03
44	2	15	4	2026-06-12 19:58:20.526-03	2026-06-12 19:58:20.526-03
45	3	15	1	2026-06-12 19:58:20.527-03	2026-06-12 19:58:20.527-03
46	1	16	1	2026-06-12 19:58:20.529-03	2026-06-12 19:58:20.529-03
47	2	16	3	2026-06-12 19:58:20.53-03	2026-06-12 19:58:20.53-03
48	2	17	2	2026-06-12 19:58:20.532-03	2026-06-12 19:58:20.532-03
49	3	17	4	2026-06-12 19:58:20.533-03	2026-06-12 19:58:20.533-03
50	4	17	1	2026-06-12 19:58:20.535-03	2026-06-12 19:58:20.535-03
51	3	18	3	2026-06-12 19:58:20.536-03	2026-06-12 19:58:20.536-03
52	4	18	5	2026-06-12 19:58:20.538-03	2026-06-12 19:58:20.538-03
53	6	18	2	2026-06-12 19:58:20.54-03	2026-06-12 19:58:20.54-03
54	1	18	4	2026-06-12 19:58:20.541-03	2026-06-12 19:58:20.541-03
55	4	19	4	2026-06-12 19:58:20.543-03	2026-06-12 19:58:20.543-03
56	5	19	1	2026-06-12 19:58:20.544-03	2026-06-12 19:58:20.544-03
57	5	20	5	2026-06-12 19:58:20.546-03	2026-06-12 19:58:20.546-03
58	1	20	2	2026-06-12 19:58:20.547-03	2026-06-12 19:58:20.547-03
59	2	20	4	2026-06-12 19:58:20.548-03	2026-06-12 19:58:20.548-03
60	1	21	1	2026-06-12 19:58:20.55-03	2026-06-12 19:58:20.55-03
61	2	21	3	2026-06-12 19:58:20.551-03	2026-06-12 19:58:20.551-03
62	3	21	5	2026-06-12 19:58:20.553-03	2026-06-12 19:58:20.553-03
63	4	21	2	2026-06-12 19:58:20.555-03	2026-06-12 19:58:20.555-03
64	2	22	2	2026-06-12 19:58:20.556-03	2026-06-12 19:58:20.556-03
65	3	22	4	2026-06-12 19:58:20.557-03	2026-06-12 19:58:20.557-03
66	4	23	3	2026-06-12 19:58:20.559-03	2026-06-12 19:58:20.559-03
67	5	23	5	2026-06-12 19:58:20.56-03	2026-06-12 19:58:20.56-03
68	6	23	2	2026-06-12 19:58:20.561-03	2026-06-12 19:58:20.561-03
69	5	24	4	2026-06-12 19:58:20.563-03	2026-06-12 19:58:20.563-03
70	6	24	1	2026-06-12 19:58:20.564-03	2026-06-12 19:58:20.564-03
71	2	24	3	2026-06-12 19:58:20.565-03	2026-06-12 19:58:20.565-03
72	3	24	5	2026-06-12 19:58:20.567-03	2026-06-12 19:58:20.567-03
\.


--
-- Data for Name: Reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reports" (id, reason, description, user_id, image_id, comment_id, "createdAt", "updatedAt") FROM stdin;
1	inapropiado	La imagen no corresponde con la descripcion de la publicacion.	3	1	\N	2026-06-12 19:58:20.671-03	2026-06-12 19:58:20.671-03
2	spam	Parece contenido repetido o spam.	4	1	\N	2026-06-12 19:58:20.676-03	2026-06-12 19:58:20.676-03
3	derechos	Creo que esta imagen infringe derechos de autor.	3	6	\N	2026-06-12 19:58:20.678-03	2026-06-12 19:58:20.678-03
4	inapropiado	Contenido inapropiado para la comunidad.	4	6	\N	2026-06-12 19:58:20.68-03	2026-06-12 19:58:20.68-03
5	otro	No deberia estar publicada.	5	6	\N	2026-06-12 19:58:20.682-03	2026-06-12 19:58:20.682-03
6	violencia	Contiene contenido sensible.	6	6	\N	2026-06-12 19:58:20.684-03	2026-06-12 19:58:20.684-03
7	inapropiado	El comentario tiene lenguaje ofensivo.	3	\N	1	2026-06-12 19:58:20.686-03	2026-06-12 19:58:20.686-03
8	inapropiado	El contenido no respeta las normas de la comunidad.	1	27	\N	2026-06-12 19:58:20.699-03	2026-06-12 19:58:20.699-03
9	inapropiado	El contenido no respeta las normas de la comunidad.	2	27	\N	2026-06-12 19:58:20.701-03	2026-06-12 19:58:20.701-03
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260523235057-create-user.js
20260524000000-create-followers.js
20260525000001-create-publications.js
20260525000002-create-images.js
20260525000003-create-tags.js
20260525000004-create-images-tags.js
20260526000000-create-ratings.js
20260527000000-create-comments.js
20260528000000-create-collections.js
20260528000000-create-reports.js
20260528000001-create-collections-publications.js
20260529000000-create-conversations.js
20260529000001-create-messages.js
20260530000000-create-notifications.js
20260531000000-add-fk-indexes.js
\.


--
-- Data for Name: Tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tags" (id, title, "createdAt", "updatedAt") FROM stdin;
1	atardecer	2026-06-12 19:58:20.148-03	2026-06-12 19:58:20.148-03
2	mar	2026-06-12 19:58:20.165-03	2026-06-12 19:58:20.165-03
3	paisaje	2026-06-12 19:58:20.169-03	2026-06-12 19:58:20.169-03
4	montaña	2026-06-12 19:58:20.173-03	2026-06-12 19:58:20.173-03
5	amanecer	2026-06-12 19:58:20.177-03	2026-06-12 19:58:20.177-03
6	lago	2026-06-12 19:58:20.18-03	2026-06-12 19:58:20.18-03
7	naturaleza	2026-06-12 19:58:20.184-03	2026-06-12 19:58:20.184-03
8	ciudad	2026-06-12 19:58:20.188-03	2026-06-12 19:58:20.188-03
9	noche	2026-06-12 19:58:20.191-03	2026-06-12 19:58:20.191-03
10	arquitectura	2026-06-12 19:58:20.197-03	2026-06-12 19:58:20.197-03
11	abstracto	2026-06-12 19:58:20.201-03	2026-06-12 19:58:20.201-03
12	retrato	2026-06-12 19:58:20.206-03	2026-06-12 19:58:20.206-03
13	estudio	2026-06-12 19:58:20.21-03	2026-06-12 19:58:20.21-03
14	personas	2026-06-12 19:58:20.214-03	2026-06-12 19:58:20.214-03
15	blanco-y-negro	2026-06-12 19:58:20.219-03	2026-06-12 19:58:20.219-03
16	fauna	2026-06-12 19:58:20.224-03	2026-06-12 19:58:20.224-03
17	animales	2026-06-12 19:58:20.229-03	2026-06-12 19:58:20.229-03
18	bosque	2026-06-12 19:58:20.233-03	2026-06-12 19:58:20.233-03
19	verde	2026-06-12 19:58:20.236-03	2026-06-12 19:58:20.236-03
20	viaje	2026-06-12 19:58:20.24-03	2026-06-12 19:58:20.24-03
21	playa	2026-06-12 19:58:20.246-03	2026-06-12 19:58:20.246-03
22	destacado	2026-06-12 19:58:20.253-03	2026-06-12 19:58:20.253-03
23	varios	2026-06-12 19:58:20.258-03	2026-06-12 19:58:20.258-03
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Users" (id, nickname, password, biography, profile_img, active, is_admin, "createdAt", "updatedAt") FROM stdin;
1	admin	$2b$10$0i4B1hGVL1nWEFV9EesqnOQve4LvZvWwRWXjbK8lkNBUzscwd3AdO	Validador de contenidos / administrador del sitio.	\N	t	t	2026-06-12 19:58:20.127-03	2026-06-12 19:58:20.127-03
2	ana	$2b$10$0i4B1hGVL1nWEFV9EesqnOQve4LvZvWwRWXjbK8lkNBUzscwd3AdO	Fotografa de paisajes y atardeceres.	\N	t	f	2026-06-12 19:58:20.127-03	2026-06-12 19:58:20.127-03
3	beto	$2b$10$0i4B1hGVL1nWEFV9EesqnOQve4LvZvWwRWXjbK8lkNBUzscwd3AdO	Ciudad, arquitectura y vida urbana.	\N	t	f	2026-06-12 19:58:20.127-03	2026-06-12 19:58:20.127-03
4	caro	$2b$10$0i4B1hGVL1nWEFV9EesqnOQve4LvZvWwRWXjbK8lkNBUzscwd3AdO	Retratos y blanco y negro.	\N	t	f	2026-06-12 19:58:20.127-03	2026-06-12 19:58:20.127-03
5	dami	$2b$10$0i4B1hGVL1nWEFV9EesqnOQve4LvZvWwRWXjbK8lkNBUzscwd3AdO	Naturaleza, fauna y aventura.	\N	t	f	2026-06-12 19:58:20.127-03	2026-06-12 19:58:20.127-03
6	eli	$2b$10$0i4B1hGVL1nWEFV9EesqnOQve4LvZvWwRWXjbK8lkNBUzscwd3AdO	Viajera, fotos de todo el mundo.	\N	t	f	2026-06-12 19:58:20.127-03	2026-06-12 19:58:20.127-03
\.


--
-- Data for Name: collections_publications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.collections_publications (id, collection_id, publication_id, "createdAt", "updatedAt") FROM stdin;
1	1	2	2026-06-12 19:58:20.637-03	2026-06-12 19:58:20.637-03
2	1	6	2026-06-12 19:58:20.64-03	2026-06-12 19:58:20.64-03
3	1	8	2026-06-12 19:58:20.643-03	2026-06-12 19:58:20.643-03
4	2	4	2026-06-12 19:58:20.648-03	2026-06-12 19:58:20.648-03
5	2	9	2026-06-12 19:58:20.651-03	2026-06-12 19:58:20.651-03
6	3	1	2026-06-12 19:58:20.655-03	2026-06-12 19:58:20.655-03
7	3	2	2026-06-12 19:58:20.659-03	2026-06-12 19:58:20.659-03
8	3	10	2026-06-12 19:58:20.662-03	2026-06-12 19:58:20.662-03
9	4	5	2026-06-12 19:58:20.666-03	2026-06-12 19:58:20.666-03
10	4	7	2026-06-12 19:58:20.669-03	2026-06-12 19:58:20.669-03
\.


--
-- Data for Name: images_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.images_tags (id, image_id, tag_id, "createdAt", "updatedAt") FROM stdin;
1	1	1	2026-06-12 19:58:20.278-03	2026-06-12 19:58:20.278-03
2	1	2	2026-06-12 19:58:20.278-03	2026-06-12 19:58:20.278-03
3	1	3	2026-06-12 19:58:20.278-03	2026-06-12 19:58:20.278-03
4	2	1	2026-06-12 19:58:20.287-03	2026-06-12 19:58:20.287-03
5	2	2	2026-06-12 19:58:20.287-03	2026-06-12 19:58:20.287-03
6	2	3	2026-06-12 19:58:20.287-03	2026-06-12 19:58:20.287-03
7	3	4	2026-06-12 19:58:20.298-03	2026-06-12 19:58:20.298-03
8	3	5	2026-06-12 19:58:20.298-03	2026-06-12 19:58:20.298-03
9	3	3	2026-06-12 19:58:20.298-03	2026-06-12 19:58:20.298-03
10	4	4	2026-06-12 19:58:20.305-03	2026-06-12 19:58:20.305-03
11	4	5	2026-06-12 19:58:20.305-03	2026-06-12 19:58:20.305-03
12	4	3	2026-06-12 19:58:20.305-03	2026-06-12 19:58:20.305-03
13	5	4	2026-06-12 19:58:20.312-03	2026-06-12 19:58:20.312-03
14	5	5	2026-06-12 19:58:20.312-03	2026-06-12 19:58:20.312-03
15	5	3	2026-06-12 19:58:20.312-03	2026-06-12 19:58:20.312-03
16	6	6	2026-06-12 19:58:20.321-03	2026-06-12 19:58:20.321-03
17	6	3	2026-06-12 19:58:20.321-03	2026-06-12 19:58:20.321-03
18	6	7	2026-06-12 19:58:20.321-03	2026-06-12 19:58:20.321-03
19	7	8	2026-06-12 19:58:20.33-03	2026-06-12 19:58:20.33-03
20	7	9	2026-06-12 19:58:20.33-03	2026-06-12 19:58:20.33-03
21	7	10	2026-06-12 19:58:20.33-03	2026-06-12 19:58:20.33-03
22	8	8	2026-06-12 19:58:20.334-03	2026-06-12 19:58:20.334-03
23	8	9	2026-06-12 19:58:20.334-03	2026-06-12 19:58:20.334-03
24	8	10	2026-06-12 19:58:20.334-03	2026-06-12 19:58:20.334-03
25	9	10	2026-06-12 19:58:20.343-03	2026-06-12 19:58:20.343-03
26	9	8	2026-06-12 19:58:20.343-03	2026-06-12 19:58:20.343-03
27	9	11	2026-06-12 19:58:20.343-03	2026-06-12 19:58:20.343-03
28	10	10	2026-06-12 19:58:20.35-03	2026-06-12 19:58:20.35-03
29	10	8	2026-06-12 19:58:20.35-03	2026-06-12 19:58:20.35-03
30	10	11	2026-06-12 19:58:20.35-03	2026-06-12 19:58:20.35-03
31	11	12	2026-06-12 19:58:20.357-03	2026-06-12 19:58:20.357-03
32	11	13	2026-06-12 19:58:20.357-03	2026-06-12 19:58:20.357-03
33	11	14	2026-06-12 19:58:20.357-03	2026-06-12 19:58:20.357-03
34	12	12	2026-06-12 19:58:20.363-03	2026-06-12 19:58:20.363-03
35	12	13	2026-06-12 19:58:20.363-03	2026-06-12 19:58:20.363-03
36	12	14	2026-06-12 19:58:20.363-03	2026-06-12 19:58:20.363-03
37	13	12	2026-06-12 19:58:20.37-03	2026-06-12 19:58:20.37-03
38	13	13	2026-06-12 19:58:20.37-03	2026-06-12 19:58:20.37-03
39	13	14	2026-06-12 19:58:20.37-03	2026-06-12 19:58:20.37-03
40	14	12	2026-06-12 19:58:20.378-03	2026-06-12 19:58:20.378-03
41	14	15	2026-06-12 19:58:20.378-03	2026-06-12 19:58:20.378-03
42	14	14	2026-06-12 19:58:20.378-03	2026-06-12 19:58:20.378-03
43	15	16	2026-06-12 19:58:20.385-03	2026-06-12 19:58:20.385-03
44	15	7	2026-06-12 19:58:20.385-03	2026-06-12 19:58:20.385-03
45	15	17	2026-06-12 19:58:20.385-03	2026-06-12 19:58:20.385-03
46	16	16	2026-06-12 19:58:20.391-03	2026-06-12 19:58:20.391-03
47	16	7	2026-06-12 19:58:20.391-03	2026-06-12 19:58:20.391-03
48	16	17	2026-06-12 19:58:20.391-03	2026-06-12 19:58:20.391-03
49	17	18	2026-06-12 19:58:20.402-03	2026-06-12 19:58:20.402-03
50	17	7	2026-06-12 19:58:20.402-03	2026-06-12 19:58:20.402-03
51	17	19	2026-06-12 19:58:20.402-03	2026-06-12 19:58:20.402-03
52	18	18	2026-06-12 19:58:20.407-03	2026-06-12 19:58:20.407-03
53	18	7	2026-06-12 19:58:20.407-03	2026-06-12 19:58:20.407-03
54	18	19	2026-06-12 19:58:20.407-03	2026-06-12 19:58:20.407-03
55	19	20	2026-06-12 19:58:20.418-03	2026-06-12 19:58:20.418-03
56	19	3	2026-06-12 19:58:20.418-03	2026-06-12 19:58:20.418-03
57	19	8	2026-06-12 19:58:20.418-03	2026-06-12 19:58:20.418-03
58	20	20	2026-06-12 19:58:20.424-03	2026-06-12 19:58:20.424-03
59	20	3	2026-06-12 19:58:20.424-03	2026-06-12 19:58:20.424-03
60	20	8	2026-06-12 19:58:20.424-03	2026-06-12 19:58:20.424-03
61	21	20	2026-06-12 19:58:20.432-03	2026-06-12 19:58:20.432-03
62	21	3	2026-06-12 19:58:20.432-03	2026-06-12 19:58:20.432-03
63	21	8	2026-06-12 19:58:20.432-03	2026-06-12 19:58:20.432-03
64	22	21	2026-06-12 19:58:20.44-03	2026-06-12 19:58:20.44-03
65	22	2	2026-06-12 19:58:20.44-03	2026-06-12 19:58:20.44-03
66	22	20	2026-06-12 19:58:20.44-03	2026-06-12 19:58:20.44-03
67	23	22	2026-06-12 19:58:20.448-03	2026-06-12 19:58:20.448-03
68	23	23	2026-06-12 19:58:20.448-03	2026-06-12 19:58:20.448-03
69	24	22	2026-06-12 19:58:20.452-03	2026-06-12 19:58:20.452-03
70	24	23	2026-06-12 19:58:20.452-03	2026-06-12 19:58:20.452-03
\.


--
-- Name: Collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Collections_id_seq"', 4, true);


--
-- Name: Comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Comments_id_seq"', 12, true);


--
-- Name: Conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Conversations_id_seq"', 4, true);


--
-- Name: Followers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Followers_id_seq"', 14, true);


--
-- Name: Images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Images_id_seq"', 27, true);


--
-- Name: Messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Messages_id_seq"', 11, true);


--
-- Name: Notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Notifications_id_seq"', 55, true);


--
-- Name: Publications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Publications_id_seq"', 15, true);


--
-- Name: Ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Ratings_id_seq"', 72, true);


--
-- Name: Reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Reports_id_seq"', 9, true);


--
-- Name: Tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Tags_id_seq"', 23, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Users_id_seq"', 6, true);


--
-- Name: collections_publications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.collections_publications_id_seq', 10, true);


--
-- Name: images_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.images_tags_id_seq', 70, true);


--
-- Name: Collections Collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT "Collections_pkey" PRIMARY KEY (id);


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: Conversations Conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversations"
    ADD CONSTRAINT "Conversations_pkey" PRIMARY KEY (id);


--
-- Name: Followers Followers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Followers"
    ADD CONSTRAINT "Followers_pkey" PRIMARY KEY (id);


--
-- Name: Images Images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Images"
    ADD CONSTRAINT "Images_pkey" PRIMARY KEY (id);


--
-- Name: Messages Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- Name: Notifications Notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY (id);


--
-- Name: Publications Publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Publications"
    ADD CONSTRAINT "Publications_pkey" PRIMARY KEY (id);


--
-- Name: Ratings Ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_pkey" PRIMARY KEY (id);


--
-- Name: Reports Reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Tags Tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tags"
    ADD CONSTRAINT "Tags_pkey" PRIMARY KEY (id);


--
-- Name: Tags Tags_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tags"
    ADD CONSTRAINT "Tags_title_key" UNIQUE (title);


--
-- Name: Users Users_nickname_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_nickname_key" UNIQUE (nickname);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: collections_publications collections_publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_publications
    ADD CONSTRAINT collections_publications_pkey PRIMARY KEY (id);


--
-- Name: images_tags images_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images_tags
    ADD CONSTRAINT images_tags_pkey PRIMARY KEY (id);


--
-- Name: collections_publications uq_collection_publication; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_publications
    ADD CONSTRAINT uq_collection_publication UNIQUE (collection_id, publication_id);


--
-- Name: Conversations uq_conversation_image_buyer; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversations"
    ADD CONSTRAINT uq_conversation_image_buyer UNIQUE (image_id, buyer_id);


--
-- Name: Followers uq_follower_followed; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Followers"
    ADD CONSTRAINT uq_follower_followed UNIQUE (follower_id, followed_id);


--
-- Name: images_tags uq_image_tag; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images_tags
    ADD CONSTRAINT uq_image_tag UNIQUE (image_id, tag_id);


--
-- Name: Collections uq_user_collection_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT uq_user_collection_name UNIQUE (user_id, name);


--
-- Name: Reports uq_user_comment_report; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT uq_user_comment_report UNIQUE (user_id, comment_id);


--
-- Name: Ratings uq_user_image_rating; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT uq_user_image_rating UNIQUE (user_id, image_id);


--
-- Name: Reports uq_user_image_report; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT uq_user_image_report UNIQUE (user_id, image_id);


--
-- Name: idx_collections_publications_publication_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collections_publications_publication_id ON public.collections_publications USING btree (publication_id);


--
-- Name: idx_collections_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collections_user_id ON public."Collections" USING btree (user_id);


--
-- Name: idx_comments_image_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_image_id ON public."Comments" USING btree (image_id);


--
-- Name: idx_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_comments_user_id ON public."Comments" USING btree (user_id);


--
-- Name: idx_conversations_buyer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversations_buyer_id ON public."Conversations" USING btree (buyer_id);


--
-- Name: idx_conversations_image_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversations_image_id ON public."Conversations" USING btree (image_id);


--
-- Name: idx_conversations_seller_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversations_seller_id ON public."Conversations" USING btree (seller_id);


--
-- Name: idx_followers_followed_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_followers_followed_id ON public."Followers" USING btree (followed_id);


--
-- Name: idx_images_publication_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_images_publication_id ON public."Images" USING btree (publication_id);


--
-- Name: idx_images_tags_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_images_tags_tag_id ON public.images_tags USING btree (tag_id);


--
-- Name: idx_messages_conversation_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_conversation_created ON public."Messages" USING btree (conversation_id, "createdAt");


--
-- Name: idx_messages_sender_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender_id ON public."Messages" USING btree (sender_id);


--
-- Name: idx_notifications_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_created ON public."Notifications" USING btree (user_id, "createdAt");


--
-- Name: idx_notifications_user_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_read ON public."Notifications" USING btree (user_id, read_at);


--
-- Name: idx_publications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_publications_user_id ON public."Publications" USING btree (user_id);


--
-- Name: idx_ratings_image_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ratings_image_id ON public."Ratings" USING btree (image_id);


--
-- Name: idx_reports_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_comment_id ON public."Reports" USING btree (comment_id);


--
-- Name: idx_reports_image_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reports_image_id ON public."Reports" USING btree (image_id);


--
-- Name: Collections Collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT "Collections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_image_id_fkey" FOREIGN KEY (image_id) REFERENCES public."Images"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversations Conversations_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversations"
    ADD CONSTRAINT "Conversations_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversations Conversations_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversations"
    ADD CONSTRAINT "Conversations_image_id_fkey" FOREIGN KEY (image_id) REFERENCES public."Images"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Conversations Conversations_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Conversations"
    ADD CONSTRAINT "Conversations_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Followers Followers_followed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Followers"
    ADD CONSTRAINT "Followers_followed_id_fkey" FOREIGN KEY (followed_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Followers Followers_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Followers"
    ADD CONSTRAINT "Followers_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Images Images_publication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Images"
    ADD CONSTRAINT "Images_publication_id_fkey" FOREIGN KEY (publication_id) REFERENCES public."Publications"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages Messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public."Conversations"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages Messages_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_image_id_fkey" FOREIGN KEY (image_id) REFERENCES public."Images"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notifications Notifications_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notifications Notifications_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_image_id_fkey" FOREIGN KEY (image_id) REFERENCES public."Images"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notifications Notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Publications Publications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Publications"
    ADD CONSTRAINT "Publications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ratings Ratings_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_image_id_fkey" FOREIGN KEY (image_id) REFERENCES public."Images"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ratings Ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Ratings"
    ADD CONSTRAINT "Ratings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reports Reports_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES public."Comments"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reports Reports_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_image_id_fkey" FOREIGN KEY (image_id) REFERENCES public."Images"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reports Reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: collections_publications collections_publications_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_publications
    ADD CONSTRAINT collections_publications_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public."Collections"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: collections_publications collections_publications_publication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_publications
    ADD CONSTRAINT collections_publications_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public."Publications"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: images_tags images_tags_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images_tags
    ADD CONSTRAINT images_tags_image_id_fkey FOREIGN KEY (image_id) REFERENCES public."Images"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: images_tags images_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images_tags
    ADD CONSTRAINT images_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public."Tags"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict G0UdD6AW1lw8xHect0HG0Xhitk7N6aGGi9dUOQw3nsfMdhng7haAPUuhksAiHW8

