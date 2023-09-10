export class FirebaseAuthModel{
    private email: string;
    private password: string;
    private returnSecureToken: Boolean;

    constructor(email:string, password: string, returnSecureToken: boolean) {
        this.email = email;
        this.password = password;
        this.returnSecureToken = returnSecureToken;
    }
}

export class FirebaseResponse {
    public kind: string;
    public idToken: string;
    public email: string;
    public refreshToken: string;
    public expiresIn: string;
    public localId: string;
    public registered?: boolean;

    constructor(kind: string, idToken: string, email: string, refreshToken: string, expiresIn: string, localId: string, registered?: boolean){
        this.kind = kind;
        this.idToken = idToken;
        this.email = email;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.localId = localId;
        this.registered = registered;
    }
}
