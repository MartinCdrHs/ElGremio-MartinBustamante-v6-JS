// Obteniendo objetos HTML

const tienda = document.getElementById ("tienda") //div donde estan los juegos

const botonBolsa = document.getElementById ("boton") //boton de bolsa

const bolsa = document.getElementById ("bolsa") //div de bolsa

const bolsaItems = document.getElementById ("bolsa-items") //div que esta dentro de la bolsa, donde van los items

const totalReserva = document.getElementById ("total-reserva") //span donde esta el total de la reserva

const botonReserva = document.getElementById ("boton-reserva") // boton de confirmacin de reserva

let reservaTotal = 0

// let carrito = []

let juegos = []


// Fetch a mi base de datos dentro del proyecto

const traerJuegos = async () => {
    try{
        const resp = await fetch("../juegos.json")
        const data = await resp.json()
        juegos = data
        mostrarJuegos()
        

    }catch (error){
        console.log(error);
    }
}
traerJuegos()



// console.log(juegos);

// Codigo para traer elementos del array al HTML

const mostrarJuegos = () => {
    
    juegos.forEach((juego) => {
        const cadaJuego = document.createElement ("div")
        cadaJuego.innerHTML = `
            <figure class="figure tarjeta-juego" id="${juego.id}">
                <img src="${juego.imagen}" class="figure-img img-fluid rounded" id="${juego.id}">
                <figcaption class="figure-caption" id="${juego.id}">${juego.nombre}</figcaption>
                <span class="precio-juego" id="${juego.id}">Precio de reserva: $${juego.precio}</span>
            </figure>
        `;
        cadaJuego.className ="col-sm-12 col-md-6 col-lg-4"
        tienda.append(cadaJuego)
        
    });
}

mostrarJuegos()




// Codigo para traer items a la bolsa

const escucharTienda = () => {
    tienda.addEventListener ("click", (e)=>{
        verificarStock(e.target.id)
    })
}

escucharTienda()



const verificarStock = (itemId)=> {
    
    const item = juegos.find(elemento => elemento.id == itemId)
    
    if(item.stock >= 1){
        agregarCarrito (item)
        
    }else{
        Swal.fire({
            text: 'Temo que ya no nos quedan más de esos, Aventurero',
            color: '#ffffff',
            confirmButtonText: 'De acuerdo',
            background: '#393939',
            confirmButtonColor: '#cc0d0d',
          })
    }
}

const agregarCarrito = (item) => {
    const repetidoCarrito = carrito.find(elemento => elemento.id === item.id)

    
    if (repetidoCarrito){
        Swal.fire({
            text: 'Alto ahi Aventurero! Parece que en tu bolsa ya tienes uno de estos. Deja algo para los demás!',
            color: '#ffffff',
            confirmButtonText: 'De acuerdo',
            background: '#393939',
            confirmButtonColor: '#cc0d0d',
          })
    }else{
        carrito.push (item)

        bolsaItems.innerHTML = ""

        dibujarEnBolsa()

        mostrarTotal()

        Toastify({
            text: "Objeto agregado a tu bolsa!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #cc0d0d, #c2c2c2)",
            }
        }).showToast();

        item.stock --
    }
}

// Codigo para mostrar carrito en bolsa

const dibujarEnBolsa = () => {
    carrito.forEach((item) => {
        
        const cadaItem = document.createElement ("div")

        cadaItem.innerHTML = `
            <div class="item-img">
                <img src="${item.imagen}" alt="${item.nombre}" >
            </div>
            <div class="item-span">
                <span>${item.nombre} || $${item.precio}.-</span>
            </div>
            <div class="item-borrar">
                <button type="button" value="${item.id}" class="boton-borrar" >X</button>
            </div>
        `;
        cadaItem.className ="item"

        bolsaItems.append(cadaItem)
 
    });
    guardarBolsa(carrito)
};

// Codigo para mostrar y ocultar bolsa 

botonBolsa.addEventListener ("click", () =>{

    bolsa.classList.toggle ("bolsa-abierta")

    bolsaItems.innerHTML = ""

    if (carrito.length >= 1){
        dibujarEnBolsa ()
    }else{
        const cadaItem = document.createElement ("div")
        cadaItem.innerHTML = `
             <div class="no-item">
                <span>No tienes items en la bolsa, Aventurero!</span>
            </div>
        `;
        cadaItem.className ="item"
        bolsaItems.append(cadaItem)
    }
    mostrarTotal()
})


const mostrarTotal = () => {
    reservaTotal = carrito.reduce ((acc, elemento) => acc + elemento.precio ,0)
    totalReserva.innerHTML = ""
    totalReserva.innerText= `Total de reserva: $${reservaTotal}.-`

    return reservaTotal
}

// Codigo borrar items de la bolsa 

const corregirStock = (itemId) => {
    const item = juegos.find(elemento => elemento.id == itemId)
    item.stock ++
}

bolsaItems.addEventListener ("click", (e)=>{
    corregirStock(e.target.value)
    borrarItem(e.target.value)

})

const borrarItem = (itemId)=> {
    const itemIndex = carrito.findIndex(elemento => elemento.id == itemId)
    carrito.splice (itemIndex, 1);

    bolsaItems.innerHTML =""
    
    dibujarEnBolsa()

    mostrarTotal()

    guardarBolsa(carrito)  
}

// Codigo para cerrar la reserva

botonReserva.addEventListener ("click", ()=>{

    bolsa.classList.toggle ("bolsa-abierta")

    if(reservaTotal > 0){
        Swal.fire({
            text: '¿Estás seguro de que quieres reservar estos items, Aventurero?',
            color: '#ffffff',
            background: '#393939',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si estoy seguro',
            cancelButtonText: 'Cancelar'
        }).then((result) => {

            if (result.isConfirmed) {
                Swal.fire({
                    text: 'Tu reserva ha sido confirmada' ,
                    color: '#ffffff',
                    background: '#393939',
                    confirmButtonColor: '#cc0d0d',
                    confirmButtonText: 'De acuerdo',
                })

                carrito = [];

                bolsaItems.innerHTML = ""

                dibujarEnBolsa(carrito)

                mostrarTotal()

            }
        })
    }else{
        Swal.fire({
            text: 'No has agregado items a tu bolsa aún',
            color: '#ffffff',
            background: '#393939',
            confirmButtonColor: '#cc0d0d',
            confirmButtonText: 'De acuerdo',
        })
    } 
})

const guardarBolsa = (carrito) =>{
    localStorage.setItem ("carrito", JSON.stringify(carrito))
}


const obtenerBolsa = () => {
    bolsaStorage = JSON.parse (localStorage.getItem("carrito"))
    return bolsaStorage;
}

document.addEventListener ("DOMContentLoaded", () => {
    if (localStorage.getItem("carrito")){
        carrito = obtenerBolsa ()
        
    }
})
