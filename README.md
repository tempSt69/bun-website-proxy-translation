⚠️ **Pas de fork, ni de PR. Utilisez ce repo comme un template sur votre compte par exemple**

# solution-engineer-test

Nous devons aider l'équipe sales pour une démo client, ils utilisent une technologie qui n'est pas courante: [Bun](https://bun.sh/)

Il va falloir l'installer et apprendre à l'utiliser pour intégrer notre solution

Etape 1: créer un proxy qui permet d'afficher le site du client (www.dow.com) *correctement* via le serveur local Bun

Résultat:

![www.dow.com](screens/step1.png)

Etape 2: créer une version avec `/fr-fr` au lieu de `/en-us` dans l'URL.

Toutes les pages qui commencent normalement par `/en-us/*` seront maintenant aussi accessibles sur `/fr-fr/*`

Etape 3: utiliser `dictionary.json` pour traduire n'importe quel mot sur le site affiché sur la version `/fr-fr/*` seulement

Résultat:

![www.dow.com](screens/step2.png)

Etape 4: on pourrait naviguer sur `/fr-fr/*` comme sur le site original ?
