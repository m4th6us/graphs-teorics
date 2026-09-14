const svg = document.getElementById('graphCanvas');
const edgeWeightInput = document.getElementById('edgeWeight');
const connectBtn = document.getElementById('connectBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const startSelect = document.getElementById('startNode');
const targetSelect = document.getElementById('targetNode');
const selectionText = document.getElementById('selectionText');
const statusText = document.getElementById('statusText');
const visitOrder = document.getElementById('visitOrder');
const pathResult = document.getElementById('pathResult');
const algorithmButtons = [...document.querySelectorAll('[data-algorithm]')];

const NS = 'http://www.w3.org/2000/svg';
const state = {
  nodes: [],
  edges: [],
  selected: [],
  nextId: 1,
  running: false,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function getSvgPoint(event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const matrix = svg.getScreenCTM();
  return matrix ? point.matrixTransform(matrix.inverse()) : point;
}

function nodeName(id) {
  const alphabetIndex = id - 1;
  if (alphabetIndex < 26) return String.fromCharCode(65 + alphabetIndex);
  return `V${id}`;
}

function getNode(id) {
  return state.nodes.find((node) => node.id === id);
}

function updateSelectors() {
  const previousStart = Number(startSelect.value);
  const previousTarget = Number(targetSelect.value);
  const options = state.nodes
    .map((node) => `<option value="${node.id}">${node.label}</option>`)
    .join('');

  startSelect.innerHTML = options || '<option value="">—</option>';
  targetSelect.innerHTML = options || '<option value="">—</option>';

  if (state.nodes.some((node) => node.id === previousStart)) startSelect.value = previousStart;
  if (state.nodes.some((node) => node.id === previousTarget)) targetSelect.value = previousTarget;
  if (!previousTarget && state.nodes.length > 1) targetSelect.value = state.nodes.at(-1).id;
}

function updateSelectionText() {
  if (!state.selected.length) {
    selectionText.textContent = 'Nenhum vértice selecionado';
  } else {
    const labels = state.selected.map((id) => getNode(id)?.label).filter(Boolean);
    selectionText.textContent = `Selecionado${labels.length > 1 ? 's' : ''}: ${labels.join(' e ')}`;
  }
  connectBtn.disabled = state.selected.length !== 2 || state.running;
}

function clearAlgorithmStyles() {
  svg.querySelectorAll('.node-group').forEach((node) => {
    node.classList.remove('frontier', 'visited', 'path');
  });
  svg.querySelectorAll('.edge-line').forEach((edge) => edge.classList.remove('path-edge'));
}

function render() {
  svg.innerHTML = '';

  const edgeLayer = createSvgElement('g', { 'aria-label': 'Arestas' });
  const nodeLayer = createSvgElement('g', { 'aria-label': 'Vértices' });

  state.edges.forEach((edge) => {
    const a = getNode(edge.from);
    const b = getNode(edge.to);
    if (!a || !b) return;

    const line = createSvgElement('line', {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      class: 'edge-line',
      'data-edge': edge.id,
    });
    edgeLayer.appendChild(line);

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const bg = createSvgElement('circle', {
      cx: mx,
      cy: my,
      r: 14,
      class: 'edge-weight-bg',
    });
    const text = createSvgElement('text', {
      x: mx,
      y: my,
      class: 'edge-weight',
    });
    text.textContent = edge.weight;
    edgeLayer.append(bg, text);
  });

  state.nodes.forEach((node) => {
    const group = createSvgElement('g', {
      class: `node-group${state.selected.includes(node.id) ? ' selected' : ''}`,
      'data-node': node.id,
      tabindex: '0',
      role: 'button',
      'aria-label': `Vértice ${node.label}`,
    });

    const circle = createSvgElement('circle', {
      cx: node.x,
      cy: node.y,
      r: 24,
      class: 'node-circle',
    });
    const text = createSvgElement('text', {
      x: node.x,
      y: node.y,
      class: 'node-label',
    });
    text.textContent = node.label;

    group.append(circle, text);
    group.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!state.running) toggleNodeSelection(node.id);
    });
    group.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !state.running) {
        event.preventDefault();
        toggleNodeSelection(node.id);
      }
    });

    nodeLayer.appendChild(group);
  });

  svg.append(edgeLayer, nodeLayer);
  updateSelectionText();
  updateSelectors();
}

function addNode(x, y) {
  const id = state.nextId++;
  state.nodes.push({ id, label: nodeName(id), x, y });
  statusText.textContent = `Vértice ${nodeName(id)} criado.`;
  render();
}

function toggleNodeSelection(id) {
  if (state.selected.includes(id)) {
    state.selected = state.selected.filter((nodeId) => nodeId !== id);
  } else if (state.selected.length < 2) {
    state.selected.push(id);
  } else {
    state.selected = [state.selected[1], id];
  }
  render();
}

function edgeExists(a, b) {
  return state.edges.some(
    (edge) =>
      (edge.from === a && edge.to === b) ||
      (edge.from === b && edge.to === a),
  );
}

