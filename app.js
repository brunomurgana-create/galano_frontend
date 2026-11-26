const API_STORAGE_KEY = 'galanoApiBase';
const DEFAULT_API_BASE = 'http://localhost:3000/api';

const resources = {
  productos: {
    label: 'Productos',
    singular: 'producto',
    endpoint: 'productos',
    id: 'id_producto',
    icon: '▤',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'precio', label: 'Precio ($)', type: 'number', required: true, min: 0, step: '0.01' },
      { name: 'stock', label: 'Stock', type: 'number', min: 0, step: '1' },
      { name: 'id_categoria', label: 'Categoría', type: 'select', source: 'categorias', optionLabel: 'nombre', optionId: 'id_categoria', required: true },
      { name: 'material', label: 'Material' },
      { name: 'color', label: 'Color' },
      { name: 'dimensiones', label: 'Dimensiones' },
      { name: 'imagen_url', label: 'URL de imagen', type: 'url', full: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', full: true },
      { name: 'activo', label: 'Producto activo', type: 'checkbox', defaultValue: true }
    ],
    columns: [
      { key: 'id_producto', label: 'ID', format: value => `#${value}` },
      { key: 'nombre', label: 'Producto', primary: true, secondary: 'material' },
      { key: 'precio', label: 'Precio', format: currency },
      { key: 'stock', label: 'Stock' },
      { key: 'id_categoria', label: 'Categoría', format: value => `#${value}` },
      { key: 'activo', label: 'Estado', format: value => badge(value ? 'Activo' : 'Inactivo') }
    ]
  },
  categorias: {
    label: 'Categorías',
    singular: 'categoría',
    endpoint: 'categorias',
    id: 'id_categoria',
    icon: '◈',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', full: true },
      { name: 'activo', label: 'Categoría activa', type: 'checkbox', defaultValue: true }
    ],
    columns: [
      { key: 'id_categoria', label: 'ID', format: value => `#${value}` },
      { key: 'nombre', label: 'Nombre', primary: true },
      { key: 'descripcion', label: 'Descripción', truncate: true },
      { key: 'activo', label: 'Estado', format: value => badge(value ? 'Activa' : 'Inactiva') }
    ]
  },
  clientes: {
    label: 'Clientes',
    singular: 'cliente',
    endpoint: 'clientes',
    id: 'id_cliente',
    icon: '♙',
    fields: [
      { name: 'nombre', label: 'Nombre', required: true },
      { name: 'apellido', label: 'Apellido', required: true },
      { name: 'email', label: 'Correo electrónico', type: 'email' },
      { name: 'telefono', label: 'Teléfono' },
      { name: 'ciudad', label: 'Ciudad' },
      { name: 'codigo_postal', label: 'Código postal' },
      { name: 'direccion', label: 'Dirección', type: 'textarea', full: true }
    ],
    columns: [
      { key: 'id_cliente', label: 'ID', format: value => `#${value}` },
      { key: 'nombre', label: 'Cliente', primary: true, secondary: 'apellido' },
      { key: 'email', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'ciudad', label: 'Ciudad' }
    ]
  },
  pedidos: {
    label: 'Pedidos',
    singular: 'pedido',
    endpoint: 'pedidos',
    id: 'id_pedido',
    icon: '▣',
    fields: [
      { name: 'id_cliente', label: 'Cliente', type: 'select', source: 'clientes', optionLabel: item => `${item.nombre} ${item.apellido}`, optionId: 'id_cliente', required: true },
      { name: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'confirmado', 'pagado', 'enviado', 'entregado', 'cancelado'], defaultValue: 'pendiente' },
      { name: 'total', label: 'Total ($)', type: 'number', min: 0, step: '0.01', defaultValue: 0 },
      { name: 'direccion_entrega', label: 'Dirección de entrega', type: 'textarea', full: true },
      { name: 'observaciones', label: 'Observaciones', type: 'textarea', full: true }
    ],
    columns: [
      { key: 'id_pedido', label: 'Pedido', format: value => `#${value}`, primary: true },
      { key: 'nombre', label: 'Cliente', format: (value, row) => `${value || ''} ${row.apellido || ''}`.trim() || `Cliente #${row.id_cliente}` },
      { key: 'fecha_pedido', label: 'Fecha', format: date },
      { key: 'total', label: 'Total', format: currency },
      { key: 'estado', label: 'Estado', format: badge }
    ]
  },
  detalles: {
    label: 'Detalles de pedido',
    singular: 'detalle',
    endpoint: 'detalles',
    id: 'id_detalle',
    icon: '☷',
    fields: [
      { name: 'id_pedido', label: 'Pedido', type: 'select', source: 'pedidos', optionId: 'id_pedido', optionLabel: item => `Pedido #${item.id_pedido} · ${item.estado}`, required: true },
      { name: 'id_producto', label: 'Producto', type: 'select', source: 'productos', optionId: 'id_producto', optionLabel: 'nombre', required: true },
      { name: 'cantidad', label: 'Cantidad', type: 'number', min: 1, step: '1', required: true, defaultValue: 1 },
      { name: 'precio_unitario', label: 'Precio unitario ($)', type: 'number', min: 0, step: '0.01', required: true }
    ],
    columns: [
      { key: 'id_detalle', label: 'ID', format: value => `#${value}` },
      { key: 'id_pedido', label: 'Pedido', format: value => `#${value}` },
      { key: 'producto', label: 'Producto', primary: true },
      { key: 'cantidad', label: 'Cantidad' },
      { key: 'precio_unitario', label: 'Precio unitario', format: currency },
      { key: 'subtotal', label: 'Subtotal', format: currency }
    ]
  },
  pagos: {
    label: 'Pagos',
    singular: 'pago',
    endpoint: 'pagos',
    id: 'id_pago',
    icon: '＄',
    fields: [
      { name: 'id_pedido', label: 'Pedido', type: 'select', source: 'pedidos', optionId: 'id_pedido', optionLabel: item => `Pedido #${item.id_pedido} · ${currency(item.total)}`, required: true },
      { name: 'importe', label: 'Importe ($)', type: 'number', min: 0.01, step: '0.01', required: true },
      { name: 'metodo_pago', label: 'Método de pago', type: 'select', options: ['efectivo', 'transferencia', 'tarjeta', 'mercadopago', 'otro'], required: true },
      { name: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'aprobado', 'rechazado', 'reembolsado'], defaultValue: 'pendiente' },
      { name: 'referencia', label: 'Referencia', full: true }
    ],
    columns: [
      { key: 'id_pago', label: 'Pago', format: value => `#${value}`, primary: true },
      { key: 'id_pedido', label: 'Pedido', format: value => `#${value}` },
      { key: 'fecha_pago', label: 'Fecha', format: date },
      { key: 'importe', label: 'Importe', format: currency },
      { key: 'metodo_pago', label: 'Método', format: value => value ? value.replace('_', ' ') : '—' },
      { key: 'estado', label: 'Estado', format: badge }
    ]
  }
};

