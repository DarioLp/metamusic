var urlToken = "https://accounts.spotify.com/api/token";
var authorization = "YmY1YzQwN2YwYTA3NDFmZThiN2MyNGFlNjFiNzU3ZmU6YzcxMjZkZmIxZDI0NGQ5M2JhMDJmNDM2Y2VhNzViNTQ=";
var urlSearch = "https://api.spotify.com/v1/search?q=";
var urlSearchArist = "https://api.spotify.com/v1/artists/";
var urlSearchTrack = "https://api.spotify.com/v1/tracks/";
var urlSearchAlbum = "https://api.spotify.com/v1/albums/";

var urlSearchPlaylist = "https://api.spotify.com/v1/users/";

var anon = "https://image.freepik.com/iconos-gratis/la-imagen-del-usuario-con-el-fondo-negro_318-34564.jpg";
window.onload = function () {
    if (!localStorage.getItem("token")) {
        solicitarToken();
    }
    inicio();
    var footer = $(".iconos").children();
    footer.click(function () {
        var index = $(this).index();
        switch (index) {
            case 0:
                inicio();
                break;
            case 1:
                search();
                break;
            case 2:
                ubicacion()
                break;
        }
    });
}

function inicio() {
    var html = `<h1>Meta-Music</h1>
                <h3>La informacion detras de tu musica</h3>
                <h3>Autor: Dario Lopez<h3>`;
    $("section").html(html);
}

function search() {
    var html = `<div id=formulario>
					<input type=text id=search class=text>
					<select class=text id=select>
						<option value=artist>Artista</option>
						<option value=track>Cancion</option>
						<option value=album>Album</option>
						<option value=playlist>Playlist</option>
					</select>
					<button id=ok>Buscar</button>
					<button id=cancel>Cancelar</button>
				</div><br/>
				<div id=resultado></div>
				<div id=historial><h1>Ultimas busquedas</h1></div>`;
    $("section").html(html);
	var localStoragehistorial = JSON.parse(localStorage.getItem("historial"));
    if(localStoragehistorial == null){

    }else{
        for(var i=localStoragehistorial.length-1;i>=0;i--){
            var historia = `<div id=${localStoragehistorial[i].id} class=bloque>
                                <img src=${localStoragehistorial[i].img} class=imgCancion>
                                <div class=container-bloque>
                                    <h4><b>${localStoragehistorial[i].name}</b></h4>
                                    <p>${localStoragehistorial[i].artist}</p>
                                    <p>${localStoragehistorial[i].album}</p>
                                </div>
                            </div>`;
            $("#historial").append(historia);
        }
    }
    
    $("#cancel").click(function () {
        $("#search").val("");
        $("#select").val("artist");
    });
    $("#ok").click(busqueda);
	$(".bloque").click(redirectTrack);
}

