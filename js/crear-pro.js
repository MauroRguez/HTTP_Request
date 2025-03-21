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

// evento al navegador para comprobar si recargo la pagina
document.addEventListener("DOMContentLoaded", () => {
    // Obtener el usuario logueado desde localStorage
    let userLoguin = JSON.parse(localStorage.getItem("userLoguin"));
    let userNameSpan = document.querySelector("#user-name");

    // Verificar si el elemento existe en el DOM
    if (!userNameSpan) {
        console.error("El elemento con ID 'user-name' no existe en el DOM.");
        return;
    }

    // Mostrar el nombre del usuario
    if (userLoguin && userLoguin.nombre) {
        userNameSpan.textContent = userLoguin.nombre; // Mostrar el nombre del usuario
    } else {
        userNameSpan.textContent = "Usuario desconocido"; // Fallback si no hay usuario
    }

    // Comprobar si hay un producto para actualizar
    productUpdate = JSON.parse(localStorage.getItem("productoEdit"));
    if (productUpdate != null) {
        UpdateDataProduct();
    }
});

// funcion para validar el formulario y obtener los datos
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
    } else {
        alert("Todos los campos son obligatorios");
    }
    return product; // Retorna el producto solo si está completo
};

// funcion para recibir los datos y enviarlos al servidor
let sendDataProduct = async (data) => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "../listado-pro.html";
        }
    } catch (error) {
        console.log(error);
    }
};

// funcion para editar los datos de la tabla
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
    // agregar evento al botón editar
    btnEdit.addEventListener('click', () => {
        product = {
            id: productUpdate.id,
            nombre: nameInput.value,
            precio: priceInput.value,
            stock: stockInput.value,
            descripcion: descriptionInput.value,
            imagen: imagen.src,
        };
        // borrar info del localstorage
        localStorage.removeItem("productoEdit");
        // enviar los datos al servidor (cambiar a sendDataProductUpdate)
        sendDataProductUpdate(product);
    });
};

// funcion para realizar la petición al servidor
let sendDataProductUpdate = async (pro) => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pro)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "../listado-pro.html";
        }
    } catch (error) {
        console.log(error);
    }
};