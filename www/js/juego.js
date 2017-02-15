var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    DIAMETRO_MURO = 50;

    var xObjetivo;

    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    var groupMuro;
    muro = [];

    vida = 5;

    app.vigilaSensores();
    app.iniciaJuego();

  },

  iniciaJuego: function(){

    function preload() {
      // Arrancamos el motor de físicas de phaser, ARCADE qeu es el básico
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.stage.backgroundColor = "#7B7D7D"
      game.load.image('bola', 'assets/bola.png');
      game.load.image('wall', 'assets/wall.png');
      game.load.image('objetivo', 'assets/target.png');

    }

    function create() {
      scoreText = game.add.text(16, 16, vida, { fontSize:'80px', fill:'#17202A'});

      /*
      * BOLA
      */
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');

      //Indicamos que se aplique la física sobre la bola
      game.physics.arcade.enable(bola);

      //Al cuerpo de la bola le indicamos que gestione las colisiones con el borde de la pantalla
      bola.body.collideWorldBounds = true;
      //Cuando choque genera una señal
      bola.body.onWorldBounds = new Phaser.Signal();
      //a la señal, le añadimos el manejador
      // bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);

      /*
      * MURO
      */
      app.crearMuro();
      groupMuro = game.add.group();

      var xWall = Math.floor(ancho / 2) - DIAMETRO_MURO;
      for (i = 0; i < muro.length; i++) {
        //console.log('creando un muro ' + i);
        //game.add.sprite(xWall, (i * DIAMETRO_MURO), 'wall');

       if( muro[i][0]) {
         muroAux = game.add.sprite(xWall, (i * DIAMETRO_MURO), 'wall');
         game.physics.arcade.enable(muroAux);
         muroAux.body.immovable = true;
         //muro[i][1] = muroAux;
         groupMuro.add(muroAux);
         //groupMuro.create(xWall, (i * DIAMETRO_MURO), 'wall');

       }

      }

      /*
      * TARGET
      */
      xObjetivo = Math.floor(ancho / 2) + DIAMETRO_MURO;
      objetivo = game.add.sprite(xObjetivo, app.inicioY(), 'objetivo');

      //Indicamos que se aplique la física sobre la bola
      game.physics.arcade.enable(objetivo);

    }

    function update() {
      var factorDificultad = 300 ;
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));

      this.physics.arcade.collide(bola, groupMuro, null, null, this);


      this.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
/*
      for (i = 0; i < muro.length; i++) {
        if( muro[i][0]) {
          this.physics.arcade.collide(bola, muro[i][1], null, null, this);
        }
      }*/


      if(bola.body.checkWorldBounds()===false){
        game.stage.backgroundColor = "#7B7D7D";
      }else{
        game.stage.backgroundColor='#ff3300';
      }

    }


    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
  },


  inicioX: function(){
    // return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
    return 50;
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){

    function onError() {
        console.log('onError.!');
    }

    function onSuccess(datosAceleracion){
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });

  },


  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;

  },

  crearMuro : function(){
    var longitudMuro = (alto / 50);
    for (i = 0; i < longitudMuro; i++) {
      if (i <= 4 ){
        muro[i]= [true, null];

      } else if (i >= (longitudMuro-5)) {
        muro[i]= [true, null];

      } else {
        muro[i]= [false, null];
      }

    }

  },

  incrementaPuntuacion: function(){
    vida = vida + 1;
    scoreText.text = vida;
    //console.log('[LOG]='+ xObjetivo);
    if ( xObjetivo >= (Math.floor(ancho / 2)) ) {
      xObjetivo = Math.floor(ancho / 2) - (DIAMETRO_MURO*3);
    } else {
      xObjetivo = Math.floor(ancho / 2) + DIAMETRO_MURO;
    }

    objetivo.body.x = xObjetivo;
    objetivo.body.y = app.inicioY();


  },

  wallCollision : function(){
    vida = vida - 1;
    scoreText.text = vida;
  },






};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
