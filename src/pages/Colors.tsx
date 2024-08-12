
import NavbarSidebar from '@/components/NavbarSidebar';
import React from 'react';

const colors = [
  { name: 'Primary', className: 'bg-primary', textColor: 'text-primary-foreground' },
  { name: 'Secondary', className: 'bg-secondary', textColor: 'text-secondary-foreground' },
  { name: 'Accent', className: 'bg-accent', textColor: 'text-accent-foreground' },
  { name: 'Muted', className: 'bg-muted', textColor: 'text-muted-foreground' },
  { name: 'Destructive', className: 'bg-destructive', textColor: 'text-destructive-foreground' },
  { name: 'Background', className: 'bg-background', textColor: 'text-foreground' },
  { name: 'Card', className: 'bg-card', textColor: 'text-card-foreground' },
  { name: 'Popover', className: 'bg-popover', textColor: 'text-popover-foreground' },
  { name: 'Border', className: 'bg-border', textColor: 'text-foreground' },
  { name: 'Input', className: 'bg-input', textColor: 'text-foreground' },
  { name: 'Ring', className: 'bg-ring', textColor: 'text-foreground' },
];

const ColorPalette = () => {
  return (
    <NavbarSidebar>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Color Palette</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colors.map((color) => (
            <div key={color.name} className="p-4 border border-border rounded-lg">
              <div className={`h-16 w-full rounded-md mb-4 ${color.className}`} />
              <div className={`text-lg font-semibold ${color.textColor}`}>{color.name}</div>
              <div className="text-sm text-muted-foreground">{color.className}</div>
            </div>
          ))}
        </div>
      </div>

    </NavbarSidebar>
  );
};

export default ColorPalette;
