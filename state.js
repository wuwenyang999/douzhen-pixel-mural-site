(function (root) {
  const key = 'douzhen-demo-state';
  const mardPalette = [
    { code: 'MARD A1', name: '米白', hex: '#FAF4C8' },
    { code: 'MARD A10', name: '橙红', hex: '#F77C31' },
    { code: 'MARD B10', name: '薄荷绿', hex: '#95D3C2' },
    { code: 'MARD B12', name: '深绿', hex: '#166F41' },
    { code: 'MARD M3', name: '蓝灰', hex: '#697D80' },
    { code: 'MARD M12', name: '深褐', hex: '#644749' },
  ];

  function buildGrid(sectionId) {
    const rows = 10;
    const columns = 10;
    const shift = ['A01', 'A02', 'A03'].indexOf(sectionId) + 1;
    const cells = Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      return mardPalette[(row * 3 + column * 2 + shift) % mardPalette.length];
    });
    return { rows, columns, cells };
  }

  function countColours(cells) {
    const counts = new Map();
    cells.forEach((cell) => counts.set(cell.code, (counts.get(cell.code) || 0) + 1));
    return mardPalette.map((colour) => ({ ...colour, count: counts.get(colour.code) || 0 })).filter((colour) => colour.count > 0);
  }

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
        return buildGrid(sectionId);
      },
      getPatternSummary(patternId) {
        const state = read();
        if (!state.owned.includes(patternId)) return null;
        const sectionIds = ['A01', 'A02', 'A03'];
        const cells = sectionIds.flatMap((sectionId) => buildGrid(sectionId).cells);
        return {
          brand: 'MARD 291',
          totalBeads: cells.length,
          sectionCount: sectionIds.length,
          colours: countColours(cells),
        };
      },
    };
  }

  if (typeof module !== 'undefined') module.exports = { createDemoStore };
  root.createDemoStore = createDemoStore;
})(typeof window === 'undefined' ? globalThis : window);
