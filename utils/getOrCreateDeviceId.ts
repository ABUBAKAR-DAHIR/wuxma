function generateUUID() {
  // Simple RFC4122 version 4 UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export async function getOrCreateDeviceId(): Promise<string>{
    try {
        let deviceId = await figma.clientStorage.getAsync("deviceId")

        if(typeof(deviceId) === "string" && deviceId.length > 0) return deviceId
    
        deviceId = generateUUID()
        const setDeviceId = await figma.clientStorage.setAsync("deviceId", deviceId)
        console.log(setDeviceId)

        return deviceId

    } catch (error : any) {
        console.log("Failed to get or create deviceId: " + error.message)
        throw new Error("DEVICE_ID_FAILURE")
    }

}




