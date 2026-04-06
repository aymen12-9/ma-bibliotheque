# Déployer sur Render

## 1. Préparer le projet pour GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ton-username/ma-bibliotheque.git
git push -u origin main
```

## 2. Déployer le Backend sur Render

### Étape 1 : Créer un compte Render
1. Va sur [render.com](https://render.com)
2. Clique **"Sign up"** et connecte-toi avec GitHub

### Étape 2 : Créer le service backend
1. Dans le dashboard, clique **"New +"** → **"Web Service"**
2. Sélectionne ton GitHub repo `ma-bibliotheque`
3. Configure :
   - **Name** : `ma-bibliotheque-backend`
   - **Region** : Choisis la plus proche (ex. Frankfurt)
   - **Branch** : `main`
   - **Build command** : `npm install`
   - **Start command** : `node server.js`
   - **Runtime** : Node
4. Clique **"Create Web Service"**

### Étape 3 : Récupérer l'URL du backend
- Une fois déployé, tu verras une URL comme : `https://ma-bibliotheque-backend.onrender.com`
- Copie cette URL complète

## 3. Déployer le Frontend sur Netlify

### Étape 1 : Créer un compte Netlify
1. Va sur [netlify.com](https://netlify.com)
2. Clique **"Sign up"** et connecte-toi avec GitHub

### Étape 2 : Créer le site frontend
1. Clique **"Add new site"** → **"Import an existing project"**
2. Sélectionne ton repo GitHub `ma-bibliotheque`
3. Netlify détecte automatiquement :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
4. Clique **"Deploy site"**

### Étape 3 : Configurer les variables d'environnement
1. Dans le dashboard Netlify, va à **"Site settings"**
2. Clique **"Build & deploy"** → **"Environment"**
3. Clique **"Add environment variable"** et ajoute :
   ```
   VITE_API_URL=https://ma-bibliotheque-backend.onrender.com
   VITE_WS_URL=wss://ma-bibliotheque-backend.onrender.com
   ```
   (Remplace par ta vraie URL Render)

### Étape 4 : Redéployer
1. Dans l'onglet **"Deploys"**, clique **"Clear cache and retry"**
2. Attends que le déploiement se termine

## 4. Tester

1. Va sur ta URL Netlify (ex. `https://ma-bibliotheque.netlify.app`)
2. Ouvre le formulaire d'ajout de livre
3. Ajoute un livre et clique **"Enregistrer"**
4. Vérifie que l'ajout fonctionne en temps réel

## Architecture finale

```
┌─────────────────────┐
│  Mon navigateur     │
└────────┬────────────┘
         │
    ┌────▼─────┐
    │  Netlify  │
    │ Frontend  │
    └────┬─────┘
         │
      HTTPS/WSS
         │
    ┌────▼──────────────────┐
    │  Render                │
    │  Backend (Node.js)     │
    │  + JSON Server         │
    └────┬──────────────────┘
         │
    ┌────▼────────┐
    │  db.json     │
    └──────────────┘
```

## Troubleshooting

### WebSocket ne se connecte pas
- Vérifie que tu utilises `wss://` (secure WebSocket), pas `ws://`
- Vérifie que `VITE_WS_URL` est correctement défini dans Netlify

### Erreur 503 ou timeout
- Render peut être lent au démarrage (plan gratuit)
- Attends 1-2 minutes et réessaye

### Les données ne se sauvegardent pas
- Vérifie que les URLs d'environnement sont correctes
- Regarde la console du navigateur (F12 → Network)
- Regarde les logs Render

### Le backend s'endort après inactivité
- C'est normal sur le plan gratuit Render
- Au premier appel, il redémarre automatiquement (peut prendre 20-30s)
- Considère un upgrade ou utilise un keepalive service

## Important pour la persistance des données

Sur Render, le `/tmp` est accessible. Actuellement, `db.json` est en root du projet.
- Render peut recréer le container, donc les données peuvent être perdues
- **Solution** : Considère une vraie base de données (MongoDB, PostgreSQL) pour la production
- Pour l'MVP, c'est OK, mais sache que c'est temporaire
