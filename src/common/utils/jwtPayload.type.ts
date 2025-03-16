export enum JWTTokenType {
  ACCESS = 'access',
}

export type JwtPayload = {
  email: string;
  sub: number;
  tokenType?: JWTTokenType;
  permissions?: Array<string>;
  role?: string;
};
