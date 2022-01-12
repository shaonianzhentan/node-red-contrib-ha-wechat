const axios = require('axios')

module.exports = class {

    constructor({ hassUrl, hassToken }) {
        const location = new URL(hassUrl)
        this.origin = location.origin
        this.http = axios.create({
            baseURL: `${location.origin}/api/`,
            timeout: 5000,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${hassToken}`
            }
        });
        this.getApi('config').then(res => {
            let { external_url } = res
            this.external_url = this.origin
            if (!external_url) {
                this.external_url = new URL(external_url).origin
            }
        })
    }

    getURL(url) {
        return this.external_url + url
    }

    async postApi(url, data) {
        const res = await this.http.post(url, data)
        return res.data
    }

    async getApi(url) {
        const res = await this.http.get(url)
        return res.data
    }

    async getBase64(url) {
        const res = await axios.get(url, { responseType: 'arraybuffer' })
        return 'data:image/png;base64,' + Buffer.from(res.data).toString('base64')
    }
}