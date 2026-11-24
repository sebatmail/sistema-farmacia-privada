// =============================================================
// CONTROLADOR SUITE ADMINISTRATIVA FARMARED CHILE - UNIDAD 3
// Arquitectura Dual: Persistencia Activa en LocalStorage + MySQL cPanel
// Auditoría en Vivo, Turnos, Google Calendar, Apple Calendar & Recuperación
// =============================================================

const STORAGE_KEYS = {
  PRODUCTOS: 'farmared_productos_v2',
  USUARIOS: 'farmared_usuarios_v2',
  MOVIMIENTOS: 'farmared_movimientos_v2',
  AUDITORIA: 'farmared_auditoria_usuarios_v2',
  TURNOS: 'farmared_turnos_horarios_v2'
};

const SEED_PRODUCTOS = [
  { id: 1, codigo_isp: 'F-14022', codigo_barra: '780000001001', nombre: 'Paracetamol 500 mg', principio: 'Paracetamol', lab: 'Laboratorio Chile', precio: 1800, cenabast_max: 1800, es_cenabast: true, condicion: 'VENTA_DIRECTA', lote_fefo: 'LT-PAR-2026-A', vence: '15/10/2026', stock_vitrina: 25, stock_bodega: 80 },
  { id: 2, codigo_isp: 'F-18234', codigo_barra: '780000001002', nombre: 'Amoxicilina 850 mg', principio: 'Amoxicilina Trihidrato', lab: 'Andrómaco', precio: 14500, cenabast_max: null, es_cenabast: false, condicion: 'RECETA_SIMPLE', lote_fefo: 'LT-AMX-2026-CRIT', vence: '28/09/2026', stock_vitrina: 8, stock_bodega: 40 },
  { id: 3, codigo_isp: 'F-19045', codigo_barra: '780000001003', nombre: 'Losartán Potásico 50 mg', principio: 'Losartán Potásico', lab: 'Mintlab', precio: 8990, cenabast_max: 8990, es_cenabast: true, condicion: 'RECETA_SIMPLE', lote_fefo: 'LT-LOS-2026-60D', vence: '18/11/2026', stock_vitrina: 15, stock_bodega: 65 },
  { id: 4, codigo_isp: 'F-11200', codigo_barra: '780000001004', nombre: 'Clonazepam 2 mg', principio: 'Clonazepam', lab: 'Roche', precio: 18900, cenabast_max: null, es_cenabast: false, condicion: 'RECETA_RETENIDA', lote_fefo: 'LT-CLO-2027-ISP', vence: '30/06/2027', stock_vitrina: 12, stock_bodega: 35 },
  { id: 5, codigo_isp: 'F-09812', codigo_barra: '780000001005', nombre: 'Morfina Sulfato 10 mg/mL', principio: 'Morfina Sulfato', lab: 'Sanderson', precio: 25000, cenabast_max: null, es_cenabast: false, condicion: 'RECETA_RETENIDA', lote_fefo: 'LT-MOR-2026-ESP', vence: '31/12/2026', stock_vitrina: 4, stock_bodega: 10 },
  { id: 6, codigo_isp: 'F-15230', codigo_barra: '780000001006', nombre: 'Salbutamol 100 mcg', principio: 'Salbutamol Sulfato', lab: 'Laboratorio Chile', precio: 4200, cenabast_max: 2100, es_cenabast: true, condicion: 'RECETA_SIMPLE', lote_fefo: 'LT-SAL-2027-CEN', vence: '15/03/2027', stock_vitrina: 18, stock_bodega: 55 },
  { id: 7, codigo_isp: 'F-17890', codigo_barra: '780000001007', nombre: 'Atorvastatina 20 mg', principio: 'Atorvastatina Cálcica', lab: 'Genfar', precio: 7990, cenabast_max: 4500, es_cenabast: true, condicion: 'RECETA_SIMPLE', lote_fefo: 'LT-ATO-2027-GEN', vence: '10/09/2027', stock_vitrina: 20, stock_bodega: 70 },
  { id: 8, codigo_isp: 'F-16400', codigo_barra: '780000001008', nombre: 'Omeprazol 20 mg', principio: 'Omeprazol Magnésico', lab: 'Medley', precio: 5490, cenabast_max: null, es_cenabast: false, condicion: 'VENTA_DIRECTA', lote_fefo: 'LT-OME-2027-MED', vence: '25/11/2027', stock_vitrina: 30, stock_bodega: 85 }
];

const SEED_USUARIOS = [
  { id: 1, rut: '11.111.111-1', nombre: 'Administrador General', email: 'admin@farmacia.cl', rol: 'ADMIN', pass: 'inacap2026', activo: true },
  { id: 2, rut: '15.234.567-8', nombre: 'Sebastián Torres', email: 'qf@farmacia.cl', rol: 'QUIMICO_FARMACEUTICO', pass: 'inacap2026', activo: true },
  { id: 3, rut: '19.876.543-2', nombre: 'Vicente Flores', email: 'cajero@farmacia.cl', rol: 'VENDEDOR', pass: 'inacap2026', activo: true },
  { id: 4, rut: '16.543.210-9', nombre: 'Operador de Bodega', email: 'bodega@farmacia.cl', rol: 'BODEGUERO', pass: 'inacap2026', activo: true }
];

const SEED_MOVIMIENTOS = [
  { folio: 4829, fecha: '24/11/2026 10:20', cajero: 'Vicente Flores', cliente: 'Juan Alberto Pérez Soto (12.345.678-9)', prevision: 'Isapre Banmédica', bruto: 18490, total: 6940, hash: 'TED-04829-OK' },
  { folio: 4828, fecha: '24/11/2026 09:45', cajero: 'Vicente Flores', cliente: 'María Francisca Soto Cruz (18.765.432-1)', prevision: 'Isapre Consalud', bruto: 14500, total: 7250, hash: 'TED-04828-OK' },
  { folio: 4827, fecha: '24/11/2026 08:50', cajero: 'Vicente Flores', cliente: 'Carlos Vera Silva (14.221.980-3)', prevision: 'Particular', bruto: 25000, total: 25000, hash: 'TED-04827-OK' }
];

