//variables globales
const d = document;
const userInput = d.querySelector("#usuarioForm");
const passInput = d.querySelector("#contraForm");
const btnLogin = d.querySelector(".btnLogin");

//evento al hacer click en el boton de login
btnLogin.addEventListener("click", function () {
    let dataForm = getData();
    
    sendData(dataForm);
});

//funcion para validar el formulario y obtener datos de formulario
let getData = () => {
    let user;
    if (userInput.value === "" || passInput.value === "") {
        alert("Todos los campos son obligatorios");
        userInput.value = "";
        passInput.value = "";
        return;
    } else {
        user = {
            usuario: userInput.value,
            contrasena: passInput.value, // Cambiado de "contra" a "contrasena"
        };
        console.log("Usuario obtenido:", user);
        return user;
    }
};

//funcion para enviar datos y realizar la petición al servidor
let sendData = async (data) => {
    let url = "http://localhost/backend-apiCrud/login";
    
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 401){
            alert("Usuario o contraseña incorrectos");
            userInput.value = "";
            passInput.value = "";
            
        }else{
            let userLogin = await respuesta.json();
            alert("Bienvenido " + userLogin.nombre);
            //guardar datos en localStorage
            localStorage.setItem("userLoguin",JSON.stringify(userLogin));

            location.href = "../index.html";

        }

        //console.log(userLogin);
    } catch (error) {
    console.log(error);  
    }
};