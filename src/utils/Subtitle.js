class Subtitle {
    constructor(content = '') {
        this.content = content;
    }

    static convertSrtToVtt(srtContent) {
        let vttContent = "WEBVTT\n\n";
        let vttText = srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2 --> $3.$4');
        return vttContent + vttText.trim();
    }

    static convertVttToSrt(vttContent) {
        let srtContent = vttContent.replace(/^WEBVTT[\r\n]*\s*/g, "");

        let srtText = srtContent.replace(/(\d{2}:\d{2}:\d{2})\.(\d{3}) --> (\d{2}:\d{2}:\d{2})\.(\d{3})/g,
            (match, p1, p2, p3, p4) => {
                return `${p1}:${p2} --> ${p3}:${p4}`;
            });

        let srtWithNumbers = srtText.replace(/(?:\d{2}:\d{2}:\d{2}:\d{3}) --> /g, (match, index) => {
            let indexCount = 1;
            return `${indexCount++}\n`;
        });

        return srtWithNumbers.trim();
    }

    static removeHtml(text) {
        return text.replace(/<[^>]*>/g, '');
    }
}

export default Subtitle;
