# Utiliser Node.js 20
FROM node:20

# Répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code serveur
COPY . .

# Exposer le port de l'API
EXPOSE 8081

# Lancer le serveur
CMD ["npm", "start"]
