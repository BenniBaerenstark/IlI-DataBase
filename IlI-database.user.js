// ==UserScript==
// @name         IlI DataBase
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  send Data from LW to DataBase
// @author       Revan
// @match        https://last-war.de/planetenscanner_view.php?*
// @match        https://last-war.de/view/content/new_window/observationen_view.php?*
// @match        https://last-war.de/view_report_attack.php?*
// @match        https://last-war.de/planetenscanner_view_public.php?*
// @grant        none
// @require      https://apis.google.com/js/api.js
// ==/UserScript==

(function() {
    'use strict';

    var info = new Array(9)
    const gala = 0
    const sys = 1
    const planet = 2
    const besitzer = 3
    const allianz = 4
    const rasse = 5
    const att = 6
    const def = 7
    const pKlasse = 8

    var build = new Array(29)
    const HQ = 0 // Hauptquartier
	const BZ = 1 // Bauzentrale
	const FZ = 2 // Forschungszentrale
	const SPS = 3 // Spionagestation
	const FE = 4 // Roheisen Mine
	const KRIS = 5 // Kristall Förderungsanlage
	const FRUB = 6 // Frubin Sammler
	const ORI = 7 // Orizin Gewinnungsanlage
	const FRUZ = 8 // Frurozin Herstellung
	const GOLD = 9 // Gold Mine
	const FEL = 10 // Roheisen Lager
	const KRISL = 11 // Kristall Lager
	const FRUBL = 12 // Frubin Lager
	const ORIL = 13 // Orizin Lager
	const FRUZL = 14 // Frurozin Lager
	const GOLDL = 15 // Gold Lager
	const KKW = 16 // Kernkraftwerk
	const FKW = 17 // Fusionskraftwerk
	const RSF = 18 // Raumschiff Fabrik
	const VTS = 19 // Verteidigungsstation
	const SPA = 20 // Spionageabwehr
	const FWA = 21 // Frühwarnanlage
	const HA = 22 // Hohe Akademie
	const HP = 23 // Handelsposten
	const HZ = 24 // Handelszentrum
	const BANK = 25 // Bank
	const KI = 26 // Kreditinstitut
	const WS = 27 // Werkstatt
	const GDZ = 28 // Geheimdienstzentrum

    var research = new Array(30)
	const SPIO = 0 // Spionage
	const ESPIO = 1 // Erweiterte Spionage
	const SU = 2 // Signalübertragung
	const MB = 3 // Multiples Bauen
	const IH = 4 // Interstellarer Handel
	const SK = 5 // Schiffskonstruktion
	const TK = 6 // Taktische Kriegsfuhrung
	const TT = 7 // Tarntechnologie
	const IONI = 8 // Ionisation
	const VBT = 9 // Verbrennungstechnik
	const MT = 10 // Metallurgie
	const EB = 11 // Energiebündelung ,
	const LD = 12 // Ladedocks
	const NT = 13 // Nanotechnologie
	const PL = 14 // Plasmaforschung
	const HE = 15 // HochexplosiveSubstanzen
	const SF = 16 // Schildforschung
	const EL = 17 // Erweiterte Legierungen
	const BIO = 18 // Biotechnologie
	const ST = 19 // Strahlenforschung
	const HT = 20 // Hochtechnologie
	const RAK = 21 // Raketenforschung
	const NS = 22 // NanoSynthese
	const AM = 23 // Antimaterietechnologie
	const TELE = 24 // Teleporttechnologie
	const NUK = 25 // Nukleartriebwerke
	const ION = 26 // Ionisationantrieb
	const HYP = 27 // Hyperraumantrieb
	const GTY = 28 // Gravitationsantrieb
	const KV = 29 // Kolonieverwaltung

    var ress = new Array()
    const RFE = 0
    const RKR = 1
    const RFB = 2
    const ROR = 3
    const RFZ = 4
    const RGO = 5

    var url = window.location.toString()
    var e;
    var parseButton = document.createElement('button');

    if (url.includes("planetenscanner_view.php")){
        e = document.getElementById("clickForParsURL")
        parseButton.innerHTML = "Spiobericht parsen";
        parseButton.onclick = getSpioInfo;
        e.parentNode.insertBefore(parseButton, e);
        e.parentNode.removeChild(e);

    }
    if (url.includes("planetenscanner_view_public.php")){
        parseButton.style = "float: right;"
        e = document.getElementById("table")
        var ec = document.getElementById("tableOS")
        parseButton.innerHTML = "Spiobericht parsen";
        parseButton.onclick = getSpioInfo;
        e.insertBefore(parseButton,ec)
    }

     if (url.includes("attack")){
        e = document.getElementById("clickForParsURL")
        e.click()
        parseButton.innerHTML = "Kampfbericht parsen";
        e.parentNode.insertBefore(parseButton, e);
        e.parentNode.removeChild(e);
        parseButton.onclick = getKBInfo;
    }

    if (url.includes("observationen_view")){
        parseButton.style = "float: right;"
        e = document.getElementById("table")
        ec = document.getElementById("tableOS")
        parseButton.innerHTML = "Obervationsbericht parsen";
        parseButton.onclick = getSpioInfo;
        e.insertBefore(parseButton,ec)
    }

    function getSpioInfo(){
        var koords = document.getElementsByTagName("th")[0].innerText.match(/\d+/g).map(Number)
        info[gala] = koords[koords.length-3]
        info[sys] = koords[koords.length-2]
        info[planet] = koords[koords.length-1]
        var elements = document.getElementsByTagName("td")
        info[besitzer] = elements[0].innerText
        info[allianz] = elements[2].innerText
        info[rasse] = elements[3].innerText
        info[att] = elements[4].innerText.match(/\d/g).join("")
        info[def] = elements[5].innerText.match(/\d/g).join("")
        info[pKlasse] = elements[6].innerText
        if(elements.length > 7){
            ress[RGO] = elements[elements.length - 1].innerText
            ress[RFZ] = elements[elements.length - 3].innerText
            ress[ROR] = elements[elements.length - 5].innerText
            ress[RFB] = elements[elements.length - 7].innerText
            ress[RKR] = elements[elements.length - 9].innerText
            ress[RFE] = elements[elements.length - 11].innerText
        }

        build[GDZ] = ""
        research[KV] = ""
        for (var i = 7; i < elements.length-6; i++){
            var str = elements[i].innerText
            var key = str.replace(/[0-9]/g, '')
            if (str.match(/\d/g) != null) var number = str.match(/\d/g).join("")
            
            switch(key){
                case "Hauptquartier ": build[HQ] = number; break;
                case "Bauzentrale " : build[BZ] = number; break;
                case "Forschungszentrale " : build[FZ] = number; break;
                case "Spionagestation " : build[SPS] = number; break;
                case "Roheisen Mine " : build[FE] = number; break;
                case "Kristall Förderungsanlage " : build[KRIS] = number; break;
                case "Frubinsammler " : build[FRUB] = number; break;
                case "Orizingewinnungsanlage " : build[ORI] = number; break;
                case "Frurozin Herstellung " : build[FRUZ] = number; break;
                case "Gold Mine " : build[GOLD] = number; break;
                case "RoheisenLager " : build[FEL] = number; break;
                case "Kristall Lager " : build[KRISL] = number; break;
                case "Frubin Lager " : build[FRUBL] = number; break;
                case "Orizin Lager " : build[ORIL] = number; break;
                case "Frurozin Lager " : build[FRUZL] = number; break;
                case "Gold Lager " : build[GOLDL] = number; break;
                case "Kernkraftwerk " : build[KKW] = number; break;
                case "Fusionskraftwerk " : build[FKW] = number; break;
                case "Raumschiff Fabrik " : build[RSF] = number; break;
                case "Verteidigungsstation " : build[VTS] = number; break;
                case "Spionageabwehr " : build[SPA] = number; break;
                case "Frühwarnanlage " : build[FWA] = number; break;
                case "Hohe Akademie " : build[HA] = number; break;
                case "Handelsposten " : build[HP] = number; break;
                case "Handelszentrum " : build[HZ] = number; break;
                case "Bank " : build[BANK] = number; break;
                case "Kreditinstitut " : build[KI] = number; break;
                case "Werkstatt " : build[WS] = number; break;
                case "Geheimdienstzentrum " : build[GDZ] = number; break;
                case "Spionage " : research[SPIO] = number; break;
                case "Erweiterte Spionage " : research[ESPIO] = number; break;
                case "Signalübertragung " : research[SU] = number; break;
                case "Multiples Bauen " : research[MB] = number; break;
                case "Interstellarer Handel " : research[IH] = number; break;
                case "Schiffskonstruktion " : research[SK] = number; break;
                case "Taktische Kriegsführung " : research[TK] = number; break;
                case "Tarntechnologie " : research[TT] = number; break;
                case "Ionisation " : research[IONI] = number; break;
                case "Verbrennungstechnik " : research[VBT] = number; break;
                case "Metallurgie " : research[MT] = number; break;
                case "Energiebündelung " : research[EB] = number; break;
                case "Ladedocks " : research[LD] = number; break;
                case "Nanotechnologie " : research[NT] = number; break;
                case "Plasmaforschung " : research[PL] = number; break;
                case "Hochexplosive Substanzen " : research[HE] = number; break;
                case "Schildforschung " : research[SF] = number; break;
                case "Erweiterte Legierungen " : research[EL] = number; break;
                case "Biotechnologie " : research[BIO] = number; break;
                case "Strahlenforschung " : research[ST] = number; break;
                case "Hochtechnologie " : research[HT] = number; break;
                case "Raketenforschung " : research[RAK] = number; break;
                case "Nano Synthese " : research[NS] = number; break;
                case "Antimaterietechnologie " : research[AM] = number; break;
                case "Teleporttechnologie " : research[TELE] = number; break;
                case "Nukleartriebwerke " : research[NUK] = number; break;
                case "Ionentriebwerke " : research[ION] = number; break;
                case "Hyperraumantrieb " : research[HYP] = number; break;
                case "Gravitationsantrieb " : research[GTY] = number; break;
                case "Kolonieverwaltung " : research[KV] = number; break;

            }
        }
         authenticate().then(loadClient).then(execute)
/*
        console.log("Besitzer: " + info[0] + "\n"
             + "Allianz:  " + info[1] + "\n"
             + "Rasse:    " + info[2] + "\n"
             + "Angriff:  " + info[3] + "\n"
             + "Verteidigung: " + info[4] + "\n"
             + "Planeten-Klasse: " + info[5] + "\n"
             + "Hauptquartier: " + build[HQ] + "\n"
             + "Bauzentrale " + build[BZ] + "\n"
             + "Forschungszentrale " + build[FZ] + "\n"
             + "Spionagestation " + build[SPS] + "\n"
             + "Roheisen Mine " + build[FE] + "\n"
             + "Kristall Förderungsanlage " + build[KRIS] + "\n"
             + "Frubinsammler " + build[FRUB] + "\n"
             + "Orizingewinnungsanlage " + build[ORI] + "\n"
             + "Frurozin Herstellung " + build[FRUZ] + "\n"
             + "Gold Mine " + build[GOLD] + "\n"
             + "RoheisenLager " + build[FEL] + "\n"
             + "Kristall Lager " + build[KRISL] + "\n"
             + "Frubin Lager " + build[FRUBL] + "\n"
             + "Orizin Lager " + build[ORIL] + "\n"
             + "Frurozin Lager " + build[FRUZL] + "\n"
             + "Gold Lager " + build[GOLDL] + "\n"
             + "Kernkraftwerk " + build[KKW] + "\n"
             + "Fusionskraftwerk " + build[FKW] + "\n"
             + "Raumschiff Fabrik " + build[RSF] + "\n"
             + "Verteidigungsstation " + build[VTS] + "\n"
             + "Spionageabwehr " + build[SPA] + "\n"
             + "Frühwarnanlage " + build[FWA] + "\n"
             + "Hohe Akademie " + build[HA] + "\n"
             + "Handelsposten " + build[HP] + "\n"
             + "Handelszentrum " + build[HZ] + "\n"
             + "Bank " + build[BANK] + "\n"
             + "Kreditinstitut " + build[KI] + "\n"
             + "Werkstatt " + build[WS] + "\n"
             + "Geheimdienstzentrum " + build[GDZ] + "\n"
             )*/
    }
    var kb
    function getKBInfo(){
        kb = new Array()
        const time = 0
        //Atacker
        const aBase_G = 1
        const aBase_S = 2
        const aBase_P = 3
        const aAlly = 4
        const aName = 5
        const aTotA = 6
        const aTotD = 7
        const aTak = 8
        const aLightA = 9
        const aLightA_S = 10
        const aLightD = 11
        const aLightD_S = 12
        const aMidA = 13
        const aMidA_S = 14
        const aMidD = 15
        const aMidD_S =16
        const aHeavyA = 17
        const aHeavyA_S = 18
        const aHeavyD = 19
        const aHeavyD_S = 20
        //Defender
        const dBase_G = 21
        const dBase_S = 22
        const dBase_P = 23
        const dAlly = 24
        const dName = 25
        const dTotA = 26
        const dTotD = 27
        const dDefA = 28
        const dDefA_S = 29
        const dDefD = 30
        const dDefD_S = 31
        const dDef_B = 32
        const dLightA = 33
        const dLightA_S = 34
        const dLightD = 35
        const dLightD_S = 36
        const dMidA = 37
        const dMidA_S = 38
        const dMidD = 39
        const dMidD_S = 40
        const dHeavyA = 41
        const dHeavyA_S = 42
        const dHeavyD = 43
        const dHeavyD_S = 44
        //Ress
        const rFe = 45
        const rKr = 46
        const rFb = 47
        const rOr = 48
        const rFz = 49
        const rGo = 50
        const paredsKB_URL = 51


        kb[time] = document.getElementsByTagName("b")[4].innerText
        e = document.getElementsByTagName("td")
        var s = e[12].innerText
        var attKords = getKoords(s)
        kb[aBase_G] = attKords[0]
        kb[aBase_S] = attKords[1]
        kb[aBase_P] = attKords[2]
        kb[aAlly] = getAllyTag(s)
        kb[aName] = getName(s)
        s = e[13].innerText
        var defKords = getKoords(s)
        kb[dBase_G] = defKords[0]
        kb[dBase_S] = defKords[1]
        kb[dBase_P] = defKords[2]
        kb[dAlly] = getAllyTag(s)
        kb[dName] = getName(s)
        kb[paredsKB_URL] = document.getElementById("inputUrlPars").value
        var posFe = getPosFe() + 7
        kb[rFe] = parseInt(e[posFe].innerText.replaceAll(".",""),10)
        kb[rKr] = parseInt(e[posFe+1].innerText.replaceAll(".",""),10)
        kb[rFb] = parseInt(e[posFe+2].innerText.replaceAll(".",""),10)
        kb[rOr] = parseInt(e[posFe+3].innerText.replaceAll(".",""),10)
        kb[rFz] = parseInt(e[posFe+4].innerText.replaceAll(".",""),10)
        kb[rGo] = parseInt(e[posFe+5].innerText.replaceAll(".",""),10)

        var attdef
        var survProc
        kb[aTak] = getAttDef(30)[0]
        attdef = getAttDef(62)
        kb[aLightA] = attdef[0]
        kb[aLightD] = attdef[1]
        survProc = getSurviveProc(67)
        kb[aLightA_S] = survProc[0]
        kb[aLightD_S] = survProc[1]
        attdef = getAttDef(80)
        kb[aMidA] = attdef[0]
        kb[aMidD] = attdef[1]
        survProc = getSurviveProc(85)
        kb[aMidA_S] = survProc[0]
        kb[aMidD_S] = survProc[1]
        attdef = getAttDef(98)
        kb[aHeavyA] = attdef[0]
        kb[aHeavyD] = attdef[1]
        survProc = getSurviveProc(103)
        kb[aHeavyA_S] = survProc[0]
        kb[aHeavyD_S] = survProc[1]
        attdef = getAttDef(123)
        kb[aTotA] = attdef[0]
        kb[aTotD] = attdef[1]

        attdef = getAttDef(42)
        kb[dDefA] = attdef[0]
        kb[dDefD] = attdef[1]
        survProc = getSurviveProc(37)
        kb[dDefA_S] = survProc[0]
        kb[dDefD_S] = survProc[1]
        kb[dDef_B] = s = e[129].innerText.match(/\d+/g).map(Number)[0] + "%"
        attdef = getAttDef(73)
        kb[dLightA] = attdef[0]
        kb[dLightD] = attdef[1]
        survProc = getSurviveProc(69)
        kb[dLightA_S] = survProc[0]
        kb[dLightD_S] = survProc[1]
        attdef = getAttDef(91)
        kb[dMidA] = attdef[0]
        kb[dMidD] = attdef[1]
        survProc = getSurviveProc(87)
        kb[dMidA_S] = survProc[0]
        kb[dMidD_S] = survProc[1]
        attdef = getAttDef(109)
        kb[dHeavyA] = attdef[0]
        kb[dHeavyD] = attdef[1]
        survProc = getSurviveProc(105)
        kb[dHeavyA_S] = survProc[0]
        kb[dHeavyD_S] = survProc[1]
        attdef = getAttDef(130)
        kb[dTotA] = attdef[0]
        kb[dTotD] = attdef[1]

        // console.log(kb)
        authenticate().then(loadClient).then(executeKB)
    }

    function getSurviveProc(pos){
        var s = e[pos].innerText
        if(s.match(/\d+/g) ){
            s = s.match(/\d+/g).map(Number)
            return [s[0] + "%",s[1] + "%"]
        }
        return ["",""]
    }

    function getAttDef(pos){
        var s = e[pos].innerText
        if(s.match(/\d+/g) ) return s.replaceAll(".","").match(/\d+/g).map(Number)
        return ["",""]
    }

    function getName(str){
        var posname = str.indexOf("]")+2
        return str.substring(posname,str.length-1)
    }

    function getAllyTag(str){
        var a = str.indexOf("[")
        var at = str.lastIndexOf("[")
        if(a == at){
            var b = str.indexOf("]")
            var bt = str.lastIndexOf("]")
            if(b == bt){
                return str.substring(a,b+1)
            }
        }
        return ""
    }
    function getKoords(str){
        var strKoords = str.match(/\dx\d{1,3}x\d{1,2}/gm)
        return strKoords[0].match(/\d+/g).map(Number)
    }
    function getPosFe(){
        var res = document.getElementsByTagName("td")
        for (var i = 130; i < res.length; i++){
            if(res[i].innerText.includes("Roheisen")) return i
        }
    }

    function authenticate() {
        return gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets"})
            .then(function() { console.log("Sign-in successful"); },
                  function(err) { console.error("Error signing in", err); });
    }
    function loadClient() {
        gapi.client.setApiKey("AIzaSyAt9GKBeELqepFiPLQboHOGb6s_2ftJG84");
        return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
            .then(function() { console.log("GAPI client loaded for API"); },
                  function(err) { console.error("Error loading GAPI client for API", err); });
    }

    function execute() {
        var data = new Array()
        data[0] = Date.now()/1000
        data = data.concat(info)
        data = data.concat(build)
        data = data.concat(research)
        data = data.concat(ress)
    return gapi.client.sheets.spreadsheets.values.append({
      "spreadsheetId": "1YBigAchu5Tm20hi1FCACOhpTVGDkP75V840NZz1EPYI",
      "range": "A1",
      "includeValuesInResponse": true,
      "insertDataOption": "INSERT_ROWS",
      "responseDateTimeRenderOption": "FORMATTED_STRING",
      "responseValueRenderOption": "FORMATTED_VALUE",
      "valueInputOption": "USER_ENTERED",
      "resource": {
        "values": [data

        ]
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
    function executeKB() {

    return gapi.client.sheets.spreadsheets.values.append({
      "spreadsheetId": "1YBigAchu5Tm20hi1FCACOhpTVGDkP75V840NZz1EPYI",
      "range": "KB!A1",
      "includeValuesInResponse": true,
      "insertDataOption": "INSERT_ROWS",
      "responseDateTimeRenderOption": "FORMATTED_STRING",
      "responseValueRenderOption": "FORMATTED_VALUE",
      "valueInputOption": "USER_ENTERED",
      "resource": {
        "values": [kb

        ]
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

    gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: "587564190346-s178n6nmvfro115lv8gi27o061hmcgf9.apps.googleusercontent.com"});
    });
}



)();
