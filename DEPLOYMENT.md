# Guide de déploiement Ma Bibliothèque

## Architecture
- **Frontend** : React + TypeScript + Vite → Netlify
- **Backend** : Node.js + JSON Server → Railway/Render/Heroku

---

## Étape 1 : Déployer le Backend

### Option A : Railway (recommandé, gratuit)

1. Crée un compte sur [railway.app](https://railway.app)
2. Clique **"New Project"** → **"Deploy from GitHub"**
3. Connecte ton repo GitHub
4. Sélectionne ce projet
5. Dans les settings, définis la variable d'environnement :
   ```
   PORT=3001
   ```
6. Railway génère une URL : `https://your-project-xxxxx.railway.app`
7. Copie cette URL

### Option B : Render (gratuit)

1. Va sur [render.com](https://render.com)
2. **"New +"** → **"Web Service"**
3. Connecte GitHub
4. Sélectionne ce projet
5. Configure :
   - **Build command** : Laisse vide (Node auto-détecte)
   - **Start command** : `node server.js`
   - Ajoute les env vars si besoin
6. Clique **"Create Web Service"**

### Option C : Heroku (payant désormais, moins recommandé)

---

## Étape 2 : Préparer le Frontend pour Netlify

1. Crée un compte Netlify : [netlify.com](https://netlify.com)

2. Clique **"Add new site"** → **"Import an existing project"**

3. Connecte ton repo GitHub

4. Configure :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - Clique **"Deploy site"**

5. Ajoute les variables d'environnement dans Netlify :
   - Va à **"Site settings"** → **"Build & deploy"** → **"Environment"**
   - Ajoute :
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     VITE_WS_URL=wss://your-backend-url.railway.app
     ```
     (Remplace `your-backend-url` par l'URL de ton backend Railway/Render)

6. Déclenche un redéploiement :
   - Clique l'onglet **"Deploys"**
   - Clique **"Clear cache and retry"** ou fais un `git push`

---

## Étape 3 : Tester

1. Va sur le lien Netlify (par ex. `https://ma-bibliotheque.netlify.app`)
2. Ouvre le formulaire d'ajout de livre
3. Clique **"Enregistrer"**
4. L'ajout doit se synchroniser en temps réel

---

## Architecture finale

```
┌─────────────────────────────────┐
│  Navigateur de l'utilisateur    │
└────────────┬────────────────────┘
             │
             ├─ GET /              (statique)
             │
    ┌────────▼────────┐
    │ Netlify         │
    │ (Frontend React)│
    └────────┬────────┘
             │
         HTTP/WS
      API requests & WebSocket
             │
    ┌────────▼──────────────────────────┐
    │ Railway/Render                    │
    │ (Node.js + JSON Server)           │
    │ (:3001 avec HTTPS/WSS)           │
    └────────┬──────────────────────────┘
             │
    ┌────────▼────────────┐
    │ db.json (données)   │
    └─────────────────────┘
```

---

## Commandes locales

```bash
# Dev
npm run dev          # Frontend + Vite
npm run server       # Backend (autre terminal)

# Build pour prod
npm run build        # Génère dist/

# Test build local
npm run preview      # Simule la version build
```

---

## Troubleshooting

### Erreur CORS
Si tu vois une erreur CORS, c'est que le backend URL n'est pas correcte en production.
- Vérifie que `VITE_API_URL` et `VITE_WS_URL` sont définis dans Netlify
- Redéploie

### WebSocket ne se connecte pas
Utilise `wss://` (secure WebSocket) en production, pas `ws://`.

### Le backend dort après inactivité (gratuit)
Sur Railway/Render gratuit, le serveur peut s'endormir.
- Keepalive : utilise un service comme [uptimerobot.com](https://uptimerobot.com)
- Ou upgrade aux plans payants

---

## URLs finales

- **Frontend** (Netlify) : `https://ma-bibliotheque.netlify.app`
- **Backend** (Railway) : `https://your-project-xxxxx.railway.app`