function busqueda() {
    var filtro = $("#select").val();
    var query = $("#search").val();
	$("#historial").remove();
    if (query.length < 1) {
        alert("Porfavor ingresa el contenido que desea buscar");
    } else {
        access_token = obtenerToken();
        switch (filtro) {
            case 'artist':
                $.ajax({
                    method: "GET",
                    url: urlSearch + query + "&type=" + filtro + "&limit=" + 4,
                    async: false,
                    headers: {
                        "Authorization": "Bearer " + access_token
                    },
                    success: function (result) {         
                        var next = result.artists.next;
                        var previous = result.artists.previous;              
                        var items = result.artists.items;
                        $("#resultado").html(`<div id=artistas>
                        <div class=paginado>
                              <span id=artprev class="glyphicon glyphicon-chevron-left"></span>
                              <span id=pagtit>Artista</span>
                              <span id=artnext class="glyphicon glyphicon-chevron-right"></span>
                          </div>
                        </div>`);
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].images.length > 0) {
                                var html = `<div id=${items[i].id} class=card>
												<img src=${items[i].images[0].url} class=imgPerfil alt=PerfilDeArtista>
												<div class=container>
													<h4><b>${items[i].name}</b></h4>
												</div>
											</div>`;                               
                            } else {
                                var html = `<div id=${items[i].id} class=card>
												<img src=${anon} class=imgPerfil alt=PerfilDeArtista>
												<div class=container>
													<h4><b>${items[i].name}</b></h4>
												</div>
											</div>`;
                            }
                            $("#artistas").append(html);                         
                        }
                        $("#artnext").click(function(){
                            nextPage(next);
                        });
                        $("#artprev").click(function(){
                            prevPage(previous);
                        });
                    }
                })
                $.ajax({
                    method: "GET",
                    url: urlSearch + query + "&type=track&limit=" + 10,
                    async: false,
                    headers: {
                        "Authorization": "Bearer " + access_token
                    },
                    success: function (result) {                      
                        var items = result.tracks.items;
                        $("#resultado").append(`<div id=tracks><h1>Canciones</h1></div>`);
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].album.images.length > 0) {
                                var html = `<div id=${items[i].id} class=bloque>
											<img src=${items[i].album.images[0].url} class=imgCancion>
												<div class=container-bloque>
													<h4><b>${items[i].name}</b></h4>
													<p>${items[i].artists[0].name}</p>
													<p>${items[i].album.name}</p>
												</div>
											</div>`;                               
                            } else {
                                var html = `<div id=${items[i].id} class=bloque>
											<img src=${anon} class=imgCancion>
												<div class=container-bloque>
													<h4><b>${items[i].name}</b></h4>
													<p>${items[i].artists[0].name}</p>
													<p>${items[i].album.name}</p>
												</div>
											</div>`;
                            }
							$("#tracks").append(html);
                        }

                    }
                })
                $(".card").click(redirectArtist);
                $(".bloque").click(redirectTrack);
                break;
            default:
                $.ajax({
                    method: "GET",
                    url: urlSearch + query + "&type=" + filtro + "&limit=" + 10,
                    async: false,
                    headers: {
                        "Authorization": "Bearer " + access_token
                    },
                    success: function (result) {
                        var next = result.next;
                        var previous = result.previous; 
                        filtrado(result);
                    }

                })
                break;

        }
    }

}

function filtrado(result) {
    var div = $("#resultado");
    if (result.tracks) {
        var next = result.tracks.next;
        var previous = result.tracks.previous; 
        var items = result.tracks.items;
        div.html(`<div id=tracks><div class=paginado>
                    <span id=trkprev class="glyphicon glyphicon-chevron-left"></span>
                    <span id=pagtit >Canciones</span>
                    <span id=trknext class="glyphicon glyphicon-chevron-right"></span>
                </ul></div>`);
        for (var i = 0; i < items.length; i++) {
            if (items[i].album.images.length > 0) {
                var html = `<div id=${items[i].id} class=bloque>
								<img src=${items[i].album.images[0].url} class=imgCancion>
								<div class=container-bloque>
										<h4><b>${items[i].name}</b></h4>
										<p>${items[i].artists[0].name}</p>
										<p>${items[i].album.name}</p>
								</div>
							</div>`;
            } else {
                var html = `<div id=${items[i].id} class=bloque>
								<img src=${anon} class=imgCancion>
								<div class=container-bloque>
									<h4><b>${items[i].name}</b></h4>
										<p>${items[i].artists[0].name}</p>
										<p>${items[i].album.name}</p>
								</div>
							</div>`;
            }
			$("#tracks").append(html);
        }
        $(".bloque").click(redirectTrack);
        $("#trknext").click(function(){
            nextPage(next);
        });
        $("#trkprev").click(function(){
            prevPage(previous);
        });
    }
    if (result.albums) {
        var next = result.albums.next;
        var previous = result.albums.previous;
        var items = result.albums.items;
        div.html(`<div id=albums>
                <span id=albprev class="glyphicon glyphicon-chevron-left"></span>
                <span id=pagtit>Discos</span>
                <span id=albnext class="glyphicon glyphicon-chevron-right"></span>
                </div>`);
        for (var i = 0; i < items.length; i++) {
            if (items[i].images.length > 0) {
                var html = `<div id=${items[i].id} class=card>
								<img src=${items[i].images[0].url} class=imgAlbum>
								<div class=container>
										<h4><b>${items[i].name}</b></h4>
										<p>${items[i].artists[0].name}</p>
								</div>
							</div>`;
            } else {
                var html = `<div id=${items[i].id} class=card>
								<img src=${anon} class=imgAlbum>
								<div class=container>
										<h4><b>${items[i].name}</b></h4>
										<p>${items[i].artists[0].name}</p>
								</div>
							</div>`;
            }
			$("#albums").append(html);
        }
        $(".card").click(redirectAlbum);
        $("#albnext").click(function(){
            nextPage(next);
        });
        $("#albprev").click(function(){
            prevPage(previous);
        });
    }
    if (result.playlists) {
        var next = result.playlists.next;
        var previous = result.playlists.previous;
        var items = result.playlists.items;
        div.html(`<div id=playlists>
                    <span id=playprev class="glyphicon glyphicon-chevron-left"></span>
                    <span id=pagtit >Playlist</span>
                    <span id=playnext class="glyphicon glyphicon-chevron-right"></span>
                </div>`);
        for (var i = 0; i < items.length; i++) {
            if (items[i].images.length > 0) {
                var html = `<div id=${items[i].id} ownerId=${items[i].owner.id} class=bloque>
								<img src=${items[i].images[0].url} class=imgCancion>
								<div class=container-bloque>
										<h4><b>${items[i].name}</b></h4>
										<p>Owner:${items[i].owner.name}</p>
								</div>
							</div>`;
            } else {
                var html = `<div id=${items[i].id} class=bloque>
								<img src=${anon} class=imgCancion>
								<div class=container-bloque>
									<h4><b>${items[i].name}</b></h4>
									<p>Owner:${items[i].owner.name}</p>
								</div>
							</div>`;
            }
			$("#playlists").append(html);
        }
        $(".bloque").click(redirectPlaylist);
        $("#playnext").click(function(){
            nextPage(next);
        });
        $("#playprev").click(function(){
            prevPage(previous);
        });
    }
}

