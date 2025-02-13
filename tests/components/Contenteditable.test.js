import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ContentEditable from '../../src/components/Contenteditable';

const mockOnChange = jest.fn();

describe('ContentEditable Component', () => {

    it('renders initial value correctly', () => {

        render(
            <ContentEditable
                value="Hello, world!"
                onChange={() => {}}
                placeholder="Type something..."
            />
        );

        const contentEditableElement = screen.getByRole('textbox');
        expect(contentEditableElement.innerText).toBe('Hello, world!');
    });

    it('calls onChange when text is modified', () => {

        render(
            <ContentEditable
                value="Initial text"
                onChange={mockOnChange}
                placeholder="Type something..."
            />
        );

        const contentEditableElement = screen.getByRole('textbox');

        fireEvent.input(contentEditableElement, {
            target: { innerText: 'Updated text' },
        });

        expect(mockOnChange).toHaveBeenCalledWith('Updated text');
    });

    it('calls onChange with empty value when cleared', () => {

        render(
            <ContentEditable
                value="Some text"
                onChange={mockOnChange}
                placeholder="Type something..."
            />
        );

        const contentEditableElement = screen.getByRole('textbox');

        fireEvent.input(contentEditableElement, {
            target: { innerText: '' },
        });

        expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('displays placeholder when content is empty', () => {

        render(
            <ContentEditable
                value=""
                onChange={() => {}}
                placeholder="Type something..."
            />
        );

        const contentEditableElement = screen.getByRole('textbox');
        expect(contentEditableElement.getAttribute('placeholder')).toBe('Type something...');
    });
});
