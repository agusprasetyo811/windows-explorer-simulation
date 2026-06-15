import { describe, it, expect } from 'bun:test';
import { createApp } from '../presentation/app';

describe('Integration Tests: API Endpoints', () => {
  const app = createApp();

  it('GET /health returns 200 OK', async () => {
    const request = new Request('http://localhost/health');
    const response = await app.handle(request);
    
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ status: 'ok' });
  });

  it('GET /api/v1/folders returns a list of folders', async () => {
    const request = new Request('http://localhost/api/v1/folders');
    const response = await app.handle(request);
    
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('GET /api/v1/search?q=a returns search results', async () => {
    const request = new Request('http://localhost/api/v1/search?q=a');
    const response = await app.handle(request);
    
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('folders');
    expect(body.data).toHaveProperty('files');
    expect(body.meta.query).toBe('a');
  });


});
