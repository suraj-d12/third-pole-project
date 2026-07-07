import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

const routes = [
    { to: '/', label: 'Observatory', end: true },
    { to: '/data', label: 'Data' },
    { to: '/blog', label: 'Field Notes' },
];
const sections = [
    { id: 'themes', label: 'Themes' },
    { id: 'mission', label: 'Mission' },
];

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Scroll to an in-page section; hop home first if we're on another route.
    const goToSection = (id) => {
        setIsMenuOpen(false);
        const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (location.pathname !== '/') { navigate('/'); setTimeout(scroll, 350); }
        else scroll();
    };

    const railBase = 'relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors';

    return (
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-paper-deep' : 'bg-transparent border-b border-transparent'}`}>
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Wordmark */}
                    <Link to="/" className="group flex items-center gap-3">
                        <span className="grid place-items-center w-7 h-7 rounded-full border border-ink text-ink">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <circle cx="12" cy="12" r="9" />
                                <ellipse cx="12" cy="12" rx="4" ry="9" />
                                <path d="M3 12h18M4.5 7h15M4.5 17h15" />
                            </svg>
                        </span>
                        <span className="leading-none">
                            <span className="block font-display text-lg font-semibold tracking-tight text-ink">The Third Pole</span>
                            <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-faint -mt-0.5">Climate Observatory</span>
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" end className={({ isActive }) => `${railBase} ${isActive ? 'text-glacier' : 'text-ink-soft hover:text-ink'}`}>
                            {({ isActive }) => (<>Observatory<Underline on={isActive} /></>)}
                        </NavLink>
                        {sections.map((s) => (
                            <button key={s.id} onClick={() => goToSection(s.id)} className={`${railBase} text-ink-soft hover:text-ink`}>
                                {s.label}
                            </button>
                        ))}
                        {routes.slice(1).map((r) => (
                            <NavLink key={r.to} to={r.to} className={({ isActive }) => `${railBase} ${isActive ? 'text-glacier' : 'text-ink-soft hover:text-ink'}`}>
                                {({ isActive }) => (<>{r.label}<Underline on={isActive} /></>)}
                            </NavLink>
                        ))}
                        <a href="https://www.himalayanwaterproject.org" target="_blank" rel="noopener noreferrer"
                            className="ml-3 px-4 py-2 border border-ink text-ink font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">
                            Contact
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setIsMenuOpen((v) => !v)} className="md:hidden p-2 text-ink" aria-label="Toggle menu">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            {isMenuOpen ? <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-paper border-t border-paper-deep">
                    <div className="px-5 py-3">
                        <NavLink to="/" end onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 font-mono text-xs uppercase tracking-widest border-b border-paper-deep text-ink-soft">Observatory</NavLink>
                        {sections.map((s) => (
                            <button key={s.id} onClick={() => goToSection(s.id)} className="block w-full text-left px-3 py-3 font-mono text-xs uppercase tracking-widest border-b border-paper-deep text-ink-soft">{s.label}</button>
                        ))}
                        {routes.slice(1).map((r) => (
                            <NavLink key={r.to} to={r.to} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 font-mono text-xs uppercase tracking-widest border-b border-paper-deep text-ink-soft">{r.label}</NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

const Underline = ({ on }) => (
    <span className={`absolute left-4 right-4 -bottom-0.5 h-px origin-left bg-glacier transition-transform duration-300 ${on ? 'scale-x-100' : 'scale-x-0'}`} />
);

export default Navigation;
