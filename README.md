## Description
Un système complet et fluide de planification en temps réel permettant de gérer l'organisation de créneaux horaires, de rendez-vous ou d'événements.

## Fonctionnalités
Calendrier interactif avec affichage des disponibilités en direct

Prise de rendez-vous, modification et annulation de créneaux

Système anti-conflit pour empêcher les doubles réservations simultanées

Notifications et rappels automatiques des réservations validées

## Technologies
React (TypeScript)

Node.js & Express

PostgreSQL (Volume persistant dédié)

Nginx & Docker

Bash
# ## Installation & Docker
cd reservation-platform-Gemini
sudo docker compose up --build

# ## Spécificités et Configuration Réseau
# 🌐 Accès Web Principal   : http://localhost:3002
# ⚙️ Port Frontend (Nginx) : 3002 -> Port et routage totalement isolés de la suite
# ⚡ Port Backend (API)     : Gestion des flux asynchrones reliée en interne via les endpoints `/api/*`
# 🐘 Base de données       : PostgreSQL isolé de manière autonome sur le port externe 5434