const state = { view: 'dashboard', data: {}, search: '' };
const page = document.querySelector('#pageContent');
const modal = document.querySelector('#modalBackdrop');
const form = document.querySelector('#recordForm');

function apiBase() {
  return (localStorage.getItem(API_STORAGE_KEY) || DEFAULT_API_BASE).replace(/\/+$/, '');
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBase()}/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const text = await response.text();
  let result;
  try { result = text ? JSON.parse(text) : null; } catch { result = text; }
  if (!response.ok) {
    const message = result && typeof result === 'object' && result.mensaje ? result.mensaje : `Error ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }
  return result;
}

async function loadResource(key, quiet = false) {
  try {
    const data = await request(resources[key].endpoint);
    state.data[key] = Array.isArray(data) ? data : [];
    setConnection(true);
    if (!quiet && state.view === key) renderResource(key);
    return state.data[key];
  } catch (error) {
    setConnection(false);
    if (!quiet && state.view === key) renderError(error);
    throw error;
  }
}

function setConnection(online) {
  const dot = document.querySelector('#connectionDot');
  dot.classList.toggle('online', online);
  dot.classList.toggle('offline', !online);
  document.querySelector('#connectionLabel').textContent = online ? 'API conectada' : 'API sin conexión';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function currency(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(amount);
}

function date(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed);
}

function badge(value) {
  const label = value ? String(value) : '—';
  return `<span class="badge ${escapeHtml(label.toLowerCase())}">${escapeHtml(label)}</span>`;
}

function pageHeading(title, description, action = '') {
  return `<div class="page-heading"><div><p class="eyebrow">GALANO MUEBLES · ADMINISTRACIÓN</p><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
}

