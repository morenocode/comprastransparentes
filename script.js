class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, new Date().toLocaleString(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let compraBlockchain = new Blockchain();
let cotizaciones = [];
const UIT = 41200; // Valor de 1 UIT en Perú para 2024

document.addEventListener('DOMContentLoaded', () => {
    const necesidadForm = document.getElementById('necesidadForm');
    const cotizacionesList = document.getElementById('cotizacionesList');
    const comprasList = document.getElementById('comprasList');
    const messageDiv = document.getElementById('message');
    const searchInput = document.getElementById('search');

    necesidadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const department = document.getElementById('department').value;
        const item = document.getElementById('item').value;
        const quantity = document.getElementById('quantity').value;

        if (department === "" || item === "" || quantity === "" || isNaN(quantity) || quantity <= 0) {
            alert('Por favor, ingrese datos válidos.');
            return;
        }

        const cotizacion = {
            department,
            item,
            quantity,
            cotizaciones: []
        };
        cotizaciones.push(cotizacion);

        addCotizacionToUI(cotizacion);
        necesidadForm.reset();
        displayMessage('Necesidad registrada. Haz clic en "Agregar Cotización" para añadir cotizaciones.');
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterBlocks(searchTerm);
    });

    function displayMessage(message) {
        messageDiv.textContent = message;
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);
    }

    function addCotizacionToUI(cotizacion) {
        const li = document.createElement('li');
        li.classList.add('necesidad-item');
        li.innerHTML = `Departamento: ${cotizacion.department}, Ítem: ${cotizacion.item}, Cantidad: ${cotizacion.quantity}`;

        const addCotizacionButton = document.createElement('button');
        addCotizacionButton.textContent = 'Agregar Cotización';
        addCotizacionButton.addEventListener('click', () => {
            const cotizacionDetail = prompt('Ingrese cotización (nombre del proveedor, monto):');
            if (cotizacionDetail) {
                const [provider, amount] = cotizacionDetail.split(',');
                const amountFloat = parseFloat(amount).toFixed(2);
                if (provider && amount && !isNaN(amount) && amountFloat <= UIT) {
                    const newCotizacion = { provider, amount: amountFloat };
                    cotizacion.cotizaciones.push(newCotizacion);
                    alert(`Cotización añadida: Proveedor: ${provider}, Monto: S/${amountFloat}`);
                    addCotizacionItemToUI(cotizacionesContainer, newCotizacion, cotizacion, li);
                } else {
                    alert(`Datos de cotización no válidos. El monto no debe exceder S/${UIT}`);
                }
            }
        });

        const cotizacionesContainer = document.createElement('div');
        cotizacionesContainer.classList.add('cotizaciones-container');

        li.appendChild(addCotizacionButton);
        li.appendChild(cotizacionesContainer);

        cotizacionesList.appendChild(li);
    }

    function addCotizacionItemToUI(container, cotizacion, necesidad, necesidadElement) {
        const cotizacionItem = document.createElement('div');
        cotizacionItem.classList.add('cotizacion-item');
        cotizacionItem.textContent = `Proveedor: ${cotizacion.provider}, Monto: S/${cotizacion.amount}`;

        const approveButton = document.createElement('button');
        approveButton.textContent = 'Aprobar';
        approveButton.addEventListener('click', () => {
            const newBlock = new Block(
                compraBlockchain.chain.length,
                new Date().toLocaleString(), {
                    department: necesidad.department,
                    item: necesidad.item,
                    quantity: necesidad.quantity,
                    provider: cotizacion.provider,
                    amount: cotizacion.amount
                }
            );
            compraBlockchain.addBlock(newBlock);
            addBlockToUI(newBlock);
            alert(`Cotización aprobada: Proveedor: ${cotizacion.provider}, Monto: S/${cotizacion.amount}`);
            // Eliminar la necesidad de la lista después de aprobar una cotización
            cotizaciones = cotizaciones.filter(c => c !== necesidad);
            cotizacionesList.removeChild(necesidadElement);
        });

        cotizacionItem.appendChild(approveButton);
        container.appendChild(cotizacionItem);
    }

    function filterBlocks(searchTerm) {
        const blocks = comprasList.getElementsByTagName('li');
        Array.from(blocks).forEach(block => {
            const text = block.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                block.style.display = '';
            } else {
                block.style.display = 'none';
            }
        });
    }

    function addBlockToUI(block) {
        const li = document.createElement('li');
        li.textContent = `Ítem: ${block.data.item}, Monto: S/${block.data.amount}, Hash: ${block.hash}`;
        li.addEventListener('click', () => {
            alert(`Detalles del Bloque:\n\nDepartamento: ${block.data.department}\nÍtem: ${block.data.item}\nCantidad: ${block.data.quantity}\nProveedor: ${block.data.provider}\nMonto: S/${block.data.amount}\nFecha: ${block.timestamp}\nHash: ${block.hash}\nHash Anterior: ${block.previousHash}`);
        });
        comprasList.appendChild(li);
    }
});