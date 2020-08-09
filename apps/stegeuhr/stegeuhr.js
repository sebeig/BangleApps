/*
Alles Gute zum Geburtstag Stefan!
Ich hoffe du hast Spaß damit.
*/

function breakLines(text) {
    var width = g.getWidth();
    var height = g.getHeight();
    require('FontDylex7x13').add(Graphics);
    g.setFont('Dylex7x13',3);
    var lineArray = text.split(" ");
    var lines = [];
    var currentLine = "";
    for (var i in lineArray) {
      if (g.stringWidth(currentLine + " " + lineArray[i]) <= width) {
        currentLine = currentLine + " " + lineArray[i];
      } else {
        lines.push(currentLine.trim());
        currentLine = lineArray[i];
      }
    }
    lines.push(currentLine.trim());
    return lines;
}

function getTimeString() {
    var currentDate = new Date();
    var lastChecked;
    var patienceString;
    var saveChecked = require("Storage");
    try {
        var readString = saveChecked.read("stegeuhr.save");
        lastChecked = parseFloat(readString);
    } catch (e) {
        lastChecked = 0;
    } 
    var patience = Date.now() - lastChecked;
    if ((patience > 200) && (patience < 60000)) {
        patienceString = "noch immer ";
    } else {
        patienceString = "";
    }
    var hourString = [
        "Zwölf",
        "Eins",
        "Zwei",
        "Drei",
        "Vier",
        "Fünf",
        "Sechs",
        "Sieben",
        "Acht",
        "Neun",
        "Zehn",
        "Elf",
        "Zwölf",
        "Eins"];  
    var timeString = "";
    var hour = currentDate.getHours();
    if (hour > 12) {
        hour = hour - 12;
    }
    var minutes = currentDate.getMinutes();
    if (minutes < 3) {
        timeString = "Es ist "+patienceString+"Punkt "+hourString[hour]+".";
    } else if (minutes < 13) {
        timeString = "Es ist "+patienceString+"kurz nach "+hourString[hour]+".";
    } else if (minutes < 18) {
        timeString = "Es ist "+patienceString+"viertel "+hourString[hour+1]+".";
    } else if (minutes < 28) {
        timeString = "Es ist "+patienceString+"kurz vor halb "+hourString[hour+1]+".";
    } else if (minutes < 33) {
        timeString = "Es ist "+patienceString+"halb "+hourString[hour+1]+".";
    } else if (minutes < 43) {
        timeString = "Es ist "+patienceString+"kurz nach halb "+hourString[hour+1]+".";
    } else if (minutes < 48) {
        timeString = "Es ist "+patienceString+"dreiviertel "+hourString[hour+1]+".";
    } else if (minutes < 58) {
        timeString = "Es ist "+patienceString+"kurz vor "+hourString[hour+1]+".";
    } else {
        timeString = "Es ist "+patienceString+"Punkt "+hourString[hour+1]+".";
    }
    lastChecked = Date.now();
    saveChecked.write("stegeuhr.save", lastChecked.toString(), 0);
    return timeString;
}

function drawTimeString() {
    var timeString = getTimeString();
    g.clear();
    Bangle.drawWidgets();
    var fontSize = 13*3;
    var startY = 0;
    var lines = breakLines(timeString);
    startY = (g.getHeight() / 2) - ((lines.length * fontSize)/2);
    for (var i in lines) {
        var x = (g.getWidth() / 2) - (g.stringWidth(lines[i])/2);
        g.drawString(lines[i], x, startY);
        startY = startY + fontSize;
    }
}

Bangle.loadWidgets();
Bangle.drawWidgets();

Bangle.on('twist', drawTimeString);

setWatch(
    function() {
        drawTimeString();
    }, BTN1, {edge:"rising", debounce:50, repeat:true}
    );

setWatch(Bangle.showLauncher, BTN2, { repeat: false, edge: "falling" });
