window.onload = function(){
//Some predefined functions for simplicity
  function loadThenDisplayImage (src, sx,sy,dw,dh) {
    var image = new Image(dw,dh);
    image.onload = function(e) {
         context.drawImage(this, sx,sy,dw,dh);
    }
    image.src = src;
  }
  function loadThenDisplayImage2 (id,sx,sy,dw,dh,zlevel) {
    var image = document.getElementById(id);
    image.style.position="absolute";
    image.style.left=sx+"px";
    image.style.top=sy+"px";
    image.style.width=dw+"px";
    image.style.height=dh+"px";
    image.style.display='';
    image.style.zIndex=""+zlevel;
  }

   const sealevel=10;
   /*
   const tabledic={
     S:{gauche:W,oppo:N,droit:E},
     W:{gauche:N,oppo:E,droit:S},
     N:{gauche:E,oppo:S,droit:W},
     E:{gauche:S,oppo:W,droit:N}}
     */
   //socket for communication

   //socket=io();
  //Cards shown on the table
   var chambrename='testroom';
   var gameMessage;
   var mylocation;
   var leftplayer='孙聚';
   var rightplayer='黄聚';
   var oppositeplayer='李超';
   var colorofthisturn='D';
   var toplay='NA';

   var turnsleft=8;
   var handcardsleft=['H3','C4','C5','CJ','DQ','CA','CQ','CK'];
   var mypointcards=['H2','HK'];
   var leftpoint=['H6'];
   var oppositepoint=['H4','HJ','HQ','SQ'];
   var rightpoint=['H5','HA','JG'];
   var lastroundleft='SA';
   var lastroundright='S10';
   var lastroundme='S3';
   var lastroundopposite='S5';
   var CW=1200;
   var CH=600;
   var cardwidth=75;
   var cardheight=105;
   var itemssurtable=[];

  drawcards = function(){
     //player's cards:
     var hinterval=CW/12;
     var hstartx=CW*7/16-hinterval*turnsleft*0.5;
     var hendx=CW*7/16+hinterval*turnsleft*0.5;
     var startlevel=sealevel+1;
     if (hendx>0.6*CW){
       hstartx=CW*7/8-0.6*CW;
       hinterval=CW*(0.6-7/16)/(0.5*turnsleft);
       hendx=0.6*CW;
     }
     hstarty=CH*0.98-cardheight;

     //draw the hand
     loadThenDisplayImage2('handpic', hstartx-0.01*CW,hstarty-0.02*CH,1.01*(hinterval*(turnsleft-1)+cardwidth)+0.02*CW,1.2*cardheight,startlevel);
     itemssurtable.push('handpic');
     startlevel++;
     for (var i=0;i<turnsleft;i++){
        loadThenDisplayImage2('cd'+handcardsleft[i], hstartx+hinterval*i,hstarty,cardwidth,cardheight,startlevel);
        itemssurtable.push('cd'+handcardsleft[i]);
        startlevel++;
        //document.getElementById('cd'+handcardsleft[i]).addEventListener("click", showcontent(handcardsleft[i]));
      }

      //player's point cards
      var ptl=mypointcards.length;
      startlevel=sealevel+1;
      if (ptl>0){
        var ptstartx=hendx*1.1;
        var ptinterval=CW*5/8/(ptl);

        if (ptstartx+ptl*ptinterval>7*CW/8){
            ptinterval=(7*CW/8-ptstartx)/ptl;
        }

        var ptstarty=hstarty;
        for (var i=0;i<ptl;i++){
           //console.log('asset/images/pukeImage/'+handcardsleft[i]+'.jpg; startx:'+Number(startx+interval*i)+'; starty:'+starty);
           loadThenDisplayImage2('cd'+mypointcards[i], Number(ptstartx)+Number(ptinterval*i),ptstarty,cardwidth,cardheight,startlevel);
           itemssurtable.push('cd'+mypointcards[i]);
           startlevel++;
         }
      }
      //player's last round played cards:
      if (lastroundme!='NA'){
        loadThenDisplayImage2('cd'+lastroundme,CW/2-cardwidth/2,(CH-2*cardheight)*0.9,cardwidth,cardheight,sealevel+1);
        itemssurtable.push('cd'+lastroundme);
      }

      //left player's point cards:
      var lptl=leftpoint.length;
      startlevel=sealevel+1;
      if (lptl>0){
        var lptstartx=0;
        var lptinterval=CW/12;

        if (lptl*lptinterval>CW/8){
            lptinterval=CW/8/lptl;
        }

        var lptstarty=CH*0.3;
        for (var i=0;i<lptl;i++){
           loadThenDisplayImage2('cd'+leftpoint[i], Number(lptstartx)+Number(lptinterval*i),lptstarty,cardwidth,cardheight,startlevel);
           itemssurtable.push('cd'+leftpoint[i]);
           startlevel++;
         }
      }
      if (lastroundleft!='NA'){
        loadThenDisplayImage2('cd'+lastroundleft,CW*0.15, (CH/2-0.5*cardheight),cardwidth,cardheight,sealevel+1);
        itemssurtable.push('cd'+lastroundleft);
      }


      //right player's point drawcardsvar lptl=leftpoint.length;
      var rptl=rightpoint.length;
      startlevel=sealevel+1;
      if (rptl>0){
        var rptstartx=CW*7/8;;
        var rptinterval=CW/12;

        if (rptl*rptinterval>CW/8){
            rptinterval=CW/8/rptl;
        }

        var rptstarty=CH*0.3;
        for (var i=0;i<lptl;i++){
           loadThenDisplayImage2('cd'+rightpoint[i], Number(rptstartx)+Number(rptinterval*i),rptstarty,cardwidth,cardheight,startlevel);
           startlevel++;
           itemssurtable.push('cd'+rightpoint[i]);
         }
      }
      if (lastroundright!='NA'){
        loadThenDisplayImage2('cd'+lastroundright,CW*0.85-cardwidth, (CH/2-0.5*cardheight),cardwidth,cardheight,sealevel+1);
        itemssurtable.push('cd'+lastroundright);
      }

      var optl=oppositepoint.length;
      startlevel=sealevel+1;
      if (optl>0){
        var optstartx=CW/4;;
        var optinterval=CW/12;

        if (optl*optinterval>CW/2){
            optinterval=CW/2/optl;
        }

        var optstarty=CH*0.02;
        for (var i=0;i<optl;i++){
           loadThenDisplayImage2('cd'+oppositepoint[i], Number(optstartx)+Number(optinterval*i),optstarty,cardwidth,cardheight,startlevel);
           startlevel++;
           itemssurtable.push('cd'+oppositepoint[i]);
         }
      }
      if (lastroundopposite!='NA'){
        loadThenDisplayImage2('cd'+lastroundopposite,CW/2-cardwidth/2, (1.12*cardheight),cardwidth,cardheight,sealevel+1);
        itemssurtable.push('cd'+lastroundopposite);
      }
     }

  clearitems = function() {
   //alert(itemssurtable.length);
   //console.log('itemssurtable has '+itemssurtable.length+'elements');
   for (var i=0;i< itemssurtable.length; i++){
     var oneitem = document.getElementById(itemssurtable[i]);
     oneitem.style.display='none';
   }
   for (var i=0;i< itemssurtable.length; i++){
     itemssurtable.pop();
   }
 }

  updatesoletable = function(){
  clearitems();
  document.getElementById('gamemsg').style.display='';
  document.getElementById('gamemsg').innerHTML=gameMessage;
  document.getElementById('canclebutton').style.display='';
  document.getElementById('confirmbutton').style.display='none';
}

  updategametable = function(){
    clearitems();
    document.getElementById('gamemsg').style.display='';
    document.getElementById('gamemsg').innerHTML=gameMessage;
    document.getElementById('canclebutton').style.display='none';
    document.getElementById('confirmbutton').style.display='none';
    drawcards();
  }

  updategametablethinking = function(){
  clearitems();
  drawcards();
  document.getElementById('gamemsg').style.display='';
  document.getElementById('canclebutton').style.display='none';
  document.getElementById('confirmbutton').style.display='none';
}

  updategametabletodecidepage = function(){
  clearitems();
  drawcards();
  document.getElementById('canclebutton').style.display='none';
  document.getElementById('confirmbutton').style.display='';
  document.getElementById('gamemsg').style.display='';
  document.getElementById('gamemsg').innerHTML=gameMessage;
}

  updatemainpage = function(){
  clearitems();
  document.getElementById("mainpageDiv").style.display = '';
  document.getElementById("gamepageDiv").style.display = 'none'
}

  grandupdate = function(){
  if (gamestate == 'mainpage'){
    document.getElementById("mainpageDiv").style.display = '';
    document.getElementById("gamepageDiv").style.display = 'none';
    updatemainpage();
  }
  if (gamestate == 'inroom'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    updatesoletable();
  }
  if (gamestate == 'ingame-wait'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    updategametable();
  }
  if (gamestate == 'ingame-thinking'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    updategametablethinking();
  }
  if (gamestate == 'ingame-todecide'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    updategametabletodecidepage();
  }
  if (gamestate == 'ingame-gameover'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    updategametabletodecidepage();
  }
}

  //socket event handler
  socket.on('login_suc',function (data){
      mylocation = data.yourloc;
      chambrename = data.room;
      var splayer='empty';
      var eplayer='empty';
      var nplayer='empty';
      var wplayer='empty';
      if (data.players.length>0){
        splayer=data.players[0];
      }
      if (data.players.length>1){
        eplayer=data.players[1];
      }
      if (data.players.length>2){
        nplayer=data.players[2];
      }
      if (data.players.length>3){
        wplayer=data.players[3];
      }

      if (mylocation=='S'){
        leftplayer=wplayer;
        oppositeplayer=nplayer;
        rightplayer=eplayer;
      }
      else if (mylocation=='W') {
        leftplayer=nplayer;
        oppositeplayer=eplayer;
        rightplayer=splayer;
      }
      else if (mylocation=='N') {
      leftplayer=wplayer;
      oppositeplayer=splayer;
      rightplayer=eplayer;
    }
      else if (mylocation=='E') {
      leftplayer=nplayer;
      oppositeplayer=wplayer;
      rightplayer=splayer;
    }
      gameMessage='<h2>You entered room' + chambrename + '. There are'+data.players.length+' players.  Click cancle to exit</h2>';
      gamestate='inroom';
      grandupdate();
  })

  socket.on('newplayer',function (data){
      var splayer='empty';
      var eplayer='empty';
      var nplayer='empty';
      var wplayer='empty';
      if (data.players.length>0){
        splayer=data.players[0];
      }
      if (data.players.length>1){
        eplayer=data.players[1];
      }
      if (data.players.length>2){
        nplayer=data.players[2];
      }
      if (data.players.length>3){
        wplayer=data.players[3];
      }

      if (mylocation=='S'){
        leftplayer=wplayer;
        oppositeplayer=nplayer;
        rightplayer=eplayer;
      }
      else if (mylocation=='W') {
        leftplayer=nplayer;
        oppositeplayer=eplayer;
        rightplayer=splayer;
      }
      else if (mylocation=='N') {
      leftplayer=wplayer;
      oppositeplayer=splayer;
      rightplayer=eplayer;
    }
      else if (mylocation=='E') {
      leftplayer=nplayer;
      oppositeplayer=wplayer;
      rightplayer=splayer;
    }
      //numberofplayers=0;

      gameMessage='<h2>New player entered room. There are '+data.players.length+' players now.</h2>';
      gamestate='inroom';
      grandupdate();
  })

  socket.on('shuffle',function (data){
      handcardsleft=data.cards;
      turnsleft=handcardsleft.length;
      mypointcards=[];
      leftpoint=[];
      oppositepoint=[];
      rightpoint=[];
      lastroundleft='NA';
      lastroundright='NA';
      lastroundme='NA';
      lastroundopposite='NA';
      document.getElementById('hleftname').innerHTML='<h3>'+leftplayer+'</h3>'
      document.getElementById('hrightname').innerHTML='<h3>'+rightplayer+'</h3>'
      document.getElementById('hoppositename').innerHTML='<h3>'+oppositeplayer+'</h3>'
      gameMessage='<h2>Game started </h2>';
      gamestate='ingame-wait';
      grandupdate();
  })

  socket.on('tableupdate',function (data){
      if (mylocation==S){
        mypointcards=data.spoints;
        leftpoint=data.wpoints;
        oppositepoint=data.npoints;
        rightpoint=data.epoints;

        lastroundme=data.splay;
        lastroundleft=data.wplay;
        lastroundopposite=data.nplay;
        lastroundright=data.eplay;
    }
      else if (mylocation==W) {
        mypointcards=data.wpoints;
        leftpoint=data.npoints;
        oppositepoint=data.epoints;
        rightpoint=data.spoints

        lastroundme=data.wplay;
        lastroundleft=data.nplay;
        lastroundopposite=data.eplay;
        lastroundright=data.splay;
    }
      else if (mylocation==N) {
        mypointcards=data.npoints;
        leftpoint=data.epoints;
        oppositepoint=data.epoints;
        rightpoint=data.wpoints;

        lastroundme=data.nplay;
        lastroundleft=data.eplay;
        lastroundopposite=data.eplay;
        lastroundright=data.wplay;
    }
      else if (mylocation==E) {
        mypointcards=data.epoints;
        leftpoint=data.spoints;
        oppositepoint=data.wpoints;
        rightpoint=data.npoints;

        lastroundme=data.eplay;
        lastroundleft=data.splay;
        lastroundopposite=data.wplay;
        lastroundright=data.nplay;
    }
      gameMessage='<h2>Card played </h2>';
      gamestate='ingame-waiting';
      grandupdate();
  })

  socket.on('yourturn',function (data){
      colorofthisturn=data.color;
      gameMessage='<h2>Your turn! </h2>';
      gamestate='ingame-thinking';
      grandupdate();
  })

  socket.on('trickend',function (data){
      //colorofthisturn=data.color;
      gameMessage='<h2>Trick ends, '+data.thiswinner+' get all cards </h2>';
      gamestate='ingame-waiting';
      grandupdate();
  })

  socket.on('gameend',function (data){
      gameMessage='<h2>Game over! </h2>';
      gamestate='ingame-gameover';
      grandupdate();
  })

  //click event handler
  checklegitimacy = function(cardclicked){
   var depleted=true;
   for(var i=0;i<handcardsleft.length;i++){
     //console.log(handcardsleft[i].slice(0,1));
     if(handcardsleft[i].slice(0,1)==colorofthisturn){
       depleted=false;
       break;
     }
   }
   if (depleted){
     return true;
   }
   if (cardclicked.slice(0,1)==colorofthisturn){
     return true;
   }
   return false;
 }

  cardclicked = function(whichcard){
   console.log('clicked: '+whichcard);
   if ((gamestate=='ingame-thinking')&&(handcardsleft.includes(whichcard))){
       var canplay=checklegitimacy(whichcard);
       if (canplay){
           document.getElementById('gamemsg').innerHTML='<h2>You are going to play '+whichcard+',legal choice </h2>';
           gamestate='ingame-todecide';
           toplay = whichcard;
           grandupdate();
       }
       else {
           document.getElementById('gamemsg').innerHTML='<h2>You are going to play '+whichcard+', illegal choice </h2>';
           grandupdate();
       }
   }
 }
  //button event handler
  signin = function(){
      if(gamestate=='mainpage'){
          var usernon=document.getElementById('usernameinput').value;
          var userpasswd=document.getElementById('passwordinput').value;
          var roomnum=document.getElementById('roomnumberinput').value;
          if(username!=''&&userpasswd!=''&roomnumber!=''){
              //socket.emit('login',{username: usernon, userpassword: userpasswd, roomnumber:roomnum });
          }
          else{
              alert('You left something empty!');
          }
      }
  }

  sorrylazy = function(){
      if(gamestate=='mainpage'){
          alert('Sorry! We are too lazy to implement this function. If you want to create a new account, please contact our operating staff. ')
          document.getElementById('hleftname').innerHTML='<h3>'+leftplayer+'</h3>'
          document.getElementById('hrightname').innerHTML='<h3>'+rightplayer+'</h3>'
          document.getElementById('hoppositename').innerHTML='<h3>'+oppositeplayer+'</h3>'
          gamestate='ingame-gameover';
          grandupdate();
      }
  }

  confirmed = function(){
      if (gamestate=='ingame-todecide'){
          gamestate='ingame-wait';
          gameMessage='<h2>Confirmed!</h2>'
          //socket.emit('mychoice',{card:toplay});
          grandupdate();
      }
      else if (gamestate=='ingame-gameover') {
          gamestate='mainpage';
          grandupdate();
      }
   }

  cancled = function(){
  if (gamestate=='ingame-todecide'){
    gamestate='ingame-thinking';
    grandupdate();
  }
  else if (gamestate=='inroom') {
    gamestate='mainpage';
    grandupdate();
  }
}

  document.getElementById("signinbutton").addEventListener("click", signin);
  document.getElementById("signupbutton").addEventListener("click", sorrylazy);

  var gamestate='mainpage';

}
//The game page
