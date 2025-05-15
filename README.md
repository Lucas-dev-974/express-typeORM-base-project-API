## Base de projet API pour Express & TypeORM en Typescript

### Init du projet

- npm install
- npm run dev

### Router

Les routes sont chargées dynamiquement depuis leur dossier. Il suffit de créer un fichier, par exemple "userRoutes", d'y ajouter vos routes, et elles seront automatiquement intégrées à l'application sans intervention manuelle.

**Pas possible de rajouter des préfix aux routers pour le moment: WIP (WORK IN PROGRESS) <br/> Donner la possibilité d'utilisé le nom du fichier en tant que préfix ou d'avoir une liste qui link les fichier routes à des préfixes**

### JWT middleware

Le JWT middleware c'est la sécurité de l'application c'est lui qui autorise ou non le chargement d'un route pour un utilisateur, pour bypassé cette sécurité pour une route spécifique aller dans le fichier src/routes/public.ts et rajouter la route qui na pas besoin d'être sécurisé.

**Pour générer une clé privé JWT, ouvrir le terminal puis entrer:**

- node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

### Logger

Le tool Logger, permet d'écrire des logs dans un fichier désigné.
