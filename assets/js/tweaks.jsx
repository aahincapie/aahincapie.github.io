// tweaks.jsx — site-level design tweaks panel
// Opens with Alt+T keyboard shortcut. Syncs with the existing dark mode toggle.

const TWEAK_DEFAULTS = {
  "dark": false,
  "accent": "terracotta",
  "type": "newsreader",
  "density": "comfortable"
};

function applyTweaks(t) {
  const html = document.documentElement;
  html.setAttribute('data-theme', t.dark ? 'dark' : 'light');
  html.setAttribute('data-accent', t.accent === 'terracotta' ? '' : t.accent);
  html.setAttribute('data-type', t.type === 'newsreader' ? '' : t.type);
  html.setAttribute('data-density', t.density === 'comfortable' ? '' : t.density);
  try { localStorage.setItem('theme', t.dark ? 'dark' : 'light'); } catch(e) {}
}

function App() {
  const seeded = React.useMemo(() => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch(e) {}
    return { ...TWEAK_DEFAULTS, dark: saved ? saved === 'dark' : TWEAK_DEFAULTS.dark };
  }, []);

  const [t, setTweak] = useTweaks(seeded);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  // Keep panel in sync if the user clicks the navbar sun/moon toggle
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark !== t.dark) setTweak('dark', dark);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [t.dark]);

  // Alt+T opens the panel
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        window.postMessage({ type: '__activate_edit_mode' }, '*');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <TweaksPanel title="Design tweaks (Alt+T)">
      <TweakSection label="Theme" />
      <TweakToggle label="Dark mode" value={t.dark}
                   onChange={(v) => setTweak('dark', v)} />
      <TweakSelect label="Accent colour" value={t.accent}
                   options={['terracotta', 'moss', 'slate']}
                   onChange={(v) => setTweak('accent', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Heading font" value={t.type}
                   options={['newsreader', 'spectral', 'plex']}
                   onChange={(v) => setTweak('type', v)} />

      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density}
                  options={['cozy', 'comfortable', 'spacious']}
                  onChange={(v) => setTweak('density', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
