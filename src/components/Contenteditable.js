import { useEffect, useRef } from "react";
import React from "react";

export default function ContentEditable({ className, value, onChange, placeholder }) {
    const contentEditableRef = useRef(null);

    useEffect(() => {
        if (contentEditableRef.current && contentEditableRef.current.innerText !== value) {
            contentEditableRef.current.innerText = value;
        }
    }, [value]);

    const handleInput = (event) => {
        const newValue = event.currentTarget.innerText.trim();
        if (newValue === '' || newValue === '<br>') {
            onChange('');
        } else {
            onChange(newValue);
        }
    };

    return (
        <div
            className={className}
            contentEditable
            ref={contentEditableRef}
            onInput={handleInput}
            placeholder={placeholder}
            role="textbox"
        />
    );
}