function nextPage(next){
    $.ajax({
      method: "GET",
      url: next,
      async: false,
      headers: {
          "Authorization": "Bearer " + access_token
      },
      success: function (result) { 
          if($("#artistas").length != 0){
              var items = result.artists.items;
              var artistas = $("#artistas");              
              var html = `<div class=paginado>
                                <span id=artprev class="glyphicon glyphicon-chevron-left"></span>
                                <span id=pagtit>Artista</span>
                                <span id=artnext class="glyphicon glyphicon-chevron-right"></span>
                            </div> `;
              artistas.html(html);
              for (var i = 0; i < items.length; i++) {
                  if (items[i].images.length > 0) {
                       var html = `<div id=${items[i].id} class=card>
                                      <img src=${items[i].images[0].url} class=imgPerfil alt=PerfilDeArtista>
                                      <div class=container>
                                          <h4><b>${items[i].name}</b></h4>
                                      </div>
                                  </div>`;                               
                  } else {
                      var html = `<div id=${items[i].id} class=card>
                                      <img src=${anon} class=imgPerfil alt=PerfilDeArtista>
                                      <div class=container>
                                          <h4><b>${items[i].name}</b></h4>
                                      </div>
                                  </div>`;
                  }
                  artistas.append(html);                         
              }
              var next = result.artists.next;
              var previous = result.artists.previous; 
              $("#artnext").click(function(){
                  nextPage(next);
              });
              $("#artprev").click(function(){
                  prevPage(previous);
              });


          }else{
              if($("#tracks").length != 0){
                var next = result.tracks.next;
                var previous = result.tracks.previous; 
                var items = result.tracks.items;
                $("#tracks").html(`<div class=paginado>
                                    <span id=trkprev class="glyphicon glyphicon-chevron-left"></span>
                                    <span id=pagtit>Canciones</span>
                                    <span id=trknext class="glyphicon glyphicon-chevron-right"></span>
                                </div>`);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].album.images.length > 0) {
                        var html = `<div id=${items[i].id} class=bloque>
                                        <img src=${items[i].album.images[0].url} class=imgCancion>
                                        <div class=container-bloque>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                                <p>${items[i].album.name}</p>
                                        </div>
                                    </div>`;
                    } else {
                        var html = `<div id=${items[i].id} class=bloque>
                                        <img src=${anon} class=imgCancion>
                                        <div class=container-bloque>
                                            <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                                <p>${items[i].album.name}</p>
                                        </div>
                                    </div>`;
                    }
                    $("#tracks").append(html);
                }
                $(".bloque").click(redirectTrack);
                $("#trknext").click(function(){
                    nextPage(next);
                });
                $("#trkprev").click(function(){
                    prevPage(previous);
                });
              }
              if($("#albums").length != 0){
                var next = result.albums.next;
                var previous = result.albums.previous;
                var items = result.albums.items;
                $("#albums").html(`<div id=albums><div class=paginado>
                                <span id=albprev class="glyphicon glyphicon-chevron-left"></span>
                                <span id=pagtit>Discos</span>
                                <span id=albnext class="glyphicon glyphicon-chevron-right"></span>
                            </div></div>`);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].images.length > 0) {
                        var html = `<div id=${items[i].id} class=card>
                                        <img src=${items[i].images[0].url} class=imgAlbum>
                                        <div class=container>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                        </div>
                                    </div>`;
                    } else {
                        var html = `<div id=${items[i].id} class=card>
                                        <img src=${anon} class=imgAlbum>
                                        <div class=container>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                        </div>
                                    </div>`;
                    }
                    $("#albums").append(html);
                }
                $(".card").click(redirectAlbum);
                $("#albnext").click(function(){
                    nextPage(next);
                });
                $("#albprev").click(function(){
                    prevPage(previous);
                });
              }
              if($("#playlists").length != 0){
                var next = result.playlists.next;
                var previous = result.playlists.previous;
                var items = result.playlists.items;
                $("#playlists").html(`<div id=playlists><div class=paginado>
                                        <span id=playprev class="glyphicon glyphicon-chevron-left"></span>
                                        <span id=pagtit>Artista</span>
                                        <span id=playnext class="glyphicon glyphicon-chevron-right"></span>
                                    </div></div>`);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].images.length > 0) {
                        var html = `<div id=${items[i].id} ownerId=${items[i].owner.id} class=bloque>
                                        <img src=${items[i].images[0].url} class=imgCancion>
                                        <div class=container-bloque>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>Owner:${items[i].owner.name}</p>
                                        </div>
                                    </div>`;
                    } else {
                        var html = `<div id=${items[i].id} class=bloque>
                                        <img src=${anon} class=imgCancion>
                                        <div class=container-bloque>
                                            <h4><b>${items[i].name}</b></h4>
                                            <p>Owner:${items[i].owner.name}</p>
                                        </div>
                                    </div>`;
                    }
                    $("#playlists").append(html);
                }
                $(".bloque").click(redirectPlaylist);
                $("#playnext").click(function(){
                    nextPage(next);
                });
                $("#playprev").click(function(){
                    prevPage(previous);
                });
              }
          }
          
      } 
  }) 

}

