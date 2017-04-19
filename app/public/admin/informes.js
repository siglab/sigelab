$(document).ready(function () {





  var db = firebase.database();
  google.charts.load('current', { 'packages': ['corechart', 'table'] });

//**************************************************genera graficas de sedes
  $('.menusedes').click(function(){
    var sede = $('#opcionsede').val();
    var consulta = $(this).attr('id');
    var counter = {};
    var keys = [];
    var rendergrafica = [];

    if (consulta === 'numero-laboratorios') {//cantidad de laboratorios por sede
       counter = {};
       keys = [];
       rendergrafica = [];
      db.ref("informacion_laboratorios").orderByChild('sede').equalTo(sede).once("value").then(function (sede) {
      //    //console.log(sede.val());
          $('#chart_div').html(''); $('#table_div').html('');
          var labs = [];

          sede.forEach(function (snap) {
            //    //console.log(index);
            labs.push(snap.val().escuela_o_departamento);

          });
          //console.log(labs);
          for (var i = 0; i < labs.length; i++) {
            if (!counter[labs[i]]) {
              counter[labs[i]] = 0;
            }
            counter[labs[i]]++;
          }

          keys = Object.getOwnPropertyNames(counter).sort();
          console.log('keys',keys);
          $(keys).each(function (index, value) {
            //  //console.log(value);
            var arr = [];
            arr.push(value);
            arr.push(counter[value]);
            ////console.log(arr);
            rendergrafica.push(arr);
          });
          //console.log('rendergrafica funciona');
          //console.log(JSON.stringify(rendergrafica));
          return (rendergrafica);



      }).then(function (render) {
      console.log('render',render);
      console.log(JSON.stringify(render));
        // Load the Visualization API and the corechart package.

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart1); google.charts.setOnLoadCallback(drawTable1);

        // Callback that creates and populates a data labsle,
        // instantiates the pie chart, passes in the data and
        // draws it.
        function drawChart1() {

          // Create the data table.
          var data1 = new google.visualization.DataTable();
          data1.addColumn('string', 'nombre');
          data1.addColumn('number', 'cantidad');
          data1.addRows(render);
          // Set chart options
          var options1 = {
            'title': 'Cantidad de laboratorios por escuela sede: '+sede,


          };

          // Instantiate and draw our chart, passing in some options.
          var chart1 = new google.visualization.PieChart(document.getElementById('chart_div'));
          chart1.draw(data1, options1);

        }
        function drawTable1() {
          var data1b = new google.visualization.DataTable();
          data1b.addColumn('string', 'Sede');
          data1b.addColumn('number', 'laboratorios');
          data1b.addRows(render);
          var table = new google.visualization.Table(document.getElementById('table_div'));

          table.draw(data1b, { showRowNumber: true, width: '100%' });
        }


      });

    }else if (consulta === 'numero-ensayos') {// cantidad de ensayos por sede
       counter = {};
       keys = [];
       rendergrafica = [];
      db.ref("informacion_laboratorios")
      .orderByChild('sede')
      .equalTo(sede)
      .once("value")
      .then(function (sedesnap) {
        return new Promise(function(resolvesedes) {
          $('#chart_div').html(''); $('#table_div').html('');
            //console.log('sedesnap',sedesnap.val());
          var labs = [];
          sedesnap.forEach(function (snap) {
            labs.push(snap.val().nombre_de_laboratorio);

          });
          for (var i = 0; i < labs.length; i++) {
            if (!counter[labs[i]]) {
              counter[labs[i]] = 0;
            }
            counter[labs[i]]++;
          }
          keys = Object.getOwnPropertyNames(counter).sort();

          resolvesedes(keys);
        }).then(function(keys){
          return new Promise(function(resolve) {
              var cont=0;
                        $.when($(keys).each(function (index, value) {

                          var arr = [];
                          var size =0;

                          db.ref("ensayos")
                          .orderByChild('nombre_laboratorio')
                          .equalTo(value)
                          .once("value",function (snapshot) {
                            size = snapshot.numChildren();
                             arr.push(value);
                             arr.push(size);
                            rendergrafica.push(arr);
                            cont++;

                            if (cont==keys.length) {
                              resolve(rendergrafica);
                            }
                          });
                        }));
                      });

        }).then(function (render2) {
          // Set a callback to run when the Google Visualization API is loaded.
              google.charts.setOnLoadCallback(drawChart2); google.charts.setOnLoadCallback(drawTable2);
              // Callback that creates and populates a data labsle,
              // instantiates the pie chart, passes in the data and
              // draws it.
              function drawChart2() {
                // Create the data table.
                 var data2 = new google.visualization.DataTable();
                data2.addColumn('string', 'nombre');
                data2.addColumn('number', 'cantidad');
                console.log('render2',render2);
                console.log('string',JSON.stringify(render2));
                data2.addRows(render2);
                // Set chart options
                var options1 = {
                  'title': 'Cantidad de pruebas por escuela sede: '+sede,


                };
                // Instantiate and draw our chart, passing in some options.
                var chart1 = new google.visualization.PieChart(document.getElementById('chart_div'));
                chart1.draw(data2, options1);

              }
              function drawTable2() {
                var data2b ;
                 data2b = new google.visualization.DataTable();
                data2b.addColumn('string', 'Sede');
                data2b.addColumn('number', 'laboratorios');
                data2b.addRows(render2);
                var table = new google.visualization.Table(document.getElementById('table_div'));

                table.draw(data2b, { showRowNumber: true, width: '100%' });
              }

            });
          });
        }
  });

//*****************************************graficas por escuelas*******************************
$('.menuescuelas').click(function(){
  var escuela = $('#opcionescuela').val();
  var consulta = $(this).attr('id');

  if (consulta === 'numero-laboratorios-escuelas') {
    var counter = {};
    var keys = [];
    var rendergrafica = [];
    db.ref("informacion_laboratorios").orderByChild('escuela_o_departamento').equalTo(escuela).once("value").then(function (escuelas) {
    //    //console.log(sede.val());
        $('#chart_div').html(''); $('#table_div').html('');
        var labs = [];

        escuelas.forEach(function (snap) {
          //    //console.log(index);
          labs.push(snap.val().actividad);

        });
        //console.log(labs);
        for (var i = 0; i < labs.length; i++) {
          if (!counter[labs[i]]) {
            counter[labs[i]] = 0;
          }
          counter[labs[i]]++;
        }

        keys = Object.getOwnPropertyNames(counter).sort();
        $(keys).each(function (index, value) {
          //  //console.log(value);
          var arr = [];
          arr.push(value);
          arr.push(counter[value]);
          ////console.log(arr);
          rendergrafica.push(arr);
        });

        return (rendergrafica);




    }).then(function (render) {
      // Load the Visualization API and the corechart package.
      //google.charts.load('current', { 'packages': ['corechart', 'table'] });

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart3); google.charts.setOnLoadCallback(drawTable3);

      // Callback that creates and populates a data labsle,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart3() {
        var data3
        // Create the data table.
         data3 = new google.visualization.DataTable();
        data3.addColumn('string', 'nombre');
        data3.addColumn('number', 'cantidad');
        data3.addRows(render);

        // Set chart options
        var options1 = {
          'title': 'Cantidad de laboratorios por actividad escuela: '+escuela,


        };

        // Instantiate and draw our chart, passing in some options.
        var chart1 = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart1.draw(data3, options1);

      }
      function drawTable3() {
        var data3b
         data3b = new google.visualization.DataTable();
        data3b.addColumn('string', 'Sede');
        data3b.addColumn('number', 'laboratorios');
        data3b.addRows(render);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data3b, { showRowNumber: true, width: '100%' });
      }


    });

  }else if (consulta === 'numero-ensayos-escuelas') {
    var counter = {};
    var keys = [];
    var rendergrafica = [];
    db.ref("informacion_laboratorios")
    .orderByChild('escuela_o_departamento')
    .equalTo(escuela).once("value")
    .then(function (escuelasnap) {
      $('#chart_div').html(''); $('#table_div').html('');
        var labs = [];
        escuelasnap.forEach(function (snap) {
          labs.push(snap.val().nombre_de_laboratorio);
        });
        for (var i = 0; i < labs.length; i++) {
          if (!counter[labs[i]]) {
            counter[labs[i]] = 0;
          }
          counter[labs[i]]++;
        }
        keys = Object.getOwnPropertyNames(counter).sort();
        return (keys);
      }).then(function(keys){
        return new Promise(function(resolve) {
            var cont=0;
                      $.when($(keys).each(function (index, value) {

                        var arr = [];
                        var size =0;

                        db.ref("ensayos")
                        .orderByChild('nombre_laboratorio')
                        .equalTo(value)
                        .once("value",function (snapshot) {
                          size = snapshot.numChildren();
                           arr.push(value);
                           arr.push(size);
                          rendergrafica.push(arr);
                          cont++;

                          if (cont==keys.length) {
                            resolve(rendergrafica);
                          }
                        });
                      }));
                    });

      }).then(function (render) {
        // Load the Visualization API and the corechart package.
      //google.charts.load('current', { 'packages': ['corechart', 'table'] });

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart4); google.charts.setOnLoadCallback(drawTable4);

      // Callback that creates and populates a data labsle,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart4() {

        // Create the data table.
        var data4 = new google.visualization.DataTable();
        data4.addColumn('string', 'nombre');
        data4.addColumn('number', 'cantidad');
        data4.addRows(render);

        // Set chart options
        var options1 = {
          'title': 'Cantidad de pruebas por escuela sede: '+escuela,


        };

        // Instantiate and draw our chart, passing in some options.
        var chart1 = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart1.draw(data4, options1);

      }
      function drawTable4() {
        var data4b = new google.visualization.DataTable();
        data4b.addColumn('string', 'Sede');
        data4b.addColumn('number', 'laboratorios');
        data4b.addRows(render);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data4b, { showRowNumber: true, width: '100%' });
      }


    });





  }
});




