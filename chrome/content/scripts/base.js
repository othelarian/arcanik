/*BASED COMPONENTS*/
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/Sqlite.jsm");
Components.utils.import("resource://gre/modules/osfile.jsm");
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
runes_paths = [
    "","M0 -9 L9 0 L0 9 L-9 0 Z","M-1 9 L-9 9 L-19 1 L-11 1 Z","M0 -9 L9 0 L0 9 L-9 9 L-19 1 L-9 1 Z","M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z",
    "M0 9 L-9 -1 L-19 -1 L-9 -9 L0 -9 L9 0 Z","M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L -11 0 Z","M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L9 0 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z","M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M0 -9 L9 0 L0 9 L-9 0 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M-1 9 L-9 9 L-19 1 L-11 1 Z","M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M0 -9 L9 0 L0 9 L-9 9 L-19 1 L-9 1 Z",
    "M-11 -1 L-19 -1 L-9 -9 L-9 -19 L-1 -19 L-1 -11 Z","M0 9 L-9 -1 L-19 -1 L-9 -9 L-9 -19 L-1 -19 L-1 -9 L9 0 Z",
    "M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L-1 -19 L-1 -11 L-11 0 Z","M-1 -9 L-1 -19 L-9 -19 L-9 -9 L-19 0 L-9 9 L-1 9 L9 0 Z",
    "M1 9 L9 9 L19 1 L11 1 Z","M1 9 L9 9 L19 1 L9 1 L0 -9 L-9 0 Z","M1 9 L9 9 L19 1 L11 1 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M9 9 L19 1 L9 1 L0 -9 L-9 1 L-19 1 L-9 9 Z","M1 9 L9 9 L19 1 L11 1 Z M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z",
    "M1 9 L-9 -1 L-19 -1 L-9 -9 L-1 -9 L9 1 L19 1 L9 9 Z","M1 9 L9 9 L19 1 L11 1 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L -11 0 Z",
    "M9 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L9 1 L19 1 Z","M1 9 L9 9 L19 1 L11 1 Z M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M1 9 L9 9 L19 1 L9 1 L0 -9 L-9 0 Z","M1 9 L9 9 L19 1 L11 1 Z M-1 9 L-9 9 L-19 1 L-11 1 Z M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M9 9 L19 1 L9 1 L0 -9 L-9 1 L-19 1 L-9 9 Z","M1 9 L9 9 L19 1 L11 1 Z M-11 -1 L-19 -1 L-9 -9 L-9 -19 L-1 -19 L-1 -11 Z",
    "M1 9 L-9 -1 L-19 -1 L-9 -9 L-9 -19 L-1 -19 L-1 -9 L9 1 L19 1 L9 9 Z","M1 9 L9 9 L19 1 L11 1 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L-1 -19 L-1 -11 L-11 0 Z",
    "M-9 9 L-19 0 L-9 -9 L-9 -19 L-1 -19 L-1 -9 L9 1 L19 1 L9 9 Z","M1 -9 L9 -9 L19 -1 L11 -1 Z","M 0 9 L-9 0 L1 -9 L9 -9 L19 -1 L9 -1 Z",
    "M1 -9 L9 -9 L19 -1 L11 -1 Z M-1 9 L-9 9 L-19 1 L-11 1 Z","M-9 9 L-19 1 L-9 1 L1 -9 L9 -9 L19 -1 L9 -1 L-1 9 Z",
    "M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z M1 -9 L9 -9 L19 -1 L11 -1 Z","M0 9 L-9 -1 L-19 -1 L-9 -9 L9 -9 L19 -1 L9 -1 Z",
    "M1 -9 L9 -9 L19 -1 L11 -1 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L -11 0 Z","M-1 9 L-9 9 L-19 0 L-9 -9 L9 -9 L19 -1 L9 -1 Z",
    "M1 -9 L9 -9 L19 -1 L11 -1 Z M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z","M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M1 -9 L9 -9 L19 -1 L9 -1 L0 9 L-9 0 Z",
    "M1 -9 L9 -9 L19 -1 L11 -1 Z M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M-9 9 L-19 1 L-9 1 L1 -9 L9 -9 L19 -1 L9 -1 L-1 9 Z","M-11 -1 L-19 -1 L-9 -9 L-9 -19 L-1 -19 L-1 -11 Z M1 -9 L9 -9 L19 -1 L11 -1 Z",
    "M0 9 L9 -1 L19 -1 L9 -9 L-1 -9 L-1 -19 L-9 -19 L-9 -9 L-19 -1 L-9 -1 Z","M1 -9 L9 -9 L19 -1 L11 -1 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L-1 -19 L-1 -11 L-11 0 Z",
    "M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L-1 -19 L-1 -9 L9 -9 L19 -1 L9 -1 Z","M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z","M1 9 L-9 0 L1 -9 L9 -9 L19 0 L9 9 Z",
    "M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z M-1 9 L-9 9 L-19 1 L-11 1 Z","M9 9 L-9 9 L-19 1 L-9 1 L1 -9 L9 -9 L19 0 Z",
    "M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z","M1 9 L-9 -1 L-19 -1 L-9 -9 L9 -9 L19 0 L9 9 Z",
    "M-1 -9 L-9 -9 L-19 0 L-9 9 L-1 9 L-11 0 Z M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z","M9 9 L-9 9 L-19 0 L-9 -9 L9 -9 L19 0 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z","M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M1 -9 L9 -9 L19 0 L9 9 L1 9 L-9 0 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-1 -11 L-9 -11 L-9 -19 L-1 -19 Z M9 9 L19 0 L9 -9 L1 -9 L-9 1 L-19 1 L-9 9 Z","M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z M-11 -1 L-19 -1 L-9 -9 L-9 -19 L-1 -19 L-1 -11 Z",
    "M1 9 L-9 -1 L-19 -1 L-9 -9 L-9 -19 L-1 -19 L-1 -9 L9 -9 L19 0 L9 9 Z","M1 -9 L9 -9 L19 0 L9 9 L1 9 L11 0 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L-1 -19 L-1 -11 L-11 0 Z",
    "M-9 9 L-19 0 L-9 -9 L-9 -19 L-1 -19 L-1 -9 L9 -9 L19 0 L9 9 Z","M1 -11 L9 -11 L9 -19 L1 -19 Z","M1 -11 L9 -11 L9 -19 L1 -19 Z M0 -9 L9 0 L0 9 L-9 0 Z",
    "M1 -11 L9 -11 L9 -19 L1 -19 Z M-1 9 L-9 9 L-19 1 L-11 1 Z","M0 -9 L9 0 L0 9 L-9 9 L-19 1 L-9 1 Z M1 -11 L9 -11 L9 -19 L1 -19 Z",
    "M1 -11 L9 -11 L9 -19 L1 -19 Z M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z","M1 -11 L9 -11 L9 -19 L1 -19 Z M0 9 L-9 -1 L-19 -1 L-9 -9 L0 -9 L9 0 Z",
    "M1 -11 L9 -11 L9 -19 L1 -19 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L -11 0 Z","M1 -11 L9 -11 L9 -19 L1 -19 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L9 0 Z",
    "M-9 -11 L-9 -19 L9 -19 L9 -11 Z","M-9 -11 L-9 -19 L9 -19 L9 -11 Z M0 -9 L9 0 L0 9 L-9 0 Z","M-9 -11 L-9 -19 L9 -19 L9 -11 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-9 -11 L-9 -19 L9 -19 L9 -11 Z M0 -9 L9 0 L0 9 L-9 9 L-19 1 L-9 1 Z","M9 -19 L9 -11 L-1 -11 L-11 -1 L-19 -1 L-9 -9 L-9 -19 Z",
    "M0 9 L-9 -1 L-19 -1 L-9 -9 L-9 -19 L9 -19 L9 -11 L-1 -11 L9 0 Z","M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -11 L-1 -11 L-11 0 Z",
    "M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -11 L-1 -11 L9 0 Z","M1 -11 L1 -19 L9 -19 L9 -11 Z M11 1 L19 1 L9 9 L1 9 Z",
    "M1 -11 L1 -19 L9 -19 L9 -11 Z M1 9 L-9 0 L1 -9 L9 1 L19 1 L9 9 Z","M1 -11 L1 -19 L9 -19 L9 -11 Z M11 1 L19 1 L9 9 L1 9 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M1 -11 L1 -19 L9 -19 L9 -11 Z M-9 9 L-19 1 L-9 1 L0 -9 L9 1 L19 1 L9 9 Z","M1 -11 L1 -19 L9 -19 L9 -11 Z M11 1 L19 1 L9 9 L1 9 Z M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z",
    "M1 -11 L1 -19 L9 -19 L9 -11 Z M1 9 L-9 -1 L-19 -1 L-9 -9 L-1 -9 L9 1 L19 1 L9 9 Z","M1 -11 L1 -19 L9 -19 L9 -11 Z M11 1 L19 1 L9 9 L1 9 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L-11 0 Z",
    "M1 -11 L1 -19 L9 -19 L9 -11 Z M-9 9 L-19 0 L-9 -9 L-1 -9 L9 1 L19 1 L9 9 Z","M-9 -11 L-9 -19 L9 -19 L9 -11 Z M11 1 L19 1 L9 9 L1 9 Z",
    "M-9 -11 L-9 -19 L9 -19 L9 -11 Z M1 9 L-9 0 L1 -9 L9 1 L19 1 L9 9 Z","M-9 -11 L-9 -19 L9 -19 L9 -11 Z M11 1 L19 1 L9 9 L1 9 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-9 -11 L-9 -19 L9 -19 L9 -11 Z M-9 9 L-19 1 L-9 1 L0 -9 L9 1 L19 1 L9 9 Z","M11 1 L19 1 L9 9 L1 9 Z M-11 -1 L-19 -1 L-9 -9 L-9 -19 L9 -19 L9 -11 L-1 -11 Z",
    "M1 9 L-9 -1 L-19 -1 L-9 -9 L-9 -19 L9 -19 L9 -11 L-1 -11 L9 1 L19 1 L9 9 Z","M11 1 L19 1 L9 9 L1 9 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -11 L-1 -11 L-11 0 Z",
    "M-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -11 L-1 -11 L9 1 L19 1 L9 9 Z","M11 -1 L1 -11 L1 -19 L9 -19 L9 -9 L19 -1 Z",
    "M0 9 L-9 0 L1 -9 L1 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M11 -1 L1 -11 L1 -19 L9 -19 L9 -9 L19 -1 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-1 9 L-9 9 L-19 1 L-9 1 L1 -9 L1 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M11 -1 L1 -11 L1 -19 L9 -19 L9 -9 L19 -1 Z M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z",
    "M0 9 L-9 -1 L-19 -1 L-9 -9 L1 -9 L1 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M11 -1 L1 -11 L1 -19 L9 -19 L9 -9 L19 -1 Z M-1 9 L-9 9 L-19 0 L-9 -9 L-1 -9 L -11 0 Z",
    "M-1 9 L-9 9 L-19 0 L-9 -9 L1 -9 L1 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M-9 -11 L-9 -19 L9 -19 L9 -9 L19 -1 L11 -1 L1 -11 Z",
    "M0 9 L-9 0 L1 -11 L-9 -11 L-9 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M-9 -11 L-9 -19 L9 -19 L9 -9 L19 -1 L11 -1 L1 -11 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-1 9 L-9 9 L-19 1 L-9 1 L1 -11 L-9 -11 L-9 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M-11 -1 L-19 -1 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 -1 L11 -1 L0 -11 Z",
    "M0 9 L-9 -1 L-19 -1 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 -1 L9 -1 L0 -11 L-11 0 Z",
    "M-1 9 L-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 -1 L9 -1 Z","M1 9 L11 0 L1 -11 L1 -19 L9 -19 L9 -9 L19 0 L9 9 Z",
    "M1 9 L-9 0 L1 -9 L1 -19 L9 -19 L9 -9 L19 0 L9 9 Z","M1 9 L11 0 L1 -11 L1 -19 L9 -19 L9 -9 L19 0 L9 9 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-9 9 L-19 1 L-9 1 L1 -9 L1 -19 L9 -19 L9 -9 L19 0 L9 9 Z","M1 9 L11 0 L1 -11 L1 -19 L9 -19 L9 -9 L19 0 L9 9 Z M-11 -1 L-19 -1 L-9 -9 L-1 -9 Z",
    "M1 9 L9 9 L19 0 L9 -9 L9 -19 L1 -19 L1 -9 L-9 -9 L-19 -1 L-9 -1 Z","M-1 -9 L-9 -9 L-19 0 L-9 9 L-1 9 L-11 0 Z M1 -11 L1 -19 L9 -19 L9 -9 L19 0 L9 9 L1 9 L11 0 Z",
    "M-9 9 L-19 0 L-9 -9 L1 -9 L1 -19 L9 -19 L9 -9 L19 0 L9 9 Z","M-9 -11 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 L1 9 L11 0 L1 -11 Z",
    "M1 9 L-9 0 L1 -11 L-9 -11 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 Z","M-9 -11 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 L1 9 L11 0 L1 -11 Z M-1 9 L-9 9 L-19 1 L-11 1 Z",
    "M-9 9 L-19 1 L-9 1 L1 -11 L-9 -11 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 Z","M1 9 L11 0 L0 -11 L-11 -1 L-19 -1 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 Z",
    "M1 9 L-9 1 L-19 1 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 Z","M-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 L1 9 L11 0 L0 -11 L-11 0 L-1 9 Z",
    "M-9 9 L-19 0 L-9 -9 L-9 -19 L9 -19 L9 -9 L19 0 L9 9 Z",
];
function addRune (idx,pos,rot,prt,id=null) {
    var nod = doc.createElementNS("http://www.w3.org/2000/svg","g"); if (id != null) nod.setAttribute("id",id);
    nod.setAttribute("transform","rotate("+rot+"),translate(0,-"+pos+")");
    var pth = doc.createElementNS("http://www.w3.org/2000/svg","path"); pth.setAttribute("d",runes_paths[idx]);
    pth.setAttribute("filter","url(#filt)"); prt.appendChild(nod); nod.appendChild(pth);
    pth = doc.createElementNS("http://www.w3.org/2000/svg","path"); pth.setAttribute("d",runes_paths[idx]);
    nod.appendChild(pth); prt.appendChild(nod);
}
var rune_blurval = 0; var rune_invert = false;
function rune_bluring () {
    var nod = doc.byID("filt");
    nod.setAttribute("width",10+rune_blurval*4); nod.setAttribute("height",10+rune_blurval*4);
    doc.byID("radius",rune_blurval*3); doc.byID("gauss").setAttribute("stdDeviation",rune_blurval);
    if (invert) { if (rune_blurval == 1) rune_invert = false; rune_blurval--; }
    else { if (rune_blurval == 9) irune_nvert = true; rune_blurval++; }
    window.setTimeout(rune_bluring,120);
}
/*BASE INIT*/
var db = null, prefs = Services.prefs, arc_strs = null, voile = null;
var Cc = Components.classes, Ci = Components.interfaces, Cr = Components.results;
function initBase () { voile = new voileClass(); arc_strs = doc.byID("arcanik-strings"); }
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
/*3D OBJECTS*/
var scene3D = {
   canvas: null, height:0, width:0, view_ang: 0, renderer: null, nb_lghts: 20, loader: null,
   //
   centcam: null, camera: null, canmove: false, scene: null, usemap: false,
   //
   initScene: function (name) { ajaxfun("chrome://arcanik/content/models/scenes/"+name,"",scene3D.loadScene,false,true); },
   loadScene: function (res) {
       //
       window.dump(res); window.dump("\n");
       //
       scene3D.loader.load("chrome://arcanik/content/models/socles/socle_test.json",scene3D.testloader);
       //
   },
   cleanScene: function () {
       //
       //
       //
   },
   //
   testloader: function (geom,mats) {
       //
       var mat_model = new THREE.MeshFaceMaterial(mats);
       //
       var bld_model = new THREE.Mesh(geom,mat_model);
       //
       scene3D.scene.add(bld_model);
       //
       scene3D.renderer.render(scene3D.scene,scene3D.camera);
       //
   },
   //
   //
   init3D: function (zone3D_id,initScene,usemap=false) {
       this.canvas = doc.byID(zone3D_id); this.view_ang = 45;
       this.width = this.canvas.clientWidth; this.height = this.canvas.clientHeight; var aspect = this.width / this.height;
       var near = 0.1; var far = 1000; this.initScene(initScene);
       //
       window.dump(this.width); window.dump(this.height); window.dump("\n");
       //
       this.renderer = new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:true}); this.renderer.setSize(this.width,this.height);
       this.camera = new THREE.PerspectiveCamera(this.view_ang,aspect,near,far);
       //
       this.scene = new THREE.Scene();
       //
       this.scene.add(this.camera);
       //
       this.camera.position.set(0,0,50);
       //
       //
       var env_light = new THREE.AmbientLight(0x404040); this.scene.add(env_light);
       //
       //
       // TEST
       var light = new THREE.PointLight(0xffffff,1,100);
       light.position.set(0,0,10);
       this.scene.add(light);
       // TEST
       //var pointLight = new THREE.PointLight
       //pointLight.position.x = 10
       //
       //
       //this.canvas.append(this.renderer);
       //
       this.centcam = new THREE.Object3D();
       //
       this.usemap = usemap;
       //
       this.loader = new THREE.JSONLoader();
       //
       //
       // TODO : init de la 3D
       //
       this.renderer.render(this.scene,this.camera);
       //
   }
}

