/*BASED COMPONENTS*/
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/Sqlite.jsm");
/*REWRITE DOCUMENT*/
var doc=document;
Document.prototype.byID=function (ch) { return this.getElementById(ch); }
Node.prototype.byTAG=function (ch) { return this.getElementsByTagName(ch); }
var lns = ["http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul","http://www.w3.org/1999/xhtml","http://www.w3.org/2000/svg"];
function addnode (ns,tag,attrs,prt) {
    if (ns == 1) tag = "html:"+tag; if (ns == 2) tag = "svg:"+tag;
    var nd = doc.createElementNS(lns[ns],tag);
    if (attrs!="") modnode(nd,attrs); prt.appendChild(nd); return nd;
}
function modnode (nd,attrs) {
    for (attr in attrs) {
        if (attr == "texte") {
            if (nd.hasChildNodes()) nd.replaceChild(doc.createTextNode(attrs[attr]),nd.firstChild);
            else nd.appendChild(doc.createTextNode(attrs[attr]));
        }
        else if (attr=="xlink:href") nd.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",attrs[attr]);
        else nd.setAttribute(attr,attrs[attr]);
    }
}
function remnode (nd) { nd.parentNode.removeChild(nd); }
function clonode (ns,ndo,ndp) {
    var nodl = ndo.childNodes;
    for (var it = 0; it < nodl.length; it++) {
        if (nodl[it].nodeType == 1) {
            var dict = "";
            if (nodl[it].attributes.length != 0) {
                dict = {}; var attrs = nodl[it].attributes;
                for (var et = 0; et < attrs.length; et++) dict[attrs[et].nodeName] = attrs[et].nodeValue;
            }
            nod = addnode(ns,nodl[it].nodeName,dict,ndp); if (nodl[it].hasChildNodes()) clonode(ns,nodl[it],nod);
        }
        else if (nodl[it].nodeType == 3) ndp.appendChild(nodl[it].cloneNode(true));
    }
}
function cloneSVG (r,n) {
    r = r.documentElement; r.removeAttribute("xmlns"); r.removeAttribute("xmlns:xlink");
    var dict = {}; var attrs = r.attributes;
    for (var it = 0; it < attrs.length; it++) dict[attrs[it].nodeName] = attrs[it].nodeValue;
    n = addnode(2,"svg",dict,n); clonode(2,r,n);
}
/*AJAX COMMANDS*/
var ajax = new XMLHttpRequest();
var ajaxfun = function (add,tabp,fres,type,sync) {
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4) {if (fres != "") { if(type) fres(ajax.responseXML); else fres(ajax.responseText); }}}
    if (tabp == "") ajax.open("GET",add,sync);
    else {
        ajax.open("POST",add,sync); ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        var d=""; for (var i=0;i<tabp.length;i++) { if(i!=0) d=d+"&"; d=d+"info"+i+"="+tabp[i]; }
    }
    ajax.send(d);
}
/*RUNE CREATION*/
function creaRune (ch,rot,dist,prt,id=null) {
    var dict = {"transform":"rotate("+rot+"),translate(0,-"+dist+")"}; if (id != null) dict["id"] = id;
    var rune = addnode(2,"g",dict,prt);
    if (ch[0] == "y") addnode(2,"use",{"xlink:href":"#rune-core"},rune);
    if (ch[1] == "y") addnode(2,"use",{"xlink:href":"#rune-left-down"},rune);
    if (ch[2] == "y") addnode(2,"use",{"xlink:href":"#rune-left-middle"},rune);
    if (ch[3] == "y") addnode(2,"use",{"xlink:href":"#rune-left-up"},rune);
    if (ch[4] == "y") addnode(2,"use",{"xlink:href":"#rune-right-down"},rune);
    if (ch[5] == "y") addnode(2,"use",{"xlink:href":"#rune-right-middle"},rune);
    if (ch[6] == "y") addnode(2,"use",{"xlink:href":"#rune-right-up"},rune);
}
/*BASE INIT*/
var db = null, prefs = Services.prefs, arc_strs = null, voile = null;
var Cc = Components.classes, Ci = Components.interfaces, Cr = Components.results;
function initBase () {
    voile = new voileClass();
    //
    //
}
/*VOILE CLASS*/
function voileClass () {
    this.voile = null; this.deck = null; this.state = true;
    this.toggle = function () { this.state = !this.state; this.voile.hidden = this.state; this.deck.hidden = this.state; }
    this.show = function (n) { this.deck.selectedIndex = n; }
    this.init = function () { this.voile = doc.byID("arcanik-voile"); this.deck = doc.byID("arcanik-voile-deck"); }
    this.init();
}
/*QUIT FUNCTION*/
function quit () {
    var audio_lst = doc.byTAG("html:audio"); for (var it=0; it < audio_lst.length; it++) audio_lst[it].pause();
    db.close().then(function onClose () { window.setTimeout("Services.startup.quit(Services.startup.eAttemptQuit);",500); });
}

