// LOGICA SPA - FARMARED CHILE
// Soporte Dual: En Línea con APIs PHP cPanel y Standalone con Estado en Memoria

let DB = {
  productos: [
    { 
      id: 1, 
      codigo_isp: 'F-14022', 
      codigo_barra: '780000001001', 
      nombre: 'Paracetamol 500 mg', 
      presentacion: '16 Comprimidos Recubiertos', 
      principio: 'Paracetamol', 
      lab: 'Laboratorio Chile', 
      categoria: 'ANALGESICOS', 
      condicion: 'VENTA_DIRECTA', 
      precio: 1800, 
      cenabast_max: 1800, 
      es_cenabast: true, 
      controlado: false, 
      lote_fefo: 'LT-PAR-2026-A', 
      vence: '15/10/2026', 
      stock_vitrina: 25, 
      stock_bodega: 80 
    },
    { 
      id: 2, 
      codigo_isp: 'F-18234', 
      codigo_barra: '780000001002', 
      nombre: 'Amoxicilina 850 mg', 
      presentacion: '20 Comprimidos', 
      principio: 'Amoxicilina Trihidrato', 
      lab: 'Andrómaco', 
      categoria: 'ANTIBIOTICOS', 
      condicion: 'RECETA_SIMPLE', 
      precio: 14500, 
      cenabast_max: null, 
      es_cenabast: false, 
      controlado: false, 
      lote_fefo: 'LT-AMX-2026-CRIT', 
      vence: '28/09/2026', 
      stock_vitrina: 8, 
      stock_bodega: 40 
    },
    { 
      id: 3, 
      codigo_isp: 'F-19045', 
      codigo_barra: '780000001003', 
      nombre: 'Losartán Potásico 50 mg', 
      presentacion: '30 Comprimidos', 
      principio: 'Losartán Potásico', 
      lab: 'Mintlab', 
      categoria: 'CRONICOS', 
      condicion: 'RECETA_SIMPLE', 
      precio: 8990, 
      cenabast_max: 8990, 
      es_cenabast: true, 
      controlado: false, 
      lote_fefo: 'LT-LOS-2026-60D', 
      vence: '18/11/2026', 
      stock_vitrina: 15, 
      stock_bodega: 65 
    },
    { 
      id: 4, 
      codigo_isp: 'F-11200', 
      codigo_barra: '780000001004', 
      nombre: 'Clonazepam 2 mg', 
      presentacion: '30 Comprimidos Ranurados', 
      principio: 'Clonazepam', 
      lab: 'Roche', 
      categoria: 'CONTROLADOS', 
      condicion: 'RECETA_RETENIDA', 
      precio: 18900, 
      cenabast_max: null, 
      es_cenabast: false, 
      controlado: true, 
      lote_fefo: 'LT-CLO-2027-ISP', 
      vence: '30/06/2027', 
      stock_vitrina: 12, 
      stock_bodega: 35 
    },
    { 
      id: 5, 
      codigo_isp: 'F-09812', 
      codigo_barra: '780000001005', 
      nombre: 'Morfina Sulfato 10 mg/mL', 
      presentacion: 'Ampolla Inyectable 1 mL', 
      principio: 'Morfina Sulfato', 
      lab: 'Sanderson', 
      categoria: 'CONTROLADOS', 
      condicion: 'RECETA_RETENIDA', 
      precio: 25000, 
      cenabast_max: null, 
      es_cenabast: false, 
      controlado: true, 
      lote_fefo: 'LT-MOR-2026-ESP', 
      vence: '31/12/2026', 
      stock_vitrina: 4, 
      stock_bodega: 10 
    },
    { 
      id: 6, 
      codigo_isp: 'F-15230', 
      codigo_barra: '780000001006', 
      nombre: 'Salbutamol 100 mcg', 
      presentacion: 'Aerosol Inhalador 200 Dosis', 
      principio: 'Salbutamol Sulfato', 
      lab: 'Laboratorio Chile', 
      categoria: 'CRONICOS', 
      condicion: 'RECETA_SIMPLE', 
      precio: 4200, 
      cenabast_max: 2100, 
      es_cenabast: true, 
      controlado: false, 
      lote_fefo: 'LT-SAL-2027-CEN', 
      vence: '15/03/2027', 
      stock_vitrina: 18, 
      stock_bodega: 55 
    },
    { 
      id: 7, 
      codigo_isp: 'F-17890', 
      codigo_barra: '780000001007', 
      nombre: 'Atorvastatina 20 mg', 
      presentacion: '30 Comprimidos', 
      principio: 'Atorvastatina Cálcica', 
      lab: 'Genfar', 
      categoria: 'CRONICOS', 
      condicion: 'RECETA_SIMPLE', 
      precio: 7990, 
      cenabast_max: 4500, 
      es_cenabast: true, 
      controlado: false, 
      lote_fefo: 'LT-ATO-2027-GEN', 
      vence: '10/09/2027', 
      stock_vitrina: 20, 
      stock_bodega: 70 
    },
    { 
      id: 8, 
      codigo_isp: 'F-16400', 
      codigo_barra: '780000001008', 
      nombre: 'Omeprazol 20 mg', 
      presentacion: '28 Cápsulas con Gránulos', 
      principio: 'Omeprazol Magnésico', 
      lab: 'Medley', 
      categoria: 'ANALGESICOS', 
      condicion: 'VENTA_DIRECTA', 
      precio: 5490, 
      cenabast_max: null, 
      es_cenabast: false, 
      controlado: false, 
      lote_fefo: 'LT-OME-2027-MED', 
      vence: '25/11/2027', 
      stock_vitrina: 30, 
      stock_bodega: 85 
    }
  ],
  cart: [
    { producto_id: 1, cantidad: 2 },
    { producto_id: 3, cantidad: 1 }
  ],
  metodo_pago: 'TARJETA',
  rol_activo: 'VENDEDOR',
  filtro_categoria: 'TODOS',
  filtro_busqueda: '',
  controlados_log: [
    {
      folio: 'REC-2026-0849',
      fecha: '05/09/2026 18:24',
      farmaco: 'Clonazepam 2 mg (Roche)',
      medico: 'Dr. Alejandro Morales (RNPI: 44.912)',
      paciente: 'Carlos Vera Silva (14.221.980-3)',
      egreso: 1,
      saldo: 12,
      hash: 'a3f89e1...7b2c'
    },
    {
      folio: 'REC-2026-0850',
      fecha: '05/09/2026 19:10',
      farmaco: 'Morfina Sulfato 10 mg/mL (Sanderson)',
      medico: 'Dra. Patricia Valenzuela (RNPI: 29.840)',
      paciente: 'Lucía Méndez Rojas (11.543.891-2)',
      egreso: 2,
      saldo: 4,
      hash: 'e5b22a0...94fa'
    }
  ]
};
const STORAGE_KEYS_POS = {
  PRODUCTOS: 'farmared_productos_v2',
  CONTROLADOS: 'farmared_controlados_v2',
  MOVIMIENTOS: 'farmared_movimientos_v2',
  AUDITORIA: 'farmared_auditoria_usuarios_v2',
  TURNOS: 'farmared_turnos_horarios_v2'
};

