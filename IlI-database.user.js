// ==UserScript==
// @name         IlI DataBase
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  send Data from LW to DataBase
// @author       Revan
// @match        https://last-war.de/view_report_attack.php?*
// @match        https://last-war.de/planetenscanner_view.php?*
// @grant        none
// @require      https://apis.google.com/js/api.js
// ==/UserScript==

(function() {
    'use strict';

    var info = new Array()
    const besitzer = 0
    const allianz = 1
    const rasse = 2
    const att = 3
    const def = 4
    const pKlasse = 5

    var build = new Array()
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

    var research = new Array()
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
    const RKR = 0
    const RFB = 0
    const ROR = 0
    const RFZ = 0
    const RGO = 0

    var url = window.location.toString()
    var e;
    var parseButton = document.createElement('button');

    if (url.includes("scanner")){
        e = document.getElementById("clickForParsURL")
        parseButton.innerHTML = "Spiobericht parsen";
        parseButton.onclick = getSpioInfo;
        e.parentNode.insertBefore(parseButton, e);
        e.parentNode.removeChild(e);

    }

     if (url.includes("attack")){
        e = document.getElementById("clickForParsURL")
        parseButton.innerHTML = "Kampfbericht parsen";
        e.parentNode.insertBefore(parseButton, e);
        e.parentNode.removeChild(e);
    }

    function getSpioInfo(){
        authenticate().then(loadClient).then(execute)
        var elements = document.getElementsByTagName("td")
        info[besitzer] = elements[0].innerText
        info[allianz] = elements[2].innerText
        info[rasse] = elements[3].innerText
        info[att] = elements[4].innerText.match(/\d/g).join("")
        info[def] = elements[5].innerText.match(/\d/g).join("")
        info[pKlasse] = elements[6].innerText

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

            }
        }
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
             )
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

    gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: "587564190346-s178n6nmvfro115lv8gi27o061hmcgf9.apps.googleusercontent.com"});
    });
}



)();
