import "@/styles/yorozu-demo.css";
import { Header } from "@/app/yorozu-demo/components/Header";
import { DemoStateProvider } from "@/app/yorozu-demo/context/DemoStateContext";

export default function YorozuDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoStateProvider>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>
      </div>
    </DemoStateProvider>
  );
}
