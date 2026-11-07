(() => {
  const preview = '/focus-preview/';
  // Load review overrides after every original inline stylesheet.
  const lateStylesheet = document.createElement('link');
  lateStylesheet.rel = 'stylesheet';
  lateStylesheet.href = '/focus-preview/preview.css?v=5';
  document.head.appendChild(lateStylesheet);
  const home = document.body.dataset.previewPage === 'index.html';
  const navHtml = [
    '<a href="/focus-preview/index.html">Home</a>',
    '<a href="/focus-preview/mining-sites.html">Bitcoin Mining Sites</a>',
    '<a href="/focus-preview/energy-markets-btc-mining.html">BTC Infrastructure</a>',
    '<a href="/focus-preview/solutions.html">Power & Energy</a>',
    '<a href="/focus-preview/corporate-identity.html">U.S. Development</a>',
    '<a href="/focus-preview/about.html">Company</a>',
    '<a href="/focus-preview/investor-relations.html">Investors</a>',
    '<details class="th-more"><summary>More ▾</summary><div class="th-more-menu">',
    '<a href="/focus-preview/leadership.html">Team & Advisory Board</a>',
    '<a href="/focus-preview/milestones.html">Milestones 2013–2026</a>',
    '<a href="/focus-preview/digital-assets.html">Digital Assets</a>',
    '<a href="/focus-preview/energy-markets-compute.html">BTC Economics</a>',
    '<a href="/focus-preview/energy-markets-implementation.html">Implementation</a>',
    '<a href="/focus-preview/energy-markets-commercial.html">Commercial Model</a>',
    '<a href="/focus-preview/energy-digital-markets.html">Energy & Digital Markets</a>',
    '<a href="/focus-preview/ecosystem.html">Ecosystem</a>',
    '<a href="/focus-preview/market-intelligence.html">Market Intelligence</a>',
    '<a href="/focus-preview/corporate-governance.html">Corporate Governance</a>',
    '<a href="/focus-preview/corporate-performance.html">Corporate Performance</a>',
    '<a href="/focus-preview/news.html">News Center</a>',
    '<a href="/focus-preview/careers.html">Careers</a>',
    '<a href="/focus-preview/contact.html">Contact Us</a>',
    '</div></details>',
    '<a class="th-nav-contact" href="/focus-preview/contact.html">Contact</a>'
  ].join('');
  const onReady = () => {
    const nav = document.querySelector('.site-header nav.nav, header nav.nav');
    if (nav) {
      nav.classList.add('th-preview-nav');
      nav.innerHTML = navHtml;
      const menu = document.querySelector('.site-header [data-menu], .site-header .menu');
      if (menu && !menu.hasAttribute('data-menu')) menu.addEventListener('click', () => nav.classList.toggle('open'));
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
    }
    if (home) document.body.classList.add('th-preview-home');
    // The production script swaps the platform visual; preserve the original site image in this preview.
    if (home) {
      const visual = document.querySelector('.platform-photo img');
      if (visual) {
        visual.src = '/image_斯坦福的能源系统太强了作为一名在..._5.png';
      }
    }
    // Rebalance every preview deep-dive page around mining-site development.
    document.querySelectorAll('.th-focus-kicker').forEach(el => {
      el.textContent = 'BITCOIN MINING SITES / POWER INFRASTRUCTURE / U.S. DEVELOPMENT';
    });
    document.querySelectorAll('.th-focus-rail-inner').forEach(el => {
      el.innerHTML = [
        '<a href="/focus-preview/mining-sites.html"><em>01 / CORE DIRECTION</em><strong>U.S. Mining Sites</strong><small>Power-ready locations and mining facility development</small></a>',
        '<a href="/focus-preview/solutions.html"><em>02 / INFRASTRUCTURE</em><strong>Energy & Power</strong><small>Grid connections, energy resources and electrical systems</small></a>',
        '<a href="/focus-preview/corporate-identity.html"><em>03 / PRIORITY MARKET</em><strong>U.S. Development</strong><small>American partners, site diligence and staged execution</small></a>'
      ].join('');
    });
    // Keep new links constructed by original scripts inside the preview.
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href]');
      if (!link || link.hasAttribute('data-live-site')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(href)) return;
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || target.pathname.startsWith(preview)) return;
      if (target.pathname.endsWith('.html') || target.pathname === '/') {
        e.preventDefault();
        location.href = preview + (target.pathname === '/' ? 'index.html' : target.pathname.replace(/^\//, '')) + target.search + target.hash;
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
