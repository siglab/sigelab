
$(document).ready(function () {





    // configuracion del mapa
    var selectedFilter, mylayers, map, sql, vis, coffeeShopLocations, layers;



    var db = firebase.database();






    $('#menu-generar-listado-labs').on('click', function () {// crea la lista de equipos
        spinner.spin(target);
        $('#container').html('<div id="tabla"><table id="tablaequipos" class="table table-bordered table-hover" width="100%">' +
            '<thead>' +
            '<tr>' +
            '<th>Nombre laboratorio</th>' +
            '<th>Codigo</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody id="tablabody"></tbody>' +
            '</table></div>');
        $('.modal-body').html('<form class="form-horizontal"></form>')


        var dataid;


        ////console.log('entra equipos');
        db.ref("informacion_laboratorios")
            // .orderByChild('email_univalle')
            .once("value").then(function (laboratorio) {
                //console.log(laboratorio.val());
                Object.getOwnPropertyNames(laboratorio.val()).forEach(function(val, idx, array) {
                  //console.log('val', val);
                  //console.log('idx', idx);
                  //console.log('laboratorio', laboratorio.val()[idx]);
                  $('#tablabody').append('<tr>' +
                      '<td  id=' +  idx + '>' + laboratorio.val()[idx].nombre_de_laboratorio + '</td>' +
                      '<td id=' + idx + '>' + laboratorio.val()[idx].cod_lab + '</td>' +
                      '</tr>');
                  });
                /*laboratorio.val().forEach(function(lab){
                  $('#tablabody').append('<tr>' +
                      '<td  id=' + lab.key + '>' + lab.nombre_de_laboratorio + '</td>' +
                      '<td id=' + lab.key + '>' + lab.cod_lab + '</td>' +
                      '</tr>');
                })*/
              }).then(function (val) {

                  var tableequipos = $('#tablaequipos').DataTable();
                   $('#tablaequipos').on('click', 'tr', function () {
                       if ($(this).hasClass('selected')) {
                           $(this).removeClass('selected');

                       }
                       else {
                           tableequipos.$('tr.selected').removeClass('selected');
                           $(this).addClass('selected');
                           dataid = $('.selected').children().attr('id');

                           db.ref("informacion_laboratorios/" + dataid)
                               .once("value", function (actualizalab) {
                                   //  ////console.log(equipo.val());
                                   $('.form-horizontal').html("<div class=" + actualizalab.key + ">" +
                                       "<h4>Actualiza la informaciondel laboratorio"+actualizalab.val().nombre_de_laboratorio+"</h4>" +
                                       "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nactividad'>Actividad:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nactividad' value='" + actualizalab.val().actividad + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                       "</div>" +
                                       "</div>" +
                                       "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nfechafundacion'>Fecha de fundación:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='date' class='actualizar-datos form-control' id='nfechafundacion' value='" + actualizalab.val().ano_de_fundacion + "'   >" +
                                       "</div>" +
                                       "</div>" +
                                       "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncapacidadestudiantes'>Capacidad estudiantes:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='ncapacidadestudiantes' value='" + actualizalab.val().capacidad_estudiantes + "'   required>" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncapacidadmaxestudiantes'>Capacidad maxima de estudiantes</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='ncapacidadmaxestudiantes' value='" + actualizalab.val().capacidad_maxima_estudiantes + "'   required>" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncargo'>Cargo</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ncargo' value='" + actualizalab.val().cargo + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncategoria'>Categoria</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ncategoria' value='" + actualizalab.val().categoria + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncategoriadocente'>Categoria docente</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ncategoriadocente' value='" + actualizalab.val().categoria_docente + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncelular'>Numero celular</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='ncelular' value='" + actualizalab.val().celular + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ncodigoescuela'>Edificio</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='ncodigoescuela' value='" + actualizalab.val().cod_escuela + "'   required>" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ndireccion'>Direccion:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ndireccion' value='" + actualizalab.val().direccion + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nemail'><b>Email de acceso</b>(encargado)</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='mail' class='actualizar-datos form-control' id='nemail' value='" + actualizalab.val().email_univalle + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nnombreresponsable'>Nombre del responsable</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nnombreresponsable' value='" + actualizalab.val().nombre_responsable + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                       "</div>" +
                                       "</div>" +
                                       "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nescuela'>Escuela o departmento</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nescuela' value='" + actualizalab.val().escuela_o_departamento + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +

                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nespacio'>Espacio:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='nespacio' value='" + actualizalab.val().espacio + "'  required >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ngrupoinvestigacion'>Grupo de investigacion</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ngrupoinvestigacion' value='" + actualizalab.val().grupo_de_investigacion + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nhorasemana'>Hora semana</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nhorasemana' value='" + actualizalab.val().hora_semana + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nidentificacion'>Identificacion</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nidentificacion' value='" + actualizalab.val().identificacion + "'   >" +
                                       "</div>" +
                                       "</div>" + "<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nmetros2'>Metros cuadrados</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='number' class='actualizar-datos form-control' id='nmetros2' value='" + actualizalab.val().m2 + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nnotas'>Notas:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nnotas' value='" + actualizalab.val().notas + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='noficina'>Oficina</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='noficina' value='" + actualizalab.val().oficina + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='npersonal'>Personal: </label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='npersonal' value='" + actualizalab.val().personal + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nresolucioncreacion'>Resolucion de creacion</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nresolucioncreacion' value='" + actualizalab.val().resolucion_de_creacion + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='nsede'>Sede:</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='nsede' value='" + actualizalab.val().sede + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ntelefono'>Telefono</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ntelefono' value='" + actualizalab.val().telefono + "'   >" +
                                       "</div>" +
                                       "</div>" +"<div class='form-group'>" +
                                       "<label class='control-label col-sm-4' for='ntelefonolab'>Telefono laboratorio</label>" +
                                       "<div class='col-sm-8'>" +
                                       "<input type='text' class='actualizar-datos form-control' id='ntelefonolab' value='" + actualizalab.val().telefono_lab + "'   >" +
                                       "</div>" +
                                       "</div>" +

                                       "<div class='form-group'>" +

                                       "<div class='col-sm-offset-2 col-sm-10'>" +
                                       "<button class='btn-actualiza-laboratorio btn btn-primary'  key=" + actualizalab.key + " >Actualiza datos</button></form></div>" +
                                       "</div>" +
                                       "</div>" +
                                       "</div>"

                                   );




                               });
                       }
                       dataid = $('.selected').children().attr('id');
                       $('#myModal').modal();

               });
                  spinner.stop();


              }, function(error){
                //console.log(error);

                                  var tableequipos = $('#tablaequipos').DataTable();
                                   $('#tablaequipos').on('click', 'tr', function () {
                                       if ($(this).hasClass('selected')) {
                                           $(this).removeClass('selected');

                                       }
                                       else {
                                           tableequipos.$('tr.selected').removeClass('selected');
                                           $(this).addClass('selected');
                                           dataid = $('.selected').children().attr('id');

                                           db.ref("informacion_laboratorios/" + dataid)
                                               .once("value", function (actualizalab) {
                                                  //console.log(actualizalab.val());
                                                   $('.form-horizontal').html("<div class=" + actualizalab.key + ">" +
                                                       "<h4>Actualiza la informaciondel laboratorio"+actualizalab.val().nombre_de_laboratorio+"</h4>" +
                                                       "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nactividad'>Actividad:</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nactividad' value='" + actualizalab.val().actividad + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                                       "</div>" +
                                                       "</div>" +
                                                       "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nfechafundacion'>Fecha de fundaion:</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='date' class='actualizar-datos form-control' id='nfechafundacion' value='" + actualizalab.val().ano_de_fundacion + "'   >" +
                                                       "</div>" +
                                                       "</div>" +
                                                       "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ncapacidadestudiantes'>Capacidad estudiantes:</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='number' class='actualizar-datos form-control' id='ncapacidadestudiantes' value='" + actualizalab.val().capacidad_estudiantes + "'  required >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ncapacidadmaxestudiantes'>Capacidad maxima de estudiantes</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='number' class='actualizar-datos form-control' id='ncapacidadmaxestudiantes' value='" + actualizalab.val().capacidad_maxima_estudiantes + "'  required >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ncargo'>Cargo</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='ncargo' value='" + actualizalab.val().cargo + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ncategoria'>Categoria</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='ncategoria' value='" + actualizalab.val().categoria + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ncategoriadocente'>Categoria docente</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='ncategoriadocente' value='" + actualizalab.val().categoria_docente + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ncelular'>Numero celular</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='number' class='actualizar-datos form-control' id='ncelular' value='" + actualizalab.val().celular + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ncodigoescuela'>Edificio</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='number' class='actualizar-datos form-control' id='ncodigoescuela' value='" + actualizalab.val().cod_escuela + "'   required>" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ndireccion'>Direccion:</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='ndireccion' value='" + actualizalab.val().direccion + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nemail'><b>Email de acceso</b>(encargado)</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='mail' class='actualizar-datos form-control' id='nemail' value='" + actualizalab.val().email_univalle + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nnombreresponsable'>Nombre del responsable</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nnombreresponsable' value='" + actualizalab.val().nombre_responsable + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                                       "</div>" +
                                                       "</div>" +
                                                       "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nescuela'>Escuela o departmento</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nescuela' value='" + actualizalab.val().escuela_o_departamento + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'   >" +

                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nespacio'>Espacio:</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='number' class='actualizar-datos form-control' id='nespacio' value='" + actualizalab.val().espacio + "'  required >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ngrupoinvestigacion'>Grupo de investigacion</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='ngrupoinvestigacion' value='" + actualizalab.val().grupo_de_investigacion + "' style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'  >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nhorasemana'>Hora semana</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nhorasemana' value='" + actualizalab.val().hora_semana + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nidentificacion'>Identificacion</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nidentificacion' value='" + actualizalab.val().identificacion + "'   >" +
                                                       "</div>" +
                                                       "</div>" + "<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nmetros2'>Metros cuadrados</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='number' class='actualizar-datos form-control' id='nmetros2' value='" + actualizalab.val().m2 + "'   >" +
                                                       "</div>" +
                                                       "</div>" +"<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nnotas'>Notas:</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nnotas' value='" + actualizalab.val().notas + "'   >" +
                                                       "</div>" +
                                                       "</div>" +"<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='noficina'>Oficina</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='noficina' value='" + actualizalab.val().oficina + "'   >" +
                                                       "</div>" +
                                                       "</div>" +"<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='npersonal'>Personal: </label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='npersonal' value='" + actualizalab.val().personal + "'   >" +
                                                       "</div>" +
                                                       "</div>" +"<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nresolucioncreacion'>Resolucion de creacion</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nresolucioncreacion' value='" + actualizalab.val().resolucion_de_creacion + "'   >" +
                                                       "</div>" +
                                                       "</div>" +"<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='nsede'>Sede:</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='nsede' value='" + actualizalab.val().sede + "'  style='text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();' >" +
                                                       "</div>" +
                                                       "</div>" +"<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ntelefono'>Telefono</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='ntelefono' value='" + actualizalab.val().telefono + "'   >" +
                                                       "</div>" +
                                                       "</div>" +"<div class='form-group'>" +
                                                       "<label class='control-label col-sm-4' for='ntelefonolab'>Telefono laboratorio</label>" +
                                                       "<div class='col-sm-8'>" +
                                                       "<input type='text' class='actualizar-datos form-control' id='ntelefonolab' value='" + actualizalab.val().telefono_lab + "'   >" +
                                                       "</div>" +
                                                       "</div>" +

                                                       "<div class='form-group'>" +

                                                       "<div class='col-sm-offset-2 col-sm-10'>" +
                                                       "<button class='btn-actualiza-laboratorio btn btn-primary'  key=" + actualizalab.key + " >Actualiza datos</button></form></div>" +
                                                       "</div>" +
                                                       "</div>" +
                                                       "</div>"

                                                   );




                                               });
                                       }
                                       $('#myModal').modal();

                               });
                                  spinner.stop();

              });


      //  window.setTimeout(, 8000);




    });




    // scripts actualizar datos**********************************************************************************




    $(document).on('click', '.btn-actualiza-laboratorio', function () {//actualiza informacion de laboratorio
      event.preventDefault();
        var key = $(this).attr('key');


        var selcodigoescuela = parseInt($("[class='" + key + "']").find('#ncodigoescuela').val());
        var estudiantes = parseInt($("[class='" + key + "']").find('#ncapacidadestudiantes').val());
        var maxestudiantes = parseInt($("[class='" + key + "']").find('#ncapacidadmaxestudiantes').val());
        var espacio = parseInt($("[class='" + key + "']").find('#nespacio').val());
        var updates = {};
        updates['/informacion_laboratorios/' + key + '/actividad/'] = $("[class='" + key + "']").find('#nactividad').val();
        updates['/informacion_laboratorios/' + key + '/ano_de_fundacion/'] = $("[class='" + key + "']").find('#nfechafundacion').val();
        updates['/informacion_laboratorios/' + key + '/capacidad_estudiantes/'] = estudiantes;
        updates['/informacion_laboratorios/' + key + '/capacidad_maxima_estudiantes/'] = maxestudiantes;
        updates['/informacion_laboratorios/' + key + '/cargo/'] = $("[class='" + key + "']").find('#ncargo').val();
        updates['/informacion_laboratorios/' + key + '/categoria/'] = $("[class='" + key + "']").find('#ncategoria').val();
        updates['/informacion_laboratorios/' + key + '/categoria_docente/'] = $("[class='" + key + "']").find('#ncategoriadocente').val();
        updates['/informacion_laboratorios/' + key + '/celular/'] = $("[class='" + key + "']").find('#ncelular').val();
        updates['/informacion_laboratorios/' + key + '/cod_escuela/'] = selcodigoescuela;
        updates['/informacion_laboratorios/' + key + '/direccion/'] = $("[class='" + key + "']").find('#ndireccion').val();
        updates['/informacion_laboratorios/' + key + '/email_univalle/'] = $("[class='" + key + "']").find('#nemail').val();
        updates['/informacion_laboratorios/' + key + '/nombre_responsable/'] = $("[class='" + key + "']").find('#nnombreresponsable').val();
        updates['/informacion_laboratorios/' + key + '/espacio/'] = espacio;
        updates['/informacion_laboratorios/' + key + '/escuela_o_departamento/'] = $("[class='" + key + "']").find('#nescuela').val();
        updates['/informacion_laboratorios/' + key + '/grupo_de_investigacion/'] = $("[class='" + key + "']").find('#ngrupoinvestigacion').val();
        updates['/informacion_laboratorios/' + key + '/hora_semana/'] = $("[class='" + key + "']").find('#nhorasemana').val();
        updates['/informacion_laboratorios/' + key + '/identificacion/'] = $("[class='" + key + "']").find('#nidentificacion').val();
        updates['/informacion_laboratorios/' + key + '/m2/'] = $("[class='" + key + "']").find('#nmetros2').val();
        updates['/informacion_laboratorios/' + key + '/notas/'] = $("[class='" + key + "']").find('#nnotas').val();
        updates['/informacion_laboratorios/' + key + '/oficina/'] = $("[class='" + key + "']").find('#noficina').val();
        updates['/informacion_laboratorios/' + key + '/personal/'] = $("[class='" + key + "']").find('#npersonal').val();
        updates['/informacion_laboratorios/' + key + '/resolucion_de_creacion/'] = $("[class='" + key + "']").find('#nresolucioncreacion').val();
        updates['/informacion_laboratorios/' + key + '/sede/'] = $("[class='" + key + "']").find('#nsede').val();
        updates['/informacion_laboratorios/' + key + '/telefono/'] = $("[class='" + key + "']").find('#ntelefono').val();
        updates['/informacion_laboratorios/' + key + '/telefono_lab/'] = $("[class='" + key + "']").find('#ntelefonolab').val();



        //////console.log(updates);

        return firebase.database().ref().update(updates, function(error) {
          if (error) {
            alert("Error al gaurdas los datos, verifique los campos e intentelo de nuevo.");
          } else {
            alert("Datos guardados correctamente.");
          }
        });




    });










});
