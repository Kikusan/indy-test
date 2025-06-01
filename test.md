# Stratégie de Tests

## Objectif

Assurer la qualité et la robustesse de l’application en garantissant que les règles métier sont correctement implémentées et que les erreurs sont bien gérées aux différentes couches de l’architecture.

---

## Test de l'entité

La plus grande partie des tests se trouve au niveau de l'entité. C'est elle qui a toutes les règles métiers d'une promotion et de sa validation.
Plutôt que de tester toutes les parties de l'entité unitairement, j'ai choisi de tester directement l'entité considérant les value objects comme des détails d'implémentations

## Test des services

Les services ne font pas grand chose mais vérifient la présence ou non d'une promotion.
Je considère que tester cela suffit. D'autres tests serait en doublons avec les tests de l'entité.

## Test du repository apiWeather

Les tests consistent à savoir si je retourne le bon code d'erreur en cas de problème et que la fonction qui map la réponse de l'api vers ce qu'attend mon service marche bien.

## Test du controller

Les tests consistent à vérifier que mon controller envoie les bons objets au services mais à surtout vocation à vérifier que les erreurs métier de l'application sont bien retoruné avec le code http adéquat
