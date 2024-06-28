document.addEventListener('DOMContentLoaded', () => {
    // Inicializar las compras desde localStorage
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];

    // Referencias a los elementos del DOM
    const purchaseForm = document.getElementById('purchaseForm');
    const purchaseList = document.getElementById('purchaseList');
    const clearPurchasesButton = document.getElementById('clearPurchases');

    // Función para renderizar las compras
    function renderPurchases() {
        purchaseList.innerHTML = purchases.map((purchase, index) => `
            <div>
                <p>Descripción: ${purchase.description}</p>
                <p>Costo Total: ${purchase.amount} soles</p>
                <p>Proveedor: ${purchase.supplier}</p>
                <p>Aprobado: ${purchase.approved ? 'Sí' : 'No'}</p>
                <button onclick="approvePurchase(${index})">Aprobar</button>
            </div>
        `).join('');
    }

    // Función para agregar una compra
    purchaseForm.onsubmit = (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const supplier = document.getElementById('supplier').value;

        const newPurchase = {
            description,
            amount,
            supplier,
            approved: false
        };

        purchases.push(newPurchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        renderPurchases();
    };

    // Función para aprobar una compra
    window.approvePurchase = (index) => {
        purchases[index].approved = true;
        localStorage.setItem('purchases', JSON.stringify(purchases));
        renderPurchases();
    };

    // Función para borrar todas las compras
    clearPurchasesButton.onclick = () => {
        localStorage.removeItem('purchases');
        purchases.length = 0; // Vaciar el arreglo en memoria
        renderPurchases();
    };

    // Renderizar las compras iniciales
    renderPurchases();
});