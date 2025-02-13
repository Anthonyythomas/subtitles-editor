import React, {useCallback, useEffect, useRef, useState} from 'react';
import Dialog from "./components/Dialog";
import Contenteditable from "./components/Contenteditable";

export default function SubtitlesEditor({
                                            subtitles,
                                            onChange,
                                            editable = true,
                                            placeholderSubtitle = "Typing here...",
                                            addSubtitleButton = false,
                                            onAddSubtitle,
                                            deleteSubtitleButton = false,
                                            timingEditable = false,
                                            onSave,
                                            downloadEnabled = false,
                                            undoEnabled = true,
                                            redoEnabled = true,
                                            buttons = {
                                                addSubtitle: {text: "Add a subtitle.", className: ""},
                                                save: {text: "Save", className: ""},
                                                download: {text: "Download", className: ""},
                                                delete: {text: "Delete", className: ""},
                                                insertTimecode: {text: "Insert timecode", className: ""},
                                                undo: {text: "Undo", className: ""},
                                                redo: {text: "Redo", className: ""},
                                            },
                                            undoButton,
                                            redoButton,
                                        }) {

    const [editedSubtitles, setEditedSubtitles] = useState(subtitles);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [subtitleToDelete, setSubtitleToDelete] = useState(null);
    const [notification, setNotification] = useState('');
    const [subtitlesHistory, setSubtitlesHistory] = useState(() =>
        subtitles.map(() => ({history: [], index: -1}))
    );

    const fileInputRef = useRef(null);

    const defaultButtonClass = "px-4 py-2 text-white rounded";

    const getButtonClass = useCallback((userClass) => {
        return userClass ? userClass : defaultButtonClass;
    }, []);

    const handleSubtitleChange = useCallback((index, field, value) => {
        setEditedSubtitles((prevSubtitles) => {
            const newSubtitles = [...prevSubtitles];
            newSubtitles[index] = {...newSubtitles[index], [field]: value};
            saveHistory(index, newSubtitles);
            onChange?.(newSubtitles);
            return newSubtitles;
        });
    }, [onChange]);

    const saveHistory = useCallback((index, newSubtitles) => {
        setSubtitlesHistory((prevHistory) => {
            const updatedHistory = [...prevHistory];
            if (!updatedHistory[index]) {
                updatedHistory[index] = {history: [], index: -1};
            }
            updatedHistory[index].history = [
                ...updatedHistory[index].history.slice(0, updatedHistory[index].index + 1),
                newSubtitles[index],
            ];
            updatedHistory[index].index += 1;
            return updatedHistory;
        });
    }, []);

    const handleHistoryNavigation = useCallback((index, direction) => {
        setSubtitlesHistory((prevHistory) => {
            const updatedHistory = [...prevHistory];
            const subtitleHistory = updatedHistory[index];

            if (!subtitleHistory) return prevHistory;

            const newIndex = subtitleHistory.index + direction;
            if (newIndex >= 0 && newIndex < subtitleHistory.history.length) {
                setEditedSubtitles((prev) => {
                    const updatedSubtitles = [...prev];
                    updatedSubtitles[index] = subtitleHistory.history[newIndex];
                    return updatedSubtitles;
                });
                subtitleHistory.index = newIndex;
            }

            return updatedHistory;
        });
    }, []);

    const handleAddSubtitle = () => {
        const lastSubtitle = editedSubtitles[editedSubtitles.length - 1] || {};
        const newSubtitle = {text: "", start: lastSubtitle.end || "", end: ""};

        setEditedSubtitles([...editedSubtitles, newSubtitle]);

        const newSubtitlesHistory = [...subtitlesHistory];

        if (!newSubtitlesHistory[editedSubtitles.length]) {
            newSubtitlesHistory.push({history: [], index: -1});
        }

        saveHistory(editedSubtitles.length, [...editedSubtitles, newSubtitle]);

        setSubtitlesHistory(newSubtitlesHistory);

        if (onAddSubtitle) onAddSubtitle(newSubtitle);
    };

    const handleSave = () => {
        if (onSave) {
            onSave(editedSubtitles);
            showNotification('Subtitles saved successfully.');
        }
    };

    const handleDeleteSubtitle = (index) => {
        setSubtitleToDelete(index);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        const newSubtitles = editedSubtitles.filter((_, i) => i !== subtitleToDelete);
        setEditedSubtitles(newSubtitles);
        saveHistory(subtitleToDelete, newSubtitles);
        setIsDialogOpen(false);
        setSubtitleToDelete(null);
        showNotification('Subtitle deleted.');
    };

    const cancelDelete = () => {
        setIsDialogOpen(false);
        setSubtitleToDelete(null);
    };

    const formatTime = (time = "") => {
        const parts = time.split(":");
        if (parts.length === 3) {
            const [seconds, milliseconds = "000"] = parts[2].split(".");
            return `${parts[0]}:${parts[1]}:${seconds}.${milliseconds.padEnd(3, "0")}`;
        }
        return "00:00:00.000";
    };

    const insertTimecode = (index) => {
        setEditedSubtitles((prev) => {
            const updatedSubtitles = [...prev];
            const subtitle = updatedSubtitles[index];
            const timecode = `\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}`;
            updatedSubtitles[index] = {...subtitle, text: `${subtitle.text}\n${timecode}`};
            return updatedSubtitles;
        });
    };

    const handleDownload = () => {
        if (!downloadEnabled) return;

        editedSubtitles.forEach((subtitle, index) => {
            let subtitleText = `${subtitle.text}\n\n`;

            const blob = new Blob([subtitleText], {type: 'text/plain'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `subtitle_${index + 1}.vtt`;
            link.click();
        });
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const handleFileUpload = (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = reader.result;
            addContentToSubtitle(index, fileContent);
        };
        reader.readAsText(file);

        event.target.value = null;
    };

    const addContentToSubtitle = (index, content) => {
        const newSubtitles = [...editedSubtitles];

        if (newSubtitles[index]) {
            newSubtitles[index] = {...newSubtitles[index], text: newSubtitles[index].text + content};
            setEditedSubtitles(newSubtitles);
            if (onChange) onChange(newSubtitles);
            showNotification("Content of the file added to the subtitle.");
        } else {
            console.error("Subtitle not found at index.", index);
        }
    };

    useEffect(() => {
        if (!Array.isArray(subtitles)) {
            console.error("Subtitles must be an array.");
            return;
        }

        const validSubtitles = subtitles.map((subtitle) => ({
            text: subtitle.text || "",
            start: subtitle.start || "",
            end: subtitle.end || "",
        }));

        setEditedSubtitles(validSubtitles);
    }, [subtitles]);

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-4 flex justify-between">
                <div>
                    {notification && <div className="text-green-600">{notification}</div>}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {editedSubtitles.map((subtitle, index) => (
                    <div key={index} className="mb-3 p-3 border rounded bg-white">
                        {timingEditable && (
                            <div className="flex space-x-2 mb-2 items-center">
                                <input
                                    type="time"
                                    step="1"
                                    className="p-2 border rounded"
                                    value={subtitle.start || "00:00:00"}
                                    onChange={(e) => handleSubtitleChange(index, 'start', e.target.value)}
                                    disabled={!timingEditable}
                                />
                                <input
                                    type="time"
                                    step="1"
                                    className="p-2 border rounded"
                                    value={subtitle.end || "00:00:00"}
                                    onChange={(e) => handleSubtitleChange(index, 'end', e.target.value)}
                                    disabled={!timingEditable}
                                />
                                <button
                                    onClick={() => insertTimecode(index)}
                                    className="px-3 py-1 bg-gray-500 text-white rounded"
                                >
                                    {buttons.insertTimecode.text}
                                </button>
                            </div>
                        )}

                        {subtitle && (
                            <Contenteditable
                                className={`editor w-full min-h-[400px] max-h-[400px] p-2 border rounded bg-white overflow-y-auto`}
                                value={subtitle.text}
                                onChange={(newValue) => handleSubtitleChange(index, "text", newValue)}
                                placeholder={placeholderSubtitle}
                            />
                        )}

                        {deleteSubtitleButton && editable && (
                            <div className="flex justify-between mt-2">
                                <button
                                    onClick={() => handleDeleteSubtitle(index)}
                                    className={getButtonClass(buttons.delete.className) + " bg-red-500"}
                                >
                                    {buttons.delete.text}
                                </button>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className={getButtonClass(buttons.insertTimecode.className) + " bg-gray-500"}
                                >
                                    Upload subtitles
                                </button>
                                <input
                                    key={index}
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".srt, .vtt"
                                    onChange={(event) => handleFileUpload(index, event)}
                                    className="hidden"
                                />
                                <div className="flex space-x-4">
                                    {undoEnabled && undoButton && (
                                        <div
                                            onClick={() => handleHistoryNavigation(index, -1)}
                                            className={buttons.undo.className}
                                        >
                                            {undoButton}
                                        </div>
                                    )}
                                    {redoEnabled && redoButton && (
                                        <div
                                            onClick={() => handleHistoryNavigation(index, 1)}
                                            className={buttons.redo.className}
                                        >
                                            {redoButton}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                {addSubtitleButton && editable && (
                    <button
                        onClick={handleAddSubtitle}
                        className={getButtonClass(buttons.addSubtitle.className) + " bg-blue-500"}
                    >
                        {buttons.addSubtitle.text}
                    </button>
                )}
                {onSave && (
                    <button
                        onClick={handleSave}
                        className={getButtonClass(buttons.save.className) + " bg-green-500"}
                    >
                        {buttons.save.text}
                    </button>
                )}
                {downloadEnabled && (
                    <button
                        onClick={handleDownload}
                        className={getButtonClass(buttons.download.className) + " bg-yellow-500"}
                    >
                        {buttons.download.text}
                    </button>
                )}
            </div>

            {isDialogOpen && (
                <Dialog
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}
