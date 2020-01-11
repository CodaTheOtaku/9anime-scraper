import { Response } from "puppeteer";
import { IPuppeteerInstance } from "./types";

export class Scraper {
  protected puppeteer: IPuppeteerInstance;

  public constructor(puppeteer: IPuppeteerInstance) {
    this.puppeteer = puppeteer;
  }

  public close = () => {
    this.puppeteer.browser.close();
  };

  /**
   * Navigate to a page and retry up to X
   * times if the page returns a non-success status code.
   *
   * @param {string} url
   * @param {number} retries
   * @returns {Promise<Response>}
   */
  protected goto = async (url: string, retries = 0): Promise<Response> => {
    const response = await this.puppeteer.page.goto(url);
    const headers = response.headers();
    const status = headers.status;

    if (status !== "200" && retries < 5) {
      await this.puppeteer.page.waitFor(2000);
      return await this.goto(url, retries + 1);
    }

    return response;
  };
}
