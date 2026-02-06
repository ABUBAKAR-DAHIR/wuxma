import { CONFIG } from './../utils/config';
import { getOrCreateDeviceId } from '../utils/getOrCreateDeviceId';
import { getSession } from '../utils/session';
figma.showUI(__html__, { width: 360, height: 540 });
function isPayload(x) {
    return (x !== null &&
        typeof x === "object" &&
        typeof x.prompt === "string" &&
        typeof x.style === "string" &&
        typeof x.platform === "string");
}
figma.ui.onmessage = async (msg) => {
    const deviceId = await getOrCreateDeviceId();
    // const sessionId = await getSession() 
    if (msg.type === 'generate-design') {
        try {
            const sessionId = await getSession();
            const res = await fetch(`${CONFIG.BASE_URL}/api/plugin/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId, sessionId, prompt: msg.payload.prompt })
            });
            const data = await res.json();
            figma.notify(data ? data.success === true ? `Output: ${data.output}\nsessionId:${data.sessionId} ` : data.success === false ? `Error: ${data.error}` : "Done !!" : "No data received but done");
            console.log(data);
            // show signup button to the user if the free anonymous quota is exhausted
            if (data.error === "QUOTA_EXHAUSTED") {
                figma.ui.postMessage({ type: "quota_exceeded", message: "Quota exhausted. Please login to continue.", deviceId: deviceId });
            }
            figma.ui.postMessage({ finished: true, message: 'done' });
        }
        catch (err) {
            console.log("Error in onmessage:", err);
            figma.notify("❌ Failed to start generation");
            figma.ui.postMessage({ finished: true, message: 'error occurred' });
        }
    }
    if (msg.type === "start_login") {
        const timer = setInterval(async () => {
            try {
                const res = await fetch(`${CONFIG.BASE_URL}/api/plugin/status?deviceId=${deviceId}`);
                const data = await res.json();
                if (data.success === true && data.isAuthenticated === true) {
                    clearInterval(timer);
                    figma.ui.postMessage({ type: "login_success" });
                    figma.notify("✅ login detected! You now have full access");
                }
            }
            catch (error) {
                console.log("Error: " + error.message);
                figma.notify("❌ Couldnt login! please try again");
            }
        }, 2000);
    }
};
