import type * as firebase from 'firebase-admin';

export const environment = {
  production: false,
  boincServer: 'https://boinc.bakerlab.org/rosetta',
  firebase: {
    databaseURL: "https://fir-opis-coin-default-rtdb.firebaseio.com",
    serviceAccount: {
      type: "service_account",
      project_id: "fir-opis-coin",
      private_key_id: "2a76de4d4c36346f4aa34ca269a62dfc7cd6c1e3",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCglwFaAA4ff+XH\nsObUIDX8RJQxPw1UaE3DSIuRRjFFJU0kWVyipo2jRFEDn2tgAuUD3YPFtQrQBTif\nf/KOAITZQdXqcA4AYCn6cGjyQZhhofmuy/kCkJfqq7V2DjIvZkbfkcb0KPN60y2Z\nrt8NApkzunOrPo0Tf2oqe1sh03e4mMGx8jxukaK0FtwfeP+JDE8UpO7jBgbYDlsR\n04vbSbe+9nYhx/TXXIuYJjCgki+3/rZiv0H4Qvgo9N59BAgmnA5p9kUPMb769t4o\nYpivQYF07SBSHmfDG0hasNznU4VBMJ1tL3He+agKWOk2cC9QB7PG+r4DuwWva2+5\nQ4fUoxQPAgMBAAECggEAH9njgDzLkE7XPdSl68PZwUe+1sepNqkbZ1SvregspIjB\n9Kguuenr5MqLgPrxGpFoZ+xbEu8WDm1Crkv7yVNsBgVLTtzbwhJQsSXzgr0k4pR0\nR8mYAXy5TOeyrZAiPwl7nCM3QT0QEbfp7vXisptl1H8yKvBUnd3jKjreN+bP85Iz\n6+kcJ4pANFeM4Rk29Xxoq7foisCwXqqtPR4/UYO64mgv8cfubWOahPRqpi1+dg6f\nt1wtR2j0boLE4FP60b/2xkPOO4jACwzx5D2jjYplMZpRlDmUckI8SDzbFj+6Kpr3\n5L0f/42SqSdoAPuyHjocCtRUV+QhkPk2H222YmRQgQKBgQDer7Fny1abAi7ER9eu\n9XULfd1ZaOJSNiGaoc68P0YxJzgpRkOru3ovffb665ajWgt0UmiLu75NUaGZi36m\nVEf/2wmhQfULU+E4KDOpfx16DRasO5QN9icy9QnFCUna3CKSBD0vJutPQ7mYD7kP\nFmmiJeKpOr6eOhzh2/etnyn1jwKBgQC4nS4XBmyYtE3o5bhB/6NQY1Dtw8Xg0fV/\neqJrCK17bFhODzowwpagRh/RAbg/yyAd7zbsDNVCvHpETSwutarKk/RrVKXFVR2v\nWhuyYKPA5iiTh5MIYGSyRlhvwJkX0jWcasSI9MhqviH1OBeE3as4M8qrEfHtbbWJ\nBE3+MFa5gQKBgQDToFCOfXV+tmJPcp8MzIRBOYpEUCLVUlA5LhDUYaWJTOZYg0gI\nSpDh1WoEKCPudcJw92gXc4J05GEZFLJ1y57pDfZm49HGxB5DSiFesUkIFqw3Xh9j\n7UxvZuOz9xHTBmVsMs8aonf5yjj0w+xw5DHbQPnZLdS9dijAlFUbESnFDQKBgH+Y\no3Jmjkg81lxR6bgz57x36EdtOCba9sLVD8zKgpz7lUzeWWm6FEFSNktO1PnCesA1\nxdAATqWBf0AV1qOyDAlXmWdVaf2phorbzKjNAmEgsorE+WqgtPhChn02sJk2QLeL\nU6sVBDBCmVXTHu5GB0EhCsKR9JQVb5Lz1rQI1OgBAoGADoTow/1Z2QWqKo15gxwt\nHrg+8fBXUDoDCBs8Hpz2jTJFsM9B5Dzn32cQZMijV7IK81ZnuHPYlDxEMjJC2SLr\nu2RIYtbDwY6/eq/X57L9R5K34WCxHhbb0TOhYOT+oAx/HM7plnkb40zcHSDJlM0p\nK3HXOLZ5vEehDsloex1mpy8=\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-jb2qf@fir-opis-coin.iam.gserviceaccount.com",
      client_id: "104256233608904325292",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jb2qf%40fir-opis-coin.iam.gserviceaccount.com"
    } as firebase.ServiceAccount
  }
};
