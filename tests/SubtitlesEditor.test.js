import React from 'react';
import "@testing-library/jest-dom";
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import SubtitlesEditor from '../src/SubtitlesEditor';

const subtitles = [
    { text: "1\n00:00:00:000 --> 00:00:02:000\nFirst subtitle!" },
    { text: "1\n00:00:00:000 --> 00:00:02:000\nSecond subtitle!" }
];

const mockOnChange = jest.fn();
const mockOnSave = jest.fn();
const mockOnAddSubtitle = jest.fn();
const mockDownloadEnabled = true;

describe('SubtitlesEditor Component', () => {

    it('renders subtitles correctly', () => {

        render(
            <SubtitlesEditor
                subtitles={subtitles}
                onChange={mockOnChange}
                onSave={mockOnSave}
                onAddSubtitle={mockOnAddSubtitle}
                downloadEnabled={mockDownloadEnabled}
                addSubtitleButton={true}
            />
        );

        const contentEditableElements = screen.getAllByRole('textbox');
        expect(contentEditableElements[0].innerText).toContain('First subtitle');
        expect(contentEditableElements[1].innerText).toContain('Second subtitle');
    });

    it('can add a subtitle', async () => {

        render(
            <SubtitlesEditor
                subtitles={[]}
                onAddSubtitle={mockOnAddSubtitle}
                addSubtitleButton={true}
            />
        );

        const addButton = screen.getByText('Add a subtitle.');
        fireEvent.click(addButton);

        await waitFor(() => expect(mockOnAddSubtitle).toHaveBeenCalledTimes(1));

        const subtitleElements = screen.getAllByText("");
        expect(subtitleElements.length).toBeGreaterThan(0);

        const editableElement = screen.getAllByRole('textbox')[0];
        expect(editableElement.textContent).toBe("");
    });

    it("can delete a subtitle", async () => {

        render(
            <SubtitlesEditor
                subtitles={subtitles}
                onChange={mockOnChange}
                onSave={mockOnSave}
                onAddSubtitle={mockOnAddSubtitle}
                downloadEnabled={mockDownloadEnabled}
                addSubtitleButton={true}
                deleteSubtitleButton={true}
            />
        );

        const contentEditableElements = screen.getAllByRole('textbox');
        expect(contentEditableElements[0].innerText).toContain('First subtitle!');
        expect(contentEditableElements[1].innerText).toContain('Second subtitle!');

        const deleteButtons = screen.getAllByText("Delete");
        fireEvent.click(deleteButtons[0]);

        const modal = await screen.findByText("Confirm deletion.");
        expect(modal).toBeInTheDocument();

        const modalDeleteButton = screen.getAllByText("Delete");
        fireEvent.click(modalDeleteButton[2]);

        const remainingSubtitles = screen.getAllByRole('textbox');
        expect(remainingSubtitles).toHaveLength(1);
    });

});
