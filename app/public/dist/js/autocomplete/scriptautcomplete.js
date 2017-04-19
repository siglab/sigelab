var autocompletedb = firebase.database();
var optionsAutoCompl,optionsPruebaEnsayo,optionsescuelas,optiongruposinvestigacion,optionsdirectores,optionsDescripcionEquiposRobustos;
Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

var array_nombreslab = [];
autocompletedb.ref("informacion_laboratorios").orderByChild('nombre_de_laboratorio').once("value").then(function (snapshot) {

  $(snapshot.val()).each( function( index, value ) {
      array_nombreslab.push(value.nombre_de_laboratorio);

    });
  //  console.log( array_nombreslab.unique() );
return(array_nombreslab.unique() );


}).then(function(array){
  optionsAutoCompl = {

   data: array,
   list: {
 		match: {
 			enabled: true
 		},
 		maxNumberOfElements: 6,

 		showAnimation: {
 			type: "slide",
 			time: 300
 		},
 		hideAnimation: {
 			type: "slide",
 			time: 300
 		}
 	},

 	theme: "round"

 };
});


 var array_ensayos = [];
 autocompletedb.ref("ensayos").orderByChild('prueba_ensayo').once("value").then(function (snapshot) {

     snapshot.forEach(function (snap) {
       array_ensayos.push(snap.val().prueba_ensayo);

     });
    // console.log( array_nombreslab.unique() );
 return(array_ensayos.unique() );


 }).then(function(array){
   optionsPruebaEnsayo = {
  data: array,
  list: {
    match: {
      enabled: true
    },
    maxNumberOfElements: 6,

    showAnimation: {
      type: "slide",
      time: 300
    },
    hideAnimation: {
      type: "slide",
      time: 300
    }
  },

  theme: "round"
  };
 });



 var array_escuelas = [];
 autocompletedb.ref("informacion_laboratorios").orderByChild('escuela_o_departamento').once("value").then(function (snapshot) {

   $(snapshot.val()).each( function( index, value ) {
       array_escuelas.push(value.escuela_o_departamento);

     });
    // console.log( array_nombreslab.unique() );
 return(array_escuelas.unique() );


 }).then(function(array){
   optionsescuelas = {
  data: array,
  list: {
    match: {
      enabled: true
    },
    maxNumberOfElements: 6,

    showAnimation: {
      type: "slide",
      time: 300
    },
    hideAnimation: {
      type: "slide",
      time: 300
    }
  },

  theme: "round"
  };
 });

 var array_groupinvestigacion = [];
 autocompletedb.ref("informacion_laboratorios").orderByChild('grupo_de_investigacion').once("value").then(function (snapshot) {

   $(snapshot.val()).each( function( index, value ) {
       array_groupinvestigacion.push(value.grupo_de_investigacion);

     });
  //   console.log( array_groupinvestigacion.unique() );
 return(array_groupinvestigacion.unique() );


 }).then(function(array){
   optiongruposinvestigacion = {

    data: array,
    list: {
        match: {
          enabled: true
        },
        maxNumberOfElements: 6,

        showAnimation: {
          type: "slide",
          time: 300
        },
        hideAnimation: {
          type: "slide",
          time: 300
        }
      },

      theme: "round"

  };
 });



 var array_directores = [];
 autocompletedb.ref("informacion_laboratorios").orderByChild('nombre_responsable').once("value").then(function (snapshot) {

   $(snapshot.val()).each( function( index, value ) {
       array_directores.push(value.nombre_responsable);

     });
  //   console.log( array_directores.unique() );
 return(array_directores.unique() );


 }).then(function(array){
   optionsdirectores = {

    data: array,
    list: {
    		match: {
    			enabled: true
    		},
    		maxNumberOfElements: 6,

    		showAnimation: {
    			type: "slide",
    			time: 300
    		},
    		hideAnimation: {
    			type: "slide",
    			time: 300
    		}
    	},

    	theme: "round"

  };
 });




 var array_equipos_rosbustos = [];
autocompletedb.ref("equipo robusto").orderByChild("descripcion").on("child_added", function (snapshot) {
  //console.log(snapshot.val().nombre_responsable);
  array_equipos_rosbustos.push(snapshot.val().descripcion);
 // console.log(directoreslabs);
});

 optionsDescripcionEquiposRobustos = {

  data: array_equipos_rosbustos,
  list: {
  		match: {
  			enabled: true
  		},
  		maxNumberOfElements: 6,

  		showAnimation: {
  			type: "slide",
  			time: 300
  		},
  		hideAnimation: {
  			type: "slide",
  			time: 300
  		}
  	},

  	theme: "round"

};
