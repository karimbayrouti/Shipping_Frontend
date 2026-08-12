/** Mirrors Moc.API's DefaultResponse<T> envelope (core/api boundary — see docs/StateAndData.md). */
export interface ApiEnvelope<T> {
  readonly isSuccess: boolean;
  readonly data: T | null;
  readonly code: number;
  readonly errorMessageEn: string | null;
  readonly errorMessageAr: string | null;
}

/** Subset of Moc.Core's ADUserResponse relevant to the AD directory view. */
export interface AdEmployee {
  readonly displayName: string | null;
  readonly jobTitle: string | null;
  readonly department: string | null;
  readonly mail: string | null;
  readonly mobilePhone: string | null;
  readonly officeLocation: string | null;
  readonly userPrincipalName: string | null;
}
