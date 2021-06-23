describe('Synchroniser e2e', () => {
  // Mock fetch  /splitChanges and /segmentChanges
  it('Fetches splits from Split API', () => {
    expect(true).toBe(true);
  });

  // Run Synchonizer once
  // Assert if the splits and segment objects were stored properly

  // Either run SDK in consumer mode or mock events and impressions in Redis
  // const sdk = SplitFactory({...})
  // const client = sdk.client();
  // client.getTreatment
  // client.track

  // Run Synchonizer again

  // Assert if the impressions and events were removed from redis and that /impressions and /event endpoints
  //were properly called.
});
