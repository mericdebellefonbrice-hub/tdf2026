# 🚴 TDF 2026 — Appli de Pronostics

Application web de pronostics pour le Tour de France 2026 (Barcelone → Paris, 4–26 juillet).

Chaque groupe a son propre code d'accès. Les pronostics et le classement se mettent à jour en temps réel pour tous les membres du groupe.

---

## ⚡ Déploiement en 10 minutes

### ÉTAPE 1 — Créer le projet Firebase (base de données)

1. Va sur **[console.firebase.google.com](https://console.firebase.google.com)**
2. Clique **"Ajouter un projet"** → donne-lui un nom (ex: `tdf2026-pronostics`)
3. Désactive Google Analytics (pas nécessaire) → **"Créer le projet"**
4. Dans le menu gauche, clique **Firestore Database** → **"Créer une base de données"**
   - Choisis **"Démarrer en mode production"**
   - Sélectionne une région (ex: `europe-west1`) → **"Activer"**
5. Va dans **Règles** et remplace le contenu par :
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   Clique **"Publier"**

6. Reviens sur la page d'accueil du projet, clique l'icône **`</>`** (Ajouter une app web)
7. Donne un nom à l'app → **"Enregistrer l'app"**
8. **Copie la config `firebaseConfig`** qui s'affiche — tu en auras besoin à l'étape 3

---

### ÉTAPE 2 — Mettre le code sur GitHub

**Option A (recommandée) — GitHub.com :**
1. Va sur **[github.com](https://github.com)** → **New repository**
2. Donne un nom (ex: `tdf2026`) → **Create repository**
3. Upload tous les fichiers de ce dossier (bouton "uploading an existing file")
4. Commit

**Option B — En ligne de commande :**
```bash
cd tdf2026
git init
git add .
git commit -m "TDF 2026 Pronostics"
git remote add origin https://github.com/TON_USERNAME/tdf2026.git
git push -u origin main
```

---

### ÉTAPE 3 — Déployer sur Vercel

1. Va sur **[vercel.com](https://vercel.com)** → **"Add New Project"**
2. **Import** ton repo GitHub `tdf2026`
3. Vercel détecte Vite automatiquement → ne change rien
4. Avant de déployer, clique **"Environment Variables"** et ajoute :

| Nom | Valeur (depuis ta config Firebase) |
|-----|-------------------------------------|
| `VITE_FIREBASE_API_KEY` | valeur `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | valeur `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | valeur `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | valeur `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | valeur `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | valeur `appId` |

5. Clique **"Deploy"** → ✅ Done ! Vercel te donne un lien `ton-projet.vercel.app`

---

## 🎮 Comment ça marche

### Créer un groupe
- Ouvre l'appli → **"Créer un groupe"**
- Entre ton prénom et un nom de groupe
- Un code à 6 lettres est généré (ex: `TDFK4M`)
- Partage ce code sur WhatsApp avec tes amis

### Rejoindre un groupe
- Ouvre l'appli → **"Rejoindre avec un code"**
- Entre le code reçu + ton prénom
- Tu accèdes directement aux pronostics du groupe

### Faire ses pronostics
- **Maillots** (Jaune, Vert, Pois, Blanc) : 50 pts au total
- **21 étapes** : 5 pts par vainqueur correct
- Score maximum : **155 pts**
- Clique **Sauvegarder** → tes pronostics sont en ligne immédiatement

### Suivre le classement
- Onglet **🏆 Classement** : classement en temps réel de tous les membres du groupe
- Le classement se met à jour automatiquement dès qu'un résultat est publié

### Saisir les résultats (admin)
- Onglet **⚙️ Admin** → code : `TOUR2026`
- Après chaque étape, sélectionne le vainqueur et clique **"Publier les résultats"**
- Les scores de tout le groupe se recalculent instantanément

### Plusieurs groupes
- Tu peux créer autant de groupes que tu veux (collègues, amis, famille)
- Chaque groupe est complètement isolé
- Bouton **"Changer de groupe"** pour switcher

---

## 📁 Structure du projet

```
tdf2026/
├── index.html              # Point d'entrée
├── package.json            # Dépendances (React + Firebase + Vite)
├── vite.config.js          # Config Vite
├── .env.example            # Template des variables d'environnement
└── src/
    ├── main.jsx            # Bootstrap React
    ├── firebase.js         # Config Firebase (lit les env vars)
    ├── data.js             # Données TDF 2026 (étapes, coureurs, maillots)
    └── App.jsx             # Application complète
```

---

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local
# (puis remplis les vraies valeurs Firebase dans .env.local)

# Lancer en local
npm run dev
# → http://localhost:5173
```

---

## 📊 Structure des données Firebase

```
Firestore/
└── groups/
    └── {CODE_GROUPE}/          # ex: TDFK4M
        ├── name: "Collègues"
        ├── createdBy: "Brice"
        ├── createdAt: timestamp
        ├── predictions/
        │   └── {prenom}/       # ex: "Thomas"
        │       ├── stages: { "1": "pogacar", "2": "philipsen", ... }
        │       ├── jerseys: { jaune: "pogacar", vert: "philipsen", ... }
        │       └── updatedAt: timestamp
        └── results/
            └── official/
                ├── stages: { "1": "pogacar", ... }
                ├── jerseys: { jaune: "pogacar", ... }
                └── updatedAt: timestamp
```

---

## 🔒 Sécurité

Le code admin (`TOUR2026`) est en clair dans le client — suffisant pour un usage entre amis/collègues. Pour un usage plus large, tu peux le changer directement dans `src/App.jsx` (cherche `TOUR2026`).

Les règles Firestore sont ouvertes (pas d'authentification). Convient pour un petit groupe de confiance.

---

*TDF 2026 · 113e édition · Barcelone–Paris · 4–26 juillet · 21 étapes · 3 333 km*
