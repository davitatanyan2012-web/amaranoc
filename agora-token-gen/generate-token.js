// =========================================================================
// generate-token.js
//
// Ինքնուրույն Node.js script, որը գեներացնում է Agora WILDCARD token։
// Wildcard token-ը աշխատում է ԲՈԼՈՐ channel-ների համար, ոչ թե միայն մեկի,
// ուստի պետք չէ ամեն user-զույգի (channel) համար առանձին token։
//
// ՕԳՏԱԳՈՐԾՈՒՄ.
//   1) Տեղադրիր package-ը մեկ անգամ.
//        npm install agora-access-token
//   2) Ամեն անգամ, երբ պետք է նոր token (օրինակ՝ ամեն օր).
//        node generate-token.js
//   3) Copy արա արդյունքում տպված token-ը և տեղադրիր
//      PremiumChat.jsx-ի AGORA_TOKEN հաստատունում։
//   4) Redeploy արա frontend-ը.
//        npm run build
//        firebase deploy --only hosting
// =========================================================================

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

// ⚠️ Փոխարինիր սրանք քո սեփական արժեքներով
const APP_ID = "c227a9221f8c49d898e172403865e494";
const APP_CERTIFICATE = "35207f3cb1ab49459dbeb95a05fff3cf"; // Agora Console-ից

// "*" նշանակում է "ցանկացած channel" (wildcard) — այս token-ով
// user-երը կարող են միանալ ՑԱՆԿԱՑԱԾ channel-ի, ոչ միայն մեկին։
const WILDCARD_CHANNEL = "*";

// "*" uid-ի համար նույնպես նշանակում է "ցանկացած user" կարող է
// օգտագործել այս token-ը (քանի որ յուրաքանչյուր օգտատեր ունի իր uid-ը)։
const WILDCARD_UID = 0; // 0-ը Agora-ում նշանակում է "wildcard uid"

const ROLE = RtcRole.PUBLISHER;

// Token-ի վավերականության ժամկետը։ Agora-ի սահմանաչափը առավելագույնը
// 24 ժամ է (86400 վրկ)։ Դնում ենք 24 ժամ, որպեսզի օրը մեկ թարմացնես։
const EXPIRATION_TIME_IN_SECONDS = 86400; // 24 ժամ

function generateToken() {
  if (APP_CERTIFICATE === "ՔՈ_PRIMARY_CERTIFICATE_Ը_ԱՅՍՏԵԵ") {
    console.error(
      "\n❌ Սխալ. Փոխարինիր APP_CERTIFICATE-ը script-ի սկզբում քո իրական Primary Certificate-ով։\n"
    );
    process.exit(1);
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + EXPIRATION_TIME_IN_SECONDS;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    WILDCARD_CHANNEL,
    WILDCARD_UID,
    ROLE,
    privilegeExpiredTs
  );

  const expiresAtDate = new Date(privilegeExpiredTs * 1000);

  console.log("\n=================================================");
  console.log("✅ Նոր Wildcard Token գեներացված է.");
  console.log("=================================================\n");
  console.log(token);
  console.log("\n-------------------------------------------------");
  console.log("Վավեր է մինչև.", expiresAtDate.toLocaleString());
  console.log("=================================================\n");
  console.log(
    "Հիմա copy արա այս token-ը և տեղադրիր PremiumChat.jsx-ի\nAGORA_TOKEN հաստատունում, հետո redeploy արա frontend-ը։\n"
  );
}

generateToken();