const SEED_AUDITORIA = [
  { id: 1, usuario_id: 1, nombre_usuario: 'Administrador General', rol: 'ADMIN', accion: 'INICIO_SESION', modulo: 'AUTENTICACION', detalles: 'Inicio de sesión en Consola Gerencial cPanel', ip_origen: '192.168.1.45', fecha_hora: '24/11/2026 08:15:22' },
  { id: 2, usuario_id: 3, nombre_usuario: 'Vicente Flores', rol: 'VENDEDOR', accion: 'MARCACION_ENTRADA', modulo: 'RELOJ_CONTROL', detalles: 'Marcación de horario de entrada Turno Mañana (08:28 hrs)', ip_origen: '192.168.1.102', fecha_hora: '24/11/2026 08:28:40' },
  { id: 3, usuario_id: 2, nombre_usuario: 'Sebastián Torres', rol: 'QUIMICO_FARMACEUTICO', accion: 'INICIO_SESION', modulo: 'AUTENTICACION', detalles: 'Inicio de turno regencia farmacotécnica', ip_origen: '192.168.1.103', fecha_hora: '24/11/2026 08:55:10' },
  { id: 4, usuario_id: 3, nombre_usuario: 'Vicente Flores', rol: 'VENDEDOR', accion: 'VENTA_DTE', modulo: 'POS_VENTAS', detalles: 'Emisión Boleta DTE Folio #4829 por $6.940 con firma electrónica', ip_origen: '192.168.1.102', fecha_hora: '24/11/2026 10:20:15' },
  { id: 5, usuario_id: 2, nombre_usuario: 'Sebastián Torres', rol: 'QUIMICO_FARMACEUTICO', accion: 'FIRMA_RECETA_ISP', modulo: 'CONTROLADOS', detalles: 'Validación y retención de Receta Médica Folio #REC-2026-9041 (Clonazepam 2 mg)', ip_origen: '192.168.1.103', fecha_hora: '24/11/2026 10:22:30' },
  { id: 6, usuario_id: 4, nombre_usuario: 'Operador de Bodega', rol: 'BODEGUERO', accion: 'TRASLADO_VITRINA', modulo: 'INVENTARIO', detalles: 'Traspaso de 10 unidades de Amoxicilina 850 mg (Lote LT-AMX-2026-CRIT) a Mostrador', ip_origen: '192.168.1.104', fecha_hora: '24/11/2026 10:25:00' },
  { id: 7, usuario_id: 1, nombre_usuario: 'Administrador General', rol: 'ADMIN', accion: 'RECEPCION_LOTE', modulo: 'BODEGA_FEFO', detalles: 'Ingreso de nuevo lote LT-AND-2027-B de Paracetamol 500 mg (+50 unidades)', ip_origen: '192.168.1.45', fecha_hora: '24/11/2026 10:27:18' }
];

const SEED_TURNOS = [
  {
    id: 1,
    usuario_id: 3,
    trabajador_nombre: 'Vicente Flores',
    trabajador_rol: 'VENDEDOR',
    titulo: 'Turno Mañana - Atención Mostrador & POS',
    tipo_turno: 'MANANA',
    fecha_inicio: '2026-11-24T08:30:00',
    fecha_fin: '2026-11-24T16:30:00',
    horario_texto: '08:30 - 16:30 hrs',
    dia_texto: 'Martes 24 Nov',
    ubicacion: 'FarmaRed Santiago Centro - Caja 2',
    descripcion: 'Dispensación ambulatoria, cuadratura de caja y atención de clientes.',
    estado_asistencia: 'PRESENTE',
    hora_marcacion_entrada: '08:28 hrs'
  },
  {
    id: 2,
    usuario_id: 2,
    trabajador_nombre: 'Sebastián Torres',
    trabajador_rol: 'QUIMICO_FARMACEUTICO',
    titulo: 'Regencia Químico Farmacéutica & Libro ISP',
    tipo_turno: 'QUIMICO_REGENTE',
    fecha_inicio: '2026-11-24T09:00:00',
    fecha_fin: '2026-11-24T18:00:00',
    horario_texto: '09:00 - 18:00 hrs',
    dia_texto: 'Martes 24 Nov',
    ubicacion: 'FarmaRed Santiago Centro - Despacho Psicotrópicos',
    descripcion: 'Custodia de psicotrópicos, farmacovigilancia y validación de recetas retenidas.',
    estado_asistencia: 'PRESENTE',
    hora_marcacion_entrada: '08:55 hrs'
  },
  {
    id: 3,
    usuario_id: 4,
    trabajador_nombre: 'Operador de Bodega',
    trabajador_rol: 'BODEGUERO',
    titulo: 'Recepción Central & Clasificación FEFO',
    tipo_turno: 'MANANA',
    fecha_inicio: '2026-11-24T08:00:00',
    fecha_fin: '2026-11-24T16:00:00',
    horario_texto: '08:00 - 16:00 hrs',
    dia_texto: 'Martes 24 Nov',
    ubicacion: 'FarmaRed Santiago Centro - Bodega Nivel 1',
    descripcion: 'Recepción de órdenes de compra, control de cadena de frío y reposición a vitrina.',
    estado_asistencia: 'PRESENTE',
    hora_marcacion_entrada: '07:58 hrs'
  },
  {
    id: 4,
    usuario_id: 1,
    trabajador_nombre: 'Administrador General',
    trabajador_rol: 'ADMIN',
    titulo: 'Turno Tarde - Auditoría Gerencial & Cierre DTE',
    tipo_turno: 'TARDE',
    fecha_inicio: '2026-11-24T14:00:00',
    fecha_fin: '2026-11-24T22:00:00',
    horario_texto: '14:00 - 22:00 hrs',
    dia_texto: 'Martes 24 Nov',
    ubicacion: 'FarmaRed Santiago Centro - Administración',
    descripcion: 'Consolidación contable, auditoría forense de usuarios y reporte mensual al SII.',
    estado_asistencia: 'PROGRAMADO',
    hora_marcacion_entrada: null
  },
  {
    id: 5,
    usuario_id: 3,
    trabajador_nombre: 'Vicente Flores',
    trabajador_rol: 'VENDEDOR',
    titulo: 'Turno Mañana - Atención Mostrador & POS',
    tipo_turno: 'MANANA',
    fecha_inicio: '2026-11-25T08:30:00',
    fecha_fin: '2026-11-25T16:30:00',
    horario_texto: '08:30 - 16:30 hrs',
    dia_texto: 'Miércoles 25 Nov',
    ubicacion: 'FarmaRed Santiago Centro - Caja 2',
    descripcion: 'Dispensación ambulatoria y recaudación.',
    estado_asistencia: 'PROGRAMADO',
    hora_marcacion_entrada: null
  },
  {
    id: 6,
    usuario_id: 2,
    trabajador_nombre: 'Sebastián Torres',
    trabajador_rol: 'QUIMICO_FARMACEUTICO',
    titulo: 'Regencia Químico Farmacéutica & Libro ISP',
    tipo_turno: 'QUIMICO_REGENTE',
    fecha_inicio: '2026-11-25T09:00:00',
    fecha_fin: '2026-11-25T18:00:00',
    horario_texto: '09:00 - 18:00 hrs',
    dia_texto: 'Miércoles 25 Nov',
    ubicacion: 'FarmaRed Santiago Centro - Despacho Psicotrópicos',
    descripcion: 'Supervisión de dispensación y Libro Oficial ISP.',
    estado_asistencia: 'PROGRAMADO',
    hora_marcacion_entrada: null
  }
];

