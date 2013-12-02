/*INIT VARIABLES*/
var sounds = [0,0,0], optionsSystem = null, majSystem = null, campaign = null;
var frames_state = 0, freeze = false, mainmenu_state = 0, initiated = false;
/*INIT MAIN MENU FUNCTION*/
function initMain () {
    if (initiated) return; else initiated = true;
    //init de base
    //
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    doc.byID("stats").appendChild( stats.domElement );
    //
    initBase(); scene3D.init3D("arcanik-mainmenu-3dzone","mainmenu");
    //
    // TODO : mise à niveau de la position de la camera
    //
    scene3D.camera.position.set(0,15,20); scene3D.camera.lookAt(new THREE.Vector3(0,0,0));
    //
    //
    //mise en place du gestionnaire d'options
    optionsSystem = new optionsClass();
    //mise en place du menu "campaign"
    campaign = new campaignClass();
    //ajout des runes
    var ring = doc.byID("arcanik-mainmenu-movering"); var rune_lst = [56,78,57,127,9,118,18,60,73,57,12,117];
    for (var it=0; it<rune_lst.length;it++) addRune(rune_lst[it],105,it*30,ring);
    var ring = doc.byID("arcanik-voile-waiting"); for (var it=0; it<rune_lst.length;it++) addRune(rune_lst[it],105,it*30,ring);
    var ring = doc.byID("arcanik-mainmenu-staticring"); addRune(53,180,90,ring,"arcanik-mainmenu-ico0");
    addRune(45,180,140,ring,"arcanik-mainmenu-ico1"); addRune(105,180,160,ring,"arcanik-mainmenu-ico2");
    addRune(54,180,180,ring,"arcanik-mainmenu-ico3"); addRune(51,180,200,ring,"arcanik-mainmenu-ico4");
    addRune(109,0,0,doc.byID("arcanik-mainmenu-uparrow")); addRune(109,0,180,doc.byID("arcanik-mainmenu-dnarrow"));
    //capture des évènements
    window.addEventListener("keydown",keycapt,false);
    window.addEventListener("DOMMouseScroll",wheelcapt,false);
    //réglages des options
    doc.byID("arcanik-options-screenmode").selectedIndex = (prefs.getBoolPref("arcanik.fullscreen"))? 0 : 1;
    doc.byID("arcanik-options-langchx").selectedIndex = (prefs.getCharPref("general.useragent.locale") == "fr-FR")? 0 : 1;
    if (prefs.getBoolPref("arcanik.music.active")) doc.byID("arcanik-options-music-active").checked = true;
    if (prefs.getBoolPref("arcanik.sounds.active")) doc.byID("arcanik-options-sounds-active").checked = true;
    doc.byID("arcanik-options-music-vol").value = prefs.getIntPref("arcanik.music.volume");
    doc.byID("arcanik-options-sounds-vol").value = prefs.getIntPref("arcanik.sounds.volume");
    //init du système de mise à jour
    majSystem = new majClass();
    //lancement de la musique, si active
    if (prefs.getBoolPref("arcanik.music.active")) doc.byID("arcanik-main-music").play();
    //
    // TODO : chargement des portes
    //
}
/*READY TO GO FUNCTION*/
function readyToGo () {
    //
    scene3D.showRoom("main_room");
    //
    // TODO : lancement du mouvement de caméra et d'affichage de la mainframe
    //
    //
    //window.setTimeout("doc.byID('arcanik-mainmenu-frame').hidden = false;",3000);
    //
    //fermeture du launcher
    window.opener.close();
}
/*KEYBOARD CAPTURE FUNCTION*/
function keycapt (evt) {
    if (!voile.state) {
        switch (frames_state) {
            case 0: switch (evt.keyCode) { case 8: case 13: case 27: voile.toggle(); break; } break; //main menu
            case 1: //campaign menu
                switch (parseInt(doc.byID("arcanik-voile-deck").selectedIndex)) {
                    case 2: //creation
                        switch (evt.keyCode) {
                            case 8: case 27: if (doc.byID("arcanik-create-deck").selectedIndex != 0) voile.toggle(); break; //touches BACK et ESC
                            case 13: //touche RETURN
                                if (doc.byID("arcanik-create-deck").selectedIndex == 0) campaign.create(1);
                                else if (doc.byID("arcanik-create-deck").selectedIndex == 1) { voile.toggle(); campaign.create(0); }
                                else { voile.toggle(); campaign.play(); }
                                break;
                        }
                        break;
                    case 3: //import
                        switch (evt.keyCode) {
                            case 8: case 27: voile.toggle(); break; //touches BACK et ESC
                            case 13: //touche RETURN
                                if (doc.byID("arcanik-import-deck").selectedIndex == 0) { voile.toggle(); campaign.play(); }
                                else { voile.toggle(); campaign.importer(); }
                                break;
                        }
                        break;
                    case 4: //export
                        switch (evt.keyCode) {
                            case 8: case 27: voile.toggle(); break; //touches BACK et ESC
                            case 13: //touche RETURN
                                voile.toggle(); if (doc.byID("arcanik-export-deck").selectedIndex == 1) campaign.exporter(); break;
                        }
                        break;
                    case 5: //suppression
                        switch (evt.keyCode) {
                            case 8: case 27: voile.toggle(); break; //touches BACK et ESC
                            case 13: //touche RETURN
                                if (doc.byID("arcanik-remove-deck").selectedIndex == 0) campaign.remove(1);
                                else if (doc.byID("arcanik-remove-deck").selectedIndex == 1) voile.toggle();
                                break;
                        }
                        break;
                }
                break;
            case 2: //mission menu
                //
                //
                break;
            case 4: //options menu
                switch (evt.keyCode) {
                case 8: case 27: if (doc.byID("arcanik-maj-deck").selectedIndex == 3) {} else majSystem.cancel(); break; //touches BACK et ESC
                case 13: //touche RETURN
                    if (doc.byID("arcanik-maj-deck").selectedIndex == 0) majSystem.retryCheck();
                    else if (doc.byID("arcanik-maj-deck").selectedIndex == 3) {}
                    else majSystem.doMaj();
                    break;
                }
                break;
        }
    }
    else {
        switch (frames_state) {
            case 0: //main menu
                switch (evt.keyCode) {
                    case 13: //touche RETURN
                        if (mainmenu_state < 4) showFrame(mainmenu_state+1); else if (mainmenu_state == 4) quit(); break;
                    case 38: moveMainMenu(true); break; //flèche haut
                    case 40: moveMainMenu(false); break; //flèche bas
                }
                break;
            case 1: //campaign menu
                switch (evt.keyCode) {
                    case 8: case 27: showFrame(0); break; //touches BACK et ESC
                    case 13: if (doc.byID("arcanik-campaign-maindeck").selectedIndex == 0) campaign.create(0); else campaign.play(); break; //touche RETURN
                    case 38: campaign.move(false); break; //touche flèche haut
                    case 40: campaign.move(true); break; //touche flèches bas
                    case 46: if (doc.byID("arcanik-campaign-maindeck").selectedIndex > 0) campaign.remove(0); break; //touche "suppr"
                    case 69: if (doc.byID("arcanik-campaign-maindeck").selectedIndex > 0) campaign.exporter(); break; //touche "e"
                    case 73: if (doc.byID("arcanik-campaign-maindeck").selectedIndex == 0) campaign.importer(); break; //touche "i"
                }
                break;
            case 2: //mission menu
                switch (evt.keyCode) {
                    case 8: case 27: showFrame(0); break; //touches BACK et ESC
                    //
                    //
                    //
                }
                break;
            case 3: switch (evt.keyCode) { case 8: case 27: showFrame(0); break; } break; //credits menu
            case 4: switch (evt.keyCode) { case 8: case 27: showFrame(0); break; } break; //options menu
        }
    }
}
/*MOUSE WHEEL SCROLL CAPTURE FUNCTION*/
function wheelcapt (evt) {
    if (!voile.state) return;
    else {
        switch (frames_state) {
            case 0: moveMainMenu((evt.detail > 0)? false : true); break; //main menu
            case 1: campaign.move((evt.detail > 0)? true : false); break; //campaign menu
            case 2: //mission menu
                //
                // TODO : wheel capture pour le menu "Missions"
                //
                break;
        }
    }
}
/*PLAY SOUNDS FUNCTION*/
function playSounds (idx) {
    if (!prefs.getBoolPref("arcanik.sounds.active")) return;
    switch (idx) {
        case 0: doc.byID("arcanik-main-son-main-"+sounds[0]).play(); sounds[0]++; if (sounds[0] == 3) sounds[0] = 0; break;
        case 1: doc.byID("arcanik-main-son-sel-"+sounds[1]).play(); sounds[1]++; if (sounds[1] == 3) sounds[1] = 0; break;
        case 2: doc.byID("arcanik-main-son-aux-"+sounds[2]).play(); sounds[2]++; if (sounds[2] == 3) sounds[2] = 0; break;
    }
}
/*MOVE MAIN MENU FUNCTION*/
function moveMainMenu (sens) {
    if (freeze) return;
    else if (sens && mainmenu_state == 0) return;
    else if (!sens && mainmenu_state == 4) return;
    mainmenu_state += 1*(sens)? -1 : 1; freeze = true; var newend = null; var newpos = null; playSounds(0);
    switch (mainmenu_state) {
        case 0:
            doc.byID("arcanik-mainmenu-up").style.display = "none"; doc.byID("arcanik-mainmenu-btn1").disabled = true;
            doc.byID("arcanik-mainmenu-btn0").disabled = false;
            doc.byID("arcanik-mainmenu-btnspacer").height = 108; newend = ["act","_gr0","_gr1","_gr2","_gr3"];
            newpos = [90,140,160,180,200]; break;
        case 1:
            doc.byID("arcanik-mainmenu-up").style.display = "block"; doc.byID("arcanik-mainmenu-btn0").disabled = true;
            doc.byID("arcanik-mainmenu-btn2").disabled = true; doc.byID("arcanik-mainmenu-btn1").disabled = false;
            doc.byID("arcanik-mainmenu-btnspacer").height = 84; newend = ["_gr0","act","_gr0","_gr1","_gr2"];
            newpos = [40,90,140,160,180]; break;
        case 2:
            doc.byID("arcanik-mainmenu-btn1").disabled = true; doc.byID("arcanik-mainmenu-btn3").disabled = true;
            doc.byID("arcanik-mainmenu-btn2").disabled = false;
            doc.byID("arcanik-mainmenu-btnspacer").height = 63; newend = ["_gr1","_gr0","act","_gr0","_gr1"];
            newpos = [20,40,90,140,160]; break;
        case 3:
            doc.byID("arcanik-mainmenu-dn").style.display = "block"; doc.byID("arcanik-mainmenu-btn2").disabled = true;
            doc.byID("arcanik-mainmenu-btn4").disabled = true; doc.byID("arcanik-mainmenu-btn3").disabled = false;
            doc.byID("arcanik-mainmenu-btnspacer").height = 48; newend = ["_gr2","_gr1","_gr0","act","_gr0"];
            newpos = [0,20,40,90,140]; break;
        case 4:
            doc.byID("arcanik-mainmenu-dn").style.display = "none"; doc.byID("arcanik-mainmenu-btn3").disabled = true;
            doc.byID("arcanik-mainmenu-btn4").disabled = false;
            doc.byID("arcanik-mainmenu-btnspacer").height = 35; newend = ["_gr3","_gr2","_gr1","_gr0","act"];
            newpos = [-20,0,20,40,90]; break;
    }
    for (var it=0; it<5; it++) {
        doc.byID("arcanik-mainmenu-btn"+it).setAttribute("class","arcanik-mainmenu-btns arcanik-mainmenu-btn"+newend[it]);
        doc.byID("arcanik-mainmenu-ico"+it).setAttribute("transform","rotate("+newpos[it]+"),translate(0,-180)");
    }
    freeze = false;
}
/*SHOW FRAME FUNCTION*/
function showFrame (n) {
    if (n == 2 && campaign.nbsaves == 0) { voile.toggle(); voile.show(6); return; }
    else if (n == 4) optionsSystem.reset();
    doc.byID("arcanik-mainmenu-deck").selectedIndex = n; frames_state = n;
    if (frames_state == 0) playSounds(2); else playSounds(1);
}
/*OPTIONS CLASS*/
function optionsClass () {
    this.windowed = null; this.lang = null; this.sounds = null; this.sounds_vol = null;
    this.music = null; this.music_vol = null; this.initiate = true;
    this.verifChange = function () {
        var change = true;
        if (doc.byID("arcanik-options-screenmode").selectedIndex != this.windowed) change = false;
        else if (doc.byID("arcanik-options-langchx").selectedIndex != this.lang) change = false;
        else if (doc.byID("arcanik-options-music-active").checked != this.music) change = false;
        else if (doc.byID("arcanik-options-sounds-active").checked != this.sounds) change = false;
        else if (doc.byID("arcanik-options-music-vol").value != this.music_vol) change = false;
        else if (doc.byID("arcanik-options-sounds-vol").value != this.sounds_vol) change = false;
        doc.byID("arcanik-options-valid").disabled = change; doc.byID("arcanik-options-reset").disabled= change;
    }
    this.valid = function () {
        this.windowed = doc.byID("arcanik-options-screenmode").selectedIndex; this.lang = doc.byID("arcanik-options-langchx").selectedIndex;
        this.music = doc.byID("arcanik-options-music-active").checked; this.sounds = doc.byID("arcanik-options-sounds-active").checked;
        this.music_vol = doc.byID("arcanik-options-music-vol").value; this.sounds_vol = doc.byID("arcanik-options-sounds-vol").value;
        prefs.setBoolPref("arcanik.fullscreen",(this.windowed == 0)? true : false);
        prefs.setBoolPref("arcanik.music.active",this.music); prefs.setBoolPref("arcanik.sounds.active",this.sounds);
        if (this.music) doc.byID("arcanik-main-music").play(); else doc.byID("arcanik-main-music").pause();
        prefs.setIntPref("arcanik.music.volume",this.music_vol); doc.byID("arcanik-main-music").volume = this.music_vol/100;
        prefs.setIntPref("arcanik.sounds.volume",this.sounds_vol);
        for (var it=0; it<3; it++) {
            doc.byID("arcanik-main-son-main-"+it).volume = this.sounds_vol/100;
            doc.byID("arcanik-main-son-sel-"+it).volume = this.sounds_vol/100;
            doc.byID("arcanik-main-son-aux-"+it).volume = this.sounds_vol/100;
        }
        doc.byID("arcanik-options-valid").disabled = true; doc.byID("arcanik-options-reset").disabled= true;
        var tmp_lang = (this.lang == 0)? "fr-FR" : "en-US";
        if (tmp_lang != prefs.getCharPref("general.useragent.locale")) {
            prefs.setCharPref("general.useragent.locale",tmp_lang);
            Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).reloadChrome();
        }
    }
    this.reset = function () {
        if (this.initiate) { this.init(); this.initiate = false; }
        doc.byID("arcanik-options-screenmode").selectedIndex = this.windowed; doc.byID("arcanik-options-langchx").selectedIndex = this.lang;
        doc.byID("arcanik-options-music-active").checked = this.music; doc.byID("arcanik-options-sounds-active").checked = this.sounds;
        doc.byID("arcanik-options-music-vol").value = this.music_vol; doc.byID("arcanik-options-sounds-vol").value = this.sounds_vol;
        doc.byID("arcanik-options-valid").disabled = true; doc.byID("arcanik-options-reset").disabled= true;
    }
    this.init = function () {
        this.windowed = doc.byID("arcanik-options-screenmode").selectedIndex; this.lang = doc.byID("arcanik-options-langchx").selectedIndex;
        this.sounds = prefs.getBoolPref("arcanik.sounds.active"); this.sounds_vol = prefs.getIntPref("arcanik.sounds.volume");
        this.music = prefs.getBoolPref("arcanik.music.active"); this.music_vol = prefs.getIntPref("arcanik.music.volume");
        for (var it=0; it <3; it++) {
            doc.byID("arcanik-main-son-main-"+it).volume = this.sounds_vol/100;
            doc.byID("arcanik-main-son-sel-"+it).volume = this.sounds_vol/100;
            doc.byID("arcanik-main-son-aux-"+it).volume = this.sounds_vol/100;
        }
        doc.byID("arcanik-main-music").volume = this.music_vol/100;
    }
}
/*MAJ CLASS*/
function majClass () {
    this.checker = null; this.listener = null; this.maj_obs = null; this.aus = null;
    this.checkUpdate = function () { voile.show(0); voile.toggle(); window.setTimeout(majSystem.checking,500); }
    this.checking = function () { majSystem.checker.checkForUpdates(majSystem.listener,true); }
    this.retryCheck = function () { doc.byID("arcanik-maj-deck").selectedIndex = 0; voile.show(0); window.setTimeout(majSystem.checking,500); }
    this.doMaj = function () {
        voile.show(0); var aus = Cc["@mozilla.org/updates/update-service;1"].getService(Ci.nsIApplicationUpdateService);
        var state = aus.downloadUpdate(this.listener.update,false);
        if (state == "failed") {
            try { aus.removeDownloadListener(maj_obs); } catch (e) { alert(e); }
            voile.show(1); doc.byID("arcanik-maj-deck").selectedIndex = 2;
        }
        else aus.addDownloadListener(this.maj_obs);
    }
    this.cancel = function () { doc.byID("arcanik-maj-deck").selectedIndex = 0; voile.show(0); voile.toggle(); }
    this.init = function () {
        this.checker = Cc["@mozilla.org/updates/update-checker;1"].createInstance(Ci.nsIUpdateChecker);
        this.listener = {
            update: null,
            onError: function (request,update) { voile.show(1); doc.byID("arcanik-maj-deck").selectedIndex = 0; },
            onCheckComplete: function (request,updates,updateCount) {
                voile.show(1); var found = false; var chx = 0;
                for (var it=0; it<updateCount; it++) {
                    if (Services.appinfo.version < updates[it].appVersion) {
                        if (updates[it].type == "major") { found = true; chx = it; break; }
                        if (found) { if (updates[chx].appVersion < updates[it].appVersion) chx = it; }
                        else { found = true; chx = it; }
                    }
                }
                if (found) {
                    doc.byID("arcanik-maj-deck").selectedIndex = 1; this.update = updates[chx];
                    modnode(doc.byID("arcanik-maj-version-nb"),{"value":Services.appinfo.version+" >>> "+this.update.appVersion});
                }
                else doc.byID("arcanik-maj-deck").selectedIndex = 0;
            },
            onProgress: function (request,position,totalSize) {}
        };
        this.maj_obs = {
            onStartRequest: function (aRequest,aContext) {},
            onStopRequest: function (aRequest,aContext,aStatusCode) {
                var u = majSystem.listener.update;
                switch (aStatusCode) {
                    case Cr.NS_ERROR_CORRUPTED_CONTENT:
                    case Cr.NS_ERROR_UNEXPECTED:
                        if (u.state == "download-failed" && u.isCompleteUpdate) {
                            try { aus.removeDownloadListener(maj_obs); } catch (e) {}
                            voile.show(1); doc.byID("arcanik-maj-deck").selectedIndex = 2;
                        }
                        break;
                    case Cr.NS_OK:
                        voile.show(1); doc.byID("arcanik-maj-deck").selectedIndex = 3;
                        var um = Cc["@mozilla.org/updates/update-manager;1"].getService(Ci.nsIUpdateManager); um.activeUpdate = u; um.saveUpdates();
                        window.setTimeout("Services.startup.quit(Services.startup.eAttemptQuit | Services.startup.eRestart);",2000);
                        break;
                    default:
                        try { aus.removeDownloadListener(majSystem.maj_obs); } catch (e) { }
                        voile.show(1); doc.byID("arcanik-maj-deck").selectedIndex = 2;
                        break;
                }
            }
        };
        this.aus = Cc["@mozilla.org/updates/update-service;1"].getService(Ci.nsIApplicationUpdateService);
    }
    this.init();
}
/*CAMPAIGN CLASS*/
function campaignClass () {
    this.nbsaves = 0; this.impsave = null; this.tmpname = "";
    this.move = function (sens) {
        var actdeck = doc.byID("arcanik-campaign-maindeck").selectedIndex;
        if (actdeck > 0 && !sens) {
            playSounds(0); doc.byID("arcanik-campaign-maindeck").selectedIndex--;
            var clas = "arcanik-mainmenu-campaign-labs arcanik-mainmenu-campaign-lab";
            doc.byID("arcanik-campaign-lab"+(parseInt(actdeck)-1)).setAttribute("class",clas+"1");
            doc.byID("arcanik-campaign-lab"+(parseInt(actdeck)-1)).style.display = "block";
            for (var it=0;it<(this.nbsaves-parseInt(actdeck)) && it<3;it++) {
                var nod = doc.byID("arcanik-campaign-lab"+(parseInt(actdeck)+it)); if (it == 2) nod.style.display = "none"; else nod.setAttribute("class",clas+(it+2)); }
            if (actdeck == 1) {
                doc.byID("arcanik-campaign-garrowup").style.display = "none"; doc.byID("arcanik-campaign-creaform").style.display = "block";
                doc.byID("arcanik-campaign-garrowdn").style.display = "block"; doc.byID("arcanik-campaign-saveform").style.display = "none";
            }
            else if (actdeck == (this.nbsaves)) doc.byID("arcanik-campaign-garrowdn").style.display = "block";
        }
        else if (actdeck < this.nbsaves && sens) {
            playSounds(0); doc.byID("arcanik-campaign-maindeck").selectedIndex++;
            doc.byID("arcanik-campaign-lab"+actdeck).style.display = "none";
            var clas = "arcanik-mainmenu-campaign-labs arcanik-mainmenu-campaign-lab";
            for (var it=0;it<(this.nbsaves-parseInt(actdeck)-1) && it<3;it++) {
                var nod = doc.byID("arcanik-campaign-lab"+(parseInt(actdeck)+1+it)); if (it == 2) nod.style.display = "block"; else nod.setAttribute("class",clas+(it+1)); }
            if (actdeck == 0) {
                doc.byID("arcanik-campaign-garrowup").style.display = "block"; doc.byID("arcanik-campaign-creaform").style.display = "none";
                doc.byID("arcanik-campaign-saveform").style.display = "block";
                if ((this.nbsaves-1) == 0) doc.byID("arcanik-campaign-garrowdn").style.display = "none";
            }
            else if (actdeck == (this.nbsaves-1)) doc.byID("arcanik-campaign-garrowdn").style.display = "none";
        }
    }
    this.create = function (lvl) {
        switch (lvl) {
            case 0: voile.toggle(); voile.show(2); doc.byID("arcanik-create-deck").selectedIndex = 0; break;
            case 1:
                campaign.tmpname = doc.byID("arcanik-create-textbox").value; voile.show(0);
                db.execute("SELECT COUNT(*) FROM saves WHERE name='"+campaign.tmpname+"';").then(function onStatementComplete (res) {
                    if (res[0].getResultByIndex(0) == 1) { voile.show(2); doc.byID("arcanik-create-deck").selectedIndex = 1; }
                    else {
                        var req = "INSERT INTO saves (name) VALUES ('"+campaign.tmpname+"');";
                        db.execute(req).then(function onStatementComplete (res) {
                            var dte = new Date(); dte = dte.toLocaleString().replace("/","-"); campaign.insert(campaign.nbsaves,campaign.tmpname,dte,0,1,true);
                            var actdeck = parseInt(doc.byID("arcanik-campaign-maindeck").selectedIndex);
                            for (var it=0; it < (campaign.nbsaves-actdeck) && it<3 ;it++) doc.byID("arcanik-campaign-lab"+(actdeck+it)).style.display = "none";
                            campaign.nbsaves++; doc.byID("arcanik-campaign-maindeck").selectedIndex = campaign.nbsaves;
                            doc.byID("arcanik-campaign-garrowup").style.display = "block"; doc.byID("arcanik-campaign-garrowdn").style.display = "none";
                            doc.byID("arcanik-campaign-creaform").style.display = "none"; doc.byID("arcanik-campaign-saveform").style.display = "block";
                            voile.show(2); doc.byID("arcanik-create-deck").selectedIndex = 2;
                        });
                    }
                });
                break;
        }
    }
    this.importer = function () {
        voile.toggle(); voile.show(0); var nsIFP = Ci.nsIFilePicker; var fpck = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFP);
        fpck.init(window,"Arcanik - "+arc_strs.getString("arcanik_mainmenu_campaign_import"),nsIFP.modeOpen);
        fpck.appendFilter("arcanik saves (*.save)","*.save"); var res = fpck.show();
        if (res == nsIFP.returnOK) {
            var impfile = OS.File.read(fpck.file.path).then(
                function onSuccess (array) {
                    var decoder = new TextDecoder(); campaign.impsave = JSON.parse(decoder.decode(array));
                    db.execute("SELECT COUNT(*) FROM saves WHERE name='"+campaign.impsave["name"]+"';").then( function onStatementComplete (res) {
                        if (res[0].getResultByIndex(0) == 1) { voile.show(3); doc.byID("arcanik-import-deck").selectedIndex = 2; }
                        else {
                            var req = "INSERT INTO saves VALUES ('"+campaign.impsave["name"]+"','"+campaign.impsave["crea_date"]+"',";
                            req += campaign.impsave["time"]+",'"+campaign.impsave["data"]+"');";
                            db.execute(req).then(function onStatementComplete () {
                                campaign.insert(campaign.nbsaves,campaign.impsave["name"],campaign.impsave["crea_date"],campaign.impsave["time"],1,true);
                                var actdeck = parseInt(doc.byID("arcanik-campaign-maindeck").selectedIndex);
                                for (var it=0; it < (campaign.nbsaves-actdeck) && it<3 ;it++) doc.byID("arcanik-campaign-lab"+(actdeck+it)).style.display = "none";
                                campaign.nbsaves++; doc.byID("arcanik-campaign-maindeck").selectedIndex = campaign.nbsaves;
                                doc.byID("arcanik-campaign-garrowup").style.display = "block"; doc.byID("arcanik-campaign-garrowdn").style.display = "none";
                                doc.byID("arcanik-campaign-creaform").style.display = "none"; doc.byID("arcanik-campaign-saveform").style.display = "block";
                                voile.show(3); doc.byID("arcanik-import-deck").selectedIndex = 0;
                            });
                        }
                    });
                },
                function onFailed () { voile.show(3); doc.byID("arcanik-import-deck").selectedIndex = 1; }
            );
        }
        else { voile.toggle(); return; }
    }
    this.exporter = function () {
        voile.toggle(); voile.show(0); var nsIFP = Ci.nsIFilePicker; var fpck = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFP);
        var name = doc.byID("arcanik-campaign-lab"+(doc.byID("arcanik-campaign-maindeck").selectedIndex -1)).value;
        fpck.init(window,"Arcanik - "+arc_strs.getString("arcanik_mainmenu_campaign_export"),nsIFP.modeSave);
        fpck.defaultString = "arcanik_"+name+".save"; fpck.appendFilter("arcanik saves (*.save)","*.save"); var res = fpck.show();
        if (res == nsIFP.returnOK || res == nsIFP.returnReplace) {
            db.execute("SELECT * FROM saves WHERE name='"+name+"';").then(function onStatementComplete (res) {
                var exp_dict = {"name":name,"crea_date":res[0].getResultByIndex(1),"time":res[0].getResultByIndex(2),"data":res[0].getResultByIndex(3)};
                var encoder = new TextEncoder(); var wr_array = encoder.encode(JSON.stringify(exp_dict));
                var promise = OS.File.writeAtomic(fpck.file.path,wr_array,{tmpPath:fpck.file.path+"export.save.tmp"});
                promise.then(
                    function onSuccess () { voile.show(4); doc.byID("arcanik-export-deck").selectedIndex = 0; },
                    function onFailure () { voile.show(4); doc.byID("arcanik-export-deck").selectedIndex = 1; }
                );
            });
        }
        else { voile.toggle(); return; }
    }
    this.remove = function (lvl) {
        switch (lvl) {
            case 0: voile.toggle(); voile.show(5); doc.byID("arcanik-remove-deck").selectedIndex = 0; break;
            case 1:
                voile.show(0); var actdeck = parseInt(doc.byID("arcanik-campaign-maindeck").selectedIndex);
                var name = doc.byID("arcanik-campaign-lab"+(actdeck-1)).value;
                remnode(doc.byID("arcanik-campaign-info"+(actdeck-1))); remnode(doc.byID("arcanik-campaign-lab"+(actdeck-1)));
                doc.byID("arcanik-campaign-maindeck").selectedIndex--;
                for (var it= actdeck; it < this.nbsaves; it++) doc.byID("arcanik-campaign-lab"+it).setAttribute("id","arcanik-campaign-lab"+(it-1));
                this.nbsaves--;
                if (actdeck == 1) {
                    doc.byID("arcanik-campaign-garrowup").style.display = "none";
                    doc.byID("arcanik-campaign-creaform").style.display = "block";
                    doc.byID("arcanik-campaign-saveform").style.display = "none";
                }
                if (this.nbsaves == 0) doc.byID("arcanik-campaign-garrowdn").style.display = "none";
                db.execute("DELETE FROM saves WHERE name='"+name+"';").then(function onStatementComplete (res) {
                    voile.show(5); doc.byID("arcanik-remove-deck").selectedIndex = 1; });
                break;
        }
    }
    this.insert = function (idx,name,date,timed,lvl,display) {
        var node = addnode(0,"vbox",{"id":"arcanik-campaign-info"+idx},doc.byID("arcanik-campaign-maindeck"));
        addnode(0,"label",{"value":name,"class":"arcanik-mainmenu-campaign-mainlab"},node);
        node = addnode(0,"hbox",{"class":"arcanik-mainmenu-campaign-infos"},node);
        addnode(0,"label",{"value":date},node); addnode(0,"spacer",{"flex":50},node);
        if (timed > 59) {
            if (timed > 3600) {
                var tmp_time = ((timed - timed%3600)/3600)+":"+((timed%3600 < 600)? "0":"");
                timed = tmp_time+((timed%3600 - timed%60)/60)+":"+((timed%60 < 10)? "0":"")+(timed%60);
            }
            else timed = ((timed - timed%60)/60)+":"+((timed%60 < 10)? "0":"")+(timed%60)
        } else timed += " secs";
        addnode(0,"label",{"value":timed},node);
        var clas = "arcanik-mainmenu-campaign-labs arcanik-mainmenu-campaign-lab"+lvl;
        var dict = {"value":name,"class":clas,"id":"arcanik-campaign-lab"+idx}; if (display) dict["style"] = "display:none;";
        addnode(0,"label",dict,doc.byID("arcanik-campaign-labs"));
    }
    this.play = function () { play(true); }
    this.init = function () {
        addRune(109,0,0,doc.byID("arcanik-campaign-arrowup")); addRune(109,0,180,doc.byID("arcanik-campaign-arrowdn"));
        Sqlite.openConnection({path: "saves.sqlite"}).then(
            function onConnection (dbcon) {
                db = dbcon;
                db.tableExists("saves").then(
                    function onExist (result) {
                        if (result) {
                            var req = "SELECT name,crea_date,time FROM saves;";
                            db.execute(req).then(function onStatementComplete(result) {
                                campaign.nbsaves = result.length;
                                if (result.length > 0) doc.byID("arcanik-campaign-garrowdn").style.display = "block";
                                for (idx in result) {
                                    var lvl = 3; if (idx == 0 || idx == 1) lvl = parseInt(idx) + 1; var disp = (idx > 2)? true : false;
                                    campaign.insert(idx,result[idx].getResultByIndex(0),result[idx].getResultByIndex(1),result[idx].getResultByIndex(2),lvl,disp);
                                }
                            });
                        }
                        else {
                            var req = "CREATE TABLE saves ('name' TEXT,'crea_date' DEFAULT CURRENT_TIMESTAMP,'time' INT DEFAULT 0,'data' TEXT DEFAULT '');";
                            db.execute(req).then(function onStatementComplete (result) {});
                        }
                    }
                );
            },
            function onError (error) { quit(); }
        );
    }
    this.init();
}
/*MISSION CLASS*/
function missionClass () {
    //
    //
    this.play = function () { play(false); }
    this.init = function () {
        //
        //
        //
    }
    this.init();
}
/*PLAY FUNCTION*/
var tmp_name = "";
function play (camp) {
    voile.toggle(); voile.show(0); var win = (camp)? "campaign" : "mission";
    if (camp) { var actid = doc.byID("arcanik-campaign-maindeck").selectedIndex -1; tmp_name = doc.byID("arcanik-campaign-lab"+actid).value; }
    else {
        //
        //
        //
    }
    var args = "chrome"; if (prefs.getBoolPref("arcanik.fullscreen")) args += ",fullscreen,hidechrome"; else args += ",centerscreen";
    window.open("chrome://arcanik/content/"+win+".xul","arcns-game",args);
}