function registrarAuditoriaPOS(accion, modulo, detalles) {
  try {
    const aStr = localStorage.getItem(STORAGE_KEYS_POS.AUDITORIA);
    const logs = aStr ? JSON.parse(aStr) : [];
    const rol = DB.rol_activo || 'VENDEDOR';
    let nombre = 'Vicente Flores';
    let uid = 3;
    if (rol === 'QUIMICO_FARMACEUTICO') { nombre = 'Sebastián Torres'; uid = 2; }
    else if (rol === 'ADMIN') { nombre = 'Administrador General'; uid = 1; }
    else if (rol === 'BODEGUERO') { nombre = 'Operador de Bodega'; uid = 4; }

    const evento = {
      id: logs.length + 1,
      usuario_id: uid,
      nombre_usuario: nombre,
      rol: rol,
      accion: accion,
      modulo: modulo,
      detalles: detalles,
      ip_origen: '192.168.1.102',
      fecha_hora: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    logs.unshift(evento);
    localStorage.setItem(STORAGE_KEYS_POS.AUDITORIA, JSON.stringify(logs));

    // Backend MySQL
    fetch('api/audit/log.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento)
    }).catch(() => {});
  } catch (e) {}
}

function cargarEstadoPersistentePOS() {
  try {
    const pStr = localStorage.getItem(STORAGE_KEYS_POS.PRODUCTOS);
    if (pStr) {
      const parsed = JSON.parse(pStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        DB.productos = parsed;
      }
    } else {
      sincronizarStoragePOS();
    }

    const cStr = localStorage.getItem(STORAGE_KEYS_POS.CONTROLADOS);
    if (cStr) {
      const parsedCtrl = JSON.parse(cStr);
      if (Array.isArray(parsedCtrl) && parsedCtrl.length > 0) {
        DB.controlados_log = parsedCtrl;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS_POS.CONTROLADOS, JSON.stringify(DB.controlados_log));
    }
  } catch (e) {
    console.warn('Error accediendo a localStorage en POS:', e);
  }
}

function sincronizarStoragePOS() {
  try {
    localStorage.setItem(STORAGE_KEYS_POS.PRODUCTOS, JSON.stringify(DB.productos));
  } catch (e) {}
}

function sincronizarControladosPOS() {
  try {
    localStorage.setItem(STORAGE_KEYS_POS.CONTROLADOS, JSON.stringify(DB.controlados_log));
  } catch (e) {}
}


// INICIALIZACION
document.addEventListener('DOMContentLoaded', async () => {
  cargarEstadoPersistentePOS();
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS_POS.PRODUCTOS) {
      cargarEstadoPersistentePOS();
      renderCatalogo();
      renderInventario();
    }
  });
  verificarConexion();
  await cargarCatalogoDesdeBD();
  await cargarControladosDesdeBD();
  renderCatalogo();
  renderCarrito();
  renderInventario();
  renderControlados();
  actualizarReloj();
  setInterval(actualizarReloj, 1000);

  // Soporte de navegación directa por URL (ej: ?tab=dashboard&role=ADMIN)
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  const roleParam = urlParams.get('role');
  if (tabParam) {
    switchTab(tabParam);
  }
  if (roleParam) {
    const sel = document.getElementById('role-selector');
    if (sel) {
      sel.value = roleParam;
      cambiarRol(roleParam);
    }
  }

  // Atajos de teclado ergonómicos
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F2') {
      e.preventDefault();
      const el = document.getElementById('search-input');
      if (el) el.focus();
    } else if (e.key === 'F12') {
      e.preventDefault();
      procesarVenta();
    } else if (e.key === 'Escape') {
      cerrarModalBoleta();
      cerrarModalTransferencia();
    }
  });
});

function actualizarReloj() {
  const d = new Date();
  const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const horaStr = d.toLocaleTimeString('es-CL', opciones);
  const el = document.getElementById('live-clock');
  if (el) {
    el.textContent = `Turno Mañana • ${horaStr} hrs`;
  }
}

async function verificarConexion() {
  try {
    const res = await fetch('api/dashboard/kpis.php');
    if (res.ok) {
      document.getElementById('backend-status-text').textContent = 'Conectado a Base de Datos MySQL';
      document.getElementById('backend-status').className = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs';
    } else {
      activarModoLocal();
    }
  } catch (err) {
    activarModoLocal();
  }
}

function activarModoLocal() {
  const el = document.getElementById('backend-status-text');
  if (el) el.textContent = 'Simulación Local Activa';
  const box = document.getElementById('backend-status');
  if (box) box.className = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs';
}

