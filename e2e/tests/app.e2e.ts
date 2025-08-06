
import {setupBrowserHooks, getBrowserState} from './utils';

describe('App test', function () {
  setupBrowserHooks();

  it('is running', async function () {
    const {page} = getBrowserState();

    // Wait for the page to load and redirect to login
    await page.waitForSelector('router-outlet', { timeout: 10000 });

    // Check if we're on the login page (since app redirects to /login)
    const url = page.url();
    expect(url).toContain('login');

    // Check if the page has loaded correctly by looking for common elements
    const body = await page.$('body');
    expect(body).not.toBeNull();
  });
});
