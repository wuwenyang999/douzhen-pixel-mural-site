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
    };
  }

  if (typeof module !== 'undefined') module.exports = { createDemoStore };
  root.createDemoStore = createDemoStore;
})(typeof window === 'undefined' ? globalThis : window);