function connectSelected() {
  if (state.selected.length !== 2) return;
  const [from, to] = state.selected;
  const weight = Math.max(1, Number(edgeWeightInput.value) || 1);

  if (from === to || edgeExists(from, to)) {
    statusText.textContent = 'Esses vértices já estão conectados.';
    return;
  }

  state.edges.push({ id: `${Math.min(from, to)}-${Math.max(from, to)}`, from, to, weight });
  statusText.textContent = `Aresta criada com peso ${weight}.`;
  state.selected = [];
  render();
}

function adjacency() {
  const map = new Map(state.nodes.map((node) => [node.id, []]));
  state.edges.forEach((edge) => {
    map.get(edge.from)?.push({ id: edge.to, weight: edge.weight });
    map.get(edge.to)?.push({ id: edge.from, weight: edge.weight });
  });
  map.forEach((neighbors) => neighbors.sort((a, b) => a.id - b.id));
  return map;
}

function reconstructPath(parent, start, target) {
  if (start === target) return [start];
  if (!parent.has(target)) return [];

  const path = [target];
  let current = target;
  while (current !== start) {
    current = parent.get(current);
    if (current == null) return [];
    path.push(current);
  }
  return path.reverse();
}

function bfs(start, target) {
  const graph = adjacency();
  const queue = [start];
  const discovered = new Set([start]);
  const parent = new Map();
  const steps = [];
  const order = [];

  while (queue.length) {
    const current = queue.shift();
    order.push(current);
    steps.push({ type: 'visit', node: current, frontier: [...queue] });
    if (current === target) break;

    for (const neighbor of graph.get(current) || []) {
      if (!discovered.has(neighbor.id)) {
        discovered.add(neighbor.id);
        parent.set(neighbor.id, current);
        queue.push(neighbor.id);
        steps.push({ type: 'frontier', node: neighbor.id, frontier: [...queue] });
      }
    }
  }

  return { order, path: reconstructPath(parent, start, target), steps };
}

