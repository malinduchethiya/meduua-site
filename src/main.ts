import { createClient } from '@supabase/supabase-js';

interface ProjectDetail {
  type: string;
  name: string;
  text: string;
  industry: string;
  approach: string;
}

const supabaseUrl =
  (process.env.SUPABASE_URL || (import.meta.env.VITE_SUPABASE_URL as string | undefined) || '').trim();
const supabaseAnonKey =
  (
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    ''
  ).trim();
const rawTable = (
  process.env.SUPABASE_TABLE ||
  (import.meta.env.VITE_SUPABASE_TABLE as string | undefined) ||
  ''
).trim();
const supabaseTable =
  !rawTable || rawTable.toLowerCase() === 'meduua db' ? 'contacts' : rawTable;

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const projects: Record<string, ProjectDetail> = {
  salt: {
    type: 'WEBSITE CONCEPT',
    name: 'Salt & Stone',
    text: 'An editorial coastal hospitality experience: quiet typography, generous spacing, tactile colour and a booking-first page structure. Developed as a boutique hotel website concept.',
    industry: 'Hospitality',
    approach: 'Editorial / understated',
  },
  unframed: {
    type: 'STUDIO EXPLORATION',
    name: 'The Unframed',
    text: 'A bold art-gallery direction that puts creative work ahead of interface conventions. Graphic colour, expansive typography and gallery-focused composition.',
    industry: 'Art & Culture',
    approach: 'Experimental / expressive',
  },
  cafe: {
    type: 'VISUAL DIRECTION',
    name: 'One Love Café',
    text: 'A warm and playful design direction for a café presence, built around personality, appetising visual rhythm and an easy path to menus and enquiries.',
    industry: 'Food & Beverage',
    approach: 'Playful / warm',
  },
  ceylono: {
    type: 'WEBSITE CONCEPT',
    name: 'Ceylono',
    text: 'An immersive Sri Lankan travel concept combining destination storytelling with confident visual identity, large-scale imagery and approachable navigation.',
    industry: 'Travel & Tourism',
    approach: 'Story-led / vibrant',
  },
};

