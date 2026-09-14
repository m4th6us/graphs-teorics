# GraphLab — Teoria dos Grafos

Projeto acadêmico para explorar conceitos de **Teoria dos Grafos** de forma visual e interativa.

O site permite montar grafos manualmente e acompanhar a execução de algoritmos de busca passo a passo.

## Algoritmos implementados

- **BFS (Breadth-First Search)** — busca em largura usando fila.
- **DFS (Depth-First Search)** — busca em profundidade usando pilha.
- **A\*** — busca informada que considera o custo percorrido e uma heurística até o destino.

## Funcionalidades

- criação de vértices clicando na área de visualização;
- seleção de dois vértices para criação de arestas;
- definição de peso das arestas;
- escolha de vértice de origem e destino;
- animação dos vértices em fronteira e já visitados;
- destaque visual do caminho encontrado;
- exibição da ordem de visita;
- cálculo do custo total no A*;
- grafo de exemplo para demonstração imediata;
- layout responsivo.

## Como executar

Não é necessário instalar dependências.

Abra o arquivo `index.html` diretamente no navegador ou use qualquer servidor HTTP estático.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

```text
.
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Objetivo acadêmico

A aplicação busca tornar mais intuitivo o estudo de grafos ao permitir que o usuário observe como diferentes estratégias percorrem a mesma estrutura e como a escolha do algoritmo altera a ordem de exploração e o caminho encontrado.