function prevPage(previous){
  $.ajax({
      method: "GET",
      url: previous,
      async: false,
      headers: {
          "Authorization": "Bearer " + access_token
      },
      success: function (result) { 
          if($("#artistas").length != 0){
              var items = result.artists.items;
              var artistas = $("#artistas");              
              var html = `<div class=paginado>
                            <span id=artprev class="glyphicon glyphicon-chevron-left"></span>
                            <span id=pagtit>Artista</span>
                            <span id=artnext class="glyphicon glyphicon-chevron-right"></span>
                        </div>`;
              artistas.html(html);
              for (var i = 0; i < items.length; i++) {
                  if (items[i].images.length > 0) {
                       var html = `<div id=${items[i].id} class=card>
                                      <img src=${items[i].images[0].url} class=imgPerfil alt=PerfilDeArtista>
                                      <div class=container>
                                          <h4><b>${items[i].name}</b></h4>
                                      </div>
                                  </div>`;                               
                  } else {
                      var html = `<div id=${items[i].id} class=card>
                                      <img src=${anon} class=imgPerfil alt=PerfilDeArtista>
                                      <div class=container>
                                          <h4><b>${items[i].name}</b></h4>
                                      </div>
                                  </div>`;
                  }
                  artistas.append(html);                         
              }
              var next = result.artists.next;
              var previous = result.artists.previous; 
              $("#artnext").click(function(){
                  nextPage(next);
              });
              $("#artprev").click(function(){
                  prevPage(previous);
              });
          
          }else{
              if($("#tracks").length != 0){
                var next = result.tracks.next;
                var previous = result.tracks.previous; 
                var items = result.tracks.items;
                $("#tracks").html(`<div class=paginado>
                                    <span id=trkprev class="glyphicon glyphicon-chevron-left"></span>
                                    <span id=pagtit>Canciones</span>
                                    <span id=trknext class="glyphicon glyphicon-chevron-right"></span>
                                </div>`);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].album.images.length > 0) {
                        var html = `<div id=${items[i].id} class=bloque>
                                        <img src=${items[i].album.images[0].url} class=imgCancion>
                                        <div class=container-bloque>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                                <p>${items[i].album.name}</p>
                                        </div>
                                    </div>`;
                    } else {
                        var html = `<div id=${items[i].id} class=bloque>
                                        <img src=${anon} class=imgCancion>
                                        <div class=container-bloque>
                                            <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                                <p>${items[i].album.name}</p>
                                        </div>
                                    </div>`;
                    }
                    $("#tracks").append(html);
                }
                $(".bloque").click(redirectTrack);
                $("#trknext").click(function(){
                    nextPage(next);
                });
                $("#trkprev").click(function(){
                    prevPage(previous);
                });
              
              }
              if($("#albums").length != 0){
                var next = result.albums.next;
                var previous = result.albums.previous;
                var items = result.albums.items;
                $("#albums").html(`<div id=albums><div class=paginado>
                                    <span id=albprev class="glyphicon glyphicon-chevron-left"></span>
                                    <span id=pagtit>Discos</span>
                                    <span id=albnext class="glyphicon glyphicon-chevron-right"></span>
                                </div></div>`);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].images.length > 0) {
                        var html = `<div id=${items[i].id} class=card>
                                        <img src=${items[i].images[0].url} class=imgAlbum>
                                        <div class=container>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                        </div>
                                    </div>`;
                    } else {
                        var html = `<div id=${items[i].id} class=card>
                                        <img src=${anon} class=imgAlbum>
                                        <div class=container>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>${items[i].artists[0].name}</p>
                                        </div>
                                    </div>`;
                    }
                    $("#albums").append(html);
                }
                $(".card").click(redirectAlbum);
                $("#albnext").click(function(){
                    nextPage(next);
                });
                $("#albprev").click(function(){
                    prevPage(previous);
                });
              
              }
              if($("#playlists").length != 0){
                var next = result.playlists.next;
                var previous = result.playlists.previous;
                var items = result.playlists.items;
                $("#playlists").html(`<div id=playlists><div class=paginado>
                                        <span id=playprev class="glyphicon glyphicon-chevron-left"></span>
                                        <span id=pagtit>Playlists</span>
                                        <span id=playnext class="glyphicon glyphicon-chevron-right"></span>
                                    </div></div>`);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].images.length > 0) {
                        var html = `<div id=${items[i].id} ownerId=${items[i].owner.id} class=bloque>
                                        <img src=${items[i].images[0].url} class=imgCancion>
                                        <div class=container-bloque>
                                                <h4><b>${items[i].name}</b></h4>
                                                <p>Owner:${items[i].owner.name}</p>
                                        </div>
                                    </div>`;
                    } else {
                        var html = `<div id=${items[i].id} class=bloque>
                                        <img src=${anon} class=imgCancion>
                                        <div class=container-bloque>
                                            <h4><b>${items[i].name}</b></h4>
                                            <p>Owner:${items[i].owner.name}</p>
                                        </div>
                                    </div>`;
                    }
                    $("#playlists").append(html);
                }
                $(".bloque").click(redirectPlaylist);
                $("#playnext").click(function(){
                    nextPage(next);
                });
                $("#playprev").click(function(){
                    prevPage(previous);
                });
              
              }
          }
      }
  });
}

