//variables globales
let tablePro =document.querySelector("#table-pro tbody");
let searchInput=document.querySelector("#search-input");

localStorage.setItem("userLoguin", JSON.stringify({ nombre: "Vendedor", rol: "Administrador" }));

searchInput.addEventListener("keyup", function(){
console.log(searchInput.value);
});
//evento para el navegador

document.addEventListener("DOMContentLoaded",()=>{
getTableData();
});

//funciones para traer los datos de la base de datos a la tabla
let getTableData = async() => {
let url ="http://localhost/backend-apiCrud/productos"
try {
    let respuesta = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        
    });
    if (respuesta.status === 204){
        console.log("No hay productos registrados");
        
    }else{
        let tableData = await respuesta.json();
        console.log(tableData);
        //agregar datos de la tabla localstorage
        localStorage.setItem("datosTabla",JSON.stringify(tableData));
        //agreger los datos a la tabla
        tableData.forEach((dato,i) => {
            let row = document.createElement("tr");
            row.innerHTML = `
            <td>${i+1}</td>
            <td>${dato.nombre}</td>
            <td>${dato.descripcion}</td>
            <td>${dato.precio}</td>
            <td>${dato.stock}</td>
            <td> <img src="${dato.imagen}" width="100px"></td>
            <td>
            <button id="btn-edit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
            </button>-
            <button id="btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </button>
            </td>
            `;
            tablePro.appendChild(row);

        })
    }

    //console.log(userLogin);
} catch (error) {
console.log(error);  
}
};

//funcion para editar los datos de la tabla
let editDataTable=(pos)=>{
    let products =[];
    let productsSave= JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave !== null) {
        products = productsSave;
            }
    let singleProduct = products[pos];
    localStorage.setItem("productoEdit",JSON.stringify(singleProduct));
    localStorage.removeItem("datosTabla");
    location.href = "../crear-pro.html";
    }

let deleteDataTable=(pos)=>{
    let products =[];
    let productsSave= JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave !== null) {
        products = productsSave;
            }
    let singleProduct = products[pos];

   // console.log("Producto a eliminar",singleProduct.nombre);
    let IDProduct={
        id:singleProduct.id
    }
    let confirmar = confirm(`¿Desea eliminar el producto ${singleProduct.nombre}?`);
    if (confirmar) {
        sendDeleteProduct(IDProduct);
    }
    //llamar la funcion para realizar la petecion

}
//funcion para realizar petecion de eliminar
let sendDeleteProduct= async (id)=>{
    let url = "http://localhost/backend-apiCrud/productos";
    
    try {
        let respuesta = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id)
        });
        if (respuesta.status === 406){
            alert("El ID enviado no es admitido");
        
            
        }else{
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.reload();
            
        }

        //console.log(userLogin);
    } catch (error) {
    console.log(error);  
    }

}

