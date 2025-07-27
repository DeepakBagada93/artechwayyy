-- Create admin_users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Insert initial admin users
INSERT INTO admin_users (email, password) VALUES
('deepak@studio.com', 'bagada1993'),
('deeepakbagada25@gmail.com', 'bagada1993');

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image TEXT,
    "dataAiHint" TEXT,
    excerpt TEXT,
    content TEXT,
    tags TEXT[]
);

-- RLS for posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts table
CREATE POLICY "Allow public read access to posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow admin to insert posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin to update posts" ON posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin to delete posts" ON posts FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for storage bucket 'posts'
CREATE POLICY "Allow public read access to post images" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "Allow admin to upload post images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
CREATE POLICY "Allow admin to update post images" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
CREATE POLICY "Allow admin to delete post images" ON storage.objects FOR DELETE WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');