function dfs(start, target) {
  const graph = adjacency();
  const stack = [start];
  const discovered = new Set();
  const parent = new Map();
  const steps = [];
  const order = [];

  while (stack.length) {
    const current = stack.pop();
    if (discovered.has(current)) continue;

    discovered.add(current);
    order.push(current);
    steps.push({ type: 'visit', node: current, frontier: [...stack] });
    if (current === target) break;

    const neighbors = [...(graph.get(current) || [])].reverse();
    for (const neighbor of neighbors) {
      if (!discovered.has(neighbor.id)) {
        if (!parent.has(neighbor.id)) parent.set(neighbor.id, current);
        stack.push(neighbor.id);
        steps.push({ type: 'frontier', node: neighbor.id, frontier: [...stack] });
      }
    }
  }

  return { order, path: reconstructPath(parent, start, target), steps };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function heuristicScale() {
  const ratios = state.edges
    .map((edge) => {
      const a = getNode(edge.from);
      const b = getNode(edge.to);
      const d = a && b ? distance(a, b) : 0;
      return d > 0 ? edge.weight / d : Infinity;
    })
    .filter(Number.isFinite);
  return ratios.length ? Math.min(...ratios) : 0;
}

function astar(start, target) {
  const graph = adjacency();
  const targetNode = getNode(target);
  const scale = heuristicScale();
  const h = (nodeId) => {
    const node = getNode(nodeId);
    return node && targetNode ? distance(node, targetNode) * scale : 0;
  };

  const open = new Set([start]);
  const closed = new Set();
  const gScore = new Map(state.nodes.map((node) => [node.id, Infinity]));
  const fScore = new Map(state.nodes.map((node) => [node.id, Infinity]));
  const parent = new Map();
  const order = [];
  const steps = [];

  gScore.set(start, 0);
  fScore.set(start, h(start));

  while (open.size) {
    const current = [...open].sort((a, b) => {
      const diff = fScore.get(a) - fScore.get(b);
      return diff || a - b;
    })[0];

    open.delete(current);
    closed.add(current);
    order.push(current);
    steps.push({ type: 'visit', node: current, frontier: [...open] });

    if (current === target) break;

    for (const neighbor of graph.get(current) || []) {
      if (closed.has(neighbor.id)) continue;
      const tentative = gScore.get(current) + neighbor.weight;

      if (tentative < gScore.get(neighbor.id)) {
        parent.set(neighbor.id, current);
        gScore.set(neighbor.id, tentative);
        fScore.set(neighbor.id, tentative + h(neighbor.id));
        open.add(neighbor.id);
        steps.push({ type: 'frontier', node: neighbor.id, frontier: [...open] });
      }
    }
  }

  return {
    order,
    path: reconstructPath(parent, start, target),
    steps,
    cost: Number.isFinite(gScore.get(target)) ? gScore.get(target) : null,
  };
}

function setNodeClass(id, className) {
  const group = svg.querySelector(`[data-node="${id}"]`);
  if (group) {
    if (className === 'visited') group.classList.remove('frontier');
    group.classList.add(className);
  }
}

function highlightPath(path) {
  path.forEach((id) => setNodeClass(id, 'path'));
  for (let i = 0; i < path.length - 1; i += 1) {
    const a = Math.min(path[i], path[i + 1]);
    const b = Math.max(path[i], path[i + 1]);
    svg.querySelector(`[data-edge="${a}-${b}"]`)?.classList.add('path-edge');
  }
}

function labels(ids) {
  return ids.map((id) => getNode(id)?.label || id);
}

async function animateResult(result, algorithmName) {
  clearAlgorithmStyles();
  visitOrder.textContent = '—';
  pathResult.textContent = '—';

  for (const step of result.steps) {
    if (step.type === 'frontier') setNodeClass(step.node, 'frontier');
    if (step.type === 'visit') {
      setNodeClass(step.node, 'visited');
      const partialOrder = result.order.slice(0, result.order.indexOf(step.node) + 1);
      visitOrder.textContent = labels(partialOrder).join(' → ');
    }
    await sleep(360);
  }

  if (result.path.length) {
    highlightPath(result.path);
    const costSuffix = algorithmName === 'A*' && result.cost != null ? ` • custo total: ${result.cost}` : '';
    pathResult.textContent = `${labels(result.path).join(' → ')}${costSuffix}`;
    statusText.textContent = `${algorithmName} concluído: caminho encontrado.`;
  } else {
    pathResult.textContent = 'Nenhum caminho encontrado';
    statusText.textContent = `${algorithmName} concluído: o destino não é alcançável a partir da origem.`;
  }
}

async function runAlgorithm(name) {
  if (state.running || !state.nodes.length) return;

  const start = Number(startSelect.value);
  const target = Number(targetSelect.value);
  if (!start || !target) {
    statusText.textContent = 'Escolha uma origem e um destino válidos.';
    return;
  }

  state.running = true;
  algorithmButtons.forEach((button) => (button.disabled = true));
  connectBtn.disabled = true;
  clearBtn.disabled = true;
  exampleBtn.disabled = true;

  let result;
  let label;
  if (name === 'bfs') {
    result = bfs(start, target);
    label = 'BFS';
  } else if (name === 'dfs') {
    result = dfs(start, target);
    label = 'DFS';
  } else {
    result = astar(start, target);
    label = 'A*';
  }

  statusText.textContent = `Executando ${label}...`;
  await animateResult(result, label);

  state.running = false;
  algorithmButtons.forEach((button) => (button.disabled = false));
  clearBtn.disabled = false;
  exampleBtn.disabled = false;
  updateSelectionText();
}

function clearGraph() {
  if (state.running) return;
  state.nodes = [];
  state.edges = [];
  state.selected = [];
  state.nextId = 1;
  visitOrder.textContent = '—';
  pathResult.textContent = '—';
  statusText.textContent = 'Grafo limpo. Clique na área de visualização para criar um vértice.';
  render();
}

function loadExample() {
  if (state.running) return;
  state.nodes = [
    { id: 1, label: 'A', x: 130, y: 330 },
    { id: 2, label: 'B', x: 300, y: 150 },
    { id: 3, label: 'C', x: 310, y: 505 },
    { id: 4, label: 'D', x: 520, y: 245 },
    { id: 5, label: 'E', x: 545, y: 470 },
    { id: 6, label: 'F', x: 770, y: 180 },
    { id: 7, label: 'G', x: 825, y: 420 },
  ];
  state.edges = [
    { id: '1-2', from: 1, to: 2, weight: 4 },
    { id: '1-3', from: 1, to: 3, weight: 3 },
    { id: '2-4', from: 2, to: 4, weight: 2 },
    { id: '3-4', from: 3, to: 4, weight: 5 },
    { id: '3-5', from: 3, to: 5, weight: 4 },
    { id: '4-5', from: 4, to: 5, weight: 1 },
    { id: '4-6', from: 4, to: 6, weight: 4 },
    { id: '5-7', from: 5, to: 7, weight: 3 },
    { id: '6-7', from: 6, to: 7, weight: 2 },
  ];
  state.selected = [];
  state.nextId = 8;
  visitOrder.textContent = '—';
  pathResult.textContent = '—';
  statusText.textContent = 'Exemplo carregado. Escolha origem, destino e um algoritmo.';
  render();
  startSelect.value = '1';
  targetSelect.value = '7';
}

svg.addEventListener('click', (event) => {
  if (state.running || event.target !== svg) return;
  const point = getSvgPoint(event);
  if (point.x < 35 || point.x > 965 || point.y < 35 || point.y > 615) return;
  addNode(point.x, point.y);
});

connectBtn.addEventListener('click', connectSelected);
clearBtn.addEventListener('click', clearGraph);
exampleBtn.addEventListener('click', loadExample);
algorithmButtons.forEach((button) => {
  button.addEventListener('click', () => runAlgorithm(button.dataset.algorithm));
});

render();
loadExample();
