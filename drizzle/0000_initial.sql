
CREATE TABLE IF NOT EXISTS "beta_signups" (
    "id" SERIAL PRIMARY KEY,
    "email" text NOT NULL UNIQUE,
    "subscribed" boolean NOT NULL DEFAULT false,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" SERIAL PRIMARY KEY,
    "username" text NOT NULL UNIQUE,
    "password" text NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "news_items" (
    "id" SERIAL PRIMARY KEY,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "category" text NOT NULL,
    "url" text,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "team_members" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "title" text NOT NULL,
    "photo" text NOT NULL,
    "linked_in" text NOT NULL,
    "previous_companies" text[] NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