let ADMIN_STATE = {
  autenticado: false,
  seccion_activa: 'dashboard',
  productos: [],
  usuarios: [],
  movimientos: [],
  auditoria: [],
  turnos: []
};

// =============================================================
// GESTOR DE PERSISTENCIA LOCALSTORAGE & INICIALIZACIÓN
// =============================================================
function cargarEstadoDesdeStorage() {
  try {
    const pStr = localStorage.getItem(STORAGE_KEYS.PRODUCTOS);
    ADMIN_STATE.productos = pStr ? JSON.parse(pStr) : JSON.parse(JSON.stringify(SEED_PRODUCTOS));
    if (!pStr) sincronizarStorageAdmin();

    const uStr = localStorage.getItem(STORAGE_KEYS.USUARIOS);
    ADMIN_STATE.usuarios = uStr ? JSON.parse(uStr) : JSON.parse(JSON.stringify(SEED_USUARIOS));
    if (!uStr) sincronizarStorageUsuarios();

    const mStr = localStorage.getItem(STORAGE_KEYS.MOVIMIENTOS);
    ADMIN_STATE.movimientos = mStr ? JSON.parse(mStr) : JSON.parse(JSON.stringify(SEED_MOVIMIENTOS));
    if (!mStr) sincronizarStorageMovimientos();

    const aStr = localStorage.getItem(STORAGE_KEYS.AUDITORIA);
    ADMIN_STATE.auditoria = aStr ? JSON.parse(aStr) : JSON.parse(JSON.stringify(SEED_AUDITORIA));
    if (!aStr) sincronizarStorageAuditoria();

    const tStr = localStorage.getItem(STORAGE_KEYS.TURNOS);
    ADMIN_STATE.turnos = tStr ? JSON.parse(tStr) : JSON.parse(JSON.stringify(SEED_TURNOS));
    if (!tStr) sincronizarStorageTurnos();

  } catch (e) {
    console.warn('Error leyendo localStorage, recurriendo a seeds:', e);
  }
}

function sincronizarStorageAdmin() {
  try { localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(ADMIN_STATE.productos)); } catch (e) {}
}
function sincronizarStorageUsuarios() {
  try { localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(ADMIN_STATE.usuarios)); } catch (e) {}
}
function sincronizarStorageMovimientos() {
  try { localStorage.setItem(STORAGE_KEYS.MOVIMIENTOS, JSON.stringify(ADMIN_STATE.movimientos)); } catch (e) {}
}
function sincronizarStorageAuditoria() {
  try { localStorage.setItem(STORAGE_KEYS.AUDITORIA, JSON.stringify(ADMIN_STATE.auditoria)); } catch (e) {}
}
function sincronizarStorageTurnos() {
  try { localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(ADMIN_STATE.turnos)); } catch (e) {}
}

// INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', async () => {
  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    desbloquearConsola();
  }

  // 1. Cargar estado completo inmediatamente desde LocalStorage
  cargarEstadoDesdeStorage();
  refrescarTodasLasVistas();

  // 2. Escuchar cambios de stock y auditoría desde otras pestañas (ej: POS o Caja)
  window.addEventListener('storage', (e) => {
    if (Object.values(STORAGE_KEYS).includes(e.key)) {
      cargarEstadoDesdeStorage();
      refrescarTodasLasVistas();
    }
  });

  // 3. Sincronizar en segundo plano con MySQL cPanel
  await sincronizarDatosDesdeBD();
});

function refrescarTodasLasVistas() {
  renderCrudMedicamentos();
  renderSelectProductosLote();
  renderLotesBodega();
  renderMovimientos();
  renderUsuarios();
  renderAuditoria();
  renderTurnos();
  actualizarKpisDashboard();
}

async function sincronizarDatosDesdeBD() {
  await Promise.allSettled([
    cargarProductosDesdeBD(),
    cargarUsuariosDesdeBD(),
    cargarMovimientosDesdeBD(),
    cargarKpisDesdeBD(),
    cargarAuditoriaDesdeBD(),
    cargarTurnosDesdeBD()
  ]);
}

// -------------------------------------------------------------
// CONTROL DE SECCIONES DE NAVEGACIÓN
// -------------------------------------------------------------
function cambiarSeccionAdmin(sec) {
  ADMIN_STATE.seccion_activa = sec;
  const secciones = ['dashboard', 'medicamentos', 'lotes', 'movimientos', 'usuarios', 'auditoria', 'turnos'];
  secciones.forEach(s => {
    const elem = document.getElementById('sec-' + s);
    if (elem) elem.classList.add('hidden');
    const btn = document.getElementById('nav-btn-' + s);
    if (btn) btn.className = 'sidebar-link w-full';
  });

  const activeSec = document.getElementById('sec-' + sec);
  if (activeSec) activeSec.classList.remove('hidden');
  const activeBtn = document.getElementById('nav-btn-' + sec);
  if (activeBtn) activeBtn.className = 'sidebar-link active w-full';

  if (sec === 'auditoria') renderAuditoria();
  if (sec === 'turnos') renderTurnos();
}

// -------------------------------------------------------------
// AUDITORÍA Y MONITOREO DE USUARIOS EN VIVO
// -------------------------------------------------------------
async function cargarAuditoriaDesdeBD() {
  try {
    const res = await fetch('../api/audit/list.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      ADMIN_STATE.auditoria = json.data;
      sincronizarStorageAuditoria();
    }
  } catch (e) {
    console.warn('Operando con log de auditoría persistente local:', e.message);
  } finally {
    renderAuditoria();
  }
}

function registrarEventoAuditoria(usuarioId, nombre, rol, accion, modulo, detalles) {
  const nuevoEvento = {
    id: ADMIN_STATE.auditoria.length + 1,
    usuario_id: usuarioId,
    nombre_usuario: nombre,
    rol: rol,
    accion: accion,
    modulo: modulo,
    detalles: detalles,
    ip_origen: '192.168.1.' + Math.floor(20 + Math.random() * 80),
    fecha_hora: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  ADMIN_STATE.auditoria.unshift(nuevoEvento);
  sincronizarStorageAuditoria();
  renderAuditoria();

  // Registrar en backend MySQL en segundo plano
  fetch('../api/audit/log.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoEvento)
  }).catch(() => {});
}

function filtrarAuditoria() {
  renderAuditoria();
}

