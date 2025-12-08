import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Network, 
  Download, 
  Layers, 
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  children?: { label: string; active?: boolean }[];
}

const menuItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Network, label: 'Nexus' },
  { icon: Download, label: 'Intake' },
  { 
    icon: Layers, 
    label: 'Services',
    children: [
      { label: 'Pre-active' },
      { label: 'Active' },
      { label: 'Blocked' },
      { label: 'Closed' },
    ]
  },
  { 
    icon: FileText, 
    label: 'Invoices',
    children: [
      { label: 'Proforma Invoices' },
      { label: 'Final Invoices' },
    ]
  },
];

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Services', 'Invoices']);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
            <span className="text-background font-bold text-sm">V</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">Vault</span>
            <span className="text-xs text-muted-foreground">Anurag Yadav</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => item.children && toggleExpand(item.label)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.children && (
                  expandedItems.includes(item.label) 
                    ? <ChevronDown className="w-3.5 h-3.5" />
                    : <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
              
              {/* Children */}
              {item.children && expandedItems.includes(item.label) && (
                <ul className="ml-6 mt-0.5 space-y-0.5">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <button
                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-1.5 text-sm transition-colors',
                          child.active
                            ? 'text-sidebar-primary font-medium'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
