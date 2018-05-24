function search1(param,filtro){		
	var param = param;	
	localStorage.setItem("parametro",param);
	localStorage.setItem("filtro",filtro);
	if(param.length <1){
		alert("Porfavor ingresa el contenido que desea buscar");
	}else{
		
	}
		access_token = obtenerToken();		
		
		var filtro  = filtro;
		if (filtro == false){
			alert("debe seleccionar alguna categoria");
		}else{
			$.ajax({
				method: "GET",
				url: urlSearch+param+"&type="+filtro+"&limit="+10,
				headers:{
					"Authorization": "Bearer "+access_token
				},
				success: function(result) {	
					var rta = result;
					var div = document.getElementById("section");
					div.innerHTML='';	
					
					if(rta.artists){
						var divArtistas = document.createElement("div");
						var title = document.createElement("h1");
						title.innerHTML = "Artistas";
						divArtistas.setAttribute('id','singers');
						divArtistas.appendChild(title);
						div.appendChild(divArtistas);
						var items = rta.artists.items;					
						for(var i=0;i<items.length;i++){	
							var divArtista = document.createElement("div");
							divArtista.setAttribute('class','bloque col-12');
							divArtistas.appendChild(divArtista);
							divArtista.innerHTML = "<p>"+items[i].name+"</p>";								
							divArtista.id = items[i].id;
							divArtista.onclick = obtenerArtista;
							if(items[i].images.length > 0){
								var imagen = document.createElement("img"); 									
								imagen.setAttribute("src",items[i].images[0].url);
								imagen.setAttribute('class','imgBloque');								
								divArtista.appendChild(imagen); 
							}else{
								var imagen = document.createElement("img"); 
								imagen.setAttribute('class','imgBloque');
								imagen.setAttribute("src",anon);
								divArtista.appendChild(imagen); 
							}
							
									
						}
					}
					
					if(rta.tracks){
						var divCanciones = document.createElement("div");
						var title = document.createElement("h1");
						title.innerHTML = "Canciones";
						divCanciones.setAttribute('id','songs');
						divCanciones.appendChild(title);
						div.appendChild(divCanciones);						
						var items = rta.tracks.items;
						for(var i=0;i<items.length;i++){	
							var divCancion = document.createElement("div");
							divCancion.setAttribute('class','bloque col-12');
							divCanciones.appendChild(divCancion);
							divCancion.innerHTML = "<p>"+items[i].name+"</p><br/>";
							var texto = document.createElement("p");
							texto.innerHTML = items[i].album.name;
							divCancion.appendChild(texto); 	
							divCancion.setAttribute("id",items[i].id);
							divCancion.onclick = obtenerTrack;
							if(items[i].album.images.length>0){
								var imagen = document.createElement("img"); 
								imagen.setAttribute("src",items[i].album.images[0].url); 
								imagen.setAttribute('class','imgBloque');
								divCancion.appendChild(imagen); 
								
							}
						}
					}
					
					if(rta.albums){
						var divAlbums = document.createElement("div");
						var title = document.createElement("h1");
						title.innerHTML = "Discos";
						divAlbums.setAttribute('id','albums');
						divAlbums.appendChild(title);
						div.appendChild(divAlbums);
						var items = rta.albums.items;
						for(var i=0;i<items.length;i++){							
							var divAlbum = document.createElement("div");
							divAlbum.setAttribute('class','bloque col-12');
							divAlbums.appendChild(divAlbum);
							divAlbum.innerHTML = "<p>"+items[i].name+"</p>";
							var texto = document.createElement("p");
							texto.innerHTML = "<p>"+items[i].artists[0].name+"</p>";
							divAlbum.appendChild(texto); 	
							divAlbum.setAttribute("id",items[i].id);
							divAlbum.onclick = function(){console.log("asd")};
							
							if(items[i].images.length>0 ){
								var imagen = document.createElement("img"); 
								imagen.setAttribute("src",items[i].images[0].url); 
								imagen.setAttribute('class','imgBloque');
								divAlbum.appendChild(imagen); 
									
								}
						}
					}
					
					if(rta.playlists){
						var divPlaylists = document.createElement("div");
						var title = document.createElement("h1");
						title.innerHTML = "Listas de reproduccion";
						divPlaylists.setAttribute('id','playlists');
						divPlaylists.appendChild(title);
						div.appendChild(divPlaylists);
						var items = rta.playlists.items;
						for(var i=0;i<items.length;i++){					
							var divPlaylist = document.createElement("div");
							divPlaylist.setAttribute('class','bloque col-12');
							divPlaylists.appendChild(divPlaylist);
							divPlaylist.innerHTML = items[i].name;
							var imagen = document.createElement("img"); 
							imagen.setAttribute('class','imgBloque');
							imagen.setAttribute("src",anon);
							divPlaylist.appendChild(imagen);

							
						}
					}
				},
			});
		}
		
			
	}
	
	function obtenerArtista(){
	access_token = obtenerToken();	
	var id = this.id;
	$.ajax({
			method: "GET",
			url: urlSearchArist+this.id,
			headers:{
				"Authorization": "Bearer "+access_token
			},
			success: function(result) {	
				var body = $("body");
				body.html("<nav><div id=navbar class=col-12>Trabajo integrador</div></nav> ");
				$("#navbar").html("<button id=back>< </button>");
				$("#back").click(function(){
					inicializar();
					var parametro = localStorage.getItem("parametro");
					$("#search").val(parametro);
					var filtro = localStorage.getItem("filtro");
					search(parametro,filtro);
					localStorage.removeItem("parametro");
					localStorage.removeItem("filtro");
				}
				
				);
				body.append("<h1>"+result.name+"</h1>");
				body.append("<div id=fotoperfil></div>");
				if(result.images.length != 0){
					$("#fotoperfil").append("<img id=perfil src="+result.images[0].url+">");
				}else{
					$("#fotoperfil").append("<img id=perfil src="+anon+">");
				}
				
				body.append("<h2 id=followers>Seguidores:"+result.followers.total+"</h2>");
				}
	});
	
	
}

function obtenerTrack(){
	access_token = obtenerToken();	
	var id = this.id;
	$.ajax({
			method: "GET",
			url: urlSearchTrack+this.id,
			headers:{
				"Authorization": "Bearer "+access_token
			},
			success: function(result) {	
				var body = $("body");
				body.html("<nav><div id=navbar class=col-12>Trabajo integrador</div></nav> ");
				$("#navbar").html("<button id=back>< </button>");
				$("#back").click(function(){
					inicializar();
					var parametro = localStorage.getItem("parametro");
					$("#search").val(parametro);
					var filtro = localStorage.getItem("filtro");
					search(parametro,filtro);
					localStorage.removeItem("parametro");
					localStorage.removeItem("filtro");
				}
				
				);			
				body.append("<div id=fotoperfil></div>");
				$("#fotoperfil").append("<img id=perfil src="+result.album.images[0].url+">");
				$("#fotoperfil").append("<h1>"+result.name+"</h1>");
				$("#fotoperfil").append("<p>"+result.artists[0].name+"</p>");
				$("#fotoperfil").append("<p>"+result.album.name+"</p>");
				}
	});
}