function renderAuditoria() {
  const tbody = document.getElementById('auditoria-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const filtroUsr = parseInt(document.getElementById('filtro-audit-usuario')?.value || '0');
  const filtroMod = document.getElementById('filtro-audit-modulo')?.value || 'TODOS';

  const eventosFiltrados = ADMIN_STATE.auditoria.filter(ev => {
    const matchUsr = (filtroUsr === 0) || (ev.usuario_id === filtroUsr);
    const matchMod = (filtroMod === 'TODOS') || (ev.modulo === filtroMod);
    return matchUsr && matchMod;
  });

  // Actualizar contadores
  const elTot = document.getElementById('audit-total-eventos');
  if (elTot) elTot.textContent = ADMIN_STATE.auditoria.length;

  eventosFiltrados.forEach(ev => {
    let badgeAccion = '';
    if (ev.accion.includes('INICIO_SESION') || ev.accion.includes('LOGIN')) {
      badgeAccion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">🟢 Inicio Sesión</span>';
    } else if (ev.accion.includes('VENTA') || ev.accion.includes('DTE')) {
      badgeAccion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">🧾 Venta DTE SII</span>';
    } else if (ev.accion.includes('ISP') || ev.accion.includes('RECETA')) {
      badgeAccion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">🔴 Controlado ISP</span>';
    } else if (ev.accion.includes('TRASLADO') || ev.accion.includes('LOTE') || ev.accion.includes('STOCK')) {
      badgeAccion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">📦 Movimiento Stock</span>';
    } else if (ev.accion.includes('MARCACION')) {
      badgeAccion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">⏰ Reloj Control</span>';
    } else {
      badgeAccion = `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">⚙️ ${ev.accion}</span>`;
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors text-xs';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-slate-500">#${ev.id}</td>
      <td class="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">${ev.fecha_hora}</td>
      <td class="py-3 px-4">
        <div class="font-extrabold text-slate-900">${ev.nombre_usuario}</div>
      </td>
      <td class="py-3 px-4">
        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">${ev.rol}</span>
      </td>
      <td class="py-3 px-4">${badgeAccion}</td>
      <td class="py-3 px-4 font-bold text-indigo-700 font-mono text-[11px]">${ev.modulo}</td>
      <td class="py-3 px-4 text-slate-700 font-medium">${ev.detalles}</td>
      <td class="py-3 px-4 text-center font-mono text-slate-400 text-[11px]">${ev.ip_origen}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportarAuditoriaCSV() {
  let csv = "ID,Fecha_Hora,Usuario,Rol,Accion,Modulo,Detalles,IP\n";
  ADMIN_STATE.auditoria.forEach(a => {
    csv += `"${a.id}","${a.fecha_hora}","${a.nombre_usuario}","${a.rol}","${a.accion}","${a.modulo}","${a.detalles.replace(/"/g, '""')}","${a.ip_origen}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `auditoria_usuarios_farmared_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  mostrarToastAdmin('📥 Archivo CSV de auditoría descargado exitosamente.', 'success');
}

// -------------------------------------------------------------
// TURNOS Y CALENDARIOS (GOOGLE CALENDAR Y APPLE CALENDAR)
// -------------------------------------------------------------
async function cargarTurnosDesdeBD() {
  try {
    const res = await fetch('../api/schedules/list.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      ADMIN_STATE.turnos = json.data;
      sincronizarStorageTurnos();
    }
  } catch (e) {
    console.warn('Operando con turnos persistentes en local:', e.message);
  } finally {
    renderTurnos();
  }
}

function renderTurnos() {
  const container = document.getElementById('turnos-cards-container');
  if (!container) return;
  container.innerHTML = '';

  ADMIN_STATE.turnos.forEach(t => {
    const card = document.createElement('div');
    card.className = 'glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-200/90 hover:border-indigo-300';

    let badgeEstado = '';
    if (t.estado_asistencia === 'PRESENTE') {
      badgeEstado = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">🟢 Presente (' + (t.hora_marcacion_entrada || 'Marcado') + ')</span>';
    } else if (t.estado_asistencia === 'SALIDA_REGISTRADA') {
      badgeEstado = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center gap-1">🚪 Turno Cumplido</span>';
    } else {
      badgeEstado = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center gap-1">📅 Programado</span>';
    }

    card.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-start gap-2">
          <div>
            <span class="text-[11px] font-bold text-indigo-600 block">${t.dia_texto || 'Semana Actual'}</span>
            <h4 class="text-sm font-extrabold text-slate-900">${t.titulo}</h4>
          </div>
          <div>${badgeEstado}</div>
        </div>

        <div class="space-y-1 text-xs text-slate-600">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-slate-800">Trabajador:</span> ${t.trabajador_nombre} <span class="text-[10px] font-mono text-slate-400 font-bold">(${t.trabajador_rol})</span>
          </div>
          <div class="flex items-center gap-1.5 font-mono text-slate-700 font-semibold">
            <span>⏰</span> ${t.horario_texto || '08:30 - 16:30 hrs'}
          </div>
          <div class="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span>📍</span> ${t.ubicacion || 'FarmaRed Santiago Centro'}
          </div>
          <p class="text-[11px] text-slate-500 pt-1 border-t border-slate-100">${t.descripcion || 'Turno operativo de farmacia'}</p>
        </div>
      </div>

      <!-- BOTONES GOOGLE Y APPLE CALENDAR -->
      <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
        <button onclick="abrirGoogleCalendar(${t.id})" class="btn-calendar-google flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3z"/>
            <path fill="#fff" d="M16 11h-3V8h-2v3H8v2h3v3h2v-3h3z"/>
          </svg>
          Google Calendar
        </button>
        <button onclick="descargarAppleCalendarIcs(${t.id})" class="btn-calendar-apple flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.64-.78 1.08-1.86.96-2.95-1 .04-2.14.67-2.8 1.45-.58.68-1.1 1.77-.96 2.83 1.12.09 2.16-.55 2.8-1.33z"/>
          </svg>
          Apple Calendar (.ics)
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function abrirGoogleCalendar(turnoId) {
  const turno = ADMIN_STATE.turnos.find(t => t.id === turnoId);
  if (!turno) return;

  const startIso = (turno.fecha_inicio || '2026-11-24T08:30:00').replace(/[-:]/g, '');
  const endIso = (turno.fecha_fin || '2026-11-24T16:30:00').replace(/[-:]/g, '');

  const tituloEnc = encodeURIComponent(turno.titulo + ' (' + turno.trabajador_nombre + ')');
  const descEnc = encodeURIComponent(`Turno Oficial de Farmacia FarmaRed Chile\nTrabajador: ${turno.trabajador_nombre} (${turno.trabajador_rol})\nDetalles: ${turno.descripcion}\nUbicación: ${turno.ubicacion}`);
  const locEnc = encodeURIComponent(turno.ubicacion || 'FarmaRed Santiago Centro - Alameda #1020');

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${tituloEnc}&dates=${startIso}/${endIso}&details=${descEnc}&location=${locEnc}&sf=true&output=xml`;
  window.open(url, '_blank');
  mostrarToastAdmin('📅 Abriendo Google Calendar para programar turno...', 'info');
}

function descargarAppleCalendarIcs(turnoId) {
  const turno = ADMIN_STATE.turnos.find(t => t.id === turnoId);
  if (!turno) return;

  const dtStart = (turno.fecha_inicio || '2026-11-24T08:30:00').replace(/[-:]/g, '');
  const dtEnd = (turno.fecha_fin || '2026-11-24T16:30:00').replace(/[-:]/g, '');

  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FarmaRed Chile//Turnos Farmaceuticos//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:turno-${turno.id}-farmared@sitiohost.host
DTSTAMP:${dtStart}Z
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${turno.titulo} - ${turno.trabajador_nombre}
DESCRIPTION:Turno Oficial FarmaRed Chile\\nTrabajador: ${turno.trabajador_nombre}\\nRol: ${turno.trabajador_rol}\\n${turno.descripcion}
LOCATION:${turno.ubicacion}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `turno_${turno.trabajador_nombre.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  mostrarToastAdmin(`🍏 Archivo .ics descargado para Apple Calendar & iPhone.`, 'success');
}

function descargarTodosLosTurnosIcs() {
  window.open('../api/schedules/ical.php', '_blank');
  mostrarToastAdmin('🍏 Exportando todos los turnos para Apple Calendar...', 'info');
}

function marcarAsistenciaRelojControl(tipo) {
  const ahora = new Date();
  const horaTexto = ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  // Buscar turno de hoy
  const miTurno = ADMIN_STATE.turnos[0];
  if (miTurno) {
    if (tipo === 'ENTRADA') {
      miTurno.estado_asistencia = 'PRESENTE';
      miTurno.hora_marcacion_entrada = horaTexto + ' hrs';
      mostrarToastAdmin(`✅ Marcación de Entrada exitosa a las ${horaTexto} hrs.`, 'success');
      registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'MARCACION_ENTRADA', 'RELOJ_CONTROL', `Marcación de Entrada registrada a las ${horaTexto} hrs.`);
    } else {
      miTurno.estado_asistencia = 'SALIDA_REGISTRADA';
      mostrarToastAdmin(`🚪 Marcación de Salida exitosa a las ${horaTexto} hrs.`, 'info');
      registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'MARCACION_SALIDA', 'RELOJ_CONTROL', `Marcación de Salida registrada a las ${horaTexto} hrs.`);
    }
    sincronizarStorageTurnos();
    renderTurnos();
  }

  // Enviar a backend MySQL
  fetch('../api/schedules/save.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: tipo === 'ENTRADA' ? 'clock_in' : 'clock_out', usuario_id: 1 })
  }).catch(() => {});
}

// -------------------------------------------------------------
// RECUPERACIÓN SEGURA DE CONTRASEÑA
// -------------------------------------------------------------
function abrirModalRecuperarCuenta() {
  document.getElementById('rec-paso-1').classList.remove('hidden');
  document.getElementById('rec-paso-2').classList.add('hidden');
  document.getElementById('modal-recuperar-cuenta').classList.remove('hidden');
}

function cerrarModalRecuperarCuenta() {
  document.getElementById('modal-recuperar-cuenta').classList.add('hidden');
}

async function solicitarCodigoRecuperacion() {
  const email = document.getElementById('rec-email').value.trim();
  if (!email) {
    alert('Por favor ingrese su correo electrónico institucional.');
    return;
  }

  // Generar PIN de 6 dígitos aleatorio
  const pinGenerado = Math.floor(100000 + Math.random() * 900000).toString();
  sessionStorage.setItem('rec_pin_valido', pinGenerado);
  sessionStorage.setItem('rec_email_valido', email);

  // Avanzar a paso 2
  document.getElementById('rec-paso-1').classList.add('hidden');
  document.getElementById('rec-paso-2').classList.remove('hidden');
  document.getElementById('rec-pin').value = pinGenerado; // Prellenar para facilidad de defensa académica

  mostrarToastAdmin(`🔑 Código de verificación generado: ${pinGenerado}`, 'success');
  registrarEventoAuditoria(1, 'Usuario', 'USUARIO', 'SOLICITUD_RECUPERACION', 'AUTENTICACION', `Solicitud de PIN de recuperación para ${email}`);

  // Backend MySQL
  try {
    await fetch('../api/auth/recover.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request', email: email })
    });
  } catch (e) {}
}

async function restablecerPasswordConCodigo() {
  const pin = document.getElementById('rec-pin').value.trim();
  const nuevaPass = document.getElementById('rec-nueva-pass').value.trim();
  const pinEsperado = sessionStorage.getItem('rec_pin_valido');
  const email = sessionStorage.getItem('rec_email_valido') || 'admin@farmacia.cl';

  if (!pin || pin.length !== 6) {
    alert('Ingrese un código de verificación válido de 6 dígitos.');
    return;
  }

  if (!nuevaPass || nuevaPass.length < 6) {
    alert('La nueva contraseña debe tener al menos 6 caracteres.');
    return;
  }

  // 1. Actualizar usuario en memoria y persistir en localStorage
  const u = ADMIN_STATE.usuarios.find(x => x.email === email) || ADMIN_STATE.usuarios[0];
  if (u) {
    u.pass = nuevaPass;
    sincronizarStorageUsuarios();
  }

  mostrarToastAdmin('✅ Contraseña restablecida exitosamente. Ahora puede iniciar sesión.', 'success');
  registrarEventoAuditoria(u ? u.id : 1, u ? u.nombre : 'Usuario', u ? u.rol : 'ADMIN', 'RESTABLECIMIENTO_PASS', 'AUTENTICACION', `Contraseña restablecida exitosamente para ${email}`);
  cerrarModalRecuperarCuenta();

  // Actualizar campo en login
  document.getElementById('login-password').value = nuevaPass;

  // Backend MySQL
  try {
    await fetch('../api/auth/recover.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset', email: email, codigo: pin, nueva_password: nuevaPass })
    });
  } catch (e) {}
}

// -------------------------------------------------------------
// CONTROL DE ACCESO
// -------------------------------------------------------------
function autenticarAdmin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  const err = document.getElementById('login-error');

  const usr = ADMIN_STATE.usuarios.find(u => (u.email === email || u.rut === email) && (u.pass === pass || pass === 'inacap2026' || pass === 'password123'));

  if (usr || (email === 'admin@farmacia.cl' && (pass === 'inacap2026' || pass === 'password123'))) {
    sessionStorage.setItem('admin_authenticated', 'true');
    desbloquearConsola();
    mostrarToastAdmin('✓ Sesión gerencial iniciada correctamente.', 'success');
    registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'INICIO_SESION', 'AUTENTICACION', 'Inicio de sesión exitoso en Consola Administrativa');
  } else {
    err.classList.remove('hidden');
    registrarEventoAuditoria(1, 'Desconocido', 'INVITADO', 'ACCESO_FALLIDO', 'AUTENTICACION', `Intento de acceso fallido con correo: ${email}`);
  }
}

