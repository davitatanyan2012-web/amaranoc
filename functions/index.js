// =========================================================================
// functions/index.js
//
// Firebase Cloud Function (2nd Gen), որը գեներացնում է Agora RTC token։
// Այս տարբերակը ՉԻ պահանջում Blaze plan, քանի որ App Certificate-ը
// պահվում է .env ֖ֆայլում, ոչ թե Secret Manager-ով։
// =========================================================================

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

// App ID-ն հրապարակային է, վտանգ չի կրում կոդում մնալը
const AGORA_APP_ID = "b9e6e5e569894f369175e111915e188b";

// App Certificate-ը կարդացվում է .env ֖ֆայլից (functions/.env)
// ⚠️ ԿԱՐևՈՐ. functions/.env ֖ֆայլը ՊԵՏՔ Է լինի .gitignore-ի մեջ,
// որպեսզի երբեք git/GitHub չգնա։
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

exports.generateAgoraToken = onCall((request) => {
  // 1) Միայն մուտք գործած օգտատերերին թողնել
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Պետք է մուտք գործած լինես token ստանալու համար։"
    );
  }

  const channelName = request.data.channelName;
  if (!channelName || typeof channelName !== "string") {
    throw new HttpsError("invalid-argument", "channelName պարտադիր է։");
  }

  if (!AGORA_APP_CERTIFICATE) {
    console.error("AGORA_APP_CERTIFICATE սահմանված չէ .env ֖ֆայլում։");
    throw new HttpsError("internal", "Server-ի կարգավորումը թերի է։");
  }

  const account = request.auth.uid;
  const expirationTimeInSeconds = 3600; // 1 ժամ
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const role = RtcRole.PUBLISHER;

  const token = RtcTokenBuilder.buildTokenWithAccount(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channelName,
    account,
    role,
    privilegeExpiredTs
  );

  return {
    token,
    appId: AGORA_APP_ID,
    uid: account,
    expiresAt: privilegeExpiredTs,
  };
});