
# SubtitlesEditor

`SubtitlesEditor` is a React component that allows you to edit, manage, and save subtitles in a video project. It provides a user-friendly interface for modifying subtitle text, adjusting timings, adding new subtitles, and downloading them in various formats. This highly customizable component includes features such as undo, reset, and file-based content import.

## Installation

```bash
npm install subtitles-editor
```

## Usage

Here is an example of how to use `SubtitlesEditor` with all available options. Make sure to provide the correct properties for each feature.

```javascript
import React, { useState } from 'react';
import SubtitlesEditor from 'subtitles-editor';

const ExampleComponent = () => {
  const [subtitles, setSubtitles] = useState([
    { text: "Hello World!" },
    { text: "Welcome to SubtitlesEditor!" }
  ]);

  const handleChange = (newSubtitles) => {
    setSubtitles(newSubtitles);
  };

  const handleSave = (subtitles) => {
    console.log("Saving subtitles:", subtitles);
  };

  const handleAddSubtitle = () => {
    const newSubtitle = { text: "New subtitle text." };
    setSubtitles([...subtitles, newSubtitle]);
  };

  const handleDeleteSubtitle = (index) => {
    const newSubtitles = subtitles.filter((_, i) => i !== index);
    setSubtitles(newSubtitles);
  };

  return (
    <SubtitlesEditor
      subtitles={subtitles}
      onChange={handleChange}
      editable={true}
      placeholderSubtitle="Type your subtitle here..."
      addSubtitleButton={true}
      onAddSubtitle={handleAddSubtitle}
      deleteSubtitleButton={true}
      timingEditable={true}
      onSave={handleSave}
      downloadEnabled={true}
      undoEnabled={true}
      redoEnabled={true}
      buttons={{
        addSubtitle: { text: "Add a subtitle.", className: "bg-blue-500" },
        save: { text: "Save subtitles", className: "bg-green-500" },
        download: { text: "Download subtitles", className: "bg-yellow-500" },
        delete: { text: "Delete subtitle", className: "bg-red-500" },
        insertTimecode: { text: "Insert timecode", className: "bg-gray-500" },
        undo: { text: "Undo", className: "bg-purple-500" },
        redo: { text: "Redo", className: "bg-orange-500" },
      }}
      undoButton={<div>Undo Custom</div>}
      redoButton={<div>Redo Custom</div>}
    />
  );
};
```

## Props Table

| Prop | Type | Description                                       |
|------|------|---------------------------------------------------|
| subtitles | Array | List of subtitles to display.                     |
| onChange | Function | Callback function to handle changes.              |
| editable | Boolean | Allows subtitles to be editable.                  |
| placeholderSubtitle | String | Default text in the editor.                       |
| addSubtitleButton | Boolean | Shows or hides the "Add Subtitle" button.         |
| onAddSubtitle | Function | Callback function triggered when a subtitle is added. |
| deleteSubtitleButton | Boolean | Shows or hides the "Delete Subtitle" button". |
| timingEditable | Boolean | Enables subtitle timing adjustments.    |
| onSave | Function | Fonction Callback function to save subtitles. |
| downloadEnabled | Boolean | Enables subtitle downloading.            |
| undoEnabled | Boolean | Enables undo functionality.               |
| redoEnabled | Boolean | Enables redo functionality.     |
| buttons | Object | Custom text and styles for buttons.        |
| undoButton | ReactNode | Custom component for the "Undo" button.     |
| redoButton | ReactNode | Custom component for the "Redo" button.     |


## Propriétés

### `subtitles` (array)
- **Description** : List of subtitles to display. Each subtitle is an object with a `text` property (subtitle text) and optionally `start` and `end` properties (subtitle timings).
- **Example** :
  ```javascript
  [
    { text: "Hello World!", start: "00:00:01", end: "00:00:05" },
    { text: "Welcome to SubtitlesEditor!", start: "00:00:06", end: "00:00:10" }
  ]
  ```

### `onChange` (function)
- **Description** : Callback function triggered whenever the subtitles are modified.
- **Example** :
  ```javascript
  const handleChange = (newSubtitles) => {
    console.log(newSubtitles);
  };
  ```

### `editable` (boolean)
- **Description** : Allows subtitles to be editable or not. Default is `true`.
- **Example** :
  ```javascript
  editable={true}
  ```

### `placeholderSubtitle` (string)
- **Description** : Default text displayed in the subtitle input field when empty. Default is "Typing here...".
- **Example** :
  ```javascript
  placeholderSubtitle="Type your subtitle here..."
  ```

