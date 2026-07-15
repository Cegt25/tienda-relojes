let carrito = [];

// 1. Agregar al carrito
function agregarAlCarrito(nombreArticulo, codigoArticulo, precioArticulo) {
    const articuloExistente = carrito.find(item => item.codigo === codigoArticulo);

    if (articuloExistente) {
        articuloExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombreArticulo,
            codigo: codigoArticulo,
            precio: precioArticulo,
            cantidad: 1
        });
    }

    actualizarVistaCarrito();
}

// 2. NUEVA FUNCIÓN: Controlar cantidades (+ y -)
function cambiarCantidad(codigoArticulo, cambio) {
    // Buscamos el artículo específico en el carrito
    const articuloExistente = carrito.find(item => item.codigo === codigoArticulo);
    
    if (articuloExistente) {
        // Le sumamos o restamos la cantidad recibida (+1 o -1)
        articuloExistente.cantidad += cambio;
        
        // Si el cliente resta hasta llegar a cero, eliminamos el producto de la lista
        if (articuloExistente.cantidad <= 0) {
            eliminarDelCarrito(codigoArticulo);
            return; // Salimos para que la pantalla no se actualice dos veces
        }
    }
    
    // Actualizamos la pantalla para reflejar los nuevos totales
    actualizarVistaCarrito();
}

// 3. Eliminar del carrito completamente
function eliminarDelCarrito(codigoArticulo) {
    const indice = carrito.findIndex(item => item.codigo === codigoArticulo);
    if (indice !== -1) {
        carrito.splice(indice, 1); // Borra el producto sin importar la cantidad
        actualizarVistaCarrito();
    }
}

// 4. Calculamos el total y lo mostramos en la página
function actualizarVistaCarrito() {
    const lista = document.getElementById('lista-carrito');
    const elementoTotal = document.getElementById('monto-total');
    let total = 0; 

    if (carrito.length === 0) {
        lista.innerHTML = '<li>Aún no has agregado artículos.</li>';
        elementoTotal.innerText = '0.00';
        return;
    }

    lista.innerHTML = '';
    carrito.forEach(item => {
        // Calculamos el subtotal de este artículo (precio x cantidad)
        const subtotal = item.precio * item.cantidad;
        total += subtotal; 

        // Nueva estructura HTML con los botones de cantidad y clases CSS
        lista.innerHTML += `
            <li class="item-carrito">
                <div class="info-item">
                    <span class="nombre-item">${item.nombre}</span>
                    <span class="precio-item">$${item.precio.toFixed(2)} c/u</span>
                </div>
                
                <div class="controles-cantidad">
                    <!-- Botón para restar (-1) -->
                    <button type="button" class="btn-cantidad" onclick="cambiarCantidad('${item.codigo}', -1)">-</button>
                    
                    <span class="numero-cantidad">${item.cantidad}</span>
                    
                    <!-- Botón para sumar (1) -->
                    <button type="button" class="btn-cantidad" onclick="cambiarCantidad('${item.codigo}', 1)">+</button>
                </div>
                
                <div class="subtotal-item">
                    <strong>$${subtotal.toFixed(2)}</strong>
                    <button type="button" onclick="eliminarDelCarrito('${item.codigo}')" title="Eliminar todo" style="background:none; border:none; cursor:pointer; font-size:1rem; margin-left:8px;">❌</button>
                </div>
            </li>
        `;
    });

    // Actualizamos el número grande del total en la pantalla
    elementoTotal.innerText = total.toFixed(2);
}

// 5. Enviamos el total al WhatsApp (Se mantiene tu código original intacto)
document.getElementById('formulario-whatsapp').addEventListener('submit', function(event) {
    event.preventDefault();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega artículos antes de hacer tu pedido.");
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const numeroWhatsApp = "1234567890"; // <- RECUERDA COLOCAR TU NÚMERO AQUÍ

    let mensaje = `¡Hola! Soy ${nombre}. Quiero realizar el siguiente pedido:%0A%0A`;
    let totalPagar = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalPagar += subtotal;

        mensaje += `📦 *Artículo:* ${item.nombre}%0A`;
        mensaje += `🔢 *Código:* ${item.codigo}%0A`;
        mensaje += `🛒 *Cantidad:* ${item.cantidad}%0A`;
        mensaje += `💵 *Subtotal:* $${subtotal.toFixed(2)}%0A`;
        mensaje += `-----------------------%0A`;
    });

    mensaje += `%0A💰 *TOTAL A PAGAR: $${totalPagar.toFixed(2)}*`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, '_blank');
});

// 6. Función para la galería de productos
function cambiarImagen(nuevaRutaImagen, idImagenPrincipal) {
    document.getElementById(idImagenPrincipal).src = nuevaRutaImagen;
}