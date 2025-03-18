// variables globales
let nameInput = document.querySelector("#productos-select");
let priceInput = document.querySelector("#precio-pro");
let stockInput = document.querySelector("#stock-pro");
let descriptionInput = document.querySelector("#des-pro");
let imagen = document.querySelector("#imagen-pro");
let btnCreate = document.querySelector(".btn-create");
let productUpdate;

// evento al boton de crear
btnCreate.addEventListener('click', () => {
    let dataProduct = getDataProduct();
    if (dataProduct) { // Solo envía si el producto no es null
        sendDataProduct(dataProduct);
    }
});
//evento al navegador para comprobar si recargo la pagina
document.addEventListener("DOMContentLoaded", () => {
    productUpdate = JSON.parse(localStorage.getItem("productoEdit"));
    if (productUpdate!=null){
      UpdateDataProduct();  
    }
});

        
//funcion para validar el formulario y obtener los datos
let getDataProduct = () => {
    let product = null; // Inicializamos como null
    if (nameInput.value && priceInput.value && stockInput.value && descriptionInput.value && imagen.src) {
        product = {
            nombre: nameInput.value,
            precio: priceInput.value,
            stock: stockInput.value,
            descripcion: descriptionInput.value,
            imagen: imagen.src,
        };
        // Limpiar los campos después de obtener los datos
        nameInput.value = "";
        priceInput.value = "";
        stockInput.value = "";
        descriptionInput.value = "";
        imagen.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";
        console.log(product);
    } else {
        alert("Todos los campos son obligatorios");
    }
    return product; // Retorna el producto solo si está completo
};

//funcion para recibir los datos y enviarlos al servidor
let sendDataProduct = async (data) => {
    let url = "http://localhost/backend-apiCrud/productos";
    
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406){
            alert("Los datos enviados no son admitidos");
        
            
        }else{
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "../listado-pro.html";
            
        }

        //console.log(userLogin);
    } catch (error) {
    console.log(error);  
    }
};
//funcion para editar los datos de la tabla
let UpdateDataProduct = () => {
    nameInput.value = productUpdate.nombre;
    priceInput.value = productUpdate.precio;
    stockInput.value = productUpdate.stock;
    descriptionInput.value = productUpdate.descripcion;
    imagen.src = productUpdate.imagen;
    let product;
    // Alternar el botón de crear y actualizar
    let btnEdit = document.querySelector(".btn-update");
    btnCreate.classList.toggle("d-none");
    btnEdit.classList.toggle("d-none");
    //agreagr evento al boton editar
    btnEdit.addEventListener('click', () => {
        product = {
            id: productUpdate.id,
            nombre: nameInput.value,
            precio: priceInput.value,
            stock: stockInput.value,
            descripcion: descriptionInput.value,
            imagen: imagen.src,
        };
        //borrar info del localstorage
        localStorage.removeItem("productoEdit");
        //enviar los datos al servidor (cambiar a sendDataProductUpdate)
        sendDataProductUpdate(product);
    })
}
//fx para realizar la peticio  al servidor
let sendDataProductUpdate = async (pro) => {
    let url = "http://localhost/backend-apiCrud/productos";
    
    try {
        let respuesta = await fetch(url, {
            method: "Put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pro)
        });
        if (respuesta.status === 406){
            alert("Los datos enviados no son admitidos");
        
            
        }else{
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "../listado-pro.html";
            
        }

        //console.log(userLogin);
    } catch (error) {
    console.log(error);  
    } 
};