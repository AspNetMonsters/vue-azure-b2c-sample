import * as msal from "@azure/msal-browser";
import Vue, { PluginObject, VueConstructor } from "vue";

declare module "vue/types/vue" {
    interface Vue {
        $msal: MsalPlugin;
    }
}

export interface MsalPluginOptions {
    clientId: string;
    loginAuthority: string;
    passwordAuthority: string;
    knownAuthority: string;
}

let msalInstance: msal.PublicClientApplication;

export let msalPluginInstance: MsalPlugin;

export class MsalPlugin implements PluginObject<MsalPluginOptions> {

    private pluginOptions: MsalPluginOptions = {
        clientId: "",
        loginAuthority: "",
        passwordAuthority: "",
        knownAuthority: ""
    };

    public isAuthenticated = false;


    public install(vue: VueConstructor<Vue>, options?: MsalPluginOptions): void {
        if (!options) {
            throw new Error("MsalPluginOptions must be specified");
        }
        this.pluginOptions = options;
        this.initialize(options);
        msalPluginInstance = this;
        vue.prototype.$msal = Vue.observable(msalPluginInstance);
    }

    private initialize(options: MsalPluginOptions) {
        const msalConfig: msal.Configuration = {
            auth: {
                clientId: options.clientId,
                authority: options.loginAuthority,
                knownAuthorities: [options.knownAuthority]
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level: msal.LogLevel, message: string, containsPii: boolean): void => {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case msal.LogLevel.Error:
                                console.error(message);
                                return;
                            case msal.LogLevel.Info:
                                console.info(message);
                                return;
                            case msal.LogLevel.Verbose:
                                console.debug(message);
                                return;
                            case msal.LogLevel.Warning:
                                console.warn(message);
                                return;
                        }
                    },
                    piiLoggingEnabled: false,
                    logLevel: msal.LogLevel.Verbose
                }
            }
        };
        msalInstance = new msal.PublicClientApplication(msalConfig);
        this.isAuthenticated = this.getIsAuthenticated();
    }


    public async signIn() {
        try {
            const loginRequest: msal.PopupRequest = {
                scopes: ["openid", "profile", "offline_access", "https://davecob2cc.onmicrosoft.com/bcc7d959-3458-4197-a109-26e64938a435/access_api"],
            };
            const loginResponse: msal.AuthenticationResult = await msalInstance.loginPopup(loginRequest);
            this.isAuthenticated = !!loginResponse.account;
            // do something with this?
        } catch (err) {
            // handle error
            if (err.errorMessage && err.errorMessage.indexOf("AADB2C90118") > -1) {
                try {
                    const passwordResetResponse: msal.AuthenticationResult = await msalInstance.loginPopup({
                        scopes: ["openid", "profile", "offline_access", "https://davecob2cc.onmicrosoft.com/bcc7d959-3458-4197-a109-26e64938a435/access_api"],
                        authority: this.pluginOptions.passwordAuthority
                    });
                     this.isAuthenticated = !!passwordResetResponse.account;
                } catch (passwordResetError) {
                    console.error(passwordResetError);
                }
            } else {
                this.isAuthenticated = false;
            }

        }
    }

    public async signOut() {
        await msalInstance.logout();
        this.isAuthenticated = false;
    }

    public async acquireToken() {
        const request = {
            account: msalInstance.getAllAccounts()[0],
            scopes: ["https://davecob2cc.onmicrosoft.com/bcc7d959-3458-4197-a109-26e64938a435/access_api"]
        };
        try {
            const response = await msalInstance.acquireTokenSilent(request);
            return response.accessToken;            
        } catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                return msalInstance.acquireTokenPopup(request).catch((popupError) => {
                    console.error(popupError);
                });
            }
            return false;
        }
    }

    private getIsAuthenticated(): boolean {
        const accounts: msal.AccountInfo[] = msalInstance.getAllAccounts();
        return accounts && accounts.length > 0;
    }
}