(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.scrollTo(0, 0);
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });

  const navButton = document.getElementById('menuToggle') as HTMLButtonElement | null;
  const drawer = document.getElementById('mobileDrawer') as HTMLElement | null;

  function setDrawer(open: boolean) {
    if (!drawer || !navButton) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    navButton.setAttribute('aria-expanded', String(open));
    navButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navButton.innerHTML = open
      ? '<span aria-hidden="true" style="font-size:26px;line-height:1">×</span>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h18M3 16h18"/></svg>';
  }

  navButton?.addEventListener('click', () => {
    if (!drawer) return;
    setDrawer(!drawer.classList.contains('open'));
  });

  drawer?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setDrawer(false))
  );

  document.querySelectorAll<HTMLButtonElement>('.filter').forEach((btn) =>
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;
      document.querySelectorAll<HTMLButtonElement>('.filter').forEach((x) => {
        const chosen = x === btn;
        x.classList.toggle('active', chosen);
        x.setAttribute('aria-pressed', String(chosen));
      });
      document.querySelectorAll<HTMLElement>('.work-card').forEach((x) =>
        x.classList.toggle('hide', category !== 'all' && x.dataset.category !== category)
      );
    })
  );

  document.querySelectorAll<HTMLButtonElement>('.service').forEach((btn) =>
    btn.addEventListener('click', () => {
      const active = btn.classList.contains('active');
      document.querySelectorAll<HTMLButtonElement>('.service').forEach((x) => {
        x.classList.remove('active');
        x.setAttribute('aria-expanded', 'false');
      });
      if (!active) {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    })
  );

  document.querySelectorAll<HTMLButtonElement>('.faq-question').forEach((btn) =>
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const next = !item.classList.contains('open');
      document.querySelectorAll<HTMLElement>('.faq-item').forEach((x) => {
        x.classList.remove('open');
        x.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      if (next) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    })
  );

  const projectModal = document.getElementById('projectModal') as HTMLElement | null;
  const contactModal = document.getElementById('contactModal') as HTMLElement | null;
  let previousFocus: HTMLElement | null = null;

  function show(modal: HTMLElement | null) {
    if (!modal) return;
    previousFocus = document.activeElement as HTMLElement | null;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector<HTMLElement>('[data-close]');
    closeBtn?.focus();
  }

  function close(modal: HTMLElement | null) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  function showToast(messageHtml: string, durationMs = 5000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = messageHtml;
    toast.hidden = false;
    window.setTimeout(() => {
      toast.hidden = true;
    }, durationMs);
  }

  document.querySelectorAll<HTMLElement>('[data-project]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const key = btn.dataset.project;
      const x = key ? projects[key] : undefined;
      if (!x) return;
      const typeEl = document.getElementById('projectType');
      const titleEl = document.getElementById('projectModalTitle');
      const textEl = document.getElementById('projectText');
      const industryEl = document.getElementById('projectIndustry');
      const approachEl = document.getElementById('projectApproach');
      if (typeEl) typeEl.textContent = x.type;
      if (titleEl) titleEl.textContent = x.name;
      if (textEl) textEl.textContent = x.text;
      if (industryEl) industryEl.textContent = x.industry;
      if (approachEl) approachEl.textContent = x.approach;
      show(projectModal);
    })
  );

  document.querySelectorAll<HTMLElement>('[data-close]').forEach((btn) =>
    btn.addEventListener('click', () => close(btn.closest<HTMLElement>('.modal')))
  );

  document.querySelectorAll<HTMLElement>('.modal').forEach((modal) =>
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close(modal);
    })
  );

  const openContact = () => {
    if (projectModal && !projectModal.hidden) close(projectModal);
    show(contactModal);
  };

  document.getElementById('openContact')?.addEventListener('click', openContact);
  document.querySelector<HTMLElement>('[data-open-contact]')?.addEventListener('click', openContact);

  document.querySelectorAll<HTMLElement>('[data-package]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const pkgSelect = document.getElementById('clientPackage') as HTMLSelectElement | null;
      if (pkgSelect && btn.dataset.package) {
        pkgSelect.value = btn.dataset.package;
      }
      openContact();
    })
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal && !contactModal.hidden) close(contactModal);
      else if (projectModal && !projectModal.hidden) close(projectModal);
      else setDrawer(false);
    }
    if (e.key === 'Tab') {
      const modal =
        contactModal && !contactModal.hidden
          ? contactModal
          : projectModal && !projectModal.hidden
            ? projectModal
            : null;
      if (!modal) return;
      const nodes = [
        ...modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])'
        ),
      ].filter((x) => x.getClientRects().length);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  const enquiryForm = document.getElementById('enquiryForm') as HTMLFormElement | null;
  const submitBtn = document.getElementById('submitEnquiryBtn') as HTMLButtonElement | null;
  const briefInput = document.getElementById('clientBrief') as HTMLTextAreaElement | null;
  const briefCounter = document.getElementById('briefCounter');

  briefInput?.addEventListener('input', () => {
    if (briefCounter) {
      briefCounter.textContent = `${briefInput.value.length} / 1500`;
    }
  });

  enquiryForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;

    const name = (document.getElementById('clientName') as HTMLInputElement | null)?.value.trim() ?? '';
    const rawMobile =
      (document.getElementById('clientMobile') as HTMLInputElement | null)?.value.trim() ?? '';
    const mobileDigits = rawMobile.replace(/\D/g, '');
    const mobileNumberVal = mobileDigits ? Number(mobileDigits) : NaN;
    const projectTypeVal = Number(
      (document.getElementById('projectTypeInput') as HTMLSelectElement | null)?.value ?? 1
    );
    const packageDetailsVal = Number(
      (document.getElementById('clientPackage') as HTMLSelectElement | null)?.value ?? 1
    );
    const informations =
      (document.getElementById('clientBrief') as HTMLTextAreaElement | null)?.value.trim() ?? '';

    if (!name || !informations || Number.isNaN(mobileNumberVal)) {
      showToast('Please enter a valid numeric mobile number.');
      return;
    }

    if (!supabase) {
      showToast('Supabase credentials not configured yet.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Submitting...</span><span>↗</span>';
    }

    try {
      const payload = {
        name,
        'mobile number': mobileNumberVal,
        'package details': packageDetailsVal,
        'project type': projectTypeVal,
        informations,
      };

      let { error } = await supabase.from(supabaseTable).insert([payload]);

      if (error && error.code === 'PGRST205' && supabaseTable !== 'contacts') {
        const retry = await supabase.from('contacts').insert([payload]);
        error = retry.error;
      }

      if (error) {
        showToast(`Could not submit enquiry: ${error.message}`, 7000);
        return;
      }

      form.reset();
      if (briefCounter) {
        briefCounter.textContent = '0 / 1500';
      }
      close(contactModal);
      showToast('Thank you! Your project enquiry has been saved. ✳', 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected network error';
      showToast(`Submission failed: ${msg}`, 6000);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Submit project enquiry</span><span>↗</span>';
      }
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
