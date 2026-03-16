-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  pix_key TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('birthday', 'baby_shower', 'quinceanera', 'corporate', 'other')),
  honoree_name TEXT NOT NULL,
  honoree_age INTEGER CHECK (honoree_age >= 0 AND honoree_age <= 150),
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ,
  location_name TEXT,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  dress_code TEXT,
  observations TEXT,
  theme TEXT,
  color_primary TEXT DEFAULT '#FF6B9D',
  color_secondary TEXT DEFAULT '#C44569',
  cover_image_url TEXT,
  invite_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  max_guests INTEGER,
  allow_plus_ones BOOLEAN DEFAULT true,
  ask_dietary_restrictions BOOLEAN DEFAULT false,
  pix_enabled BOOLEAN DEFAULT false,
  photo_wall_enabled BOOLEAN DEFAULT true,
  message_board_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined', 'maybe')),
  plus_ones INTEGER DEFAULT 0 CHECK (plus_ones >= 0),
  dietary_restrictions TEXT,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  rsvp_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create gifts table
CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(12, 2),
  product_url TEXT,
  store_name TEXT,
  category TEXT,
  gift_type TEXT NOT NULL CHECK (gift_type IN ('product', 'quota', 'experience', 'pix')),
  is_group_gift BOOLEAN DEFAULT false,
  group_goal DECIMAL(12, 2),
  group_raised DECIMAL(12, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'purchased')),
  reserved_by TEXT,
  reserved_at TIMESTAMPTZ,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create gift_contributions table
CREATE TABLE gift_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
  contributor_name TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create event_photos table
CREATE TABLE event_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  uploaded_by TEXT,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create event_messages table
CREATE TABLE event_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_is_published ON events(is_published);
CREATE INDEX idx_events_is_archived ON events(is_archived);

CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX idx_guests_checked_in ON guests(checked_in);

CREATE INDEX idx_gifts_event_id ON gifts(event_id);
CREATE INDEX idx_gifts_status ON gifts(status);
CREATE INDEX idx_gifts_gift_type ON gifts(gift_type);
CREATE INDEX idx_gifts_is_group_gift ON gifts(is_group_gift);

CREATE INDEX idx_gift_contributions_gift_id ON gift_contributions(gift_id);
CREATE INDEX idx_gift_contributions_payment_status ON gift_contributions(payment_status);

CREATE INDEX idx_event_photos_event_id ON event_photos(event_id);
CREATE INDEX idx_event_photos_created_at ON event_photos(created_at);

CREATE INDEX idx_event_messages_event_id ON event_messages(event_id);
CREATE INDEX idx_event_messages_created_at ON event_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can only read their own profile
CREATE POLICY "Users can read own profile" ON users FOR SELECT
  USING (auth.uid()::text = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- RLS Policies for events table
-- Users can read their own events or published events
CREATE POLICY "Users can read own events or published events" ON events FOR SELECT
  USING (
    user_id::text = auth.uid()::text
    OR is_published = true
  );

-- Users can only create/update/delete their own events
CREATE POLICY "Users can create own events" ON events FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own events" ON events FOR UPDATE
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own events" ON events FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- RLS Policies for guests table
-- Allow reading guests if user owns the event or event is published
CREATE POLICY "Allow reading guests for published events or own events" ON guests FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE user_id::text = auth.uid()::text OR is_published = true
    )
  );

-- Allow inserting guests only for published events
CREATE POLICY "Allow inserting guests for published events" ON guests FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE is_published = true
    )
  );

-- RLS Policies for gifts table
-- Allow reading gifts if event is published or user owns event
CREATE POLICY "Allow reading gifts for published events or own events" ON gifts FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE user_id::text = auth.uid()::text OR is_published = true
    )
  );

-- Allow managing gifts only for own events
CREATE POLICY "Users can manage gifts for own events" ON gifts FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update gifts for own events" ON gifts FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM events WHERE user_id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete gifts for own events" ON gifts FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM events WHERE user_id::text = auth.uid()::text
    )
  );

-- RLS Policies for gift_contributions table
-- Allow reading contributions for published events or own events
CREATE POLICY "Allow reading contributions for published events" ON gift_contributions FOR SELECT
  USING (
    gift_id IN (
      SELECT g.id FROM gifts g
      JOIN events e ON g.event_id = e.id
      WHERE e.is_published = true OR e.user_id::text = auth.uid()::text
    )
  );

-- Allow inserting contributions for published events
CREATE POLICY "Allow inserting contributions for published events" ON gift_contributions FOR INSERT
  WITH CHECK (
    gift_id IN (
      SELECT g.id FROM gifts g
      JOIN events e ON g.event_id = e.id
      WHERE e.is_published = true
    )
  );

-- RLS Policies for event_photos table
-- Allow reading photos for published events or own events
CREATE POLICY "Allow reading photos for published events" ON event_photos FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE is_published = true OR user_id::text = auth.uid()::text
    )
  );

-- Allow uploading photos for published events
CREATE POLICY "Allow uploading photos for published events" ON event_photos FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE is_published = true
    )
  );

-- Allow managing photos for own events
CREATE POLICY "Users can manage photos for own events" ON event_photos FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM events WHERE user_id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete photos for own events" ON event_photos FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM events WHERE user_id::text = auth.uid()::text
    )
  );

-- RLS Policies for event_messages table
-- Allow reading messages for published events or own events
CREATE POLICY "Allow reading messages for published events" ON event_messages FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE is_published = true OR user_id::text = auth.uid()::text
    )
  );

-- Allow posting messages for published events
CREATE POLICY "Allow posting messages for published events" ON event_messages FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM events WHERE is_published = true AND message_board_enabled = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
