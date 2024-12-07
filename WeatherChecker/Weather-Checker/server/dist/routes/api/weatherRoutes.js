import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    try {
        const { cityName } = req.body;
        console.log('Received cityName:', cityName); // Log the received city name
        if (!cityName) {
            return res.status(400).json({ error: 'cityName is required' });
        }
        const weather = await WeatherService.getWeatherForCity(cityName);
        // Save city to search history
        await HistoryService.saveCity(cityName);
        console.log('Saved cityName to history:', cityName); // Log the saved city name
        return res.json(weather);
    }
    catch (error) {
        console.error('Error:', error); // Log any error
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// GET search history
router.get('/history', async (_req, res) => {
    try {
        const history = await HistoryService.getHistory();
        return res.json(history);
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await HistoryService.deleteCityById(id);
        return res.json({ message: 'City deleted from history' });
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to delete city from history' });
    }
});
export default router;
