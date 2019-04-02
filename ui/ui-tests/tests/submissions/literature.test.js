const { routes } = require('../../utils/constants');
const { login, logout } = require('../../utils/user');

async function selectDocType(page, docType) {
  await page.click('[data-test-id=skip-import-button]');

  const docTypeSelectSelector = '[data-test-id=document-type-select]';

  await page.waitFor(docTypeSelectSelector);
  await page.click(docTypeSelectSelector);

  const openDocTypeSelectSelector = `.ant-select-open>${docTypeSelectSelector}`;
  await page.waitFor(openDocTypeSelectSelector);

  await page.click(`[data-test-id=document-type-select-option-${docType}]`);

  await page.click('label');

  await page.waitFor(
    ctx => !document.querySelector(ctx.openSelectSelector),
    {},
    { openDocTypeSelectSelector }
  );
}

describe('Literature Submission', () => {
  beforeAll(async () => {
    await login();
  });

  it('matches screenshot for article submission form', async () => {
    const page = await browser.newPage();
    await page.goto(routes.private.literatureSubmission, {
      waitUntil: 'networkidle0',
    });

    await selectDocType(page, 'article');

    await page.setViewport({ width: 1280, height: 1400 });
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot();
  });

  it('matches screenshot for thesis submission form', async () => {
    await page.goto(routes.private.literatureSubmission, {
      waitUntil: 'networkidle0',
    });

    await selectDocType(page, 'thesis');

    await page.setViewport({ width: 1280, height: 1400 });
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot();
  });

  it('matches screenshot for book submission form', async () => {
    await page.goto(routes.private.literatureSubmission, {
      waitUntil: 'networkidle0',
    });

    await selectDocType(page, 'book');

    await page.setViewport({ width: 1280, height: 1400 });
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot();
  });

  it('matches screenshot for book chapter submission form', async () => {
    await page.goto(routes.private.literatureSubmission, {
      waitUntil: 'networkidle0',
    });

    await selectDocType(page, 'bookChapter');

    await page.setViewport({ width: 1280, height: 1400 });
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot();
  });

  afterAll(async () => {
    await logout();
  });
});
