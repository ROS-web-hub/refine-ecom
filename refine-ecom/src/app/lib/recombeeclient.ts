import axios from "axios";

export class RecombeeClient {
    static async sendClick(userRecombeeId: string, productRecombeeId: string) {
        await axios.post("/api/interactions", {
            userRecombeeId,
            productRecombeeId
        })
    }
}