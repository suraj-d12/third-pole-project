import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

// In-page sections live on the landing; Data and Blog are routes.
const sections = [
    { id: 'research', label: 'Research' },
    { id: 'about', label: 'About' },
];
const routes = [
    { to: '/data', label: 'Data' },
    { to: '/blog', label: 'Blog' },
];

const itemClass = 'relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [night, setNight] = useState(false); // globe section turns the page dark
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        const onNight = (e) => setNight(e.detail);
        window.addEventListener('globe-night', onNight);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('globe-night', onNight);
        };
    }, []);

    // Scroll to a landing section; hop home first from other routes.
    const goToSection = (id) => {
        setIsMenuOpen(false);
        const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (location.pathname !== '/') { navigate('/'); setTimeout(scroll, 350); }
        else scroll();
    };

    const barClass = night
        ? 'bg-[#0a0f16]/80 backdrop-blur-md border-b border-white/10'
        : scrolled
            ? 'bg-paper/85 backdrop-blur-md border-b border-paper-deep'
            : 'bg-transparent border-b border-transparent';
    const inkStrong = night ? 'text-paper' : 'text-ink';
    const inkSoft = night ? 'text-paper/60 hover:text-paper' : 'text-ink-soft hover:text-ink';
    const inkFaint = night ? 'text-paper/40' : 'text-ink-faint';
    const outline = night
        ? 'border-paper text-paper hover:bg-paper hover:text-ink'
        : 'border-ink text-ink hover:bg-ink hover:text-paper';

    return (
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${barClass}`}>
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="group flex items-center gap-3">
                        <span className={`grid place-items-center w-7 h-7 rounded-full border transition-colors duration-500 ${night ? 'border-paper text-paper' : 'border-ink text-ink'}`}>
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <circle cx="12" cy="12" r="9" />
                                <ellipse cx="12" cy="12" rx="4" ry="9" />
                                <path d="M3 12h18M4.5 7h15M4.5 17h15" />
                            </svg>
                        </span>
                        <span className="leading-none">
                            <span className={`block font-display text-lg font-semibold tracking-tight transition-colors duration-500 ${inkStrong}`}>The Third Pole</span>
                            <span className={`block font-mono text-[10px] uppercase tracking-widest -mt-0.5 transition-colors duration-500 ${inkFaint}`}>AI climate forecasting</span>
                        </span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {sections.map((s) => (
                            <button key={s.id} onClick={() => goToSection(s.id)} className={`${itemClass} ${inkSoft}`}>
                                {s.label}
                            </button>
                        ))}
                        {routes.map((r) => (
                            <NavLink key={r.to} to={r.to} className={({ isActive }) => `${itemClass} ${isActive ? 'text-glacier' : inkSoft}`}>
                                {({ isActive }) => (
                                    <>
                                        {r.label}
                                        <span className={`absolute left-4 right-4 -bottom-0.5 h-px origin-left bg-glacier transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                        <a href="https://www.himalayanwaterproject.org" target="_blank" rel="noopener noreferrer"
                            className={`ml-3 px-4 py-2 border font-mono text-xs uppercase tracking-widest transition-colors duration-500 ${outline}`}>
                            Contact
                        </a>
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setIsMenuOpen((v) => !v)} className={`md:hidden p-2 transition-colors duration-500 ${inkStrong}`} aria-label="Toggle menu">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            {isMenuOpen ? <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-paper border-t border-paper-deep">
                    <div className="px-5 py-3">
                        {sections.map((s) => (
                            <button key={s.id} onClick={() => goToSection(s.id)} className="block w-full text-left px-3 py-3 font-mono text-xs uppercase tracking-widest border-b border-paper-deep text-ink-soft">{s.label}</button>
                        ))}
                        {routes.map((r) => (
                            <NavLink key={r.to} to={r.to} onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 font-mono text-xs uppercase tracking-widest border-b border-paper-deep text-ink-soft">{r.label}</NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