function email(result) {

    var artistas = [];
    for(var i=0; i< result.artists.length;i++){
        artistas.push(result.artists[i].name);
    }
    var html = `<label>Destinatario</label>				
				<input id=email type=email class=text>
				<label>Nombre y apellido</label>
                <input id= nya type=text class=text>
                <textarea id=tarea name="comentarios" rows="10">Escribe aquí tus comentarios</textarea>
				<button id=send>Enviar</button>
                `;
    var coment = 
`Sabias que la cancion ${result.name} es el track numero ${result.track_number} del disco ${result.album.name}?
Esta cancion fue compuesta por el/los artista/s: ${artistas} y tiene una duracion de ${seconds(result.duration_ms)}
Te dejo un link para que la escuches¡Esta increible!
${result.external_urls.spotify}`;                    
    $("section").html(html);
    $("#tarea").val(coment);   
    $("#send").click(function () {
        var email = $("#email").val(); 
        var nya = $("#nya").val();  
        var  tarea = $("#tarea").val(); 
       if( /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)){
            if(nya.length > 0 && /^[A-Za-zÑñáéíóúÁÉÍÓÚ\_\-\.\s\xF1\xD1]+$/.test(nya)){
                
                if(tarea.length>150){
                     document.location.href = "mailto:"+email+"?subject="+nya+"%20te%20envio%20una%20recomendacion"+"&body="+tarea;
                }else{
                    console.log("Comentario invalido");
                }
               
            }else{
                console.log("Nombre invalido");
            }
       }else{
           console.log('Email invalido');
       }

        
    });
}

