const svg = document.getElementById('graphCanvas');
const edgeWeightInput = document.getElementById('edgeWeight');
const connectBtn = document.getElementById('connectBtn');
const updateWeightBtn = document.getElementById('updateWeightBtn');
const removeEdgeBtn = document.getElementById('removeEdgeBtn');
const removeNodesBtn = document.getElementById('removeNodesBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const startSelect = document.getElementById('startNode');
const targetSelect = document.getElementById('targetNode');
const selectionText = document.getElementById('selectionText');
const statusText = document.getElementById('statusText');
const visitOrder = document.getElementById('visitOrder');
const frontierResult = document.getElementById('frontierResult');
const pathResult = document.getElementById('pathResult');
const pauseBtn = document.getElementById('pauseBtn');
const stepBtn = document.getElementById('stepBtn');
const resetVisualizationBtn = document.getElementById('resetVisualizationBtn');
const speedSelect = document.getElementById('speedSelect');
const algorithmButtons = [...document.querySelectorAll('[data-algorithm]')];

const NS = 'http://www.w3.org/2000/svg';

const state = {
  nodes: [],
  edges: [],
  selected: [],
  nextId: 1,
  running: false,
  paused: false,
  playbackToken: 0,
  execution: null,
  visual: {
    visited: new Set(),
    frontier: new Set(),
    current: null,
    path: [],
  },
  drag: null,
  suppressClickNode: null,
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nodeName(id) {
  const alphabetIndex = id - 1;
  if (alphabetIndex < 26) return String.fromCharCode(65 + alphabetIndex);
  return `V${id}`;
}

function getNode(id) {
  return state.nodes.find((node) => node.id === id);
}

function getEdge(a, b) {
  return state.edges.find(
    (edge) =>
      (edge.from === a && edge.to === b) ||
      (edge.from === b && edge.to === a),
  );
}

function labels(ids) {
  return ids.map((id) => getNode(id)?.label || id);
}

function selectedLabels() {
  return labels(state.selected);
}

function readWeight() {
  const parsed = Number(edgeWeightInput.value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    edgeWeightInput.value = '1';
    return 1;
  }
  return Math.round(parsed);
}

function updateSelectors() {
  const previousStart = Number(startSelect.value);
  const previousTarget = Number(targetSelect.value);
  const options = state.nodes
    .map((node) => `<option value="${node.id}">${node.label}</option>`)
    .join('');

  startSelect.innerHTML = options || '<option value="">—</option>';
  targetSelect.innerHTML = options || '<option value="">—</option>';

  if (state.nodes.some((node) => node.id === previousStart)) {
    startSelect.value = String(previousStart);
  } else if (state.nodes.length) {
    startSelect.value = String(state.nodes[0].id);
  }

  if (state.nodes.some((node) => node.id === previousTarget)) {
    targetSelect.value = String(previousTarget);
  } else if (state.nodes.length) {
    targetSelect.value = String(state.nodes.at(-1).id);
  }
}

function updateSelectionText() {
  if (!state.selected.length) {
    selectionText.textContent = 'Nenhum vértice selecionado';
  } else {
    const selected = selectedLabels();
    selectionText.textContent = `Selecionado${selected.length > 1 ? 's' : ''}: ${selected.join(' e ')}`;
  }

  const pairSelected = state.selected.length === 2;
  const matchingEdge = pairSelected ? getEdge(state.selected[0], state.selected[1]) : null;
  const editingLocked = state.running;

  connectBtn.disabled = !pairSelected || Boolean(matchingEdge) || editingLocked;
  updateWeightBtn.disabled = !matchingEdge || editingLocked;
  removeEdgeBtn.disabled = !matchingEdge || editingLocked;
  removeNodesBtn.disabled = !state.selected.length || editingLocked;
}

function updatePlaybackControls() {
  pauseBtn.disabled = !state.running;
  pauseBtn.textContent = state.paused ? 'Continuar' : 'Pausar';
  stepBtn.disabled = !state.running;
  resetVisualizationBtn.disabled = !state.execution && !state.running;

  algorithmButtons.forEach((button) => {
    button.disabled = state.running || state.nodes.length === 0;
  });

  clearBtn.disabled = state.running;
  exampleBtn.disabled = state.running;
  edgeWeightInput.disabled = state.running;
  startSelect.disabled = state.running;
  targetSelect.disabled = state.running;
  updateSelectionText();
}

function resetVisualState({ keepResult = false } = {}) {
  state.visual.visited = new Set();
  state.visual.frontier = new Set();
  state.visual.current = null;
  state.visual.path = [];

  if (!keepResult) {
    visitOrder.textContent = '—';
    frontierResult.textContent = '—';
    pathResult.textContent = '—';
  }

  applyVisualClasses();
}

function applyVisualClasses() {
  svg.querySelectorAll('.node-group').forEach((group) => {
    const id = Number(group.dataset.node);
    group.classList.toggle('visited', state.visual.visited.has(id));
    group.classList.toggle('frontier', state.visual.frontier.has(id));
    group.classList.toggle('current', state.visual.current === id);
    group.classList.toggle('path', state.visual.path.includes(id));
  });

  svg.querySelectorAll('.edge-line').forEach((line) => line.classList.remove('path-edge'));
  for (let index = 0; index < state.visual.path.length - 1; index += 1) {
    const a = Math.min(state.visual.path[index], state.visual.path[index + 1]);
    const b = Math.max(state.visual.path[index], state.visual.path[index + 1]);
    svg.querySelector(`[data-edge="${a}-${b}"]`)?.classList.add('path-edge');
  }
}

function render() {
  svg.innerHTML = '';

  const edgeLayer = createSvgElement('g', { 'aria-label': 'Arestas' });
  const nodeLayer = createSvgElement('g', { 'aria-label': 'Vértices' });

  state.edges.forEach((edge) => {
    const a = getNode(edge.from);
    const b = getNode(edge.to);
    if (!a || !b) return;

    const group = createSvgElement('g', {
      class: 'edge-group',
      'data-edge-group': edge.id,
      'aria-label': `Aresta entre ${a.label} e ${b.label}, peso ${edge.weight}`,
    });

    const line = createSvgElement('line', {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      class: 'edge-line',
      'data-edge': edge.id,
    });

    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const bg = createSvgElement('circle', {
      cx: mx,
      cy: my,
      r: 14,
      class: 'edge-weight-bg',
      'data-edge-weight-bg': edge.id,
    });
    const text = createSvgElement('text', {
      x: mx,
      y: my,
      class: 'edge-weight',
      'data-edge-weight': edge.id,
    });
    text.textContent = edge.weight;

    group.append(line, bg, text);
    edgeLayer.appendChild(group);
  });

  state.nodes.forEach((node) => {
    const group = createSvgElement('g', {
      class: `node-group${state.selected.includes(node.id) ? ' selected' : ''}`,
      'data-node': node.id,
      transform: `translate(${node.x} ${node.y})`,
      tabindex: '0',
      role: 'button',
      'aria-label': `Vértice ${node.label}`,
    });

    const circle = createSvgElement('circle', {
      cx: 0,
      cy: 0,
      r: 24,
      class: 'node-circle',
    });
    const text = createSvgElement('text', {
      x: 0,
      y: 0,
      class: 'node-label',
    });
    text.textContent = node.label;

    group.append(circle, text);

    group.addEventListener('pointerdown', (event) => beginNodeDrag(event, node.id, group));
    group.addEventListener('click', (event) => {
      event.stopPropagation();
      if (state.running) return;
      if (state.suppressClickNode === node.id) {
        state.suppressClickNode = null;
        return;
      }
      toggleNodeSelection(node.id);
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
  applyVisualClasses();
  updateSelectionText();
  updateSelectors();
  updatePlaybackControls();
}

function addNode(x, y) {
  const id = state.nextId++;
  const label = nodeName(id);
  state.nodes.push({ id, label, x, y });
  statusText.textContent = `Vértice ${label} criado.`;
  resetExecutionAfterEdit();
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

function connectSelected() {
  if (state.selected.length !== 2 || state.running) return;
  const [from, to] = state.selected;

  if (from === to || getEdge(from, to)) {
    statusText.textContent = 'Esses vértices já estão conectados.';
    return;
  }

  const weight = readWeight();
  state.edges.push({
    id: `${Math.min(from, to)}-${Math.max(from, to)}`,
    from,
    to,
    weight,
  });
  statusText.textContent = `Aresta ${labels([from, to]).join('–')} criada com peso ${weight}.`;
  state.selected = [];
  resetExecutionAfterEdit();
  render();
}

function updateSelectedEdgeWeight() {
  if (state.selected.length !== 2 || state.running) return;
  const edge = getEdge(state.selected[0], state.selected[1]);
  if (!edge) {
    statusText.textContent = 'Não existe uma aresta entre os vértices selecionados.';
    return;
  }

  edge.weight = readWeight();
  statusText.textContent = `Peso da aresta ${selectedLabels().join('–')} atualizado para ${edge.weight}.`;
  resetExecutionAfterEdit();
  render();
}

function removeSelectedEdge() {
  if (state.selected.length !== 2 || state.running) return;
  const edge = getEdge(state.selected[0], state.selected[1]);
  if (!edge) {
    statusText.textContent = 'Não existe uma aresta entre os vértices selecionados.';
    return;
  }

  const name = selectedLabels().join('–');
  state.edges = state.edges.filter((candidate) => candidate.id !== edge.id);
  state.selected = [];
  statusText.textContent = `Aresta ${name} removida.`;
  resetExecutionAfterEdit();
  render();
}

function removeSelectedNodes() {
  if (!state.selected.length || state.running) return;
  const ids = new Set(state.selected);
  const names = selectedLabels().join(', ');
  state.nodes = state.nodes.filter((node) => !ids.has(node.id));
  state.edges = state.edges.filter((edge) => !ids.has(edge.from) && !ids.has(edge.to));
  state.selected = [];
  statusText.textContent = `Vértice(s) ${names} removido(s), junto com suas arestas.`;
  resetExecutionAfterEdit();
  render();
}

function resetExecutionAfterEdit() {
  state.playbackToken += 1;
  state.running = false;
  state.paused = false;
  state.execution = null;
  resetVisualState();
}

function beginNodeDrag(event, nodeId, group) {
  if (state.running || event.button !== 0) return;
  event.stopPropagation();

  const node = getNode(nodeId);
  if (!node) return;

  const point = getSvgPoint(event);
  state.drag = {
    nodeId,
    pointerId: event.pointerId,
    offsetX: point.x - node.x,
    offsetY: point.y - node.y,
    startX: point.x,
    startY: point.y,
    moved: false,
  };

  group.classList.add('dragging');
  group.setPointerCapture?.(event.pointerId);
}

function moveNodeDrag(event) {
  if (!state.drag || state.running || event.pointerId !== state.drag.pointerId) return;

  const point = getSvgPoint(event);
  const movement = Math.hypot(point.x - state.drag.startX, point.y - state.drag.startY);
  if (movement > 4) state.drag.moved = true;
  if (!state.drag.moved) return;

  const node = getNode(state.drag.nodeId);
  if (!node) return;

  node.x = clamp(point.x - state.drag.offsetX, 35, 965);
  node.y = clamp(point.y - state.drag.offsetY, 35, 615);
  updateNodePositionInSvg(node.id);
}

function finishNodeDrag(event) {
  if (!state.drag || event.pointerId !== state.drag.pointerId) return;
  const drag = state.drag;
  state.drag = null;

  svg.querySelector(`[data-node="${drag.nodeId}"]`)?.classList.remove('dragging');

  if (drag.moved) {
    state.suppressClickNode = drag.nodeId;
    statusText.textContent = `Vértice ${getNode(drag.nodeId)?.label || ''} reposicionado.`;
    resetExecutionAfterEdit();
    render();
    window.setTimeout(() => {
      if (state.suppressClickNode === drag.nodeId) state.suppressClickNode = null;
    }, 0);
  }
}

function updateNodePositionInSvg(nodeId) {
  const node = getNode(nodeId);
  if (!node) return;

  const group = svg.querySelector(`[data-node="${nodeId}"]`);
  group?.setAttribute('transform', `translate(${node.x} ${node.y})`);

  state.edges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .forEach((edge) => {
      const a = getNode(edge.from);
      const b = getNode(edge.to);
      if (!a || !b) return;

      const line = svg.querySelector(`[data-edge="${edge.id}"]`);
      line?.setAttribute('x1', a.x);
      line?.setAttribute('y1', a.y);
      line?.setAttribute('x2', b.x);
      line?.setAttribute('y2', b.y);

      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      svg.querySelector(`[data-edge-weight-bg="${edge.id}"]`)?.setAttribute('cx', mx);
      svg.querySelector(`[data-edge-weight-bg="${edge.id}"]`)?.setAttribute('cy', my);
      svg.querySelector(`[data-edge-weight="${edge.id}"]`)?.setAttribute('x', mx);
      svg.querySelector(`[data-edge-weight="${edge.id}"]`)?.setAttribute('y', my);
    });
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
  const order = [];
  const steps = [];

  while (queue.length) {
    const current = queue.shift();
    order.push(current);

    if (current !== target) {
      for (const neighbor of graph.get(current) || []) {
        if (!discovered.has(neighbor.id)) {
          discovered.add(neighbor.id);
          parent.set(neighbor.id, current);
          queue.push(neighbor.id);
        }
      }
    }

    steps.push({
      current,
      visited: [...order],
      frontier: [...queue],
      structureLabel: 'Fila',
    });

    if (current === target) break;
  }

  return { order, path: reconstructPath(parent, start, target), steps };
}

function dfs(start, target) {
  const graph = adjacency();
  const stack = [start];
  const discovered = new Set([start]);
  const parent = new Map();
  const order = [];
  const steps = [];

  while (stack.length) {
    const current = stack.pop();
    order.push(current);

    if (current !== target) {
      const neighbors = [...(graph.get(current) || [])].reverse();
      for (const neighbor of neighbors) {
        if (!discovered.has(neighbor.id)) {
          discovered.add(neighbor.id);
          parent.set(neighbor.id, current);
          stack.push(neighbor.id);
        }
      }
    }

    steps.push({
      current,
      visited: [...order],
      frontier: [...stack].reverse(),
      structureLabel: 'Pilha (topo →)',
    });

    if (current === target) break;
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
      const edgeDistance = a && b ? distance(a, b) : 0;
      return edgeDistance > 0 ? edge.weight / edgeDistance : Infinity;
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
      const difference = fScore.get(a) - fScore.get(b);
      return difference || a - b;
    })[0];

    open.delete(current);
    closed.add(current);
    order.push(current);

    if (current !== target) {
      for (const neighbor of graph.get(current) || []) {
        if (closed.has(neighbor.id)) continue;
        const tentative = gScore.get(current) + neighbor.weight;

        if (tentative < gScore.get(neighbor.id)) {
          parent.set(neighbor.id, current);
          gScore.set(neighbor.id, tentative);
          fScore.set(neighbor.id, tentative + h(neighbor.id));
          open.add(neighbor.id);
        }
      }
    }

    const orderedOpen = [...open].sort((a, b) => {
      const difference = fScore.get(a) - fScore.get(b);
      return difference || a - b;
    });

    steps.push({
      current,
      visited: [...order],
      frontier: orderedOpen,
      structureLabel: 'Aberta por f(n)',
      scores: orderedOpen.map((id) => ({
        id,
        g: gScore.get(id),
        h: h(id),
        f: fScore.get(id),
      })),
    });

    if (current === target) break;
  }

  return {
    order,
    path: reconstructPath(parent, start, target),
    steps,
    cost: Number.isFinite(gScore.get(target)) ? gScore.get(target) : null,
  };
}

function formatFrontier(step, algorithmName) {
  if (!step.frontier.length) return `${step.structureLabel}: vazia`;

  if (algorithmName === 'A*' && step.scores?.length) {
    const scoreText = step.scores
      .map(({ id, f }) => `${getNode(id)?.label || id} f=${f.toFixed(2)}`)
      .join(' • ');
    return `${step.structureLabel}: ${scoreText}`;
  }

  return `${step.structureLabel}: ${labels(step.frontier).join(' → ')}`;
}

function applyExecutionStep(step, algorithmName) {
  state.visual.visited = new Set(step.visited.filter((id) => id !== step.current));
  state.visual.frontier = new Set(step.frontier.filter((id) => id !== step.current));
  state.visual.current = step.current;
  applyVisualClasses();

  visitOrder.textContent = labels(step.visited).join(' → ') || '—';
  frontierResult.textContent = formatFrontier(step, algorithmName);
  statusText.textContent = `${algorithmName}: visitando ${getNode(step.current)?.label || step.current}.`;
}

function finishExecution() {
  if (!state.execution) return;
  const { result, algorithmName } = state.execution;

  state.visual.current = null;
  state.visual.frontier = new Set();
  state.visual.visited = new Set(result.order);
  state.visual.path = [...result.path];
  applyVisualClasses();

  if (result.path.length) {
    const costSuffix = algorithmName === 'A*' && result.cost != null
      ? ` • custo total: ${result.cost}`
      : ` • ${Math.max(0, result.path.length - 1)} aresta(s)`;
    pathResult.textContent = `${labels(result.path).join(' → ')}${costSuffix}`;
    statusText.textContent = `${algorithmName} concluído: caminho encontrado.`;
  } else {
    pathResult.textContent = 'Nenhum caminho encontrado';
    statusText.textContent = `${algorithmName} concluído: o destino não é alcançável a partir da origem.`;
  }

  state.running = false;
  state.paused = false;
  updatePlaybackControls();
}

function algorithmResult(name, start, target) {
  if (name === 'bfs') return { result: bfs(start, target), label: 'BFS' };
  if (name === 'dfs') return { result: dfs(start, target), label: 'DFS' };
  return { result: astar(start, target), label: 'A*' };
}

async function runAlgorithm(name) {
  if (state.running || !state.nodes.length) return;

  const start = Number(startSelect.value);
  const target = Number(targetSelect.value);
  if (!start || !target) {
    statusText.textContent = 'Escolha uma origem e um destino válidos.';
    return;
  }

  const { result, label } = algorithmResult(name, start, target);
  state.execution = {
    algorithm: name,
    algorithmName: label,
    result,
    index: 0,
  };
  state.running = true;
  state.paused = false;
  state.playbackToken += 1;
  const token = state.playbackToken;

  resetVisualState();
  statusText.textContent = `Executando ${label}...`;
  updatePlaybackControls();

  while (state.running && state.execution && state.execution.index < result.steps.length && token === state.playbackToken) {
    if (state.paused) {
      await sleep(80);
      continue;
    }

    advanceExecutionStep();
    if (!state.running || !state.execution || token !== state.playbackToken) break;
    await sleep(Number(speedSelect.value) || 520);
  }

  if (
    state.running &&
    state.execution &&
    state.execution.index >= result.steps.length &&
    token === state.playbackToken
  ) {
    finishExecution();
  }
}

function advanceExecutionStep() {
  if (!state.execution || !state.running) return;
  const { result, algorithmName } = state.execution;

  if (state.execution.index >= result.steps.length) {
    finishExecution();
    return;
  }

  const step = result.steps[state.execution.index];
  state.execution.index += 1;
  applyExecutionStep(step, algorithmName);

  if (state.execution.index >= result.steps.length && state.paused) {
    finishExecution();
  }
}

function togglePause() {
  if (!state.running || !state.execution) return;
  state.paused = !state.paused;
  statusText.textContent = state.paused
    ? `${state.execution.algorithmName} pausado. Use “Avançar passo” ou continue a execução.`
    : `${state.execution.algorithmName} retomado.`;
  updatePlaybackControls();
}

function stepExecution() {
  if (!state.running || !state.execution) return;
  state.paused = true;
  advanceExecutionStep();
  updatePlaybackControls();
}

function resetVisualization() {
  state.playbackToken += 1;
  state.running = false;
  state.paused = false;
  state.execution = null;
  resetVisualState();
  statusText.textContent = 'Visualização reiniciada. O grafo foi mantido.';
  updatePlaybackControls();
}

function clearGraph() {
  if (state.running) return;
  state.nodes = [];
  state.edges = [];
  state.selected = [];
  state.nextId = 1;
  resetExecutionAfterEdit();
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
  resetExecutionAfterEdit();
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

svg.addEventListener('pointermove', moveNodeDrag);
svg.addEventListener('pointerup', finishNodeDrag);
svg.addEventListener('pointercancel', finishNodeDrag);

connectBtn.addEventListener('click', connectSelected);
updateWeightBtn.addEventListener('click', updateSelectedEdgeWeight);
removeEdgeBtn.addEventListener('click', removeSelectedEdge);
removeNodesBtn.addEventListener('click', removeSelectedNodes);
clearBtn.addEventListener('click', clearGraph);
exampleBtn.addEventListener('click', loadExample);
pauseBtn.addEventListener('click', togglePause);
stepBtn.addEventListener('click', stepExecution);
resetVisualizationBtn.addEventListener('click', resetVisualization);

algorithmButtons.forEach((button) => {
  button.addEventListener('click', () => runAlgorithm(button.dataset.algorithm));
});

render();
loadExample();
