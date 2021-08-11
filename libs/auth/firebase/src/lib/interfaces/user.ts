export interface User {
  uid?: string | undefined;
  email?: string | undefined;
  displayName?: string | undefined;
  photoURL?: string | undefined;
  emailVerified?: boolean | undefined;
  credit?: string | undefined;
  boincUser: Record<string, unknown> | undefined
}
