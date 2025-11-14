import { NavLink, Outlet } from 'react-router-dom';

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'text-sm font-medium transition-colors duration-200',
    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900',
  ].join(' ');

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Codex Learning Journal
            </p>
            <h1 className="text-xl font-semibold">Entries</h1>
          </div>
          <nav className="flex items-center gap-4">
            <NavLink to="/" className={linkClassName} end>
              Timeline
            </NavLink>
            <NavLink to="/entries/new" className={linkClassName}>
              New Entry
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
