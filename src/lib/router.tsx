import * as React from "react";

type Params = Record<string, string>;

type RouterContextValue = {
  pathname: string;
  params: Params;
  navigate: (to: string, options?: { replace?: boolean }) => void;
};

const RouterContext = React.createContext<RouterContextValue | null>(null);

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildPath(template: string, params?: Params) {
  if (!params) return template;
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value).replace(`$${key}`, value),
    template,
  );
}

function getRouteParams(pathname: string): Params {
  const match = pathname.match(/^\/bezerros\/([^/]+)$/);
  if (!match) return {};
  return { id: decodeURIComponent(match[1]) };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = React.useState(() => window.location.pathname);

  React.useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    const nextPath = normalizePath(to);
    if (nextPath === window.location.pathname) return;

    const method = options?.replace ? "replaceState" : "pushState";
    window.history[method](null, "", nextPath);
    setPathname(nextPath);
  };

  return (
    <RouterContext.Provider
      value={{ pathname, params: getRouteParams(pathname), navigate }}
    >
      {children}
    </RouterContext.Provider>
  );
}

function useRouterContext() {
  const context = React.useContext(RouterContext);
  if (!context) throw new Error("Router hooks must be used within RouterProvider");
  return context;
}

export function usePathname() {
  return useRouterContext().pathname;
}

export function useParams<T extends Params = Params>() {
  return useRouterContext().params as T;
}

export function useNavigate() {
  const { navigate } = useRouterContext();

  return (options: { to: string; params?: Params; replace?: boolean }) => {
    navigate(buildPath(options.to, options.params), { replace: options.replace });
  };
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  params?: Params;
};

export function Link({ to, params, onClick, target, ...props }: LinkProps) {
  const { navigate } = useRouterContext();
  const href = buildPath(to, params);

  return (
    <a
      {...props}
      href={href}
      target={target}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          target === "_blank" ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
