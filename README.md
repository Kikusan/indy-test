# 🛠️ Test Technique Backend – Indy promotion API

Ce projet est un test technique backend réalisé avec **NestJS**.

## 📖 Contexte

Tu fais partie d'une entreprise de réservation de VTC (de type Uber) et l'équipe Marketing souhaite encourager les clients à réserver un trajet en leur proposant des promotions.

Pour cela, elle souhaite s'équiper d'un service de gestion de _promocodes_ où :

- l'équipe Marketing pourra ajouter des _promocodes_ dont la validité dépendra d'un ou plusieurs critères
- l'application pourra vérifier la validité d'un _promocode_ et obtenir la réduction associée.

---

## 🚀 Fonctionnalités

- Ajout d'un promocode
- Obtention d'une réduction d'un promocode

---

## 🧱 Stack technique

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Installation

### 1. Cloner le dépôt

Récupérer le projet via git clone ou en téléchargeant le zip

### 2. Installation des dépendances

```bash
cd indy-test
npm i
```

### 3. Configuration de l'application

Prendre le fichier .env.example et en faire une copie nommer .env puis mettre la clé de l'api d'open weather.
(soit vous avez déjà une clé sinon vous pouvez en utiliser celle mise à disposition dans le test)

```bash
OPENWEATHER_API_KEY=xxx-xxxx-xxxxxx-xxxxxxxx
```

### 4. Lancer le projet avec docker

```bash
docker compose up
```

ou docker-compose up selon la version de docker compose
le swagger sera accessible sur [http://localhost:4000/api](http://localhost:4000/api)

### 5. désinstaller le projet

```bash
docker compose down --volumes
```

ou docker-compose down --volumes selon la version de docker compose
Vous pouvez supprimer le dossier par la suite.

## Journal de bord

Vous pouvez voir l'évolution de ma réfléxion [ici](diary.md)
