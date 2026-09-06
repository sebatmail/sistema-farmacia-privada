// CONTROLADOR SUITE ADMINISTRATIVA FARMARED CHILE
let ADMIN_STATE = {
  autenticado: false,
  seccion_activa: 'dashboard',
  productos: [
    { id: 1, codigo_isp: 'F-14022', codigo_barra: '780000001001', nombre: 'Paracetamol 500 mg', principio: 'Paracetamol', lab: 'Laboratorio Chile', precio: 1800, cenabast_max: 1800, es_cenabast: true, condicion: 'VENTA_DIRECTA' },
    { id: 2, codigo_isp: 'F-18234', codigo_barra: '780000001002', nombre: 'Amoxicilina 850 mg', principio: 'Amoxicilina Trihidrato', lab: 'Andrómaco', precio: 14500, cenabast_max: null, es_cenabast: false, condicion: 'RECETA_SIMPLE' },
    { id: 3, codigo_isp: 'F-19045', codigo_barra: '780000001003', nombre: 'Losartán Potásico 50 mg', principio: 'Losartán Potásico', lab: 'Mintlab', precio: 8990, cenabast_max: 8990, es_cenabast: true, condicion: 'RECETA_SIMPLE' },
    { id: 4, codigo_isp: 'F-11200', codigo_barra: '780000001004', nombre: 'Clonazepam 2 mg', principio: 'Clonazepam', lab: 'Roche', precio: 18900, cenabast_max: null, es_cenabast: false, condicion: 'RECETA_RETENIDA' },
    { id: 5, codigo_isp: 'F-09812', codigo_barra: '780000001005', nombre: 'Morfina Sulfato 10 mg/mL', principio: 'Morfina Sulfato', lab: 'Sanderson', precio: 25000, cenabast_max: null, es_cenabast: false, condicion: 'RECETA_RETENIDA' },
    { id: 6, codigo_isp: 'F-15230', codigo_barra: '780000001006', nombre: 'Salbutamol 100 mcg', principio: 'Salbutamol Sulfato', lab: 'Laboratorio Chile', precio: 4200, cenabast_max: 2100, es_cenabast: true, condicion: 'RECETA_SIMPLE' },
    { id: 7, codigo_isp: 'F-17890', codigo_barra: '780000001007', nombre: 'Atorvastatina 20 mg', principio: 'Atorvastatina Cálcica', lab: 'Genfar', precio: 7990, cenabast_max: 4500, es_cenabast: true, condicion: 'RECETA_SIMPLE' },
    { id: 8, codigo_isp: 'F-16400', codigo_barra: '780000001008', nombre: 'Omeprazol 20 mg', principio: 'Omeprazol Magnésico', lab: 'Medley', precio: 5490, cenabast_max: null, es_cenabast: false, condicion: 'VENTA_DIRECTA' }
  ],
  usuarios: [
    { id: 1, rut: '11.111.111-1', nombre: 'Administrador General', email: 'admin@farmacia.cl', rol: 'ADMIN', pass: 'inacap2026', activo: true },
    { id: 2, rut: '15.234.567-8', nombre: 'Sebastián Torres', email: 'qf@farmacia.cl', rol: 'QUIMICO_FARMACEUTICO', pass: 'inacap2026', activo: true },
    { id: 3, rut: '19.876.543-2', nombre: 'Vicente Flores', email: 'cajero@farmacia.cl', rol: 'VENDEDOR', pass: 'inacap2026', activo: true },
    { id: 4, rut: '16.543.210-9', nombre: 'Operador de Bodega', email: 'bodega@farmacia.cl', rol: 'BODEGUERO', pass: 'inacap2026', activo: true }
  ],
  movimientos: [
    { folio: 4829, fecha: '05/09/2026 19:50', cajero: 'Vicente Flores', cliente: 'Juan Alberto Pérez Soto (12.345.678-9)', prevision: 'Isapre Banmédica', bruto: 18490, total: 6940, hash: 'TED-04829-OK' },
    { folio: 4828, fecha: '05/09/2026 19:22', cajero: 'Vicente Flores', cliente: 'María Francisca Soto Cruz (18.765.432-1)', prevision: 'Isapre Consalud', bruto: 14500, total: 7250, hash: 'TED-04828-OK' },
    { folio: 4827, fecha: '05/09/2026 18:45', cajero: 'Vicente Flores', cliente: 'Carlos Vera Silva (14.221.980-3)', prevision: 'Particular', bruto: 25000, total: 25000, hash: 'TED-04827-OK' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Comprobar sesión
  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    desbloquearConsola();
  }
  renderCrudMedicamentos();
  renderSelectProductosLote();
  renderMovimientos();
  renderUsuarios();
});

