const url = "https://fakestoreapi.com/products/";
const contenedor = document.getElementById('contenedor');
const menu = document.getElementById('dropdown-menu');
const numerCar = document.getElementById('numerCar');
const bntcar = document.getElementById('btncar');
const Modal = new bootstrap.Modal('#modal', {});
const car = []; 
const catego = [];
const ProductStock = [];

const LoadWeb = () =>{
	produc();
	CargarCategorias();
	ClearNum();
	cargarFooter();
}

function produc (){
	fetch(url)
	  .then(respuesta => respuesta.json())
	  .then(productos => {
		CargarProductos(productos);
	})
	.catch(function(error) {
		console.log('Hubo un problema con la petición de los productos: ' + error.message);
	}); 
}

function CargarProductos (productos){
	ProductStock.push(productos);
	contenedor.innerHTML ="";
	productos.forEach(prod => {
	const {id, title, price, category, image} = prod;
		contenedor.innerHTML += `<div class="mx-auto card" style="width: 18rem;">
		<img src="${image}" class="card-img-top mx-auto pt-4" style="width: 65%;" alt="">
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
					catego.push(categorias)
					menu.innerHTML += `<li><a class="dropdown-item" id =cat${i} href="#">${categ[0].toUpperCase()}${categ.substring(1)}</a></li>`
					i++;
				})
			})
			.catch(function(error) {
				console.log('Hubo un problema con la petición de las categorias: ' + error.message);
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
	const {id, title, price, image, description,cantidad = 1} = productos;
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
	<p class="card-subtitle mb-2 text-muted">Cantidad: ${cantidad}</p>
	<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnclose">Cerrar</button>
	<button onclick=AddCar(${id}) class="btn btn-primary sticky-bottom"><span class="material-symbols-outlined">add_shopping_cart</span></button>
	`
	Modal.show();
}

bntcar.onclick = () => {
	MostrarCar(car);
}


const MostrarCar = (car) =>{
	const modalTitle = document.getElementById('modal-title');
	const modalBody = document.getElementById('modal-body');
	const modalFooter = document.getElementById('modal-footer');
	modalBody.innerHTML = "";
	let PrecioTotal = 0;
	car.forEach(cars => {
	const {id, title, price, image} = cars;
		PrecioTotal = PrecioTotal+price;

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
  </div>`
	modalFooter.innerHTML = `<div class"row"><span><p class="d-block p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3">Precio total: $${PrecioTotal}</p></span></div><div class"row"><button type="button" class="btn btn-danger" id="vaciarCarrito">
	Vaciar carrito
  </button>
  <button type="button" id="procesarCompra" class="btn btn-primary">
	Continuar compra
  </button>
  <button
	type="button"
	class="btn btn-secondary"
	data-bs-dismiss="modal">Cerrar
  </button></div>`

	});

	if (car.length === 0) {
		modalBody.innerHTML = `
		<p class="text-center text-primary parrafo">¡Aun no agregaste nada!</p>
		`;
	}
	  Modal.show();
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
	viewcateg(categ);
	fetch(`${url}/category/${categ.toString()}`)
        .then(res=>res.json())
        .then(ProdCat =>{
			CargarProductos(ProdCat);
		})
}

const viewcateg = (a) =>{
	let b = a.toString();
	let btncategelim = document.getElementById('btncategelim');
	btncategelim.innerText = b;
	btncategelim.remove.class = 'noneview';
	btncategelim.add.class = 'view';
}


const cargarFooter = () =>{
	let rowfooter = document.getElementById('rowfooter');
	rowfooter.innerHTML += `
			<div class="col-sx-12 col-md-6 col-lg-3 text-white">
				<div>
					<a href="#"><img src="Resource/Logo.png" alt="Logo De Moda" width="150px" /></a>
				</div>
				<div>
					<p class='h6 mt-3 mb-1 text-center'>De Moda, tu lugar siempre de moda</p>
				</div>
			</div>
			<div class='col-sx-12 col-md-6 col-lg-3 aling-center'>
            	<div id="contCateg"><p class='h4 text-center text-white'>Categorias</p></div>
            	<div class='text-center h6 mt-3'><a class='text-dark text-decoration-none' href='/'>Electronics</a></div>
              	<div class='text-center h6 mt-3'><a class='text-dark text-decoration-none' href='/'>Jewelery</a></div>
              	<div class='text-center h6 mt-3'><a class='text-dark text-decoration-none' href='/'>Men's clothing</a></div>
              	<div class='text-center h6 mt-3'><a class='text-dark text-decoration-none' href='/'>Women's clothing</a></div>
          	</div>
          	<div class='col-sx-12 col-md-6 col-lg-3'>
          	<div><p class='h4 text-center text-white'>Nosotros</p></div>
              	<div class='text-center h5'>Te esperamos en</div>
              	<div class='text-center mb-3'><span class='material-symbols-outlined me-2'>home_pin</span>Av. Calle publica n° 911 Local 4</div>
              	<div class='text-center h5'>Horario</div>
              	<div class='text-center'>Lunes a Viernes de</div>
              	<div class='text-center mb-3'>9:30 a 17:00 hrs</div>
			</div>

          	<div class='col-sx-12 col-md-6 col-lg-3'>
              	<div><p class='h4 text-center text-white'>Contactanos</p></div>
              	<div class='text-center h6'><a class='text-decoration-none text-dark' href="/"><img class='me-2 mt-2 imgredes' src='./Resource/img/WhatsApp.png' alt="WhatsApp"> WhatsApp</a></div>
              	<div class='text-center h6'><a class='text-decoration-none text-dark' href="/"><img class='me-2 mt-2 imgredes' src='./Resource/img/Instagram.png' alt="Instagram">Instagram</a></div>
              	<div class='text-center h6'><a class='text-decoration-none text-dark' href="/"><img class='me-2 mt-2 imgredes' src='./Resource/img/Facebook.png' alt="WhatsApp">Facebook</a></div>
              	<div class='text-center h6'><a class='text-decoration-none text-dark' href="/"><img class='me-2 mt-2 imgredes' src='./Resource/img/Youtube.png' alt="WhatsApp">YouTube</a></div>
          	</div>`;		
}


