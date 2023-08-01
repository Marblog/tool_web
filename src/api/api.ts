import ajax from "./axios";

export function getProvinces() {
    return ajax.get('/api/province')
}

export function getCitiesByProvince(provinceCode:string) {
    return ajax.get(`/api/city/${provinceCode}`)
}

export function getCountiesByCity(provinceCode:string, cityCode:string) {
    return ajax.get(`/api/county/`, {
        params: {
            cityCode,
            provinceCode,
        }
    })
}

export function getTownByCounty(provinceCode:string, cityCode:string, areaCode:string) {
    return ajax.get(`/api/town/`, {
        params: {
            cityCode,
            provinceCode,
            areaCode
        }
    })
}

export function getVillageByTown(provinceCode:string, cityCode:string, areaCode:string, streetCode:string) {
    return ajax.get(`/api/village/`, {
        params: {
            cityCode,
            provinceCode,
            areaCode,
            streetCode
        }
    })
}

export function generateCode(areaCode: any, date: string, sex: string, numbers: string) {
    return ajax.get(`/api/generateCode/`, {
        params: {
            areaCode,
            date,
            sex,
            numbers
        }
    })
}

export function checkCard(cardNo: string) {
    return ajax.get(`/api/checkCard/`, {
        params: {
            cardNo
        }
    })
}

export function fetchBackendData(queryText:string) {
    return ajax.get('/api/query/', {
        params: {
            queryText
        }
    })
}