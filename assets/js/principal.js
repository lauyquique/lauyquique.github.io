/* =========================================================================
   Boda Lau y Quique — JavaScript de la web
   Todo lo que hay aquí es OPCIONAL: si el navegador no ejecuta JavaScript,
   la web sigue mostrando toda la información esencial.
   Sin librerías, sin dependencias, sin cookies, sin analítica.
   ========================================================================= */
(function () {
  'use strict';

  var FECHA_BODA = new Date('2027-03-13T13:00:00+01:00');

  /* --- 1. Barra superior: aparece al pasar la portada ------------------- */
  function barraSuperior() {
    var barra = document.getElementById('barra');
    var portada = document.getElementById('portada');
    if (!barra || !portada) return;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        barra.classList.toggle('visible', !entradas[0].isIntersecting);
      }, { rootMargin: '-70px 0px 0px 0px' }).observe(portada);
    } else {
      barra.classList.add('visible');
    }
  }

  /* --- 2. Cuenta atrás discreta ---------------------------------------- */
  function cuentaAtras() {
    var caja = document.getElementById('cuentaatras');
    if (!caja) return;

    function plural(n, singular, prural) { return n + ' ' + (n === 1 ? singular : prural); }

    function pintar() {
      var ahora = new Date();
      var ms = FECHA_BODA - ahora;
      var dias = Math.ceil(ms / 86400000);

      if (ms < -12 * 3600000) { caja.hidden = true; return; }   // pasada la boda
      caja.hidden = false;

      if (dias <= 0) {
        caja.innerHTML = '<b>Hoy nos casamos.</b>';
      } else if (dias === 1) {
        caja.innerHTML = 'Mañana es el día.';
      } else if (dias <= 45) {
        caja.innerHTML = 'Quedan <b>' + plural(dias, 'día', 'días') + '</b>.';
      } else {
        var meses = Math.round(dias / 30.44);
        caja.innerHTML = 'Quedan <b>' + plural(dias, 'día', 'días') + '</b> · algo menos de ' +
                         plural(meses, 'mes', 'meses') + '.';
      }
    }

    pintar();
    setInterval(pintar, 60000);
  }

  /* --- 3. Botón de copiar el IBAN -------------------------------------- */
  function copiarAlPortapapeles() {
    var boton = document.getElementById('copiar-iban');
    if (!boton) return;

    var destino = document.querySelector(boton.getAttribute('data-copiar'));
    if (!destino) return;

    var textoOriginal = boton.innerHTML;
    var temporizador = null;

    function confirmar(mensaje) {
      clearTimeout(temporizador);
      boton.innerHTML = mensaje;
      temporizador = setTimeout(function () { boton.innerHTML = textoOriginal; }, 2600);
    }

    boton.addEventListener('click', function () {
      // data-valor permite mostrar el IBAN con espacios y copiarlo sin ellos
      var texto = (destino.getAttribute('data-valor') || destino.textContent || '').trim();

      function respaldo() {
        // Si el portapapeles no está disponible, seleccionamos el texto
        // para que la persona pueda copiarlo a mano.
        try {
          var rango = document.createRange();
          rango.selectNodeContents(destino);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(rango);
          confirmar('Selecciónalo y copia');
        } catch (e) {
          confirmar('Cópialo a mano');
        }
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(function () {
          confirmar('¡Copiado!');
        }, respaldo);
      } else {
        respaldo();
      }
    });
  }

  /* --- 4. Sección activa en el menú de escritorio ----------------------- */
  function seccionActiva() {
    var enlaces = document.querySelectorAll('.barra__nav a');
    if (!enlaces.length || !('IntersectionObserver' in window)) return;

    var mapa = {};
    Array.prototype.forEach.call(enlaces, function (a) {
      var id = a.getAttribute('href').slice(1);
      var seccion = document.getElementById(id);
      if (seccion) { mapa[id] = a; }
    });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var a = mapa[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Array.prototype.forEach.call(enlaces, function (x) { x.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
          a.style.color = 'var(--marino)';
        } else {
          a.style.color = '';
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(mapa).forEach(function (id) {
      observador.observe(document.getElementById(id));
    });
  }

  /* --- Arranque --------------------------------------------------------- */
  barraSuperior();
  cuentaAtras();
  copiarAlPortapapeles();
  seccionActiva();
})();
