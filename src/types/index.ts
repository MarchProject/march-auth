
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum RoleUser {
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
}

export class UpdateStatusInput {
    id: string;
}

export class CreateResponse {
    id?: string;
    role?: RoleUser;
    username?: string;
}

export abstract class IMutation {
    abstract tokenExpire(refreshToken: string): Token | Promise<Token>;

    abstract signIn(username: string, password: string): Token | Promise<Token>;

    abstract signOut(id: string): SignOutResponse | Promise<SignOutResponse>;

    abstract createUser(username: string, password: string): CreateResponse | Promise<CreateResponse>;

    abstract redis(test: string): string | Promise<string>;

    abstract verifyAccessToken(token: string): VerifyAccessTokenResponse | Promise<VerifyAccessTokenResponse>;

    abstract signInOAuth(code: string): Token | Promise<Token>;

    abstract oAuthUrl(): string | Promise<string>;
}

export abstract class IQuery {
    abstract status(): string | Promise<string>;
}

export class SignOutResponse {
    id: string;
}

export class Token {
    access_token: string;
    refresh_token?: string;
    username?: string;
    userId?: string;
}

export class VerifyAccessTokenResponse {
    success?: boolean;
}

export type SortOrder = any;
