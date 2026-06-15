import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ContentItem from '../ContentItem.vue';

describe('ContentItem.vue', () => {
  it('renders a folder correctly', () => {
    const wrapper = mount(ContentItem, {
      props: {
        type: 'folder',
        name: 'My Folder',
        meta: 'Folder',
      },
    });

    expect(wrapper.text()).toContain('My Folder');
    expect(wrapper.text()).toContain('Folder');
    expect(wrapper.text()).toContain('📁'); // The computed icon for folder
    expect(wrapper.classes()).toContain('is-folder');
  });

  it('renders a file correctly', () => {
    const wrapper = mount(ContentItem, {
      props: {
        type: 'file',
        name: 'document.pdf',
        meta: '20 KB',
      },
    });

    expect(wrapper.text()).toContain('document.pdf');
    expect(wrapper.text()).toContain('20 KB');
    expect(wrapper.text()).toContain('📄'); // The computed icon for file
    expect(wrapper.classes()).not.toContain('is-folder');
  });

  it('emits dblclick event when double clicked', async () => {
    const wrapper = mount(ContentItem, {
      props: {
        type: 'file',
        name: 'test',
        meta: 'meta',
      },
    });

    await wrapper.trigger('dblclick');
    expect(wrapper.emitted()).toHaveProperty('dblclick');
  });
});
