window.onload = function(){


  function deepClone(obj){
           //判断obj是否是数组
        let objClone = Array.isArray(obj)?[]:{};
        if(obj && typeof obj==="object"){
            for(key in obj){
                if(obj.hasOwnProperty(key)){
                    //判断ojb子元素是否为对象，如果是，递归复制
                    if(obj[key]&&typeof obj[key] ==="object"){
                        objClone[key] = deepClone(obj[key]);
                    }else{
                        //如果不是，简单复制
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    }
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
   const numtoloc=['S','W','N','E'];
   var numberofplayer=4;
   /*
   const tabledic={
     S:{gauche:W,oppo:N,droit:E},
     W:{gauche:N,oppo:E,droit:S},
     N:{gauche:E,oppo:S,droit:W},
     E:{gauche:S,oppo:W,droit:N}}
     */
   //socket for communication

   var socket=io();
  //Cards shown on the table
   var chambrename='testroom';
   var myname='Dieu';
   var isgod = true;
   var mypassword;
   var gameMessage;
   var mylocation=0;
   var leftplayer='empty';
   var rightplayer='empty';
   var oppositeplayer='empty';
   var colorofthisturn='D';
   var previousclick='NA';
   var toplay='NA';

   var turnsleft=8;
   var handcardsleft=['H3','C4','C5','CJ','DQ','CA','CQ','CK'];
   var mypointcards=['H2','HK'];
   var leftpoint=['H6'];
   var oppositepoint=['H4','HJ','HQ','SQ'];
   var rightpoint=['H5','HA','JG'];
   var lefthand = ['C6','H7','C10','D2','D3','D4','D5','D6','D7'];
   var oppositehand = ['H8','H9','D8','D9'];
   var righthand = ['H10','C2','C3'];
   var lastroundleft='SA';
   var lastroundright='S10';
   var lastroundme='S3';
   var lastroundopposite='S5';
   var CW=1200;
   var CH=600;
   var cardwidth=75;
   var cardheight=105;
   var itemssurtable=[];
   var players_in_room=[['', false, true],['', false, true],['', false, true],['', false, true]];
   var timemessage = "";
   var timeremain = 30;
   var all_images = ['Miss.random', 'Miss.if', 'R18', 'Mr.Greed']
   const tout_direction = ['south', 'east', 'north', 'west']

   var image_clicked = [0,0,0,0];
   var add_robot_place = 0;
   var unseated = true;

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
     turnsleft=handcardsleft.length
     if (turnsleft>0){
       loadThenDisplayImage2('handpic', hstartx-0.01*CW,hstarty-0.02*CH,1.01*(hinterval*(turnsleft-1)+cardwidth)+0.02*CW,1.2*cardheight,startlevel);
       itemssurtable.push('handpic');
       startlevel++;
     }

     for (var i=0;i<handcardsleft.length;i++){
		//console.log('card to draw: '+handcardsleft[i]);
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

        if (lptl*lptinterval>CW*0.3-cardwidth){
            lptinterval=(CW*0.3-cardwidth)/lptl;
        }

        var lptstarty=CH*0.2;
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
        var rptstartx=CW*0.7;;
        var rptinterval=CW/12;

        if (rptl*rptinterval>CW*0.3-cardwidth){
            rptinterval=(CW*0.3-cardwidth)/rptl;
        }

        var rptstarty=CH*0.2;
        for (var i=0;i<rptl;i++){
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
  drawgodscards = function(){
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
        turnsleft=handcardsleft.length
        if (turnsleft>0){
          loadThenDisplayImage2('handpic', hstartx-0.01*CW,hstarty-0.02*CH,1.01*(hinterval*(turnsleft-1)+cardwidth)+0.02*CW,1.2*cardheight,startlevel);
          itemssurtable.push('handpic');
          startlevel++;
        }

        for (var i=0;i<handcardsleft.length;i++){
   		//console.log('card to draw: '+handcardsleft[i]);
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


         //left player's hand
         leftplayerleft=lefthand.length
         var hinterval=CW/12;
         var hstartx=CW*0.01;
         var hendx=CW*0.02+hinterval*leftplayerleft;
         var startlevel=sealevel+1;
         if (hendx>0.28*CW){
           hinterval=(CW*(0.28-0.02))/(leftplayerleft);
           hendx=0.28*CW;
         }
         hstarty=0.28*CH;


         if (leftplayerleft>0){
           loadThenDisplayImage2('handpic1', hstartx-0.01*CW,hstarty-0.02*CH,1.01*(hinterval*(leftplayerleft-1)+cardwidth)+0.02*CW,1.2*cardheight,startlevel);
           itemssurtable.push('handpic1');
           startlevel++;
         }

         for (var i=0;i<lefthand.length;i++){
    		//console.log('card to draw: '+handcardsleft[i]);
            loadThenDisplayImage2('cd'+lefthand[i], hstartx+hinterval*i,hstarty,cardwidth,cardheight,startlevel);
            itemssurtable.push('cd'+lefthand[i]);
            startlevel++;
            //document.getElementById('cd'+handcardsleft[i]).addEventListener("click", showcontent(handcardsleft[i]));
          }

         //left player's point cards:
         var lptl=leftpoint.length;
         startlevel=sealevel+1;
         if (lptl>0){
           var lptstartx=0;
           var lptinterval=CW/12;

           if (lptl*lptinterval>CW*0.3-cardwidth){
               lptinterval=(CW*0.3-cardwidth)/lptl;
           }

           var lptstarty=CH*0.5;
           for (var i=0;i<lptl;i++){
              loadThenDisplayImage2('cd'+leftpoint[i], Number(lptstartx)+Number(lptinterval*i),lptstarty,cardwidth,cardheight,startlevel);
              itemssurtable.push('cd'+leftpoint[i]);
              startlevel++;
            }
         }
         if (lastroundleft!='NA'){
           loadThenDisplayImage2('cd'+lastroundleft,CW*0.4, (CH/2-0.5*cardheight),cardwidth,cardheight,sealevel+1);
           itemssurtable.push('cd'+lastroundleft);
         }

         //right player's hand
         rightplayerleft=righthand.length
         var hinterval=CW/12;
         var hstartx=CW*0.7;
         var hendx=CW*0.7+hinterval*leftplayerleft;
         var startlevel=sealevel+1;
         if (hendx>0.9*CW){
           hinterval=CW*(0.2)/(leftplayerleft);
           hendx=0.9*CW;
         }
         hstarty=0.28*CH;


         if (rightplayerleft>0){
           loadThenDisplayImage2('handpic2', hstartx-0.01*CW,hstarty-0.02*CH,1.01*(hinterval*(rightplayerleft-1)+cardwidth)+0.02*CW,1.2*cardheight,startlevel);
           itemssurtable.push('handpic2');
           startlevel++;
         }

         for (var i=0;i<righthand.length;i++){
         //console.log('card to draw: '+handcardsleft[i]);
            loadThenDisplayImage2('cd'+righthand[i], hstartx+hinterval*i,hstarty,cardwidth,cardheight,startlevel);
            itemssurtable.push('cd'+righthand[i]);
            startlevel++;
            //document.getElementById('cd'+handcardsleft[i]).addEventListener("click", showcontent(handcardsleft[i]));
          }
         //right player's point drawcardsvar lptl=leftpoint.length;
         var rptl=rightpoint.length;
         startlevel=sealevel+1;
         if (rptl>0){
           var rptstartx=CW*0.7;;
           var rptinterval=CW/12;

           if (rptl*rptinterval>CW*0.2){
               rptinterval=(CW*0.2)/rptl;
           }

           var rptstarty=CH*0.5;
           for (var i=0;i<rptl;i++){
              loadThenDisplayImage2('cd'+rightpoint[i], Number(rptstartx)+Number(rptinterval*i),rptstarty,cardwidth,cardheight,startlevel);
              startlevel++;
              itemssurtable.push('cd'+rightpoint[i]);
            }
         }
         if (lastroundright!='NA'){
           loadThenDisplayImage2('cd'+lastroundright,CW*0.6-cardwidth, (CH/2-0.5*cardheight),cardwidth,cardheight,sealevel+1);
           itemssurtable.push('cd'+lastroundright);
         }

         // opposite player's hand
         oppoturnsleft = oppositehand.length;
         var hinterval=CW/12;
         var hstartx=CW*7/16-hinterval*oppoturnsleft*0.5;
         var hendx=CW*7/16+hinterval*oppoturnsleft*0.5;
         var startlevel=sealevel+1;
         if (hendx>0.6*CW){
           hstartx=CW*7/8-0.6*CW;
           hinterval=CW*(0.6-7/16)/(0.5*oppoturnsleft);
           hendx=0.6*CW;
         }
         hstarty=CH*0.02;

         //draw the hand

         if (oppoturnsleft>0){
           loadThenDisplayImage2('handpic3', hstartx-0.01*CW,hstarty-0.02*CH,1.01*(hinterval*(oppoturnsleft-1)+cardwidth)+0.02*CW,1.2*cardheight,startlevel);
           itemssurtable.push('handpic3');
           startlevel++;
         }

         for (var i=0;i<oppoturnsleft;i++){
    		//console.log('card to draw: '+handcardsleft[i]);
            loadThenDisplayImage2('cd'+oppositehand[i], hstartx+hinterval*i,hstarty,cardwidth,cardheight,startlevel);
            itemssurtable.push('cd'+oppositehand[i]);
            startlevel++;
            //document.getElementById('cd'+handcardsleft[i]).addEventListener("click", showcontent(handcardsleft[i]));
          }

         // opposite player's points

         var optl=oppositepoint.length;
         startlevel=sealevel+1;
         if (optl>0){
           var optstartx=hendx*1.1;
           var optinterval=CW*5/8/(optl);

           if (optstartx+optl*optinterval>7*CW/8){
               optinterval=(7*CW/8-optstartx)/optl;
           }

           var optstarty=CH*0.02;
           for (var i=0;i<optl;i++){
              loadThenDisplayImage2('cd'+oppositepoint[i], Number(optstartx)+Number(optinterval*i),optstarty,cardwidth,cardheight,startlevel);
              startlevel++;
              itemssurtable.push('cd'+oppositepoint[i]);
            }
         }
         if (lastroundopposite!='NA'){
           loadThenDisplayImage2('cd'+lastroundopposite,CW/2-cardwidth/2, (1.3*cardheight),cardwidth,cardheight,sealevel+1);
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
  update_player_images_and_names = function(){
    for(var i=0;i<4;i++){
      if(players_in_room[i][0]!=''){
        name=players_in_room[i][0].slice(0,players_in_room[i][0].length-1);
        console.log('name is:'+name);
        index = all_images.indexOf(name);
        if(index>-0.5){
          document.getElementById(tout_direction[i]+'playerimage').src = "asset/images/aiimage/"+name+".png"
        }
        else{
          document.getElementById(tout_direction[i]+'playerimage').src = "asset/images/aiimage/playermale.png"
        }
        document.getElementById(tout_direction[i]+'playername').innerHTML=tout_direction[i]+":"+players_in_room[i][0]
      }
      else{
        document.getElementById(tout_direction[i]+'playername').innerHTML="Empty"
        if (i%2==0){
          document.getElementById(tout_direction[i]+'playerimage').src = "asset/images/aiimage/noirfemme.png"
        }
        else{
          document.getElementById(tout_direction[i]+'playerimage').src = "asset/images/aiimage/noirhomme.png"
        }
      }
      if(players_in_room[i][2]){
        document.getElementById(tout_direction[i]+'add').innerHTML = "Remove robot";
      }
      else{
        document.getElementById(tout_direction[i]+'add').innerHTML = "Add new robot";
      }
    }
  }
  updatesoletable = function(){
  clearitems();
  document.getElementById('gamemsg').style.display='';
  document.getElementById('gamemsg').innerHTML=gameMessage;
  document.getElementById('canclebutton').style.display='none';
  document.getElementById('exitbutton').style.display='';
  document.getElementById('confirmbutton').style.display='none';
}

  updatehallpage = function(){
      ask_for_room_list()
  }
  updategameroom = function(){
      update_player_images_and_names()
  }
  updategametable = function(){
    clearitems();
    document.getElementById('gamemsg').style.display='';
    document.getElementById('gamemsg').innerHTML=gameMessage;
    document.getElementById('canclebutton').style.display='none';
    document.getElementById('exitbutton').style.display='none';
    document.getElementById('confirmbutton').style.display='none';
    if(isgod){
      drawgodscards();
    }
    else{
      drawcards();
    }

  }

  updategametablethinking = function(){
  clearitems();
  if(isgod){
    drawgodscards();
  }
  else{
    drawcards();
  }
  document.getElementById('gamemsg').style.display='';
  document.getElementById('gamemsg').innerHTML=gameMessage;
  document.getElementById('canclebutton').style.display='none';
  document.getElementById('exitbutton').style.display='none';
  document.getElementById('confirmbutton').style.display='none';
}

  updategametabletodecidepage = function(){
  //clearitems();
  //drawcards();
  document.getElementById('canclebutton').style.display='';
  document.getElementById('confirmbutton').style.display='';
  document.getElementById('exitbutton').style.display='none';
  document.getElementById('gamemsg').style.display='';
  document.getElementById('gamemsg').innerHTML=gameMessage;
}

  updatemainpage = function(){
  clearitems();
}

  grandupdate = function(){
  if (gamestate == 'mainpage'){
    document.getElementById("mainpageDiv").style.display = '';
    document.getElementById("gamepageDiv").style.display = 'none';
    document.getElementById("roompageDiv").style.display = 'none';
    document.getElementById("hallpageDiv").style.display = 'none';
    updatemainpage();
  }
  else if (gamestate == 'inhall') {
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("roompageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = 'none';
    document.getElementById("hallpageDiv").style.display = '';
    updatehallpage();
  }
  else if (gamestate == 'inroom'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("roompageDiv").style.display = '';
    document.getElementById("gamepageDiv").style.display = 'none';
    document.getElementById("hallpageDiv").style.display = 'none';
    updategameroom()
    //updatesoletable();
  }
  else if (gamestate == 'ingame-wait'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    document.getElementById("roompageDiv").style.display = 'none';
    document.getElementById("hallpageDiv").style.display = 'none';
    updategametable();
  }
  else if (gamestate == 'ingame-thinking'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    document.getElementById("roompageDiv").style.display = 'none';
    document.getElementById("hallpageDiv").style.display = 'none';
    updategametablethinking();
  }
  else if (gamestate == 'ingame-todecide'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    document.getElementById("roompageDiv").style.display = 'none';
    document.getElementById("hallpageDiv").style.display = 'none';
    updategametabletodecidepage();
  }
  else if (gamestate == 'ingame-gameover'){
    document.getElementById("mainpageDiv").style.display = 'none';
    document.getElementById("gamepageDiv").style.display = '';
    document.getElementById("roompageDiv").style.display = 'none';
    document.getElementById("hallpageDiv").style.display = 'none';
    updategametabletodecidepage();
  }
}

  //socket event handler
  socket.on('login_reply', function(rdata){
    var data = JSON.parse(rdata);
    gamestate = 'inhall'
    grandupdate();
  })

  socket.on('enter_room_reply', function(rdata){
    var data = JSON.parse(rdata);
    gamestate = 'inroom';
    readystate='unready';
    document.getElementById("setready").style.display = 'none';
    unseated = true;
    roomstate = data.game_state;
    nop = 0
    players_in_room = data.players;
    numberofplayer = players_in_room.length;
    //update_player_images_and_names();
    for (var i=0;i<4;i++){
      if (data.players[i][1]){
        nop++;
      }
    }
    if (roomstate=='started'){
      gameMessage='<h2>You entered room ' + chambrename + '. There are '+nop+' player(s).  The game has alresdy started</h2>';
    }
    else{
      gameMessage='<h2>You entered room ' + chambrename + '. There are '+nop+' player(s).  The room is'+roomstate+'</h2>';

    }
    document.getElementById("smalltitle").innerHTML=''+chambrename+'@'+myname;
    document.getElementById("nomdechambre").innerHTML='Room '+chambrename;

    grandupdate();
  })

  socket.on('player_info',function (rdata){
    var data=JSON.parse(rdata);
    players_in_room = data.players;
    console.log('players:',players_in_room);
    determine_relative_position();
    //updategameroom();
    grandupdate();
  })
  socket.on('create_room_reply', function(rdata){
    var data = JSON.parse(rdata);
    gamestate = 'inroom';
    readystate='unready';
    document.getElementById('setready').style.display = '';
    document.getElementById('setready').innerHTML = 'Ready';
    unseated = false;
    players_in_room = data.players;
    numberofplayer = players_in_room.length;
    chambrename = data.room_id;
    console.log(players_in_room[0][0]);
    document.getElementById("smalltitle").innerHTML=''+chambrename+'@'+myname;
    document.getElementById("nomdechambre").innerHTML='Room '+chambrename;
    determine_relative_position();
    grandupdate();
  })

  socket.on('new_game_reply', function(rdata){
    var data = JSON.parse(rdata);
    gamestate = 'inroom';
    readystate='unready';
    unseated = false;
    document.getElementById("setready").innerHTML = "Ready";
    grandupdate();
  })

  socket.on('loginsuc',function (rdata){
	  var data=JSON.parse(rdata);
      mylocation = data.your_loc;
      chambrename = data.room;
      document.getElementById("smalltitle").innerHTML=''+chambrename+'@'+myname;
      document.getElementById("nomdechambre").innerHTML='Room '+chambrename;
      gameMessage='<h2>You entered room ' + chambrename + '. There are '+data.players.length+' player(s).  Click exit to exit this room</h2>';

      gamestate='inroom';
      document.getElementById("hrightname").style.top="400px";
      for (var i=0;i<data.players.length;i++){
        if (i==0){
          document.getElementById("southplayername").innerHTML='South: '+data.players[i];
        }
        else if (i==1) {
          document.getElementById("westplayername").innerHTML='West: '+data.players[i];
        }
        else if (i==2) {
          document.getElementById("northplayername").innerHTML='North: '+data.players[i];
        }
        else if (i==3) {
          document.getElementById("eastplayername").innerHTML='East: '+data.players[i];
        }
      }
      if(data.players.length==2){
        if (myname==data.players[0]){
          rightplayer=data.players[1];
        }
        else{
          leftplayer=data.players[0];
        }
  	  }
      else if(data.players.length==3){
  		  leftplayer=data.players[(mylocation-1+numberofplayer)%numberofplayer];
        rightplayer=data.players[(mylocation+1)%numberofplayer];
  	  }
  	  else if(data.players.length==4){
  		  leftplayer=data.players[(mylocation-1+numberofplayer)%numberofplayer];
        rightplayer=data.players[(mylocation+1)%numberofplayer];
  		  oppositeplayer=data.players[(mylocation+2)%numberofplayer];
  	  }
      document.getElementById('hleftname').innerHTML='<h3>'+leftplayer+'</h3>'
      document.getElementById('hrightname').innerHTML='<h3>'+rightplayer+'</h3>'
      document.getElementById('hoppositename').innerHTML='<h3>'+oppositeplayer+'</h3>'

      grandupdate();
  })

  socket.on('request_room_list_reply',function (rdata){
    var data=JSON.parse(rdata);
    ROOM_STATE_DICT=['nonexist', 'available', 'full', 'started']
    content = ''
    for (var i=0; i<100;i++){
      if (data.list[i]!=0){
        content+='<div onclick="enterroom( ';
        content+=i;
        content+=' )">';
        content+='roomid: ';
        content+=i;
        content+='; roomstate: ';
        content+=ROOM_STATE_DICT[data.list[i]];
        content+='</div>'
      }
    }
    //content+='<div id="updateroombutton" onclick="ask_for_room_list()">Click to update</div>';
    document.getElementById('roominfotablet').innerHTML=content;
  })
  socket.on('request_robot_list_reply',function (rdata){
    console.log('robot list received');
    var data=JSON.parse(rdata);
    content = '<div>Robots available:</div>';
    for (var i=0; i<data.robot_list.length;i++){
      if (data.robot_list[i]!=0){
        content+='<div onclick="add_this_robot(\'';
        content+=data.robot_list[i];
        content+='\' )">';
        content+='robot name: ';
        content+=data.robot_list[i];
        content+='</div>';
      }
    }
    content+='<button id="cancle" class="button2" onclick="cancle_robot_list_page()">Cancle</button>';
    //console.log("content:", content);
    document.getElementById('robotinfo').innerHTML=content;
    if(gamestate=="inroom"){
      document.getElementById('robotinfo').style.display='';
    }


  })
  socket.on('leave_room_reply',function (rdata){
    var data=JSON.parse(rdata);
    gamestate='inhall';
    readystate='unready';
    unseated = true;
    console.log('received leave room reply');
    grandupdate();

  })

  socket.on('choose_place_reply',function (rdata){
    var data=JSON.parse(rdata);
    if(data.success){
      unseated= false;
      document.getElementById('setready').style.display = '';
      document.getElementById('setready').innerHTML = 'Ready';
      document.getElementById('roommessage').innerHTML='You sit down. Click ready if you are ready for game.';
    }

  })
  socket.on('ready_for_start_reply',function (rdata){
    var data=JSON.parse(rdata);
    readystate = 'ready'
    document.getElementById('setready').innerHTML='Unready'
  })
  socket.on('add_robot_reply',function (rdata){
    var data=JSON.parse(rdata);
    cancle_robot_list_page();
    if(data.success){
      document.getElementById('roommessage').innerHTML='Robot successfully added';
    }
    else{
      document.getElementById('roommessage').innerHTML='Fail to add robot';

    }
  })
  socket.on('ask_change_place_reply',function (rdata){
    var data=JSON.parse(rdata);
    cancle_robot_list_page();
    if(data.success){
      document.getElementById('roommessage').innerHTML='You changed your place!';
    }
    else{
      document.getElementById('roommessage').innerHTML='Fail to change place';

    }
  })
  socket.on('change_place_request_confirm',function (rdata){
    var data=JSON.parse(rdata);
    cancle_robot_list_page();
    document.getElementById('roommessage').innerHTML='You changed your place!';

  })
  socket.on('unready_for_start_reply',function (rdata){
    var data=JSON.parse(rdata);
    readystate = 'unready'
    document.getElementById('setready').innerHTML='Ready'
  })
  socket.on('error',function (rdata){
	  var data=JSON.parse(rdata);
	  alert('error: '+data['detail']);
  })

  socket.on('new_player',function (rdata){
	  var data=JSON.parse(rdata);
	  numberofplayer=data.players.length;

    for (var i=0;i<data.players.length;i++){
      if (i==0){
        document.getElementById("southplayername").innerHTML='South: '+data.players[i];
      }
      else if (i==1) {
        document.getElementById("westplayername").innerHTML='West: '+data.players[i];
      }
      else if (i==2) {
        document.getElementById("northplayername").innerHTML='North: '+data.players[i];
      }
      else if (i==3) {
        document.getElementById("eastplayername").innerHTML='East: '+data.players[i];
      }
    }
    //Assign absolute player position to relatice player position
    if(data.players.length==2){
      if (myname==data.players[0]){
        rightplayer=data.players[1];
      }
      else{
        leftplayer=data.players[0];
      }
    }
    else if(data.players.length==3){
      leftplayer=data.players[(mylocation-1+numberofplayer)%numberofplayer];
      rightplayer=data.players[(mylocation+1)%numberofplayer];
    }
    else if(data.players.length==4){
      leftplayer=data.players[(mylocation-1+numberofplayer)%numberofplayer];
      rightplayer=data.players[(mylocation+1)%numberofplayer];
      oppositeplayer=data.players[(mylocation+2)%numberofplayer];
    }

      var activeplayer=0;
      for (var i=0;i<data.players.length;i++){
        if(data.players[i]!='empty'){
          activeplayer++;
        }
      }
      gameMessage='<h2>New player entered room. There are '+activeplayer+' player(s) now.</h2>';

      gamestate='inroom';
      document.getElementById('hleftname').innerHTML='<h3>'+leftplayer+'</h3>'
      document.getElementById('hrightname').innerHTML='<h3>'+rightplayer+'</h3>'
      document.getElementById('hoppositename').innerHTML='<h3>'+oppositeplayer+'</h3>'
      grandupdate();
  })

  socket.on('change_place_request',function (rdata){
    var data=JSON.parse(rdata);
      res = confirm(data.request[0]+" wants to change your position to "+tout_direction[data.request[1]]+'. Do you agree?')
      if (res){
        socket.emit('change_place_request_reply',JSON.stringify({user:myname, success: true, target_place:data.request[1] }));
      }
  })

  socket.on('shuffle',function (rdata){
	  var data=JSON.parse(rdata);
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

  socket.on('update',function (rdata){
	  var data=JSON.parse(rdata);
    if(data.this_trick.length==0){
      //gameMessage='<h2>Card to play from '+updatedplayer+'</h2>';
    }
    else{


	    lastroundme='NA';
      lastroundleft='NA';
      lastroundopposite='NA';
      lastroundright='NA';
	    var lastcards=data.this_trick;
	    for(;lastcards.length<numberofplayer;){
		    lastcards.push('NA');
	    }
	    //var relpos=(data.trick_start-mylocation+numberofplayer)%numberofplayer;
	    if(numberofplayer==3){
		    console.log('mylocation '+mylocation+' lastcards '+ lastcards);
		    lastroundme=lastcards[(-data.trick_start+mylocation+numberofplayer)%numberofplayer];
		    lastroundright=lastcards[(-data.trick_start+mylocation+1+numberofplayer)%numberofplayer];
		    lastroundleft=lastcards[(-data.trick_start+mylocation+2+numberofplayer)%numberofplayer];

	    }
	    if(numberofplayer==4){
		    lastroundme=lastcards[(-data.trick_start+mylocation+numberofplayer)%numberofplayer];
		    lastroundright=lastcards[(-data.trick_start+mylocation+1+numberofplayer)%numberofplayer];
		    lastroundopposite=lastcards[(-data.trick_start+mylocation+2+numberofplayer)%numberofplayer];
		    lastroundleft=lastcards[(-data.trick_start+mylocation+3+numberofplayer)%numberofplayer]
	    }
      for(;lastcards.length>0;){
		    lastcards.pop();
	    }
	    console.log(numberofplayer+' table updated ');
      var updatedplayer=myname;
      var relativepos=(data.trick_start+data.this_trick.length-mylocation+numberofplayer)%numberofplayer;
      if (relativepos==1){
        updatedplayer=rightplayer
      }
      else if (relativepos==2) {
        if(numberofplayer==3){
          updatedplayer=leftplayer
        }
        else if (numberofplayer==4) {
          updatedplayer=oppositeplayer;
        }
      }
      else if (relativepos==3) {
        updatedplayer=leftplayer;
      }

      gameMessage='<h2>Card played from '+updatedplayer+'</h2>';
      gamestate='ingame-wait';
      grandupdate();
    }
    })

  socket.on('my_choice_reply',function (rdata){
	    var data=JSON.parse(rdata);
	    handcardsleft=data.your_remain;
      lastroundme=toplay;
      if(colorofthisturn=='A'){
        lastroundopposite='NA';
        lastroundleft='NA';
        lastroundleft='NA';
      }
      gameMessage='<h2>Card played from me</h2>';
      gamestate='ingame-wait';
      grandupdate();
    })

  socket.on('your_turn',function (rdata){
	    var data=JSON.parse(rdata);
	    console.log('my turn');
      colorofthisturn=data.suit;
      if (colorofthisturn=='J'){
        colorofthisturn='H';
      }
      if (colorofthisturn=='A'){
        gameMessage='<h2>You should lead this turn</h2>';
      }
      else{
        gameMessage='<h2>Your turn!</h2>';
      }
      timeremain = 32;
      timecounter = setInterval(function(){count_down()}, 1000)
      gamestate='ingame-thinking';
      grandupdate();
  })

  socket.on('trick_end',function (rdata){
	  var data=JSON.parse(rdata);
	  var nop=data.scores.length;
	  var relapos=(data.winner-mylocation+nop)%nop;
	  var gainer;
	  if (relapos==0){
		  gainer=myname;
	  }
	  else if(relapos==1){
		  gainer=rightplayer;
	  }
	  else if(relapos==2){
		  if(nop==4){
		      gainer=oppositeplayer;
		  }
		  else{
	          gainer=leftplayer;
		  }
	  }
	  else if(relapos==3){
		  gainer==leftplayer;
	  }
      gameMessage='<h2>Trick ends, '+gainer+' get all cards </h2>';
	    //lastroundme='NA';
	    //lastroundleft='NA';
	    //lastroundright='NA';
      //lastroundopposite='NA';
      gamestate='ingame-wait';
      grandupdate();
      if(numberofplayer==3){
  		    leftpoint=data.scores[(mylocation+nop-1)%nop];
  	      mypointcards=data.scores[mylocation];
  	      rightpoint=data.scores[(mylocation+1)%nop];
  	  }
  	  else if(numberofplayer==4){
  		    leftpoint=data.scores[(mylocation+nop-1)%nop];
  	      mypointcards=data.scores[mylocation];
  	      rightpoint=data.scores[(mylocation+1)%nop];
  		    oppositepoint=data.scores[(mylocation+2)%4];
  	  }
  })

  socket.on('game_end',function (rdata){
    console.log('game-over');
	  var data=JSON.parse(rdata);
	  var srcmsg='';
	  for(var i=0;i<data.scores_num.length;i++){
		  srcmsg+=data.scores_num[(mylocation+i)%numberofplayer];
		  srcmsg+=', ';
	  }
      gameMessage='<h2>Game over! Starting from you, scores are : '+srcmsg+' Click confirm to stay in the room for a new game and cancle to leave this room</h2>';
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
	 if(handcardsleft[i].slice(0,1)=='J'&&colorofthisturn=='H'){
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
   if (cardclicked.slice(0,1)=='J'&&colorofthisturn=='H'){
     return true;
   }
   return false;
 }

  createnewroom = function(howmanyplayers){
   socket.emit('create_room',JSON.stringify({user: myname, room:howmanyplayers}));
   /*var result = confirm('You created a new room!');
    if(result){
        alert('You confirmed!');
    }*/

 }

  enterroom = function(whichroom){
   socket.emit('enter_room',JSON.stringify({user: myname, room:whichroom}));
   chambrename=whichroom;
 }
  changereadystate = function(){
  if (readystate == 'unready'&&gamestate=='inroom'){
    socket.emit('ready_for_start',JSON.stringify({user: myname}));
  }
  else if (readystate == 'ready'&&gamestate=='inroom') {
    socket.emit('unready_for_start',JSON.stringify({user: myname}));
  }
}
  cardclicked = function(whichcard){
   console.log('clicked: '+whichcard);
   if (((gamestate=='ingame-thinking')||(gamestate=='ingame-todecide'))&&(handcardsleft.includes(whichcard))){
       var canplay=checklegitimacy(whichcard);
       if (canplay){
           gameMessage='<h2>You are going to play '+whichcard+',legal choice </h2>';
           console.log('toplay: '+toplay);
           console.log('selected');
           var outliney=CH*0.98-1.05*cardheight;
           var inliney=CH*0.98-cardheight;

           if (previousclick!='NA'&&(handcardsleft.includes(previousclick))){
               document.getElementById('cd'+previousclick).style.top=inliney+'px';
           }
           document.getElementById('cd'+whichcard).style.top=outliney+'px';

           gamestate='ingame-todecide';
           toplay = whichcard;
           previousclick = whichcard;
           grandupdate();
       }
       else {
           gameMessage='<h2>You are going to play '+whichcard+', illegal choice </h2>';
           grandupdate();
       }
   }
 }
  //button event handler
  signin = function(){
      if(gamestate=='mainpage'){
          myname=document.getElementById('mainpageform').elements[0].value;
          mypassword=document.getElementById('mainpageform').elements[1].value;
          if(myname!=''&&mypassword!=''){
              socket.emit('login',JSON.stringify({user: myname, user_pwd: mypassword }));
              document.getElementById('hmyname').innerHTML='<h3>'+myname+'</h3>';
          }
          else{
              alert('You left something empty!');
          }
      }
  }

  sorrylazy = function(){
      if(gamestate=='mainpage'){
          alert('Sorry! We are too lazy to implement this function. If you want to create a new account, please contact our operating staff whymustihaveaname on github ')
      }
  }

  ask_for_room_list = function(){
    if(gamestate=='inhall'){
      socket.emit('request_room_list',JSON.stringify({user:myname, range:[0,100]}));
    }
  }
  confirmed = function(){
      if (gamestate=='ingame-todecide'){
          gamestate='ingame-wait';
          gameMessage='<h2>Confirmed! Waiting for server response...</h2>'
          socket.emit('my_choice',JSON.stringify({user:myname, room:chambrename, card:toplay, place:mylocation}));
          clearInterval(timecounter);
          grandupdate();
      }
      else if (gamestate=='ingame-gameover') {
          //gamestate='inroom';
          //readystate = 'unready';
          document.getElementById("setready").innerHTML="Ready"
          document.getElementById('roommessage').innerHTML='You choose to stay in the room. A new game will start once all players are in position';
          //socket.emit('rester_dans_la_chambre',JSON.stringify({user:myname, room:chambrename}));
          socket.emit('new_game',JSON.stringify({user: myname}));
          grandupdate();
      }
   }

  cancled = function(){
  if (gamestate=='ingame-todecide'){
    gamestate='ingame-thinking';

    inliney=CH*0.98-cardheight;
    document.getElementById('cd'+toplay).style.top=inliney+'px';

    grandupdate();
  }
  else if (gamestate=='ingame-gameover') {
    //gamestate='inhall';
    socket.emit('leave_room',JSON.stringify({user:myname }));
    //grandupdate();
   }
  }
  cancle_robot_list_page = function(){
    document.getElementById("robotinfo").style.display='none';
  }
  exited = function(){
    gamestate='inhall';
    socket.emit('leave_room',JSON.stringify({user:myname }));
    grandupdate();
  }
  quiterchambre = function(){
    //gamestate='inhall';
    //if (readystate=='ready'){
      socket.emit('leave_room',JSON.stringify({user:myname }));
    //}
    //readystate = 'unready';
    //grandupdate();
  }
  clickimage = function(whichimage){
    if(gamestate=='inroom'){
      console.log(players_in_room[whichimage][0]);
      if(unseated){
        console.log('choose place:'+whichimage)
        socket.emit('choose_place',JSON.stringify({user:myname, room:chambrename, place:whichimage }))
        mylocation = whichimage;
        document.getElementById('roommessage').innerHTML = 'You choose to sit at '+tout_direction[whichimage]+'. Waiting for server response...';
      }
      else if((!unseated)&&(readystate=='unready')){
        console.log('ask place change:'+whichimage)
        image_clicked[whichimage]=(image_clicked[whichimage]+1)%2;
        socket.emit('ask_change_place',JSON.stringify({user:myname, target_place:whichimage }));
        document.getElementById('roommessage').innerHTML = 'You intend to switch your position to '+tout_direction[whichimage]+'. Waiting for server response...';
        //check_place_change();
        //update_player_images_and_names();
      }
      else{
        document.getElementById('roommessage').innerHTML = 'You cannot change position when you are ready. Unready first.';
      }
    }
  }

  addrobot = function(whichplace){
    if((players_in_room[whichplace][0]!='')&&(players_in_room[whichplace][2]==false)){
      document.getElementById('roommessage').innerHTML = 'You cannot add a robot here!';
    }
    else if((players_in_room[whichplace][0]=='')&&(players_in_room[whichplace][2]==false)){
      add_robot_place = whichplace;
      console.log('request robot at',whichplace);
      socket.emit('request_robot_list',JSON.stringify({user:myname, room:chambrename }));
    }
    else if((players_in_room[whichplace][0]!='')&&(players_in_room[whichplace][2]==true)){
      console.log('remove robot at',whichplace);
      socket.emit('cancel_robot',JSON.stringify({user:myname, place:whichplace }));
    }

    //alert('bonjour '+whichplace);
  }
  add_this_robot = function(which_robot){
    console.log('robot wanted:', which_robot);
    socket.emit('add_robot',JSON.stringify({user:myname, room:chambrename, robot:which_robot, place:add_robot_place }));
  }

  count_down = function(){
    timeremain--;
    var appearance = timeremain - 2;
    if(appearance<0){
      appearance = 0;
    }
    if (isgod){
      gameMessage='<h2>The player has '+appearance+' seconds to make a decision.</h2>';

    }
    else{
      gameMessage='<h2>Your have '+appearance+' seconds to make a decision.</h2>';
    }

    grandupdate();
    if(timeremain<0){
      clearInterval(timecounter);
      if(! isgod){
        gamestate='ingame-wait';
        gameMessage='<h2>Timeout, Miss. random will play on your behalf.</h2>'
        socket.emit('my_choice',JSON.stringify({user:myname, room:chambrename, card:"", place:mylocation}));
        grandupdate();
      }
    }
  }
  //general handler
  determine_relative_position = function(){
    if (numberofplayer==3){
      for(var i=0;i<3;i++){
        if(players_in_room[i][0]==myname){
          mylocation=i;
          leftplayer=players_in_room[(i+2)%3][0];
          rightplayer=players_in_room[(i+1)%3][0];
          break;
        }
      }
    }
    else if (numberofplayer==4) {
      for(var i=0;i<4;i++){
        if(players_in_room[i][0]==myname){
          mylocation=i;
          leftplayer=players_in_room[(i+3)%4][0];
          rightplayer=players_in_room[(i+1)%4][0];
          oppositeplayer=players_in_room[(i+2)%4][0];
          break;
        }
      }
    }
  }
  document.getElementById("signinbutton").addEventListener("click", signin);
  document.getElementById("signupbutton").addEventListener("click", sorrylazy);

  var gamestate='mainpage';
  var roomstate='undefined'
  var readystate='unready'
  console.log(gamestate);
  //grandupdate();
}
//The game page