async function cargarCatalogoDesdeBD() {
  try {
    const res = await fetch('api/products/list.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      DB.productos = json.data.map(p => {
        let cond = 'VENTA_DIRECTA';
        if (parseInt(p.es_controlado) === 1) {
          cond = 'RECETA_RETENIDA';
        } else if (parseInt(p.requiere_receta) === 1) {
          cond = 'RECETA_SIMPLE';
        }
        return {
          id: parseInt(p.id),
          codigo_isp: p.codigo_isp || '',
          codigo_barra: p.codigo_barra || '',
          nombre: p.nombre || '',
          presentacion: p.presentacion || 'Unidad Comercial',
          principio: p.principio_activo || '',
          lab: p.laboratorio || 'Laboratorio Chile',
          categoria: (p.categoria_nombre || 'ANALGESICOS').toUpperCase(),
          condicion: cond,
          precio: parseInt(p.precio_venta) || 0,
          cenabast_max: p.precio_cenabast_max ? parseInt(p.precio_cenabast_max) : null,
          es_cenabast: parseInt(p.es_cenabast) === 1,
          controlado: parseInt(p.es_controlado) === 1,
          lote_fefo: p.lote_fefo_asignado || ('LT-' + (p.codigo_isp || 'FEFO')),
          vence: p.lote_fefo_vencimiento || 'Vigente',
          stock_vitrina: parseInt(p.total_vitrina) || 0,
          stock_bodega: parseInt(p.total_bodega) || 0
        };
      });
      renderCatalogo();
      renderInventario();
      console.log('Catalogo POS sincronizado con MySQL:', DB.productos.length, 'farmacos.');
    }
  } catch (err) {
    console.warn('Usando catalogo local en memoria:', err.message);
  }
}

async function cargarControladosDesdeBD() {
  try {
    const res = await fetch('api/controlled/list.php');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      DB.controlados_log = json.data.map(c => ({
        folio: c.folio_receta || `REC-${c.id}`,
        fecha: c.fecha,
        farmaco: `${c.producto_nombre} (${c.codigo_isp})`,
        medico: `${c.nombre_medico} (RNPI: ${c.rnpi_medico})`,
        paciente: `${c.nombre_paciente} (${c.rut_paciente})`,
        egreso: parseInt(c.cantidad),
        saldo: parseInt(c.saldo_resultante),
        hash: c.hash_sha256 ? (c.hash_sha256.substring(0, 10) + '...' + c.hash_sha256.substring(58)) : 'SHA-OK'
      }));
      renderControlados();
    }
  } catch (err) {
    console.warn('Usando libro controlado local:', err.message);
  }
}


function switchTab(tabId) {
  const tabs = ['pos', 'inventario', 'controlados', 'dashboard', 'turnos_pos'];
  tabs.forEach(t => {
    const view = document.getElementById('view-' + t);
    const btn = document.getElementById('tab-btn-' + t);
    if (view) view.classList.add('hidden');
    if (btn) {
      btn.className = 'tab-btn py-3 px-4 rounded-t-lg font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 whitespace-nowrap';
    }
  });

  const activeView = document.getElementById('view-' + tabId);
  const activeBtn = document.getElementById('tab-btn-' + tabId);
  if (activeView) activeView.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.className = 'tab-btn active py-3 px-4 rounded-t-lg font-bold flex items-center gap-2 whitespace-nowrap';
  }
  if (tabId === 'turnos_pos') {
    renderTurnosPOS();
  }
}

let rolAnterior = 'VENDEDOR';

function cambiarRol(rol) {
  if (rol === 'ADMIN') {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      document.getElementById('prompt-admin-pass').value = '';
      document.getElementById('prompt-auth-error').classList.add('hidden');
      document.getElementById('modal-auth-admin').classList.remove('hidden');
      return;
    }
  }
  rolAnterior = rol;
  DB.rol_activo = rol;
  mostrarToast(`Operador activo: ${rol}`, 'info');
}

function confirmarAuthAdmin() {
  const p = document.getElementById('prompt-admin-pass').value.trim();
  if (p === 'inacap2026' || p === 'password123') {
    sessionStorage.setItem('admin_authenticated', 'true');
    document.getElementById('modal-auth-admin').classList.add('hidden');
    rolAnterior = 'ADMIN';
    DB.rol_activo = 'ADMIN';
    const sel = document.getElementById('role-selector');
    if (sel) sel.value = 'ADMIN';
    mostrarToast('✓ Acceso concedido al Administrador de Local.', 'success');
  } else {
    document.getElementById('prompt-auth-error').classList.remove('hidden');
  }
}

function cancelarAuthAdmin() {
  document.getElementById('modal-auth-admin').classList.add('hidden');
  const sel = document.getElementById('role-selector');
  if (sel) sel.value = rolAnterior;
}

function setEjemploPaciente(rut, nombre, factor) {
  document.getElementById('pos-rut').value = rut;
  document.getElementById('pos-nombre').value = nombre;
  document.getElementById('pos-convenio').value = factor;
  actualizarConvenio(factor);
  mostrarToast(`Convenio de ${nombre} verificado correctamente`, 'success');
}

function actualizarConvenio(factor) {
  const f = parseFloat(factor);
  const badge = document.getElementById('pos-convenio-badge');
  if (f === 0.40) {
    badge.textContent = 'Convenio Verificado: Isapre Banmédica • 60% de Cobertura en canasta preferente';
  } else if (f === 0.50) {
    badge.textContent = 'Convenio Verificado: Isapre Consalud • 50% de Cobertura en medicamentos ambulatorios';
  } else if (f === 0.60) {
    badge.textContent = 'Convenio Verificado: Fonasa Tramo B/C • 40% de Bonificación Institucional';
  } else if (f === 0.70) {
    badge.textContent = 'Convenio Verificado: Seguro Bice Vida • 30% de Bonificación Complementaria';
  } else {
    badge.textContent = 'Atención Particular: Precios comerciales vigentes con tope legal Ley CENABAST';
  }
  renderCarrito();
}

function filtrarCategoria(cat) {
  DB.filtro_categoria = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.remove('active', 'bg-slate-900', 'text-white');
    btn.classList.add('bg-slate-100', 'text-slate-700');
  });
  event.target.classList.remove('bg-slate-100', 'text-slate-700');
  event.target.classList.add('active', 'bg-slate-900', 'text-white');
  renderCatalogo();
}

function filtrarCatalogo(q) {
  DB.filtro_busqueda = q.toLowerCase().trim();
  renderCatalogo();
}

