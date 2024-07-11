CREATE TABLE IF NOT EXISTS "games" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text,
	"pgnString" text,
	"white" numeric,
	"black" numeric,
	"created_at" timestamp,
	"updated_at" timestamp
);
