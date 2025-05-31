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
je vais considérer que si un promocode à plusieurs date de validité, c'est que fonctionnellement il s'agit de plusieurs promocodes car probablement pas le même usage ou pas la même cible

## Deuxième étape

Je vais faire en sorte que le use case de création de code promo soit codé de bout en bout avec un repository in memory et couvert avec supertest.
Pour des raisons obscurs, la validation de mon DTO ne se fait pas correctement ni la transformation. Apparement pour des nested objects la validation ou la transformation est tricky. Je passe donc sur un mapper.
L'impact est leger car mon domaine est protégé mais j'ai perdu un peu de temps pour voir le pourquoi du comment et en plus je n'ai pas trouvé sur le coup (╯°□°）╯︵ ┻━┻ )
Cela dit c'est à voir si j'ai le temps car l'impact est faible et les tests sont là donc je me dis que c'est ok
