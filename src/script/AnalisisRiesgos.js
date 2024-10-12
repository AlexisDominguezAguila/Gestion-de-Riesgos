function calcularRiesgo() {
    const probabilidad = parseFloat(document.getElementById("probabilidad").value);
    const impacto = parseInt(document.getElementById("impacto").value);
    const resultadoDiv = document.getElementById("resultado");

    if (isNaN(probabilidad) || isNaN(impacto)) {
        resultadoDiv.innerHTML = "<p style='color:red;'>Por favor ingrese valores válidos.</p>";
        return;
    }

    const nivelRiesgo = probabilidad * impacto;
    let clasificacion = "";

    if (nivelRiesgo >= 15) {
        clasificacion = `<span class="muygrave">Muy Grave (${nivelRiesgo.toFixed(2)})</span>`;
    } else if (nivelRiesgo >= 9) {
        clasificacion = `<span class="importante">Importante (${nivelRiesgo.toFixed(2)})</span>`;
    } else if (nivelRiesgo >=3 ) {
        clasificacion = `<span class="apreciable">Apreciable (${nivelRiesgo.toFixed(2)})</span>`;
    } else {
        clasificacion = `<span class="marginal">Marginal (${nivelRiesgo.toFixed(2)})</span>`;
    }

    resultadoDiv.innerHTML = `<p>Nivel de Riesgo: ${clasificacion}</p>`;
}