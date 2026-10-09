# GraphLab — Teoria dos Grafos

Projeto acadêmico em **HTML, CSS e JavaScript puro** para ensinar Teoria dos Grafos de forma visual e interativa para quem está começando do zero.

A página começa pelo vocabulário, passa pela ideia de grafo, explica o que é um algoritmo e só depois chega em BFS, DFS, A* e ordenação topológica.

## Ordem de aprendizado

1. **Vocabulário básico** — vértice, aresta, vizinho, caminho, peso e ciclo.
2. **O que é um grafo** — exemplos com amizades, mapas, internet e logística.
3. **Tipos de grafos** — direcionado, não direcionado e ponderado.
4. **O que é um algoritmo** — uma sequência de passos para resolver um problema.
5. **Algoritmos de ordenação** — Bubble, Selection, Insertion, Merge e Quick Sort.
6. **Algoritmos em grafos** — BFS, DFS, A* e ordenação topológica.
7. **Laboratório interativo** — criação de grafos e execução passo a passo.

## Exemplos visuais

Os desenhos educativos usam coordenadas compartilhadas entre linhas e nós para evitar o desalinhamento que acontecia quando as conexões eram montadas com largura percentual e rotação em CSS.

Isso vale para:

- exemplo de amizades;
- tipos de grafo;
- BFS;
- DFS;
- A*;
- ordenação topológica.

## Algoritmos de ordenação

Os exemplos de ordenação não ficam apenas destacando uma barra. As barras agora **mudam de posição durante a animação**, para deixar visível a ideia principal de cada estratégia.

- **Bubble Sort** — mostra trocas entre vizinhos;
- **Selection Sort** — leva o menor restante para a próxima posição;
- **Insertion Sort** — encaixa itens na parte já ordenada;
- **Merge Sort** — separa visualmente grupos e depois os reúne em ordem;
- **Quick Sort** — destaca o pivô e reorganiza os valores ao redor dele.

Esses algoritmos servem como introdução ao conceito de ordenação. BFS, DFS e A* são algoritmos de busca/percurso em grafos, não algoritmos tradicionais de ordenação de listas.

## Algoritmos de grafos apresentados

- **BFS (Breadth-First Search)** — explora por níveis;
- **DFS (Depth-First Search)** — segue um caminho até onde der antes de voltar;
- **A\*** — combina custo percorrido `g(n)` e estimativa `h(n)`;
- **Ordenação topológica** — monta uma ordem que respeita dependências em um grafo direcionado sem ciclos.

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
├── visual-fixes.css
├── script.js
└── README.md
```

- `styles.css`: interface principal e laboratório;
- `learning.css`: componentes educativos;
- `vocabulary.css`: seção inicial de vocabulário;
- `algorithm-basics.css`: introdução ao conceito de algoritmo;
- `sorting.css`: layout dos exemplos de ordenação;
- `sorting-visuals.css`: animações com mudança real de posição;
- `algorithm-demos.css`: animações dos algoritmos de grafos;
- `visual-fixes.css`: geometria exata das linhas e nós dos exemplos;
- `script.js`: editor do grafo e execução dos algoritmos interativos.

## Objetivo acadêmico

O GraphLab tenta explicar Teoria dos Grafos sem começar pelo vocabulário mais pesado. A ideia é usar exemplos conhecidos, mostrar o desenho e então apresentar a parte mais técnica.