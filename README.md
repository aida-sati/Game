# Real-Time Battleship Game (Schiffe versenken)

Ein interaktives Full-Stack-Webprojekt des klassischen Spiels "Schiffe versenken", umgesetzt als Multiplayer-Spiel in Echtzeit unter Verwendung von WebSockets.

---

## 🎯 Hauptfeatures

- **1v1-Multiplayer:** Echtzeit-Duell zwischen zwei Spielern über eine dedizierte Netzwerkverbindung.
- **Synchronisierter Spielablauf:** Bidirektionale Übertragung von Spielzügen (Schüssen) und Treffer-Feedback ohne spürbare Latenz.
- **Interaktives UI:** Visuelle Darstellung des eigenen und des gegnerischen Spielfelds mit Live-Statusaktualisierung via DOM-Manipulation.
- **Serverseitige Validierung:** Grundlegende Logikprüfung auf dem Node.js-Server (z. B. Wer ist an der Reihe?), um die Integrität des Spielablaufs zu gewährleisten.

---

## 🛠️ Technologie-Stack

| Schicht           | Technologien                   | Beschreibung                                                   |
| :---------------- | :----------------------------- | :------------------------------------------------------------- |
| **Frontend**      | HTML5, CSS3, JavaScript (ES6+) | Dynamische Manipulation des DOM und Event-Handling             |
| **Backend**       | Node.js, Express               | Server-Infrastruktur und Bereitstellung der statischen Dateien |
| **Kommunikation** | Socket.io / WebSockets         | Event-basierte Echtzeit-Kommunikation (Bidirektional)          |

---

## 🌐 Echtzeit-Kommunikation & Netzwerkarchitektur

Das Projekt wurde als **dedizierte 1v1-Multiplayer-Anwendung** konzipiert. Die Kommunikation basiert auf einer Event-gesteuerten Architektur via **WebSockets (Socket.io)**:

- **Direktes Matchmaking:** Der Node.js-Server fungiert als Vermittler (Broker) für genau eine aktive Spielpaarung. Sobald zwei Clients verbunden sind, wird das Match automatisch initiiert.
- **Zustands-Synchronisation (State Sync):** Da es sich um eine exklusive Spielinstanz handelt, steuert der Server den globalen Status (z. B. Wechsel der Spielzüge, Spielende) zentral und pusht die Updates simultan an beide Kontrahenten.
- **Event-Pipeline:** Die Interaktionen sind schlank gehalten: Ein Client sendet ein `fire-shot`-Event, der Server berechnet das Ergebnis und verteilt es über spezifische Events (`hit` / `miss`) an beide Spieler, um die Benutzeroberfläche synchron zu halten.

---

## 💻 Installation & Lokaler Start (Local Setup)

Befolgen Sie diese Schritte, um das Projekt lokal auszuführen:

1. **Repository klonen:**

   ```bash

   ```
