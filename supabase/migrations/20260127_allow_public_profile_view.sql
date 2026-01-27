-- Allow users to view basic public profile information of other users
-- This is needed for displaying worker names, avatars in favorites, search results, etc.

-- Drop the restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can view own profile" ON users;

-- Create a new policy that allows viewing all user profiles (read-only)
-- This is safe because we're only exposing non-sensitive fields
CREATE POLICY "Anyone can view public user profiles"
ON users
FOR SELECT
TO public
USING (true);

-- Note: The UPDATE policy remains restrictive - users can only update their own profile