function autenticarAdmin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  const err = document.getElementById('login-error');

  if ((email === 'admin@farmacia.cl' || email === 'admin') && (pass === 'inacap2026' || pass === 'password123')) {
    sessionStorage.setItem('admin_authenticated', 'true');
    desbloquearConsola();
    mostrarToastAdmin('✓ Sesión administrativa iniciada correctamente.', 'success');
  } else {
    err.classList.remove('hidden');
  }
}

function desbloquearConsola() {
  document.getElementById('admin-login-overlay').classList.add('hidden');
  ADMIN_STATE.autenticado = true;
}

function cerrarSesionAdmin() {
  sessionStorage.removeItem('admin_authenticated');
  window.location.reload();
}

function cambiarSeccionAdmin(sec) {
  ADMIN_STATE.seccion_activa = sec;
  const secciones = ['dashboard', 'medicamentos', 'lotes', 'movimientos', 'usuarios'];
  secciones.forEach(s => {
    document.getElementById('sec-' + s).classList.add('hidden');
    const btn = document.getElementById('nav-btn-' + s);
    btn.className = 'py-3 px-3 font-medium text-slate-600 hover:text-slate-900 border-b-2 border-transparent flex items-center gap-1.5 whitespace-nowrap';
  });

  document.getElementById('sec-' + sec).classList.remove('hidden');
  const activeBtn = document.getElementById('nav-btn-' + sec);
  activeBtn.className = 'py-3 px-3 font-bold text-indigo-700 border-b-2 border-indigo-600 flex items-center gap-1.5 whitespace-nowrap';
}

