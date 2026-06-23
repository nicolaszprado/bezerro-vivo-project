import * as React from "react";

import { reportLovableError } from "@/lib/lovable-error-reporting";
import { useParams, usePathname, Link } from "@/lib/router";
import { HomePage } from "@/pages/HomePage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { RelatoriosPage } from "@/pages/RelatoriosPage";
import { CalfDetailPage } from "@/pages/CalfDetailPage";

const pageTitles: Record<string, string> = {
  "/": "Gestão de Bezerros",
  "/marketplace": "Marketplace - Bezerros à venda",
  "/relatorios": "Relatórios - Gestão de Bezerros",
};

export default function App() {
  return (
    <AppErrorBoundary>
      <AppRoutes />
    </AppErrorBoundary>
  );
}

function AppRoutes() {
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  React.useEffect(() => {
    document.title = pathname.startsWith("/bezerros/")
      ? `${params.id ?? "Bezerro"} - Detalhes do Bezerro`
      : (pageTitles[pathname] ?? "Gestão de Bezerros");
  }, [params.id, pathname]);

  if (pathname === "/") return <HomePage />;
  if (pathname === "/marketplace") return <MarketplacePage />;
  if (pathname === "/relatorios") return <RelatoriosPage />;
  if (pathname.startsWith("/bezerros/") && params.id) {
    return <CalfDetailPage id={params.id} />;
  }

  return <NotFoundPage />;
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você tentou abrir não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
    reportLovableError(error, { boundary: "spa_root_error_boundary" });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Esta tela não carregou
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Algo deu errado. Tente recarregar a página ou voltar para o início.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Ir para o início
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
