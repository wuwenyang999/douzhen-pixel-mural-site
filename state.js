(function (root) {
  const key = 'douzhen-demo-state';

  function createDemoStore(storage) {
    function read() {
      try {
        return JSON.parse(storage.getItem(key) || '{"used":false,"owned":[],"progress":{}}');
      } catch {
        return { used: false, owned: [], progress: {} };
      }
    }

    function write(value) {
      storage.setItem(key, JSON.stringify(value));
    }

    return {
      redeem(code) {
        const state = read();
        if (code.trim().toUpperCase() !== 'DOUZHEN-DEMO') return { ok: false, reason: 'invalid' };
        if (state.used) return { ok: false, reason: 'used' };
        state.used = true;
        state.owned = [...new Set([...state.owned, 'azure-dragon'])];
        write(state);
        return { ok: true, patternId: 'azure-dragon' };
      },
      owned() {
        return read().owned;
      },
      toggleSection(patternId, sectionId) {
        const state = read();
        if (!state.owned.includes(patternId)) return false;
        const complete = new Set(state.progress[patternId] || []);
        complete.has(sectionId) ? complete.delete(sectionId) : complete.add(sectionId);
        state.progress[patternId] = [...complete];
        write(state);
        return complete.has(sectionId);
      },
      getCompletedSections(patternId) {
        return read().progress[patternId] || [];
      },
      getSectionGrid(patternId, sectionId) {
        const state = read();
        if (!state.owned.includes(patternId)) return null;
        const palettes = {
          A01: ['#0F172A', '#155E75', '#14B8A6', '#FDE047', '#E2E8F0'],
          A02: ['#0F172A', '#155E75', '#38BDF8', '#E2E8F0', '#F8FAFC'],
          A03: ['#0F172A', '#164E63', '#14B8A6', '#22C55E', '#FDE047'],
        };
        const palette = palettes[sectionId] || palettes.A01;
        const rows = 10;
        const columns = 10;
        const shift = Object.keys(palettes).indexOf(sectionId) + 1;
        const cells = Array.from({ length: rows * columns }, (_, index) => {
          const row = Math.floor(index / columns);
          const column = index % columns;
          return palette[(row * 3 + column * 2 + shift) % palette.length];
        });
        return { rows, columns, cells };
      },
    };
  }

  if (typeof module !== 'undefined') module.exports = { createDemoStore };
  root.createDemoStore = createDemoStore;
})(typeof window === 'undefined' ? globalThis : window);
