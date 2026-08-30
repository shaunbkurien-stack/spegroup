(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Theme */
  const themeButton = qs('#themeButton');
  const mobileThemeButton = qs('#mobileThemeButton');
  const themeIcon = qs('#themeIcon');
  const themeColour = qs('#themeColour');
  const icons = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M6 6 4.5 4.5M19.5 19.5 18 18M6 18l-1.5 1.5M19.5 4.5 18 6"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>'
  };

  function applyTheme(theme, persist = true) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    themeButton?.setAttribute('aria-pressed', String(dark));
    themeButton?.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeIcon) themeIcon.innerHTML = dark ? icons.moon : icons.sun;
    if (themeColour) themeColour.content = dark ? '#071711' : '#f3f0e8';
    if (mobileThemeButton) {
      mobileThemeButton.textContent = dark ? 'Use light theme' : 'Use dark theme';
      mobileThemeButton.setAttribute('aria-pressed', String(dark));
      mobileThemeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (persist) {
      try { localStorage.setItem('spe-theme', theme); } catch (_) {}
    }
  }

  let storedTheme = null;
  try { storedTheme = localStorage.getItem('spe-theme'); } catch (_) {}
  applyTheme(storedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'), false);

  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduceMotion || !themeButton) {
      applyTheme(next);
      return;
    }
    const rect = themeButton.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 520, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
    ));
  }
  themeButton?.addEventListener('click', toggleTheme);
  mobileThemeButton?.addEventListener('click', toggleTheme);

  /* Navigation */
  const header = qs('#siteHeader');
  const progress = qs('#scrollProgress');
  const mobileMenu = qs('#mobileMenu');
  const menuButton = qs('#menuButton');
  const menuClose = qs('#menuClose');
  const mobileCta = qs('.mobile-cta');
  const heroActions = qs('.hero-actions');
  const contactSection = qs('#contact');

  function openMenu() {
    mobileMenu?.showModal();
    document.body.style.overflow = 'hidden';
    menuButton?.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (mobileMenu?.open) mobileMenu.close();
    document.body.style.overflow = '';
    menuButton?.setAttribute('aria-expanded', 'false');
  }
  menuButton?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileMenu?.addEventListener('cancel', closeMenu);
  mobileMenu?.addEventListener('click', event => { if (event.target === mobileMenu) closeMenu(); });
  qsa('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));

  function updateScroll() {
    const documentRoot = document.documentElement;
    const range = documentRoot.scrollHeight - documentRoot.clientHeight;
    if (progress) progress.style.width = `${range > 0 ? (documentRoot.scrollTop / range) * 100 : 0}%`;
    header?.classList.toggle('scrolled', scrollY > 18);
    if (mobileCta && heroActions && contactSection) {
      const heroPassed = heroActions.getBoundingClientRect().bottom < 0;
      const contactReached = contactSection.getBoundingClientRect().top < innerHeight * 0.8;
      mobileCta.classList.toggle('visible', heroPassed && !contactReached);
    }
  }
  updateScroll();
  addEventListener('scroll', updateScroll, { passive: true });

  /* Project Basis Dossier 2.0 */
  const dossierTabs = qsa('.dossier-tab');
  const sheets = qsa('.basis-sheet');
  const trace = qs('.dossier-trace');
  const traceNodes = qsa('.dossier-trace span');
  const sheetStack = qs('.sheet-stack');

  function fitDossierHeight(activeSheet) {
    if (!sheetStack || !activeSheet) return;
    requestAnimationFrame(() => {
      const extra = innerWidth <= 520 ? 24 : 32;
      sheetStack.style.setProperty('--sheet-height', `${Math.ceil(activeSheet.scrollHeight + extra)}px`);
    });
  }

  function setDossier(index) {
    dossierTabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    sheets.forEach((sheet, sheetIndex) => {
      const depth = (sheetIndex - index + sheets.length) % sheets.length;
      const active = sheetIndex === index;
      sheet.classList.toggle('is-active', active);
      sheet.dataset.depth = String(depth);
      sheet.setAttribute('aria-hidden', String(!active));
      sheet.tabIndex = active ? 0 : -1;
      sheet.classList.remove('sheet-arrive');
      if (active && !reduceMotion) {
        void sheet.offsetWidth;
        sheet.classList.add('sheet-arrive');
      }
    });

    traceNodes.forEach((node, nodeIndex) => {
      node.classList.toggle('is-active', nodeIndex === index);
      node.classList.toggle('is-complete', nodeIndex < index);
    });
    if (trace) trace.style.setProperty('--trace-width', `${index * (74 / 3)}%`);
    fitDossierHeight(sheets[index]);
  }

  dossierTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setDossier(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + dossierTabs.length) % dossierTabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % dossierTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = dossierTabs.length - 1;
      setDossier(next);
      dossierTabs[next].focus();
    });
  });
  setDossier(0);
  addEventListener('resize', () => fitDossierHeight(sheets.find(sheet => sheet.classList.contains('is-active'))), { passive: true });

  /* Capabilities */
  const capabilityButtons = qsa('.capability-button');
  const capabilityPanels = qsa('.capability-panel');

  function setCapability(index) {
    capabilityButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    capabilityPanels.forEach((panel, panelIndex) => {
      const selected = panelIndex === index;
      panel.classList.toggle('is-active', selected);
      panel.hidden = !selected;
      panel.classList.remove('panel-changing');
      if (selected && !reduceMotion) {
        void panel.offsetWidth;
        panel.classList.add('panel-changing');
      }
    });
  }

  capabilityButtons.forEach((button, index) => {
    button.addEventListener('click', () => setCapability(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowUp') next = (index - 1 + capabilityButtons.length) % capabilityButtons.length;
      if (event.key === 'ArrowDown') next = (index + 1) % capabilityButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = capabilityButtons.length - 1;
      setCapability(next);
      capabilityButtons[next].focus();
    });
  });
  setCapability(0);

  /* Reveals and navigation spy */
  if (reduceMotion) {
    qsa('.reveal').forEach(element => element.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    qsa('.reveal').forEach(element => revealObserver.observe(element));
  }

  const navLinks = qsa('#desktopNav a');
  const sections = ['capabilities', 'method', 'background', 'about', 'contact']
    .map(id => qs(`#${id}`))
    .filter(Boolean);
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        active ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-42% 0px -52% 0px' });
  sections.forEach(section => navObserver.observe(section));

  /* Method progression */
  const methodList = qs('#methodList');
  const methodSteps = qsa('.method-step');
  const stackLayers = qsa('.stack-layer');
  const methodCode = qs('#methodCode');
  const methodReadout = qs('#methodReadout');
  const methodMessages = [
    'Confirm the asset boundary, interfaces and decision need before detailed effort begins.',
    'Separate verified source information from conflicts, gaps and assumptions.',
    'Test sequence, access, lifting, transport and temporary conditions against the project basis.',
    'Issue the conclusion with exclusions, uncertainty and next actions visible.'
  ];

  function setMethod(index) {
    methodSteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
    stackLayers.forEach((layer, layerIndex) => layer.classList.toggle('is-active', layerIndex === index));
    if (methodCode) methodCode.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
    if (methodReadout) methodReadout.textContent = methodMessages[index];
  }
  setMethod(0);

  const methodObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top - innerHeight * 0.45) - Math.abs(b.boundingClientRect.top - innerHeight * 0.45));
    if (visible[0]) setMethod(Number(visible[0].target.dataset.step));
  }, { rootMargin: '-28% 0px -46% 0px', threshold: 0.1 });
  methodSteps.forEach(step => methodObserver.observe(step));

  function updateMethodProgress() {
    if (!methodList) return;
    const rect = methodList.getBoundingClientRect();
    const raw = (innerHeight * 0.58 - rect.top) / Math.max(rect.height, 1);
    methodList.style.setProperty('--progress', String(Math.min(1, Math.max(0, raw))));
  }
  updateMethodProgress();
  addEventListener('scroll', updateMethodProgress, { passive: true });
  addEventListener('resize', updateMethodProgress, { passive: true });

  /* Scope Brief 2.0 */
  const scopeGroups = qsa('[data-scope-group]');
  const scopeOutput = qs('.scope-output');
  const scopeResult = qs('#scopeResult');
  const scopeSummary = qs('#scopeSummary');
  const scopeQuestion = qs('#scopeQuestion');
  const scopeDeliverable = qs('#scopeDeliverable');
  const scopeInputs = qs('#scopeInputs');
  const scopeEngagement = qs('#scopeEngagement');
  const briefStage = qs('#briefStage');
  const briefNeed = qs('#briefNeed');
  const briefEvidence = qs('#briefEvidence');
  const useBrief = qs('#useBrief');
  const copyBrief = qs('#copyBrief');
  const downloadBrief = qs('#downloadBrief');
  const scopeActionStatus = qs('#scopeActionStatus');

  const choices = { stage: 'study', need: 'study', evidence: 'mixed' };
  const labels = {
    stage: { screen: 'Screen', study: 'Study', define: 'Define', delivery: 'Delivery' },
    need: { study: 'Study basis', cost: 'Cost basis', method: 'Removal method', support: 'Project support' },
    evidence: { limited: 'Limited', mixed: 'Mixed', strong: 'Strong' }
  };
  const resultMap = {
    study: {
      title: 'Start with a controlled study basis',
      deliverable: 'Study report with assumptions, option basis and data-gap register',
      inputs: 'Asset summary, available drawings, prior studies and the decision the work must support',
      engagement: 'Defined work package, typically fixed fee when the source set is stable',
      question: 'What decision must the study support, and what boundary must be stable before detailed effort begins?'
    },
    cost: {
      title: 'Start with the estimate basis',
      deliverable: 'Basis of estimate, cost build-up, range and key sensitivity drivers',
      inputs: 'Scope boundary, quantities, rates, schedule assumptions and available methodology',
      engagement: 'Defined estimate package or embedded cost-basis support',
      question: 'Which quantities, rates, productivity and schedule assumptions materially control the estimate?'
    },
    method: {
      title: 'Start with the execution logic',
      deliverable: 'Removal methodology, sequence, plant basis and temporary-state controls',
      inputs: 'Asset drawings, access constraints, lifting information, worksite and marine interfaces',
      engagement: 'Defined methodology package with specialist input where required',
      question: 'Which access, temporary-state, lifting and transport constraints govern the removal sequence?'
    },
    support: {
      title: 'Start with a controlled engineering work package',
      deliverable: 'Technical-query support, workpack input, review comments and change record',
      inputs: 'Current deliverables, interface register, programme priorities and decision authority',
      engagement: 'Day rate, capped package or agreed monthly allocation',
      question: 'Which live interfaces, technical queries and changes must remain linked to the issued basis?'
    }
  };

  function buildBriefText() {
    const base = resultMap[choices.need] || resultMap.study;
    return [
      'SPE GROUP · INITIAL SCOPE BRIEF',
      '',
      `Project stage: ${labels.stage[choices.stage]}`,
      `Primary need: ${labels.need[choices.need]}`,
      `Information position: ${labels.evidence[choices.evidence]}`,
      '',
      `Recommended first move: ${base.title}`,
      `Key scoping question: ${base.question}`,
      `Suggested first deliverable: ${base.deliverable}`,
      `Information to begin: ${base.inputs}`,
      `Likely engagement basis: ${base.engagement}`,
      '',
      'Asset / project:',
      'Decision or deliverable required:',
      '',
      'Illustrative scoping aid only. Final scope depends on the asset, available information and required decision.'
    ].join('\n');
  }

  function updateScope() {
    const base = resultMap[choices.need] || resultMap.study;
    const qualifier = choices.evidence === 'limited'
      ? 'Begin with a focused information and gap review. '
      : choices.evidence === 'strong'
        ? 'The source position supports direct development of the work product. '
        : 'Confirm conflicts and assumptions before detailed development. ';

    if (briefStage) briefStage.textContent = labels.stage[choices.stage];
    if (briefNeed) briefNeed.textContent = labels.need[choices.need];
    if (briefEvidence) briefEvidence.textContent = labels.evidence[choices.evidence];
    if (scopeResult) scopeResult.textContent = base.title;
    if (scopeSummary) scopeSummary.textContent = `${qualifier}The ${labels.stage[choices.stage].toLowerCase()} stage should be framed around the decision, not a generic list of activities.`;
    if (scopeQuestion) scopeQuestion.textContent = base.question;
    if (scopeDeliverable) scopeDeliverable.textContent = base.deliverable;
    if (scopeInputs) scopeInputs.textContent = base.inputs;
    if (scopeEngagement) scopeEngagement.textContent = base.engagement;
    if (scopeActionStatus) scopeActionStatus.textContent = '';

    if (scopeOutput && !reduceMotion) {
      scopeOutput.classList.remove('brief-updating');
      void scopeOutput.offsetWidth;
      scopeOutput.classList.add('brief-updating');
    }
  }

  scopeGroups.forEach(group => {
    qsa('.scope-option', group).forEach(button => button.addEventListener('click', () => {
      qsa('.scope-option', group).forEach(option => option.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      choices[group.dataset.scopeGroup] = button.dataset.value;
      updateScope();
    }));
  });
  updateScope();

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  copyBrief?.addEventListener('click', async () => {
    try {
      await copyText(buildBriefText());
      if (scopeActionStatus) scopeActionStatus.textContent = 'Brief copied to clipboard.';
    } catch (_) {
      if (scopeActionStatus) scopeActionStatus.textContent = 'Copy was not available. Use the enquiry button instead.';
    }
  });

  downloadBrief?.addEventListener('click', () => {
    const blob = new Blob([buildBriefText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SPE-Group-Initial-Scope-Brief.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    if (scopeActionStatus) scopeActionStatus.textContent = 'Brief downloaded.';
  });

  useBrief?.addEventListener('click', () => {
    const asset = qs('#asset');
    const message = qs('#message');
    if (asset && !asset.value) asset.value = `${labels.stage[choices.stage]} stage · ${labels.need[choices.need]}`;
    if (message) message.value = `${buildBriefText()}\n\nAdditional context:\n`;
    qs('#contact')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => message?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  });

  /* Privacy */
  const privacyDialog = qs('#privacyDialog');
  qsa('[data-open-privacy]').forEach(button => button.addEventListener('click', () => privacyDialog?.showModal()));
  qs('#privacyClose')?.addEventListener('click', () => privacyDialog?.close());
  privacyDialog?.addEventListener('click', event => { if (event.target === privacyDialog) privacyDialog.close(); });

  /* Contact form */
  const form = qs('#contactForm');
  const submitButton = qs('#submitButton');
  const formStatus = qs('#formStatus');
  const successPanel = qs('#formSuccess');
  if (form) form.noValidate = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(id, on) {
    const field = qs(`#${id}`);
    if (!field) return;
    field.closest('.field')?.classList.toggle('error', on);
    field.setAttribute('aria-invalid', String(on));
  }
  ['name', 'email', 'message'].forEach(id => qs(`#${id}`)?.addEventListener('input', () => setFieldError(id, false)));

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const valid = {
      name: Boolean(form.name.value.trim()),
      email: emailPattern.test(form.email.value.trim()),
      message: Boolean(form.message.value.trim())
    };
    Object.entries(valid).forEach(([id, value]) => setFieldError(id, !value));
    if (!Object.values(valid).every(Boolean) || form._gotcha.value) {
      const firstInvalid = ['name', 'email', 'message'].find(id => !valid[id]);
      qs(`#${firstInvalid}`)?.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.textContent = 'Sending…';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      successPanel.tabIndex = -1;
      successPanel.focus({ preventScroll: true });
    } catch (_) {
      formStatus.textContent = 'The form could not send. Email shaun@spegroup.com.au or call +61 450 165 492.';
      formStatus.className = 'form-status failure';
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      submitButton.innerHTML = 'Send scope enquiry <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    }
  });

  qs('#sendAnother')?.addEventListener('click', () => {
    successPanel.hidden = true;
    form.hidden = false;
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    form.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    qs('#name')?.focus({ preventScroll: true });
  });

  const year = qs('#year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* v15.1: hero capability chips activate the matching capability tab */
(function(){
  document.querySelectorAll('.hero-caps a[data-cap]').forEach(function(a){
    a.addEventListener('click', function(){
      var i = parseInt(a.dataset.cap, 10);
      var buttons = document.querySelectorAll('.capability-button');
      if (buttons[i]) buttons[i].click();
    });
  });
})();