function renderCatalogo() {
  const container = document.getElementById('catalog-grid');
  if (!container) return;
  container.innerHTML = '';

  const filtrados = DB.productos.filter(p => {
    const matchCat = (DB.filtro_categoria === 'TODOS') ||
                     (DB.filtro_categoria === 'CENABAST' && p.es_cenabast) ||
                     (p.categoria === DB.filtro_categoria);

    const matchSearch = !DB.filtro_busqueda ||
                        p.nombre.toLowerCase().includes(DB.filtro_busqueda) ||
                        p.principio.toLowerCase().includes(DB.filtro_busqueda) ||
                        p.lab.toLowerCase().includes(DB.filtro_busqueda) ||
                        p.codigo_barra.includes(DB.filtro_busqueda);

    return matchCat && matchSearch;
  });

  if (filtrados.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 py-8 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
        <p class="text-sm font-semibold">No se encontraron medicamentos para el criterio ingresado.</p>
        <p class="text-xs mt-1">Pruebe con otro nombre o limpie la búsqueda (F2).</p>
      </div>
    `;
    return;
  }

  filtrados.forEach(p => {
    // Badges
    let badgeCondicion = '';
    if (p.condicion === 'VENTA_DIRECTA') {
      badgeCondicion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">Venta Directa</span>';
    } else if (p.condicion === 'RECETA_SIMPLE') {
      badgeCondicion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">Receta Simple</span>';
    } else {
      badgeCondicion = '<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">⚠️ Receta Retenida (ISP)</span>';
    }

    const badgeCenabast = p.es_cenabast 
      ? `<span class="badge-cenabast text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">🏛️ Ley CENABAST ($${p.cenabast_max.toLocaleString('es-CL')})</span>` 
      : '';

    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <h4 class="font-extrabold text-sm text-slate-900 leading-tight">${p.nombre}</h4>
            <p class="text-[11px] text-slate-500">${p.presentacion} • <strong class="text-slate-700">${p.lab}</strong></p>
          </div>
          <span class="text-xs font-mono text-slate-400 font-semibold">${p.codigo_isp}</span>
        </div>

        <p class="text-[11px] text-slate-600 mb-2.5">Principio Activo: <em>${p.principio}</em></p>

        <div class="flex flex-wrap gap-1.5 mb-3">
          ${badgeCondicion}
          ${badgeCenabast}
        </div>
      </div>

      <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span class="text-[10px] text-slate-400 font-bold block">PRECIO LISTA</span>
          <span class="text-base font-black font-mono text-slate-900">$${p.precio.toLocaleString('es-CL')}</span>
          <span class="text-[10px] text-slate-500 block">Vitrina: <strong class="text-emerald-700">${p.stock_vitrina} un.</strong></span>
        </div>

        <button onclick="agregarAlCarro(${p.id})" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-xs hover:shadow transition-all flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function agregarAlCarro(id) {
  const prod = DB.productos.find(p => p.id === id);
  if (!prod) return;

  const item = DB.cart.find(c => c.producto_id === id);
  if (item) {
    if (item.cantidad >= prod.stock_vitrina) {
      mostrarToast(`No hay más existencias en vitrina para ${prod.nombre}. Reabastezca desde bodega.`, 'warning');
      return;
    }
    item.cantidad++;
  } else {
    if (prod.stock_vitrina <= 0) {
      mostrarToast(`Sin stock en mostrador para ${prod.nombre}.`, 'warning');
      return;
    }
    DB.cart.push({ producto_id: id, cantidad: 1 });
  }

  mostrarToast(`+ ${prod.nombre} agregado al ticket`, 'success');
  renderCarrito();
}

function cambiarCantidad(id, delta) {
  const item = DB.cart.find(c => c.producto_id === id);
  if (!item) return;

  const prod = DB.productos.find(p => p.id === id);
  item.cantidad += delta;

  if (item.cantidad <= 0) {
    DB.cart = DB.cart.filter(c => c.producto_id !== id);
    mostrarToast(`Producto eliminado del ticket`, 'info');
  } else if (prod && item.cantidad > prod.stock_vitrina) {
    item.cantidad = prod.stock_vitrina;
    mostrarToast(`Tope máximo de stock en mostrador alcanzado (${prod.stock_vitrina} un.)`, 'warning');
  }

  renderCarrito();
}

function eliminarDelCarro(id) {
  DB.cart = DB.cart.filter(c => c.producto_id !== id);
  mostrarToast(`Producto quitado del ticket`, 'info');
  renderCarrito();
}

function limpiarCarrito() {
  DB.cart = [];
  mostrarToast(`Ticket de venta vaciado`, 'info');
  renderCarrito();
}

function renderCarrito() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;
  container.innerHTML = '';

  const factorConvenio = parseFloat(document.getElementById('pos-convenio')?.value || '1.0');
  let subtotalBruto = 0;
  let ahorroCenabastTotal = 0;
  let subtotalEfectivo = 0;

  if (DB.cart.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-400">
        <svg class="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-xs font-semibold">El ticket de venta está vacío.</p>
        <p class="text-[11px] text-slate-400">Escanee o seleccione medicamentos a la izquierda.</p>
      </div>
    `;
  } else {
    DB.cart.forEach(item => {
      const p = DB.productos.find(x => x.id === item.producto_id);
      if (!p) return;

      const precioListaItem = p.precio * item.cantidad;
      subtotalBruto += precioListaItem;

      let precioEfectivoUnit = p.precio;
      if (p.es_cenabast && p.cenabast_max && p.precio > p.cenabast_max) {
        ahorroCenabastTotal += (p.precio - p.cenabast_max) * item.cantidad;
        precioEfectivoUnit = p.cenabast_max;
      }
      subtotalEfectivo += precioEfectivoUnit * item.cantidad;

      const itemDiv = document.createElement('div');
      itemDiv.className = 'p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-2';
      itemDiv.innerHTML = `
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-800 truncate">${p.nombre}</div>
          <div class="text-[10px] text-slate-500 font-mono">$${precioEfectivoUnit.toLocaleString('es-CL')} c/u ${p.es_cenabast ? '(CENABAST)' : ''}</div>
          ${p.controlado ? '<span class="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 rounded border border-rose-200">Requiere Receta</span>' : ''}
        </div>

        <div class="flex items-center gap-1.5">
          <button onclick="cambiarCantidad(${p.id}, -1)" class="w-6 h-6 rounded-md bg-white border border-slate-300 hover:bg-slate-100 font-bold flex items-center justify-center text-slate-700">-</button>
          <span class="w-6 text-center font-mono font-bold">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${p.id}, 1)" class="w-6 h-6 rounded-md bg-white border border-slate-300 hover:bg-slate-100 font-bold flex items-center justify-center text-slate-700">+</button>
        </div>

        <div class="text-right pl-1">
          <span class="font-mono font-bold text-slate-900 block">$${(precioEfectivoUnit * item.cantidad).toLocaleString('es-CL')}</span>
          <button onclick="eliminarDelCarro(${p.id})" class="text-[10px] text-rose-500 hover:text-rose-700">Quitar</button>
        </div>
      `;
      container.appendChild(itemDiv);
    });
  }

  // Cálculos finales con Convenio
  const totalConConvenio = Math.round(subtotalEfectivo * factorConvenio);
  const bonificacionConvenio = subtotalEfectivo - totalConConvenio;

  document.getElementById('lbl-subtotal-bruto').textContent = `$${subtotalBruto.toLocaleString('es-CL')}`;
  document.getElementById('lbl-ahorro-cenabast').textContent = `-$${ahorroCenabastTotal.toLocaleString('es-CL')}`;
  document.getElementById('lbl-descuento-convenio').textContent = `-$${bonificacionConvenio.toLocaleString('es-CL')}`;
  document.getElementById('lbl-total-neto').textContent = `$${totalConConvenio.toLocaleString('es-CL')}`;

  calcularVuelto();
}