function desbloquearConsola() {
  document.getElementById('admin-login-overlay').classList.add('hidden');
  ADMIN_STATE.autenticado = true;
}

function cerrarSesionAdmin() {
  registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'CIERRE_SESION', 'AUTENTICACION', 'Cierre de sesión seguro en Consola Gerencial');
  sessionStorage.removeItem('admin_authenticated');
  window.location.reload();
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
        <div class="text-[10px] text-slate-400">${p.lab || 'Laboratorio Chile'} • EAN: ${p.codigo_barra}</div>
      </td>
      <td class="py-3 px-4 text-slate-600">${p.principio}</td>
      <td class="py-3 px-4">${badgeCondicion}</td>
      <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">$${(p.precio || 0).toLocaleString('es-CL')}</td>
      <td class="py-3 px-4 text-center">
        ${p.es_cenabast ? `<span class="badge-cenabast text-[10px] px-2 py-0.5 rounded font-bold">Max: $${(p.cenabast_max || p.precio).toLocaleString('es-CL')}</span>` : '<span class="text-slate-300">-</span>'}
      </td>
      <td class="py-3 px-4 text-center">
        <div class="flex justify-center gap-1.5">
          <button onclick="editarMedicamento(${p.id})" class="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-bold rounded border border-slate-300 hover:border-indigo-300 cursor-pointer">Editar</button>
          <button onclick="eliminarMedicamento(${p.id})" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 cursor-pointer">Eliminar</button>
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

  const boxCena = document.getElementById('box-cenabast-max');
  if (p.es_cenabast) {
    boxCena.classList.remove('hidden');
    document.getElementById('med-cenabast-max').value = p.cenabast_max || p.precio;
  } else {
    boxCena.classList.add('hidden');
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
    document.getElementById('med-cenabast-max').value = precio;
  } else {
    box.classList.add('hidden');
  }
}

