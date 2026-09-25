# babyName

Plus de 150 000 prénoms de bébé, fille et garçon : origine (avec drapeau), signification,
étymologie, tradition religieuse, fête et popularité. Onglet Découvrir façon « swipe »
(j'aime, non, coup de cœur), Ma liste, et mode duo pour comparer ses goûts à deux.
Même esprit que CashFlow : une seule page, aucune dépendance, tout reste sur l'appareil.

## Mettre en ligne sur GitHub Pages

Seuls ces fichiers sont nécessaires sur le dépôt :

```
index.html
manifest.webmanifest
sw.js
.nojekyll
data/names.js
icons/        (tout le dossier)
flags/        (tout le dossier)
```

Le dossier `build/` (scripts de construction des données) et `.claude/` n'ont pas besoin
d'être publiés.

1. Créer un dépôt, y déposer les fichiers ci-dessus à la racine.
2. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. L'app est en ligne à `https://<utilisateur>.github.io/<dépôt>/`.

Sur téléphone, « Ajouter à l'écran d'accueil » l'installe avec le logo ; le service
worker (`sw.js`) la garde disponible hors ligne. À chaque nouvelle version des données,
incrémenter `DATA_V` dans `index.html` et `CACHE` + le `?v=` dans `sw.js`.

## Essayer en local

```bash
py -3 -m http.server 8765
```

puis ouvrir http://localhost:8765.

## Données

| Source | Contenu |
| --- | --- |
| INSEE, fichier des prénoms (édition 2025) | naissances en France par prénom, sexe et année, 1900–2025 |
| Social Security Administration (via le paquet R `babynames`) | naissances aux États-Unis, 1880–2017 |
| firstname-database (J. Michael, M. Winkelmann) | usage de 46 000 prénoms dans 55 pays |
| Wiktionnaire / Wiktionary (via kaikki.org, CC BY-SA) | étymologies et langues d'origine complémentaires |
| `build/etymo/*.txt` | étymologies rédigées à la main |
| flagcdn.com | drapeaux (copiés dans `flags/`) |

Format d'une ligne du dictionnaire d'étymologies :

```
Nom|Genre (F, M, X)|Origine|Signification|Fête (JJ/MM)|Variantes séparées par des virgules|Étymologie
```

## Reconstruire `data/names.js`

Placer dans un dossier `prenoms-2025-nat.csv` (INSEE), `firstnames.csv`, `us.csv`
(converti depuis `babynames.rda`) et `wikt.json` (extrait des fichiers kaikki.org des
noms propres français et anglais), puis :

```bash
py -3 build/build.py chemin/vers/le/dossier
py -3 build/icones.py      # regénère les icônes depuis build/logo-source.webp
```
