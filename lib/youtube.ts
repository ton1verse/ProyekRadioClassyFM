export type EmbedType = 'youtube' | 'spotify' | 'iframe' | 'unknown';

export const getEmbedInfo = (input: string): { url: string; type: EmbedType } => {
    if (!input) return { url: '', type: 'unknown' };

    if (input.includes('<iframe') && input.includes('src="')) {
        const srcMatch = input.match(/src=["'](.*?)["']/);
        if (srcMatch && srcMatch[1]) {
            if (srcMatch[1].includes('spotify.com')) return { url: srcMatch[1], type: 'spotify' };

            return { url: srcMatch[1], type: 'iframe' };
        }
    }

    if (input.includes('spotify.com')) {
        let embedUrl = input;
        if (!input.includes('/embed/')) {
            embedUrl = input.replace('open.spotify.com/', 'open.spotify.com/embed/');
        }
        return { url: embedUrl, type: 'spotify' };
    }

    const ytRegExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|e\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?\"\'\s]+).*/;
    const ytMatch = input.match(ytRegExp);

    if (ytMatch && ytMatch[1].length === 11) {
        return { url: `https://www.youtube.com/embed/${ytMatch[1]}`, type: 'youtube' };
    }

    return { url: input, type: 'unknown' };
};

export const getYouTubeEmbedUrl = (url: string): string => {
    const info = getEmbedInfo(url);
    return info.url;
};