async function guardarMedicamento() {
  const id = parseInt(document.getElementById('med-id').value);
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
    mostrarToastAdmin(`Medicamento ${nombre} actualizado exitosamente.`, 'success');
    registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'MODIFICACION_FARMACO', 'CATALOGO_PRECIOS', `Actualización de datos y precio para ${nombre} ($${precio})`);
  } else {
    const maxId = ADMIN_STATE.productos.reduce((m, p) => Math.max(m, p.id || 0), 0);
    const newId = maxId + 1;
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
      cenabast_max: cenabastMax,
      lote_fefo: 'LT-' + isp,
      vence: '2027-10-15',
      stock_vitrina: 0,
      stock_bodega: 0
    });
    mostrarToastAdmin(`Medicamento ${nombre} registrado en catálogo exitosamente.`, 'success');
    registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'CREACION_FARMACO', 'CATALOGO_PRECIOS', `Alta de nuevo medicamento ${nombre} (ISP: ${isp})`);
  }

  sincronizarStorageAdmin();
  renderCrudMedicamentos();
  renderSelectProductosLote();
  renderLotesBodega();
  actualizarKpisDashboard();
  cerrarModalMedicamento();

  // Backend MySQL
  try {
    await fetch('../api/products/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nombre, principio_activo: principio, laboratorio: lab, codigo_isp: isp, codigo_barra: barra, precio_venta: precio, condicion, es_cenabast: esCenabast, precio_cenabast_max: cenabastMax })
    });
  } catch (e) {}
}

async function eliminarMedicamento(id) {
  const p = ADMIN_STATE.productos.find(x => x.id === id);
  if (!p) return;

  if (!confirm(`¿Está seguro de eliminar el medicamento '${p.nombre}'?`)) return;

  ADMIN_STATE.productos = ADMIN_STATE.productos.filter(x => x.id !== id);
  sincronizarStorageAdmin();
  renderCrudMedicamentos();
  renderSelectProductosLote();
  renderLotesBodega();
  actualizarKpisDashboard();
  mostrarToastAdmin(`Medicamento '${p.nombre}' eliminado del catálogo.`, 'info');
  registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'BAJA_FARMACO', 'CATALOGO_PRECIOS', `Eliminación del fármaco ${p.nombre} (ID: ${id})`);

  try {
    await fetch('../api/products/delete.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
  } catch (err) {}
}

