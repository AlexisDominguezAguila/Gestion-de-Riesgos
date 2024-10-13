//ventana modal 
function abrir(){
    document.getElementById("vent").className = "ventanaAbierta";
}

function cerrar(){

    document.getElementById("vent").className = "ventana";
}
  // grafico de calor 

const ctx = document.getElementById('riskBubbleChart').getContext('2d');
        
const risks = [
   /*  
    { riesgo: 'Retraso en la entrega de suministros', aparicion: 4, impacto: 5, estado: 20 },
    { riesgo: 'Falta de recursos humanos', aparicion: 3, impacto: 4, estado: 12 },
    { riesgo: 'Cambio en regulaciones gubernamentales', aparicion: 2, impacto: 5, estado: 10 },
    { riesgo: 'Problemas tecnológicos (fallos en el sistema)', aparicion: 5, impacto: 3, estado: 15 },
    { riesgo: 'Accidentes laborales', aparicion: 1, impacto: 4, estado: 4 },
    { riesgo: 'Reputación dañada por malas críticas', aparicion: 3, impacto: 2, estado: 6 },
    { riesgo: 'Incremento en costos de producción', aparicion: 4, impacto: 4, estado: 16 },
    { riesgo: 'Desastres naturales (inundaciones, terremotos)', aparicion: 2, impacto: 5, estado: 10 },
    { riesgo: 'Fugas de información y ciberataques', aparicion: 5, impacto: 5, estado: 25 },
    { riesgo: 'Desacuerdos con proveedores', aparicion: 3, impacto: 3, estado: 9 },
    { riesgo: 'Dependencia de un solo cliente', aparicion: 4, impacto: 4, estado: 16 },
    { riesgo: 'Fluctuaciones del mercado', aparicion: 5, impacto: 3, estado: 15 },
    { riesgo: 'Inestabilidad política en la región', aparicion: 2, impacto: 5, estado: 10 },
    { riesgo: 'Cambio en tendencias del consumidor', aparicion: 3, impacto: 4, estado: 12 },
    { riesgo: 'Dificultades en la logística de distribución', aparicion: 3, impacto: 3, estado: 9 },
    { riesgo: 'Incremento en competencia', aparicion: 4, impacto: 4, estado: 16 },
    { riesgo: 'Problemas de calidad en el producto', aparicion: 5, impacto: 5, estado: 25 },
    { riesgo: 'Inadecuada gestión de proyectos', aparicion: 4, impacto: 4, estado: 16 },
    { riesgo: 'Inadecuada gestión de actividades', aparicion: 4, impacto: 4, estado: 16 },
    { riesgo: 'Inadecuada gestión de servicios', aparicion: 4, impacto: 4, estado: 16 },
    { riesgo: 'Costos imprevistos en la ejecución del proyecto', aparicion: 3, impacto: 4, estado: 12 },
    { riesgo: 'Cambio en el equipo directivo', aparicion: 2, impacto: 3, estado: 6 },
    { riesgo: 'Dificultades en la comunicación interna', aparicion: 3, impacto: 3, estado: 9 },
    { riesgo: 'Problemas de imagen corporativa', aparicion: 2, impacto: 4, estado: 8 }*/
];




const riskBubbleChart = new Chart(ctx, {
    type: 'bubble',
    data: {
        datasets: [{
            label: 'Riesgos',
            data: [], 
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
                    text: 'Impacto',
                    color: 'black'
                },
                ticks: {
                    color: 'black' 
                }
            },
            
            y: {
                beginAtZero: true,
                max: 6,
                title: {
                    display: true,
                    text: 'Aparicion',
                    color: 'black'
                },
                ticks: {
                    color: 'black' 
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
                },
                titleColor: 'white', 
                bodyColor: 'white'
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


function updateChart() {
    // Agrupar los puntos por sus coordenadas 
    const groupedData = {};
    risks.forEach((risk) => {
        const key = `${risk.impacto},${risk.aparicion}`;  
        if (!groupedData[key]) {
            groupedData[key] = { 
                x: risk.impacto, 
                y: risk.aparicion, 
                r: 5, 
                count: 1, 
                names: risk.riesgo 
            }; 
        } else {
            groupedData[key].r += 5; 
            groupedData[key].count += 1; 
            groupedData[key].names += `\n${risk.riesgo}`; 
        }
    });

    // Convertir los datos agrupados en un arreglo 
    const processedData = Object.values(groupedData).map((data) => {

        let color;
        if (data.count < 3) {
            color = 'green';  
        } else if (data.count < 6) {
            color = 'yellow'; 
        } else if (data.count < 8) {
            color = 'orange'; 
        } else {
            color = 'red';    
        }

        return {
            ...data, 
            backgroundColor: color 
        };
    });

    // Actualizar los datos del gráfico de burbujas
    riskBubbleChart.data.datasets[0].data = processedData;
    riskBubbleChart.data.datasets[0].backgroundColor = processedData.map(data => data.backgroundColor);
    riskBubbleChart.update();

    // Actualizar el gráfico circular
    const totalRiesgos = risks.length;
    const totalGrupos = Object.keys(groupedData).length;

    riskPieChart.data.datasets[0].data = [totalRiesgos, totalGrupos];
    riskPieChart.update();
}
document.querySelector('button').addEventListener('click', function () {
    // Obtener los valores del formulario
    const riesgo = document.getElementById('riesgo').value;
    const aparicion = parseInt(document.getElementById('aparicion').value);
    const impacto = parseInt(document.getElementById('impacto').value);

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
    cerrar();
});