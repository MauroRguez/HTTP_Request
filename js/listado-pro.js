//variables globales
let tablePro = document.querySelector("#table-pro tbody");
let searchInput = document.querySelector("#search-input");

//evento para el navegador
document.addEventListener("DOMContentLoaded", () => {
    // Obtener el usuario logueado desde localStorage
    let userLoguin = JSON.parse(localStorage.getItem("userLoguin"));
    let userNameSpan = document.querySelector("#user-name");

    // Verificar si el elemento existe en el DOM
    if (!userNameSpan) {
        console.error("El elemento con ID 'user-name' no existe en el DOM.");
        return;
    }
    //evento para probar el campo de buscar
    searchInput.addEventListener("keyup", ()=>{
        searchProductTable();
    });

    // Mostrar el nombre del usuario
    if (userLoguin && userLoguin.nombre) {
        userNameSpan.textContent = userLoguin.nombre; // Mostrar el nombre del usuario
    } else {
        userNameSpan.textContent = "Usuario desconocido"; // Fallback si no hay usuario
    }

    // Llamar a la función para cargar los datos de la tabla
    getTableData();
});

// Obtener los datos de la tabla y mostrar los botones según el rol
let getTableData = async () => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (respuesta.status === 204) {
            console.log("No hay productos registrados");
        } else {
            let tableData = await respuesta.json();

            // Guardar los datos en localStorage
            localStorage.setItem("datosTabla", JSON.stringify(tableData));

            // Obtener el usuario logueado desde localStorage
            let userLoguin = JSON.parse(localStorage.getItem("userLoguin"));
            let rol = userLoguin.nombre === "administrador" ? "Administrador" : "Vendedor";

            // Agregar los datos a la tabla
            tableData.forEach((dato, i) => {
                let row = document.createElement("tr");

                // Generar botones según el rol
                let editButton = `
                    <button id="btn-edit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                `;

                let deleteButton = `
                    <button id="btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                `;

                // Mostrar solo los botones permitidos según el rol
                let actionButtons = rol === "Administrador" ? `${editButton} ${deleteButton}` : editButton;

                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${dato.nombre}</td>
                    <td>${dato.descripcion}</td>
                    <td>${dato.precio}</td>
                    <td>${dato.stock}</td>
                    <td><img src="${dato.imagen}" width="100px"></td>
                    <td>${actionButtons}</td>
                `;
                tablePro.appendChild(row);
            });
        }
    } catch (error) {
        console.log(error);
    }

};

//funcion para editar los datos de la tabla
let editDataTable = (pos) => {
    let products = [];
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave !== null) {
        products = productsSave;
    }
    let singleProduct = products[pos];
    localStorage.setItem("productoEdit", JSON.stringify(singleProduct));
    localStorage.removeItem("datosTabla");
    location.href = "../crear-pro.html";
};

let deleteDataTable = (pos) => {
    let products = [];
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave !== null) {
        products = productsSave;
    }
    let singleProduct = products[pos];

    let IDProduct = {
        id: singleProduct.id,
    };
    let confirmar = confirm(`¿Desea eliminar el producto ${singleProduct.nombre}?`);
    if (confirmar) {
        sendDeleteProduct(IDProduct);
    }
};

//funcion para realizar peticion de eliminar
let sendDeleteProduct = async (id) => {
    let url = "http://localhost/backend-apiCrud/productos";

    try {
        let respuesta = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id),
        });
        if (respuesta.status === 406) {
            alert("El ID enviado no es admitido");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
};

let clearDataTable = () => {
    let rowTable= document.querySelectorAll("#table-pro tbody tr");
    rowTable.forEach((row) => {
        row.remove();
    });

};
let searchProductTable = () => {
    let products = [];
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave != null) {
        products = productsSave;
    }
    // Obtener lo escrito en el input y convertirlo a minúsculas
    let textSearch = searchInput.value.toLowerCase();
    //console.log(textSearch);
    clearDataTable();
    let i=0
for (let pro of products) {
    if(pro.nombre.toLowerCase().indexOf(textSearch) !== -1){
        let row = document.createElement("tr");

        row.innerHTML = `
        <td>${i++}</td>
        <td>${pro.nombre}</td>
        <td>${pro.descripcion}</td>
        <td>${pro.precio}</td>
        <td>${pro.stock}</td>
        <td><img src="${pro.imagen}" width="100px"></td>
<td>
            <button id="btn-edit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
            </button>
        
            <button id="btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </button>
        
</td>
`;
    
        tablePro.appendChild(row);
    }
}
    

};

