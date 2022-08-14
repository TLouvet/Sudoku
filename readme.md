<h1>Sudoku</h1>

Le projet nécessite npm.
Lancez <code>npm install</code> pour installer les nodes_modules. 

Editez le code en modifiant les fichiers ".ts"
Faites le build en lançant le fichier dédié depuis l'interprète =>  <code>./.build</code>

Le build est alors mis à jour. 

<h2>Known issues / Feature manquante</h2>

- Les grilles proposées ont parfois plus d'une solution, actuellement l'algorithme cherche juste à retrouver la matrice d'origine à partir d'une copie amputée de certains nombres.

S'il trouve une solution autre avant, alors cette copie est invalidée et une nouvelle copie est essayée. Il faudrait dans l'idée continuer la recherche, mais le temps de réponse n'est pas optimal pour l'instant.