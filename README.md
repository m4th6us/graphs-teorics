# GraphLab — Teoria dos Grafos

Projeto acadêmico em **HTML, CSS e JavaScript puro** para ensinar Teoria dos Grafos de forma visual, interativa e acessível para quem está começando do zero.

A proposta é evitar uma introdução excessivamente técnica: primeiro o site explica grafos com analogias simples e exemplos do cotidiano, depois apresenta os principais conceitos e algoritmos visualmente e, por fim, permite experimentar tudo em um laboratório interativo.

## O que o site ensina

### Introdução para iniciantes

- o que é um grafo usando exemplos como amizades, mapas e entregas;
- diferença entre vértices, arestas e pesos;
- significado de vizinho, caminho e ciclo;
- exemplos reais de uso em redes sociais, GPS, internet, dependências e logística;
- tipos de grafo: direcionado, não direcionado e ponderado.

### Algoritmos apresentados visualmente

O conteúdo possui animações próprias em CSS que funcionam como pequenos GIFs explicativos.

- **BFS (Breadth-First Search)** — busca em largura, explorando o grafo por níveis;
- **DFS (Depth-First Search)** — busca em profundidade, avançando por um caminho antes de retornar;
- **A\*** — busca informada que considera o custo percorrido `g(n)` e uma estimativa `h(n)` até o destino;
- **Ordenação topológica** — apresentada conceitualmente como exemplo de ordenação baseada em dependências em grafos direcionados acíclicos.

O site também diferencia algoritmos de **busca/percurso** de um algoritmo de **ordenação topológica**, evitando tratar BFS, DFS e A* incorretamente como algoritmos de ordenação.

## Laboratório interativo

O laboratório continua permitindo experimentar BFS, DFS e A* em um grafo criado pelo próprio usuário.

- criação de vértices clicando no quadro;
- movimentação de vértices por arrastar e soltar;
- seleção de até dois vértices;
- criação de arestas não direcionadas;
- definição e alteração do peso das arestas;
- remoção de arestas e vértices;
- grafo de exemplo carregado inicialmente;
- escolha de vértice de origem e destino;
- execução visual de BFS, DFS e A*;
- destaque do vértice atual, fronteira, visitados e caminho final;
- exibição da ordem de visita;
- exibição da fila, pilha ou conjunto aberto durante a execução;
- exibição de `f(n)` na fronteira do A*;
- cálculo do custo total do caminho no A*;
- controles para pausar, continuar, avançar um passo e reiniciar a visualização;
- três velocidades de animação.

## A* no laboratório

No A*, a heurística usa a distância euclidiana entre os vértices, multiplicada pelo menor quociente `peso/distância` das arestas existentes. Isso mantém a heurística compatível com os pesos positivos utilizados no laboratório.

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
├── learning.css
├── script.js
└── README.md
```

- `styles.css`: estilos originais da interface e do laboratório;
- `learning.css`: componentes educativos, diagramas e animações visuais;
- `script.js`: editor do grafo e execução dos algoritmos do laboratório.

## Objetivo acadêmico

O GraphLab busca tornar Teoria dos Grafos compreensível mesmo para alguém sem familiaridade com o assunto. Em vez de começar por fórmulas ou definições formais, a interface parte de situações conhecidas, transforma essas situações em grafos e só então apresenta os algoritmos e estruturas utilizados para percorrê-los.
