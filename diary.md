# 🛠️ Journal de bord

Ici vous allez pouvoir suivre mes intentions durant certaines étapes clés du projet

---

## Intention initiale

En lisant l'énoncé, il semblerait que l'important est l'implémentation du domaine plutot que le fait que ça marche.
Je pars donc avec un nestJS par habitude et je mets un swagger qui ne me sert strictement à rien -\_-
Je pose juste les bases pour que mon module tourne et me focalise sur l'entité promotion.

Dans un premier temps, je suis donc totalement indépendant du framework et le but est de dégager les règles métiers des différents types de restrictions qui compose un code promo

- cohérence d'une période de validité
- cohérence de la restriction de l'age
- cohérence de la restriction de la météo (je n'ai toutefois pas mis de contrôle sur une température min ou max, je me suis dit qu'au pire ça ne sera jamais valide)
- cohérence de la remise à appliquer

## Notes

Je me suis demandé pendant un certain temps pourquoi les réstrictions est sous la forme d'un tableau. Si je lis la spec, tout indique que le tableau se lit comme un AND.

ça m'a fait challenger la forme des restrictions car j'avais l'impression que les attributs ne pouvait pas se chevaucher... Mais de toute manière, je n'ai personne pour me challenger la dessus.

J'ai fini par admettre que la restriction de date est un objet à part et sera toujours le premier élément du tableau et sera donc obligatoire.
J'ai aussi admis que le tableau n'aura toujours que 2 éléments:

- la période
- les règles (soit c'est une regle de type age ou météo soit c'est une combinaison qui commence par AND ou OR)

Il y a un donc un gros parti pris sur le fait que date soit à part et qu'il ne peut pas être dans les combinaisons.
je vais considérer que si un promocode à plusieurs date de validité, c'est que fonctionnellement il s'agit de plusieurs promocodes car probablement pas le même usage ou pas la même cible.

Pour les règles, on s'aperçoit qu'il y a 2 types:

- les combinaisons OR ou AND qui ont une profondeur infinies car on peut imbriquer des combinaisons (un arbre).
- les regles age ou meteo qui sont des fins (une feuille).

Ce qui signifie que pour les combinaisons, je suis obligé de tester récursivement les règles jusqu'à tomber sur une des règles de fin.

⚠️ Si j'avais gardé la logique de base, la règle de date aurait été une règle de fin mais par contre dans mon entité, je n'aurais plus dateRestriction et restrictionTree mais restrictions qui serait un tableau de restrictionTree. Bien entendu la restriction de date aurait été parmi les leaf restrictions.

## Deuxième étape

Je vais faire en sorte que le use case de création de code promo soit codé de bout en bout avec un repository in memory et couvert avec supertest.

L’objectif est de finaliser le cas d’usage de création de code promo.

Si une base de données devait être introduite, voici les choix que j’assumerais pour la modélisation d’une table promo_code :

- id : UUID, identifiant unique du code promo.
- name : chaîne de caractères (string), unique pour éviter les doublons.
- advantage : nombre (number), représentant la valeur de l’avantage (ex. : pourcentage de réduction).

⚠️ Ce champ pourrait évoluer selon le type d’avantage envisagé (par exemple: réduction fixe).

- valid_from : date de début de validité.
- valid_until : date de fin de validité.
- restriction : champ au format JSONB, permettant de stocker des règles ou contraintes spécifiques de manière flexible (ex. : catégories éligibles, utilisateurs ciblés, conditions d’usage, etc.).

## Notes

Je viens de m'apercevoir que tout ce qui est promocode je l'ai nommé promotion... Bon bah je renommerai tout ça en fin d'exercice si j'y pense...

## troisième étape

Je vais m'attaquer au use case de validation d'un code. Cette fois je décide de commencer par le contrat d'api et faire la méthode de validation du code promo dans un second temps.

La raison est simple, c'est la partie qui est la moins plaisante à faire donc je m'en débarrasse le plus rapidement possible.
