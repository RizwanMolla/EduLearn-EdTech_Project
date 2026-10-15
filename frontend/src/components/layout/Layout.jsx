import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import Cursor from './Cursor';
import CommandPalette from './CommandPalette';

const bareRoutes = ['/learn', '/certificate'];

const PageFallback = () => (
  <div className="grid min-h-[80vh] place-items-center" aria-busy="true">
    <span className="size-2 animate-[pulse-dot_1s_ease-in-out_infinite] rounded-full bg-clay" />
  </div>
);

const Layout = () => {
  const location = useLocation();
  const bare = bareRoutes.some((r) => location.pathname.startsWith(r));

  return (
    <div className="flex min-h-dvh flex-col">
      {!bare && <Navbar />}
      {/* Keyed by path so each page mounts fresh and replays its entrance */}
      <main id="main" key={location.pathname} className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      {!bare && <Footer />}
      <Cursor />
      <CommandPalette />
    </div>
  );
};

export default Layout;
