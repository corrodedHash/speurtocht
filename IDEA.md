# Schnitzeljagd – Wochenend-Wedding-Retreat

## Übersicht

Eine browserbasierte Schnitzeljagd für ~60 Personen, aufgeteilt in ~4 Gruppen.
Jede Gruppe durchläuft 4 Stationen + 1 Finalstation.
Ziel: ein spielerischer Programmpunkt für das Wedding-Retreat, bei dem Teams
gegeneinander antreten, Fotos machen und am Ende eine gemeinsame Vorstellung
stattfindet.

---

## Spielablauf

### 1. Registrierung

Jede Gruppe scannt einen **Start-QR-Code**, der zur Webapp führt.
Die Gruppe wird angelegt und erhält eine eindeutige Gruppen-ID.
Weitere Mitglieder können über einen **Share-Link oder QR-Code des Gruppenleiters**
der Gruppe beitreten.

### 2. Stationen-Struktur

Es gibt 4 Stationen plus Finale. Jede Station hat einen **eindeutigen,
unratbaren Token** (min. 10 Zeichen Base64-URL-safe). Die Token werden
vor dem Spiel generiert und in die QR-Codes sowie auf die Zettel gedruckt.
Der Hinweiszettel an Station X zeigt nicht die nächste Station an, sondern
die Gruppe muss die nächste Station selbstständig finden (klassische
Schnitzeljagd).

### 3. Scannen = Freischalten (unabhängig von der Reihenfolge)

Scannt eine Gruppe einen QR-Code, wird diese Station für sie freigeschaltet
– **unabhängig davon, ob sie reihum dran wäre**. Findet eine Gruppe zufällig
eine spätere Station zuerst, haben sie Glück gehabt. Ziel ist es, alle
4 Stationen + das Finale zu finden.

Gruppen starten an unterschiedlichen Stationen (Startzuweisung durch Admin),
um Staus zu vermeiden:

- Gruppe A startet an Station 1
- Gruppe B startet an Station 2
- Gruppe C startet an Station 3
- Gruppe D startet an Station 4

### 4. Finalstation

Sobald eine Gruppe alle 4 Stationen freigeschaltet hat, wird der finale
Hinweis freigegeben, der zur Finalstation führt. Dort wird der Abschluss
registriert.

### 5. Fotoupload (während des Spiels)

Gruppen können unterwegs Fotos hochladen (Dateiauswahl, keine Kamera-API).
Die Fotos werden stationsbezogen gespeichert und später für eine
Präsentation/Galerie verwendet.

---

## Admin-Ansicht

- Live-Übersicht über alle Gruppen und deren aktuellen Fortschritt
- Gruppenmitglieder verwalten (hinzufügen/entfernen)
- Fortschritt manuell setzen/zurücksetzen (z. B. bei technischen Problemen)
- Hinweise manuell freischalten / einen neuen Hinweis geben
- Hochgeladene Fotos einsehen

---

## Technischer Stack

| Bereich       | Technologie                          |
|---------------|--------------------------------------|
| Frontend      | React + shadcn/ui + Tailwind         |
| Framework     | Next.js (App Router)                 |
| Backend       | Next.js API Routes                   |
| Datenbank     | PostgreSQL                           |
| ORM           | Drizzle                              |
| Sprache       | TypeScript                           |
| Hosting       | VPS                                  |

### Auth

Kein klassisches Login. Gruppen werden über einen Start-QR-Code angelegt und
per LocalStorage + Gruppen-ID identifiziert. Admin-Zugriff über ein
Shared-Secret oder einfache Passwortabfrage.

### QR-Codes / Stationstoken

Jede Station bekommt einen **zufälligen, unratbaren Token** (min. 10 Zeichen,
Base64-URL-safe, z. B. mit `crypto.randomBytes` generiert). Die URL lautet
`/station/<token>`. Die Token werden vor dem Spiel erzeugt, in der DB
gespeichert und in die QR-Codes sowie auf die Zettel gedruckt.
Es gibt keine fortlaufenden Nummern – das Raten von Station-URLs ist
damit ausgeschlossen.

---

## Future Work

- **PWA / Offline-Funktionalität** – Service Worker und IndexedDB, damit die App
  auch bei schlechtem Empfang nutzbar ist und später synchronisiert.
- **Kamera-API** – Fotos direkt in der App aufnehmen statt nur Dateiauswahl.
- **OAuth / echter Login** – z. B. Magic Link oder Gast-Zugang, damit
  Gruppenmitglieder nicht nur über einen geteilten Link beitreten müssen.
- **Echtzeit-Updates** – WebSockets / Server-Sent Events, damit Admins und
  Gruppen live sehen, wer wo ist.
- **Leaderboard / Rangliste** – wer war zuerst im Ziel? Nach welchem Kriterium
  (Zeit, Punkte, Foto-Qualität)?
- **Automatische Diashow / Galerie** – alle hochgeladenen Fotos am Ende
  öffentlich für alle Teilnehmenden sichtbar.
- **Benachrichtigungen für Admins** – Push/Toast wenn eine Gruppe an einer
  Station ankommt.
- **Aufgaben bewerten** – Admins können eingereichte Fotos oder Aufgaben
  bewerten und Punkte vergeben.
- **Mehrere QR-Codes pro Station** – z. B. einer für Ankunft, einer für
  bestandene Aufgabe.
