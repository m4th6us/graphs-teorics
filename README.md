# GraphLab — Teoria dos Grafos

Projeto acadêmico em **HTML, CSS e JavaScript puro** para estudar Teoria dos Grafos de forma visual e interativa.

O site combina uma revisão teórica curta com um laboratório em que o usuário monta um grafo e acompanha a execução de algoritmos de busca.

## Algoritmos implementados

- **BFS (Breadth-First Search)** — busca em largura usando fila.
- **DFS (Depth-First Search)** — busca em profundidade usando pilha.
- **A\*** — busca informada que considera o custo percorrido `g(n)` e uma heurística `h(n)` até o destino.

No A*, a heurística usa a distância euclidiana entre os vértices, multiplicada pelo menor quociente `peso/distância` das arestas existentes. Isso mantém a heurística compatível com os pesos positivos utilizados no laboratório.

## Funcionalidades

### Conteúdo teórico

- explicação sobre vértices, arestas e pesos;
- exemplos de aplicação de grafos no mundo real;
- resumo de BFS, DFS e A*;
- indicação do tipo de grafo utilizado no projeto.

### Editor visual

- criação de vértices clicando no quadro;
- movimentação de vértices por arrastar e soltar;
- seleção de até dois vértices;
- criação de arestas não direcionadas;
- definição e alteração do peso das arestas;
- remoção de arestas;
- remoção de vértices e das arestas associadas;
- grafo de exemplo carregado inicialmente;
- escolha de vértice de origem e destino.

### Visualização dos algoritmos

- execução visual de BFS, DFS e A*;
- destaque do vértice atual, fronteira, visitados e caminho final;
- exibição da ordem de visita;
- exibição da fila, pilha ou conjunto aberto durante a execução;
- exibição de `f(n)` na fronteira do A*;
- cálculo do custo total do caminho no A*;
- controles de pausar, continuar, avançar um passo e reiniciar apenas a visualização;
- três velocidades de animação.

## Como executar

Não é necessário instalar dependências.

Abra o arquivo `index.html` diretamente no navegador ou execute um servidor HTTP estático.

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

A aplicação busca tornar mais intuitivo o estudo de grafos ao permitir que o usuário observe como diferentes estratégias percorrem a mesma estrutura, como a fronteira de busca se altera ao longo do tempo e como pesos e heurística influenciam a busca de caminhos.
