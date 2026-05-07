# Detexi — Signatures email

Signatures email officielles Detexi, alignées sur la charte production (palette teal `#117B69` + Neutral Primary `#131413`).

## Fichiers

| Fichier | Usage | Email |
|---------|-------|-------|
| `signature_maxime.html` | Maxime Goffinet | maxime@detexi.be |
| `signature_contact.html` | Detexi Contact Center | contact@detexi.be |

## Caractéristiques visuelles

- **Logo header** : hébergé sur Supabase Storage (CDN)
  - URL : `https://qelzuiqqkygusrbwaerp.supabase.co/storage/v1/object/public/logo_Detexi/detexi-logo.png`
- **Couleurs** : `#117B69` (Accent Primary), `#131413` (Neutral Primary), `#FFFFFF` (icônes)
- **Lignes** : teal #117B69 avec fade aux extrémités
- **Icônes** (téléphone, email, pin) : SVG embed, fond teal, pictos blancs
- **Typographie** : Arial / Helvetica (compatibilité maximale tous clients mail)
- **Largeur** : 540px max

## Installation

### Gmail
1. Ouvrir le fichier `.html` dans un navigateur
2. Sélectionner tout le bloc visible (Ctrl+A dans la zone signature)
3. Copier (Ctrl+C)
4. Gmail → Paramètres ⚙ → Voir tous les paramètres → Général → Signature
5. Coller (Ctrl+V), enregistrer

### Outlook (desktop)
1. Ouvrir le fichier `.html` dans Internet Explorer/Edge
2. Sélectionner et copier le bloc
3. Outlook → Fichier → Options → Courrier → Signatures
4. Créer une nouvelle signature, coller, enregistrer

### Outlook (web) / Office 365
1. Ouvrir le fichier `.html` dans un navigateur
2. Sélectionner et copier le bloc
3. Outlook web → Paramètres ⚙ → Afficher tous les paramètres Outlook → Courrier → Composer et répondre
4. Coller dans le champ Signature, enregistrer

## Note technique

Le logo est chargé depuis Supabase Storage (projet `qelzuiqqkygusrbwaerp`, bucket public `logo_Detexi`) au moment où le destinataire ouvre le mail. Gmail charge automatiquement les images des contacts/expéditeurs connus. Outlook demande l'autorisation la première fois puis retient.

**Avantages Supabase vs raw GitHub :**
- CDN dédié plus rapide (latence réduite)
- Pas de rate limit
- Domaine plus professionnel pour la délivrabilité mail

## Mise à jour

Pour modifier le logo affiché dans toutes les signatures, remplacer simplement le fichier `detexi-logo.png` dans le bucket Supabase `logo_Detexi`. Les signatures déjà envoyées récupèrent automatiquement la nouvelle version (cache CDN à prendre en compte).

## Charte appliquée

| Élément | Couleur |
|---------|---------|
| Lignes haut/bas | `#117B69` (avec fade aux bords) |
| Fond icônes | `#117B69` |
| Pictos icônes | `#FFFFFF` |
| Liens (email, www) | `#117B69` |
| Intitulé (Account Manager / Contact Center) | `#117B69` |
| Nom | `#131413` |
| Coordonnées | `#444` |
| Mention légale | `#bbbbbb` |
