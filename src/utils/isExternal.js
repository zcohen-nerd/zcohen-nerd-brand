/**
 * Shared test for whether a link leaves the zcohen-nerd.com domain family.
 *
 * First-party family: zcohen-nerd.com and any *.zcohen-nerd.com subdomain
 * (hub, portfolio, future subdomain properties).
 *
 * Not external: relative/hash links, mailto:, tel: — anything that is not an
 * absolute http(s) URL. mailto: is deliberately excluded; email is not an
 * "external website".
 */
function isExternalUrl(href) {
  if (!href || !/^https?:\/\//i.test(href)) {
    return false;
  }
  try {
    const host = new URL(href).hostname;
    return host !== 'zcohen-nerd.com' && !host.endsWith('.zcohen-nerd.com');
  } catch {
    return false;
  }
}

module.exports = {isExternalUrl};
module.exports.isExternalUrl = isExternalUrl;
