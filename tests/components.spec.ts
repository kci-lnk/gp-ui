import { test, expect } from '@playwright/test';
test('standalone inputs, focus, calendar and glass navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  const preview = page.locator('.default-preview');
  await preview.getByLabel('Name', { exact: true }).fill('Grace');
  await expect(preview.locator('.readout')).toContainText('Grace');
  await preview.getByRole('combobox', { name: 'Choice', exact: true }).click();
  await page.getByRole('option', { name: 'Second', exact: true }).click();
  await expect(preview.locator('.readout')).toContainText('two');
  const trigger = preview.getByRole('button', { name: 'Open dialog', exact: true });
  // Safari does not focus buttons on pointer activation; exercise keyboard focus restoration.
  await trigger.focus();
  await trigger.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Example dialog' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await preview.getByRole('button', { name: /^Date October/ }).click();
  await expect(page.locator('.gp-date-popover')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous year' })).toBeDisabled();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await preview
    .getByRole('navigation', { name: 'Glass navigation' })
    .getByRole('button', { name: 'Explore' })
    .click();
  await expect(preview.getByRole('button', { name: 'Explore' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    preview.getByRole('navigation', { name: 'Glass navigation' }).locator('.gp-nav-selection'),
  ).toHaveCSS('transition-duration', '0s');
  expect(errors).toEqual([]);
});
test('scoped portals, nested provider inheritance, live theme and language, cleanup', async ({
  page,
}) => {
  await page.goto('/');
  const preview = page.locator('.themed-preview');
  await preview.getByRole('button', { name: 'Open dialog', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Example dialog' });
  await expect(dialog.locator('input')).toHaveCSS('background-color', 'rgb(245, 245, 247)');
  await expect(dialog).toHaveCSS('color', 'rgb(23, 26, 32)');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Toggle mode', exact: true }).click();
  await page.getByRole('button', { name: 'Toggle local theme' }).click();
  await page.getByRole('button', { name: 'Toggle language' }).click();
  await preview.getByRole('button', { name: 'Open dialog', exact: true }).click();
  await expect(dialog).toHaveCSS('background-color', 'rgb(32, 35, 39)');
  await expect(dialog.getByRole('button', { name: '关闭', exact: true })).toBeVisible();
  await dialog.getByRole('combobox', { name: 'Nested choice' }).click();
  const selected = page.getByRole('option', { name: 'First', exact: true });
  await expect(selected).toHaveCSS('color', 'rgb(196, 167, 255)');
  await page.keyboard.press('Escape');
  await expect(page.locator('.gp-select-content')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await preview.getByRole('button', { name: 'Open dialog', exact: true }).click();
  await expect(dialog).toBeVisible();
  // Simulate the host removing a view while its modal is still open.
  await page
    .getByRole('button', { name: 'Toggle previews', includeHidden: true })
    .evaluate((element: HTMLElement) => element.click());
  await expect(page.locator('.gp-portal-host')).toHaveCount(0);
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('pointer-events', 'none');
});
test('confirmation loading prevents duplicate actions', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('.default-preview');
  await preview.getByRole('button', { name: 'Confirm action', exact: true }).click();
  const dialog = page.getByRole('alertdialog');
  await dialog.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Confirm', exact: true })).toBeDisabled();
  await expect(dialog.getByRole('button', { name: 'Cancel', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeHidden();
  await expect(preview.locator('.confirmed')).toHaveText('Confirmed 1');
});

test('custom navigation links preserve href and disabled behavior', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('.default-preview').getByRole('navigation', { name: 'Custom links' });
  await expect(nav.getByRole('link')).toHaveCount(4);
  await expect(nav.getByRole('link', { name: 'Second', exact: true })).toHaveAttribute(
    'href',
    '#second',
  );
  await nav.getByRole('link', { name: 'Second', exact: true }).click();
  await expect(page).toHaveURL(/#second$/);
  await expect(nav.getByRole('link', { name: 'Second', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await nav
    .getByRole('link', { name: 'Disabled', exact: true })
    .evaluate((el: HTMLElement) => el.click());
  await expect(page).toHaveURL(/#second$/);
  const geometry = await nav.evaluate((el) => ({
    width: el.clientWidth,
    indicator: el.querySelector('.gp-nav-selection')!.getBoundingClientRect().width,
  }));
  expect(Math.abs(geometry.indicator - (geometry.width - 12) / 4)).toBeLessThan(1);
});

test('open overlays follow runtime theme changes', async ({ page }) => {
  await page.goto('/');
  await page
    .locator('.themed-preview')
    .getByRole('button', { name: 'Open dialog', exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Example dialog' });
  await expect(dialog).toBeVisible();
  // Simulate a shared preference changing while a modal is open.
  await page
    .getByRole('button', { name: 'Toggle mode', includeHidden: true })
    .evaluate((el: HTMLElement) => el.click());
  await page
    .getByRole('button', { name: 'Toggle local theme', includeHidden: true })
    .evaluate((el: HTMLElement) => el.click());
  await expect(dialog).toHaveCSS('background-color', 'rgb(32, 35, 39)');
  await expect
    .poll(() =>
      dialog.evaluate((el) => getComputedStyle(el).getPropertyValue('--gp-primary').trim()),
    )
    .toBe('#6d28d9');
  await expect(
    page
      .locator('.default-preview')
      .getByRole('button', { name: 'Primary', exact: true, includeHidden: true }),
  ).toHaveCSS('background-color', 'rgb(195, 34, 50)');
});

test('asChild loading keeps the link as the control and prevents activation', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('.default-preview').getByRole('link', { name: 'Saving link' });
  await expect(link).toHaveAttribute('aria-busy', 'true');
  await expect(link).toHaveClass(/gp-button/);
  await link.dispatchEvent('click');
  await expect(page).not.toHaveURL(/#blocked$/);
  await expect(link).toBeDisabled();
});

test('today follows each provider time zone and week start at a UTC date boundary', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2026-10-17T20:00:00Z'));
  await page.goto('/');
  for (const [selector, expected, weekday] of [
    ['.default-preview', '2026-10-17', 'Sunday'],
    ['.themed-preview', '2026-10-18', 'Monday'],
  ]) {
    const preview = page.locator(selector!);
    await preview.getByRole('button', { name: /^Date October/ }).click();
    await expect(page.getByRole('gridcell').first()).toHaveAccessibleName(
      new RegExp(`^${weekday}`),
    );
    await page.getByRole('button', { name: 'Today', exact: true }).click();
    await expect(preview.locator('.readout')).toContainText(expected!);
    await expect(page.locator('.gp-date-popover')).toHaveCount(0);
  }
});

test('field disabling closes date and time overlays and locks controls', async ({ page }) => {
  await page.goto('/');
  const preview = page.locator('.default-preview');
  const toggle = preview.getByRole('switch', { name: 'Disable fields', includeHidden: true });
  await preview.getByRole('button', { name: /^Date October/ }).click();
  await toggle.evaluate((element: HTMLElement) => element.click());
  await expect(page.locator('.gp-date-popover')).toHaveCount(0);
  await expect(preview.getByRole('button', { name: /^Date October/ })).toBeDisabled();
  await expect(preview.getByRole('spinbutton', { name: 'Amount' })).toBeDisabled();
  await expect(preview.getByRole('button', { name: 'Choose Time' })).toBeDisabled();
  for (const button of await preview.locator('.gp-weekday-field button').all())
    await expect(button).toBeDisabled();
  await toggle.click();
  await preview.getByRole('button', { name: 'Choose Time' }).click();
  await expect(page.locator('.gp-time-popover')).toBeVisible();
  await toggle.evaluate((element: HTMLElement) => element.click());
  await expect(page.locator('.gp-time-popover')).toHaveCount(0);
  await expect(preview.locator('.readout')).toContainText('09:30');
});

test('nested LTR navigation inside RTL content keeps its own indicator direction', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page
    .locator('.default-preview')
    .getByRole('navigation', { name: 'Glass navigation' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await nav.evaluate((element) => {
    element.parentElement!.setAttribute('dir', 'rtl');
    element.setAttribute('dir', 'ltr');
  });
  await nav.getByRole('button', { name: 'Settings' }).click();
  const check = async () => {
    const indicator = (await nav.locator('.gp-nav-selection').boundingBox())!;
    const item = (await nav.getByRole('button', { name: 'Settings' }).boundingBox())!;
    expect(Math.abs(indicator.x - item.x)).toBeLessThan(2);
  };
  await check();
  await nav.evaluate((element) => element.removeAttribute('dir'));
  await check();
});
