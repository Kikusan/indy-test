// __tests__/ApiWeatherRepository.test.ts
import { ApiWeatherRepository } from './ApiWeatherRepository';
import NotFoundError from '@errors/NotFoundError';
import SourceUnavailableError from '@errors/SourceUnavailableError';

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('ApiWeatherRepository', () => {
  const apiKey = 'test-api-key';
  const weatherRepository = new ApiWeatherRepository(apiKey);
  const town = 'Paris';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WHEATHER_API_URL = 'https://fakeweather.api';
  });

  it('should return weather data on successful response', async () => {
    const fakeResponse = {
      weather: [{ main: 'Clear' }],
      main: { temp_min: 10, temp_max: 20 },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const result = await weatherRepository.get(town);

    expect(result).toEqual({
      condition: 'Clear',
      minTemp: 10,
      maxTemp: 20,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `https://fakeweather.api?q=Paris&units=metric&appid=${apiKey}`,
    );
  });

  it('should throw a not found error when town is not found ', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    try {
      await weatherRepository.get('UnknownTown');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundError);
      return;
    }

    expect(true).toBeFalsy();
  });

  it('should throw SourceUnavailableError for other error statuses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    try {
      await weatherRepository.get('AnyTown');
    } catch (e) {
      expect(e).toBeInstanceOf(SourceUnavailableError);
      return;
    }

    expect(true).toBeFalsy();
  });
});