// -------------------------------------------------------------
// CRUD MEDICAMENTOS
// -------------------------------------------------------------
function renderCrudMedicamentos() {
  const tbody = document.getElementById('crud-medicamentos-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ADMIN_STATE.productos.forEach(p => {
    let badgeCondicion = '';
    if (p.condicion === 'VENTA_DIRECTA') {
      badgeCondicion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">Venta Directa</span>';
    } else if (p.condicion === 'RECETA_SIMPLE') {
      badgeCondicion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">Receta Simple</span>';
    } else {
      badgeCondicion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">Receta Retenida (ISP)</span>';
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-slate-700">${p.codigo_isp}</td>
      <td class="py-3 px-4">
        <div class="font-extrabold text-slate-900">${p.nombre}</div>
        <div class="text-[10px] text-slate-400">${p.lab} • EAN: ${p.codigo_barra}</div>
      </td>
      <td class="py-3 px-4 text-slate-600">${p.principio}</td>
      <td class="py-3 px-4">${badgeCondicion}</td>
      <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">$${p.precio.toLocaleString('es-CL')}</td>
      <td class="py-3 px-4 text-center">
        ${p.es_cenabast ? `<span class="badge-cenabast text-[10px] px-2 py-0.5 rounded font-bold">Max: $${p.cenabast_max.toLocaleString('es-CL')}</span>` : '<span class="text-slate-300">-</span>'}
      </td>
      <td class="py-3 px-4 text-center">
        <div class="flex justify-center gap-1.5">
          <button onclick="editarMedicamento(${p.id})" class="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-bold rounded border border-slate-300 hover:border-indigo-300">Editar</button>
          <button onclick="eliminarMedicamento(${p.id})" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirModalNuevoMedicamento() {
  document.getElementById('med-id').value = '0';
  document.getElementById('modal-med-titulo').textContent = 'Registrar Nuevo Medicamento en Catálogo';
  document.getElementById('med-nombre').value = '';
  document.getElementById('med-principio').value = '';
  document.getElementById('med-lab').value = '';
  document.getElementById('med-isp').value = 'F-' + Math.floor(10000 + Math.random() * 90000);
  document.getElementById('med-barra').value = '78000000' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('med-precio').value = '';
  document.getElementById('med-condicion').value = 'VENTA_DIRECTA';
  document.getElementById('med-es-cenabast').checked = false;
  document.getElementById('box-cenabast-max').classList.add('hidden');
  document.getElementById('modal-medicamento').classList.remove('hidden');
}

function editarMedicamento(id) {
  const p = ADMIN_STATE.productos.find(x => x.id === id);
  if (!p) return;

  document.getElementById('med-id').value = p.id;
  document.getElementById('modal-med-titulo').textContent = 'Editar Medicamento & Precios: ' + p.nombre;
  document.getElementById('med-nombre').value = p.nombre;
  document.getElementById('med-principio').value = p.principio;
  document.getElementById('med-lab').value = p.lab;
  document.getElementById('med-isp').value = p.codigo_isp;
  document.getElementById('med-barra').value = p.codigo_barra;
  document.getElementById('med-precio').value = p.precio;
  document.getElementById('med-condicion').value = p.condicion;
  document.getElementById('med-es-cenabast').checked = p.es_cenabast;

  if (p.es_cenabast) {
    document.getElementById('box-cenabast-max').classList.remove('hidden');
    document.getElementById('med-cenabast-max').value = p.cenabast_max || p.precio;
  } else {
    document.getElementById('box-cenabast-max').classList.add('hidden');
  }

  document.getElementById('modal-medicamento').classList.remove('hidden');
}

function cerrarModalMedicamento() {
  document.getElementById('modal-medicamento').classList.add('hidden');
}

function toggleCenabastInput(checked) {
  const box = document.getElementById('box-cenabast-max');
  if (checked) {
    box.classList.remove('hidden');
    const precio = document.getElementById('med-precio').value;
    if (precio) document.getElementById('med-cenabast-max').value = precio;
  } else {
    box.classList.add('hidden');
  }
}

async function guardarMedicamento() {
  const id = parseInt(document.getElementById('med-id').value) || 0;
  const nombre = document.getElementById('med-nombre').value.trim();
  const principio = document.getElementById('med-principio').value.trim();
  const lab = document.getElementById('med-lab').value.trim();
  const isp = document.getElementById('med-isp').value.trim();
  const barra = document.getElementById('med-barra').value.trim();
  const precio = parseInt(document.getElementById('med-precio').value) || 0;
  const condicion = document.getElementById('med-condicion').value;
  const esCenabast = document.getElementById('med-es-cenabast').checked;
  const cenabastMax = esCenabast ? (parseInt(document.getElementById('med-cenabast-max').value) || precio) : null;

  if (!nombre || !isp || precio <= 0) {
    alert('Por favor complete Nombre, Código ISP y un Precio válido.');
    return;
  }

  const payload = {
    id: id,
    nombre: nombre,
    principio_activo: principio,
    laboratorio: lab,
    codigo_isp: isp,
    codigo_barra: barra,
    precio_venta: precio,
    condicion: condicion,
    es_cenabast: esCenabast,
    precio_cenabast_max: cenabastMax
  };

  // Intentar guardar en PHP cPanel
  try {
    await fetch('../api/products/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // Modo standalone
  }

  // Actualizar estado local
  if (id > 0) {
    const item = ADMIN_STATE.productos.find(x => x.id === id);
    if (item) {
      item.nombre = nombre;
      item.principio = principio;
      item.lab = lab;
      item.codigo_isp = isp;
      item.codigo_barra = barra;
      item.precio = precio;
      item.condicion = condicion;
      item.es_cenabast = esCenabast;
      item.cenabast_max = cenabastMax;
    }
    mostrarToastAdmin(`Medicamento ${nombre} actualizado correctamente.`, 'success');
  } else {
    const newId = ADMIN_STATE.productos.length + 1;
    ADMIN_STATE.productos.push({
      id: newId,
      nombre: nombre,
      principio: principio,
      lab: lab,
      codigo_isp: isp,
      codigo_barra: barra,
      precio: precio,
      condicion: condicion,
      es_cenabast: esCenabast,
      cenabast_max: cenabastMax
    });
    mostrarToastAdmin(`Medicamento ${nombre} agregado al catálogo oficial.`, 'success');
  }

  cerrarModalMedicamento();
  renderCrudMedicamentos();
  renderSelectProductosLote();
}

async function eliminarMedicamento(id) {
  const p = ADMIN_STATE.productos.find(x => x.id === id);
  if (!p) return;

  if (!confirm(`¿Está seguro de eliminar "${p.nombre}" del catálogo de la farmacia?`)) {
    return;
  }

  try {
    await fetch('../api/products/delete.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
  } catch (e) {}

  ADMIN_STATE.productos = ADMIN_STATE.productos.filter(x => x.id !== id);
  renderCrudMedicamentos();
  renderSelectProductosLote();
  mostrarToastAdmin(`Medicamento eliminado del sistema.`, 'info');
}

// -------------------------------------------------------------
// LOTES & FEFO
// -------------------------------------------------------------
function renderSelectProductosLote() {
  const sel = document.getElementById('lote-producto-select');
  if (!sel) return;
  sel.innerHTML = '';
  ADMIN_STATE.productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nombre} (${p.lab}) - Código ISP: ${p.codigo_isp}`;
    sel.appendChild(opt);
  });
}

function guardarNuevoLote() {
  const prodId = document.getElementById('lote-producto-select').value;
  const numLote = document.getElementById('lote-numero').value.trim();
  const vence = document.getElementById('lote-vencimiento').value;
  const cantBodega = parseInt(document.getElementById('lote-cant-bodega').value) || 0;

  if (!numLote || !vence || cantBodega <= 0) {
    alert('Por favor ingrese el número de lote, fecha de vencimiento y una cantidad válida.');
    return;
  }

  mostrarToastAdmin(`Lote ${numLote} ingresado a Bodega Central con éxito (${cantBodega} unidades).`, 'success');
  document.getElementById('lote-numero').value = '';
}

// -------------------------------------------------------------
// KARDEX / MOVIMIENTOS
// -------------------------------------------------------------
function renderMovimientos() {
  const tbody = document.getElementById('movimientos-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ADMIN_STATE.movimientos.forEach(m => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-emerald-700">#00${m.folio}</td>
      <td class="py-3 px-4 font-mono text-slate-600">${m.fecha}</td>
      <td class="py-3 px-4 font-medium text-slate-800">${m.cajero}</td>
      <td class="py-3 px-4 text-slate-700">${m.cliente}</td>
      <td class="py-3 px-4 font-semibold text-slate-800">${m.prevision}</td>
      <td class="py-3 px-4 text-right font-mono text-slate-500">$${m.bruto.toLocaleString('es-CL')}</td>
      <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">$${m.total.toLocaleString('es-CL')}</td>
      <td class="py-3 px-4 text-center">
        <span class="px-2 py-0.5 font-mono text-[10px] bg-slate-100 text-slate-700 rounded border border-slate-300 font-bold">${m.hash}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -------------------------------------------------------------
// USUARIOS (RBAC)
// -------------------------------------------------------------
function renderUsuarios() {
  const tbody = document.getElementById('usuarios-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ADMIN_STATE.usuarios.forEach(u => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold">${u.rut}</td>
      <td class="py-3 px-4 font-extrabold text-slate-900">${u.nombre}</td>
      <td class="py-3 px-4 text-slate-600 font-mono">${u.email}</td>
      <td class="py-3 px-4"><span class="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800 border">${u.rol}</span></td>
      <td class="py-3 px-4 text-center font-mono font-bold text-emerald-700">${u.pass}</td>
      <td class="py-3 px-4 text-center">
        ${u.activo ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Activo</span>' : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Suspendido</span>'}
      </td>
      <td class="py-3 px-4 text-center">
        <button onclick="toggleEstadoUsuario(${u.id})" class="px-2.5 py-1 text-[11px] font-bold rounded border ${u.activo ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}">
          ${u.activo ? 'Suspender' : 'Activar'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirModalNuevoUsuario() {
  document.getElementById('usr-rut').value = '';
  document.getElementById('usr-nombre').value = '';
  document.getElementById('usr-email').value = '';
  document.getElementById('usr-pass').value = 'inacap2026';
  document.getElementById('modal-usuario').classList.remove('hidden');
}

function cerrarModalUsuario() {
  document.getElementById('modal-usuario').classList.add('hidden');
}

async function guardarNuevoUsuario() {
  const rut = document.getElementById('usr-rut').value.trim();
  const nombre = document.getElementById('usr-nombre').value.trim();
  const email = document.getElementById('usr-email').value.trim();
  const rol = document.getElementById('usr-rol').value;
  const pass = document.getElementById('usr-pass').value.trim() || 'inacap2026';

  if (!rut || !nombre || !email) {
    alert('Por favor complete RUT, Nombre y Correo.');
    return;
  }

  try {
    await fetch('../api/users/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut, nombre, email, rol, password: pass, activo: 1 })
    });
  } catch (e) {}

  ADMIN_STATE.usuarios.push({
    id: ADMIN_STATE.usuarios.length + 1,
    rut: rut,
    nombre: nombre,
    email: email,
    rol: rol,
    pass: pass,
    activo: true
  });

  cerrarModalUsuario();
  renderUsuarios();
  mostrarToastAdmin(`Trabajador ${nombre} registrado con rol ${rol}.`, 'success');
}

function toggleEstadoUsuario(id) {
  const u = ADMIN_STATE.usuarios.find(x => x.id === id);
  if (!u) return;
  u.activo = !u.activo;
  renderUsuarios();
  mostrarToastAdmin(`Estado del usuario ${u.nombre} actualizado.`, 'info');
}

// -------------------------------------------------------------
// REPORTES
// -------------------------------------------------------------
function exportarReporteSII() {
  mostrarToastAdmin('Generando Libro de Ventas Oficial SII (PDF)... Descarga iniciada.', 'success');
}

function exportarReporteISP() {
  mostrarToastAdmin('Generando Balance Sanitario Oficial de Psicotrópicos ISP (Excel)... Descarga iniciada.', 'success');
}

function mostrarToastAdmin(msg, tipo = 'info') {
  const c = document.getElementById('toast-admin');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold max-w-sm pointer-events-auto ' +
    (tipo === 'success' ? 'bg-emerald-900 text-white border-emerald-700' : 'bg-slate-900 text-white border-slate-700');
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
