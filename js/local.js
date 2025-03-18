//variables locales
let nameUser=document.querySelector("#nombre-usuario");
let btnLogout=document.querySelector("#btnLogout");

document.addEventListener("DOMContentLoaded",()=>{
    getUser();
    
})
//funcion para poner el nombre

let getUser=()=>{
    let user=JSON.parse (localStorage.getItem("userLoguin"));
    nameUser.textContent=user.nombre;
}

//funcion para cerrar sesion
btnLogout.addEventListener("click",()=>{
    localStorage.removeItem("userLoguin");
    window.location="login.html";
});