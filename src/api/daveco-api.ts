import { msalPluginInstance } from "@/plugins/msal-plugin";

class DaveCoApi {
    async getSuperSecretThings(): Promise<any[]> {
        const accessToken = await msalPluginInstance.acquireToken();
        const response = await fetch('/api/secret/', {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        });
        if (response.ok){
            return await response.json();
        } else {
            return [];
        }
    }
}


export default new DaveCoApi();