-- Create the table for blog posts
CREATE TABLE posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  image TEXT,
  dataAiHint TEXT,
  excerpt TEXT,
  content TEXT,
  tags TEXT[]
);

-- Create the table for admin users
CREATE TABLE admin_users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Insert the initial admin user
INSERT INTO admin_users (email, password)
VALUES ('Deepak', 'bagada1993');

-- Enable Row Level Security for the posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access to all posts
CREATE POLICY "Allow public read access" ON posts
FOR SELECT USING (true);

-- Create a policy that allows admin users to perform all actions
CREATE POLICY "Allow full access for admins" ON posts
FOR ALL USING (true) WITH CHECK (true);

-- Enable Row Level Security for the admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows admin users to read their own data
CREATE POLICY "Allow admin read access" ON admin_users
FOR SELECT USING (true);

-- Set up Supabase storage for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access for post images" ON storage.objects
FOR SELECT USING (bucket_id = 'posts');

CREATE POLICY "Allow insert for post images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'posts');

CREATE POLICY "Allow update for post images" ON storage.objects
FOR UPDATE USING (bucket_id = 'posts');

CREATE POLICY "Allow delete for post images" ON storage.objects
FOR DELETE USING (bucket_id = 'posts');