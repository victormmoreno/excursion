function agregarNuevoElemento() {
    if (!validarInformacion()) {
        printErrores();
    } else {
        let listaElementos = document.getElementById('lista-elementos');
        let row = document.createElement('div');
        row.classList.add('row', 'item');
        let newNombreDiv = prepareNewNombre();
        let newPesoDiv = prepareNewPeso();
        let newConsumoCaloriasDiv = prepareNewConsumoCalorias();
        let newDeleteButton = prepareNewDeleteButton();
        reinicarCampos();
        row.appendChild(newNombreDiv);
        row.appendChild(newPesoDiv);
        row.appendChild(newConsumoCaloriasDiv);
        row.appendChild(newDeleteButton);
        listaElementos.appendChild(row);
    }
}

function printErrores() {
    document.getElementById('addNewItem').disabled = true;
}

function validarInformacionOnChange() {
    if (document.getElementById('newNombreEquipo').value == "" || document.getElementById('newPesoEquipo').value == "" || document.getElementById('newConsumoCalorias').value == "") {
        document.getElementById('addNewItem').disabled = true;
    }
    if ( (document.getElementById('newPesoEquipo').value < 1 && document.getElementById('newPesoEquipo').value > 99) && (document.getElementById('newConsumoCalorias').value < 1 && document.getElementById('newConsumoCalorias').value > 99) ) {
        document.getElementById('addNewItem').disabled = true;
    }
    document.getElementById('addNewItem').disabled = false;
}

function validarInformacion() {
    if (document.getElementById('newNombreEquipo').value == "" || document.getElementById('newPesoEquipo').value == "" || document.getElementById('newConsumoCalorias').value == "") {
        return false;
    }
    if ( (document.getElementById('newPesoEquipo').value < 1 && document.getElementById('newPesoEquipo').value > 99) && (document.getElementById('newConsumoCalorias').value < 1 && document.getElementById('newConsumoCalorias').value > 99) ) {
        return false;
    }
    return true;
}

function eliminarElemento(event) {
    let elemento = event.target.closest('.item');
    if (elemento) {
        document.getElementById('lista-elementos').removeChild(elemento);
    }
}

function reinicarCampos() {
    document.getElementById('newNombreEquipo').value = "";
    document.getElementById('newPesoEquipo').value = "";
    document.getElementById('newConsumoCalorias').value = "";
}

function prepareNewDeleteButton() {
    let deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('btn', 'btn-danger', 'col-md-1', 'mb-3');
    deleteButton.setAttribute('onclick', 'eliminarElemento(event)');
    deleteButton.innerHTML = '<i class="bi bi-trash" style="font-size: 2rem;"></i>';
    return deleteButton;
}

function prepareNewConsumoCalorias() {
    let caloriasDiv = document.createElement('div');
    caloriasDiv.classList.add('form-floating', 'col-md-3', 'mb-3');
    let caloriasInput = document.createElement('input');
    caloriasInput.type = 'number';
    caloriasInput.classList.add('form-control');
    caloriasInput.name = 'consumoCalorias[]';
    caloriasInput.id = 'consumoCalorias';
    caloriasInput.min = 1;
    caloriasInput.max = 99;
    caloriasInput.placeholder = 'Consumo de calorías';
    caloriasInput.value = document.getElementById('newConsumoCalorias').value;
    caloriasDiv.appendChild(caloriasInput);
    let caloriasLabel = document.createElement('label');
    caloriasLabel.htmlFor = 'consumoCalorias';
    caloriasLabel.innerHTML = 'Consumo de calorías';
    caloriasDiv.appendChild(caloriasInput);
    caloriasDiv.appendChild(caloriasLabel);
    return caloriasDiv;
}

