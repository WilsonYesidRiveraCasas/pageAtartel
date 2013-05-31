var Demo={

  initialized: false,

  initialize: function() {

    if (this.initialized) return;
    this.initialized = true;

    this.build();
    this.events();

  },

  build: function() {

    this.validations();

  },

  events: function(){

    

  },
  runPolling:function(){
    setTimeout(this.pool,2000);

  },

  pool:function(){

    var that=this;

    $.ajax({
           type: "GET",
           url: '/call/'+this.idCall,
           dataType: 'json',
           beforeSend: function(xhr) {
               xhr.setRequestHeader("Accept", "application/json");
               xhr.setRequestHeader('Content-Type','application/json');
           },
        }).done(function(data) {

              $(".estadoLlamada").html("Estado de la LLamda: "+data.state);

              if(data.state!='queue'){
                that.runPolling();
              }              

              $('.output').val('Su llamada ha sido encolada satisfactoriamente : id de llamada : ' + data.idCall);

        }).error(function(data, info) {
               $('.output').val('Ha ocurrido un error al intentar encolar llamada ');  
        });
  },

  validations: function() {

    var that=this;

    $("#demoForm").validate({
      submitHandler: function(form) {

        var number=$("#numero").val();
        var tipo=$("#tipoPrueba").val();

        $.ajax({
           type: "POST",
           url: '/call',
           data: JSON.stringify({number : number, user : 'permoda', type: tipo}),
           dataType: 'json',
           beforeSend: function(xhr) {
               xhr.setRequestHeader("Accept", "application/json");
               xhr.setRequestHeader('Content-Type','application/json');
           },
        }).done(function(data) {

              $(".estadoLlamada").show();
              that.idCall=data.idCall;
              that.runPolling();

               $('.output').val('Su llamada ha sido encolada satisfactoriamente : id de llamada : ' + data.idCall);
        }).error(function(data, info) {
               $('.output').val('Ha ocurrido un error al intentar encolar llamada ');  
        });
      },
      rules: {
        numero: {
          required: true
        },
        tipoPrueba: {
          required: true
        }
      },
      highlight: function (element) {
        $(element)
          .closest(".control-group")
          .removeClass("success")
          .addClass("error");
      },
      success: function (element) {
        $(element)
          .closest(".control-group")
          .removeClass("error")
          .addClass("success");
      }
    });

  }

};


Demo.initialize();