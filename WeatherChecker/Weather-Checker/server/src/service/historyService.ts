class HistoryService {
  private history: string[] = [];

  private async read(): Promise<string[]> {
    return this.history;
  }

  private async write(cities: string[]): Promise<void> {
    this.history = cities;
  }

  async saveCity(city: string): Promise<void> {
    const cities = await this.read();
    cities.push(city);
    await this.write(cities);
  }

  async getHistory(): Promise<string[]> {
    return await this.read();
  }

  async deleteCityById(id: string): Promise<void> {
    const cities = await this.read();
    cities.splice(parseInt(id, 10), 1);
    await this.write(cities);
  }
}

export default new HistoryService();
