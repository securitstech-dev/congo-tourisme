# Design System: Congo Tourisme

**Project Identity:** Plateforme SaaS de tourisme national (République du Congo)
**Owner:** Securits Tech

## 1. Visual Theme & Atmosphere

L'atmosphère est **chaleureuse, naturelle, professionnelle et authentiquement africaine**. Elle évoque la richesse de la forêt équatoriale (Mayombe) et la chaleur de l'accueil congolais. Le design doit être **aéré**, avec une densité de contenu équilibrée et une hiérarchie visuelle claire.

## 2. Color Palette & Roles

| Nom Sémantique | Hex Code | Rôle Fonctionnel |
| :--- | :--- | :--- |
| **Congo Forest Green** | `#1A6B4A` | Couleur principale : Branding, boutons primaires, navigation active. |
| **African Ochre Gold** | `#C8860A` | Couleur secondaire : Accents, badges, mise en avant (Featured), icônes spéciales. |
| **Mist Green** | `#E8F5EF` | Couleur d'accentuation : Fonds de section légers, états de survol, badges doux. |
| **Ivory Off-White** | `#FAFAF8` | Fond principal : Page entière, conteneurs secondaires. |
| **Midnight Obsidian** | `#1A1A1A` | Texte principal : Titres, corps de texte haute lisibilité. |
| **Safari Grey** | `#5F5E5A` | Texte secondaire : Descriptions, métadonnées, légendes. |
| **Equatorial Red** | `#DC2626` | Erreur : Alertes, messages d'erreur, actions destructrices. |
| **Jungle Success** | `#16A34A` | Succès : Confirmations, validation de paiement, badges de vérification. |

## 3. Typography Rules

- **Font Family:** `Inter` (Google Fonts) - Choisi pour sa clarté moderne et son excellent rendu sur tous les appareils.
- **Headers:** Poids `700` (Bold) pour les H1/H2, espacement des lettres légèrement réduit (`-0.02em`) pour un look premium.
- **Body:** Poids `400` (Regular) pour le texte courant, `500` (Medium) pour les éléments interactifs.
- **Scale:** Utilisation d'une échelle typographique harmonique (base 16px).

## 4. Component Stylings

- **Buttons:**
  - Radius: `12px`
  - Style: Solide pour le primaire (Forest Green), Outline pour le secondaire (Ochre Gold).
  - Transitions: `cubic-bezier(0.4, 0, 0.2, 1)` pour un ressenti fluide.
- **Cards/Containers:**
  - Corner Roundness: `12px` (Soft but professional).
  - Shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` (Subtile et naturelle).
  - Border: `1px solid rgba(26, 107, 74, 0.1)` (Légère bordure verte pour la cohésion).
- **Inputs/Forms:**
  - Background: `#FFFFFF`
  - Border: `1px solid #E2E8F0`
  - Focus: Bordure `Congo Forest Green` avec un halo `Mist Green`.

## 5. Layout Principles

- **Whitespace:** Utilisation généreuse de l'espace blanc (Padding/Margin 8/16/24/32/64).
- **Grid:** Système de grille 12 colonnes standard pour Desktop, 1 colonne pour Mobile.
- **Alignment:** Centrage optique des éléments héro, alignement à gauche pour les formulaires et contenus denses.
