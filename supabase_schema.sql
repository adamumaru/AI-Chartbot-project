-- supabase_schema.sql
-- Create SQL schema for storing Health Tips chatbot chats and messages.
-- Copy-paste this script into your Supabase Dashboard -> SQL Editor and click "Run".

-- 1. Create the chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp BIGINT NOT NULL -- stored as epoch timestamp (milliseconds) for seamless frontend loading
);

-- 3. Enable Row Level Security (RLS) for absolute privacy
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Create security policies for public.chats table
CREATE POLICY "Allow users to view their own chats" 
    ON public.chats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own chats" 
    ON public.chats FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own chats" 
    ON public.chats FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own chats" 
    ON public.chats FOR DELETE 
    USING (auth.uid() = user_id);

-- 5. Create security policies for public.messages table
-- Note: A user can access a message if it belongs to one of their chats.
CREATE POLICY "Allow users to view messages in their chats" 
    ON public.messages FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow users to insert messages into their chats" 
    ON public.messages FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow users to delete messages in their chats" 
    ON public.messages FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid()
        )
    );
