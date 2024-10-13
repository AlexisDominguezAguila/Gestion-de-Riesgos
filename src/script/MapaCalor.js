const ctx = document.getElementById('riskBubbleChart').getContext('2d');
        
// Arreglo para almacenar los riesgos
const risks = [];

// Crear el gráfico inicial
const riskBubbleChart = new Chart(ctx, {
    type: 'bubble',
    data: {
        datasets: [{
            label: 'Riesgos',
            data: [], // Inicialmente vacío
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 0,
            borderColor: 'black',
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                max: 6,
                title: {
                    display: true,
                    text: 'Impacto'
                }
            },
            y: {
                beginAtZero: true,
                max: 6,
                title: {
                    display: true,
                    text: 'Aparicion'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return `Aparicion: ${value.y}, Impacto: ${value.x}, Cantidad: ${value.count}`;
                    }
                }
            }
        },
        onClick: function(event) {
            const activePoints = riskBubbleChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            if (activePoints.length > 0) {
                const index = activePoints[0].index;
                const selectedData = riskBubbleChart.data.datasets[0].data[index];
                const namesList = selectedData.names.split('\n').map(name => `<li>${name}</li>`).join('');
                
                document.querySelector('.informacion').innerHTML = `<ul>${namesList}</ul>`;
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        }
    }
});

document.querySelector('button').addEventListener('click', function () {
    // Obtener los valores del formulario
    const riesgo = document.getElementById('riesgo').value;
    const aparicion = parseInt(document.getElementById('aparicion').value);
    const impacto = parseInt(document.getElementById('impacto').value);
    
    // Calcular el estado (producto de aparición por impacto)
    const estado = aparicion * impacto;

    // Verificar si el riesgo está vacío
    if (!riesgo) {
        alert("Por favor ingrese el riesgo.");
        return;
    }

    // Crear una nueva fila con los datos
    const newRow = `
        <tr>
            <td>${riesgo}</td>
            <td>${aparicion}</td>
            <td>${impacto}</td>
            <td>${estado}</td>
        </tr>
    `;
    
    // Agregar la nueva fila a la tabla
    document.querySelector('table tbody').innerHTML += newRow;

    // Agregar el nuevo riesgo al arreglo
    risks.push({ riesgo, aparicion, impacto, estado });

    // Limpiar los campos del formulario
    document.getElementById('riesgo').value = '';
    document.getElementById('aparicion').value = '1';
    document.getElementById('impacto').value = '1';

    // Actualizar el gráfico
    updateChart();
});

function updateChart() {
    // Agrupar los puntos por sus coordenadas (x, y) y ajustar el radio
    const groupedData = {};
    risks.forEach((risk) => {
        const key = `${risk.impacto},${risk.aparicion}`;  
        if (!groupedData[key]) {
            groupedData[key] = { x: risk.impacto, y: risk.aparicion, r: 5, count: 1, names: risk.riesgo }; 
        } else {
            groupedData[key].r += 5; 
            groupedData[key].count += 1; 
            groupedData[key].names += `\n${risk.riesgo}`; 
        }
    });

    // Convertir los datos agrupados en un arreglo para el gráfico
    const processedData = Object.values(groupedData);

    // Actualizar los datos del gráfico
    riskBubbleChart.data.datasets[0].data = processedData;
    riskBubbleChart.update();
}