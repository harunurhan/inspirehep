import React from 'react';
import { shallow } from 'enzyme';

import SelectBox from '../SelectBox';

describe('SelectBox', () => {
  it('render initial state with all props set', () => {
    const options = [
      { value: 'value1', display: 'Value 1' },
      { value: 'value2', display: 'Value 2' },
    ];
    const wrapper = shallow((
      <SelectBox
        defaultValue={options[0].value}
        onChange={jest.fn()}
        options={options}
      />
    ));
    expect(wrapper).toMatchSnapshot();
  });

  describe('onChange', () => {
    it('calls props.onChange if present', () => {
      const onChange = jest.fn();
      const options = [
        { value: 'value1', display: 'Value 1' },
        { value: 'value2', display: 'Value 2' },
      ];
      const wrapper = shallow((
        <SelectBox
          onChange={onChange}
          options={options}
        />
      ));
      wrapper.instance().onChange('value2');
      expect(onChange).toHaveBeenCalledWith('value2');
    });
  });
});
