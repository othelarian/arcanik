/*GAME INIT FUNCTION*/
function initGame () {
    //init de base
    initBase(); scene3D.init3D("arcanik-game-3dzone");
    //
    //window.dump(prefs.getBoolPref("arcanik.fullscreen"));
    //
    //modification de l'affichage
    if (prefs.getBoolPref("arcanik.fullscreen")) {
        doc.byTAG("window")[0].setAttribute("hidechrome",true);
        doc.byTAG("window")[0].setAttribute("fullscreen",true); window.fullScreen = true;
    }
    //
    //transfert des données
    db = window.opener.db;
    //
    //
    //capture des évènements
    window.addEventListener("keydown",keycapt,false);
    window.addEventListener("DOMMouseScroll",wheelcapt,false);
    //
    //
    //fermeture du menu principal
    window.opener.close();
    //
    // TODO : ouverture des portes
    //
    //
    doc.byID("arcanik-game-deck").selectedIndex = 1;
    //
}
/*KEYBOARD CAPTURE FUNCTION*/
function keycapt (evt) {
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

