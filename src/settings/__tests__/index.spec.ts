import { synchronizerSettingsValidator } from '../index';
import { defaults } from '../defaults';

describe('synchronizerSettingsValidator', () => {

  test('should return default values when no param or invalid param is provided', () => {
    const config = {
      core: {
        authorizationKey: 'fake-key',
      },
      scheduler: {
        eventsPerPost: undefined, // not defined
        impressionsPerPost: -1, // invalid, must be a positive integer
        maxRetries: 10, // overwriting default value
      },
    }; // @ts-ignore
    const settings = synchronizerSettingsValidator(config);

    expect(settings.scheduler.eventsPerPost).toBe(defaults.scheduler.eventsPerPost);
    expect(settings.scheduler.impressionsPerPost).toBe(defaults.scheduler.impressionsPerPost);
    expect(settings.scheduler.maxRetries).toBe(config.scheduler.maxRetries);
  });

});
