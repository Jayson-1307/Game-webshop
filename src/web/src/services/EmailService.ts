/**
 * API-extension for the HBO-ICT.Cloud library
 *
 * @module
 */
import { api } from "@hboictcloud/api";
import { ApiFailResponse, ApiFailReason, PromiseReject, PromiseResolve, Options, Email } from "./types";
 
let options: Options = {
    url: "https://api.hbo-ict.cloud",
    apiKey: "pb4d2324_goocaanuuzoo59.5137IgujcWaASJuj",
    database: "pb4d2324_goocaanuuzoo59_dev",
    environment: "dev"
};
 
 
api.configure(options);
   
 
/**
 * Configure the HBO-ICT.Cloud API
 *
 * @param newOptions - Options-object to configure the HBO-ICT.Cloud API
 *
 * @throws When the Options-object is incomplete, an exception is thrown detailing the missing information.
 *
 * @example
 * ```ts
 * import { api } from "@hboictcloud/api";
 *
 * api.configure({
 *     url: "https://api.hbo-ict.cloud",
 *     apiKey: "yourapikey",
 *     database: "yourdatabasename",
 *     environment: "targetenvironment"
 * });
 * ```
 */
export function configure(newOptions: Options): boolean {
    const errors: any[] = [];
 
    if (!newOptions.url) {
        errors.push("- url => API-URL from HBO-ICT.Cloud");
    }
 
    if (!newOptions.apiKey) {
        errors.push("- apiKey => API-Key from HBO-ICT.Cloud");
    }
 
    if (!newOptions.database) {
        errors.push("- database => Name of target database for queries");
    }
 
    if (!newOptions.environment) {
        errors.push("- environment => Name of the environment");
    }
 
    if (errors.length > 0) {
        throw `HBO-ICT.Cloud API configuration is missing one or more properties:\n${errors.join("\n")}`;
    }
 
    options = newOptions;
 
    return true;
}
 
/**
 * Send an email
 *
 * @param email - Email-object describing the email to send
 *
 * @returns Returns a promise which can either fail (`string` with reason) or succeed (`string` with status)
 *
 * @throws When the API has not been properly configured using {@link configure}, an exception is thrown detailing the missing information.
 *
 * @example
 * ```ts
 * import { api } from "@hboictcloud/api";
 *
 * try {
 *     const data = await api.sendEmail({
 *         from: {
 *             name: "Group",
 *             address: "group@fys.cloud"
 *         },
 *         to: [
 *             {
 *                 name: "Lennard Fonteijn",
 *                 address: "l.c.j.fonteijn@hva.nl"
 *             }
 *         ],
 *         subject: "Just a test!",
 *         html: "<h1>Hello Lennard!</h1><p>This is an email :)</p>"
 *     });
 *
 *     console.log(data);
 * }
 * catch(reason) {
 *     console.log(reason);
 * }
 * ```
 */
export function sendEmail(email: Email): Promise<string  > {
    assertConfiguration();
 
    return handleFetch<string>(options.url + "/mail", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${options.apiKey}`,
        },
        body: JSON.stringify(email),
    });
}
 
 
 
function handleFetch<T = any>(url: string, fetchOptions: RequestInit): Promise<T | ApiFailReason> {
 
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return new Promise(async (resolve: PromiseResolve, reject: PromiseReject) => {
        let response: Response;
 
        try {
            response = await fetch(url, fetchOptions);
        } catch (error) {
            apiFail(reject, 500, error);
 
            return;
        }
 
        try {
            const json: any = await response.json();
 
            if (response.status === 200) {
                resolve(json);
            } else {
                apiFail(reject, response.status, (<ApiFailResponse>json).reason);
            }
        } catch (error) {
            apiFail(reject, 500, error);
        }
    });
}
 
function apiFail(reject: PromiseReject, statusCode: number, reason?: string | any): void {
    if (statusCode === 400) {
        reject(reason || "Something bad happened, see console.");
    } else {
        reject("Something bad happened, see console.");
    }
}
 
function assertConfiguration(): void {
    if (!options) {
        throw "HBO-ICT.Cloud API is not properly configured!";
    }
}