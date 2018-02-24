const { toHaveNoViolations } = require("jest-axe");

expect.extend(toHaveNoViolations);

jest.setTimeout(10000);

describe("/", () => {
  let page;

  // [A]
  beforeAll(async () => {
    page = await global.BROWSER.newPage();
    await page.goto(global.ROOT);

    // [B]
    await page.addScriptTag({ path: require.resolve("axe-core") });
  });

  // [C]
  it("carrega corretamente", async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("Garçom, aqui nesse HTML...");
  });

  // [D]
  it("a11y", async () => {
    const result = await page.evaluate(() => {
      return new Promise(resolve => {
        window.axe.run((err, results) => {
          if (err) throw err;
          resolve(results);
        });
      });
    });

    expect(result).toHaveNoViolations();
  });
});
