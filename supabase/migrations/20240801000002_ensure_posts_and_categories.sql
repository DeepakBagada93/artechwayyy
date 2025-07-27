-- Create the posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.posts (
    id bigint NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL,
    image text NOT NULL,
    "dataAiHint" text,
    excerpt text NOT NULL,
    content text NOT NULL,
    tags text[] NOT NULL,
    category text
);

-- Make sure the sequence for the ID exists and is owned by the table
CREATE SEQUENCE IF NOT EXISTS public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE public.posts_id_seq OWNER TO postgres;
ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;
ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);

-- Drop the function if it exists to ensure a clean re-creation
DROP FUNCTION IF EXISTS public.get_distinct_categories();

-- Create the function to get distinct categories
CREATE OR REPLACE FUNCTION public.get_distinct_categories()
RETURNS TABLE(category text)
LANGUAGE sql
AS $$
    SELECT DISTINCT category FROM public.posts WHERE category IS NOT NULL AND category != '';
$$;
ALTER FUNCTION public.get_distinct_categories() OWNER TO postgres;

-- Grant execution rights on the function to the public anon role
GRANT EXECUTE ON FUNCTION public.get_distinct_categories() TO anon;


-- Enable Row Level Security on the posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;

-- Create a policy to allow public read access to the posts table
CREATE POLICY "Enable read access for all users" ON public.posts
AS PERMISSIVE FOR SELECT
TO public
USING (true);
