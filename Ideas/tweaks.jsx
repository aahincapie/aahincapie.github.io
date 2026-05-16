// Tweaks panel for the homepage redesign proposal

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "terracotta",
  "type": "newsreader",
  "density": "comfortable",
  "hero": "split"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const html = document.documentElement;
  html.setAttribute('data-theme', t.dark ? 'dark' : 'light');
  html.setAttribute('data-accent', t.accent);
  html.setAttribute('data-type', t.type);
  html.setAttribute('data-density', t.density);

  // Hero layout
  const hero = document.getElementById('hero');
  if (hero) {
    hero.classList.remove('hero--split', 'hero--centered', 'hero--asym');
    hero.classList.add('hero--' + t.hero);
  }
  // Persist theme to localStorage so toggle stays in sync on next reload
  try { localStorage.setItem('theme', t.dark ? 'dark' : 'light'); } catch(e) {}
}

function App() {
  // Seed `dark` from localStorage so the panel doesn't overwrite the user's
  // saved preference on mount.
  const seeded = React.useMemo(() => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch(e) {}
    return { ...TWEAK_DEFAULTS, dark: saved ? saved === 'dark' : TWEAK_DEFAULTS.dark };
  }, []);
  const [t, setTweak] = useTweaks(seeded);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  // Mirror the inline theme toggle button back into our state so the panel
  // stays consistent if the user clicks the in-page sun/moon button.
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark !== t.dark) setTweak('dark', dark);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, [t.dark]);

  return (
    <TweaksPanel title="Redesign tweaks">
      <TweakSection label="Theme" />
      <TweakToggle label="Dark mode" value={t.dark}
                   onChange={(v) => setTweak('dark', v)} />
      <TweakSelect label="Accent" value={t.accent}
                   options={['terracotta', 'moss', 'slate']}
                   onChange={(v) => setTweak('accent', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Heading font" value={t.type}
                   options={['newsreader', 'spectral', 'plex']}
                   onChange={(v) => setTweak('type', v)} />

      <TweakSection label="Layout" />
      <TweakRadio  label="Density" value={t.density}
                   options={['cozy', 'comfortable', 'spacious']}
                   onChange={(v) => setTweak('density', v)} />
      <TweakSelect label="Hero layout" value={t.hero}
                   options={['split', 'centered', 'asym']}
                   onChange={(v) => setTweak('hero', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