function renderError(error) {
  page.innerHTML = `${pageHeading('No se pudo cargar', 'Revisá la conexión con el servidor e intentá nuevamente.', '<button class="button button-primary" data-action="retry">↻ Reintentar</button>')}<div class="panel empty-state">${escapeHtml(error.message)}<br><br>API configurada: ${escapeHtml(apiBase())}</div>`;
}

function renderDashboard() {
  const recentOrders = (state.data.pedidos || []).slice(-5).reverse();
  const latestProducts = (state.data.productos || []).slice(-5).reverse();
  const stats = [
    { label: 'Productos', count: state.data.productos?.length || 0, icon: '▤', note: `${(state.data.productos || []).filter(item => Number(item.stock) <= 5).length} con stock bajo` },
    { label: 'Pedidos', count: state.data.pedidos?.length || 0, icon: '▣', note: `${(state.data.pedidos || []).filter(item => item.estado === 'pendiente').length} pendientes` },
    { label: 'Clientes', count: state.data.clientes?.length || 0, icon: '♙', note: 'Clientes registrados' },
    { label: 'Ingresos registrados', count: currency((state.data.pagos || []).filter(item => item.estado === 'aprobado').reduce((sum, item) => sum + Number(item.importe || 0), 0)), icon: '＄', note: 'Pagos aprobados' }
  ];
  const statCards = stats.map(stat => `<article class="stat-card"><div class="stat-top"><span>${stat.label}</span><span class="stat-icon">${stat.icon}</span></div><strong class="stat-value">${stat.count}</strong><small class="stat-note">${stat.note}</small></article>`).join('');
  const orderRows = recentOrders.length
    ? recentOrders.map(item => `<tr><td class="primary-cell">#${escapeHtml(item.id_pedido)}</td><td>${escapeHtml(`${item.nombre || ''} ${item.apellido || ''}`.trim() || `Cliente #${item.id_cliente}`)}</td><td>${currency(item.total)}</td><td>${badge(item.estado)}</td></tr>`).join('')
    : '<tr><td colspan="4" class="empty-state">Todavía no hay pedidos registrados.</td></tr>';
  const productItems = latestProducts.length
    ? latestProducts.map(item => `<div class="quick-item"><span class="quick-number">${escapeHtml(item.stock ?? 0)}</span><div><strong>${escapeHtml(item.nombre)}</strong><small>${currency(item.precio)} · Stock disponible</small></div></div>`).join('')
    : '<div class="empty-state">Todavía no hay productos.</div>';
  page.innerHTML = `${pageHeading('Un espacio para cada idea.', 'Resumen de actividad y gestión de tu tienda.', '<button class="button button-primary" data-action="new-product">＋ Nuevo producto</button>')}
    <div class="stats-grid">${statCards}</div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-heading"><h2>Pedidos recientes</h2><button class="text-link" data-view="pedidos">Ver todos →</button></div><div class="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead><tbody>${orderRows}</tbody></table></div></section>
      <section class="panel"><div class="panel-heading"><h2>Productos recientes</h2><button class="text-link" data-view="productos">Ver todos →</button></div><div class="quick-list">${productItems}</div></section>
    </div>`;
}

function cellValue(column, item) {
  const value = item[column.key];
  if (column.format) return column.format(value, item);
  return escapeHtml(value === null || value === undefined || value === '' ? '—' : value);
}

function renderResource(key) {
  const resource = resources[key];
  const query = state.search.trim().toLocaleLowerCase('es');
  const data = (state.data[key] || []).filter(item => !query || Object.values(item).some(value => String(value ?? '').toLocaleLowerCase('es').includes(query)));
  const header = resource.columns.map(column => `<th>${column.label}</th>`).join('');
  const rows = data.map(item => {
    const cells = resource.columns.map(column => {
      if (column.primary) {
        const secondary = column.secondary && item[column.secondary] ? `<span class="secondary-cell">${escapeHtml(item[column.secondary])}</span>` : '';
        return `<td><span class="primary-cell">${cellValue(column, item)}</span>${secondary}</td>`;
      }
      if (column.truncate) return `<td title="${escapeHtml(item[column.key] || '')}">${escapeHtml(item[column.key] ? `${String(item[column.key]).slice(0, 45)}${String(item[column.key]).length > 45 ? '…' : ''}` : '—')}</td>`;
      return `<td>${cellValue(column, item)}</td>`;
    }).join('');
    return `<tr>${cells}<td><div class="actions-cell"><button class="table-action" data-action="edit" data-id="${escapeHtml(item[resource.id])}">Editar</button><button class="table-action delete" data-action="delete" data-id="${escapeHtml(item[resource.id])}">Eliminar</button></div></td></tr>`;
  }).join('');
  page.innerHTML = `${pageHeading(resource.label, `${(state.data[key] || []).length} registros en total.`, `<button class="button button-primary" data-action="create">＋ Nuevo ${resource.singular}</button>`)}
    <div class="toolbar"><label class="search-box"><span>⌕</span><input id="searchInput" type="search" value="${escapeHtml(state.search)}" placeholder="Buscar ${resource.label.toLocaleLowerCase('es')}..." aria-label="Buscar ${resource.label.toLocaleLowerCase('es')}"></label><button class="button button-quiet" data-action="refresh">↻ Actualizar</button></div>
    <section class="panel table-panel"><div class="table-wrap"><table><thead><tr>${header}<th>Acciones</th></tr></thead><tbody>${rows || `<tr><td colspan="${resource.columns.length + 1}" class="empty-state">${query ? 'No se encontraron resultados.' : `Todavía no hay ${resource.label.toLocaleLowerCase('es')}.`}</td></tr>`}</tbody></table></div></section>`;
  document.querySelector('#searchInput').addEventListener('input', event => {
    state.search = event.target.value;
    const cursor = event.target.selectionStart;
    renderResource(key);
    const next = document.querySelector('#searchInput');
    next.focus();
    next.setSelectionRange(cursor, cursor);
  });
}

function switchView(view) {
  state.view = view;
  state.search = '';
  document.querySelectorAll('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  document.querySelector('#breadcrumbCurrent').textContent = view === 'dashboard' ? 'Resumen' : resources[view].label;
  document.body.classList.remove('menu-open');
  if (view === 'dashboard') {
    page.innerHTML = '<div class="loading">Cargando resumen...</div>';
    Promise.all(Object.keys(resources).map(key => loadResource(key, true)))
      .then(renderDashboard)
      .catch(error => renderError(error));
    return;
  }
  page.innerHTML = '<div class="loading">Cargando información...</div>';
  loadResource(view).catch(() => {});
}

function createField(field, value, editing) {
  const label = escapeHtml(field.label);
  if (field.type === 'checkbox') {
    const checked = value === undefined ? field.defaultValue : value;
    return `<label class="checkbox-field form-field full"><input name="${field.name}" type="checkbox" ${checked ? 'checked' : ''}>${label}</label>`;
  }
  const required = field.required ? 'required' : '';
  const min = field.min !== undefined ? `min="${field.min}"` : '';
  const step = field.step ? `step="${field.step}"` : '';
  const full = field.full ? 'full' : '';
  const safeValue = escapeHtml(value ?? field.defaultValue ?? '');
  if (field.type === 'textarea') return `<label class="form-field ${full}">${label}<textarea name="${field.name}" ${required}>${safeValue}</textarea></label>`;
  if (field.type === 'select') {
    const options = field.options
      ? field.options.map(option => `<option value="${escapeHtml(option)}" ${String(value ?? field.defaultValue ?? '') === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')
      : (state.data[field.source] || []).map(item => {
        const id = item[field.optionId];
        const optionLabel = typeof field.optionLabel === 'function' ? field.optionLabel(item) : item[field.optionLabel];
        return `<option value="${escapeHtml(id)}" ${String(value ?? '') === String(id) ? 'selected' : ''}>${escapeHtml(optionLabel)}</option>`;
      }).join('');
    return `<label class="form-field ${full}">${label}<select name="${field.name}" ${required}><option value="">Seleccionar...</option>${options}</select></label>`;
  }
  return `<label class="form-field ${full}">${label}<input name="${field.name}" type="${field.type || 'text'}" value="${safeValue}" ${required} ${min} ${step} ${field.type === 'number' ? 'inputmode="decimal"' : ''}></label>`;
}

async function openForm(key, item = null) {
  const resource = resources[key];
  const dependencies = [...new Set(resource.fields.filter(field => field.source).map(field => field.source))];
  try {
    await Promise.all(dependencies.map(source => state.data[source] ? Promise.resolve() : loadResource(source, true)));
  } catch (error) {
    showToast(`No se pudieron cargar las opciones del formulario: ${error.message}`, true);
    return;
  }
  document.querySelector('#modalTitle').textContent = `${item ? 'Editar' : 'Nuevo'} ${resource.singular}`;
  document.querySelector('#formFields').innerHTML = resource.fields.map(field => createField(field, item?.[field.name], Boolean(item))).join('');
  form.dataset.resource = key;
  form.dataset.id = item ? item[resource.id] : '';
  modal.hidden = false;
  const first = form.querySelector('input:not([type="checkbox"]), select, textarea');
  if (first) first.focus();
}

function closeForm() {
  modal.hidden = true;
  form.reset();
  delete form.dataset.resource;
  delete form.dataset.id;
}

function showToast(message, error = false) {
  const toast = document.createElement('div');
  toast.className = `toast${error ? ' error' : ''}`;
  toast.textContent = message;
  document.querySelector('#toastRegion').append(toast);
  window.setTimeout(() => toast.remove(), 4000);
}

async function saveRecord(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const key = form.dataset.resource;
  const resource = resources[key];
  const itemId = form.dataset.id;
  const payload = {};
  for (const field of resource.fields) {
    const input = form.elements.namedItem(field.name);
    if (!input) continue;
    if (field.type === 'checkbox') payload[field.name] = input.checked;
    else if (field.type === 'number') payload[field.name] = input.value === '' ? (field.name === 'stock' ? 0 : null) : Number(input.value);
    else payload[field.name] = input.value;
  }
  const saveButton = document.querySelector('#saveRecord');
  saveButton.disabled = true;
  saveButton.textContent = 'Guardando...';
  try {
    await request(`${resource.endpoint}${itemId ? `/${encodeURIComponent(itemId)}` : ''}`, {
      method: itemId ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    closeForm();
    showToast(`${resource.singular[0].toLocaleUpperCase('es')}${resource.singular.slice(1)} ${itemId ? 'actualizado' : 'creado'} correctamente.`);
    await loadResource(key);
    if (key !== 'dashboard') loadDashboardData();
  } catch (error) {
    showToast(`No se pudo guardar: ${error.message}`, true);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Guardar';
  }
}

async function deleteRecord(key, id) {
  const resource = resources[key];
  if (!window.confirm(`¿Eliminar ${resource.singular} #${id}? Esta acción no se puede deshacer.`)) return;
  try {
    await request(`${resource.endpoint}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    showToast(`${resource.singular[0].toLocaleUpperCase('es')}${resource.singular.slice(1)} eliminado correctamente.`);
    await loadResource(key);
    loadDashboardData();
  } catch (error) {
    showToast(`No se pudo eliminar: ${error.message}`, true);
  }
}

function loadDashboardData() {
  Promise.all(Object.keys(resources).map(key => loadResource(key, true)))
    .then(() => { if (state.view === 'dashboard') renderDashboard(); })
    .catch(() => {});
}

document.addEventListener('click', event => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    event.preventDefault();
    switchView(viewButton.dataset.view);
    return;
  }
  const actionButton = event.target.closest('[data-action]');
  if (actionButton) {
    const action = actionButton.dataset.action;
    const key = state.view;
    const item = (state.data[key] || []).find(record => String(record[resources[key].id]) === actionButton.dataset.id);
    if (action === 'create') openForm(key);
    if (action === 'new-product') openForm('productos');
    if (action === 'edit' && item) openForm(key, item);
    if (action === 'delete') deleteRecord(key, actionButton.dataset.id);
    if (action === 'refresh') loadResource(key).catch(() => {});
    if (action === 'retry') switchView(state.view);
  }
});

document.querySelector('#settingsButton').addEventListener('click', () => {
  const current = apiBase();
  const entered = window.prompt('URL de la API (incluí /api)', current);
  if (entered === null) return;
  const value = entered.trim().replace(/\/+$/, '');
  if (!/^https?:\/\/.+\/api$/i.test(value)) {
    showToast('Ingresá una URL válida que termine en /api.', true);
    return;
  }
  localStorage.setItem(API_STORAGE_KEY, value);
  switchView(state.view);
});

document.querySelector('#menuButton').addEventListener('click', () => document.body.classList.toggle('menu-open'));
document.querySelector('#mobileBackdrop').addEventListener('click', () => document.body.classList.remove('menu-open'));
document.querySelector('#closeModal').addEventListener('click', closeForm);
document.querySelector('#cancelModal').addEventListener('click', closeForm);
modal.addEventListener('click', event => { if (event.target === modal) closeForm(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeForm(); });
form.addEventListener('submit', saveRecord);
document.querySelector('#todayLabel').textContent = new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

switchView('dashboard');
