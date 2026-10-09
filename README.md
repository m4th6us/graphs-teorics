# GraphLab — Teoria dos Grafos

Projeto acadêmico em **HTML, CSS e JavaScript puro** para ensinar Teoria dos Grafos de forma visual, interativa e acessível para quem está começando do zero.

A experiência foi reorganizada para seguir uma sequência didática simples: primeiro o vocabulário, depois o conceito de grafo, em seguida tipos de grafos, o significado de algoritmo, algoritmos de ordenação e, por fim, os algoritmos específicos usados em grafos.

## Ordem de aprendizado

1. **Vocabulário básico** — vértice, aresta, vizinho, caminho, peso e ciclo.
2. **O que é um grafo** — analogias com amizades, mapas, internet e logística.
3. **Tipos de grafos** — direcionado, não direcionado e ponderado.
4. **O que é um algoritmo** — explicado como uma sequência de passos para resolver um problema.
5. **O que é um algoritmo de ordenação** — conceito geral e exemplos com Bubble, Selection, Insertion, Merge e Quick Sort.
6. **Algoritmos em grafos** — BFS, DFS, A* e ordenação topológica.
7. **Laboratório interativo** — criação de grafos e execução passo a passo de BFS, DFS e A*.

## Conteúdo para iniciantes

O site evita partir diretamente para termos técnicos. Cada conceito é apresentado com uma definição curta, exemplo cotidiano e contexto visual.

- vértices como pessoas, cidades ou tarefas;
- arestas como amizades, estradas ou dependências;
- pesos como distância, tempo, preço ou custo;
- caminhos como sequências de conexões;
- ciclos como caminhos que retornam ao ponto inicial.

## Algoritmos de ordenação

O projeto agora explica primeiro o conceito geral de ordenação: receber elementos fora de ordem e reorganizá-los segundo um critério.

São apresentados visualmente:

- **Bubble Sort** — compara elementos vizinhos;
- **Selection Sort** — seleciona o próximo menor elemento;
- **Insertion Sort** — insere cada item na posição correta;
- **Merge Sort** — divide, ordena partes menores e combina;
- **Quick Sort** — utiliza um pivô para separar os elementos.

Esses algoritmos são apresentados como contexto. Eles não devem ser confundidos com BFS, DFS ou A*, que são algoritmos de busca/percurso em grafos.

## Algoritmos de grafos apresentados

- **BFS (Breadth-First Search)** — busca em largura, explorando por níveis;
- **DFS (Depth-First Search)** — busca em profundidade, seguindo um caminho antes de retornar;
- **A\*** — busca informada que combina custo percorrido `g(n)` e estimativa `h(n)`;
- **Ordenação topológica** — cria uma ordem válida respeitando dependências em um grafo direcionado sem ciclos.

As demonstrações usam uma geometria padronizada para que os mesmos nós e conexões permaneçam alinhados em todos os cards, facilitando a comparação visual entre os algoritmos.

## Laboratório interativo

O laboratório permite:

- criar vértices clicando no quadro;
- mover vértices por arrastar e soltar;
- conectar dois vértices;
- adicionar ou alterar pesos;
- remover arestas e vértices;
- escolher origem e destino;
- executar BFS, DFS e A*;
- acompanhar fronteira, visitados, vértice atual e caminho encontrado;
- pausar, avançar passo a passo e reiniciar a visualização;
- alterar a velocidade da animação.

## A* no laboratório

A heurística utiliza a distância euclidiana entre os vértices, multiplicada pelo menor quociente `peso/distância` das arestas existentes. Isso mantém a estimativa compatível com os pesos positivos usados no laboratório.

## Como executar

Não é necessário instalar dependências.

Abra `index.html` diretamente no navegador ou execute um servidor HTTP estático:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

```text
.
├── index.html
├── styles.css
├── learning.css
├── vocabulary.css
├── algorithm-basics.css
├── sorting.css
├── sorting-visuals.css
├── algorithm-demos.css
├── script.js
└── README.md
```

- `styles.css`: interface principal e laboratório;
- `learning.css`: componentes educativos já existentes;
- `vocabulary.css`: seção inicial de vocabulário;
- `algorithm-basics.css`: introdução ao conceito de algoritmo;
- `sorting.css`: cards e explicações dos algoritmos de ordenação;
- `sorting-visuals.css`: elementos visuais dos exemplos de ordenação;
- `algorithm-demos.css`: geometria padronizada e alinhamento das animações de grafos;
- `script.js`: editor do grafo e execução dos algoritmos interativos.

## Objetivo acadêmico

O GraphLab busca tornar Teoria dos Grafos compreensível para alguém sem familiaridade com o tema. A interface constrói primeiro o vocabulário necessário, associa conceitos a situações conhecidas e só depois apresenta algoritmos e estruturas mais técnicas.
