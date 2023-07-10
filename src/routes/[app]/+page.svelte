<script lang="ts">
	import { afterNavigate } from "$app/navigation";
    import { URL_APP, appIsOpen, appWindows, tryOpenApp } from "$lib/appManager";
	import { currentWindow } from "$lib/store";
	import type { PageData } from "./$types";

    export let data: PageData

    afterNavigate(() => {
        const appComp = URL_APP.get(data.app)!;
        if (!appIsOpen(appComp))
            tryOpenApp(appComp);
        currentWindow.set(appWindows.get(appComp)!);
    })

</script>