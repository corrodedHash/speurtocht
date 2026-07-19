import { pgTable, text, timestamp, integer, uuid, boolean, serial } from "drizzle-orm/pg-core";

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  startStationId: integer("start_station_id"),
  finishedAt: timestamp("finished_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  token: text("token").unique().notNull(),
  hint: text("hint").notNull(),
  isFinal: boolean("is_final").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groupStations = pgTable("group_stations", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  stationId: integer("station_id")
    .notNull()
    .references(() => stations.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const photos = pgTable("photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  stationId: integer("station_id")
    .notNull()
    .references(() => stations.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});
