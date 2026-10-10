(() => {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const register = tool => {
    try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch {}
  };
  if (document.querySelector('#calc-result')) register({
    name: 'set_value_assumptions',
    title: 'Explore the value estimate',
    description: 'Update the visible calculator with visitor-provided assumptions. Returns estimated contribution before TheAiAutomators fees; does not forecast or guarantee real results.',
    inputSchema: { type: 'object', properties: { inquiries: { type: 'number', minimum: 0, maximum: 100000 }, capture_percent: { type: 'number', minimum: 0, maximum: 100 }, booking_percent: { type: 'number', minimum: 0, maximum: 100 }, contribution_inr: { type: 'number', minimum: 0, maximum: 10000000 } }, required: ['inquiries', 'capture_percent', 'booking_percent', 'contribution_inr'], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      const fields = { inquiries: ['calc-inquiries',100000], capture_percent: ['calc-capture',100], booking_percent: ['calc-booking',100], contribution_inr: ['calc-margin',10000000] };
      if (!input || Object.keys(input).length !== 4 || Object.entries(fields).some(([key, [, max]]) => typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < 0 || input[key] > max)) throw new Error('Supply four valid assumptions within the stated ranges.');
      for (const [key, [id]] of Object.entries(fields)) { const field = document.getElementById(id); field.value = String(input[key]); field.dispatchEvent(new Event('input', { bubbles: true })); }
      return { estimated_contribution: document.querySelector('#calc-result').textContent, estimated_completed_bookings: document.querySelector('#calc-count').textContent, before_TheAiAutomators_fees: true, is_estimate: true };
    }
  });
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
})();
