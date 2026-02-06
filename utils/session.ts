export async function getSession(): Promise<string | null>{
    const sessionId = await figma.clientStorage.getAsync("sessionId")

    if(typeof(sessionId) === "string" && sessionId.length > 0) return sessionId

    return null
}