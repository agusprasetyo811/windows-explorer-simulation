import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchBar from '../SearchBar.vue';

describe('SearchBar.vue', () => {
  it('renders input with initial query', () => {
    const wrapper = mount(SearchBar, {
      props: {
        query: 'initial search',
        isLoading: false,
      },
    });

    const input = wrapper.find('input[type="text"]');
    expect((input.element as HTMLInputElement).value).toBe('initial search');
  });

  it('emits search event when Search button is clicked', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        query: 'test',
        isLoading: false,
      },
    });

    await wrapper.find('.search-button').trigger('click');
    
    // Should emit 'search' with the query 'test'
    expect(wrapper.emitted()).toHaveProperty('search');
    expect(wrapper.emitted('search')![0]).toEqual(['test']);
  });

  it('emits clear event when Clear button is clicked', async () => {
    const wrapper = mount(SearchBar, {
      props: {
        query: 'test',
        isLoading: false,
      },
    });

    await wrapper.find('.search-clear').trigger('click');
    
    expect(wrapper.emitted()).toHaveProperty('clear');
  });

  it('disables inputs when isLoading is true', () => {
    const wrapper = mount(SearchBar, {
      props: {
        query: '',
        isLoading: true,
      },
    });

    const input = wrapper.find('input[type="text"]');
    const searchButton = wrapper.find('.search-button');

    expect((input.element as HTMLInputElement).disabled).toBe(true);
    expect((searchButton.element as HTMLButtonElement).disabled).toBe(true);
  });
});
