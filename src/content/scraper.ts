import type { SaveJobPayload } from '../shared/types';

interface SiteSelectors {
  title: string;
  company: string;
}

const SITE_SELECTORS: SiteSelectors[] = [
  {
    // LinkedIn
    title: 'h1.job-details-jobs-unified-top-card__job-title',
    company: '.job-details-jobs-unified-top-card__company-name',
  },
  {
    // Indeed
    title: 'h1[data-testid="jobsearch-JobInfoHeader-title"]',
    company: '[data-testid="inlineHeader-companyName"]',
  },
  {
    // Greenhouse
    title: 'h1.app-title',
    company: '.company-name',
  },
];

function scrape(selectors: SiteSelectors): { title: string; company: string } | null {
  const titleEl = document.querySelector(selectors.title);
  const companyEl = document.querySelector(selectors.company);
  if (!titleEl || !companyEl) return null;
  const title = titleEl.textContent?.trim() ?? '';
  const company = companyEl.textContent?.trim() ?? '';
  if (!title || !company) return null;
  return { title, company };
}

function getPayload(): SaveJobPayload {
  for (const selectors of SITE_SELECTORS) {
    const result = scrape(selectors);
    if (result) {
      return { ...result, url: window.location.href };
    }
  }
  return {
    title: document.title.trim() || 'Untitled',
    company: window.location.hostname.replace(/^www\./, ''),
    url: window.location.href,
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SCRAPE') {
    sendResponse(getPayload());
  }
});
