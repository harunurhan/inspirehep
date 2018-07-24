import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import InstitutionLink from '../InstitutionLink';

describe('InstitutionLink', () => {
  it('renders link if institution has name', () => {
    const institution = fromJS({
      name: 'CERN',
    });
    const wrapper = shallow(<InstitutionLink institution={institution} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders empty if instution does not has name', () => {
    const institution = fromJS({});
    const wrapper = shallow(<InstitutionLink institution={institution} />);
    expect(wrapper).toMatchSnapshot();
  });
});
