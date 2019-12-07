// this function I created port forwards the console to a given element
(function (logger) {console.old = console.log;console.log = function () {var output = "", arg, i;for (i = 0; i < arguments.length; i++) {arg = arguments[i];output += "<span class=\"log-" + (typeof arg) + "\">";if (typeof arg === "object" && typeof JSON === "object" && typeof JSON.stringify === "function") {output += JSON.stringify(arg);} else {output += arg;} output += "</span>&nbsp;";}logger.innerHTML += output + "<br>";console.old.apply(undefined, arguments);};})(document.getElementById("settingsPage_console"));
console.log("==========TESTING==========");
console.log(navigator.platform, navigator.userAgent, navigator.onLine, navigator.language, new Date());
console.log("==========TESTING==========");

// These are universal variables used throughout the entire program
var settings;


// Programming Note: don't remove this function when modifying



            


    

// Used for geo tagging devices (personal hobby) NOT IN USE
function checkinGeoTag() {
    const deviceAnalystics = {
        "deviceName": 1,
        "onlineStatus": navigator.onLine,
        "userAgent": navigator.userAgent,
        "cookieStatus": navigator.cookieEnabled,
        "platform": navigator.platform,
        "device": navigator.product,
        "language": navigator.language,
        "app": navigator.platform,
        "currentOS": navigator.oscpu
    };
    
    if (navigator.geolocation) {
        console.log('Geolocation is supported!');
        function calculateDistance(lat1, lon1, lat2, lon2) {
          var R = 6371; // km
          var dLat = (lat2 - lat1).toRad();
          var dLon = (lon2 - lon1).toRad(); 
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                  Math.sin(dLon / 2) * Math.sin(dLon / 2); 
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
          var d = R * c;
          return d;
        }
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        };
        
        // Initiate the geolocation function
        window.onload = function() {
          var startPos;
          navigator.geolocation.getCurrentPosition(function(position) {
            startPos = position;
            document.getElementById('startLat').innerHTML = startPos.coords.latitude;
            document.getElementById('startLon').innerHTML = startPos.coords.longitude;
          }, function(error) {
            alert('[Error]: Error code: ' + error.code);
            // error.code can be: 0: unknown error, 1: permission denied, 2: position unavailable, 3: timed out
          });
          
          navigator.geolocation.watchPosition(function(position) {
              document.getElementById('currentLat').innerHTML = position.coords.latitude;
              document.getElementById('currentLon').innerHTML = position.coords.longitude;
              document.getElementById('distance').innerHTML = calculateDistance(startPos.coords.latitude, startPos.coords.longitude, position.coords.latitude, position.coords.longitude);
          });
        };
    } else { console.log('Geolocation is not supported on this device.'); }
}

// Generate a QR for the python backend
function generateQR() {
    var images = document.getElementById('qrcode').getElementsByTagName('img');
    for(var i = 0; i < images.length; i++) { images[i].parentNode.removeChild(images[i]); }
    
    // const string = document.getElementById('demosubmit').value;
    const string = gameData.results().toString();
    var txtNode;
    var qrcodjs = new QRCode("qrcode", {
        width: window.innerHeight,
        height: window.innerHeight,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    if (txtNode) txtNode.parentNode.removeChild(txtNode);
    txtNode = document.createTextNode(string);
    
    if (string !== "") {
        qrcodjs.makeCode(string);
        var dataURL = document.getElementById('qrcode').querySelector('canvas').toDataURL();
    }
}

class Settings {
    constructor() {
        this.user = "";
        this.compSwitch = false;
        this.testSwitch = true;
    }
    
    // Toggles betweem test mode and default mode
    // Programming Note: Don't remove when modding
    toggleTestMode() {
        if (!document.getElementById('testModeToggle').checked) {
            this.testSwitch = false;
            console.log("[MinuteBots [SYSTEM LOG]]: testModeToggle = off");
        } else {
            this.testSwitch = true;
            console.log("[MinuteBots [SYSTEM LOG]]: testModeToggle = on");
        }
    }
    
    // Asks for the user's first and last name
    getUser() {
        this.user = prompt("What is your first and last name?");
        if (this.user !== null) {
            if (confirm('Is “' + this.user + '” your name?')) this.user = this.user;
            else if (this.user === "null" || this.user === null || this.user === "") return; 
            else this.getUser();
        }
    }
    
    // Toggles betweem competition mode and default mode
    // Programming Note: Don't remove when modding
    toggleCompetitionMode() {
        if (!document.getElementById('developerModeToggle').checked) {
            this.compSwitch = false;
            console.log("[MinuteBots [SYSTEM LOG]]: competitionModeToggle = off");
            
            window.addEventListener('offline', function(e) {});
            window.addEventListener('online', function(e) {});
        } else {
            this.compSwitch = true;
            console.log("[MinuteBots [SYSTEM LOG]]: developerModeToggle = on");
            
            this.getUser(); // Get the user's info
            
            window.addEventListener('offline', function(e) { console.log('[MinuteBots [SYSTEM LOG]]: navigator.onLine = offline');  });
            window.addEventListener('online', function(e) {
                console.log('[MinuteBots [SYSTEM LOG]]: navigator.onLine = online'); 
                
                var client = new XMLHttpRequest();
                client.open("POST", "/log", false); // third parameter indicates sync xhr
                client.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                client.send('analyticsData');
                
                var data = JSON.stringify({
                    location: location.href,
                    time: Date(),
                    user: this.user,
                    data: gameData.allData
                });
                
                console.log("[MinuteBots [DATA LOG]]: " + data);
                navigator.sendBeacon('minutebots4536_dataBeacon', data);
            });
        }
    }
    
    // Determines what switch was toggled
    toggleSwitch(element) {
        if (element === "testMode") this.toggleTestMode();
        if (element === "developerMode") this.toggleCompetitionMode();
    }
}


// Programming Note: when modding don't remove
            


// Programming Note: when modding don't remove
            


// Programming Note: when modding don't remove
            


// Programming Note: when modding, don't remove this function
            