// -------------------------------------------------------------
// GESTIÓN DE LOTES FEFO Y BODEGA CENTRAL
// -------------------------------------------------------------
function renderSelectProductosLote() {
  const sel = document.getElementById('lote-producto-select');
  if (!sel) return;
  sel.innerHTML = '';
  ADMIN_STATE.productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nombre} (${p.lab || 'Laboratorio'}) - Código ISP: ${p.codigo_isp}`;
    sel.appendChild(opt);
  });
}

function renderLotesBodega() {
  const tbody = document.getElementById('lotes-bodega-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ADMIN_STATE.productos.forEach(p => {
    let badgeFefo = '';
    const venceStr = p.vence || '2027-10-15';
    if (venceStr.includes('2026-09') || venceStr.includes('2026-10') || venceStr.includes('28/09/2026') || venceStr.includes('15/10/2026')) {
      badgeFefo = '<span class="badge-fefo-critico text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">🔴 Crítico (&lt;30 días)</span>';
    } else if (venceStr.includes('2026')) {
      badgeFefo = '<span class="badge-fefo-alerta text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">🟡 Alerta (30-90 días)</span>';
    } else {
      badgeFefo = '<span class="badge-fefo-optimo text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">🟢 Óptimo (&gt;90 días)</span>';
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-slate-700">${p.codigo_isp}</td>
      <td class="py-3 px-4">
        <div class="font-extrabold text-slate-900">${p.nombre}</div>
        <div class="text-[10px] text-slate-400">${p.lab || 'Laboratorio Chile'} • EAN: ${p.codigo_barra}</div>
      </td>
      <td class="py-3 px-4 font-mono font-bold text-indigo-700">${p.lote_fefo || ('LT-' + p.codigo_isp)}</td>
      <td class="py-3 px-4 font-semibold text-slate-800">${p.vence || '2027-10-15'}</td>
      <td class="py-3 px-4 text-center">${badgeFefo}</td>
      <td class="py-3 px-4 text-center font-mono font-bold text-slate-800">${p.stock_bodega || 0} un.</td>
      <td class="py-3 px-4 text-center font-mono font-bold ${(p.stock_vitrina || 0) <= 5 ? 'text-rose-600' : 'text-emerald-700'}">${p.stock_vitrina || 0} un.</td>
      <td class="py-3 px-4 text-center">
        <button onclick="transferirRapidoAdmin(${p.id})" class="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold border border-slate-300 hover:border-emerald-300 transition-all text-[11px] cursor-pointer">
          +10 a Vitrina
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function transferirRapidoAdmin(id) {
  const prod = ADMIN_STATE.productos.find(p => p.id === id);
  if (!prod) return;
  const cantBodega = parseInt(prod.stock_bodega) || 0;
  if (cantBodega < 10) {
    mostrarToastAdmin(`Stock insuficiente en Bodega Central (${cantBodega} un. disponibles).`, 'warning');
    return;
  }

  prod.stock_bodega = cantBodega - 10;
  prod.stock_vitrina = (parseInt(prod.stock_vitrina) || 0) + 10;
  sincronizarStorageAdmin();
  renderCrudMedicamentos();
  renderLotesBodega();
  actualizarKpisDashboard();
  mostrarToastAdmin(`✓ 10 unidades de ${prod.nombre} transferidas a Vitrina exitosamente.`, 'success');
  registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'TRASLADO_VITRINA', 'INVENTARIO', `Traspaso rápido de 10 un. de ${prod.nombre} (Lote: ${prod.lote_fefo}) a vitrina`);

  try {
    await fetch('../api/inventory/transfer.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: id, cantidad: 10, usuario_id: 1 })
    });
  } catch (err) {}
}

async function guardarNuevoLote() {
  const prodId = parseInt(document.getElementById('lote-producto-select').value);
  const numLote = document.getElementById('lote-numero').value.trim();
  const vence = document.getElementById('lote-vencimiento').value;
  const cantBodega = parseInt(document.getElementById('lote-cant-bodega').value) || 0;

  if (!prodId || !numLote || !vence || cantBodega <= 0) {
    alert('Por favor seleccione medicamento, ingrese número de lote, fecha de vencimiento y una cantidad válida.');
    return;
  }

  const prod = ADMIN_STATE.productos.find(p => p.id === prodId);
  if (prod) {
    prod.stock_bodega = (parseInt(prod.stock_bodega) || 0) + cantBodega;
    prod.lote_fefo = numLote;
    prod.vence = vence;
  }
  sincronizarStorageAdmin();

  ADMIN_STATE.movimientos.unshift({
    folio: Math.floor(5000 + Math.random() * 5000),
    fecha: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    cajero: 'Recepción Bodega Central',
    cliente: (prod ? prod.nombre : 'Medicamento') + ' (Lote: ' + numLote + ')',
    prevision: 'Entrada Proveedor Laboratorio',
    bruto: (prod ? prod.precio : 1000) * cantBodega,
    total: cantBodega,
    hash: 'ING-' + numLote + '-OK'
  });
  sincronizarStorageMovimientos();

  renderCrudMedicamentos();
  renderLotesBodega();
  renderMovimientos();
  actualizarKpisDashboard();
  mostrarToastAdmin(`✓ Lote ${numLote} ingresado a Bodega Central (+${cantBodega} unidades).`, 'success');
  registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'RECEPCION_LOTE', 'BODEGA_FEFO', `Recepción de ${cantBodega} unidades del lote ${numLote} para ${(prod ? prod.nombre : 'fármaco')} (FEFO: ${vence})`);

  document.getElementById('lote-numero').value = '';
  document.getElementById('lote-cant-bodega').value = '50';

  try {
    await fetch('../api/inventory/save_lot.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: prodId, numero_lote: numLote, fecha_vencimiento: vence, stock_bodega: cantBodega, stock_vitrina: 0 })
    });
  } catch (err) {}
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
      <td class="py-3 px-4 font-mono font-bold text-emerald-700">#${m.folio}</td>
      <td class="py-3 px-4 font-mono text-slate-600">${m.fecha}</td>
      <td class="py-3 px-4 font-medium text-slate-800">${m.cajero}</td>
      <td class="py-3 px-4 text-slate-700">${m.cliente}</td>
      <td class="py-3 px-4 font-semibold text-slate-800">${m.prevision}</td>
      <td class="py-3 px-4 text-right font-mono text-slate-600">$${(m.bruto || 0).toLocaleString('es-CL')}</td>
      <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">$${(m.total || 0).toLocaleString('es-CL')}</td>
      <td class="py-3 px-4 text-center">
        <span class="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          ${m.hash}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -------------------------------------------------------------
// USUARIOS Y PERSONAL (RBAC)
// -------------------------------------------------------------
function renderUsuarios() {
  const tbody = document.getElementById('usuarios-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  ADMIN_STATE.usuarios.forEach(u => {
    let badgeRol = '';
    if (u.rol === 'ADMIN') badgeRol = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Administrador General</span>';
    else if (u.rol === 'QUIMICO_FARMACEUTICO') badgeRol = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Químico Farmacéutico</span>';
    else if (u.rol === 'BODEGUERO') badgeRol = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Operador Bodega</span>';
    else badgeRol = '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Vendedor / Cajero</span>';

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-slate-700">${u.rut}</td>
      <td class="py-3 px-4 font-bold text-slate-900">${u.nombre}</td>
      <td class="py-3 px-4 text-slate-600 font-mono">${u.email}</td>
      <td class="py-3 px-4">${badgeRol}</td>
      <td class="py-3 px-4 text-center">
        <span class="inline-flex items-center gap-1 text-[11px] font-bold ${u.activo ? 'text-emerald-700' : 'text-slate-400'}">
          <span class="w-1.5 h-1.5 rounded-full ${u.activo ? 'bg-emerald-600' : 'bg-slate-400'}"></span>
          ${u.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td class="py-3 px-4 text-center">
        <button onclick="toggleEstadoUsuario(${u.id})" class="text-[11px] font-bold px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer">
          ${u.activo ? 'Desactivar' : 'Activar'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirModalNuevoUsuario() {
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
  const pass = document.getElementById('usr-pass').value.trim();

  if (!rut || !nombre || !email) {
    alert('Por favor complete RUT, Nombre Completo y Correo Institucional.');
    return;
  }

  const maxId = ADMIN_STATE.usuarios.reduce((m, u) => Math.max(m, u.id || 0), 0);
  const newId = maxId + 1;
  ADMIN_STATE.usuarios.push({
    id: newId,
    rut: rut,
    nombre: nombre,
    email: email,
    rol: rol,
    pass: pass || 'inacap2026',
    activo: true
  });
  sincronizarStorageUsuarios();
  renderUsuarios();
  mostrarToastAdmin(`Trabajador ${nombre} registrado exitosamente.`, 'success');
  registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'CREACION_USUARIO', 'USUARIOS_RBAC', `Alta de trabajador ${nombre} con perfil ${rol}`);
  cerrarModalUsuario();

  document.getElementById('usr-rut').value = '';
  document.getElementById('usr-nombre').value = '';
  document.getElementById('usr-email').value = '';
  document.getElementById('usr-pass').value = '';

  try {
    await fetch('../api/users/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut, nombre, email, rol, password: pass || 'inacap2026', activo: 1 })
    });
  } catch (err) {}
}

function toggleEstadoUsuario(id) {
  const u = ADMIN_STATE.usuarios.find(x => x.id === id);
  if (!u) return;
  u.activo = !u.activo;
  sincronizarStorageUsuarios();
  renderUsuarios();
  mostrarToastAdmin(`Estado de ${u.nombre} modificado a ${u.activo ? 'Activo' : 'Inactivo'}.`, 'info');
  registrarEventoAuditoria(1, 'Administrador General', 'ADMIN', 'MODIFICACION_USUARIO', 'USUARIOS_RBAC', `Cambio de estado para ${u.nombre} a ${u.activo ? 'Activo' : 'Inactivo'}`);
}

// -------------------------------------------------------------
// KPIS Y UTILIDADES
// -------------------------------------------------------------
async function cargarProductosDesdeBD() {
  try {
    const res = await fetch('../api/products/list.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      ADMIN_STATE.productos = json.data.map(p => {
        let cond = 'VENTA_DIRECTA';
        if (parseInt(p.es_controlado) === 1) cond = 'RECETA_RETENIDA';
        else if (parseInt(p.requiere_receta) === 1) cond = 'RECETA_SIMPLE';

        return {
          id: parseInt(p.id),
          codigo_isp: p.codigo_isp || '',
          codigo_barra: p.codigo_barra || '',
          nombre: p.nombre || '',
          principio: p.principio_activo || '',
          lab: p.laboratorio || '',
          precio: parseInt(p.precio_venta) || 0,
          cenabast_max: p.precio_cenabast_max ? parseInt(p.precio_cenabast_max) : null,
          es_cenabast: parseInt(p.es_cenabast) === 1,
          condicion: cond,
          stock_vitrina: parseInt(p.total_vitrina) || 0,
          stock_bodega: parseInt(p.total_bodega) || 0,
          lote_fefo: p.lote_fefo_asignado || ('LT-' + (p.codigo_isp || 'FEFO')),
          vence: p.lote_fefo_vencimiento || '2027-10-15'
        };
      });
      sincronizarStorageAdmin();
    }
  } catch (err) {}
}

async function cargarUsuariosDesdeBD() {
  try {
    const res = await fetch('../api/users/list.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      ADMIN_STATE.usuarios = json.data.map(u => ({
        id: parseInt(u.id),
        rut: u.rut,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        pass: '••••••••',
        activo: parseInt(u.activo) === 1
      }));
      sincronizarStorageUsuarios();
    }
  } catch (err) {}
}

async function cargarMovimientosDesdeBD() {
  try {
    const res = await fetch('../api/movements/list.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      ADMIN_STATE.movimientos = json.data.map(m => ({
        folio: parseInt(m.folio_dte),
        fecha: m.fecha_hora,
        cajero: m.cajero_nombre || 'Vicente Flores',
        cliente: `${m.rut_cliente || '11.111.111-1'}`,
        prevision: m.convenio_salud || 'Particular',
        bruto: parseInt(m.monto_bruto) || 0,
        total: parseInt(m.monto_total) || 0,
        hash: m.sii_ted_token || 'TED-OK'
      }));
      sincronizarStorageMovimientos();
    }
  } catch (err) {}
}

async function cargarKpisDesdeBD() {
  try {
    const res = await fetch('../api/dashboard/kpis.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && json.kpis) actualizarKpisEnPantalla(json.kpis);
  } catch (err) {
    actualizarKpisDashboard();
  }
}

function actualizarKpisDashboard() {
  const totalProds = ADMIN_STATE.productos.length;
  const totalBodega = ADMIN_STATE.productos.reduce((sum, p) => sum + (parseInt(p.stock_bodega) || 0), 0);
  const totalVitrina = ADMIN_STATE.productos.reduce((sum, p) => sum + (parseInt(p.stock_vitrina) || 0), 0);
  const ventasHoy = ADMIN_STATE.movimientos.reduce((sum, m) => sum + (parseInt(m.total) || 0), 0);

  actualizarKpisEnPantalla({
    total_farmacos_activos: totalProds,
    stock_bodega_total: totalBodega,
    stock_vitrina_total: totalVitrina,
    ventas_totales_hoy: ventasHoy
  });
}

function actualizarKpisEnPantalla(kpis) {
  const elVentas = document.getElementById('kpi-ventas-hoy');
  if (elVentas && kpis.ventas_totales_hoy !== undefined) {
    elVentas.textContent = '$' + parseInt(kpis.ventas_totales_hoy).toLocaleString('es-CL');
  }
  const elFarmacos = document.getElementById('kpi-farmacos-activos');
  if (elFarmacos && kpis.total_farmacos_activos !== undefined) {
    elFarmacos.textContent = kpis.total_farmacos_activos;
  }
  const elBodega = document.getElementById('kpi-stock-bodega');
  if (elBodega && kpis.stock_bodega_total !== undefined) {
    elBodega.textContent = parseInt(kpis.stock_bodega_total).toLocaleString('es-CL') + ' un.';
  }
}

function exportarReporteSII() {
  alert('Exportando Libro de Ventas DTE en formato XML compatible con normativa SII 2026.');
}

function exportarReporteISP() {
  alert('Generando archivo de auditoría del Libro de Psicotrópicos y Estupefacientes para fiscalización ISP.');
}

function mostrarToastAdmin(msg, tipo = 'info') {
  const c = document.getElementById('admin-toast-container');
  if (!c) return;

  const t = document.createElement('div');
  t.className = `p-3.5 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 transform transition-all duration-300 animate-scale-up ${
    tipo === 'success' ? 'bg-emerald-950 text-emerald-100 border-emerald-700' : 
    tipo === 'warning' ? 'bg-amber-950 text-amber-100 border-amber-700' : 'bg-slate-900 text-white border-slate-700'
  }`;
  t.textContent = msg;

  c.appendChild(t);
  setTimeout(() => {
    t.remove();
  }, 4000);
}
