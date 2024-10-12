function abrir(){
    document.getElementById("vent").className = "ventanaAbierta";
}

function cerrar(){

    document.getElementById("vent").className = "ventana";
}
  
function nuevoRiesgo() {
    // Obtener los valores del formulario
    let amenaza = document.getElementById("amenaza").value;
    let aparicion = document.getElementById("aparicion").value;
    let impacto = document.getElementById("impacto").value;
    let descripcion = document.getElementById("descripcion").value;
    let acciones = document.getElementById("acciones").value;

    // Verificar que los campos no estén vacíos
    if(amenaza === "" || descripcion === "" || acciones === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear una nueva fila en la tabla
    let tabla = document.getElementById("tablaAmenazas").getElementsByTagName("tbody")[0];
    let nuevaFila = tabla.insertRow();

    // Agregar las celdas con los valores
    let celdaAmenaza = nuevaFila.insertCell(0);
    let celdaAparicion = nuevaFila.insertCell(1);
    let celdaImpacto = nuevaFila.insertCell(2);
    let celdaDescripcion = nuevaFila.insertCell(3);
    let celdaAcciones = nuevaFila.insertCell(4);
    let celdaEstado = nuevaFila.insertCell(5);

    // llenar la tabla
    celdaAmenaza.innerHTML = amenaza;
    celdaAparicion.innerHTML = aparicion;
    celdaImpacto.innerHTML = impacto;
    celdaDescripcion.innerHTML = descripcion;
    celdaAcciones.innerHTML = acciones;
    celdaEstado.innerHTML = aparicion*impacto;

    // Limpiar el formulario 
    document.getElementById("amenaza").value = "";
    document.getElementById("aparicion").value = "Muy bajo";
    document.getElementById("impacto").value = "Muy bajo";
    document.getElementById("descripcion").value = "";
    document.getElementById("acciones").value = "";

// cerrar la ventana

    cerrar();
}



function generarPareto() {
    // Obtener la tabla de amenazas
    let tabla = document.getElementById("tablaAmenazas").getElementsByTagName("tbody")[0];
    let filas = tabla.getElementsByTagName("tr");

    let labels = [];
    let data = [];

    // recorrer la tabla 
    for (let i = 0; i < filas.length; i++) {
        let celdas = filas[i].getElementsByTagName("td");
        labels.push(celdas[0].innerText); 
        data.push(parseInt(celdas[5].innerText)); 
    }

    // Ordenar los datos de mayor a menor
    let sortedIndices = data.map((value, index) => [value, index])
                            .sort((a, b) => b[0] - a[0])
                            .map(item => item[1]);
    let sortedLabels = sortedIndices.map(index => labels[index]);
    let sortedData = sortedIndices.map(index => data[index]);

    // Calcular el porcentaje acumulado 
    let total = sortedData.reduce((a, b) => a + b, 0);
    let cumulativeData = [];
    let cumulativeSum = 0;

    for (let i = 0; i < sortedData.length; i++) {
        cumulativeSum += sortedData[i];
        cumulativeData.push((cumulativeSum / total) * 100);
    }

    // Crear gráfico de Pareto
    const ctx = document.getElementById('paretoChart').getContext('2d');
    const paretoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels, 
            datasets: [{
                label: 'Estado',
                data: sortedData,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y-axis-1'
            }, {
                label: 'Porcentaje Acumulado',
                data: cumulativeData,
                type: 'line',
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y-axis-2'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                        max: Math.max(...sortedData) + 10 
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Estado'
                    }
                }, {
                    id: 'y-axis-2',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Porcentaje Acumulado (%)'
                    }
                }]
            },
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: true
            }
        }
    });
}
