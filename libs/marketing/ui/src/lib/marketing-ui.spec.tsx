import { render } from '@testing-library/react';

import MarketingUi from './marketing-ui';

describe('MarketingUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MarketingUi />);
    expect(baseElement).toBeTruthy();
  });
});