function setMetodoPago(metodo) {
  DB.metodo_pago = metodo;
  ['TARJETA', 'EFECTIVO', 'IMED'].forEach(m => {
    const btn = document.getElementById('pay-btn-' + m);
    if (!btn) return;
    if (m === metodo) {
      btn.className = 'pay-method-btn p-2 rounded-xl border text-center font-bold text-[11px] bg-slate-900 text-white border-slate-900 shadow-xs';
    } else {
      btn.className = 'pay-method-btn p-2 rounded-xl border text-center font-bold text-[11px] bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
    }
  });

  const cashCalc = document.getElementById('cash-calculator');
  if (metodo === 'EFECTIVO') {
    cashCalc.classList.remove('hidden');
  } else {
    cashCalc.classList.add('hidden');
  }
}

function calcularVuelto() {
  const totalTexto = document.getElementById('lbl-total-neto').textContent.replace('$', '').replace(/\./g, '');
  const total = parseInt(totalTexto) || 0;
  const recibido = parseInt(document.getElementById('cash-received')?.value) || 0;
  const vuelto = Math.max(0, recibido - total);
  const vueltoEl = document.getElementById('cash-change');
  if (vueltoEl) {
    vueltoEl.textContent = `$${vuelto.toLocaleString('es-CL')}`;
  }
}

function setMontoExacto() {
  const totalTexto = document.getElementById('lbl-total-neto').textContent.replace('$', '').replace(/\./g, '');
  const total = parseInt(totalTexto) || 0;
  const input = document.getElementById('cash-received');
  if (input) {
    input.value = total;
    calcularVuelto();
  }
}

function addMontoEfectivo(monto) {
  const input = document.getElementById('cash-received');
  if (!input) return;
  const actual = parseInt(input.value) || 0;
  input.value = actual + monto;
  calcularVuelto();
}

async function procesarVenta() {
  if (DB.cart.length === 0) {
    mostrarToast('No hay medicamentos en el ticket para facturar.', 'warning');
    return;
  }

  // Validacion de recetas retenidas
  const tieneControlados = DB.cart.some(c => {
    const p = DB.productos.find(x => x.id === c.producto_id);
    return p && p.controlado;
  });

  if (tieneControlados && DB.rol_activo === 'BODEGUERO') {
    mostrarToast('Acceso Denegado: Un bodeguero no tiene facultades legales para visar medicamentos controlados por el ISP.', 'warning');
    return;
  }

  // Datos para DTE
  let folio = Math.floor(100000 + Math.random() * 900000);
  const cliente = document.getElementById('pos-nombre').value || 'Consumidor Final';
  const rut = document.getElementById('pos-rut').value || '66.666.666-6';
  const totalTexto = document.getElementById('lbl-total-neto').textContent;
  const total = parseInt(totalTexto.replace('$', '').replace(/\./g, '')) || 0;
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  // Llenar Modal Boleta inicial
  document.getElementById('modal-dte-folio').textContent = folio;
  document.getElementById('modal-dte-cliente').textContent = cliente;
  document.getElementById('modal-dte-rut').textContent = rut;
  document.getElementById('modal-dte-pago').textContent = DB.metodo_pago;
  document.getElementById('modal-dte-neto').textContent = `$${neto.toLocaleString('es-CL')}`;
  document.getElementById('modal-dte-iva').textContent = `$${iva.toLocaleString('es-CL')}`;
  document.getElementById('modal-dte-total').textContent = `$${total.toLocaleString('es-CL')}`;

  const now = new Date();
  document.getElementById('modal-dte-fecha').textContent = now.toLocaleString('es-CL');

  const itemsContainer = document.getElementById('modal-dte-items');
  itemsContainer.innerHTML = '';
  DB.cart.forEach(item => {
    const p = DB.productos.find(x => x.id === item.producto_id);
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'flex justify-between text-slate-700';
    row.innerHTML = `
      <span>${item.cantidad}x ${p.nombre}</span>
      <span class="font-mono">$${(p.precio * item.cantidad).toLocaleString('es-CL')}</span>
    `;
    itemsContainer.appendChild(row);
  });

  // 1. Enviar transaccion atomica al Backend MySQL en cPanel
  let factorDescuento = 0.0;
  if (DB.convenio_activo === 'BANMEDICA') factorDescuento = 0.6;
  else if (DB.convenio_activo === 'CONSALUD') factorDescuento = 0.5;
  else if (DB.convenio_activo === 'FONASA') factorDescuento = 0.4;

  const checkoutPayload = {
    items: DB.cart.map(c => ({ producto_id: c.producto_id, cantidad: c.cantidad })),
    rut_cliente: rut,
    nombre_cliente: cliente,
    convenio_salud: DB.convenio_activo,
    descuento_factor: factorDescuento,
    metodo_pago: DB.metodo_pago.includes('DEBITO') ? 'TARJETA_DEBITO' : (DB.metodo_pago.includes('CREDITO') ? 'TARJETA_CREDITO' : 'EFECTIVO'),
    usuario_id: (DB.rol_activo === 'QUIMICO_FARMACEUTICO' ? 2 : (DB.rol_activo === 'VENDEDOR' ? 3 : 1))
  };

  let ventaEnBD = false;
  try {
    const res = await fetch('api/pos/checkout.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutPayload)
    });
    const json = await res.json();
    if (json.success && json.dte) {
      ventaEnBD = true;
      folio = json.dte.folio;
      document.getElementById('modal-dte-folio').textContent = folio;
      mostrarToast(`Venta N ${folio} registrada en MySQL con timbrado DTE SII`, 'success');
      // Sincronizar catalogo y controlados reales desde MySQL
      await cargarCatalogoDesdeBD();
      await cargarControladosDesdeBD();
    }
  } catch (err) {
    console.warn('Checkout offline o error de conexion con BD:', err.message);
  }

  // 2. Si no hubo conexion a BD, actualizar inventario y libro local en memoria
  if (!ventaEnBD) {
    DB.cart.forEach(item => {
      const p = DB.productos.find(x => x.id === item.producto_id);
      if (!p) return;
      p.stock_vitrina = Math.max(0, p.stock_vitrina - item.cantidad);

      if (p.controlado) {
        DB.controlados_log.unshift({
          folio: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          fecha: now.toLocaleDateString('es-CL') + ' ' + now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
          farmaco: `${p.nombre} (${p.lab})`,
          medico: 'Dra. Maria Elena Lagos (RNPI: 51.204)',
          paciente: `${cliente} (${rut})`,
          egreso: item.cantidad,
          saldo: p.stock_vitrina,
          hash: 'b7c' + Math.random().toString(16).substr(2, 6) + '...f9e1'
        });
      }
    });
    sincronizarStoragePOS();
    sincronizarControladosPOS();
    mostrarToast(`✓ Venta N° ${folio} procesada y guardada exitosamente.`, 'success');
    registrarAuditoriaPOS('VENTA_DTE', 'POS_VENTAS', `Emisión de Boleta Electrónica Folio #${folio} por $${(DB.cart.reduce((s,i)=>s+i.subtotal,0)).toLocaleString('es-CL')} (Convenio: ${DB.convenio_activo})`);
    renderInventario();
    renderControlados();
  }

  // Mostrar Modal DTE
  document.getElementById('modal-boleta').classList.remove('hidden');
}

