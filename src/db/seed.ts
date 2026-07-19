import crypto from "node:crypto";
import { db } from ".";
import { stations } from "./schema";

const stationData = [
  { name: "Station 1", hint: "Folgt dem Weg zum alten Brunnen" },
  { name: "Station 2", hint: "Such den großen Baum auf der Wiese" },
  { name: "Station 3", hint: "Geht zum roten Pavillon" },
  { name: "Station 4", hint: "Findet die versteckte Bank am See" },
  { name: "Finale", hint: "Versammelt euch am Festplatz", isFinal: true },
];

async function seed() {
  for (const s of stationData) {
    const token = crypto.randomBytes(12).toString("base64url");
    await db.insert(stations).values({
      name: s.name,
      token,
      hint: s.hint,
      isFinal: s.isFinal ?? false,
    });
    console.log(`Created "${s.name}" with token: ${token}`);
  }
  console.log("Seed complete");
}

seed().catch(console.error);
