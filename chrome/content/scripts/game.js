/*GAME VARIABLES*/
var keys = {k17:false,k37:false,k38:false,k39:false,k40:false};
var mous = {clk1:false,clk2:false,clk3:false,mvh:0,mvv:0,scrl:0};
/*GAME ANIMLOOP OVERRIDE*/
function override3D () {
    scene3D.animloop = function () {
       if (scene3D.pause) return; scene3D.renderer.clear();
       window.requestAnimationFrame(scene3D.animloop);
       //
       //window.dump(keys.toSource()+"\n");
       //
       if (keys.k37 && !keys.k39) {
           if (keys.k17) scene3D.centcam.rotation.y = scene3D.centcam.rotation.y - 0.05;
           else {
               //
               //
               scene3D.centcam.position.x = scene3D.centcam.position.x - 0.3;
               //
           }
       }
       else if (keys.k39 && !keys.k37) {
           if (keys.k17) scene3D.centcam.rotation.y = scene3D.centcam.rotation.y + 0.05;
           else {
               //
               //
               scene3D.centcam.position.x = scene3D.centcam.position.x + 0.3;
               //
           }
       }
       if (keys.k38 && !keys.k40) {
           if (keys.k17) {
               //
               // TODO : zoom in
               //
           }
           else {
               //
               scene3D.centcam.position.z =scene3D.centcam.position.z - 0.3;
               //
           }
       }
       else if (keys.k40 && !keys.k38) {
           if (keys.k17) {
               //
               // TODO : zoom out
               //
           }
           else {
               //
               scene3D.centcam.position.z =scene3D.centcam.position.z + 0.3;
               //
           }
       }
       //
       //
       scene3D.renderer.render(scene3D.scene,scene3D.camera);
       try { stats.update(); } catch (e) {}
    };
    scene3D.resize = function () {
        scene3D.width = scene3D.canvas.clientWidth; scene3D.height = scene3D.canvas.clientHeight;
        scene3D.camera.apsect = scene3D.width / scene3D.height; scene3D.renderer.setSize(scene3D.width,scene3D.height);
    };
}
/*GAME INIT FUNCTION*/
function initGame () {
    //init de base
    initBase(); override3D();
    //modification de l'affichage
    if (prefs.getBoolPref("arcanik.fullscreen")) {
        doc.byTAG("window")[0].setAttribute("hidechrome",true);
        doc.byTAG("window")[0].setAttribute("fullscreen",true); window.fullScreen = true;
    }
    //transfert des données
    db = window.opener.db; var tmp_name = window.opener.tmp_name;
    //
    window.dump("name: "+tmp_name+"\n");
    //
    //init de la 3D
    //
    stats = new Stats(); stats.domElement.style.position = 'absolute'; stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100; doc.byID("stats").appendChild( stats.domElement );
    //
    //scene3D.init3D("arcanik-game-3dzone",   ?????   );
    scene3D.init3D("arcanik-game-3dzone","opal_base");
    //
    scene3D.camera.position.set(0,15,20); scene3D.camera.lookAt(new THREE.Vector3(0,0,0));
    //
    //ajout des runes
    //
    var rune_lst = [56,78,57,127,9,118,18,60,73,57,12,117]; var ring = doc.byID("arcanik-voile-waiting");
    for (var it=0; it<rune_lst.length;it++) addRune(rune_lst[it],105,it*30,ring);
    //
    //capture des évènements
    window.addEventListener("keydown",keycapt,false); window.addEventListener("keyup",keyclear,false);
    window.addEventListener("mousedown",mousecapt,false); window.addEventListener("mouseup",mouseclear,false);
    window.addEventListener("DOMMouseScroll",wheelcapt,false); window.addEventListener("mousemove",movecapt,false);
    if (!prefs.getBoolPref("arcanik.fullscreen")) window.addEventListener("resize",resizecapt,false);
    //
    // TODO : ouverture des portes
    //
    //
    //doc.byID("arcanik-game-deck").selectedIndex = 0;
    //doc.byID("arcanik-game-deck").selectedIndex = 1;
    doc.byID("arcanik-game-deck").selectedIndex = 2;
    //doc.byID("arcanik-game-deck").selectedIndex = 3;
    //
}
/*READY TO GO FUNCTION*/
function readyToGo () {
    scene3D.showRoom("test_room");
    //
    resizecapt();
    //
    //fermeture du menu principal
    window.opener.close();
}
/*GLOBAL RESIZE FUNCTION*/
function global_resize () {
}
/*KEYBOARD CAPTURE FUNCTION*/
function keycapt (evt) {
    if (!voile.state) {
        //
        //
    }
    else {
        switch (parseInt(doc.byID("arcanik-game-deck").selectedIndex)) {
            case 0: window.dump("transition ?\n"); break; //transition
            case 1: //in base
                //
                //
                break;
            case 2: //in game
                //
                switch (evt.keyCode) {
                    //
                    case 17: keys.k17 = true; break; //touche ctrl
                    //
                    case 37: keys.k37 = true; break; //touche flèche gauche
                    case 38: keys.k38 = true; break; //touche flèche haut
                    case 39: keys.k39 = true; break; //touche flèche droite
                    case 40: keys.k40 = true; break; //touche flèche bas
                    //
                    //
                }
                break;
            case 3: //cinematique
                //
                // TODO : "ESC" pour passer la cinematique
                //
                //
                break;
        }
    }
}
/*KEYBOARD CLEAR CAPTURE FUNCTION*/
function keyclear (evt) {
    if (!voile.state) {
        //
        //
    }
    else {
        switch (parseInt(doc.byID("arcanik-game-deck").selectedIndex)) {
            case 0: break; //transition
            case 1: //in base
                //
                //
                //
                break;
            case 2: //in game
                switch (evt.keyCode) {
                    //
                    case 17: keys.k17 = false; break; //touche ctrl
                    //
                    case 37: keys.k37 = false; break; //touche flèche gauche
                    case 38: keys.k38 = false; break; //touche flèche haut
                    case 39: keys.k39 = false; break; //touche flèche droite
                    case 40: keys.k40 = false; break; //touche flèche bas
                    //
                    //
                }
                break;
            case 3: //cinematique
                //
                //
                //
                break;
        }
    }
}
/*MOUSE CAPTURE FUNCTION*/
function mousecapt (evt) {
    if (!voile.state) {
        //
        //
    }
    else {
        //
        //
    }
}
/*MOUSE CLEAR CAPTURE FUNCTION*/
function mouseclear (evt) {
    if (!voile.state) {
        //
        //
    }
    else {
        //
        //
    }
}
/*MOUSE WHEEL SCROLL CAPTURE FUNCTION*/
function wheelcapt (evt) {
    if (!voile.state || doc.byID("arcanik-game-deck").selectedIndex == 0) return;
    else {
        //
        // TODO : zoom
        //
        //
    }
}
/*MOUSE MOVEMENT CAPTURE FUNCTION*/
function movecapt (evt) {
    if (!voile.state) {
        //
        //
    }
    else {
        //
        //
    }
}
/*RESIZE CAPTURE FUNCTION*/
function resizecapt () {
    doc.byID("arcanik-game-stack").width = doc.byTAG("window")[0].clientWidth; doc.byID("arcanik-game-stack").height = doc.byTAG("window")[0].clientHeight;
    scene3D.canvas.style.width = doc.byTAG("window")[0].clientWidth; scene3D.canvas.style.height = doc.byTAG("window")[0].clientHeight; scene3D.resize();
}
/*UNIT CLASS*/
function unitClass () {
    //
    //
    //
}
/*ROBOT CLASS*/
function robotClass () {
    //
    //
    //
}

