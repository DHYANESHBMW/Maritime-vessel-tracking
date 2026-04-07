import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardSidebar } from './DashboardSidebar';

// Mock Recharts to avoid testing charting library internals
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  PieChart: () => <div data-testid="pie-chart" />,
  Pie: () => null,
  Cell: () => null,
}));

describe('DashboardSidebar', () => {
  const mockProps = {
    activeModule: 'analytics',
    vessels: [],
    voyages: [],
    notifications: [],
    userRole: 'admin',
    stats: { total_vessels: 10, type_distribution: [{ vessel_type: 'Tanker', count: 5 }] },
    ports: []
  };

  test('renders fleet analytics when active', () => {
    render(<DashboardSidebar {...mockProps} />);
    expect(screen.getByText(/Fleet Analytics/i)).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