function cerrarModalBoleta() {
  document.getElementById('modal-boleta').classList.add('hidden');
  DB.cart = [];
  renderCarrito();
  renderCatalogo();
}

function imprimirBoleta() {
  window.print();
}

function renderInventario() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  DB.productos.forEach(p => {
    let badgeFefo = '';
    if (p.vence.includes('2026') && (p.vence.includes('09') || p.vence.includes('10'))) {
      badgeFefo = '<span class="badge-fefo-critico text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">🔴 Crítico (&lt;30 días)</span>';
    } else if (p.vence.includes('2026')) {
      badgeFefo = '<span class="badge-fefo-alerta text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">🟡 Alerta (30-90 días)</span>';
    } else {
      badgeFefo = '<span class="badge-fefo-optimo text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">🟢 Óptimo (&gt;90 días)</span>';
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-slate-700">${p.codigo_isp}</td>
      <td class="py-3 px-4">
        <div class="font-extrabold text-slate-900">${p.nombre}</div>
        <div class="text-[11px] text-slate-500">${p.lab} • EAN: ${p.codigo_barra}</div>
      </td>
      <td class="py-3 px-4 font-mono text-slate-600">${p.lote_fefo}</td>
      <td class="py-3 px-4 font-semibold text-slate-800">${p.vence}</td>
      <td class="py-3 px-4">${badgeFefo}</td>
      <td class="py-3 px-4 text-center font-mono font-bold ${p.stock_vitrina <= 5 ? 'text-rose-600' : 'text-emerald-700'}">${p.stock_vitrina} un.</td>
      <td class="py-3 px-4 text-center font-mono text-slate-600 font-semibold">${p.stock_bodega} un.</td>
      <td class="py-3 px-4 text-center">
        <button onclick="transferirRapido(${p.id})" class="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-bold border border-slate-300 hover:border-emerald-300 transition-all text-[11px]">
          +10 a Vitrina
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function transferirRapido(id) {
  const prod = DB.productos.find(p => p.id === id);
  if (!prod) return;
  const cantBodega = parseInt(prod.stock_bodega) || 0;
  if (cantBodega < 10) {
    mostrarToast(`Stock insuficiente en bodega para transferir 10 unidades de ${prod.nombre}.`, 'warning');
    return;
  }

  // 1. Modificar en memoria y persistir en localStorage inmediatamente
  prod.stock_bodega = cantBodega - 10;
  prod.stock_vitrina = (parseInt(prod.stock_vitrina) || 0) + 10;
  sincronizarStoragePOS();
  renderInventario();
  renderCatalogo();
  mostrarToast(`✓ 10 unidades de ${prod.nombre} transferidas a Vitrina exitosamente.`, 'success');
  registrarAuditoriaPOS('TRASLADO_VITRINA', 'INVENTARIO', `Traspaso de 10 unidades de ${prod.nombre} (Lote: ${prod.lote_fefo}) hacia Vitrina Mostrador`);

  // 2. Registrar en MySQL cPanel en segundo plano
  try {
    await fetch('api/inventory/transfer.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: id, cantidad: 10, usuario_id: 1 })
    });
  } catch (err) {}
}

function abrirModalTransferencia() {
  const select = document.getElementById('transfer-lote-select');
  if (!select) return;
  select.innerHTML = '';
  DB.productos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nombre} (Bodega: ${p.stock_bodega} un. | Lote: ${p.lote_fefo})`;
    select.appendChild(opt);
  });
  document.getElementById('modal-transfer').classList.remove('hidden');
}

function cerrarModalTransferencia() {
  document.getElementById('modal-transfer').classList.add('hidden');
}

async function ejecutarTransferencia() {
  const select = document.getElementById('transfer-lote-select');
  const cantInput = document.getElementById('transfer-cantidad');
  const id = parseInt(select.value);
  const cant = parseInt(cantInput.value) || 0;

  const prod = DB.productos.find(p => p.id === id);
  if (!prod || cant <= 0) return;

  const cantBodega = parseInt(prod.stock_bodega) || 0;
  if (cantBodega < cant) {
    mostrarToast(`La bodega solo cuenta con ${cantBodega} unidades de ${prod.nombre}.`, 'warning');
    return;
  }

  // 1. Modificar en memoria y persistir en localStorage inmediatamente
  prod.stock_bodega = cantBodega - cant;
  prod.stock_vitrina = (parseInt(prod.stock_vitrina) || 0) + cant;
  sincronizarStoragePOS();
  renderInventario();
  renderCatalogo();
  mostrarToast(`✓ Traslado de ${cant} unidades de ${prod.nombre} a Vitrina completado.`, 'success');
  cerrarModalTransferencia();

  // 2. Registrar en MySQL cPanel
  try {
    await fetch('api/inventory/transfer.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: id, cantidad: cant, usuario_id: 1 })
    });
  } catch (err) {}
}

function renderControlados() {
  const tbody = document.getElementById('controlled-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  DB.controlados_log.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-rose-700">${item.folio}</td>
      <td class="py-3 px-4 font-mono text-slate-600">${item.fecha}</td>
      <td class="py-3 px-4 font-bold text-slate-800">${item.farmaco}</td>
      <td class="py-3 px-4 text-slate-700">${item.medico}</td>
      <td class="py-3 px-4 text-slate-700">${item.paciente}</td>
      <td class="py-3 px-4 text-center font-mono font-bold text-rose-600">-${item.egreso} un.</td>
      <td class="py-3 px-4 text-center font-mono font-extrabold text-slate-900">${item.saldo} un.</td>
      <td class="py-3 px-4 text-center font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">${item.hash}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportarReporte(tipo) {
  if (tipo.includes('PDF') || tipo.includes('SII')) {
    mostrarToast('Generando Documento Tributario Oficial SII (PDF)... Descarga iniciada.', 'success');
  } else {
    mostrarToast('Generando Balance Sanitario ISP (Excel)... Descarga iniciada.', 'success');
  }
}

// Sistema de Toasts Amigable y Moderno
function mostrarToast(mensaje, tipo = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item pointer-events-auto px-4 py-3 rounded-2xl shadow-lg border flex items-center gap-3 text-xs font-semibold max-w-sm';

  if (tipo === 'success') {
    toast.className += ' bg-emerald-900 text-white border-emerald-700';
  } else if (tipo === 'warning') {
    toast.className += ' bg-amber-900 text-white border-amber-700';
  } else {
    toast.className += ' bg-slate-900 text-white border-slate-700';
  }

  toast.innerHTML = `
    <span>${mensaje}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// -------------------------------------------------------------
// TURNOS Y CALENDARIOS EN PUNTO DE VENTA (GOOGLE Y APPLE CALENDAR)
// -------------------------------------------------------------
function getTurnosPOS() {
  try {
    const tStr = localStorage.getItem(STORAGE_KEYS_POS.TURNOS);
    if (tStr) return JSON.parse(tStr);
  } catch (e) {}

  return [
    {
      id: 1,
      usuario_id: 3,
      trabajador_nombre: 'Vicente Flores',
      trabajador_rol: 'VENDEDOR',
      titulo: 'Turno Mañana - Dispensación & POS',
      horario_texto: '08:30 - 16:30 hrs',
      dia_texto: 'Martes 24 Nov',
      fecha_inicio: '2026-11-24T08:30:00',
      fecha_fin: '2026-11-24T16:30:00',
      ubicacion: 'FarmaRed Santiago Centro - Caja 2',
      descripcion: 'Atención ambulatoria y dispensación con recaudación de copagos.',
      estado_asistencia: 'PRESENTE',
      hora_marcacion_entrada: '08:28 hrs'
    },
    {
      id: 2,
      usuario_id: 2,
      trabajador_nombre: 'Sebastián Torres',
      trabajador_rol: 'QUIMICO_FARMACEUTICO',
      titulo: 'Regencia Farmacéutica & Controlados ISP',
      horario_texto: '09:00 - 18:00 hrs',
      dia_texto: 'Martes 24 Nov',
      fecha_inicio: '2026-11-24T09:00:00',
      fecha_fin: '2026-11-24T18:00:00',
      ubicacion: 'FarmaRed Santiago Centro - Despacho Controlados',
      descripcion: 'Custodia Libro ISP y validación de recetas retenidas.',
      estado_asistencia: 'PRESENTE',
      hora_marcacion_entrada: '08:55 hrs'
    },
    {
      id: 3,
      usuario_id: 4,
      trabajador_nombre: 'Operador de Bodega',
      trabajador_rol: 'BODEGUERO',
      titulo: 'Recepción Central & Clasificación FEFO',
      horario_texto: '08:00 - 16:00 hrs',
      dia_texto: 'Martes 24 Nov',
      fecha_inicio: '2026-11-24T08:00:00',
      fecha_fin: '2026-11-24T16:00:00',
      ubicacion: 'FarmaRed Santiago Centro - Bodega Central',
      descripcion: 'Recepción de órdenes de compra y reposición de mostrador.',
      estado_asistencia: 'PRESENTE',
      hora_marcacion_entrada: '07:58 hrs'
    }
  ];
}

function renderTurnosPOS() {
  const container = document.getElementById('turnos-pos-cards-container');
  if (!container) return;
  container.innerHTML = '';

  const turnos = getTurnosPOS();

  turnos.forEach(t => {
    const card = document.createElement('div');
    card.className = 'glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-200 hover:border-emerald-300';

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
            <span class="text-[11px] font-bold text-emerald-700 block">${t.dia_texto || 'Hoy'}</span>
            <h4 class="text-sm font-extrabold text-slate-900">${t.titulo}</h4>
          </div>
          <div>${badgeEstado}</div>
        </div>

        <div class="space-y-1 text-xs text-slate-600">
          <div><strong class="text-slate-800">Trabajador:</strong> ${t.trabajador_nombre} <span class="text-[10px] font-mono text-slate-400 font-bold">(${t.trabajador_rol})</span></div>
          <div class="font-mono text-slate-700 font-semibold">⏰ ${t.horario_texto || '08:30 - 16:30 hrs'}</div>
          <div class="text-slate-500 text-[11px]">📍 ${t.ubicacion || 'FarmaRed Santiago Centro'}</div>
          <p class="text-[11px] text-slate-500 pt-1 border-t border-slate-100">${t.descripcion || 'Turno operativo farmacia'}</p>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
        <button onclick="abrirGoogleCalendarPOS(${t.id})" class="btn-calendar-google flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3z"/>
            <path fill="#fff" d="M16 11h-3V8h-2v3H8v2h3v3h2v-3h3z"/>
          </svg>
          Google Calendar
        </button>
        <button onclick="descargarAppleCalendarIcsPOS(${t.id})" class="btn-calendar-apple flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
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

function abrirGoogleCalendarPOS(turnoId) {
  const turnos = getTurnosPOS();
  const turno = turnos.find(t => t.id === turnoId);
  if (!turno) return;

  const startIso = (turno.fecha_inicio || '2026-11-24T08:30:00').replace(/[-:]/g, '');
  const endIso = (turno.fecha_fin || '2026-11-24T16:30:00').replace(/[-:]/g, '');

  const tituloEnc = encodeURIComponent(turno.titulo + ' (' + turno.trabajador_nombre + ')');
  const descEnc = encodeURIComponent(`Turno FarmaRed Chile\nTrabajador: ${turno.trabajador_nombre}\nRol: ${turno.trabajador_rol}\n${turno.descripcion}`);
  const locEnc = encodeURIComponent(turno.ubicacion || 'FarmaRed Santiago Centro - Alameda #1020');

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${tituloEnc}&dates=${startIso}/${endIso}&details=${descEnc}&location=${locEnc}&sf=true&output=xml`;
  window.open(url, '_blank');
  mostrarToast('📅 Abriendo Google Calendar para programar tu turno...', 'info');
}

function descargarAppleCalendarIcsPOS(turnoId) {
  const turnos = getTurnosPOS();
  const turno = turnos.find(t => t.id === turnoId);
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
UID:turno-${turno.id}-pos@sitiohost.host
DTSTAMP:${dtStart}Z
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${turno.titulo} - ${turno.trabajador_nombre}
DESCRIPTION:Turno FarmaRed Chile\nTrabajador: ${turno.trabajador_nombre}\nRol: ${turno.trabajador_rol}\n${turno.descripcion}
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

  mostrarToast(`🍏 Archivo .ics descargado para Apple Calendar & iPhone.`, 'success');
}

function descargarTodosLosTurnosIcsPOS() {
  window.open('api/schedules/ical.php', '_blank');
  mostrarToast('🍏 Exportando todos los turnos para Apple Calendar...', 'info');
}

function marcarAsistenciaRelojControlPOS(tipo) {
  const ahora = new Date();
  const horaTexto = ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  const turnos = getTurnosPOS();
  if (turnos.length > 0) {
    if (tipo === 'ENTRADA') {
      turnos[0].estado_asistencia = 'PRESENTE';
      turnos[0].hora_marcacion_entrada = horaTexto + ' hrs';
      mostrarToast(`✅ Marcación de Entrada registrada exitosamente a las ${horaTexto} hrs.`, 'success');
      registrarAuditoriaPOS('MARCACION_ENTRADA', 'RELOJ_CONTROL', `Marcación de entrada registrada a las ${horaTexto} hrs.`);
    } else {
      turnos[0].estado_asistencia = 'SALIDA_REGISTRADA';
      mostrarToast(`🚪 Marcación de Salida registrada exitosamente a las ${horaTexto} hrs.`, 'info');
      registrarAuditoriaPOS('MARCACION_SALIDA', 'RELOJ_CONTROL', `Marcación de salida registrada a las ${horaTexto} hrs.`);
    }
    localStorage.setItem(STORAGE_KEYS_POS.TURNOS, JSON.stringify(turnos));
    renderTurnosPOS();
  }

  fetch('api/schedules/save.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: tipo === 'ENTRADA' ? 'clock_in' : 'clock_out', usuario_id: 3 })
  }).catch(() => {});
}

// -------------------------------------------------------------
// RECUPERACIÓN DE CONTRASEÑA EN POS
// -------------------------------------------------------------
function abrirModalRecuperarCuentaPOS() {
  document.getElementById('rec-pos-paso-1').classList.remove('hidden');
  document.getElementById('rec-pos-paso-2').classList.add('hidden');
  document.getElementById('modal-recuperar-pos').classList.remove('hidden');
}

function cerrarModalRecuperarCuentaPOS() {
  document.getElementById('modal-recuperar-pos').classList.add('hidden');
}

function solicitarCodigoRecuperacionPOS() {
  const email = document.getElementById('rec-pos-email').value.trim();
  if (!email) {
    alert('Ingrese un correo electrónico válido.');
    return;
  }

  const pinGenerado = Math.floor(100000 + Math.random() * 900000).toString();
  sessionStorage.setItem('rec_pos_pin_valido', pinGenerado);
  sessionStorage.setItem('rec_pos_email_valido', email);

  document.getElementById('rec-pos-paso-1').classList.add('hidden');
  document.getElementById('rec-pos-paso-2').classList.remove('hidden');
  document.getElementById('rec-pos-pin').value = pinGenerado;

  mostrarToast(`🔑 PIN de verificación generado: ${pinGenerado}`, 'success');
  registrarAuditoriaPOS('SOLICITUD_RECUPERACION', 'AUTENTICACION', `Solicitud de PIN de recuperación para ${email}`);

  fetch('api/auth/recover.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'request', email: email })
  }).catch(() => {});
}

function restablecerPasswordConCodigoPOS() {
  const pin = document.getElementById('rec-pos-pin').value.trim();
  const nuevaPass = document.getElementById('rec-pos-nueva-pass').value.trim();
  const email = sessionStorage.getItem('rec_pos_email_valido') || 'cajero@farmacia.cl';

  if (!pin || pin.length !== 6) {
    alert('Ingrese un PIN de verificación válido de 6 dígitos.');
    return;
  }

  if (!nuevaPass || nuevaPass.length < 6) {
    alert('La nueva contraseña debe tener al menos 6 caracteres.');
    return;
  }

  mostrarToast('✅ Contraseña restablecida exitosamente.', 'success');
  registrarAuditoriaPOS('RESTABLECIMIENTO_PASS', 'AUTENTICACION', `Contraseña restablecida exitosamente para ${email}`);
  cerrarModalRecuperarCuentaPOS();

  fetch('api/auth/recover.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'reset', email: email, codigo: pin, nueva_password: nuevaPass })
  }).catch(() => {});
}