//*******************************************genera listado del selec de sedes***************************************
  db.ref("informacion_laboratorios").orderByChild('sede').once("value").then(function (laboratorio) {
    var labs = [];
    var keys = [];
    var counter = [];
    $(laboratorio.val()).each(function (index, value) {
      labs.push(value.sede);

    });
    for (var i = 0; i < labs.length; i++) {
      if (!counter[labs[i]]) {
        counter[labs[i]] = 0;
      }
      counter[labs[i]]++;
    }

    keys = Object.getOwnPropertyNames(counter).sort();
    $(keys).each(function (index, value) {
      $('#opcionsede').append(`<option>${value}</option>`);
    });
  });


  //*******************************************genera listado del selec de escuelas***************************************
    db.ref("informacion_laboratorios").orderByChild('escuela_o_departamento').once("value").then(function (laboratorio) {
      var labs = [];
      var keys = [];
      var counter = [];
      $(laboratorio.val()).each(function (index, value) {
        labs.push(value.escuela_o_departamento);

      });
      for (var i = 0; i < labs.length; i++) {
        if (!counter[labs[i]]) {
          counter[labs[i]] = 0;
        }
        counter[labs[i]]++;
      }

      keys = Object.getOwnPropertyNames(counter).sort();
      $(keys).each(function (index, value) {
        $('#opcionescuela').append(`<option>${value}</option>`);
      });
    });
  //********************************************************************************************************************
  $('#menu-sede').on('click', function () {// genera grafica por sede
    $('#chart_div').html(''); $('#table_div').html('');


    var counter = {};
    var keys = [];
    var rendergrafica = [];

    //console.log("Inicio");
    db.ref("informacion_laboratorios").orderByChild('sede').once("value").then(function (laboratorio) {
      var labs = [];
      $(laboratorio.val()).each(function (index, value) {
        labs.push(value.sede);

      });
      for (var i = 0; i < labs.length; i++) {
        if (!counter[labs[i]]) {
          counter[labs[i]] = 0;
        }
        counter[labs[i]]++;
      }

      keys = Object.getOwnPropertyNames(counter).sort();
      $(keys).each(function (index, value) {
        //  //console.log(value);
        var arr = [];
        arr.push(value);
        arr.push(counter[value]);
        ////console.log(arr);
        rendergrafica.push(arr);
      });

      //console.log(rendergrafica);
      return (rendergrafica);
    }).then(function (render) {





      // Load the Visualization API and the corechart package.
      //google.charts.load('current', { 'packages': ['corechart', 'table'] });

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart); google.charts.setOnLoadCallback(drawTable);

      // Callback that creates and populates a data labsle,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(render);

        // Set chart options
        var options = {
          'title': 'Cantidad de laboratorios por sede',


        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);

      }


      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sede');
        data.addColumn('number', 'laboratorios');
        data.addRows(render);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, { showRowNumber: true, width: '100%' });
      }

    });


  });






  //*******************************************************************************************************************
  $('#menu-escuela').on('click', function () {// genera grafica por escuela
    $('#chart_div').html(''); $('#table_div').html('');

    var counter = {};
    var keys = [];
    var rendergrafica = [];

    db.ref("informacion_laboratorios").orderByChild('escuela_o_departamento').once("value").then(function (laboratorio) {
      var labs = [];
      $(laboratorio.val()).each(function (index, value) {
        labs.push(value.escuela_o_departamento);

      });
      for (var i = 0; i < labs.length; i++) {
        if (!counter[labs[i]]) {
          counter[labs[i]] = 0;
        }
        counter[labs[i]]++;
      }

      keys = Object.getOwnPropertyNames(counter).sort();
      $(keys).each(function (index, value) {
        //  //console.log(value);
        var arr = [];
        arr.push(value);
        arr.push(counter[value]);
        ////console.log(arr);
        rendergrafica.push(arr);
      });

      //console.log(rendergrafica);
      return (rendergrafica);

    }).then(function (render) {
      // Load the Visualization API and the corechart package.
      //google.charts.load('current', { 'packages': ['corechart', 'table'] });

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart1); google.charts.setOnLoadCallback(drawTable);

      // Callback that creates and populates a data labsle,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart1() {

        // Create the data table.
        var data1 = new google.visualization.DataTable();
        data1.addColumn('string', 'nombre');
        data1.addColumn('number', 'cantidad');
        data1.addRows(render);

        // Set chart options
        var options1 = {
          'title': 'Cantidad de laboratorios por escuela',


        };

        // Instantiate and draw our chart, passing in some options.
        var chart1 = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart1.draw(data1, options1);

      }
      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sede');
        data.addColumn('number', 'laboratorios');
        data.addRows(render);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, { showRowNumber: true, width: '100%' });
      }


    });






  });

  //**********************************************************************************************************************
  $('#menu-categoria').on('click', function () {// genera grafica por categoria
    $('#chart_div').html(''); $('#table_div').html('');

    var counter = {};
    var keys = [];
    var rendergrafica = [];

    //console.log("Inicio");
    db.ref("informacion_laboratorios").orderByChild('categoria').once("value").then(function (laboratorio) {
      var labs = [];
      //console.log(laboratorio.val());
      $(laboratorio.val()).each(function (index, value) {
        labs.push(value.categoria);

      });
      for (var i = 0; i < labs.length; i++) {
        if (!counter[labs[i]]) {
          counter[labs[i]] = 0;
        }
        counter[labs[i]]++;
      }

      keys = Object.getOwnPropertyNames(counter).sort();
      $(keys).each(function (index, value) {
        //  //console.log(value);
        var arr = [];
        arr.push(value);
        arr.push(counter[value]);
        ////console.log(arr);
        rendergrafica.push(arr);
      });

      //console.log(rendergrafica);
      return (rendergrafica);
    }).then(function (render) {
      // Load the Visualization API and the corechart package.
      //google.charts.load('current', { 'packages': ['corechart', 'table'] });

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart); google.charts.setOnLoadCallback(drawTable);

      // Callback that creates and populates a data labsle,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(rendergrafica);

        // Set chart options
        var options = {
          'title': 'Cantidad de laboratorios por categoria',


        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);

      }
      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Sede');
        data.addColumn('number', 'laboratorios');
        data.addRows(render);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, { showRowNumber: true , width: '100%' });
      }
    });


  });
  //******************************************************************************************************************
  $('#menu-ensayos').on('click', function () {// genera grafica pruebas por escuelas
    $('#chart_div').html(''); $('#table_div').html('');

    var counter = {};
    var keys = [];
    var rendergrafica = [];


    db.ref("ensayos").orderByChild('nombre_laboratorio').once("value").then(function (pruebas) {
      var labs = [];
      //  //console.log(pruebas.val());
      var $obj = pruebas.val();
      pruebas.forEach(function (snap) {
        //    //console.log(index);
        labs.push(snap.val().nombre_laboratorio);

      });


      for (var i = 0; i < labs.length; i++) {
        if (!counter[labs[i]]) {
          counter[labs[i]] = 0;
        }
        counter[labs[i]]++;
      }

      keys = Object.getOwnPropertyNames(counter).sort();
      $(keys).each(function (index, value) {
        //  //console.log(value);
        var arr = [];
        arr.push(value);
        arr.push(counter[value]);
        ////console.log(arr);
        rendergrafica.push(arr);
      });

      ////console.log(rendergrafica);
      return (rendergrafica);

    }).then(function (render) {

      // Load the Visualization API and the corechart package.
      //google.charts.load('current', { 'packages': ['corechart', 'table'] });

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart); google.charts.setOnLoadCallback(drawTable);

      // Callback that creates and populates a data labsle,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(rendergrafica);

        // Set chart options
        var options = {
          'title': 'cantidad de pruebas por laboratorio',


        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);

      }
      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'laboratorio');
        data.addColumn('number', 'cant(pruebas)');
        data.addRows(render);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, { showRowNumber: true, width: '100%' });
      }


    });
  });

});
