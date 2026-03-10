import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    const parsed: ServiceAccount = JSON.parse(serviceAccount);
    return initializeApp({ credential: cert(parsed) });
  }

  // Fallback: project ID only (works with Application Default Credentials / gcloud CLI)
  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const app = getAdminApp();
export const adminDb = getFirestore(app);
