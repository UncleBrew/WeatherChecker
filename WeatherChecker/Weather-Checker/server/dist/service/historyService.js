class HistoryService {
    constructor() {
        this.history = [];
    }
    async read() {
        return this.history;
    }
    async write(cities) {
        this.history = cities;
    }
    async saveCity(city) {
        const cities = await this.read();
        cities.push(city);
        await this.write(cities);
    }
    async getHistory() {
        return await this.read();
    }
    async deleteCityById(id) {
        const cities = await this.read();
        cities.splice(parseInt(id, 10), 1);
        await this.write(cities);
    }
}
export default new HistoryService();
