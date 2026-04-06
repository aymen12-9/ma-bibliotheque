# Netlify Environment Variables Configuration

Cette section guide comment configurer les variables d'environnement dans Netlify pour se connecter au backend Render.

## 🔗 Backend URL
**URL Render Backend** : `https://ma-bibliotheque-r1zn.onrender.com`

## 📱 Configuration Netlify

### Étape 1 : Accéder aux paramètres
1. Va sur [app.netlify.com](https://app.netlify.com)
2. Sélectionne ton site (ex: ma-bibliotheque.netlify.app)
3. Clique **"Site settings"**

### Étape 2 : Ajouter les variables d'environnement
1. Dans le menu de gauche, clique **"Build & deploy"**
2. Puis clique **"Environment"**
3. Clique **"Add environment variable"**

### Étape 3 : Ajouter les variables

**Variable 1 : VITE_API_URL**
- **Key** : `VITE_API_URL`
- **Value** : `https://ma-bibliotheque-r1zn.onrender.com`
- Clique **"Save"**

**Variable 2 : VITE_WS_URL**
- **Key** : `VITE_WS_URL`
- **Value** : `wss://ma-bibliotheque-r1zn.onrender.com`
- Clique **"Save"**

### Étape 4 : Redéployer
1. Va dans l'onglet **"Deploys"**
2. Clique le menu **"..."** en haut à droite
3. Clique **"Clear cache and retry"**
4. Attends que le déploiement se termine (vert ✓)

---

## ✅ Vérification

Une fois redéployé :
1. Ouvre ton site Netlify
2. Ouvre la **Console du navigateur** (F12)
3. Ajoute un livre depuis le formulaire
4. Clique **"Enregistrer"**
5. Vérifie dans l'onglet **"Network"** que la requête va vers `https://ma-bibliotheque-r1zn.onrender.com`

---

## 🚀 URLs finales

- **Frontend** (Netlify) : `https://ton-site-netlify.netlify.app`
- **Backend** (Render) : `https://ma-bibliotheque-r1zn.onrender.com`
- **WebSocket** (Render) : `wss://ma-bibliotheque-r1zn.onrender.com`
