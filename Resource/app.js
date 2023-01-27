const url = "https://fakestoreapi.com/products/";
const contenedor = document.getElementById('contenedor');
const menu = document.getElementById('dropdown-menu');
const numerCar = document.getElementById('numerCar');
const bntcar = document.getElementById('btncar');
const Modal = new bootstrap.Modal('#modal', {});
const car = []; 



function produc (){
	fetch(url)
	  .then(respuesta => respuesta.json())
	  .then(productos => {
		CargarProductos(productos);
	})
	.catch(function(error) {
		console.log('Hubo un problema con la petición:' + error.message);
	}); 
}

function CargarProductos (productos){
	contenedor.innerHTML ="";
	productos.forEach(prod => {
	const {id, title, price, category, image} = prod;
		contenedor.innerHTML += `<div class="mx-auto card" style="width: 18rem;">
		<img src="${image}" class="card-img-top mx-auto" style="width: 65%;" alt="">
		<div class="card-body">
		  <h5 class="card-title">${title}</h5>
		  <p class="card-text"><br></p>
		  <h4 class="card-subtitle mb-2 text-primary text-center">Precio: $${price}</h4>
		  <p class="card-subtitle mb-2 text-muted">${category}</p>
		  <button onclick=VerProducto(${id}) class="btn btn-primary">Ver producto</button>
		  <button onclick=AddCar(${id}) class="btn btn-primary"><span class="material-symbols-outlined">
		  add_shopping_cart</span></button>
		</div>
	  </div>`
	});
}

const CargarCategorias = () =>{
	fetch(`${url}/categories`)
            .then(res=>res.json())
            .then(categorias=>{(categorias)
				i = 0;
				categorias.forEach(categ =>{
					menu.innerHTML += `<li><a class="dropdown-item" id =cat${i} href="#">${categ[0].toUpperCase()}${categ.substring(1)}</a></li>`
					i++;
				})
			})
			.catch(function(error) {
				console.log('Hubo un problema con la petición:' + error.message);
			});
}

menu.addEventListener('click', (e) =>{
	let categ =(e.target.lastChild.data);
	categ = `${categ[0].toLowerCase()}${categ.substring(1)}`;
	filterCat(categ);
})

const VerProducto = (id) => {
	fetch(`${url}/${id}`)
	  .then(respuesta => respuesta.json())
	  .then(productos => {
		verDetalle(productos);
	})
	.catch(function(error) {
		console.log('Hubo un problema con la petición:' + error.message);
	}); 
}

const verDetalle = (productos) =>{
	const {id, title, price, image, description} = productos;
	const modalTitle = document.getElementById('modal-title');
	const modalBody = document.getElementById('modal-body');
	const modalFooter = document.getElementById('modal-footer');

	modalTitle.textContent = title;
	modalBody.innerHTML = `
	<img class="img-fluid mx-auto" src="${image}">
	<p class="text-center">${description}</p>
	<p class="text-center text-primary fs-3">Precio: $${price}</p>
	`;
	modalFooter.innerHTML = `
	<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnclose">Cerrar</button>
	<button onclick=AddCar(${id}) class="btn btn-primary sticky-bottom"><span class="material-symbols-outlined">add_shopping_cart</span></button>
	`
	Modal.show();
}

bntcar.onclick = () => {
	MostrarCar(car)
}

const MostrarCar = (car) =>{
	const modalTitle = document.getElementById('modal-title');
	const modalBody = document.getElementById('modal-body');
	const modalFooter = document.getElementById('modal-footer');
	car.forEach(cars => {
	const {id, title, price, image} = cars;
	console.log(cars);
	modalTitle.textContent = 'Su carrito esta listo';
	modalBody.innerHTML += `<div class="modal-contenedor">
	<div>
	<img class="img-fluid img-carrito" src="${image}"/>
	</div>
	<div>
	<p>Producto: ${title}</p>
  <p>Precio: $${price}</p>
  <p>Cantidad :</p>
  <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
	</div>
  </div>
	`
	modalFooter.innerHTML = `<button type="button" class="btn btn-danger" id="vaciarCarrito">
	Vaciar carrito
  </button>
  <button type="button" id="procesarCompra" class="btn btn-primary">
	Continuar compra
  </button>
  <button
	type="button"
	class="btn btn-secondary"
	data-bs-dismiss="modal">Cerrar
  </button>
  <span>Precio total:</span>
  <p class="text-center"></p>`
	});

	if (car.length === 0) {
		console.log("Nada");
		modalBody.innerHTML = `
		<p class="text-center text-primary parrafo">¡Aun no agregaste nada!</p>
		`;
	  } else {
		console.log("Algo");
	  }	
	//   if (precioTotal) {
	// 	precioTotal.innerText = carrito.reduce(
	// 	  (acc, prod) => acc + prod.cantidad * prod.precio,
	// 	  0
	// 	);
	//   }
	  Modal.show();
	  //guardarStorage();
};

const AddCar = (id) => {
	fetch(`${url}${id}`)
	.then(respuesta => respuesta.json())
	.then(productos => {
		car.push(productos);
  })
  .catch(function(error) {
	  console.log('Hubo un problema con la petición:' + error.message);
  });

	(car.length >= 0) ? NumeroCar(car.length) :  ClearNum();
}

const ClearNum = () => {
	numerCar.textContent ='';
}

const NumeroCar = (i) =>{
	numerCar.textContent = i+1;
	Toastify({
		text: "Agregado al carrito",
		className: ".AlertClass",
		gravity: "bottom",
		duration: 1500,
		style: {
			background: "#abe4c9",
			color: "black"
		}
	  }).showToast();
}

const filterCat = (categ) => {
	fetch(`${url}/category/${categ.toString()}`)
        .then(res=>res.json())
        .then(ProdCat =>{
			CargarProductos(ProdCat);
		})
}