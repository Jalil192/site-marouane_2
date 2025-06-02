// === CONFIGURATION ===
const PARTICIPANTS_SHEET = "participants";
const NEWSLETTER_SHEET = "newsletter";
const STATS_SHEET = "stats";

// === Fonction pour enregistrement participation formulaire ===
function doPost(e) {
const data = JSON.parse(e.postData.contents);
const route = e.parameter.route;

if (route === "illumine") {
return enregistrerParticipation(data);
} else if (route === "newsletter") {
return enregistrerNewsletter(data);
} else if (route === "stats") {
return sauvegarderStats(data);
} else {
return ContentService.createTextOutput("❌ Route inconnue").setMimeType(ContentService.MimeType.TEXT);
}
}

// === Fonction pour GET des stats ===
function doGet(e) {
if (e.parameter.route === "get-stats") {
const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(STATS_SHEET);
const data = feuille.getDataRange().getValues();
const header = data[0];
const row = data[1] || [];

const obj = {};
header.forEach((key, i) => {
try {
obj[key] = JSON.parse(row[i]);
} catch {
obj[key] = row[i];
}
});

return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

return ContentService.createTextOutput("❌ Route inconnue").setMimeType(ContentService.MimeType.TEXT);
}

// === Enregistre une participation ===
function enregistrerParticipation(data) {
const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PARTICIPANTS_SHEET);
feuille.appendRow([
new Date(),
data.nom || "",
data.prenom || "",
data.email || "",
data.instagram || "",
data.pays || "",
data.cause || ""
]);

return ContentService.createTextOutput("✅ Participation enregistrée").setMimeType(ContentService.MimeType.TEXT);
}

// === Enregistre une inscription newsletter ===
function enregistrerNewsletter(data) {
const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NEWSLETTER_SHEET);
feuille.appendRow([
new Date(),
data.email || ""
]);

return ContentService.createTextOutput("✅ Email newsletter enregistré").setMimeType(ContentService.MimeType.TEXT);
}

// === Met à jour les stats ===
function sauvegarderStats(data) {
const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(STATS_SHEET);
const { causeCount, countryMap } = data;

feuille.getRange("A2").setValue(new Date());
feuille.getRange("B2").setValue(JSON.stringify(causeCount));
feuille.getRange("C2").setValue(JSON.stringify(countryMap));

return ContentService.createTextOutput("✅ Stats sauvegardées").setMimeType(ContentService.MimeType.TEXT);
}
	

