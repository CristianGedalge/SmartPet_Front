import type { LucideIcon } from 'lucide-react';
export function ModuleEmptyState({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
 return <div className="module-page"><div className="dashboard-intro"><div><p className="eyebrow">TU COMUNIDAD SMARTPET</p><h1>{title}</h1><p>{description}</p></div></div><section className="panel module-empty"><span className="module-empty-icon"><Icon size={35} strokeWidth={1.4} /></span><span className="module-soon">PRÓXIMAMENTE</span><h2>Estamos preparando este espacio</h2><p>Pronto podrás consultar y gestionar esta información desde aquí.</p></section></div>;
}
