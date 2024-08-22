(function () {

    let script = document.currentScript;
    let src = script.src;
    let index = src.lastIndexOf("/");
    src = src.substring(0, index);

    function loadPackage() {

        let package = script.getAttribute("data-package");
        let packageRoot = script.getAttribute("data-package-root");
        if (!packageRoot) {
            packageRoot = src;
        }
        if (!package) {
            fetch(src + "/package.json").then((x) => x.json().then((json) => {
                script.setAttribute("data-package", json.name);
                loadPackage();
            }));
            return;
        }

        const view = script.getAttribute("data-view");

        let host = script.getAttribute("data-host");

        const replace = script.getAttribute("data-replace");

        const args = script.getAttribute("data-json-args") || "{}";

        const packed = JSON.parse(script.getAttribute("data-packed") ?? "true");
        const min = JSON.parse(script.getAttribute("data-min") ?? "true");

        const viewUrl = `${packageRoot}/${view}${packed ? ".pack" : ""}${min ? ".min" : ""}.js`;
        const viewName = `${package}/${view}`;

        (function (url, success, error) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            var s = script;
            s.onerror = function (e) { alert("Script " + url + " failed to load"); if (error) error(e); else console.error(e); };
            s.onload = s.onreadystatechange = function () {
            if ((s.readyState && s.readyState !== "complete" && s.readyState !== "loaded")) {
            if (error) error(); else console.error("error loading " + url);
                return;
            }
            s.onload = s.onreadystatechange = null;
                success();
            };
            document.body.appendChild(s);
        }) (viewUrl, function () {
            function empty () {
                return function () {
                    return null
                }
            }

            AmdLoader.moduleProgress = empty;
            function done (view) {
                const we = document.getElementById("webAtomsLoader");
                if (we) {
                    we.remove();
                }
                if (args && view && view.element) {
                    view.element.setAttribute("data-json-args", args);
                }
            };
            UMD.setupRoot(package, packageRoot);
            UMD.lang = "en-US";
            if (replace) {
                host = document.createElement("section");
                script.parentElement.replaceChild(section, script);
            } 

            if (host) {
                UMD.hostView(host, viewName, 0).then(done);
            } else {
                UMD.loadView(viewName, 0).then(done);
            }            
        });

    }

    loadPackage();

    try {
        if (document.querySelector(`link[rel="manifest]`)) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register("/pwa-sw.js")
                    .then(function (registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                        registration.update().then(() => {
                            console.log("Registration updated");
                        }).catch(console.error);
                    }).catch(console.error);
            }
        }
    }
    catch (error) {
        console.error(error);
    }
    
})();