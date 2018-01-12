function begin() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyAc9AuWxaPIskS0LLAZ6eRYS9lKHQ0y1IQ',
    authDomain: 'paralnd-79303.firebaseapp.com',
    databaseURL: 'https://paralnd-79303.firebaseio.com',
    projectId: 'paralnd-79303',
    storageBucket: '',
    messagingSenderId: '161516922175'
  };

  firebase.initializeApp(config);

  var refConvalidaciones = firebase.database().ref().child('convalidaciones');

  var $formConvalidaciones = $('#form-convalidaciones');
  var $tbodyTablaConvalidaciones = $('#tbody-tabla-convalidaciones');
  var $moduloConvalidar = $('#modulo-a-convalidar');
  var $cicloConvalidar = $('#ciclo-a-convalidar');
  var $moduloAportado = $('#modulo-aportado');
  var $cicloAportado = $('#ciclo-aportado');
  var $botonSubmit = $('#boton-enviar-convalidacion');

  var CREATE = 'Crear convalidacion';
  var UPDATE = 'Modificar convalidacion';
  var modo = CREATE;
  var refConvalidacionEditar;

  $formConvalidaciones.on('submit', createEditConvalidacion);
  $tbodyTablaConvalidaciones.on('click', action);

  mostrarConvalidaciones();

  function mostrarConvalidaciones() {
    refConvalidaciones.on('value', function(snapshot) {
      var datos = snapshot.val();
      var filasAMostrar = '';

      for (var key in datos) {
        filasAMostrar += '<tr>' +
          '<td>' + datos[key].moduloConvalidar + '</td>' +
          '<td>' + datos[key].cicloConvalidar + '</td>' +
          '<td>' + datos[key].moduloAportado + '</td>' +
          '<td>' + datos[key].cicloAportado + '</td>' +
          '<td></td>' +
          '<td>' +
          '<button data-convalidacion="' + key + '" class="btn btn-primary editar">' +
          '<span class="glyphicon glyphicon-edit"></span>' +
          '</button>' +
          '</td>' +
          '<td>' +
          '<button data-convalidacion="' + key + '" class="btn btn-danger borrar">' +
          '<span class="glyphicon glyphicon-trash"></span>' +
          '</button>' +
          '</td>' +
          '</tr>';
      }
      $tbodyTablaConvalidaciones.html(filasAMostrar);
    });
  }

  function action(event) {
    if (event.target.parentElement.tagName === 'BUTTON') {
      if ($(event.target.parentElement).hasClass('borrar')) {
        borrarConvalidacion($(event.target.parentElement).data('convalidacion'));
      } else if ($(event.target.parentElement).hasClass('editar')) {
        editarConvalidacion($(event.target.parentElement).data('convalidacion'));
      }
    }
  }

  function borrarConvalidacion(strKey) {
    refConvalidaciones.child(strKey).remove();
  }

  function editarConvalidacion(strKey) {
    refConvalidacionEditar = refConvalidaciones.child(strKey);

    refConvalidacionEditar.once('value', function(snapshot) {
      var data = snapshot.val();

      $moduloConvalidar.val(data.moduloConvalidar);
      $cicloConvalidar.val(data.cicloConvalidar);
      $moduloAportado.val(data.moduloAportado);
      $cicloAportado.val(data.cicloAportado);
    });

    $botonSubmit.val(UPDATE);
    modo = UPDATE;
  }

  function createEditConvalidacion(event) {
    event.preventDefault();

    switch (true) {
    case (modo === CREATE):
      refConvalidaciones.push({
        moduloConvalidar: event.target.moduloAConvalidar.value,
        cicloConvalidar: event.target.cicloAConvalidar.value,
        moduloAportado: event.target.moduloAportado.value,
        cicloAportado: event.target.cicloAportado.value
      });
      break;
    case (modo === UPDATE):
      refConvalidacionEditar.update({
        moduloConvalidar: event.target.moduloAConvalidar.value,
        cicloConvalidar: event.target.cicloAConvalidar.value,
        moduloAportado: event.target.moduloAportado.value,
        cicloAportado: event.target.cicloAportado.value
      });

      $botonSubmit.val(CREATE);
      modo = CREATE;
      break;
    }
    $formConvalidaciones[0].reset();
  }
};

$(document).ready(begin);
