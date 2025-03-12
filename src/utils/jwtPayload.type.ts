export enum JWTTokenType {
  ACCESS = 'access',
}

export type JwtPayload = {
  email: string;
  sub: string;
  originalEmail?: string;
  originalSub?: string;
  tokenType?: JWTTokenType;
  permissions?: Array<string>;
};
