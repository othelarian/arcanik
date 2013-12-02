/*GAME VARIABLES*/
/*GAME INIT FUNCTION*/
function initGame () {
    //init de base
    initBase();
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
    //scene3D.init3D("arcanik-game-3dzone");
    scene3D.init3D("arcanik-game-3dzone","opal_base");
    //
    //
    //capture des évènements
    window.addEventListener("keydown",keycapt,false); window.addEventListener("keyup",keyclear,false);
    window.addEventListener("mousedown",mousecapt,false); window.addEventListener("mouseup",mouseclear,false);
    window.addEventListener("DOMMouseScroll",wheelcapt,false); window.addEventListener("mousemove",movecapt,false);
    if (prefs.getBoolPref("arcanik.fullscreen")) window.addEventListener("resize",resizecapt,false);
    //fermeture du menu principal
    window.opener.close();
    //
    // TODO : ouverture des portes
    //
    //
    doc.byID("arcanik-game-deck").selectedIndex = 1;
    //
}
/*READY TO GO FUNCTION*/
function readyToGo () {
    //
    // TODO : show the starting room
    //
    //
}
/*KEYBOARD CAPTURE FUNCTION*/
function keycapt (evt) {
    //
    //
    //
}
/*KEYBOARD CLEAR CAPTURE FUNCTION*/
function keyclear (evt) {
    //
    //
    //
}
/*MOUSE CAPTURE FUNCTION*/
function mousecapt (evt) {
    //
    //
    //
}
/*MOUSE CLEAR CAPTURE FUNCTION*/
function mouseclear (evt) {
    //
    //
    //
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
    //
    //
    //
}
/*RESIZE CAPTURE FUNCTION*/
function resizecapt () {
    //
    //
    //
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