function prepareNewPeso() {
    let pesoDiv = document.createElement('div');
    pesoDiv.classList.add('form-floating', 'col-md-3', 'mb-3');
    let pesoInput = document.createElement('input');
    pesoInput.type = 'number';
    pesoInput.classList.add('form-control');
    pesoInput.name = 'pesoEquipo[]';
    pesoInput.id = 'pesoEquipo';
    pesoInput.min = 1;
    pesoInput.max = 99;
    pesoInput.placeholder = 'Peso del equipo (en kg)';
    pesoInput.value = document.getElementById('newPesoEquipo').value;
    pesoDiv.appendChild(pesoInput);
    let pesoLabel = document.createElement('label');
    pesoLabel.htmlFor = 'pesoEquipo';
    pesoLabel.innerHTML = 'Peso del equipo (en kg)';
    pesoDiv.appendChild(pesoInput);
    pesoDiv.appendChild(pesoLabel);
    return pesoDiv;
}

function prepareNewNombre() {
    let nombreDiv = document.createElement('div');
    let nombreInput = document.createElement('input');
    nombreDiv.classList.add('form-floating', 'col-md-5', 'mb-3');
    nombreInput.type = 'text';
    nombreInput.classList.add('form-control');
    nombreInput.name = 'nombreEquipo[]';
    nombreInput.id = 'nombreEquipo'
    nombreInput.placeholder = 'Nombre del elemento';
    nombreInput.value = document.getElementById('newNombreEquipo').value;
    nombreDiv.appendChild(nombreInput);
    let nombreLabel = document.createElement('label');
    nombreLabel.htmlFor = 'nombreEquipo';
    nombreLabel.innerHTML = 'Nombre del elemento';
    nombreDiv.appendChild(nombreInput);
    nombreDiv.appendChild(nombreLabel);
    return nombreDiv;
}

function getItemsMochila() {
   let filas = document.querySelectorAll('#lista-elementos .item');
   let elementos = [];
   filas.forEach(fila => {
        elementos.push({
            nombre: fila.querySelector('input[name="nombreEquipo[]"]').value,
            peso: parseInt(fila.querySelector('input[name="pesoEquipo[]"]').value),
            calorias: parseInt(fila.querySelector('input[name="consumoCalorias[]"]').value)
        });
    });
   return elementos;
}

function calcularEquipoOptimo() {
    let minCalorias = parseInt(document.getElementById('minCalorias').value);
    let maxPeso = parseInt(document.getElementById('maxPeso').value);
    let items = getItemsMochila();
    let selectedItems = ordenarMochila(items, maxPeso, minCalorias);
    mostrarResultados(selectedItems);
}

function ordenarMochila(items, maxPeso, minCalorias) {
    let currentWeight = 0;
    let currentCalories = 0;
    let selectedItems = [];

    items.sort((a, b) => (a.peso / a.calorias) - (b.peso / b.calorias));

    for (let i = 0; i < items.length; i++) {
        if (currentWeight + items[i].peso <= maxPeso && currentCalories < minCalorias) {
            selectedItems.push(items[i]);
            currentWeight += items[i].peso;
            currentCalories += items[i].calorias;
        }
    }

    if (currentCalories < minCalorias) {
        return 'No es posible alcanzar el mínimo de calorías con los elementos disponibles bajo el peso máximo permitido.';
    }

    return selectedItems;
}

function mostrarResultados(selectedItems) {
    let resultDiv = document.getElementById('result');

    if (typeof selectedItems === 'string') {
        resultDiv.innerHTML = selectedItems;
    } else {
        let resultText = '<ul class="list-group">';
        let total_peso = 0;
        let total_calorias = 0;
        selectedItems.forEach(item => {
            resultText += `<li class="list-group-item">${item.nombre}: Peso ${item.peso}, Calorías ${item.calorias}</li>`;
            total_peso += item.peso;
            total_calorias += item.calorias;
        });
        resultText += `<li class="list-group-item">El total de peso es: ${total_peso}, con un total de ${total_calorias} calorias</li>`;
        resultText += '</ul>';
        resultDiv.innerHTML = resultText;
    }
}
