
$(document).ready(function () {
  var db = firebase.database();

  var objtareas = {};
  var refusertareas;

  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      objtareas.uid = user.uid;
      refusertareas = db.ref("usuariostareasCompletadas/"+user.uid);
      objtareas.mensajes = '';
      db.ref("tareas").orderByChild("displayname").once('value').then(function (tareas) {
        var i=0;
        var hijos = tareas.numChildren();
        var contnotificaciones = 0;
        return new Promise(function (resolve) {
          tareas.forEach(function (tarea) {
            db.ref("usuariostareasCompletadas/"+user.uid).once("value").then(function (tareasUsuarios) {
              if (tareasUsuarios.val()==null) {
                // Get a key for a new Post.
                  var newPostKey = db.ref("usuariostareasCompletadas/"+user.uid).push().key;
                  db.ref("usuariostareasCompletadas/"+user.uid+"/"+newPostKey).update({
                  displayname: tarea.val().displayname,
                  estado: "pendiente",
                  mensaje: tarea.val().mensaje
                }).then(function (resp) {
                  objtareas.mensajes=objtareas.mensajes+'<li><strong>'+tarea.val().mensaje+'</strong></li>';
                  i++;
                  contnotificaciones++;
                  if (i==hijos) {
                    resolve(contnotificaciones); ;
                  }
                });
              }else{
                tareasUsuarios.forEach(function (tareausuario) {
                 if (tareausuario.val().displayname==tarea.val().displayname && tareausuario.val().estado=='completa') {
                    i++;
                    if (i==hijos) {
                      resolve(contnotificaciones); ;
                    }
                  }else if(tareausuario.val().displayname==tarea.val().displayname && tareausuario.val().estado!='completa'){
                    objtareas.mensajes=objtareas.mensajes+'<li><strong>'+tarea.val().mensaje+'</strong></li>';
                    i++;
                    contnotificaciones++;
                    if (i==hijos) {
                      resolve(contnotificaciones); ;
                    }
                  }
                });

              }


            });

          });
        });

      }).then(function (contnotificaciones) {
        if (contnotificaciones>0) {
          $('#notificaciones').popover({ content: "Usted tiene notificaciones pendientes !", trigger: "manual"});
          $('#notificaciones').popover('show');
        }
        $("#numero-notificaciones").text(contnotificaciones);


      });


      db.ref("usuariostareasCompletadas/"+objtareas.uid)
      .orderByChild("estado")
      .equalTo("pendiente")
      .once("value").then(function(tareaspendientes){
        console.log("tareapendiente",tareaspendientes.val());

        tareaspendientes.forEach(function (tarea) {
          console.log("tareapendiente",tarea.val());
        });
      });



        } else {
      // User is signed out.
        window.location="../index.html";

        $('body').html('');

    }

  });

  $('#notificaciones').click(function () {
    $('#notificaciones').popover('hide');
    $('.modal-title').text('notificaciones');
    $('.modal-body').html(objtareas.mensajes);

    $('#myModal').modal();
  });


var actualizaestadotarea = function (key,estado) {
  console.log('actualiza estado');
  /*
  refusertareas.ref(key).update({
    estado: estado,
  });*/
}




});
