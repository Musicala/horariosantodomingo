const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGHkiD2swxAarO43f4T62b5howCSSaaYH-94Bm__0nXT0etnFjnucYLlkFxQkpyhbGePgrMdFv3opE/pub?gid=415791466&single=true&output=csv";

// Definir colores según contenido
const coloresCondicionales = {
    "Danzas": "#F4CCCC",
    "Teatro": "#FCE5CD",
    "Dibujo": "#FFE599",
    "Almuerzo": "#FFFFFF",
    "Tareas": "#D9D9D9"
};

// Obtener el número del día actual (1 = Lunes, ..., 5 = Viernes)
const diaActual = (() => {
    let dia = new Date().getDay();
    return (dia >= 1 && dia <= 5) ? dia : null;
})();

// Función para cargar datos desde el CSV
async function cargarDatos() {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("No se pudo cargar el horario.");
        
        const csvText = await response.text();
        const datos = parseCSV(csvText);
        llenarTabla(datos);
    } catch (error) {
        console.error("Error al cargar datos:", error);
        document.getElementById("tabla-horario").innerHTML = "<tr><td colspan='7'>Error al cargar el horario.</td></tr>";
    }
}

// Convertir el CSV en una matriz
function parseCSV(texto) {
    return texto.trim().split("\n").map(fila => fila.split(","));
}

// Llenar la tabla con datos del CSV
function llenarTabla(datos) {
    const tabla = document.getElementById("tabla-horario");
    tabla.innerHTML = ""; // Limpiar contenido previo

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    
    // Crear encabezado
    const trHead = document.createElement("tr");
    datos[0].forEach((titulo, i) => {
        const th = document.createElement("th");
        th.textContent = titulo.trim();
        if (i === diaActual) th.classList.add("dia-actual"); // Resaltar día actual
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    // Crear cuerpo de la tabla
    let referencias = Array(datos[0].length).fill(null);
    
    datos.slice(1).forEach((fila) => {
        const tr = document.createElement("tr");
        
        fila.forEach((celda, j) => {
            let contenido = celda.trim();
            
            // Si la celda anterior es igual, aumentamos rowspan
            if (referencias[j] && referencias[j].textContent === contenido) {
                referencias[j].rowSpan++;
            } else {
                const td = document.createElement("td");
                td.textContent = contenido;
                tr.appendChild(td);
                referencias[j] = td; // Guardamos referencia
                
                // Aplicar colores condicionales
                for (const key in coloresCondicionales) {
                    if (contenido.includes(key)) {
                        td.style.backgroundColor = coloresCondicionales[key];
                        break;
                    }
                }

                // Resaltar la columna del día actual
                if (j === diaActual) {
                    td.classList.add("dia-actual");
                }
            }
        });

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
}

// Iniciar la carga de datos al cargar la página
window.addEventListener("DOMContentLoaded", cargarDatos);
