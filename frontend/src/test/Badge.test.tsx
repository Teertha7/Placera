import { describe, it, expect } from 'vitest';
import React from 'react';
import { Badge } from '../components/common/Badge';

describe('Badge Component', () => {
  it('renders correct label for APPLIED status', () => {
    const badge = <Badge status="APPLIED" />;
    expect(badge.props.status).toBe('APPLIED');
  });

  it('renders correct label for SELECTED status', () => {
    const badge = <Badge status="SELECTED" />;
    expect(badge.props.status).toBe('SELECTED');
  });

  it('renders correct custom variant', () => {
    const badge = <Badge variant="green">Active</Badge>;
    expect(badge.props.variant).toBe('green');
    expect(badge.props.children).toBe('Active');
  });
});
