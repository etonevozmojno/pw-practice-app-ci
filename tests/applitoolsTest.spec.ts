import { test, expect } from '@playwright/test';
import {Eyes, ClassicRunner, Configuration, BatchInfo, Target} from '@applitools/eyes-playwright';

test('Applitools Visual Test', async ({ page }) => {
    const runner = new ClassicRunner();
    const eyes = new Eyes(runner);

    // Настройка Applitools
    const config = new Configuration();
    config.setApiKey(process.env.APPLITOOLS_API_KEY);
    config.setBatch(new BatchInfo('My Batch'));
    eyes.setConfiguration(config);

    await eyes.open(page, 'My App', 'Home Page Test');

    await page.goto('/');
    await eyes.check('Home Page', Target.window());

    await eyes.close();
});