### `addSubtitleButton` (boolean)
- **Description** : If enabled, displays a button to add subtitles. Default is `false`.
- **Example** :
  ```javascript
  addSubtitleButton={true}
  ```

### `onAddSubtitle` (function)
- **Description** : Function called when a subtitle is added.
- **Example** :
  ```javascript
  const handleAddSubtitle = () => {
    setSubtitles([...subtitles, { text: "New subtitle text." }]);
  };
  ```

### `deleteSubtitleButton` (boolean)
- **Description** : If enabled, displays a button to delete a subtitle. Default is `false`.
- **Example** :
  ```javascript
  deleteSubtitleButton={true}
  ```

### `timingEditable` (boolean)
- **Description** : Allows enabling or disabling subtitle timing editing. Default is `false`.
- **Example** :
  ```javascript
  timingEditable={true}
  ```

### `onSave` (function)
- **Description** : Callback function triggered when subtitles are saved.
- **Example** :
  ```javascript
  const handleSave = (subtitles) => {
    console.log("Saving subtitles:", subtitles);
  };
  ```

### `downloadEnabled` (boolean)
- **Description** : Allows downloading subtitles in `.vtt` format. Default is `false`.
- **Example** :
  ```javascript
  downloadEnabled={true}
  ```

### `undoEnabled` (boolean)
- **Description** : Enables the undo functionality for modifications. Default is `true`.
- **Example** :
  ```javascript
  undoEnabled={true}
  ```

### `redoEnabled` (boolean)
- **Description** : Enables the redo functionality for modifications. Default is `true`.
- **Example** :
  ```javascript
  redoEnabled={true}
  ```

### `buttons` (object)
- **Description** : Allows customization of buttons. You can define the text and CSS class for each button.
- **Example** :
  ```javascript
  buttons={{
    addSubtitle: { text: "Add a subtitle.", className: "bg-blue-500" },
    save: { text: "Save subtitles", className: "bg-green-500" },
    download: { text: "Download subtitles", className: "bg-yellow-500" },
    delete: { text: "Delete subtitle", className: "bg-red-500" },
    insertTimecode: { text: "Insert timecode", className: "bg-gray-500" },
    undo: { text: "Undo", className: "bg-purple-500" },
    redo: { text: "Redo", className: "bg-orange-500" }
  }}
  ```

### `undoButton` (ReactNode)
- **Description** : Custom component for the "Undo" button. If defined, this component will replace the default button.
- **Example** :
  ```javascript
  undoButton={<div>Undo Custom</div>}
  ```

### `redoButton` (ReactNode)
- **Description** : Custom component for the "Redo" button. If defined, this component will replace the default button.
- **Example** :
  ```javascript
  redoButton={<div>Redo Custom</div>}
  ```

## Fonctionnalités supplémentaires
- **Subtitle history management:** Undo or redo changes for each subtitle individually.
- **Automatic timecode insertion:** Inserts subtitle timecodes into the text.
- **Subtitle download:** Downloads subtitles as a `.vtt` file
- **File upload:** Add content from `.srt` or `.vtt` files.


## 🤝 Contributing

Thank you for your interest in contributing to `SubtitlesEditor`! 🚀 Here's how you can get started:

### 🛠 Setting up the project locally

1. **Fork** this repository and clone it locally:
   ```bash
   git clone https://github.com/your-username/subtitles-editor.git
   ```
2. **Navigate** to the project folder:
   ```bash
   cd subtitles-editor
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development environment**:
   ```bash
   npm run dev
   ```

### 🚀 How to contribute

1. **Create a branch for your feature or bug fix**:
   ```bash
   git checkout -b feature/add-new-functionality
   ```
2. **Make your changes and test them**.
3. **Commit your changes with a meaningful message**:
   ```bash
   git commit -m "✨ Added new functionality X"
   ```
4. **Push your branch**:
   ```bash
   git push origin feature/add-new-functionality
   ```
5. **Open a Pull Request (PR) on GitHub**. 🎉

### ✅ Code style & best practices

- Follow naming conventions (`camelCase` for variables, `PascalCase` for React components).
- Ensure all tests pass before submitting a PR:
  ```bash
  npm test
  ```

### 🛠 Reporting Issues

If you find a bug or have an idea for improvement, please open an **issue** on GitHub! 🐛✨

Thank you for your contributions! 💖

## 📜 License
MIT License