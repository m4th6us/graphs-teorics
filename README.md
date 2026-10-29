# GraphLab — Teoria dos Grafos

Projeto acadêmico desenvolvido em **HTML, CSS e JavaScript**, destinado à apresentação introdutória dos fundamentos de Teoria dos Grafos por meio de explicações, exemplos visuais e atividades interativas.

O material apresenta progressivamente o vocabulário fundamental, os modelos de grafos e os conceitos de algoritmos, culminando nas demonstrações de BFS, DFS, A* e ordenação topológica.

## Percurso de aprendizagem

1. **Vocabulário básico** — vértice, aresta, vizinho, caminho, peso e ciclo.
2. **Representação de grafos** — modelagem de relações em redes de amizade, transporte, comunicação e logística.
3. **Propriedades dos grafos** — orientação das arestas e atribuição de pesos, características que podem coexistir.
4. **Conceito de algoritmo** — sequência finita de instruções bem definidas para resolver um problema.
5. **Ordenação de listas** — Bubble Sort, Selection Sort, Insertion Sort, Merge Sort e Quick Sort.
6. **Busca e dependências em grafos** — BFS, DFS, A* e ordenação topológica.
7. **Laboratório interativo** — criação de grafos e execução passo a passo.

## Exemplos visuais

Os exemplos visuais utilizam coordenadas compartilhadas entre vértices e arestas, de modo a preservar o alinhamento das conexões em diferentes dimensões de tela.

Isso vale para:

- exemplo de amizades;
- tipos de grafo;
- BFS;
- DFS;
- A*;
- ordenação topológica.

## Algoritmos de ordenação

As demonstrações de ordenação apresentam **movimentações dos elementos ao longo das animações**, permitindo observar as estratégias de comparação, seleção, inserção, divisão e partição.

- **Bubble Sort** — mostra trocas entre vizinhos;
- **Selection Sort** — leva o menor restante para a próxima posição;
- **Insertion Sort** — encaixa itens na parte já ordenada;
- **Merge Sort** — separa visualmente grupos e depois os reúne em ordem;
- **Quick Sort** — destaca o pivô e reorganiza os valores ao redor dele.

Esses algoritmos introduzem técnicas de ordenação de listas. Em contraste, BFS, DFS e A* realizam buscas em grafos; a ordenação topológica produz uma sequência de vértices que respeita dependências em um grafo direcionado acíclico.

## Algoritmos de grafos apresentados

- **BFS (Breadth-First Search)** — visita vértices por níveis e encontra caminhos com o menor número de arestas, desconsiderando pesos;
- **DFS (Depth-First Search)** — percorre ramos em profundidade, retrocedendo quando necessário, sem garantir o caminho mais curto;
- **A\*** — combina o custo acumulado `g(n)` e a heurística `h(n)` para orientar a busca por caminhos de menor custo;
- **Ordenação topológica** — organiza os vértices de um grafo direcionado acíclico (DAG), respeitando a ordem das dependências. No site, é apresentada em uma demonstração visual.

## Laboratório interativo

O laboratório permite:

- criar vértices clicando no quadro;
- mover vértices por arrastar e soltar;
- conectar dois vértices;
- adicionar ou alterar pesos;
- remover arestas e vértices;
- escolher origem e destino;
- executar BFS, DFS e A*;
- acompanhar o conjunto de fronteira, os vértices visitados, o vértice atual e o caminho encontrado;
- pausar, avançar passo a passo e reiniciar a visualização;
- alterar a velocidade da animação.

## Avaliação de conhecimentos

A página disponibiliza uma seção de **Avaliação de conhecimentos**, com acesso ao formulário Google Forms e a um QR Code para dispositivos móveis.

- 5 questões objetivas e obrigatórias;
- 1 ponto por questão, totalizando 5 pontos;
- correção automática e resultado exibido logo após o envio;
- conteúdo introdutório: grafo, vértice, aresta, amizade em grafos e BFS.

[Abrir a avaliação do GraphLab](https://docs.google.com/forms/d/e/1FAIpQLSdKzO21_4-qKIzz4f32jUMu-4fLdw8ZWQ9qbJLzUZgPyhsYmw/viewform?usp=publish-editor)

## A* no laboratório

A heurística do A* utiliza a distância euclidiana entre os vértices, multiplicada pelo menor quociente `peso/distância` calculado entre as arestas existentes. Essa escolha produz uma estimativa que não excede o custo real mínimo do caminho no grafo com pesos positivos, auxiliando a busca por uma rota de menor custo.

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
├── assets/
│   └── graphlab-quiz-qr.svg
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
- `assets/graphlab-quiz-qr.svg`: QR Code da avaliação;
- `script.js`: editor do grafo e execução dos algoritmos interativos.

## Objetivo acadêmico

O GraphLab tem como objetivo facilitar a compreensão dos fundamentos de Teoria dos Grafos por meio de definições conceitualmente precisas, exemplos contextualizados e representações visuais. O percurso de aprendizagem parte de conceitos elementares e avança até algoritmos de busca e organização de dependências.
