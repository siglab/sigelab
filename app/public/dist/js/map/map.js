$(document).ready(function () {




    // configuracion del mapa
    var selectedFilter, mylayers, map, sql, vis, coffeeShopLocations, layers;
    var map = L.map('map', { center: [3.371109, -76.536738], zoom: 16, zoomControl: false });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	maxZoom: 19,
    	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);


    var db = firebase.database();
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }


    $('.menubusqueda').click(function () {// scripts de acciones en el menu

        if ($(this).attr('id') === 'menu-busq-equipo') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre del equipo" id="input-infolab-busq-equipo" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-nombre-equipo">Buscar</button>');
            $('#myModal').modal();
        } else if ($(this).attr('id') === 'menu-ubicacion-lab') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre del laboratorio" id="infolab-ubicacion-laboratorio-por-nombre" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-nombre-laboratorio">Buscar</button>');
            $("#infolab-ubicacion-laboratorio-por-nombre").easyAutocomplete(optionsAutoCompl);
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-busqueda-por-director') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Director" id="infolab-busqueda-por-director" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();">');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-director">Buscar</button>');
            $("#infolab-busqueda-por-director").easyAutocomplete(optionsdirectores);
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-busqueda-por-escuelas') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre de la escuela" id="infolab-busqueda-por-escuelas" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-nombre-escuela">Buscar</button>');
            $("#infolab-busqueda-por-escuelas").easyAutocomplete(optionsescuelas);
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-busqueda-por-grupos-investigacion') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Grupo de investigacion" id="infolab-busqueda-por-grupos-investigacion" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-grupo-investigacion">Buscar</button>');
            $("#infolab-busqueda-por-grupos-investigacion").easyAutocomplete(optiongruposinvestigacion);
            $('#myModal').modal();

          } else if ($(this).attr('id') === 'menu-prue-ensayos-laboratorio') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre laboratorio" id="input-prue-ensayos-laboratorio" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $("#input-prue-ensayos-laboratorio").easyAutocomplete(optionsAutoCompl);
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-ensayos-laboratorio">Buscar</button>');
            $('#myModal').modal();

          } else if ($(this).attr('id') === 'menu-laboratorios-por-pruebas') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Prueba" id="input-laboratorios-por-pruebas" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-busqueda-prueba">Buscar</button>');
            $("#input-laboratorios-por-pruebas").easyAutocomplete(optionsPruebaEnsayo);

            $('#myModal').modal();

          } else if ($(this).attr('id') === 'menu-busqueda-equipo-robustos') {
            $('.form-group').html('');
            $('.form-group').html('<input type="text" class="form-control" aria-describedby="basic-addon1" placeholder="Nombre equipo" id="input-busqueda-equipo-robustos" style="text-transform:uppercase;" onkeyup="javascript:this.value=this.value.toUpperCase();"> ');
            $('#btns-buscar').html('<button type="button" class="btn btn-primary" id="btn-equipo-robusto">Buscar</button>');
            $("#input-busqueda-equipo-robustos").easyAutocomplete(optionsDescripcionEquiposRobustos);
            $('#myModal').modal();

        } else if ($(this).attr('id') === 'menu-equipos-robustos') {
            equiposrobustosTodos();


        }else if ($(this).attr('id') === 'menu-contacto') {
          $('.form-group').html('');
          $('.form-group').html(`<h2 style="font-size:16px; text-align:left;"><strong>Información de Contacto</strong></h2>
          <ul style="list-style:none; text-align:left; padding:0px">
            <li>Vicerrectoria de investigaciones</li>
            <li><a href="mailto:laboratorios.sig@correounivalle.edu.co" target="_top">laboratorios.sig@correounivalle.edu.co</a></li>
            <li><a href="mailto:Laboratorio.geoposicionamiento@correounivalle.edu.co" target="_top">Laboratorio.geoposicionamiento@correounivalle.edu.co</a></li>
            <li><a href="mailto:jhon.barona@correounivalle.edu.co" target="_top">jhon.barona@correounivalle.edu.co</a></li>
            <li>Ciudad Universitaria Melendez</li>
            <li>Teléfono +57 2 3212100 </li>
            <li>Universidad del Valle</li>
            <li>Cali - Colombia</li>

          </ul>`);
          $('#btns-buscar').html('');
          $('#myModal').modal();

        }



    });


    // scripts de Consultas informacion de los laboratorios
    // busqueda de lab por codigo del laboratorio

    // ubicacion del laboratorio por nombre
    $('#btns-buscar').on('click', '#btn-nombre-laboratorio', function () {
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();

        db.ref("informacion_laboratorios")
        .orderByChild('nombre_de_laboratorio')
        .equalTo($('#infolab-ubicacion-laboratorio-por-nombre').val())
        .once("value").then(function (laboratorio) {
            var leaftobj = {};
            return new Promise(function(resolve){
              laboratorio.forEach(function(lab){
                leaftobj.laboratorio = lab.val();
                  resolve(leaftobj);
              });
            });
          }).then(function(leaftobj){
            if (isNumber(leaftobj.laboratorio.cod_georef)) {
              db.ref("edificios")
              .orderByChild("cod_georef")
              .equalTo(leaftobj.laboratorio.cod_georef)
              .once("value").then(function (snapshot) {
                return new Promise(function(resolve){
                  snapshot.forEach(function(edificio){
                    //console.log(edificio.val());
                      leaftobj.Latitud = edificio.val().Latitud;
                      leaftobj.Longitud = edificio.val().Longitud;
                        resolve(leaftobj);


                  });
                });
              }).then(function(leaftobj){
                //console.log('leaftobj', leaftobj);
                spinner.stop();
                if (isNumber(leaftobj.laboratorio.cod_escuela)) {
                  L.marker([leaftobj.Longitud, leaftobj.Latitud]).addTo(map)
                     .bindPopup("<b> Edificio: " + leaftobj.laboratorio.cod_escuela +
                     "</b><br> Escuela: " + leaftobj.laboratorio.escuela_o_departamento +
                     "</b><br> Espacio: " + leaftobj.laboratorio.espacio +
                     "<br> encargado: " + leaftobj.laboratorio.nombre_responsable +
                     "<br> email contacto: " + leaftobj.laboratorio.email_univalle +
                     "<br> otros email contacto: " + leaftobj.laboratorio.email +
                     "<br> laboratorio: " + leaftobj.laboratorio.nombre_de_laboratorio +
                     "<br> grupo de investigacion: " + leaftobj.laboratorio.grupo_de_investigacion)
                     .openPopup();
                     map.setView(new L.LatLng(leaftobj.Longitud, leaftobj.Latitud), 17);

                }else {
                  spinner.stop();
                  alert("el laboratorio " +leaftobj.laboratorio.nombre_de_laboratorio+ leaftobj.laboratorio.nombre_responsable+ " por el momento no tiene informacion geografica")

                }

               $('#myModal').modal('hide');
              });
            }else {
              spinner.stop();
              var message = $('<div class="alert  error-message" style="display: none;">');
              // a close button
              var close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
              message.append(close); // adding the close button to the message
              message.append('<div class="alert alert-info alert-dismissable fade in">'+
                'El laboratorio :<strong>'+leaftobj.laboratorio.nombre_de_laboratorio+'</strong> por el momento no tiene informacion geografica, mientras tanto.' +
                'esta es la informacion de contacto :' +leaftobj.laboratorio.nombre_responsable+
                '<br>email :' +leaftobj.laboratorio.email_univalle+
              '</div>');
              message.appendTo($('body')).fadeIn(1000).delay(8000).fadeOut(1000);

              $('#myModal').modal('hide');

            }


        });
      });

      // ubicacion del laboratorio por director del laboratorio
      $('#btns-buscar').on('click', '#btn-director', function () {
          spinner.spin(target);
          $("img").remove(".leaflet-marker-icon");
          $(".leaflet-marker-shadow").remove();
          $(".leaflet-popup").remove();
          db.ref("informacion_laboratorios")
					.orderByChild('nombre_responsable')
					.equalTo($('#infolab-busqueda-por-director').val())
					.once("value").then(function (laboratorios) {
            return new Promise(function(resolve){
              var i = 0;
              var children = laboratorios.numChildren();
              leaftobj = {};
              laboratorios.forEach(function(laboratorio){
              //	console.log('laboratorio',laboratorio.val());
                    var objpruebas = {};


                    if (leaftobj[laboratorio.val().cod_escuela]!==undefined) {
                        leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio = leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio + '<li>' + laboratorio.val().nombre_de_laboratorio + '</li>';
                    }else {
                        objpruebas.nombre_de_laboratorio =  '<li>' + laboratorio.val().nombre_de_laboratorio+ '</li>';
                        objpruebas.escuela_o_departamento = laboratorio.val().escuela_o_departamento;
                        objpruebas.cod_escuela = laboratorio.val().cod_escuela;
                        objpruebas.email_univalle = laboratorio.val().email_univalle;
                        objpruebas.email = laboratorio.val().email;

                        objpruebas.Latitud = 0;
                        objpruebas.Longitud = 0;
                    leaftobj[laboratorio.val().cod_georef] = objpruebas;
                    }
                    i++;
                    if (i==children) {
                      resolve(leaftobj);
                    }
              });
            });
          }).then(function(leaftobj){
            var keys = Object.getOwnPropertyNames(leaftobj).sort();

            return new Promise(function (resolve) {
              var i = 0;
              $(keys).each(function (index,key) {
                var state = isNumber(parseInt(key));
                if (state) {
                  db.ref("edificios")
                  .orderByChild("cod_georef")
                  .equalTo(parseInt(key))
                  .once("child_added").then(function (snapshot) {
                    leaftobj[key].Latitud = snapshot.val().Latitud;
                    leaftobj[key].Longitud = snapshot.val().Longitud;
                    i++
                      if (i == keys.length) {
                        resolve(leaftobj);
                      }
                  });

                }else {
                  i++;
                  if (i == keys.length) {
                    resolve(leaftobj);
                  }
                }

              });

            });


          }).then(function (leaftobj) {

            for (i in leaftobj) {

              if (leaftobj[i].Longitud != 0) {
                L.marker([leaftobj[i].Longitud, leaftobj[i].Latitud]).addTo(map)
                    .bindPopup("<b> Edificio: " + leaftobj[i].cod_escuela +
                    "</b><br> Escuela: " + leaftobj[i].escuela_o_departamento +
                    "<br> email: " + leaftobj[i].email_univalle +
                    "<br> laboratorios: <ul>" + leaftobj[i].nombre_de_laboratorio +"</ul>")
                    .openPopup();
                map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
                spinner.stop();
              }else {
                spinner.stop();
                var message = $('<div class="alert  error-message" style="display: none;">');
                // a close button
                var close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
                message.append(close); // adding the close button to the message
                message.append('<div class="alert alert-info alert-dismissable fade in">'+
                  'El laboratorio :<strong>'+leaftobj[i].nombre_de_laboratorio+'</strong> por el momento no tiene informacion geografica, mientras tanto.' +
                  'esta es la informacion de contacto :' +leaftobj[i].escuela_o_departamento+
                  '<br>email: ' +leaftobj[i].email_univalle+
                '</div>');
                message.appendTo($('body')).fadeIn(1000).delay(8000).fadeOut(1000);

              }

              }
            });

          $('#myModal').modal('hide');
      });

      // ubicacion del laboratorio por escuela
      $('#btns-buscar').on('click', '#btn-nombre-escuela', function () {
          spinner.spin(target);
          $("img").remove(".leaflet-marker-icon");
          $(".leaflet-marker-shadow").remove();
          $(".leaflet-popup").remove();
          db.ref("informacion_laboratorios")
					.orderByChild('escuela_o_departamento')
					.equalTo($('#infolab-busqueda-por-escuelas').val())
					.once("value").then(function (laboratorios) {
							return new Promise(function(resolve){
								var i = 0;
								var children = laboratorios.numChildren();
								leaftobj = {};
								laboratorios.forEach(function(laboratorio){
								//	console.log('laboratorio',laboratorio.val());
											var objpruebas = {};


											if (leaftobj[laboratorio.val().cod_escuela]!==undefined) {
													leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio = leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio + '<li>' + laboratorio.val().nombre_de_laboratorio + '</li>';
											}else {
													objpruebas.nombre_de_laboratorio =  '<li>' + laboratorio.val().nombre_de_laboratorio+ '</li>';
													objpruebas.escuela_o_departamento = laboratorio.val().escuela_o_departamento;
                          objpruebas.cod_escuela = laboratorio.val().cod_escuela;
                          objpruebas.cod_escuela = laboratorio.val().email_univalle;
													objpruebas.Latitud = 0;
													objpruebas.Longitud = 0;
											leaftobj[laboratorio.val().cod_georef] = objpruebas;
											}
											i++;
											if (i==children) {
												resolve(leaftobj);
											}
								});
							});
						}).then(function(leaftobj){
							var keys = Object.getOwnPropertyNames(leaftobj).sort();

							return new Promise(function (resolve) {
								var i = 0;
								$(keys).each(function (index,key) {
									var state = isNumber(parseInt(key));
									if (state) {
										db.ref("edificios")
										.orderByChild("cod_georef")
										.equalTo(parseInt(key))
										.once("child_added").then(function (snapshot) {
											leaftobj[key].Latitud = snapshot.val().Latitud;
											leaftobj[key].Longitud = snapshot.val().Longitud;
											i++
												if (i == keys.length) {
													resolve(leaftobj);
												}
										});

									}else {
										i++;
										if (i == keys.length) {
											resolve(leaftobj);
										}
									}

								});

							});


						}).then(function (leaftobj) {

							for (i in leaftobj) {

								if (leaftobj[i].Longitud != 0) {
									L.marker([leaftobj[i].Longitud, leaftobj[i].Latitud]).addTo(map)
											.bindPopup("<b> Edificio: " + leaftobj[i].cod_escuela +
											"</b><br> Escuela: " + leaftobj[i].escuela_o_departamento +

											"<br> laboratorios: <ul>" + leaftobj[i].nombre_de_laboratorio )
											.openPopup();
									map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
                  spinner.stop();
								}else {
                  var message = $('<div class="alert  error-message" style="display: none;">');
                  // a close button
                  var close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
                  message.append(close); // adding the close button to the message
                  message.append('<div class="alert alert-info alert-dismissable fade in">'+
                    'El laboratorio :<strong>'+leaftobj[i].nombre_de_laboratorio+'</strong> por el momento no tiene informacion geografica, mientras tanto.' +
                  '</div>');
                  message.appendTo($('body')).fadeIn(1000).delay(8000).fadeOut(1000);
                  spinner.stop();
                }

								}
							});

          $('#myModal').modal('hide');
      });

      // ubicacion del laboratorio por grupo de investigacion
      $('#btns-buscar').on('click', '#btn-grupo-investigacion', function () {
          spinner.spin(target);
          $("img").remove(".leaflet-marker-icon");
          $(".leaflet-marker-shadow").remove();
          $(".leaflet-popup").remove();
            db.ref("informacion_laboratorios")
  					.orderByChild('grupo_de_investigacion')
  					.equalTo($('#infolab-busqueda-por-grupos-investigacion').val())
  					.once("value").then(function (laboratorios) {
              return new Promise(function(resolve){
                var i = 0;
                var children = laboratorios.numChildren();
                leaftobj = {};
                laboratorios.forEach(function(laboratorio){
                //	console.log('laboratorio',laboratorio.val());
                      var objpruebas = {};


                      if (leaftobj[laboratorio.val().cod_escuela]!==undefined) {
                          leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio = leaftobj[laboratorio.val().cod_escuela].nombre_de_laboratorio + '<li>' + laboratorio.val().nombre_de_laboratorio + '</li>';
                      }else {
                          objpruebas.nombre_de_laboratorio =  '<li>' + laboratorio.val().nombre_de_laboratorio+ '</li>';
                          objpruebas.escuela_o_departamento = laboratorio.val().escuela_o_departamento;
                          objpruebas.email = laboratorio.val().email;
                          objpruebas.grupo_de_investigacion = laboratorio.val().grupo_de_investigacion;
                          objpruebas.email_univalle = laboratorio.val().email_univalle;

                          objpruebas.Latitud = 0;
                          objpruebas.Longitud = 0;
                      leaftobj[laboratorio.val().cod_georef] = objpruebas;
                      }
                      i++;
                      if (i==children) {
                        resolve(leaftobj);
                      }
                });
              });
            }).then(function(leaftobj){
              var keys = Object.getOwnPropertyNames(leaftobj).sort();

              return new Promise(function (resolve) {
                var i = 0;
                $(keys).each(function (index,key) {
                  var state = isNumber(parseInt(key));
                  if (state) {
                    db.ref("edificios")
                    .orderByChild("cod_georef")
                    .equalTo(parseInt(key))
                    .once("child_added").then(function (snapshot) {
                      leaftobj[key].Latitud = snapshot.val().Latitud;
                      leaftobj[key].Longitud = snapshot.val().Longitud;
                      i++
                        if (i == keys.length) {
                          resolve(leaftobj);
                        }
                    });

                  }else {
                    i++;
                    if (i == keys.length) {
                      resolve(leaftobj);
                    }
                  }

                });

              });


            }).then(function (leaftobj) {

              for (i in leaftobj) {

                if (leaftobj[i].Longitud != 0) {
                  L.marker([leaftobj[i].Longitud, leaftobj[i].Latitud]).addTo(map)
                      .bindPopup("<b> Edificio: " + leaftobj[i].cod_escuela +
                      "</b><br> Escuela: " + leaftobj[i].escuela_o_departamento +
                      "</b><br> Grupo de investigacion: " + leaftobj[i].grupo_de_investigacion +
                      "<br> email: " + leaftobj[i].email +
                      "<br> laboratorios: <ul>" + leaftobj[i].nombre_de_laboratorio +"</ul>")
                      .openPopup();
                  map.setView(new L.LatLng(leaftobj[i].Longitud, leaftobj[i].Latitud), 17);
                  spinner.stop();

                }else {
                  spinner.stop();
                  var message = $('<div class="alert  error-message" style="display: none;">');
                  // a close button
                  var close = $('<button type="button" class="close" data-dismiss="alert">&times</button>');
                  message.append(close); // adding the close button to the message
                  message.append('<div class="alert alert-info alert-dismissable fade in">'+
                    'El laboratorio :<strong>'+leaftobj[i].nombre_de_laboratorio+'</strong> por el momento no tiene informacion geografica, mientras tanto.' +
                    'esta es la informacion de contacto :' +leaftobj[i].escuela_o_departamento+
                    '<br>email: ' +leaftobj[i].email_univalle+
                  '</div>');
                  message.appendTo($('body')).fadeIn(1000).delay(8000).fadeOut(1000);
                }

                }

              });

          spinner.stop();
          $('#myModal').modal('hide');
      });









    //scripts consultas ensayos informacion_laboratorios
    // que pruebas o ensayos se prestan en el laboratorio
    $('#btns-buscar').on('click', '#btn-ensayos-laboratorio', function () {
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        var tempensayos = '';


        var funcionDibuja = function (nombre) {
                db.ref("informacion_laboratorios")
                .orderByChild('nombre_de_laboratorio')
                .equalTo(nombre).on("child_added", function (laboratorio) {
                  //console.log('laboratorio',laboratorio.val());
                    db.ref("edificios")
                        .orderByChild("cod_georef")
                        .equalTo(laboratorio.val().cod_georef).once("child_added", function (snapshot) {
                          //console.log('snapshot',snapshot.val());
                            var i = 0;
                            var numChildren = 0;
                             db.ref("ensayos").orderByChild('nombre_laboratorio')
                                .equalTo(nombre)
                                .once("value").then(function(num){
                                  numChildren = num.numChildren();
                                  //console.log('numChildren', numChildren);
                                  db.ref("ensayos").orderByChild('nombre_laboratorio')
                                      .equalTo(nombre)
                                      .on("child_added", function (pruebas) {
                                        //console.log('pruebas',pruebas.val());
                                          tempensayos = tempensayos + "<li>" + pruebas.val().prueba_ensayo + "</li>";
                                          i++;
                                          if (i==numChildren) {
                                            L.marker([snapshot.val().Longitud, snapshot.val().Latitud]).addTo(map)
                                                .bindPopup("<div id=''><b>edificio: " + snapshot.val().edif +
                                                "</b><br>" + laboratorio.val().nombre_de_laboratorio +
                                                "<br> Escuela: " + laboratorio.val().escuela_o_departamento +
                                                "</b><br> Espacio: " + laboratorio.val().espacio +
                                                "<br> encargado: " + laboratorio.val().nombre_responsable +
                                                "<br> email contacto: " + laboratorio.val().email_univalle +


                                                "<br> pruebas:<ul> " + tempensayos + "</ul> </div>")
                                                .openPopup();

                                            map.setView(new L.LatLng(snapshot.val().Longitud, snapshot.val().Latitud), 17);
                                            spinner.stop();
                                          }

                                      });//
                                });


                        });
                });
        }
        funcionDibuja($('#input-prue-ensayos-laboratorio').val());

        $('#myModal').modal('hide');
    });



    // que laboratorio presenta la prueba o ensayo:
    $('#btns-buscar').on('click', '#btn-busqueda-prueba', function () {
        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();

        var templabs = '';
        var coordenadas = [];



            db.ref("ensayos")
                .orderByChild('prueba_ensayo')
                .equalTo($('#input-laboratorios-por-pruebas').val()).once("child_added").then(function (prueba) {
                  //console.log('prueba',prueba.val());
                    db.ref("informacion_laboratorios")
                        .orderByChild('nombre_de_laboratorio')
                        .equalTo(prueba.val().nombre_laboratorio).once("child_added").then(function (equipo) {
                          //console.log('equipo',equipo.val());
                            db.ref("edificios")
                                .orderByChild('cod_georef')
                                .equalTo(equipo.val().cod_georef).once("child_added").then(function (edificio) {
                                  //console.log('edificio',edificio.val());
                                    L.marker([edificio.val().Longitud, edificio.val().Latitud]).addTo(map)
                                        .bindPopup("<div><b>edificio: " + edificio.val().edif + "</b><br>" + prueba.val().nombre_laboratorio +
                                        "<br> Escuela: " + equipo.val().escuela_o_departamento +
                                        "</b><br> Espacio: " + equipo.val().espacio +
                                        "<br> encargado: " + equipo.val().nombre_responsable +
                                        "<br> email contacto: " + equipo.val().email_univalle +
                                        "<br> otros email contacto: " + equipo.val().email +

                                        "<br> pruebas:<ul><li> " + prueba.val().prueba_ensayo + "</li></ul> </div>")
                                        .openPopup();
                                    map.setView(new L.LatLng(edificio.val().Longitud, edificio.val().Latitud), 17);
                                });
                        });
                });

        spinner.stop();
        $('#myModal').modal('hide');
    });




    //scripts de equipos robustos
    // buscar equipo robusto
    $('#btns-buscar').on('click', '#btn-equipo-robusto', function () {

        spinner.spin(target);
        $("img").remove(".leaflet-marker-icon");
        $(".leaflet-marker-shadow").remove();
        $(".leaflet-popup").remove();
        db.ref("equipo robusto")
            .orderByChild('descripcion')
            .equalTo($('#input-busqueda-equipo-robustos').val())
            .once("value").then(function (equipoRobusto) {
              //console.log('equipoRobusto',equipoRobusto.val());
                db.ref("informacion_laboratorios").orderByChild("espacio")
                .equalTo(equipoRobusto.val()[0].espacio_asignado)
                .on("child_added", function (laboratorio) {
                  //console.log('laboratorio',laboratorio.val());
                    db.ref("edificios").orderByChild("cod_georef")
                    .equalTo(laboratorio.val().cod_georef)
                    .once("child_added", function (snapshot) {
                    //  console.log('snapshot',snapshot.val());
                        L.marker([snapshot.val().Longitud, snapshot.val().Latitud])
                            .bindPopup("<b> Edificio: " + snapshot.val().edif +
                            "</b><br> Escuela: " + laboratorio.val().escuela_o_departamento +
                            "</b><br> Espacio: " + laboratorio.val().espacio +
                            "<br> encargado: " + laboratorio.val().nombre_responsable +
                            "<br> email contacto: " + laboratorio.val().email_univalle +
                            "<br> otros email contacto: " + laboratorio.val().email +
                            "<br> laboratorio: " + laboratorio.val().nombre_de_laboratorio +
                            "<br> descripcion del equipo: " + equipoRobusto.val().descripcion +
                            "<br> valor: " + equipoRobusto.val().valor +
                            "<br> grupo de investigacion: " + laboratorio.val().grupo_de_investigacion)
                            .openPopup().addTo(map);
                        map.setView(new L.LatLng(snapshot.val().Longitud  , snapshot.val().Latitud), 17);
                        $(".leaflet-marker-icon").trigger( "click" );
                    });
                });




            });
        spinner.stop();
        $('#myModal').modal('hide');
    });

    function  equiposrobustosTodos() {


           spinner.spin(target);
           $("img").remove(".leaflet-marker-icon");
           $(".leaflet-marker-shadow").remove();
           $(".leaflet-popup").remove();
           db.ref("equipo robusto")
               .orderByChild('espacio_asignado')
               .on("child_added", function (equipoRobusto) {
                   db.ref("informacion_laboratorios")
                   .orderByChild("espacio")
                   .equalTo(equipoRobusto.val().espacio_asignado)
                   .on("child_added", function (laboratorio) {

                       db.ref("edificios").orderByChild("cod_georef")
                       .equalTo(laboratorio.val().cod_georef)
                       .once("child_added", function (snapshot) {

                           L.marker([snapshot.val().Longitud,snapshot.val().Latitud]).addTo(map)
                               .bindPopup("<b> Edificio: " + snapshot.val().edif +
                               "</b><br> Escuela: " + laboratorio.val().escuela_o_departamento +
                               "</b><br> Espacio: " + laboratorio.val().espacio +
                               "<br> encargado: " + laboratorio.val().nombre_responsable +
                               "<br> email contacto: " + laboratorio.val().email_univalle +
                               "<br> otros email contacto: " + laboratorio.val().email +
                               "<br> laboratorio: " + laboratorio.val().nombre_de_laboratorio +
                               "<br> descripcion del equipo: " + equipoRobusto.val().descripcion +
                               "<br> valor: " + equipoRobusto.val().valor +
                               "<br> grupo de investigacion: " + laboratorio.val().grupo_de_investigacion)
                               .openPopup();
                           map.setView(new L.LatLng(snapshot.val().Longitud, snapshot.val().Latitud), 17);
                           $(".leaflet-marker-icon").trigger( "click" );
                       });
                   });




               });
           spinner.stop();
           $('#myModal').modal('hide');
       }


});
