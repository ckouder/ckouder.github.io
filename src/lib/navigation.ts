import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { get } from "svelte/store";
import { URL_APP, tryOpenApp } from "./appManager";

export function visit(url: string) {
    if (url === get(page).url.pathname) {
        let app = url.split('/')[1];
        tryOpenApp(URL_APP.get(app));
    }
    history.pushState({}, '', url);
    // console.log(url);
    goto(url);
}