function ubicacion() {
    if (navigator.geolocation) {
        $("section").html(`<h1>Calle 49 835, La Plata, Buenos Aires, Argentina</h1>
					  <div id=map></div>`);
        navigator.geolocation.getCurrentPosition(success, showError);
    } else {
        $("section").html(`<h1>Geolocalizacion no soportado por el navegador</h1>`);
    }

    function success(position) {
        var map;
        var coord = {lat: -34.91871, lng: -57.955346};
        map = new google.maps.Map(document.getElementById('map'), {
            center: coord,
            zoom: 14
        });
        var marker = new google.maps.Marker({
            position: coord,
            map: map
        });

    }
    function showError(error) {
        console.log(error + "asd");
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $("section").html("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                $("section").html("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                $("section").html("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                $("section").html("An unknown error occurred.");
                break;
        }
    }
}

function redirectArtist() {
    access_token = obtenerToken();
    var html = ``;
    $.ajax({
        method: "GET",
        url: urlSearchArist + this.id,
        headers: {
            "Authorization": "Bearer " + access_token
        },
        success: function (result) {
            if (result.images.length > 0) {
                var html = `<div id=artista class=fullCard>
								<img src=${result.images[0].url} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Seguidores:${result.followers.total}</p>
									</div>
								</div>`;

            } else {
                var html = `<div id=artista class=fullCard>
								<img src=${anon} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Seguidores:${result.followers.total}</p>
									</div>
								</div>`;
            }
            $("section").html(html);
        }
    });
}

function redirectTrack() {
    access_token = obtenerToken();
    $.ajax({
        method: "GET",
        url: urlSearchTrack + this.id,
        headers: {
            "Authorization": "Bearer " + access_token
        },
        success: function (result) {
            var segundos = seconds(result.duration_ms);
            if (result.album.images.length > 0) {
                var html = `<div id=track class=fullCard>
								<img src=${result.album.images[0].url} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Artista:${result.artists[0].name}</p>
										<p>Album:${result.album.name}</p>
                                        <p>Duracion:${segundos}</p>
                                        <botton id=share>Compartir<boton>
									</div>
								</div>`;
                var historia1 = {
                    "id": result.id,
                    "img": result.album.images[0].url,
                    "name": result.name,
                    "artist": result.artists[0].name,
                    "album": result.album.name
                };
            } else {
                var html = `<div id=track class=fullCard>
								<img src=${anon} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Artista:${result.artists[0].name}</p>
										<p>Album:${result.album.name}</p>
                                        <p>Duracion:${segundos}</p>
                                        <botton id=share>Compartir<boton>
									</div>
								</div>`;
                var historia1 = {
                    "id": result.id,
                    "img": anon,
                    "name": result.name,
                    "artist": result.artists[0].name,
                    "album": result.album.name
                };
            }
            $("section").html(html);
            $("#share").click(function(){
                email(result);
            });
            if (!localStorage.getItem("historial")) {
                var historial = [historia1];
                localStorage.setItem("historial", JSON.stringify(historial));
            } else {
                var historial = JSON.parse(localStorage.getItem("historial"));
                for (var i = 0; i < historial.length; i++) {
                    if (historial[i].id == historia1.id) {
                        historial.splice(i, 1);
                    }
                }
                historial.push(historia1);
                if (historial.length > 5) {
                    historial.shift();
                }
                localStorage.setItem("historial", JSON.stringify(historial));
            }

        }
    });

}

function redirectAlbum() {
    access_token = obtenerToken();
    $.ajax({
        method: "GET",
        url: urlSearchAlbum + this.id,
        headers: {
            "Authorization": "Bearer " + access_token
        },
        success: function (result) {
            if (result.images.length > 0) {
                var html = `<div id=album class=fullCard>
								<img src=${result.images[0].url} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Artista:${result.artists[0].name}</p>
										<p>Lanzamiento:${result.release_date}</p>
									</div>
								</div>`;
            } else {
                var html = `<div id=album class=fullCard>
								<img src=${anon} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Artista:${result.artists[0].name}</p>
										<p>Tipo:${result.album_type}</p>
										<p>Lanzamiento:${result.release_date}</p>
									</div>
								</div>`;
            }
            $("section").html(html);
            for (var i = 0; i < result.tracks.items.length; i++) {
                var duracion = seconds(result.tracks.items[i].duration_ms);
                var html = `<div id=${result.tracks.items[i].id} class=bloque>
										<div class=container-bloque>
												<h4><b>${result.tracks.items[i].name}</b></h4>
												<p>Duracion:${duracion}</p>
										</div>
									</div>`;
                $("section").append(html);
            }
        }
    });

}

function redirectPlaylist() {
    access_token = obtenerToken();
    ownerId = $(this).attr("ownerid");
    $.ajax({
        method: "GET",
        url: urlSearchPlaylist + ownerId + "/playlists/" + this.id,
        headers: {
            "Authorization": "Bearer " + access_token
        },
        success: function (result) {
            if (result.images.length > 0) {
                var html = `<div id=playlist class=fullCard>
								<img src=${result.images[0].url} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Seguidores:${result.followers.total}</p>
									</div>
								</div>`;
            } else {
                var html = `<div id=playlist class=fullCard>
								<img src=${anon} class=imgFull>
									<div class=container>
										<h4><b>${result.name}</b></h4>
										<p>Seguidores:${result.followers.total}</p>
									</div>
								</div>`;
            }
            $("section").html(html);
            for (var i = 0; i < result.tracks.items.length; i++) {
                var duracion = seconds(result.tracks.items[i].track.duration_ms);
                var html = `<div id=${result.tracks.items[i].track.id} class=bloque>
										<h4><b>${result.tracks.items[i].track.name}</b></h4>
										<p>Album:${result.tracks.items[i].track.album.name}</p>
										<p>Duracion:${duracion}</p>
									</div>`;
                $("section").append(html);
            }
        }
    });

}

function seconds(s) {

    function addZ(n) {
        return (n < 10 ? '0' : '') + n;
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;

    return addZ(mins) + ':' + addZ(secs);
}
;

function obtenerToken() {
    var token = JSON.parse(localStorage.getItem("token"));
    var date = new Date().getTime();
    if (token.time < date) {
        solicitarToken();
    }
    return JSON.parse(localStorage.getItem("token")).token;
}

function solicitarToken() {
    var authorization = "YmY1YzQwN2YwYTA3NDFmZThiN2MyNGFlNjFiNzU3ZmU6YzcxMjZkZmIxZDI0NGQ5M2JhMDJmNDM2Y2VhNzViNTQ=";
    $.ajax({
        method: "POST",
        async: false,
        /* dataType: 'jsonp',
         jsonp: 'callback', */
        url: "https://accounts.spotify.com/api/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + authorization
        },
        data: {
            "grant_type": "client_credentials",
        },
        success: function (result) {
            var time = new Date().getTime() + 3600000;
            var r = JSON.stringify({token: result.access_token, time: time});
            localStorage.setItem("token", r);
        }
    });

}


