import type { ReactNode } from 'react';

interface BadgeProps {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ label, variant, icon, size = 'md' }: BadgeProps) {
  const styles = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    error: 'bg-red-50 text-[#872B35] border border-red-200',
    info: 'bg-[#DDD5CD] text-[#536273] border border-[#cfc6bc]',
    neutral: 'bg-[#DDD5CD] text-[#131B24] border border-[#cfc6bc]',
  };
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1 rounded font-medium ${sz} ${styles[variant]}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === 'AGENDADO') return <Badge label="Agendado" variant="info" />;
  if (status === 'EM_ANDAMENTO') return <Badge label="Em andamento" variant="warning" />;
  if (status === 'CONCLUIDO') return <Badge label="Concluído" variant="success" />;
  if (status === 'CANCELADO') return <Badge label="Cancelado" variant="neutral" />;
  if (status === 'normal') return <Badge label="Normal" variant="success" />;
  if (status === 'baixo') return <Badge label="Baixo" variant="warning" />;
  if (status === 'critico') return <Badge label="Crítico" variant="error" />;
  if (status === 'sem_estoque') return <Badge label="Sem estoque" variant="neutral" />;
  if (status === 'ATIVO' || status === 'true') return <Badge label="Ativo" variant="success" />;
  if (status === 'INATIVO' || status === 'false') return <Badge label="Inativo" variant="neutral" />;
  return <Badge label={status} variant="neutral" />;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button', className = '' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer';
  const sizes = { sm: 'text-sm px-3 py-1.5', md: 'text-sm px-4 py-2.5', lg: 'text-base px-6 py-3' };
  const variants = {
    primary: 'bg-[#872B35] text-white hover:bg-[#6e2029] focus-visible:ring-[#872B35] disabled:opacity-50',
    secondary: 'bg-[#223143] text-[#DDD5CD] hover:bg-[#1a2635] focus-visible:ring-[#223143] disabled:opacity-50',
    tertiary: 'bg-transparent text-[#223143] border border-[#223143] hover:bg-[#223143] hover:text-[#DDD5CD] focus-visible:ring-[#223143] disabled:opacity-50',
    destructive: 'bg-[#872B35] text-white hover:bg-[#6e2029] focus-visible:ring-[#872B35] disabled:opacity-50',
    ghost: 'bg-transparent text-[#536273] hover:bg-[#DDD5CD] focus-visible:ring-[#536273] disabled:opacity-50',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

interface InputProps {
  label?: string;
  id?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

export function Input({ label, id, type = 'text', value, onChange, placeholder, required, error, hint, disabled }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-[#536273]">
          {label}{required && <span className="text-[#872B35] ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full rounded-md border bg-white text-[#131B24] text-sm px-3 py-2.5 placeholder:text-[#cfc6bc] focus:outline-none focus:ring-2 focus:ring-[#872B35] transition-shadow ${error ? 'border-[#872B35]' : 'border-[#cfc6bc]'} ${disabled ? 'opacity-60 cursor-not-allowed bg-[#DDD5CD]' : ''}`}
      />
      {error && <p className="text-xs text-[#872B35] flex items-center gap-1">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-[#536273]">{hint}</p>}
    </div>
  );
}

interface SelectProps {
  label?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  children: ReactNode;
  disabled?: boolean;
}

export function Select({ label, id, value, onChange, required, children, disabled }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-[#536273]">
          {label}{required && <span className="text-[#872B35] ml-0.5">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full rounded-md border border-[#cfc6bc] bg-white text-[#131B24] text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#872B35] transition-shadow ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {children}
      </select>
    </div>
  );
}

interface TextAreaProps {
  label?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ label, id, value, onChange, placeholder, rows = 3 }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-[#536273]">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-md border border-[#cfc6bc] bg-white text-[#131B24] text-sm px-3 py-2.5 placeholder:text-[#cfc6bc] focus:outline-none focus:ring-2 focus:ring-[#872B35] transition-shadow resize-none"
      />
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#DDD5CD] shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
  sub?: string;
}

export function StatCard({ label, value, icon, accent, sub }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#536273]">{label}</p>
          <p className={`text-3xl font-bold mt-1 font-display ${accent || 'text-[#131B24]'}`}>{value}</p>
          {sub && <p className="text-xs text-[#536273] mt-1">{sub}</p>}
        </div>
        <div className="rounded-lg bg-[#DDD5CD] p-2.5 text-[#536273]">
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#131B24]/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white w-full ${widths[size]} rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#DDD5CD]">
          <h3 className="font-semibold text-[#131B24] text-lg">{title}</h3>
          <button onClick={onClose} className="text-[#536273] hover:text-[#131B24] transition-colors p-1 rounded-lg hover:bg-[#DDD5CD]">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-[#cfc6bc] mb-4">{icon}</div>
      <p className="font-semibold text-[#223143] text-lg mb-1">{title}</p>
      {description && <p className="text-sm text-[#536273] max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function Alert({ type, title, message }: { type: 'success' | 'warning' | 'error' | 'info'; title: string; message?: string }) {
  const styles = {
    success: { bg: 'bg-green-50 border-green-200', icon: '✓', iconColor: 'text-green-700', text: 'text-green-900' },
    warning: { bg: 'bg-amber-50 border-amber-200', icon: '⚠', iconColor: 'text-amber-700', text: 'text-amber-900' },
    error: { bg: 'bg-red-50 border-red-200', icon: '✕', iconColor: 'text-[#872B35]', text: 'text-[#872B35]' },
    info: { bg: 'bg-[#DDD5CD]/50 border-[#cfc6bc]', icon: 'ℹ', iconColor: 'text-[#536273]', text: 'text-[#223143]' },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${s.bg}`}>
      <span className={`font-bold text-lg leading-none mt-0.5 ${s.iconColor}`}>{s.icon}</span>
      <div>
        <p className={`font-semibold text-sm ${s.text}`}>{title}</p>
        {message && <p className={`text-sm mt-0.5 ${s.text} opacity-80`}>{message}</p>}
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-[#DDD5CD] overflow-x-auto scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${active === tab.id ? 'border-[#872B35] text-[#872B35]' : 'border-transparent text-[#536273] hover:text-[#223143]'}`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${active === tab.id ? 'bg-[#872B35] text-white' : 'bg-[#DDD5CD] text-[#536273]'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
