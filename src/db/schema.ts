import { integer, pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

// Decks created by a Clerk-authenticated user
export const decks = pgTable('decks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // Clerk user ID (string) – we don't manage users locally
  userId: varchar('user_id', { length: 255 }).notNull(),

  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Individual flashcards that belong to a deck
export const cards = pgTable('cards', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  deckId: integer('deck_id')
    .notNull()
    .references(() => decks.id, { onDelete: 'cascade' }),

  // Front and back of the card, e.g. "Dog" / "Anjing"
  front: text('front').notNull(),
  back: text('back').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

