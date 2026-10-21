/* RewardKit tracking script.
   Plain ES5-ish IIFE, no dependencies, never throws. Drop-in:
   <script src="https://<app-host>/js/tracking.js" data-program-id="prg_xxx" async></script> */
(function () {
    try {
        var script = document.currentScript;
        if (!script) return;

        var programId = script.getAttribute("data-program-id");
        if (!programId) return;

        var COOKIE_NAME = "rk_visitor_id";
        // Program's urlParams are configured server-side; these are the defaults
        // the script probes when the program hasn't customized them.
        var URL_PARAMS = ["ref", "via", "aff", "referral_code"];

        // Resolve the endpoint against where THIS script was served from — a
        // relative path would hit the partner's own site, not RewardKit.
        var ENDPOINT = (function () {
            try {
                return new URL("/api/track/click", script.src).toString();
            } catch (e) {
                return "/api/track/click";
            }
        })();

        function getVisitorId() {
            var match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]*)"));
            return match ? decodeURIComponent(match[1]) : null;
        }

        // SameSite=Lax + path=/ so the id is visible on every page of the site.
        function setVisitorId(value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie =
                COOKIE_NAME + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
        }

        // First matching url param wins: ?ref=code, ?via=code, ?aff=code ...
        function findParamAndCode() {
            var search = window.location.search || "";
            if (!search) return null;
            var params = new URLSearchParams(search);
            for (var i = 0; i < URL_PARAMS.length; i++) {
                var name = URL_PARAMS[i];
                var value = params.get(name);
                if (value) return { param: name, code: value };
            }
            return null;
        }

        function cleanUrl(paramName) {
            try {
                if (!window.history || !window.history.replaceState) return;
                var url = new URL(window.location.href);
                if (!url.searchParams.has(paramName)) return;
                url.searchParams.delete(paramName);
                var next = url.pathname + (url.search || "") + url.hash;
                window.history.replaceState(window.history.state, "", next);
            } catch (e) { /* silent */ }
        }

        function track() {
            var found = findParamAndCode();
            if (!found) return;

            var payload = {
                program_id: programId,
                code: found.code,
                param: found.param,
                page: window.location.href,
                referrer: document.referrer || undefined,
                visitor_id: getVisitorId() || undefined
            };

            // fetch/XHR errors must never break the host page.
            fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then(function (res) { return res.ok ? res.json() : null; })
                .then(function (data) {
                    if (data && data.tracked && data.visitor_id) {
                        setVisitorId(data.visitor_id, data.cookie_duration || 30);
                    }
                    cleanUrl(found.param);
                })
                .catch(function () { /* silent */ });
        }

        // Public helper surface. identify() is a stub until the customer
        // identify/conversion endpoint lands.
        window.rewardkit = {
            getVisitorId: getVisitorId,
            identify: function (/* { email } */) {
                // TODO: POST identified customer (email etc.) once /api/track/identify exists.
            }
        };

        track();
    } catch (e) {
        // The script must never throw into the host page.
    }
})();
